import { FormConfigItemType } from "@/components/EditForm/index.vue";

export const formConfigs = (
  { changeHours, changeMaterialFee, changeComprehensiveRate, formData, changeUserRate, changeMakeFee },
  valid?
): FormConfigItemType[] => {
  return [
    {
      label: "材料成本(RMB)",
      prop: "materialFee",
      labelWidth: 140,
      size: "small",
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return (
          <el-input-number
            disabled={!valid.bomDetails}
            class="ui-w-100"
            controls={false}
            min={0}
            v-model={formModel[row.prop]}
            onChange={(val) => changeMaterialFee(val, formData.laborCosts, formData.manufacturingCosts)}
          />
        );
      }
    },
    {
      label: "模具含税合计(RMB)",
      prop: "modelHasTaxTotal",
      labelWidth: 140,
      size: "small",
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input-number disabled={!valid.moldCostDetails} class="ui-w-100" controls={false} min={0} v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "夹具模含税合计(RMB)",
      prop: "clampHasTaxTotal",
      labelWidth: 140,
      size: "small",
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input-number disabled={!valid.moldCostDetails} class="ui-w-100" controls={false} min={0} v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "人均产能",
      prop: "capacity",
      labelWidth: 140,
      size: "small",
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input-number class="ui-w-100" disabled={!valid.assembleDetails} controls={false} min={0} v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "总人力",
      prop: "humanResources",
      labelWidth: 140,
      size: "small",
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input-number class="ui-w-100" disabled={!valid.assembleDetails} controls={false} min={0} v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "产能/H",
      prop: "capacityRate",
      labelWidth: 140,
      size: "small",
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input-number class="ui-w-100" disabled={!valid.assembleDetails} controls={false} min={0} v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "标准工时",
      prop: "standardHours",
      labelWidth: 140,
      size: "small",
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return (
          <el-input-number class="ui-w-100" disabled={!valid.assembleDetails} controls={false} min={0} v-model={formModel[row.prop]} onChange={changeHours} />
        );
      }
    },
    {
      label: "综合毛利率",
      prop: "companyGrossMargin",
      labelWidth: 140,
      size: "small",
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input-number class="ui-w-100" controls={false} min={0} v-model={formModel[row.prop]} onChange={changeComprehensiveRate} />;
      }
    },
    {
      label: "同类产品综合毛利率",
      prop: "productGrossMargin",
      labelWidth: 140,
      size: "small",
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input-number class="ui-w-100" controls={false} min={0} v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "人工费率",
      prop: "userRate",
      labelWidth: 140,
      size: "small",
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input-number class="ui-w-100" controls={false} min={0} v-model={formModel[row.prop]} onChange={changeUserRate} />;
      }
    },
    {
      label: "制造费率",
      prop: "makeFeeRate",
      labelWidth: 140,
      size: "small",
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input-number class="ui-w-100" controls={false} min={0} v-model={formModel[row.prop]} onChange={changeMakeFee} />;
      }
    },
    {
      label: "材料成本占收入比",
      prop: "bomProportion",
      labelWidth: 140,
      size: "small",
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input-number disabled class="ui-w-100" controls={false} min={0} v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "人工成本占收入比",
      prop: "userProportion",
      labelWidth: 140,
      size: "small",
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input-number disabled class="ui-w-100" controls={false} min={0} v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "制造费用占收入比",
      prop: "makeFeeProportion",
      labelWidth: 140,
      size: "small",
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input-number disabled class="ui-w-100" controls={false} min={0} v-model={formModel[row.prop]} />;
      }
    }
  ];
};
