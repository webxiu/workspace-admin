import { PropType, defineComponent, h } from "vue";
import dayjs, { Dayjs } from "dayjs";

import { RangePicker } from "ant-design-vue";

const presets = [
  { label: "最近1年", value: [dayjs().add(0, "year"), dayjs()] },
  { label: "最近2年", value: [dayjs().add(-1, "year"), dayjs()] },
  { label: "最近3年", value: [dayjs().add(-2, "year"), dayjs()] },
  { label: "最近4年", value: [dayjs().add(-3, "year"), dayjs()] },
  { label: "最近5年", value: [dayjs().add(-4, "year"), dayjs()] },
  { label: "最近6年", value: [dayjs().add(-5, "year"), dayjs()] },
  { label: "最近7年", value: [dayjs().add(-6, "year"), dayjs()] },
  { label: "最近8年", value: [dayjs().add(-7, "year"), dayjs()] },
  { label: "最近9年", value: [dayjs().add(-8, "year"), dayjs()] },
  { label: "最近10年", value: [dayjs().add(-9, "year"), dayjs()] }
];

export default defineComponent({
  name: "RangePickerYear",
  props: {
    // 更多属性配置查看: https://www.antdv.com/components/date-picker-cn#api
    picker: String as PropType<string>,
    format: Array as PropType<"YYYY"[]>,
    valueFormat: String as PropType<"YYYY">,
    allowClear: Boolean,
    modelValue: { type: Array, default: () => [] }
  },
  emits: ["update:modelValue"],
  setup(props, { emit, slots, attrs }) {
    return { emit, slots, attrs };
  },
  render() {
    /**
     * 用法相同
     * this.$attrs === this.attrs
     * this.$slots === this.slots
     * this.$emit === this.emit
     * ...
     */
    return h(
      RangePicker,
      {
        presets,
        picker: "year",
        format: ["YYYY", "YYYY"],
        valueFormat: "YYYY",
        allowClear: false,
        ...this.$attrs,
        value: this.modelValue,
        onChange: (val: Dayjs[]) => this.emit("update:modelValue", val)
      },
      { ...this.$slots }
    );
  }
});
