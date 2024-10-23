<template>
  <div>
    <pure-table
      border
      :height="maxHeight"
      :max-height="maxHeight"
      row-key="propertyCode"
      :adaptive="true"
      align-whole="left"
      size="small"
      :data="dataList"
      :columns="columns"
      show-overflow-tooltip
      highlight-current-row
      @selection-change="onSelectionChange"
    />
  </div>
</template>

<script setup lang="tsx">
import { setColumn } from "@/utils/table";
import { onMounted, ref } from "vue";

defineProps(["dataList"]);
const maxHeight = ref(400);
const rowDatas = ref([]);

const columns = ref([]);

const onSelectionChange = (rows) => (rowDatas.value = rows);

const initCols = () => {
  const columnData: TableColumnList[] = [
    { label: "大分类", prop: "firstLevel" },
    { label: "小分类", prop: "secondLevel" },
    { label: "属性编号", prop: "propertyCode" },
    { label: "属性值类型", prop: "propertyType" },
    { label: "枚举编码", prop: "enumCode" },
    { label: "枚举名称", prop: "enumName" }
  ];
  columns.value = setColumn({ columnData, operationColumn: false, radioColumn: { hide: true }, selectionColumn: { hide: false } });
};

onMounted(() => {
  initCols();
});

defineExpose({ rowDatas });
</script>
