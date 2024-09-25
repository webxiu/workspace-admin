import { FormRules } from "element-plus";
import { reactive } from "vue";

const formRules = reactive<FormRules>({
  projectModelCode: [{ required: true, message: "模板编号为必填项", trigger: "change" }],
  projectModelName: [{ required: true, message: "模板名称为必填项", trigger: "change" }],
  projectStage: [{ required: true, message: "项目阶段为必填项", trigger: "change" }]
});

const formConfigs = ({ selectOpts }, needDayConfig?) => {
  console.log(selectOpts, "opts");
  const configs = [
    {
      label: "模板编号",
      labelWidth: 80,
      prop: "projectModelCode",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入模板编号" />;
      }
    },
    {
      label: "模板名称",
      labelWidth: 80,
      prop: "projectModelName",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入模板名称" />;
      }
    },
    {
      label: "工期",
      labelWidth: 80,
      prop: "duration",
      render: ({ formModel, row }) => {
        return <el-input disabled v-model={formModel[row.prop]} placeholder="自动计算" />;
      }
    },
    {
      label: "项目阶段",
      labelWidth: 80,
      prop: "projectStage",
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} placeholder="请选择项目阶段" style={{ width: "100%" }}>
            {selectOpts.value?.map((item) => (
              <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
            ))}
          </el-select>
        );
      }
    }
  ];

  if (needDayConfig) {
    configs.push({
      label: "工期单位",
      labelWidth: 80,
      prop: "unitId",
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} placeholder="请选择工期单位" style={{ width: "100%" }}>
            {needDayConfig.value?.map((item) => (
              <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
            ))}
          </el-select>
        );
      }
    });
  }
  return configs;
};

export { formConfigs, formRules };
