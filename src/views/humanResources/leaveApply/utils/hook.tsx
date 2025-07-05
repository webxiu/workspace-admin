/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2025-04-18 16:52:31
 */

import { LeaveApplyItemType, leaveApplyList, exportLeaveApply, deleteLeaveApply } from "@/api/oaManage/humanResources";
import { onMounted, h, reactive, ref } from "vue";
import { addDialog } from "@/components/ReDialog";
import Detail from "../detail/index.vue";
import NodeDetailList from "@/components/NodeDetailList/index.vue";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";

import { downloadFile, getFileNameOnUrlPath, commonBackLogic } from "@/utils/common";
import { setColumn, getExportConfig, getMenuColumns, updateButtonList, getChildDeptIds, RendererType, getEnumDictList } from "@/utils/table";
import { useEleHeight } from "@/hooks";
import { type PaginationProps } from "@pureadmin/table";
import { message, showMessageBox } from "@/utils/message";
import { getDeptOptions } from "@/utils/requestApi";
import { commonSubmit } from "@/api/systemManage";
import { PAGE_CONFIG } from "@/config/constant";
import { ElMessage, UploadProps, dayjs } from "element-plus";
import type { ColDef } from "ag-grid-community";
import { getAgGridColumns } from "@/components/AgGridTable/config";

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
  const isAgTable = ref(true);
  const columnDefs = ref<ColDef[]>([]);
  const treeData = ref([]);
  const currentRow = ref();
  const columns = ref<TableColumnList[]>([]);
  const dataList = ref<LeaveApplyItemType[]>([]);
  const loading = ref<boolean>(false);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 95);
  const baseApi = import.meta.env.VITE_BASE_API;

  const formData = reactive({
    page: 1,
    limit: PAGE_CONFIG.pageSize,
    userId: "",
    userName: "",
    deptId: "",
    deptIdList: [],
    holidayType: ""
  });

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "姓名", value: "userName" },
    { label: "工号", value: "userId" },
    { label: "日期范围", value: "date", type: "daterange", format: "YYYY-MM-DD", startKey: "startDate", endKey: "endDate" },
    { label: "部门", value: "deptId", children: [] },
    { label: "请假类型", value: "holidayType", children: [] }
  ]);

  const nowDate = dayjs().format("YYYY-MM-DD");
  const startDate = dayjs().startOf("month").format("YYYY-MM-DD");
  const queryParams = reactive({ date: `${startDate} ~ ${nowDate}` });

  onMounted(() => {
    getColumnConfig();
    getOptionList();
  });

  const getOptionList = () => {
    getDeptOptions().then((data) => {
      treeData.value = data;
      searchOptions[3].children = data;
    });
    getEnumDictList(["AskForLeaveType"]).then((res) => {
      searchOptions[4].children = res.AskForLeaveType;
    });
  };

  const getColumnConfig = async () => {
    const imgsRenderer: RendererType = ({ row }) => {
      return (
        <div class="flex-center">
          {row.attrImgs?.length ? (
            <el-image
              src={baseApi + row.attrImgs[0]?.url}
              preview-src-list={row.attrImgs?.map((item) => baseApi + item.url)}
              preview-teleported={true}
              hide-on-click-modal={true}
              z-index={2222}
              fit="cover"
              style="height: 20px; width: 60px; border: 1px solid #eee"
            >
              {{ error: () => <div class="lh-20 ui-ta-c fz-12 pl-2 pr-2"> 暂无附件 </div> }}
            </el-image>
          ) : (
            <div class="lh-20 ui-ta-c fz-12 pl-2 pr-2"> 暂无附件 </div>
          )}
        </div>
      );
    };
    let columnData: TableColumnList[] = [
      { label: "单据编号", prop: "billNo", fixed: true, minWidth: 140 },
      { label: "工号", prop: "userId", fixed: true, minWidth: 80 },
      { label: "姓名", prop: "userName", fixed: true, minWidth: 100 },
      { label: "部门", prop: "deptName", fixed: true, minWidth: 120 },
      { label: "请假类型", prop: "holidayType", sortable: true, minWidth: 100 },
      { label: "状态", prop: "billStateName", sortable: true, minWidth: 80 },
      { label: "开始日期", prop: "startDate", excelFormat: "yyyy-MM-dd", minWidth: 90 },
      { label: "开始时间", prop: "startTime", minWidth: 90 },
      { label: "结束日期", prop: "endDate", excelFormat: "yyyy-MM-dd", minWidth: 90 },
      { label: "结束时间", prop: "endTime", minWidth: 90 },
      { label: "天数", prop: "days", align: "right", minWidth: 70 },
      { label: "时长", prop: "hours", align: "right", minWidth: 70 },
      { label: "备注", prop: "remark", minWidth: 140 },
      { label: "入职日期", prop: "entryDate", sortable: true, excelFormat: "yyyy-MM-dd" },
      { label: "加班单号", prop: "overtimeBillNo" },
      { label: "加班日期", prop: "overStartDate" },
      { label: "创建人", prop: "createUserName", sortable: true },
      { label: "创建时间", prop: "createDate", minWidth: 160, sortable: true },
      { label: "序号", prop: "id" },
      { label: "项次", prop: "itemSequence", align: "right" }
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns([{ attrImgs: imgsRenderer }]);
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({
      columnData,
      formData,
      operationColumn: { minWidth: 200 }
    });
    columnDefs.value = getAgGridColumns<LeaveApplyItemType>({
      formData,
      columnData,
      operationColumn: { minWidth: 200 },
      columnsRender: { attrImgs: imgsRenderer },
      renderButtons: (row) => {
        const isEditState = [AuditState.submit, AuditState.reAudit].includes(row.billState);
        return [
          { name: isEditState ? "修改" : "查看", type: "default", onClick: () => onEdit(row) },
          { name: "提交", type: "default", disabled: !isEditState, onClick: () => onSubmit(row) },
          { name: "删除", type: "danger", disabled: !isEditState, onClick: () => onDelete(row), confirm: (row) => `确认删除\n【${row.billNo}】的请假单吗?注意该删除为整单删除！` }
        ];
      }
    });
  };

  const onTagSearch = (values) => {
    Object.assign(formData, values);
    formData.deptIdList = [];
    if (values.deptId) {
      formData.deptIdList = getChildDeptIds(treeData.value, values.deptId);
    }
    onSearch();
  };

  // 搜索
  const onSearch = () => getTableList();

  const getTableList = () => {
    loading.value = true;
    leaveApplyList(formData)
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

  const onEdit = (row: LeaveApplyItemType, updateType?: string) => {
    const type = [AuditState.submit, AuditState.reAudit].includes(row.billState) ? "edit" : "view";
    openDialog(type, row, updateType);
  };

  function openDialog(type: "add" | "edit" | "view", row?: LeaveApplyItemType, updateType?: string) {
    const title = { add: "新增", edit: "修改", view: "查看" }[type];
    const formRef = ref();
    addDialog({
      title: `${title}请假单`,
      props: { id: row?.priId, type },
      width: "1200px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      okButtonText: type === "view" ? "确定" : "保存",
      hideFooter: type === "view",
      contentRenderer: () => h(Detail, { ref: formRef }),
      beforeSure: (done, { options }) => {
        if (type === "view") return done();
        formRef.value
          .onSave(updateType)
          .then(() => {
            done();
            getTableList();
          })
          .catch(console.log);
      }
    });
  }

  // 提交
  const onSubmit = (row: LeaveApplyItemType) => {
    if (![AuditState.submit, AuditState.reAudit].includes(row.billState)) {
      return message.error("只能提交【待提交/重新审核】的记录");
    }

    showMessageBox(`确认提交请假单吗?`).then(() => {
      commonSubmit({ billId: "10001", billNo: row.billNo })
        .then((res) => {
          if (!res.data) return message.error("提交失败");
          message.success("提交成功");
          getTableList();
        })
        .catch(console.log);
    });
  };

  // 删除
  const onDelete = (row: LeaveApplyItemType) => {
    console.log(row);
    deleteLeaveApply({ id: row.priId })
      .then((res) => {
        if (!res.data) return message.error("删除失败");
        message.success("删除成功");
        getTableList();
      })
      .catch(console.log);
  };

  // 导出
  const onExport = () => {
    const headConfig = getExportConfig("请假单", columns.value, { ...formData, limit: 200000 });
    exportLeaveApply(headConfig)
      .then((res) => {
        if (!res.data) return message.error("导出失败");
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
      return message.warning("请选择单据");
    }
    addDialog({
      title: "查看审批详情",
      width: "900px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: true,
      hideFooter: true,
      contentRenderer: ({ options }) =>
        h(NodeDetailList, { options, billNo: currentRow.value.billNo, billType: "leaveApply", billState: currentRow.value.billState })
    });
  };

  // 强制更新
  const onForceUpdate = () => {
    if (JSON.stringify(currentRow.value) == "{}" || !currentRow.value) {
      ElMessage({ message: "请选择一条记录", type: "warning" });
      return;
    }
    console.log("强制更新", currentRow.value);
    onEdit(currentRow.value, "forceUpdate");
  };

  const onBack = () => {
    if (JSON.stringify(currentRow.value) == "{}" || !currentRow.value) {
      return ElMessage({ message: "请选择一条记录", type: "warning" });
    }
    if (![AuditState.auditing, AuditState.audited].includes(currentRow.value.billState)) {
      return message.error("当前状态不能进行回退");
    }
    commonBackLogic(currentRow.value.billNo, onSearch);
  };
  function onSwitchTable() {
    isAgTable.value = !isAgTable.value;
    currentRow.value = undefined;
  }

  const onAttrUpload = () => {
    if (!currentRow.value) return message.warning("请选择一条记录");
    console.log("upload...", currentRow.value);
  };

  // const onUploadAttr: UploadProps["onChange"] = (uploadFile, uploadFiles) => {
  //   console.log(uploadFiles, "uploadFiles==");
  // };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "新增", isDropDown: false },
    { clickHandler: onExport, type: "default", text: "导出", isDropDown: true },
    { clickHandler: onBack, type: "default", text: "回退", isDropDown: true },
    { clickHandler: viewNodeDetail, type: "default", text: "审批详情", isDropDown: true },
    { clickHandler: onAttrUpload, type: "default", text: "附件上传", isDropDown: true }

    // {
    //   type: "primary",
    //   text: "附件上传",
    //   disabled: false,
    //   isDropDown: true,
    //   uploadProp: { action: "#", accept: "image/*", multiple: true, autoUpload: false, onChange: onUploadAttr }
    // }
  ]);

  return {
    columnDefs,
    isAgTable,
    loading,
    columns,
    dataList,
    maxHeight,
    pagination,
    buttonList,
    queryParams,
    searchOptions,
    onSearch,
    onSubmit,
    onEdit,
    onDelete,
    rowClick,
    onTagSearch,
    onSizeChange,
    rowDbClick,
    onCurrentChange,
    onSwitchTable
  };
};
