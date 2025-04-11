<template>
  <TableEditList :loading="loading" ref="formRef" :params="{ groupCode: '1', pageUrl: pageUrl }" :formConfig="formConfig" />
</template>

<script setup lang="tsx">
import { onMounted, reactive, ref } from "vue";
import { dbMaintenanceList } from "@/api/systemManage";
import { message } from "@/utils/message";
import { FormItemConfigType } from "@/utils/form";

/** 信息中心的查看单据id */
const props = defineProps<{ id?: string; type?: "add" | "edit" | "view"; pageUrl?: string }>();
const formRef = ref();
const loading = ref(false);
const formData = reactive({
  id: "",
  billNo: "",
  title: "",
  content: "",
  reason: "",
  isExecute: 0,
  dbKey: "",
  isNeedFinishExecute: false,
  billState: 0,
  userId: 0,
  userName: "",
  createDate: "",
  modifyDate: ""
} as any);
const isView = props.type === "view";

const formConfig: FormItemConfigType[] = [
  {
    formData: formData,
    formProps: { labelWidth: "140px" },
    customElement: {},
    customProps: {
      title: { disabled: isView },
      reason: { disabled: isView },
      billState: { disabled: isView },
      isExecute: { disabled: isView },
      isNeedFinishExecute: { disabled: isView },
      dbKey: { disabled: isView },
      content: { disabled: isView },
      userName: { disabled: isView }
    },
    customColumn: {
      isExecute: { hide: !isView },
      billState: { hide: !isView },
      userName: { hide: !isView }
    }
  }
];
onMounted(() => getDetail());

const getDetail = () => {
  if (props.type === "add") return;
  if (!props.id) return message.error("查询id不存在");
  loading.value = true;
  dbMaintenanceList({ page: 1, limit: 100000, id: props.id })
    .then(({ data }) => {
      Object.keys(formData).forEach((key) => (formData[key] = data.records[0][key]));
      loading.value = false;
    })
    .catch(() => (loading.value = false));
};

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
