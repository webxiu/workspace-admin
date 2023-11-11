/*
 * @Author: lixiuhai
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: lixiuhai
 * @Last Modified time: 2023-11-10 14:21:10
 */

import { CSSProperties, Ref, nextTick, ref, withModifiers } from "vue";
import { columnDrop, rowDrop } from "@/hooks";
import { utils, writeFile } from "xlsx";

import Expand from "@iconify-icons/ep/expand";
import IconifyIconOffline from "@/components/ReIcon/src/iconifyIconOffline";
import PriceTag from "@iconify-icons/ep/price-tag";
import type { TableColumnCtx } from "element-plus";
import { clone } from "@pureadmin/utils";
import { http } from "@/utils/http";

/** 表格统计方法参数类型 */
export interface SummaryMethodProps<T> {
  columns: TableColumnCtx<T>[];
  data: T[];
}

/** 表格统计自定义配置选项 */
interface SummaryOptionType<T> {
  /** 表格参数数据 */
  params: SummaryMethodProps<T>;
  /** 文本显示, 默认 `N/A` */
  emptyText?: string;
  /** 需要统计的字段数组 */
  includeProps?: string[];
  /** 排除统计的字段数组 */
  excludeProps?: string[];
  /** 转金额千分位的字段数组 */
  moneyCommaProps?: string[];
  /** 保留有效数字, 默认 `2位` */
  decimal?: number;
}

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
  /** 是否显示表格行选中单选按钮 `默认不显示` */
  showRadio?: boolean;
  /** 是否显示多选 `默认不显示` */
  showSelection?: boolean;
  /** 是否显示序号 `默认显示` */
  indexColumn?: TableColumnList | false;
  /** 是否显示操作列 `默认显示` */
  showOpt?: boolean;
  /** 是否显示自定义折叠图标 `默认不显示` */
  isCustomExpend?: boolean;
  /** 是否拖拽列(设置此项`dragSelector`必传) */
  isDragColumn?: boolean;
  /** 是否拖拽行(设置此项`dataList`与`dragSelector`必传) */
  isDragRow?: boolean;
}

