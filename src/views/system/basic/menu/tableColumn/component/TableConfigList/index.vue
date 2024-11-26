<!-- /*
 * @Author: Hailen 
 * @Date: 2023-07-05 11:45:27 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-07-05 11:45:27 
 */ -->
<template>
  <div class="ui-h-100 flex flex-1 main main-content">
    <PureTableBar :columns="columns" class="flex-1" @refresh="onRefresh" style="padding-top: 0">
      <template #title>
        <div class="no-wrap block-quote-tip ui-w-100 mr-100" @contextmenu.prevent="() => onCopyColumn('paste')" @dblclick.prevent="() => onCopyColumn('copy')">
          表格配置<span class="fz-14 color-f00 ml-1">(注: 名称、字段列必填，字符串对齐方式居左，数字类: 如⾦额、数量等居右对齐)</span>
        </div>
      </template>
      <template #buttons>
        <ButtonList moreActionText="更多选项" :buttonList="buttonList2" :loadingStatus="loadingStatus" :auto-layout="false" />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
          ref="tableRef"
          :height="height * 0.6"
          :max-height="height * 0.6"
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
  </div>
</template>

<script setup lang="ts">
import { watch } from "vue";
import "vue-json-pretty/lib/styles.css";
import { useConfig } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import ButtonList from "@/components/ButtonList/index.vue";
import { NodeItemProps } from "@/views/system/basic/menu/tableColumn/utils/hook";

defineOptions({ name: "TableConfigList" });

const props = defineProps<{ queryParams: NodeItemProps; height: number }>();
const {
  tableRef,
  queryParams2,
  columns,
  dataList,
  loading,
  buttonList2,
  loadingStatus,
  onRefresh,
  onDelete,
  onRowClick,
  onCopyColumn,
  getTableList,
  handleSelectionChange
} = useConfig();

watch(
  props,
  ({ queryParams }) => {
    const { columnGroupId, columnname, menuId } = queryParams;
    if (columnGroupId && columnname && menuId) {
      queryParams2.value = queryParams;
      getTableList();
    }
  },
  { immediate: true }
);
</script>
