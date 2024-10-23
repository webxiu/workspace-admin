<template>
  <div class="mold-wrap" ref="printRef">
    <div class="flex align-center">
      <img src="@/assets/logo/print_color_logo.png" width="40%" />
      <p class="title">开模申请单</p>
    </div>
    <div class="ui-ta-r fz-8 mt-10">
      <span>FORM:QR-RD-024-03X</span>
    </div>
    <EditForm
      size="small"
      :formInline="formData"
      :formItemGutter="0"
      :formProps="{ labelWidth: '140px', requireAsteriskPosition: 'right', inlineMessage: true }"
      :formConfigs="printFormConfigs({ onPreviewImg })"
      class="border-form"
    />
  </div>
  <el-dialog v-model="dialogVisible" :append-to-body="true" :draggable="true" class="goods-dialog">
    <el-image :src="dialogImageUrl" fit="contain" :zoom-rate="1.2" :preview-src-list="[dialogImageUrl]" :hide-on-click-modal="true">
      <template #error>
        <div class="el-image__error">暂无图片</div>
      </template>
    </el-image>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import Print from "@/utils/print";
import { printFormConfigs } from "./utils/config";
import { MoldApplyItemType } from "@/api/plmManage";
import EditForm from "@/components/EditForm/index.vue";

const props = defineProps<{ row?: MoldApplyItemType }>();
const baseApi = import.meta.env.VITE_BASE_API;

const printRef = ref();
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const formData = ref({
  ...props.row,
  user1: "张三xxx",
  user2: "张三xxx",
  user3: "张三xxx",
  user4: "张三xxx",
  user5: "当前审批流程未配置, 无审批信息xxx",
  user6: "张三xxx",
  modelType: props.row?.modelType?.split(",") || [],
  dataProvides: props.row?.dataProvides?.split(",") || [],
  plmBillFiles: props.row?.plmBillFiles?.map((m) => ({ ...m, url: baseApi + m.filePath + "/" + m.fileName }))
});

watch(props, (newVal) => {
  Object.keys(newVal.row).forEach((el) => {
    formData.value[el] = newVal.row[el];
    switch (el) {
      case "modelType":
        formData.value[el] = newVal.row[el]?.split(",") || [];
        break;
      case "dataProvides":
        formData.value[el] = newVal.row[el]?.split(",") || [];
        break;
      case "plmBillFiles":
        formData.value[el] = newVal.row[el]?.map((m) => ({ ...m, url: baseApi + m.filePath + "/" + m.fileName }));
        break;
      default:
        break;
    }
  });
});

const onPreviewImg = ({ url }) => {
  dialogImageUrl.value = url;
  dialogVisible.value = true;
};
const onPrint = () => {
  if (printRef.value) {
    Print(printRef.value);
  }
};

defineExpose({ onPrint });
</script>

<style lang="scss">
@media print {
  @page {
    size: a4 portrait;
    margin: 10mm;
  }
  .el-checkbox__inner {
    print-color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
  }
}

.mold-wrap {
  padding: 1px;
  .title {
    flex: 1;
    font-size: 28px;
    color: #111;
    margin-left: 50px;
    text-decoration: underline;
    font-family: "宋体", Arial, sans-serif, serif;
  }
  .el-input__prefix {
    display: none;
  }
  .el-checkbox {
    margin-right: 10px;
  }

  // 上传
  .el-upload-list__item {
    width: 130px;
    height: 130px;
    transition: none !important;
  }
  .el-upload--picture-card {
    display: none;
  }
  .el-upload-list__item-status-label {
    display: none !important;
  }
}
</style>
