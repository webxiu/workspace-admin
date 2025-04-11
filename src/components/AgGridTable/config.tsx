/* 
  组件配置说明, Ag-Grid默认可前端分页,后端分页需要企业版付费
  纯数字列才能对数据做透视统计, 字符串数字列不支持数据透视统计

  实例方法:
    agRef.value.api.setRowData(dataList)    #设置表格数据
    agRef.value.api.getSelectedRows()       #获取选中行
    agRef.value.api.selectAll()             #全选
    agRef.value.api.deselectAll()           #取消全选
*/

import { CSSProperties, defineComponent, withModifiers } from "vue";
import { CellStyle, CellStyleFunc, ColDef, RowStyle, SideBarDef, colorSchemeVariable, themeQuartz } from "ag-grid-community";
import { RendererType, getFormatType } from "@/utils/table";

import { BlendedSearchProps } from "@/components/BlendedSearch/index.vue";
import { ButtonListProps } from "@/components/ButtonList/index.vue";
import { PaginationProps } from "element-plus";

export interface AgGridProps {
  /** 表格高度 */
  height?: number;
  /** 表格高度 */
  headerHeight?: number;
  /** 唯一字段 */
  rowKey?: string;
  /** 唯一ID */
  getRowId?: (data: any) => string;
  /** 表格数据 */
  rowData?: ItemType[];
  /** 列配置数据 */
  columnDefs?: ColDef[];
  /** 默认列配置 */
  defaultColDef?: ColDef;
  /** 分组列默认配置 */
  autoGroupColumnDef?: ColDef;
  /** 侧边菜单栏 */
  sideBar?: SideBarDef;
  /** 开启右上角数据透视 */
  pivotMode?: boolean;
  /** 开启拖拽动画 */
  animateRows?: boolean;
  /** 开启拖拽 */
  rowDragManaged?: boolean;
  /** 行多选 */
  rowSelection?: "multiple" | "single";
  /** 框选单元格区域 */
  cellSelection?: boolean;
  /** 设置某个不可拖拽 */
  isRowDrag?: () => boolean;
  /** 点击行可选中 */
  suppressRowClickSelection?: boolean;
  /** 行高度 */
  rowHeight?: number;
  overlayNoRowsTemplate?: string;
  /** 分页配置(total和pageSizes必传) */
  paginations?: Partial<PaginationProps>;
  /** 开启分页无法拖拽(自定义实现) */
  pagination?: boolean;
  /** 自动高度(autoHeight) */
  domLayout?: "normal" | "autoHeight" | "print";
  /** 客户端|服务端分页设置(clientSide|serverSide) */
  rowModelType?: "infinite" | "viewport" | "clientSide" | "serverSide";
  /** 整行编辑(fullRow) */
  editType?: "fullRow" | undefined;
  /** 显示配置 */
  showIcon?: boolean;
  /** 表头查询配置 */
  blendedSearch?: BlendedSearchProps;
  /** 表头按钮配置 */
  headButtons?: ButtonListProps;
  style?: CSSProperties;
  /** 是否打开侧边栏目 */
  openSideBar?: boolean;
}

/** 表格行操作按钮类型 */
interface RowButtonItemType<T> {
  name: string;
  type?: string;
  icon?: string;
  width?: number;
  disabled?: boolean;
  onClick?: (row: T) => void;
  confirm?: (row: T) => string; // 确认提示信息
}

/** 表格列配置类型 */
interface ColumnDefsOption<T> {
  /** 列配置源数据 */
  columnData: TableColumnList[];
  /** 分页数据(page|limit) */
  formData?: Record<string, any>;
  /** 是否显示 选中列(默认 `显示`) */
  radioColumn?: ColDef | false;
  /** 是否显示 索引列(默认 `显示`) */
  indexColumn?: ColDef | false;
  /** 是否显示 多选列(默认 `不显示`) */
  selectionColumn?: ColDef;
  /** 是否显示 操作列(默认 `显示` 默认宽 `140`) */
  operationColumn?: ColDef | false;
  /** 是否清除固定列(默认`不清除`) */
  clearFixed?: boolean;
  /** 行排序(默认`不显示`) */
  rowSort?: boolean;
  /** 列排序(默认 `显示`) */
  columnSort?: boolean;
  /** 表格行操作按钮 */
  renderButtons?: (row: T) => RowButtonItemType<T>[];
  /** 自定义列渲染 */
  columnsRender?: Record<string, RendererType>;
  /** 自定义单元格样式 */
  cellsStyle?: Record<string, CellStyle | CellStyleFunc<T, any>>;
}

export const myTheme = themeQuartz
  .withPart(colorSchemeVariable)
  .withParams(
    {
      spacing: 8,
      accentColor: "mediumBlue",
      checkboxCheckedBackgroundColor: "rgb(64, 158, 255)",
      checkboxCheckedBorderColor: "rgb(64, 158, 255)"
    },
    "light"
  )
  .withParams(
    {
      spacing: 8,
      accentColor: "lightGreen",
      checkboxCheckedBackgroundColor: "rgb(97, 164, 129)",
      checkboxCheckedBorderColor: "rgb(97, 164, 129)"
    },
    "dark"
  );

