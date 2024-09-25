<template>
  <EditForm
    v-loading="loading || sLoading"
    ref="formRef"
    :formInline="formData"
    :formConfigs="filterConfigs"
    :formRules="formRules"
    :formProps="{ labelWidth: '180px' }"
  />
  <div class="p-4 ui-ta-c mt-10 mb-10">
    <el-button type="primary" @click="saveInfo">保存信息</el-button>
  </div>
</template>

<script setup lang="ts">
import EditForm from "@/components/EditForm/index.vue";
import { formConfigs, formRules } from "./utils/config";
import { onMounted, ref, computed } from "vue";
import { message, showMessageBox } from "@/utils/message";
import { InductionDetailOptions, InductionDetailData, inductionAuditDetail, InductionAuditDetailResType } from "@/api/oaManage/humanResources";
import { dayjs } from "element-plus";

interface Props {
  id: string;
  approveFn: Function;
}

/** 信息中心的查看单据id */
const props = defineProps<Props>();

const formRef = ref();
const loading = ref(false);
const sLoading = ref(false);
const detailData = ref([]);
const detailOptions = ref({});
const formData = ref<Partial<InductionAuditDetailResType>>({
  id: 0,
  staffId: "",
  staffName: "",
  deptId: "",
  groupId: "",
  isStay: "",
  employeKind: "",
  workRuleId: "",
  tryDate: 3,
  tryDateMoney: 0,
  level: "",
  roleId: "",
  wageAccountingType: "",
  inductionDate: dayjs(new Date()).format("YYYY-MM-DD"),
  moneyStartDate: dayjs(new Date()).format("YYYY-MM-DD")
});

onMounted(() => {
  getOptionData();
  getDetail();
});

const filterConfigs = computed(() => formConfigs({ formData, detailData, detailOptions }));

// 选框数据
function getOptionData() {
  // 入职审核-下拉框数据
  const p1 = InductionDetailOptions({ billId: "10005" });
  // 入职审核流程详情选项
  const p2 = InductionDetailData({
    billId: "10005",
    billNo: "IC202312004",
    processDefId: "onboardingAudit:2:1102521",
    processInsId: "1220022",
    searchType: 1
  });
  loading.value = true;
  Promise.all([p1, p2])
    .then((res) => {
      const [res1, res2] = res;
      console.log("res", res);
      loading.value = false;
      if (res1.data) detailOptions.value = res1.data;
      if (res2.data) detailData.value = res2.data;
    })
    .catch(() => (loading.value = false));
}

// 详情数据
function getDetail() {
  sLoading.value = true;
  inductionAuditDetail({ id: props.id })
    .then(({ data }) => {
      sLoading.value = false;
      if (!data) return message("详情信息获取失败", { type: "error" });
      formData.value = {
        ...data,
        tryDate: data.tryDate ?? 3,
        tryDateMoney: data.tryDateMoney ?? 0
      };
    })
    .catch(() => (sLoading.value = false));
}

function saveInfo() {
  const FormRef = formRef.value.getRef();
  const row = formData.value;
  FormRef.validate(async (valid) => {
    const params = {
      staffId: row.staffId,
      staffName: row.staffName,
      deptId: row.deptId,
      groupId: row.groupId,
      isStay: row.isStay,
      employeKind: row.employeKind,
      workRuleId: row.workRuleId,
      tryDate: row.tryDate ?? 3,
      tryDateMoney: row.tryDateMoney ?? 0,
      moneyStartDate: row.moneyStartDate ?? dayjs(new Date()).format("YYYY-MM-DD"),
      level: row.level,
      inductionDate: row.inductionDate ?? dayjs(new Date()).format("YYYY-MM-DD"),
      wageAccountingType: row.wageAccountingType,
      roleId: row.roleId,
      id: row.id
    };
    console.log("提交", params);
    if (valid) {
      showMessageBox("确认要提交吗?").then(() => {
        console.log("提交", params);
        props.approveFn();
      });
    }
  });
}

function getRef() {
  return formRef.value.getRef();
}

defineExpose({ getRef });
</script>
