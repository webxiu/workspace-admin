<template>
  <EditForm v-loading="loading" ref="formRef" :formInline="formData" :formConfigs="filterConfigs" :formProps="{ labelWidth: '180px' }" />
</template>

<script setup lang="ts">
import EditForm from "@/components/EditForm/index.vue";
import { formConfigs } from "./utils/config";
import { onMounted, ref, reactive, computed, watch } from "vue";
import { fetchTestReportInfo } from "@/api/plmManage";
import { dayjs } from "element-plus";

/** 信息中心的查看单据id */
const props = withDefaults(
  defineProps<{
    id?: string;
    type?: "add" | "edit" | "view";
    backRows: any[];
    fileList: any[];
    handleDown?: Function;
    handleAdd?: Function;
    handleUp?: Function;
    formInline?: Record<string, any>;
  }>(),
  {
    id: "",
    type: "add",
    fileList: () => [],
    backRows: () => [],
    handleDown: () => {},
    handleAdd: () => {},
    handleUp: () => {},
    formInline: () => ({})
  }
);
const loading = ref(false);
const formRef = ref();
const _backRows = ref([]);
const _fileList = ref([]);
const formData = reactive(props.formInline);
const emits = defineEmits(["change"]);

onMounted(() => {
  getDetail();
});

watch(props, watchUpdata, { deep: true });

function watchUpdata(value) {
  _backRows.value = value.backRows;
  _fileList.value = value.fileList;
  Object.keys(value.formInline)?.forEach((key) => {
    formData[key] = value.formInline[key];
  });
}

const filterConfigs = computed(() => {
  const configList = formConfigs({ ...props, backRows: _backRows, fileList: _fileList, formData });
  const _list = configList.filter((item) => {
    if (props.type === "add") {
      return !["createUserName", "createDate", "billNo"].includes(item.prop);
    }
    if (props.type === "edit" || props.type === "view") {
      return item;
    }
  });
  return _list;
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
          _backRows.value = row.userList;
          _fileList.value = row.fileList.map((item) => ({ ...item, name: item.resourceName, lastModified: item.id }));
          emits("change", { backRows: _backRows.value, fileList: _fileList.value });
        }
      })
      .finally(() => (loading.value = false));
  }
}

function getRef() {
  return formRef.value.getRef();
}

defineExpose({ getRef });
</script>
