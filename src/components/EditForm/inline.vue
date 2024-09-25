<!-- 
  /*
 * @Author: Hailen 
 * @Date: 2023-08-02 16:54:26 
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-09-12 17:03:42
 */ 
-->

<script lang="tsx">
import { JSX } from "vue/jsx-runtime";
import { Search, RefreshLeft } from "@element-plus/icons-vue";
import type { FormInstance, FormRules, FormProps, ColProps, FormItemProps } from "element-plus";
import { computed, isRef, CSSProperties, reactive, ref, defineComponent, PropType, watch, withModifiers, toRaw, Ref } from "vue";

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
  /** 是否显示操作按钮 */
  showButtons: { type: Boolean, default: false },
  /** 提交按钮名称, 为布尔值隐藏 */
  submitText: { type: [String, Boolean], default: "查询" },
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
      <div class="edit-form-inline inline-flex flex-wrap">
        <el-form
          ref={ruleFormRef}
          model={newFormInline.value}
          v-loading={props.loading}
          rules={props.formRules}
          class="line-form flex-1"
          inline={true}
          onSubmit={withModifiers(onSubmit, ["stop", "prevent"])}
          {...props.formProps}
        >
          {configList.value.map((item, index) => {
            const { render, colProp, hide, slots, ...itemProps } = item;
            const formItem = typeof render === "function" ? render({ formModel: newFormInline.value, row: item, index }) : render;
            const innerEle = slots ? { ...toRaw(slots), default: () => formItem } : formItem;
            return hide ? null : (
              <>
                <el-form-item {...itemProps} key={item.prop}>
                  {innerEle}
                </el-form-item>
                {/* 是否显示按钮: 使用最后一个item配置 */}
                {showButtons && index === configList.value.length - 1 ? (
                  <el-form-item {...{ ...itemProps, label: null }}>
                    {submitText === false ? null : (
                      <el-button type="primary" loading={state.loading} icon={Search} onClick={onSubmit}>
                        {submitText}
                      </el-button>
                    )}
                    {resetText === false ? null : (
                      <el-button icon={RefreshLeft} onClick={onReset}>
                        {resetText}
                      </el-button>
                    )}
                  </el-form-item>
                ) : null}
              </>
            );
          })}
        </el-form>
        {slots.default?.()}
      </div>
    );
  }
});
</script>