export type ItemType = Record<string, any>;

// 边框颜色
export const boxShadow = "1px 0px 0 0 color(srgb 0.0941176 0.113725 0.121569 / 0.15)";

export const props = {
  /** 表格高度 */
  height: { type: Number },
  /** 表格高度 */
  headerHeight: { type: Number, default: 34 },
  /** 唯一字段 */
  rowKey: { type: String, default: "id" },
  /** 唯一ID */
  getRowId: { type: Function, default: (data) => `${data[props.rowKey.default || "id"]}` },
  /** 表格数据 */
  rowData: { type: Array as PropType<ItemType[]>, default: () => [] },
  /** 列配置数据 */
  columnDefs: { type: Array as PropType<ColDef[]>, default: () => [] },
  /** 默认列配置 */
  defaultColDef: { type: Array as PropType<ColDef>, default: () => ({}) },
  /** 分组列默认配置 */
  autoGroupColumnDef: { type: Object, default: () => ({}) },
  /** 侧边菜单栏 */
  sideBar: {
    type: Object as PropType<SideBarDef>,
    default: () => ({
      toolPanels: ["columns", "filters"],
      defaultToolPanel: "columns",
      position: "right"
    })
  },
  /** 开启右上角数据透视 */
  pivotMode: { type: Boolean, default: false },
  /** 开启拖拽动画 */
  animateRows: { type: Boolean, default: true },
  /** 开启拖拽 */
  rowDragManaged: { type: Boolean, default: true },
  /** 行多选 */
  rowSelection: { type: String as PropType<"multiple" | "single">, default: "multiple" },
  /** 框选单元格区域 */
  cellSelection: { type: Boolean, default: true },
  /** 设置某个不可拖拽 */
  isRowDrag: { type: Function, default: () => true },
  /** 点击行可选中 */
  suppressRowClickSelection: { type: Boolean, default: true },
  /** 行高度 */
  rowHeight: { type: Number, default: 30 },
  overlayNoRowsTemplate: { type: String, default: "暂无数据" },
  /** 分页配置(total和pageSizes必传) */
  paginations: { type: Object as PropType<Partial<PaginationProps>>, default: () => ({}) },
  /** 开启分页无法拖拽(自定义实现) */
  pagination: { type: Boolean, default: false },
  // paginationPageSize: { type: Number, default: 30 },
  // paginationPageSizeSelector: { type: Array, default: () => [30, 100, 500, 1000, 100000] },
  /** 自动高度(autoHeight) */
  domLayout: { type: String as PropType<"normal" | "autoHeight" | "print">, default: "normal" },
  /** 客户端|服务端分页设置(clientSide|serverSide) */
  rowModelType: { type: String as PropType<"infinite" | "viewport" | "clientSide" | "serverSide">, default: "clientSide" },
  /** 整行编辑(fullRow) */
  editType: { type: String as PropType<"fullRow" | undefined> },
  /** 显示基础列配置 */
  showIcon: { type: Boolean, default: true },
  /** 表头查询配置 */
  blendedSearch: { type: Object as PropType<BlendedSearchProps> },
  /** 表头按钮配置 */
  headButtons: { type: Object as PropType<ButtonListProps>, default: () => ({}) },
  /** 表头按钮配置 */
  style: { type: Object as PropType<CSSProperties>, default: () => ({}) },
  /** 是否打开侧边栏目 */
  openSideBar: { type: Boolean, default: false },
  /** 设置行样式 */
  getRowStyle: { type: Function as PropType<RowStyle>, default: () => ({}) }
};

/** 分组列默认配置 */
export const mergeAutoGroupColumnDef = (config: ColDef) => ({ minWidth: 140, ...config });
/** 表格列默认配置 */
export const mergeColDef = (config: ColDef) => ({
  flex: 1,
  width: 140,
  minWidth: 140, //                               设置最小宽度才会有横向滚动条
  hide: false, //                                 隐藏
  filter: "agSetColumnFilter", //                 设置过滤
  aggFunc: null, // sum                           统计类型(设置会默认添加到左下角值处)
  cellDataType: true, //                          推断数据类型
  // 透视
  pivot: false, //                                是否自动添加到透视表(需要启用pivotMode)
  enablePivot: true, //                           启用或禁用数据透视功能(启用可添加到列标签)
  // 分组
  rowGroup: false, //                             自动添加到分组
  showRowGroup: false, //                         是否显示分组标题
  enableRowGroup: true, //                        是否可以拖拽到分组
  enableValue: true, //                           可添加到值统计
  //编辑
  editable: false, //                             是否可编辑
  // 行拖拽设置
  rowDrag: false, // (params) => false            是否行拖拽(函数写法可设置某行不拖拽)
  // 列拖拽设置
  sortable: true, //                              是否可以拖拽列排序
  suppressMovable: false, //                      是否禁止列拖拽
  // 多选
  checkboxSelection: false, //                    显示多选框
  headerCheckboxSelection: false, //              标题全选
  headerCheckboxSelectionFilteredOnly: false, //  只选择被过滤的行
  // 列标题
  suppressHeaderMenuButton: false, //             是否禁用列标题更多图标
  suppressHeaderContextMenu: false, //            是否禁用列标题右键菜单

  cellStyle: { textAlign: "left", boxShadow }, // 单元格内容居中
  valueFormatter: (params) => params.value, //    自定义单元格
  tooltipValueGetter: (params) => params.value, // 格式化值显示
  // tooltipField: "name", //                     鼠标悬浮显示的字段(无法设置多列)
  ...config
});

