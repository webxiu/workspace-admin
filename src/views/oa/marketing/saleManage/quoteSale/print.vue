<template>
  <div class="sale-wrap" v-loading="loading">
    <div class="flex-col align-center">
      <!-- <img src="@/assets/logo/print_color_logo.png" width="100%" /> -->
      <p class="title">销售报价单</p>
    </div>
    <EditForm
      ref="formRef"
      size="small"
      :formInline="formData"
      :formItemGutter="0"
      :formRules="formRules"
      :formProps="{ labelWidth: '160px', requireAsteriskPosition: 'right', inlineMessage: true }"
      :formConfigs="formConfigs({ currencyList })"
      class="border-form"
    />
    <div class="ui-p-r">
      <el-tabs v-model="activeName" class="ui-w-100 mt-30 pb-30" style="position: absolute">
        <el-tab-pane label="报价" name="price">
          <pure-table
            border
            row-key="id"
            :adaptive="true"
            align-whole="left"
            size="small"
            :data="dataList"
            :columns="columns"
            highlight-current-row
            :show-overflow-tooltip="true"
          />
          <pure-table
            class="mt-34"
            border
            :height="400"
            row-key="id"
            :adaptive="true"
            align-whole="left"
            size="small"
            :data="dataList2"
            :columns="columns2"
            highlight-current-row
            :show-overflow-tooltip="true"
          />
        </el-tab-pane>
        <el-tab-pane label="材料BOM" name="material">
          <PureTableBar :columns="columns" class="flex-1" :showIcon="false">
            <template #title>
              <el-button size="small" @click="onOperate('material', 'clear')">清空</el-button>
              <el-button size="small" @click="onOperate('material', 'add')">增行</el-button>
              <el-button size="small" @click="onOperate('material', 'delete')">删行</el-button>
              <el-button size="small" :disabled="!isEdit" @click="onOperate('material', 'import')">重新导入</el-button>
            </template>
            <pure-table
              ref="tableRef3"
              border
              row-key="id"
              :height="450"
              :adaptive="true"
              align-whole="left"
              size="small"
              :data="dataList3"
              :columns="columns3"
              highlight-current-row
              :default-expand-all="true"
              :show-overflow-tooltip="true"
              :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
              @row-dblclick="onHistoryOrder"
              @current-change="onCurrentChange"
            >
              <template #operation="{ row }">
                <el-button
                  size="small"
                  type="primary"
                  :disabled="[PurchaseState.submit, PurchaseState.audit, PurchaseState.success].includes(row.verificationState) || !isEdit"
                  @click.stop="onCalculatePrice(row)"
                >
                  采购核价
                </el-button>
                <el-button size="small" type="danger" :disabled="!isEdit" @click.stop="onHistoryOrder(row)">历史订单</el-button>
              </template>
            </pure-table>
          </PureTableBar>
        </el-tab-pane>
        <el-tab-pane label="包材BOM" name="package">
          <PureTableBar :columns="columns" class="flex-1" :showIcon="false">
            <template #title>
              <el-button size="small" @click="onOperate('package', 'clear')">清空</el-button>
              <el-button size="small" @click="onOperate('package', 'add')">增行</el-button>
              <el-button size="small" @click="onOperate('package', 'delete')">删行</el-button>
              <el-button size="small" :disabled="!isEdit" @click="onOperate('package', 'import')">重新导入</el-button>
            </template>
            <pure-table
              border
              ref="tableRef4"
              row-key="id"
              :height="450"
              :adaptive="true"
              align-whole="left"
              size="small"
              :data="dataList4"
              :columns="columns4"
              highlight-current-row
              :default-expand-all="true"
              :show-overflow-tooltip="true"
              :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
              @row-dblclick="onHistoryOrder"
              @current-change="onCurrentChange2"
            >
              <template #operation="{ row }">
                <el-button
                  size="small"
                  type="primary"
                  :disabled="[PurchaseState.submit, PurchaseState.audit, PurchaseState.success].includes(row.verificationState) || !isEdit"
                  @click.stop="onCalculatePrice(row)"
                >
                  采购核价
                </el-button>
                <el-button size="small" type="danger" :disabled="!isEdit" @click.stop="onHistoryOrder(row)">历史订单</el-button>
              </template>
            </pure-table>
          </PureTableBar>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="tsx">
