<!--
 * @Author: Hailen 
 * @Date: 2024-01-10 10:32:13 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2024-01-10 10:32:13 
-->

<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useConfig } from "./utils/hook";
import ButtonList from "@/components/ButtonList/index.vue";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "WorkbenchDrawToolsIndex" });

const { tableRef, columns, dataList, loading, maxHeight, buttonList, onEdit, onRefresh, onDelete, onRowClick, handleSelectionChange } = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <PureTableBar :columns="columns" class="flex-1" @refresh="onRefresh" @change-column="setUserMenuColumns">
      <template #title>
        <div class="no-wrap block-quote-tip ui-w-100 mr-20">创建列表</div>
      </template>
      <template #buttons>
        <ButtonList moreActionText="更多选项" :buttonList="buttonList" :auto-layout="false" />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
          ref="tableRef"
          :height="maxHeight"
          :max-height="maxHeight"
          row-key="id"
          class="table-config"
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
          @selection-change="handleSelectionChange"
          @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
        >
          <template #operation="{ row }">
            <el-button size="small" @click.stop="onEdit(row)">修改</el-button>
            <el-popconfirm :width="280" :title="`确认删除\n【${row.name}】?`" @confirm="onDelete([row])">
              <template #reference>
                <el-button size="small" @click.stop>删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>
