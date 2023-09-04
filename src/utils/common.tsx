/*
 * @Author: lixiuhai
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: lixiuhai
 * @Last Modified time: 2023-08-24 13:53:32
 */

import { Ref, nextTick, ref } from "vue";
import { columnDrop, rowDrop } from "@/hooks";

import Expand from "@iconify-icons/ep/expand";
import IconifyIconOffline from "@/components/ReIcon/src/iconifyIconOffline";
import PriceTag from "@iconify-icons/ep/price-tag";
import { clone } from "@pureadmin/utils";

/** 表格配置类型说明 */
export interface ColumnOptionType {
  /** 接口返回的表格列配置 */
  columnData: TableColumnList[];
  /** 表格数据 */
  dataList?: Ref<any[]>;
  /** 操作列宽度 默认 `140` */
  operateWidth?: number;
  /** 表格列拖拽外层元素选择器 不传 `默认不拖拽` */
  dragSelector?: string;
  /** 是否序号索引分页累加 不传 `默认不累加` */
  formData?: { page: number; limit: number };
  /** 是否显示多选 `默认不显示` */
  showSelection?: boolean;
  /** 是否显示序号 `默认显示` */
  showIndex?: boolean;
  /** 是否显示操作列 `默认显示` */
  showOpt?: boolean;
  /** 是否显示自定义折叠图标 `默认不显示` */
  isCustomExpend?: boolean;
  /** 是否拖拽行数据(设置此项`dataList`与`dragSelector`必传) */
  isDragRow?: boolean;
}

/** 表格列配置(嵌套表格不支持拖拽) */
export const setColomn = (options: ColumnOptionType) => {
  const { columnData = [], dataList, formData, dragSelector, operateWidth = 140, showOpt = true, showIndex = true, isDragRow = true, showSelection = false, isCustomExpend = false } = options;

  const columnsDrag = ref<TableColumnList[]>([]);

  // 配置表格折叠图标
  const cellRenderer = ({ cellIndex, row }): JSX.Element => {
    return (
      <div class="inline-flex align-center">
        <IconifyIconOffline icon={row.children?.length ? Expand : PriceTag} class="mr-2 fz-16" />
        {row[columnsDrag.value[cellIndex]?.prop as string]}
      </div>
    );
  };

  const cellRendererIndex = ({ $index }) => {
    let indexNumber = $index + 1;
    if (formData?.page && formData?.limit) {
      indexNumber = (formData.page - 1) * formData.limit + $index + 1;
    }
    return <span>{indexNumber}</span>;
  };

  // 配置序号|多选|操作列
  const selections: TableColumnList[] = showSelection ? [{ type: "selection", width: 55, align: "left" }] : [];
  const indexItem: TableColumnList[] = showIndex ? [{ label: "序号", type: "index", width: 55, align: "center", cellRenderer: cellRendererIndex }] : [];
  const optItem: TableColumnList[] = showOpt ? [{ label: "操作", fixed: "right", align: "center", minWidth: operateWidth, slot: "operation" }] : [];
  const renderItem = isCustomExpend ? { cellRenderer, align: "left" } : {};
  const customRow = columnData.splice(0, 1)[0];

  columnsDrag.value = [...selections, ...indexItem, { ...customRow }, ...columnData];

  const columnList: TableColumnList[] = clone(
    [{ ...customRow, ...renderItem, headerAlign: "center" }, ...columnData].map((item) => ({
      minWidth: 120,
      ...item,
      prop: (index: number) => columnsDrag.value[index].prop as string
    }))
  );
  if (dragSelector) {
    nextTick(() => {
      columnDrop(columnsDrag, dragSelector);
      if (isDragRow) rowDrop(dataList, dragSelector);
    });
  }
  return clone([...selections, ...indexItem, ...columnList, ...optItem]);
};

/** 打印 */
export const printContent = () => {
  const pWindow = window.open("", "_blank");
  pWindow.focus();
  const pDocument = pWindow.document;
  pDocument.open();
  pDocument.write("<h1>2111111</h1>");
  pDocument.close();
  pWindow.print();
  pWindow.close();
};

/** 递归删除对象内的空值 */
export const delEmptyQueryNodes = (obj = {}) => {
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    value && typeof value === "object" && delEmptyQueryNodes(value);
    (value === "" || value === null || value === undefined || value.length === 0 || Object.keys(value).length === 0) && delete obj[key];
  });
  return obj;
};

/**
 * 函数防抖
 * @param fn 处理函数
 * @param wait 等待时间
 */
export const debounce = (fn: Function, wait = 300) => {
  let timeout: number;
  return () => {
    if (timeout !== null) clearTimeout(timeout);
    timeout = setTimeout(fn, wait);
  };
};

/**
 * 函数节流
 * @param fn 处理函数
 * @param delay 间隔时间
 */
export const throttle = (fn: Function, delay = 300) => {
  let prev = Date.now();
  return (...args: any) => {
    const now = Date.now();
    if (now - prev >= delay) {
      fn.call(null, ...args);
      prev = Date.now();
    }
  };
};
