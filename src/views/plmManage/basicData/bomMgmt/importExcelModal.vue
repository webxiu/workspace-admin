<template>
  <div>
    <div style="display: flex; align-items: center; margin-bottom: 16px">
      <span>ERP层次：</span>
      <el-select v-model="level" placeholder="选择ERP层次" @change="changeVal">
        <el-option label="全部" value="全部" />
        <el-option label="前加工" value="前加工" />
        <el-option label="组装" value="组装" />
      </el-select>
    </div>
    <el-table size="small" ref="multipleTableRef" :data="tableData" style="width: 100%; height: 450px" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column label="序号" type="index" width="60" />
      <el-table-column :key="item.prop" v-for="item in columnsData" :label="item.prop" :property="item.prop" :min-width="item.width" show-overflow-tooltip />
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { ElTable } from "element-plus";

const multipleTableRef = ref<InstanceType<typeof ElTable>>();
const multipleSelection = ref<any[]>([]);
const level = ref("全部");
const tableData: any = ref([]);

const props = defineProps(["selectionCallBack", "data", "callBack"]);

const changeVal = (val) => {
  if (val === "全部") {
    tableData.value = props.callBack();
  } else {
    tableData.value = props.callBack().filter((item) => item["ERP层次"] === val);
  }
};

onMounted(() => {
  tableData.value = props.callBack();
});

const handleSelectionChange = (val: any[]) => {
  multipleSelection.value = val;
  if (typeof props.selectionCallBack === "function") props.selectionCallBack(val);
};

const columnsData = [
  { prop: "爆炸图编号", width: 90 },
  { prop: "ERP层次", width: 80 },
  { prop: "材料类型", width: 75 },
  { prop: "物料编码", width: 120 },
  { prop: "物料名称", width: 140 },
  { prop: "规格描述", width: 180 },
  { prop: "备注", width: 160 },

  { prop: "单位", width: 50 },
  { prop: "用量", width: 50 },
  { prop: "制造商", width: 80 }
];

const setTableData = (v) => {
  console.log(v, "vv");
  tableData.value = v;
};

defineExpose({ setTableData });
</script>
