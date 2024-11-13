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
      :formConfigs="formConfigs()"
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
              <UploadButton
                :limit="1"
                :accept="['.xlsx, .xls'].join(',')"
                :multiple="false"
                :showFileList="false"
                @change="(file) => onUploadChange('material', file)"
              >
                <el-button size="small" class="ml-10">重新导入</el-button>
              </UploadButton>
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
                <el-button size="small" type="primary" @click.stop="onCalculatePrice(row)">采购核价</el-button>
                <el-button size="small" type="info" @click.stop="onHistoryOrder(row)">历史订单</el-button>
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
              <UploadButton
                :limit="1"
                :accept="['.xlsx, .xls'].join(',')"
                :multiple="false"
                :showFileList="false"
                @change="(file) => onUploadChange('package', file)"
              >
                <el-button size="small" class="ml-10">重新导入</el-button>
              </UploadButton>
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
                <el-button size="small" type="primary" @click.stop="onCalculatePrice(row)">采购核价</el-button>
                <el-button size="small" type="info" @click.stop="onHistoryOrder(row)">历史订单</el-button>
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
import EditForm from "@/components/EditForm/index.vue";
import { formRules, formConfigs } from "./utils/config";
import { cloneDeep, handleTree } from "@pureadmin/utils";
import { PureTableBar } from "@/components/RePureTableBar";
import SelectTable from "@/components/HxModalInput/SelectTable.vue";
import { setColumn, tableEditRender, RendererType } from "@/utils/table";
import { combineArrays } from "@/views/oa/marketing/saleManage/quoteApply/utils/hook";
import { detailQuoteSale, historyQuoteSale, QuoteSaleItemType, QuoteBomItemType, submitQuoteSale, importQuoteSale } from "@/api/oaManage/marketing";
import UploadButton from "@/components/UploadButton.vue";
import { UploadFiles } from "element-plus";

const props = defineProps<{ row?: QuoteSaleItemType }>();

const formRef = ref();
const tableRef3 = ref();
const tableRef4 = ref();
const loading = ref(false);
const activeName = ref("price");
const dataList = ref<any[]>([]);
const dataList2 = ref<any[]>([]);
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
const formData = ref({ ...props.row.mkQuoteRequestVO, quoteList: [] });

onMounted(() => {
  getDetail();
  getColumnConfig();
});

// 编辑表格
const editCell_2 = tableEditRender({
  customRender: ({ index, row, column, callback }) => {
    return (
      <RegInput
        v-model={row[column["property"]]}
        autoFocus={true}
        autoSelect={true}
        isNumber={true}
        pattern={regExp.number3}
        onBlur={() => callback({ index })}
      />
    );
  }
});
const editCell_3 = tableEditRender({
  editFinish: ({ index, prop, row }) => {
    const fileds = ["materialName", "specification"];
    if (fileds.includes(prop)) {
      let tRow = dataList3Temp.value.find((item) => item.id === row.id);
      if (activeName.value === "package") tRow = dataList4Temp.value.find((item) => item.id === row.id);
      const isMatch = fileds.every((field) => tRow[field].trim() === row[field].trim());
      row.materialCode = isMatch ? tRow?.materialCode : "";
    }
  }
});

