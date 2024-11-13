export const loseDataList = [
  {
    itemAndFeature: "跌落测试不合格",
    loseMode: ["塑胶件断裂"],
    loseModeResult: ["1.上下手柄裂开", "2.有可能碰到带电体", "3.安全问题"],
    severity: "10",
    classification: "A",
    failureReason: ["1.扣位强度不够--设计", "2.材料强度不够"],
    prevention: ["1.加强扣拉", "2.严格按照设计要求，选择合格材料", "3.结构上有手柄装饰圈和前管圈包住"],
    recommendedAction: "",
    resUserAndFinishDate: "",
    confirmResult: ""
  },
  {
    itemAndFeature: "手柄表面缩水,分模面批/变形等外观不良",
    loseMode: ["手柄表面缩水,分模面批锋/ 变形等外观不良"],
    loseModeResult: ["客户体验差"],
    severity: "5",
    classification: "B",
    failureReason: ["1.零件模具设计和加工不良", "2.零件结构设计不良", "3.零件注塑成型条件不良或注塑机设备不良"],
    prevention: [
      "1.模具要给优秀供方设计和加工.并充分做好DFM模具评审",
      "2.优化结构设计,不能有尖角出现,结构内部骨厚度设计要合理",
      "3.调试正确注塑成型条件和合适注塑机设备"
    ],
    recommendedAction: "",
    resUserAndFinishDate: "",
    confirmResult: ""
  },
  {
    itemAndFeature: "旋钮开关手感松或紧，难操作",
    loseMode: ["开关手感松或紧，难操作"],
    loseModeResult: ["客户体验差"],
    severity: "6",
    classification: "B",
    failureReason: ["1.零件模具设计和加工不良", "2.零件结构设计不良", "3.零件注塑成型条件不良或注塑机设备不良"],
    prevention: [
      "1.模具要给优秀供方设计和加工.并充分做好DFM模具评审",
      "2.优化结构设计,不能有尖角出现,结构内部骨厚度设计要合理",
      "3.调试正确注塑成型条件和合适注塑机设备",
      "4.在2D图纸上定义CTQ并管控"
    ],
    recommendedAction: "",
    resUserAndFinishDate: "",
    confirmResult: ""
  },
  {
    itemAndFeature: "开关档位感不良",
    loseMode: ["开关档位感不良"],
    loseModeResult: ["客户体验差"],
    severity: "6",
    classification: "B",
    failureReason: ["1.零件模具设计和加工不良", "2.零件结构设计不良", "3.零件注塑成型条件不良或注塑机设备不良", "4.弹片力度不正确"],
    prevention: [
      "1.模具要给优秀供方设计和加工.并充分做好DFM模具评审",
      "2.优化结构设计,不能有尖角出现,结构内部骨厚度设计要合理",
      "3.调试正确注塑成型条件和合适注塑机设备",
      "4.选择正确弹片力度，开关环与手柄配合处尺寸要做CPK测量和管控"
    ],
    recommendedAction: "",
    resUserAndFinishDate: "",
    confirmResult: ""
  },
  {
    itemAndFeature: "开关无功能/长通/INT",
    loseMode: ["开关无功能/长通/INT"],
    loseModeResult: ["开关无功能/长通/INT/失效"],
    severity: "8",
    classification: "A",
    failureReason: [
      "1.开关环强度不够或变形造成压不能完全压住开关盖，引起开关不良",
      "2.开关弹片变型造成没有压到PCB铜箔引起无功能",
      "3.开关弹片变型造成长压到PCB铜箔引起无法关机",
      "4.开关弹片材料选择不合理"
    ],
    prevention: [
      "1.模具要给优秀供方设计和加工.并充分做好DFM模具评审",
      "2.优化结构设计,不能有尖角出现,结构内部骨厚度设计要合理",
      "3.调试正确注塑成型条件和合适注塑机设备",
      "4.选择合理弹片材料做验证"
    ],
    recommendedAction: "",
    resUserAndFinishDate: "",
    confirmResult: ""
  },
  {
    itemAndFeature: "开关寿命测试不合格",
    loseMode: ["开关不工作"],
    loseModeResult: ["开关失效"],
    severity: "9",
    classification: "A",
    failureReason: [
      "1.开关环强度不够或变形造成压不能完全压住开关盖，引起开关不良",
      "2.开关弹片变型造成没有压到PCB铜箔引起无功能",
      "3.开关弹片变型造成长压到PCB铜箔引起无法关机",
      "4.开关弹片材料选择不合理"
    ],
    prevention: [
      "1.模具要给优秀供方设计和加工.并充分做好DFM模具评审",
      "2.优化结构设计,不能有尖角出现,结构内部骨厚度设计要合理",
      "3.调试正确注塑成型条件和合适注塑机设备",
      "4.选择合理弹片材料做验证"
    ],
    recommendedAction: "",
    resUserAndFinishDate: "",
    confirmResult: ""
  },
  {
    itemAndFeature: "配件锁环体验差",
    loseMode: ["1.配件锁环拉力太大", "2.配件锁环弹力不够"],
    loseModeResult: ["客户体验差"],
    severity: "5",
    classification: "B",
    failureReason: [
      "1.配件弹簧力度太大或太小",
      "2.弹簧材料选择不合理",
      "3.前管圈和手柄和配件锁环变形造成摩擦力加大，引起锁环力度加大",
      "4.连接轴变形造成摩擦力加大，引起锁环力度加大",
      "5.喷油太多引起锁环力度加大"
    ],
    prevention: [
      "1.选择优秀模具供方设计和加工",
      "2.选择合理弹簧材料做验证",
      "3.选择优秀供方注塑,严格控制各零件注塑尺寸公差要求",
      "4.选择优秀供方喷油,严格控制各零件喷油尺寸公差要求"
    ],
    recommendedAction: "",
    resUserAndFinishDate: "",
    confirmResult: ""
  },
  {
    itemAndFeature: "配件装配体验差，拆装力度不合格",
    loseMode: ["1.配件装配困难，对位困难", "2.配件装配松或紧"],
    loseModeResult: ["客户体验差"],
    severity: "5",
    classification: "B",
    failureReason: ["1.配件装配没有对好位置，不好组装", "2.配件连接轴变型，造成装配松紧", "3.结构设计不良"],
    prevention: [
      "1.选择优秀模具供方设计和加工",
      "2.配件连接轴上增加装配丝印",
      "3.选择优秀供方注塑,严格控制各零件注塑尺寸公差要求",
      "4.合理的卡骨设计以及导槽路径设计"
    ],
    recommendedAction: "",
    resUserAndFinishDate: "",
    confirmResult: ""
  },
  {
    itemAndFeature: "配件：配件吊重不合格",
    loseMode: ["1.配件整个脱落", "2.配件链接轴脱落"],
    loseModeResult: ["配件强度达不到客户要求"],
    severity: "5",
    classification: "B",
    failureReason: ["1.结构设计不良", "2.材料强度不够", "3.注塑生产不良"],
    prevention: ["1.合理的结构设计（导槽大小设计/螺丝数量和位置设计/卡骨设计）。", "2.合理选择材料", "3.选择优秀供方注塑,严格控制各零件注塑尺寸公差要求"],
    recommendedAction: "",
    resUserAndFinishDate: "",
    confirmResult: ""
  },
  {
    itemAndFeature: "客户铭牌脱落不良",
    loseMode: ["客户名牌脱落或粘性差不良"],
    loseModeResult: ["客户体验差"],
    severity: "5",
    classification: "B",
    failureReason: ["1.客户铭牌粘性差", "2.客户铭牌变形粘不好", "3.手柄变形导致粘性差"],
    prevention: ["1.选择优秀供方设计和加工", "2.严格控制零件尺寸公差"],
    recommendedAction: "",
    resUserAndFinishDate: "",
    confirmResult: ""
  },
  {
    itemAndFeature: "冷风开关不良",
    loseMode: ["温风开关盖卡死或松动"],
    loseModeResult: ["冷风开关/失效或客户体验差"],
    severity: "8",
    classification: "A",
    failureReason: [
      "1.冷风开关盖不良引起卡死或松动",
      "2.冷风开关不良引起卡死或松动",
      "3.装配不良引起",
      "4.冷风开关存在凸台，有几率在按压时与大身或开关壳干涉卡死"
    ],
    prevention: [
      "1.选择优秀供方加工和生产零件.严格控制生产尺寸公差",
      "2.优化结构设计,选择合理零件材料",
      "3.调试正确注塑成型条件和合适注塑机设备",
      "4.设计是开关与大身和开关壳避免面与面接触，并做到间隙0.2mm以上"
    ],
    recommendedAction: "",
    resUserAndFinishDate: "",
    confirmResult: ""
  },
  {
    itemAndFeature: "转尾转动松或紧，难操作",
    loseMode: ["转尾转动松或紧，难操作"],
    loseModeResult: ["客户体验差"],
    severity: "5",
    classification: "B",
    failureReason: ["1.零件模具设计和加工不良", "2.零件结构设计不良", "3.零件注塑成型条件不良或注塑机设备不良"],
    prevention: ["1.模具要给优秀供方设计和加工.并充分做好DFM模具评审", "2.优化结构设计,要验证合理的操作空间", "3.调试正确注塑成型条件和合适注塑机设备"],
    recommendedAction: "",
    resUserAndFinishDate: "",
    confirmResult: ""
  },
  {
    itemAndFeature: "转尾无功能/长通/INT",
    loseMode: ["转尾无功能/长通/INT"],
    loseModeResult: ["转尾无功能/长通/INT/失效"],
    severity: "8",
    classification: "A",
    failureReason: [
      "1.转尾环强度不够或变形造成不良",
      "2.转尾弹片变型造成没有接触到铜针引起无功能",
      "3.转尾弹片变型造成长期接触到铜针引起无法关机",
      "4.转尾弹片材料选择不合理"
    ],
    prevention: [
      "1.模具要给优秀供方设计和加工.并充分做好DFM模具评审",
      "2.优化结构设计,选择合理弹片材料",
      "3.调试正确注塑成型条件和合适注塑机设备",
      "4.选择合理弹片材料做验证"
    ],
    recommendedAction: "",
    resUserAndFinishDate: "",
    confirmResult: ""
  },
  {
    itemAndFeature: "后盖表面会有分模线",
    loseMode: ["后盖表面会有分模线并造成批锋刮手"],
    loseModeResult: ["客户体验差"],
    severity: "5",
    classification: "B",
    failureReason: ["1.产品结构本身会产生分模线", "2.模具设计不良分模线会更严重", "3.注塑成型条件不良分模线会更严重"],
    prevention: [
      "1.模具要给优秀供方设计和加工.并充分做好DFM模具评审",
      "2.调试正确注塑成型条件,FOT要检测重要尺寸并严格控制",
      "3.培训人员正确作业",
      "4.要求客户签上下限样板"
    ],
    recommendedAction: "",
    resUserAndFinishDate: "",
    confirmResult: ""
  },
  {
    itemAndFeature: "可拆进网盖装配紧",
    loseMode: ["安装或拆卸紧，拆装困难"],
    loseModeResult: ["客户体验差"],
    severity: "5",
    classification: "B",
    failureReason: ["1.产品设计间隙过小或过盈", "2.外形设计时未预留拆装手的发力位置", "3.零件模具设计和加工不良", "零件注塑成型条件不良或注塑机设备不良"],
    prevention: [
      "1.产品结构间隙应做到大于0.2mm",
      "2.外形及结构设计时应考虑预留拆装手的发力位置",
      "3.具要给优秀供方设计和加工.并充分做好DFM模具评审",
      "4.调试正确注塑成型条件和合适注塑机设备"
    ],
    recommendedAction: "",
    resUserAndFinishDate: "",
    confirmResult: ""
  },
  {
    itemAndFeature: "隔热筒和马达架装配不良",
    loseMode: ["1.震机", "2.松动及异响", "3.装配不良"],
    loseModeResult: ["客户体验差"],
    severity: "8",
    classification: "B",
    failureReason: ["1.装配没有对好位置，不好组装", "2.零件结构设计不良"],
    prevention: ["优化结构设计,合理的卡骨设计以及导槽路径设计"],
    recommendedAction: "",
    resUserAndFinishDate: "",
    confirmResult: ""
  },
  {
    itemAndFeature: "马达震机",
    loseMode: ["1.马达本体震", "2.马达与塑胶壳产生共震"],
    loseModeResult: ["客户体验差"],
    severity: "8",
    classification: "A",
    failureReason: ["1.马达不良引起振动", "2.结构设计不良造成马达与塑胶共震"],
    prevention: ["1.选择优质元件供应商", "2.结构上增加了一个减震硅胶罩套住马达"],
    recommendedAction: "",
    resUserAndFinishDate: "",
    confirmResult: ""
  },
  {
    itemAndFeature: "整机寿命测试",
    loseMode: ["达不到客户要求"],
    loseModeResult: ["达不到客户要求,无法使用"],
    severity: "10",
    classification: "A",
    failureReason: ["1.马达质量问题", "2.线架线路设计不良", "3.Fuse/跳制/线路板/开关等重要元件失效"],
    prevention: ["1.选择优质元件供应商", "2.优化PCB设计与合理走线", "3.优化线架电路设计"],
    recommendedAction: "",
    resUserAndFinishDate: "",
    confirmResult: ""
  },
  {
    itemAndFeature: "整机功率高于范围",
    loseMode: ["功率高于实际功率100W"],
    loseModeResult: ["发红，出风温度过高"],
    severity: "10",
    classification: "A",
    failureReason: ["发热线阻值偏低"],
    prevention: ["绕发热线时将阻值设置在公差范围"],
    recommendedAction: "",
    resUserAndFinishDate: "",
    confirmResult: ""
  },
  {
    itemAndFeature: "整机功率低于范围",
    loseMode: ["功率低于实际功率100W"],
    loseModeResult: ["出风温度低，干燥率低"],
    severity: "10",
    classification: "A",
    failureReason: ["发热线阻值偏高"],
    prevention: ["绕发热线时将阻值设置在公差范围"],
    recommendedAction: "",
    resUserAndFinishDate: "",
    confirmResult: ""
  },
  {
    itemAndFeature: "风速低",
    loseMode: ["风量低于2.4m/s"],
    loseModeResult: ["客人体验感不好"],
    severity: "8",
    classification: "B",
    failureReason: ["转速低于范围"],
    prevention: ["选择成熟设计的风叶与马达"],
    recommendedAction: "",
    resUserAndFinishDate: "",
    confirmResult: ""
  },
  {
    itemAndFeature: "风压低",
    loseMode: ["风压低于65g"],
    loseModeResult: ["客人体验感不好"],
    severity: "8",
    classification: "B",
    failureReason: ["转速低于范围"],
    prevention: ["选择成熟设计的风叶与马达"],
    recommendedAction: "",
    resUserAndFinishDate: "",
    confirmResult: ""
  },
  {
    itemAndFeature: "噪音高",
    loseMode: ["噪音高于84db+/- 5%db"],
    loseModeResult: ["噪音太大，声音刺耳"],
    severity: "8",
    classification: "B",
    failureReason: ["1.风叶振", "2.马达转速高过规格要求"],
    prevention: ["1.风叶调试动平衡", "2.降压线阻值在范围内"],
    recommendedAction: "",
    resUserAndFinishDate: "",
    confirmResult: ""
  },
  {
    itemAndFeature: "开关无作用",
    loseMode: ["1.无作用", "1.无法通过10000次测试"],
    loseModeResult: ["1.产品无功能", "2.不符合安规要求"],
    severity: "10",
    classification: "A",
    failureReason: ["1.开关组装卡死或推不到位", "2.开关选型错误"],
    prevention: ["1.选择正确行程与适用电流的开关", "2.选择正确电压电流的开关与成熟供应商的开关"],
    recommendedAction: "",
    resUserAndFinishDate: "",
    confirmResult: ""
  },
  {
    itemAndFeature: "无保护作用",
    loseMode: ["无动作"],
    loseModeResult: ["非测试正常着火"],
    severity: "10",
    classification: "A",
    failureReason: ["保险额定温度超实际温度"],
    prevention: ["线架设计时做温度保险余量验证，温度保险温度选型与位置设计放在合理的位置上"],
    recommendedAction: "",
    resUserAndFinishDate: "",
    confirmResult: ""
  },
  {
    itemAndFeature: "不通电",
    loseMode: ["线芯全断或超10%"],
    loseModeResult: ["1.产品无功能", "2.不符合安规要求"],
    severity: "10",
    classification: "A",
    failureReason: [
      "1.转尾环强度不够或变形造成不良",
      "2.转尾弹片变型造成没有接触到铜针引起无功能",
      "3.转尾弹片变型造成长期接触到铜针引起无法关机",
      "4.转尾弹片材料选择不合理",
      "5、电源线绝缘层硬度不合理"
    ],
    prevention: ["1.选择同类产品合格的电线硬度", "2.按照成熟方案设计"],
    recommendedAction: "",
    resUserAndFinishDate: "",
    confirmResult: ""
  },
  {
    itemAndFeature: "温度不在范围",
    loseMode: ["温度不在范围"],
    loseModeResult: ["温度过高或过低"],
    severity: "8",
    classification: "C",
    failureReason: ["1.发热线阻值不在范围", "2.马达转速不在规格内"],
    prevention: ["1.组装前测试发热线电阻值在规格内", "2.选择正确转速的马达"],
    recommendedAction: "",
    resUserAndFinishDate: "",
    confirmResult: ""
  },
  {
    itemAndFeature: "PCBA组合功能操作异常",
    loseMode: ["关键元器件开路、短路"],
    loseModeResult: ["1.主要功能失效", "2.温度失控", "3.不能使用"],
    severity: "7",
    classification: "B",
    failureReason: ["1.电子元器件失效", "2.外界干扰"],
    prevention: ["1.采用常用已成熟使用的电子器件", "2.PCB做抗干扰设计"],
    recommendedAction: "",
    resUserAndFinishDate: "",
    confirmResult: ""
  },
  {
    itemAndFeature: "PCBA组合装配异常",
    loseMode: ["PCB 板材尺寸或元件尺寸同结构件装配有干涉"],
    loseModeResult: ["1.按键不良", "2.轻微顶外壳", "3.无法装配"],
    severity: "5",
    classification: "A",
    failureReason: ["1.PCB LAYOUT 设计缺陷", "2.供应商来料尺寸不在设计范围内", "结构与电子公差未明确"],
    prevention: ["1.按结构工程师给的PCB 空间尺寸设计", "2.选用本公司成熟尺寸标准元件"],
    recommendedAction: "",
    resUserAndFinishDate: "",
    confirmResult: ""
  },
  {
    itemAndFeature: "过欠压保护",
    loseMode: ["安全保护"],
    loseModeResult: ["马达不工作"],
    severity: "",
    classification: "",
    failureReason: ["1.日本过压保护130V左右，欠压保护75V左右", "2.欧规过压保护250V左右，欠压保护175V左右"],
    prevention: ["程序控制在范围内"],
    recommendedAction: "",
    resUserAndFinishDate: "",
    confirmResult: ""
  },
  {
    itemAndFeature: "温控器早跳",
    loseMode: ["一下热风一下冷风"],
    loseModeResult: ["客户体验差"],
    severity: "",
    classification: "",
    failureReason: ["1.温控器选位置不对", "2.温控器选型不对"],
    prevention: ["1.调整位置选位置不对", "2.温控器增加度数"],
    recommendedAction: "",
    resUserAndFinishDate: "",
    confirmResult: ""
  },
  {
    itemAndFeature: "板温温度高",
    loseMode: ["1.美标超过100℃", "2.欧标超过110℃"],
    loseModeResult: ["客户体验差，易烫头发"],
    severity: "",
    classification: "",
    failureReason: ["1.功率设定过高", "2.风嘴前期设计过窄"],
    prevention: ["1.调低设计功率", "2.改流畅风嘴结构"],
    recommendedAction: "",
    resUserAndFinishDate: "",
    confirmResult: ""
  }
];
