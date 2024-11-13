import { reactive, ref } from "vue";

import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import QuoteItem from "@/views/oa/marketing/saleManage/quoteApply/component/QuoteItem.vue";
import { orderOptions } from "@/views/oa/marketing/saleManage/quoteApply/utils/config";

// 编辑校验
export const formRules = reactive<FormRules>({});

export const formConfigs = (): FormConfigItemType[] => {
  const styleEl = { height: "40px", display: "inline-flex", alignItems: "center" };
  const styleItem = { alignItems: "center" };

  return [
    {
      label: "申请单号",
      prop: "billNo",
      class: "center-label",
      colProp: { span: 8 },
      style: styleItem,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="自动生成" disabled style={styleEl} />
    },
    {
      label: "申请日期",
      prop: "createDate",
      class: "center-label",
      colProp: { span: 8 },
      style: styleItem,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="自动生成" disabled style={styleEl} />
    },
    {
      label: "申 请 人",
      prop: "createUserName",
      class: "center-label",
      colProp: { span: 8 },
      style: styleItem,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="自动生成" disabled style={styleEl} />
    },
    {
      label: "产品编码",
      prop: "productCode",
      class: "center-label",
      colProp: { span: 8 },
      style: styleItem,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="自动生成" disabled style={styleEl} />
    },
    {
      label: "客户名称",
      prop: "customerName",
      class: "center-label",
      colProp: { span: 8 },
      style: styleItem,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="自动生成" disabled style={styleEl} />
    },
    {
      label: "是否翻单",
      prop: "isRepeatOrder",
      class: "center-label",
      colProp: { span: 8 },
      style: styleItem,
      render: ({ formModel, row }) => (
        <el-select v-model={formModel[row.prop]} value-key="value" class="ui-w-100" placeholder="自动生成" disabled style={styleEl}>
          {orderOptions.map((item) => (
            <el-option key={item.value} label={item.label} value={item.value} />
          ))}
        </el-select>
      )
    },
    {
      label: "参考单号",
      prop: "referenceBillNo",
      class: "center-label",
      colProp: { span: 8 },
      style: styleItem,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="自动生成" disabled style={styleEl} />
    },
    {
      label: "参考物料编码",
      prop: "referenceMaterialCode",
      class: "center-label",
      colProp: { span: 16 },
      style: styleItem,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="自动生成" disabled style={styleEl} />
    },
    {
      label: "工艺要求",
      prop: "processRequirements",
      class: "center-label",
      colProp: { span: 24 },
      style: { ...styleItem, height: "auto" },
      render: ({ formModel, row }) => (
        <el-input
          v-model={formModel[row.prop]}
          rows={3}
          autofocus
          resize="none"
          type="textarea"
          placeholder="请输入"
          disabled
          autosize={{ minRows: 3, maxRows: 3 }}
        />
      )
    },
    {
      label: "电源线/USB线要求",
      prop: "powerCableRequirements",
      class: "center-label",
      colProp: { span: 24 },
      style: { ...styleItem, height: "auto" },
      render: ({ formModel, row }) => (
        <el-input
          v-model={formModel[row.prop]}
          rows={3}
          autofocus
          resize="none"
          type="textarea"
          placeholder="请输入"
          disabled
          autosize={{ minRows: 3, maxRows: 3 }}
        />
      )
    },
    {
      label: "包装要求",
      prop: "packagingRequirements",
      class: "center-label",
      colProp: { span: 24 },
      style: { ...styleItem, height: "auto" },
      render: ({ formModel, row }) => (
        <el-input
          v-model={formModel[row.prop]}
          rows={3}
          autofocus
          resize="none"
          type="textarea"
          placeholder="请输入"
          disabled
          autosize={{ minRows: 3, maxRows: 3 }}
        />
      )
    },
    {
      label: "报价数量/单价/币种",
      prop: "quoteList",
      class: "center-label dynamic-form-item",
      colProp: { span: 24 },
      style: { ...styleItem, height: "auto" },
      slots: { label: ({ label }) => <span class="fz-16 color-111">{label}</span> },
      render: ({ formModel, row }) => <QuoteItem v-model={formModel[row.prop]} disabled={true} disableCount={true} />
    }
  ];
};
