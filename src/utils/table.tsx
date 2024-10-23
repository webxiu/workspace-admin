/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-18 11:20:47
 */

import dayjs from "dayjs";
import { utils, writeFile } from "xlsx";
import ExcelJS from "exceljs";
import { IconConf } from "@/config/elements";
import Expand from "@iconify-icons/ep/expand";
import Sortable, { MoveEvent } from "sortablejs";
import RegInput from "@/components/RegInput.vue";
import { getUrlParameters, onDownload } from "@/utils/common";
import PriceTag from "@iconify-icons/ep/price-tag";
import { clone, cloneDeep, deviceDetection } from "@pureadmin/utils";
import { TableColumnRenderer } from "@pureadmin/table";
import { message, showMessageBox } from "@/utils/message";
import { getRouterInfo, removeRouterInfo } from "@/utils/storage";
import IconifyIconOffline from "@/components/ReIcon/src/iconifyIconOffline";
import { type DatePickerProps, type TableColumnCtx, type TableRefs, type InputProps, type ElSelect, colProps } from "element-plus";
import { getBOMTableRowSelectOptions, OptionItemType, OptionResType } from "@/api/plmManage";
import { CSSProperties, Ref, nextTick, reactive, ref, withModifiers, type VNode } from "vue";
import {
  menuColumnList,
  MenuColumnItemType,
  userMenuColumnList,
  updateUserMenuColumn,
  tableGroupList,
  recoverUserMenuColumn,
  TableGroupItemType,
  MenuButtonItemType,
  menuButtonVirtualList
} from "@/api/systemManage";

export interface SortableCallbackType {
  type: "row" | "column";
  newIndex: number;
  oldIndex: number;
  sortable: Sortable;
  fromName?: string;
  toName?: string;
}

/** 表格配置列自定函数类型 */
export type RendererType = (data: TableColumnRenderer) => VNode;

const moveRowName = reactive({ fromName: "", toName: "" });
const isMobile = deviceDetection();

/** 行拖拽(需要等列配置加载完成在初始化) */
export const rowDrop = (dataList: Ref<any>, prefixSelector: string, callback?: (v: SortableCallbackType) => void) => {
  nextTick(() => {
    const wrapper: HTMLElement = document.querySelector(prefixSelector + " .el-table__body-wrapper tbody");
    const sortable = Sortable.create(wrapper, {
      animation: 300,
      handle: prefixSelector + " .el-table__row",
      filter: (event, target, sortable) => {
        const isLevel1 = target.className.includes("el-table__row--level-0");
        return isLevel1;
      },
      onMove: (evt: MoveEvent) => {
        moveRowName.toName = evt.related.innerText;
      },
      onEnd: ({ newIndex, oldIndex, item }) => {
        moveRowName.fromName = item.innerText;
        if (!dataList) {
          console.error("请传入dataList值");
        } else {
          const currentRow = dataList.value.splice(oldIndex, 1)[0];
          dataList.value.splice(newIndex, 0, currentRow);
        }
        if (typeof callback === "function") callback({ type: "row", newIndex, oldIndex, sortable, ...moveRowName });
      }
    });
  });
};
const moveName = reactive({ fromName: "", toName: "" });
/** 列拖拽 */
export const columnDrop = (columnsDrag: Ref<any>, prefixSelector: string, callback?: (v: SortableCallbackType) => void) => {
  nextTick(() => {
    const wrapper: HTMLElement = document.querySelector(prefixSelector + " .el-table__header-wrapper tr");
    const sortable = Sortable.create(wrapper, {
      animation: 300,
      delay: 0,
      onMove: (evt: MoveEvent) => {
        moveName.toName = evt.related.innerText;
      },
      onEnd: ({ newIndex, oldIndex, item }) => {
        moveName.fromName = item.innerText;
        const oldItem = columnsDrag.value[oldIndex];
        columnsDrag.value.splice(oldIndex, 1);
        columnsDrag.value.splice(newIndex, 0, oldItem);
        if (typeof callback === "function") callback({ type: "column", newIndex, oldIndex, sortable, ...moveName });
      }
    });
  });
};

/** 列筛选函数 */
export const filterHandler = (value, row, column) => {
  const property = column["property"];
  return row[property] === value;
};

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
  /** 表格渲染数据 */
  dataList?: Ref<any[]>;
  /** 表格拖拽选择器(存在多个表格区分唯一表格), 需配合`isDragColumn`或`isDragRow`使用 不传 `默认不拖拽` */
  dragSelector?: string;
  /** 是否序号索引分页累加 不传 `默认不累加` */
  formData?: { page: number; limit: number };
  /** 是否显示单选按钮 不传 `默认显示` */
  radioColumn?: TableColumnList | false;
  /** 是否显示序号 不传 `默认显示` */
  indexColumn?: TableColumnList | false;
  /** 是否显示操作列 默认宽 `140` 不传 `默认显示` */
  operationColumn?: TableColumnList | false;
  /** 是否显示多选 不传 `默认不显示` */
  selectionColumn?: TableColumnList | false;
  /** 是否显示自定义折叠图标 不传`默认不显示` */
  isCustomExpend?: boolean;
  /** 是否拖拽列(设置此项`dragSelector`必传) */
  isDragColumn?: boolean;
  /** 是否拖拽行(设置此项`dataList`与`dragSelector`必传) */
  isDragRow?: boolean;
}

