<!-- /*
 * @Author: Hailen 
 * @Date: 2023-07-05 11:45:27 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-07-05 11:45:27 
 */ -->

<script setup lang="tsx">
import { findDataList, debounce } from "@/utils/common";
import { cloneDeep } from "@pureadmin/utils";
import { ref, watch } from "vue";

/**
 * @description: 搜索列表
 * 使用场景：
 *  1. 用于搜索列表
 *  2. 用于搜索表格
 * 使用方式：
 *  列表中使用v-html绑定到元素高亮关键词
 */

interface Props<T> {
  /** 搜索列表 */
  modelValue: T[];
  /** 搜索字段 */
  propKeys: string[];
  /** 高亮颜色 */
  color?: string;
  /** 高亮背景色 */
  background?: string;
  /** 输入框标签 */
  label?: string;
  /** 输入框提示 */
  placeholder?: string;
  /** 输入延迟时间(默认300) */
  delay?: number;
  /** 是否高亮(默认不高亮搜索关键词) */
  bright?: boolean;
}

defineOptions({ name: "SearchList" });

const dataListTemp = ref([]);
const keyword = ref("");
const props = withDefaults(defineProps<Props<any>>(), {
  modelValue: () => [],
  bright: false,
  color: "#111111",
  background: "#ffd913",
  placeholder: "请输入查询关键字",
  propKeys: () => []
});
const emits = defineEmits(["update:modelValue"]);

watch(props, ({ modelValue }) => {
  if (!dataListTemp.value.length && modelValue?.length) {
    dataListTemp.value = modelValue;
  }
});

const onChange = debounce((keyword) => {
  const { propKeys, color, background, bright } = props;
  if (!dataListTemp.value.length) throw new Error("请传入 dataList");
  if (!propKeys.length) throw new Error("请传入 propKeys");
  let resultList = findDataList(dataListTemp.value, keyword, propKeys);
  if (bright) {
    const newList = cloneDeep(resultList) as (typeof data)[];
    const getEle = (text: string) => `<span style="color:${color};background:${background}">${text}</span>`;
    newList.forEach((t) => {
      propKeys.forEach((key) => {
        const content = t[key];
        if (content?.includes(keyword)) {
          t[key] = content.replace(keyword, getEle(keyword));
        }
      });
    });
    resultList = newList;
  }
  emits("update:modelValue", resultList);
}, props.delay);
</script>

<template>
  <el-form style="width: 100%">
    <el-form-item :label="label" style="margin-bottom: 0">
      <el-input v-model.trim="keyword" :placeholder="placeholder" clearable @input="onChange">
        <template v-slot:prepend v-if="$slots.prepend">
          <slot name="prepend" />
        </template>
        <template v-slot:append v-if="$slots.append">
          <slot name="append" />
        </template>
        <template v-slot:prefix v-if="$slots.prefix">
          <slot name="prefix" />
        </template>
        <template v-slot:suffix v-if="$slots.suffix">
          <slot name="suffix" />
        </template>
      </el-input>
    </el-form-item>
  </el-form>
</template>
