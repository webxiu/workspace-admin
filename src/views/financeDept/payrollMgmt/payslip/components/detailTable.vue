<template>
  <el-table :data="templateList" style="width: 100%; height: calc(100vh - 265px)" :row-style="rowStyle" @cell-dblclick="dbclickAct">
    <el-table-column prop="numberNo" label="序号" align="center" width="60" />
    <el-table-column prop="fieldTitle" label="项目" width="280" />
    <el-table-column prop="result" label="项目结果" width="280">
      <template #default="{ row }">
        <el-input
          v-if="!row.readonly && curRowIdx === row.numberNo - 1"
          v-model="row.FieldValue"
          @blur="
            row.readonly = true;
            dataInfo[row.fieldName] = row.FieldValue;
          "
        />
        <span v-else>{{ dataInfo[row.fieldName] }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { fetchMoneyTemplateList, fetchPayslipDataList } from "@/api/oaManage/financeDept";
import dayjs from "dayjs";
import { getFormatDate_XLSX } from "@/utils/common";

const route = useRoute();
const templateList = ref([]);
const dataInfo = ref({});
const joinedDateKey = ref("");
const curColProp = ref("");
const curRowIdx = ref();

const getTemplateList = () => {
  fetchMoneyTemplateList({ templateNo: route.query.gzmbNo, templateType: "pcshow" }).then((res: any) => {
    if (res.data) {
      templateList.value = res.data.map((item) => ({ ...item, FieldValue: dataInfo.value[item.fieldName], readonly: true }));
      const RZRQ_KEY = res.data.find((item) => item.fieldTitle === "入职日期")?.fieldName;
      joinedDateKey.value = RZRQ_KEY;
    }
  });
};

const getMoneyInfo = () => {
  const { gzDate, gzmbNo, gzmbb, payslipId } = route.query;
  fetchPayslipDataList({ gzDate, gzmbNo, gzmbb, payslipId, needGetId: false }).then((res) => {
    if (res.data) {
      const result = res.data[0] || {};

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
  if (/(Status|OrderNo|Name|KeyIn|InDate|YearMonth|IsEncry|SheetName)/.test(row.fieldName)) return { background: "#ffc107" };
};

const dbclickAct = (row, column) => {
  curColProp.value = column.property;
  curRowIdx.value = row.numberNo - 1;
  if (row.allowEdit === "是") {
    row.readonly = false;
  }
};

onMounted(() => {
  // 获取数据
  getMoneyInfo();
});

defineExpose({ templateList, getMoneyInfo });
</script>

<style scoped lang="scss">
.warning-row {
  background: #ffc107;
}
</style>
