<!-- /*
 * @Author: Hailen
 * @Date: 2023-07-05 11:45:27
 * @Last Modified by:   Hailen
 * @Last Modified time: 2023-07-05 11:45:27
 */ -->

<script setup lang="tsx">
import { setColumn } from "@/utils/table";
import { downloadFile, formatDate } from "@/utils/common";
import { onMounted, reactive, ref } from "vue";
import { PureTableBar } from "@/components/RePureTableBar";
import {
  statementFileList,
  FileListItemType,
  deleteStatement,
  dtatementDetail,
  StatementDetailItemType,
  StatementDetailType,
  StatementDetailFileItemType
} from "@/api/supplyChain";
import EditForm, { FormConfigItemType } from "@/components/EditForm/index.vue";
import { showMessageBox, message } from "@/utils/message";
import { StateInfo } from "../utils/hook";

/** 信息中心的查看单据id */
const props = defineProps<{ id?: string; fbillNo?: string; type?: "edit" | "view" }>();
const baseApi = import.meta.env.VITE_BASE_API;

const maxHeight = 200;
const loading = ref<boolean>(false);
const isDisabled = ref<boolean>(false);
const columns = ref<TableColumnList[]>([]);
const columns2 = ref<TableColumnList[]>([]);
const dataList = ref<StatementDetailItemType[]>([]);
const dataList2 = ref<StatementDetailFileItemType[]>([]);
const formData = reactive<Partial<StatementDetailType>>({});
const statusObj = {
  1: { name: "对账单", type: "primary" },
  2: { name: "发票", type: "success" }
};

const formConfigs = ({ type }): FormConfigItemType[] => [
  {
    label: "应付单号",
    labelWidth: "100px",
    colProp: { span: 6 },
    prop: "fbillno",
    render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" disabled={true} />
  },
  {
    label: "供应商",
    labelWidth: "100px",
    colProp: { span: 6 },
    prop: "shortName",
    render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" disabled={true} />
  },
  {
    label: "币别",
    labelWidth: "100px",
    colProp: { span: 6 },
    prop: "currencyname",
    render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" disabled={true} />
  },
  {
    label: "价税合计",
    labelWidth: "100px",
    colProp: { span: 6 },
    prop: "fallamountfor",
    render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" disabled={true} />
  },
  {
    label: "业务日期",
    labelWidth: "100px",
    colProp: { span: 6 },
    prop: "fdate",
    render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" disabled={true} />
  },
  {
    label: "采购员",
    labelWidth: "100px",
    colProp: { span: 6 },
    prop: "userName",
    render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" disabled={true} />
  },
  {
    label: "付款条件",
    labelWidth: "100px",
    colProp: { span: 6 },
    prop: "fpayconditon",
    render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" disabled={true} />
  },
  {
    label: "整单折扣金额",
    labelWidth: "100px",
    colProp: { span: 6 },
    prop: "forderdiscountamountfor",
    render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" disabled={true} />
  }
];

onMounted(() => {
  getDataList();
  getColumnConfig();
});

const getColumnConfig = () => {
  const columnData: TableColumnList[] = [
    { label: "采购单号", prop: "purOrderBillNo", minWidth: 140 },
    { label: "入库单号", prop: "inStockBillNo", minWidth: 160 },
    { label: "物料编码", prop: "fmaterialid", minWidth: 140 },
    { label: "物料名称", prop: "materialname", minWidth: 160 },
    { label: "物料规则", prop: "fspecification", minWidth: 160 },
    { label: "计划位单", prop: "fpriceunitid", minWidth: 80 },
    { label: "单价", prop: "fprice", minWidth: 100 },
    { label: "计价数量", prop: "fpriceqty", minWidth: 100 },
    { label: "含税单价", prop: "ftaxprice", minWidth: 100 },
    { label: "税率(%)", prop: "fentrytaxrate", minWidth: 100 },
    { label: "折扣率(%)", prop: "fentrydiscountrate", minWidth: 100 },
    { label: "折扣额", prop: "fdiscountamountfor", minWidth: 100 },
    { label: "不含税金额", prop: "fnotaxamountfor", minWidth: 100 },
    { label: "税额", prop: "ftaxamountfor", minWidth: 100 },
    { label: "价税合计", prop: "fallamountfor", minWidth: 100 },
    { label: "批号", prop: "fnumber", minWidth: 100 }
  ];
  const columnData2: TableColumnList[] = [
    {
      label: "文件名",
      prop: "filePath",
      cellRenderer: ({ row }) => {
        const index = row.filePath?.lastIndexOf("/");
        return <span>{row.filePath?.slice(index + 1)}</span>;
      }
    },
    {
      label: "文件类型",
      prop: "status",
      align: "center",
      sortable: true,
      width: 160,
      cellRenderer: ({ row }) => (
        <el-tag type={statusObj[row.status].type} effect="dark" size="small" style={{ maxWidth: "46px", minWidth: "46px" }}>
          {statusObj[row.status].name}
        </el-tag>
      )
    },
    { label: "上传时间", prop: "createDate", width: 160, cellRenderer: ({ row }) => formatDate(row.createDate) }
  ];
  columns.value = setColumn({ columnData, operationColumn: { hide: true } });
  columns2.value = setColumn({ columnData: columnData2, radioColumn: { hide: true }, operationColumn: { width: 200 } });
};

