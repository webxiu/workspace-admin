import { billStateInfo, billStateList } from "./config";
import { commonBackLogic, downloadFile } from "@/utils/common";
import { deleteGoOutRecords, exportGoOutRecords, fetchGoOutRecords, getCarOptions, updateGoOutRecords } from "@/api/oaManage/humanResources";
import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { h, onMounted, reactive, ref } from "vue";
import { message, showMessageBox } from "@/utils/message";
import { useRoute, useRouter } from "vue-router";

import Detail from "../Detail.vue";
import { ElMessage } from "element-plus";
import NodeDetailList from "@/components/NodeDetailList/index.vue";
import { PAGE_CONFIG } from "@/config/constant";
import { PaginationProps } from "@pureadmin/table";
import SelectUserModal from "../selectUserModal/modal.vue";
import { addDialog } from "@/components/ReDialog";
import { carSourceConstant } from "@/config/constant";
import { commonSubmit } from "@/api/systemManage";
import { getBOMTableRowSelectOptions } from "@/api/plmManage";
import { useEleHeight } from "@/hooks";

export const useConfig = () => {
  const dataList = ref([]);
  const carsOpts = ref([]);
  const route = useRoute();
  const router = useRouter();
  const vehicleUsageOpts: any = ref([]);
  const currentRow: any = ref({});
  const loading = ref<boolean>(false);
  const columns = ref<TableColumnList[]>([]);
  const curMultipeUserList: any = ref([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 95);
  const carStrMap = { true: "自驾", false: "指派司机", null: "" };
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const formData: any = reactive({ page: 1, limit: PAGE_CONFIG.pageSize });

  const searchOptions: any = ref([
    { label: "工号", value: "userCode" },
    { label: "申请人", value: "applyUserName" },
    { label: "同行人", value: "userNames" },
    { label: "外出人", value: "outUserName" },
    { label: "创建时间", value: "createRangeDate", type: "daterange", format: "YYYY-MM-DD" },
    { label: "预计外出时间", value: "planOutRangeDate", type: "daterange", format: "YYYY-MM-DD" },
    { label: "预计返回时间", value: "planBackRangeDate", type: "daterange", format: "YYYY-MM-DD" },
    { label: "外出事由", value: "gooutReason" },
    { label: "司机", value: "driverName" },
    { label: "状态", value: "billState", children: billStateList.map((item) => ({ label: item.optionName, value: item.optionValue })) }
  ]);

  const fetchCarList = () => {
    getCarOptions({ state: 1 }).then((res: any) => {
      if (res.data) {
        carsOpts.value = res.data.map((item) => ({ label: item.plateNumber, value: item.id }));
      }
    });
  };

  const findOptinNameByOptionValue = (optionValue) => {
    return vehicleUsageOpts.value?.find((item) => item.optionValue == optionValue)?.optionName ?? "";
  };

  const fetchOption = () => {
    getBOMTableRowSelectOptions({ optioncode: "GoOutVehicleUsage" }).then((res) => {
      if (res.data) {
        const result = res.data.find((item) => item.optionCode === "GoOutVehicleUsage")?.optionList || [];
        vehicleUsageOpts.value = result;
      }
    });
  };

  onMounted(() => {
    fetchOption();
    getColumnConfig();
    onSearch();
    fetchCarList();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "单据编号", prop: "billNo", minWidth: 130 },
      { label: "申请人", prop: "applyName", minWidth: 70 },
      { label: "目的地", prop: "destination", minWidth: 110 },
      { label: "外出事由", prop: "gooutReason", minWidth: 180 },
      {
        label: "状态",
        minWidth: 80,
        prop: "billState",
        cellRenderer(data: any) {
          return <span>{billStateInfo[data.row?.billState + ""]}</span>;
        }
      },
      {
        label: "车辆来源",
        minWidth: 75,
        prop: "vehicleSource",
        cellRenderer(data: any) {
          if (/\d/.test(data.row?.vehicleSource)) {
            return <span>{carSourceConstant[data.row?.vehicleSource]}</span>;
          } else {
            return <span>{data.row?.vehicleSource}</span>;
          }
        }
      },

      {
        label: "用车方式",
        minWidth: 75,
        prop: "needVehicle",
        cellRenderer(data) {
          return <span>{findOptinNameByOptionValue(data.row?.applyVehicleUsage)}</span>;
        }
      },
      {
        label: "司机",
        minWidth: 70,
        prop: "driverName",
        cellRenderer(data) {
          return <span>{data.row?.goOutVehicleVO?.driverName || ""}</span>;
        }
      },
      {
        label: "车牌",
        minWidth: 100,
        prop: "plateNumber",
        cellRenderer(data) {
          return <span>{data.row?.goOutVehicleVO?.plateNumber || ""}</span>;
        }
      },
      {
        label: "同行人",
        minWidth: 150,
        prop: "userNames",
        cellRenderer(data) {
          return <span>{data.row?.userNames && data.row?.userNames?.length ? String(data.row?.userNames) : ""}</span>;
        }
      },
      {
        label: "出车公里数",
        minWidth: 90,

        prop: "outMileage",
        cellRenderer(data) {
          return <span>{data.row?.goOutRegisterVO?.outMileage || ""}</span>;
        }
      },
      {
        label: "返程公里数",
        minWidth: 90,

        prop: "outMileage",
        cellRenderer(data) {
          return <span>{data.row?.goOutBackRegisterVO?.backMileage || ""}</span>;
        }
      },

      { label: "预计外出时间", prop: "planOutDate", minWidth: 160 },
      { label: "预计返回时间", prop: "planBackDate", minWidth: 160 },
      {
        label: "实际返回时间",
        minWidth: 160,
        prop: "realBackDate",
        cellRenderer(data) {
          return <span>{data.row?.goOutBackRegisterVO?.realBackDate || ""}</span>;
        }
      },
      {
        label: "车辆情况",
        minWidth: 80,
        prop: "vehicleInfo",
        cellRenderer(data) {
          return <span>{data.row?.goOutBackRegisterVO?.vehicleInfo || ""}</span>;
        }
      },
      { label: "创建时间", prop: "createDate", minWidth: 160 },
      {
        label: "备注",
        prop: "remarks"
      }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [menuCols] = columnArrs;
    if (menuCols?.length) columnData = menuCols;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false });
    return columnData;
  };

  const onSearch = () => {
    loading.value = true;
    fetchGoOutRecords({ isOwner: false, ...formData })
      .then((res: any) => {
        const data = res.data;
        dataList.value = data.records || [];
        pagination.total = data.total;
      })
      .finally(() => (loading.value = false));
  };

  const onTagSearch = (values) => {
    const userNamesArr = [values.userNames].filter(Boolean);
    formData.applyUserName = values.applyUserName;
    formData.billNo = values.billNo;
    formData.userCode = values.userCode;
    formData.userNames = userNamesArr.length ? userNamesArr : undefined;
    formData.outUserName = values.outUserName;
    formData.gooutReason = values.gooutReason;
    formData.billState = values.billState;

    if (values.createRangeDate) {
      const [createStartDate, createEndDate] = values["createRangeDate"].split("~").map((el) => el.trim());
      formData["createStartDate"] = createStartDate;
      formData["createEndDate"] = createEndDate;
    } else {
      formData["createStartDate"] = undefined;
      formData["createEndDate"] = undefined;
    }

    if (values.planOutRangeDate) {
      const [planOutStartDate, planOutEndDate] = values["planOutRangeDate"].split("~").map((el) => el.trim());
      formData["planOutStartDate"] = planOutStartDate;
      formData["planOutEndDate"] = planOutEndDate;
    } else {
      formData["planOutStartDate"] = undefined;
      formData["planOutEndDate"] = undefined;
    }

    if (values.planBackRangeDate) {
      const [planBackStartDate, planBackEndDate] = values["planBackRangeDate"].split("~").map((el) => el.trim());
      formData["planBackStartDate"] = planBackStartDate;
      formData["planBackEndDate"] = planBackEndDate;
    } else {
      formData["planBackStartDate"] = undefined;
      formData["planBackEndDate"] = undefined;
    }

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

  const onPrint = () => {
    if (JSON.stringify(currentRow.value) === "{}") {
      ElMessage({ message: "请选择记录", type: "warning" });
      return;
    }
    router.push("/oa/humanResources/businessRecord/print?id=" + currentRow.value.id + "&billNo=" + currentRow.value.billNo);
  };

  const onEdit = (row) => {
    openDialog("edit", row);
  };

  const handleAddUserNames = (configData) => {
    const setA = (v) => {
      curMultipeUserList.value = v;
    };
    addDialog({
      title: "选择用户",
      width: "900px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(SelectUserModal, { setA, curRows: currentRow }),
      beforeSure: (done, { options }) => {
        // formData.userName = selectRowData.userName;
        // formData.staffId = selectRowData.userCode;
        if (!curMultipeUserList.value.length) {
          return ElMessage({ message: "未选定人员", type: "warning" });
        }
        const names = curMultipeUserList.value.map((item) => item.userName);
        configData.value.userNames = String(names);
        done();
      }
    });
  };

  const openDialog = async (type: string, row) => {
    const titleObj = { add: "修改", edit: "修改" };
    const title = titleObj[type];
    const formRef = ref();

    const _formData = reactive({
      ...row,
      vehicleInfo: "", // 情况说明
      driverName: "",
      plateNumber: "",
      outMileage: "",
      backMileage: "",
      userNames: "",
      backDay: "",
      backTime: ""
    });

    addDialog({
      title: `${title}`,
      props: {
        formInline: _formData,
        type: type,
        id: row?.id,
        handleAddUserNames: handleAddUserNames,
        useOpts: vehicleUsageOpts.value?.map((item) => ({ label: item.optionName, value: +item.optionValue }))
      },
      width: "1050px",
      draggable: true,
      fullscreenIcon: true,
      okButtonText: "保存",
      closeOnClickModal: false,
      contentRenderer: () => h(Detail, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.validate(async (valid) => {
          if (valid) {
            showMessageBox(`确认要${title}吗?`).then(() => {
              const params = {
                needVehicle: _formData.needVehicle,
                applyVehicleUsage: _formData.applyVehicleUsage,
                driverName: _formData.driverName,
                plateNumber: _formData.plateNumber,
                outMileage: _formData.outMileage,
                backMileage: _formData.backMileage,
                userNames: _formData.userNames,
                id: _formData.id,
                backDay: _formData.backDay,
                backTime: _formData.backTime
              };
              onSubmitChange(type, title, params, () => {
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
    const { applyVehicleUsage, plateNumber, driverName, needVehicle, userNames, outMileage, backMileage, billNo, id, backDay, backTime } = data;

    const findCardInfo = carsOpts.value?.find((item) => item.value == plateNumber);
    // 构造请求参数
    const reqParams = {
      vehicleUsage: applyVehicleUsage,
      needVehicle,
      goOutVehicleDTO: {
        plateNumber: findCardInfo?.label,
        driverName
      },
      userNames: userNames ? userNames.split(",") : [],
      goOutRegisterDTO: {
        outMileage
      },
      goOutBackRegisterDTO: {
        backMileage,
        realBackDate: backDay + " " + backTime
      },
      id
    };
    updateGoOutRecords({ ...reqParams }).then((res) => {
      if (res.data) {
        callback();
        message(`${title}成功`);
      }
    });
    console.log(reqParams, "reqParams");
  };

  // 导出
  const onExport = () => {
    exportGoOutRecords({ ...formData, menuId: route.query.menuId })
      .then((res: any) => {
        if (res.data) {
          const fileName = res.data.split("/").at(-1);
          downloadFile(res.data, fileName);
        }
      })
      .catch(console.log);
  };

  const onDelete = (row) => {
    showMessageBox(`确认要删除【${row.applyName}】的记录吗?`)
      .then(() => {
        loading.value = true;
        deleteGoOutRecords({ ids: [row.id] }).then((res) => {
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

  const viewNodeDetail = () => {
    if (JSON.stringify(currentRow.value) === "{}") {
      ElMessage({ message: "请选择记录", type: "warning" });
      return;
    }
    addDialog({
      title: "查看审批详情",
      width: "900px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: true,
      hideFooter: true,
      contentRenderer: ({ options }) =>
        h(NodeDetailList, { options, billNo: currentRow.value?.billNo, billType: "outApply", billState: currentRow.value?.billState })
    });
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

  const onBack = () => {
    if (JSON.stringify(currentRow.value) == "{}" || !currentRow.value) {
      return ElMessage({ message: "请选择一条记录", type: "warning" });
    }
    if (![1, 2].includes(currentRow.value.billState)) {
      return message("当前状态不能进行回退", { type: "error" });
    }
    commonBackLogic(currentRow.value.billNo, onSearch);
  };

  const onSubmit = () => {
    if (JSON.stringify(currentRow.value) == "{}" || !currentRow.value) {
      return ElMessage({ message: "请选择一条记录", type: "warning" });
    }
    if (![0, 3].includes(currentRow.value.billState)) {
      return message("当前状态不能进行提交", { type: "error" });
    }
    commonSubmit({ id: currentRow.value.id, billId: "10038" }).then((res) => {
      if (res.data) {
        ElMessage({ message: "提交成功", type: "success" });
        onSearch();
      }
    });
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: beforeEdit, type: "warning", text: "修改" },
    { clickHandler: beforeDel, type: "danger", text: "删除" },
    { clickHandler: onBack, type: "info", text: "回退", isDropDown: true },
    { clickHandler: onSubmit, type: "info", text: "提交", isDropDown: true },
    { clickHandler: onExport, type: "info", text: "导出", isDropDown: true },
    { clickHandler: onPrint, type: "info", text: "打印", isDropDown: true },
    { clickHandler: viewNodeDetail, type: "info", text: "审批详情", isDropDown: true }
  ]);

  return {
    columns,
    dataList,
    loading,
    maxHeight,
    findOptinNameByOptionValue,
    billStateInfo,
    searchOptions,
    pagination,
    carStrMap,
    buttonList,
    rowClick,
    onSearch,
    onEdit,
    onTagSearch,
    onSizeChange,
    onCurrentChange
  };
};
