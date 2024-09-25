import { Directive, DirectiveHook, nextTick } from "vue";
import { Tokens, marked } from "marked";

import hljs from "highlight.js";

/**
 * 1.获取指定元素的高度, 并添加到当前元素上:
 * v=mainHeight="{selector?: 元素选择器 offset?: 高度偏移量 }"
 */
export const mainHeight: Directive = {
  mounted(el, binding) {
    const { value = {} } = binding;
    const mainGap = 30;
    const selector = value.selector || ".app-main .el-scrollbar";
    const offset = value.offset || 0;
    const wrapDom: HTMLDivElement = document.querySelector(selector);
    if (wrapDom) {
      el.style.height = wrapDom.offsetHeight - offset - mainGap + "px";
      el.style.overflowY = "auto";
    } else {
      throw new Error("[Directive: mainHeight]: `selector` are required");
    }
  }
};

/**
 * 2.输入框获取焦点
 * v-autoFocus="{select: 是否选中 }"
 */
export const autoFocus: Directive = {
  mounted(el: HTMLDivElement, binding) {
    const { value } = binding;
    const inputDom: HTMLInputElement = el.querySelector("input");
    const textareaDom: HTMLTextAreaElement = el.querySelector("textarea");
    const dom = inputDom || textareaDom;
    const timer = setTimeout(() => {
      dom.focus();
      if (value?.select) dom.select();
      clearTimeout(timer);
    }, 10);
  }
};

export const fmtMarkdown: DirectiveHook = (el: HTMLElement, binding) => {
  // https://marked.js.org/using_advanced#options
  const renderer = new marked.Renderer();
  renderer.code = ({ text, lang }: Tokens.Code) => {
    const JSLang = ["vue", "react"].includes(lang); // 按js语言处理
    const langStr = JSLang ? "javascript" : lang || "plaintext";
    const hlHtml = hljs.highlight(langStr, text).value;
    return `<pre style="white-space: pre;">
              <code class="${langStr}" style="border-radius: 6px">${hlHtml}</code>
            </pre>`;
  };
  marked.setOptions({
    renderer: renderer,
    gfm: true, // 是否启用 GitHub 风格的 Markdown 语法
    pedantic: false, // 是否解析Markdown
    breaks: true // 是否允许换行符(\n)转换为 <br>
  });
  el.innerHTML = marked(binding.value ?? "") as string;
  nextTick(() => {
    const codeEle = el.querySelectorAll("pre code");
    codeEle.forEach((block: HTMLElement) => hljs.highlightBlock(block));
  });
};
