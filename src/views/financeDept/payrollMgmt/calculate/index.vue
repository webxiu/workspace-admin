<script setup lang="ts">
import { useConfig } from "./utils/hook";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "FinanceDeptPayrollMgmtCalculateIndex" });

const {
  rowLeftClick,
  columns,
  dataList,
  dataList3,
  columns3,
  maxHeight,
  searchOptions,
  searchOptions3,
  queryParams,
  queryParams3,
  pagination,
  pagination3,
  buttonList,
  onSearch,
  onEdit,
  onChangeFileInput,
  handleTagSearch,
  handleTagSearch3,
  rowDbClick,
  activeName,
  maxHeight2,
  handleClickTag,
  rowClick,
  onRefresh,
  onRefresh3,
  handleSizeChange,
  handleSizeChange3,
  columns2,
  mainTableRef,
  handleCurrentChange,
  handleCurrentChange3
} = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div style="display: flex">
      <div class="left" style="width: 23%">
        <PureTableBar :columns="columns3" class="flex-1" @refresh="onRefresh3" @change-column="setUserMenuColumns">
          <template #title>
            <BlendedSearch
              @tagSearch="handleTagSearch3"
              :searchOptions="searchOptions3"
              :queryParams="queryParams3"
              placeholder="请输入单据编号"
              :immediate="false"
              searchField="billNo"
            />
          </template>
          <template #buttons />
          <template v-slot="{ size, dynamicColumns }">
            <pure-table
              border
              ref="mainTableRef"
              :height="maxHeight"
              :max-height="maxHeight"
              row-key="id"
              class="bill-manage"
              :adaptive="true"
              align-whole="left"
              :size="size"
              :data="dataList3"
              :columns="dynamicColumns"
              :paginationSmall="size === 'small'"
              :pagination="pagination3"
              @page-size-change="handleSizeChange3"
              @page-current-change="handleCurrentChange3"
              @row-click="rowLeftClick"
              highlight-current-row
              :show-overflow-tooltip="true"
              @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
            />
          </template>
        </PureTableBar>
      </div>
      <div class="right" style="width: 77%">
        <PureTableBar class="flex-1" :show-icon="false">
          <template #title>
            <BlendedSearch @tagSearch="handleTagSearch" :searchOptions="searchOptions" placeholder="请输入姓名" searchField="staffName" />
          </template>
          <template #buttons>
            <ButtonList moreActionText="业务操作" :buttonList="buttonList" :auto-layout="false" />
            <input style="display: none" type="file" accept=".xls,.xlsx" id="imporMoneyCheckInput" @change="onChangeFileInput" />
          </template>
          <template v-slot="{ size, dynamicColumns }">
            <el-tabs v-model="activeName" @tab-click="handleClickTag">
              <el-tab-pane label="职员" name="职员">
                <pure-table
                  border
                  :height="maxHeight2"
                  :max-height="maxHeight2"
                  row-key="id"
                  class="bill-manage"
                  :adaptive="true"
                  align-whole="left"
                  :size="size"
                  :data="dataList"
                  :columns="columns2"
                  :paginationSmall="size === 'small'"
                  :pagination="pagination"
                  @page-size-change="handleSizeChange"
                  @page-current-change="handleCurrentChange"
                  @row-dblclick="rowDbClick"
                  @row-click="rowClick"
                  highlight-current-row
                  :show-overflow-tooltip="true"
              /></el-tab-pane>
              <el-tab-pane label="员工" name="员工">
                <pure-table
                  border
                  :height="maxHeight2"
                  :max-height="maxHeight2"
                  row-key="id"
                  class="bill-manage"
                  :adaptive="true"
                  align-whole="left"
                  :size="size"
                  :data="dataList"
                  :columns="columns"
                  :paginationSmall="size === 'small'"
                  :pagination="pagination"
                  @page-size-change="handleSizeChange"
                  @page-current-change="handleCurrentChange"
                  @row-dblclick="rowDbClick"
                  @row-click="rowClick"
                  highlight-current-row
                  :show-overflow-tooltip="true"
              /></el-tab-pane>
            </el-tabs>
          </template>
        </PureTableBar>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.money-calc-modal {
  .el-form-item--small {
    margin-bottom: 8px !important;
  }
}
</style>
