<template>
  <div class="panel-tab__content">
    <div class="element-property input-property">
      <div class="element-property__label">元素文档：</div>
      <div class="element-property__value">
        <el-input
          type="textarea"
          v-model="documentation"
          size="small"
          resize="vertical"
          placeholder="选填"
          :autosize="{ minRows: 2, maxRows: 4 }"
          @input="updateDocumentation"
          @blur="updateDocumentation"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onUnmounted, toRaw } from "vue";
import { ref, watch, nextTick } from "vue";

const props = defineProps<{
  id: string;
}>();

const documentation = ref("");
const bpmnElement = ref();

watch(
  props,
  (val) => {
    if (val.id && val.id?.length) {
      nextTick(() => {
        const documentations = window.bpmnInstances.bpmnElement.businessObject?.documentation;
        documentation.value = documentations && documentations.length ? documentations[0].text : "";
      });
    } else {
      documentation.value = "";
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  bpmnElement.value = null;
});

const updateDocumentation = () => {
  (bpmnElement.value && bpmnElement.value.id === props.id) || (bpmnElement.value = window.bpmnInstances.elementRegistry.get(props.id));
  const cDocumentation = window.bpmnInstances.bpmnFactory.create("bpmn:Documentation", { text: documentation.value });
  window.bpmnInstances.modeling.updateProperties(toRaw(bpmnElement.value), {
    documentation: [cDocumentation]
  });
};
</script>
