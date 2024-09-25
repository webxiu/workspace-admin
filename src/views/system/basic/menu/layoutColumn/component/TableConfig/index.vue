<!-- /*
 * @Author: Hailen 
 * @Date: 2023-07-05 11:45:27 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-07-05 11:45:27 
 */ -->

<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import ButtonList from "@/components/ButtonList/index.vue";
import PreviewTable from "./PreviewTable.vue";
import { useConfig } from "./utils/hook";
import "vue-json-pretty/lib/styles.css";
const props = defineProps<{ menuId: number; groupId: string }>();

const {
  tableRef,
  columns,
  dataList,
  loading,
  maxHeight,
  buttonList3,
  loadingStatus,
  onRefresh,
  onDelete,
  onRowClick,
  onCopyColumn,
  onHeaderSort,
  onHeaderDragend,
  handleSelectionChange
} = useConfig(props);
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <PureTableBar :columns="columns" class="flex-1" @refresh="onRefresh" style="padding-top: 0">
      <template #title>
        <div class="no-wrap block-quote-tip ui-w-100 mr-100" @contextmenu.prevent="() => onCopyColumn('paste')" @dblclick.prevent="() => onCopyColumn('copy')">
          配置表格<span class="fz-14 color-f00 ml-1">(注: 名称、字段列必填项, 其他单元格不填默认值为空)</span>
        </div>
      </template>
      <template #buttons>
        <ButtonList moreActionText="更多选项" :buttonList="buttonList3" :loadingStatus="loadingStatus" :auto-layout="false" />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
          ref="tableRef"
          :height="maxHeight * 0.7"
          :max-height="maxHeight * 0.7"
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
          :show-overflow-tooltip="false"
          @row-click="onRowClick"
          @selection-change="handleSelectionChange"
        >
          <template #operation="{ row }">
            <el-popconfirm :width="280" :title="`确认删除字段\n【${row.prop}】吗?`" @confirm="onDelete([row])">
              <template #reference>
                <el-button type="danger" size="small" @click.stop>删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
    <PreviewTable :height="maxHeight * 0.3" :columnList="dataList" :onHeaderSort="onHeaderSort" :onHeaderDragend="onHeaderDragend" />
  </div>
</template>
