<!-- /*
 * @Author: lixiuhai 
 * @Date: 2023-07-05 11:45:27 
 * @Last Modified by:   lixiuhai 
 * @Last Modified time: 2023-07-05 11:45:27 
 */ -->

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useTable } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import AddFill from "@iconify-icons/ri/add-circle-line";
import BlendedSearch from "@/components/BlendedSearch/index.vue";
import ButtonList from "@/components/ButtonList/index.vue";

const {
  tableRef,
  formData,
  maxHeight,
  loading,
  columns,
  dataList,
  pagination,
  buttonList,
  searchOptions,
  queryParams,
  onSearch,
  openDialog,
  onRowClick,
  handleDelete,
  handleSizeChange,
  onCurrentChange,
  handleCurrentChange,
  handleSelectionChange
} = useTable();
</script>

<template>
  <div class="main ui-h-100">
    <PureTableBar title="列表" :columns="columns" @refresh="onSearch">
      <template #title>
        <BlendedSearch class="action-search" @tagSearch="onSearch" :searchOptions="searchOptions" placeholder="请输入名称" searchField="name" :queryParams="queryParams" />
      </template>
      <template #buttons>
        <ButtonList :buttonList="buttonList" :autoLayout="false" more-action-text="业务操作" />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
          ref="tableRef"
          row-key="id"
          :adaptive="true"
          :height="maxHeight"
          :max-height="maxHeight"
          align-whole="center"
          showOverflowTooltip
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="pagination"
          :paginationSmall="size === 'small'"
          highlight-current-row
          :default-expand-all="false"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          @row-click="onRowClick"
          @selection-change="handleSelectionChange"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
          @current-change="onCurrentChange"
        >
          <template #operation="{ row }">
            <el-button class="reset-margin" link type="primary" :size="size" :icon="useRenderIcon(EditPen)" @click.stop="openDialog('edit', row)">修改</el-button>
            <el-popconfirm :width="180" :title="`确认删除组织名称\n【${row.orgName}】?`" @confirm="handleDelete(row)">
              <template #reference>
                <el-button class="reset-margin" link type="primary" :size="size" :icon="useRenderIcon(Delete)" @click.stop>删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>
