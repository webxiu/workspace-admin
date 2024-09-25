<!-- 
  /*
 * @Author: Hailen 
 * @Date: 2023-08-02 16:54:26 
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-01-25 14:04:19
 */ 
-->

<script lang="tsx">
import { ref, defineComponent, PropType, watch, toRaw, Ref } from "vue";
import type { FormInstance, FormRules, FormProps, ColProps, FormItemProps } from "element-plus";
import { JSX } from "vue/jsx-runtime";
import { computed, isRef, CSSProperties } from "vue";
import { Delete } from "@element-plus/icons-vue";
import { predefineColors } from "@/config/constant";
import { Question } from "@/config/elements";

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
  formInline: { type: Object as PropType<FormModelType>, default: () => ({}) },
  /** 表单Item配置 */
  formConfigs: { type: Array as PropType<FormConfigItemType[] | Ref<FormConfigItemType[]>>, default: () => [] },
  /** 表单规则 */
  formRules: { type: Object as PropType<FormRules>, default: () => ({}) },
  /** 表单属性 */
  formProps: { type: Object as PropType<Partial<FormProps>>, default: () => ({}) },
  /** 表单项之间的距离 */
  formItemGutter: { type: Number, default: 20 }
};

export default defineComponent({
  props: props,
  emits: ["change", "delete"],
  setup(props, { emit, expose, attrs, slots }) {
    const ruleFormRef = ref<FormInstance>();
    const newFormInline = ref<FormModelType>(props.formInline);
    const configList = computed<FormConfigItemType[]>(() => {
      const configs = props.formConfigs;
      return isRef(configs) ? configs.value : configs;
    });

    watch(props, watchUpdata, { deep: true });

    function watchUpdata(values) {
      newFormInline.value = values.formInline;
      emit("change", values.formInline); // 实时更新
    }
    function removeSpecs(domain) {
      emit("delete", domain);
    }
    function getRef() {
      return ruleFormRef.value;
    }
    expose({ getRef });

    return () => (
      <el-form ref={ruleFormRef} model={newFormInline.value} rules={props.formRules} class="dialog-form" v-loading={props.loading} {...props.formProps}>
        <el-row gutter={props.formItemGutter}>
          {configList.value.map((item, index) => {
            const { render, colProp, hide, slots, ...itemProps } = item;
            const formItem = typeof render === "function" ? render({ formModel: newFormInline.value, row: item, index }) : render;
            const innerEle = slots ? { ...toRaw(slots), default: () => formItem } : formItem;
            return hide ? null : (
              <>
                {item.prop !== "specs" ? (
                  <el-col span={24} {...colProp}>
                    <el-form-item {...itemProps}>{innerEle}</el-form-item>
                  </el-col>
                ) : (
                  newFormInline.value.specs.map((domain, idx) => {
                    return (
                      <div class="flex ui-w-100" key={domain.uuid}>
                        <el-col span={6}>
                          <el-form-item
                            label={`状态数值${idx + 1}`}
                            prop={`specs.${idx}.value`}
                            rules={{ required: true, message: "请输入", trigger: "blur" }}
                            labelWidth={(props.formProps as any).labelWidth}
                            v-slots={{
                              label: () => (
                                <div>
                                  <span>数值{idx + 1}</span>
                                  <el-tooltip class="box-item" placement="top">
                                    {{
                                      default: () => <Question />,
                                      content: () => (
                                        <div>
                                          <div class="fw-700">说明：</div>
                                          <div>1、根据单元格中不同的数值, 配置相应的标签颜色</div>
                                          <div>2、多种标签(如: 0代表: 未审批,1代表: 已审批)则添加两行, 数值分别填入0和1, 名称分别填入未审批和已审批</div>
                                          <div>3、若数值就是要显示的标签名称(即数值和名称一致时), 可只设置数值, 名称可以为空</div>
                                        </div>
                                      )
                                    }}
                                  </el-tooltip>
                                </div>
                              )
                            }}
                          >
                            <el-input v-model={domain.value} placeholder="请输入" style="width: 100px" />
                          </el-form-item>
                        </el-col>
                        <el-col span={5}>
                          <el-form-item
                            label="名称"
                            prop={`specs.${idx}.label`}
                            rules={{ required: false, message: "请输入", trigger: "blur" }}
                            label-width="60px"
                          >
                            <el-input v-model={domain.label} placeholder="请输入" style="width: 100px" />
                          </el-form-item>
                        </el-col>
                        <el-col span={5}>
                          <el-form-item
                            label="字体颜色"
                            prop={`specs.${idx}.color`}
                            rules={{ required: false, message: "请选择", trigger: "blur" }}
                            label-width="100px"
                          >
                            <el-color-picker v-model={domain.color} showAlpha predefine={predefineColors} style="width: 100px" />
                          </el-form-item>
                        </el-col>
                        <el-col span={5}>
                          <el-form-item
                            label="背景颜色"
                            prop={`specs.${idx}.background`}
                            rules={{ required: false, message: "请选择", trigger: "blur" }}
                            label-width="90px"
                          >
                            <el-color-picker v-model={domain.background} showAlpha predefine={predefineColors} style="width: 100px" />
                          </el-form-item>
                        </el-col>
                        <el-col span={3}>
                          <el-form-item label-width="10px" class="form-delete">
                            <el-button onClick={() => removeSpecs(domain)} type="danger" icon={Delete} style="width: 67px">
                              删除
                            </el-button>
                          </el-form-item>
                        </el-col>
                      </div>
                    );
                  })
                )}
              </>
            );
          })}
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
