/**
 * 多路线扩展：张艺兴 / 宋威龙可攻略 · 龚俊 × 薇薇支线
 * 在 story-expand.js 之后加载
 */
(function () {
  if (typeof STORY === "undefined" || !STORY.script) return;

  function insertBeforeChapter(chId, nodes) {
    const i = STORY.script.findIndex((n) => n.type === "chapter" && n.chapter === chId);
    if (i < 0) return;
    if (nodes.some((n) => n.chapter && STORY.script.some((x) => x.chapter === n.chapter && n.type === "chapter"))) {
      const dup = nodes.find((n) => n.type === "chapter");
      if (dup && STORY.script.some((x) => x.chapter === dup.chapter)) return;
    }
    STORY.script.splice(i, 0, ...nodes);
  }

  function insertAfterChapterFirstLine(chId, nodes) {
    const i = STORY.script.findIndex((n) => n.chapter === chId && (n.type === "chapter" || n.bg));
    if (i < 0) return;
    STORY.script.splice(i + 1, 0, ...nodes);
  }

  function hasChapter(id) {
    return STORY.chapters.some((c) => c.id === id);
  }

  function addChapter(ch, beforeId) {
    if (hasChapter(ch.id)) return;
    const idx = STORY.chapters.findIndex((c) => c.id === beforeId);
    if (idx >= 0) STORY.chapters.splice(idx, 0, ch);
    else STORY.chapters.push(ch);
  }

  addChapter({ id: "side_vivi", name: "支线 · 闺蜜与光轨" }, "ch6");
  addChapter({ id: "ch5r", name: "第五章后 · 心意分岔" }, "ch6");
  addChapter({ id: "ch_zyx", name: "隐藏章 · 和声与晨光" }, "epilogue");
  addChapter({ id: "ch_swl", name: "隐藏章 · 片场与速写" }, "epilogue");

  // —— 序章后：龚俊伏笔 ——
  insertAfterChapterFirstLine("prologue", [
    { chapter: "prologue", speaker: "薇薇", text: "【微信】薇薇：「下周时尚周缺个布展助理，包吃住！……听说嘉宾里有龚俊，我请你喝咖啡！」", show: "npc" },
    { chapter: "prologue", speaker: "isapara", text: "我回她三个省略号，却把时间记进了日历——薇薇的邀约，总比房租通知温柔一点。", show: "heroine" },
  ]);

  // —— 第一章：龚俊路过 ——
  insertAfterChapterFirstLine("ch1", [
    { chapter: "ch1", speaker: "薇薇", text: "【语音】薇薇：「姐妹！隔壁摄影棚今天拍龚俊，我偷拍到他看咱们楼道海报！……像在看你的雨。」", show: "npc" },
    { chapter: "ch1", speaker: "龚俊", text: "傍晚我下楼倒垃圾，电梯门开，戴口罩的高个男生扶住差点滚出去的颜料箱：「小心。……这雨画得会呼吸。」", show: "npc" },
    { chapter: "ch1", speaker: "isapara", text: "我想道谢，他已被人护送上保姆车。薇薇的消息立刻炸开：「！！是不是他！！」", show: "heroine" },
  ]);

  // —— 第二章后沙龙：攻略倾向选项（插入 ch2b 末，在 ch3 前）——
  const ch3Idx = STORY.script.findIndex((n) => n.type === "chapter" && n.chapter === "ch3");
  const salonFork = [
    { chapter: "ch2b", bg: "rooftop", speaker: "张艺兴", text: "露台风大，他把外套递给我：「战哥在应付投资人。……不想待的话，我带你去听 demo。」", show: "npc", minAffection: 12, blockFlag: "route_swl_lock" },
    { chapter: "ch2b", speaker: "宋威龙", text: "他举着手机里的草图：「这张雨我想学。……楼下有未拆封的画板，我帮你搬？」", show: "npc", minAffection: 12, blockFlag: "route_zyx_lock" },
    {
      type: "choice",
      chapter: "ch2b",
      prompt: "沙龙散场前，谁的邀请让你更心动？",
      minAffection: 12,
      options: [
        { text: "跟张艺兴去露台听 demo", effects: { affection: 4, trust: 10, stress: -3 }, flag: "flirt_zyx" },
        { text: "陪宋威龙在偏厅改构图", effects: { affection: 8, trust: 8, stress: -4 }, flag: "flirt_swl" },
        { text: "只等肖战一起离开", effects: { affection: 10, trust: 6, rumor: 4 }, flag: "lean_xz" },
      ],
    },
    { needFlag: "flirt_zyx", chapter: "ch2b", speaker: "张艺兴", text: "demo 只有钢琴与雨声。他闭眼说：「你画的是潮气，不是水滴。」那一刻，我听懂了一种不同的温柔。", show: "npc", minAffection: 12 },
    { needFlag: "flirt_swl", chapter: "ch2b", speaker: "宋威龙", text: "我们改了构图一小时。他话不多，却把每一道高光都记在本子上：「以后拍杂志，想请你当顾问。」", show: "npc", minAffection: 12 },
    { needFlag: "lean_xz", speaker: "肖战", text: "他出来时手里多了两杯热可可：「久等了。……下次不想应酬，就提前跟我说。」", show: "hero", minAffection: 12 },
  ];
  if (ch3Idx >= 0 && !STORY.script.some((n) => n.type === "choice" && n.prompt && n.prompt.indexOf("沙龙散场") >= 0)) {
    STORY.script.splice(ch3Idx, 0, ...salonFork);
  }

  // —— 第四章后录音棚：加深攻略 ——
  const ch5Idx = STORY.script.findIndex((n) => n.type === "chapter" && n.chapter === "ch5");
  const recordFork = [
    {
      type: "choice",
      chapter: "ch4b",
      prompt: "录音棚走廊，你想把下午交给谁？",
      minTrust: 18,
      options: [
        { text: "帮张艺兴试一段和声", effects: { affection: 5, trust: 12, stress: -2 }, flag: "date_zyx" },
        { text: "给宋威龙画一张肖像速写", effects: { affection: 10, trust: 10, stress: -3 }, flag: "date_swl" },
        { text: "进棚听肖战录完最后一轨", effects: { affection: 12, trust: 8, stress: 4 }, flag: "date_xz" },
      ],
    },
    { needFlag: "date_zyx", chapter: "ch4b", speaker: "张艺兴", text: "他教我听混响里的「雨声」。录到第三遍，他低声：「若你有一天想躲镜头，我的工作室永远有静音间。」", show: "npc", minTrust: 18 },
    { needFlag: "date_swl", chapter: "ch4b", speaker: "宋威龙", text: "速写完成时他耳根很热：「这张……可以只放在我钱包里吗？」我点头，像把秘密折进纸角。", show: "npc", minTrust: 18 },
    { needFlag: "date_xz", speaker: "肖战", text: "他录完出来，发梢还湿：「今天这首，是写给你的。……别告诉任何人，包括我经纪人。」", show: "hero", minTrust: 18 },
  ];
  if (ch5Idx >= 0 && !STORY.script.some((n) => n.type === "choice" && n.prompt && n.prompt.indexOf("录音棚走廊") >= 0)) {
    const ch4bEnd = STORY.script.findIndex((n) => n.type === "chapter" && n.chapter === "ch5");
    STORY.script.splice(ch4bEnd, 0, ...recordFork);
  }

  // —— 支线：薇薇 × 龚俊（第五章后、第六章前）——
  const sideBlock = [
    { type: "chapter", chapter: "side_vivi", title: "支线 · 闺蜜与光轨", text: "—— 薇薇策展《光轨》联展 · 两周后 ——", blockFlag: "skip_side_vivi" },
    { chapter: "side_vivi", bg: "gallery", speaker: "薇薇", text: "「布展最后一天！」薇薇眼圈发黑却兴奋，「龚俊团队答应当空降嘉宾，但只给两小时……姐妹，你得来救场。」", show: "npc", blockFlag: "skip_side_vivi" },
    { chapter: "side_vivi", speaker: "龚俊", text: "他比镜头里更爱笑，见到薇薇先鞠躬：「听说策展人是薇薇老师？……我经纪人可说了，今天只听你的。」", show: "npc", blockFlag: "skip_side_vivi" },
    { chapter: "side_vivi", speaker: "薇薇", text: "薇薇当场卡壳，又强装专业：「……isapara 才是艺术指导！」她把我往前一推，差点撞到龚俊怀里。", show: "npc", blockFlag: "skip_side_vivi" },
    { chapter: "side_vivi", speaker: "龚俊", text: "「雨的画师？」他认真看展签，「我路过你工作室那次，就觉得楼道海报在下雨。」", show: "npc", blockFlag: "skip_side_vivi" },
    {
      type: "choice",
      chapter: "side_vivi",
      prompt: "闺蜜的展览，你要如何牵线？",
      blockFlag: "skip_side_vivi",
      options: [
        { text: "主动帮薇薇对接龚俊团队", effects: { trust: 8, stress: 4 }, flag: "vivi_match" },
        { text: "只负责画作，不掺和感情", effects: { trust: 4, stress: -2 }, flag: "vivi_neutral" },
        { text: "劝薇薇别在工作里动心", effects: { trust: 6, stress: 2 }, flag: "vivi_caution" },
      ],
    },
    { needFlag: "vivi_match", chapter: "side_vivi", speaker: "龚俊", text: "彩排间隙，他教薇薇走台：「不用紧张，你策展的灯轨比我见过的都干净。」薇薇偷瞄我，眼睛亮得像打翻的颜料。", show: "npc", blockFlag: "skip_side_vivi" },
    { needFlag: "vivi_match", speaker: "薇薇", text: "【微信】薇薇：「他问我加不加私人微信！！说是想收藏我的灯光方案……姐妹，我是不是要恋爱了？」", show: "npc", blockFlag: "skip_side_vivi" },
    { needFlag: "vivi_neutral", speaker: "isapara", text: "我躲在画框后改标签，龚俊与薇薇的距离交给他们自己。可开幕酒会上，他们说话的频率，比灯光闪烁还密。", show: "heroine", blockFlag: "skip_side_vivi" },
    { needFlag: "vivi_caution", speaker: "薇薇", text: "「我知道。」她抿嘴笑，「可他说，薇薇老师的光，比热搜好看。」——我一句劝诫，终究没挡住。", show: "npc", blockFlag: "skip_side_vivi" },
    { chapter: "side_vivi", bg: "party", speaker: "龚俊", text: "闭幕夜，他在台上说：「感谢薇薇老师把光轨带到我面前。」台下，薇薇攥着我的手，指甲几乎掐进掌心。", show: "npc", blockFlag: "skip_side_vivi" },
    {
      type: "choice",
      chapter: "side_vivi",
      prompt: "薇薇与龚俊的关系，你要推一把还是踩刹车？",
      blockFlag: "skip_side_vivi",
      options: [
        { text: "安排二人单独对展（撮合）", effects: { trust: 10, stress: 2 }, flag: "vivi_gong_push" },
        { text: "尊重他们，不再干预", effects: { trust: 6, stress: 0 }, flag: "vivi_gong_wait" },
        { text: "提醒薇薇注意合同陷阱", effects: { trust: 8, stress: 6 }, flag: "vivi_gong_guard" },
      ],
    },
    { needFlag: "vivi_gong_push", speaker: "龚俊", text: "闭馆后，只剩他们和一盏轨道灯。我在监控室看见，他递给她一张手写卡：「下次展览，还想当你的嘉宾。」", show: "npc", blockFlag: "skip_side_vivi" },
    { needFlag: "vivi_gong_push", speaker: "薇薇", text: "【语音】薇薇（带笑哭腔）：「他表白了！！不是对镜头，是对我！！……isapara，我要恋爱了！」", show: "npc", blockFlag: "skip_side_vivi" },
    { needFlag: "vivi_gong_push", chapter: "side_vivi", speaker: "isapara", text: "我望着空展厅，给肖战发：「今晚帮闺蜜庆祝。」他回：「需要我帮你挡狗仔吗？」——主线仍在，支线也在长。", show: "heroine", blockFlag: "skip_side_vivi" },
    { needFlag: "vivi_gong_wait", speaker: "薇薇", text: "一个月后，薇薇朋友圈晒了两张票根：「龚俊 · 私人观影 · 只请策展人。」评论区全是问号，她只回我一个表情：🐱。", show: "npc", blockFlag: "skip_side_vivi" },
    { needFlag: "vivi_gong_guard", speaker: "刘姐", text: "刘姐帮我审了合同：「龚俊团队没坑。……薇薇这姑娘，谈得到尊重。」薇薇抱着我转了一圈。", show: "npc", blockFlag: "skip_side_vivi" },
    { needFlag: "vivi_gong_guard", speaker: "龚俊", text: "他当着我的面签补充条款：「薇薇老师拥有灯光方案完整署名。」——薇薇看他，像看一束不会熄的追光。", show: "npc", blockFlag: "skip_side_vivi" },
    { needFlag: "vivi_gong_push", speaker: "旁白", text: "【支线记录】薇薇 × 龚俊：光轨落幕，他们的故事才开幕。", show: "none", flag: "vivi_gong_he", blockFlag: "skip_side_vivi" },
    { needFlag: "vivi_gong_wait", minTrust: 20, speaker: "旁白", text: "【支线记录】薇薇 × 龚俊：慢热，却稳。", show: "none", flag: "vivi_gong_he", blockFlag: "skip_side_vivi" },
    { needFlag: "vivi_gong_guard", minTrust: 22, speaker: "旁白", text: "【支线记录】薇薇 × 龚俊：理性与心动并存。", show: "none", flag: "vivi_gong_he", blockFlag: "skip_side_vivi" },
  ];
  insertBeforeChapter("ch6", sideBlock);

  // —— 第五章后：路线锁定 ——
  const routeBlock = [
    { type: "chapter", chapter: "ch5r", title: "第五章后 · 心意分岔", text: "—— 风波前夜 · 你必须选一种靠近 ——" },
    { chapter: "ch5r", bg: "rooftop", speaker: "isapara", text: "三家邀约几乎同时落在手机上：肖战的后巷雨夜、张艺兴的静音棚、宋威龙的片场探班。卷卷蹲在路由器旁，像在看一场投票。", show: "heroine" },
    { needFlag: "flirt_zyx", blockFlag: "route_swl_lock", speaker: "张艺兴", text: "【微信】张艺兴：「如果你愿意，今晚没有经纪人，只有雨声和我。」", show: "npc" },
    { needFlag: "flirt_swl", blockFlag: "route_zyx_lock", speaker: "宋威龙", text: "【微信】宋威龙：「片场有场夜戏缺一幅速写背景。……想请你来。一个人。」", show: "npc" },
    { speaker: "肖战", text: "【微信】肖战：「老地方。画灯亮三下。……我等你。」", show: "hero" },
    {
      type: "choice",
      chapter: "ch5r",
      highEnergy: true,
      prompt: "心意已经不能再含糊——你要走向谁？",
      options: [
        { text: "去张艺兴的静音棚（攻略线）", effects: { affection: 6, trust: 14, stress: -4 }, flag: "route_zyx_lock" },
        { text: "去宋威龙的片场（攻略线）", effects: { affection: 12, trust: 12, stress: -2 }, flag: "route_swl_lock" },
        { text: "赴肖战的雨夜之约（主线）", effects: { affection: 14, trust: 10, stress: 6 }, flag: "route_xz_lock" },
        { text: "三个人都不见，先保护自己", effects: { affection: -6, trust: 4, stress: 12 }, flag: "route_alone" },
      ],
    },
    { needFlag: "route_zyx_lock", chapter: "ch_zyx", type: "chapter", title: "隐藏章 · 和声与晨光", text: "—— 张艺兴私人工作室 · 深夜 ——" },
    { needFlag: "route_zyx_lock", chapter: "ch_zyx", bg: "recording", speaker: "张艺兴", text: "静音棚里没有镜头。他调暗大灯，只留一盏台灯：「你可以继续喜欢雨，也可以……试着喜欢我。」", show: "npc" },
    { needFlag: "route_zyx_lock", chapter: "ch_zyx", speaker: "isapara", text: "我坦白说过肖战。他点头：「我知道。……我不是要你立刻回答，只想让你有第二个选择。」", show: "heroine" },
    {
      type: "choice",
      needFlag: "route_zyx_lock",
      chapter: "ch_zyx",
      prompt: "张艺兴递来耳机，里面是为你写的和声。",
      options: [
        { text: "摘下耳机，握住他的手", effects: { affection: 15, trust: 18, stress: -6 }, flag: "zyx_confess" },
        { text: "「给我一周，整理自己的心」", effects: { affection: 8, trust: 16, stress: 2 }, flag: "zyx_wait" },
        { text: "「对不起，我心里还有人」", effects: { affection: -4, trust: 10, stress: 8 }, flag: "zyx_reject" },
      ],
    },
    { needFlag: "zyx_confess", chapter: "ch_zyx", speaker: "张艺兴", text: "他把我护在麦克风后：「明天舆论我来挡。……你只管画雨，也画我。」", show: "npc" },
    { needFlag: "zyx_wait", speaker: "张艺兴", text: "「一周。」他笑，「我等了十年舞台，不差七天。」", show: "npc" },
    { needFlag: "route_swl_lock", chapter: "ch_swl", type: "chapter", title: "隐藏章 · 片场与速写", text: "—— 城郊片场 · 夜戏 ——" },
    { needFlag: "route_swl_lock", chapter: "ch_swl", bg: "backstage", speaker: "宋威龙", text: "片场只剩我们和大灯。他把剧本合上：「他们说我只会演少年。……我想演一次，喜欢一个人的成年。」", show: "npc" },
    { needFlag: "route_swl_lock", chapter: "ch_swl", speaker: "isapara", text: "我画他侧脸，线条一笔比一笔慢。他忽然问：「肖战……对你很重要吗？」", show: "heroine" },
    {
      type: "choice",
      needFlag: "route_swl_lock",
      chapter: "ch_swl",
      prompt: "宋威龙盯着你的速写本，等一个答案。",
      options: [
        { text: "「是。但我现在想看清你」", effects: { affection: 14, trust: 16, stress: 4 }, flag: "swl_confess" },
        { text: "「给我时间，别在片场表白」", effects: { affection: 8, trust: 14, stress: 0 }, flag: "swl_wait" },
        { text: "「对不起，我不能利用你」", effects: { affection: -2, trust: 12, stress: 6 }, flag: "swl_reject" },
      ],
    },
    { needFlag: "swl_confess", chapter: "ch_swl", speaker: "宋威龙", text: "他接过速写，夹进剧本扉页：「那就让这张成为秘密。……秘密我也守得住。」", show: "npc" },
    { needFlag: "route_xz_lock", speaker: "肖战", text: "后巷雨里，他浑身湿透却先检查画筒：「你来了。……别的邀约，可以推掉；你不行。」", show: "hero" },
    { needFlag: "route_alone", speaker: "isapara", text: "我关掉所有消息，只留卷卷。凌晨三点，三条未读同时亮起——像三滴不同温度的雨。", show: "heroine" },
    { blockFlag: "route_zyx_lock", blockFlags: ["route_swl_lock"], chapter: "ch6", speaker: "肖战（短信）", text: "【短信】「看到你和艺兴离开棚区的侧拍。……我信你，但也会怕。」", show: "none" },
    { blockFlag: "route_swl_lock", blockFlags: ["route_zyx_lock"], chapter: "ch6", speaker: "肖战（短信）", text: "【短信】「片场那张速写……很漂亮。若你选他，我会放手，但不骗你说我不疼。」", show: "none" },
  ];
  insertBeforeChapter("ch6", routeBlock);

  // —— 第七章后：攻略线收束 ——
  const ch8Idx = STORY.script.findIndex((n) => n.type === "chapter" && n.chapter === "ch8");
  const routeClimax = [
    { needFlag: "route_zyx_lock", needFlags: ["zyx_confess"], blockFlag: "zyx_reject", chapter: "ch8", bg: "concert", speaker: "张艺兴", text: "演唱会安可前，他指向观众席里的我：「这首和声，送给会下雨的人。」——没有署名，圈子却都懂了。", show: "npc" },
    { needFlag: "route_zyx_lock", needFlags: ["zyx_wait"], chapter: "ch8", speaker: "张艺兴", text: "一周后的清晨，他站在工作室门口，手里是两杯半糖可可：「第七天。……可以给我答案了吗？」", show: "npc" },
    { needFlag: "route_swl_lock", needFlags: ["swl_confess"], blockFlag: "swl_reject", chapter: "ch8", bg: "stage", speaker: "宋威龙", text: "新剧发布会，他把那本夹了速写的剧本递给媒体：「私人收藏，不展示。」却在后台握住我的手，「公开，等我准备好。」", show: "npc" },
    { needFlag: "route_swl_lock", needFlags: ["swl_wait"], chapter: "ch8", speaker: "宋威龙", text: "「我不催你。」他递来片场通行证，「第三场夜戏还会下雨。……你来，或者不来，我都等。」", show: "npc" },
    { needFlag: "vivi_gong_he", chapter: "ch8", speaker: "薇薇", text: "【请柬】薇薇 × 龚俊私人观展。她附言：「姐妹，我订婚了！……你画的那幅《光轨》挂在玄关！」", show: "npc", blockFlag: "route_zyx_lock", blockFlags: ["route_swl_lock"] },
  ];
  if (ch8Idx >= 0) {
    STORY.script.splice(ch8Idx, 0, ...routeClimax);
  }

  // —— 终章前：分路线结局文案 ——
  const endIdx = STORY.script.findIndex((n) => n.type === "ending");
  if (endIdx >= 0) {
    const routeEndings = [
      { needFlag: "route_zyx_lock", needFlags: ["zyx_confess"], blockFlag: "zyx_reject", chapter: "epilogue", bg: "dawn", speaker: "张艺兴", text: "一年后，静音棚改成双人工作室。你画雨，他写和声。肖战发来祝福短信，长长一句，最后只有「要幸福」。", show: "npc" },
      { needFlag: "route_zyx_lock", needFlags: ["zyx_wait"], chapter: "epilogue", speaker: "isapara", text: "第七天，我点了头。艺兴没开庆功宴，只在新歌里藏了一个「I」——这一次，属于我。", show: "heroine" },
      { needFlag: "route_swl_lock", needFlags: ["swl_confess"], blockFlag: "swl_reject", chapter: "epilogue", bg: "dawn", speaker: "宋威龙", text: "他第一部文艺片杀青那天，我们在雨里合影。速写本成了道具，也成了定情信物。", show: "npc" },
      { needFlag: "route_swl_lock", needFlags: ["swl_wait"], chapter: "epilogue", speaker: "宋威龙", text: "第三场夜戏，我去了。他只说：「欢迎。」——两个字，比整场台词都重。", show: "npc" },
      { needFlag: "vivi_gong_he", speaker: "薇薇", text: "【结局后日谈】薇薇与龚俊在米兰看展，视频里她仍抢我的画笔。……闺蜜幸福，我的雨也更亮。", show: "npc" },
    ];
    STORY.script.splice(endIdx, 0, ...routeEndings);

    for (let i = 0; i < STORY.script.length; i++) {
      const n = STORY.script[i];
      if (n.chapter === "epilogue" && n.speaker && /肖战|isapara.*窗外/.test(n.speaker + (n.text || ""))) {
        n.blockFlags = ["route_zyx_lock", "route_swl_lock"];
      }
    }
    const narrator = STORY.script.find((n) => n.chapter === "epilogue" && n.speaker === "旁白");
    if (narrator) {
      narrator.blockFlags = ["route_zyx_lock", "route_swl_lock"];
    }
  }

  // —— 多结局 ——
  if (typeof ENDINGS !== "undefined") {
    const patchHe = (id, extra) => {
      const e = ENDINGS.find((x) => x.id === id);
      if (!e) return;
      const old = e.condition;
      e.condition = (s) => old(s) && extra(s);
    };
    patchHe("he", (s) => !s.flags.route_zyx_lock && !s.flags.route_swl_lock);
    patchHe("secret_he", (s) => !s.flags.route_zyx_lock && !s.flags.route_swl_lock);
    patchHe("bitter_wait", (s) => !s.flags.route_zyx_lock && !s.flags.route_swl_lock);
    patchHe("love_wait_end", (s) => !s.flags.route_zyx_lock && !s.flags.route_swl_lock);

    ENDINGS.unshift(
      {
        id: "he_zyx",
        title: "结局 · 和声与晨光（张艺兴 HE）",
        condition: (s) =>
          s.flags.route_zyx_lock &&
          (s.flags.zyx_confess || (s.flags.zyx_wait && s.trust >= 24)) &&
          !s.flags.zyx_reject &&
          s.trust >= 22 &&
          s.affection >= 18,
        text: "你没有再站在顶流的光环里，却站在静音棚的晨光里。张艺兴为你挡过舆论，也为你收起锋芒。雨声与钢琴并存，画与歌彼此成全。",
        bgClass: "ending-true",
      },
      {
        id: "he_swl",
        title: "结局 · 片场速写（宋威龙 HE）",
        condition: (s) =>
          s.flags.route_swl_lock &&
          (s.flags.swl_confess || (s.flags.swl_wait && s.affection >= 24)) &&
          !s.flags.swl_reject &&
          s.affection >= 22 &&
          s.trust >= 18,
        text: "宋威龙把速写藏进剧本，也把承诺藏进每一次夜戏。你们慢慢公开，像慢曝光的照片。肖战在远处祝福，你终于敢选自己的镜头。",
        bgClass: "ending-true",
      },
      {
        id: "route_zyx_missed",
        title: "结局 · 未完成的和声",
        condition: (s) =>
          s.flags.route_zyx_lock &&
          (s.flags.zyx_reject || s.trust < 18) &&
          !s.flags.zyx_confess,
        text: "你去了静音棚，却没有接下耳机。张艺兴仍把和声存进私密云盘，备注：「给你，随时。」你们偶尔合作，却不再越界。",
        bgClass: "ending-missed",
      },
      {
        id: "route_swl_missed",
        title: "结局 · 空白一页速写",
        condition: (s) =>
          s.flags.route_swl_lock &&
          (s.flags.swl_reject || s.affection < 18) &&
          !s.flags.swl_confess,
        text: "速写本撕掉一页，宋威龙没追问。新剧上映时，他在采访里提到「一位画师」，没有名字。你继续画雨，只是偶尔想起片场那盏大灯。",
        bgClass: "ending-missed",
      },
      {
        id: "vivi_gong",
        title: "结局 · 光轨喜帖（闺蜜支线 HE）",
        condition: (s) =>
          s.flags.vivi_gong_he &&
          !s.flags.route_zyx_lock &&
          !s.flags.route_swl_lock &&
          s.trust >= 16,
        text: "薇薇与龚俊在《光轨》后牵手。订婚宴上，你把新画的雨挂在她玄关。肖战来做客，龚俊敬你一杯：「谢谢你把她推向我。」——主线之外，你也拥有了另一种圆满。",
        bgClass: "ending-secret",
      },
      {
        id: "vivi_gong_bonus",
        title: "结局 · 双线幸福（主线 HE + 闺蜜支线）",
        condition: (s) =>
          s.flags.vivi_gong_he &&
          !s.flags.route_zyx_lock &&
          !s.flags.route_swl_lock &&
          !s.flags.reject_gift &&
          s.affection >= 28 &&
          s.trust >= 26 &&
          (s.flags.he_hand || s.flags.he_speech || s.flags.he_kiss || s.flags.love_ok),
        text: "你与肖战在画展剪彩，薇薇与龚俊在同一座城市订婚。雨夜、和声、光轨——两条故事线在同一张喜帖上相遇。卷卷趴在你们四人的合影旁，胖得像个句号。",
        bgClass: "ending-true",
      },
      {
        id: "route_alone",
        title: "结局 · 三支未接的邀约",
        condition: (s) => s.flags.route_alone && s.affection < 20 && s.trust < 18,
        text: "你谁也没见。肖战在雨里等到天亮，张艺兴的和声文件过期，宋威龙的片场换了别的画师。你保住了安静，也失去了靠近的勇气。",
        bgClass: "ending-burnout",
      }
    );
  }
})();
