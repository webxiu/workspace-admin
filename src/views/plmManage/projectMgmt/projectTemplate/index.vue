<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useConfig } from "./utils/hook";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "PlmManageProjectMgmtProjectTemplateIndex" });

const {
  columns,
  dataList,
  loading,
  maxHeight,
  pagination,
  searchOptions,
  onFresh,
  buttonList,
  handleTagSearch,
  onCurrentChange,
  handleSizeChange,
  leftRowDbClick,
  leftRowClick,
  handleCurrentChange
} = useConfig();

const rowStyle = () => {
  return {
    cursor: "pointer"
  };
};
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <PureTableBar :columns="columns" class="flex-1" @refresh="onFresh" @change-column="setUserMenuColumns">
      <template #title>
        <BlendedSearch @tagSearch="handleTagSearch" :searchOptions="searchOptions" placeholder="模板编号" searchField="projectModelCode" />
      </template>
      <template #buttons>
        <ButtonList moreActionText="业务操作" :buttonList="buttonList" :auto-layout="false" />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <div>
          <div>
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
              :row-style="rowStyle"
              :paginationSmall="size === 'small'"
              highlight-current-row
              :show-overflow-tooltip="true"
              :pagination="pagination"
              @row-dblclick="leftRowDbClick"
              @row-click="leftRowClick"
              @current-change="onCurrentChange"
              @page-size-change="handleSizeChange"
              @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
              @page-current-change="handleCurrentChange"
            >
              <template #choice>
                <el-radio label="&nbsp;" size="small" />
              </template>
              <template #state="{ row }">
                {{ row.state == 0 ? "正常" : "禁用" }}
              </template>
            </pure-table>
          </div>
        </div>
      </template>
    </PureTableBar>
  </div>
</template>
