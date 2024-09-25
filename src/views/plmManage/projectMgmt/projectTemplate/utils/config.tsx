import { FormRules } from "element-plus";
import { reactive } from "vue";

const formRules = reactive<FormRules>({
  projectModelName: [{ required: true, message: "模板名称为必填项", trigger: "change" }],
  projectStage: [{ required: true, message: "项目阶段为必填项", trigger: "change" }],
  productCategoryId: [{ required: true, message: "产品分类为必填项", trigger: "change" }]
});

const formConfigs = ({ selectOpts, classList, formData = {}, isDetail = false }, needDayConfig?) => {
  const classfyName = classList.value.find((item) => item.value == (formData as any).productCategoryId)?.label;
  const stageName = selectOpts.value.find((item) => item.optionValue == (formData as any).projectStage)?.optionName;
  const configs = [
    {
      label: "模板编号",
      labelWidth: 80,
      prop: "projectModelCode",
      render: ({ formModel, row }) => {
        return <el-input size={isDetail ? "small" : "default"} disabled v-model={formModel[row.prop]} placeholder="自动生成" />;
      }
    },
    {
      label: "模板名称",
      labelWidth: 80,
      prop: "projectModelName",
      render: ({ formModel, row }) => {
        return (
          <el-input
            size={isDetail ? "small" : "default"}
            disabled={needDayConfig?.value && needDayConfig.value.length > 0}
            v-model={formModel[row.prop]}
            placeholder="请输入模板名称"
          />
        );
      }
    },
    {
      label: "工期(天)",
      labelWidth: 80,
      prop: "duration",
      render: ({ formModel, row }) => {
        return <el-input size={isDetail ? "small" : "default"} disabled v-model={formModel[row.prop]} placeholder="自动计算" />;
      }
    },
    {
      label: "项目阶段",
      labelWidth: 80,
      prop: "projectStage",
      render: ({ formModel, row }) => {
        return isDetail ? (
          <el-input size={isDetail ? "small" : "default"} disabled={needDayConfig?.value && needDayConfig.value.length > 0} value={stageName} />
        ) : (
          <el-select
            size={isDetail ? "small" : "default"}
            disabled={needDayConfig?.value && needDayConfig.value.length > 0}
            v-model={formModel[row.prop]}
            placeholder="请选择项目阶段"
            style={{ width: "100%" }}
          >
            {selectOpts.value?.map((item) => (
              <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "产品分类",
      labelWidth: 80,
      prop: "productCategoryId",
      render: ({ formModel, row }) => {
        return isDetail ? (
          <el-input size={isDetail ? "small" : "default"} disabled={needDayConfig?.value && needDayConfig.value.length > 0} value={classfyName} />
        ) : (
          <el-select
            size={isDetail ? "small" : "default"}
            disabled={needDayConfig?.value && needDayConfig.value.length > 0}
            v-model={formModel[row.prop]}
            placeholder="请选择产品分类"
            style={{ width: "100%" }}
          >
            {classList.value?.map((item) => (
              <el-option key={item.id} label={item.categoryName} value={item.id} />
            ))}
          </el-select>
        );
      }
    }
  ];

  return configs;
};

export { formConfigs, formRules };
