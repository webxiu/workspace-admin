<template>
  <EditForm v-loading="loading" ref="formRef" :formInline="formData" :formConfigs="filterConfigs" :formRules="formRules" :formProps="{ labelWidth: '180px' }" />
</template>

<script setup lang="ts">
import EditForm from "@/components/EditForm/index.vue";
import { formConfigs, formRules } from "./utils/config";
import { onMounted, ref, computed, watch } from "vue";
import { getEnumDictList } from "@/utils/table";
import { fetchVisitorList } from "@/api/oaManage/humanResources";
import { message } from "@/utils/message";

interface Props {
  id?: string;
  type?: "add" | "edit" | "view";
  formInline?: Record<string, any>;
  handleAddUserNames?: Function;
  handleAddOtherUserNames?: Function;
}

/** 信息中心的查看单据id */
const props = withDefaults(defineProps<Props>(), {
  id: "",
  type: "add",
  formInline: () => ({
    id: "",
    billNo: "",
    visitorName: "",
    visitorsCount: 0,
    arriveDate: "",
    arriveTime: "",
    receptionAddress: "",
    welcomeWord: "",
    receptionist: "",
    receptionAssist: "",
    receptionRequire: "",
    remark: "",
    journey: "",
    hrVisitReceptionMattersDTOList: [],
    hrVisitReceptionPrepareDTOList: []
  }),
  handleAddUserNames: () => {},
  handleAddOtherUserNames: () => {}
});

const formRef = ref();
const loading = ref(false);
const projectList = ref([]);
const prepareList = ref([]);
const formData = ref(props.formInline);

onMounted(() => {
  getOptionData();
  getDetail();
});

watch(props, watchUpdata, { deep: true });

function watchUpdata(values) {
  formData.value = values.formInline;
}

const filterConfigs = computed(() => {
  return formConfigs({
    type: props.type,
    formData: formData,
    optionListInfo: { prepareList, projectList },
    handleAddUserNames: props.handleAddUserNames,
    handleAddOtherUserNames: props.handleAddOtherUserNames
  });
});

// 选框数据
function getOptionData() {
  getEnumDictList(["ReceptionItemType", "ReceptionPrepareType"])
    .then((res) => {
      projectList.value = res.ReceptionItemType;
      prepareList.value = res.ReceptionPrepareType;
    })
    .catch(console.log);
}

// 详情数据
function getDetail() {
  if (["edit", "view"].includes(props.type) && props.id) {
    loading.value = true;
    fetchVisitorList({ page: 1, limit: 1, id: props.id })
      .then((res) => {
        loading.value = false;
        const data = res.data as any;
        if (!data.records?.length) return message("暂无数据", { type: "error" });
        const row = data.records[0];
        Object.keys(formData.value).forEach((key) => {
          formData.value[key] = row[key];
        });
        formData.value.hrVisitReceptionMattersDTOList = row?.visitItem.split(",") ?? []; // 情况说明
        formData.value.hrVisitReceptionPrepareDTOList = row?.prepareItem.split(",") ?? [];
      })
      .catch(() => (loading.value = false));
  }
}

function getRef() {
  return formRef.value.getRef();
}

defineExpose({ getRef });
</script>
