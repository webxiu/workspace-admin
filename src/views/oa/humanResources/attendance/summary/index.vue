<!-- /*
 * @Author: Hailen 
 * @Date: 2023-09-19 15:09:28 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-09-19 15:09:28 
 */ -->

<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useConfig } from "./utils/hook";
import ButtonList from "@/components/ButtonList/index.vue";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "OaHumanResourcesAttendanceSummaryIndex" });

const {
  tableRef,
  loading,
  columns,
  dataList,
  maxHeight,
  loadingStatus,
  buttonList,
  searchOptions,
  queryParams,
  pagination,
  onEdit,
  onDelete,
  onTagSearch,
  onRefresh,
  onSelect,
  onSelectAll,
  onRowClick,
  rowDbClick,
  onSizeChange,
  onCurrentChange
} = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="flex flex-1 ui-h-100 ui-w-100 ui-ov-h">
      <PureTableBar :columns="columns" @refresh="onRefresh" @change-column="setUserMenuColumns">
        <template #title>
          <BlendedSearch @tagSearch="onTagSearch" :searchOptions="searchOptions" :queryParams="queryParams" placeholder="请输入姓名" searchField="staffName" />
        </template>
        <template #buttons>
          <ButtonList :buttonList="buttonList" :loadingStatus="loadingStatus" :auto-layout="false" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            ref="tableRef"
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="id"
            class="attendance-summary"
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
            @select="onSelect"
            @select-all="onSelectAll"
            @row-click="onRowClick"
            @row-dblclick="rowDbClick"
            @page-size-change="onSizeChange"
            @page-current-change="onCurrentChange"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
          >
            <template #operation="{ row }">
              <el-button size="small" @click.stop="onEdit(row)">修改</el-button>
              <el-popconfirm :width="280" :title="`确认删除\n【${row.staffName}】吗?`" @confirm="onDelete([row])">
                <template #reference>
                  <el-button size="small" type="danger" @click.stop>删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
