<template>
  <EditForm v-loading="loading" ref="formRef" :formInline="formData" :formRules="formRules" :formConfigs="filterConfigs" :formProps="{ labelWidth: '100px' }" />
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { onMounted, ref, computed, watch } from "vue";
import { formConfigs, formRules } from "./utils/config";
import EditForm from "@/components/EditForm/index.vue";
import { detailResignApply, getUserBasicInfo, ResignApplyItemType, StaffInfoItemType, staffInfoList } from "@/api/oaManage/humanResources";

interface Props {
  id?: string;
  type?: "add" | "edit" | "view";
  formInline?: Record<string, any>;
}

/** 信息中心的查看单据id */
const props = withDefaults(defineProps<Props>(), {
  id: "",
  type: "add",
  formInline: () => ({})
});

const formRef = ref();
const loading = ref(false);
const userList = ref<StaffInfoItemType[]>([]);
const formData = ref({ ...props.formInline });

onMounted(() => {
  getUserList();
  getDetail();
});
watch(props, watchUpdata, { deep: true });

function watchUpdata(values) {
  formData.value = values.formInline;
}

const filterConfigs = computed(() => {
  return formConfigs({ type: props.type, userList, onUserChange });
});

// 用户列表
function getUserList() {
  if (props.type !== "add") return;
  loading.value = true;
  staffInfoList({ page: 1, limit: 10000, state: "在职" })
    .then(({ data }) => (userList.value = data.records))
    .finally(() => (loading.value = false));
}

// 获取人员信息
function onUserChange(staffCode) {
  loading.value = true;
  getUserBasicInfo({ staffCode })
    .then(({ data }) => Object.assign(formData.value, data[0]))
    .finally(() => (loading.value = false));
}

// 详情数据
function getDetail() {
  if (["edit", "view"].includes(props.type) && props.id) {
    loading.value = true;
    detailResignApply({ id: props.id })
      .then((res) => {
        loading.value = false;
        const row = res.data || ({} as ResignApplyItemType);
        const mergeType = row?.resignationType ?? "";
        const isOther = mergeType.slice(0, 2) === "其他";
        const other = isOther ? mergeType.slice(2) : "";
        formData.value = {
          ...row,
          other: other,
          resignationType: isOther ? mergeType.slice(0, 2) : mergeType,
          applyDate: row.applyDate || dayjs().format("YYYY-MM-DD")
        };
      })
      .catch(() => (loading.value = false));
  }
}

function getRef() {
  return { formData: formData.value, getRef: formRef.value.getRef() };
}

defineExpose({ getRef });
</script>
