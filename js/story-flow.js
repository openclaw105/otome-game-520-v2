/**
 * 立绘与场景切入：补全缺失的 show、章节入场、对话合理性
 */
(function () {
  if (typeof STORY === "undefined" || !STORY.script) return;

  const NPC_SPEAKERS =
    /房东|刘姐|刘婉|张艺兴|宋威龙|龚俊|杨幂|倪妮|杨紫|薇薇|闺蜜|老板|同事|娱记|记者|经纪人|粉丝|弹幕|刘婉/;

  STORY.script.forEach((node) => {
    if (node.type === "choice" || node.type === "ending" || node.type === "chapter") return;
    if (node.show != null && node.show !== "") return;

    const sp = node.speaker || "";
    if (/旁白|系统|未送达/.test(sp)) node.show = "none";
    else if (/^isapara/i.test(sp)) node.show = "heroine";
    else if (/肖战|战哥|X\.Z|^\？\？\？/.test(sp)) node.show = /微信|短信/.test(sp) ? "hero" : "hero";
    else if (NPC_SPEAKERS.test(sp)) node.show = "npc";
    else node.show = "heroine";
  });

  const enterLines = [
    {
      beforeChapter: "ch1",
      nodes: [
        {
          chapter: "ch1",
          speaker: "isapara",
          text: "我深吸一口气，把门拉开一条缝——走廊安静，只有雨声。",
          show: "heroine",
        },
      ],
    },
    {
      beforeChapter: "ch2",
      nodes: [
        {
          chapter: "ch2",
          speaker: "isapara",
          text: "后台灯光刺眼。我把口罩拉高，跟着工作人员牌往里走。",
          show: "heroine",
          bg: "backstage",
        },
      ],
    },
    {
      beforeChapter: "ch3",
      nodes: [
        {
          chapter: "ch3",
          speaker: "isapara",
          text: "散场铃响后，雨却更大。我抱着画筒站在廊檐下，等一辆不会上热搜的车。",
          show: "heroine",
        },
      ],
    },
    {
      beforeChapter: "side_vivi",
      nodes: [
        {
          chapter: "side_vivi",
          speaker: "薇薇",
          text: "【电话】薇薇：「姐妹救命！！龚俊团队提前到了！！」",
          show: "npc",
        },
      ],
    },
  ];

  enterLines.reverse().forEach((block) => {
    if (STORY.script.some((n) => n.chapter === block.beforeChapter && n.text === block.nodes[0].text)) {
      return;
    }
    const idx = STORY.script.findIndex((n) => n.type === "chapter" && n.chapter === block.beforeChapter);
    if (idx >= 0) STORY.script.splice(idx + 1, 0, ...block.nodes);
  });
})();
