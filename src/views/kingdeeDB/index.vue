<!-- /*
 * @Author: lixiuhai 
 * @Date: 2023-06-29 16:50:10 
 * @Last Modified by:   lixiuhai 
 * @Last Modified time: 2023-06-29 16:50:10 
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
import BlendedSearch from "@/components/BlendedSearch/index.vue";

const { tableRef, loading, columns, dataList, pagination, searchOptions, onSearch, openDialog, onViewGantt, handleDelete, handleSizeChange, onRowClick, handleCurrentChange } = useConfig();

const defaultValue = ref({}); //默认搜索值
const boxRef = ref<HTMLDivElement>();
const maxHeight = useEleHeight(".app-main .el-scrollbar", 60 + 64 + 48);
</script>

<template>
  <div class="main ui-h-100" ref="boxRef">
    <PureTableBar title="列表" v-if="columns.length" :columns="columns" @refresh="onSearch">
      <template #title>
        <BlendedSearch class="action-search" @tagSearch="onSearch" :options="searchOptions" placeholder="请输入数据库简称" searchField="accountName" :default="defaultValue" />
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
          highlight-current-row
          @row-click="onRowClick"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #operation="{ row }">
            <el-button class="reset-margin" link type="primary" :size="size" :icon="useRenderIcon(EditPen)" @click="openDialog('edit', row)"> 修改 </el-button>
            <el-button type="primary" :size="size" @click="onViewGantt(row)"> 甘特图 </el-button>
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
