<!-- /*
 * @Author: Hailen 
 * @Date: 2024-10-29 11:16:25 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2024-10-29 11:16:25 
 */ -->
<script lang="tsx">
import { h, ref, watch, DefineComponent, defineComponent, PropType } from "vue";
import { addDialog } from "@/components/ReDialog";
import { message } from "@/utils/message";
import { setRouterInfo } from "@/utils/storage";
import { ButtonProps } from "element-plus";
import SelectTable, { SelectTableProp } from "./SelectTable.vue";

const props = {
  /** 弹窗标题 */
  title: { type: String, default: "标题" },
  /** 值属性字段 */
  valueKey: { type: String },
  /** 弹窗宽度 */
  width: { type: [String, Number], default: "720px" },
  /** 弹窗宽度 */
  showButton: { type: Boolean, default: false },
  /** 页面标识 PageUrl 配置的值(引入其他菜单入口页面) */
  pageKey: { type: String },
  /** 弹窗渲染组件属性 */
  componentProp: { type: Object as PropType<SelectTableProp>, default: () => ({}) },
  /** 弹窗渲染组件(非必传) */
  component: { type: Object as PropType<DefineComponent<{}, {}, any>>, default: SelectTable },
  /** 按钮属性 */
  buttonProp: { type: Object as PropType<Partial<ButtonProps>>, default: () => ({}) },
  /** 弹窗前拦截方法(拦截返回true, 不拦截返回false) */
  interceptFn: { type: Function as PropType<() => boolean> },
  placeholder: { type: String },
  size: { type: String },
  disabled: { type: Boolean },
  readonly: { type: Boolean },
  modelValue: { type: [String, Number] }
};

export const HxModalInput = defineComponent({
  props: props,
  emits: ["update:modelValue", "select", "blur", "change", "mulSelect"],
  setup(props, { emit, expose, attrs, slots }) {
    const { title, width, componentProp, pageKey, disabled, interceptFn = () => false } = props;
    const multiple = componentProp.multiple;
    const value = ref();
    const rowData = ref();
    const rowsData = ref([]);
    let resultDialog;
    watch(props, (val) => (value.value = val.modelValue), { immediate: true });

    function showModal() {
      if (disabled || interceptFn()) return;
      if (!pageKey) return openModal();
      setRouterInfo(pageKey, () => openModal());
    }

    function onFinish(callback) {
      // 多选
      if (multiple) {
        const rows = rowsData.value;
        if (!rows.length) return message.error("请勾选记录");
        emit("mulSelect", rows);
        return callback();
      }
      // 单选
      const row = rowData.value;
      if (!row) return message.error("请选择记录");
      value.value = row[props.valueKey];
      emit("update:modelValue", value.value);
      emit("select", row);
      callback();
    }
    function onSelect(val) {
      rowData.value = val;
    }
    function onDbClick(val) {
      if (multiple) return;
      rowData.value = val;
      onFinish(() => (resultDialog.options.value.visible = false));
    }
    function onMulSelect(val) {
      rowsData.value = val;
    }

    function openModal() {
      resultDialog = addDialog({
        props: componentProp,
        title: title,
        width: width,
        draggable: true,
        fullscreenIcon: true,
        closeOnClickModal: false,
        contentRenderer: () => h(props.component, { onSelect, onDbClick, onMulSelect }),
        beforeSure: (done) => onFinish(() => done())
      });
    }

    function onChange(val) {
      emit("change", val);
      emit("update:modelValue", value.value);
    }
    function onBlur(val) {
      emit("blur", val);
    }
    return () => (
      <>
        {props.showButton ? (
          <el-input
            v-model={value.value}
            size={props.size}
            readonly={props.readonly}
            disabled={props.disabled}
            placeholder={props.placeholder}
            onBlur={onBlur}
            onChange={onChange}
          >
            {{
              append: () => (
                <el-button onClick={showModal} size={props.size} {...props.buttonProp}>
                  选择
                </el-button>
              )
            }}
          </el-input>
        ) : (
          <el-input
            v-model={value.value}
            readonly={props.readonly}
            disabled={props.disabled}
            placeholder={props.placeholder}
            onBlur={onBlur}
            onChange={onChange}
            onClick={showModal}
          />
        )}
      </>
    );
  }
});

export default HxModalInput;
</script>
