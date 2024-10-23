<!-- /*
 * @Author: Hailen
 * @Date: 2023-07-05 11:45:27
 * @Last Modified by:   Hailen
 * @Last Modified time: 2023-07-05 11:45:27
 */ -->

<script setup lang="ts">
import { useConfig } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "SystemTaskIndex" });

const {
  loading,
  loading2,
  loading3,
  columns,
  columns2,
  columns3,
  dataList,
  dataList2,
  dataList3,
  maxHeight,
  searchOptions,
  pagination,
  tableRef2,
  tableRef3,
  buttonList,
  buttonList2,
  buttonList3,
  onEdit,
  onDelete,
  onDelete2,
  onDelete3,
  onTagSearch,
  onRowClick,
  onRowClick2,
  onRowClick3,
  onRefresh,
  onRefresh2,
  onRefresh3,
  onSelectionChange2,
  onSelectionChange3,
  onSizeChange,
  onCurrentChange
} = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="flex flex-1 ui-h-100 ui-w-100 ui-ov-h">
      <PureTableBar :columns="columns" style="width: 50%" @refresh="onRefresh" @change-column="setUserMenuColumns">
        <template #title>
          <BlendedSearch @tagSearch="onTagSearch" :searchOptions="searchOptions" placeholder="请输入任务名称" searchField="taskName" />
        </template>
        <template #buttons>
          <ButtonList :buttonList="buttonList" :autoLayout="false" more-action-text="更多操作" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="id"
            class="data-base"
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
            @row-click="onRowClick"
            @page-size-change="onSizeChange"
            @page-current-change="onCurrentChange"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
          >
            <template #limitedWorkingDay="{ row }">
              <span v-if="typeof row.limitedWorkingDay === 'boolean'">{{ row.limitedWorkingDay ? "是" : "否" }}</span>
              <span v-else />
            </template>
          </pure-table>
        </template>
      </PureTableBar>
      <PureTableBar :columns="columns2" style="width: 25%" @refresh="onRefresh2" @change-column="setUserMenuColumns">
        <template #buttons>
          <ButtonList :buttonList="buttonList2" :autoLayout="false" more-action-text="业务操作" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            ref="tableRef2"
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="menuId"
            class="data-table"
            :adaptive="true"
            align-whole="center"
            :loading="loading2"
            :size="size"
            :data="dataList2"
            :columns="dynamicColumns"
            :paginationSmall="size === 'small'"
            highlight-current-row
            :show-overflow-tooltip="true"
            @row-click="onRowClick2"
            @selection-change="onSelectionChange2"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns2)"
          >
            <template #operation="{ row }">
              <el-popconfirm :width="280" :title="`确认移除角色\n【${row.roleName}】?`" @confirm="onDelete2(row)">
                <template #reference>
                  <el-button size="small" @click.stop>删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
      <PureTableBar :columns="columns3" style="width: 25%" @refresh="onRefresh3" @change-column="setUserMenuColumns">
        <template #buttons>
          <ButtonList :buttonList="buttonList3" :autoLayout="false" more-action-text="业务操作" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            ref="tableRef3"
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="menuId"
            class="data-field"
            :adaptive="true"
            align-whole="center"
            :loading="loading3"
            :size="size"
            :data="dataList3"
            :columns="dynamicColumns"
            :paginationSmall="size === 'small'"
            :show-overflow-tooltip="true"
            highlight-current-row
            @row-click="onRowClick3"
            @selection-change="onSelectionChange3"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns3)"
          >
            <template #operation="{ row }">
              <el-popconfirm :width="280" :title="`确认移除用户\n【${row.userName}】?`" @confirm="onDelete3(row)">
                <template #reference>
                  <el-button size="small" @click.stop>删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
