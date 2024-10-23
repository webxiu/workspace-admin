<template>
  <div class="top-tb">
    <el-table
      :data="tableData"
      class="dateTable"
      border
      :cell-style="{ borderColor: 'black' }"
      style="width: 100%"
      :header-cell-style="{ background: '#fff !important', borderColor: 'black' }"
      :style="{ borderColor: 'black' }"
    >
      <el-table-column label="开发日程要求：">
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :label="item.lable"
          :prop="item.prop"
          :formatter="(row, column, cellValue, index) => formatter(row, column, cellValue, index, 'top', infoId)"
        >
          <template #header="{ column }"
            ><span>{{ column.label }}</span></template
          >
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { formatter } from "./topFormConfig";

/** 接收信息中心单据处理引入传递的参数 */
withDefaults(defineProps<{ infoId: string }>(), {
  infoId: () => ""
});

const columns = [
  {
    prop: "file3dDate",
    lable: "3D文件"
  },
  {
    prop: "projectBomDate",
    lable: "工程BOM"
  },
  {
    prop: "createDate",
    lable: "开模"
  },
  {
    prop: "mouldT1Date",
    lable: "模具T1"
  },
  {
    prop: "mouldT2Date",
    lable: "模具T2"
  },
  {
    prop: "authenticationFinishDate",
    lable: "认证完成"
  },
  {
    prop: "prprojectTrial",
    lable: "PR工程试产"
  },
  {
    prop: "prproductTrial",
    lable: "PP产线试产"
  },
  {
    prop: "mpbigCargoTrial",
    lable: "出货时间"
  }
];
const tableData = ref([
  {
    file3dDate: "",
    projectBomDate: "",
    mouldT1Date: "",
    mouldT2Date: "",
    authenticationFinishDate: "",
    prprojectTrial: "",
    prproductTrial: "",
    mpbigCargoTrial: ""
  }
]);
defineExpose({ tableData });
</script>

<style scope lang="scss">
.top-tb {
  :deep(.el-date-editor.el-input, .el-date-editor.el-input__wrapper) {
    width: 60px !important;
  }
}

.dateTable {
  border: 1px solid black;
  border-top: none;
}
</style>
