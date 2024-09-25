<h1>德龙后台管理系统开发（国际化版本）</h1>

[![license](https://img.shields.io/github/license/pure-admin/vue-pure-admin.svg)](LICENSE)

## 介绍

基于 [vue-pure-admin](https://github.com/pure-admin/vue-pure-admin) 提炼出的架子，包含主体功能，更适合实际项目开发，打包后的大小在全局引入 [element-plus](https://element-plus.org) 的情况下仍然低于 `2.3MB`，并且会永久同步完整版的代码。开启 `brotli` 压缩和 `cdn` 替换本地库模式后，打包大小低于 `350kb`

# Vue3 + TypeScript + Vite

这个模板应该有助于您开始在 Vite 中使用 Vue 3 和 TypeScript 进行开发。该模板使用 Vue 3`<script setup>`SFC，请查看[脚本设置文档](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup)了解更多信息。

## 准备

- [Vite](https://cn.vitejs.dev/) - vite 特性
- [Vue3](https://v3.cn.vuejs.org/) - Vue3 基础语法
- [TypeScript](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html) - 类型提示
- [Vue-Router](https://router.vuejs.org/zh/) - vue-router 4.x 文档
- [Pinia](https://pinia.web3doc.top/) - 状态管理
- [Echarts](https://echarts.apache.org/zh/feature.html) - 统计图表
- [Axios](https://www.axios-http.cn/docs/instance) - 接口请求工具
- [Element-Plus](https://element-plus.org/zh-CN/component/button.html) - Vant UI 组件
- [vue-i18n](https://kazupon.github.io/vue-i18n/zh/introduction.html) - 国际化
- [Mock](http://mockjs.com/examples.html) - Mock 数据

## 开发

```bash

# 安装依赖
pnpm install

# 启动服务
pnpm serve

# 代码格式化(建议提交前执行一次)
pnpm lint
```

## 发布

```bash
# 构建生产环境
pnpm build   # 需先在.env.production中修改生产环境打包的部署域名和目录

```

## 路由

**定义格式(重要)**

**后端接口返回菜单, 在创建页面入口文件时, 必须按路由的层级来创建目录, 以确保能正确加载**

> path 路由地址`/xxx/sss/ccc`路径必须和
> component 的地址 @/views`/xxx/sss/ccc`/index.vue 相匹配

```js
// 示例
{
  path: "/oa/mk/relation", // 后端返回路由地址
  name: "RoleSetting",
  meta: { title: "岗位管理", icon: "Histogram" },
  component: () => import("@/views/oa/mk/relation/index.vue") // 前端入口页面地址(匹配path地址)
}

```

## 图标

**1.引入 Element-Plus 图标 [查看图标名称](https://element-plus.org/zh-CN/component/icon.html#icon-collection)**
**2.引入 iconify 图标 [查看如何引入](https://yiming_chang.gitee.io/pure-admin-doc/pages/icon/#如何找到更多的图标集) → [图标在线预览](https://icon-sets.iconify.design/ep/)**

```js
# 引入图标
 import Search from "@iconify-icons/ep/search"    # 引入Element-Plus图标
 import Apple from "@iconify-icons/ri/apple-line" # 引入iconify图标

# 使用
 <IconifyIconOffline :icon="Search" />
 <IconifyIconOffline :icon="Apple" />

```

**3.全局引入**

```js
在src / components / ReIcon / src / offlineIcon.ts引入并注册全局图标;
```

## 项目规范

- **通用工具方法写到 src/utils 目录中**
- **开发中的需求写到对应的目录结构中**
- **函数命名采用驼峰书写格式命名,单词拼写正确**
- **CSS 样式命名参考腾讯 [BEM](https://github.com/Tencent/tmt-workflow/wiki/%E2%92%9B-%5B%E8%A7%84%E8%8C%83%5D--CSS-BEM-%E4%B9%A6%E5%86%99%E8%A7%84%E8%8C%83) 的风格**
- **通用工具方法写到 src/utils 目录中定义**
- **NodeJS 版本推荐 16+**
- **推荐使用 VSCode 开发工具**
- **项目文件中函数方法名注释书写规范**
  - 为了保持代码的阅读性,一个文件中函数方法按`50%以上`的比例添加注释, 即编写 10 个函数方法至少写 5 个以上的注释
  - 不要求所有方法都添加注释, 但是主要功能的函数方法必须加上
  - 注释格式需要说明函数的`功能`、`参数`、`返回值`等
  - 双斜线`//`注释没有鼠标悬停提示, 建议采用`/** 注释内容 */`格式注释
- **添加文件头信息注释**
  - 安装 vscode 插件
  - 在文件首行生成作者信息快捷键:
    - windows 系统: Ctrl + Alt + i
    - Mac 系统:Control + Option + i

## Git 提交规范参考

- `feat` 增加新的业务功能
- `fix` 修复业务问题/BUG
- `perf` 优化性能
- `style` 更改代码风格, 不影响运行结果
- `refactor` 重构代码
- `revert` 撤销更改
- `test` 测试相关, 不涉及业务代码的更改
- `docs` 文档和注释相关
- `chore` 更新依赖/修改脚手架配置等琐事
- `workflow` 工作流改进
- `ci` 持续集成相关
- `types` 类型定义文件更改
- `wip` 开发中

## 目录结构

```js
    ├── locales                    // 语言包目录
    ├── src                        // 源代码
    │   ├── api                    // 请求相关文件
    │   ├── assets                 // 静态资源
    │   ├── components             // 全局公用组件
    │   ├── directives             // 全局指令
    │   ├── config                 // 配置相关
    │   ├── layout                 // layout
    │   ├── plugins                // plugins
    │   ├── router                 // 路由
    │   ├── store                  // 全局 store管理
    │   ├── style                  // 全局样式
    │   ├── utils                  // 工具函数
    │   ├── views                  // 页面集合
    │   ├── App.vue                // 入口页面
    │   ├── main.js                // 入口 加载组件 初始化等
    ├── public                     // 公用文件目录
    │   ├── index.html             // html模板
    │   ├── favicon.ico            // favicon图标(png)
    ├── .gitignore                 // git 忽略项
    ├── .env.development           // 开发环境遍历
    ├── .env.production            // 生产环境遍历
    ├── postcss.config.cjs         // postcss配置文件
    └── package.json               // package.json
```

## 建议的 IDE 设置

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## 全局函数

- **存放目录**

```bash
 在src/utils下
```

## 许可证

开源免费

[MIT © 2020-present, pure-admin](./LICENSE)
