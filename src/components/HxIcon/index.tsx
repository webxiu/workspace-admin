import * as ElementPlusIconsVue from "@element-plus/icons-vue";

import { PropType, defineComponent, h } from "vue";

import type { ElIcon } from "element-plus";

export type IconType = keyof typeof ElementPlusIconsVue;

// 继承 el-icon 的 props 类型
type ElIconProps = InstanceType<typeof ElIcon>["$props"];

export interface HxIconProps extends Omit<ElIconProps, "icon"> {
  /** 图标名称 */
  icon: IconType;
}

export const HxIcon = defineComponent({
  props: {
    icon: { type: String as PropType<IconType>, required: true, default: "" }
  },
  name: "HxIcon",
  setup(props) {
    const { icon } = props;
    const IconComponent = ElementPlusIconsVue[icon];
    return () => <el-icon>{h(IconComponent)}</el-icon>;
  }
});

export default HxIcon;
