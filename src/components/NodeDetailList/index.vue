<script setup lang="ts">
import { ref, watch } from "vue";
import { getNodeDetailList } from "@/api/oaManage/index";
import { setColumn } from "@/utils/table";
import FlowGraph from "@/views/workbench/infoCenter/detail/flowGraph.vue";
import { DialogOptions } from "@/components/ReDialog";

interface Props {
  billType: string;
  billNo: string;
  billState: number;
  options: DialogOptions;
}
const props = defineProps<Props>();

const maxHeight = ref(300);
const loading = ref(false);
const dataList: any = ref([]);
const columns = ref([]);
const activeName = ref("nodeList");
const columnData: TableColumnList[] = [
  { label: "节点名称", prop: "nodeName" },
  { label: "处理人", prop: "approvalName" },
  { label: "状态", prop: "nodeStatus" },
  { label: "节点类型", prop: "nodeType" },
  { label: "备注", prop: "approvalRemark" },
  { label: "时间", prop: "approvalDate", minWidth: 150 }
];

columns.value = setColumn({ columnData, operationColumn: false });

const fetchDataList = (billNo, billType) => {
  loading.value = true;
  const reqType = {
    leaveApply: "10001",
    outApply: "10038",
    testReport: "10039",
    staffCheck: "10005",
    overTime: "10002",
    SQLFlow: "10035",
    productDevApply: "10031",
    signBack: "10029", // TODO
    customerComplaint: "10013",
    projectInfo: "10014",
    visitor: "10043",
    workOrder: "10003",
    invoice: "10047",
    quotation: "10052",
    statement: "10046",
    deliverableAppravel: "10055",
    deliverableChange: "10054",
    operateBook: "10053",
    openModeApply: "10061",
    dr0DevApply: "10012",
    palmApply: "10062",
  };
  getNodeDetailList({ billId: reqType[billType], billNo, searchType: 2 })
    .then((res: any) => {
      if (res.data && res.data.nodeList) {
        dataList.value = res.data.nodeList.filter((item) => item.nodeName !== "抄送人");
      }
    })
    .finally(() => (loading.value = false));
};

// 不存在流程图关闭弹窗
const errCallback = () => {
  if (props.options) {
    (props.options as any).visible = false;
  }
};
const handleClick = (tab) => {
  activeName.value = tab.paneName;
};

watch(
  props,
  (newVal) => {
    // if ([1, 2].includes(newVal?.billState)) {
    //   fetchDataList(newVal?.billNo, newVal?.billType);
    // }
    fetchDataList(newVal?.billNo, newVal?.billType);
  },
  { immediate: true }
);
</script>

<template>
  <div v-if="billNo" style="font-size: 14px; font-weight: bold">单据编号：{{ billNo }}</div>
  <div class="ui-h-100 flex flex-1 main main-content">
    <el-tabs v-model="activeName" class="tabs-fill_content" @tab-click="handleClick">
      <el-tab-pane label="节点列表" name="nodeList">
        <pure-table
          id="outerRecordsId"
          border
          :height="maxHeight"
          :adaptive="true"
          align-whole="left"
          :loading="loading"
          size="small"
          :data="dataList"
          :columns="columns"
          highlight-current-row
          :show-overflow-tooltip="true"
        />
      </el-tab-pane>
      <el-tab-pane label="流程图" name="process">
        <FlowGraph :bill-no="billNo" :errCallback="errCallback" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
