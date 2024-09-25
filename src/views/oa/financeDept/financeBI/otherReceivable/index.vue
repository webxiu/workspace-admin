<script setup lang="ts">
import { fetchOtherReceiveMoneyList } from "@/api/oaManage/financeDept";
import { useEleHeight } from "@/hooks";
import { fixed2AndAddcomma } from "@/utils/common";
import { downloadDataToExcel, getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import dayjs from "dayjs";
import { ref, onMounted } from "vue";

defineOptions({ name: "OaFinanceDeptFinanceBIOtherReceivableIndex" });
const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49);

const initDay = dayjs().add(-1, "month").startOf("month").format("YYYY-MM");
const date = ref(initDay + "-15");

const tableData: any = ref([]);
const loading = ref(false);

interface ColumnsDataType {
  label: string;
  prop: string;
  width?: number;
}

const columns = ref<ColumnsDataType[]>([
  { label: "核算维度", prop: "FNAME", width: 400 },
  { label: "余额", prop: "FEndBalance" }
]);

const changeDate = (v) => {
  if (!v) return;
  date.value = dayjs(v).format("YYYY-MM-DD");

  const sendDate = dayjs(v).format("YYYY-MM-DD").split("-");
  sendDate[2] = "15";
  getList(sendDate.join("-"));
};

const getList = (date) => {
  loading.value = true;
  fetchOtherReceiveMoneyList({ date })
    .then((res) => {
      if (res.data) tableData.value = res.data;
    })
    .finally(() => (loading.value = false));
};

const getSummaries = (param) => {
  const { columns, data } = param;
  const sums = [];
  columns.forEach((column, index) => {
    // 第一列 显示文字 小计
    if (index === 0) {
      sums[index] = "合计";
      return;
    }
    if (index === 3) {
      const values = data.map((item) => Number(item[column.property]));
      if (!values.every((value) => isNaN(value))) {
        sums[index] = values.reduce((prev, curr) => {
          const value = Number(curr);
          if (!isNaN(value)) {
            return prev + curr;
          } else {
            return prev;
          }
        }, 0);
        sums[index] = fixed2AndAddcomma(+sums[index].toFixed(2)); // 保留2位小数，解决小数列合计精度缺失的问题
      } else {
        sums[index] = ""; // 其余列一律不进行合计，结果输出空
      }
    }
  });
  return sums;
};

// 导出
const onExport = () => {
  if (!tableData.value.length) return;
  downloadDataToExcel({
    dataList: tableData.value,
    columns: columns.value,
    sheetName: "其他应收款明细表"
  });
};

const initCols = async () => {
  const { columnArrs, buttonArrs } = await getMenuColumns();
  const [columnData] = columnArrs;
  updateButtonList(buttonList, buttonArrs[0]);
  if (columnData?.length) {
    columns.value = setColumn({ columnData, operationColumn: { hide: true }, radioColumn: { width: 50, hide: false } });
  }
};

const buttonList = ref<ButtonItemType[]>([{ clickHandler: onExport, type: "primary", text: "导出", isDropDown: false }]);

onMounted(() => {
  initCols();
  getList(date.value);
});
</script>

<template>
  <div class="prepayment">
    <div class="search-day flex">
      <el-date-picker v-model="date" type="month" placeholder="选择年月" @change="changeDate" />
      <ButtonList :buttonList="buttonList" :auto-layout="false" />
    </div>
    <div class="table-data">
      <pure-table
        border
        :summary-method="getSummaries"
        show-summary
        :height="maxHeight"
        :max-height="maxHeight"
        row-key="id"
        class="bill-manage"
        :adaptive="true"
        align-whole="left"
        :loading="loading"
        size="small"
        :data="tableData"
        :columns="columns"
        highlight-current-row
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.prepayment {
  .search-day {
    margin-bottom: 16px;
  }
}
</style>
