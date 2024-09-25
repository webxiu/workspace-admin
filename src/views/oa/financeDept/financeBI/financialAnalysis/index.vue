<script setup lang="ts">
import { fetchExceptionTimeList, getCostAnalysisData, updateExceptionTimeList } from "@/api/oaManage/financeDept";
import { downloadDataToExcel, getMenuColumns, updateButtonList } from "@/utils/table";
import { cloneDeep } from "@pureadmin/utils";
import dayjs from "dayjs";
import { ElMessage } from "element-plus";
import { onMounted, ref } from "vue";
import CompareTable from "./components/compareTable.vue";
import Duration from "./components/duration.vue";
import MakeFree from "./components/makeFree.vue";
import NetProfits from "./components/netProfit.vue";
import SaleTable from "./components/saleTable.vue";
import UserFree from "./components/userFree.vue";
import UserNotZero from "./components/userNotZero.vue";
import { Download } from "@element-plus/icons-vue";

defineOptions({ name: "OaFinanceDeptFinanceBIFinancialAnalysisIndex" });

const activeName = ref("duration");
const chartDataInfo = ref([]);
const durationRef = ref();
const makeRef = ref();
const netProfitsRef = ref();
const saleTableRef = ref();
const productPercentRef = ref();
const userNotZeroRef = ref();
const userMoneyRef = ref();
const loading = ref(false);
const loading1 = ref(false);
const saveLoading = ref(false);
const currentExportFileName = ref("期间费用");
const exportConfigMap = {
  duration: [],
  makeFree: [],
  netProfits: [],
  saleTable: [],
  compareTable: [],
  userNotZero: [],
  userFree: []
};

const handleClick = (v) => {
  currentExportFileName.value = v.props.label;
  activeName.value = v.paneName;
};

const setRowData = (row, index) => {
  row.totalMoney = +(row.price * row.abnormalTime + +row.elseMoney).toFixed(2);
};

const selectYear = ref(dayjs(new Date()).format("YYYY"));
const selectTopYear = ref(dayjs(new Date()).format("YYYY"));
const dialogTableVisible = ref(false);
const gridData = ref([]);

const getChartData = async () => {
  loading1.value = true;
  const { columnArrs } = await getMenuColumns();
  const [resCols] = columnArrs;
  getCostAnalysisData({ year: selectYear.value })
    .then((res: any) => {
      if (res.data) {
        chartDataInfo.value = res.data;
        const filterList = res.data.filter((item) => ["销售费用", "管理费用", "研发费用", "财务费用"].includes(item.ItemName));
        durationRef.value?.setDataList({ list: filterList, resCols });
        exportConfigMap["duration"] = filterList;

        const makeList = res.data.filter((item) => item.ItemName === "制造费用");
        makeRef.value?.setDataList({ list: makeList, resCols });
        exportConfigMap["makeFree"] = makeList;

        const netProfitList = res.data.filter((item) => ["净利润", "净利润率", "人工占销售收入比例", "毛利率"].includes(item.ItemName));
        netProfitsRef.value?.setDataList({ list: netProfitList, resCols });
        exportConfigMap["netProfits"] = netProfitList;

        const saleTableList = res.data.filter((item) => ["销售出库数量", "销售金额", "生产数量"].includes(item.ItemName));
        saleTableRef.value?.setDataList({ list: saleTableList, resCols });
        exportConfigMap["saleTable"] = saleTableList;

        const productPercentList = res.data.filter((item) => item.ItemName === "成本损耗比例");
        productPercentRef.value?.setDataList({ list: productPercentList, resCols });
        exportConfigMap["compareTable"] = productPercentList;

        const userNotZeroList = res.data.filter((item) => item.ItemName === "产品平均工资不含017");
        userNotZeroRef.value?.setDataList({ list: userNotZeroList, resCols });
        exportConfigMap["userNotZero"] = userNotZeroList;

        const userMoneyList = res.data.filter((item) => item.ItemName === "产品平均工资");
        userMoneyRef.value?.setDataList({ list: userMoneyList, resCols });
        exportConfigMap["userFree"] = userMoneyList;
      }
    })
    .finally(() => (loading1.value = false));
};

const changeYear = (v) => {
  selectYear.value = v;
  getChartData();
};

const changeTopYear = (v) => {
  selectTopYear.value = v;
  fetchList();
};

const onExport = () => {
  const currentExportList = exportConfigMap[activeName.value];
  // 构造导出columns
  const restMonthColumns = [];
  const calcColumns = Object.keys(cloneDeep(currentExportList[0])).filter((item) => item.startsWith("m") && item.length <= 3);
  calcColumns.forEach((item) => {
    restMonthColumns.push({
      label: `${item.split("m")[1]}月`,
      prop: `${item}`
    });
  });
  const sortCols = restMonthColumns.sort((a, b) => {
    return a.prop.split("m")[1] - b.prop.split("m")[1];
  });
  console.log(sortCols, "sortCols====");
  const exportColumns = [{ label: "年份", prop: "FYear" }, { label: "数据类型", prop: "ItemName" }, ...sortCols, { label: "平均", prop: "AVERAGE" }];
  console.log(exportColumns, "exportColumns===");

  downloadDataToExcel({
    dataList: currentExportList,
    columns: exportColumns,
    sheetName: currentExportFileName.value + "明细"
  });
};

