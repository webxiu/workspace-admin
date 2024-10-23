<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useConfig } from "./utils/hook";

import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";
import dayjs from "dayjs";

defineOptions({ name: "PlmManageProjectMgmtDR0ApplyIndex" });

const {
  columns,
  dataList,
  rowDbClick,
  rowClick,
  maxHeight,
  buttonList,
  handleSizeChange,
  handleCurrentChange,
  onCurrentChange,
  searchOptions,
  statusList,
  onFresh,
  pagination,
  handleTagSearch
} = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <PureTableBar :columns="columns" class="flex-1" @refresh="onFresh" @change-column="setUserMenuColumns">
      <template #title>
        <BlendedSearch @tagSearch="handleTagSearch" :searchOptions="searchOptions" placeholder="单据编号" searchField="billNo" />
      </template>
      <template #buttons>
        <ButtonList :buttonList="buttonList" :auto-layout="false" moreActionText="业务操作" />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
          id="productStoreTableId"
          :height="maxHeight"
          :max-height="maxHeight"
          row-key="id"
          class="bill-manage"
          :adaptive="true"
          align-whole="left"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          highlight-current-row
          :paginationSmall="size === 'small'"
          :pagination="pagination"
          @current-change="onCurrentChange"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
          @row-dblclick="rowDbClick"
          @row-click="rowClick"
          :show-overflow-tooltip="true"
          @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
        >
          <template #applyDate="{ row }">
            <span>{{ dayjs(row.applyDate).format("YYYY-MM-DD") }}</span>
          </template>
          <template #status="{ row }">
            <span>{{ statusList.find((el) => el.optionValue == row.status)?.optionName ?? "" }}</span>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>
<style lang="scss">
.product-apply-modal {
  .el-form-item--small {
    margin-bottom: 8px !important;
  }
}
</style>
