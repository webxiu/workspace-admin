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
  { prop: "3D名称", width: 180 },
  { prop: "零件名称", width: 160 },
  { prop: "模穴数量", width: 75, align: "right" },
  { prop: "材料及牌号", width: 140 },
  { prop: "模具表面处理", width: 120 },
  { prop: "产品表面处理", width: 120, align: "right" },
  { prop: "类型", width: 80 },
  { prop: "德龙承担费用", width: 100, align: "right" },
  { prop: "客户承担费用", width: 100, align: "right" },
  { prop: "模号", width: 160, align: "right" },
  { prop: "重量（g)", width: 80, align: "right" },
  { prop: "T1", width: 80, align: "right" },
  { prop: "备注", width: 80, align: "right" },
  { prop: "模具含税", width: 80, align: "right" },
  { prop: "夹具模含税", width: 100, align: "right" },
  { prop: "供应商", width: 160 }
];

const setTableData = (v) => {
  tableData.value = v;
};

defineExpose({ setTableData });
</script>
