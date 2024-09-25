<template>
  <div :class="['border-box', borderImg]" v-bind="$attrs">
    <MainTitle :showTitle="showTitle" :showBg="showBg" :title="oTitle" />
    <div v-if="className" :class="className" class="flex-1 ui-h-100" />
    <div v-if="oLoading" style="position: absolute; font-size: 12px; opacity: 0.5">暂无数据</div>
    <slot name="default" />
  </div>
</template>

<script setup lang="ts">
import { Ref, ref } from "vue";
import { MainTitle } from "@/components/DataScreen/component";
import { watch } from "vue";
export type BorderImgType = "borderLine" | "borderImg" | "borderTitle2";
interface Props {
  /** 图表挂载节点 */
  className: string;
  /** 标题 */
  title?: string;
  loading?: Ref<boolean>;
  showBg?: boolean;
  showTitle?: boolean;
  borderImg?: BorderImgType;
}

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<Props>(), {
  showBg: true,
  showTitle: true,
  loading: () => ref(false),
  borderImg: "borderImg"
});

const oLoading = ref(false);
const oTitle = ref("");
watch(
  props,
  ({ loading, title }) => {
    oLoading.value = loading.value;
    oTitle.value = title;
  },
  { immediate: true }
);
</script>