/** 表格列配置(嵌套表格不支持拖拽) callback:拖拽行列交换索引回调 */
export const setColumn = (options: ColumnOptionType, callback?: (v: SortableCallbackType) => void) => {
  const {
    dataList,
    formData,
    dragSelector,
    indexColumn = {},
    radioColumn = {},
    operationColumn = {},
    selectionColumn = {},
    isDragRow = false,
    isDragColumn = false,
    isCustomExpend = false
  } = options;
  const columnsDrag = ref<TableColumnList[]>([]);
  const columnData: TableColumnList[] = cloneDeep(options.columnData || []);

  // 配置表格折叠图标
  const cellRendererExpend = (data): JSX.Element => {
    const { row, column, store } = data;
    return (
      <div class="ui-d-ib" style={{ transform: "translate(-6px, 0px)" }}>
        <IconifyIconOffline
          class="mr-2 fz-16 pointer ui-d-ib ui-va-tb"
          icon={row.children?.length ? Expand : PriceTag}
          onClick={withModifiers(() => store.toggleRowExpansionAdapter(row), ["stop"])}
        />
        <span>{row[column["property"]]}</span>
      </div>
    );
  };

  // 自增索引
  const cellRendererIndex = ({ $index }) => {
    let indexNumber = $index + 1;
    if (formData?.page && formData?.limit) {
      indexNumber = (formData.page - 1) * formData.limit + $index + 1;
    }
    return <span>{indexNumber}</span>;
  };

  columnsDrag.value = []; // 初始化
  const expendRow = columnData.splice(0, 1)[0]; // 取出第一列添加折叠按钮
  const fixedItem = columnData.find((f) => f.fixed === "left"); // 是否有左固定列

  // 配置单选|多选|序号|操作列
  const mergeColumn: TableColumnList[] = [
    // 1.单选按钮 (默认显示)
    {
      type: "index",
      prop: "radio",
      width: 40,
      align: "center",
      fixed: fixedItem?.fixed,
      hide: !radioColumn,
      ...radioColumn,
      showOverflowTooltip: true,
      cellRenderer: () => <el-radio label="&nbsp;" class="table-radio" size="small" />
    },
    // 2.多选 (默认不显示)
    {
      type: "selection",
      prop: "selection",
      width: 55,
      align: "center",
      headerAlign: "center",
      fixed: fixedItem?.fixed,
      hide: true,
      ...selectionColumn
    },
    // 3.序号 (默认显示)
    {
      type: "index",
      label: "序号",
      prop: "index",
      width: 55,
      align: "center",
      fixed: fixedItem?.fixed,
      hide: !indexColumn,
      cellRenderer: cellRendererIndex,
      ...indexColumn
    },
    // 4.折叠按钮 (默认不显示)
    { align: "left", ...expendRow, cellRenderer: isCustomExpend ? cellRendererExpend : expendRow.cellRenderer },
    ...columnData,
    // 5.操作 (默认显示)
    { label: "操作", fixed: "right", align: "center", prop: "operation", minWidth: 140, slot: "operation", hide: !operationColumn, ...operationColumn }
  ];

  const columnList: TableColumnList[] = clone(
    mergeColumn
      .filter((item) => !item.hide)
      .map((item) => {
        columnsDrag.value.push({ label: item.label, prop: item.prop });
        return {
          minWidth: 120,
          align: "left",
          headerAlign: "center",
          ...item,
          fixed: isMobile ? false : item.fixed, // 移动端移除固定
          columnKey: item.prop,
          prop: isDragColumn ? (index: number) => columnsDrag.value[index]?.prop as string : item.prop
        };
      })
  );
  // 配置拖拽必须添加表格选择器
  if (dragSelector) {
    if (isDragColumn) columnDrop(columnsDrag, dragSelector, callback);
    if (isDragRow) rowDrop(dataList, dragSelector, callback);
  }
  return clone(columnList);
};

/**
 * 表格导出配置表头
 * @param exportName 文件名
 * @param columns 表格配置列
 * @param params 其他参数
 */
export const getExportConfig = (exportName: string, columns: TableColumnList[], params?: any, toJSon?: boolean) => {
  const excelHeader = columns.map((item, index) => {
    const field = typeof item.prop === "function" ? item.columnKey : item.prop;
    return { ...item, field: field, title: item.label, width: 160, key: `0-${index}}`, hide: false, colspan: 1, rowspan: 1, type: "normal", colGroup: false };
  });

  const headConfig = {
    page: 1,
    limit: 1000000,
    excel: {
      excelName: exportName,
      excelHeader: toJSon ? excelHeader : JSON.stringify(excelHeader)
    },
    ...params
  };
  return headConfig;
};

export interface DownloadDataType {
  /** 导出的数据 */
  dataList: any[];
  /** 表格配置列 */
  columns: TableColumnList[];
  /** sheet名称 */
  sheetName: string;
}
export interface OptionsType {
  optionValue: any;
  optionName: string;
  disabled?: boolean;
}

/** 导出有效列 */
const isValidCol = (column: TableColumnList) => {
  const isRadio = column.prop !== "radio";
  const isOperation = column.slot !== "operation";
  const isSelect = !["expand", "selection"].includes(column.type);
  return isRadio && isOperation && isSelect;
};

/**
 * 纯表格数据导出
 * @param options 导出选项: 支持导出多表, 传入数组即可
 * @param fileName 导出excel文件名称
 */
export const downloadDataToExcel = (options: DownloadDataType | DownloadDataType[], fileName = "") => {
  const _options = Array.isArray(options) ? options : [options];
  const _fileName = fileName || _options[0].sheetName;
  const workBook = utils.book_new();

  _options.forEach((option, idx) => {
    const cellList: string[][] = [];
    function getData(dataList: any[]) {
      dataList.map((item, index) => {
        const arr = [];
        option.columns.forEach((column) => {
          const prop = typeof column.prop === "function" ? column.columnKey : column.prop;
          if (column.type === "index" && column.prop !== "radio") {
            arr.push(cellList.length + 1); // index + 1
          } else if (isValidCol(column)) {
            arr.push(item[prop]);
          }
        });
        cellList.push(arr);
        if (item.children?.length) {
          getData(item.children);
        }
      });
    }
    getData(option.dataList);

    // 首行表头
    const titles: string[] = option.columns.reduce((prev, column) => {
      if (isValidCol(column)) prev.push(column.label);
      return prev;
    }, []);

    cellList.unshift(titles);
    const workSheet = utils.aoa_to_sheet(cellList);
    utils.book_append_sheet(workBook, workSheet, option.sheetName || `Sheet${idx + 1}`);
  });
  writeFile(workBook, `${_fileName}_${Date.now()}.xlsx`);
};