import regExp from "@/utils/regExp";
import { v4 as uuidv4 } from "uuid";
import { message } from "@/utils/message";
import { Question } from "@/config/elements";
import RegInput from "@/components/RegInput.vue";
import { h, onMounted, reactive, ref } from "vue";
import { EditPen } from "@element-plus/icons-vue";
import { addDialog } from "@/components/ReDialog";
import { getMaterialGroupTreeData, MaterialGroupItemType, OptionItemType } from "@/api/plmManage";
import EditForm from "@/components/EditForm/index.vue";
import { formRules, formConfigs, quoteFormula } from "./utils/config";
import { cloneDeep, handleTree } from "@pureadmin/utils";
import { PureTableBar } from "@/components/RePureTableBar";
import SelectTable from "@/components/HxModalInput/SelectTable.vue";
import { setColumn, tableEditRender, RendererType, getEnumDictList } from "@/utils/table";
import { combineArrays } from "@/views/oa/marketing/saleManage/quoteApply/utils/hook";
import { detailQuoteSale, historyQuoteSale, QuoteSaleItemType, QuoteBomItemType, submitQuoteSale, regenerateQuoteSale } from "@/api/oaManage/marketing";
import { VariableCostItemType } from "@/api/oaManage/types/marketing";
import { TableColumn } from "@pureadmin/table";

/** 采购询价状态 */
enum PurchaseState {
  /** 不禁用 采购核价按钮, */
  wait = 0,
  /** 禁用按钮并显示 待提交采购询价单, */
  submit = 1,
  /** 禁用按钮并显示 正在审核, */
  audit = 2,
  /** 禁用并显示 采购核价成功  (采购询价成功), */
  success = 3,
  /** 不禁用 采购核价按钮  (采购核价失败) */
  error = 4
}

const props = defineProps<{ row?: QuoteSaleItemType; isEdit?: boolean }>();

const formRef = ref();
const tableRef3 = ref();
const tableRef4 = ref();
const loading = ref(false);
const activeName = ref("price");
const dataList = ref<any[]>([]);
const dataList2 = ref<VariableCostItemType[]>([]);
const dataList3Temp = ref<QuoteBomItemType[]>([]);
const dataList4Temp = ref<QuoteBomItemType[]>([]);
const dataList3 = ref<QuoteBomItemType[]>([]);
const dataList4 = ref<QuoteBomItemType[]>([]);
const columns = ref<TableColumnList[]>([]);
const columns2 = ref<TableColumnList[]>([]);
const columns3 = ref<TableColumnList[]>([]);
const columns4 = ref<TableColumnList[]>([]);
const rowData3 = ref<QuoteBomItemType>();
const rowData4 = ref<QuoteBomItemType>();
const detailInfo = ref<QuoteSaleItemType>({} as QuoteSaleItemType);
const taxRateOptions = ref<OptionItemType[]>([]);
const formData = ref({ ...props.row.mkQuoteRequestVO, quoteList: [] });
const currencyList = ref<OptionItemType[]>([]);
const materialOptions = ref<MaterialGroupItemType[]>([]);

onMounted(() => {
  getOptions();
  getDetail();
  getColumnConfig();
});

const getOptions = () => {
  getEnumDictList(["Currency", "TaxRate"]).then(({ Currency, TaxRate }) => {
    currencyList.value = Currency;
    taxRateOptions.value = TaxRate.map((item) => ({ ...item, optionName: item.optionName, optionValue: +item.optionValue }));
  });

  getMaterialGroupTreeData({}).then(({ data }) => {
    materialOptions.value = data || [];
  });
};

