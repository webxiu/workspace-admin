<template>
  <div>
    <pure-table
      border
      ref="topTableRef"
      :height="maxHeight / 2"
      :max-height="maxHeight / 2"
      row-key="id"
      default-expand-all
      :adaptive="true"
      align-whole="left"
      :loading="loading"
      size="small"
      :data="dataList"
      :columns="columns"
      empty-text="暂无历史信息"
      :row-class-name="tableRowClassName"
      @row-click="onClickList"
      highlight-current-row
      :show-overflow-tooltip="true"
    />
    <div class="under-table">
      <pure-table
        row-key="id"
        :height="maxHeight / 2"
        :max-height="maxHeight / 2"
        default-expand-all
        style="border: none"
        :show-header="false"
        empty-text="暂无相关文件信息"
        :adaptive="true"
        align-whole="left"
        size="small"
        :data="dataList2"
        :columns="columns2"
        highlight-current-row
        :show-overflow-tooltip="true"
      >
        <template #operation="{ row }">
          <el-button auto-insert-space type="primary" size="small" text @click="viewFile2(row)"><span style="font-weight: 550">预 览</span></el-button>
          <el-button auto-insert-space type="success" size="small" text @click="downFile2(row)"><span style="font-weight: 550">下 载</span></el-button>
        </template>
      </pure-table>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { downloadFile } from "@/utils/common";
import { getkkViewUrl } from "@/utils/storage";
import { setColumn } from "@/utils/table";
import { ref, onMounted } from "vue";
import { getBOMTableRowSelectOptions } from "@/api/plmManage";

const props = defineProps(["leftRowData", "detailPageInfo", "fullLeftRow", "dataList"]);

const loading = ref(false);
const dataList2 = ref([]);
const columns = ref([]);
const columns2 = ref([]);
const changeModeNameOpts = ref([]);
const curClickTopRow = ref();
const topTableRef = ref();

onMounted(() => {
  onClickList(props.dataList[0]);
  setTimeout(() => {
    topTableRef.value.getTableRef()?.setCurrentRow(props.dataList[0]);
  });
  fetchOpts();
});

const fetchOpts = () => {
  getBOMTableRowSelectOptions({ optioncode: "DeliverablesChangeMode" }).then((res) => {
    if (res.data) {
      const result = res.data.find((item) => item.optionCode === "DeliverablesChangeMode")?.optionList || [];
      changeModeNameOpts.value = result;
    }
  });
};

const tableRowClassName = ({ row, rowIndex }) => {
  //把每一行的索引放进row
  row.index = rowIndex;
  return "";
};

const onClickList = (row) => {
  if (row) {
    curClickTopRow.value = row;
    dataList2.value = row.projectFileChangeRecordDTOList || [];
  }
};

const columnData2: TableColumnList[] = [
  {
    label: "",
    prop: "changeFileName",
    width: 650,
    cellRenderer(data) {
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: "16px",
              height: "16px",
              background: "#1989fa",
              color: "#fff",
              marginRight: "8px",
              fontSize: "10px",
              borderRadius: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            {data.$index + 1}
          </div>
          <div>{data.row.changeFileName}</div>
        </div>
      );
    }
  }
];

const columnData: TableColumnList[] = [
  { label: "版本", prop: "changeVersion", width: 60 },
  { label: "标题", prop: "changeTitleBefore" },
  { label: "说明", prop: "changeRemarkBefore" },
  { label: "变更说明", prop: "changeNote" },
  { label: "创建人(变更人)", prop: "createUserName", width: 160 },
  { label: "创建时间(变更时间)", prop: "createDate", width: 160 }
];

columns.value = setColumn({ columnData, operationColumn: false });
columns2.value = setColumn({
  columnData: columnData2,
  operationColumn: { width: 160, label: "" },
  radioColumn: { hide: true, label: "" },
  indexColumn: { hide: true, label: "" }
});

const maxHeight = ref(400);

const viewFile2 = (row) => {
  const url = getkkViewUrl(row.virtualFilePath);
  window.open(url);
};

const downFile2 = (row) => {
  const url = row.virtualFilePath;
  console.log(url, "url===");
  downloadFile(url, row.changeFileName);
};

defineExpose({ loading });
</script>

<style scoped>
.under-table {
  margin-top: 16px;
  :deep(.el-table__inner-wrapper::before) {
    height: 0;
  }
  :deep(td.el-table__cell) {
    border: none;
  }
}
</style>
