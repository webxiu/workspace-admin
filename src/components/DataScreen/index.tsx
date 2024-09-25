/*
 * @Author: Hailen
 * @Date: 2024-04-17 09:22:45
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-04-28 17:18:25
 */

import "./index.scss";

import { CSSProperties, PropType, computed, defineComponent, onMounted, onUnmounted } from "vue";
import { Col, Container, Row } from "./layout";
import type { ColProps, RowProps } from "element-plus";

import { Star } from "./component";
import { onScaleView } from "./component/utils";

/** 新增类型 */
export interface CustomItemType {
  /** 布局方式(渲染组件row、col) */
  type?: "col" | "row";
  /** 布局方向(排成行、列) */
  direction?: "column" | "row";
  /** 组件 */
  comp?: JSX.Element;
  style?: CSSProperties;
  children?: Array<GridItemType>;
}

/** 布局item */
export type GridItemType = RowProps | ColProps | CustomItemType;

const props = {
  /** 布局高度 */
  height: { type: String, default: "100vh" },
  /** 字体颜色 */
  color: { type: String, default: "#fff" },
  /** 样式 */
  style: { type: Object, default: () => ({}) },
  /** 背景 */
  bgColor: { type: String, default: "rgb(4 23 66 / 50%)" },
  /** 加载状态 */
  loading: { type: Boolean, default: false },
  /** 布局配置 */
  gridConfig: { type: Array as PropType<GridItemType>, default: () => [] }
};

export default defineComponent({
  name: "DataScreen",
  props: props,
  emits: ["refresh"],
  setup(props, { emit, slots }) {
    const appDom = document.querySelector("#app") as HTMLDivElement;
    onMounted(() => {
      appDom && (appDom.dataset.mask = "big-screen-mask");
      onScaleView(".data-screen-box", { baseWidth: 1920, baseHeight: 919 });
    });
    onUnmounted(() => appDom && appDom.removeAttribute("data-mask"));

    /** 渲染网格配置 */
    const renderGrid = (arr) => {
      if (!arr?.length) return null;
      return arr.map((item, idx) => {
        return (
          <Row gutter={item.gutter} key={idx} direction={item.direction} style={item.style}>
            {item.children ? (
              item.children.map((cell, i) => (
                <Col span={cell.span} key={i} style={cell.style}>
                  {cell.type ? renderGrid(cell.children) : cell.comp}
                </Col>
              ))
            ) : (
              <Col span={item.span} key={idx} style={item.style}>
                {item.comp}
              </Col>
            )}
          </Row>
        );
      });
    };

    const boxStyle = computed(() => {
      const { color, bgColor, height, style } = props;
      return { color, backgroundColor: bgColor, height, ...style };
    });
    return () => (
      <div class="flex flex-1 dataScreen" v-loading={props.loading} style={boxStyle}>
        <Star />
        <Container>{{ header: slots.header, content: () => renderGrid(props.gridConfig) }}</Container>
      </div>
    );
  }
});
