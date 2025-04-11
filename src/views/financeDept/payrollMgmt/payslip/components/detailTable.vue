<template>
  <pure-table
    border
    :height="645"
    :max-height="645"
    :row-style="rowStyle"
    row-key="id"
    :adaptive="true"
    align-whole="left"
    size="small"
    :data="templateList"
    :columns="columns"
    highlight-current-row
    :show-overflow-tooltip="true"
  />
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { fetchMoneyTemplateList, queryPayslipData } from "@/api/oaManage/financeDept";
import dayjs from "dayjs";
import { getFormatDate_XLSX } from "@/utils/common";
import { setColumn, tableEditRender } from "@/utils/table";

const route = useRoute();
const templateList = ref([]);
const dataInfo: any = ref({});
const joinedDateKey = ref("");
const columns = ref([]);

const getTemplateList = () => {
  fetchMoneyTemplateList({ templateNo: route.query.gzmbNo, templateType: "pcShow" }).then((res: any) => {
    if (res.data) {
      templateList.value = res.data.map((item) => ({ ...item, FieldValue: dataInfo.value[item.fieldName], readonly: true }));
      const RZRQ_KEY = res.data.find((item) => item.fieldTitle === "入职日期")?.fieldName;
      joinedDateKey.value = RZRQ_KEY;
    }
  });
};

const getMoneyInfo = () => {
  const { gzmbNo, payslipId } = route.query;
  queryPayslipData({ gzmbNo, payslipId }).then((res: any) => {
    if (res.data) {
      const result = res.data || {};
      if (/^[0-9]*$/.test(result[joinedDateKey.value])) {
        result[joinedDateKey.value] = dayjs(getFormatDate_XLSX(result[joinedDateKey.value])).format("YYYY-MM-DD");
      }
      dataInfo.value = result;
      // 获取模板
      getTemplateList();
    }
  });
};

const rowStyle = ({ row }) => {
  if (/(status|staffId|staffName|yearMonth)/.test(row.fieldName)) return { background: "#ffc107" };
};

const getConfig = () => {
  const tableCellRender = tableEditRender();
  const resRender = (data) =>
    tableCellRender.editCellRender({ data, isEdit: !/(status|staffId|staffName|yearMonth)/.test(data.row.fieldName) && dataInfo.value.statusValue === "1" });
  const columnData: TableColumnList[] = [
    { label: "项目", prop: "fieldTitle", width: 280 },
    { label: "项目结果", prop: "FieldValue", width: 280, cellRenderer: resRender }
  ];

  columns.value = setColumn({ columnData, operationColumn: false });
};

onMounted(() => {
  // 获取数据
  getMoneyInfo();
  getConfig();
});

defineExpose({ templateList, getMoneyInfo });
</script>

<style scoped lang="scss">
.warning-row {
  background: #ffc107;
}
</style>
