/*
 * @Author: lixiuhai
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: lixiuhai
 * @Last Modified time: 2024-01-02 15:25:39
 */

import { CSSProperties, Ref, nextTick, reactive, ref, withModifiers } from "vue";
import type { DatePickerProps, TableColumnCtx } from "element-plus";
import Sortable, { MoveEvent } from "sortablejs";
import { utils, writeFile } from "xlsx";

import Expand from "@iconify-icons/ep/expand";
import IconifyIconOffline from "@/components/ReIcon/src/iconifyIconOffline";
import PriceTag from "@iconify-icons/ep/price-tag";
import { TableColumnRenderer } from "@pureadmin/table";
import { clone } from "@pureadmin/utils";
import dayjs from "dayjs";
import { getUrlParameters } from "@/utils/common";
import { message } from "@/utils/message";

export interface SortableCallbackType {
  type: "row" | "column";
  newIndex: number;
  oldIndex: number;
  sortable: Sortable;
  fromName?: string;
  toName?: string;
}
const moveRowName = reactive({ fromName: "", toName: "" });

/** 行拖拽(需要等列配置加载完成在初始化) */
export const rowDrop = (dataList: Ref<any>, prefixSelector: string, callback?: (v: SortableCallbackType) => void) => {
  nextTick(() => {
    const wrapper: HTMLElement = document.querySelector(prefixSelector + " .el-table__body-wrapper tbody");
    const sortable = Sortable.create(wrapper, {
      animation: 300,
      handle: prefixSelector + " .el-table__row",
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
  /** 表格拖拽选择器(存在多个表格区分唯一表格) 不传 `默认不拖拽` */
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
    columnData = [],
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

  // 配置表格折叠图标
  const cellRendererExpend = (data): JSX.Element => {
    const { row, column, store } = data;
    return (
      <div class="ui-d-ib" style={{ transform: "translate(-6px, 0px)" }}>
        <IconifyIconOffline class="mr-2 fz-16 pointer ui-d-ib ui-va-tb" icon={row.children?.length ? Expand : PriceTag} onClick={withModifiers(() => store.toggleRowExpansionAdapter(row), ["stop"])} />
        <span>{row[column["property"]]}</span>
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

  columnsDrag.value = []; // 初始化
  const expendRow = columnData.splice(0, 1)[0]; // 取出第一列添加折叠按钮

  // 配置单选|多选|序号|操作列
  const mergeColumn: TableColumnList[] = [
    // 1.单选按钮 (默认显示)
    {
      type: "index",
      align: "center",
      width: 40,
      hide: !radioColumn,
      ...radioColumn,
      showOverflowTooltip: true,
      cellRenderer: () => <el-radio label="&nbsp;" size="small" />
    },
    // 2.多选 (默认不显示)
    { type: "selection", width: 55, align: "center", headerAlign: "center", hide: true, ...selectionColumn },
    // 3.序号 (默认显示)
    { label: "序号", type: "index", width: 55, align: "center", cellRenderer: cellRendererIndex, hide: !indexColumn, ...indexColumn },
    // 4.折叠按钮 (默认不显示)
    { align: "left", ...expendRow, cellRenderer: isCustomExpend ? cellRendererExpend : expendRow.cellRenderer },
    ...columnData,
    // 5.操作 (默认显示)
    { label: "操作", fixed: "right", align: "center", minWidth: 140, slot: "operation", hide: !operationColumn, ...operationColumn }
  ];

  const columnList: TableColumnList[] = clone(
    mergeColumn
      .filter((item) => !item.hide)
      .map((item) => {
        columnsDrag.value.push({ label: item.label, prop: item.prop });
        return {
          minWidth: 120,
          align: "left",
          headerAlign: "left",
          ...item,
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

export interface DownloadDataType {
  /** 导出的数据 */
  dataList: any[];
  /** 表格配置列 */
  columns: TableColumnList[];
  /** 文件名 */
  fileName: string;
}
export interface OptionsType {
  optionValue: any;
  optionName: string;
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

// 数字转千分位格式(decimal: 默认保留2位有效数字)
export const formatMoneyComma = (num: number | string, decimal = 2, thousand = true): string => {
  const value = Number(`${num}`.replace(/,/g, ""));
  if (Number.isNaN(value)) return num?.toString();
  const floatNum = value.toFixed(decimal);
  if (!thousand) return floatNum.toString();
  return Number(floatNum).toLocaleString("zh-CN", { currency: "CNY", minimumFractionDigits: decimal });
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

/** 表格单元格编辑回调函数类型 */
export type EditCallBackType = (data: { prop: string; index: number; value: any; row: object }) => void;

/**
 * 表格单元格编辑(支持input和select编辑)
 * @param dataList 表格列表数据 Ref类型
 * @param callback 编辑成功的回调
 */
export const getTableCellEdit = (dataList: Ref<Array<any>>, callback?: EditCallBackType) => {
  const editIndex = ref<number>(-1);
  const editValue = reactive({}); // 记录时间|下拉框|输入框的值
  const editProp = ref<string>("");
  const refs = ref([]);

  const onBlur = (type: "input" | "select" | "date", prop, index, row) => {
    const clickCell = `${index}_${prop}`;
    if (["select", "date"].includes(type)) {
      const timer = setTimeout(() => {
        editIndex.value = -1;
        clearTimeout(timer);
      }, 131);
    } else {
      editIndex.value = -1;
    }

    // 仅输入框失焦点执行回调, 下拉框等选择在change事件中执行回调
    if (["input"].includes(type)) {
      const value = editValue[clickCell];
      if (typeof callback === "function") callback({ prop, value, index, row });
    }
  };

  // 下拉框change事件
  const onSelectChange = (prop, index, value, row) => {
    const timer = setTimeout(() => {
      editIndex.value = -1;
      clearTimeout(timer);
    }, 199);
    dataList.value[index][prop] = value;
    if (typeof callback === "function") callback({ prop, value, index, row });
  };

  const onClick = (type: "input" | "select" | "date", prop, index, row) => {
    const clickCell = `${index}_${prop}`;
    editValue[clickCell] = row[prop];
    // 延迟显示编辑
    if (["select", "date"].includes(type)) {
      const timer = setTimeout(() => {
        editIndex.value = index;
        editProp.value = prop;
        clearTimeout(timer);
      }, 135);
    } else {
      editProp.value = prop;
      editIndex.value = index;
    }
    // 获取焦点
    const timer = setTimeout(() => {
      refs[clickCell]?.value?.focus();
      clearTimeout(timer);
    }, 146);
  };

  /**
   * 1.输入框编辑
   * @param data 表格行相关数据
   * @param isEdit 是否可编辑
   */
  const editCellRenderer = (data: TableColumnRenderer, isEdit = true, style?: CSSProperties) => {
    const { row, column, index } = data;
    const fieldProp = column["property"];
    const showEdit = editIndex.value === index && fieldProp === editProp.value && isEdit;
    const clickCell = `${index}_${fieldProp}`;
    refs[clickCell] = ref();

    return (
      <>
        <el-input
          size="small"
          v-show={showEdit}
          placeholder="请输入"
          ref={refs[clickCell]}
          v-model={editValue[clickCell]}
          onBlur={() => onBlur("input", fieldProp, index, row)}
          onKeyup={(e) => e.code === "Enter" && e.target.blur()}
        />
        <span
          v-show={!showEdit}
          style={{ height: "24px", lineHeight: "24px", ...style }}
          class="edit_input ui-w-100 ui-d-ib pointer ui-va-m ellipsis"
          onClick={withModifiers(() => onClick("input", fieldProp, index, row), ["stop"])}
        >
          {row[fieldProp]}
        </span>
      </>
    );
  };

  const defaultStyle: CSSProperties = {
    minHeight: "18px",
    height: "24px",
    lineHeight: "24px",
    borderRadius: "4px",
    textAlign: "center"
  };

  /**
   * 2.下拉框编辑
   * @param data 表格行相关数据
   * @param options 下拉框数据列表 `Array<{ optionName: string; optionValue: any }>`
   * @param isEdit 是否可编辑
   * @param cellStyle 单元格样式
   */
  const editSelectRenderer = (data: TableColumnRenderer, options: OptionsType[], isEdit = true, cellStyle?: CSSProperties) => {
    cellStyle = cellStyle || {};
    const { row, column, index } = data;
    const fieldProp = column["property"];
    const showEdit = editIndex.value === index && fieldProp === editProp.value && isEdit;
    const cellItem = options.find((item) => item.optionValue === row[fieldProp]);
    const clickCell = `${index}_${fieldProp}`;
    refs[clickCell] = ref();

    return (
      <>
        <el-select
          size="small"
          class="ui-w-100"
          v-show={showEdit}
          filterable={true}
          v-model={editValue[clickCell]}
          placeholder="请选择"
          ref={refs[clickCell]}
          onBlur={() => onBlur("select", fieldProp, index, row)}
          onChange={(value) => onSelectChange(fieldProp, index, value, row)}
        >
          {options?.map((item) => (
            <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
          ))}
        </el-select>
        <span
          v-show={!showEdit}
          class="edit_select ui-w-100 ui-d-ib pointer ui-va-m ellipsis"
          style={{ ...defaultStyle, ...cellStyle }}
          onClick={withModifiers(() => onClick("select", fieldProp, index, row), ["stop"])}
        >
          {cellItem?.optionName}
        </span>
      </>
    );
  };

  interface DatePickType {
    data: TableColumnRenderer;
    isEdit?: boolean;
    eleProps?: Partial<DatePickerProps> | { style: CSSProperties; class?: string };
  }
  /**
   * 3.日期编辑
   * @param data 表格行相关数据
   * @param options 下拉框数据列表 `Array<{ optionName: string; optionValue: any }>`
   * @param isEdit 是否可编辑
   * @param eleProps 日期属性
   */
  const editDatePickerRenderer = (options: DatePickType) => {
    const { data, isEdit = true, eleProps } = options;
    const { row, column, index } = data;
    const fieldProp = column["property"];
    const showEdit = editIndex.value === index && fieldProp === editProp.value && isEdit;
    const clickCell = `${index}_${fieldProp}`;
    refs[clickCell] = ref();

    return (
      <>
        <span v-show={showEdit}>
          <el-date-picker
            size="small"
            key={clickCell}
            v-model={editValue[clickCell]}
            ref={refs[clickCell]}
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择日期"
            style={{ width: "100%" }}
            clearable={false}
            {...eleProps}
            onBlur={() => onBlur("date", fieldProp, index, row)}
            onChange={(value) => onSelectChange(fieldProp, index, value, row)}
          />
        </span>
        <span
          v-show={!showEdit}
          style={{ height: "24px", lineHeight: "24px" }}
          class="edit_input ui-w-100 ui-d-ib pointer ui-va-m ellipsis"
          onClick={withModifiers(() => onClick("date", fieldProp, index, row), ["stop"])}
        >
          {row[fieldProp]}
        </span>
      </>
    );
  };
  /**
   * 4.时间编辑
   * @param data 表格行相关数据
   * @param options 下拉框数据列表 `Array<{ optionName: string; optionValue: any }>`
   * @param isEdit 是否可编辑
   * @param eleProps 日期属性
   */
  const editTimePickerRenderer = (options: DatePickType) => {
    const { data, isEdit = true, eleProps } = options;
    const { row, column, index } = data;
    const fieldProp = column["property"];
    const showEdit = editIndex.value === index && fieldProp === editProp.value && isEdit;
    const clickCell = `${index}_${fieldProp}`;
    refs[clickCell] = ref();

    return (
      <>
        <span v-show={showEdit}>
          <el-time-picker
            size="small"
            key={clickCell}
            v-model={editValue[clickCell]}
            ref={refs[clickCell]}
            value-format="HH:mm"
            placeholder="请选择时间"
            style={{ width: "100%" }}
            clearable={false}
            {...eleProps}
            onBlur={() => onBlur("date", fieldProp, index, row)}
            onChange={(value) => onSelectChange(fieldProp, index, value, row)}
          />
        </span>
        <span
          v-show={!showEdit}
          style={{ height: "24px", lineHeight: "24px" }}
          class="edit_input ui-w-100 ui-d-ib pointer ui-va-m ellipsis"
          onClick={withModifiers(() => onClick("date", fieldProp, index, row), ["stop"])}
        >
          {row[fieldProp]}
        </span>
      </>
    );
  };

  return { editCellRenderer, editSelectRenderer, editDatePickerRenderer, editTimePickerRenderer };
};

/**
 * 表格排序
 * @param dataList 表格数据
 * @param row 表格行
 * @param field 序号字段
 * @param direction 排序方向, 默认: 空
 * @param callback 交换索引回调函数
 */
export const moveTableRow = (dataList: Ref<any>, row, field: string, direction = "", callback?) => {
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
    newArr.splice(newIndex, 0, row);
    newArr.forEach((item, index) => (item[field] = index + 1));
    dataList.value = newArr;
    if (typeof callback === "function") callback({ oldIndex, newIndex });
  }
  window.requestAnimationFrame(moveFn);
};

export interface FormatDataType {
  date: string;
  decimal?: number;
  type: string;
  thousand?: string;
}

/**
 * 获取格式化结果
 * @param item 配置列
 * @param value 单元格数据的值
 */
export const getFormatType = (item: TableColumnList, value) => {
  const fmtObj: FormatDataType = JSON.parse(item.formatType);
  if (fmtObj.type === "money" && fmtObj?.decimal) {
    return formatMoneyComma(value, fmtObj.decimal, !!fmtObj.thousand);
  } else if (fmtObj.type === "date" && !Number.isNaN(Number(value))) {
    return dayjs(Number(value)).format(fmtObj.date);
  }
  return value;
};

/**
 * 获取表格动态配置列(单元格数据自定显示处理)
 * @param columnList 接口获取的配置列
 * @param dataList 表格数据
 * @param updateCellFn 修改单元格回调函数, 不传默认不可编辑
 */
export const getColumnData = (columnList: TableColumnList[], dataList: Ref<Array<any>>, updateCellFn?: EditCallBackType) => {
  let editCellRenderer = (a) => {};
  if (updateCellFn) {
    const result = getTableCellEdit(dataList, updateCellFn);
    editCellRenderer = result.editCellRenderer;
  }
  const leftFixedList = columnList.filter((item) => item.fixed === "left");
  const columnData = columnList.map((item: any) => ({
    ...item,
    cellRenderer: (data) => {
      const prop = data.column["property"];
      if (item.formatType) {
        data.row[prop] = getFormatType(item, data.row[prop]);
      }
      return updateCellFn ? editCellRenderer(data) : data.row[prop];
    }
  }));
  /** 存在列固定左侧, 需要把索引和单选框也固定到左侧 */
  const fixed: TableColumnList = leftFixedList.length ? { fixed: "left" } : undefined;
  return { columnData, fixed };
};
