/*
 * @Author: lixiuhai
 * @Date: 2024-04-17 09:22:45
 * @Last Modified by: lixiuhai
 * @Last Modified time: 2024-04-17 14:42:46
 */

import "./index.scss";

import { CSSProperties, PropType, defineComponent } from "vue";
import type { ColProps, RowProps } from "element-plus";

import Col from "./Col.vue";
import Container from "./Container.vue";
import Row from "./Row.vue";

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
  height: { type: String, default: "100vh" },
  loading: { type: Boolean, default: false },
  gridConfig: { type: Array as PropType<GridItemType>, default: () => [] }
};

export default defineComponent({
  name: "DataScreenGrid",
  props: props,
  emits: [],
  setup(props, ctx) {
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

    return () => (
      <div class="flex flex-1 dataScreen" v-loading={props.loading} style={{ height: props.height }}>
        <Container>{renderGrid(props.gridConfig)}</Container>
      </div>
    );
  }
});
