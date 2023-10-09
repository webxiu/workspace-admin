/*
 * @Author: lixiuhai
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: lixiuhai
 * @Last Modified time: 2023-09-21 10:43:38
 */

import { Ref, nextTick, ref } from "vue";
import { columnDrop, rowDrop } from "@/hooks";
import { utils, writeFile } from "xlsx";

import Expand from "@iconify-icons/ep/expand";
import IconifyIconOffline from "@/components/ReIcon/src/iconifyIconOffline";
import PriceTag from "@iconify-icons/ep/price-tag";
import { clone } from "@pureadmin/utils";
import { http } from "@/utils/http";

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
  let timeout: NodeJS.Timeout;
  return (...arg) => {
    if (timeout !== null) clearTimeout(timeout);
    timeout = setTimeout(fn.bind(null, ...arg), wait);
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

/**
 * 请求接口导出(下载)
 * @param url 下载地址
 * @param fileName 文件名(可带后缀)
 */
export const downloadFile = (url: string, fileName: string) => {
  // 给文件名添加时间戳, 判断文件名是否存在后缀名
  // fileName待后缀名就使用fileName后缀, 否则获取url文件后缀
  const urlSuffix = url.split(".")[1] ?? "txt";
  const names = fileName.split(".");
  const name = names[0] ?? fileName;
  const suffix = names[1] || urlSuffix;

  http
    .get<object, Blob>(url, { responseType: "blob" })
    .then((res: any) => {
      const blob = new Blob([res]);
      const fileName = `${name}_${Date.now()}.${suffix}`;
      onDownload(blob, fileName);
    })
    .catch(console.error);
};

// 下载文件
export const onDownload = (blob: Blob, fileName: string) => {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(link.href);
};

export interface DownloadDataType {
  /** 导出的数据 */
  dataList: any[];
  /** 表格配置列 */
  columns: TableColumnList[];
  /** 文件名 */
  fileName: string;
}

/**
 * 纯表格数据导出
 * @param options 导出选项: 支持导出多表, 传入数组即可
 */
export const downloadDataToExcel = (options: DownloadDataType | DownloadDataType[]) => {
  const exportOptions = Array.isArray(options) ? options : [options];
  const fileName = exportOptions[0].fileName;
  const workBook = utils.book_new();

  exportOptions.forEach((option, idx) => {
    const res: string[][] = option.dataList.map((item, index) => {
      const arr = [];
      option.columns.forEach((column) => {
        const prop = typeof column.prop === "function" ? column.columnKey : column.prop;
        const cell = column.type === "index" ? index + 1 : !["expand", "selection"].includes(column.type) || column.slot !== "operation" ? item[prop] : undefined;
        if (cell !== undefined) arr.push(cell);
      });
      return arr;
    });
    const titleList: string[] = [];
    option.columns.forEach((column) => {
      if (!["expand", "selection"].includes(column.type) && column.slot !== "operation") {
        titleList.push(column.label);
      }
    });
    res.unshift(titleList);
    const workSheet = utils.aoa_to_sheet(res);
    utils.book_append_sheet(workBook, workSheet, option.fileName || `Sheet${idx + 1}`);
  });
  writeFile(workBook, `${fileName}_${Date.now()}.xlsx`);
};
