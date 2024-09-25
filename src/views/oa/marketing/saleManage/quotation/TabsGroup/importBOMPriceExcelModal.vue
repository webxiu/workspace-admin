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
  { prop: "BOM层级", width: 80 },
  { prop: "子项物料编码", width: 150 },
  { prop: "物料名称", width: 150 },
  { prop: "规格型号", width: 140 },
  { prop: "物料属性", width: 80 },
  { prop: "不含税单价", width: 90, align: "right" },
  { prop: "不含税金额(RMB)", width: 130, align: "right" },
  { prop: "BOM版本", width: 80 },
  { prop: "数据状态", width: 80 },
  { prop: "单位", width: 50 },
  { prop: "用量:分子", width: 80, align: "right" },
  { prop: "用量:分母", width: 80, align: "right" },
  { prop: "标准用量", width: 80, align: "right" },
  { prop: "备注", width: 160 }
];

const setTableData = (v) => {
  tableData.value = v;
};

defineExpose({ setTableData });
</script>
