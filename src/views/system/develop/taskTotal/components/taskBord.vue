<template>
  <div>
    <pure-table
      border
      :height="maxHeight"
      :max-height="maxHeight"
      row-key="id"
      :adaptive="true"
      align-whole="left"
      size="small"
      :data="dataList"
      :columns="columns"
      :show-overflow-tooltip="true"
      highlight-current-row
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { setColumn } from "@/utils/table";
import { useEleHeight } from "@/hooks";
import { getTaskBoardData } from "@/api/systemManage";

const columns = ref([]);
const dataList = ref([]);
const maxHeight = useEleHeight(".app-main > .el-scrollbar", 90);
const props = defineProps(["searchDate"]);

const getConfig = async () => {
  const [iYear, iMonth] = props.searchDate.split("-");
  const result: any = await getTaskBoardData({ iYear, iMonth: +iMonth });
  const data = result.data;
  if (data && data.length) {
    const columnData = [];

    const keys = Object.keys(data[0]).sort();

    const unicodeChar = keys.find((el) => isNaN(+el));
    keys.unshift(unicodeChar);
    keys.pop();

    keys.forEach((el) => columnData.push({ label: el, prop: el, align: el !== "工程师" ? "right" : "left", width: 62 }));

    columns.value = setColumn({ columnData, operationColumn: false });

    dataList.value = data as any;
  }
};

watch(
  () => props.searchDate,
  () => {
    getConfig();
  },
  { immediate: true }
);
</script>