/* 通用配置(选中|序号|多选|操作) */
const defCol: ColDef = {
  headerClass: "center",
  filter: false,
  sortable: false,
  rowDrag: false,
  suppressMovable: true, // 禁止移动该列
  cellStyle: { textAlign: "center" },
  suppressHeaderMenuButton: true,
  suppressHeaderContextMenu: false,
  suppressColumnsToolPanel: true
};

/** 获取AgGrid表格列配置 */
export function getAgGridColumns<T extends Record<string, any>>(columnDefOption: ColumnDefsOption<T>) {
  const {
    columnData = [],
    formData = {},
    renderButtons = [],
    rowSort = false,
    clearFixed = false,
    radioColumn = {},
    indexColumn = {},
    selectionColumn = {},
    operationColumn = {},
    columnsRender = {},
    cellsStyle = {}
  } = columnDefOption;

  const _columnDefs: ColDef[] = columnData.map((item: any) => ({
    // ...item,
    pinned: item.fixed,
    field: item.prop as string,
    headerName: item.label,
    width: item.width as number,
    minWidth: (item.width || item.minWidth) as number,
    formatType: item.formatType,
    cellStyle: { textAlign: item.align }
  }));
  const pinnedItem = _columnDefs.find((f) => f.pinned === "left");

  _columnDefs.forEach((item: any) => {
    item.tooltipField = item.field;
    if (item.formatType) {
      item.cellRenderer = defineComponent({
        render: ({ params }) => getFormatType(item, params.getValue())
      });
    } else if (columnsRender && columnsRender[item.field]) {
      // 自定义渲染单元格
      const _render = columnsRender[item.field] as any;
      item.cellRenderer = defineComponent({
        render: ({ params }) => {
          params.colDef.property = params.colDef.field;
          // 透视模式统计时直接返回结果
          if (!params.data) return params.getValue();
          const renderElement = _render({
            props: params,
            row: params.data,
            column: params.colDef,
            $index: params.node.sourceRowIndex
          });
          if (renderElement?.props) {
            renderElement.props.class = renderElement.props.class + " ui-h-100";
          }
          return renderElement;
        }
      });
    } else if (cellsStyle && cellsStyle[item.field]) {
      // 渲染单元格样式
      const cellStyle = cellsStyle[item.field] as any;
      item.cellStyle = cellStyle;
    }
  });

  const columnDefs: ColDef[] = [
    {
      field: "radio",
      headerName: "😉",
      headerComponent: defineComponent({ render: () => <el-radio label="&nbsp;" size="large" style={{ marginLeft: "2px" }} /> }),
      minWidth: 50,
      maxWidth: 50,
      pinned: pinnedItem?.pinned,
      hide: !radioColumn,
      ...defCol,
      ...radioColumn,
      cellRenderer: defineComponent({ render: () => <el-radio label="&nbsp;" size="small" /> })
    },
    {
      field: "select",
      headerName: "",
      minWidth: 50,
      maxWidth: 50,
      ...defCol,
      hide: true,
      pinned: pinnedItem?.pinned,
      checkboxSelection: true, //                  显示多选框
      headerCheckboxSelection: true, //            标题全选
      headerCheckboxSelectionFilteredOnly: true, // 只选择被过滤的行
      ...selectionColumn
    },
    {
      field: "rowIndex",
      headerName: "序号",
      minWidth: 65 + (rowSort ? 28 : 0),
      width: 65 + (rowSort ? 28 : 0),
      maxWidth: 80,
      ...defCol,
      hide: !indexColumn,
      pinned: pinnedItem?.pinned,
      rowDrag: rowSort,
      ...indexColumn,
      valueGetter: ({ node }) => {
        const { page, limit } = formData;
        // rowIndex:        拖拽排序可以更新序号, 但分页序号错乱
        // sourceRowIndex:  拖拽排序不会更新序号, 但分页序号正常
        const rowIndex = rowSort ? node.rowIndex : node.sourceRowIndex;
        if (!limit || !page) return rowIndex + 1;
        return (page - 1) * limit + rowIndex + 1;
      }
    },
    ..._columnDefs,
    {
      field: "operation",
      headerName: "操作",
      minWidth: 140,
      ...defCol,
      pinned: "right",
      hide: !renderButtons || !operationColumn,
      ...operationColumn,
      cellRenderer: defineComponent({
        render: ({ params }) => renderOperation({ params }, renderButtons)
      })
    }
  ];
  if (clearFixed) columnDefs.forEach((item) => (item.pinned = undefined));
  return columnDefs;
}

