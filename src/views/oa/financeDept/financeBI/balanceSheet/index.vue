<script setup lang="ts">
import { getBalancesheet } from "@/api/oaManage/financeDept";
import { useEleHeight } from "@/hooks";
import { downloadDataToExcel, getMenuColumns, setColumn, updateButtonList, onHeaderDragend, setUserMenuColumns } from "@/utils/table";
import dayjs from "dayjs";
import { onMounted, ref } from "vue";
import { PureTableBar } from "@/components/RePureTableBar";

defineOptions({ name: "OaFinanceDeptFinanceBIBalanceSheetIndex" });

const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49);
const selectDate = ref(dayjs(new Date()).add(-1, "month").format("YYYY-M"));
const loading = ref(false);
const columns = ref<TableColumnList[]>([]);
const tableData = ref([]);

onMounted(() => {
  getColumnConfig();
  getList();
});

const getColumnConfig = async () => {
  let columnData: TableColumnList[] = [
    { label: "资产", prop: "propertyName", slot: "propertyName", minWidth: 400 },
    { label: "年初值", prop: "propertyBeginning" },
    { label: "期末值", prop: "propertyEnding" },
    { label: "负债及所有者权益（或股东权益）", prop: "liabilitiesName", slot: "liabilitiesName", minWidth: 400 },
    { label: "年初值", prop: "liabilitiesBeginning" },
    { label: "期末值", prop: "liabilitiesEnding" }
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

const getList = () => {
  loading.value = true;
  const [year, month] = selectDate.value.split("-");
  getBalancesheet({ year, month })
    .then((res: any) => {
      if (res.data) {
        tableData.value = res.data;
      }
    })
    .finally(() => (loading.value = false));
};

const viewText = (d, txt) => {
  if (d[txt] != null) {
    let num = 0;
    for (let i = 0; i < d[txt].length; i++) {
      if (d[txt][i] === " ") {
        num++;
      }
    }
    return "<div>" + "&nbsp;".repeat(num * 4) + d[txt] + "</div>";
  } else {
    return d[txt];
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
      { label: "资产", prop: "propertyName" },
      { label: "年初值", prop: "propertyBeginning" },
      { label: "期末值", prop: "propertyEnding" },
      { label: "负债及所有者权益（或股东权益）", prop: "liabilitiesName" },
      { label: "年初值", prop: "liabilitiesBeginning" },
      { label: "期末值", prop: "liabilitiesEnding" }
    ],
    sheetName: `${year}年${month}月资产负债表`
  });
};

const buttonList = ref<ButtonItemType[]>([{ clickHandler: onExport, type: "primary", text: "导出", isDropDown: true }]);
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="flex flex-1 ui-h-100 ui-w-100 ui-ov-h">
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
            align-whole="center"
            :loading="loading"
            :size="size"
            :data="tableData"
            :columns="dynamicColumns"
            :paginationSmall="size === 'small'"
            highlight-current-row
            :show-overflow-tooltip="true"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
          >
            <template #propertyName="{ row }">
              <div v-html="viewText(row, 'propertyName')" />
            </template>
            <template #liabilitiesName="{ row }">
              <div v-html="viewText(row, 'liabilitiesName')" />
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
