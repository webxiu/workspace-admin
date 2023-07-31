/*
 * @Author: lixiuhai
 * @Date: 2023-06-27 13:51:16
 * @Last Modified by: lixiuhai
 * @Last Modified time: 2023-07-22 08:45:17
 */

import { nextTick, onMounted, ref } from "vue";

import Sortable from "sortablejs";

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

/**
 * 行拖拽(需要等列配置加载完成在初始化)
 * @param dataList 表格数据
 * @param prefixSelector 表格类名
 */
export const rowDrop = (dataList, prefixSelector: string) => {
  event?.preventDefault();
  nextTick(() => {
    const wrapper: HTMLElement = document.querySelector(prefixSelector + " .el-table__body-wrapper tbody");
    Sortable.create(wrapper, {
      animation: 300,
      handle: prefixSelector + " .el-table__row",
      onEnd: ({ newIndex, oldIndex }) => {
        const currentRow = dataList.value.splice(oldIndex, 1)[0];
        dataList.value.splice(newIndex, 0, currentRow);
      }
    });
  });
};

/**
 * 列拖拽
 * @param columnsDrag 拖拽列配置
 * @param prefixSelector 表格类名
 */
export const columnDrop = (columnsDrag, prefixSelector: string) => {
  event?.preventDefault();
  nextTick(() => {
    const wrapper: HTMLElement = document.querySelector(prefixSelector + " .el-table__header-wrapper tr");
    Sortable.create(wrapper, {
      animation: 300,
      delay: 0,
      onEnd: ({ newIndex, oldIndex }) => {
        const oldItem = columnsDrag.value[oldIndex];
        columnsDrag.value.splice(oldIndex, 1);
        columnsDrag.value.splice(newIndex, 0, oldItem);
      }
    });
  });
};
