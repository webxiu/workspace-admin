import { Ref, reactive, ref } from "vue";

import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";

// 编辑校验
export const formRules = reactive<FormRules>({});

// 单据类型
export const priceType = [
  { label: "普通", value: "普通" },
  { label: "阶梯", value: "阶梯" }
];

// 阶梯价格表格列
const columns: TableColumnList[] = [
  { label: "最小数量", prop: "minQuantity", align: "center" },
  { label: "最大数量", prop: "maxQuantity", align: "center" },
  { label: "单价", prop: "purchasePrice", align: "center" }
];

export const formConfigs = (): Ref<FormConfigItemType[]> => {
  const styleEl = { height: "40px", display: "inline-flex", alignItems: "center" };
  const styleItem = { alignItems: "center" };
  const configArr = ref<FormConfigItemType[]>([
    {
      label: "询价单号",
      prop: "billNo",
      class: "center-label",
      colProp: { span: 8 },
      style: styleItem,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="自动生成" style={styleEl} disabled />
    },
    {
      label: "询价日期",
      prop: "inquiryDate",
      class: "center-label",
      colProp: { span: 8 },
      style: styleItem,
      render: ({ formModel, row }) => (
        <el-date-picker
          type="date"
          v-model={formModel[row.prop]}
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          placeholder="请选择"
          disabled
          class="ui-w-100"
          style={{ ...styleEl, width: "100%" }}
        />
      )
    },
    {
      label: "物料编码",
      prop: "materialCode",
      class: "center-label",
      colProp: { span: 8 },
      style: styleItem,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" disabled style={styleEl} />
    },
    {
      label: "物料名称",
      prop: "materialName",
      class: "center-label",
      colProp: { span: 8 },
      style: styleItem,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" disabled style={styleEl} />
    },
    {
      label: "物料规格",
      prop: "materialSpec",
      class: "center-label",
      colProp: { span: 16 },
      style: styleItem,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" disabled style={styleEl} />
    },
    {
      label: "单价类型",
      prop: "priceType",
      class: "center-label",
      colProp: { span: 8 },
      style: styleItem,
      render: ({ formModel, row }) => {
        onChangePriceType(formModel[row.prop]);
        return (
          <el-select v-model={formModel[row.prop]} placeholder="请选择" value-key="value" class="ui-w-100" onChange={onChangePriceType} style={styleEl}>
            {priceType.map((item) => (
              <el-option key={item.value} label={item.label} value={item.value} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "单价",
      prop: "purchasePrice",
      class: "center-label",
      colProp: { span: 16 },
      style: styleItem,
      hide: true,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" style={styleEl} />
    },
    { label: "", prop: "empty", class: "center-label hide-content-left", colProp: { span: 16 }, hide: false, render: () => null },
    {
      label: "",
      prop: "mkPurchaseInquiryPriceVOS",
      class: "center-label hide-content-left",
      colProp: { span: 24 },
      style: styleItem,
      hide: true,
      labelWidth: "0px",
      render: ({ formModel, row }) => {
        return (
          <pure-table
            border
            row-key="id"
            adaptive={true}
            align-whole="left"
            size="small"
            data={formModel[row.prop] || []}
            columns={columns}
            highlight-current-row
            show-overflow-tooltip={true}
          />
        );
      }
    }
  ]);

  function onChangePriceType(value) {
    configArr.value.forEach((item) => {
      if (!value) {
        if (["empty"].includes(item.prop)) item.hide = false;
        return;
      }
      if (["purchasePrice"].includes(item.prop)) {
        item.hide = value === "阶梯";
      }
      if (["empty", "mkPurchaseInquiryPriceVOS"].includes(item.prop)) {
        item.hide = value === "普通";
      }
    });
  }
  return configArr;
};
