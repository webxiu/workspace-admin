<template>
  <EditForm v-loading="loading" ref="formRef" :formInline="formData" :formConfigs="filterConfigs" :formProps="{ labelWidth: '180px' }" />
</template>

<script setup lang="ts">
import EditForm from "@/components/EditForm/index.vue";
import { formConfigs } from "./utils/config";
import { onMounted, ref, computed, watch } from "vue";
import { getEnumDictList } from "@/utils/table";
import { taskFileList, getMyWorkOrderDetail } from "@/api/systemManage";

interface Props {
  /** 任务id */
  id?: string;
  type?: "add" | "edit" | "view";
  formInline?: Record<string, any>;
}

/** 信息中心的查看单据id */
const props = withDefaults(defineProps<Props>(), {
  id: "",
  type: "add",
  formInline: () => ({
    id: 0,
    taskName: "",
    billNo: "",
    taskTypeCode: "",
    taskContent: "",
    systemName: "",
    expectDate: "",
    parentId: "",
    attr: []
  })
});

const formRef = ref();
const loading = ref(false);
const formData = ref(props.formInline);
const taskType = ref([]); // 任务类型下拉
const sysTypeOpts = ref([]); // 系统下拉
const fileList = ref([]); // 文件列表

onMounted(() => {
  getOptionList();
  getDetail();
});

const filterConfigs = computed(() => {
  return formConfigs({
    type: props.type,
    fileList,
    formData: formData,
    taskType: taskType,
    sysTypeOpts
  });
});

watch(props, watchUpdata, { deep: true, immediate: true });

function watchUpdata(values) {
  formData.value = values.formInline;
}

// 获取下拉框列表
const getOptionList = () => {
  getEnumDictList(["ITTaskType", "WorkOrderSystemType"])
    .then((res) => {
      taskType.value = res.ITTaskType;
      sysTypeOpts.value = res.WorkOrderSystemType;
    })
    .catch(console.log);
};

// 详情数据
async function getDetail() {
  if (["edit", "view"].includes(props.type) && props.id) {
    loading.value = true;

    // 2.获取详情
    getMyWorkOrderDetail(props.id)
      .then(async ({ data }) => {
        loading.value = false;
        if (data) {
          formData.value = data;
          try {
            // 1.文件列表
            const res = await taskFileList({ billNo: data.billNo });
            fileList.value = res.data || []; // 文件列表
            formData.value.attr = res.data;
          } catch (error) {
            console.log("error", error);
          }
        }
      })
      .catch(() => (loading.value = false));
  }
}

function getRef() {
  return { getRef: formRef.value.getRef(), formData };
}
defineExpose({ getRef });
</script>
