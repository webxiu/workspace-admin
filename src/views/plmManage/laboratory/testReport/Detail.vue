<template>
  <TableEditList :loading="loading" ref="formRef" :params="{ groupCode: '1', pageUrl: pageUrl }" :formConfig="formConfig" />
</template>

<script setup lang="tsx">
import { onMounted, ref, reactive } from "vue";
import { fetchTestReportInfo } from "@/api/plmManage";
import { dayjs } from "element-plus";
import { FormItemConfigType } from "@/utils/form";
import SelectUserList from "./SelectUserList.vue";
import UploadFileList from "./UploadFileList.vue";

interface Props {
  id?: string;
  pageUrl?: string;
  type?: "add" | "edit" | "view";
}

/** 信息中心的查看单据id */
const props = defineProps<Props>();
const loading = ref(false);
const formRef = ref();
const formData = reactive({
  id: "",
  approval: [],
  fileList: [],
  reportName: "",
  remark: "",
  billNo: "",
  createUserName: "",
  createDate: ""
});
const isView = props.type === "view";
const formConfig: FormItemConfigType[] = [
  {
    formData: formData,
    formProps: { labelWidth: "140px" },
    customElement: {
      approval: ({ formModel, row }) => <SelectUserList v-model={formModel[row.prop]} type={props.type} />,
      fileList: ({ formModel, row }) => <UploadFileList v-model={formModel[row.prop]} type={props.type} />
    },
    customProps: {
      reportName: { disabled: isView },
      remark: { disabled: isView },
      approval: { disabled: isView }
    },
    customColumn: {
      billNo: { hide: props.type === "add" },
      createUserName: { hide: props.type === "add" },
      createDate: { hide: props.type === "add" }
    }
  }
];

onMounted(() => {
  getDetail();
});

function getDetail() {
  if (["edit", "view"].includes(props.type) && props.id) {
    loading.value = true;
    fetchTestReportInfo({ id: props.id })
      .then((res: any) => {
        const row = res.data;
        if (row) {
          formData.id = row.id;
          formData.reportName = row.reportName;
          formData.remark = row.remark;
          formData.billNo = row.billNo;
          formData.createUserName = row.createUserName;
          formData.createDate = dayjs(row?.createDate).format("YYYY-MM-DD HH:mm:ss");
          formData.approval = row.userList;
          formData.fileList = row.fileList.map((item) => ({ ...item, name: item.resourceName, lastModified: item.id }));
        }
      })
      .finally(() => (loading.value = false));
  }
}

function getRef() {
  return new Promise((resolve) => {
    formRef.value.getRef().then(({ valid, data }) => {
      if (!valid) return;
      resolve({ formData, data });
    });
  });
}
defineExpose({ getRef });
</script>
