import { onMounted, reactive, ref, h, markRaw } from "vue";
import { type PaginationProps } from "@pureadmin/table";
import { downloadDataToExcel, getMenuColumns, updateButtonList } from "@/utils/table";
import EditForm from "@/components/EditForm/index.vue";
import { useEleHeight } from "@/hooks";
import { addDialog } from "@/components/ReDialog";
import {
  formConfigs,
  formConfigs1,
  formRules,
  formRules5,
  formConfigs5,
  formRules1,
  formRules2,
  formConfigs2,
  formRules3,
  formConfigs3,
  formRules4,
  formConfigs4
} from "./config";
import dayjs from "dayjs";
import {
  changeDormitory,
  editPerformanceDataInfo,
  exportUserDormitory,
  fetchDormitoryAllUser,
  importPerformanceSheet,
  insertUserDormitory,
  addUserDormitoryBuildings,
  updateUserDormitoryBuildings,
  validYearAndMonthPerformance,
  addUserDormitory,
  updateUserDormitory,
  deleteBuliding,
  deleteZoom,
  fetchAllBuliding,
  fetchDormitoryAllBuliding
} from "@/api/oaManage/humanResources";
import * as CommonUtils from "@/utils/common";

import { PAGE_CONFIG } from "@/config/constant";
import { message, showMessageBox } from "@/utils/message";
import axios from "axios";

