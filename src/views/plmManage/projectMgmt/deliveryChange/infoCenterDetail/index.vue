<template>
  <div>
    <EditForm :form-inline="formData" :form-configs="formConfigs({ formData })" :form-props="{ size: 'small' }" />
  </div>
</template>

<script setup lang="tsx">
import { queryProjectTaskDeliversChange } from "@/api/plmManage";
import EditForm from "@/components/EditForm/index.vue";
import { formConfigs } from "./config";
import { onMounted, reactive } from "vue";

const props = defineProps(["id", "rowData"]);
const formData: any = reactive({});

const fetchDetail = (id) => {
  queryProjectTaskDeliversChange({ id }).then((res: any) => {
    if (res.data && Array.isArray(res.data) && res.data.length) {
      formData.billNo = res.data[0]?.billNo ?? props.rowData.billNo;
      formData.projectName = res.data[0]?.projectName;
      formData.createUserName = res.data[0]?.createUserName;
      formData.createDate = res.data[0]?.createDate;
      formData.taskName = res.data[0]?.projectFileChangeRecordDTOList[0]?.taskName;
      formData.taskId = res.data[0]?.projectFileChangeRecordDTOList[0]?.taskId;
      formData.version = res.data[0]?.changeVersion;
      formData.billState = res.data[0]?.billState;
      formData.deliverableId = res.data[0]?.changeDeliverableId;
      formData.title = res.data[0]?.changeTitleAfter;
      formData.remark = res.data[0]?.changeRemarkAfter;
      formData.describeChange = res.data[0]?.changeNote;

      formData.files = res.data[0]?.projectFileChangeRecordDTOList?.map((item) => ({ ...item, name: item.changeFileName }));
    }
  });
};

onMounted(() => {
  if (props.id) fetchDetail(props.id);
});
</script>

<style lang="scss" scoped>
:deep(.el-form-item) {
  margin-bottom: 8px !important;
}
</style>