const getColumnConfig = async () => {
  const cellRenderer: RendererType = ({ column, row }) => <span class="ui-d-ib lh-22">{row[column["property"]]}</span>;
  const columnData: TableColumnList[] = [
    { label: "上一订单数量(PCS)", prop: "lastOrderQuantity", align: "right", cellRenderer },
    { label: "上一订单售价(USD)", prop: "lastOrderPrice", align: "right", cellRenderer },
    { label: "上一订单毛利率(%)", prop: "lastOrderGrossMargin", align: "right", cellRenderer },
    { label: "上一订单汇率", prop: "lastOrderExchangeRate", align: "right", cellRenderer },
    { label: "上一订单日期", prop: "lastOrderDate", align: "center", cellRenderer }
  ];
  const columnData2: TableColumnList[] = [
    {
      label: "变动成本",
      prop: "",
      align: "center",
      minWidth: 160,
      children: [
        {
          label: "类别",
          prop: "category",
          align: "center",
          children: [{ label: "MOQ", prop: "moq", headerAlign: "center", align: "right", minWidth: 90 }]
        },
        {
          label: "不含数金额",
          prop: "",
          align: "center",
          children: [
            { label: "裸机材料", prop: "rawMaterialCost", align: "right" },
            { label: "包材", prop: "packagingCost", headerAlign: "center", align: "right" },
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
              label: "单机成本合计",
              prop: "totalUnitCost",
              headerAlign: "center",
              align: "right",
              minWidth: 110,
              cellRenderer: ({ row, column }) => {
                const calcArr = [row.rawMaterialCost, row.packagingCost, row.laborCost, row.manufacturingCost];
                const value = calcArr.reduce((pre, cur) => pre + (cur || 0), 0).toFixed(2);
                row[column["property"]] = value;
                return <span>{value}</span>;
              }
            },
            { label: "单位边际贡献", prop: "unitContributionMargin", headerAlign: "center", align: "right", minWidth: 110 },
            { label: "出口报价(美金)", prop: "exportPrice", headerAlign: "center", align: "right", minWidth: 140 },
            { label: "内销报价(人民币)", prop: "domesticPrice", headerAlign: "center", align: "right", minWidth: 140 },
            {
              label: "公司需求毛利率(%)",
              prop: "companyGrossMargin",
              headerAlign: "center",
              align: "right",
              minWidth: 150,
              cellRenderer: (data) => editCell_2.editCellRender({ type: "input", data, isEdit: true })
            }
          ]
        }
      ]
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
    { label: "物料属性", prop: "materialProperty", width: 80 },
    { label: "子项单位", prop: "childrenUnit", width: 80 },
    { label: "分子", prop: "baseNumerator", align: "right", width: 55 },
    { label: "分母", prop: "baseDenominator", align: "right", width: 55 },
    { label: "材料单价", prop: "materialUnitPrice", align: "right", width: 80 },
    { label: "计价单位", prop: "valuationUnit", width: 80 },
    { label: "材料金额", prop: "materialUnitMoney", align: "right", width: 80 }
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

      const quoteinfo = mkQuoteRequestVO || row.mkQuoteRequestVO;
      const quoteList = combineArrays(quoteinfo?.quoteQuantityLists, quoteinfo?.quoteQuantityMoneyLists, quoteinfo?.currencyLists);
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
  if (!row.materialCode) return message("物料编码不存在", { type: "error" });
  submitQuoteSale(row).then(({ data }) => {
    if (!data) return message("核算失败", { type: "error" });
    message("核算成功");
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

function onOperate(type: "material" | "package", action: "clear" | "add" | "delete") {
  const { _dataList, _row, _tableRef } = {
    material: { _dataList: dataList3, _row: rowData3, _tableRef: tableRef3 },
    package: { _dataList: dataList4, _row: rowData4, _tableRef: tableRef4 }
  }[type];
  const rowIndex = _dataList.value.findIndex((item) => item === _row.value);
  if (action === "clear") _dataList.value = [];
  if (action === "add") _dataList.value.unshift({ uuid: uuidv4(), isNew: true } as QuoteBomItemType);
  if (action === "delete") {
    if (rowIndex === -1) return message("请先选择要删除的行", { type: "error" });
    _dataList.value = _dataList.value.filter((item) => item !== _row.value);
    const newIndex = _dataList.value[rowIndex] ? rowIndex : rowIndex - 1;
    _row.value = _dataList.value[newIndex];
    _tableRef.value.getTableRef()?.setCurrentRow(_dataList.value[newIndex]);
  }
}

function onUploadChange(type: "material" | "package", files: UploadFiles) {
  const fd = new FormData();
  fd.append("file", files[0].raw);
  importQuoteSale(fd).then(({ data }) => {
    if (!data) return message("导入失败", { type: "error" });
    message("导入成功");
    getDetail();
  });
}

const onCurrentChange = (row: QuoteBomItemType) => {
  rowData3.value = row;
};
const onCurrentChange2 = (row: QuoteBomItemType) => {
  rowData4.value = row;
};

function getRef() {
  return {
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
