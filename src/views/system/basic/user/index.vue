<!-- /*
 * @Author: Hailen 
 * @Date: 2023-07-05 11:45:27 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-07-05 11:45:27 
 */ -->

<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useConfig } from "./utils/hook";
import ButtonList from "@/components/ButtonList/index.vue";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "SystemBasicUserIndex" });

const {
  tableRef2,
  columns,
  columns2,
  dataList,
  dataList2,
  maxHeight,
  queryParams,
  searchOptions,
  buttonList,
  buttonList2,
  loadingStatus,
  pagination,
  groupArrsList,
  onTagSearch,
  onRefresh,
  onRefresh2,
  onEdit,
  onRowClick,
  onSizeChange,
  onSetMainRole,
  onCurrentChange,
  onDelete2,
  onRowClick2,
  handleSelectionChange2,
  columns3,
  dataList3,
  buttonList3,
  onRefresh3,
  onRowClick3,
  handleSelectionChange3,
  onSetMainDept,
  userTableRef
} = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="flex flex-1 ui-h-100 ui-w-100 ui-ov-h">
      <PureTableBar :columns="columns" style="width: 60%" @refresh="onRefresh" @change-column="setUserMenuColumns">
        <template #title>
          <BlendedSearch @tagSearch="onTagSearch" :searchOptions="searchOptions" :queryParams="queryParams" placeholder="请输入姓名" searchField="userName" />
        </template>
        <template #buttons>
          <ButtonList :buttonList="buttonList" :loadingStatus="loadingStatus" :autoLayout="false" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight"
            :max-height="maxHeight"
            ref="userTableRef"
            row-key="itemId"
            class="user-manage"
            :adaptive="true"
            align-whole="center"
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
          />
        </template>
      </PureTableBar>
      <div style="width: 40%">
        <PureTableBar :columns="columns2" @refresh="onRefresh2" @change-column="setUserMenuColumns">
          <template #title>
            <TitleCate :name="groupArrsList[1]?.groupName" :border="false" />
          </template>
          <template #buttons>
            <ButtonList :buttonList="buttonList2" :autoLayout="false" />
          </template>
          <template v-slot="{ size, dynamicColumns }">
            <pure-table
              border
              ref="tableRef2"
              :height="maxHeight / 2"
              :max-height="maxHeight / 2"
              row-key="id"
              class="user-manage-role"
              :adaptive="true"
              align-whole="center"
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
                <el-popconfirm :width="280" :title="`确认删除\n【${row.roleName}】?`" @confirm="onDelete2(row)">
                  <template #reference>
                    <el-button size="small" type="danger" @click.stop>删除</el-button>
                  </template>
                </el-popconfirm>
                <el-popconfirm :width="280" :title="`确认将\n【${row.roleName}】设为主角色?`" @confirm="onSetMainRole(row)">
                  <template #reference>
                    <el-button size="small" type="primary" @click.stop :disabled="row.isPrimarily">设为主角色</el-button>
                  </template>
                </el-popconfirm>
              </template>
            </pure-table>
          </template>
        </PureTableBar>

        <PureTableBar :columns="columns3" @refresh="onRefresh3" @change-column="setUserMenuColumns">
          <template #title>
            <TitleCate :name="groupArrsList[2]?.groupName" :border="false" />
          </template>
          <template #buttons>
            <ButtonList :buttonList="buttonList3" :autoLayout="false" />
          </template>
          <template v-slot="{ size, dynamicColumns }">
            <pure-table
              border
              ref="tableRef2"
              :height="maxHeight / 2"
              :max-height="maxHeight / 2"
              row-key="id"
              class="user-manage-dept"
              :adaptive="true"
              align-whole="center"
              :size="size"
              :data="dataList3"
              :columns="dynamicColumns"
              :paginationSmall="size === 'small'"
              :show-overflow-tooltip="true"
              @row-click="onRowClick3"
              @selection-change="handleSelectionChange3"
              @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns2)"
            >
              <template #operation="{ row }">
                <el-popconfirm :width="280" :title="`确认将\n【${row.deptName}】设为主部门?`" @confirm="onSetMainDept(row)">
                  <template #reference>
                    <el-button size="small" type="primary" @click.stop :disabled="row.isMaster">设为主部门</el-button>
                  </template>
                </el-popconfirm>
              </template>
            </pure-table>
          </template>
        </PureTableBar>
      </div>
    </div>
  </div>
</template>