// 编辑表格
const editCell_1 = tableEditRender({
  customRender: ({ index, row, column, callback }) => {
    return (
      <RegInput
        v-model={row[column["property"]]}
        autoFocus={true}
        autoSelect={true}
        isNumber={true}
        placeholder="请输入"
        pattern={regExp.price}
        onBlur={() => callback({ index })}
      />
    );
  }
});
const editCell_2 = tableEditRender({
  customRender: ({ index, row, column, callback }) => {
    if (["taxRate"].includes(column["property"])) return null;
    return (
      <RegInput
        v-model={row[column["property"]]}
        autoFocus={true}
        autoSelect={true}
        isNumber={true}
        placeholder="请输入"
        pattern={regExp.decimal}
        onBlur={() => callback({ index })}
      />
    );
  }
});
const editCell_3 = tableEditRender({
  customRender: ({ index, row, column, callback }) => {
    if (["materialUnitMoney"].includes(column["property"])) {
      return (
        <RegInput
          v-model={row[column["property"]]}
          autoFocus={true}
          autoSelect={true}
          isNumber={true}
          placeholder="请输入"
          pattern={regExp.decimal}
          onBlur={() => callback({ index })}
        />
      );
    }
  },
  editFinish: ({ prop, row }) => {
    const fileds = ["materialName", "specification"];
    if (fileds.includes(prop)) {
      let tRow = dataList3Temp.value.find((item) => item.id === row.id);
      if (activeName.value === "package") tRow = dataList4Temp.value.find((item) => item.id === row.id);
      const isMatch = fileds.every((field) => tRow && tRow[field].trim() === row[field].trim());
      row.materialCode = isMatch ? tRow?.materialCode : "";
    }
    if (["materialUnitMoney"].includes(prop)) {
      getMaterialMoneyTotal();
    }
  }
});

/** 材料金额合计-->(裸机材料|包材) */
const getMaterialMoneyTotal = () => {
  function plusFn(pre, cur) {
    const val = cur.materialUnitMoney || 0;
    const num = Number.isNaN(+val) ? 0 : +val;
    return pre + num;
  }
  const res3 = dataList3.value.reduce(plusFn, 0);
  const res4 = dataList4.value.reduce(plusFn, 0);
  dataList2.value.forEach((item) => {
    if (activeName.value === "material") item.rawMaterialCost = +res3.toFixed(2);
    if (activeName.value === "package") item.packagingCost = +res4.toFixed(2);
  });
};

/** 成本合计 */
const getTotalCost = (row: VariableCostItemType, column: TableColumn) => {
  const calcArr = [row.rawMaterialCost, row.packagingCost, row.laborCost, row.manufacturingCost];
  const value = calcArr.reduce((pre, cur) => pre + (cur || 0), 0).toFixed(2);
  row[column["property"]] = value;
  return value;
};

/** 报价 */
const getPrice = (row: VariableCostItemType, column: TableColumn) => {
  // 报价 = 成本合计 / (1 - 毛利率) * (1 + 税率) / 汇率
  const C = +row.totalUnitCost || 0;
  const GM = +row.grossProfitRate || 0;
  const TR = +row.taxRate || 0;
  const EX = Math.max(+row.exchangeRate || 0, 1e-6);
  let P = ((C / (1 - GM / 100)) * (1 + TR / 100)) / EX;
  if (GM >= 100) P = C * (1 + GM / 100) * (1 + TR / 100);
  row[column["property"]] = P.toFixed(2);
  return P.toFixed(2);
};
/** 单位边际贡献 */
const getMerginRevenue = (row: VariableCostItemType, column: TableColumn) => {
  const P = +row.quote || 0;
  const C = +row.totalUnitCost || 0;
  const EX = +row.exchangeRate || 1;
  const MC = (P * EX - C).toFixed(2);
  row[column["property"]] = MC;
  return MC;
};

