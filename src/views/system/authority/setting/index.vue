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

defineOptions({ name: "SystemAuthoritySettingIndex" });

const {
  tableRef2,
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
  curNodeKey,
  deptTreeData,
  onEdit,
  onDelete,
  onRefresh,
  onRefresh2,
  onRowClick2,
  onRowClick,
  handleNodeClick,
  handleSelectionChange2
} = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="flex flex-1 ui-h-100 ui-w-100 ui-ov-h">
      <div class="dept-tree" style="width: 260px; padding-top: 10px; height: 782px; overflow-y: auto">
        <el-tree
          :data="deptTreeData"
          :props="{ children: 'children', label: 'name' }"
          @node-click="handleNodeClick"
          accordion
          :default-expanded-keys="['0']"
          :expand-on-click-node="false"
          :highlight-current="true"
          node-key="id"
          :current-node-key="curNodeKey"
        />
      </div>
      <PureTableBar :columns="columns" style="flex: 0.65" @refresh="onRefresh" @change-column="setUserMenuColumns">
        <template #title>
          <TitleCate :name="groupArrsList[0]?.groupName" :border="false" />
        </template>
        <template #buttons>
          <ButtonList moreActionText="更多操作" :buttonList="buttonList" :auto-layout="false" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="id"
            class="role-setting"
            :adaptive="true"
            align-whole="center"
            :loading="loading"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            :paginationSmall="size === 'small'"
            highlight-current-row
            :show-overflow-tooltip="true"
            @row-click="onRowClick"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
          >
            <template #operation="{ row }">
              <el-button size="small" @click.stop="onEdit(row)">修改</el-button>
              <el-popconfirm :width="280" :title="`确认删除\n【${row.roleName}】?`" @confirm="onDelete(row)">
                <template #reference>
                  <el-button size="small" @click.stop>删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
      <PureTableBar :columns="columns2" style="flex: 0.35" @refresh="onRefresh2" @change-column="setUserMenuColumns">
        <template #title>
          <TitleCate :name="groupArrsList[1]?.groupName" :border="false" />
        </template>
        <template #buttons>
          <ButtonList :buttonList="buttonList2" :auto-layout="false" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            ref="tableRef2"
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="id"
            class="role-setting-user"
            :adaptive="true"
            align-whole="center"
            :loading="loading2"
            :size="size"
            :data="dataList2"
            :columns="dynamicColumns"
            :paginationSmall="size === 'small'"
            :default-expand-all="true"
            :show-overflow-tooltip="true"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            @row-click="onRowClick2"
            @selection-change="handleSelectionChange2"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns2)"
          />
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
