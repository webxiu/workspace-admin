import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import { reactive } from "vue";

const layout = { span: 24 };

export const formConfigs = ({ qrCodeList, onDateChange, onChangeModel }): FormConfigItemType[] => {
  return [
    {
      label: "品番",
      prop: "model",
      colProp: layout,
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} placeholder="请选择品番" class="ui-w-100" onChange={onChangeModel} clearable={false}>
            {qrCodeList?.map((item) => (
              <el-option key={item.model} label={item.model} value={item.model} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "日期",
      prop: "dateTime",
      colProp: layout,
      render: ({ formModel, row }) => (
        <el-date-picker
          v-model={formModel[row.prop]}
          onChange={onDateChange}
          type="date"
          placeholder="请选择"
          valueFormat="YYYYMMDD"
          style="width: 100%"
          clearable={false}
        />
      )
    },
    {
      label: "制造番号",
      prop: "mfgModel",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="自动生成" disabled />
    },
    {
      label: "二维码地址",
      prop: "link",
      colProp: layout,
      render: ({ formModel, row }) => (
        <el-input type="textarea" v-model={formModel[row.prop]} autosize={{ minRows: 2, maxRows: 4 }} resize="none" placeholder="自动生成" disabled />
      )
    }
  ];
};

// 校验品番
export const formRules = reactive<FormRules>({
  model: [{ required: true, message: "请输入品番", trigger: "submit" }],
  baseUrl: [{ required: true, message: "请输入二维码内容", trigger: "submit" }]
});

// 添加编辑品番
export const editFormConfigs = (): FormConfigItemType[] => {
  return [
    {
      label: "品番",
      prop: "model",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入品番" clearable />
    },
    {
      label: "地址",
      prop: "baseUrl",
      colProp: layout,
      render: ({ formModel, row }) => (
        <el-input type="textarea" v-model={formModel[row.prop]} autosize={{ minRows: 2, maxRows: 4 }} resize="none" placeholder="请输入二维码内容" disabled />
      )
    }
  ];
};
