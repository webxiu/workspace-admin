<script setup lang="ts">
import { getIncomeStatement } from "@/api/oaManage/financeDept";
import { useEleHeight } from "@/hooks";
import { downloadDataToExcel, getMenuColumns, setColumn, updateButtonList, onHeaderDragend, setUserMenuColumns } from "@/utils/table";
import dayjs from "dayjs";
import { onMounted, ref } from "vue";
import { PureTableBar } from "@/components/RePureTableBar";

defineOptions({ name: "OaFinanceDeptFinanceBIProfitTableIndex" });

const selectDate = ref(dayjs(new Date()).add(-1, "month").format("YYYY-M"));
const loading = ref(false);
const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49);
const columns = ref([]);

const tableData = ref([]);

const getList = () => {
  loading.value = true;
  const [year, month] = selectDate.value.split("-");
  getIncomeStatement({ year, month })
    .then((res: any) => {
      if (res.data) {
        tableData.value = res.data;
      }
    })
    .finally(() => (loading.value = false));
};

const viewText = (d) => {
  if (d.fName != null) {
    let num = 0;
    for (let i = 0; i < d.fName.length; i++) {
      if (d.fName[i] === " ") {
        num++;
      }
    }
    return "<div>" + "&nbsp;".repeat(num * 4) + d.fName + "</div>";
  } else {
    return d.fName;
  }
};

const changeDate = (date) => {
  selectDate.value = date;
  getList();
};

const onExport = () => {
  const [year, month] = selectDate.value.split("-");
  downloadDataToExcel({
    dataList: tableData.value,
    columns: [
      { label: "项目", prop: "fName" },
      { label: "本期金额", prop: "nowMonth" },
      { label: "本年累计金额", prop: "nowYear" }
    ],
    sheetName: `${year}年${month}月利润表`
  });
};

const getColumnConfig = async () => {
  let columnData: TableColumnList[] = [
    { label: "项目", prop: "fName", slot: "fName" },
    { label: "本期金额", prop: "nowMonth", slot: "nowMonth", minWidth: 180 },
    { label: "本年累计金额", prop: "nowYear", slot: "nowYear" }
  ];
  const { columnArrs, buttonArrs } = await getMenuColumns();
  const [data] = columnArrs;
  updateButtonList(buttonList, buttonArrs[0]);
  if (data?.length) columnData = data;
  columns.value = setColumn({ columnData, operationColumn: { hide: true } });
};

const onRefresh = () => {
  getColumnConfig();
  getList();
};

const buttonList = ref<ButtonItemType[]>([{ clickHandler: onExport, type: "primary", text: "导出", isDropDown: false }]);

onMounted(() => {
  getColumnConfig();
  getList();
});
</script>

<template>
  <PureTableBar :columns="columns" @refresh="onRefresh" @change-column="setUserMenuColumns">
    <template #title>
      <el-date-picker v-model="selectDate" type="month" placeholder="选择年月" value-format="YYYY-M" @change="changeDate" />
    </template>
    <template #buttons>
      <ButtonList :buttonList="buttonList" :auto-layout="false" />
    </template>
    <template v-slot="{ size, dynamicColumns }">
      <pure-table
        border
        :height="maxHeight"
        :max-height="maxHeight"
        row-key="id"
        :adaptive="true"
        align-whole="left"
        :loading="loading"
        :size="size"
        :data="tableData"
        :columns="dynamicColumns"
        highlight-current-row
        @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
      >
        <template #fName="{ row }">
          <div v-html="viewText(row)" />
        </template>
      </pure-table>
    </template>
  </PureTableBar>
</template>

<style lang="scss" scoped>
.head {
  margin-bottom: 12px;
}
</style>
