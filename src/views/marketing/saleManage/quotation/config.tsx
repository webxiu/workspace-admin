import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import TabsGroup from "./TabsGroup/index.vue";
import { reactive } from "vue";

export const formRules = reactive<FormRules>({
  customerName: [{ required: true, message: "客户名称为必填项", trigger: "submit" }],
  assignee: [{ required: true, message: "请选择研发工程师", trigger: "submit" }]
});

export const formConfigs = ({ setFormData, formData, tabsRef, optionValues, type }, devUsers?, valid?): FormConfigItemType[] => {
  const configArr: FormConfigItemType[] = [
    {
      label: "客户名称",
      prop: "customerName",
      labelWidth: 135,
      size: "small",
      colProp: { span: 5 },
      render: ({ formModel, row }) => {
        return <el-input disabled={type === "view"} v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "产品描述",
      prop: "productDescription",
      labelWidth: 135,
      size: "small",
      colProp: { span: 5 },
      render: ({ formModel, row }) => {
        return <el-input disabled={type === "view"} v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "是否翻单",
      prop: "isRepeatOrder",
      labelWidth: 135,
      size: "small",
      colProp: { span: 5 },
      render: ({ formModel, row }) => {
        return (
          <el-select disabled={type === "view"} v-model={formModel[row.prop]} placeholder="请选择" class="ui-w-100">
            <el-option key="0" label="是" value={true} />
            <el-option key="1" label="否" value={false} />
          </el-select>
        );
      }
    },
    {
      label: "参考单号",
      prop: "referenceNumber",
      labelWidth: 135,
      size: "small",
      colProp: { span: 5 },
      render: ({ formModel, row }) => {
        return <el-input disabled={type === "view"} v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "工艺要求",
      prop: "processRequirements",
      labelWidth: 135,
      size: "small",
      colProp: { span: 5 },
      render: ({ formModel, row }) => {
        return <el-input disabled={type === "view"} v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "预计销售量(PCS)",
      prop: "expectedSalesVolume",
      labelWidth: 135,
      size: "small",
      colProp: { span: 5 },
      render: ({ formModel, row }) => {
        return <el-input-number disabled={type === "view"} class="ui-w-100" controls={false} min={0} v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "保本销售量(PCS)",
      prop: "breakVenSales",
      labelWidth: 135,
      size: "small",
      colProp: { span: 5 },
      render: ({ formModel, row }) => {
        return <el-input-number disabled class="ui-w-100" controls={false} min={0} v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "预计销售额(RMB)",
      prop: "expectedSalesAmount",
      labelWidth: 135,
      size: "small",
      colProp: { span: 5 },
      render: ({ formModel, row }) => {
        return <el-input-number disabled={type === "view"} class="ui-w-100" controls={false} min={0} v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "不含税售价(RMB)",
      prop: "notTaxPrice",
      labelWidth: 135,
      size: "small",
      colProp: { span: 5 },
      render: ({ formModel, row }) => {
        return <el-input-number class="ui-w-100" disabled controls={false} min={0} v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "含税(13%)售价(RMB)",
      prop: "taxPrice",
      labelWidth: 135,
      size: "small",
      colProp: { span: 5 },
      render: ({ formModel, row }) => {
        return <el-input-number class="ui-w-100" disabled controls={false} min={0} v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "售价(USD)",
      prop: "usdPrice",
      labelWidth: 135,
      size: "small",
      colProp: { span: 5 },
      render: ({ formModel, row }) => {
        return <el-input-number class="ui-w-100" disabled controls={false} min={0} v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "人工成本(RMB)",
      prop: "laborCosts",
      labelWidth: 135,
      size: "small",
      colProp: { span: 5 },
      render: ({ formModel, row }) => {
        return <el-input-number class="ui-w-100" disabled controls={false} min={0} v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "制造费用(RMB)",
      prop: "manufacturingCosts",
      labelWidth: 135,
      size: "small",
      colProp: { span: 5 },
      render: ({ formModel, row }) => {
        return <el-input-number class="ui-w-100" disabled controls={false} min={0} v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "单机成本合计(RMB)",
      prop: "singleCostTotal",
      labelWidth: 135,
      size: "small",
      colProp: { span: 5 },
      render: ({ formModel, row }) => {
        return <el-input-number class="ui-w-100" disabled controls={false} min={0} v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "单位边际贡献(RMB/台)",
      prop: "marginalContribution",
      labelWidth: 135,
      size: "small",
      colProp: { span: 5 },
      render: ({ formModel, row }) => {
        return <el-input-number class="ui-w-100" disabled controls={false} min={0} v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "备注",
      prop: "remark",
      labelWidth: 135,
      size: "small",
      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        return <el-input disabled={type === "view"} v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "",
      prop: "tabList",
      labelWidth: 10,
      colProp: { span: 24 },
      render: () => {
        return (
          <TabsGroup
            type={type}
            style={{ width: "100%" }}
            valid={valid}
            setFormData={setFormData}
            formData={formData}
            ref={tabsRef}
            optionValues={optionValues}
          />
        );
      }
    }
  ];
  if (type === "audit") {
    configArr.unshift({
      label: "研发工程师",
      prop: "assignee",
      labelWidth: 135,
      size: "small",
      colProp: { span: 5 },
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} placeholder="请选择" class="ui-w-100">
            {devUsers?.value?.map((item) => (
              <el-option key={item.id} label={item.userName} value={item.userCode} />
            ))}
          </el-select>
        );
      }
    });
  }
  return configArr;
};