function getDataList() {
  loading.value = true;
  const { fbillNo, id, type } = props;
  let param: any = { fbillNo }; // 页面详情传单据号
  if (id && type === "view") param = { id }; // 信息中心审批详情传id
  dtatementDetail(param)
    .then(({ data }) => {
      if (data) {
        Object.assign(formData, data);
        dataList.value = data.statementDetails || [];
        if (data.statementOAVO?.filePath) {
          dataList2.value.push({ ...data.statementOAVO, status: 1 });
        }
        if (data.statementInvoiceOAVO?.filePath) {
          dataList2.value.push({ ...data.statementInvoiceOAVO, status: 2 });
        }
      }
    })
    .finally(() => (loading.value = false));
}

const onView = (row: FileListItemType) => {
  window.open(baseApi + row.filePath, "_blank");
};

const onDownload = (row: FileListItemType) => {
  if (!row.filePath) return message("文件不存在", { type: "error" });
  const index = row.filePath?.lastIndexOf("/");
  const fileName = row.filePath?.slice(index + 1);
  downloadFile(row.filePath, fileName);
};

// 单据状态判断是否可删除
const hasDelete = (row: FileListItemType, formData) => {
  const statementState = [StateInfo.submit, StateInfo.reAudit].includes(formData.statementOAVO.billState);
  const invoiceState = [StateInfo.submit, StateInfo.reAudit].includes(formData.statementInvoiceOAVO.billState);
  const isDel = row.status === 1 ? statementState : invoiceState;
  return isDel;
};

const onDelete = (row: FileListItemType) => {
  showMessageBox(`确认删除文件【${row.fileName}】吗?`).then(() => {
    deleteStatement({
      billNo: row.billNo,
      date: formData.fdate,
      fbillNo: formData.statementOAVO.kingdeeBillNo,
      fileName: row.fileName,
      id: formData.id,
      statementBillNo: formData.statementOAVO.billNo,
      status: row.billState,
      supplierCode: formData.userCode
    })
      .then((res) => {
        if (!res.data) return message("删除失败", { type: "error" });
        getDataList();
        message("删除成功");
      })
      .catch(console.log);
  });
};
</script>
<template>
  <div class="statement-detail" v-loading="loading">
    <title-cate name="对账单详情" style="margin-bottom: 10px" />
    <EditForm :formInline="formData" :formProps="{ labelWidth: '120px' }" :formConfigs="formConfigs({ type })" class="preview-disabled-form" />
    <title-cate name="文件列表" style="margin: 5px 0" />
    <PureTableBar :columns="columns2" :show-icon="false">
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
          :height="150"
          :max-height="150"
          row-key="id"
          :adaptive="true"
          align-whole="center"
          :loading="false"
          :size="size"
          :data="dataList2"
          :columns="dynamicColumns"
          :paginationSmall="size === 'small'"
          highlight-current-row
          :show-overflow-tooltip="true"
        >
          <template #operation="{ row }">
            <el-button size="small" type="primary" @click="onView(row)" :disabled="isDisabled">查看</el-button>
            <el-button size="small" type="success" @click.stop="onDownload(row)" :disabled="isDisabled">下载</el-button>
            <el-button v-if="type === 'edit' && hasDelete(row, formData)" size="small" type="danger" @click.stop="onDelete(row)" :disabled="isDisabled">
              删除
            </el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>

    <title-cate name="对账单明细" style="margin: 5px 0" />
    <PureTableBar :columns="columns" :show-icon="false" style="padding: 15px 0 0">
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
          :height="maxHeight"
          :max-height="maxHeight"
          row-key="id"
          class="leave-apply-detail"
          :adaptive="true"
          align-whole="center"
          :loading="false"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :paginationSmall="size === 'small'"
          highlight-current-row
          :show-overflow-tooltip="true"
        />
      </template>
    </PureTableBar>
  </div>
</template>
