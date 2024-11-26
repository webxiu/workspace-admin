<!-- 
 支持行、列合并编辑表格
 /*
 * @Author: Hailen 
 * @Date: 2024-11-11 17:55:39 
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-11-20 16:49:52
 */ 
 -->

<script lang="tsx">
import { ref, defineComponent, PropType, watch, withModifiers, Ref } from "vue";
import type { FormInstance, FormRules, FormProps, FormItemProps } from "element-plus";
import { JSX } from "vue/jsx-runtime";
import { computed, isRef, CSSProperties } from "vue";

export type FormModelType = Record<string, any>;

export interface RenderParamsType {
  formModel: FormModelType;
  row: TableFormItemType;
  index: number;
}
/** 单元格属性 */
export interface CellConfigType {
  /** 列宽 */
  width?: string;
  /** 行合并 */
  rowspan?: number;
  /** 列合并 */
  colspan?: number;
  /** td样式 */
  tdProp?: { style?: CSSProperties; class?: string; [key: string]: any };
  /** 输入框样式 */
  inputProp?: { style?: CSSProperties; class?: string; [key: string]: any };
}

export interface TableFormItemType extends Partial<FormItemProps> {
  label?: string;
  prop?: string;
  /** 是否隐藏 */
  hide?: boolean;
  /** 自定义名称 */
  renderLabel?: ((item: RenderParamsType) => JSX.Element) | JSX.Element;
  /** 自定义内容 */
  render?: ((item: RenderParamsType) => JSX.Element) | JSX.Element;
  /** 名称单元格属性 */
  labelConf?: CellConfigType;
  /** 内容单元格属性 */
  contentConf?: CellConfigType;
}

const props = {
  /** 视图加载 */
  loading: { type: Boolean, default: false },
  /** 表单数据Model */
  formData: { type: Object as PropType<FormModelType>, default: () => ({}) },
  /** 表单Item配置 */
  formConfig: { type: Array as PropType<TableFormItemType[][] | Ref<TableFormItemType[][]>>, default: () => [] },
  /** 表单规则 */
  formRules: { type: Object as PropType<FormRules>, default: () => ({}) },
  /** 表单属性 */
  formProps: { type: Object as PropType<Partial<FormProps>>, default: () => ({} as Partial<FormProps>) }
};

export default defineComponent({
  props: props,
  emits: ["submit", "reset", "change"],
  setup(props, { emit, expose, attrs, slots }) {
    const formRef = ref<FormInstance>();
    const formModel = ref<FormModelType>(props.formData);
    const configList = computed<TableFormItemType[][]>(() => {
      return isRef(props.formConfig) ? props.formConfig.value : props.formConfig;
    });

    watch(props, watchUpdata, { deep: true });

    function watchUpdata(values) {
      formModel.value = values.formData;
      emit("change", values.formData);
    }

    function onSubmit() {
      return new Promise<any>((resolve, reject) => {
        formRef.value.validate((valid: boolean) => {
          if (valid) {
            emit("submit", formModel.value);
            resolve(formModel.value);
          } else {
            reject();
          }
        });
      });
    }

    function onReset() {
      formRef.value.resetFields();
      emit("reset");
    }

    function getRef() {
      return formRef.value;
    }

    /** 将标题和内容分离为两个单元格项目 */
    function getSplitCell(rows) {
      const arrs = [];
      rows.forEach((row) => {
        const { label, prop, render, renderLabel, labelConf, contentConf = {}, ...reset } = row;
        arrs.push({ type: "label", label, prop: null, renderLabel, render: undefined, ...labelConf });
        if (contentConf.colSpan || render) {
          arrs.push({ type: "content", label: null, prop, render, ...contentConf, ...reset });
        }
      });
      return arrs;
    }

    expose({ getRef, onSubmit, onReset });
    return () => (
      <el-form
        ref={formRef}
        model={formModel.value}
        v-loading={props.loading}
        rules={props.formRules}
        class="table-form"
        onSubmit={withModifiers(onSubmit, ["stop", "prevent"])}
        {...props.formProps}
      >
        <table border="1">
          <tbody>
            {configList.value.map((rows) => {
              const arrs = getSplitCell(rows);
              return (
                <tr>
                  {arrs.map((cell, index) => {
                    const { type, label, prop, rowspan = 1, colspan = 1, width, render, renderLabel, hide, tdProp, inputProp, ...itemReset } = cell;
                    const param = { formModel: formModel.value, row: cell, index };
                    const _render = typeof render === "function" ? render(param) : null;
                    const _renderLabel = typeof renderLabel === "function" ? renderLabel(param) : label;
                    if (hide) return null;
                    return _render || _renderLabel ? (
                      <td rowspan={rowspan} colspan={colspan} width={width} class={type === "label" ? "ui-va-m ui-ta-c" : undefined} {...tdProp}>
                        {_render ? (
                          <el-form-item {...itemReset} style={{ margin: 0 }} {...inputProp}>
                            {_render}
                          </el-form-item>
                        ) : (
                          <span class="p-4" {...inputProp}>
                            {_renderLabel}
                          </span>
                        )}
                      </td>
                    ) : null;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </el-form>
    );
  }
});
</script>

<style lang="scss" scoped>
.table-form {
  table {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
    border: 1px solid #111;
    tr td {
      vertical-align: middle;
      border: 1px solid #111;
      overflow: hidden;
    }
  }

  // 隐藏输入框边框
  :deep(.el-textarea__inner),
  :deep(.el-input__wrapper),
  :deep(.el-form-item.is-error .el-textarea__inner),
  :deep(.el-form-item.is-error .el-input__wrapper) {
    border-radius: 0;
    box-shadow: 0 0 0 0 var(--el-input-border-color, var(--el-border-color)) inset;
  }

  :deep(.el-upload--picture-card),
  :deep(.el-upload-list__item) {
    width: 79px;
    height: 79px;
    transition: none !important;
    &:nth-child(5n) {
      margin-right: 0px;
    }
  }

  :deep(.el-form-item__content) {
    position: relative;
    // 错误提示靠右
    .el-form-item__error {
      position: absolute;
      top: 9px;
      right: 5px;
    }
  }
}
</style>
