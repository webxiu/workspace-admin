<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useConfig } from "./utils/hook";
import ButtonList from "@/components/ButtonList/index.vue";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "PlmManageProjectMgmtProjectChangeIndex" });

const {
  columns,
  dataList,
  maxHeight,
  pagination,
  searchOptions,
  buttonList,
  onFresh,
  handleTagSearch,
  onCurrentChange,
  handleSizeChange,
  rowClick,
  rowDbClick,
  handleCurrentChange
} = useConfig();
</script>

<template>
  <div style="display: flex">
    <PureTableBar :columns="columns" class="flex-1" @refresh="onFresh" @change-column="setUserMenuColumns">
      <template #title>
        <BlendedSearch @tagSearch="handleTagSearch" :searchOptions="searchOptions" placeholder="单据编号" searchField="billNo" />
      </template>
      <template #buttons>
        <ButtonList :buttonList="buttonList" :auto-layout="false" moreActionText="更多操作" />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
          :height="maxHeight"
          :max-height="maxHeight"
          row-key="id"
          id="projectChangeTable"
          :adaptive="true"
          align-whole="left"
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
        />
      </template>
    </PureTableBar>
  </div>
</template>
<style lang="scss">
.project-change-modal {
  .el-form-item--small {
    margin-bottom: 8px !important;
  }
}
</style>
