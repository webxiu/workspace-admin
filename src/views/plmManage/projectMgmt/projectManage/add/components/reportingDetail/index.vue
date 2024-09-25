<!-- 交付物审批信息中心弹窗组件 -->
<template>
  <div>
    <EditForm :form-configs="formDeliverConfigs()" :form-inline="formData" :form-rules="formDeliverRules" />
  </div>
</template>

<script setup lang="ts">
import EditForm from "@/components/EditForm/index.vue";
import { formDeliverConfigs, formDeliverRules } from "./config";
import { reactive, onMounted, ref } from "vue";
import { fetchProjectTaskDeliversByBillNo, getBOMTableRowSelectOptions } from "@/api/plmManage";
import dayjs from "dayjs";

const props = defineProps(["rowData"]);

const statusOptions = ref([]);
const formData = reactive({
  projectName: "",
  taskName: "",
  version: "",
  title: "",
  remark: "",
  billNo: props.rowData?.billNo,
  billState: "",
  createUserName: "",
  createDate: "",
  fileList: []
});

const fetchOpts = () => {
  getBOMTableRowSelectOptions({ optioncode: "BillStatus" }).then((res) => {
    if (res.data) {
      const result = res.data.find((item) => item.optionCode === "BillStatus")?.optionList || [];
      statusOptions.value = result;

      const { billNo } = props.rowData;

      if (billNo) {
        fetchDetailData(billNo);
      }
    }
  });
};

const findStateName = (state) => {
  const result = statusOptions.value.find((item) => item.optionValue == state)?.optionName || "";
  return result;
};

const fetchDetailData = (billNo) => {
  fetchProjectTaskDeliversByBillNo({ billNo }).then((res: any) => {
    if (res.data) {
      const resultData = res.data.generalTemplateVO || {};
      formData.remark = resultData.remark;
      formData.billState = findStateName(resultData.billState);
      formData.createUserName = resultData.createUserName;
      formData.createDate = resultData.createDate ? dayjs(resultData.createDate).format("YYYY-MM-DD HH:mm:ss") : "";
      // formData.version = resultData.version;
      formData.taskName = resultData.taskName || resultData.taskId;
      formData.title = resultData.title;
      formData.projectName = resultData.projectName || resultData.projectIntoId;
      // formData.fileList = resultData.newGeneralTemplateEntryVOList || [];
    }
  });
};

onMounted(() => {
  fetchOpts();
});
</script>

<style lang="scss" scoped>
:deep(.el-form-item) {
  margin-bottom: 0 !important;
}
</style>
