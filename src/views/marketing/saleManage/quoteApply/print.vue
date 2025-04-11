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
      :formConfigs="formConfigs({ currencyList, isEdit })"
      class="border-form"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import EditForm from "@/components/EditForm/index.vue";
import { formRules, formConfigs } from "./utils/config";
import { QuoteApplyItemType } from "@/api/oaManage/marketing";
import { getEnumDictList } from "@/utils/table";
import { OptionItemType } from "@/api/plmManage";

const props = defineProps<{ row?: QuoteApplyItemType; isEdit?: boolean }>();
const formRef = ref();
const loading = ref(false);
const formData = reactive({ ...props.row });
const currencyList = ref<OptionItemType[]>([]);

onMounted(() => {
  loading.value = true;
  getEnumDictList(["Currency"])
    .then(({ Currency }) => (currencyList.value = Currency))
    .finally(() => (loading.value = false));
});

function getRef() {
  return formRef.value.getRef();
}

defineExpose({ getRef, formData });
</script>

<style lang="scss">
$color: #111;
$size: 16px;

.apply-wrap {
  font-family: "宋体", Arial, sans-serif, serif;
  color: $color;

  .title {
    flex: 1;
    margin-bottom: 10px;
    font-size: 30px;
    font-weight: bold;
    color: $color;
  }

  .merge-item > .el-form-item__content {
    overflow: hidden;
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
