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
      label: "固定提前期",
      prop: "fixedBeforeMag",
      colProp: { span: 6 },
      labelWidth: 120,
      render: ({ formModel, row }) => {
        return <el-input-number controls={false} size="small" class="ui-w-100" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "固定提前期单位",
      prop: "fixedBeforeMagUnit",
      colProp: { span: 6 },
      labelWidth: 120,
      render: ({ formModel, row }) => {
        return (
          <el-select size="small" class="ui-w-100" v-model={formModel[row.prop]}>
            {selectOpts.fixBeforeUnit.value?.map((item) => (
              <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "变动提前期",
      prop: "changeBeforeMag",
      colProp: { span: 6 },
      labelWidth: 120,
      render: ({ formModel, row }) => {
        return <el-input-number controls={false} size="small" class="ui-w-100" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "变动提前期单位",
      prop: "changeBeforeMagUnit",
      colProp: { span: 6 },
      labelWidth: 120,
      render: ({ formModel, row }) => {
        return (
          <el-select size="small" class="ui-w-100" v-model={formModel[row.prop]}>
            {selectOpts.changeBeforeUnit.value?.map((item) => (
              <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "检验提前期",
      prop: "checkBeforeMag",
      colProp: { span: 6 },
      labelWidth: 120,
      render: ({ formModel, row }) => {
        return <el-input-number controls={false} size="small" class="ui-w-100" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "检验提前期单位",
      prop: "checkBeforeMagUnit",
      colProp: { span: 6 },
      labelWidth: 120,
      render: ({ formModel, row }) => {
        return (
          <el-select size="small" class="ui-w-100" v-model={formModel[row.prop]}>
            {selectOpts.checkBeforeUnit.value?.map((item) => (
              <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "累计提前期",
      prop: "totalBeforeMag",
      colProp: { span: 6 },
      labelWidth: 120,
      render: ({ formModel, row }) => {
        return <el-input-number controls={false} size="small" class="ui-w-100" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "最大订货量",
      prop: "maxOrderCount",
      colProp: { span: 6 },
      labelWidth: 120,
      render: ({ formModel, row }) => {
        return <el-input-number controls={false} size="small" class="ui-w-100" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "最小订货量",
      prop: "minOrderCount",
      colProp: { span: 6 },
      labelWidth: 120,
      render: ({ formModel, row }) => {
        return <el-input-number controls={false} size="small" class="ui-w-100" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "最小包装量",
      prop: "minPackageCount",
      colProp: { span: 6 },
      labelWidth: 120,
      render: ({ formModel, row }) => {
        return <el-input-number controls={false} size="small" class="ui-w-100" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "安全库存",
      prop: "safeStockCount",
      colProp: { span: 6 },
      labelWidth: 120,
      render: ({ formModel, row }) => {
        return <el-input-number controls={false} size="small" class="ui-w-100" v-model={formModel[row.prop]} />;
      }
    }
  ];
};

export const formRules = reactive<FormRules>({
  fixedBeforeMag: [{ required: true, message: "固定提前期为必填项", trigger: "submit" }],
  fixedBeforeMagUnit: [{ required: true, message: "固定提前期单位为必填项", trigger: "submit" }],
  changeBeforeMag: [{ required: true, message: "变动提前期为必填项", trigger: "submit" }],
  changeBeforeMagUnit: [{ required: true, message: "变动提前期单位为必填项", trigger: "submit" }],
  checkBeforeMag: [{ required: true, message: "检验提前期为必填项", trigger: "submit" }],
  checkBeforeMagUnit: [{ required: true, message: "检验提前期单位为必填项", trigger: "submit" }],
  totalBeforeMag: [{ required: true, message: "累计提前期为必填项", trigger: "submit" }],
  maxOrderCount: [{ required: true, message: "最大订货量为必填项", trigger: "submit" }],
  minOrderCount: [{ required: true, message: "最小订货量为必填项", trigger: "submit" }],
  minPackageCount: [{ required: true, message: "最小包装量为必填项", trigger: "submit" }],
  safeStockCount: [{ required: true, message: "安全库存为必填项", trigger: "submit" }]
});
