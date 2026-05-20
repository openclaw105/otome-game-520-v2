(function () {
  const SAVE_KEY = "xingguang_otome_v7";

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

  function showScreen(name) {
    Object.values(screens).forEach((el) => el.classList.remove("active"));
    screens[name].classList.add("active");
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
    if (/朱一龙/.test(speaker)) return "zhuyilong";
    if (/杨幂/.test(speaker)) return "yangmi";
    if (/白敬亭/.test(speaker)) return "baijingting";
    if (/倪妮/.test(speaker)) return "nini";
    if (/李现/.test(speaker)) return "lixian";
    if (/杨紫/.test(speaker)) return "yangzi";
    if (/邓超/.test(speaker)) return "dengchao";
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
    if (/房东|刘姐|刘婉|朱一龙|杨幂|白敬亭|倪妮|李现|杨紫|邓超|薇薇|闺蜜|老板|同事|娱记|记者|经纪人|粉丝|旁白|小周|弹幕/.test(speaker)) return "npc";
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

  function showChoices(node) {
    hideChapterCard();
    state.waitingChoice = true;
    state.lineReady = false;
    ui.choices.classList.remove("hidden");
    ui.choices.innerHTML = "";
    setHint("请选择对话框上方选项");
    ui.text.textContent = node.prompt || "请选择：";

    node.options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.textContent = opt.text;
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        applyEffects(opt.effects);
        if (opt.flag) state.flags[opt.flag] = true;
        if (opt.flags) opt.flags.forEach((f) => { state.flags[f] = true; });
        ui.choices.classList.add("hidden");
        state.waitingChoice = false;
        state.index++;
        saveGame();
        advance();
      });
      ui.choices.appendChild(btn);
    });
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

  function showLine(node) {
    hideChapterCard();
    if (node.chapter) ui.chapter.textContent = getChapterName(node.chapter);
    if (node.bg) setBg(node.bg);
    setSprites(inferSprites(node.speaker, node.show), node.speaker);

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
      if (node.chapter) ui.chapter.textContent = getChapterName(node.chapter);
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
    if (state.waitingChoice) return;
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
    state.typing = false;
    state.lineReady = false;
    updateHud();
    setBg("office");
    setSprites("heroine", "isapara");
    ui.choices.classList.add("hidden");
    hideChapterCard();
    showScreen("game");
    syncLayoutVars();
    advance();
  }

  function continueGame() {
    if (!loadGame()) return startNew();
    updateHud();
    ui.choices.classList.add("hidden");
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
    clearSave();
    startNew();
  });

  $("btn-continue").addEventListener("click", continueGame);
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
    if (!ui.titleBg || typeof ASSETS === "undefined" || !ASSETS.bg.title) return;
    ui.titleBg.style.backgroundImage = "url('" + ASSETS.bg.title + "')";
    ui.titleBg.style.backgroundSize = "cover";
    ui.titleBg.style.backgroundPosition = "center";
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
