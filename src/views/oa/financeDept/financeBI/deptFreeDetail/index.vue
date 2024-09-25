<script setup lang="ts">
import { getEveryDeptMoneyData } from "@/api/oaManage/financeDept";
import dayjs from "dayjs";
import { onMounted, reactive, ref } from "vue";
import Tab1 from "./tables/Tab1.vue";
import Tab3 from "./tables/Tab3.vue";
import Tab4 from "./tables/Tab4.vue";
import Chart1 from "./charts/Chart1.vue";
import Chart2 from "./charts/Chart2.vue";
import Chart3 from "./charts/Chart3.vue";
import Chart4 from "./charts/Chart4.vue";
import { getBOMTableRowSelectOptions } from "@/api/plmManage";
import { SearchOptionType, QueryParamsType } from "@/components/BlendedSearch/index.vue";
import { getDeptOptions } from "@/utils/requestApi";
import { findTreeNodes } from "@/utils/tree";
import { downloadDataToExcel, getMenuColumns, updateButtonList } from "@/utils/table";
import { getUserInfo } from "@/utils/storage";
import { Download } from "@element-plus/icons-vue";

defineOptions({ name: "OaFinanceDeptFinanceBIDeptFreeDetailIndex" });

const activeName = ref("1");
const tab1Ref = ref();
const chart1Ref = ref();
const chart2Ref = ref();
const chart3Ref = ref();
const tab3Ref = ref();
const tab4Ref = ref();
const loading = ref(false);
const chart4Ref = ref();
const backButtons = ref([]);
const columnListArrs = ref<TableColumnList[][]>([]);
const exportList = ref([]);

const fYear = dayjs(new Date()).format("YYYY");
const deptName = ref("财务部");
const formData = reactive({
  fyear: fYear,
  deptId: undefined,
  includeChildDept: 1,
  includeNotPostingVoucher: 1
});

const searchOptions = reactive<SearchOptionType[]>([
  { label: "日期", value: "fyear", type: "year", format: "YYYY" },
  { label: "部门", value: "deptId", children: [] },
  {
    label: "是否包含子部门",
    value: "includeChildDept",
    children: [
      { label: "是", value: 1 },
      { label: "否", value: 0 }
    ]
  },
  {
    label: "是否包含未过账",
    value: "includeNotPostingVoucher",
    children: [
      { label: "是", value: 1 },
      { label: "否", value: 0 }
    ]
  }
]);

const queryParams = reactive<QueryParamsType>({
  fyear: fYear,
  deptId: { value: undefined, valueLabel: deptName.value },
  includeChildDept: { value: 1, valueLabel: "是" },
  includeNotPostingVoucher: { value: 1, valueLabel: "是" }
});

const handleTagSearch = (values) => {
  formData.fyear = values.fyear || fYear;
  formData.deptId = values.deptId;
  formData.includeChildDept = values.includeChildDept || 1;
  formData.includeNotPostingVoucher = values.includeNotPostingVoucher || 1;
  getAllData();
};

const getAllData = () => {
  if (!formData.deptId) return;
  getEveryDeptMoneyData(formData)
    .then((res) => {
      const [data1 = [], data2 = [], data3 = [], data4 = []] = res.data;
      const [column1, column2, column3, column4] = columnListArrs.value;
      const tableDataObj = tab1Ref.value?.setDataList(data1, column1);
      chart1Ref.value?.setChartData(
        data1.filter((item) => item.FACCOUNTNUMBER === "合计"),
        { deptName: deptName.value, fYear: formData.fyear }
      );
      const tableDataObj2 = chart2Ref.value?.setChartData(data2, column2, { deptName: deptName.value, fYear: formData.fyear });
      chart3Ref.value?.setChartData(
        data3.filter((item) => item.FACCOUNTNUMBER === "合计"),
        { deptName: deptName.value, fYear: formData.fyear }
      );
      const tableDataObj3 = tab3Ref.value?.setDataList(data3, column3);
      const tableDataObj4 = tab4Ref.value?.setDataList(data4, column4);
      chart4Ref.value?.setChartData(data4, { deptName: deptName.value, fYear: formData.fyear });
      exportList.value = [tableDataObj, tableDataObj2, tableDataObj3, tableDataObj4];
    })
    .finally(() => (loading.value = false));
};

const getDeptTreeInfo = () => {
  getDeptOptions().then((data) => {
    const userInfo = getUserInfo();
    const res = findTreeNodes(data, (t) => +t.value === userInfo.deptId)[0];
    deptName.value = res.label;
    formData.deptId = res?.value;
    queryParams.deptId = { value: res?.value, valueLabel: res.label };
    searchOptions[1].children = data;
    getAllData();
  });
};

const fetchEnumList = () => {
  getBOMTableRowSelectOptions({ optioncode: "CostDept" }).then((res) => {
    if (res.data) {
      backButtons.value = res.data[0]?.optionList?.map((item) => item.optionName);
    }
  });
};
const onSelectNode = (node) => {
  if (node.pathLabels.includes("部门")) {
    deptName.value = node.label;
  }
};

const getColumnConfig = async () => {
  const { columnArrs, buttonArrs } = await getMenuColumns();
  columnListArrs.value = columnArrs;
  updateButtonList(buttonList, buttonArrs[0]);
  fetchEnumList();
  getDeptTreeInfo();
};

const onRefresh = async () => getColumnConfig();
onMounted(() => getColumnConfig());

function onExport() {
  downloadDataToExcel(exportList.value, "各部门费用明细");
}

const buttonList = ref<ButtonItemType[]>([{ clickHandler: onExport, type: "primary", text: "导出", icon: Download, isDropDown: false }]);
</script>

<template>
  <div v-loading="loading">
    <div class="top-tools">
      <div class="flex-1">
        <BlendedSearch
          @tagSearch="handleTagSearch"
          @selectNode="onSelectNode"
          :searchOptions="searchOptions"
          :queryParams="queryParams"
          placeholder="请选择"
          searchField="search"
        />
      </div>
      <div>
        <ButtonList :buttonList="buttonList" :auto-layout="false" />
      </div>
    </div>
    <div class="tabs-chart">
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="费用明细" name="1">
          <div class="scroll-tab">
            <Tab1 ref="tab1Ref" @refresh="onRefresh" />
            <Chart1 ref="chart1Ref" :active="activeName" />
          </div>
        </el-tab-pane>
        <el-tab-pane label="平均成本折线图" name="2">
          <div class="scroll-tab">
            <Chart2 ref="chart2Ref" :active="activeName" @refresh="onRefresh" />
          </div>
        </el-tab-pane>
        <el-tab-pane label="费用占收入比明细" name="3">
          <div class="scroll-tab">
            <Tab3 ref="tab3Ref" @refresh="onRefresh" />
            <Chart3 ref="chart3Ref" :active="activeName" />
          </div>
        </el-tab-pane>
        <el-tab-pane label="费用占比" name="4">
          <div class="scroll-tab">
            <Tab4 ref="tab4Ref" @refresh="onRefresh" />
            <Chart4 ref="chart4Ref" :active="activeName" />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.top-tools {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.scroll-tab {
  height: calc(100vh - 229px);
  overflow: auto;
}
</style>