export const useActionHook = (fn, fn2) => {
  const columns = ref<TableColumnList[]>([]);
  const columns2 = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const loading2 = ref<boolean>(false);
  const userList = ref([]);
  const dataList = ref([]);
  const currentId = ref("");
  const currentRoom: any = ref({});
  const activeName = ref("");

  const rowData = ref();

  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49 + 52);
  const currentBuilding: any = ref({});

  const formData: any = reactive({
    page: 1,
    limit: PAGE_CONFIG.pageSize,
    yearAndMonth: dayjs(new Date()).add(-1, "month").format("YYYY-MM")
  });

  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });

  onMounted(() => {
    initBtns();
    onSearch();
  });

  const initBtns = async () => {
    const { buttonArrs } = await getMenuColumns();
    updateButtonList(buttonList, buttonArrs[0]);
  };

  const getColumnConfig = () => {
    const columnData: TableColumnList[] = [
      { label: "序号", type: "index", prop: "index", width: 60 },
      { label: "年月", prop: "yearAndMonth", width: 110 },
      { label: "部门", prop: "deptName", minWidth: 180 },
      { label: "工号", prop: "userCode", minWidth: 180 },
      { label: "姓名", prop: "staffName", minWidth: 180 },
      { label: "金额", prop: "money", minWidth: 120 },
      { label: "操作", prop: "operation", slot: "operation", minWidth: 120 }
    ];
    columns.value = columnData;
    return columnData;
  };

  const getColumnConfig2 = () => {
    const columnData: TableColumnList[] = [
      { label: "URL地址", prop: "urlAddress" },
      {
        label: "应用产品种类",
        prop: "templateProductEntryList",
        cellRenderer({ row }) {
          return row.templateProductEntryList
            .map((item) => item.name)
            .filter((item) => item)
            .join("、");
        }
      },
      { label: "操作", prop: "", width: 105, slot: "operation" }
    ];
    columns2.value = columnData;
  };

  const onSearch = () => {};

  // 分页相关
  function handleSizeChange(val: number) {
    formData.limit = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    formData.page = val;
    onSearch();
  }

  const onCurrentChange = (row) => {
    if (!row) return;
    rowData.value = row;
  };

  // 添加单据
  const onAdd = () => {
    openDialog("add");
  };

  const fetchUsers = (dormitoryId) => {
    loading2.value = true;
    fetchDormitoryAllUser({ dormitoryId })
      .then((res: any) => {
        if (res.data) {
          userList.value = res.data;
        }
      })
      .finally(() => (loading2.value = false));
  };

  const openDialog = async (type: string, row?) => {
    const buildList = ref([]);
    const allZoomList = ref([]);
    const filterZoomList = ref([]);

    if (type === "change") {
      fetchAllBuliding({}).then((res: any) => {
        if (res.data) {
          buildList.value = res.data;
        }
      });
    }

    const titleObj = {
      add: "导入",
      edit: "修改",
      leave: "搬离宿舍",
      change: "搬迁宿舍",
      insert: "入住",
      addBuilding: "新增楼",
      editBuilding: "修改编码",
      addZoom: "新增房间",
      editZoom: "修改宿舍"
    };
    const title = titleObj[type];
    const formRef = ref();

    const _formData = reactive({
      ariseDate: row?.ariseDate ?? "",
      id: row?.id ?? "",
      dormitoryId: row?.dormitoryId ?? "",
      staffId: row?.staffId ?? "",
      staffInfoId: row?.staffInfoId ?? "",
      staffName: row?.staffName ?? "",
      type: "搬离"
    });

    const addBuildingFormData = reactive({
      name: "",
      floor: "",
      number: "",
      type: false
    });

    const zoomFormData = reactive({
      buildingId: type === "addZoom" ? currentBuilding.value.name : undefined,
      dormitoryCode: row?.dormitoryCode ?? "",
      floorNo: row?.floorNo ?? "",
      id: type === "editZoom" ? row?.id : undefined,
      dormitoryRank: row?.dormitoryRank,
      dormitorySex: row?.dormitorySex,
      remark: row?.remark
    });

    const editBuildingFormData = reactive({
      id: row?.name ?? "",
      name: row?.label ?? ""
    });

    const addFormData1 = reactive({
      ...row,
      type: "搬迁"
    });

    const insertFormData = reactive({
      checkInUser: "",
      dormitoryCode: row?.dormitoryCode ?? "",
      dormitoryId: row?.id ?? "",
      floorNo: row?.floorNo ?? "",
      moveInDate: "",
      staffInfoId: ""
    });

    const formInlineMap = {
      change: addFormData1,
      leave: _formData,
      insert: insertFormData,
      addBuilding: addBuildingFormData,
      editBuilding: editBuildingFormData,
      addZoom: zoomFormData,
      editZoom: zoomFormData
    };

    const formRulesMap = {
      change: formRules1,
      leave: formRules,
      insert: formRules2,
      addBuilding: formRules3,
      editBuilding: formRules4,
      addZoom: formRules5,
      editZoom: formRules5
    };

    const changeBuilds = (val) => {
      const findBuildId = buildList.value.find((el) => el.name === val)?.id;
      fetchDormitoryAllBuliding({ buildingCode: findBuildId }).then((res: any) => {
        if (res.data) {
          allZoomList.value = res.data;
          addFormData1.floorNo = undefined;
        }
      });
    };

    const changeFloors = (val) => {
      // 过滤房间
      const filterZooms = allZoomList.value.filter((item) => item.floor === val)[0]?.value;
      filterZoomList.value = filterZooms;
      addFormData1.dormitoryCode = undefined;
    };

    const formConfigMap = {
      change: formConfigs1({ buildList, changeBuilds, allZoomList, changeFloors, filterZoomList }),
      leave: formConfigs(),
      insert: formConfigs2(insertFormData),
      addBuilding: formConfigs3(addBuildingFormData),
      editBuilding: formConfigs4(),
      addZoom: formConfigs5(),
      editZoom: formConfigs5()
    };

    const widthMap = {
      change: "350px",
      leave: "320px",
      insert: "380px",
      addBuilding: "500px",
      editBuilding: "300px",
      addZoom: "400px",
      editZoom: "400px"
    };

    addDialog({
      title: title,
      props: {
        formInline: formInlineMap[type],
        formRules: formRulesMap[type],
        formConfigs: formConfigMap[type]
      },
      width: widthMap[type],
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.validate(async (valid) => {
          if (valid) {
            showMessageBox(`确认要${title}吗?`).then(() => {
              onSubmitChange(type, title, formInlineMap[type], () => {
                done();
                fetchUsers(currentId.value);
                if (["addBuilding", "editBuilding"].includes(type)) fn();
                if (["addZoom", "editZoom"].includes(type)) fn2(currentBuilding.value.name);
              });
            });
          }
        });
      }
    });
  };

  const onSubmitChange = (type: string, title: string, data, callback) => {
    if (type === "addBuilding" && data.type) data.isClose = "on";
    if (type === "add") {
      const param = {
        userCodeCol: data.userCodeCol,
        row: data.row,
        moneyCol: data.moneyCol,
        yearAndMonth: formData.yearAndMonth
      };
      const fData = new FormData();
      fData.append("files", data.file);
      fData.append("param", JSON.stringify(param));

      importPerformanceSheet(fData).then((res) => {
        if (res.data) {
          callback();
          message("导入成功");
        }
      });
      return;
    }

    if (type === "insert") {
      data = [data];
    }
    const API = {
      edit: editPerformanceDataInfo,
      addBuilding: addUserDormitoryBuildings,
      editBuilding: updateUserDormitoryBuildings,
      leave: changeDormitory,
      change: changeDormitory,
      insert: insertUserDormitory,
      addZoom: addUserDormitory,
      editZoom: updateUserDormitory
    };
    API[type](data)
      .then((res) => {
        if (res.data) {
          callback();
          message(`${title}成功`);
        }
      })
      .catch(console.log);
  };

  const onEdit = (row) => {
    openDialog("leave", row);
  };

  const onDownload = () => {
    return axios({
      method: "get",
      responseType: "blob",
      url: `${import.meta.env.VITE_PUBLIC_PATH}template/宿舍管理模版.xlsx`
    })
      .then(({ data }) => CommonUtils.onDownload(data, "宿舍管理模版.xlsx"))
      .catch(() => {});
  };

  const validYearAndMonth = () => {
    loading.value = true;
    validYearAndMonthPerformance({ yearAndMonth: formData.yearAndMonth })
      .then((res) => {
        if (res.data) {
          onAdd();
        } else {
          showMessageBox(`【${formData.yearAndMonth}】已存在数据，确定重新导入吗？`)
            .then(() => {
              onAdd();
            })
            .catch(() => {});
        }
      })
      .finally(() => (loading.value = false));
  };

  const onImport = () => {
    showMessageBox(`您确认要导入【${formData.yearAndMonth}】的绩效吗？`)
      .then(() => {
        validYearAndMonth();
      })
      .catch(() => {});
  };

  const rowStyle = () => {
    return {
      cursor: "pointer"
    };
  };

  const changeDateYear = (val) => {
    formData.yearAndMonth = val;
    onSearch();
  };

  const onLeave = (item) => {
    onEdit(item);
  };

  const changeZoom = (item) => {
    openDialog("change", item);
  };

  const clickTag = (row) => {
    if (row && JSON.stringify(row) !== "{}") {
      currentRoom.value = row;
      currentId.value = row.id;
      fetchUsers(row.id);
    }
  };

  const onInRoom = () => {
    if (JSON.stringify(currentRoom.value) === "{}") {
      message("请选择房间", { type: "warning" });
      return;
    }
    openDialog("insert", currentRoom.value);
  };

  const onExport = () => {
    const exportColumns = [
      { title: "宿舍楼", field: "name" },
      { title: "楼层", field: "floorNo" },
      { title: "房间号", field: "dormitoryCode" },
      { title: "部门", field: "deptName" },
      { title: "工号", field: "staffId" },
      { title: "姓名", field: "staffName" }
    ].map((item) => ({ ...item, colGroup: false, rowspan: 1, unresize: true, colspan: 1, hide: false, width: 200 }));

    const exportDataConfig = {
      page: 1,
      limit: 100000,
      excel: { excelName: "宿舍管理", excelHeader: JSON.stringify(exportColumns) }
    };

    loading.value = true;

    exportUserDormitory(exportDataConfig)
      .then((res) => {
        if (res.data) {
          window.open("/api" + res.data, "_blank");
        }
      })
      .finally(() => (loading.value = false));
  };

  const addBuilding = () => {
    openDialog("addBuilding");
  };

  const editBuilding = () => openDialog("editBuilding", markRaw(currentBuilding.value));

  const setPaneProps = ({ name, label }) => {
    currentBuilding.value = { name, label };
  };

  const addZoom = () => openDialog("addZoom");
  const editZoom = () => {
    if (JSON.stringify(currentRoom.value) === "{}") {
      message("请选择房间", { type: "warning" });
      return;
    }
    openDialog("editZoom", markRaw(currentRoom.value));
  };

  const delBuilding = () => {
    if (JSON.stringify(currentBuilding.value) === "{}") {
      message("未选择楼栋", { type: "warning" });
      return;
    }
    showMessageBox(`确认要删除宿舍楼【${currentBuilding.value.label}】吗?`)
      .then(() => {
        deleteBuliding({ id: currentBuilding.value.name }).then((res) => {
          if (res.data) {
            message("删除成功");
            fn();
          }
        });
      })
      .catch(console.log);
  };

  const delZoom = () => {
    if (JSON.stringify(currentRoom.value) === "{}") {
      message("未选择宿舍房间", { type: "warning" });
      return;
    }
    showMessageBox(`确认要删除${currentBuilding.value.label}宿舍房间【${currentRoom.value.dormitoryCode + "-" + currentRoom.value.num}】吗?`)
      .then(() => {
        deleteZoom({ id: currentRoom.value.id }).then((res) => {
          if (res.data) {
            message("删除成功");
            fn2(currentBuilding.value.name);
          }
        });
      })
      .catch(console.log);
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onImport, type: "primary", text: "导入" },
    { clickHandler: onDownload, type: "info", text: "下载模板" },
    { clickHandler: onInRoom, type: "primary", text: "入住", isDropDown: true },
    { clickHandler: onExport, type: "info", text: "导出", isDropDown: true },
    { clickHandler: addBuilding, type: "primary", text: "新增", isDropDown: true },
    { clickHandler: editBuilding, type: "primary", text: "修改", isDropDown: true },
    { clickHandler: delBuilding, type: "primary", text: "删除", isDropDown: true }
  ]);

  const buttonList2 = ref<ButtonItemType[]>([
    { clickHandler: addZoom, type: "primary", text: "新增宿舍", isDropDown: true },
    { clickHandler: editZoom, type: "primary", text: "修改宿舍", isDropDown: true },
    { clickHandler: delZoom, type: "primary", text: "删除宿舍", isDropDown: true }
  ]);

  return {
    currentId,
    userList,
    loading,
    loading2,
    buttonList,
    buttonList2,
    activeName,
    currentBuilding,
    currentRoom,
    onLeave,
    fetchUsers,
    setPaneProps,
    clickTag,
    changeZoom
  };
};
