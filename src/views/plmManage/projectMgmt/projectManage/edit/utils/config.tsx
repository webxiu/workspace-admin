import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import { reactive } from "vue";

export const formRules = reactive<FormRules>({
  projectName: [{ required: true, message: "产品名称为必填项", trigger: "submit" }],
  billNo: [{ required: true, message: "单据编号为必填项", trigger: "submit" }],
  projectUserId: [{ required: true, message: "负责人为必填项", trigger: "submit" }],
  deptId: [{ required: true, message: "负责部门为必填项", trigger: "submit" }],
  productCategoryId: [{ required: true, message: "产品分类为必填项", trigger: "submit" }],
  startDate: [{ required: true, message: "立项日期为必填项", trigger: "submit" }],
  projectModelId: [{ required: true, message: "项目模板为必填项", trigger: "submit" }],
  duration: [{ required: true, message: "工期为必填项", trigger: "submit" }],
  planEndDate: [{ required: true, message: "结案日期为必填项", trigger: "submit" }]
});

export const formConfigs = ({
  projectModelsOpts,
  treeDeptSelectData,
  changeFormDataStartDate,
  changeTreeData,
  productClassifyList,
  userListOpts
}): FormConfigItemType[] => {
  return [
    {
      label: "单据编号",
      prop: "billNo",
      colProp: { span: 5 },
      labelWidth: 80,
      render: ({ formModel, row }) => {
        return <el-input disabled v-model={formModel[row.prop]} clearable />;
      }
    },
    {
      label: "产品名称",
      prop: "projectName",
      colProp: { span: 5 },
      labelWidth: 80,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入产品名称" />;
      }
    },
    {
      label: "负责部门",
      labelWidth: 80,
      colProp: { span: 5 },
      prop: "deptId",
      render: ({ formModel, row }) => {
        return (
          <el-tree-select
            v-model={formModel[row.prop]}
            data={treeDeptSelectData}
            filterable
            check-strictly
            default-expanded-keys={["0"]}
            node-key="value"
            render-after-expand={false}
            onChange={(val) => changeTreeData(val)}
            style={{ width: "100%" }}
          />
        );
      }
    },
    {
      label: "负责人",
      colProp: { span: 5 },
      labelWidth: 80,
      prop: "projectUserId",
      render: ({ formModel, row }) => {
        return (
          <el-select filterable style={{ width: "100%" }} v-model={formModel[row.prop]} placeholder="请选择项目负责人">
            {userListOpts.map((item) => (
              <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "产品分类",
      labelWidth: 80,
      colProp: { span: 5 },
      prop: "productCategoryId",
      render: ({ formModel, row }) => {
        return (
          <el-select filterable style={{ width: "100%" }} v-model={formModel[row.prop]} placeholder="请选择产品分类">
            {productClassifyList.map((item) => (
              <el-option key={item.id} label={item.categoryName} value={item.id} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "立项日期",
      labelWidth: 80,
      colProp: { span: 5 },
      prop: "startDate",
      render: ({ formModel, row }) => {
        return (
          <el-date-picker
            style={{ width: "100%" }}
            onChange={changeFormDataStartDate}
            v-model={formModel[row.prop]}
            value-format="YYYY-MM-DD"
            type="date"
            placeholder="选择立项日期"
          />
        );
      }
    },
    {
      label: "项目模板",
      colProp: { span: 5 },
      labelWidth: 80,
      prop: "projectModelId",
      render: ({ formModel, row }) => {
        return (
          <el-select disabled filterable style={{ width: "100%" }} v-model={formModel[row.prop]} placeholder="请选择项目模板">
            {projectModelsOpts.map((item) => (
              <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "关联客户",
      labelWidth: 80,
      colProp: { span: 5 },
      prop: "customerName",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入关联客户" />;
      }
    },
    {
      label: "工期(天)",
      colProp: { span: 5 },
      labelWidth: 80,
      prop: "duration",
      render: ({ formModel, row }) => {
        return <el-input-number disabled controls={false} style={{ width: "100%" }} placeholder="请填写工期" v-model={formModel[row.prop]} min={0} />;
      }
    },
    {
      label: "结案日期",
      labelWidth: 80,
      colProp: { span: 5 },
      prop: "planEndDate",
      render: ({ formModel, row }) => {
        return (
          <el-date-picker disabled style={{ width: "100%" }} v-model={formModel[row.prop]} value-format="YYYY-MM-DD" type="date" placeholder="选择结案日期" />
        );
      }
    },
    {
      label: "备注",
      labelWidth: 80,
      colProp: { span: 10 },
      prop: "remarks",
      render: ({ formModel, row }) => {
        return <el-input type="textarea" autosize v-model={formModel[row.prop]} placeholder="请填写备注" />;
      }
    }
  ];
};