export interface ExcelJSConfigType {
  /** 导出文件名 */
  fileName: string;
  /** 图片字段 */
  imgProp?: string;
  /** 图片宽高 */
  imgSize?: [number, number?];
}

/**
 * 导出图片表格
 * @param options 导出选项: 支持导出多表, 传入数组即可
 * @param fileName 导出excel文件名称
 */
export const exportImgToExcel = (options: DownloadDataType | DownloadDataType[], config: ExcelJSConfigType) => {
  const _options = Array.isArray(options) ? options : [options];
  const { fileName, imgProp = "", imgSize = [40, 40] } = config;
  const _fileName = fileName || _options[0].sheetName;

  const workBook = new ExcelJS.Workbook();
  _options.forEach((option) => {
    const worksheet = workBook.addWorksheet(option.sheetName);
    const headTitles: string[] = option.columns.reduce((prev, column) => {
      if (isValidCol(column)) prev.push(column.label);
      return prev;
    }, []);
    worksheet.addRow(headTitles);

    // 插入数据
    function getData(dataList: any[]) {
      dataList.map((row, rowIndex) => {
        const cellArr: any[] = [];
        option.columns.forEach((column) => {
          const prop = typeof column.prop === "function" ? column.columnKey : column.prop;
          if (column.type === "index" && column.prop !== "radio") {
            cellArr.push(rowIndex + 1);
          } else if (isValidCol(column)) {
            const rowVal = prop === imgProp ? "" : row[prop];
            cellArr.push(rowVal);
          }
        });
        if (row.children?.length) getData(row.children);
        worksheet.addRow(cellArr);

        // 插入图片到表格中
        if (row[imgProp]) {
          const imageId = workBook.addImage({
            base64: row[imgProp].split(",").pop(),
            extension: "jpeg"
          });
          const rowNum = rowIndex + 2;
          const colNum = option.columns.findIndex((column) => column.prop === imgProp); // 动态获取图片列索引
          const width = imgSize[0];
          const height = imgSize[1] || width;
          worksheet.addImage(imageId, {
            tl: { col: colNum - 1, row: rowNum - 1 },
            ext: { width: width, height: height }
          });
          worksheet.getRow(rowNum).height = height;
          worksheet.getColumn(colNum).width = width / 7;
        }
      });
    }
    getData(option.dataList);
  });
  // 导出到Excel
  workBook.xlsx
    .writeBuffer()
    .then((buffer) => {
      const blob = new Blob([buffer], { type: "application/octet-stream" });
      onDownload(blob, `${_fileName}.xlsx`);
    })
    .catch(() => message("导出失败", { type: "error" }));
};

// 数字转千分位格式(decimal: 默认保留2位有效数字)
export const formatMoneyComma = (num: number | string, decimal = 2, thousand = true): string => {
  const value = Number(`${num}`.replace(/,/g, ""));
  if (Number.isNaN(value)) return num?.toString() ?? "";
  const floatNum = value.toFixed(decimal);
  if (thousand) {
    return Number(floatNum).toLocaleString("zh-CN", { currency: "CNY", minimumFractionDigits: decimal });
  } else {
    return floatNum.toString();
  }
};

/**
 * 自定义统计函数
 * @param options.params          表格参数数据
 * @param options.emptyText       文本显示, 默认 `--`
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

/** 设置表格回显多页选中状态 */
export const setSelectCheckbox = <T extends Record<string, any>>({
  tableRef,
  dataList,
  rowsData,
  uniId = "id"
}: {
  /** 表格ref实例 */
  tableRef: Ref<TableRefs>;
  /** 表格列表数据 */
  dataList: Ref<T[]>;
  /** 多页选择行数据 */
  rowsData: Ref<T[]>;
  /** 唯一标识字段(可选,默认id) */
  uniId?: string;
}) => {
  nextTick(() => {
    rowsData.value.forEach((item) => {
      const row = dataList.value.find((f) => f[uniId] === item[uniId]);
      if (row) {
        tableRef.value?.getTableRef()?.toggleRowSelection(row, true);
      }
    });
  });
};

/** 设置表格多页选中行数据(在表格的@select事件中调用) */
export const setSelectChange = <T extends Record<string, any>>({
  rowsData,
  rows,
  row,
  uniId = "id"
}: {
  /** 多页选择行数据 */
  rowsData: Ref<T[]>;
  /** 当前选中行数据 */
  rows: T[];
  /** 点击行数据 */
  row: T;
  /** 唯一标识字段(可选,默认id) */
  uniId?: string;
}) => {
  const result = rowsData.value.filter((f) => rows.find((s) => s[uniId] === f[uniId]));
  if (result.length < rows.length) {
    rowsData.value.push(row);
  } else {
    const index = rowsData.value.findIndex((f) => f[uniId] === row[uniId]);
    rowsData.value.splice(index, 1);
  }
};

export type PageSelectType<T> = {
  /** 表格ref实例 */
  tableRef: Ref<TableRefs>;
  /** 表格列表数据 */
  dataList: Ref<T[]>;
  /** 多页选择行数据 */
  rowsData: Ref<T[]>;
  /** 表格唯一标识字段(可选,默认id) */
  uniId?: string;
};

export type SelectRowType<T> = {
  /** 已选中行数据 */
  rows: T[];
  /** 点击选中/取消行数据 */
  row: T;
};

