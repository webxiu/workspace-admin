<template>
  <div class="ui-w-100 ui-p-r">
    <div id="editor-wrapper" class="border-line ui-w-100">
      <!-- <div id="toolbar-container" /> -->
      <div ref="editRef" :style="{ height: height + 'px' }" />
    </div>
  </div>
</template>

<script setup lang="ts">
import "@wangeditor/editor/dist/css/style.css";
import { createEditor, createToolbar, IDomEditor } from "@wangeditor/editor";
import { onMounted, ref, watch, onBeforeUnmount } from "vue";

interface Props {
  modelValue?: string;
  placeholder?: string;
  height?: number;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  height: 80,
  disabled: false
});
const emit = defineEmits(["update:modelValue"]);
const html = ref(props.modelValue);
const editor = ref();
const editRef = ref();

onMounted(() => onCreate());
watch(props, (val) => {
  if (editor.value) {
    editor.value.setHtml(val.modelValue);
  }
  setDesable();
});

onBeforeUnmount(() => {
  if (editor.value) editor.value.destroy();
});

function onCreate() {
  editor.value = createEditor({
    selector: editRef.value,
    html: html.value || "<p><br></p>",
    config: {
      placeholder: props.placeholder || "请输入",
      onChange(editor: IDomEditor) {
        let html = editor.getHtml();
        if (html === "<p><br></p>") html = "";
        emit("update:modelValue", html);
      }
    },
    mode: "default" // default or 'simple'
  });
  setDesable();
  //   const toolbar = createToolbar({
  //     editor: editor.value,
  //     selector: "#toolbar-container",
  //     config: {},
  //     mode: "default" // or 'simple'
  //   });
}

function setDesable() {
  if (props.disabled) {
    editor.value?.disable();
  } else {
    editor.value?.enable();
  }
}
</script>

<style lang="scss" scoped>
:deep(#editor-wrapper .w-e-text-container p) {
  margin: 5px 0;
}

:deep(#editor-wrapper .w-e-text-container .w-e-text-placeholder) {
  top: 0;
}
</style>
