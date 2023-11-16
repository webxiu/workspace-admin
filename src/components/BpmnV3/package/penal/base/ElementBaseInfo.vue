<template>
  <div class="panel-tab__content">
    <el-form size="small" label-width="90px" @submit.prevent>
      <el-form-item label="ID">
        <el-input v-model="elementBaseInfo.id" :disabled="idEditDisabled" clearable @change="updateBaseInfo('id')" />
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="elementBaseInfo.name" clearable @change="updateBaseInfo('name')" />
      </el-form-item>
      <!--流程的基础属性-->
      <template v-if="elementBaseInfo.$type === 'bpmn:Process'">
        <el-form-item label="版本标签">
          <el-input v-model="elementBaseInfo.versionTag" clearable @change="updateBaseInfo('versionTag')" />
        </el-form-item>
        <el-form-item label="可执行">
          <el-switch v-model="elementBaseInfo.isExecutable" active-text="是" inactive-text="否" @change="updateBaseInfo('isExecutable')" />
        </el-form-item>
      </template>
      <el-form-item v-if="elementBaseInfo.$type === 'bpmn:SubProcess'" label="状态">
        <el-switch v-model="elementBaseInfo.isExpanded" active-text="展开" inactive-text="折叠" @change="updateBaseInfo('isExpanded')" />
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, watch, nextTick } from "vue";

const props = withDefaults(
  defineProps<{
    businessObject: object;
    type: string;
    idEditDisabled?: boolean;
  }>(),
  {
    idEditDisabled: true
  }
);

const elementBaseInfo = ref({});
const bpmnElement = ref();

watch(props, (val) => {
  if (val.businessObject) {
    nextTick(() => resetBaseInfo());
  }
});

const resetBaseInfo = () => {
  bpmnElement.value = window?.bpmnInstances?.bpmnElement || {};
  elementBaseInfo.value = JSON.parse(JSON.stringify(bpmnElement.value.businessObject));
  if (elementBaseInfo.value && elementBaseInfo.value.$type === "bpmn:SubProcess") {
    elementBaseInfo.value.isExpanded = elementBaseInfo.value.di?.isExpanded;
    // this.$set(elementBaseInfo.value, "isExpanded", elementBaseInfo.value?.di?.isExpanded);
  }
};
const updateBaseInfo = (key) => {
  if (key === "id") {
    window.bpmnInstances.modeling.updateProperties(bpmnElement.value, {
      id: elementBaseInfo.value[key],
      di: { id: `${elementBaseInfo.value[key]}_di` }
    });
    return;
  }
  if (key === "isExpanded") {
    window?.bpmnInstances?.modeling.toggleCollapse(bpmnElement.value);
    return;
  }
  const attrObj = Object.create(null);
  attrObj[key] = elementBaseInfo.value[key];
  window.bpmnInstances.modeling.updateProperties(bpmnElement.value, attrObj);
};
</script>