const getColumnConfig = async () => {
  const cellRenderer: RendererType = ({ column, row }) => <span class="ui-d-ib lh-22">{row[column["property"]]}</span>;
  const columnData: TableColumnList[] = [
    { label: "上一订单数量(PCS)", prop: "lastOrderQuantity", align: "right", cellRenderer },
    { label: "上一订单币种", prop: "lastOrderPrice", align: "right", cellRenderer },
    { label: "上一订单售价", prop: "lastOrderPrice", align: "right", cellRenderer },
    {
      label: "上一订单毛利率(%)",
      prop: "lastOrderGrossMargin",
      align: "right",
      headerRenderer: ({ column }) => <Question label={column.label} Icon={EditPen} tipMsg={"编辑项"} />,
      cellRenderer: (data) => editCell_1.editCellRender({ type: "input", data, isEdit: true })
    },
    { label: "上一订单汇率", prop: "lastOrderExchangeRate", align: "right", cellRenderer },
    { label: "上一订单日期", prop: "lastOrderDate", align: "center", cellRenderer }
  ];
  const columnData2: TableColumnList[] = [
    { label: "类别", prop: "moq", headerAlign: "center", align: "right", minWidth: 90 },
    {
      label: "变动成本(不含税)",
      prop: "",
      align: "center",
      minWidth: 160,
      children: [
        { label: "裸机材料", prop: "rawMaterialCost", align: "right", minWidth: 80 },
        { label: "包材", prop: "packagingCost", headerAlign: "center", align: "right", minWidth: 80 },
        {
          label: "人工成本",
          prop: "laborCost",
          headerAlign: "center",
          align: "right",
          minWidth: 100,
          headerRenderer: ({ column }) => <Question label={column.label} Icon={EditPen} tipMsg={"编辑项"} />,
          cellRenderer: (data) => editCell_2.editCellRender({ type: "input", data, isEdit: true })
        },
        {
          label: "制造费用",
          prop: "manufacturingCost",
          headerAlign: "center",
          align: "right",
          minWidth: 100,
          headerRenderer: ({ column }) => <Question label={column.label} Icon={EditPen} tipMsg={"编辑项"} />,
          cellRenderer: (data) => editCell_2.editCellRender({ type: "input", data, isEdit: true })
        },
        {
          label: "成本合计",
          prop: "totalUnitCost",
          headerAlign: "center",
          align: "right",
          minWidth: 90,
          cellRenderer: ({ row, column }) => <span>{getTotalCost(row, column)}</span>
        }
      ]
    },
    {
      label: "单位边际贡献",
      prop: "unitContributionMargin",
      headerAlign: "center",
      align: "right",
      minWidth: 130,
      headerRenderer: ({ column }) => (
        <Question label={column.label} color="#4e9bd3" tipMsg={<p class="fz-14">单位边际贡献 = 报价 × 汇率 - 成本合计</p>} effect="light" />
      ),
      cellRenderer: ({ row, column }) => <span>{getMerginRevenue(row, column)}</span>
    },
    { label: "币种", prop: "currency", headerAlign: "center", align: "right", minWidth: 60 },
    {
      label: "汇率",
      prop: "exchangeRate",
      headerAlign: "center",
      align: "right",
      minWidth: 70,
      headerRenderer: ({ column }) => <Question label={column.label} Icon={EditPen} tipMsg={"编辑项"} />,
      cellRenderer: (data) => editCell_2.editCellRender({ type: "input", data, isEdit: true })
    },
    {
      label: "税率(%)",
      prop: "taxRate",
      headerAlign: "center",
      align: "right",
      minWidth: 90,
      headerRenderer: ({ column }) => <Question label={column.label} Icon={EditPen} tipMsg={"编辑项"} />,
      cellRenderer: (data) => editCell_2.editCellRender({ type: "select", data, options: taxRateOptions.value, isEdit: true })
    },
    {
      label: "报价",
      prop: "quote",
      headerAlign: "center",
      align: "right",
      minWidth: 80,
      headerRenderer: ({ column }) => <Question label={column.label} color="#4e9bd3" tipMsg={<img src={quoteFormula} width="260" alt="" />} effect="light" />,
      cellRenderer: ({ row, column }) => <span>{getPrice(row, column)}</span>
    },
    {
      label: "毛利率(%)",
      prop: "grossProfitRate",
      headerAlign: "center",
      align: "right",
      minWidth: 110,
      headerRenderer: ({ column }) => <Question label={column.label} Icon={EditPen} tipMsg={"编辑项"} />,
      cellRenderer: (data) => editCell_2.editCellRender({ type: "input", data, isEdit: true })
    }
  ];

  const columnData3: TableColumnList[] = [
    { label: "序号", width: 90, align: "left", cellRenderer: ({ index }) => <span>{index + 1}</span> },
    {
      label: "物料编码",
      prop: "materialCode",
      align: "left",
      minWidth: 120,
      headerRenderer: ({ column }) => <Question label={column.label} Icon={EditPen} tipMsg={"编辑项"} />,
      cellRenderer: (data) => editCell_3.editCellRender({ type: "input", data, isEdit: true })
    },
    {
      label: "物料名称",
      prop: "materialName",
      minWidth: 160,
      headerRenderer: ({ column }) => <Question label={column.label} Icon={EditPen} tipMsg={"编辑项"} />,
      cellRenderer: (data) => editCell_3.editCellRender({ type: "input", data, isEdit: true })
    },
    {
      label: "规格型号",
      prop: "specification",
      minWidth: 200,
      headerRenderer: ({ column }) => <Question label={column.label} Icon={EditPen} tipMsg={"编辑项"} />,
      cellRenderer: (data) => editCell_3.editCellRender({ type: "input", data, isEdit: true })
    },
    {
      label: "物料分组",
      prop: "materialGroupId",
      minWidth: 100,
      headerRenderer: ({ column }) => <Question label={column.label} Icon={EditPen} tipMsg={"编辑项"} />,
      cellRenderer: (data) =>
        editCell_3.editCellRender({
          type: "treeSelect",
          data,
          isEdit: true,
          options: materialOptions.value as any[],
          eleProps: { props: { children: "children", label: "name", value: "id" }, nodeKey: "id", clearable: true }
        })
    },
    { label: "物料属性", prop: "materialProperty", width: 80 },
    { label: "子项单位", prop: "childrenUnit", width: 80 },
    { label: "分子", prop: "baseNumerator", align: "right", width: 55 },
    { label: "分母", prop: "baseDenominator", align: "right", width: 55 },
    { label: "材料单价", prop: "materialUnitPrice", align: "right", width: 80 },
    { label: "计价单位", prop: "valuationUnit", width: 80 },
    {
      label: "材料金额",
      prop: "materialUnitMoney",
      align: "right",
      width: 100,
      headerRenderer: ({ column }) => <Question label={column.label} Icon={EditPen} tipMsg={"编辑项"} />,
      cellRenderer: (data) => editCell_3.editCellRender({ type: "input", data, isEdit: true })
    }
  ];
  const columnData4: TableColumnList[] = [...columnData3];
  columns.value = setColumn({
    columnData: columnData,
    radioColumn: { hide: true },
    indexColumn: { hide: true },
    operationColumn: { hide: true, align: "center" }
  });
  columns2.value = setColumn({ columnData: columnData2, radioColumn: { hide: true }, operationColumn: { hide: true, align: "center" } });
  columns3.value = setColumn({ columnData: columnData3, indexColumn: { hide: true }, operationColumn: { width: 180 } });
  columns4.value = setColumn({ columnData: columnData4, indexColumn: { hide: true }, operationColumn: { width: 180 } });
};

