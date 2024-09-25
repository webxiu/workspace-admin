<script setup lang="tsx">
import { ref, onMounted } from "vue";
import { RendererType, setColumn } from "@/utils/table";
import { PureTableBar } from "@/components/RePureTableBar";
import { DeptStatisticsItemType, JobLevelStatisticsItemType, statisticsPeopleDetail, StatisticsPeopleDetailItemType } from "@/api/oaManage/humanResources";
import { message } from "@/utils/message";
import SearchList from "@/components/SearchList/index.vue";

export type StatisticsType = "deptId" | "rank";
interface Props {
  type: StatisticsType;
  data: DeptStatisticsItemType & JobLevelStatisticsItemType;
}

const props = defineProps<Props>();

const maxHeight = 300;
const loading = ref<boolean>(false);
const columns = ref<TableColumnList[]>([]);
const dataList = ref<StatisticsPeopleDetailItemType[]>([]);

onMounted(() => {
  getColumnConfig();
  getTableList();
});

const getColumnConfig = () => {
  const cellRenderer: RendererType = ({ row, column }) => <span v-html={row[column["property"]]} />;
  const columnData: TableColumnList[] = [
    { label: "工号", prop: "staffCode", minWidth: 100, cellRenderer },
    { label: "姓名", prop: "staffName", minWidth: 100, cellRenderer },
    { label: "部门", prop: "deptName", minWidth: 80, cellRenderer },
    { label: "入职日期", prop: "startDate", minWidth: 160, align: "center", cellRenderer }
  ];
  columns.value = setColumn({ columnData, operationColumn: { hide: true } });
};

const getTableList = () => {
  const { type, data } = props;
  let value = data.rank as any;
  let isExtra = undefined;
  if (type === "deptId") {
    value = data.deptId;
    isExtra = data.deptName.includes("编外") ? 1 : 0;
  }
  if (!value) return message("数据ID不存在", { type: "error" });
  loading.value = true;
  statisticsPeopleDetail({ [props.type]: value, isExtra })
    .then(({ data }) => {
      loading.value = false;
      dataList.value = data || [];
    })
    .catch(() => (loading.value = false));
};
</script>

<template>
  <PureTableBar :columns="columns" :showIcon="false">
    <template #title>
      <SearchList v-model="dataList" :bright="true" style="width: 40%" label="搜索" :propKeys="['staffCode', 'staffName', 'deptName', 'startDate']" />
    </template>
    <template v-slot="{ size, dynamicColumns }">
      <pure-table
        border
        :height="maxHeight"
        :max-height="maxHeight"
        row-key="id"
        :adaptive="true"
        align-whole="center"
        :loading="loading"
        :size="size"
        :data="dataList"
        :columns="dynamicColumns"
        highlight-current-row
        :show-overflow-tooltip="true"
      />
    </template>
  </PureTableBar>
</template>
