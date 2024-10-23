<template>
  <div class="page" ref="printRef" v-loading="loading">
    <div class="item-info" v-for="item in dataList" :key="item.Id">
      <h3 class="pay-info-title">{{ fmtDate(gzDate, "dateMonth") }}{{ getUserName(item) }}工资条明细</h3>
      <el-table :data="templateList" style="width: 100%" size="small" class="payslip-table">
        <el-table-column type="index" label="序号" align="center" width="120" />
        <el-table-column prop="fieldTitle" label="项目" width="200" />
        <el-table-column prop="result" label="项目结果">
          <template #default="{ row }">
            <span v-if="['RZRQ'].includes(row.fieldName)">{{ fmtDate(item[row.fieldName], "date") }} </span>
            <span v-else-if="['signTime'].includes(row.fieldName)">{{ fmtDate(item.InDate || item[row.fieldName]) }} </span>
            <span v-else>{{ item[row.fieldName] }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="sign-user">
        <template v-if="item.signatureFilePath">
          <el-image style="height: 80px" :src="getImageUrl(item)" :preview-src-list="[getImageUrl(item)]" fit="contain" class="border-line" />
          <div class="show-time">签名时间：{{ item.InDate }}</div>
        </template>
        <div v-else class="empty">暂无签名信息~</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { ref, watch, reactive } from "vue";
import dayjs from "dayjs";
import Print from "@/utils/print";
import { getFormatDate_XLSX } from "@/utils/common";
import { getMoneySignImages, qywxFetchMoneyTemplateList, fetchPayslipDataList, PayslipDataItemType } from "@/api/oaManage/financeDept";

interface Props {
  payslipIdList: string[];
  gzmbNo: string;
  gzmbb: string;
  gzDate: string;
}
const props = defineProps<Partial<Props>>();
const baseApi = import.meta.env.VITE_BASE_API;

const printRef = ref();
const loading = ref(false);
const dataList = ref<PayslipDataItemType[]>([]);
const templateList = ref([]);

watch(props, () => getTemplateList(), { immediate: true });

// 获取模板
function getTemplateList() {
  loading.value = true;
  qywxFetchMoneyTemplateList({ isApp: true, templateNo: props.gzmbNo }).then(({ data }) => {
    if (data) {
      templateList.value = data.filter((item) => item.appShow === "是");
      getMoneyInfo();
    }
  });
}

// 获取值数据
function getMoneyInfo() {
  const { gzDate, gzmbNo, gzmbb, payslipIdList } = props;
  fetchPayslipDataList({ gzDate, gzmbNo, gzmbb, payslipIdList, needGetId: false })
    .then(({ data }) => {
      dataList.value = data || [];
      loading.value = false;
    })
    .catch(() => (loading.value = false));
}

// 获取姓名
function getUserName(item) {
  const prop = templateList.value.find(({ fieldTitle }) => fieldTitle === "姓名")?.fieldName || "";
  return item[prop];
}

// 组合签名图片url
function getImageUrl(item) {
  // const hasDot = item.Image1?.includes(",");
  // return hasDot ? item.Image1 + item?.Image2 : item.Image1 + "," + item?.Image2;

  return baseApi + item.signatureFilePath;
}
// 组合签名图片url
function fmtDate(time: string, fmt = "dateTime") {
  const fmtObj = {
    dateMonth: "YYYY年MM月",
    date: "YYYY-MM-MM",
    dateTime: "YYYY-MM-MM HH:mm:ss"
  };
  return dayjs(time).format(fmtObj[fmt]);
}

const onPrint = () => {
  if (printRef.value) {
    Print(printRef.value);
  }
};

defineExpose({ onPrint });
</script>

<style lang="scss" scoped>
@media print {
  @page {
    size: a4 portrait;
    margin: 10mm;
  }

  table {
    page-break-inside: avoid;
  }

  tr {
    page-break-inside: avoid;
    page-break-after: avoid;
  }

  thead {
    display: table-header-group;
  }

  tbody {
    display: table-row-group;
  }

  .item-info {
    page-break-after: always;
    width: 100%;
    margin-bottom: 0 !important;
    border: none !important;
  }
}

.item-info {
  padding: 20px 0 30px;
  margin-bottom: 40px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.pay-info-title {
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 700;
  text-align: center;
}

:deep(.payslip-table .el-table__cell .cell) {
  line-height: 20px;
  font-size: 12px;
}
.sign-user {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  margin-top: 10px;
  padding-right: 20px;
  box-sizing: border-box;
  .show-time {
    margin-left: 20px;
    align-self: end;
    font-size: 12px;
  }
  .empty {
    text-align: center;
    flex: 1;
  }
}
</style>
