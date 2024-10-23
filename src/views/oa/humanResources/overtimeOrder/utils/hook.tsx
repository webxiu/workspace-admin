/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-08-24 15:21:10
 */

import { OvertimeOrderItemType, overtimeOrderList, deleteOvertimeOrder, exportOvertimeOrder } from "@/api/oaManage/humanResources";
import { onMounted, h, reactive, ref } from "vue";
import { addDialog } from "@/components/ReDialog";
import Detail from "../detail/index.vue";
import NodeDetailList from "@/components/NodeDetailList/index.vue";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";

import { downloadFile, getTreeArrItem, getChildIDs, getFileNameOnUrlPath, commonBackLogic } from "@/utils/common";
import { setColumn, getExportConfig, getMenuColumns, updateButtonList } from "@/utils/table";
import { useEleHeight } from "@/hooks";
import { type PaginationProps } from "@pureadmin/table";
import { message, showMessageBox } from "@/utils/message";
import { getDeptOptions } from "@/utils/requestApi";
import { commonSubmit, getDeptTreeData } from "@/api/systemManage";
import { PAGE_CONFIG } from "@/config/constant";
import { ElMessage, dayjs } from "element-plus";

export enum AuditState {
  /** 待提交 */
  submit = 0,
  /** 审核中 */
  auditing = 1,
  /** 已审核 */
  audited = 2,
  /** 重新审核 */
  reAudit = 3
}

