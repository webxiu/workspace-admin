<!--
 * @Author: Hailen 
 * @Date: 2025-02-13 15:50:36 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2025-02-13 15:50:36 
 -->
<script lang="tsx">
import { AgGridVue } from "ag-grid-vue3";
import { defineComponent, computed, ref } from "vue";
import type {
  CellClickedEvent,
  CellDoubleClickedEvent,
  CellValueChangedEvent,
  FilterChangedEvent,
  RowSelectedEvent,
  SelectionChangedEvent,
  RowDragEndEvent,
  ColumnMovedEvent,
  GridReadyEvent,
  ColumnState,
  IRowNode,
  GridApi,
  Theme,
  ColDef,
  SideBarDef,
  GridOptions,
  IServerSideDatasource
} from "ag-grid-community";
import "ag-grid-community/styles/ag-theme-alpine.css";
import HxIcon from "@/components/HxIcon";
import { AllEnterpriseModule } from "ag-grid-enterprise";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import ButtonList from "@/components/ButtonList/index.vue";
import BlendedSearch from "@/components/BlendedSearch/index.vue";
import { LicenseManager } from "ag-grid-enterprise";
import { v4 as uuidv4 } from "uuid";
import { zh_CN, mergeColDef, mergeAutoGroupColumnDef, myTheme, ItemType, props } from "./config";

ModuleRegistry.registerModules([AllCommunityModule, AllEnterpriseModule]);

