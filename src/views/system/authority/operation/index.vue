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
import SearchList from "@/components/SearchList/index.vue";

defineOptions({ name: "SystemAuthorityOperationIndex" });

const {
  loading,
  loading2,
  columns,
  columns2,
  dataList,
  dataList2,
  maxHeight,
  tableRef2,
  buttonList,
  onRefresh,
  onRefresh2,
  onRowClick2,
  onCurrentChange,
  handleSelectionChange2
} = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="flex flex-1 ui-h-100 ui-w-100 ui-ov-h">
      <PureTableBar :columns="columns" style="width: 50%" @refresh="onRefresh" @change-column="setUserMenuColumns">
        <template #title>
          <SearchList v-model="dataList" :bright="false" style="width: 30%" placeholder="查询项目名称" :propKeys="['menuName']" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="itemId"
            class="opt-auth"
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
            @current-change="onCurrentChange"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
          />
        </template>
      </PureTableBar>
      <PureTableBar :columns="columns2" style="width: 50%" @refresh="onRefresh2" @change-column="setUserMenuColumns">
        <template #title>
          <SearchList
            v-model="dataList2"
            :bright="false"
            style="width: 30%"
            placeholder="查询角色、部门、编号"
            :propKeys="['roleName', 'deptName', 'roleCode']"
          />
        </template>
        <template #buttons>
          <ButtonList :buttonList="buttonList" :autoLayout="false" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            ref="tableRef2"
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="itemId"
            class="opt-auth-role"
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
          />
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
