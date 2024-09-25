<!-- /*
 * @Author: Hailen 
 * @Date: 2023-07-05 11:45:27 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-07-05 11:45:27 
 */ -->

<script setup lang="ts">
import { useConfig } from "./utils/hook";
import Content from "@/layout/Content.vue";
import ButtonList from "@/components/ButtonList/index.vue";
import { PureTableBar } from "@/components/RePureTableBar";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "OaProductMkCenterEngineerDeptOperateBookIndex" });

const { loading, columns, dataList, maxHeight, buttonList, pagination, searchOptions, onTagSearch, onRefresh, onRowClick, onDistribute, onCurrentChange } =
  useConfig();
</script>

<template>
  <Content direction="row">
    <PureTableBar :columns="columns" @refresh="onRefresh" @change-column="setUserMenuColumns">
      <template #title>
        <BlendedSearch @tagSearch="onTagSearch" :searchOptions="searchOptions" placeholder="请输入指导书名称" searchField="manualName" />
      </template>
      <template #buttons>
        <ButtonList :buttonList="buttonList" :autoLayout="false" />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
          :height="maxHeight"
          :max-height="maxHeight"
          row-key="itemId"
          :adaptive="true"
          align-whole="center"
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          highlight-current-row
          :pagination="pagination"
          :show-overflow-tooltip="true"
          @current-change="onCurrentChange"
          @row-dblclick="onRowClick"
          @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
        >
          <template #operation="{ row }">
            <el-button size="small" type="primary" @click.stop="onDistribute(row)">分发</el-button>
            <el-button size="small" type="success" @click.stop="onRowClick(row)">排位表</el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </Content>
</template>