export const useConfig = () => {
  const treeData = ref([]);
  const currentRow = ref();
  const loading = ref<boolean>(false);
  const columns = ref<TableColumnList[]>([]);
  const dataList = ref<OvertimeOrderItemType[]>([]);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 70 + 51);

  const formData = reactive({
    page: 1,
    limit: PAGE_CONFIG.pageSize,
    staffName: "",
    staffCode: "",
    deptId: "",
    deptIdList: [],
    date: ""
  });

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "姓名", value: "staffName" },
    { label: "工号", value: "staffCode" },
    { label: "日期范围", value: "date", type: "daterange", format: "YYYY-MM-DD" },
    { label: "部门", value: "deptId", children: [] }
  ]);

  const nowDate = dayjs().format("YYYY-MM-DD");
  const startDate = dayjs().startOf("month").format("YYYY-MM-DD");
  const queryParams = reactive({ date: `${startDate} ~ ${nowDate}` });

  onMounted(() => {
    getColumnConfig();
    getOptionList();
  });

  const getOptionList = () => {
    getDeptOptions().then((data: any) => {
      treeData.value = data;
      searchOptions[3].children = data;
    });
  };

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "单据编号", prop: "billNo", fixed: true, minWidth: 140 },
      { label: "工号", prop: "staffCode", fixed: true, sortable: true, minWidth: 80 },
      { label: "姓名", prop: "staffName", fixed: true, minWidth: 100 },
      { label: "部门", prop: "deptName", fixed: true, sortable: true, minWidth: 120 },
      { label: "生产线", prop: "productLine", sortable: true },
      { label: "加班类型", prop: "overtimeType", sortable: true, minWidth: 140 },
      { label: "状态", prop: "billStateName", sortable: true, minWidth: 80 },
      { label: "开始日期", prop: "startDate", minWidth: 90 },
      { label: "开始时间", prop: "startTime", minWidth: 90 },
      { label: "结束日期", prop: "endDate", minWidth: 90 },
      { label: "结束时间", prop: "endTime", minWidth: 90 },
      { label: "天数", prop: "days", align: "right", sortable: true, minWidth: 70 },
      { label: "时长", prop: "hours", align: "right", sortable: true, minWidth: 70 },
      { label: "备注", prop: "remark", minWidth: 140 },
      { label: "创建人", prop: "createUserName", sortable: true },
      { label: "创建时间", prop: "createDate", minWidth: 160, sortable: true },
      { label: "项次", prop: "itemSequence", align: "right" }
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({
      columnData,
      formData,
      dragSelector: ".overtime-order",
      indexColumn: { fixed: true, width: 80 },
      radioColumn: { fixed: true },
      operationColumn: { minWidth: 200 }
    });
  };

  const handleTagSearch = (values) => {
    formData.date = values.date;
    formData.staffCode = values.staffCode;
    formData.staffName = values.staffName;
    formData.deptId = values.deptId;
    formData.deptIdList = [];
    if (values.deptId) {
      const result = getTreeArrItem(treeData.value, "value", values.deptId);
      formData.deptIdList = getChildIDs([result], "value");
    }
    onSearch();
  };

  // 搜索
  const onSearch = () => getTableList();

  const getTableList = () => {
    loading.value = true;
    const { date, ...reset } = formData;
    const params = {
      ...reset,
      endDate: date ? date.split("~")[1].trim() : "",
      startDate: date ? date.split("~")[0].trim() : ""
    };
    overtimeOrderList(params)
      .then(({ data }) => {
        loading.value = false;
        dataList.value = data.records || [];
        pagination.total = data.total;
      })
      .catch((err) => (loading.value = false));
  };

  const onAdd = () => {
    openDialog("add");
  };

  const onEdit = (row: OvertimeOrderItemType) => {
    const type = [AuditState.submit, AuditState.reAudit].includes(row.billState) ? "edit" : "view";
    openDialog(type, row);
  };

  function openDialog(type: "add" | "edit" | "view", row?: OvertimeOrderItemType) {
    const title = { add: "新增", edit: "修改", view: "查看" }[type];
    const formRef = ref();
    addDialog({
      title: `${title}加班单`,
      props: { id: row?.priId, type },
      width: "1400px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      okButtonText: type === "view" ? "确定" : "保存",
      contentRenderer: () => h(Detail, { ref: formRef }),
      beforeSure: (done, { options }) => {
        if (type === "view") return done();
        formRef.value.onSave().then(() => {
          done();
          getTableList();
        });
      }
    });
  }

  // 提交
  const onSubmit = (row: OvertimeOrderItemType) => {
    if (![AuditState.submit, AuditState.reAudit].includes(row.billState)) {
      return message("加班单不是待提交或重新审核状态，不能进行提交", { type: "error" });
    }

    showMessageBox(`确认提交加班单吗?`).then(() => {
      commonSubmit({ billId: "10002", billNo: row.billNo })
        .then((res) => {
          if (!res.data) return message("提交失败", { type: "error" });
          message("提交成功");
          getTableList();
        })
        .catch(console.log);
    });
  };

  // 删除
  const onDelete = (row: OvertimeOrderItemType) => {
    if (![AuditState.submit, AuditState.reAudit].includes(row.billState)) {
      return message("加班单不是待提交或重新审核状态，不能进行删除！", { type: "error" });
    }
    deleteOvertimeOrder({ id: row.priId })
      .then((res) => {
        if (!res.data) return message("删除失败", { type: "error" });
        message("删除成功");
        getTableList();
      })
      .catch(console.log);
  };

  // 导出
  const onExport = () => {
    if (formData.date) {
      const [startDate, endDate] = formData.date.split("~").map((el) => el.trim());
      formData["startDate"] = startDate;
      formData["endDate"] = endDate;
    } else {
      formData["startDate"] = undefined;
      formData["endDate"] = undefined;
    }
    const headConfig = getExportConfig("加班单", columns.value, { ...formData, limit: 200000 });
    exportOvertimeOrder(headConfig)
      .then((res) => {
        if (!res.data) return message("导出失败", { type: "error" });
        const fileName = getFileNameOnUrlPath(res.data);
        downloadFile(res.data, fileName, true);
      })
      .catch(console.log);
  };

  // 分页相关
  function onSizeChange(val: number) {
    formData.limit = val;
    getTableList();
  }

  function onCurrentChange(val: number) {
    formData.page = val;
    getTableList();
  }

  const rowDbClick = (row) => {
    onEdit(row);
  };

  const rowClick = (row) => {
    currentRow.value = row;
  };

  const viewNodeDetail = () => {
    if (!currentRow.value) {
      return message("请选择单据", { type: "warning" });
    }
    addDialog({
      title: "查看审批详情",
      width: "900px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: true,
      hideFooter: true,
      contentRenderer: ({ options }) =>
        h(NodeDetailList, { options, billNo: currentRow.value.billNo, billType: "overTime", billState: currentRow.value.billState })
    });
  };

  const onBack = () => {
    if (JSON.stringify(currentRow.value) == "{}" || !currentRow.value) {
      return ElMessage({ message: "请选择一条记录", type: "warning" });
    }
    if (![AuditState.auditing, AuditState.audited].includes(currentRow.value.billState)) {
      return message("当前状态不能进行回退", { type: "error" });
    }
    commonBackLogic(currentRow.value.billNo, onSearch);
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "新增", isDropDown: false },
    { clickHandler: onExport, type: "default", text: "导出", isDropDown: true },
    { clickHandler: onBack, type: "default", text: "回退", isDropDown: true },
    { clickHandler: viewNodeDetail, type: "default", text: "审批详情", isDropDown: true }
  ]);

  return {
    loading,
    columns,
    dataList,
    maxHeight,
    pagination,
    buttonList,
    searchOptions,
    onSearch,
    rowClick,
    onAdd,
    onEdit,
    queryParams,
    onDelete,
    onSubmit,
    onExport,
    onSizeChange,
    rowDbClick,
    handleTagSearch,
    onCurrentChange
  };
};
