import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import { reactive, ref, Ref } from "vue";

export const formConfigs = ({ modeOpts, _formData }): Ref<FormConfigItemType[]> => {
  const formConf: FormConfigItemType[] = [
    {
      label: "模式",
      prop: "dispatchMode",
      render: ({ formModel, row }) => {
        return (
          <el-checkbox-group v-model={formModel[row.prop]} onChange={changeGroup} placeholder="请输入分发模式">
            {modeOpts.map((item) => {
              return <el-checkbox label={item.label} value={item.value} key={item.value} />;
            })}
          </el-checkbox-group>
        );
      }
    },
    {
      label: "年月",
      prop: "dispatchYearMonth",
      render: ({ formModel, row }) => {
        return (
          <el-date-picker
            v-model={formModel[row.prop]}
            clearable={false}
            type="month"
            placeholder="请选择分发年月"
            class="ui-w-100"
            format="YYYY-M"
            value-format="YYYY-M"
          />
        );
      }
    }
  ];

  const hideConfig = formConf.filter((item) => item.prop !== "dispatchYearMonth");
  const newList = ref(hideConfig);

  const changeGroup = () => {
    if (_formData.dispatchMode.length > 1) {
      _formData.dispatchMode.splice(0, 1);
    }

    if (_formData.dispatchMode.at(-1).includes("年月")) {
      newList.value = formConf;
    } else if (_formData.dispatchMode.at(-1).includes("勾选")) {
      newList.value = hideConfig;
    }
  };

  return newList;
};

export const formRules = reactive<FormRules>({
  dispatchMode: [{ required: true, message: "分发模式为必填项", trigger: "submit" }],
  dispatchYearMonth: [{ required: true, message: "分发年月为必填项", trigger: "submit" }]
});
