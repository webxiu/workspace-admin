<script setup lang="ts">
import { useTestReportConfig } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import Modal from "@/views/supplyChainMange/orders/modal.vue";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "PlmManageLaboratoryTestReportIndex" });

const {
  columns,
  dataList,
  loading,
  maxHeight,
  pagination,
  searchOptions,
  disableInfoConst,
  buttonList,
  dialogVisible,
  modalRef,
  onRefresh,
  handleTagSearch,
  onCurrentChange,
  handleSizeChange,
  onEdit,
  rowClick,
  fresh,
  handleCurrentChange
} = useTestReportConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <PureTableBar :columns="columns" class="flex-1" @refresh="onRefresh" @change-column="setUserMenuColumns">
      <template #title>
        <BlendedSearch @tagSearch="handleTagSearch" :searchOptions="searchOptions" placeholder="文件名称" searchField="fileName" />
      </template>
      <template #buttons>
        <ButtonList :buttonList="buttonList" :auto-layout="false" moreActionText="业务操作" />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
          :height="maxHeight"
          :max-height="maxHeight"
          row-key="id"
          class="bill-manage"
          :adaptive="true"
          align-whole="left"
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :paginationSmall="size === 'small'"
          highlight-current-row
          :show-overflow-tooltip="true"
          :pagination="pagination"
          @row-click="rowClick"
          @row-dblclick="onEdit"
          @current-change="onCurrentChange"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
          @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
        >
          <template #disableState="{ row }">
            <span>{{ disableInfoConst[row.disableState] ?? "" }}</span>
          </template>
        </pure-table>
      </template>
    </PureTableBar>

    <el-dialog draggable v-model="dialogVisible" title="查看附件" width="800px">
      <div><Modal ref="modalRef" :disabled="false" @fresh="fresh" /></div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false"> 关闭 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