const fetchList = () => {
  loading.value = true;
  fetchExceptionTimeList({ year: selectTopYear.value })
    .then((res: any) => {
      if (res.data) {
        gridData.value = res.data.map((item) => ({ ...item, editTime: false, editPrice: false, editOther: false }));
      }
    })
    .finally(() => (loading.value = false));
};

const exceptionTime = () => {
  dialogTableVisible.value = true;
  fetchList();
};

const cellDbClick = (row, column) => {
  if (column.property === "abnormalTime") row.editTime = true;
  if (column.property === "price") row.editPrice = true;
  if (column.property === "elseMoney") row.editOther = true;
};

const onSave = () => {
  saveLoading.value = true;
  const sendList = cloneDeep(gridData.value).map((item) => {
    const result = { ...item, abnormalTime: +item.abnormalTime, elseMoney: +item.elseMoney, price: +item.price };
    delete result.editTime;
    delete result.editPrice;
    delete result.editOther;
    return result;
  });

  updateExceptionTimeList({ list: sendList, yearDate: +selectTopYear.value })
    .then((res) => {
      dialogTableVisible.value = false;
      if (res.data) ElMessage({ message: "操作成功", type: "success" });
    })
    .finally(() => (saveLoading.value = false));
};

const getColumnConfig = async () => {
  const { buttonArrs } = await getMenuColumns();
  updateButtonList(buttonList, buttonArrs[0]);
};

const buttonList = ref<ButtonItemType[]>([
  { clickHandler: exceptionTime, type: "danger", text: "异常工时", icon: Download, isDropDown: false },
  { clickHandler: onExport, type: "default", text: "导出", icon: Download, isDropDown: false }
]);

onMounted(() => {
  getColumnConfig();
  getChartData();
});
</script>

<template>
  <div v-loading="loading1">
    <div class="top-tool flex">
      <el-date-picker @change="changeYear" v-model="selectYear" type="year" value-format="YYYY" placeholder="选择年份" :clearable="false" />
      <ButtonList :buttonList="buttonList" :auto-layout="false" />
    </div>
    <div class="pane-outer">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="期间费用" name="duration"><Duration ref="durationRef" /></el-tab-pane>
        <el-tab-pane label="制造费用" name="makeFree"><MakeFree ref="makeRef" /></el-tab-pane>
        <el-tab-pane label="净利润" name="netProfits"><NetProfits ref="netProfitsRef" /></el-tab-pane>
        <el-tab-pane label="销售表" name="saleTable"><SaleTable ref="saleTableRef" /></el-tab-pane>
        <el-tab-pane label="总成本比较表" name="compareTable"><CompareTable ref="productPercentRef" /></el-tab-pane>
        <el-tab-pane label="人工 不含017" name="userNotZero"><UserNotZero ref="userNotZeroRef" /></el-tab-pane>
        <el-tab-pane label="人工" name="userFree"><UserFree ref="userMoneyRef" /></el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog destroy-on-close draggable v-model="dialogTableVisible" title="异常工时总金额" width="900">
      <div style="margin: 12px 0">
        <el-date-picker @change="changeTopYear" v-model="selectTopYear" type="year" value-format="YYYY" placeholder="选择年份" :clearable="false" />
      </div>
      <el-table @cell-dblclick="cellDbClick" :data="gridData" v-loading="loading" style="height: 400px">
        <el-table-column property="yearDate" label="年份" width="80" align="right" />
        <el-table-column property="monthData" label="月份" width="60" align="right" />
        <el-table-column property="abnormalTime" label="异常工时" align="right">
          <template #default="{ row, index }">
            <el-input
              v-if="row.editTime"
              v-model="row.abnormalTime"
              @blur="
                row.editTime = false;
                setRowData(row, index);
              "
            />
            <span v-else>{{ row.abnormalTime }}</span>
          </template>
        </el-table-column>
        <el-table-column property="price" label="工时单价" align="right">
          <template #default="{ row, index }">
            <el-input
              v-if="row.editPrice"
              v-model="row.price"
              @blur="
                row.editPrice = false;
                setRowData(row, index);
              "
            />
            <span v-else>{{ row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column property="excepMoneyTotal" label="异常工时金额" align="right">
          <template #default="{ row }">
            {{ (row.price * row.abnormalTime).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column property="elseMoney" label="其他工时金额" align="right">
          <template #default="{ row, index }">
            <el-input
              v-if="row.editOther"
              v-model="row.elseMoney"
              @blur="
                row.editOther = false;
                setRowData(row, index);
              "
            />
            <span v-else>{{ row.elseMoney }}</span>
          </template>
        </el-table-column>
        <el-table-column property="totalMoney" label="总金额" align="right">
          <template #default="{ row }">
            {{ (row.price * row.abnormalTime + +row.elseMoney).toFixed(2) }}
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <div>
          <el-space :size="16">
            <el-button @click="dialogTableVisible = false">关闭</el-button>
            <el-button type="primary" :loading="saveLoading" @click="onSave">保存</el-button>
          </el-space>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.pane-outer {
  margin-top: 8px;
}
</style>
