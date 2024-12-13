<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="flex flex-1 ui-h-100 ui-w-100 ui-ov-h">
      <pure-table
        border
        :height="maxHeight"
        :max-height="maxHeight"
        row-key="projectId"
        :adaptive="true"
        align-whole="center"
        size="small"
        :data="dataList"
        :columns="columns"
        highlight-current-row
        :summary-method="getSummaries"
        show-summary
        :show-overflow-tooltip="true"
      />
    </div>
  </div>
</template>

<script setup lang="tsx">
import { onMounted, ref, watch } from "vue";
import { setColumn, tableEditRender } from "@/utils/table";
import { fixed2AndAddcomma } from "@/utils/common";

const dataList = ref([]);
const columns = ref([]);
const maxHeight = ref(372);
const props = defineProps(["type", "setFormData", "topFormData", "valid"]);

// 编辑表格
const { editCellRender } = tableEditRender();

const getColumnsConfig = () => {
  const columnData: TableColumnList[] = [
    { label: "模具分类", prop: "modelType", width: 130 },
    {
      label: "德龙承担",
      align: "right",
      width: 130,
      prop: "deograFee",
      cellRenderer: (data) =>
        editCellRender({ data, isEdit: !["add", "view", "edit"].includes(props.type) && props.valid.fixedCostDetails, cellStyle: { textAlign: "right" } })
    },
    {
      label: "客户承担",
      align: "right",
      width: 130,
      prop: "customerFee",
      cellRenderer: (data) =>
        editCellRender({ data, isEdit: !["add", "view", "edit"].includes(props.type) && props.valid.fixedCostDetails, cellStyle: { textAlign: "right" } })
    },
    {
      label: "备注",
      prop: "remark",
      cellRenderer: (data) => editCellRender({ data, isEdit: !["add", "view", "edit"].includes(props.type) && props.valid.fixedCostDetails })
    }
  ];
  columns.value = setColumn({ columnData, operationColumn: false });
};

watch(
  () => dataList.value.map((item) => item.deograFee),
  (newVal) => {
    const numArr = newVal.map((item) => +item).filter((el) => !isNaN(el));
    const deograFeeTotal = numArr.reduce((pre, next) => pre + next, 0);
    if (deograFeeTotal) {
      const breakVenSalesFee = isNaN(+props.topFormData?.marginalContribution) ? 0 : Math.ceil(deograFeeTotal / props.topFormData?.marginalContribution);
      props.setFormData({ key: "breakVenSales", val: breakVenSalesFee.toFixed(2) });
    }
  }
);

const getSummaries = (param) => {
  const { columns, data } = param;
  const shouldTotalArr = ["deograFee", "customerFee"];
  const sums = [];
  columns.forEach((column, index) => {
    // 第一列 显示文字 小计
    if (column.property === "modelType") {
      sums[index] = "合计(不含税)";
      return;
    }
    if (shouldTotalArr.includes(column.property)) {
      const values = data.map((item) => Number(item[column.property]));
      if (!values.every((value) => isNaN(value))) {
        sums[index] = values.reduce((prev, curr) => {
          const value = Number(curr);
          if (!isNaN(value)) {
            return prev + curr;
          } else {
            return prev;
          }
        }, 0);
        sums[index] = ["FPRICEQTY", "FREALQTY", "FGROSSMARGINRATE"].includes(column.property)
          ? (+sums[index]).toLocaleString()
          : fixed2AndAddcomma(+sums[index].toFixed(2)); // 保留2位小数，解决小数列合计精度缺失的问题
      } else {
        sums[index] = ""; // 其余列一律不进行合计，结果输出空
      }
    }
  });
  return sums;
};

defineExpose({ dataList });

onMounted(() => {
  getColumnsConfig();
});
</script>