export const AgGridTable = defineComponent({
  name: "AgGridTable",
  props,
  emits: {
    refresh: () => void 0, //                         刷新事件
    switch: () => void 0, //                          切换事件
    sizeChange: (size: number) => void 0, //          分页大小
    currentChange: (page: number) => void 0, //       分页页面
    cellValueChanged: (rows: ItemType) => void 0, //  单元格变化
    cellClicked: (rows: ItemType) => void 0, //       单元格点击
    cellDoubleClicked: (rows: ItemType) => void 0, // 单元格双击
    filterChanged: (data: { filterModel: any; RowIndex: any; FocusedCell: any }) => void 0, // 过滤变化
    rowSelected: (rows: ItemType[], row: ItemType) => void 0, //  行选中
    selectionChanged: (rows: ItemType[]) => void 0, //            多选
    columnMoved: (data: ColumnState[]) => void 0, //              列移动
    rowDragEnd: (rows: ItemType[]) => void 0, //                  行拖拽
    gridReady: (params: GridReadyEvent) => void 0 //              表格加载完成
  },
  setup(props, { slots, attrs, expose, emit }) {
    const iconIndex = ref(0); // 表格多选方式
    const gridApi = ref<GridApi>();
    const theme = ref<Theme | "legacy">(myTheme);
    const defaultColDef = mergeColDef(props.defaultColDef); // 表格列默认配置
    const autoGroupColumnDef = mergeAutoGroupColumnDef(props.autoGroupColumnDef); // 分组列默认配置

    // 注册协议...
    if (!AgGridTable.isProtocolRegistered) {
      // [v3][Release][0102]_MTczNjc2MzczNzA3Mg==99e33de9f721f5a0f2cdc2e7b4a17abb
      LicenseManager.setLicenseKey("[v3][RELEASE][0102]_NDg2Njc4MzY3MDgzNw==16d78ca762fb5d2ff740aed081e2af7b");
      AgGridTable.isProtocolRegistered = true;
    }

    // 多选方式
    const selectWay = computed<any>(() => {
      const selectList = [
        { type: "single", icon: "DocumentRemove", content: "单选" },
        { type: "multiple", icon: "Document", content: "多选" },
        { type: "not", icon: "DocumentDelete", content: "不选" }
      ];
      return selectList[iconIndex.value % selectList.length];
    });

    // 图标配置列表
    const iconList = computed<any>(() => {
      const hasSelect = props.columnDefs.find(({ field, hide }) => field === "select" && !hide);
      const { content, icon } = selectWay.value;
      return [
        { color: "#1e90ff", content: "刷新", icon: "Refresh", hide: false, onClick: () => emit("refresh") },
        { color: "#00ab07", content: content, icon: icon, hide: !hasSelect, onClick: () => iconIndex.value++ },
        { color: "#f32b82", content: "切换表", icon: "DocumentCopy", hide: false, onClick: () => emit("switch") }
      ];
    });

    // 表格数据处理
    const _rowData = computed(() => {
      return props.rowData.map((item) => {
        item.uuid = uuidv4(); // 添加唯一uuid
        return item;
      });
    });

    /** 事件中心:统一派发 */
    function eventSend(event, data: any, data2?: any) {
      // console.log(event, data, data2);
      if (data) emit(event, data, data2);
    }

    /** 表格加载完成 */
    function onGridReady(params: GridReadyEvent) {
      params.api.sizeColumnsToFit(); // 调整列宽以适应网格
      gridApi.value = params.api;
      eventSend("gridReady", params);
    }
    /** 单元格值变化 */
    function cellValueChanged(event: CellValueChangedEvent<ItemType>) {
      eventSend("cellValueChanged", event.data); // event.api.getSelectedRows()[0]
    }

    /** 单元格点击 */
    function onCellClicked(event: CellClickedEvent<ItemType>) {
      const isSelected = event.node.isSelected();
      const { type } = selectWay.value;
      if (type === "single") {
        event.api.forEachNode((node) => node.setSelected(false));
        event.node.setSelected(!isSelected); // 单选
      }
      if (type === "multiple") {
        event.node.setSelected(!isSelected); // 多选
      }
      eventSend("cellClicked", event.data);
    }

    /** 单元格双击 */
    function onCellDoubleClicked(event: CellDoubleClickedEvent<ItemType>) {
      eventSend("cellDoubleClicked", event.data);
    }

    /** 过滤变化 */
    function onFilterChanged(event: FilterChangedEvent<ItemType>) {
      const filterModel = event.api.getFilterModel();
      const RowIndex = event.api.getFirstDisplayedRowIndex();
      const FocusedCell = event.api.getAllGridColumns();
      eventSend("filterChanged", { filterModel, RowIndex, FocusedCell });
    }

    /** 行选中 */
    function onRowSelected(event: RowSelectedEvent<ItemType>) {
      const row = event.data;
      const rows = event.api.getSelectedRows();
      eventSend("rowSelected", rows, row);
    }

    /** 多选事件 */
    function onSelectionChanged(event: SelectionChangedEvent<ItemType>) {
      const rows = event.api.getSelectedRows();
      eventSend("selectionChanged", rows);
    }

    /** 行拖拽结束(返回新的顺序) */
    function onRowDragEnd(event: RowDragEndEvent<ItemType>) {
      const newData = Array.from(event.api.getRenderedNodes(), (node: IRowNode<ItemType>) => node.data);
      event.api.refreshCells({ force: true }); // 强制重新渲染以确保序号列更新
      eventSend("rowDragEnd", newData);
    }

    /** 列移动(返回新的顺序) */
    function onColumnMoved(event: ColumnMovedEvent<ItemType>) {
      var columnState = event.api.getColumnState();
      eventSend("columnMoved", columnState);
    }

    /** 选中某行 isOne:是否单选 */
    function setRowSelected(id: string | number, isOne = false) {
      requestAnimationFrame(() => {
        if (isOne) {
          gridApi.value.forEachNode((node) => node.setSelected(false));
        }
        gridApi.value.getRowNode(id.toString())?.setSelected(true);
      });
    }

    /** 分页页码 */
    function onCurrentChange(page: number) {
      emit("currentChange", page);
    }

    /** 分页大小 */
    function onSizeChange(size: number) {
      emit("sizeChange", size);
    }

    /** 渲染图标 */
    function renderIcon() {
      if (!props.showIcon) return null;
      return iconList.value.map((item) => {
        return item.hide ? null : (
          <el-tooltip key={item.icon} content={item.content} effect="dark" placement="top">
            <HxIcon icon={item.icon} color={item.color} onClick={item.onClick} size="18" class="ml-6 pointer" />
          </el-tooltip>
        );
      });
    }

    function forceUpdate() {
      gridApi.value?.refreshCells({ force: true });
      // gridApi.value?.redrawRows();
    }

    expose({ setRowSelected, forceUpdate, getRef: () => gridApi.value });

    const { rowKey, height, paginations, style, sideBar, openSideBar, ...resetProp } = props;
    return () => (
      <div class="flex-col flex-1 ui-w-100 ui-ov-h grid-table">
        <div class="flex just-between align-center mb-2 table-operate">
          {slots?.title ? slots.title() : props.blendedSearch ? <BlendedSearch {...props.blendedSearch} /> : null}
          <div class="flex flex-1 align-center just-end">
            <div class="table-buttons">{slots?.buttons ? slots.buttons() : <ButtonList {...props.headButtons} />}</div>
            <div class="flex align-center">{renderIcon()}</div>
          </div>
        </div>
        <AgGridVue
          class="ag-grid_table"
          {...resetProp}
          localeText={zh_CN}
          theme={theme.value}
          rowData={_rowData.value}
          columnDefs={props.columnDefs}
          defaultColDef={defaultColDef}
          autoGroupColumnDef={autoGroupColumnDef}
          getRowId={({ data }) => `${data[rowKey] || data.uuid}`}
          sideBar={{ ...sideBar, defaultToolPanel: openSideBar ? "columns" : undefined }}
          style={{ height: props.height + "px", ...style }}
          onGridReady={onGridReady}
          onRowDragEnd={onRowDragEnd}
          onColumnMoved={onColumnMoved}
          onRowSelected={onRowSelected}
          onCellClicked={onCellClicked}
          onFilterChanged={onFilterChanged}
          onCellValueChanged={cellValueChanged}
          onSelectionChanged={onSelectionChanged}
          onCellDoubleClicked={onCellDoubleClicked}
        />
        <div class="flex just-between align-center mt-2">
          <div class="flex-1 ellipsis">{slots?.footer ? slots.footer() : null}</div>
          {!props.paginations ? null : (
            <el-pagination
              disabled={false}
              size="small"
              layout="total, sizes, prev, pager, next, jumper"
              total={props.paginations.total}
              defaultPageSize={props.paginations.pageSize}
              pageSizes={props.paginations.pageSizes}
              onSizeChange={onSizeChange}
              onCurrentChange={onCurrentChange}
              style="margin-bottom: 0px !important"
            />
          )}
        </div>
      </div>
    );
  }
});