/** 表格分页多选处理 */
export const usePageSelect = <T extends Record<string, any>>({ tableRef, dataList, rowsData, uniId = "id" }: PageSelectType<T>) => {
  /** 设置回显(在获取到数据时调用) */
  const setSelectCheckbox = () => {
    nextTick(() => {
      rowsData.value.forEach((item) => {
        const row = dataList.value.find((f) => f[uniId] === item[uniId]);
        if (row) {
          tableRef.value?.getTableRef()?.toggleRowSelection(row, true);
        }
      });
    });
  };

  /** 设置选中与取消(在表格的@select事件中调用) */
  const setSelectChange = ({ rows, row }: SelectRowType<T>) => {
    const result = rowsData.value.filter((f) => rows.find((s) => s[uniId] === f[uniId]));
    if (result.length < rows.length) {
      rowsData.value.push(row);
    } else {
      const index = rowsData.value.findIndex((f) => f[uniId] === row[uniId]);
      rowsData.value.splice(index, 1);
    }
  };
  /** 表头多选框(在表格的@select-all事件中调用) */
  const setSelectAllChange = (rows: T[]) => {
    if (rows.length) {
      rowsData.value = [...rowsData.value, ...rows];
    } else {
      const result = rowsData.value.filter((f) => !dataList.value.find((s) => s[uniId] === f[uniId]));
      rowsData.value = result;
    }
  };
  return { setSelectCheckbox, setSelectChange, setSelectAllChange };
};

export type CellOptionType = {
  disabled?: boolean;
  optionName: string;
  optionValue: any;
};
export interface CellRenderType {
  /** 输入类型(默认input) */
  type?: "input" | "select" | "date" | "dateTime" | "treeSelect" | "custom";
  /** 表格行数据 */
  data: TableColumnRenderer;
  /** 仅在下拉框使用 */
  options?: CellOptionType[];
  /** 是否可以编辑列 */
  isEdit?: boolean;
  /** 单元格样式 */
  cellStyle?: CSSProperties;
  /** 日期属性 */
  eleProps?: (Partial<DatePickerProps | InputProps> | { style: CSSProperties; class?: string }) & Record<string, any>;
}

/** 编辑完成回调参数类型 */
export interface CallBackParamType {
  prop: string;
  index: number;
  column: any;
  row: Record<string, any>;
}
/** 自定义渲染函数参数类型 */
export interface CustomCellParamType extends CallBackParamType {
  editMap: Ref<{}>;
  callback: (opt: { index: number }) => void;
}

/** 点击单元格切换输入类型 */
interface RowColRowType {
  rowIndex: number;
  colIndex: number;
  row: Record<string, any>;
}
/** 表格编辑配置渲染类型 */
interface TableEditOptionType {
  /** 编辑前回调 (需要返回值, 返回false则不触发编辑)*/
  editBefore?: (data: CallBackParamType) => boolean;
  /** 编辑完成回调 */
  editFinish?: (data: CallBackParamType) => void;
  /** 自定义渲染函数 */
  customRender?: (data: CustomCellParamType) => JSX.Element;
}

/**
 * 表格单元格编辑渲染函数
 * @param callback 编辑完成回调
 * @param customRender 自定义渲染函数
 */
export function tableEditRender(options: TableEditOptionType = {}) {
  const { editFinish, customRender, editBefore } = options;
  const editMap = ref({}); // 记录编辑行列及编辑状态

  // 记录编辑单元格行列索引和行数据
  function rowEditMap({ colIndex, rowIndex, row }: RowColRowType) {
    editMap.value[rowIndex] = { ...row, editable: true, colIndex };
  }

  // 编辑完成还原单元格
  const onFinish = (data: CallBackParamType) => {
    editMap.value[data.index].editable = false;
    if (typeof editFinish === "function") editFinish(data);
  };

  // 编辑渲染函数
  function editCellRender({ type = "input", data, isEdit = true, options, cellStyle, eleProps }: CellRenderType) {
    const { row, index, column } = data;
    const prop = column["property"];
    const isEditable = editMap.value[index]?.editable;
    const colIndex = editMap.value[index]?.colIndex;
    if (isEditable && isEdit && colIndex === column["rawColumnKey"]) {
      const onBlur = () => onFinish({ index, prop, row, column });

      // 1.输入框编辑
      const InputCom = () => <RegInput v-model={row[column.columnKey]} autoFocus={true} placeholder="请输入" autoSelect={true} {...eleProps} onBlur={onBlur} />;
      // 2.下拉框编辑
      const SelectCom = () => (
        <el-select
          filterable
          v-model={row[column.columnKey]}
          placeholder="请选择"
          class="ui-w-100"
          size="small"
          {...eleProps}
          onChange={onBlur}
          onBlur={onBlur}
        >
          {options.map((item) => (
            <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} disabled={item.disabled} />
          ))}
        </el-select>
      );
      // 3.日期框编辑
      const DatePickerCom = () => (
        <el-date-picker
          v-model={row[column.columnKey]}
          type="date"
          size="small"
          placeholder="请选择日期"
          onBlur={onBlur}
          onChange={onBlur}
          clearable={false}
          value-format="YYYY-MM-DD"
          style={{ width: "100%" }}
          {...eleProps}
        />
      );
      // 4.时间框编辑
      const DateTimeCom = () => (
        <el-time-picker
          v-model={row[column.columnKey]}
          size="small"
          value-format="HH:mm"
          placeholder="请选择时间"
          style={{ width: "100%" }}
          clearable={false}
          onBlur={onBlur}
          onChange={onBlur}
          {...eleProps}
        />
      );
      // 5.自定义编辑
      const MyCustomRender = () => customRender({ editMap, index, prop, row, column, callback: onBlur });

      // 6.树形下拉编辑
      const TreeSelectCom = () => (
        <el-tree-select
          v-model={row[column.columnKey]}
          props={{
            label: "optionName",
            value: "optionValue"
          }}
          data={options}
          filterable
          placeholder="请选择"
          class="ui-w-100"
          size="small"
          {...eleProps}
          onChange={onBlur}
          onBlur={onBlur}
        />
      );

      const eleConfig = {
        input: InputCom,
        select: SelectCom,
        date: DatePickerCom,
        dateTime: DateTimeCom,
        treeSelect: TreeSelectCom,
        custom: MyCustomRender
      };
      if (customRender) type = "custom";
      return eleConfig[type]();
    }

    function onClickEdit() {
      const res = typeof editBefore === "function" ? editBefore({ index, prop, row, column }) : true;
      if (res) rowEditMap({ colIndex: column["rawColumnKey"], rowIndex: index, row });
    }

    let cellValue = row[column.columnKey]; // 单元格取值
    const boxStyle = { height: "24px", lineHeight: "24px", ...cellStyle };
    if (["treeSelect", "select"].includes(type)) {
      boxStyle.textAlign = cellStyle?.textAlign || "center";
      cellValue = options.find((item) => item.optionValue === row[column.columnKey])?.optionName;
      // 下拉框多选时，用逗号拼接
      if (eleProps?.multiple) {
        cellValue = (row[column.columnKey] || [])?.join(",");
      }
    }
    return (
      <span onClick={onClickEdit} style={boxStyle} class="ui-w-100 ui-d-ib pointer ui-va-m ellipsis br-4">
        {cellValue}
      </span>
    );
  }

  return { editCellRender };
}

