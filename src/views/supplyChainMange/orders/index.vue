<script setup lang="ts">
import { useConfig } from "./utils/hook";
import Modal from "./modal.vue";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";
import { ArrowDown } from "@element-plus/icons-vue";

defineOptions({ name: "SupplyChainMangeOrdersIndex" });

const {
  columns,
  columns2,
  dataList,
  dataList2,
  columns3,
  dataList3,
  loading3,
  rowLeftClick,
  loading,
  loading2,
  maxHeight,
  handleCommand,
  pagination,
  searchOptions,
  modalRef,
  dialogVisible,
  signBackConstantInfo,
  orderRef,
  buttonList,
  onRefresh,
  dbSelected,
  rowClickSelected,
  handleTagSearch,
  onCurrentChange,
  handleSizeChange,
  queryParams,
  handleCurrentChange,
  rowStyle,
  cellStyle,
  signBackStatus,
  fresh,
  onUpload
} = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <PureTableBar :columns="columns" class="flex-1" @refresh="onRefresh" @change-column="setUserMenuColumns">
      <template #title>
        <BlendedSearch @tagSearch="handleTagSearch" :queryParams="queryParams" :searchOptions="searchOptions" placeholder="订单号" searchField="fbillno" />
      </template>
      <template #buttons>
        <ButtonList moreActionText="业务操作" :buttonList="buttonList" :auto-layout="false" />
        <input
          type="file"
          style="display: none"
          multiple
          id="signFile"
          ref="files"
          accept="image/jpg,image/png,image/jpeg, application/pdf"
          @input="onUpload"
        />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          ref="orderRef"
          id="purchaseOrderId"
          border
          :height="maxHeight / 2"
          :max-height="maxHeight / 2"
          row-key="id"
          class="bill-manage"
          :adaptive="true"
          align-whole="left"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :paginationSmall="size === 'small'"
          highlight-current-row
          :show-overflow-tooltip="true"
          :row-style="rowStyle"
          :cell-style="cellStyle"
          :pagination="pagination"
          @current-change="onCurrentChange"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
          @row-dblclick="dbSelected"
          @row-click="rowClickSelected"
          @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
        >
          <!-- <template #fclosestatus="{ row }">
            <span>{{ row.fclosestatus === "A" ? "未关闭" : "已关闭" }}</span>
          </template> -->
          <!-- <template #billState="{ row }">
            <span>{{ signBackStatus.find((item) => item.optionValue == row.billState + "")?.optionName }}</span>
          </template> -->
        </pure-table>
      </template>
    </PureTableBar>
    <div style="margin-top: 10px; display: flex; justify-content: space-between">
      <div style="width: calc(100vw - 700px)">
        <pure-table
          border
          :height="maxHeight / 2"
          :max-height="maxHeight / 2"
          row-key="id"
          class="bill-manage"
          :adaptive="true"
          size="small"
          align-whole="left"
          :loading="loading2"
          :data="dataList2"
          :columns="columns2"
          @row-click="rowLeftClick"
          highlight-current-row
          :show-overflow-tooltip="true"
        >
          <template #fmrpclosestatus="{ row }">
            <span>{{ row.fmrpclosestatus === "A" ? "正常" : "业务关闭" }}</span>
          </template>
        </pure-table>
      </div>
      <div style="width: 16px" />
      <div style="width: 655px">
        <pure-table
          border
          :height="maxHeight / 2"
          :max-height="maxHeight / 2"
          row-key="id"
          class="bill-manage-date"
          :adaptive="true"
          size="small"
          align-whole="left"
          :loading="loading3"
          :data="dataList3"
          :columns="columns3"
          highlight-current-row
          :show-overflow-tooltip="true"
        >
          <template #operation="{ row, index }">
            <div>
              <el-dropdown trigger="click" @command="(v) => handleCommand(v, row, index)">
                <el-button type="primary" size="small">
                  更 多<el-icon style="margin-left: 6px"><ArrowDown /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="amountSplit">数量拆分</el-dropdown-item>
                    <!-- <el-dropdown-item command="replyDelivery">交期回复</el-dropdown-item> -->
                    <el-dropdown-item command="delete" :disabled="row.uuid">删除</el-dropdown-item>
                    <el-dropdown-item command="save">保存</el-dropdown-item>
                    <el-dropdown-item command="submit">提交</el-dropdown-item>
                    <el-dropdown-item command="back">撤销</el-dropdown-item>
                    <el-dropdown-item command="nodeDetail">审核详情</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </pure-table>
      </div>
    </div>
    <el-dialog draggable v-model="dialogVisible" title="查看附件" width="800px">
      <div><Modal ref="modalRef" @fresh="fresh" /></div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false"> 关闭 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
/* :deep(.el-table tbody tr:hover > td) {
  background: transparent !important;
  color: #056608;
  border-color: #8b0000;
} */

/* :deep(.el-table__body tr.current-row > td.el-table__cell) {
  background: transparent !important;
} */
</style>
