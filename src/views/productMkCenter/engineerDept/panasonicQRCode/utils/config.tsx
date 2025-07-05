import { computed, reactive } from "vue";

import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";

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

export const OffsetConfig = {
  codeRight: 5.6,
  codeBottom: 32.2,
  modelLeft: 21.5,
  modelBottom: 15.9,
  dateTimeRight: 10.2,
  dateTimeBottom: 16.1,
  showPrint: false
};

// 打印设置表单
export const offsetFormConfigs = ({ onSave, onReset }): FormConfigItemType[] => {
  const step = 0.1;
  function render({ formModel, row }) {
    return (
      <el-input-number v-model={formModel[row.prop]} step={step} placeholder="请输入" controls-position="right" style="min-width: 100px;width: min-content" />
    );
  }
  function label({ label }) {
    return <span class="fw-700">{label}</span>;
  }

  function labelSlot(prop) {
    return ({ label }) => {
      const title = "系统默认值: " + OffsetConfig[prop];
      return (
        <span class="fw-700" title={title}>
          {label}
        </span>
      );
    };
  }

  return [
    { label: "二维码:", prop: "", colProp: { span: 2 }, render: null, labelWidth: 80, slot: { label } },
    { label: "右边距", prop: "codeRight", colProp: { span: 11 }, render: render, slot: { label: labelSlot("codeRight") } },
    { label: "下边距", prop: "codeBottom", colProp: { span: 11 }, render: render, slot: { label: labelSlot("codeBottom") } },
    { label: "品番:", prop: "", colProp: { span: 2 }, render: null, labelWidth: 80, slot: { label } },
    { label: "左边距", prop: "modelLeft", colProp: { span: 11 }, render: render, slot: { label: labelSlot("modelLeft") } },
    { label: "下边距", prop: "modelBottom", colProp: { span: 11 }, render: render, slot: { label: labelSlot("modelBottom") } },
    { label: "制造番号:", prop: "", colProp: { span: 2 }, render: null, labelWidth: 80, slot: { label } },
    { label: "右边距", prop: "dateTimeRight", colProp: { span: 11 }, render: render, slot: { label: labelSlot("dateTimeRight") } },
    { label: "下边距", prop: "dateTimeBottom", colProp: { span: 11 }, render: render, slot: { label: labelSlot("dateTimeBottom") } },
    {
      label: "显示打印:",
      prop: "showPrint",
      colProp: { span: 24 },
      labelWidth: 80,
      render: ({ formModel, row }) => <el-switch v-model={formModel[row.prop]} />
    },
    {
      prop: "",
      colProp: { span: 24 },
      render: ({ formModel, row }) => (
        <div class="flex-center ui-w-100 mt-30">
          <el-button type="primary" onClick={() => onSave(formModel)}>
            保存
          </el-button>
          <el-button type="default" onClick={() => onReset(formModel)}>
            重置
          </el-button>
        </div>
      )
    }
  ];
};
