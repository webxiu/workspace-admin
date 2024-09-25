/*
 * @Author: Hailen
 * @Date: 2023-07-06 16:06:53
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-02-27 11:14:15
 */

import { Ref, isRef, onMounted, onUnmounted, ref } from "vue";

/**
 * 获取元素的高度
 * @param selector 元素的选择器
 * @param offset 偏移量(表格的偏移量 = 查询表单高度 + 表头高度 + 分页高度)
 * @returns 最大高度
 */
export function useEleHeight(selector: string, offset = 0) {
  const heightRef = ref<number>(0);

  onMounted(() => {
    setHeight();
    window.addEventListener("resize", setHeight);
  });

  const setHeight = () => {
    const wrapDom: HTMLDivElement = document.querySelector(selector);
    if (wrapDom) {
      const gap = 40; // 内容区域的margin和padding
      const hh = parseInt(wrapDom.offsetHeight - gap - offset);
      heightRef.value = hh;
    }
  };
  return heightRef;
}

/**
 * 监听滚动元素高度, 自动滚动到底部
 * @param selector 元素或选择器
 * @param offset 底部的偏移量
 */
export function useObserElement(selector: string | Ref<HTMLDivElement>, offset = 10) {
  let isAutoScroll = true;
  let watchDom: HTMLElement;
  let observer: MutationObserver;
  function initObserver() {
    watchDom = isRef(selector) ? selector.value : document.querySelector(selector);
    watchDom.style.scrollBehavior = "smooth";
    if (isAutoScroll) scrollToBottom(1000);

    observer = new MutationObserver((mutations) => {
      mutations.forEach(({ type }) => type === "childList" && scrollToBottom());
    });
    observer.observe(watchDom, { childList: true, subtree: true });
    watchDom.addEventListener("scroll", (e: any) => {
      const { scrollTop, offsetHeight, scrollHeight } = e.target;
      isAutoScroll = scrollTop + offsetHeight >= scrollHeight - offset;
    });
  }
  function scrollToBottom(delay = 0) {
    const timer = setTimeout(() => {
      if (isAutoScroll) watchDom.scrollTop = watchDom.scrollHeight;
      clearTimeout(timer);
    }, delay);
  }

  /** 滚动到底部 */
  function sendToBottom() {
    isAutoScroll = true;
    scrollToBottom();
  }
  onUnmounted(() => observer?.disconnect());
  return { observer, initObserver, sendToBottom };
}
