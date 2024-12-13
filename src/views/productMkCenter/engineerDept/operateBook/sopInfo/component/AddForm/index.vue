<template>
  <div class="flex-1 m-8 pt-10 br-4 ui-ovy-a border-line" style="max-height: calc(100vh - 173px)">
    <EditForm
      :formConfigs="formConfig"
      :formRules="formRules"
      :formInline="formData"
      :formProps="{ labelWidth: '110px', labelPosition: 'top' }"
      @submit="onSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { fileToBase64 } from "@/utils/common";
import { DomainItem } from "../InputUpload.vue";
import { formConfigs, formRules } from "./config";
import EditForm from "@/components/EditForm/index.vue";
import { OperateBookStationItemType } from "@/api/oaManage/productMkCenter";

export interface ImageItemType {
  withToolFixture: string;
  jobContent: string;
  precautions: string;
  imgList: DomainItem[];
}

const props = defineProps<{ row: OperateBookStationItemType }>();
const emits = defineEmits(["change", "handleImg"]);

const baseApi = import.meta.env.VITE_BASE_API;
const formConfig = ref(
  formConfigs({
    disabled: props.row?.id,
    onHandleImg: (arg) => emits("handleImg", ...arg)
  })
);
const formData = ref<ImageItemType>({ withToolFixture: "", jobContent: "", precautions: "", imgList: [] });

watch(formData, getBase64Image, { deep: true });
watch(props, ({ row }) => getImageList(row), { immediate: true, deep: true });

async function getBase64Image(data: ImageItemType) {
  for (const item of data.imgList) {
    const files = item.file;
    if (files?.length && files[0]?.raw) {
      const res = await fileToBase64(files[0]?.raw);
      item.tempPath = res;
    }
  }
  emits("change", { ...data, imgList: data.imgList });
}

// 图片回显
function getImageList(row: OperateBookStationItemType) {
  if (!row) return;
  formConfig.value = formConfigs({
    disabled: !row?.id,
    onHandleImg: (...arg) => emits("handleImg", ...arg)
  });
  // 图片回显
  const imgList = row?.jobEngineeringVOS.map((m) => {
    let file = [];
    if (m?.tempPath || m?.filePath) {
      const url = m?.tempPath || baseApi + m.filePath;
      file = [{ url: url, name: "" }];
    }

    return {
      id: m.id,
      sort: m.sort,
      description: m.description,
      workStationId: m.workStationId,
      file: file
    };
  });

  formData.value = {
    withToolFixture: row?.contentVO?.withToolFixture ?? "",
    jobContent: row?.contentVO?.jobContent ?? "",
    precautions: row?.contentVO?.precautions ?? "",
    imgList: row?.jobEngineeringVOS?.length ? imgList : []
  };
}

function onSubmit() {
  return formData.value;
}

defineExpose({ submit: onSubmit });
</script>
