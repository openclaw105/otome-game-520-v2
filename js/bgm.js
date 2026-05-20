/**
 * BGM 管理：优美纯音乐循环 · 淡入淡出 · 章节情绪切换
 * 音源：SoundHelix（CC 授权，见 assets/audio/CREDITS.txt）
 */
const BGM_AUDIO = {
  title: "assets/audio/bgm-title.mp3",
  story: "assets/audio/bgm-story.mp3",
  angst: "assets/audio/bgm-angst.mp3",
  ending: "assets/audio/bgm-ending.mp3",
};

const Bgm = (function () {
  const VOL_KEY = "xingguang_bgm_vol";
  const MUTE_KEY = "xingguang_bgm_mute";

  let currentId = null;
  let currentEl = null;
  let fading = false;
  let volume = 0.42;
  let enabled = true;
  let unlocked = false;

  const pool = {};

  function readPrefs() {
    try {
      const v = localStorage.getItem(VOL_KEY);
      if (v != null) volume = Math.max(0, Math.min(1, parseFloat(v) || 0.42));
      const m = localStorage.getItem(MUTE_KEY);
      if (m === "1") enabled = false;
    } catch (e) { /* ignore */ }
  }

  function savePrefs() {
    try {
      localStorage.setItem(VOL_KEY, String(volume));
      localStorage.setItem(MUTE_KEY, enabled ? "0" : "1");
    } catch (e) { /* ignore */ }
  }

  function getAudio(id) {
    if (!pool[id]) {
      const src = BGM_AUDIO[id];
      if (!src) return null;
      const a = new Audio(src);
      a.loop = id !== "ending";
      a.preload = "auto";
      a.volume = 0;
      pool[id] = a;
    }
    return pool[id];
  }

  function effectiveVol() {
    return enabled ? volume : 0;
  }

  function fadeTo(el, target, ms, done) {
    if (!el) {
      if (done) done();
      return;
    }
    const start = el.volume;
    const diff = target - start;
    if (Math.abs(diff) < 0.01 || ms <= 0) {
      el.volume = Math.max(0, Math.min(1, target));
      if (done) done();
      return;
    }
    const t0 = performance.now();
    function step(now) {
      const p = Math.min(1, (now - t0) / ms);
      el.volume = Math.max(0, Math.min(1, start + diff * p));
      if (p < 1) requestAnimationFrame(step);
      else if (done) done();
    }
    requestAnimationFrame(step);
  }

  function stopCurrent(ms, done) {
    if (!currentEl) {
      currentId = null;
      if (done) done();
      return;
    }
    const el = currentEl;
    fadeTo(el, 0, ms || 600, () => {
      el.pause();
      try {
        el.currentTime = 0;
      } catch (e) { /* ignore */ }
      if (currentEl === el) {
        currentEl = null;
        currentId = null;
      }
      if (done) done();
    });
  }

  function playId(id, fadeMs) {
    if (!unlocked || !id) return;
    const el = getAudio(id);
    if (!el) return;
    if (currentId === id && currentEl === el && !el.paused) {
      fadeTo(el, effectiveVol(), fadeMs || 400);
      return;
    }
    fading = true;
    stopCurrent(fadeMs || 700, () => {
      currentId = id;
      currentEl = el;
      el.volume = 0;
      const p = el.play();
      if (p && p.catch) {
        p.catch(() => {});
      }
      fadeTo(el, effectiveVol(), fadeMs || 900, () => {
        fading = false;
      });
    });
  }

  function init() {
    readPrefs();
    Object.keys(BGM_AUDIO).forEach((id) => getAudio(id));
  }

  function unlock() {
    if (unlocked) return;
    unlocked = true;
    Object.keys(pool).forEach((id) => {
      const a = pool[id];
      if (a) {
        const p = a.play();
        if (p && p.catch) p.catch(() => {});
        a.pause();
        try {
          a.currentTime = 0;
        } catch (e) { /* ignore */ }
        a.volume = 0;
      }
    });
  }

  function playForScreen(screen) {
    if (screen === "title") playId("title", 1000);
    else if (screen === "ending") playId("ending", 800);
    else if (screen === "game") playId("story", 900);
  }

  function playMood(mood) {
    if (mood === "angst") playId("angst", 1200);
    else if (mood === "ending") playId("ending", 1000);
    else playId("story", 1000);
  }

  function moodFromChapter(chapter) {
    if (!chapter) return "story";
    if (chapter === "epilogue" || chapter === "ch8") return "calm";
    if (/ch6|ch7/.test(chapter)) return "angst";
    return "story";
  }

  function setVolume(v) {
    volume = Math.max(0, Math.min(1, v));
    savePrefs();
    if (currentEl && enabled) fadeTo(currentEl, volume, 300);
    else if (currentEl) fadeTo(currentEl, 0, 200);
  }

  function toggle() {
    enabled = !enabled;
    savePrefs();
    if (!enabled && currentEl) fadeTo(currentEl, 0, 400);
    else if (enabled && currentEl) fadeTo(currentEl, volume, 500);
    return enabled;
  }

  function isEnabled() {
    return enabled;
  }

  function getVolume() {
    return volume;
  }

  return {
    init,
    unlock,
    playForScreen,
    playMood,
    moodFromChapter,
    setVolume,
    toggle,
    isEnabled,
    getVolume,
  };
})();
