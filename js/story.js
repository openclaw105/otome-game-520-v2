/**
 * 星光与画稿 — 完整剧情
 * 女主 isapara · 独立绘画工作室 | 男主 肖战 · 顶流巨星
 * 标签：1v1 / 双洁 / HE / 虐恋转折 / BG
 */
const STORY = {
  chapters: [
    { id: "prologue", name: "序章 · 颜料与选择" },
    { id: "ch1", name: "第一章 · 匿名委托" },
    { id: "ch2", name: "第二章 · 夜半送货" },
    { id: "ch3", name: "第三章 · 雨里护画" },
    { id: "ch4", name: "第四章 · 灯下的名字" },
    { id: "ch5", name: "第五章 · 秘密的宇宙" },
    { id: "ch6", name: "第六章 · 镜头外的刀" },
    { id: "ch7", name: "第七章 · 碎瓷与沉默" },
    { id: "ch8", name: "第八章 · 轨迹展览会" },
    { id: "epilogue", name: "终章 · 共生之光" },
  ],

  script: [
    // --- 序章 ---
    { type: "chapter", chapter: "prologue", title: "序章 · 颜料与选择", text: "—— isapara 艺术工作室 · 深夜 ——" },
    { chapter: "prologue", bg: "studio", speaker: "isapara", text: "最后一管钴蓝挤不出来时，房租催缴单在门上沙沙响。工作室只剩一盏画灯，照亮未干的油画——《城市雨迹》，投稿截止在明天。", show: "heroine" },
    { speaker: "isapara", text: "爸妈是普通职工。美院毕业后想开工作室，他们肯帮忙，我更想先靠自己撑一撑。" },
    { speaker: "isapara", text: "靴边蹭过来一团蓝灰色、圆滚滚的胖——卷卷，我的蓝猫，可爱得让人没脾气。会踩键盘、打翻洗笔水，也会在深夜呼噜呼噜蹭我。" },
    { speaker: "isapara", text: "七岁第一次握笔，妈妈说我能把阳光留在纸上。雨是我常画的题目。" },
    { speaker: "房东", text: "「isapara，下周五之前，要么交齐三个月房租，要么我收钥匙。」", show: "npc" },
    { speaker: "isapara", text: "我点头，笑得像一张没上色的素描。房东叹口气走了。门关上后，卷卷才从画柜后探出头，轻轻喵了一声。我才敢让肩膀塌下去。" },
    { speaker: "isapara", text: "手机弹出邮件提示：【匿名委托 X.Z.】愿以三倍稿酬，订制专辑封面概念图。附言只有一句：「要一场会下雨的夜。」" },
    {
      type: "choice",
      prompt: "匿名委托来得蹊跷，但酬劳能救工作室。",
      options: [
        { text: "接下委托，连夜赶稿", effects: { affection: 2, trust: 3, stress: 8 }, flag: "take_job" },
        { text: "先查对方背景，再决定是否接", effects: { affection: 0, trust: 8, stress: 4 }, flag: "check_job" },
        { text: "婉拒——不想出卖画风", effects: { affection: -2, trust: 5, stress: -5 }, flag: "refuse_job" },
      ],
    },
    { needFlag: "take_job", speaker: "isapara", text: "我回了「接」。咖啡见底时，卷卷趴在洗笔池边打呼噜。天亮前，《城市雨迹》终于干透——像一场憋了很久的雨落了下来。", show: "heroine" },
    { needFlag: "check_job", speaker: "isapara", text: "我先查汇款路径和过往合作记录，干净得像雨后的玻璃。确认无误后才收定金，并在合同里写明：仅匿名署名，不留联系方式。", show: "heroine" },
    { needFlag: "refuse_job", speaker: "isapara", text: "我打了拒信。可三小时后，对方又发来一笔定金——刚好够付一个月房租。附言：「我相信你的雨。」我盯着屏幕很久，最终还是打开了空白画布。", show: "heroine" },

    // --- 第一章 ---
    { type: "chapter", chapter: "ch1", title: "第一章 · 匿名委托", text: "—— 三日后 · 工作室 ——" },
    { chapter: "ch1", bg: "studio", speaker: "isapara", text: "稿子改了七版。雨从窗框外斜着泼进来，路灯被晕染成一团团暖金。凌晨两点，我听见楼下有极轻的脚步声——不像醉汉，更像怕惊动什么的人。", show: "heroine" },
    { speaker: "？？？", text: "「抱歉，这么晚打扰。我来取画。」", show: "hero" },
    { speaker: "isapara", text: "开门的人戴着口罩与鸭舌帽，声音低而稳。他把一张黑卡放在玄关：「尾款，还有……」他顿了顿，「一封手写信。」" },
    { speaker: "肖战", text: "「可以叫我肖战。——如果你愿意，先别上网搜这个名字。」他苦笑，眼神没有压迫感，只有疲惫的真诚。" },
    { speaker: "isapara", text: "我愣住。卷卷却先炸毛一瞬，又嗅到他指背的松节油味，慢慢蹭过去。空气里浮着雨水与颜料的气息——我第一反应不是尖叫，而是他手背上也有洗不掉的颜料渍。" },
    { speaker: "肖战", text: "他蹲下，让卷卷闻了闻掌心，声音放轻：「别怕，我不抢你的地盘。」他抬头看我，眼里有一点笑，「好胖，好可爱。……像你工作室的吉祥物。」", show: "hero" },
    {
      type: "choice",
      prompt: "深夜，顶流站在你的画室里。",
      options: [
        { text: "只谈工作，把画交给他", effects: { affection: 4, trust: 6, stress: 2 }, flag: "ch1_work" },
        { text: "问他：你也画过画吗？", effects: { affection: 10, trust: 12, stress: 3 }, flag: "ch1_art" },
        { text: "装作不认识，匆匆交接", effects: { affection: 2, trust: -4, rumor: 3 }, flag: "ch1_cold" },
      ],
    },
    { needFlag: "ch1_art", speaker: "肖战", text: "他抬手看了看手背上的颜料，轻声笑：「小时候学过设计，后来……画笔被行程表吃掉了。」", show: "hero" },
    { needFlag: "ch1_art", speaker: "isapara", text: "我们并排看了会儿未干的雨痕。他说每一道高光都应该有温度——我忽然觉得，这单委托不像商业约稿。", show: "heroine" },
    { needFlag: "ch1_work", speaker: "肖战", text: "他认真看画很久：「雨有重量。……比我想象的还重一点。谢谢。」", show: "hero" },
    { needFlag: "ch1_work", speaker: "isapara", text: "我把尾款收据递过去，语气尽量公事公办。他接过时指尖很稳——像早就习惯在镜头前控制每一个表情。", show: "heroine" },
    { needFlag: "ch1_cold", speaker: "isapara", text: "我把画包好，只说一句「请查收」。他愣了半秒，仍低声道谢，像怕惊动卷卷似的轻。", show: "heroine" },
    { needFlag: "ch1_cold", speaker: "肖战", text: "「是我冒昧。」他在门口停了一下，「雨画得很好。……如果以后还想找我，可以只谈画。」他终究没提《小满》。", show: "hero" },
    { blockFlag: "ch1_cold", speaker: "肖战", text: "临走前，他指着我墙上童年旧作：「这幅《小满》……可以借我翻拍吗？不会公开，只放在手机里。想提醒自己，太阳还在。」", show: "hero" },

    // --- 第二章 ---
    { type: "chapter", chapter: "ch2", title: "第二章 · 夜半送货", text: "—— 专辑发布周 ——" },
    { chapter: "ch2", bg: "nightcity", speaker: "isapara", text: "封面上线那天，全网刷屏。评论说「像一场会呼吸的雨」。没人知道画师是我——我在小号发了一张局部，立刻被淹没在热搜里。", show: "heroine" },
    { speaker: "肖战（微信）", text: "【微信】肖战：「看到你了。……今晚有空吗？想把专辑母带里的隐藏插画，当面给你看。」", show: "hero" },
    { speaker: "isapara", text: "我盯着屏幕，心跳乱拍。粉丝在超话刷#肖战新歌#，卷卷瘫在键盘旁睡成一张猫饼，我泡了一碗面，却觉得面汤也烫得像秘密。" },
    { chapter: "ch2", bg: "backstage", speaker: "肖战", text: "后台走廊很长，他把我藏在工作人员牌后面，声音压得很低：「别怕。这一段路，我走过很多次。」", show: "both" },
    { speaker: "肖战", text: "他给我看未发布的插画——画的是工作室那盏旧灯。画角签名不是明星名，而是极小的「Z 与 I」。" },
    {
      type: "choice",
      prompt: "后台走廊的空气里都是他的世界。",
      options: [
        { text: "「我只是画师，配不上这种签名。」", effects: { affection: 3, trust: 5, stress: 6 }, flag: "ch2_humble" },
        { text: "「Z 与 I……是我想的那个意思吗？」", effects: { affection: 12, trust: 10, rumor: 5 }, flag: "ch2_confirm" },
        { text: "「以后别在这里见我，对你不安全。」", effects: { affection: 6, trust: 14, stress: 4, rumor: -3 }, flag: "ch2_safe" },
      ],
    },
    { needFlag: "ch2_humble", speaker: "肖战", text: "「署名只是记号。」他没有生气，「你值得被看见。……但我可以等，等到你愿意。」", show: "hero" },
    { needFlag: "ch2_confirm", speaker: "肖战", text: "他耳根很轻地红了一下：「是。Z 是我，I 是你。……如果你点头，我就不会改。」", show: "both" },
    { needFlag: "ch2_safe", speaker: "肖战", text: "「你说得对。」他退半步，把工作人员牌举高些，「安全很重要。……但我不想再一个人看画。」", show: "hero" },
    { needFlag: "ch2_humble", speaker: "isapara", text: "我把签名的事咽回去，只当听错。可回工作室后，仍把那张「Z 与 I」的草图夹在速写本最里层。", show: "heroine" },
    { needFlag: "ch2_confirm", speaker: "isapara", text: "我点头。他像松了一口很长的气，把母带盒递过来时，指节都在微微发抖。", show: "heroine" },
    { needFlag: "ch2_safe", speaker: "isapara", text: "我跟着他在后台绕了很长一段路。镜头扫过时，他把我的肩轻轻挡在阴影里——像挡一阵风。", show: "heroine" },
    { blockFlag: "ch2_safe", speaker: "isapara", text: "回程的出租车里，我盯着窗外霓虹，把「I」在掌心写了一遍又一遍。", show: "heroine" },

    // --- 第三章 ---
    { type: "chapter", chapter: "ch3", title: "第三章 · 雨里护画", text: "—— 暴雨 · 回程 ——" },
    { chapter: "ch3", bg: "rain", speaker: "isapara", text: "散场后突降暴雨。我把自己的外套罩在装原稿的防水筒上，自己淋得肩膀发麻。", show: "heroine" },
    { speaker: "肖战", text: "他追出来，把伞倾向我这边，自己半边肩膀湿透：「画不能病。人会病，画病了很难好。」", show: "hero" },
    { speaker: "isapara", text: "路灯下，他的睫毛沾着雨，像工笔勾的水痕。我忽然想起七岁那年的夏天——妈妈把我的画贴在冰箱上，爸爸在一旁笑：「闺女有出息。」他们说，将来要办一场属于 isapara 的画展。" },
    {
      type: "choice",
      prompt: "雨里，他看着你护画的手。",
      options: [
        { text: "把伞推回去一半：「你也别淋坏。」", effects: { affection: 10, trust: 8, stress: 2 }, flag: "ch3_care" },
        { text: "「明星也会感冒吗？」笑着岔开话题", effects: { affection: 6, trust: 6, stress: -2 }, flag: "ch3_joke" },
        { text: "沉默地跟着他走", effects: { affection: 8, trust: 12, stress: 5 }, flag: "ch3_silent" },
      ],
    },
    { needFlag: "ch3_care", speaker: "肖战", text: "他愣住，伞柄往我这边又倾了些：「……你总是先照顾别的东西。」雨声里，他声音很轻。", show: "hero" },
    { needFlag: "ch3_joke", speaker: "肖战", text: "他笑出声，肩膀终于松下来：「会。还会发烧。」眼底却软，「所以别淋太久。」", show: "hero" },
    { needFlag: "ch3_silent", speaker: "isapara", text: "我没说话，只把防水筒抱紧。他也就安静跟着，脚步落在我身侧半步——像怕惊扰雨里的画。", show: "heroine" },
    { speaker: "肖战", text: "他在便利店门口停下，买回两杯热可可：「糖度你选。……以后下雨，叫我。」语气很轻，不像命令，像请求。", show: "hero" },
    { needFlag: "ch3_care", speaker: "肖战", text: "「半糖。」他替我选好，「你手冷，先暖一暖。」", show: "hero" },
    { needFlag: "ch3_joke", speaker: "isapara", text: "我选了全糖。他挑眉：「不怕胖？」我指了指家里的卷卷：「有榜样。」", show: "heroine" },

    // --- 第四章 ---
    { type: "chapter", chapter: "ch4", title: "第四章 · 灯下的名字", text: "—— 工作室 · 凌晨 ——" },
    { chapter: "ch4", bg: "studio", speaker: "isapara", text: "我们在画架前并排坐。卷卷把胖身子蜷在我脚边打呼噜，偶尔伸爪碰一下他的裤脚，又装作无事发生。松节油味盖住消毒水味——外面世界正在发烧，这里只有笔尖摩擦。" },
    { speaker: "肖战", text: "「我以前以为，顶流的意思是——不能有空白。现在才知道，空白才是奢侈品。」", show: "hero" },
    { speaker: "isapara", text: "他讲起出道前夜，在出租屋里改三十版海报；讲起母亲存了三年钱给他买第一块数位板。我没有插话，只把洗笔水换了一次。" },
    { speaker: "肖战", text: "「isapara，我不是来你人生里打卡的。……如果你愿意，我想认真追你。很慢，很笨，但不会对别人。」", show: "both" },
    {
      type: "choice",
      prompt: "灯火下，他递来一颗干净的心。",
      options: [
        { text: "「我也只想认真对你。」", effects: { affection: 15, trust: 15, rumor: 6 }, flag: "love_ok" },
        { text: "「给我三个月，让我想清楚。」", effects: { affection: 8, trust: 12, stress: 5 }, flag: "love_wait" },
        { text: "「你值得更亮的地方，不是我。」", effects: { affection: 2, trust: 6, stress: 10 }, flag: "love_doubt" },
      ],
    },
    { needFlag: "love_ok", speaker: "isapara", text: "他伸手，指尖碰到我手背，又克制地收回：「那……先从保密开始。保护你，也保护我们。」", show: "heroine" },
    { needFlag: "love_wait", speaker: "肖战", text: "他点头，没有追问：「三个月。……我等你。期间不会用绯闻逼你点头。」", show: "hero" },
    { needFlag: "love_wait", speaker: "isapara", text: "我给自己设了截止日——可每次手机亮起他的名字，日历就像被雨泡皱。", show: "heroine" },
    { needFlag: "love_doubt", speaker: "肖战", text: "他沉默很久：「如果明亮的地方更配你，我会……站在台下看你。」", show: "hero" },
    { needFlag: "love_doubt", speaker: "isapara", text: "我别过脸。卷卷却跳上他膝，胖成一张饼。——猫从不撒谎，我的心却还在逃。", show: "heroine" },
    { minTrust: 20, blockFlag: "love_ok", speaker: "肖战", text: "临走时他在门边停住：「无论你选哪种答案，画灯别关。……我会从雨里来。」", show: "hero" },

    // --- 第五章 ---
    { type: "chapter", chapter: "ch5", title: "第五章 · 秘密的宇宙", text: "—— 秘密交往的第七周 ——" },
    { chapter: "ch5", bg: "cafe", speaker: "isapara", text: "我们在城郊咖啡馆包间见面。他教我调咖啡拉花，我教他用水粉晕开霓虹——像两个偷时间的学生。", show: "both" },
    { speaker: "肖战", text: "「下周有慈善拍卖，公司想让我带女伴炒作。我拒绝了十二次。」他揉眉心，声音发哑，却没有发火，「他们拿你的工作室威胁我——说要查匿名画师。」", show: "hero" },
    {
      type: "choice",
      prompt: "风波逼近，你们如何面对？",
      options: [
        { text: "主动公开恋情，扛舆论", effects: { affection: 10, trust: 8, rumor: 15, stress: 12 }, flag: "go_public" },
        { text: "继续地下，把证据藏好", effects: { affection: 8, trust: 14, rumor: 4, stress: 6 }, flag: "stay_secret" },
        { text: "暂时不见面，避风头", effects: { affection: -5, trust: 10, stress: 8, rumor: -5 }, flag: "pause_meet" },
      ],
    },
    { needFlag: "go_public", speaker: "肖战", text: "他深吸一口气：「那就一起站在光里。骂声我来挡，你只画画。」", show: "hero" },
    { needFlag: "go_public", speaker: "isapara", text: "我答应的瞬间，已有营销号开始编故事——像雨点砸在伞面上，密集又冷。", show: "heroine" },
    { needFlag: "stay_secret", speaker: "肖战", text: "「好。证据我来清。」他把手机关机，换了一张新卡，「以后只见在雨里。」", show: "hero" },
    { needFlag: "stay_secret", speaker: "isapara", text: "我们把见面改成密码：画灯亮三下，他再从后巷进来。卷卷每次都会先喵一声验货。", show: "heroine" },
    { needFlag: "pause_meet", speaker: "肖战", text: "他眼神暗了一瞬，仍说：「可以。……等你消息。」", show: "hero" },
    { needFlag: "pause_meet", speaker: "isapara", text: "一周没有见面。只有颜料在消耗，和凌晨未读又删掉的草稿。卷卷胖了一圈，我瘦了一点。", show: "heroine" },
    { blockFlag: "pause_meet", speaker: "isapara", text: "他最后发来一句：「别慌。有我在。」——像把重东西从我肩上挪走一半。", show: "heroine" },

    // --- 第六章 · 虐点 ---
    { type: "chapter", chapter: "ch6", title: "第六章 · 镜头外的刀", text: "—— 翌日 · 热搜爆炸 ——" },
    { chapter: "ch6", bg: "stage", speaker: "娱记", text: "【热搜】#肖战深夜携神秘女子进酒店# 配图模糊，却拍到我工作室楼下的侧影。", show: "npc" },
    { speaker: "粉丝（弹幕）", text: "【弹幕】「脱粉！」「哥哥要有事业！」「素人画师蹭热度？」——字句像钉子。", show: "npc" },
    { speaker: "经纪人", text: "「公司凌晨发了通稿：肖战与品牌方艺术顾问正常会面，请勿过度解读。」——没提我，也没提爱。", show: "npc" },
    { speaker: "isapara", text: "薇薇发来链接：「你是不是被包了？」我打字又删掉，最后只回了一个句号。句号像一颗掉进海里的石子，连回声都没有。", show: "heroine" },
    { speaker: "isapara", text: "卷卷跳上膝头，用额头抵我手心，呼噜声又细又稳。我反复刷新，直到屏幕发烫。他发来的消息停在凌晨三点：「别看。信我。」——之后，是十二个小时的沉默。", show: "heroine" },
    { speaker: "肖战（未送达）", text: "【系统提示：消息已撤回】后来经纪人才告诉我，他那晚发了二十七条解释，都被拦在服务器里。", show: "none" },
    {
      type: "choice",
      prompt: "虐心的一夜：你最怕什么？",
      options: [
        { text: "打电话给他，要一句真话", effects: { affection: 8, trust: 12, stress: 10 }, flag: "call_him" },
        { text: "关机，把画撕掉一角", effects: { affection: -8, trust: -10, stress: 18 }, flag: "hurt_self" },
        { text: "去找所谓的「酒店女子」", effects: { affection: 5, trust: -5, stress: 14, rumor: 8 }, flag: "find_woman" },
      ],
    },
    { needFlag: "call_him", speaker: "肖战", text: "电话接通时他在喘，背景是走廊回声：「我在公司。……没有别人。只有你。信我，今晚很难说清，但我一直在争取。」", show: "hero" },
    { needFlag: "call_him", speaker: "isapara", text: "我握着手机蹲在画架旁，卷卷把胖脑袋顶在我膝上。那一夜，至少听见了他的呼吸。", show: "heroine" },
    { needFlag: "hurt_self", speaker: "isapara", text: "纸撕裂的声音比哭还难听。我后悔得发抖——却收不到他的回复。后来才知道，他的手机被经纪没收了六小时。", show: "heroine" },
    { needFlag: "find_woman", speaker: "isapara", text: "我查到酒店地址，在雨里站了四十分钟。前台说当晚只有品牌方与经纪团队——没有女人进他房间。", show: "heroine" },
    { needFlag: "find_woman", speaker: "isapara", text: "我仍不信，直到看见监控里刘姐的侧脸。误会像一盆冷水——浇醒一半，也冻伤一半。", show: "heroine" },
    {
      type: "choice",
      prompt: "虐心之夜过后，你心里其实……",
      options: [
        { text: "仍想信他，但需要证据", effects: { affection: 6, trust: 10, stress: 6 }, flag: "angst_trust" },
        { text: "已经死心，把他拉黑", effects: { affection: -12, trust: -15, stress: 14 }, flag: "angst_block" },
        { text: "去查酒店监控（自己查明真相）", effects: { affection: 4, trust: 14, stress: 10 }, flag: "angst_investigate" },
      ],
    },
    { needFlag: "angst_trust", speaker: "isapara", text: "我没有拉黑，只设了静音。信任像裂了缝的瓷——还立着，却一碰就响。", show: "heroine" },
    { needFlag: "angst_trust", speaker: "肖战（短信）", text: "【短信】「展览是真的。人也是。……给我一次当面说清的机会。」", show: "hero" },
    { needFlag: "angst_block", speaker: "isapara", text: "我拉黑、删图、清空聊天记录。工作室安静得只剩卷卷的呼噜——像在替我说「其实还在等」。", show: "heroine" },
    { needFlag: "angst_investigate", speaker: "isapara", text: "监控里只有他和刘姐并肩走出电梯，手里抱着展册。——那一刻，我比接到告白时还慌，因为发现自己错怪了全世界。", show: "heroine" },
    { blockFlag: "find_woman", needFlag: "angst_investigate", speaker: "isapara", text: "我自己查到的真相，和刘姐带来的文件叠在一起——错怪他的那几天，成了心里最疼的一页。", show: "heroine" },

    // --- 第七章 · 虐点高峰 + 反转铺垫 ---
    { type: "chapter", chapter: "ch7", title: "第七章 · 碎瓷与沉默", text: "—— 三天后 · 工作室 ——" },
    { chapter: "ch7", bg: "studio", speaker: "isapara", text: "门被敲响。我以为是快递，开门却看见财经杂志上的熟脸——冷艳套装，拎爱马仕，与狗仔图里「酒店女子」同一个人。", show: "npc" },
    { speaker: "刘姐", text: "「我是刘婉，肖战的表姐，也是他的艺术经纪人。……方便进去说话吗？」她语气公事公办，眼神却不锋利。", show: "npc" },
    { speaker: "isapara", text: "我攥着刮刀，指节发白：「是他让你来的？还是来买断我闭嘴？」", show: "heroine" },
    { speaker: "刘姐", text: "「来救一个傻子。」她把平板推过来——里面是展览策划书：【轨迹 · isapara 个人展】，出资方匿名，执行人：刘婉。", show: "npc" },
    { speaker: "刘姐", text: "「酒店那晚，他在跟品牌签你的展期。通稿不能写恋爱，写了你就被网暴撕碎。他宁可被骂凉薄，也不肯把你推上台前。」" },
    { speaker: "刘姐", text: "「他没对你发过脾气——连那次被公司罚跪三小时，出来第一件事，是问你的画有没有受潮。」", show: "npc" },
    { speaker: "isapara", text: "我鼻子一酸，几乎握不住平板。原来最狠的刀，从来不是他的怒，而是我擅自替他下的判决。", show: "heroine" },
    {
      type: "choice",
      prompt: "真相揭开，你的心却还在流血。",
      options: [
        { text: "跟刘姐去见他", effects: { affection: 12, trust: 18, stress: 6 }, flag: "go_see_him" },
        { text: "「让他自己来解释。」", effects: { affection: 6, trust: 10, stress: 12 }, flag: "wait_apology" },
        { text: "「我不需要施舍的展览。」", effects: { affection: -5, trust: 0, stress: 15 }, flag: "reject_gift" },
      ],
    },
    { needFlag: "go_see_him", chapter: "ch7", bg: "museum", speaker: "肖战", text: "博物馆空厅，他站在未完成的展墙前，眼下青黑，声音沙得厉害：「对不起。……我来晚了。」", show: "hero" },
    { needFlag: "go_see_him", speaker: "肖战", text: "他没有辩解公司，没有甩锅经纪人。只说：「你是我唯一想站在旁边的人。双洁不是口号，是我从来没给别人留过位置。」", show: "both" },
    { needFlag: "wait_apology", speaker: "肖战", text: "深夜，他站在工作室门外淋着雨，没有闯进来：「isapara，我把电话打到你门口。……你不开门，我不走。」", show: "hero" },
    { needFlag: "wait_apology", speaker: "isapara", text: "卷卷对着门缝喵了很久。我开门时，他浑身湿透，却把策划书护在怀里一滴没沾。", show: "heroine" },
    { needFlag: "reject_gift", speaker: "isapara", text: "我把策划书退回。可凌晨四点，展厅灯光却亮——他一个人在做布展，背影在玻璃上晃，像极当年守着空白画布不肯睡的我。", show: "heroine" },
    { needFlag: "reject_gift", speaker: "刘姐", text: "「他不让我告诉你。」刘姐叹气，「布展清单上只有你的画名，没有他的绯闻。」", show: "npc" },
    { needFlag: "angst_block", speaker: "刘姐", text: "刘姐在门外站了很久：「他被我骂了一顿才敢来。……你要不要，至少听他把展册翻开？」", show: "npc" },
    { blockFlag: "angst_block", needFlag: "go_see_him", speaker: "isapara", text: "我跟着刘姐走进空厅。肖战抬头时，像怕惊动一幅未干的画。", show: "heroine" },

    // --- 第八章 · HE 铺垫 ---
    { type: "chapter", chapter: "ch8", title: "第八章 · 轨迹展览会", text: "—— 开展当日 ——" },
    { chapter: "ch8", bg: "exhibition", speaker: "刘姐", text: "「媒体在门外。肖战申请了十分钟致辞权限——公司终于松口。」刘姐递来耳麦，「他只说真话，你准备好。」", show: "npc" },
    { speaker: "肖战", text: "他在麦克风前鞠躬，声音稳：「这幅画师，把我从雨里找回来。……我想公开感谢她，也公开爱她。1v1，从过去到以后。」", show: "hero" },
    { speaker: "isapara", text: "闪光灯炸开。我本能后退，他下台，在众目下握住我的手——掌心仍是颜料与可可混合的气味。", show: "both" },
    {
      type: "choice",
      prompt: "结局前夕，你要如何回应全世界？",
      options: [
        { text: "握紧他的手，一起面对镜头", effects: { affection: 15, trust: 15, rumor: 10 }, flag: "he_hand" },
        { text: "「先听完我的一句话。」当众致辞", effects: { affection: 12, trust: 18, stress: 8 }, flag: "he_speech" },
        { text: "拉他进画框后的阴影里亲吻", effects: { affection: 18, trust: 12, rumor: 12 }, flag: "he_kiss" },
      ],
    },
    { needFlag: "he_hand", speaker: "isapara", text: "我握紧他的手，指节相贴，颜料与可可的气味缠在一起。我对镜头说：「我七岁学画，是想把光留住。二十七岁，我敢站在光里了。」", show: "both" },
    { needFlag: "he_speech", speaker: "isapara", text: "我按住他手腕，先对镜头开口：「我是画师 isapara。雨是我画的，爱是我选的。……剩下的，请他来说。」", show: "heroine" },
    { needFlag: "he_speech", speaker: "肖战", text: "他接过话筒，只说一句：「我选她。从前、现在、以后。」", show: "hero" },
    { needFlag: "he_kiss", speaker: "isapara", text: "闪光灯太亮，我拉他进画框后的阴影。吻落下时，听见场外一声惊呼——像雨终于落到了该落的地方。", show: "both" },
    { blockFlag: "he_hand", blockFlags: ["he_speech", "he_kiss"], speaker: "isapara", text: "记者追问时，我笑着没答全。可掌心紧扣的那只手，已经替世界作了答。", show: "both" },

    // --- 终章 ---
    { type: "chapter", chapter: "epilogue", title: "终章 · 共生之光", text: "—— 一年后 ——" },
    { chapter: "epilogue", bg: "dawn", speaker: "isapara", text: "「轨迹」巡展最后一站。工作室扩成两层，二楼是他的秘密画室——门口牌子写着 Z 与 I。卷卷这只胖猫蹲在牌子上方，尾巴扫来扫去，像一面毛茸茸的小旗。", show: "heroine" },
    { speaker: "肖战", text: "他从巡演赶回，鬓角还沾着舞台彩带：「今晚不走了。……教你画日出，换你教我省电。」", show: "hero" },
    { needFlag: "stay_secret", blockFlag: "go_public", speaker: "isapara", text: "窗外真的在下雨。我们没在镜头前亲吻，只在雨里并肩。卷卷蹭着我们两人的鞋边——像小小的见证。", show: "both" },
    { needFlag: "go_public", speaker: "isapara", text: "窗外真的在下雨。热搜仍在涨，我们却第一次不用躲。卷卷胖得挤不进窗缝，仍努力把脑袋塞进来。", show: "both" },
    { blockFlag: "stay_secret", blockFlags: ["go_public"], speaker: "isapara", text: "窗外真的在下雨。我们并排站在窗前，雨丝落在玻璃上，像无数条未干的线。卷卷蹭着我们两人的鞋边。这一次，不用匿名，也不用躲。", show: "both" },
    { speaker: "旁白", text: "故事落笔处，是共生之光。", show: "none" },
    { type: "ending" },
  ],
};

