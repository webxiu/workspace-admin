<!-- /*
 * @Author: lixiuhai 
 * @Date: 2023-06-29 16:50:45 
 * @Last Modified by:   lixiuhai 
 * @Last Modified time: 2023-06-29 16:50:45 
 */ -->
<script setup lang="ts">
import { ref } from "vue";
import { useConfig } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useEleHeight } from "@/hooks/common";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import AddFill from "@iconify-icons/ri/add-circle-line";
import BlendedSearch, { SearchOptionType } from "@/components/BlendedSearch/index.vue";

const {
  tableRef,
  formData,
  loading,
  columns,
  dataList,
  maxHeight,
  pagination,
  queryParams,
  searchOptions,
  onSearch,
  openDialog,
  onRowClick,
  handleDelete,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange
} = useConfig();
</script>

<template>
  <div class="main ui-h-100">
    <PureTableBar title="列表" v-if="columns.length" :columns="columns" @refresh="onSearch">
      <template #title>
        <BlendedSearch class="action-search" @tagSearch="onSearch" :searchOptions="searchOptions" placeholder="请输入组织名称" searchField="orgName" :queryParams="queryParams" />
      </template>
      <template #buttons>
        <el-button type="primary" :icon="useRenderIcon(AddFill)" @click="openDialog('add')">添加组织</el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
          ref="tableRef"
          v-if="maxHeight"
          :height="maxHeight"
          :max-height="maxHeight"
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="pagination"
          :paginationSmall="size === 'small'"
          @row-click="onRowClick"
          @selection-change="handleSelectionChange"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #operation="{ row }">
            <el-button class="reset-margin" link type="primary" :size="size" :icon="useRenderIcon(EditPen)" @click="openDialog('edit', row)"> 修改 </el-button>
            <el-popconfirm :width="180" :title="`确认删除组织名称\n【${row.orgName}】?`" @confirm="handleDelete(row)">
              <template #reference>
                <el-button class="reset-margin" link type="primary" :size="size" :icon="useRenderIcon(Delete)"> 删除 </el-button>
              </template>
            </el-popconfirm>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
