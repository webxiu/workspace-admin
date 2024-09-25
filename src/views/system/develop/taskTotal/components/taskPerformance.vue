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
import { onMounted, ref, watch } from "vue";
import { getMenuColumns, setColumn } from "@/utils/table";
import { useEleHeight } from "@/hooks";
import { getTaskPerformanceData } from "@/api/systemManage";

const columns = ref([]);
const dataList = ref([]);
const maxHeight = useEleHeight(".app-main > .el-scrollbar", 90);
const props = defineProps(["searchDate"]);

const getDataList = () => {
  const [iYear, iMonth] = props.searchDate.split("-");
  getTaskPerformanceData({ iYear, iMonth: +iMonth }).then((res: any) => {
    if (res.data) {
      dataList.value = res.data;
    }
  });
};

const getConfig = async () => {
  const { columnArrs } = await getMenuColumns();

  if (columnArrs[0].length) {
    columns.value = setColumn({ columnData: columnArrs[0], operationColumn: false });
  }
};

watch(
  () => props.searchDate,
  () => {
    getDataList();
  },
  { immediate: true }
);

onMounted(() => {
  getConfig();
});
</script>
