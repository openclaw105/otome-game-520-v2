/**

 * 剧情扩展：明星友人章节（不含周深）、闺蜜薇薇

 */

(function () {

  if (typeof STORY === "undefined" || !STORY.script) return;



  const ch2b = { id: "ch2b", name: "第二章后 · 圈内小聚" };

  const ch4b = { id: "ch4b", name: "第四章后 · 录音棚偶遇" };

  const idx2b = STORY.chapters.findIndex((c) => c.id === "ch3");

  if (idx2b >= 0 && !STORY.chapters.some((c) => c.id === "ch2b")) {

    STORY.chapters.splice(idx2b, 0, ch2b);

  }

  const idx4b = STORY.chapters.findIndex((c) => c.id === "ch5");

  if (idx4b >= 0 && !STORY.chapters.some((c) => c.id === "ch4b")) {

    STORY.chapters.splice(idx4b, 0, ch4b);

  }



  const insertCh3 = STORY.script.findIndex((n) => n.type === "chapter" && n.chapter === "ch3");

  const insertCh5 = STORY.script.findIndex((n) => n.type === "chapter" && n.chapter === "ch5");



  const block2b = [

    { type: "chapter", chapter: "ch2b", title: "第二章后 · 圈内小聚", text: "—— 城郊私人沙龙 · 信任达到一定程度后 ——", minAffection: 12 },

    { chapter: "ch2b", bg: "salon", speaker: "肖战", text: "「今天没有镜头。」他替我拉开车门，「都是老朋友。……不想让你一直躲在画后面。」", show: "hero", minAffection: 12 },

    { speaker: "isapara", text: "沙龙灯光暖得像琥珀。我攥着小包，卷卷被留在工作室——这种场合，猫比人诚实。", show: "heroine", minAffection: 12 },

    { speaker: "杨幂", text: "「我听说了封面那场雨。」她靠在沙发扶手上，「作品行，人也行。——肖战很少带朋友来。」", show: "npc", minAffection: 12 },

    { speaker: "肖战", text: "他耳根微红，没反驳，只把果盘往我这边推了推。", show: "hero", minAffection: 12 },

    { speaker: "朱一龙", text: "他话不多，却在走廊停很久看未干的草图：「留白很好。……雨停之后，这里还可以再落一笔。」", show: "npc", minAffection: 12 },

    { speaker: "白敬亭", text: "「我跟你说，他练舞时都在哼你的配色。」他胳膊肘轻碰肖战，笑得很阳光。", show: "npc", minAffection: 12 },

    { speaker: "倪妮", text: "「衣服沾颜料了？」她递来湿巾，「艺术家特权。……下回展览叫我，我穿不会抢画的颜色。」", show: "npc", minAffection: 12 },

    { speaker: "李现", text: "他把外套搭在沙发背上：「想喝热的就说。——这里空调总太冷。」", show: "npc", minAffection: 12 },

    { speaker: "杨紫", text: "「我在隔壁房间录综艺，听说肖战带来个会画雨的！」她比了个拍照手势，「不拍，就看看。」", show: "npc", minAffection: 12 },

    { speaker: "邓超", text: "「来来来，别僵。」他把气氛顶起来，「今天规则：不许聊热搜，只聊好吃的、好画的。」", show: "npc", minAffection: 12 },

    { speaker: "薇薇", text: "【微信】薇薇：「姐妹！！你真进圈了？？杨幂在你旁边那种？？回我！！」", show: "npc", minAffection: 12 },

    {

      type: "choice",

      prompt: "明星朋友们善意又锋利，你要如何自处？",

      minAffection: 12,

      options: [

        { text: "安静画画，用作品回应", effects: { affection: 6, trust: 10, stress: -4 }, flag: "party_paint" },

        { text: "和杨紫闲聊放松", effects: { affection: 8, trust: 6, stress: -6 }, flag: "party_chat" },

        { text: "只跟在肖战身边，不应酬", effects: { affection: 12, trust: 8, rumor: 6 }, flag: "party_stick" },

      ],

    },

    { needFlag: "party_paint", chapter: "ch2b", bg: "studio", speaker: "isapara", text: "我借了角落一张小桌，用水彩刷了半张夜景。朱一龙最后帮忙扶了扶画板——没说话，点了点头。", show: "heroine", minAffection: 12 },

    { needFlag: "party_chat", speaker: "杨紫", text: "「你猫真的胖吗？」她认真问。我给她看卷卷照片，两个人笑到捂脸。", show: "npc", minAffection: 12 },

    { needFlag: "party_stick", speaker: "肖战", text: "他低声：「不想应酬就跟我说。……但谢谢你来了。」", show: "hero", minAffection: 12 },

    { speaker: "杨幂", text: "散场时她塞来名片：「制片有美术向的项目。——只合作，不绑架。」", show: "npc", minAffection: 12 },

    { blockFlag: "ch2_safe", speaker: "娱记", text: "门口仍有长焦。我们分开走，肖战先上车，我在后巷多等了十分钟。", show: "npc", minAffection: 12 },

  ];



  const block4b = [

    { type: "chapter", chapter: "ch4b", title: "第四章后 · 录音棚偶遇", text: "—— 录音棚走廊 ——", minTrust: 18 },

    { chapter: "ch4b", bg: "recording", speaker: "杨紫", text: "「又是你！」她摘下耳机，「肖战在里面录和声，我在外廊偷闲。……你别紧张，我不是狗仔。」", show: "npc", minTrust: 18 },

    { speaker: "白敬亭", text: "他从另一间探头：「嘿，画师！战哥说你配色有雨声。」", show: "npc", minTrust: 18 },

    { speaker: "isapara", text: "我靠在墙边听了三十秒，竟真的听出潮气。肖战推门出来，发梢还夹着录音棚的冷光。", show: "heroine", minTrust: 18 },

    { speaker: "肖战", text: "「巧了。」他把保温杯递给我，「热的。……他们都很喜欢你上次那幅。」", show: "both", minTrust: 18 },

    { needFlag: "party_chat", speaker: "杨紫", text: "「上次沙龙你笑得很开，」她小声，「他很少带人见朋友。懂的都懂。」", show: "npc", minTrust: 18 },

  ];



  const blockCh6Extra = [

    { blockFlag: "angst_block", speaker: "薇薇", text: "【语音】薇薇带着哭腔：「我把营销号骂了一遍。……你开门好不好？我带了卷卷的罐罐。」", show: "npc" },

    { minRumor: 15, speaker: "粉丝（弹幕）", text: "【弹幕】有人扒出画师工作室地址。卷卷的照片被P进恶梗——我气得手抖。", show: "npc" },

  ];



  if (insertCh3 >= 0 && !STORY.script.some((n) => n.chapter === "ch2b")) {

    STORY.script.splice(insertCh3, 0, ...block2b);

  }



  const insertCh5b = STORY.script.findIndex((n) => n.type === "chapter" && n.chapter === "ch5");

  if (insertCh5b >= 0 && !STORY.script.some((n) => n.chapter === "ch4b")) {

    STORY.script.splice(insertCh5b, 0, ...block4b);

  }



  const insertCh6 = STORY.script.findIndex((n) => n.type === "chapter" && n.chapter === "ch6");

  if (insertCh6 >= 0) {

    STORY.script.splice(insertCh6, 0, ...blockCh6Extra);

  }



  const extraLines = [

    { chapter: "ch1", speaker: "薇薇", text: "【语音】薇薇：「你家门缝下有张黑卡？？别慌，先拍照留证！……等等，好像不是诈骗？」", show: "npc", blockFlag: "ch1_cold" },

    { chapter: "ch5", bg: "rooftop", speaker: "白敬亭", text: "【微信】白敬亭：「战哥说你们爱喝半糖可可。……别问怎么知道的。」", show: "npc", minAffection: 14 },

    { chapter: "ch7", speaker: "朱一龙", text: "刘姐离开前，朱一龙在楼梯口停了一步：「画还在。……别删。」", show: "npc", needFlag: "angst_trust" },

    { chapter: "ch8", speaker: "倪妮", text: "开展前，倪妮让人送来花篮，卡片只写：「给会下雨的人。」", show: "npc", minAffection: 16 },

  ];

  extraLines.reverse().forEach((line) => {

    const anchor = STORY.script.findIndex((n) => n.chapter === line.chapter && (n.type === "chapter" || n.bg));

    if (anchor >= 0) STORY.script.splice(anchor + 1, 0, line);

  });

})();


