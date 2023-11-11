<!-- 
  /*
 * @Author: lixiuhai 
 * @Date: 2023-08-02 16:54:26 
 * @Last Modified by: lixiuhai
 * @Last Modified time: 2023-10-31 10:27:20
 */ 
-->

<script lang="tsx">
import { reactive, ref, defineComponent, PropType, watch, withModifiers, toRaw } from "vue";
import type { FormInstance, FormRules, FormProps, ColProps, FormItemProps } from "element-plus";
import { JSX } from "vue/jsx-runtime";

export type FormModelType = Record<string, any>;

export interface RenderParamsType {
  formModel: FormModelType;
  row: FormConfigItemType;
  index: number;
}

export interface FormConfigItemType extends Partial<FormItemProps> {
  /** Layout布局配置 参考: https://element-plus.org/zh-CN/component/layout.html#col-attributes */
  colProp?: Partial<ColProps>;
  /** 表单属性 */
  prop: string;
  /** 是否隐藏 (不渲染表单项目) */
  hide?: boolean;
  /** 表单项渲染函数 */
  render: ((item: RenderParamsType) => JSX.Element) | JSX.Element;
  /** 表单Item插槽 */
  slots?: { [key: string]: () => JSX.Element };
}
/**
 * 说明: 给 EditForm 组件添加类名 `preview-disabled-form` 输入框添再加 `disabled` 属性, 显示只读输入框
 */

const props = {
  /** 视图加载 */
  loading: { type: Boolean, default: false },
  /** 表单数据Model */
  formInline: {
    type: Object as PropType<FormModelType>,
    default: () => ({})
  },
  /** 表单Item配置 */
  formConfigs: {
    type: Array as PropType<FormConfigItemType[]>,
    default: () => []
  },
  /** 表单规则 */
  formRules: {
    type: Object as PropType<FormRules>,
    default: () => ({})
  },
  /** 表单属性 */
  formProps: {
    type: Object as PropType<Partial<FormProps>>,
    default: () => ({})
  },
  /** 按钮网格布局配置 */
  buttonColProp: {
    type: Object as PropType<Partial<ColProps>>,
    default: { span: 24 }
  },
  /** 是否显示操作按钮 */
  showButtons: { type: Boolean, default: false },
  /** 表单项之间的距离 */
  formItemGutter: { type: Number, default: 20 },
  /** 提交按钮名称, 为布尔值隐藏 */
  submitText: { type: [String, Boolean], default: "提交" },
  /** 重置按钮名称, 为布尔值隐藏 */
  resetText: { type: [String, Boolean], default: "重置" }
};

export default defineComponent({
  props: props,
  emits: ["submit", "reset"],
  setup(props, { emit, expose, attrs, slots }) {
    const state = reactive({ loading: false, uiLoading: false });
    const ruleFormRef = ref<FormInstance>();
    const newFormInline = ref<FormModelType>(props.formInline);

    watch(props, (values) => (newFormInline.value = values.formInline), { deep: true });

    const onSubmitForm = () => {
      ruleFormRef.value.validate((valid: boolean) => {
        if (valid && !state.loading) {
          emit("submit", newFormInline.value);
        }
      });
    };

    const onResetForm = () => {
      ruleFormRef.value.resetFields();
      emit("reset");
      setLoading();
    };

    const setLoading = (loading = false) => {
      state.loading = !!loading;
    };

    function getRef() {
      return ruleFormRef.value;
    }

    expose({ getRef, setLoading, onResetForm });

    // eslint-disable-next-line vue/no-setup-props-destructure
    const { showButtons, submitText, resetText } = props;
    return () => (
      <el-form
        ref={ruleFormRef}
        model={newFormInline.value}
        v-loading={props.loading}
        rules={props.formRules}
        class="dialog-form"
        onSubmit={withModifiers(onSubmitForm, ["stop", "prevent"])}
        {...props.formProps}
      >
        <el-row gutter={props.formItemGutter}>
          {props.formConfigs.map((item, index) => {
            const { render, colProp, hide, slots, ...itemProps } = item;
            const formItem = typeof render === "function" ? render({ formModel: newFormInline.value, row: item, index }) : render;
            const innerEle = slots ? { ...toRaw(slots), default: () => formItem } : formItem;
            return hide ? null : (
              <el-col span={24} {...colProp}>
                <el-form-item {...itemProps}>{innerEle}</el-form-item>
              </el-col>
            );
          })}
          <el-col span={24} {...props.buttonColProp}>
            {/* 操作按钮 */}
            {showButtons ? (
              <el-form-item class={props.buttonColProp.span === 24 ? "dialog-btns" : ""}>
                {typeof submitText === "boolean" ? null : (
                  <el-button type="primary" loading={state.loading} onClick={onSubmitForm}>
                    {submitText}
                  </el-button>
                )}
                {typeof resetText === "boolean" ? null : <el-button onClick={onResetForm}>{resetText}</el-button>}
              </el-form-item>
            ) : null}
          </el-col>
        </el-row>
      </el-form>
    );
  }
});
</script>

<style lang="scss">
.preview-disabled-form {
  .el-input.is-disabled,
  .el-input.is-disabled .el-input__inner,
  .el-textarea.is-disabled .el-textarea__inner {
    color: var(--el-input-text-color, var(--el-text-color-regular));
    cursor: default !important;
    -webkit-text-fill-color: var(--el-input-text-color, var(--el-text-color-regular));
  }

  .el-input.is-disabled .el-input__wrapper,
  .el-textarea.is-disabled .el-textarea__inner {
    background-color: var(--el-input-bg-color, var(--el-fill-color-blank));
  }
}
</style>

<style lang="scss" scoped>
.dialog-form {
  width: 100%;
  padding: 0 10px;
}

.dialog-btns {
  margin-top: 10px;
}
</style>
