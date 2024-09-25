import Mock from "mockjs";

Mock.setup({ timeout: 300 });

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
