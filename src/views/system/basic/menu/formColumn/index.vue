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
import PreviewForm from "./component/PreviewForm.vue";
import "vue-json-pretty/lib/styles.css";
import ColumnMenuList from "../tableColumn/component/ColumnMenuList.vue";
import { ConfUrl } from "../utils/hook";

defineOptions({ name: "SystemBasicMenuFormColumn" });

const {
  tableRef,
  columns,
  dataList,
  loading,
  maxHeight,
  buttonList3,
  route,
  loadingStatus,
  onRefresh,
  onDelete,
  onRowClick,
  handleSelectionChange,
  onCopyColumn
} = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <PureTableBar :columns="columns" class="flex-1" @refresh="onRefresh">
      <template #title>
        <div class="no-wrap block-quote-tip ui-w-100" @contextmenu.prevent="() => onCopyColumn('paste')" @dblclick.prevent="() => onCopyColumn('copy')">
          配置表单・{{ route.query?.menuName }}<span class="fz-14 color-f00 ml-1">(注: 名称、字段列必填项, 其他单元格不填默认值为空)</span>
        </div>
        <div class="mr-100 ml-20">
          <ColumnMenuList :url="ConfUrl.form" size="default" style="min-width: 200px" />
        </div>
      </template>
      <template #buttons>
        <ButtonList moreActionText="更多选项" :buttonList="buttonList3" :loadingStatus="loadingStatus" :auto-layout="false" />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
          ref="tableRef"
          :height="maxHeight * 0.6"
          :max-height="maxHeight * 0.6"
          row-key="id"
          class="form-config"
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
                <el-button size="small" @click.stop>删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
    <PreviewForm :height="maxHeight - maxHeight * 0.6 - 70" :columnList="dataList" />
  </div>
</template>
