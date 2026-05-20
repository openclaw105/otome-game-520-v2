(function () {
  const SAVE_KEY = "xingguang_otome_v10";

  const state = {
    index: 0,
    affection: 0,
    trust: 0,
    stress: 0,
    rumor: 0,
    flags: {},
    typing: false,
    waitingChoice: false,
    lineReady: false,
    choiceFxPlaying: false,
  };

  const $ = (id) => document.getElementById(id);

  const screens = {
    title: $("screen-title"),
    game: $("screen-game"),
    ending: $("screen-ending"),
  };

  const ui = {
    chapter: $("chapter-label"),
    affection: $("stat-affection"),
    trust: $("stat-trust"),
    stress: $("stat-stress"),
    rumor: $("stat-rumor"),
    bg: $("bg-layer"),
    speaker: $("speaker-name"),
    text: $("dialogue-text"),
    choices: $("choices-panel"),
    chapterCard: $("chapter-card"),
    dialogueBox: $("dialogue-box"),
    spriteHeroine: $("sprite-heroine"),
    spriteHero: $("sprite-hero"),
    spriteNpc: $("sprite-npc"),
    spriteNpcImg: $("sprite-npc-img"),
    titleBg: $("title-bg-layer"),
    endingTitle: $("ending-title"),
    endingText: $("ending-text"),
    endingStats: $("ending-stats"),
    hint: $("game-hint"),
    choiceFlash: $("choice-flash"),
  };

  function showLoadError(msg) {
    const err = $("load-error");
    if (err) {
      err.textContent = msg;
      err.classList.remove("hidden");
    } else {
      alert(msg);
    }
  }

  function hideChapterCard() {
    if (ui.chapterCard) {
      ui.chapterCard.classList.add("hidden");
      ui.chapterCard.innerHTML = "";
    }
  }

  function showChapterCard(node) {
    if (!ui.chapterCard) return;
    const title = node.title || getChapterName(node.chapter);
    const sub = node.text || "";
    ui.chapterCard.innerHTML =
      '<div class="chapter-card-inner"><h3>' + title + "</h3><p>" + sub + "</p></div>";
    ui.chapterCard.classList.remove("hidden");
  }

  function ensureBgmUnlock() {
    if (typeof Bgm !== "undefined") Bgm.unlock();
  }

  function updateBgmHudBtn() {
    const btn = $("btn-bgm");
    if (!btn || typeof Bgm === "undefined") return;
    btn.classList.toggle("hud-bgm--off", !Bgm.isEnabled());
    btn.setAttribute("aria-pressed", Bgm.isEnabled() ? "true" : "false");
  }

  function updateBgmForChapter(chapter) {
    if (typeof Bgm === "undefined") return;
    Bgm.playMood(Bgm.moodFromChapter(chapter));
  }

  function showScreen(name) {
    Object.values(screens).forEach((el) => el.classList.remove("active"));
    screens[name].classList.add("active");
    if (typeof Bgm !== "undefined") Bgm.playForScreen(name);
  }

  function clampStat(v) {
    return Math.max(0, Math.min(99, v));
  }

  function applyEffects(effects) {
    if (!effects) return;
    ["affection", "trust", "stress", "rumor"].forEach((key) => {
      if (effects[key] != null) {
        state[key] = clampStat(state[key] + effects[key]);
      }
    });
    updateHud();
    saveGame();
  }

  function updateHud() {
    ui.affection.textContent = state.affection;
    ui.trust.textContent = state.trust;
    ui.stress.textContent = state.stress;
    ui.rumor.textContent = state.rumor;
  }

  function setHint(text) {
    if (ui.hint) ui.hint.textContent = text;
  }

  /** 用实际对话框高度同步 --dialogue-h，供立绘/布局参考 */
  function syncLayoutVars() {
    if (!ui.dialogueBox || !screens.game.classList.contains("active")) return;
    requestAnimationFrame(() => {
      const h = ui.dialogueBox.getBoundingClientRect().height;
      if (h > 0) {
        document.documentElement.style.setProperty("--dialogue-h", Math.round(h) + "px");
      }
    });
  }

  function setBg(bg) {
    const key = bg || "office";
    const url = (typeof ASSETS !== "undefined" && ASSETS.bg[key]) || "";
    ui.bg.className = "bg-layer bg-" + key;
    if (url) {
      ui.bg.style.backgroundImage = "url('" + url + "')";
    }
  }

  function inferNpcId(speaker) {
    if (!speaker) return null;
    if (/房东/.test(speaker)) return "landlord";
    if (/刘姐|刘婉|表姐/.test(speaker)) return "curator";
    if (/张艺兴/.test(speaker)) return "zhangyixing";
    if (/宋威龙/.test(speaker)) return "songweilong";
    if (/龚俊/.test(speaker)) return "gongjun";
    if (/杨幂/.test(speaker)) return "yangmi";
    if (/倪妮/.test(speaker)) return "nini";
    if (/杨紫/.test(speaker)) return "yangzi";
    if (/薇薇|闺蜜/.test(speaker)) return "bestie";
    if (/老板/.test(speaker)) return "boss";
    if (/同事|小周/.test(speaker)) return "colleague";
    if (/粉丝|弹幕/.test(speaker)) return "fan";
    if (/娱记|记者|直播/.test(speaker)) return "reporter";
    if (/经纪人/.test(speaker)) return "agent";
    return "colleague";
  }

  function setSprites(show, speaker) {
    const npcId = show === "npc" ? inferNpcId(speaker) : null;

    const showH = show === "heroine" || show === "both";
    const showHero = show === "hero" || show === "both";
    ui.spriteHeroine.classList.toggle("hidden", !showH);
    ui.spriteHeroine.classList.toggle("active", showH);
    ui.spriteHero.classList.toggle("hidden", !showHero);
    ui.spriteHero.classList.toggle("active", showHero);

    if (ui.spriteNpc) {
      const showNpc = show === "npc";
      ui.spriteNpc.classList.toggle("hidden", !showNpc);
      ui.spriteNpc.classList.toggle("active", showNpc);
      ui.spriteNpc.classList.toggle("sprite-npc--bestie", showNpc && npcId === "bestie");
      if (showNpc && ui.spriteNpcImg && typeof ASSETS !== "undefined") {
        const src = ASSETS.npc[npcId] || ASSETS.npc.default;
        ui.spriteNpcImg.src = src;
        ui.spriteNpcImg.alt = speaker || "路人";
      }
    }
  }

  function inferSprites(speaker, explicit) {
    if (explicit === "npc") return "npc";
    if (explicit === "heroine" || explicit === "hero" || explicit === "both" || explicit === "none") {
      if (explicit === "none" && speaker && inferNpcId(speaker)) return "npc";
      return explicit;
    }
    if (!speaker) return "heroine";
    if (/肖战|战哥|X\.Z/i.test(speaker)) return "hero";
    if (/isapara/i.test(speaker)) return "heroine";
    if (/房东|刘姐|刘婉|张艺兴|宋威龙|龚俊|杨幂|倪妮|杨紫|薇薇|闺蜜|老板|同事|娱记|记者|经纪人|粉丝|旁白|小周|弹幕/.test(speaker)) return "npc";
    return "heroine";
  }

  function getChapterName(id) {
    const ch = STORY.chapters.find((c) => c.id === id);
    return ch ? ch.name : "进行中";
  }

  function nodeVisible(node) {
    if (node.needFlag && !state.flags[node.needFlag]) return false;
    if (node.needFlags && !node.needFlags.every((f) => state.flags[f])) return false;
    if (node.blockFlag && state.flags[node.blockFlag]) return false;
    if (node.blockFlags && node.blockFlags.some((f) => state.flags[f])) return false;
    if (node.minAffection != null && state.affection < node.minAffection) return false;
    if (node.minTrust != null && state.trust < node.minTrust) return false;
    if (node.maxStress != null && state.stress > node.maxStress) return false;
    if (node.minStress != null && state.stress < node.minStress) return false;
    if (node.minRumor != null && state.rumor < node.minRumor) return false;
    return true;
  }

  function findNextIndex(from) {
    let i = from;
    while (i < STORY.script.length) {
      const node = STORY.script[i];
      if (node.type === "ending") return i;
      if (nodeVisible(node)) return i;
      i++;
    }
    return i;
  }

  function cancelTyping() {
    const node = STORY.script[state.index];
    if (node && node.text) {
      state.typing = false;
      ui.text.innerHTML = node.text + '<span class="cursor"></span>';
      state.lineReady = true;
      setHint("点击继续 ▼");
    }
  }

  function typeText(full, done) {
    state.typing = true;
    state.lineReady = false;
    setHint("点击跳过打字 ▼");
    ui.text.innerHTML = "";
    let i = 0;
    const speed = 24;

    function tick() {
      if (!state.typing) return;
      if (i < full.length) {
        ui.text.textContent = full.slice(0, i + 1);
        i++;
        setTimeout(tick, speed);
      } else {
        ui.text.innerHTML = full + '<span class="cursor"></span>';
        state.typing = false;
        state.lineReady = true;
        setHint("点击继续 ▼");
        if (done) done();
      }
    }
    tick();
  }

  function saveGame() {
    try {
      localStorage.setItem(
        SAVE_KEY,
        JSON.stringify({
          index: state.index,
          affection: state.affection,
          trust: state.trust,
          stress: state.stress,
          rumor: state.rumor,
          flags: state.flags,
        })
      );
      $("btn-continue").classList.remove("hidden");
    } catch (_) {}
  }

  function loadGame() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return false;
      const data = JSON.parse(raw);
      state.index = data.index || 0;
      state.affection = data.affection || 0;
      state.trust = data.trust || 0;
      state.stress = data.stress || 0;
      state.rumor = data.rumor || 0;
      state.flags = data.flags || {};
      return true;
    } catch (_) {
      return false;
    }
  }

  function clearSave() {
    localStorage.removeItem(SAVE_KEY);
    $("btn-continue").classList.add("hidden");
  }

  const HIGH_ENERGY_FLAGS = new Set([
    "route_zyx_lock", "route_swl_lock", "route_xz_lock", "route_alone",
    "love_ok", "love_wait", "love_doubt",
    "go_public", "stay_secret", "pause_meet",
    "angst_block", "angst_trust", "hurt_self", "call_him",
    "go_see_him", "reject_gift", "wait_apology",
    "he_hand", "he_speech", "he_kiss",
    "zyx_confess", "swl_confess", "zyx_reject", "swl_reject",
    "vivi_gong_push", "ch2_confirm", "flirt_zyx", "flirt_swl",
  ]);

  function isHighEnergyOption(opt) {
    if (!opt) return false;
    if (opt.highEnergy) return true;
    if (opt.flag && HIGH_ENERGY_FLAGS.has(opt.flag)) return true;
    const e = opt.effects || {};
    if (Math.abs(e.affection || 0) >= 12) return true;
    if (Math.abs(e.trust || 0) >= 14) return true;
    if (Math.abs(e.stress || 0) >= 12) return true;
    if (Math.abs(e.rumor || 0) >= 12) return true;
    return false;
  }

  function isHighEnergyPanel(node) {
    if (!node || !node.options) return false;
    if (node.highEnergy || node.tier === "high") return true;
    return node.options.some(isHighEnergyOption);
  }

  const CHOICE_FX_THEMES = ["gold", "rose", "rain", "violet", "ember"];

  function choiceFxTheme(opt, index) {
    if (opt.fx && CHOICE_FX_THEMES.indexOf(opt.fx) >= 0) return opt.fx;
    return CHOICE_FX_THEMES[index % CHOICE_FX_THEMES.length];
  }

  function clearChoiceFx() {
    state.choiceFxPlaying = false;
    ui.choices.classList.remove("choices-panel--open");
    if (ui.choiceFlash) {
      ui.choiceFlash.className = "choice-flash hidden";
      ui.choiceFlash.classList.remove("choice-flash--play");
      CHOICE_FX_THEMES.forEach((t) => ui.choiceFlash.classList.remove("choice-flash--" + t, "choice-flash--key"));
    }
    if (ui.dialogueBox) {
      ui.dialogueBox.classList.remove("dialogue-box--choice-active");
    }
  }

  function fillChoiceParticles(flash, isKey) {
    const burst = flash.querySelector(".choice-flash-particles");
    const floats = flash.querySelector(".choice-flash-floats");
    const sparks = flash.querySelector(".choice-flash-sparks");
    if (burst) burst.innerHTML = "";
    if (floats) floats.innerHTML = "";
    if (sparks) sparks.innerHTML = "";

    const burstN = isKey ? 80 : 52;
    if (burst) {
      for (let i = 0; i < burstN; i++) {
        const p = document.createElement("span");
        const kind = i % 7 === 0 ? "streak" : i % 4 === 0 ? "star" : "dot";
        p.className = "cfp cfp--" + kind;
        const angle = Math.random() * Math.PI * 2;
        const dist = 28 + Math.random() * (isKey ? 52 : 38);
        p.style.setProperty("--tx", (Math.cos(angle) * dist).toFixed(2) + "vmin");
        p.style.setProperty("--ty", (Math.sin(angle) * dist).toFixed(2) + "vmin");
        p.style.setProperty("--dur", (0.5 + Math.random() * 0.85).toFixed(2) + "s");
        p.style.setProperty("--delay", (Math.random() * 0.2).toFixed(2) + "s");
        p.style.setProperty("--size", (3 + Math.random() * 8).toFixed(1) + "px");
        p.style.setProperty("--rot", Math.floor(Math.random() * 360) + "deg");
        burst.appendChild(p);
      }
    }

    const floatN = isKey ? 36 : 22;
    if (floats) {
      for (let i = 0; i < floatN; i++) {
        const p = document.createElement("span");
        p.className = "cff";
        p.style.setProperty("--x", (Math.random() * 100).toFixed(1) + "%");
        p.style.setProperty("--dur", (1.2 + Math.random() * 1.4).toFixed(2) + "s");
        p.style.setProperty("--delay", (Math.random() * 0.4).toFixed(2) + "s");
        p.style.setProperty("--size", (2 + Math.random() * 5).toFixed(1) + "px");
        p.style.setProperty("--drift", (-12 + Math.random() * 24).toFixed(1) + "px");
        floats.appendChild(p);
      }
    }

    const sparkN = isKey ? 42 : 28;
    if (sparks) {
      for (let i = 0; i < sparkN; i++) {
        const s = document.createElement("span");
        s.className = i % 5 === 0 ? "cfs cfs--cross" : "cfs";
        const angle = Math.random() * Math.PI * 2;
        const r = 8 + Math.random() * 38;
        s.style.setProperty("--x", (50 + Math.cos(angle) * r).toFixed(1) + "%");
        s.style.setProperty("--y", (48 + Math.sin(angle) * r).toFixed(1) + "%");
        s.style.setProperty("--delay", (Math.random() * 0.45).toFixed(2) + "s");
        s.style.setProperty("--size", (4 + Math.random() * 6).toFixed(1) + "px");
        sparks.appendChild(s);
      }
    }
  }

  /** 点击选项后播放闪光 + 粒子，结束后再推进剧情 */
  function playChoiceFlash(theme, isKey, onDone) {
    const flash = ui.choiceFlash;
    if (!flash) {
      onDone();
      return;
    }
    CHOICE_FX_THEMES.forEach((t) => flash.classList.remove("choice-flash--" + t));
    flash.classList.add("choice-flash--" + theme);
    flash.classList.toggle("choice-flash--key", !!isKey);
    flash.classList.remove("hidden", "choice-flash--play");
    fillChoiceParticles(flash, isKey);
    void flash.offsetWidth;
    flash.classList.add("choice-flash--play");
    if (screens.game) {
      screens.game.classList.add("screen--choice-impact");
    }

    const ms = isKey ? 1280 : 980;
    window.setTimeout(() => {
      flash.classList.remove("choice-flash--play");
      flash.classList.add("hidden");
      if (screens.game) screens.game.classList.remove("screen--choice-impact");
      onDone();
    }, ms);
  }

  function commitChoice(opt, theme, isKey, pickedBtn, listEl) {
    state.choiceFxPlaying = true;
    if (listEl) {
      listEl.querySelectorAll(".choice-btn").forEach((b) => {
        b.disabled = true;
      });
    }
    if (pickedBtn) pickedBtn.classList.add("choice-btn--picked");

    playChoiceFlash(theme, isKey, () => {
      applyEffects(opt.effects);
      if (opt.flag) state.flags[opt.flag] = true;
      if (opt.flags) opt.flags.forEach((f) => { state.flags[f] = true; });

      clearChoiceFx();
      ui.choices.classList.add("hidden");
      ui.choices.innerHTML = "";
      state.waitingChoice = false;
      state.index++;
      saveGame();
      advance();
    });
  }

  function showChoices(node) {
    hideChapterCard();
    state.waitingChoice = true;
    state.lineReady = false;
    state.choiceFxPlaying = false;

    clearChoiceFx();
    ui.choices.innerHTML = "";
    ui.choices.classList.remove("hidden");
    ui.choices.classList.add("choices-panel--open");

    setSprites(resolveShow(node) || "heroine", node.speaker || "isapara");

    if (ui.dialogueBox) {
      ui.dialogueBox.classList.add("dialogue-box--choice-active");
    }

    setHint("请选择上方选项");
    if (ui.text) {
      ui.text.textContent = node.prompt || "请选择：";
    }

    const list = document.createElement("div");
    list.className = "choices-list";

    node.options.forEach((opt, index) => {
      const theme = choiceFxTheme(opt, index);
      const isKey = isHighEnergyOption(opt);
      const btn = document.createElement("button");
      btn.className = "choice-btn choice-btn--plain" + (isKey ? " choice-btn--key-hint" : "");
      btn.type = "button";
      btn.dataset.fx = theme;

      const label = document.createElement("span");
      label.className = "choice-btn-label";
      label.textContent = opt.text;
      btn.appendChild(label);

      if (isKey) {
        const tag = document.createElement("span");
        tag.className = "choice-btn-tag-plain";
        tag.textContent = "关键";
        btn.appendChild(tag);
      }

      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (state.choiceFxPlaying) return;
        commitChoice(opt, theme, isKey, btn, list);
      });
      list.appendChild(btn);
    });

    ui.choices.appendChild(list);
    syncLayoutVars();
  }

  function resolveEnding() {
    const stats = {
      affection: state.affection,
      trust: state.trust,
      stress: state.stress,
      rumor: state.rumor,
      flags: state.flags,
    };
    let ending = ENDINGS.find((e) => e.condition(stats));
    if (!ending) ending = ENDINGS[ENDINGS.length - 1];

    ui.endingTitle.textContent = ending.title;
    ui.endingText.textContent = ending.text;
    ui.endingStats.textContent =
      "好感 " + stats.affection + " · 信任 " + stats.trust +
      " · 压力 " + stats.stress + " · 舆论 " + stats.rumor;

    const endingBg = $("ending-bg");
    if (endingBg) endingBg.className = "ending-bg " + (ending.bgClass || "");

    showScreen("ending");
    clearSave();
  }

  function resolveShow(node) {
    if (node.show != null && node.show !== "") return node.show;
    const sp = node.speaker || "";
    if (/旁白|系统|未送达/.test(sp)) return "none";
    if (/^isapara/i.test(sp)) return "heroine";
    if (/肖战|战哥|X\.Z/i.test(sp)) return "hero";
    if (/房东|刘姐|刘婉|张艺兴|宋威龙|龚俊|杨幂|倪妮|杨紫|薇薇|闺蜜|老板|同事|娱记|记者|经纪人|粉丝|弹幕/.test(sp)) {
      return "npc";
    }
    if (/^\？\？\？/.test(sp) || sp === "？？？") return "hero";
    return "heroine";
  }

  function showLine(node) {
    hideChapterCard();
    if (node.flag) state.flags[node.flag] = true;
    if (node.chapter) {
      ui.chapter.textContent = getChapterName(node.chapter);
      updateBgmForChapter(node.chapter);
    }
    if (node.bg) setBg(node.bg);
    setSprites(resolveShow(node), node.speaker);

    const speaker = node.speaker || "isapara";
    ui.speaker.textContent = speaker;
    typeText(node.text, () => {
      saveGame();
      syncLayoutVars();
    });
    syncLayoutVars();
  }

  function advance() {
    state.index = findNextIndex(state.index);

    if (state.index >= STORY.script.length) {
      resolveEnding();
      return;
    }

    const node = STORY.script[state.index];

    if (node.type === "ending") {
      resolveEnding();
      return;
    }

    if (node.type === "choice") {
      showChoices(node);
      return;
    }

    if (node.type === "chapter") {
      if (node.chapter) {
        ui.chapter.textContent = getChapterName(node.chapter);
        updateBgmForChapter(node.chapter);
      }
      showChapterCard(node);
      ui.speaker.textContent = "章节";
      ui.text.textContent = (node.title || "") + "\n" + (node.text || "");
      setSprites("none", node.speaker);
      setHint("点击「继续」进入本章 ▼");
      state.lineReady = true;
      state.typing = false;
      saveGame();
      return;
    }

    showLine(node);
  }

  function nextLine() {
    if (state.waitingChoice || state.choiceFxPlaying) return;
    if (state.typing) {
      cancelTyping();
      return;
    }
    if (!state.lineReady && STORY.script[state.index]?.type === "chapter") {
      state.lineReady = true;
    }
    if (!state.lineReady && STORY.script[state.index]?.type !== "chapter") return;

    hideChapterCard();
    state.index++;
    state.lineReady = false;
    advance();
  }

  function startNew() {
    state.index = 0;
    state.affection = 0;
    state.trust = 0;
    state.stress = 0;
    state.rumor = 0;
    state.flags = {};
    state.waitingChoice = false;
    state.choiceFxPlaying = false;
    state.typing = false;
    state.lineReady = false;
    updateHud();
    setBg("office");
    setSprites("heroine", "isapara");
    clearChoiceFx();
    ui.choices.classList.add("hidden");
    ui.choices.innerHTML = "";
    hideChapterCard();
    showScreen("game");
    syncLayoutVars();
    advance();
  }

  function continueGame() {
    if (!loadGame()) return startNew();
    updateHud();
    clearChoiceFx();
    ui.choices.classList.add("hidden");
    ui.choices.innerHTML = "";
    state.waitingChoice = false;
    state.typing = false;
    showScreen("game");

    const node = STORY.script[state.index];
    if (node && node.type === "choice") {
      showChoices(node);
      return;
    }
    state.lineReady = false;
    advance();
  }

  function restart() {
    clearSave();
    startNew();
  }

  $("btn-start").addEventListener("click", () => {
    ensureBgmUnlock();
    clearSave();
    startNew();
  });

  $("btn-continue").addEventListener("click", () => {
    ensureBgmUnlock();
    continueGame();
  });

  const btnBgm = $("btn-bgm");
  if (btnBgm) {
    btnBgm.addEventListener("click", (e) => {
      e.stopPropagation();
      ensureBgmUnlock();
      if (typeof Bgm !== "undefined") {
        Bgm.toggle();
        updateBgmHudBtn();
      }
    });
  }

  screens.title.addEventListener("click", () => {
    ensureBgmUnlock();
    if (typeof Bgm !== "undefined" && screens.title.classList.contains("active")) {
      Bgm.playForScreen("title");
      updateBgmHudBtn();
    }
  });
  $("btn-restart").addEventListener("click", restart);
  $("btn-next").addEventListener("click", (e) => {
    e.stopPropagation();
    nextLine();
  });

  document.addEventListener("keydown", (e) => {
    if (!screens.game.classList.contains("active")) return;
    if (e.code === "Space" || e.code === "Enter") {
      e.preventDefault();
      nextLine();
    }
  });

  if (ui.dialogueBox) {
    ui.dialogueBox.addEventListener("click", (e) => {
      if (e.target.closest("#btn-next")) return;
      if (e.target.closest(".choice-btn") || e.target.closest(".choices-panel")) return;
      nextLine();
    });
  }

  screens.game.addEventListener("click", (e) => {
    if (e.target.closest(".choice-btn") || e.target.closest(".choices-panel")) return;
    if (e.target.closest(".dialogue-box")) return;
    nextLine();
  });

  function initTitleBg() {
    if (!ui.titleBg || typeof ASSETS === "undefined") return;
    const url = ASSETS.bg.studio || ASSETS.bg.title;
    if (url) {
      ui.titleBg.style.backgroundImage = "url('" + url + "')";
      ui.titleBg.style.backgroundSize = "cover";
      ui.titleBg.style.backgroundPosition = "center 40%";
    }
    ui.titleBg.classList.add("title-bg-loaded");
  }

  function boot() {
    if (typeof STORY === "undefined" || !STORY.script || typeof ENDINGS === "undefined") {
      showLoadError("剧情文件加载失败。请确认 otome-game 文件夹完整，且 index.html 与 js/story.js 在同一目录下。");
      return;
    }
    if (typeof ASSETS === "undefined") {
      showLoadError("资源文件 assets.js 加载失败。");
      return;
    }
    initTitleBg();
    if (typeof Bgm !== "undefined") {
      Bgm.init();
      updateBgmHudBtn();
    }
    setBg("office");
    if (!$("btn-start")) return;
    if (loadGame()) {
      $("btn-continue").classList.remove("hidden");
    }
    window.addEventListener("resize", syncLayoutVars);
    if (typeof ResizeObserver !== "undefined" && ui.dialogueBox) {
      new ResizeObserver(syncLayoutVars).observe(ui.dialogueBox);
    }
  }

  boot();
})();
