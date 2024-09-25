<template>
  <div>
    <el-table size="small" ref="multiplePriceTableRef" :data="tableData" style="width: 100%; height: 450px" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="30" />
      <el-table-column label="序号" type="index" width="60" />
      <el-table-column
        :key="item.prop"
        v-for="item in columnsData"
        :align="item.align"
        :label="item.prop"
        :property="item.prop"
        :min-width="item.width"
        show-overflow-tooltip
      />
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { ElTable } from "element-plus";
import { onMounted } from "vue";

const multiplePriceTableRef = ref<InstanceType<typeof ElTable>>();
const multipleSelection = ref<any[]>([]);
const tableData: any = ref([]);

const props = defineProps(["selectionCallBack", "data", "callBack"]);

onMounted(() => {
  tableData.value = props.callBack();
});

const handleSelectionChange = (val: any[]) => {
  multipleSelection.value = val;
  if (typeof props.selectionCallBack === "function") props.selectionCallBack(val);
};

const columnsData = [
  { prop: "假日名称", width: 180 },
  { prop: "开始日期", width: 150 },
  { prop: "结束日期", width: 150, align: "right" }
];

const setTableData = (v) => {
  tableData.value = v;
};

defineExpose({ setTableData });
</script>
