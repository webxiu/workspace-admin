<template>
  <div>
    <pure-table
      border
      :height="300"
      :max-height="300"
      row-key="id"
      class="bill-manage"
      :adaptive="true"
      size="small"
      align-whole="left"
      :loading="loading"
      :data="dataList"
      :columns="columns"
      highlight-current-row
      :show-overflow-tooltip="true"
    />
  </div>
</template>

<script setup lang="ts">
import { setColumn } from "@/utils/table";
import { onMounted, ref } from "vue";

const dataList = ref([]);
const loading = ref(false);
const columns = ref([]);

const getColumnConfig = () => {
  const columnData: any[] = [
    { label: "物料编码", prop: "fnumber" },
    { label: "物料名称", prop: "fname" },
    { label: "规格", prop: "fspecification" },
    { label: "单位", prop: "unit" },
    { label: "数量", prop: "fqty" },
    { label: "收货数量", prop: "freceiveqty" },
    { label: "入库数量", prop: "fstockinqty" },
    { label: "退货数量", prop: "fmrbqty" },
    { label: "不含税单价", prop: "fprice" },
    { label: "含税单价", prop: "ftaxprice" },
    { label: "税率%", prop: "ftaxrate" },
    { label: "价税合计", prop: "fallamount" },
    { label: "金额", prop: "famount" },
    {
      label: "状态",
      prop: "fmrpclosestatus",
      cellRenderer: ({ row }) => (row.fmrpclosestatus === "A" ? "正常" : "业务关闭") //operation
    }
  ];
  columns.value = setColumn({ columnData, operationColumn: false });
};

onMounted(() => {
  getColumnConfig();
});

defineExpose({ loading, dataList });
</script>
