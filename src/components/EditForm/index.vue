<!-- 
  /*
 * @Author: Hailen 
 * @Date: 2023-08-02 16:54:26 
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-24 14:21:52
 */ 
-->

<script lang="tsx">
import { reactive, ref, defineComponent, PropType, watch, withModifiers, toRaw, Ref } from "vue";
import type { FormInstance, FormRules, FormProps, ColProps, FormItemProps } from "element-plus";
import { JSX } from "vue/jsx-runtime";
import { computed, isRef, CSSProperties } from "vue";

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
  slots?: { [key: string]: (slot: Record<string, any>) => JSX.Element };
  style?: CSSProperties;
  class?: string;
}
/**
 * 说明:
 *    1.给 EditForm 组件添加类名 `preview-disabled-form` 输入框添再加 `disabled` 属性, 显示只读输入框
 *    2.使用边框表单, 引入组件时添加类名:border-form即可, 单独控制可在配置文件中添加以下类名:
 *        标题两端对齐:justify (设置标题宽度)
 *        标题居中:center-label
 *        隐藏内容左边框:hide-content-left
 *        隐藏顶部边框:hide-top
 *        隐藏左边边框:hide-left
 *        合并标题内容居中:cell-merge
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
    type: Array as PropType<FormConfigItemType[] | Ref<FormConfigItemType[]>>,
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
    default: () => ({} as Partial<FormProps>)
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
  emits: ["submit", "reset", "change"],
  setup(props, { emit, expose, attrs, slots }) {
    const state = reactive({ loading: false });
    const ruleFormRef = ref<FormInstance>();
    const newFormInline = ref<FormModelType>(props.formInline);

    watch(props, watchUpdata, { deep: true });

    function watchUpdata(values) {
      newFormInline.value = values.formInline;
      emit("change", values.formInline); // 监听回调
    }

    const configList = computed<FormConfigItemType[]>(() => {
      const configs = props.formConfigs;
      return isRef(configs) ? configs.value : configs;
    });

    const onSubmit = () => {
      return new Promise<any>((resolve, reject) => {
        ruleFormRef.value.validate((valid: boolean) => {
          if (valid && !state.loading) {
            emit("submit", newFormInline.value);
            resolve(newFormInline.value);
          } else {
            reject();
          }
        });
      });
    };

    const onReset = () => {
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

    expose({ getRef, setLoading, onSubmit, onReset });

    // eslint-disable-next-line vue/no-setup-props-destructure
    const { showButtons, submitText, resetText } = props;
    return () => (
      <el-form
        ref={ruleFormRef}
        model={newFormInline.value}
        v-loading={props.loading}
        rules={props.formRules}
        class="dialog-form"
        onSubmit={withModifiers(onSubmit, ["stop", "prevent"])}
        {...props.formProps}
      >
        <el-row gutter={props.formItemGutter}>
          {configList.value.map((item, index) => {
            const { render, colProp, hide, slots, ...itemProps } = item;
            const formItem = typeof render === "function" ? render({ formModel: newFormInline.value, row: item, index }) : render;
            const innerEle = slots ? { ...toRaw(slots), default: () => formItem } : formItem;
            return hide ? null : (
              <el-col span={24} {...colProp} key={item.prop}>
                <el-form-item {...itemProps}>{innerEle}</el-form-item>
              </el-col>
            );
          })}
          <el-col span={24} {...props.buttonColProp}>
            {/* 操作按钮 */}
            {showButtons ? (
              <el-form-item class={props.buttonColProp.span === 24 ? "dialog-btns" : ""}>
                {typeof submitText === "boolean" ? null : (
                  <el-button type="primary" loading={state.loading} onClick={onSubmit}>
                    {submitText}
                  </el-button>
                )}
                {typeof resetText === "boolean" ? null : <el-button onClick={onReset}>{resetText}</el-button>}
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
$borderColor: #111;

// 禁用输入框知道效果
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

/** 表单添加边框 */
.border-form {
  // 添加右、下表框
  border-right: 1px solid $borderColor;
  border-bottom: 1px solid $borderColor;
  padding: 0 !important;

  // 添加左、上表框
  .el-form-item {
    border-top: 1px solid $borderColor;
    border-left: 1px solid $borderColor;
    margin: 0 !important;
    height: 100%;
  }

  .el-form-item__label {
    font-weight: normal;
  }

  .el-form-item__content {
    border-left: 1px solid $borderColor;
    align-items: center;
    position: relative;
    height: 100%;
    padding: 2px 4px;
    // 错误提示靠右
    .el-form-item__error {
      position: absolute;
      top: 9px;
      right: 5px;
    }
  }

  // 隐藏输入框边框
  .el-textarea__inner,
  .el-input__wrapper,
  .el-form-item.is-error .el-textarea__inner,
  .el-form-item.is-error .el-input__wrapper {
    border-radius: 0;
    box-shadow: 0 0 0 0 var(--el-input-border-color, var(--el-border-color)) inset;
  }

  // 标题两端对齐
  .justify .el-form-item__label {
    align-items: center;
    text-align: justify;
    display: block;
    padding: 0 6px;
    align-self: center;
    &::after {
      width: 100%;
      content: "" !important;
      display: inline-block;
    }
  }

  // 居中label
  .center-label .el-form-item__label {
    display: inline-block;
    padding: 0 4px !important;
    text-align: center !important;
    height: auto;
    line-height: 1.5em;
  }
  // 隐藏边框
  .hide-content-left .el-form-item__content {
    border-left: none;
  }
  // 隐藏顶部边框
  .hide-top.el-form-item {
    border-top: none;
  }
  // 隐藏左边边框
  .hide-left.el-form-item {
    border-left: none;
  }
  // 合并标题内容居中
  .cell-merge .el-form-item__content {
    margin-left: -1px !important;
    width: 100%;
    text-align: center;
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
