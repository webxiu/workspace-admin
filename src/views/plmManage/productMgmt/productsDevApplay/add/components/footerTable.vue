<template>
  <div class="top-tb">
    <el-table
      :data="tableData"
      class="footerTable"
      style="width: 100%"
      border
      :header-cell-style="{ background: '#fff !important', borderColor: 'black' }"
      :cell-style="{ borderColor: 'black' }"
      :style="{ borderColor: 'black' }"
    >
      <el-table-column label="商品策划时前期考虑内容" align="center">
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :label="item.lable"
          :prop="item.prop"
          :formatter="(row, column, cellValue, index) => formatter(row, column, cellValue, index, 'footer')"
        />
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { formatter } from "./topFormConfig";
const columns = [
  {
    prop: "primarySalePlace",
    lable: "第一销售地"
  },
  {
    prop: "salePlaceName",
    lable: "其他销售地"
  },
  {
    prop: "enterprisePlanCount",
    lable: "企划台数"
  },
  {
    prop: "saleCountYear",
    lable: "年销售量"
  },
  {
    prop: "targetPrice",
    lable: "目标价格"
  },
  {
    prop: "planSaleStockDate",
    lable: "预计出货时间"
  }
];
const tableData = ref([
  {
    salePlaceName: "",
    primarySalePlace: "",
    enterprisePlanCount: "",
    saleCountYear: "",
    targetPrice: "",
    planSaleStockDate: "",
    indexNumber: 1
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

.footerTable {
  border: 1px solid black;
  border-top: none;
}
</style>
