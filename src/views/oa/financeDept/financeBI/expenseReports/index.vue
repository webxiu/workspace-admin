<template>
  <div class="free-detail" v-loading="loading">
    <div style="display: flex; margin-bottom: 16px">
      <el-date-picker @change="changeDate" value-format="YYYY-M" v-model="date" type="month" placeholder="选择年月" />
      <ButtonList :buttonList="buttonList" :auto-layout="false" />
    </div>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick" type="card">
      <el-tab-pane label="销售费用" name="sale"><Sale ref="saleRef" /></el-tab-pane>
      <el-tab-pane label="管理费用" name="mgmt"><Management ref="mgmtRef" /></el-tab-pane>
      <el-tab-pane label="研发费用" name="dev"><Develop ref="devRef" /></el-tab-pane>
      <el-tab-pane label="财务费用" name="fin"><Finace ref="finRef" /></el-tab-pane>
      <el-tab-pane label="制造费用" name="make"><Manufact ref="makeRef" /></el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts" setup>
import { fetchFreeBIList } from "@/api/oaManage/financeDept";
import { downloadDataToExcel, getMenuColumns, updateButtonList } from "@/utils/table";
import { cloneDeep } from "@pureadmin/utils";
import dayjs from "dayjs";
import { onMounted, reactive, ref } from "vue";
import Develop from "./components/development/index.vue";
import Finace from "./components/finance/index.vue";
import Management from "./components/manage/index.vue";
import Manufact from "./components/manufacture/index.vue";
import Sale from "./components/sale/index.vue";

import { Download } from "@element-plus/icons-vue";

defineOptions({ name: "OaFinanceDeptFinanceBIExpenseReportsIndex" });

const activeName = ref("sale");
const date = ref(dayjs(new Date()).format("YYYY-M"));
const dataList: any = ref([]);
const saleRef = ref();
const mgmtRef = ref();
const devRef = ref();
const finRef = ref();
const makeRef = ref();
const loading = ref(false);
const exportListMap = reactive({
  sale: [],
  mgmt: [],
  dev: [],
  fin: [],
  make: []
});

const changeDate = (v) => {
  date.value = v;
  fetchFreeList();
};

const onExport = () => {
  const list = exportListMap[activeName.value];
  const initCol = [
    { label: "序号", type: "index" },
    { label: "项目明细(单位：元)", prop: "ItemNameDetail" }
  ];
  const restDateProps = [];
  const calcColumns = Object.keys(cloneDeep(list[0])).filter((item) => !["Number", "ItemName", "ItemNameDetail"].includes(item));
  calcColumns.forEach((item) => {
    const copyItem = cloneDeep(item);
    if (/\d/.test(item)) item = `${item.substring(0, 4)}年${item.substring(4, 6)}月`;
    restDateProps.push({ label: item, prop: `${copyItem}` });
  });
  const exportColumns = [...initCol, ...cloneDeep(restDateProps)].filter((item) => item.label !== "序号");
  list.length &&
    downloadDataToExcel({
      dataList: list,
      columns: exportColumns,
      sheetName: list[0].ItemName
    });
};

const handleClick = ({ paneName }) => {
  activeName.value = paneName;
};

const fetchFreeList = async () => {
  loading.value = true;
  const { columnArrs } = await getMenuColumns();
  const [menusCols] = columnArrs;

  fetchFreeBIList({ year: date.value + "-24" })
    .then((res: any) => {
      if (res.data) {
        dataList.value = res.data || [];
        const list1 = res.data.filter((item) => item.ItemName === "销售费用");
        saleRef.value && saleRef.value.getChartData({ list: list1, menusCols });
        exportListMap.sale = list1;
        const list2 = res.data.filter((item) => item.ItemName === "管理费用");
        mgmtRef.value && mgmtRef.value.getChartData({ list: list2, menusCols });
        exportListMap.mgmt = list2;
        const list3 = res.data.filter((item) => item.ItemName === "研发费用");
        devRef.value && devRef.value.getChartData({ list: list3, menusCols });
        exportListMap.dev = list3;
        const list4 = res.data.filter((item) => item.ItemName === "财务费用");
        finRef.value && finRef.value.getChartData({ list: list4, menusCols });
        exportListMap.fin = list4;
        const list5 = res.data.filter((item) => item.ItemName === "制造费用");
        makeRef.value && makeRef.value.getChartData({ list: list5, menusCols });
        exportListMap.make = list5;
      }
    })
    .finally(() => (loading.value = false));
};

const getColumnConfig = async () => {
  const { buttonArrs } = await getMenuColumns();
  updateButtonList(buttonList, buttonArrs[0]);
};
const buttonList = ref<ButtonItemType[]>([{ clickHandler: onExport, type: "default", text: "导出", icon: Download, isDropDown: false }]);

onMounted(() => {
  getColumnConfig();
  fetchFreeList();
});
</script>
