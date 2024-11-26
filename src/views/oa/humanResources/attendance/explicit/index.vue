<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="flex flex-1 ui-h-100 ui-w-100 ui-ov-h">
      <PureTableBar :columns="columns" @refresh="onFresh" @change-column="setUserMenuColumns">
        <template #title>
          <BlendedSearch @tagSearch="handleTagSearch" :queryParams="queryParams" :searchOptions="searchOptions" placeholder="姓名" searchField="staffName" />
        </template>
        <template #buttons>
          <ButtonList :buttonList="buttonList" :autoLayout="false" more-action-text="更多操作" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <div style="display: flex; justify-content: space-between">
            <div style="width: 70%">
              <pure-table
                border
                :height="maxHeight"
                :max-height="maxHeight"
                row-key="id"
                class="machine-table"
                id="machineTableId"
                :adaptive="true"
                align-whole="center"
                :loading="loading"
                :size="size"
                :data="dataList"
                :columns="dynamicColumns"
                :pagination="pagination"
                :paginationSmall="size === 'small'"
                highlight-current-row
                :show-overflow-tooltip="true"
                @row-click="leftRowClick"
                :row-class-name="rowClassName"
                @page-size-change="onSizeChange"
                @page-current-change="onCurrentChange"
                @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
              />
            </div>
            <div style="width: 29%"><RightTables ref="rightTableRef" :currentLeftRow="currentRow" :setCurLeftRowByKey="setCurLeftRowByKey" /></div>
          </div>
        </template>
      </PureTableBar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMachine } from "./hook";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";
import { PureTableBar } from "@/components/RePureTableBar";
import RightTables from "./rightTables.vue";
import { Setting, Delete } from "@element-plus/icons-vue";
import ButtonList from "@/components/ButtonList/index.vue";

defineOptions({ name: "OaHumanResourcesAttendanceExplicitIndex" });

const {
  columns,
  onFresh,
  rightTableRef,
  handleTagSearch,
  searchOptions,
  buttonList,
  leftRowClick,
  rowClassName,
  currentRow,
  setCurLeftRowByKey,
  maxHeight,
  loading,
  dataList,
  queryParams,
  pagination,
  onSizeChange,
  onCurrentChange
} = useMachine();
</script>

<style scoped>
:deep(.el-input-group__prepend) {
  padding: 0 5px;
  cursor: pointer;
}
</style>
