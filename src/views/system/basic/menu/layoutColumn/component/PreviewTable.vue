<script setup lang="ts">
import { ref, watch } from "vue";
import { message } from "@/utils/message";
import { setColumn, getColumnData, SortableCallbackType } from "@/utils/table";
import { PureTableBar } from "@/components/RePureTableBar";

/** ========预览表格========= */
const props = defineProps<{ height: number; columnList: any[]; onHeaderSort: Function; onHeaderDragend: Function }>();
const columns = ref<TableColumnList[]>([]);
const dataList = ref<any[]>([]);
const forceUpdate = ref<number>(0);

watch(props, (value) => {
  console.log("columnList", value.columnList);
  getColumnConfig(value.columnList);
});

// 获取配置列
const getColumnConfig = (columnList: TableColumnList[]) => {
  if (!columnList.length) return;
  // 数据为空, 生成一行默认数据
  if (dataList.value.length === 0) {
    const data = getRowData();
    dataList.value = [data];
  }
  const { columnData } = getColumnData(columnList, dataList);
  columns.value = setColumn(
    { columnData, dataList, dragSelector: ".preview-table", isDragColumn: false, operationColumn: { minWidth: 80 } },
    (data: SortableCallbackType) => {
      // if (data?.type === "column") props.onHeaderSort(data);
    }
  );
  forceUpdate.value = Date.now();
};

// 所有字段的行数据
const getRowData = () => {
  const item = props.columnList?.reduce((prev, cur) => {
    prev[cur.prop] = getCode(4); // 单元格填充数据
    return prev;
  }, {});
  return { id: Date.now(), ...item };
};

// 范围随机数
const randomNum = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

// 获取验证码
const getCode = (num: number) => {
  if (num < 1) return "";
  const sCode = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  const code = new Array(num).fill(0).reduce((prev) => {
    const txt = sCode[randomNum(0, sCode.length)];
    return (prev += txt);
  }, "");
  return code;
};

// 修改
const updateRow = ({ prop, value, row }) => (row[prop] = value);

// 添加
const onAdd = () => {
  if (!columns.value.length) return message("请添加表格配置", { type: "error" });
  const oData = getRowData();
  dataList.value = [...dataList.value, { ...oData, id: Date.now() }];
};
// 删除
const onDelete = (row) => {
  dataList.value = dataList.value.filter((item) => item.id !== row.id);
};
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content" :key="forceUpdate">
    <PureTableBar :columns="columns" class="flex-1" :show-icon="false">
      <template #title>
        <div class="no-wrap block-quote-tip mr-20 ui-w-100">预览表格</div>
      </template>
      <template #buttons>
        <el-button type="primary" @click="onAdd">新增一行</el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
          :height="height - 64"
          :max-height="height - 64"
          row-key="id"
          class="preview-table"
          :adaptive="true"
          align-whole="center"
          :loading="false"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :paginationSmall="size === 'small'"
          highlight-current-row
          :show-overflow-tooltip="true"
          @header-dragend="onHeaderDragend"
        >
          <template #operation="{ row }">
            <el-button size="small" @click="onDelete(row)">删除</el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>
