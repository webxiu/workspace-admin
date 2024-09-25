<template>
  <el-button-group class="group-btns" style="display: inline-flex">
    <el-button
      v-for="item in buttonsConfig"
      :key="item.value"
      :dark="true"
      :class="item.value === active ? 'active' : ''"
      @click="() => onClick(item)"
      size="small"
      type="primary"
      v-bind="$attrs"
    >
      {{ item.label }}
    </el-button>
  </el-button-group>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
export interface ButtonOptionType {
  label: string;
  value: string;
}

const props = defineProps({
  /** 颜色 */
  active: { type: String, default: "" },
  /** 颜色 */
  color: { type: String, default: "#f60" },
  /** 配置按钮组 */
  buttonsConfig: { type: Array as PropType<ButtonOptionType[]>, default: () => [] }
});

const active = ref(props.active);
const emits = defineEmits(["change"]);
watch(props, (val) => (active.value = val.active));

const onClick = (item: ButtonOptionType) => {
  active.value = item.value;
  emits("change", item.value);
};
</script>

<style scoped lang="scss">
.group-btns button {
  background-color: transparent;

  &.active {
    background-color: rgb(24 95 195 / 48%);
  }
}
</style>