function getDetail() {
  const row = props.row;
  loading.value = true;
  detailQuoteSale({ ...row })
    .then(({ data }) => {
      const {
        mkQuoteRequestVO,
        variableCost,
        materialBomLists,
        packMaterialBomLists,
        lastOrderQuantity,
        lastOrderPrice,
        lastOrderGrossMargin,
        lastOrderExchangeRate,
        lastOrderDate
      } = data || ({} as QuoteSaleItemType);
      detailInfo.value = data;
      const quoteinfo = mkQuoteRequestVO || row.mkQuoteRequestVO;
      const quoteList = combineArrays(quoteinfo?.quoteQuantityLists, quoteinfo?.quoteQuantityMoneyLists, quoteinfo?.currencyLists);
      // 物料分组转字符串(怎么麻烦怎么来)
      materialBomLists.forEach((item) => (item.materialGroupId = item.materialGroupId + ""));
      packMaterialBomLists.forEach((item) => (item.materialGroupId = item.materialGroupId + ""));

      const result3 = handleTree(materialBomLists || [], "childrenId", "parentId", "children");
      const result4 = handleTree(packMaterialBomLists || [], "childrenId", "parentId", "children");
      dataList.value = [{ lastOrderQuantity, lastOrderPrice, lastOrderGrossMargin, lastOrderExchangeRate, lastOrderDate }];
      formData.value = { ...quoteinfo, quoteList };
      dataList2.value = variableCost || [];
      dataList3.value = result3;
      dataList4.value = result4;
      dataList3Temp.value = cloneDeep(materialBomLists);
      dataList4Temp.value = cloneDeep(packMaterialBomLists);
    })
    .finally(() => (loading.value = false));
}

