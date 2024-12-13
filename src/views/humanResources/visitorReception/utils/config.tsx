import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import { reactive } from "vue";

export const formRules = reactive<FormRules>({
  visitorName: [{ required: true, message: "客户名称为必填项", trigger: "submit" }],
  visitorsCount: [{ required: true, message: "客户人数为必填项", trigger: "submit" }],
  arriveDate: [{ required: true, message: "到达日期为必填项", trigger: "submit" }],
  arriveTime: [{ required: true, message: "到达时间为必填项", trigger: "submit" }],
  receptionAddress: [{ required: true, message: "接待地点为必填项", trigger: "submit" }],
  receptionist: [{ required: true, message: "接待人员为必填项", trigger: "submit" }],
  hrVisitReceptionMattersDTOList: [{ required: true, message: "接待项目为必填项", trigger: "submit" }],
  masterDes: [{ required: true, message: "项目描述为必填项", trigger: "submit" }],
  journey: [{ required: true, message: "行程安排为必填项", trigger: "submit" }],
  hrVisitReceptionPrepareDTOList: [{ required: true, message: "接待准备为必填项", trigger: "submit" }],
  prepareDesc: [{ required: true, message: "准备描述为必填项", trigger: "submit" }],
  receptionRequire: [{ required: true, message: "配合与要求为必填项", trigger: "submit" }]
});

export const formConfigs = ({ formData, handleAddUserNames, handleAddOtherUserNames, type, optionListInfo }): FormConfigItemType[] => {
  const isView = type === "view";
  const confArr: FormConfigItemType[] = [
    {
      label: "客户名称",
      prop: "visitorName",
      labelWidth: 100,
      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        return <el-input disabled={isView} v-model={formModel[row.prop]} placeholder="请填写客户名称" />;
      }
    },
    {
      label: "客户人数",
      prop: "visitorsCount",
      labelWidth: 100,
      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        return <el-input-number disabled={isView} min={1} v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "到达日期",
      labelWidth: 100,
      colProp: { span: 8 },
      prop: "arriveDate",
      render: ({ formModel, row }) => {
        return (
          <el-date-picker
            disabled={isView}
            style={{ width: "100%" }}
            v-model={formModel[row.prop]}
            type="date"
            placeholder="请选择到达日期"
            valueFormat="YYYY-MM-DD"
          />
        );
      }
    },
    {
      label: "到达时间",
      labelWidth: 100,
      colProp: { span: 8 },
      prop: "arriveTime",
      render: ({ formModel, row }) => {
        return (
          <el-time-picker
            disabled={isView}
            picker-options={{
              step: "00:15"
            }}
            style={{ width: "100%" }}
            v-model={formModel[row.prop]}
            format="HH:mm"
            placeholder="请选择到达时间"
            value-format="HH:mm:ss"
          />
        );
      }
    },
    {
      label: "接待地点",
      prop: "receptionAddress",
      labelWidth: 100,
      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        return <el-input disabled={isView} v-model={formModel[row.prop]} placeholder="请填写接待地点" />;
      }
    },
    {
      label: "欢迎牌内容",
      prop: "welcomeWord",
      labelWidth: 100,
      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        return <el-input disabled={isView} v-model={formModel[row.prop]} type="textarea" placeholder="请填写欢迎牌内容" />;
      }
    },
    {
      label: "接待人员",
      labelWidth: 100,
      colProp: { span: 8 },
      prop: "receptionist",
      render: ({ formModel, row }) => {
        return (
          <el-input
            disabled={isView}
            readonly
            onClick={() => handleAddUserNames && handleAddUserNames(formData)}
            v-model={formModel[row.prop]}
            placeholder="请选择接待人员"
          />
        );
      }
    },
    {
      label: "协助人员",
      labelWidth: 100,
      colProp: { span: 8 },
      prop: "receptionAssist",
      render: ({ formModel, row }) => {
        return (
          <el-input
            disabled={isView}
            readonly
            onClick={() => handleAddOtherUserNames && handleAddOtherUserNames(formData)}
            v-model={formModel[row.prop]}
            placeholder="请选择协助人员"
          />
        );
      }
    },
    {
      label: "接待项目",
      prop: "hrVisitReceptionMattersDTOList",
      labelWidth: 100,
      colProp: { span: 24 },
      render: ({ formModel, row }) => {
        return (
          <el-checkbox-group disabled={isView} v-model={formModel[row.prop]}>
            {optionListInfo.projectList.value && optionListInfo.projectList.value.map((item) => <el-checkbox label={item.optionName} key={item.optionId} />)}
          </el-checkbox-group>
        );
      }
    },
    {
      label: "行程安排",
      prop: "journey",
      labelWidth: 100,
      colProp: { span: 24 },
      render: ({ formModel, row }) => {
        return <el-input disabled={isView} v-model={formModel[row.prop]} type="textarea" placeholder="请填写行程安排" />;
      }
    },
    {
      label: "接待准备",
      prop: "hrVisitReceptionPrepareDTOList",
      labelWidth: 100,
      colProp: { span: 24 },
      render: ({ formModel, row }) => {
        return (
          <el-checkbox-group disabled={isView} v-model={formModel[row.prop]}>
            {optionListInfo.prepareList.value && optionListInfo.prepareList.value.map((item) => <el-checkbox label={item.optionName} key={item.optionId} />)}
          </el-checkbox-group>
        );
      }
    },
    {
      label: "配合与要求",
      prop: "receptionRequire",
      labelWidth: 100,
      colProp: { span: 24 },
      render: ({ formModel, row }) => {
        return <el-input disabled={isView} v-model={formModel[row.prop]} type="textarea" placeholder="请填写配合与要求" />;
      }
    },
    {
      label: "备注",
      prop: "remark",
      labelWidth: 100,
      colProp: { span: 24 },
      render: ({ formModel, row }) => {
        return <el-input disabled={isView} v-model={formModel[row.prop]} type="textarea" placeholder="请填写备注" />;
      }
    }
  ];

  if (isView) {
    confArr.unshift({
      label: "单据编号",
      prop: "billNo",
      labelWidth: 100,
      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        return <el-input disabled v-model={formModel[row.prop]} placeholder="请填写单据编号" />;
      }
    });
  }

  return confArr;
};