/**
 * 表格排序
 * @param dataList 表格数据
 * @param row 表格行
 * @param field 序号字段
 * @param direction 排序方向, 默认: 空
 * @param callback 交换索引回调函数
 */
export const moveTableRow = <T extends object>(
  dataList: Ref<T[]>,
  row: T | object,
  field: string,
  direction?: "up" | "down" | "",
  callback?: (data: { newIndex: number; oldIndex: number; newArr: T[] }) => void
) => {
  function moveFn() {
    let seq = Number(row[field]);
    if (direction) {
      const val = direction === "up" ? -1 : 1;
      seq += val;
    }
    const len = dataList.value.length;
    const newArr = dataList.value.filter((f) => f[field] !== row[field]);
    const oldIndex = dataList.value.findIndex((f) => f[field] === row[field]);
    const newIndex = seq >= len ? len - 1 : seq <= 0 ? 0 : seq - 1;
    newArr.splice(newIndex, 0, row as T);
    newArr.forEach((item, index) => (item[field] = index + 1));
    if (typeof callback === "function") callback({ oldIndex, newIndex, newArr });
  }
  window.requestAnimationFrame(moveFn);
};

/** 拖拽元素排序配置选项类型 */
export interface MoveSortOptionType<T> {
  dataList: Ref<T[]>;
  selector: string;
  handle?: string;
  callback?: (data: { newIndex: number; oldIndex: number; sortable: Sortable; newData: T[] }) => void;
}

/** 拖拽元素排序 */
export function moveEleSort<T extends {}>(options: MoveSortOptionType<T>) {
  const { dataList, selector, handle, callback = () => {} } = options;
  const wrapper: HTMLElement = document.querySelector(selector);
  const sortable = Sortable.create(wrapper, {
    animation: 300,
    handle: handle,
    onMove: (evt: MoveEvent) => {},
    onEnd: ({ newIndex, oldIndex }) => {
      if (!dataList.value.length) return;
      const oItem = dataList.value.splice(oldIndex, 1)[0];
      dataList.value.splice(newIndex, 0, oItem);
      callback({ newIndex, oldIndex, sortable, newData: dataList.value });
    }
  });
}

export interface FormatDataType {
  /** 日期类型 */
  date: string;
  /** 小数位 */
  decimal?: number;
  /** 类型 */
  type: string;
  /** 千分位 */
  thousand?: boolean;
  /** 金额符号 */
  symbol?: string;
  /** 内边距(水平) */
  paddingV?: string;
  /** 内边距(垂直) */
  paddingH?: string;
  /** 圆角 */
  borderRadius?: string;
  /** 样式 */
  style?: string;
  /** 标签配置 */
  specs?: {
    uuid: number;
    value: string;
    label: string;
    color: string;
    background?: string;
  }[];
}

/** 动态表格: 格式化类型key */
export enum FormatKey {
  /** 默认 */
  default = "default",
  /** 数字 */
  number = "number",
  /** 日期 */
  date = "date",
  /** 标签 */
  tag = "tag"
}

/**
 * 获取格式化结果
 * @param item 配置列
 * @param value 单元格数据
 */
export const getFormatType = (item: TableColumnList, value) => {
  const fmtObj: FormatDataType = JSON.parse(item.formatType);
  const { type, decimal = 0, date, thousand = false, symbol = "", paddingV = 0, paddingH = 0, borderRadius = 0, style = "", specs = [] } = fmtObj;
  if (type === FormatKey.number) {
    // 数字
    return symbol + formatMoneyComma(value, decimal, thousand);
  } else if (type === FormatKey.date && dayjs(value).isValid()) {
    // 日期
    return dayjs(value).format(date);
  } else if (type === FormatKey.tag && !value?.__v_isVNode) {
    // 标签
    const result = specs?.find((item) => item.value === `${value}`);
    const { label, color = "inherit", background = "inherit" } = result || ({} as any);
    // 内边距,外边距, 圆角及剩余样式修改
    const cssStyle = `padding: ${paddingV}px ${paddingH}px;
     border-radius: ${borderRadius}px;
     color: ${color};
     background: ${background};
    ${style}`;
    return <span style={cssStyle}>{label || value}</span>;
  }
  return value;
};

