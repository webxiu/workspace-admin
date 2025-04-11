<script setup lang="ts">
import { useConfig } from "./utils/hook";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "SystemDevelopAppFormIndex" });

const {
  columns,
  dataList,
  loading,
  maxHeight,
  pagination,
  buttonList,
  searchOptions,
  onSearch,
  handleTagSearch,
  onCurrentChange,
  handleSizeChange,
  rowClick,
  onDbClick,
  handleCurrentChange
} = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <PureTableBar :columns="columns" class="flex-1" @refresh="onSearch" @change-column="setUserMenuColumns">
      <template #title>
        <BlendedSearch @tagSearch="handleTagSearch" :searchOptions="searchOptions" :immediate="false" placeholder="表单名称" searchField="formName" />
      </template>
      <template #buttons>
        <ButtonList :buttonList="buttonList" :auto-layout="false" more-action-text="业务操作" />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <div>
          <div>
            <pure-table
              id="appConfigTableId"
              border
              :height="maxHeight"
              :max-height="maxHeight"
              row-key="id"
              class="bill-manage-app"
              :adaptive="true"
              align-whole="left"
              :loading="loading"
              :size="size"
              :data="dataList"
              :columns="dynamicColumns"
              :row-style="() => ({ cursor: 'pointer' })"
              :paginationSmall="size === 'small'"
              highlight-current-row
              :show-overflow-tooltip="true"
              :pagination="pagination"
              @current-change="onCurrentChange"
              @row-dblclick="onDbClick"
              @row-click="rowClick"
              @page-size-change="handleSizeChange"
              @page-current-change="handleCurrentChange"
              @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
            />
          </div>
        </div>
      </template>
    </PureTableBar>
  </div>
</template>

<style lang="scss">
.app-form-modal {
  .el-form-item--small {
    margin-bottom: 8px !important;
  }
}
</style>