export default AgGridTable;
</script>

<style lang="scss" scoped>
.grid-table {
  z-index: 3;
  background: var(--el-bg-color);
}
:deep(.ag-grid_table) {
  height: 100%;
  width: 100%;

  /* 表头拖拽竖线对齐表格列边框 */
  .ag-header-cell,
  .ag-header-group-cell {
    margin-left: 2px;
  }

  /* 表头标题居中微调 */
  .ag-header-row .ag-checkbox,
  .ag-header-row .ag-header-cell-comp-wrapper {
    margin-left: -2px;
  }

  .el-radio__label {
    display: none;
  }

  .ag-row-selected .el-radio {
    .el-radio__inner {
      background: var(--el-color-primary);
      border-color: var(--el-color-primary);
      transition: all 1s;
      &::after {
        background-color: var(--el-color-white);
        transform: translate(-50%, -50%) scale(1);
      }
    }
  }

  $just-map: (
    left: flex-start,
    right: flex-end,
    center: center
  );

  @each $key, $value in $just-map {
    .ag-header-cell.#{$key} .ag-header-cell-label {
      display: flex;
      align-items: center;
      justify-content: $value;
    }
  }

  .ag-row-selected .el-radio {
    .el-radio__inner {
      background: var(--el-color-primary);
      border-color: var(--el-color-primary);
      transition: all 1s;
      &::after {
        background-color: var(--el-color-white);
        transform: translate(-50%, -50%) scale(1);
      }
    }
  }

  // 底部滚动条加高
  $sHeight: 12px !important;
  .ag-horizontal-left-spacer,
  .ag-horizontal-right-spacer,
  .ag-body-horizontal-scroll,
  .ag-body-horizontal-scroll-container,
  .ag-body-horizontal-scroll-viewport {
    height: $sHeight;
    min-height: $sHeight;
    max-height: $sHeight;

    &::-webkit-scrollbar {
      background-color: var(--scrollbar-bg-color);
      width: $sHeight;
      height: $sHeight;
    }
  }
}
</style>
