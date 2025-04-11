<script lang="tsx">
import { defineComponent, reactive, ref, watch } from "vue";
import { PureTableBar } from "@/components/RePureTableBar";
import { FormTableGroupConfigItemType, getFormColumns, FormTableConfigType, FormItemConfigType, FormConfigParams, ButtonKeyType } from "@/utils/form";
import { FormType, LayoutType } from "@/views/system/basic/menu/formColumn/utils/config";
import EditForm from "@/components/EditForm/index.vue";
import TitleCate from "@/components/TitleCate.vue";
import ButtonList from "@/components/ButtonList/index.vue";
import { message } from "@/utils/message";
import { Loading } from "@element-plus/icons-vue";

/**
  动态表单配置组件
  {
    formConfig: FormItemConfigType[], // 表单类型提示
    tableConfig: FormTableConfigType[]// 表格类型提示
  }
 */

export default defineComponent({
  name: "TableEditList",
  props: {
    /** 需要先获取接口数据时, 传入loading以确保数据加载完成再渲染配置内容 */
    loading: { type: Boolean, default: false },
    /** 获取表单类型 */
    buttonType: { type: String as PropType<ButtonKeyType>, default: "add" },
    /** 请求分组参数(分组:groupCode, 菜单:menuId) */
    params: { type: Object as PropType<FormConfigParams>, default: () => ({ groupCode: FormType.form }) },
    /** 表单配置项 */
    formConfig: { type: Array as PropType<FormItemConfigType[]>, default: () => [] },
    /** 表格配置项 */
    tableConfig: { type: Array as PropType<FormTableConfigType>, default: () => [] },
    /** 是否显示分组标题(默认显示) */
    showGroupTitle: { type: Boolean, default: true }
  },
  setup(props, { emit, expose, attrs, slots }) {
    const noop = () => {};
    const loading = ref(false);
    const dataRefs = reactive({ forms: [], tables: [] });
    const confitList = ref<FormTableGroupConfigItemType[]>([]);

    watch(() => props.loading, getFormConfigList, { immediate: true });

    function getFormConfigList(val) {
      if (val) return;
      const { buttonType, params, formConfig, tableConfig } = props;
      loading.value = true;
      getFormColumns({ buttonType, params, formConfig, tableConfig })
        .then((data) => {
          loading.value = false;
          if (!data.length) throw new Error("配置列表获取失败");
          confitList.value = data;
        })
        .catch((error) => {
          console.log("error", error);
          loading.value = false;
          message.error("配置列表获取失败");
        });
    }

    // 表单验证
    async function getValid(forms) {
      return new Promise((resolve, reject) => {
        forms.forEach((form, index) => {
          form.formRef.getRef().validate((valid) => {
            if (!valid) return reject(false);
            if (index === forms.length - 1) resolve(true);
          });
        });
      });
    }

    // 重置表单
    async function resetRef() {
      const forms = dataRefs.forms;
      forms.forEach((form) => {
        form.formRef.getRef().resetFields();
      });
    }

    // 返回表单验证结果
    function getRef() {
      return new Promise(async (resolve) => {
        try {
          const result = await getValid(dataRefs.forms);
          const formData = props.formConfig[0].formData;
          console.log("提交数据:", formData);
          console.log("所有数据:", { valid: result, data: dataRefs, formConfig: props.formConfig[0].formData });
          resolve({ valid: result, data: dataRefs });
        } catch (error) {
          resolve({ valid: error, data: dataRefs });
        }
      });
    }

    expose({ getRef, resetRef });
    return () => {
      dataRefs.forms = [];
      dataRefs.tables = [];
      return (
        <div class="dynamic-form">
          {props.loading || loading.value ? (
            <el-empty>
              {{
                description: () => "加载中...",
                image: () => (
                  <el-icon class="is-loading" size="80px">
                    <Loading />
                  </el-icon>
                )
              }}
            </el-empty>
          ) : (
            <el-tabs>
              {confitList.value.map((item) => {
                const { groupType, formGroupId, layoutPattern } = item;
                const formRef = ref();
                const isTab = layoutPattern === LayoutType.Tab;
                // 表格和表单分类(方便按顺序获取表格和表单自定义配置)
                const forms = confitList.value.filter((f) => f.groupType === FormType.form);
                const tables = confitList.value.filter((f) => f.groupType === FormType.table);
                const isForm = item.groupType === FormType.form;
                const ftList = isForm ? forms : tables;
                const ftIndex = ftList.findIndex((f) => f.formGroupId === formGroupId);
                const _config = isForm ? props.formConfig[ftIndex] : props.tableConfig[ftIndex];
                const { formData, formProps, buttonConfig = {}, tableSlots = {}, header = noop, footer = noop, dataList, tableProps } = _config || {};

                // 渲染标题
                const renderTitle = () => {
                  return !props.showGroupTitle ? null : (
                    <TitleCate name={item.formGroupName}>
                      <ButtonList autoLayout={false} {...buttonConfig} />
                    </TitleCate>
                  );
                };
                // 渲染内容
                const renderContent = () => {
                  if (isForm) {
                    dataRefs.forms.push({ groupType, formData, formRef });
                    return (
                      <EditForm
                        ref={formRef}
                        formInline={formData}
                        formRules={item.form.formRules}
                        formConfigs={item.form.formColumns}
                        formProps={formProps}
                        class="mt-15"
                      />
                    );
                  }
                  if (!_config) return null;
                  // 表格是否显示操作列
                  const columns = tableSlots.operation ? item.table : item.table.filter((f) => f.prop !== "operation");
                  dataRefs.tables.push({ groupType, dataList: dataList.value || dataList });
                  return (
                    <PureTableBar columns={columns} show-icon={false} style="padding: 15px 0 0">
                      {{
                        default: ({ size, dynamicColumns }) => {
                          return (
                            <pure-table
                              border
                              height={300}
                              max-height={300}
                              rowKey="id"
                              class="edit-list-table"
                              adaptive={true}
                              align-whole="center"
                              loading={false}
                              size={size}
                              data={dataList.value || dataList}
                              columns={dynamicColumns}
                              paginationSmall={size === "small"}
                              highlight-current-row
                              show-overflow-tooltip={true}
                              {...tableProps}
                            >
                              {tableSlots}
                            </pure-table>
                          );
                        }
                      }}
                    </PureTableBar>
                  );
                };

                // 渲染结果
                const renderResult = () => (
                  <div class="ctf-item mb-10">
                    {isTab ? null : renderTitle()}
                    {header()}
                    {renderContent()}
                    {footer()}
                  </div>
                );

                if (!isTab) return renderResult();
                return <el-tab-pane label={item.formGroupName}>{renderResult()}</el-tab-pane>;
              })}
            </el-tabs>
          )}
        </div>
      );
    };
  }
});
</script>
