<script setup lang="ts">
import { queryuser } from "@/api/user/user";
import EditForm from "@/components/EditForm/index.vue";
import { getUserInfo } from "@/utils/storage";
import dayjs from "dayjs";
import { onMounted, reactive, ref } from "vue";
import { formConfigs, formRules } from "./topFormConfig";

/** 接收信息中心单据处理引入传递的参数 */
const props = withDefaults(defineProps<{ infoId: string }>(), {
  infoId: () => ""
});

const userInfo = getUserInfo();
const formRef = ref();

const formData: any = reactive({
  productName: "",
  customerModel: "",
  deograModel: "",
  devTypeSelect: [],
  saleArea: "",
  customerName: "",
  referenceModel: "",
  productLevelSelect: [],
  applyDeptId: userInfo.deptId,
  applyUserCode: userInfo.userCode,
  applyTime: dayjs(`${new Date()}`).format("YYYY-MM-DD"),
  projectPhaseSelect: []
});

onMounted(() => {
  queryuser().then((res) => {
    if (res.data) {
      formData.applyDeptId = res.data.deptName;
      formData.applyDeptIdCopy = userInfo.deptId;
      formData.applyUserCode = res.data.userName;
      formData.applyUserCodeCopy = userInfo.userCode;
    }
  });
});

defineExpose({ formData, formRef });
</script>

<template>
  <div class="top-form">
    <EditForm
      ref="formRef"
      :form-configs="formConfigs({ infoId: props.infoId })"
      :form-props="{ requireAsteriskPosition: 'right', inlineMessage: true }"
      :form-item-gutter="0"
      :form-rules="formRules"
      :form-inline="formData"
    />
  </div>
</template>

<style scoped lang="scss">
.top-form {
  font-size: 0;

  :deep(.el-form) {
    padding: 0;
    border-top: 1px solid black;
    border-left: 1px solid black;
  }

  :deep(.el-form-item) {
    margin-bottom: 0;
    border-right: 1px solid black;
    border-bottom: 1px solid black;
  }

  :deep(.el-form-item__label) {
    padding-left: 10px;
    border-right: 1px solid black;
    border-right: 1px solid #aaa;
    // border-bottom: 1px solid #aaa;
    // border-left: 1px solid #aaa;
  }

  :deep(.el-input__wrapper) {
    padding-left: 0;
    cursor: default;
    border-radius: 0 !important;
    box-shadow: 0 0 0 0 var(--el-input-border-color, var(--el-border-color)) inset;

    .el-input__inner {
      cursor: default !important;
    }
  }

  :deep(.el-form-item__content) {
    padding-left: 10px;
  }
}
</style>