function onCalculatePrice(row) {
  if ([PurchaseState.submit, PurchaseState.audit, PurchaseState.success].includes(row.verificationState)) {
    return message("当前状态不能提交", { type: "error" });
  }
  if (!row.materialCode) return message("物料编码不存在", { type: "error" });
  submitQuoteSale(row).then(({ data }) => {
    if (!data) return message("发送失败", { type: "error" });
    message("发送成功");
    getDetail();
  });
}

function onHistoryOrder(row) {
  if (!row.materialCode) return message("物料编码不存在", { type: "error" });
  const formData = reactive({ materialCode: row.materialCode });
  addDialog({
    title: "历史订单",
    props: {
      multiple: false,
      maxHeight: 520,
      paramConfig: formData,
      columns: [
        { label: "供应商名称", prop: "supplierName", headerAlign: "center" },
        { label: "含税单价", prop: "taxPrice", headerAlign: "center", align: "right" },
        { label: "不含税单价", prop: "price", headerAlign: "center", align: "right" },
        { label: "数量", prop: "fqty", headerAlign: "center", align: "right" },
        { label: "采购日期", prop: "FDATE", headerAlign: "center" }
      ] as TableColumnList[],
      api: historyQuoteSale
    },
    width: "70%",
    draggable: true,
    fullscreenIcon: true,
    closeOnClickModal: false,
    contentRenderer: () => h(SelectTable, { ref: formRef }),
    beforeSure: (done, { options }) => done()
  });
}

/** 删除选中子项 */
const removeChildItem = (arr, _row) => {
  return arr.filter((item) => {
    if (item.children) {
      item.children = removeChildItem(item.children, _row);
    }
    return item !== _row;
  });
};

function onOperate(type: "material" | "package", action: "clear" | "add" | "delete" | "import") {
  if (!props.isEdit && action === "import") return message("当前状态不能操作", { type: "error" });
  const { _dataList, _row, _tableRef } = {
    material: { _dataList: dataList3, _row: rowData3, _tableRef: tableRef3 },
    package: { _dataList: dataList4, _row: rowData4, _tableRef: tableRef4 }
  }[type];
  if (action === "clear") _dataList.value = [];
  if (action === "add") _dataList.value.unshift({ uuid: uuidv4(), isNew: true } as QuoteBomItemType);
  if (action === "delete") {
    if (!_row?.value) return message("请先选择要删除的行", { type: "error" });
    const rowIndex = _dataList.value.findIndex((item) => item === _row.value);
    // 找到索引为顶级列表项, 找不到为子项或不存在
    if (rowIndex > -1) {
      _dataList.value = _dataList.value.filter((item) => item !== _row.value);
      const newIndex = _dataList.value[rowIndex] ? rowIndex : rowIndex - 1;
      _row.value = _dataList.value[newIndex];
      _tableRef.value.getTableRef()?.setCurrentRow(_dataList.value[newIndex]);
    } else {
      _dataList.value = removeChildItem(_dataList.value, _row.value);
    }
  }
  if (action === "import") onUploadChange(type);
}

function onUploadChange(type: "material" | "package") {
  if (!detailInfo.value.id) return message("详情数据不存在", { type: "error" });
  regenerateQuoteSale(detailInfo.value)
    .then(({ data }) => {
      if (!data) return message("重新导入失败", { type: "error" });
      message("重新导入成功");
      getDetail();
    })
    .catch(console.log);
}

const onCurrentChange = (row: QuoteBomItemType) => {
  rowData3.value = row;
};
const onCurrentChange2 = (row: QuoteBomItemType) => {
  rowData4.value = row;
};

function getRef() {
  const rowInfo = dataList.value[0] || {};
  return {
    ...rowInfo,
    FormRef: formRef.value.getRef(),
    formData: formData.value,
    variableCost: dataList2.value,
    materialBomLists: dataList3.value,
    packMaterialBomLists: dataList4.value
  };
}

defineExpose({ getRef });
</script>

<style lang="scss">
$color: #111;
$size: 16px;

.sale-wrap {
  color: $color;
  font-family: "宋体", Arial, sans-serif, serif;
  .title {
    flex: 1;
    font-size: 30px;
    color: $color;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .el-input__prefix {
    display: none;
  }

  .el-form-item label,
  .el-input__inner,
  .el-textarea__inner {
    font-size: $size;
    font-family: "宋体", Arial, sans-serif, serif;
    color: $color;
    cursor: default;
  }
}
</style>