const ENDINGS = [
  {
    id: "he",
    title: "结局 · 共生之光（HE）",
    condition: (s) =>
      !s.flags.reject_gift &&
      !s.flags.hurt_self &&
      !s.flags.angst_block &&
      s.affection >= 28 &&
      s.trust >= 26 &&
      (s.flags.he_hand || s.flags.he_speech || s.flags.he_kiss || s.flags.love_ok),
    text: "一年后，你与肖战在双人画展上并肩剪彩。卷卷在工作室看门，展结束就扑进你怀里——沉甸甸、毛茸茸的一团。他仍站在热搜顶端，却把时间切成两半——一半给舞台，一半给你。雨仍常下，你们常在雨里作画。",
    bgClass: "ending-true",
  },
  {
    id: "secret_he",
    title: "结局 · 雨里的名字（隐婚 HE）",
    condition: (s) =>
      s.flags.stay_secret &&
      !s.flags.go_public &&
      !s.flags.reject_gift &&
      s.affection >= 24 &&
      s.trust >= 28 &&
      (s.flags.love_ok || s.flags.he_hand || s.flags.he_speech),
    text: "你们没有在镜头前亲吻，却把戒指戴在画具柜最里层。外界仍猜他单身，你知道真相在雨夜的后巷、在画灯亮三下的时候。卷卷胖了，你们也胖了彼此的人生。",
    bgClass: "ending-secret",
  },
  {
    id: "bitter_wait",
    title: "结局 · 雨停之后",
    condition: (s) =>
      s.flags.wait_apology &&
      !s.flags.angst_block &&
      s.affection >= 18 &&
      s.trust >= 20,
    text: "你让他淋了六小时的雨，才开门。他没说委屈，只递来烘干的本子——里面全是你被撕掉那一角的修补稿。展览照常开幕，你们在人群里牵手，却比任何时候都更小心。HE，只是来得晚了一点。",
    bgClass: "ending-secret",
  },
  {
    id: "cold_start",
    title: "结局 · 只谈画",
    condition: (s) =>
      s.flags.ch1_cold &&
      s.affection < 22 &&
      s.trust < 20 &&
      !s.flags.love_ok,
    text: "你始终把距离握得很紧。他尊重「只谈画」，合作却一年比一年默契。粉丝不知道你的名字，业内却开始传：肖战的封面，只有你能画那场雨。",
    bgClass: "ending-normal",
  },
  {
    id: "misunderstand",
    title: "结局 · 错过的雨",
    condition: (s) => s.flags.reject_gift || (s.flags.pause_meet && s.affection < 15),
    text: "你退回策划书，也退回他。展览仍开，署名却是空白。多年后新闻里，他仍是一人。你工作室的灯还亮到深夜——雨题仍画得很好，只是再也没人递来第二杯可可。",
    bgClass: "ending-missed",
  },
  {
    id: "heartbreak",
    title: "结局 · 碎瓷片",
    condition: (s) =>
      (s.flags.hurt_self && s.trust < 15) ||
      (s.flags.angst_block && s.trust < 12),
    text: "撕掉的那一角最终被补好，可你拒绝去看展。他站在空厅对着补好的画沉默很久，没有发火，只留下一束干向日葵。你后来看见花，哭了——但仍没回消息。",
    bgClass: "ending-burnout",
  },
  {
    id: "public_burn",
    title: "结局 · 曝光之后",
    condition: (s) => s.flags.go_public && s.rumor >= 20 && s.stress >= 22 && s.affection >= 15,
    text: "你们公开了，舆论却像海啸。他护着你退圈半年，你护着他重新拿起画笔。爱还在，只是遍体鳞伤。——这算另一种相守，不算圆满 HE。",
    bgClass: "ending-breakup",
  },
  {
    id: "love_wait_end",
    title: "结局 · 三个月之后",
    condition: (s) => s.flags.love_wait && !s.flags.love_ok && s.affection >= 20 && s.trust >= 22,
    text: "你在第三个月最后一天去敲他的门。他开门时眼眶发红：「我等满了。……一天都没少。」你们没有盛大的宣言，只在画室交换了下一幅合作草图——像交换未来。",
    bgClass: "ending-true",
  },
  {
    id: "normal",
    title: "结局 · 平凡之路",
    condition: () => true,
    text: "故事没有走向最亮的那条线。你继续接稿，他继续巡演。偶尔在杂志封面看见他，你会停一秒，然后给颜料挤出一道新的蓝。雨还会下，画还会干。",
    bgClass: "ending-normal",
  },
];
