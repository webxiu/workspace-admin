<template>
  <div class="purchase-wrap" v-loading="loading">
    <div class="flex-col align-center">
      <!-- <img src="@/assets/logo/print_color_logo.png" width="100%" /> -->
      <p class="title">采购询价单</p>
    </div>
    <EditForm
      ref="formRef"
      size="small"
      :formInline="formData"
      :formItemGutter="0"
      :formRules="formRules"
      :formProps="{ labelWidth: '150px', requireAsteriskPosition: 'right', inlineMessage: true }"
      :formConfigs="formConfigs()"
      class="border-form"
    />
  </div>
</template>

<script setup lang="ts">
import { formRules, formConfigs } from "./utils/config";
import EditForm from "@/components/EditForm/index.vue";
import { reactive, ref } from "vue";
import { QuoteApplyItemType } from "@/api/oaManage/marketing";

const props = defineProps<{ row?: QuoteApplyItemType }>();

const formRef = ref();
const formData = reactive({ ...props.row });
const loading = ref(false);
function getRef() {
  return formRef.value.getRef();
}

defineExpose({ getRef, formData });
</script>

<style lang="scss">
$color: #111;
$size: 16px;

.purchase-wrap {
  font-family: "宋体", Arial, sans-serif, serif;
  color: $color;

  .title {
    flex: 1;
    margin-bottom: 10px;
    font-size: 30px;
    font-weight: bold;
    color: $color;
  }

  .el-input__prefix {
    display: none;
  }

  .el-form-item label,
  .el-input__inner,
  .el-textarea__inner {
    font-family: "宋体", Arial, sans-serif, serif;
    font-size: $size;
    color: $color;
    cursor: default;
  }
}
</style>
