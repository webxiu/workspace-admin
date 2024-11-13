export const dataListConfig = [
  {
    groupName: "一、产品特点",
    key: "table1",
    children: [
      { seq: 1, checkItem: "一、产品特点", checkContent: "明确产品材料(含牌号)及其特性，缩水率是否正确?", userCheckSelf: "", buildAudit: "" },
      { seq: 2, checkItem: "一、产品特点", checkContent: "产品的表面要求和后处理要求?对模具有何影响和要求?", userCheckSelf: "", buildAudit: "" },
      { seq: 3, checkItem: "一、产品特点", checkContent: "是否有足够脱模斜度?", userCheckSelf: "", buildAudit: "" },
      { seq: 4, checkItem: "一、产品特点", checkContent: "是否有深骨或深柱?", userCheckSelf: "", buildAudit: "" },
      { seq: 5, checkItem: "一、产品特点", checkContent: "产品胶厚是否均匀?", userCheckSelf: "", buildAudit: "" },
      { seq: 6, checkItem: "一、产品特点", checkContent: "产品分型线在哪里?前后模方向是否确定?", userCheckSelf: "", buildAudit: "" },
      { seq: 7, checkItem: "一、产品特点", checkContent: "产品是否会吸前模或滑块?", userCheckSelf: "", buildAudit: "" },
      {
        seq: 8,
        checkItem: "一、产品特点",
        checkContent: "产品的重要尺寸模具设计时怎样保证其精度? 有单向公差要求的尺寸，是否将3D 图改为中间值?",
        userCheckSelf: "",
        buildAudit: ""
      },
      { seq: 9, checkItem: "一、产品特点", checkContent: "产品是否有装配干涉?(当客户有3D 组件图时需检查)", userCheckSelf: "", buildAudit: "" },
      { seq: 10, checkItem: "一、产品特点", checkContent: "客户其他特殊特性要求?", userCheckSelf: "", buildAudit: "" },
      { seq: 11, checkItem: "一、产品特点", checkContent: "是否用的最新版本的产品3D 图?", userCheckSelf: "", buildAudit: "" },
      { seq: 12, checkItem: "一、产品特点", checkContent: "是否将所有问题点记录下来?", userCheckSelf: "", buildAudit: "" }
    ]
  },
  {
    groupName: "二、模具标准",
    key: "table2",
    children: [
      { seq: 13, checkItem: "二、模具标准", checkContent: "模架标准：龙记还是其他标准?", userCheckSelf: "", buildAudit: "" },
      { seq: 14, checkItem: "二、模具标准", checkContent: "标准件标准：英制还是公制?DME 、HASCO、盘起、MISUMI 、LKM?", userCheckSelf: "", buildAudit: "" },
      { seq: 15, checkItem: "二、模具标准", checkContent: "模具等级(模具寿命)?", userCheckSelf: "", buildAudit: "" },
      {
        seq: 16,
        checkItem: "二、模具标准",
        checkContent: "模架材料、内模主料是什么?(材料的选择要考虑胶料的特性、模具寿命、模具大小与复杂程度、型腔表面要求、工作温度等因素)。",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 17,
        checkItem: "二、模具标准",
        checkContent: "热流道：确定什么供应商，YUDO 、MOLDMASTER 、HASCO 、HUSKY 、HEITEC 、INCOE 等?",
        userCheckSelf: "",
        buildAudit: ""
      },
      { seq: 18, checkItem: "二、模具标准", checkContent: "螺丝与吊模孔标准：公制(MM) 、美制(UNC) 还是英制(BSW)?", userCheckSelf: "", buildAudit: "" },
      { seq: 19, checkItem: "二、模具标准", checkContent: "运水接头标准：DME、HASCO 还是其他?", userCheckSelf: "", buildAudit: "" },
      { seq: 20, checkItem: "二、模具标准", checkContent: "德龙提供的其他模具标准，是否遵从?", userCheckSelf: "", buildAudit: "" }
    ]
  },
  {
    groupName: "三、模具结构：安全、可靠、紧凑、方便",
    key: "table3",
    children: []
  },
  {
    groupName: "1、moldflow 、排位与注塑机选择",
    key: "table4",
    children: [
      {
        seq: 21,
        checkItem: "1、moldflow 、排位与注塑机选择",
        checkContent: "Moldflow ：是需模流分析报告? *对于透明产品，一定不能有气泡，尤其是胶厚的地方容易产生。因此最好做模流分析，以便调整浇口或胶厚。",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 22,
        checkItem: "1、moldflow 、排位与注塑机选择",
        checkContent:
          "排位：腔数是否正确? 产品摆放方向、间距是否合理? 内模尺寸、模架尺寸是否合理?产品2D 图是否有基准点用于检查产品位置(主要针对异形曲面的产品)?",
        userCheckSelf: "",
        buildAudit: ""
      },
      { seq: 23, checkItem: "1、moldflow 、排位与注塑机选择", checkContent: "排位是否能满足产品后处理要求?", userCheckSelf: "", buildAudit: "" },
      {
        seq: 24,
        checkItem: "1、moldflow 、排位与注塑机选择",
        checkContent: "是否为客供的注塑机规格? 是否将注塑机平面图插入到模具结构图中，并注明注塑机规格?",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 25,
        checkItem: "1、moldflow 、排位与注塑机选择",
        checkContent: "排位图是否注明模顶方向、操作员侧、模架基准角?",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 26,
        checkItem: "1、moldflow 、排位与注塑机选择",
        checkContent: "模板厚度要保证码模槽与水咀不干涉。",
        userCheckSelf: "",
        buildAudit: ""
      }
    ]
  },
  {
    groupName: "2、分模设计",
    key: "table5",
    children: [
      {
        seq: 27,
        checkItem: "2、分模设计",
        checkContent:
          "分型面：A、位置是否正确?B、分型面上至少有一个平面，以便检测核对和后序加工碰数(如电火花加工)。C、封胶位10~15mm( 宽)，碰穿位6~8mm( 宽)封胶，其余做0.3~0.5mm( 深)避空位。模板上是否已增加支撑块(小模可不用支撑块)?",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 28,
        checkItem: "2、分模设计",
        checkContent: "模仁：A、大模仁是否为压紧式?是否有吊模孔?是否偏框?B、是否设计了基准角?(方向一般与模架保持一致)",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 29,
        checkItem: "2、分模设计",
        checkContent:
          "镶件：A、胶位部分哪些位置考虑做镶件?B、深骨是否考虑做两半镶件?C、擦穿位、枕位、碰穿位是否需要做镶件?是否能将擦穿改为枕穿?D、后模潜水口，尤其是大模，一定要做镶件。E、镶件是否有装配防错特征?",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 30,
        checkItem: "2、分模设计",
        checkContent:
          "零件的加工性：A、零件的设计是否便于零件加工?B、加工方法是否最快捷? 是否优先选用CNC( 直接加工，非铜公)、线切割、磨床等直接加工方式。C、加工方法是否能满足产品的精度要求?D、是否考虑了加工参数，如刀具长度、直径等?E、淬火内模料是否避免了尖角?以免淬火开裂。",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 31,
        checkItem: "2、分模设计",
        checkContent: "模具零件名是否按规定命名?是否有铸件?",
        userCheckSelf: "",
        buildAudit: ""
      }
    ]
  },
  {
    groupName: "3、模具动作",
    key: "table6",
    children: [
      {
        seq: 32,
        checkItem: "3、模具动作",
        checkContent: "有几个斜顶动作?每个斜顶结构是否合理?斜顶角度与胶位深度、顶出行程是否匹配?当斜顶承受较大顶出力时，结构是否可靠?产品是否吸斜顶?",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 33,
        checkItem: "3、模具动作",
        checkContent:
          "有几个滑块动作?(包括斜弹、油缸抽芯等)滑块的封胶、定位、导向、限位、锁紧、耐磨块等是否OK? 斜弹是否有拉钩?前模滑块的动作是否可靠?当行位包紧力非常大时，斜导柱强度是否足够?",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 34,
        checkItem: "3、模具动作",
        checkContent: "当行位较高时，要降低斜导柱的作力点，以保证行位滑动平稳和保证斜导柱强度。",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 35,
        checkItem: "3、模具动作",
        checkContent: "前后模零件是否有“互扣”?动作是否保证可靠?(如前模滑块插入后模仁内)",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 36,
        checkItem: "3、模具动作",
        checkContent: "所有倒扣所需模具动作是否完全考虑?在图纸上是否表达完整?",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 37,
        checkItem: "3、模具动作",
        checkContent: "三板模动作是否正确?限位行程是否合理?水口边长度是否足够?",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 38,
        checkItem: "3、模具动作",
        checkContent: "所有模板开模顺序、合模顺序是否正确?是否可靠?",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 39,
        checkItem: "3、模具动作",
        checkContent: "扣唧选择是否合理?是否为客户所需?",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 40,
        checkItem: "3、模具动作",
        checkContent: "运动部件在整个运动过程中是否会与其他零件干涉?(如斜弹与顶针)",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 41,
        checkItem: "3、模具动作",
        checkContent: "有动作顺序要求的油缸需要安全开关，如果需要自锁则需增加保压阀。无动作要求的油缸可采用机械锁。",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 42,
        checkItem: "3、模具动作",
        checkContent: "内行位(胶位投影面积较大)尽可能采用整体式，因镶嵌式中头和座反向受力。内行位胶位如果是扣非孔，则一定要注意扣位能从模仁中顶出来。",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 43,
        checkItem: "3、模具动作",
        checkContent: "隧道行位要保证有足够空间装入。",
        userCheckSelf: "",
        buildAudit: ""
      }
    ]
  },
  {
    groupName: "4、浇注系统",
    key: "table7",
    children: [
      {
        seq: 44,
        checkItem: "4、浇注系统",
        checkContent: "客户要求热流道(是普通型还是针阀式?是否客供?)还是冷流道?热流道模面板上是否增加了隔热板?",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 45,
        checkItem: "4、浇注系统",
        checkContent: "定位环类型、外径是否正确?",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 46,
        checkItem: "4、浇注系统",
        checkContent: "唧咀类型、球头半径是否正确?用于卧式注塑机延长唧咀中间孔不得小于80mm ，深度不得超过100mm 。否则，按客户注塑机规格确定。",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 47,
        checkItem: "4、浇注系统",
        checkContent: "流道形状、尺寸是否合理?是否有截面尺寸图?是否会影响产品后处理(如丝印、电镀、烫金等)?是否有冷料井?",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 48,
        checkItem: "4、浇注系统",
        checkContent: "冷流道水口料是否能全自动脱落?掉落时是否会被栓打螺丝、滑块斜顶挡住?",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 49,
        checkItem: "4、浇注系统",
        checkContent: "浇口位置(内应力是否会引起产品明显变形?)、数量、类型、尺寸是否合理?",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 50,
        checkItem: "4、浇注系统",
        checkContent: "浇注系统流动是否平衡?",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 51,
        checkItem: "4、浇注系统",
        checkContent: "水口拉针头部形状是否合理?",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 52,
        checkItem: "4、浇注系统",
        checkContent: "带分流板的热流道系统部分(包括模板)是否为一个整体，且有保护热咀的导柱。",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 53,
        checkItem: "4、浇注系统",
        checkContent: "点浇口位是否有凹坑，背面是否有凸位。",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 54,
        checkItem: "4、浇注系统",
        checkContent: "热流道系统中，出线槽不得有利角，电源线和感温线要用压线块压住。模图一定要带接线盒，订购时一并订购。",
        userCheckSelf: "",
        buildAudit: ""
      }
    ]
  },
  {
    groupName: "5、温控系统",
    key: "table8",
    children: [
      {
        seq: 55,
        checkItem: "5、温控系统",
        checkContent:
          "无特殊说明，尽可能不使用密封圈，而采用直通式，模板和镶件分接运水。如果实在要用密封圈，则密封圈与槽一定匹配，定义后及时修改槽尺寸，且水路尽可能短。",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 56,
        checkItem: "5、温控系统",
        checkContent: "定位环类型、外径是否正确?",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 56,
        checkItem: "5、温控系统",
        checkContent: "明确模具需要冷却还是加温(根据材料特性、产品胶厚等决定)?",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 57,
        checkItem: "5、温控系统",
        checkContent: "模顶方向与操作员侧不能有运水接头。除非客户允许。",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 58,
        checkItem: "5、温控系统",
        checkContent: "水咀规格是否正确?是否藏头?",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 59,
        checkItem: "5、温控系统",
        checkContent: "运水直径、位置是否合理?",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 60,
        checkItem: "5、温控系统",
        checkContent: "水塘位置、尺寸是否合理? (不能有尖角，防止应力集中，裂变)",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 61,
        checkItem: "5、温控系统",
        checkContent: "冷却水道到内模边距离不得小于：螺塞长度+3mm 。冷却水道不得与其他孔特征钻破。",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 62,
        checkItem: "5、温控系统",
        checkContent: "冷却水道间距是否均匀?(3D~5D)",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 63,
        checkItem: "5、温控系统",
        checkContent: "冷却水道到产品距离是否一致?(15mm~2D 运水直径)",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 64,
        checkItem: "5、温控系统",
        checkContent: "冷却是否充分?(唧咀是否冷却?)是否需要加铍铜镶件?",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 65,
        checkItem: "5、温控系统",
        checkContent: "加温部位、方式是否合理?密封圈是否注明用耐热型?",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 66,
        checkItem: "5、温控系统",
        checkContent: "热流道模和PC、PMMA 等流动性差的模具是否有隔热板?",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 67,
        checkItem: "5、温控系统",
        checkContent: "热咀浇口位、细水口流道系统，特别是软胶细水口流道系统，都要加运水。",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 68,
        checkItem: "5、温控系统",
        checkContent: "又高又长的侧壁易变形，因此侧壁的两侧都要加运水。",
        userCheckSelf: "",
        buildAudit: ""
      }
    ]
  },
  {
    groupName: "6、顶出系统",
    key: "table9",
    children: [
      {
        seq: 69,
        checkItem: "6、顶出系统",
        checkContent: "顶出方式是否合理?(推板、推块、顶针、司筒、扁顶、二次顶出等等)当后模有整圈深胶位时一定要特别顶出方式，因其包紧力很大。",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 70,
        checkItem: "6、顶出系统",
        checkContent: "前模、滑块是否需要顶出机构?",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 71,
        checkItem: "6、顶出系统",
        checkContent: "顶针位置、尺寸是否合理?",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 72,
        checkItem: "6、顶出系统",
        checkContent: "2.5mm 以下要用托针。托针、扁顶的行程是否足够?且顶针板是否限位?",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 73,
        checkItem: "6、顶出系统",
        checkContent: "顶针是否与其他特征交叉干涉?(如运水、前模斜弹)",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 74,
        checkItem: "6、顶出系统",
        checkContent: "后模顶针是否在后模滑块以下?顶针板是否需要先复位?如顶针板为推拉式则一般可以不用先复位，但要注意试模也必须用推拉式！",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 75,
        checkItem: "6、顶出系统",
        checkContent: "顶针板复位方式是否按客户要求?是否需要顶出接头与复位开关?",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 76,
        checkItem: "6、顶出系统",
        checkContent: "顶针板是否需要中托司导向?",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 77,
        checkItem: "6、顶出系统",
        checkContent: "KO.孔位置是否合理?是否有底板KO. 孔位置图?",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 78,
        checkItem: "6、顶出系统",
        checkContent: "加热油之模具钢材要选好点的，如扁顶、顶针要用SKD61 或SKH51 ，以防擦烧。",
        userCheckSelf: "",
        buildAudit: ""
      }
    ]
  },
  {
    groupName: "7、排气系统",
    key: "table10",
    children: [
      {
        seq: 79,
        checkItem: "7、排气系统",
        checkContent: "2D、3D 结构图是否有排气特征?",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 80,
        checkItem: "7、排气系统",
        checkContent: "所有难排气的地方是否都做了排气?(如深骨位、深柱、流道末端)",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 81,
        checkItem: "7、排气系统",
        checkContent: "排气槽深度是否根据产品材料溢流值选择的?",
        userCheckSelf: "",
        buildAudit: ""
      }
    ]
  },
  {
    groupName: "8、定位",
    key: "table11",
    children: [
      {
        seq: 82,
        checkItem: "8、定位",
        checkContent: "相互运动零件之间是否做了定位?如：前后模仁；AB 板；滑块与内模、滑块与滑块等等。",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 83,
        checkItem: "8、定位",
        checkContent: "固定零件之间定位是否合理?如模板间、内模与模板、镶件与内模。",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 84,
        checkItem: "8、定位",
        checkContent: "斜面锁、虎口、锥度锁的斜度是否比擦穿位的斜度小?",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 85,
        checkItem: "8、定位",
        checkContent: "圆镶件、圆顶针是否需要定位?",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 86,
        checkItem: "8、定位",
        checkContent: "底板是否需要后定位环?外径是否正确?",
        userCheckSelf: "",
        buildAudit: ""
      }
    ]
  },
  {
    groupName: "9、强度",
    key: "table12",
    children: [
      {
        seq: 87,
        checkItem: "9、强度",
        checkContent: "AB 板的强度是否足够?是否易变形?(如果易变形，腔由模胚厂加工)",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 88,
        checkItem: "9、强度",
        checkContent: "模仁料强度是否足够?是否易变形?",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 89,
        checkItem: "9、强度",
        checkContent: "滑块斜顶强度是否足够?是否要加强?",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 90,
        checkItem: "9、强度",
        checkContent: "其他受力零件强度是否足够?(如斜导柱、弹簧、顶针、扁顶针、支撑板等等)",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 91,
        checkItem: "9、强度",
        checkContent: "易损部位是否做成了可换镶件?",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 92,
        checkItem: "9、强度",
        checkContent: "支撑柱是否足够?排布是否均匀?(首先考虑排在中轴线与型腔下)",
        userCheckSelf: "",
        buildAudit: ""
      }
    ]
  },
  {
    groupName: "10、附加特征",
    key: "table13",
    children: [
      {
        seq: 93,
        checkItem: "10、附加特征",
        checkContent: "AB 板间是否有撬模坑?是否需要模角?",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 94,
        checkItem: "10、附加特征",
        checkContent: "吊模孔是否正确?码模坑是否正确?",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 95,
        checkItem: "10、附加特征",
        checkContent: "是否要锁模块?",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 96,
        checkItem: "10、附加特征",
        checkContent: "是否要吊模块?",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 97,
        checkItem: "10、附加特征",
        checkContent: "是否要记数器?是否有记数器局部向视图?",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 98,
        checkItem: "10、附加特征",
        checkContent: "是否需要铭牌?(热流道铭牌、运水铭牌、模具属性铭牌等)",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 99,
        checkItem: "10、附加特征",
        checkContent: "型腔内刻字是否正确?(内容、字体、大小、位置、方向)",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 100,
        checkItem: "10、附加特征",
        checkContent: "模具腔内转角(成型面除外)尽可能倒圆角，腔的深度与圆角尺寸要考虑加工刀具的选择。镶件倒斜角。",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 101,
        checkItem: "10、附加特征",
        checkContent: "顶针板限位块尽可能做在KO 孔位置上。",
        userCheckSelf: "",
        buildAudit: ""
      }
    ]
  },
  {
    groupName: "四、图面风格",
    key: "table14",
    children: [
      {
        seq: 102,
        checkItem: "四、图面风格",
        checkContent: "2D 模具的线型、颜色、图层必须按“模具设计2d 模板。",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 103,
        checkItem: "四、图面风格",
        checkContent:
          "视图：A、视图表达是否完整?图面是否整洁?视图排布是否美观?B、是否有浇口放大图、运水示意图、排气截面放大图、KO.孔位置图等。C、是否有铭牌安装图。",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 104,
        checkItem: "四、图面风格",
        checkContent:
          "标注： A、标注精度：公制一般为0.01；英制一般为0.001。 B、模具安装尺寸：① 模具最大外形尺寸；② 定位环直径；③唧咀球头半径；④ 水咀与快速接头尺寸；⑤吊模孔尺寸；⑥顶棍孔尺寸；ǿ 码模槽尺寸；Ȁ 接线盒规格尺寸 C、模具零件尺寸：①排位尺寸（座标形式标注，成品中心数用“□”框住）；② 重要非标件的长宽高尺寸，槽深尺寸；③标准件公称尺寸，便于钳工装配时选择标准件；④ 运动零件运动行程尺寸。D、其他重要尺寸，如：水塘、运水直径等等",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 105,
        checkItem: "四、图面风格",
        checkContent: "剖面线：内模及其他表达困难的结构需打剖面线，斜度尽可能选择45 度(可不同间隔、不同颜色)。",
        userCheckSelf: "",
        buildAudit: ""
      },
      {
        seq: 106,
        checkItem: "四、图面风格",
        checkContent:
          "注释说明： A、视图名称、重要零件名称、模顶符号、操作员符号、基准角符号、技术要求是否包含? B、运水：前模编号是否用IN(OUT) A、B、C； 后模是否用IN(OUT) 1、2、3……? C、标题栏：内容是否正确?更改时日期、版本号是否更改? D、BOM 表：序号、规格、数量、材料是否正确?相互运动的零件材料或硬度是否不同?(如滑块与内模料)",
        userCheckSelf: "",
        buildAudit: ""
      }
    ]
  }
];
