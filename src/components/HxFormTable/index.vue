<!-- 
  /*
 * @Author: Hailen 
 * @Date: 2023-08-02 16:54:26 
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-11-11 17:55:39
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

export interface TableFormItemType extends Partial<FormItemProps> {
  label?: string;
  prop?: string;
  width?: string;
  merge?: number[];
  merge2?: number[];
  rowspan?: number;
  colspan?: number;
  hide?: boolean;
  /** 自定义渲染内容(只展示名称不传) */
  render?: ((item: RenderParamsType) => JSX.Element) | JSX.Element;
  /** 自定义渲染名称 */
  renderLabel?: ((item: RenderParamsType) => JSX.Element) | JSX.Element;
  style?: CSSProperties;
  tdStyle?: CSSProperties;
  tdStyle2?: CSSProperties;
  class?: string;
}

const props = {
  /** 视图加载 */
  loading: { type: Boolean, default: false },
  /** 表单数据Model */
  formInline: { type: Object as PropType<FormModelType>, default: () => ({}) },
  /** 表单Item配置 */
  tableList: { type: Array as PropType<TableFormItemType[][] | Ref<TableFormItemType[][]>>, default: () => [] },
  /** 表单规则 */
  formRules: { type: Object as PropType<FormRules>, default: () => ({}) },
  /** 表单属性 */
  formProps: { type: Object as PropType<Partial<FormProps>>, default: () => ({} as Partial<FormProps>) },
  /** 按钮网格布局配置 */
  tdStyle: { type: Object as PropType<CSSProperties>, default: () => ({ padding: "5px" }) },
  /** 是否显示操作按钮 */
  showButtons: { type: Boolean, default: false },
  /** 提交按钮名称, 为布尔值隐藏 */
  submitText: { type: [String, Boolean], default: "提交" },
  /** 重置按钮名称, 为布尔值隐藏 */
  resetText: { type: [String, Boolean], default: "重置" }
};

export default defineComponent({
  props: props,
  emits: ["submit", "reset", "change"],
  setup(props, { emit, expose, attrs, slots }) {
    const formRef = ref<FormInstance>();
    const newFormInline = ref<FormModelType>(props.formInline);
    const configList = computed<TableFormItemType[][]>(() => {
      return isRef(props.tableList) ? props.tableList.value : props.tableList;
    });

    watch(props, watchUpdata, { deep: true });

    function watchUpdata(values) {
      newFormInline.value = values.formInline;
      emit("change", values.formInline);
    }

    function onSubmit() {
      return new Promise<any>((resolve, reject) => {
        formRef.value.validate((valid: boolean) => {
          if (valid) {
            emit("submit", newFormInline.value);
            resolve(newFormInline.value);
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
        const { label, prop, render, merge = [1, 1], merge2 = [1, 1], tdStyle, tdStyle2, ...itemProps } = row;
        arrs.push({ label, prop: null, render: undefined, rowspan: merge[0], colspan: merge[1], tdStyle, ...itemProps });
        if (merge2[1] || render) {
          arrs.push({ label: null, prop, render, rowspan: merge2[0], colspan: merge2[1], tdStyle: tdStyle2, ...itemProps });
        }
      });
      return arrs;
    }

    expose({ getRef, onSubmit, onReset });
    return () => (
      <el-form
        ref={formRef}
        model={newFormInline.value}
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
                    const { label, render, renderLabel, hide, width, style, tdStyle, ...itemProps } = cell;
                    const param = { formModel: newFormInline.value, row: cell, index };
                    const _render = typeof render === "function" ? render(param) : null;
                    const _renderLabel = typeof renderLabel === "function" ? renderLabel(param) : cell.label;

                    const span = cell.colspan;
                    const resetLen = rows.filter((f) => !f.colspan || !f.width).length || 1; // 计算没有设置的剩余分数
                    const ratePiece = span || (24 - span) / resetLen; // 剩余份平分
                    const percent = (100 / 24) * ratePiece;

                    if (!cell.rowspan || !cell.colspan) return null;
                    return _render || cell.label ? (
                      <td
                        rowspan={cell.rowspan}
                        colspan={cell.colspan}
                        width={width || `${percent}%`}
                        style={{
                          padding: "2px 4px",
                          textAlign: _render ? "left" : "center",
                          ...tdStyle
                        }}
                      >
                        {_render ? (
                          <el-form-item {...itemProps} style={{ margin: 0, ...style }}>
                            {_render}
                          </el-form-item>
                        ) : (
                          _renderLabel
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
