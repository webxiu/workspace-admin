import Mock from "mockjs";

Mock.setup({ timeout: 300 });

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

// 响应返回函数
function responseReturn<T>(data: T, code = 200, msg = ""): BaseResponseType<T> {
  return {
    status: 200,
    message: "成功",
    data: data,
    timestamp: 999990
  };
}
// 扫描Mock接口文件
const modules: Record<string, any> = import.meta.glob(["./modules/**/*.ts", "!./modules/**/remaining.ts"], { eager: true });
const routes = Object.keys(modules).reduce((prev, key, index) => {
  prev.push(...modules[key].default);
  return prev;
}, []);

// 执行mock
routes.forEach((route) => Mock.mock(route.url, route.method, route.response));

export { Mock, responseReturn };
