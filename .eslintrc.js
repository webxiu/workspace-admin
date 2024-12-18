module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true
  },
  globals: {
    // Ref sugar (take 2)
    $: "readonly",
    $$: "readonly",
    $ref: "readonly",
    $shallowRef: "readonly",
    $computed: "readonly",

    // index.d.ts
    // global.d.ts
    Fn: "readonly",
    PromiseFn: "readonly",
    RefType: "readonly",
    LabelValueOptions: "readonly",
    EmitType: "readonly",
    TargetContext: "readonly",
    ComponentElRef: "readonly",
    ComponentRef: "readonly",
    ElRef: "readonly",
    global: "readonly",
    ForDataType: "readonly",
    ComponentRoutes: "readonly",

    // script setup
    defineProps: "readonly",
    defineEmits: "readonly",
    defineExpose: "readonly",
    withDefaults: "readonly"
  },
  extends: ["plugin:vue/vue3-essential", "eslint:recommended", "@vue/typescript/recommended", "@vue/prettier", "@vue/eslint-config-typescript"],
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: 2020,
    sourceType: "module",
    jsxPragma: "React",
    ecmaFeatures: {
      jsx: true,
      tsx: true
    }
  },
  /** public下的文件不检查 */
  ignorePattern: ['public/**/*'],
  overrides: [
    {
      files: ["*.ts", "*.vue"],
      rules: {
        "no-undef": "off"
      }
    },
    {
      files: ["*.vue"],
      parser: "vue-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
        extraFileExtensions: [".vue"],
        ecmaVersion: "latest",
        ecmaFeatures: {
          jsx: true
        }
      },
      rules: {
        "no-undef": "off"
      }
    }
  ],
  rules: {
    "vue/no-v-html": "off", // 不允许使用v-html
    "vue/require-default-prop": "off", // 需要默认prop
    "vue/require-explicit-emits": "off", // 需要显式emit
    "vue/multi-word-component-names": "off", // 多个单词组件名称
    "@typescript-eslint/no-explicit-any": "off",  // 不允许使用any
    "no-debugger": "off", // 不允许使用debugger
    "@typescript-eslint/explicit-module-boundary-types": "off", // 禁用指定函数返回类型和参数类型
    "@typescript-eslint/ban-types": "off", // 禁止使用特定类型
    "@typescript-eslint/ban-ts-comment": "off", // 禁用ts注释
    "@typescript-eslint/no-empty-function": "off", // 禁用空函数
    "@typescript-eslint/no-non-null-assertion": "off", // 禁用非空断言
    "@typescript-eslint/no-this-alias": "off", // 关闭this起别名限制
    "vue/html-self-closing": [
      "error",
      {
        html: {
          void: "always",
          normal: "always",
          component: "always"
        },
        svg: "always",
        math: "always"
      }
    ],
    "@typescript-eslint/no-unused-vars": [
      "off",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_"
      }
    ],
    "no-unused-vars": [
      "off",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_"
      }
    ],
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto"
      }
    ]
  }
};
