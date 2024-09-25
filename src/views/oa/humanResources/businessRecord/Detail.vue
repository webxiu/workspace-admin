<template>
  <EditForm v-loading="loading" ref="formRef" :formInline="formData" :formConfigs="filterConfigs" :formProps="{ labelWidth: '180px' }" />
</template>

<script setup lang="ts">
import EditForm from "@/components/EditForm/index.vue";
import { formConfigs } from "./utils/config";
import { onMounted, ref, computed, watch } from "vue";
import { fetchGoOutRecords, getCarOptions } from "@/api/oaManage/humanResources";

interface Props {
  id?: string;
  type?: "add" | "edit" | "view";
  formInline?: Record<string, any>;
  useOpts?: any[];
  handleAddUserNames?: Function;
}

/** 信息中心的查看单据id */
const props = withDefaults(defineProps<Props>(), {
  id: "",
  type: "add",
  formInline: () => ({
    billNo: "",
    applyName: "",
    destination: "",
    gooutReason: "",
    billState: "",
    vehicleSource: "",
    applyVehicleUsage: "",
    driverName: "",
    plateNumber: "",
    userNames: "",
    outMileage: "",
    backMileage: "",
    planOutDate: "",
    planBackDate: "",
    vehicleInfo: "",
    createDate: "",
    backDay: "",
    backTime: "",
    remarks: ""
  }),
  useOpts: () => [],
  handleAddUserNames: () => {}
});

const formRef = ref();
const loading = ref(false);
const formData = ref(props.formInline);
const licensePlate = ref([]); // 车牌号码下拉列表

onMounted(() => {
  getCarNumbers();
  getDetail();
});

watch(props, watchUpdata, { deep: true });

function watchUpdata(values) {
  formData.value = values.formInline;
}

const filterConfigs = computed(() => {
  return formConfigs({
    type: props.type,
    carsOpts: licensePlate,
    formData: formData,
    useOpts: props.useOpts,
    handleAddUserNames: props.handleAddUserNames
  });
});

// 车牌列表
function getCarNumbers() {
  getCarOptions({ state: 1 })
    .then((res) => {
      const data: any = res.data;
      if (!data) return;
      const options = data.map(({ plateNumber, id }) => ({ label: plateNumber, value: id }));
      licensePlate.value = options;
    })
    .catch(console.log);
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
        formData.value.plateNumber = row?.goOutVehicleVO?.carId ?? "";
        formData.value.outMileage = row?.goOutRegisterVO?.outMileage ?? "";
        formData.value.backMileage = row?.goOutBackRegisterVO?.backMileage ?? "";
        formData.value.userNames = String(row?.userNames) ?? "";
        formData.value.backDay = row?.goOutBackRegisterVO?.realBackDate?.split(" ")[0] ?? "";
        formData.value.backTime = row?.goOutBackRegisterVO?.realBackDate?.split(" ")[1] ?? "";
      })
      .catch(() => (loading.value = false));
  }
}

function getRef() {
  return formRef.value.getRef();
}

defineExpose({ getRef });
</script>
