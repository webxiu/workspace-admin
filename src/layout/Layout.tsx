/*
 * @Author: Hailen
 * @Date: 2024-09-12 14:34:28
 * @Last Modified by: Hailen
 * @Last Modified time: 2025-03-14 18:17:24
 */

import type { ColProps, RowProps } from "element-plus";
import { computed, defineComponent, h, useSlots } from "vue";

import { useEleHeight } from "@/hooks";

/** =================== 内容区域自适应布局容器 =================== */
/**
 * 布局容器
 */
export const Container = defineComponent({
  props: {
    height: { type: String },
    offset: { type: Number, default: -20 }
  },
  setup(props) {
    const slots = useSlots();
    const maxHeight = useEleHeight(".app-main > .el-scrollbar", props.offset);
    return () => (
      <div style={{ height: (props.height || maxHeight.value) + "px", display: "flex", flexDirection: "column" }} {...props}>
        {slots.default?.()}
      </div>
    );
  }
});

/**
 * 行布局
 */
export const Row = defineComponent({
  props: {
    height: { type: Number },
    gutter: { type: [Number, String], default: 0 },
    align: { type: String as PropType<RowProps["align"]>, default: "start" },
    justify: { type: String as PropType<RowProps["justify"]>, default: "" }
  },
  setup(props) {
    const slots = useSlots();
    const height = computed(() => props.height || useEleHeight(".app-main > .el-scrollbar").value);
    return () => (
      <div style={{ minHeight: height.value + "px" }}>
        <el-row {...props}>{slots.default?.()}</el-row>
      </div>
    );
  }
});

/**
 * 列布局(默认按2列布局)
 * @param xs <768px
 * @param sm ≥768px
 * @param md ≥992px
 * @param lg ≥1200px
 * @param xl ≥1920px
 * :xs="24" :sm="24" :md="12" :lg="12" :xl="12"
 */
export const Col = (props: Partial<ColProps>) => {
  const slots = useSlots();
  return (
    <el-col xs={24} sm={24} md={12} lg={12} xl={12} {...props}>
      {slots.default?.()}
    </el-col>
  );
};
