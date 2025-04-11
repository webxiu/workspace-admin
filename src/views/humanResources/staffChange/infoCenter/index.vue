<template>
  <div class="staff-change-detail"><TableEditList :params="{ pageUrl, groupCode: '1' }" :formConfig="formConfig" /></div>
</template>

<script setup lang="ts">
import { staffChangeBillDetail, StaffChangeItemType } from "@/api/oaManage/humanResources";
import { boolOptions } from "@/config/constant";
import { FormItemConfigType } from "@/utils/form";
import { reactive, ref, watch } from "vue";
import TableEditList from "@/components/TableEditList/index.vue";

const props = defineProps(["rowData", "pageUrl"]);
const row = ref<StaffChangeItemType>();

const _formData: any = reactive({});

const adjustTypeList = [
  { optionName: "升职", optionValue: "升职" },
  { optionName: "降职", optionValue: "降职" },
  { optionName: "调动", optionValue: "调动" },
  { optionName: "其他", optionValue: "其他" }
];

const stateOpts = [
  { optionName: "待提交", optionValue: "0" },
  { optionName: "审核中", optionValue: "1" },
  { optionName: "已审核", optionValue: "2" },
  { optionName: "重新审核", optionValue: "3" },
  { optionName: "已终止", optionValue: "4" }
];

const formConfig: FormItemConfigType[] = [
  {
    formData: _formData,
    customProps: {
      transferType: {
        disabled: true
      },
      effectiveDate: { disabled: true },
      billNo: { size: "small" },
      billState: { size: "small" },
      createUserId: { size: "small" },
      createUserName: { size: "small" },
      createDate: { size: "small" },
      modifyUserId: { size: "small" },
      modifyUserName: { size: "small" },
      modifyDate: { size: "small" },
      adjustAfterSalary: { disabled: true },
      adjustSalaryFlag: { disabled: true },
      staffName: {
        disabled: true,
        apiParams: { page: 1, limit: 10000, state: "在职" },
        formatAPI: (data) => data.records
      },
      transferAfterDeptId: {
        disabled: true
      },
      transferAfterRoleId: {
        disabled: true
      }
    },
    dataOption: {
      transferType: adjustTypeList,
      adjustSalaryFlag: boolOptions,
      transferAfterRoleId: adjustTypeList
    },
    formProps: { labelWidth: "120px", size: "small" }
  }
];

const getDetailInfo = (billNo) => {
  staffChangeBillDetail({ billNo }).then((res: any) => {
    if (res.data) {
      const result = res.data || {};
      Object.assign(_formData, result);
      _formData.billState = stateOpts.find((el) => el.optionValue == result.billState)?.optionName || {};
      _formData.createUserId = result.createUserName;
      _formData.modifyUserId = result.modifyUserName;
      _formData.transferAfterDeptId = result.transferAfterDeptName;
      _formData.transferAfterRoleId = result.transferAfterRoleName;
      _formData.transferType = result.transferType;
      _formData.staffName = result.staffName;
    }
  });
};

watch(
  props,
  (newVal) => {
    if (newVal.rowData?.billNo) {
      getDetailInfo(newVal.rowData?.billNo);
    }
  },
  { deep: true, immediate: true }
);
</script>

<style lang="scss">
.staff-change-detail {
  .el-form-item--small {
    margin-bottom: 8px !important;
  }
}
</style>
