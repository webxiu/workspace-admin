import { MockMethod } from "vite-plugin-mock";

//   Mock.mock({
//     "star|1-6": "★", // ★★★★
//     "number|+1": 1, // 1
//     "status|1-2": true, // true/false
//     "state|1": [0, 1, 2, 3], // 其中之一
//     "mode|1": ["AMD", "CMD", "UMD"], // 其中之一
//     "uid|2": /\d{5,10}-/, // "4516082-252281707-",
//     id: "@id", // 360000197902217123
//     name: "@first", // 英文名
//     email: "@email", // 邮箱
//     username: "@cname()", // 中文姓名
//     date: "@date()", // 1986-05-04
//     index: "@increment", // 数字自增
//     color: Random.color(), //随机颜色
//     desc: "@cword(10,20)", // 10-20个汉字
//     now: Mock.mock("@now"), // 当前年月日 时分秒
//     title: "@cword(3,5)",
//     subTitle: Random.ctitle(5), // 选择几个中文
//     en_text: Random.paragraph(), // 英文文章
//     ch_text: Random.cparagraph(), // 中文文章
//     age: "@integer(10, 100)", // 10-100的数字
//     money: "@float(60, 100, 3, 5)", // 小数金额
//     word: Random.cword("零一二三四五六七八九十", 3), // 随机选择几个字符
//     borth: Random.datetime("yyyy-MM-dd HH:mm:ss"), // 获取年月日 时分秒
//     imgUrl: Random.image("200x200", "#ff6600", "#0000ff", "很好看的图片"), // 图片url
//     createTime: "@datetime",
//     updateTime: "@datetime",
//     uuid: uuidv4()
//     // children: children
//   });

export default [
  // undefined
  {
    url: "/getowneruserinfo",
    method: "get",
    response: ({ body }) => {
      return {
        status: 200,
        message: "操作成功",
        data: {
          id: 1385115,
          userCode: "659",
          userName: "李秀海",
          createDate: null,
          deptId: 9,
          userState: null,
          mobile: null,
          wxOpenid: null,
          avatar: "https://wework.qpic.cn/wwpic/519179_NlkY7xfUTDun8Mc_1658887588/0",
          workRuleId: null,
          password: null,
          postName: null,
          qunhuiAccount: null,
          qunhuiPassword: null,
          k3UserAccount: null,
          roleName: null,
          deptCode: null,
          email: null,
          orgId: "532dad6942c17caf4b00bbd5fc498e79",
          deptName: null,
          groupId: null,
          groupName: null,
          wageAccountingType: null,
          sysUserDeptMiddleVOList: null
        },
        timestamp: 1729590452202
      };
    }
  },
  // 枚举字典
  {
    url: "/getloginpagemessage",
    method: "get",
    response: ({ body }) => {
      return {
        status: 200,
        message: "操作成功",
        data: {
          redirect: "https://app.deogra.com/api/app/qywx/api/login",
          clientPathMac: "/static/virtual/files/DeograWorkspace-1.0.0-arm64-mac.zip",
          agentid: "1000036",
          orgName: "深圳市德龙电器有限公司",
          appid: "ww078d1941bccf8584",
          esopPath: "/static/virtual/files/sys/application/apk/esop_install.apk",
          orgShortName: "德龙电器",
          clientPathWin: "/static/virtual/files/DeograWorkspace_Setup_1.0.0.exe",
          clientPathWin32: "/static/virtual/files/DeograWorkspace_Setup_32_1.0.0.exe",
          version: "2024.0.356",
          logoUrl: "/static/virtual/files/managercenter/file/5577FEE5AB4B4B6B9320D30E4206A4D6.png"
        },
        timestamp: 1729590814911
      };
    }
  },
  {
    url: "/verifyuser",
    method: "post",
    response: ({ body }) => {
      return {
        status: 200,
        message: "操作成功",
        data: "",
        timestamp: 1729650382863
      };
    }
  },
  {
    url: "/sys/system/getPrevewDomain",
    method: "get",
    response: ({ body }) => {
      return {
        status: 200,
        message: "操作成功",
        data: "https://dlpctest.deogra.com/",
        timestamp: 1729650385354
      };
    }
  }
] as MockMethod[];
