<template>
  <el-input ref="myRef" v-model="numValue" @blur="onBlur" size="small" v-bind="$attrs" />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { message } from "@/utils/message";
/** 正则输入框 */
const props = defineProps(["modelValue", "pattern", "error", "autoFocus", "autoSelect", "isNumber"]);
const emits = defineEmits(["update:modelValue", "blur"]);
const numValue = ref(props.modelValue);
const myRef = ref();

onMounted(() => {
  if (props.autoFocus) myRef.value.focus();
  if (props.autoSelect) myRef.value.select();
});

function onBlur(e) {
  const regex = props.pattern;
  let value = numValue.value;
  if (value && regex && !regex.test(value)) {
    value = props.modelValue;
    message(props.error || "输入格式不正确", { type: "error" });
  } else {
    if (props.isNumber) {
      value = Number.isNaN(+value) ? props.modelValue : +value;
    }
  }
  emits("update:modelValue", value);
  emits("blur", e);
}
</script>
