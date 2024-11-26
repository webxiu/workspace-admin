<script setup lang="ts">
import { ref, watch, reactive } from "vue";
import { getFormConfigs } from "@/utils/form";
import { Finished } from "@element-plus/icons-vue";
import { FormColumnItemType } from "@/api/systemManage";
import { ElNotification, type FormProps, type FormRules } from "element-plus";
import EditForm, { FormConfigItemType } from "@/components/EditForm/index.vue";
import { Question } from "@/config/elements";

const props = defineProps<{ height: number; columnList: FormColumnItemType[] }>();
const formProps = reactive<Partial<FormProps>>({ labelWidth: "100px" });
const formData = ref<Record<string, any>>({ id: "" });
const formConfigs = ref<FormConfigItemType[]>([]);
const loading = ref<boolean>(false);
const formRules = ref<FormRules>({});
const formRef = ref();

watch(
  props,
  (value) => {
    // 获取表单配置项、校验规则、默认值
    const result = getFormConfigs({ loading, columnList: value.columnList });
    formData.value = result.formData;
    formConfigs.value = result.formColumns;
    formRules.value = result.formRules;
  },
  { immediate: true }
);

watch(
  formData,
  (value) => {
    console.log("提交数据:", value);
  },
  { deep: true }
);

function onTestSubmit() {
  const FormRef = formRef.value.getRef();
  FormRef.validate((valid) => {
    const message = `<pre><code>${JSON.stringify(formData.value, null, 2)}</code></pre>`;
    if (valid) {
      ElNotification({ title: "校验通过:", dangerouslyUseHTMLString: true, message, type: "success" });
    } else {
      ElNotification({ title: "校验失败:", dangerouslyUseHTMLString: true, message, type: "error" });
    }
  });
}
</script>

<template>
  <div class="flex-1 pr-10">
    <div class="flex just-between align-center">
      <div class="no-wrap block-quote-tip ui-w-100 ml-6 mt-10 mb-10">表单预览<span class="fz-14 color-f00 ml-1">(布局预览、内容查看、表单验证)</span></div>
      <el-button type="warning" @click="onTestSubmit" :icon="Finished" class="ml-50">测试提交</el-button>
    </div>
    <div class="flex-1 ui-ovy-a" :style="{ height: props.height + 'px' }">
      <EditForm
        ref="formRef"
        :formInline="formData"
        :formConfigs="formConfigs"
        :formProps="formProps"
        :formRules="formRules"
        :loading="false"
        class="form-config"
      />
    </div>
  </div>
</template>
