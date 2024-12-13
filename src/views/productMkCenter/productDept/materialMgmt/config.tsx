import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import { reactive } from "vue";

export const formConfigs = ({ selectOpts }): FormConfigItemType[] => {
  console.log(selectOpts.bomUnitOpts, "selectOpts");
  return [
    {
      label: "物料分组",
      prop: "materialGroupName",
      colProp: { span: 6 },
      labelWidth: 120,
      render: ({ formModel, row }) => {
        return <el-input disabled size="small" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "编码",
      prop: "number",
      colProp: { span: 6 },
      labelWidth: 120,
      render: ({ formModel, row }) => {
        return <el-input disabled size="small" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "名称",
      prop: "name",
      labelWidth: 120,
      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        return <el-input disabled size="small" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "旧编码",
      prop: "oldCode",
      colProp: { span: 6 },
      labelWidth: 120,
      render: ({ formModel, row }) => {
        return <el-input disabled size="small" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "规格型号",
      labelWidth: 120,
      prop: "specification",
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input disabled size="small" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "模号",
      prop: "model",
      labelWidth: 120,
      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        return <el-input disabled size="small" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "成品类型",
      labelWidth: 120,
      prop: "productTypeName",
      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        return <el-input disabled size="small" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "客供料",
      prop: "customerProvidedName",
      labelWidth: 120,
      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        return <el-input disabled size="small" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "基本单位",
      labelWidth: 120,
      prop: "baseUnitName",
      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        return <el-input disabled size="small" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "采购单位",
      prop: "purchaseUnitName",
      colProp: { span: 6 },
      labelWidth: 120,
      render: ({ formModel, row }) => {
        return <el-input disabled size="small" v-model={formModel[row.prop]} />;
      }
    },

    {
      label: "库存单位",
      prop: "stockUnitName",
      colProp: { span: 6 },
      labelWidth: 120,
      render: ({ formModel, row }) => {
        return <el-input disabled size="small" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "品名",
      prop: "goodName",
      labelWidth: 120,
      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        return <el-input disabled size="small" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "型号",
      prop: "goodModel",
      labelWidth: 120,
      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        return <el-input disabled size="small" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "颜色",
      prop: "goodColor",
      labelWidth: 120,
      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        return <el-input disabled size="small" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "仓库",
      prop: "warehouseName",
      colProp: { span: 6 },
      labelWidth: 120,
      render: ({ formModel, row }) => {
        return <el-input disabled size="small" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "物料种类",
      prop: "materialTypeName",
      colProp: { span: 6 },
      labelWidth: 120,
      render: ({ formModel, row }) => {
        return <el-input disabled size="small" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "存货类别",
      prop: "goodsTypeName",
      colProp: { span: 6 },
      labelWidth: 120,
      render: ({ formModel, row }) => {
        return <el-input disabled size="small" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "版本号",
      prop: "nation",
      labelWidth: 120,
      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        return <el-input disabled size="small" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "是否认证",
      prop: "cbcertification",
      colProp: { span: 6 },
      labelWidth: 120,
      render: ({ formModel, row }) => {
        return (
          <el-switch
            style="--el-switch-on-color: #13ce66"
            size="small"
            disabled
            v-model={formModel[row.prop]}
            active-value={"1"}
            inactive-value={"0"}
            inline-prompt
            active-text="承认"
            inactive-text="不承认"
          />
        );
      }
    },
    {
      label: "备注",
      prop: "remark",
      labelWidth: 120,
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input disabled size="small" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "物料属性",
      prop: "erpClsidName",
      colProp: { span: 6 },
      labelWidth: 120,
      render: ({ formModel, row }) => {
        return <el-input disabled size="small" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "生产车间",
      prop: "manufacturingShopName",
      colProp: { span: 6 },
      labelWidth: 120,
      render: ({ formModel, row }) => {
        return <el-input disabled size="small" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "创建人",
      prop: "createUserName",
      colProp: { span: 6 },
      labelWidth: 120,
      render: ({ formModel, row }) => {
        return <el-input disabled size="small" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "创建日期",
      prop: "createDate",
      colProp: { span: 6 },
      labelWidth: 120,
      render: ({ formModel, row }) => {
        return <el-input disabled size="small" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "修改人",
      prop: "modifyUserName",
      colProp: { span: 6 },
      labelWidth: 120,
      render: ({ formModel, row }) => {
        return <el-input disabled size="small" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "修改日期",
      prop: "modifyDate",
      colProp: { span: 6 },
      labelWidth: 120,
      render: ({ formModel, row }) => {
        return <el-input disabled size="small" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "日产量",
      prop: "dailyProduction",
      colProp: { span: 6 },
      labelWidth: 120,
      render: ({ formModel, row }) => {
        return <el-input-number controls={false} size="small" class="ui-w-100" v-model={formModel[row.prop]} />;
      }
    },
    // {
    //   label: "日产量单位",
    //   prop: "dailyProductionUnit",
    //   colProp: { span: 6 },
    //   labelWidth: 120,
    //   render: ({ formModel, row }) => {
    //     return (
    //       <el-select size="small" class="ui-w-100" v-model={formModel[row.prop]}>
    //         {selectOpts.bomUnitOpts.value?.map((item) => (
    //           <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
    //         ))}
    //       </el-select>
    //     );
    //   }
    // },
    {
      label: "标准人数",
      prop: "standardPeople",
      colProp: { span: 6 },
      labelWidth: 120,
      render: ({ formModel, row }) => {
        return <el-input-number controls={false} size="small" class="ui-w-100" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "标准产能/H",
      prop: "standardCapacity",
      colProp: { span: 6 },
      labelWidth: 120,
      render: ({ formModel, row }) => {
        return <el-input-number controls={false} size="small" class="ui-w-100" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "标准工时",
      prop: "standardWorkTime",
      colProp: { span: 6 },
      labelWidth: 120,
      render: ({ formModel, row }) => {
        return <el-input-number controls={false} size="small" class="ui-w-100" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "标准工时单位",
      prop: "standardWorkTimeUnit",
      colProp: { span: 6 },
      labelWidth: 120,
      render: ({ formModel, row }) => {
        return (
          <el-select size="small" class="ui-w-100" v-model={formModel[row.prop]}>
            {selectOpts.standardWorkTimeUnitOpts.value?.map((item) => (
              <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
            ))}
          </el-select>
        );
      }
    }
  ];
};

export const formRules = reactive<FormRules>({
  dailyProduction: [{ required: true, message: "日产量必填项", trigger: "submit" }],
  // dailyProductionUnit: [{ required: true, message: "日产量单位为必填项", trigger: "submit" }],
  standardPeople: [{ required: true, message: "标准人数为必填项", trigger: "submit" }],
  standardCapacity: [{ required: true, message: "标准产能为必填项", trigger: "submit" }],
  standardWorkTime: [{ required: true, message: "标准工时为必填项", trigger: "submit" }],
  standardWorkTimeUnit: [{ required: true, message: "标准工时单位为必填项", trigger: "submit" }]
});