/** 操作按钮 */
function renderOperation({ params }, renderButtons) {
  const row = params.data || {};
  const rowButtons = typeof renderButtons === "function" ? renderButtons(row) : [];
  return (
    <div class="flex just-center align-center ui-h-100">
      {rowButtons.map((item) => {
        const { name, width = 280, size = "small", confirm, onClick, ...reset } = item;
        return confirm ? (
          <el-popconfirm width={width} title={item.confirm(row)} onConfirm={withModifiers(() => item.onClick(row), ["stop", "prevent"])}>
            {{
              reference: () => (
                <el-button {...reset} size={size} onClick={withModifiers(() => {}, ["stop", "prevent"])}>
                  {item.name}
                </el-button>
              )
            }}
          </el-popconfirm>
        ) : (
          <el-button {...reset} size={size} onClick={withModifiers(() => item.onClick(row), ["stop", "prevent"])}>
            {item.name}
          </el-button>
        );
      })}
    </div>
  );
}

/**
 * 中文语言包 *
 * @link https://www.ag-grid.com/vue-data-grid/localisation/
 */

export const zh_CN = {
  // Set Filter
  selectAll: "(全选)",
  selectAllSearchResults: "(全选搜索结果)",
  addCurrentSelectionToFilter: "将当前选择添加到筛选器",
  searchOoo: "搜索...",
  blanks: "(空白)",
  noMatches: "无匹配项",

  // Number Filter & Text Filter
  filterOoo: "过滤...",
  equals: "等于",
  notEqual: "不等于",
  blank: "空白",
  notBlank: "非空",
  empty: "选择一个",

  // Number Filter
  lessThan: "小于",
  greaterThan: "大于",
  lessThanOrEqual: "小于等于",
  greaterThanOrEqual: "大于等于",
  inRange: "介于",
  inRangeStart: "从",
  inRangeEnd: "到",

  // Text Filter
  contains: "包含",
  notContains: "不包含",
  startsWith: "开始于",
  endsWith: "结束于",

  // Date Filter
  dateFormatOoo: "yyyy-mm-dd",
  before: "之前",
  after: "之后",

  // Filter Conditions
  andCondition: "和",
  orCondition: "或",

  // Filter Buttons
  applyFilter: "应用",
  resetFilter: "重置",
  clearFilter: "清除",
  cancelFilter: "取消",

  // Filter Titles
  textFilter: "文本过滤器",
  numberFilter: "数字过滤器",
  dateFilter: "日期过滤器",
  setFilter: "集合过滤器",

  // Group Column Filter
  groupFilterSelect: "选择字段:",

  // Advanced Filter
  advancedFilterContains: "包含",
  advancedFilterNotContains: "不包含",
  advancedFilterTextEquals: "等于",
  advancedFilterTextNotEqual: "不等于",
  advancedFilterStartsWith: "开始于",
  advancedFilterEndsWith: "结束于",
  advancedFilterBlank: "为空",
  advancedFilterNotBlank: "不为空",
  advancedFilterEquals: "=",
  advancedFilterNotEqual: "!=",
  advancedFilterGreaterThan: ">",
  advancedFilterGreaterThanOrEqual: ">=",
  advancedFilterLessThan: "<",
  advancedFilterLessThanOrEqual: "<=",
  advancedFilterTrue: "为真",
  advancedFilterFalse: "为假",
  advancedFilterAnd: "且",
  advancedFilterOr: "或",
  advancedFilterApply: "应用",
  advancedFilterBuilder: "构建器",
  advancedFilterValidationMissingColumn: "缺少列",
  advancedFilterValidationMissingOption: "缺少选项",
  advancedFilterValidationMissingValue: "缺少值",
  advancedFilterValidationInvalidColumn: "找不到列",
  advancedFilterValidationInvalidOption: "找不到选项",
  advancedFilterValidationMissingQuote: "值缺少结束引号",
  advancedFilterValidationNotANumber: "值不是一个数字",
  advancedFilterValidationInvalidDate: "值不是一个有效日期",
  advancedFilterValidationMissingCondition: "缺少条件",
  advancedFilterValidationJoinOperatorMismatch: "一个条件内的连接操作符必须相同",
  advancedFilterValidationInvalidJoinOperator: "找不到连接操作符",
  advancedFilterValidationMissingEndBracket: "缺少结束括号",
  advancedFilterValidationExtraEndBracket: "结束括号过多",
  advancedFilterValidationMessage: "表达式有错误。${variable} - ${variable}。",
  advancedFilterValidationMessageAtEnd: "表达式有错误。表达式末尾的${variable}。",
  advancedFilterBuilderTitle: "高级筛选",
  advancedFilterBuilderApply: "应用",
  advancedFilterBuilderCancel: "取消",
  advancedFilterBuilderAddButtonTooltip: "添加筛选或组",
  advancedFilterBuilderRemoveButtonTooltip: "移除",
  advancedFilterBuilderMoveUpButtonTooltip: "上移",
  advancedFilterBuilderMoveDownButtonTooltip: "下移",
  advancedFilterBuilderAddJoin: "添加组",
  advancedFilterBuilderAddCondition: "添加筛选",
  advancedFilterBuilderSelectColumn: "选择一个列",
  advancedFilterBuilderSelectOption: "选择一个选项",
  advancedFilterBuilderEnterValue: "输入一个值...",
  advancedFilterBuilderValidationAlreadyApplied: "当前筛选已应用。",
  advancedFilterBuilderValidationIncomplete: "并非所有条件都已完成。",
  advancedFilterBuilderValidationSelectColumn: "必须选择一个列。",
  advancedFilterBuilderValidationSelectOption: "必须选择一个选项。",
  advancedFilterBuilderValidationEnterValue: "必须输入一个值。",

  // Side Bar
  columns: "列",
  filters: "过滤器",

  // columns tool panel
  pivotMode: "透视模式",
  groups: "行组",
  rowGroupColumnsEmptyMessage: "拖动到此处设置行组",
  values: "值",
  valueColumnsEmptyMessage: "拖动到此处聚合",
  pivots: "列标签",
  pivotColumnsEmptyMessage: "拖动到此处设置列标签",

  // Header of the Default Group Column
  group: "组",

  // Row Drag
  rowDragRow: "行",
  rowDragRows: "行",

  // Other
  loadingOoo: "加载中...",
  loadingError: "错误",
  noRowsToShow: "无显示行",
  enabled: "启用",

  // Menu
  pinColumn: "固定列",
  pinLeft: "固定在左侧",
  pinRight: "固定在右侧",
  noPin: "取消固定",
  valueAggregation: "值汇总",
  noAggregation: "无",
  autosizeThisColumn: "自动调整该列",
  autosizeAllColumns: "自动调整所有列",
  groupBy: "按此分组",
  ungroupBy: "取消按此分组",
  ungroupAll: "取消全部分组",
  addToValues: "将${variable}添加到值",
  removeFromValues: "将${variable}从值中移除",
  addToLabels: "将${variable}添加到标签",
  removeFromLabels: "将${variable}从标签中移除",
  resetColumns: "重置列",
  expandAll: "展开所有行组",
  collapseAll: "关闭所有行组",
  copy: "复制",
  ctrlC: "Ctrl+C",
  ctrlX: "Ctrl+X",
  copyWithHeaders: "复制包含标题",
  copyWithGroupHeaders: "复制包含组标题",
  cut: "剪切",
  paste: "粘贴",
  ctrlV: "Ctrl+V",
  export: "导出",
  csvExport: "导出为CSV",
  excelExport: "导出为Excel",
  columnFilter: "列过滤",
  columnChooser: "选择列",
  chooseColumns: "选择列",
  sortAscending: "升序排列",
  sortDescending: "降序排列",
  sortUnSort: "清除排序",

  // Enterprise Menu Aggregation and Status Bar
  sum: "总和",
  first: "第一个",
  last: "最后一个",
  min: "最小值",
  max: "最大值",
  none: "无",
  count: "计数",
  avg: "平均",
  filteredRows: "已筛选",
  selectedRows: "已选中",
  totalRows: "总行数",
  totalAndFilteredRows: "行",
  more: "更多",
  to: "至",
  of: "的",
  page: "页",
  pageLastRowUnknown: "?",
  nextPage: "下一页",
  lastPage: "最后一页",
  firstPage: "第一页",
  previousPage: "上一页",
  pageSizeSelectorLabel: "每页大小：",
  footerTotal: "合计",

  // Pivoting
  pivotColumnGroupTotals: "总计",

  // Enterprise Menu (Charts)
  pivotChartAndPivotMode: "数据透视图和数据透视模式",
  pivotChart: "数据透视图",
  chartRange: "图表范围",
  columnChart: "柱状图",
  groupedColumn: "分组",
  stackedColumn: "堆积",
  normalizedColumn: "100% 堆积",
  barChart: "条形图",
  groupedBar: "分组",
  stackedBar: "堆积",
  normalizedBar: "100% 堆积",
  pieChart: "饼图",
  pie: "饼图",
  donut: "环形图",
  line: "折线图",
  xyChart: "X Y (散点图)",
  scatter: "散点图",
  bubble: "气泡图",
  areaChart: "面积图",
  area: "面积",
  stackedArea: "堆积",
  normalizedArea: "100% 堆积",
  histogramChart: "直方图",
  polarChart: "极地图",
  radarLine: "雷达线",
  radarArea: "雷达面积",
  nightingale: "夜莺图",
  radialColumn: "径向柱状图",
  radialBar: "径向条形图",
  statisticalChart: "统计图",
  boxPlot: "箱线图",
  rangeBar: "区间条形图",
  rangeArea: "区间面积图",
  hierarchicalChart: "层次图",
  treemap: "树图",
  sunburst: "旭日图",
  specializedChart: "专项图",
  waterfall: "瀑布图",
  heatmap: "热力图",
  combinationChart: "组合图",
  columnLineCombo: "柱状图和折线图组合",
  AreaColumnCombo: "面积图和柱状图组合",

  // Charts
  pivotChartTitle: "数据透视图",
  rangeChartTitle: "范围图",
  settings: "图表",
  data: "设置",
  format: "自定义",
  categories: "类别",
  defaultCategory: "(无)",
  series: "系列",
  switchCategorySeries: "切换类别 / 系列",
  categoryValues: "类别值",
  seriesLabels: "系列标签",
  aggregate: "汇总",
  xyValues: "XY 值",
  paired: "配对模式",
  axis: "轴",
  xAxis: "水平轴",
  yAxis: "垂直轴",
  polarAxis: "极坐标轴",
  radiusAxis: "半径轴",
  navigator: "导航器",
  zoom: "缩放",
  animation: "动画",
  crosshair: "准星",
  color: "颜色",
  thickness: "厚度",
  preferredLength: "首选长度",
  xType: "X 类型",
  axisType: "轴类型",
  automatic: "自动",
  category: "类别",
  number: "数值",
  time: "时间",
  timeFormat: "时间格式",
  autoRotate: "自动旋转",
  labelRotation: "旋转",
  circle: "圆形",
  polygon: "多边形",
  square: "方形",
  cross: "十字符",
  diamond: "菱形",
  plus: "加号",
  triangle: "三角形",
  heart: "爱心",
  orientation: "方向",
  fixed: "固定",
  parallel: "平行",
  perpendicular: "垂直",
  radiusAxisPosition: "位置",
  ticks: "刻度",
  gridLines: "网格线",
  width: "宽度",
  height: "高度",
  length: "长度",
  padding: "内边距",
  spacing: "间距",
  chartStyle: "图表样式",
  title: "标题",
  chartTitles: "标题",
  chartTitle: "图表标题",
  chartSubtitle: "副标题",
  horizontalAxisTitle: "水平轴标题",
  verticalAxisTitle: "垂直轴标题",
  polarAxisTitle: "极坐标轴标题",
  titlePlaceholder: "图表标题",
  background: "背景",
  font: "字体",
  weight: "粗细",
  top: "顶部",
  right: "右边",
  bottom: "底部",
  left: "左边",
  labels: "标签",
  calloutLabels: "标注标签",
  sectorLabels: "扇区标签",
  positionRatio: "位置比例",
  size: "大小",
  shape: "形状",
  minSize: "最小大小",
  maxSize: "最大大小",
  legend: "图例",
  position: "位置",
  markerSize: "标记大小",
  markerStroke: "标记描边",
  markerPadding: "标记内边距",
  itemSpacing: "项目间距",
  itemPaddingX: "项目内边距 X",
  itemPaddingY: "项目内边距 Y",
  layoutHorizontalSpacing: "横向间距",
  layoutVerticalSpacing: "纵向间距",
  strokeWidth: "描边宽度",
  offset: "偏移",
  offsets: "偏移",
  tooltips: "工具提示",
  callout: "标注",
  markers: "标记",
  shadow: "阴影",
  blur: "模糊",
  xOffset: "X 偏移",
  yOffset: "Y 偏移",
  lineWidth: "线宽",
  lineDash: "线条虚线",
  lineDashOffset: "虚线偏移",
  scrollingZoom: "滚动",
  scrollingStep: "滚动步骤",
  selectingZoom: "选择",
  durationMillis: "持续时间 (毫秒)",
  crosshairLabel: "标签",
  crosshairSnap: "对节点对齐",
  normal: "常规",
  bold: "加粗",
  italic: "斜体",
  boldItalic: "加粗斜体",
  predefined: "预定义",
  fillOpacity: "填充不透明度",
  strokeColor: "线条颜色",
  strokeOpacity: "线条不透明度",
  miniChart: "迷你图表",
  histogramBinCount: "箱数",
  connectorLine: "连接线",
  seriesItems: "系列项目",
  seriesItemType: "项目类型",
  seriesItemPositive: "正面",
  seriesItemNegative: "负面",
  seriesItemLabels: "项目标签",
  columnGroup: "柱形图",
  barGroup: "条形图",
  pieGroup: "饼图",
  lineGroup: "折线图",
  scatterGroup: "散点图",
  areaGroup: "面积图",
  polarGroup: "极坐标图",
  statisticalGroup: "统计图",
  hierarchicalGroup: "层次图",
  specializedGroup: "专用图",
  combinationGroup: "组合图",
  groupedColumnTooltip: "分组",
  stackedColumnTooltip: "堆积",
  normalizedColumnTooltip: "100% 堆积",
  groupedBarTooltip: "分组",
  stackedBarTooltip: "堆积",
  normalizedBarTooltip: "100% 堆积",
  pieTooltip: "饼图",
  donutTooltip: "环形图",
  lineTooltip: "折线图",
  groupedAreaTooltip: "面积图",
  stackedAreaTooltip: "堆积",
  normalizedAreaTooltip: "100% 堆积",
  scatterTooltip: "散点图",
  bubbleTooltip: "气泡图",
  histogramTooltip: "直方图",
  radialColumnTooltip: "径向柱图",
  radialBarTooltip: "径向条图",
  radarLineTooltip: "雷达线图",
  radarAreaTooltip: "雷达面积图",
  nightingaleTooltip: "玫瑰图",
  rangeBarTooltip: "范围条图",
  rangeAreaTooltip: "范围面积图",
  boxPlotTooltip: "箱线图",
  treemapTooltip: "树状图",
  sunburstTooltip: "旭日图",
  waterfallTooltip: "瀑布图",
  heatmapTooltip: "热力图",
  columnLineComboTooltip: "柱图与折线图",
  areaColumnComboTooltip: "面积图与柱图",
  customComboTooltip: "自定义组合",
  innerRadius: "内半径",
  startAngle: "起始角度",
  endAngle: "终止角度",
  reverseDirection: "反向",
  groupPadding: "组间距",
  seriesPadding: "系列间距",
  tile: "瓦片",
  whisker: "须",
  cap: "顶部",
  capLengthRatio: "顶部长度比",
  labelPlacement: "标签位置",
  inside: "内部",
  outside: "外部",
  noDataToChart: "无可绘制的数据。",
  pivotChartRequiresPivotMode: "数据透视图需要启用数据透视模式。",
  chartSettingsToolbarTooltip: "菜单",
  chartLinkToolbarTooltip: "链接到网格",
  chartUnlinkToolbarTooltip: "从网格中取消链接",
  chartDownloadToolbarTooltip: "下载图表",
  chartMenuToolbarTooltip: "菜单",
  chartEdit: "编辑图表",
  chartAdvancedSettings: "高级设置",
  chartLink: "链接到网格",
  chartUnlink: "从网格中取消链接",
  chartDownload: "下载图表",
  histogramFrequency: "频率",
  seriesChartType: "系列图表类型",
  seriesType: "系列类型",
  secondaryAxis: "次轴",
  seriesAdd: "添加系列",
  categoryAdd: "添加类别",
  bar: "条形图",
  column: "柱形图",
  histogram: "直方图",
  advancedSettings: "高级设置",
  direction: "方向",
  horizontal: "水平",
  vertical: "垂直",
  seriesGroupType: "分组类型",
  groupedSeriesGroupType: "分组",
  stackedSeriesGroupType: "堆积",
  normalizedSeriesGroupType: "100% 堆积",
  legendEnabled: "启用",
  invalidColor: "无效的颜色值",
  groupedColumnFull: "分组柱形图",
  stackedColumnFull: "堆积柱形图",
  normalizedColumnFull: "100% 堆积柱形图",
  groupedBarFull: "分组条形图",
  stackedBarFull: "堆积条形图",
  normalizedBarFull: "100% 堆积条形图",
  stackedAreaFull: "堆积面积图",
  normalizedAreaFull: "100% 堆积面积图",
  customCombo: "自定义组合",

  // ARIA
  ariaAdvancedFilterBuilderItem: "${variable}. 级别 ${variable}. 按 ENTER 进行编辑。",
  ariaAdvancedFilterBuilderItemValidation: "${variable}. 级别 ${variable}. ${variable} 按 ENTER 进行编辑。",
  ariaAdvancedFilterBuilderList: "高级过滤器构建器列表",
  ariaAdvancedFilterBuilderFilterItem: "过滤条件",
  ariaAdvancedFilterBuilderGroupItem: "过滤组",
  ariaAdvancedFilterBuilderColumn: "列",
  ariaAdvancedFilterBuilderOption: "选项",
  ariaAdvancedFilterBuilderValueP: "值",
  ariaAdvancedFilterBuilderJoinOperator: "连接运算符",
  ariaAdvancedFilterInput: "高级过滤器输入",
  ariaChecked: "已选中",
  ariaColumn: "列",
  ariaColumnGroup: "列组",
  ariaColumnFiltered: "列已过滤",
  ariaColumnSelectAll: "切换选择所有列",
  ariaDateFilterInput: "日期过滤器输入",
  ariaDefaultListName: "列表",
  ariaFilterColumnsInput: "过滤列输入",
  ariaFilterFromValue: "过滤从值",
  ariaFilterInput: "过滤器输入",
  ariaFilterList: "过滤器列表",
  ariaFilterToValue: "过滤至值",
  ariaFilterValue: "过滤值",
  ariaFilterMenuOpen: "打开过滤器菜单",
  ariaFilteringOperator: "过滤运算符",
  ariaHidden: "隐藏",
  ariaIndeterminate: "不确定",
  ariaInputEditor: "输入编辑器",
  ariaMenuColumn: "按 ALT 向下 打开列菜单",
  ariaFilterColumn: "按 CTRL ENTER 打开过滤器",
  ariaRowDeselect: "按 SPACE 取消选择此行",
  ariaRowSelectAll: "按 Space 切换所有行选择",
  ariaRowToggleSelection: "按 Space 切换行选择",
  ariaRowSelect: "按 SPACE 选择此行",
  ariaRowSelectionDisabled: "此行的行选择功能被禁用",
  ariaSearch: "搜索",
  ariaSortableColumn: "按 ENTER 排序",
  ariaToggleVisibility: "按 Space 切换可见性",
  ariaToggleCellValue: "按 Space 切换单元格值",
  ariaUnchecked: "未选中",
  ariaVisible: "可见",
  ariaSearchFilterValues: "搜索过滤值",
  ariaPageSizeSelectorLabel: "页面大小",
  ariaChartMenuClose: "关闭图表编辑菜单",
  ariaChartSelected: "已选择",
  ariaSkeletonCellLoadingFailed: "行加载失败",
  ariaSkeletonCellLoading: "行数据加载中",

  // ARIA Labels for Drop Zones
  ariaRowGroupDropZonePanelLabel: "行分组",
  ariaValuesDropZonePanelLabel: "值",
  ariaPivotDropZonePanelLabel: "列标签",
  ariaDropZoneColumnComponentDescription: "按 DELETE 键移除",
  ariaDropZoneColumnValueItemDescription: "按 ENTER 键更改聚合类型",
  ariaDropZoneColumnGroupItemDescription: "按 ENTER 键排序",

  // used for aggregate drop zone, format: {aggregation}{ariaDropZoneColumnComponentAggFuncSeparator}{column name}
  ariaDropZoneColumnComponentAggFuncSeparator: " 的 ",
  ariaDropZoneColumnComponentSortAscending: "升序",
  ariaDropZoneColumnComponentSortDescending: "降序",
  ariaLabelDialog: "对话框",
  ariaLabelColumnMenu: "列菜单",
  ariaLabelColumnFilter: "列过滤器",
  ariaLabelCellEditor: "单元格编辑器",
  ariaLabelSelectField: "选择字段",

  // aria labels for rich select
  ariaLabelRichSelectField: "丰富选择字段",
  ariaLabelRichSelectToggleSelection: "按下空格键以切换选择",
  ariaLabelRichSelectDeselectAllItems: "按下删除键来取消选择所有项目",
  ariaLabelRichSelectDeleteSelection: "按下删除键来取消选择项目",
  ariaLabelTooltip: "工具提示",
  ariaLabelContextMenu: "上下文菜单",
  ariaLabelSubMenu: "子菜单",
  ariaLabelAggregationFunction: "聚合函数",
  ariaLabelAdvancedFilterAutocomplete: "高级筛选自动完成",
  ariaLabelAdvancedFilterBuilderAddField: "高级筛选生成器添加字段",
  ariaLabelAdvancedFilterBuilderColumnSelectField: "高级筛选生成器列选择字段",
  ariaLabelAdvancedFilterBuilderOptionSelectField: "高级筛选生成器选项选择字段",
  ariaLabelAdvancedFilterBuilderJoinSelectField: "高级筛选生成器连接操作符选择字段",

  // ARIA Labels for the Side Bar
  ariaColumnPanelList: "列列表",
  ariaFilterPanelList: "过滤列表",

  // Number Format (Status Bar, Pagination Panel)
  thousandSeparator: ",",
  decimalSeparator: ".",

  // Data types
  true: "真",
  false: "假",
  invalidDate: "无效日期",
  invalidNumber: "无效数字",
  january: "一月",
  february: "二月",
  march: "三月",
  april: "四月",
  may: "五月",
  june: "六月",
  july: "七月",
  august: "八月",
  september: "九月",
  october: "十月",
  november: "十一月",
  december: "十二月",

  // Time formats
  timeFormatSlashesDDMMYYYY: "DD/MM/YYYY",
  timeFormatSlashesMMDDYYYY: "MM/DD/YYYY",
  timeFormatSlashesDDMMYY: "DD/MM/YY",
  timeFormatSlashesMMDDYY: "MM/DD/YY",
  timeFormatDotsDDMYY: "DD.M.YY",
  timeFormatDotsMDDYY: "M.DD.YY",
  timeFormatDashesYYYYMMDD: "YYYY-MM-DD",
  timeFormatSpacesDDMMMMYYYY: "DD MMMM YYYY",
  timeFormatHHMMSS: "HH:MM:SS",
  timeFormatHHMMSSAmPm: "HH:MM:SS 上午/下午"
};
