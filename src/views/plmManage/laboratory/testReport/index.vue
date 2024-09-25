<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useTestReportConfig } from "./utils/hook";
import { ref } from "vue";
import dayjs from "dayjs";
import ButtonList from "@/components/ButtonList/index.vue";
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
  onSearch,
  onFresh,
  onExport,
  handleTagSearch,
  onCurrentChange,
  handleSizeChange,
  buttonList,
  onView,
  dialogVisible,
  rowClick,
  rowDbClick,
  modalRef,
  fresh,
  onSubmitAction,
  stateOptionList,
  handleCurrentChange
} = useTestReportConfig();

const calcStateName = (data) => {
  const stateInfo = stateOptionList.value?.find((item) => item.optionValue == data.billState);
  return stateInfo?.optionName || "";
};

const firstDayOfMonth = dayjs().startOf("month").format("YYYY-MM-DD");
const nowDay = dayjs().format("YYYY-MM-DD");
const initDateRange = `${firstDayOfMonth} ~ ${nowDay}`;
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <PureTableBar :columns="columns" class="flex-1" @refresh="onFresh" @change-column="setUserMenuColumns">
      <template #title>
        <BlendedSearch @tagSearch="handleTagSearch" :searchOptions="searchOptions" placeholder="报告名称" searchField="reportName" />
      </template>
      <template #buttons>
        <ButtonList :buttonList="buttonList" :auto-layout="false" moreActionText="业务操作" />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          id="testMgmtReportTableId"
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
          @row-dblclick="rowDbClick"
          @current-change="onCurrentChange"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
          @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
        >
          <template #billState="{ row }">
            <span>{{ calcStateName(row) }}</span>
          </template>
        </pure-table>
      </template>
    </PureTableBar>

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
