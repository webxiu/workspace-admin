<script setup lang="ts">
import { useConfig } from "./utils/hook";
import { fixed2AndAddcomma } from "@/utils/common";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "FinanceDeptPayrollMgmtPayslipIndex" });

const {
  columnDefs,
  isAgTable,
  tableRef,
  columns,
  dataList,
  loading,
  maxHeight,
  sumInfo,
  queryParams,
  searchOptions,
  loadingStatus,
  buttonList,
  pagination,
  onView,
  onSelect,
  onRefresh,
  onRowClick,
  onSelectAll,
  onTagSearch,
  onSizeChange,
  onCurrentChange,
  onSwitchTable
} = useConfig();

const getSummaries = (param) => {
  const { columns, data } = param;
  const sums: string[] = [];
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = "合计";
      return;
    }

    if (["idCard", "staffId", undefined, "signatureFilePath"].includes(column.property)) {
      sums[index] = "";
      return;
    }

    const values = data.map((item) => Number(item[column.property]));
    if (!values.every((value) => Number.isNaN(value))) {
      const curTotal = values.reduce((prev, curr) => {
        const value = Number(curr);
        if (!Number.isNaN(value)) {
          return prev + curr;
        } else {
          return 0;
        }
      }, 0);
      sums[index] = fixed2AndAddcomma(curTotal);
    } else {
      sums[index] = "";
    }
  });

  return sums;
};
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <AgGridTable
      v-if="isAgTable"
      ref="tableRef"
      rowKey="id"
      :rowData="dataList"
      :loading="loading"
      :columnDefs="columnDefs"
      :height="maxHeight + 14"
      :paginations="pagination"
      :openSideBar="true"
      @refresh="onRefresh"
      @switch="onSwitchTable"
      @cellClicked="onRowClick"
      @cellDoubleClicked="onView"
      @rowSelected="onSelect"
      @sizeChange="onSizeChange"
      @currentChange="onCurrentChange"
      :headButtons="{ buttonList, loadingStatus, autoLayout: false }"
      :blendedSearch="{ onTagSearch, queryParams, immediate: false, searchOptions, searchField: 'userName', placeholder: '请输入姓名' }"
    >
      <template #footer>
        <div class="color-606266 fz-14">
          <span class="mr-20">应发工资合计(￥)：{{ fixed2AndAddcomma(sumInfo.sumYingFaGongzi) }}</span>
          <span>实发工资合计(￥)：{{ fixed2AndAddcomma(sumInfo.sumShiFaGongzi) }}</span>
        </div>
      </template>
    </AgGridTable>
    <PureTableBar v-else :columns="columns" class="flex-1" @refresh="onRefresh" @change-column="setUserMenuColumns">
      <template #title>
        <BlendedSearch
          @tagSearch="onTagSearch"
          :immediate="false"
          :searchOptions="searchOptions"
          :queryParams="queryParams"
          placeholder="请输入姓名"
          searchField="userName"
        />
      </template>
      <template #buttons>
        <ButtonList :buttonList="buttonList" :loadingStatus="loadingStatus" more-action-text="业务操作" :autoLayout="false" />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <!-- :summary-method="getSummaries" -->
        <!-- show-summary -->
        <pure-table
          border
          ref="tableRef"
          :height="maxHeight"
          :max-height="maxHeight"
          row-key="id"
          :adaptive="true"
          align-whole="left"
          :columns="dynamicColumns"
          :loading="loading"
          :size="size"
          :data="dataList"
          :pagination="pagination"
          :show-overflow-tooltip="true"
          :paginationSmall="size === 'small'"
          highlight-current-row
          @select="onSelect"
          @row-dblclick="onView"
          @row-click="onRowClick"
          @select-all="onSelectAll"
          @page-size-change="onSizeChange"
          @page-current-change="onCurrentChange"
          @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
        >
          <template #append>
            <div class="sum-line">
              <div style="margin: 8px">应发工资合计(￥)：{{ fixed2AndAddcomma(sumInfo.sumYingFaGongzi) }}</div>
              <div style="margin: 8px">实发工资合计(￥)：{{ fixed2AndAddcomma(sumInfo.sumShiFaGongzi) }}</div>
            </div>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<style scoped>
.wrap-img-money {
  display: flex;
  align-items: center;
  justify-content: center;
}
.sum-line {
  display: flex;
  background-color: transparent;
  font-weight: bold;
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 99;
}
</style>
