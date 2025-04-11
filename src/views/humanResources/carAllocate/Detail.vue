<template>
  <TableEditList ref="formRef" :loading="loading" :params="{ pageUrl: props.pageUrl, groupCode: '1' }" :formConfig="formConfig" />
</template>

<script setup lang="tsx">
import { onMounted, ref, watch, reactive } from "vue";
import { fetchGoOutRecords } from "@/api/oaManage/humanResources";
import { FormItemConfigType } from "@/utils/form";
import TableEditList from "@/components/TableEditList/index.vue";
import { carSourceConstant } from "@/config/constant";
import HxModalInput from "@/components/HxModalInput/index.vue";

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
  formInline: () => ({}),
  menuItem: () => ({} as RouteConfigsTable)
});

const formRef = ref();
const loading = ref(false);
const formData = ref<any>(props.formInline);
const formConfig = reactive<FormItemConfigType[]>([
  {
    formData: formData,
    formProps: { labelWidth: "100px" },
    customProps: {
      applyVehicleUsage: { disabled: props.type === "view" },
      driverName: { disabled: props.type === "view" },
      plateNumber: { apiParams: { state: 1 }, disabled: props.type === "view" || formData.value.vehicleSource === "私家车" },
      outMileage: { disabled: props.type === "view" },
      backMileage: { disabled: props.type === "view" },
      backDay: { disabled: props.type === "view" },
      backTime: { disabled: props.type === "view" }
    },
    customElement: {
      vehicleSource: ({ formModel, row }) => {
        let val = "";
        if (/\d/.test(formModel[row.prop])) {
          val = carSourceConstant[formModel[row.prop]];
        } else {
          val = formModel[row.prop];
        }
        return <el-input v-model={val} disabled />;
      },
      userNames: ({ formModel, row }) => {
        return (
          <HxModalInput
            title="选择用户"
            placeholder="请选择用户"
            valueKey={row.prop}
            v-model={formModel[row.prop]}
            readonly={true}
            showButton={true}
            showModel="user"
            onMulSelect={(rows) => {
              const names = rows.map((item) => item.userName);
              formData.value.userNames = String(names);
            }}
            componentProp={{ multiple: true }}
          />
        );
      }
    }
  }
]);

onMounted(() => {
  getDetail();
});

watch(props, watchUpdata, { deep: true });

function watchUpdata(values) {
  formData.value = values.formInline;
}

// 详情数据
function getDetail() {
  if (["edit", "view"].includes(props.type) && props.id) {
    loading.value = true;
    fetchGoOutRecords({ isOwner: false, id: props.id })
      .then((res) => {
        loading.value = false;
        const data = res.data as any;
        if (!data.records?.length) return;
        const row = data.records[0];
        Object.keys(formData.value).forEach((key) => {
          formData.value[key] = row[key];
        });
        formData.value.vehicleInfo = row.goOutBackRegisterVO?.vehicleInfo ?? ""; // 情况说明
        formData.value.driverName = row?.goOutVehicleVO?.driverName ?? "";
        formData.value.outMileage = row?.goOutRegisterVO?.outMileage ?? "";
        formData.value.backMileage = row?.goOutBackRegisterVO?.backMileage ?? "";
        formData.value.userNames = String(row?.userNames) ?? "";
        formData.value.backDay = row?.goOutBackRegisterVO?.realBackDate?.split(" ")[0] ?? "";
        formData.value.backTime = row?.goOutBackRegisterVO?.realBackDate?.split(" ")[1] ?? "";
        formData.value.applyVehicleUsage = row?.applyVehicleUsage ? String(row?.applyVehicleUsage) : "";
        formData.value.billState = String(row?.billState) ?? "";
        formData.value.plateNumber = row.vehicleSource === "私家车" ? row.goOutVehicleVO?.plateNumber : row?.goOutVehicleVO?.carId;
      })
      .catch(() => (loading.value = false));
  }
}

function getRef() {
  return formRef.value.getRef();
}

defineExpose({ getRef });
</script>
