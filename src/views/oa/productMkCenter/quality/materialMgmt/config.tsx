import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import { reactive, ref, Ref } from "vue";

export const formConfigs = ({ selectOpts }): Ref<FormConfigItemType[]> => {
  console.log(selectOpts.bomUnitOpts, "selectOpts");

  const configInitArr: FormConfigItemType[] = [
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
      label: "抽样方案",
      prop: "samplingPlan",
      colProp: { span: 6 },
      labelWidth: 120,
      render: ({ formModel, row }) => {
        return <el-input size="small" class="ui-w-100" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "质检方案",
      prop: "qualityCheckPlan",
      colProp: { span: 6 },
      labelWidth: 120,
      render: ({ formModel, row }) => {
        return <el-input size="small" class="ui-w-100" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "库存周期复检",
      prop: "stockReCheck",
      colProp: { span: 6 },
      labelWidth: 120,
      render: ({ formModel, row }) => {
        return (
          <el-select size="small" class="ui-w-100" v-model={formModel[row.prop]}>
            {selectOpts.stockCycleCheck.value?.map((item) => (
              <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
            ))}
          </el-select>
        );
      }
    },
    // {
    //   label: "复检周期(天)",
    //   prop: "reCheckDays",
    //   hide: true,
    //   colProp: { span: 6 },
    //   labelWidth: 120,
    //   render: ({ formModel, row }) => {
    //     return <el-input-number controls={false} size="small" class="ui-w-100" v-model={formModel[row.prop]} />;
    //   }
    // },
    {
      label: "周期复检提醒",
      prop: "stockReCheckNotice",
      colProp: { span: 6 },
      labelWidth: 120,
      render: ({ formModel, row }) => {
        return (
          <el-select size="small" class="ui-w-100" v-model={formModel[row.prop]}>
            {selectOpts.cycleCheckNotice.value?.map((item) => (
              <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
            ))}
          </el-select>
        );
      }
    }
    // {
    //   label: "提醒提前期(天)",
    //   prop: "stockReCheckNoticeDays",
    //   hide: true,
    //   colProp: { span: 6 },
    //   labelWidth: 120,
    //   render: ({ formModel, row }) => {
    //     return <el-input-number controls={false} size="small" class="ui-w-100" v-model={formModel[row.prop]} />;
    //   }
    // }
  ];

  const newList = ref(configInitArr);
  const changeStockCheck = (val) => {
    const findResIdx = newList.value.findIndex((item) => item.prop === "reCheckDays");
    if (val === "enable") {
      if (findResIdx >= 0) {
        newList.value[findResIdx].hide = false;
      }
    } else {
      newList.value[findResIdx].hide = true;
    }
  };

  const changeNotice = (val) => {
    const findResIdx = newList.value.findIndex((item) => item.prop === "stockReCheckNoticeDays");
    if (val === "enable") {
      if (findResIdx >= 0) {
        newList.value[findResIdx].hide = false;
      }
    } else {
      newList.value[findResIdx].hide = true;
    }
  };

  /** @ts-ignore */
  return newList;
};

export const formRules = reactive<FormRules>({
  samplingPlan: [{ required: true, message: "抽样方案必填项", trigger: "submit" }],
  qualityCheckPlan: [{ required: true, message: "质检方案为必填项", trigger: "submit" }],
  stockReCheck: [{ required: true, message: "库存周期复检为必填项", trigger: "submit" }],
  // reCheckDays: [{ required: true, message: "复检周期为必填项", trigger: "submit" }],
  stockReCheckNotice: [{ required: true, message: "周期复检提醒为必填项", trigger: "submit" }]
  // stockReCheckNoticeDays: [{ required: true, message: "提醒提前期为必填项", trigger: "submit" }]
});
