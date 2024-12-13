<template>
  <div>
    <pure-table
      border
      :height="maxHeight"
      :max-height="maxHeight"
      row-key="id"
      class="qc-cc-modal"
      :adaptive="true"
      align-whole="left"
      size="small"
      :data="dataList"
      :columns="columns"
      highlight-current-row
      :show-overflow-tooltip="true"
      @selection-change="handleSelectionChange"
    />
  </div>
</template>

<script setup lang="tsx">
import { setColumn } from "@/utils/table";
import { onMounted, ref } from "vue";

defineProps(["dataList"]);
const columns = ref([]);
const maxHeight = ref(600);
const rowsData = ref([]);

const getConfig = () => {
  const columnData: TableColumnList[] = [
    { label: "日期", prop: "date" },
    { label: "客户名称", prop: "customerName" },
    { label: "德龙产品型号", prop: "deograProductName" },
    { label: "客户型号", prop: "customerModel" },
    { label: "流水码", prop: "waterCode" },
    { label: "生产日期", prop: "productDate" },
    { label: "不良数量", prop: "badCount" },
    { label: "问题类别", prop: "questionClass" },
    { label: "问题描述", prop: "questionDes" },
    { label: "缺陷图片", prop: "badPhoto" },
    { label: "产生原因", prop: "appearReason" },
    { label: "分析图片", prop: "thinkPhoto" },
    { label: "临时改善", prop: "tempFinish" },
    { label: "长期改善措施", prop: "finishWay" },
    { label: "改善效果", prop: "finishRes" },
    { label: "改善后首次流水号", prop: "firstWaterCode", width: 200 },
    { label: "8D报告连接", prop: "nightLink" },
    { label: "状态", prop: "status" },
    { label: "确认人", prop: "confirmUserName" },
    { label: "备注", prop: "remark" }
  ];

  columns.value = setColumn({ columnData, operationColumn: false, radioColumn: false, selectionColumn: { hide: false } });
};

const handleSelectionChange = (rows) => {
  rowsData.value = rows;
};

onMounted(() => {
  getConfig();
});

defineExpose({ rowsData });
</script>
