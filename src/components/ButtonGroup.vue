<template>
  <el-button-group style="display: inline-flex">
    <el-button v-for="item in buttonsConfig" :key="item.value" :color="item.value === modelValue ? color : ''" @click="() => onClick(item)" v-bind="$attrs">
      {{ item.label }}
    </el-button>
  </el-button-group>
</template>

<script setup lang="ts">
export interface ButtonOptionType {
  label: string;
  value: string | number;
}

defineProps({
  /** 默认值 */
  modelValue: { type: [String, Number], default: "" },
  /** 颜色 */
  color: { type: String, default: "#79bbff" },
  /** 配置按钮组 */
  buttonsConfig: { type: Array as PropType<ButtonOptionType[]>, default: () => [] }
});

const emits = defineEmits(["update:modelValue", "change"]);

const onClick = (item: ButtonOptionType) => {
  emits("update:modelValue", item.value);
  emits("change", item.value);
};
</script>
