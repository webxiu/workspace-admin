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

defineOptions({ name: "SystemAuthorityData" });

const {
  loading,
  loading2,
  columns,
  columns2,
  dataList,
  dataList2,
  maxHeight,
  searchOptions,
  searchOptions2,
  onEdit,
  onTagSearch,
  onTagSearch2,
  onRefresh,
  onRefresh2,
  onCurrentChange
} = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="flex flex-1 ui-h-100 ui-w-100 ui-ov-h">
      <PureTableBar :columns="columns" style="width: 50%" @refresh="onRefresh" @change-column="setUserMenuColumns">
        <template #title>
          <BlendedSearch @tagSearch="onTagSearch" :searchOptions="searchOptions" placeholder="请输入角色名称" searchField="roleName" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="id"
            class="data-auth"
            :adaptive="true"
            align-whole="center"
            :loading="loading"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            :paginationSmall="size === 'small'"
            highlight-current-row
            :show-overflow-tooltip="true"
            @current-change="onCurrentChange"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
          />
        </template>
      </PureTableBar>
      <PureTableBar :columns="columns2" style="width: 50%" @refresh="onRefresh2" @change-column="setUserMenuColumns">
        <template #title>
          <BlendedSearch @tagSearch="onTagSearch2" :searchOptions="searchOptions2" placeholder="请输入菜单名称" searchField="menuNameParam" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="menuId"
            class="data-auth-menu"
            :adaptive="true"
            align-whole="center"
            :loading="loading2"
            :size="size"
            :data="dataList2"
            :columns="dynamicColumns"
            :paginationSmall="size === 'small'"
            highlight-current-row
            :show-overflow-tooltip="true"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns2)"
          >
            <template #operation="{ row }">
              <el-button size="small" @click.stop="onEdit(row)">修改</el-button>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
