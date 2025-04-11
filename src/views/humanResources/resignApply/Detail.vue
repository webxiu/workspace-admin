<template>
  <!-- <EditForm v-loading="loading" ref="formRef" :formInline="formData" :formRules="formRules" :formConfigs="filterConfigs" :formProps="{ labelWidth: '100px' }" /> -->
  <TableEditList :loading="loading" ref="formRef" :params="{ groupCode: '1', pageUrl: pageUrl }" :formConfig="formConfig" />
</template>

<script setup lang="tsx">
import dayjs from "dayjs";
import { onMounted, ref, computed, watch, reactive } from "vue";
import { formConfigs, formRules, resignType } from "./utils/config";
import EditForm from "@/components/EditForm/index.vue";
import { detailResignApply, getUserBasicInfo, ResignApplyItemType, StaffInfoItemType, staffInfoList } from "@/api/oaManage/humanResources";
import { FormItemConfigType } from "@/utils/form";
import HxModalInput from "@/components/HxModalInput/index.vue";

interface Props {
  id?: string;
  type?: "add" | "edit" | "view";
  pageUrl?: string;
}

/** 信息中心的查看单据id */
const props = defineProps<Props>();

const formRef = ref();
const loading = ref(false);
const formData = reactive<ResignApplyItemType>({} as ResignApplyItemType);
const isView = props.type === "view";

const formConfig = computed<FormItemConfigType[]>(() => [
  {
    formData: formData,
    formProps: { labelWidth: "140px" },
    customElement: {
      staffName: ({ formModel, row }) => {
        return (
          <HxModalInput
            title="选择用户"
            placeholder="请选择用户"
            valueKey={row.prop}
            v-model={formModel[row.prop]}
            readonly={true}
            showButton={true}
            showModel="user"
            onSelect={(row) => onUserChange(row.userCode)}
          />
        );
      }
    },
    customProps: {
      staffName: { disabled: props.type !== "add" },
      applyDate: { disabled: isView },
      other: { disabled: isView },
      resignationReason: { disabled: isView },
      resignationType: {
        disabled: isView,
        onChange: (val, columns) => {
          const isHide = val !== "其他";
          columns.value.forEach((col) => {
            if (col.prop === "other") col.hide = isHide;
            if (col.prop === "resignationReason") col.colProp = { span: isHide ? 24 : 12 };
          });
        }
      }
    },
    customColumn: {
      resignationReason: {
        colProp: { span: formData.resignationType !== "其他" ? 24 : 12 }
      },
      other: { hide: formData.resignationType !== "其他" }
    },
    dataOption: { resignationType: resignType }
  }
]);

onMounted(() => {
  getDetail();
});

// 获取人员信息
function onUserChange(staffCode) {
  loading.value = true;
  getUserBasicInfo({ staffCode })
    .then(({ data }) => Object.assign(formData, data[0]))
    .finally(() => (loading.value = false));
}

// 详情数据
function getDetail() {
  if (["edit", "view"].includes(props.type) && props.id) {
    loading.value = true;
    detailResignApply({ id: props.id })
      .then((res) => {
        const row = res.data || ({} as ResignApplyItemType);
        const mergeType = row?.resignationType ?? "";
        const isOther = mergeType.slice(0, 2) === "其他";
        const other = isOther ? mergeType.slice(2) : "";
        Object.assign(formData, {
          ...row,
          other: other,
          resignationType: isOther ? mergeType.slice(0, 2) : mergeType,
          applyDate: row.applyDate || dayjs().format("YYYY-MM-DD")
        });
        loading.value = false;
      })
      .catch(() => (loading.value = false));
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
