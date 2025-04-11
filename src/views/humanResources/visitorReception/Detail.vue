<template>
  <!-- <EditForm v-loading="loading" ref="formRef" :formInline="formData" :formConfigs="filterConfigs" :formRules="formRules" :formProps="{ labelWidth: '180px' }" /> -->
  <TableEditList v-loading="loading" ref="formRef" :params="{ groupCode: '1', pageUrl: props.pageUrl }" :formConfig="formConfig" />
</template>

<script setup lang="tsx">
import EditForm from "@/components/EditForm/index.vue";
import { formConfigs, formRules } from "./utils/config";
import { onMounted, ref, computed, watch, reactive } from "vue";
import { getEnumDictList } from "@/utils/table";
import { fetchVisitorList } from "@/api/oaManage/humanResources";
import { message } from "@/utils/message";
import HxModalInput from "@/components/HxModalInput/index.vue";
import { FormItemConfigType } from "@/utils/form";

interface Props {
  id?: string;
  type?: "add" | "edit" | "view";
  formInline?: Record<string, any>;
  pageUrl?: string;
}

/** 信息中心的查看单据id */
const props = withDefaults(defineProps<Props>(), {
  id: "",
  type: "add",
  pageUrl: "",
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
  })
});

const formRef = ref();
const loading = ref(false);
const formData = reactive(props.formInline);
const isView = props.type === "view";

const formConfig: FormItemConfigType[] = [
  {
    formData: formData,
    formProps: { labelWidth: "100px" },
    customElement: {
      receptionist: ({ formModel, row }) => {
        return (
          <HxModalInput
            title="选择接待人员"
            placeholder="点击选择"
            valueKey={row.prop}
            v-model={formModel[row.prop]}
            readonly={true}
            disabled={isView}
            showModel="user"
            onMulSelect={(rows) => {
              const names = rows.map((item) => item.userName);
              formModel.receptionist = String(names);
            }}
            componentProp={{ multiple: true }}
          />
        );
      },
      receptionAssist: ({ formModel, row }) => {
        return (
          <HxModalInput
            title="选择协助人员"
            placeholder="点击选择"
            valueKey={row.prop}
            v-model={formModel[row.prop]}
            readonly={true}
            disabled={isView}
            showModel="user"
            onMulSelect={(rows) => {
              const names = rows.map((item) => item.userName);
              formModel.receptionAssist = String(names);
            }}
            componentProp={{ multiple: true }}
          />
        );
      }
    },
    customProps: {
      visitorName: { disabled: isView },
      visitorsCount: { disabled: isView },
      arriveDate: { disabled: isView },
      arriveTime: { disabled: isView },
      receptionAddress: { disabled: isView },
      welcomeWord: { disabled: isView },
      receptionist: { disabled: isView },
      receptionAssist: { disabled: isView },
      hrVisitReceptionPrepareDTOList: { disabled: isView },
      hrVisitReceptionMattersDTOList: { disabled: isView },
      journey: { disabled: isView },
      receptionRequire: { disabled: isView },
      remark: { disabled: isView }
    },
    customColumn: { billNo: { hide: !isView } }
  }
];

onMounted(() => {
  getDetail();
});

// 详情数据
function getDetail() {
  if (["edit", "view"].includes(props.type) && props.id) {
    loading.value = true;
    fetchVisitorList({ page: 1, limit: 1, id: props.id })
      .then((res) => {
        loading.value = false;
        const data = res.data as any;
        if (!data.records?.length) return message.error("暂无数据");
        const row = data.records[0];
        Object.keys(formData).forEach((key) => (formData[key] = row[key]));
        formData.hrVisitReceptionMattersDTOList = row?.visitItem.split(",") ?? []; // 情况说明
        formData.hrVisitReceptionPrepareDTOList = row?.prepareItem.split(",") ?? [];
      })
      .catch(() => (loading.value = false));
  }
}

function getRef() {
  return formRef.value.getRef();
}

defineExpose({ getRef });
</script>
