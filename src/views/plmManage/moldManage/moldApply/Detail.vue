<template>
  <TableEditList ref="formRef" :loading="loading" :params="{ pageUrl: props.pageUrl, groupCode: '1' }" :formConfig="formConfig" />
</template>

<script setup lang="tsx">
import { onMounted, reactive, ref } from "vue";
import { FormItemConfigType } from "@/utils/form";
import TableEditList from "@/components/TableEditList/index.vue";
import HxModalInput from "@/components/HxModalInput/index.vue";
import { modelTypeList, dataProvideList } from "./utils/config";
import { MoldApplyItemType, moldApplyList } from "@/api/plmManage";

interface Props {
  id?: string;
  type?: "add" | "edit" | "view";
  formData?: MoldApplyItemType;
  pageUrl?: string;
}

/** 信息中心的查看单据id */
const props = withDefaults(defineProps<Props>(), {
  id: "",
  type: "add",
  formData: () => ({} as MoldApplyItemType),
  menuItem: () => ({} as RouteConfigsTable)
});

const formRef = ref();
const loading = ref(false);
const formData = reactive<MoldApplyItemType>(props.formData);
const isAdd = props.type === "add";
const isView = props.type === "view";
const baseApi = import.meta.env.VITE_BASE_API;

const formConfig: FormItemConfigType[] = [
  {
    formData: formData,
    customColumn: {
      empty: { labelWidth: "0px" },
      createUserName: { hide: isAdd },
      createDate: { hide: isAdd },
      modifyUserName: { hide: isAdd },
      modifyDate: { hide: isAdd }
    },
    customProps: {
      productName: { disabled: isView },
      modelOpeningDate: { disabled: isView },
      trialDate: { disabled: isView },
      modelType: { disabled: isView },
      draftModelQuantity: { disabled: isView },
      dataProvides: { disabled: isView },
      plmBillFiles: { disabled: isView },

      createUserName: { disabled: !isAdd },
      createDate: { disabled: !isAdd },
      modifyUserName: { disabled: !isAdd },
      modifyDate: { disabled: !isAdd }
    },
    customElement: {
      productCode: ({ formModel, row }) => {
        const onSelect = (val) => (formModel.productId = val.id);
        return (
          <HxModalInput
            title="选择产品"
            placeholder="请选择产品型号"
            valueKey={row.prop}
            v-model={formModel[row.prop]}
            readonly={true}
            disabled={isView}
            showButton={true}
            onSelect={onSelect}
            showModel="product"
          />
        );
      },
      empty: () => <p class="color-f00">(图纸为研发技术中心与模厂确认为准)</p>
    },
    dataOption: { modelType: modelTypeList, dataProvides: dataProvideList },
    formProps: { labelWidth: "120px" }
  }
];

onMounted(() => getDetail());

// 详情数据
function getDetail() {
  if (!props.id) return;
  loading.value = true;
  moldApplyList({ page: 1, limit: 100000 })
    .then(({ data }) => {
      if (data) {
        const result: any = data.records.find((el) => el.id === props.id);
        result.modelType = result.modelType?.split(",").filter(Boolean) || [];
        result.dataProvides = result.dataProvides?.split(";").filter(Boolean) || [];
        result.plmBillFiles = result?.plmBillFiles?.map((m) => ({ ...m, url: baseApi + m.filePath + "/" + m.fileName }));
        Object.assign(formData, result);
      }
    })
    .finally(() => (loading.value = false));
}

function getRef() {
  return formRef.value.getRef();
}

defineExpose({ getRef });
</script>