/**
 * 获取对象深度值
 * @param obj 获取对象
 * @param key 对象深度('xx.cc.val')
 */
export function getValue(obj: object, key: string) {
  return key.split(".").reduce((prev, cur) => (prev || {})[cur], obj);
}

/**
 * 设置对象深度值
 * @param obj 设置对象
 * @param key 对象深度
 * @param value 设置值
 */
export function setValue(obj: object, key: string, value: any) {
  key.split(".").reduce((obj, key, i, arr) => {
    if (i < arr.length - 1) {
      if (!obj[key]) obj[key] = {};
      obj = obj[key];
    } else {
      obj[key] = value;
    }
    return obj;
  }, obj);
  return obj;
}

/**
 * 获取表格动态配置列(单元格数据自定显示处理)
 * @param columnList 接口获取的配置列
 * @param dataList 表格数据
 * @param updateCellFn 修改单元格回调函数, 不传默认不可编辑
 */
export const getColumnData = (columnList: TableColumnList[], dataList?: Ref<Array<any>>) => {
  const columnData = columnList.map((item: TableColumnList) => {
    if (item.cellRenderer) return item; // 若cellRender已经配置, 直接使用已配置好的
    return {
      ...item,
      cellRenderer: item.formatType
        ? (data) => {
            const { column, row } = data;
            const prop = column["property"];
            const deepValue = getValue(row, prop); // 多层属性取值
            if (item.formatType && ![undefined, null].includes(deepValue)) {
              return getFormatType(item, deepValue);
            }
            return deepValue;
          }
        : undefined
    };
  });
  return { columnData };
};

/**
 * 数组根据某个属性分类
 * @param arr 数组
 * @param prop 属性字段
 */
export function getArrayAlassify<T extends Record<string, any>>(arr: T[], prop: string) {
  const obj: Record<string, T[]> = arr.reduce((prev: any, item: T) => {
    const key = item[prop];
    prev[key] = prev[key] || [];
    prev[key].push(item);
    return prev;
  }, {});
  const keys = Object.keys(obj).map(Number);
  keys.sort((a, b) => a - b);
  const sortedValues = keys.map((key) => obj[key] || []);
  return sortedValues;
}

interface MenuColumnReturnType {
  columnArrs: TableColumnList[][];
  groupArrs: TableGroupItemType[];
  buttonArrs: MenuButtonItemType[][];
}

/**
 * 获取动态菜单配置列表, 返回配置列数组, 数组第0项为默认显示的主表格, 其余表格按递增顺序对应
 * @param renderConfig 自定义的cellRenderer配置
 * @returns 列配置数据+分组列表数据, 数组的最后一项为分组数据, 获取时注意区分(目的: 为了一次性返回)
 */
export const getMenuColumns = async (renderConfig: Array<Record<string, RendererType>> = []): Promise<MenuColumnReturnType> => {
  let columnArrs: TableColumnList[][] = [];
  let groupArrs: TableGroupItemType[] = [];
  let buttonArrs: MenuButtonItemType[][] = [];
  // 如果存在弹窗中引入了其路由页面作为组件使用, 需要获取对应的菜单id
  const routeId = getRouterInfo().id;
  try {
    let { menuId } = getUrlParameters();
    if (routeId) menuId = routeId;
    if (!menuId) throw new Error("菜单id不存在");
    // const { data } = await menuColumnList({ menuId });
    const { data } = await userMenuColumnList({ menuId });
    const { data: data2 } = await tableGroupList({ menuId });
    const { data: data3 } = await menuButtonVirtualList({ menuId });
    groupArrs = data2;
    buttonArrs = getArrayAlassify<MenuButtonItemType>(data3, "groupCode");
    removeRouterInfo(); // 移除本地路由存储信息
    if (data?.length) {
      const columnsCate = getArrayAlassify(data, "groupCode");
      columnArrs = columnsCate.map((list, index) => {
        const columnList = list.map((item) => {
          // 将为null数据改为undefined
          Object.keys(item).forEach((key) => {
            if (item[key] === null) item[key] = undefined;
          });
          if (renderConfig[index]?.[item.prop]) item.cellRenderer = renderConfig[index][item.prop];
          return item;
        });
        const { columnData } = getColumnData(columnList);
        return columnData;
      });
    }
  } catch (error) {
    message(error.toString(), { type: "error" });
    console.error("menu:", error);
  }
  return { columnArrs, groupArrs, buttonArrs };
};

/**
 * 修改用户表格配置
 * @param type 保存或恢复表格配置
 * @param columns 配置列
 * @param cb 成功回调
 */
export const setUserMenuColumns = async (type: "save" | "recover", columns: TableColumnList[], cb?: Function) => {
  if (type === "save") {
    const nColumns = columns.filter((item) => {
      const excludeCol = ["radio", "selection", "index", "operation"];
      return !excludeCol.includes(item.prop as string);
    });
    nColumns.forEach((item, index) => (item.seq = index + 1));
    const { data } = await updateUserMenuColumn(nColumns);
    if (data) return message("修改成功");
    message("修改失败", { type: "error" });
  } else {
    const { menuId, columnGroupId, groupName } = columns.find((item) => item.menuId && item.columnGroupId) || {};
    if (!menuId || !groupName) return message("菜单ID获取失败", { type: "error" });
    showMessageBox(`确定要恢复【${groupName}】到默认配置吗?`).then(async () => {
      const { data } = await recoverUserMenuColumn({ menuId, columnGroupId });
      if (data) {
        cb && cb();
        message("恢复成功");
      } else {
        message("恢复失败", { type: "error" });
      }
    });
  }
};

/** 修改表头列宽 */
export const onHeaderDragend = (newWidth, column, columns: TableColumnList[]) => {
  columns.forEach((item) => {
    const isItem = item.prop === column.columnKey;
    if (isItem) item.width = newWidth;
  });
  setUserMenuColumns("save", columns);
};

