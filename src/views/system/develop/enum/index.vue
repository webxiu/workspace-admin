<!-- /*
 * @Author: Hailen
 * @Date: 2023-08-14 11:07:31
 * @Last Modified by:   Hailen
 * @Last Modified time: 2023-08-14 11:07:31
 */ -->

<script setup lang="ts">
import { useConfig } from "./utils/hook";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "SystemDevelopEnum" });

const {
  columnDefs,
  isAgTable,
  tableRef2,
  loading,
  loading2,
  columns,
  columns2,
  dataList,
  dataList2,
  maxHeight,
  pagination,
  searchOptions,
  buttonList,
  buttonList2,
  groupArrsList,
  onEdit,
  onEdit2,
  onDelete,
  onDelete2,
  onRefresh,
  onRefresh2,
  onRowClick2,
  rowClick,
  onTagSearch,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange2,
  onSwitchTable
} = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="flex flex-1 ui-h-100 ui-w-100 ui-ov-h">
      <AgGridTable
        v-if="isAgTable"
        rowKey="id"
        :rowData="dataList"
        :loading="loading"
        :columnDefs="columnDefs"
        :height="maxHeight + 15"
        :paginations="pagination"
        @refresh="onRefresh"
        @switch="onSwitchTable"
        @cellClicked="rowClick"
        @cellDoubleClicked="onEdit"
        @sizeChange="handleSizeChange"
        @currentChange="handleCurrentChange"
        :headButtons="{ buttonList, autoLayout: false }"
        :blendedSearch="{ onTagSearch, searchOptions, searchField: 'optionName', placeholder: '请输入信息名称' }"
      />
      <PureTableBar v-else :columns="columns" style="width: 50%" @refresh="onRefresh" @change-column="setUserMenuColumns">
        <template #title>
          <BlendedSearch @tagSearch="onTagSearch" :searchOptions="searchOptions" placeholder="请输入信息名称" searchField="optionName" />
        </template>
        <template #buttons>
          <ButtonList :buttonList="buttonList" :autoLayout="false" more-action-text="业务操作" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="id"
            class="enum-dict"
            :adaptive="true"
            align-whole="center"
            :loading="loading"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            :paginationSmall="size === 'small'"
            highlight-current-row
            :show-overflow-tooltip="true"
            @row-click="rowClick"
            :pagination="pagination"
            @page-size-change="handleSizeChange"
            @page-current-change="handleCurrentChange"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
          >
            <template #operation="{ row }">
              <el-button size="small" @click.stop="onEdit(row)">修改</el-button>
              <el-popconfirm :width="280" :title="`确认删除\n【${row.optionName}】?`" @confirm="onDelete(row)">
                <template #reference>
                  <el-button size="small" @click.stop>删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
      <PureTableBar :columns="columns2" style="width: 50%" @refresh="onRefresh2" @change-column="setUserMenuColumns">
        <template #title>
          <TitleCate :name="groupArrsList[1]?.groupName" :border="false" />
        </template>
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
            class="enum-dict-option"
            :adaptive="true"
            align-whole="center"
            :loading="loading2"
            :size="size"
            :data="dataList2"
            :columns="dynamicColumns"
            :paginationSmall="size === 'small'"
            :show-overflow-tooltip="true"
            @row-click="onRowClick2"
            @selection-change="handleSelectionChange2"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns2)"
          >
            <template #operation="{ row }">
              <el-button size="small" @click.stop="onEdit2(row)">修改</el-button>
              <el-popconfirm :width="280" :title="`确认要删除【${row.optionName}】吗?`" @confirm="onDelete2(row)">
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
