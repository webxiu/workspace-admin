/*
 * @Author: Hailen
 * @Date: 2024-06-04 15:31:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2025-03-26 17:09:00
 */

import { BillState, BillState_Color, PAGE_CONFIG } from "@/config/constant";
import { Delete, Edit, Plus, Position, Printer, RefreshLeft, Select, Switch, Tickets } from "@element-plus/icons-vue";
import { EsopList, OperateBookItemType, addEsop, changeESOP, deleteEsop, updateEsop } from "@/api/oaManage/productMkCenter";
import { TableGroupItemType, commonSubmit, roleUserList } from "@/api/systemManage";
import { getEnumDictList, getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { h, onMounted, reactive, ref } from "vue";
import { message, showMessageBox, wrapFn } from "@/utils/message";
import { useRoute, useRouter } from "vue-router";

import type { ColDef } from "ag-grid-community";
import Detail from "../Detail.vue";
import DistributeModal from "../DistributeModal.vue";
import NodeDetailList from "@/components/NodeDetailList/index.vue";
import { OptionItemType } from "@/api/plmManage";
import { PaginationProps } from "@pureadmin/table";
import Print from "../sopInfo/print.vue";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { addDialog } from "@/components/ReDialog";
import { commonBackLogic } from "@/utils/common";
import { getAgGridColumns } from "@/components/AgGridTable/config";
import { useEleHeight } from "@/hooks";

export const useConfig = () => {
  const isAgTable = ref(true);
  const columnDefs = ref<ColDef[]>([]);
  const router = useRouter();
  const route = useRoute();
  const loading = ref<boolean>(false);
  const rowData = ref<OperateBookItemType>();
  const columns = ref<TableColumnList[]>([]);
  const dataList = ref<OperateBookItemType[]>([]);
  const groupArrsList = ref<TableGroupItemType[]>([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 104);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const formData = reactive({
    manualName: "",
    billState: "",
    productModel: "",
    createUserName: "",
    startDate: "",
    endDate: "",
    page: 1,
    limit: PAGE_CONFIG.pageSize
  });
  const billOptions = ref<OptionItemType[]>([]);
  const searchOptions = reactive<SearchOptionType[]>([
    { label: "指导书名称", value: "manualName" },
    { label: "单据状态", value: "billState", children: [] },
    { label: "生产型号", value: "productModel" },
    { label: "创建人", value: "createUserName" },
    { label: "创建时间", value: "date", type: "daterange", format: "YYYY-MM-DD", startKey: "startDate", endKey: "endDate" }
  ]);

  onMounted(() => {
    getOptionList();
    getTableList();
    getColumnConfig();
  });

  function getOptionList() {
    getEnumDictList(["BillStatus"])
      .then(({ BillStatus }) => {
        searchOptions[1].children = BillStatus;
        billOptions.value = BillStatus;
      })
      .catch(console.log);
  }

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "单据编号", prop: "billNo" },
      { label: "作业指导书", prop: "manualName", width: 180 },
      { label: "产品型号", prop: "productCode" },
      { label: "文件编号", prop: "fileNumber" },
      { label: "版本", prop: "ver" },
      { label: "国家", prop: "country" },
      {
        label: "单据状态",
        prop: "billState",
        align: "center",
        cellRenderer({ row, column }) {
          const item = BillState_Color[row[column["property"]]];
          const billItem = billOptions.value.find((f) => f.optionValue === `${row[column["property"]]}`);
          const styleBox = { color: "#fff", padding: "3px 6px", borderRadius: "4px", background: item.color };
          return <span style={styleBox}>{billItem.optionName}</span>;
        }
      },
      { label: "PE工程师", prop: "peuserName" },
      { label: "创建人", prop: "createUserName" },
      { label: "创建时间", prop: "createDate", width: 160 }
    ];
    const { columnArrs, groupArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    if (groupArrs?.length) groupArrsList.value = groupArrs;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: { width: 140 } });
    columnDefs.value = getAgGridColumns<OperateBookItemType>({
      columnData,
      operationColumn: { width: 140 },
      renderButtons: () => {
        return [
          { name: "分发", type: "primary", onClick: (row) => onDistribute(row) },
          { name: "排位表", type: "success", onClick: (row) => onRowClick(row) }
        ];
      }
    });
  };

  const getTableList = () => {
    loading.value = true;
    EsopList(formData)
      .then(({ data }) => {
        dataList.value = data.records || [];
        pagination.total = data.total;
      })
      .finally(() => (loading.value = false));
  };

  const onTagSearch = (values) => {
    Object.assign(formData, values);
    getTableList();
  };

  const onRefresh = () => {
    getColumnConfig();
    getTableList();
  };

  const onCurrentChange = (row: OperateBookItemType) => {
    rowData.value = row;
  };

  const onRowClick = (row: OperateBookItemType) => {
    const { id, billState } = row;
    const { menuId } = route.query;
    const path = "/productMkCenter/engineerDept/operateBook/sopInfo";
    router.push({ path: path, query: { menuId, materialId: id, billState, isNewTag: "yes" } });
  };

  function onAdd() {
    onOpenEdit("add", {});
  }

  const onEdit = wrapFn(rowData, () => {
    onOpenEdit("edit", rowData.value);
  });
  function onOpenEdit(type: "add" | "edit", row: Partial<OperateBookItemType>) {
    const title = { add: "添加", edit: "修改" }[type];
    const formRef = ref();
    addDialog({
      title: title + "指导书",
      props: { id: row.id, type },
      width: "800px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(Detail, { ref: formRef }),
      beforeSure: (done, { options }) => {
        formRef.value.getRef().then(({ formData }) => {
          showMessageBox(`确认要提交吗?`).then(async () => {
            const reqApi = { add: addEsop, edit: updateEsop };
            const { data } = await reqApi[type](formData);
            if (!data) return message.error(`${title}失败`);
            done();
            getTableList();
            message.success(`${title}成功`);
          });
        });
      }
    });
  }

  const onDelete = wrapFn(rowData, async () => {
    showMessageBox(`确认要删除指导书【${rowData.value.manualName}】吗?`).then(async () => {
      const { data } = await deleteEsop({ id: rowData.value.id });
      if (!data) return message.error("删除失败");
      getTableList();
      message.success("删除成功");
    });
  });

  const onPrint = wrapFn(rowData, () => {
    const { id } = rowData.value;
    const formRef = ref();
    addDialog({
      title: "打印预览",
      props: { materialId: id, row: rowData.value },
      width: "80%",
      class: "sop-print",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      okButtonText: "打印",
      contentRenderer: () => h(Print, { ref: formRef }),
      beforeSure: () => formRef.value.onPrint()
    });
  });

  const onSubmit = wrapFn(rowData, () => {
    const { id, billId, billState } = rowData.value;
    if (![BillState.submit, BillState.reject].includes(billState)) {
      return message.error("只能提交【待提交/重新审核】的记录");
    }
    commonSubmit({ id, billId }).then(({ data }) => {
      if (!data) return message.error("提交失败");
      message.success("提交成功");
      getTableList();
    });
  });

  const onBack = wrapFn(rowData, () => {
    if (![BillState.auditing, BillState.audited].includes(rowData.value.billState)) {
      return message.error("当前状态不能进行回退");
    }
    commonBackLogic(rowData.value.billNo, getTableList);
  });

  const onChange = wrapFn(rowData, () => {
    const row = rowData.value;
    changeESOP({ id: row.id }).then(({ data }) => {
      if (!data) return message.error("变更失败");
      message.success("变更成功");
      getTableList();
    });
  });

  const onDistribute = (item) => {
    const row = item.id ? item : rowData.value;
    const formRef = ref();
    if (!row) return message.error("请选择一条记录");
    if (row.billState !== BillState.audited) {
      return message.error("只有已审核的指导书才能进行分发");
    }

    addDialog({
      title: "指导书分发",
      props: { manualId: row.id },
      width: "95%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      okButtonText: "分发并关闭",
      resetButtonText: "分发",
      showResetButton: true,
      beforeReset: () => formRef.value.getRef(() => getTableList()),
      contentRenderer: () => h(DistributeModal, { ref: formRef }),
      beforeSure: (done) => {
        formRef.value.getRef(() => {
          done();
          getTableList();
        });
      }
    });
  };
  const onAuditDetail = wrapFn(rowData, () => {
    const { billNo, billState } = rowData.value;
    addDialog({
      title: "查看审批详情",
      width: "900px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: true,
      hideFooter: true,
      contentRenderer: ({ options }) => h(NodeDetailList, { options, billNo, billState, billType: "operateBook" })
    });
  });
  function onSwitchTable() {
    isAgTable.value = !isAgTable.value;
    rowData.value = undefined;
  }

  // { clickHandler: onBack, type: "primary", text: "回退", icon: RefreshLeft, isDropDown: true },
  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "新增", icon: Plus, isDropDown: false },
    { clickHandler: onEdit, type: "success", text: "修改", icon: Edit, isDropDown: false },
    { clickHandler: onDelete, type: "danger", text: "删除", icon: Delete, isDropDown: false },
    { clickHandler: onDistribute, type: "primary", text: "分发", icon: Position, isDropDown: true },
    { clickHandler: onSubmit, type: "success", text: "提交", icon: Select, isDropDown: true },
    { clickHandler: onChange, type: "warning", text: "变更", icon: Switch, isDropDown: true },
    { clickHandler: onPrint, type: "default", text: "打印", icon: Printer, isDropDown: true },
    { clickHandler: onAuditDetail, type: "default", text: "审批详情", icon: Tickets, isDropDown: true }
  ]);

  return {
    columnDefs,
    isAgTable,
    loading,
    columns,
    dataList,
    maxHeight,
    buttonList,
    pagination,
    searchOptions,
    onTagSearch,
    onRefresh,
    onDistribute,
    onRowClick,
    onCurrentChange,
    onSwitchTable
  };
};
