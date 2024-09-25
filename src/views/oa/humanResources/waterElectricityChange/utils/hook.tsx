import { ElMessage, dayjs } from "element-plus";
import {
  deleteChangeWaterElectricity,
  exportChangeWaterElectricity,
  fetchAllBuliding,
  fetchChangeWaterElectricity,
  insertChangeWaterElectricity,
  updateChangeWaterElectricity
} from "@/api/oaManage/humanResources";
import { formConfigs, formRules } from "./config";
import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { h, onMounted, reactive, ref } from "vue";

import EditForm from "@/components/EditForm/index.vue";
import NodeDetailList from "@/components/NodeDetailList/index.vue";
import { PAGE_CONFIG } from "@/config/constant";
import { PaginationProps } from "@pureadmin/table";
import SelectUserModal from "../selectUserModal/modal.vue";
import { addDialog } from "@/components/ReDialog";
import { cloneDeep } from "@pureadmin/utils";
import { showMessageBox } from "@/utils/message";
import { useEleHeight } from "@/hooks";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref([]);
  const currentRow: any = ref({});
  const formLoading = ref(false);
  const optionInfoList = ref([]);
  const curBuildingsId = ref("");
  const buildings: any = ref([]);
  const curMultipeOtherUserList: any = ref([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 95);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  let formData: any = reactive({ page: 1, limit: PAGE_CONFIG.pageSize });

  const searchOptions: any = ref([
    { label: "宿舍楼栋", value: "buildingName" },
    { label: "房间号", value: "dormitoryCode" },
    { label: "日期范围", value: "date", type: "daterange", format: "YYYY-MM-DD" }
  ]);

  onMounted(() => {
    getColumnConfig();
    onSearch();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "宿舍楼栋", prop: "buildingName", minWidth: 140 },
      { label: "宿舍房间", prop: "dormitoryCode", minWidth: 140 },
      { label: "更换日期", prop: "replaceDate", minWidth: 140 },
      { label: "更换表类型", prop: "meterType", minWidth: 140 },
      { label: "旧表数", prop: "oldMeterNumber", minWidth: 140 },
      { label: "新表数", minWidth: 140, prop: "newMeterNumber" },
      { label: "创建人", minWidth: 140, prop: "createUserName" },
      { label: "创建时间", minWidth: 140, prop: "createDate" },
      { label: "修改人", minWidth: 140, prop: "modifyUserName" },
      { label: "修改时间", minWidth: 140, prop: "modifyDate" }
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

    fetchChangeWaterElectricity({ ...copyData })
      .then((res: any) => {
        if (res.data) {
          const data = res.data;
          loading.value = false;
          dataList.value = data.records || [];
          pagination.total = data.total;
        }
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

  const onEdit = (row) => {
    openDialog("edit", row);
  };

  const onView = (row) => {
    currentRow.value = row;
    openDialog("view", row);
  };

  const handleAddOtherUserNames = (configData) => {
    if (!curBuildingsId.value) {
      ElMessage({ message: "请先选择宿舍楼栋", type: "warning" });
      return;
    }
    const setA = (v) => {
      curMultipeOtherUserList.value = v;
    };
    addDialog({
      title: "选择宿舍房间",
      width: "900px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(SelectUserModal, { setA, curRows: currentRow, curBuildingsId }),
      beforeSure: (done, { options }) => {
        if (!curMultipeOtherUserList.value.length) {
          ElMessage({ message: "未选定房间", type: "warning" });
          return;
        }
        console.log(curMultipeOtherUserList.value, "curMultipeOtherUserList.value");
        const lastClickInfo = curMultipeOtherUserList.value[curMultipeOtherUserList.value.length - 1];
        const names = lastClickInfo.dormitoryCode;
        configData.zoom = String(names);
        configData.zoomId = lastClickInfo.id;
        done();
      }
    });
  };

  const changeBuilding = (val) => {
    console.log(val, "val");
    curBuildingsId.value = val;
  };

  const openDialog = async (type: string, row?) => {
    const titleObj = { add: "新增", edit: "修改", view: "查看" };
    const title = titleObj[type];
    const formRef = ref();
    const projectList = ref([]);
    const prepareList = ref([]);

    const _formData: any = reactive({
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
      hrVisitReceptionMattersDTOList: row?.visitItem?.split(",") ?? [],
      hrVisitReceptionPrepareDTOList: row?.prepareItem?.split(",") ?? []
    });

    if (type === "add") {
      _formData.yearAndMonth = dayjs(new Date()).format("YYYY-MM-DD");
      _formData.newMeterNumber = 0;
    }
    console.log(_formData, "ff");

    formLoading.value = true;

    fetchAllBuliding({})
      .then((res) => {
        if (res.data) {
          buildings.value = res.data;
        }
      })
      .finally(() => (formLoading.value = false));

    if (type === "edit") {
      _formData.yearAndMonth = row.replaceDate;
      curBuildingsId.value = row.buildingId;
      _formData.id = row.id;
      _formData.building = row.buildingId;
      _formData.zoom = row.dormitoryCode;
      _formData.meterType = row.meterType;
      _formData.oldMeterNumber = row.oldMeterNumber;
      _formData.newMeterNumber = row.newMeterNumber;
      _formData.createUserName = row.createUserName;
      _formData.createDate = row.createDate;
      _formData.modifyUserName = row.modifyUserName;
      _formData.modifyDate = row.modifyDate;
    }
    console.log(_formData, "_formData");

    addDialog({
      title: `${title}`,
      props: {
        loading: formLoading,
        formInline: _formData,
        formRules: formRules,
        formProps: { labelWidth: 30 },
        formConfigs: formConfigs({
          handleAddOtherUserNames: () => handleAddOtherUserNames(_formData),
          type,
          optionListInfo: {
            prepareList,
            projectList
          },
          changeBuilding,
          buildings
        })
      },
      width: "640px",
      draggable: true,
      fullscreenIcon: true,
      okButtonText: "保存",
      closeOnClickModal: false,
      hideFooter: type === "view",
      contentRenderer: () => h(EditForm, { ref: formRef }),
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
    const buildingName = buildings.value.find((item) => item.id === data.building)?.name;
    const reqParams: any = {
      replaceDate: data.yearAndMonth,
      buildingName,
      dormitoryCode: data.zoom,
      meterType: data.meterType,
      newMeterNumber: data.newMeterNumber,
      dormitoryId: data.zoomId,
      oldMeterNumber: data.oldMeterNumber
    };
    console.log(type, reqParams);

    const typeApi = { add: insertChangeWaterElectricity, edit: updateChangeWaterElectricity };

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
    // ElMessage({ message: "功能暂未开发", type: "warning" });
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

    exportChangeWaterElectricity(headConfig)
      .then((res: any) => {
        window.open("/api" + res.data, "_blank");
      })
      .catch((err) => {
        console.log("err", err);
      })
      .finally(() => (loading.value = false));
  };

  const onDelete = (row) => {
    const dateStr = dayjs(row.replaceDate).format("YYYY年M月D日");
    showMessageBox(`确认要删除【${dateStr} ${row.buildingName} ${row.dormitoryCode}】的${row.meterType}更换记录吗?`)
      .then(() => {
        loading.value = true;
        deleteChangeWaterElectricity({ id: row.id }).then((res) => {
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

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "新增" },
    { clickHandler: beforeEdit, type: "warning", text: "修改" },
    { clickHandler: beforeDel, type: "danger", text: "删除" },
    { clickHandler: onExport, type: "info", text: "导出", isDropDown: true }
  ]);

  return {
    columns,
    dataList,
    loading,
    maxHeight,
    buttonList,
    pagination,
    searchOptions,
    rowClick,
    onSearch,
    onEdit,
    onTagSearch,
    onSizeChange,
    onCurrentChange
  };
};
