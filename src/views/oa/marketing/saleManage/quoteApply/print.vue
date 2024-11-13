<template>
  <div class="apply-wrap" v-loading="loading">
    <div class="flex-col align-center">
      <!-- <img src="@/assets/logo/print_color_logo.png" width="100%" /> -->
      <p class="title">报价申请单</p>
    </div>
    <EditForm
      ref="formRef"
      size="small"
      :formInline="formData"
      :formItemGutter="0"
      :formRules="formRules"
      :formProps="{ labelWidth: '160px', requireAsteriskPosition: 'right', inlineMessage: true }"
      :formConfigs="formConfigs()"
      class="border-form"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import EditForm from "@/components/EditForm/index.vue";
import { formRules, formConfigs } from "./utils/config";
import { QuoteApplyItemType } from "@/api/oaManage/marketing";

const props = defineProps<{ row?: QuoteApplyItemType }>();
const formRef = ref();
const loading = ref(false);
const formData = reactive({ ...props.row });

function getRef() {
  return formRef.value.getRef();
}

defineExpose({ getRef, formData });
</script>

<style lang="scss">
$color: #111;
$size: 16px;

.apply-wrap {
  color: $color;
  font-family: "宋体", Arial, sans-serif, serif;
  .title {
    flex: 1;
    font-size: 30px;
    color: $color;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .dynamic-form-item > .el-form-item__content {
    overflow: hidden;
  }
  .el-input__prefix {
    display: none;
  }

  .el-form-item label,
  .el-input__inner,
  .el-textarea__inner {
    font-size: $size;
    font-family: "宋体", Arial, sans-serif, serif;
    color: $color;
    cursor: default;
  }
}
</style>
