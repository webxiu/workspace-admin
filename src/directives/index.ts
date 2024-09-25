import { App, Directive } from "vue";

/** 所有指令定义到modules目录下, 自动导入到全局中 */

// 获取所有指令模块
const modules: Record<string, any> = import.meta.glob(["./modules/**/*.ts", "!./modules/**/test.ts"], {
  eager: true
});

const directives: { [key: string]: Directive } = Object.keys(modules).reduce((prev, next) => {
  return { ...prev, ...modules[next] };
}, {});

// 注册自定义指令
export const registerDirective = (app: App) => {
  Object.keys(directives).forEach((key) => {
    app.directive(key, directives[key]);
  });
};