/** 表格列配置(嵌套表格不支持拖拽) */
export const setColomn = (options: ColumnOptionType) => {
  const {
    columnData = [],
    dataList,
    formData,
    dragSelector,
    operateWidth = 140,
    showOpt = true,
    indexColumn = {},
    isDragRow = false,
    isDragColumn = false,
    showRadio = false,
    showSelection = false,
    isCustomExpend = false
  } = options;
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

  // 配置单选按钮|多选|序号|操作列
  const radioItem: TableColumnList[] = showRadio ? [{ label: "", align: "center", width: 40, cellRenderer: () => <el-radio label="&nbsp;" size="small" /> }] : [];
  const selections: TableColumnList[] = showSelection ? [{ type: "selection", width: 55, align: "center", headerAlign: "center" }] : [];
  const indexItem: TableColumnList[] = indexColumn ? [{ label: "序号", type: "index", width: 60, align: "center", cellRenderer: cellRendererIndex, ...indexColumn }] : [];
  const optItem: TableColumnList[] = showOpt ? [{ label: "操作", fixed: "right", align: "center", minWidth: operateWidth, slot: "operation" }] : [];
  const renderItem = isCustomExpend ? { cellRenderer, align: "left" } : {};
  const customRow = columnData.splice(0, 1)[0];

  columnsDrag.value = [...selections, ...indexItem, { ...customRow }, ...columnData];

  const columnList: TableColumnList[] = clone(
    [{ ...customRow, ...renderItem }, ...columnData].map((item) => ({
      minWidth: 120,
      align: "left",
      headerAlign: "left",
      slot: item.prop,
      ...item,
      columnKey: item.prop,
      prop: isDragColumn ? (index: number) => columnsDrag.value[index]?.prop as string : item.prop
    }))
  );
  if (dragSelector) {
    nextTick(() => {
      if (isDragColumn) columnDrop(columnsDrag, dragSelector);
      if (isDragRow) rowDrop(dataList, dragSelector);
    });
  }
  return clone([...radioItem, ...selections, ...indexItem, ...columnList, ...optItem]);
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

/**
 * 表格导出配置表头
 * @param exportName 文件名
 * @param columns 表格配置列
 * @param params 其他参数
 */
export const getExportConfig = (exportName: string, columns: TableColumnList[], params?: any) => {
  const excelHeader = columns.map((item, index) => {
    const field = typeof item.prop === "function" ? item.columnKey : item.prop;
    return { ...item, field: field, title: item.label, width: 160, key: `0-${index}}`, hide: false, colspan: 1, rowspan: 1, type: "normal", colGroup: false };
  });

  const headConfig = {
    page: 1,
    limit: 1000000,
    excel: {
      excelName: exportName,
      excelHeader: JSON.stringify(excelHeader)
    },
    ...params
  };
  return headConfig;
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

// 数字保留两位小数并且加千分位
export const fixed2AndAddcomma = (num: number | string): string => {
  if (!num) return "";

  let formatNum = "";
  if (typeof num === "string" && /\d/.test(num)) {
    formatNum = (+num).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
  }
  formatNum = (num as number).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");

  return formatNum;
};

// 数字转千分位格式(decimal: 默认保留2位有效数字)
export const formatMoneyComma = (num: number | string, decimal = 2): string => {
  const value = Number(num);
  if (Number.isNaN(value)) return num?.toString();
  const floatNum = +value.toFixed(decimal);
  return floatNum.toLocaleString("zh-CN", { currency: "CNY", minimumFractionDigits: decimal });
};

/**
 * 自定义统计函数
 * @param options.params          表格参数数据
 * @param options.emptyText       文本显示, 默认 `-`
 * @param options.includeProps    需要统计的字段
 * @param options.excludeProps    排除统计的字段
 * @param options.moneyCommaProps 转金额千分位的字段
 * @param options.decimal         保留有效数字, 默认 `2位`
 */
export const getSummaries = <T extends {}>(options: SummaryOptionType<T>) => {
  const { params, emptyText = "--", includeProps = [], excludeProps = [], moneyCommaProps = [], decimal = 2 } = options;
  const { columns, data } = params;
  const sums: string[] = [];
  columns.forEach((column, index) => {
    if (index === 0) return (sums[index] = "合计");

    const isInclude = includeProps.includes(column.property) || !excludeProps.includes(column.property);
    // 列所有数据
    const values = data.map((item) => Number(item[column.property]));
    // 是否为无效列数据
    const validValues = values.every((value) => Number.isNaN(value));

    if (!validValues && isInclude) {
      const totalSum = values
        .map((item) => `${item}`)
        .reduce((prev, curr) => {
          const value = Number(curr);
          return !Number.isNaN(value) ? prev + value : prev;
        }, 0);

      let sumValue = `${Number(totalSum.toFixed(decimal))}`;
      // 金额千分位转换
      if (moneyCommaProps.includes(column.property)) {
        sumValue = formatMoneyComma(totalSum, decimal);
      }
      sums[index] = sumValue;
    } else {
      sums[index] = emptyText;
    }
  });

  return sums;
};

/** 获取浏览器参数 */
export const getUrlParameters = (url: string): any => {
  const params: any = url.match(/([^?=&]+)(=([^&]*))/g) || [];
  const res = params.reduce((a, v) => ((a[v.slice(0, v.indexOf("="))] = decodeURIComponent(v.slice(v.indexOf("=") + 1))), a), {});
  return res;
};

/** 根据身份证号码获取年龄、性别和出生日期 */
export const getIdCardInfo = (userCard, num) => {
  /** 获取出生日期 */
  if (num == 1) {
    const birth = userCard.substring(6, 10) + "-" + userCard.substring(10, 12) + "-" + userCard.substring(12, 14);
    return birth;
  }
  /** 获取性别 */
  if (num == 2) {
    if (parseInt(userCard.substr(16, 1)) % 2 == 1) {
      return "男";
    } else {
      return "女";
    }
  }
  /** 获取年龄 */
  if (num == 3) {
    const myDate = new Date();
    const month = myDate.getMonth() + 1;
    const day = myDate.getDate();
    let age = myDate.getFullYear() - userCard.substring(6, 10) - 1;
    if (userCard.substring(10, 12) < month || (userCard.substring(10, 12) == month && userCard.substring(12, 14) <= day)) {
      age++;
    }
    return age;
  }
};

/** 表格单元格编辑回调函数类型 */
export type EditCallBackType = (data: { prop: string; index: number; value: any; row: object }) => void;

/**
 * 表格单元格编辑(支持input和select编辑)
 * @param dataList 表格列表数据 Ref类型
 * @param callback 编辑成功的回调
 */
export const getTableCellEdit = (dataList: Ref<Array<any>>, callback: EditCallBackType) => {
  const editIndex = ref<number>(-1);
  const editValue = ref<string>("");
  const editProp = ref<string>("");
  const refs = ref([]);

  const onBlur = (type, prop, index, row) => {
    editIndex.value = -1;
    if (type === "select") return;
    const value = editValue.value;
    callback({ prop, value, index, row });
  };

  const onSelectChange = (prop, index, value, row) => {
    editIndex.value = -1;
    dataList.value[index][prop] = value;
    callback({ prop, value, index, row });
  };

  const onClick = (prop, index, row) => {
    editProp.value = prop;
    editIndex.value = index;
    editValue.value = row[prop];
    const timer = setTimeout(() => {
      refs[`${index}_${prop}`]?.value?.focus();
      clearTimeout(timer);
    }, 10);
  };

  /**
   * 1.输入框编辑
   * @param data 表格行相关数据
   * @param isEdit 是否可编辑
   */
  const editCellRenderer = (data, isEdit = true) => {
    const { row, column, index } = data;
    const fieldProp = column["property"];
    const showEdit = editIndex.value === index && fieldProp === editProp.value && isEdit;
    const clickCell = `${index}_${fieldProp}`;
    refs[`${index}_${fieldProp}`] = ref();

    return (
      <>
        <el-input
          size="small"
          v-show={showEdit}
          placeholder="请输入"
          ref={refs[clickCell]}
          v-model={editValue.value}
          onBlur={() => onBlur("input", fieldProp, index, row)}
          onKeyup={(e) => e.code === "Enter" && e.target.blur()}
        />
        <span v-show={!showEdit} style={{ height: "24px" }} class="edit_input ui-w-100 ui-d-ib pointer" onClick={withModifiers(() => onClick(fieldProp, index, row), ["stop"])}>
          {row[fieldProp]}
        </span>
      </>
    );
  };

  const defaultStyle: CSSProperties = {
    minHeight: "18px",
    color: "#fff",
    height: "24px",
    lineHeight: "24px",
    borderRadius: "4px",
    textAlign: "center"
  };

  /**
   * 2.下拉框编辑
   * @param data 表格行相关数据
   * @param options 下拉框数据列表 `Array<{ label: string; value: any }>`
   * @param isEdit 是否可编辑
   * @param cellStyle 单元格样式
   */
  const editSelectRenderer = (data, options, isEdit = true, cellStyle?: CSSProperties) => {
    cellStyle = cellStyle || {};
    const { row, column, index } = data;
    const fieldProp = column["property"];
    const showEdit = editIndex.value === index && fieldProp === editProp.value && isEdit;
    const cellItem = options.find((item) => item.value === row[fieldProp]);
    const clickCell = `${index}_${fieldProp}`;
    refs[clickCell] = ref();

    return (
      <>
        <el-select
          size="small"
          v-show={showEdit}
          v-model={editValue.value}
          class="ui-w-100"
          placeholder="请选择"
          ref={refs[clickCell]}
          onBlur={() => onBlur("select", fieldProp, index, row)}
          onChange={(value) => onSelectChange(fieldProp, index, value, row)}
        >
          {options?.map((item) => (
            <el-option key={item.value} label={item.label} value={item.value} />
          ))}
        </el-select>
        <span v-show={!showEdit} class="edit_select ui-w-100 ui-d-ib pointer" style={{ ...defaultStyle, ...cellStyle }} onClick={withModifiers(() => onClick(fieldProp, index, row), ["stop"])}>
          {cellItem?.label}
        </span>
      </>
    );
  };

  return { editCellRenderer, editSelectRenderer };
};