/**
 * 更新操作按钮
 * @param buttonList 已配置按钮列表
 * @param buttons 后台配置按钮列表
 * @param option 执行方法配置选项 如: {export: onExport}
 */
export const updateButtonList = (buttonList: Ref<ButtonItemType[]>, buttons: MenuButtonItemType[]) => {
  if (!buttons?.length) return buttonList.value;
  const btnList = buttons.map((item) => {
    const { btnName, btnType, btnKey, btnSize, btnIcon, isDropDown } = item;
    const listItem = buttonList.value.find((f) => f.text.trim() === btnName.trim()) || {};
    return {
      ...listItem,
      type: btnType,
      text: btnName,
      size: btnSize,
      icon: IconConf[btnIcon],
      isDropDown: isDropDown
    };
  });
  if (btnList.length) buttonList.value = btnList;
  return buttonList.value;
};

interface OptionKey {
  /** 请假类型 */
  AskForLeaveType: "AskForLeaveType";
  /** 加班类型 */
  OvertimeType: "OvertimeType";
  /** 性别类型 */
  GenderType: "GenderType";
  /** 婚姻状况 */
  MaritalStatus: "MaritalStatus";
  /** 学历类型 */
  DegreeType: "DegreeType";
  /** 民族 */
  Ethnic: "Ethnic";
  /** 是否住宿 */
  DormitoryType: "DormitoryType";
  /** 数据权限 */
  DataAuthority: "DataAuthority";
  /** 职员状态 */
  EmployeeStatus: "EmployeeStatus";
  /** 劳务公司 */
  LaborCompany: "LaborCompany";
  /** 雇员种类 */
  EmployeeType: "EmployeeType";
  /** 工资条模板 */
  PayStubsTemplate: "PayStubsTemplate";
  /** 费用报表-统计部门 */
  AccountingDept: "AccountingDept";
  /** 用户状态 */
  UserStatus: "UserStatus";
  /** 审核状态 */
  ApprovalStatus: "ApprovalStatus";
  /** 工资条状态 */
  PayStubsStatus: "PayStubsStatus";
  /** 项目任务状态 */
  ProjectTaskStatus: "ProjectTaskStatus";
  /** 任务类型 */
  TaskType: "TaskType";
  /** 优先级 */
  PriorityLevel: "PriorityLevel";
  /** 入职登记级别 */
  EmployeeLevel: "EmployeeLevel";
  /** 有无驾驶证 */
  HaveOrNot: "HaveOrNot";
  /** 参加保险情况 */
  IncuranceStatus: "IncuranceStatus";
  /** 考勤方式 */
  AttendanceType: "AttendanceType";
  /** 项目类型 */
  MenuType: "MenuType";
  /** 基本单位 */
  PLMMaterialUnits: "PLMMaterialUnits";
  /** 是否 */
  BeOrNot: "BeOrNot";
  /** 成品类型 */
  ProductType: "ProductType";
  /** 仓库 */
  Warehourse: "Warehourse";
  /** PLM物料种类 */
  MaterialType: "MaterialType";
  /** 存货类别 */
  StockType: "StockType";
  /** 物料属性 */
  MaterialAttribute: "MaterialAttribute";
  /** 单据状态 */
  BillStatus: "BillStatus";
  /** 物料分组 */
  MaterialGroup: "MaterialGroup";
  /** 变更原因 */
  ChangeReason: "ChangeReason";
  /** 变更来源 */
  ChangeSource: "ChangeSource";
  /** 变更类型 */
  ChangeType: "ChangeType";
  /** 项目阶段 */
  ProjectStage: "ProjectStage";
  /** 项目工期单位 */
  ProjectCycleUnits: "ProjectCycleUnits";
  /** 变更申请目的 */
  ChangeTarget: "ChangeTarget";
  /** 用量类型 */
  DosageType: "DosageType";
  /** 发料方式 */
  IssueType: "IssueType";
  /** 产品设计输入技术项目 */
  ProductItemList: "ProductItemList";
  /** 评审内容 */
  ApprovalContents: "ApprovalContents";
  /** 信息中心任务状态 */
  InformationCenterTaskStatus: "InformationCenterTaskStatus";
  /** 我的任务优先级 */
  PLMTaskPriority: "PLMTaskPriority";
  /** 项目认证资料 */
  CertificationItem: "CertificationItem";
  /** 计量单位 */
  MaterialUnits: "MaterialUnits";
  /** 项目状态 */
  PLMProjectStatus: "PLMProjectStatus";
  /** 离职原因 */
  DimissionReason: "DimissionReason";
  /** 客诉单据状态 */
  ComplaintsBillStatus: "ComplaintsBillStatus";
  /** 客诉类型 */
  ComplaintsType: "ComplaintsType";
  /** 人事档案图片类型 */
  StaffPicType: "StaffPicType";
  /** 调度任务状态 */
  SchedulingStatus: "SchedulingStatus";
  /** 调度任务数据源 */
  SchedulingDataSource: "SchedulingDataSource";
  /** 费用明细部门 */
  CostDept: "CostDept";
  /** 文件库图标 */
  FileIcon: "FileIcon";
  /** 品牌信息 */
  BrandList: "BrandList";
  /** 商品分类 */
  ProductCategroy: "ProductCategroy";
  /** 内购订单状态 */
  InnerOrderStatus: "InnerOrderStatus";
  /** 任务管理优先级 */
  TaskPriority: "TaskPriority";
  /** 是否(True|False) */
  YesOrNo: "YesOrNo";
  /** 任务调度推送类型 */
  SchedulingSendType: "SchedulingSendType";
  /** 供应商采购订单状态 */
  POSignbackStatus: "POSignbackStatus";
  /** 值类型 */
  HTMLInputType: "HTMLInputType";
  /** 供应商订单管理回签状态 */
  POStatus: "POStatus";
  /** 任务管理任务类型 */
  ITTaskType: "ITTaskType";
  /** 任务管理驳回类型 */
  ITTaskDenailType: "ITTaskDenailType";
  /** 工号字段生成 */
  StaffCodeRule: "StaffCodeRule";
  /** 餐卡分发状态 */
  MealCardState: "MealCardState";
  /** 任务调度任务类型 */
  SchedulingTaskType: "SchedulingTaskType";
  /** 请假修改角色权限 */
  AskforleaveUpdateRole: "AskforleaveUpdateRole";
  /** 产品颜色 */
  ProductColor: "ProductColor";
  /** 接待项目 */
  ReceptionItemType: "ReceptionItemType";
  /** 接待准备 */
  ReceptionPrepareType: "ReceptionPrepareType";
  /** 客户区域 */
  CustomerArea: "CustomerArea";
  /** 流程管理表单地址 */
  WorkFlowFormUrl: "WorkFlowFormUrl";
  /** 单价取值 */
  UnitPriceValue: "UnitPriceValue";
  /** 菜单按钮 */
  MenuButton: "MenuButton";
  /** 前置任务模式 */
  RequireMode: "RequireMode";
  /** 接口权限类型 */
  PermissionType: "PermissionType";
  /** 我的工单系统枚举 */
  WorkOrderSystemType: "WorkOrderSystemType";
  /** 我的工单任务状态 */
  WorkOrderTaskStatus: "WorkOrderTaskStatus";
  /** PLM节日设置跳过双休字典 */
  PlmHolidaySetting: "PlmHolidaySetting";
  /** 菜单管理数据库选项 */
  DataBaseList: "DataBaseList";
  /** 报价固定成本信息 */
  QuotationFixedCost: "QuotationFixedCost";
  /** 订单回签状态 */
  SignBackState: "SignBackState";
  /** 物料属性属性值类型 */
  PropertyType: "PropertyType";
  /** 物料分组属性枚举值枚举 */
  MaterialGroupEnumInEnum: "MaterialGroupEnumInEnum";
  /** 映射状态 */
  MappingStatus: "MappingStatus";
  /** 项目管理负责人角色枚举 */
  ProjectMgmtHeadUserRoleEnum: "ProjectMgmtHeadUserRoleEnum";
  /** 电子作业指导书生产线 */
  ProductionLine: "ProductionLine";
  /** 电子作业指导书平板方位 */
  TabletsPosition: "TabletsPosition";
  /** 外出申请用车方式枚举 */
  GoOutVehicleUsage: "GoOutVehicleUsage";
  /** 交付物变更模式 */
  DeliverablesChangeMode: "DeliverablesChangeMode";
  /** 项目客户 */
  ProjectCustom: "ProjectCustom";
  /** 人事档案职级排序 */
  StaffRankOrder: "StaffRankOrder";
  /** 项目管理资料权限枚举 */
  PLMResourceAuthEnum: "PLMResourceAuthEnum";
  /** 项目模版删除权限 */
  ProjectModelDeleteAuth: "ProjectModelDeleteAuth";
  /** DR0开发类型 */
  DR0DevType: "DR0DevType";
  /** DR0产品等级 */
  DR0ProductLevel: "DR0ProductLevel";
  /** DR0产品颜色 */
  ProductColors: "ProductColors";
  /** DR0表面处理 */
  DR0Surface: "DR0Surface";
  /** DR0工作电压 */
  DR0Voltage: "DR0Voltage";
  /** DR0认证要求 */
  DR0AuthRequire: "DR0AuthRequire";
  /** DR0配件 */
  DR0Part: "DR0Part";
  /** 生产排产人员提醒 */
  RemindUsers: "RemindUsers";
  /** 生产排产角色提醒 */
  RemindRoles: "RemindRoles";
  /** 统计周期 */
  StatisticalPeriod: "StatisticalPeriod";
  /** 汇总周期 */
  GroupPeriod: "GroupPeriod";
  /** 爬取汇率币种清单-天 */
  ExRateCurrencyList: "ExRateCurrencyList";
  /** 爬取汇率币种清单-月 */
  Month: "Month";
  /** 标准工时单位 */
  StandardWorkTimeUnit: "StandardWorkTimeUnit";
  /** 库存周期复检 */
  StockCycleCheck: "StockCycleCheck";
  /** 周期复检提醒 */
  CycleCheckNotice: "CycleCheckNotice";
  /** 固定提前期单位 */
  FixBeforeUnit: "FixBeforeUnit";
  /** 变动提前期单位 */
  ChangeBeforeUnit: "ChangeBeforeUnit";
  /** 检验提前期单位 */
  CheckBeforeUnit: "CheckBeforeUnit";
  /** 手板类别 */
  HandleCategory: "HandleCategory";
  /** 手板一般测试要求 */
  NormalTestRequire: "NormalTestRequire";
  /** 国家代码 */
  CountryCode: "CountryCode";
}

export type OptionKeys = ValueOf<OptionKey>;

export type DictResultType<T extends OptionKeys[]> = { [K in T[number]]: OptionItemType[] };

/** 全局获取枚举字段下拉框列表 */
export const getEnumDictList = <T extends OptionKeys[]>(keys: T): Promise<DictResultType<T>> => {
  return new Promise<DictResultType<T>>((resolve, reject) => {
    getBOMTableRowSelectOptions({ optioncode: keys.join(",") })
      .then(({ data }) => {
        const result = keys.reduce((cur, prev) => {
          const result = data.find(({ optionCode }) => optionCode === prev);
          cur[prev] = result?.optionList || [];
          return cur;
        }, {}) as DictResultType<T>;
        resolve(result);
      })
      .catch(reject);
  });
};
