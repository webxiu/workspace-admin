<script setup lang="ts">
import { ref, onMounted } from "vue";
import { basicUserInfo } from "@/api/user/user";
import { formConfigs } from "./config";
import EditForm from "@/components/EditForm/index.vue";
import { timeSettingList } from "@/api/oaManage/humanResources";
import { StaffOptionDataType } from "@/views/oa/humanResources/staffInfo/utils/config";
import { getBOMTableRowSelectOptions } from "@/api/plmManage";
import { getDeptTreeData } from "@/api/systemManage";
import { formatDate } from "@/utils/common";

const loading = ref<boolean>(false);
const oLoading = ref<boolean>(false);
const formData = ref({});

const staffInfoOptions = ref<Partial<StaffOptionDataType>>({
  DegreeType: [],
  DimissionReason: [],
  DormitoryType: [],
  EmployeeStatus: [],
  EmployeeType: [],
  Ethnic: [],
  GenderType: [],
  HaveOrNot: [],
  IncuranceStatus: [],
  LaborCompany: [],
  MaritalStatus: []
});

onMounted(() => {
  getDeptList();
  getOptionList();
  getBasicUserInfo();
});

const getBasicUserInfo = () => {
  loading.value = true;
  basicUserInfo()
    .then(({ data }) => {
      loading.value = false;
      if (!data) return;
      const row = data.staffInfoVO;
      formData.value = {
        ...row,
        startDate: formatDate(row?.startDate, "YYYY-MM-DD"),
        birthDate: formatDate(row.birthDate, "YYYY-MM-DD"),
        leaveofficeDate: formatDate(row.leaveofficeDate, "YYYY-MM-DD"),
        moneyStartDate: formatDate(row.moneyStartDate, "YYYY-MM-DD"),
        contractExpiresDate: formatDate(row.contractExpiresDate, "YYYY-MM-DD"),
        contractRenewalDate: formatDate(row.contractRenewalDate, "YYYY-MM-DD"),
        transferDate: formatDate(row.transferDate, "YYYY-MM-DD"),
        deptId: row.deptId ? `${row.deptId}` : "",
        workRuleId: row.workRuleId ? `${row.workRuleId}` : ""
      };
    })
    .catch(() => (loading.value = false));
};

// 获取部门菜单树
const getDeptList = () => {
  getDeptTreeData().then((res) => {
    if (res.data) {
      const data = JSON.parse(res.data);
      staffInfoOptions.value.deptInfoTree = data[0]?.children || [];
    }
  });
};

const getOptionList = () => {
  oLoading.value = true;
  // 获取工作时间
  timeSettingList({ page: 1, limit: 10000 }).then((res) => {
    if (res.data) {
      staffInfoOptions.value.workTimeList = res.data.map((item) => ({ optionName: item.worktime, optionValue: item.id + "" }));
    }
  });

  const findItemInfo = (key, list = []) => {
    return list.find((item) => item.optionCode === key)?.optionList || [];
  };

  // 批量获取枚举
  getBOMTableRowSelectOptions({
    optioncode: String(Object.keys(staffInfoOptions.value))
  })
    .then((res: any) => {
      if (res.data) {
        const DegreeType = findItemInfo("DegreeType", res.data);
        const DimissionReason = findItemInfo("DimissionReason", res.data);
        const DormitoryType = findItemInfo("DormitoryType", res.data);
        const EmployeeStatus = findItemInfo("EmployeeStatus", res.data);
        const EmployeeType = findItemInfo("EmployeeType", res.data);
        const Ethnic = findItemInfo("Ethnic", res.data);
        const GenderType = findItemInfo("GenderType", res.data);
        const HaveOrNot = findItemInfo("HaveOrNot", res.data);
        const IncuranceStatus = findItemInfo("IncuranceStatus", res.data);
        const LaborCompany = findItemInfo("LaborCompany", res.data);
        const MaritalStatus = findItemInfo("MaritalStatus", res.data);
        const enumsDicts = {
          DegreeType,
          DimissionReason,
          DormitoryType,
          EmployeeStatus,
          EmployeeType,
          Ethnic,
          GenderType,
          HaveOrNot,
          IncuranceStatus,
          LaborCompany,
          MaritalStatus
        };
        staffInfoOptions.value = { ...staffInfoOptions.value, ...enumsDicts };
      }
    })
    .finally(() => (oLoading.value = false));
};
</script>

<template>
  <div class="p-10" v-loading="loading">
    <EditForm
      :formInline="formData"
      :formProps="{ labelWidth: '120px' }"
      :formConfigs="formConfigs({ row: formData, optionDatas: staffInfoOptions })"
      class="preview-disabled-form"
    />
  </div>
</template>
