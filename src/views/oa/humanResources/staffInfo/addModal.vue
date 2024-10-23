<!-- /*
 * @Author: Hailen 
 * @Date: 2023-09-22 11:12:26 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-09-22 11:12:26 
 */ -->

<script setup lang="ts">
import { ref, PropType, computed } from "vue";
import { StaffInfoItemType } from "@/api/oaManage/humanResources";
import EditForm from "@/components/EditForm/index.vue";
import { formRules, formConfigs, StaffOptionDataType } from "./utils/config";
import { formatDate } from "@/utils/common";

const props = defineProps({
  optionData: { type: Object, default: () => ({}) },
  type: { type: String as PropType<"add" | "edit">, default: "" },
  row: { type: Object as PropType<StaffInfoItemType>, default: () => ({}) },
  temporaryFlag: { type: Number, default: 0 }
});

const formRef = ref();
const loading = ref<boolean>(false);
const formData = ref({
  temporaryFlag: props.temporaryFlag,
  ...props.row,
  exmpetAttendance: props.row.exmpetAttendance ? props.row.exmpetAttendance : false,
  startDate: formatDate(props.row?.startDate, "YYYY-MM-DD"),
  birthDate: formatDate(props.row.birthDate, "YYYY-MM-DD"),
  leaveofficeDate: formatDate(props.row.leaveofficeDate, "YYYY-MM-DD"),
  moneyStartDate: formatDate(props.row.moneyStartDate, "YYYY-MM-DD"),
  contractExpiresDate: formatDate(props.row.contractExpiresDate, "YYYY-MM-DD"),
  contractRenewalDate: formatDate(props.row.contractRenewalDate, "YYYY-MM-DD"),
  transferDate: formatDate(props.row.transferDate, "YYYY-MM-DD"),
  deptId: props.row.deptId ? `${props.row.deptId}` : "",
  workRuleId: props.row.workRuleId ? `${props.row.workRuleId}` : "",
  // 教育经历删除的id列表
  deleteStaffInfoEducationIdList: [],
  // 家庭关系删除的id列表
  deleteStaffInfoFamilyIdList: [],
  // 工作经历删除的id列表
  deleteStaffInfoWorkIdList: []
});

// 获取详情信息
const optionInfoData = computed<StaffOptionDataType>(() => {
  const { optionList, workTimeList, deptInfoTree } = props.optionData;
  return { ...optionList, workTimeList, deptInfoTree };
});

const formConfig = formConfigs({
  type: props.type,
  row: props.row,
  optionDatas: optionInfoData,
  temporaryFlag: props.temporaryFlag,
  formData: formData.value
});

function getRef() {
  return { formRef: formRef.value.getRef(), formData };
}
defineExpose({ getRef });
</script>

<template>
  <div class="ui-w-100 ui-h-100">
    <EditForm
      ref="formRef"
      :loading="loading"
      :formInline="formData"
      :formRules="formRules"
      :formConfigs="formConfig"
      :formProps="{ labelWidth: '120px', labelPosition: 'top' }"
    />
  </div>
</template>

<style lang="scss">
.staff-record-table > div {
  padding: 0 !important;
}
</style>
