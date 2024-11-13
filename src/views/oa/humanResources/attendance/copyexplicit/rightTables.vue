<template>
  <div class="right-outer">
    <div class="table-item1">
      <div class="label-top">请假记录</div>
      <pure-table
        border
        :height="maxHeight"
        :max-height="maxHeight"
        row-key="id"
        :adaptive="true"
        align-whole="center"
        size="small"
        :data="dataList1"
        :columns="columns1"
        highlight-current-row
      />
    </div>
    <div class="table-item">
      <div class="label-top">加班记录</div>
      <pure-table
        border
        :height="maxHeight"
        :max-height="maxHeight"
        row-key="id"
        :adaptive="true"
        align-whole="center"
        size="small"
        :data="dataList2"
        :columns="columns2"
        highlight-current-row
      />
    </div>
    <div class="table-item">
      <div class="label-top">外出记录</div>
      <pure-table
        border
        :height="maxHeight"
        :max-height="maxHeight"
        row-key="id"
        :adaptive="true"
        align-whole="center"
        :show-overflow-tooltip="true"
        size="small"
        :data="dataList3"
        :columns="columns3"
        highlight-current-row
      />
    </div>
    <div class="table-item">
      <div class="label-top">打卡记录</div>
      <pure-table
        border
        :height="150"
        :max-height="150"
        row-key="id"
        :adaptive="true"
        align-whole="center"
        size="small"
        :data="dataList5"
        :columns="columns5"
        highlight-current-row
      />
    </div>
    <div class="table-item">
      <div class="label-top">补卡记录</div>
      <pure-table
        border
        :height="maxHeight"
        :max-height="maxHeight"
        row-key="id"
        :adaptive="true"
        align-whole="center"
        size="small"
        :data="dataList4"
        :columns="columns4"
        highlight-current-row
      />
    </div>
  </div>
</template>

<script setup lang="tsx">
import { setColumn } from "@/utils/table";
import dayjs from "dayjs";
import { onMounted, ref } from "vue";

const maxHeight = ref(84);
const dataList1 = ref([]);
const dataList2 = ref([]);
const dataList3 = ref([]);
const dataList4 = ref([]);
const dataList5 = ref([]);
const columns1 = ref<TableColumnList[]>([]);
const columns2 = ref<TableColumnList[]>([]);
const columns3 = ref<TableColumnList[]>([]);
const columns4 = ref<TableColumnList[]>([]);
const columns5 = ref<TableColumnList[]>([]);

const getConfig = () => {
  const columns1Data = [
    { label: "请假时长", prop: "hours" },
    { label: "开始时间", prop: "startTime" },
    { label: "结束时间", prop: "endTime" }
  ];
  const columns2Data = [
    { label: "加班时长", prop: "hours" },
    { label: "开始时间", prop: "startTime" },
    { label: "结束时间", prop: "endTime" }
  ];
  const columns3Data = [
    { label: "目地的", prop: "destination" },
    { label: "预计外出时间", prop: "planOutDate" },
    { label: "预计返回时间", prop: "planBackDate" }
  ];
  const columns4Data = [{ label: "补卡时间", prop: "reissueDate" }];
  const columns5Data: TableColumnList[] = [
    { label: "考勤机", prop: "attMachineName" },
    {
      label: "打卡时间",
      prop: "attTime",
      cellRenderer(data) {
        return <span>{dayjs(data.row.attTime).format("YYYY-MM-DD HH:mm:ss")}</span>;
      }
    }
  ];

  columns1.value = columns1Data;
  columns2.value = columns2Data;
  columns3.value = columns3Data;
  columns4.value = columns4Data;
  columns5.value = columns5Data;
};

onMounted(() => {
  getConfig();
});

defineExpose({ dataList1, dataList2, dataList3, dataList4, dataList5 });
</script>

<style lang="scss" scoped>
.right-outer {
  .table-item {
    margin: 8px 0;
  }

  .label-top {
    font-size: 13px;
    font-weight: 600;
  }
}
</style>
