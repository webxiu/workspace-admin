import { customListQuoteApply, kingDeeSaleList } from "@/api/oaManage/marketing";

import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import HxModalInput from "@/components/HxModalInput/index.vue";
import { PAGE_CONFIG } from "@/config/constant";
import QuoteItem from "../component/QuoteItem.vue";
import SelectTable from "@/components/HxModalInput/SelectTable.vue";
import { reactive } from "vue";

// 编辑校验
export const formRules = reactive<FormRules>({
  productCode: [{ required: true, message: "请选择产品编码", trigger: ["blur"] }],
  customerName: [{ required: true, message: "请选择客户名称", trigger: ["blur"] }],
  isRepeatOrder: [{ required: true, message: "请选择是否翻单", trigger: ["blur"] }],
  quoteQuantity: [{ required: true, message: "请输入报价数量", trigger: ["blur"] }],
  processRequirements: [{ required: true, message: "请输入工艺要求", trigger: ["blur"] }],
  powerCableRequirements: [{ required: true, message: "请输入电源线/USB线要求", trigger: ["blur"] }],
  packagingRequirements: [{ required: true, message: "请输入包装要求", trigger: ["blur"] }]
});

// 是否翻单
export const orderOptions = [
  { label: "是", value: true },
  { label: "否", value: false }
];

export const formConfigs = ({ currencyList, isEdit }): FormConfigItemType[] => {
  const styleEl = { height: "40px", display: "inline-flex", alignItems: "center" };
  const styleItem = { alignItems: "center" };

  const columns2: TableColumnList[] = [
    { label: "客户编号", prop: "customerNumber", minWidth: 140 },
    { label: "客户简称", prop: "customerShortName", minWidth: 140 },
    { label: "客户名称", prop: "customerName", minWidth: 140 }
  ];
  const columns3: TableColumnList[] = [
    { label: "订单号", prop: "FBILLNO", align: "center", minWidth: 140 },
    { label: "订单日期", prop: "FDATE", align: "center" },
    { label: "客户简称", prop: "FSHORTNAME", minWidth: 140 },
    { label: "物料编号", prop: "materialVOS[0].FNUMBER", minWidth: 140 },
    { label: "物料名称", prop: "materialVOS[0].FNAME", minWidth: 180 },
    { label: "物料规格", prop: "materialVOS[0].FSPECIFICATION", minWidth: 300 }
  ];

  return [
    {
      label: "申请单号",
      prop: "billNo",
      class: "center-label",
      colProp: { span: 8 },
      style: styleItem,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="自动生成" style={styleEl} disabled />
    },
    {
      label: "申请日期",
      prop: "createDate",
      class: "center-label",
      colProp: { span: 8 },
      style: styleItem,
      render: ({ formModel, row }) => (
        <el-date-picker
          type="date"
          v-model={formModel[row.prop]}
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          placeholder="自动生成"
          clearable
          disabled
          style={styleEl}
        />
      )
    },
    {
      label: "申 请 人",
      prop: "createUserName",
      class: "center-label",
      colProp: { span: 8 },
      style: styleItem,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="自动生成" clearable disabled style={styleEl} />
    },
    {
      label: "产品型号",
      prop: "productCode",
      class: "center-label",
      colProp: { span: 8 },
      style: styleItem,
      render: ({ formModel, row }) => {
        return (
          <HxModalInput
            title="选择产品"
            placeholder="点击选择"
            valueKey={row.prop}
            v-model={formModel[row.prop]}
            readonly
            clearable
            disabled={!isEdit}
            style={styleEl}
            component={SelectTable}
            showModel="product"
          />
        );
      }
    },
    {
      label: "客户名称",
      prop: "customerName",
      class: "center-label",
      colProp: { span: 8 },
      style: styleItem,
      render: ({ formModel, row }) => {
        return (
          <HxModalInput
            title="选择客户名称"
            placeholder="点击选择"
            valueKey={row.prop}
            v-model={formModel[row.prop]}
            readonly
            clearable
            disabled={!isEdit}
            style={styleEl}
            component={SelectTable}
            componentProp={{
              maxHeight: 520,
              rowKey: "customerId",
              searchConfig: [
                { label: "客户编号", value: "customerCode" },
                { label: "客户简称", value: "customerShortName" },
                { label: "客户名称", value: "customerName" }
              ],
              columns: columns2,
              api: customListQuoteApply
            }}
          />
        );
      }
    },
    {
      label: "是否翻单",
      prop: "isRepeatOrder",
      class: "center-label",
      colProp: { span: 8 },
      style: styleItem,
      render: ({ formModel, row }) => (
        <el-select v-model={formModel[row.prop]} placeholder="请选择" disabled={!isEdit} value-key="value" class="ui-w-100" style={styleEl}>
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
      render: ({ formModel, row }) => {
        const onSelect = (val) => (formModel.referenceMaterialCode = val.materialVOS[0]?.FNUMBER);
        return (
          <HxModalInput
            width="90%"
            title="选择参考单号"
            valueKey="FBILLNO"
            placeholder="点击选择"
            v-model={formModel[row.prop]}
            readonly
            clearable
            disabled={!isEdit}
            style={styleEl}
            component={SelectTable}
            onSelect={onSelect}
            componentProp={{
              maxHeight: 520,
              columns: columns3,
              paramConfig: { page: 1, limit: PAGE_CONFIG.pageSize },
              searchConfig: [
                { label: "订单号", value: "FBILLNO" },
                { label: "客户简称", value: "customerShortName" },
                { label: "规格型号", value: "specification" },
                { label: "订单日期", value: "date", type: "daterange", startKey: "startDate", endKey: "endDate" }
              ],
              api: kingDeeSaleList
            }}
          />
        );
      }
    },
    {
      label: "参考物料编码",
      prop: "referenceMaterialCode",
      class: "center-label",
      colProp: { span: 16 },
      style: styleItem,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="自动填充" style={styleEl} disabled />
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
          disabled={!isEdit}
          placeholder="请输入"
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
          disabled={!isEdit}
          placeholder="请输入"
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
          disabled={!isEdit}
          placeholder="请输入"
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
        <QuoteItem v-model={formModel[row.prop]} currencyList={currencyList} disabled={!isEdit} disableCurrency={false || !isEdit} disableCount={!isEdit} />
      )
    }
  ];
};
