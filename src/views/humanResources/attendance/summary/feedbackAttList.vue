<template>
  <div>
    <pure-table
      border
      ref="tableRef"
      :height="maxHeight"
      :max-height="maxHeight"
      row-key="id"
      class="attendance-summary"
      :adaptive="true"
      align-whole="center"
      size="small"
      :data="dataList"
      :columns="columns"
      highlight-current-row
      :show-overflow-tooltip="true"
    />
  </div>
</template>

<script setup lang="tsx">
import { setColumn } from "@/utils/table";
import dayjs from "dayjs";
import { onMounted, ref } from "vue";

const maxHeight = ref(300);
const dataList = ref([]);

const columns = ref([]);

const getConfig = () => {
  const columnData: TableColumnList[] = [
    { label: "反馈人", prop: "createUserName" },
    { label: "反馈内容", prop: "content" },
    {
      label: "反馈时间",
      prop: "createDate",
      cellRenderer(data) {
        return <span>{dayjs(data.row.createDate).format("YYYY-MM-DD HH:mm:ss")}</span>;
      }
    }
  ];
  columns.value = setColumn({ columnData, operationColumn: false });
};

onMounted(() => {
  getConfig();
});

defineExpose({ dataList });
</script>

<style scoped></style>
