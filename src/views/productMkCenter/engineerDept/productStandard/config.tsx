import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import { reactive } from "vue";

const layout = { span: 24 };

// 导入校验
export const formRules = reactive<FormRules>({});

export const formConfigs = (): FormConfigItemType[] => {
  return [
    {
      label: "产品型号",
      prop: "productCode",
      colProp: layout,
      labelWidth: 130,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} disabled />
    },
    {
      label: "前加工标准人数",
      prop: "preProcessingStandardWorkers",
      colProp: layout,
      labelWidth: 130,
      render: ({ formModel, row }) => <el-input-number controls={false} precision={0} class="ui-w-100" v-model={formModel[row.prop]} />
    },
    {
      label: "前加工标准产能/H",
      prop: "preProcessingStandardCapacity",
      colProp: layout,
      labelWidth: 130,
      render: ({ formModel, row }) => <el-input-number controls={false} precision={0} class="ui-w-100" v-model={formModel[row.prop]} />
    },
    {
      label: "前加工标准工时(s)",
      prop: "preProcessingStandardDuration",
      colProp: layout,
      labelWidth: 130,
      render: ({ formModel, row }) => <el-input-number controls={false} precision={0} class="ui-w-100" v-model={formModel[row.prop]} />
    },

    {
      label: "组装标准人数",
      prop: "assembleStandardWorkers",
      colProp: layout,
      labelWidth: 130,
      render: ({ formModel, row }) => <el-input-number controls={false} precision={0} class="ui-w-100" v-model={formModel[row.prop]} />
    },
    {
      label: "组装标准产能/H",
      prop: "assembleStandardCapacity",
      colProp: layout,
      labelWidth: 130,
      render: ({ formModel, row }) => <el-input-number controls={false} precision={0} class="ui-w-100" v-model={formModel[row.prop]} />
    },
    {
      label: "组装标准工时(s)",
      prop: "assembleStandardDuration",
      colProp: layout,
      labelWidth: 130,
      render: ({ formModel, row }) => <el-input-number controls={false} precision={0} class="ui-w-100" v-model={formModel[row.prop]} />
    },
    {
      label: "备注",
      prop: "remark",
      labelWidth: 130,
      colProp: layout,
      render: ({ formModel, row }) => <el-input type="textarea" autoSize={{ minRows: 3 }} v-model={formModel[row.prop]} />
    }
  ];
};
