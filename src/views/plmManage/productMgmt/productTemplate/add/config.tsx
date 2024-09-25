export const formConfigs = (optionList?) => {
  return [
    {
      label: "模板名称",
      prop: "templateName",
      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入模板名称" />;
      }
    },
    {
      label: "产品分类",
      prop: "productClassId",
      colProp: { span: 8 },
      labelWidth: 160,
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} placeholder="请选择产品分类">
            {optionList.map((item) => (
              <el-option key={item.value} label={item.label} value={item.value} />
            ))}
          </el-select>
        );
      }
    }
  ];
};
