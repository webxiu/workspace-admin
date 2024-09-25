<script setup lang="ts">
import { fetchRecievePayMoneyList } from "@/api/oaManage/financeDept";
import { useEleHeight } from "@/hooks";
import { fixed2AndAddcomma } from "@/utils/common";
import { downloadDataToExcel, getMenuColumns, setColumn, onHeaderDragend, updateButtonList } from "@/utils/table";
import dayjs from "dayjs";
import { ref, onMounted } from "vue";

defineOptions({ name: "OaFinanceDeptFinanceBIReceivableIndex" });

const initDay = dayjs().add(-1, "month").startOf("month").format("YYYY-MM");
const date = ref(initDay + "-15");
const activeName = ref(1);

const tableData: any = ref([]);
const loading = ref(false);

const columns = ref([]);

const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49 + 60);

interface ColumnsDataType {
  label: string;
  prop: string;
  width?: number;
}

const getColumns = (valueType) => {
  const moneyWay = {
    1: "USD",
    2: "RMB",
    3: "EUR"
  };
  const colList: ColumnsDataType[] = [
    { label: "客户名称", prop: "FNAME", width: 400 },
    { label: `期初余额(${moneyWay[valueType]})`, prop: "FBeginBalance" },
    { label: `应收(${moneyWay[valueType]})`, prop: "FDEBIT" },
    { label: `收款(${moneyWay[valueType]})`, prop: "FCREDIT" },
    { label: `期末余额(${moneyWay[valueType]})`, prop: "FEndBalance" }
  ];

  return colList;
};

const changeDate = (v) => {
  if (!v) return;
  date.value = dayjs(v).format("YYYY-MM-DD");
  const sendDate = dayjs(v).format("YYYY-MM-DD").split("-");
  sendDate[2] = "15";
  getList(sendDate.join("-"));
};

const getList = (date) => {
  loading.value = true;
  fetchRecievePayMoneyList({ date })
    .then((res: any) => {
      if (res.data) tableData.value = res.data.filter((item) => item.tableType == activeName.value);
    })
    .finally(() => (loading.value = false));
};

const handleClick = ({ paneName }) => {
  activeName.value = paneName;
  initCols();
  getList(date.value);
};

// 导出
const onExport = () => {
  if (!tableData.value.length) return;
  downloadDataToExcel({
    dataList: tableData.value,
    columns: getColumns(activeName.value),
    sheetName: "应收账款明细表"
  });
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
    if (/(3|4|5|6)/.test(index)) {
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

const initCols = async () => {
  const moneyWay = {
    1: "USD",
    2: "RMB",
    3: "EUR"
  };
  const { columnArrs, buttonArrs } = await getMenuColumns();
  const [menuCols] = columnArrs;
  updateButtonList(buttonList, buttonArrs[0]);
  if (menuCols?.length) {
    const columnData = menuCols.map((item) => {
      if (/(FBeginBalance|FDEBIT|FCREDIT|FEndBalance)/.test(item.prop as string)) {
        item.label = item.label + `(${moneyWay[activeName.value]})`;
      }
      return item;
    });

    columns.value = setColumn({ columnData, operationColumn: { hide: true }, radioColumn: { width: 50, hide: false } });
  } else {
    columns.value = getColumns(activeName.value);
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
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="美元账户" :name="1" />
        <el-tab-pane label="人民币账户" :name="2" />
        <el-tab-pane label="欧元账户" :name="3" />
      </el-tabs>
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
        @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
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
