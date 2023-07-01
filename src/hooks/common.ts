/*
 * @Author: lixiuhai
 * @Date: 2023-06-27 13:51:16
 * @Last Modified by: lixiuhai
 * @Last Modified time: 2023-06-27 13:52:44
 */

import { onMounted, ref } from "vue";

/**
 * 获取元素的高度
 * @param selector 元素的选择器
 * @param offset 偏移量(表格的偏移量 = 查询表单高度 + 表头高度 + 分页高度)
 * @returns 最大高度
 */
export function useEleHeight(selector: string, offset: number) {
  const heightRef = ref<number>(0);
  onMounted(() => {
    const wrapDom: HTMLDivElement = document.querySelector(selector);
    if (wrapDom) {
      heightRef.value = wrapDom.offsetHeight - offset;
    }
  });
  return heightRef;
}
