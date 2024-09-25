import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import { QuestionFilled } from "@element-plus/icons-vue";
import { reactive } from "vue";

// 编辑SQL单据校验
export const formRules = reactive<FormRules>({
  title: [{ required: true, message: "标题为必填项", trigger: "blur" }],
  dbKey: [{ required: true, message: "数据库为必选项", trigger: "blur" }],
  reason: [{ required: true, message: "执行原因为必填项", trigger: "blur" }],
  content: [{ required: true, message: "SQL内容为必填项", trigger: "blur" }]
});

// 模板配置表单验证
export const templateFormRules = reactive<FormRules>({
  flowName: [{ required: true, message: "请输入流程名称", trigger: "blur" }],
  formUrl: [{ required: true, message: "请选择表单地址", trigger: "blur" }],
  tableName: [{ required: true, message: "请输入表名", trigger: "blur" }],
  fieldName: [{ required: true, message: "请输入字段名", trigger: "blur" }]
});

// 2.模板配置弹窗表单配置
export const templateFormConfigs = ({ billOptions, formUrlList, onBillChange }): FormConfigItemType[] => {
  return [
    {
      label: "业务单据",
      prop: "billList",
      colProp: { span: 24 },
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} placeholder="请选择" class="ui-w-100" onChange={onBillChange}>
            {billOptions.value.map((item) => (
              <el-option key={item.billId} label={item.remark} value={item.billId} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "业务单据ID",
      prop: "billId",
      colProp: { span: 24 },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" disabled clearable />
    },
    {
      label: "流程名称",
      prop: "flowName",
      colProp: { span: 24 },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "启用",
      prop: "isEnable",
      colProp: { span: 24 },
      render: ({ formModel, row }) => <el-switch v-model={formModel[row.prop]} active-value={true} inactive-value={false} />
    },
    {
      label: "表单地址",
      prop: "formUrl",
      colProp: { span: 24 },
      render: ({ formModel, row }) => (
        <el-select v-model={formModel[row.prop]} placeholder="请选择" class="ui-w-100" clearable>
          {formUrlList.value.map((item) => (
            <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
          ))}
        </el-select>
      )
    },
    {
      label: "表名",
      prop: "tableName",
      colProp: { span: 24 },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "字段名",
      prop: "fieldName",
      colProp: { span: 24 },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "单据所属人(NO)字段名",
      prop: "userFieldName",
      colProp: { span: 24 },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    }
  ];
};
