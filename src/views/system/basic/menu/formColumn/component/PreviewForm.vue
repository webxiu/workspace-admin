<script setup lang="ts">
import { ref, watch, reactive } from "vue";
import { ItemKey, getFormConfigs } from "@/utils/form";
import { Finished } from "@element-plus/icons-vue";
import { FormColumnItemType } from "@/api/systemManage";
import { ElNotification, type FormProps, type FormRules } from "element-plus";
import EditForm, { FormConfigItemListType } from "@/components/EditForm/index.vue";

const props = defineProps<{ height: number; columnList: FormColumnItemType[] }>();
const formProps = reactive<Partial<FormProps>>({ labelWidth: "100px", requireAsteriskPosition: "right", inlineMessage: true });
const formData = ref<Record<string, any>>({ id: "" });
const formConfigs = ref<FormConfigItemListType>([]);
const formRules = ref<FormRules>({});
const formRef = ref();

watch(props, () => loadData(), { immediate: true });
watch(
  formData,
  (value) => {
    console.log("表单数据:", value);
  },
  { deep: true }
);

function loadData() {
  // 需要渲染option数据项的表单
  const inputs = [ItemKey.select, ItemKey.treeSelect, ItemKey.radio, ItemKey.checkbox];
  // 移除className字段, 为null时绑定表单会把样式清除
  const columnList = props.columnList.map(({ className, ...rest }) => {
    if (inputs.includes(rest.itemType as ItemKey)) {
      const { optionName, optionValue, method, apiURL, enumKey } = JSON.parse(rest.formatType || "{}");
      if (!apiURL && method === "custom" && !enumKey) {
        const label = optionName || "optionName";
        const value = optionValue || "optionValue";
        rest.dataOption = [
          { [label]: "选项一", [value]: "1" },
          { [label]: "选项二", [value]: 2 },
          { [label]: "选项三", [value]: "3" }
        ];
      }
    }
    return rest;
  });
  const result = getFormConfigs(columnList);
  console.log("表单配置项(原始):", props.columnList);
  console.log("表单配置项(结果):", result);
  formData.value = result.formData;
  formConfigs.value = result.formColumns;
  formRules.value = result.formRules;
}

function onTestSubmit() {
  const FormRef = formRef.value.getRef();
  FormRef.validate((valid) => {
    const message = `<pre><code>${JSON.stringify(formData.value, null, 2)}</code></pre>`;
    if (valid) {
      ElNotification({ title: "校验通过:", dangerouslyUseHTMLString: true, message, type: "success" });
    } else {
      ElNotification({ title: "校验失败:", dangerouslyUseHTMLString: true, position: "bottom-right", message, type: "error" });
    }
  });
}
</script>

<template>
  <div class="flex-1 pr-10">
    <div class="flex just-between align-center">
      <div class="no-wrap block-quote-tip ui-w-100 ml-8 mt-8 mb-8">表单预览<span class="fz-14 color-f00 ml-1">(布局预览、表单验证)</span></div>
      <el-button type="warning" @click="onTestSubmit" :icon="Finished" class="ml-50">测试提交</el-button>
    </div>
    <div class="flex-1 ui-ovy-a" :style="{ height: props.height + 'px' }">
      <EditForm
        ref="formRef"
        :formInline="formData"
        :formConfigs="formConfigs"
        :formProps="formProps"
        :formRules="formRules"
        :formItemGutter="0"
        :loading="false"
      />
    </div>
  </div>
</template>
