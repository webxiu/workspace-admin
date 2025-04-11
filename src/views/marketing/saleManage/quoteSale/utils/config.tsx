import { reactive, ref } from "vue";

import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import QuoteItem from "@/views/marketing/saleManage/quoteApply/component/QuoteItem.vue";
import { orderOptions } from "@/views/marketing/saleManage/quoteApply/utils/config";

// 编辑校验
export const formRules = reactive<FormRules>({});

export const formConfigs = ({ currencyList }): FormConfigItemType[] => {
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
      label: "报价数量/币种/单价",
      prop: "quoteList",
      class: "center-label merge-item",
      colProp: { span: 24 },
      style: { ...styleItem, height: "auto" },
      slot: { label: ({ label }) => <span class="fz-16 color-111">{label}</span> },
      render: ({ formModel, row }) => (
        <QuoteItem v-model={formModel[row.prop]} disabled={true} disableCount={true} currencyList={currencyList} disableCurrency={true} />
      )
    }
  ];
};

// 报价公式图片
export const quoteFormula = `data:image/png;base64,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`;
