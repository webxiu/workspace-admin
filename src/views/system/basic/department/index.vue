<!-- /*
 * @Author: Hailen 
 * @Date: 2023-07-05 11:45:27 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-07-05 11:45:27 
 */ -->

<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useConfig } from "./utils/hook";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";
import SearchList from "@/components/SearchList/index.vue";

defineOptions({ name: "SystemBasicDepartment" });

const {
  loading,
  loading2,
  columns,
  columns2,
  dataList,
  dataList2,
  maxHeight,
  buttonList,
  buttonList2,
  groupArrsList,
  onAdd2,
  onEdit,
  onEdit2,
  onDelete,
  onDelete2,
  onRefresh,
  onRefresh2,
  dbClick,
  onCurrentChange,
  onCurrentChange2
} = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="flex flex-1 ui-h-100 ui-w-100 ui-ov-h">
      <PureTableBar :columns="columns" style="width: 60%" @refresh="onRefresh" @change-column="setUserMenuColumns">
        <template #title>
          <SearchList
            v-model="dataList"
            :bright="false"
            style="width: 30%"
            placeholder="请输入查询关键字"
            :propKeys="['deptName', 'deptCode', 'k3DeptId', 'k3DeptCode', 'principalName', 'clerkName']"
          />
        </template>
        <template #buttons>
          <ButtonList :buttonList="buttonList" :autoLayout="false" more-action-text="业务操作" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="itemId"
            class="dep-manage"
            :adaptive="true"
            align-whole="center"
            :loading="loading"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            :paginationSmall="size === 'small'"
            highlight-current-row
            :default-expand-all="true"
            :show-overflow-tooltip="true"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            @current-change="onCurrentChange"
            @row-dblclick="dbClick"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
          >
            <template #operation="{ row }">
              <el-button size="small" @click.stop="onEdit(row)">修改</el-button>
              <el-popconfirm :width="280" :title="`确认删除\n【${row.deptName}】?`" @confirm="onDelete(row)">
                <template #reference>
                  <el-button size="small" @click.stop>删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
      <PureTableBar :columns="columns2" style="width: 40%" @refresh="onRefresh2" @change-column="setUserMenuColumns">
        <template #title>
          <TitleCate :name="groupArrsList[1]?.groupName" :border="false" />
        </template>
        <template #buttons>
          <ButtonList :buttonList="buttonList2" :autoLayout="false" more-action-text="业务操作" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="itemId"
            class="dep-manage-group"
            :adaptive="true"
            align-whole="center"
            :loading="loading2"
            :size="size"
            :data="dataList2"
            :columns="dynamicColumns"
            :paginationSmall="size === 'small'"
            highlight-current-row
            :default-expand-all="true"
            :show-overflow-tooltip="true"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            @current-change="onCurrentChange2"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns2)"
          >
            <template #operation="{ row }">
              <el-button size="small" @click.stop="onEdit2(row)">修改</el-button>
              <el-popconfirm :width="280" :title="`确认删除\n【${row.groupName}】?`" @confirm="onDelete2(row)">
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
