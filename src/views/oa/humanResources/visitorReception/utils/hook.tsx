import { deleteVisitorInfo, exportVisitorList, fetchVisitorList, insertVisitorInfo, submitVisitorInfo, updateVisitorInfo } from "@/api/oaManage/humanResources";
import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { h, onMounted, reactive, ref } from "vue";
import { message, showMessageBox } from "@/utils/message";

import Detail from "../Detail.vue";
import { ElMessage } from "element-plus";
import NodeDetailList from "@/components/NodeDetailList/index.vue";
import { PAGE_CONFIG } from "@/config/constant";
import { PaginationProps } from "@pureadmin/table";
import SelectUserModal from "../selectUserModal/modal.vue";
import { addDialog } from "@/components/ReDialog";
import { cloneDeep } from "@pureadmin/utils";
import { commonBackLogic } from "@/utils/common";
import { commonSubmit } from "@/api/systemManage";
import { getBOMTableRowSelectOptions } from "@/api/plmManage";
import { useEleHeight } from "@/hooks";
import { useUserStore } from "@/store/modules/user";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref([]);
  const currentRow: any = ref({});
  const curMultipeUserList: any = ref([]);
  const curMultipeOtherUserList: any = ref([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 95);
  const userStore = useUserStore();
  const optionInfoList = ref([]);

  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });

  let formData: any = reactive({
    page: 1,
    limit: PAGE_CONFIG.pageSize
  });

  const searchOptions: any = ref([
    { label: "单据编号", value: "billNo" },
    { label: "日期范围", value: "date", type: "daterange", format: "YYYY-MM-DD" }
  ]);

  const getStateInfo = () => {
    getBOMTableRowSelectOptions({ optioncode: "BillStatus" }).then((res) => {
      if (res.data) {
        optionInfoList.value = res.data[0]?.optionList;
      }
    });
  };

  onMounted(() => {
    getStateInfo();
    getColumnConfig();
    onSearch();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "", align: "center", width: 40, cellRenderer: () => <el-radio label="&nbsp;" size="small" /> },
      { label: "序号", type: "index", width: 60, align: "center", headerAlign: "center" },
      { label: "单据编号", prop: "billNo", minWidth: 130 },
      { label: "申请人", prop: "createUserName", minWidth: 70 },
      { label: "客户名称", prop: "visitorName", minWidth: 130 },
      { label: "客户人数", prop: "visitorsCount", minWidth: 80, align: "right" },
      { label: "到达日期", minWidth: 100, prop: "arriveDate" },
      { label: "到达时间", width: 75, prop: "arriveTime" },
      { label: "接待地点", minWidth: 110, prop: "receptionAddress" },
      { label: "欢迎牌内容", minWidth: 130, prop: "welcomeWord" },
      { label: "接待人员", minWidth: 150, prop: "receptionist" },
      { label: "协助人员", minWidth: 150, prop: "receptionAssist" },
      { label: "接待项目", minWidth: 90, prop: "visitItem" },
      { label: "行程安排", prop: "journey", minWidth: 160 },
      { label: "接待准备", prop: "prepareItem" },
      { label: "配合要求", minWidth: 80, prop: "receptionRequire" },
      { label: "备注", prop: "remark", minWidth: 100 }
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false });
    return columnData;
  };

  const onSearch = () => {
    loading.value = true;
    const copyData = cloneDeep(formData);
    const [searchStartDate, searchEndDate] = copyData.date ? copyData.date.split(" ~ ") : [undefined, undefined];
    copyData.searchStartDate = searchStartDate;
    copyData.searchEndDate = searchEndDate;
    delete copyData.date;

    fetchVisitorList({ ...copyData })
      .then((res: any) => {
        const data = res.data;
        loading.value = false;
        dataList.value = data.records || [];
        pagination.total = data.total;
      })
      .catch(() => (loading.value = false));
  };

  const onTagSearch = (values = {}) => {
    const { page, limit } = formData;
    Object.keys(values)?.forEach((key) => {
      formData[key] = values[key];
    });
    formData = { ...values, page, limit };
    onSearch();
  };

  const beforeEdit = () => {
    if (JSON.stringify(currentRow.value) === "{}") {
      ElMessage({ message: "请选择记录", type: "warning" });
      return;
    }
    onEdit(currentRow.value);
  };

  const beforeDel = () => {
    if (JSON.stringify(currentRow.value) === "{}") {
      ElMessage({ message: "请选择记录", type: "warning" });
      return;
    }
    onDelete(currentRow.value);
  };

  const onSubmitAction = () => {
    if (JSON.stringify(currentRow.value) === "{}") {
      ElMessage({ message: "请选择记录", type: "warning" });
      return;
    }
    if ([0, 3].includes(+currentRow.value.billState)) {
      commonSubmit({ id: currentRow.value.id, billId: "10043" }).then((res) => {
        if (res.data) {
          ElMessage({ message: "提交成功", type: "success" });
          onSearch();
        }
      });
    } else {
      ElMessage({ message: "只有【待提交或重新审核】状态下的单据才能提交", type: "error" });
      return;
    }
  };

  const onEdit = (row) => {
    openDialog("edit", row);
  };

  const onView = (row) => {
    currentRow.value = row;
    openDialog("view", row);
  };

  const handleAddUserNames = (configData) => {
    const setA = (v) => {
      curMultipeUserList.value = v;
    };
    addDialog({
      title: "选择主要接待人员",
      width: "900px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(SelectUserModal, { setA, curRows: currentRow }),
      beforeSure: (done, { options }) => {
        if (!curMultipeUserList.value.length) {
          ElMessage({ message: "未选定人员", type: "warning" });
          return;
        }
        const names = curMultipeUserList.value.map((item) => item.userName);
        configData.value.receptionist = String(names);
        done();
      }
    });
  };

  const handleAddOtherUserNames = (configData) => {
    const setA = (v) => {
      curMultipeOtherUserList.value = v;
    };
    addDialog({
      title: "选择协助人员",
      width: "900px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(SelectUserModal, { setA, curRows: currentRow }),
      beforeSure: (done, { options }) => {
        if (!curMultipeOtherUserList.value.length) {
          ElMessage({ message: "未选定人员", type: "warning" });
          return;
        }
        const names = curMultipeOtherUserList.value.map((item) => item.userName);
        configData.value.receptionAssist = String(names);
        done();
      }
    });
  };

  const openDialog = async (type: string, row?) => {
    const titleObj = { add: "新增", edit: "修改", view: "查看" };
    const title = titleObj[type];
    const formRef = ref();
    const _formData = reactive({
      id: row?.id,
      billNo: row?.billNo,
      visitorName: row?.visitorName ?? "",
      visitorsCount: row?.visitorsCount ?? 0,
      arriveDate: row?.arriveDate ?? "",
      arriveTime: row?.arriveTime ?? "",
      receptionAddress: row?.receptionAddress ?? "",
      welcomeWord: row?.welcomeWord ?? "",
      receptionist: row?.receptionist ?? "",
      receptionAssist: row?.receptionAssist ?? "",
      receptionRequire: row?.receptionRequire ?? "",
      remark: row?.remark ?? "",
      journey: row?.journey ?? "",
      hrVisitReceptionMattersDTOList: row?.visitItem.split(",") ?? [],
      hrVisitReceptionPrepareDTOList: row?.prepareItem.split(",") ?? []
    });

    addDialog({
      title: `${title}`,
      props: {
        formInline: _formData,
        type: type,
        id: row?.id,
        handleAddUserNames: handleAddUserNames,
        handleAddOtherUserNames: handleAddOtherUserNames
      },
      width: "1050px",
      draggable: true,
      fullscreenIcon: true,
      okButtonText: "保存",
      closeOnClickModal: false,
      hideFooter: type === "view",
      contentRenderer: () => h(Detail, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.validate(async (valid) => {
          if (valid) {
            showMessageBox(`确认要${title}吗?`).then(() => {
              onSubmitChange(type, title, _formData, () => {
                done();
                onSearch();
              });
            });
          }
        });
      }
    });
  };

  const onSubmitChange = (type: string, title: string, data, callback) => {
    // 组装请求参数
    const reqParams: any = {
      arriveDate: data.arriveDate,
      arriveTime: data.arriveTime,
      createUserName: userStore.userInfo.userName,
      visitItem: String(data.hrVisitReceptionMattersDTOList),
      prepareItem: String(data.hrVisitReceptionPrepareDTOList),
      journey: data.journey,
      receptionAddress: data.receptionAddress,
      receptionAssist: data.receptionAssist,
      receptionRequire: data.receptionRequire,
      receptionist: data.receptionist,
      remark: data.remark,
      visitorName: data.visitorName,
      visitorsCount: data.visitorsCount,
      welcomeWord: data.welcomeWord
    };

    const typeApi = { add: insertVisitorInfo, edit: updateVisitorInfo };

    if (data.id) reqParams.id = data.id;
    typeApi[type](reqParams).then((res) => {
      if (res.data) {
        ElMessage({ message: title + "成功", type: "success" });
        callback();
      }
    });
  };

  // 导出
  const onExport = () => {
    loading.value = true;
    let searchStartDate, searchEndDate;

    if (formData.date) {
      [searchStartDate, searchEndDate] = formData.date.split(" ~ ");
    }

    const copyData = cloneDeep(formData);
    delete copyData.date;

    const headConfig = {
      ...copyData,
      searchStartDate,
      searchEndDate
    };

    exportVisitorList(headConfig)
      .then((res: any) => {
        window.open("/api" + res.data, "_blank");
      })
      .catch((err) => {
        console.log("err", err);
      })
      .finally(() => (loading.value = false));
  };

  const onDelete = (row) => {
    showMessageBox(`确认要删除客户名称为【${row.visitorName}】的接待记录吗?`)
      .then(() => {
        loading.value = true;
        deleteVisitorInfo({ id: row.id }).then((res) => {
          if (res.data) {
            ElMessage({ message: `删除成功`, type: "success" });
            currentRow.value = {};
            onSearch();
          }
        });
      })
      .catch(() => {})
      .finally(() => (loading.value = false));
  };

  const rowClick = (row) => {
    currentRow.value = row;
  };

  const onAdd = () => {
    openDialog("add");
  };

  // 分页相关
  function onSizeChange(val: number) {
    formData.limit = val;
    onSearch();
  }

  function onCurrentChange(val: number) {
    formData.page = val;
    onSearch();
  }

  const viewNodeDetail = () => {
    if (JSON.stringify(currentRow.value) === "{}") {
      ElMessage({ message: "请选择记录", type: "warning" });
      return;
    }

    addDialog({
      title: "查看审批节点详情",
      width: "900px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: true,
      hideFooter: true,
      contentRenderer: ({ options }) =>
        h(NodeDetailList, { options, billNo: currentRow.value.billNo, billType: "visitor", billState: +currentRow.value.billState })
    });
  };

  const onBackAction = () => {
    if (JSON.stringify(currentRow.value) == "{}" || !currentRow.value) {
      return ElMessage({ message: "请选择一条记录", type: "warning" });
    }
    if (![1, 2].includes(currentRow.value.billState)) {
      return message("当前状态不能进行回退", { type: "error" });
    }
    commonBackLogic(currentRow.value.billNo, onSearch);
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "新增" },
    { clickHandler: beforeEdit, type: "warning", text: "修改" },
    { clickHandler: beforeDel, type: "danger", text: "删除" },
    { clickHandler: onExport, type: "info", text: "导出", isDropDown: true },
    { clickHandler: onSubmitAction, type: "info", text: "提交", isDropDown: true },
    { clickHandler: onBackAction, type: "info", text: "回退", isDropDown: true },
    { clickHandler: viewNodeDetail, type: "info", text: "审批详情", isDropDown: true }
  ]);

  return {
    loading,
    columns,
    dataList,
    maxHeight,
    pagination,
    buttonList,
    searchOptions,
    optionInfoList,
    rowClick,
    onSearch,
    onView,
    onTagSearch,
    onSizeChange,
    onCurrentChange
  };
};
