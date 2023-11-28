<template>
  <div style="margin-top: 16px">
    <el-form-item label="脚本格式">
      <el-input v-model="scriptTaskForm.scriptFormat" clearable @input="updateElementTask()" @change="updateElementTask()" />
    </el-form-item>
    <el-form-item label="脚本类型">
      <el-select v-model="scriptTaskForm.scriptType" class="ui-w-100">
        <el-option label="内联脚本" value="inline" />
        <el-option label="外部资源" value="external" />
      </el-select>
    </el-form-item>
    <el-form-item label="脚本" v-show="scriptTaskForm.scriptType === 'inline'">
      <el-input
        v-model="scriptTaskForm.script"
        type="textarea"
        resize="vertical"
        :autosize="{ minRows: 2, maxRows: 4 }"
        clearable
        @input="updateElementTask()"
        @change="updateElementTask()"
      />
    </el-form-item>
    <el-form-item label="资源地址" v-show="scriptTaskForm.scriptType === 'external'">
      <el-input v-model="scriptTaskForm.resource" clearable @input="updateElementTask()" @change="updateElementTask()" />
    </el-form-item>
    <el-form-item label="结果变量">
      <el-input v-model="scriptTaskForm.resultVariable" clearable @input="updateElementTask()" @change="updateElementTask()" />
    </el-form-item>
  </div>
</template>

<script lang="ts" setup>
import { onUnmounted, ref, toRaw } from "vue";
import { nextTick, reactive, watch } from "vue";

const props = defineProps<{ id: string; type: string }>();

const defaultTaskForm = reactive({
  scriptFormat: "",
  script: "",
  resource: "",
  resultVariable: ""
});

const scriptTaskForm = reactive({
  scriptFormat: "",
  scriptType: "",
  script: "",
  resource: "",
  resultVariable: ""
});
const bpmnElement = ref();

watch(
  props,
  (val) => {
    bpmnElement.value = window.bpmnInstances.bpmnElement;
    nextTick(() => resetTaskForm());
  },
  { immediate: true }
);

onUnmounted(() => {
  bpmnElement.value = null;
});

const resetTaskForm = () => {
  for (const key in defaultTaskForm) {
    const value = bpmnElement.value?.businessObject[key] || defaultTaskForm[key];
    scriptTaskForm[key] = value;
  }
  scriptTaskForm.scriptType = scriptTaskForm.script ? "inline" : "external";
};
const updateElementTask = () => {
  const taskAttr = Object.create(null);
  taskAttr.scriptFormat = scriptTaskForm.scriptFormat || null;
  taskAttr.resultVariable = scriptTaskForm.resultVariable || null;
  if (scriptTaskForm.scriptType === "inline") {
    taskAttr.script = scriptTaskForm.script || null;
    taskAttr.resource = null;
  } else {
    taskAttr.resource = scriptTaskForm.resource || null;
    taskAttr.script = null;
  }
  window.bpmnInstances.modeling.updateProperties(toRaw(bpmnElement.value), taskAttr);
};
</script>
