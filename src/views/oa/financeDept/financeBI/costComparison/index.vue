<script setup lang="ts">
import { getCostCompareData, getCostCompareOptionData } from "@/api/oaManage/financeDept";
import { PureTableBar } from "@/components/RePureTableBar";
import { useEleHeight } from "@/hooks";
import { handleTree } from "@pureadmin/utils";
import { ElMessage } from "element-plus";
import { onMounted, ref } from "vue";
import { setColumn, getMenuColumns, updateButtonList, onHeaderDragend } from "@/utils/table";

defineOptions({ name: "OaFinanceDeptFinanceBICostComparisonIndex" });

const PFNUMBER = ref("");
const PFNUMBER1 = ref("");
const selectYear1 = ref("");
const selectYear2 = ref("");
const month1 = ref("");
const month2 = ref("");
const options1 = ref([]);
const options2 = ref([]);
const loading = ref(false);
const dataList1 = ref([]);
const dataList2 = ref([]);
const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49);
const columns = ref<TableColumnList[]>([]);

onMounted(() => {
  getColumnConfig();
});

const getColumnConfig = async () => {
  let columnData: TableColumnList[] = [
    { label: "年期", prop: "YearAndM", width: 200 },
    { label: "产品编码", prop: "PFNUMBER", width: 200 },
    { label: "产品名称", prop: "PFNAME", width: 200 },
    { label: "产品规格", prop: "PFSPECIFICATION", width: 200 },
    { label: "基本单位", prop: "BasicUnit", width: 100 },
    { label: "子物料父级ID", prop: "PFMATERIALID", width: 200 },
    { label: "子物料ID", prop: "FMATERIALID", width: 100 },
    { label: "子物料编码", prop: "FNUMBER", width: 200 },
    { label: "子物料名称", prop: "FNAME", width: 200 },
    { label: "费用名称", prop: "FExpItem", width: 200 },
    { label: "数量", prop: "Qty", width: 100 },
    { label: "单耗", prop: "UnitQty", width: 100 },
    { label: "单位成本", prop: "UnitCost", width: 100 },
    { label: "金额", prop: "Amount", width: 100 }
  ];
  const { columnArrs } = await getMenuColumns();
  const [data] = columnArrs;
  if (data?.length) columnData = data;
  columns.value = setColumn({ columnData, dragSelector: ".log-manage", operationColumn: false });
};

const searchOption1 = () => {
  getCostCompareOptionData({ number: PFNUMBER.value, year: selectYear1.value }).then((res: any) => {
    if (res.data) {
      options1.value = res.data.map((item) => ({ label: item, value: item }));
    }
  });
};

const searchOption2 = () => {
  getCostCompareOptionData({ number: PFNUMBER1.value, year: selectYear2.value }).then((res: any) => {
    if (res.data) {
      options2.value = res.data.map((item) => ({ label: item, value: item }));
    }
  });
};

const changeDate1 = (val) => {
  selectYear1.value = val;
  if (!PFNUMBER.value) {
    ElMessage({ message: "请填写产品编码", type: "warning" });
    return;
  }
  searchOption1();
};

const changeDate2 = (val) => {
  selectYear2.value = val;
  if (!PFNUMBER1.value) {
    ElMessage({ message: "请填写对比产品编码", type: "warning" });
    return;
  }
  searchOption2();
};

const handleSearch = () => {
  const valueArr = [PFNUMBER.value, PFNUMBER1.value, selectYear1.value, selectYear2.value, month1.value, month2.value];
  if (valueArr.some((item) => !item)) {
    ElMessage({ message: "请完善筛选条件", type: "warning" });
    return;
  }
  loading.value = true;
  const p1 = getCostCompareData({ number: PFNUMBER.value, numberYearDate: selectYear1.value, numberMonthDate: month1.value });
  const p2 = getCostCompareData({ number: PFNUMBER1.value, numberYearDate: selectYear2.value, numberMonthDate: month2.value });
  Promise.all([p1, p2])
    .then((res: any) => {
      const [data1, data2] = res.map((item) => item.data);
      dataList1.value = handleTree(data1, "FMATERIALID", "PFMATERIALID", "children");
      dataList2.value = handleTree(data2, "FMATERIALID", "PFMATERIALID", "children");
    })
    .finally(() => (loading.value = false));
};
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="searchGroup" style="margin: 10px">
      <el-input v-model="PFNUMBER" placeholder="产品编码" style="width: 15%" />
      <el-date-picker @change="changeDate1" value-format="YYYY" v-model="selectYear1" type="year" placeholder="选择年" style="width: 12%; margin: 0 30px" />
      <el-select v-model="month1" placeholder="选择期" style="width: 8%">
        <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-input v-model="PFNUMBER1" placeholder="对比产品编码" style="width: 15%; margin: 0 30px" />
      <el-date-picker @change="changeDate2" value-format="YYYY" v-model="selectYear2" type="year" placeholder="对比年" style="width: 12%" />
      <el-select v-model="month2" placeholder="对比期" style="width: 8%; margin-left: 30px">
        <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button type="primary" plain style="margin-left: 30px" @click="handleSearch">查询</el-button>
    </div>
    <div class="flex flex-1 ui-h-100 ui-w-100 ui-ov-h">
      <PureTableBar :columns="columns" :show-icon="false">
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight / 2 - 16"
            row-key="FMATERIALID"
            class="role-setting"
            :adaptive="true"
            align-whole="left"
            :loading="loading"
            :size="size"
            :data="dataList1"
            :columns="dynamicColumns"
            :paginationSmall="size === 'small'"
            highlight-current-row
            :default-expand-all="false"
            :show-overflow-tooltip="true"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
          />
          <div style="margin-top: 20px">
            <pure-table
              border
              :height="maxHeight / 2 - 16"
              row-key="FMATERIALID"
              class="role-setting"
              :adaptive="true"
              align-whole="left"
              :loading="loading"
              :size="size"
              :data="dataList2"
              :columns="dynamicColumns"
              :paginationSmall="size === 'small'"
              highlight-current-row
              :default-expand-all="false"
              :show-overflow-tooltip="true"
              :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
              @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
            />
          </div>
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
