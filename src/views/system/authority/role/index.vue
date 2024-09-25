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
import RightMenuTable from "./rightMenuTable.vue";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";
import SearchList from "@/components/SearchList/index.vue";

defineOptions({ name: "SystemAuthorityRoleIndex" });

const {
  loading,
  loading2,
  columns,
  dataList,
  rightTableRef,
  random,
  expandAll,
  maxHeight,
  dataSource,
  treeRef,
  buttonList,
  onCheck,
  onRefresh,
  nodeClick,
  selectHandle,
  onCopy,
  onRowClick
} = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="flex flex-1 ui-h-100 ui-w-100 ui-ov-h">
      <PureTableBar :columns="columns" style="width: 50%; padding-top: 0" @refresh="onRefresh" @change-column="setUserMenuColumns">
        <template #title>
          <SearchList v-model="dataList" :bright="false" style="width: 40%" placeholder="查询部门名称、角色名称" :propKeys="['deptName', 'roleName']" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="itemId"
            class="role-authority"
            :adaptive="true"
            align-whole="center"
            :loading="loading"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            :paginationSmall="size === 'small'"
            highlight-current-row
            :default-expand-all="false"
            :show-overflow-tooltip="true"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            @row-click="onRowClick"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
          >
            <template #operation="{ row }">
              <el-button size="small" @click.stop="onCopy(row)">复制权限</el-button>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
      <div style="width: 50%; overflow: hidden" class="border-line ui-ov-h p-2">
        <div class="pb-4 flex just-between align-center border-line-bottom">
          <div class="no-wrap">权限树</div>
          <ButtonList :buttonList="buttonList" :autoLayout="false" />
        </div>
        <div class="flex just-between" style="height: 100%">
          <el-scrollbar :height="`${maxHeight - 15}px`" style="flex: 0.5">
            <el-tree
              :key="random"
              ref="treeRef"
              v-loading="loading2"
              :data="dataSource"
              show-checkbox
              node-key="id"
              highlight-current
              :props="{ label: 'title', children: 'children' }"
              :default-expand-all="expandAll"
              :expand-on-click-node="true"
              @check-change="selectHandle"
              @check="onCheck"
              @node-click="nodeClick"
              :style="{ minWidth: '220px' }"
            />
          </el-scrollbar>
          <div class="menu-table" style="flex: 0.5">
            <RightMenuTable ref="rightTableRef" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
