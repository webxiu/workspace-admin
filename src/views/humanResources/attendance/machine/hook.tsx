import {
  AttendanceMachineItemType,
  deleteMachine,
  downloadAttendanceData,
  downloadFaceInfo,
  fetchMachine,
  registerMachine,
  updateMachine,
  uploadUserData
} from "@/api/oaManage/humanResources";
import { ElMessage, UploadProps } from "element-plus";
import { downloadFile, getFileNameOnUrlPath } from "@/utils/common";
import { formConfigs, formRules } from "./config";
import { getMenuColumns, setColumn, updateButtonList, usePageSelect } from "@/utils/table";
import { h, onMounted, reactive, ref } from "vue";
import { message, showMessageBox, wrapFn } from "@/utils/message";
import { utils, write } from "xlsx";

import { AxiosProgressEvent } from "axios";
import type { ColDef } from "ag-grid-community";
import { FormItemConfigType } from "@/utils/form";
import { LoadingType } from "@/components/ButtonList/index.vue";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import TableEditList from "@/components/TableEditList/index.vue";
import { addDialog } from "@/components/ReDialog";
import { getAgGridColumns } from "@/components/AgGridTable/config";
import { numberOptions } from "@/config/constant";
import { saveAs } from "file-saver";
import { useEleHeight } from "@/hooks";

export const useMachine = () => {
  const isAgTable = ref(true);
  const columnDefs = ref<ColDef[]>([]);
  const tableRef = ref();
  const loading = ref(false);
  const currentRow = ref();
  const dataList = ref<AttendanceMachineItemType[]>([]);
  const columns = ref<TableColumnList[]>([]);
  const loadingStatus = ref<LoadingType>({ loading: false, text: "" });
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49);
  const formData: any = reactive({});
  const rowsData = ref<AttendanceMachineItemType[]>([]);

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "描述", value: "description" },
    { label: "名称", value: "attMachineName" }
  ]);

  onMounted(() => {
    getColumnConfig();
    getTableList();
  });
  const { setSelectCheckbox, setSelectChange, setSelectAllChange } = usePageSelect({ tableRef, dataList, rowsData, uniId: "id" });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "名称", prop: "attMachineName" },
      { label: "序列号", prop: "sn" },
      { label: "描述", prop: "description" },
      { label: "用户总数", prop: "totalUser" },
      { label: "密码总数", prop: "totalPwd" },
      { label: "指纹总数", prop: "totalFig" },
      { label: "记录总数", prop: "totalRecords" },
      { label: "指纹版本", prop: "figVersion" },
      { label: "管理记录总数", prop: "adminTotalRecord" },
      { label: "面模总数", prop: "totalModel" },
      { label: "管理员总数", prop: "adminTotal" },
      { label: "面模版本", prop: "modelVersion" },
      { label: "产品型号", prop: "model" },
      { label: "出厂日期", prop: "prodDate" },
      { label: "固件版本", prop: "fixVersion" },
      { label: "平台参数", prop: "someArgs" },
      { label: "手掌总数", prop: "handTotal" },
      { label: "掌模总数", prop: "handModelTotal" },
      { label: "用户容量", prop: "userSize" },
      { label: "指纹容量", prop: "figSize" },
      { label: "记录容量", prop: "recordsSize" },
      { label: "面部容量", prop: "faceSize" },
      { label: "手掌容量", prop: "handSize" },
      { label: "IP地址", prop: "ipAddr" },
      { label: "子网掩码", prop: "Netmask" },
      { label: "网关地址", prop: "gateway" }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [menuCols] = columnArrs;
    if (menuCols?.length) columnData = menuCols;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, selectionColumn: { hide: false }, operationColumn: false });
    columnDefs.value = getAgGridColumns({ columnData, selectionColumn: { hide: false }, operationColumn: false });
    return columnData;
  };

  const getTableList = () => {
    fetchMachine(formData).then((res) => {
      if (res.data) {
        dataList.value = res.data;
        setSelectCheckbox();
      }
    });
  };

  const onReFresh = () => {
    getColumnConfig();
    getTableList();
  };

  const onTagSearch = (values) => {
    Object.assign(formData, values);
    getTableList();
  };

  const onExport = () => {
    const timeStep = Date.now();
    const workbook = utils.table_to_book(document.querySelector("#machineTableId"), {
      raw: true //有的是日期、小数等格式，直接乱码#。所以这里直接保留原始字符串
    });
    workbook.Sheets.Sheet1["!cols"][0] = { hidden: true };
    const wbout = write(workbook, {
      bookType: "xlsx",
      bookSST: true,
      type: "array"
    });
    saveAs(
      new Blob([wbout], {
        type: "application/octet-stream"
      }),
      `考勤机管理${timeStep}.xlsx`
    );
  };

  const openDialog = async (type: "add" | "view" | "edit", row?) => {
    const title = { add: "新增", edit: "修改" }[type];
    const formRef = ref();
    const formLoading = ref(false);
    const _formData = reactive({
      id: row?.id ?? "",
      errorDelay: row?.errorDelay ?? "180",
      delay: row?.delay ?? "60",
      serverVer: row?.serverVer ?? "2.4.1",
      pushProtVer: row?.pushProtVer ?? "2.4.1",
      encrypt: row?.encrypt ?? 0,
      transFlag: row?.transFlag ?? "100000000000",
      pushOptionsFlag: row?.pushOptionsFlag ?? 1,
      timeZone: row?.timeZone ?? "8",
      supportPing: row?.supportPing ?? 1,
      pushOptions:
        row?.pushOptions ??
        "RegDeviceType,FingerFunOn,FaceFunOn,FPVersion,FaceVersion,NetworkType,HardwareId3,HardwareId5,HardwareId56,LicenseStatus3,LicenseStatus5,LicenseStatus56",
      encryptFlag: row?.encryptFlag ?? "100000000",
      sn: row?.sn ?? "",
      attMachineName: row?.attMachineName ?? "",
      realTime: row?.realTime ?? 1
    });

    const formConfig: FormItemConfigType[] = [
      {
        formData: _formData,
        formProps: { labelWidth: "140px" },
        dataOption: {
          encrypt: numberOptions,
          pushOptionsFlag: numberOptions,
          supportPing: numberOptions,
          realTime: numberOptions
        }
      }
    ];

    addDialog({
      title: `${title}`,
      props: {
        params: { groupCode: "1" },
        formConfig: formConfig
      },
      width: "900px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      okButtonText: "保存",
      hideFooter: type === "view",
      showResetButton: true,
      beforeReset: () => formRef.value.resetRef(),
      contentRenderer: () => h(TableEditList, { ref: formRef }),
      beforeSure: (done) => {
        formRef.value.getRef().then(({ valid, data }) => {
          if (valid) {
            showMessageBox(`确认要${title}吗?`)
              .then(() => {
                onSubmitChange(type, title, _formData, () => {
                  done();
                  getTableList();
                });
              })
              .catch(console.log);
          }
        });
      }
    });
  };

  const onSubmitChange = (type: string, title: string, data, callback) => {
    console.log(type, data);
    const apiType = { add: registerMachine, edit: updateMachine };
    apiType[type](data).then((res) => {
      if (res.data) {
        ElMessage({ message: `${title}成功`, type: "success" });
        callback();
      }
    });
  };

  const onAdd = () => {
    openDialog("add");
  };

  const onEdit = () => {
    if (!currentRow.value) {
      ElMessage({ message: "请选择一条记录", type: "warning" });
      return;
    }
    openDialog("edit", currentRow.value);
  };

  const onDel = () => {
    if (!currentRow.value) {
      ElMessage({ message: "请选择一条记录", type: "warning" });
      return;
    }
    showMessageBox(`确认要删除序列号为【${currentRow.value.sn}】的记录吗?`)
      .then(() => {
        deleteMachine({ id: currentRow.value.id }).then((res) => {
          if (res.data) {
            ElMessage({ message: "删除成功", type: "success" });
            currentRow.value = null;
            getTableList();
          }
        });
      })
      .catch(console.log);
  };
  const rowDbclick = (row) => {
    onEdit();
  };
  const rowClick = (row) => {
    currentRow.value = row;
  };

  // 下载面部
  const onDownloadFace = wrapFn(rowsData, () => {
    const ids = rowsData.value.map((item) => item.id);
    downloadFaceInfo(ids)
      .then(({ data }) => {
        if (!data) return message.error("下载失败");
        message.success("提交成功, 请查看 考勤机操作日志 执行结果");
      })
      .catch(console.log);
  });

  function onDownloadAttendance() {
    message.success("暂无接口...");
    return;
    downloadAttendanceData({})
      .then(({ data }) => {
        if (!data) return message.error("下载失败");
        const fileName = getFileNameOnUrlPath(data);
        downloadFile(data, fileName);
      })
      .catch(console.log);
  }

  /** 上传用户信息 */
  const onUploadUserInfo: UploadProps["onChange"] = (uploadFile) => {
    console.log("uploadFile", uploadFile);
    message.success("暂无接口...");
    return;
    const percentage = ref(0);
    const rawFile = uploadFile.raw;
    const fd = new FormData();
    fd.append("file", rawFile);
    // 上传进度
    const onUploadProgress = (progressEvent: AxiosProgressEvent) => {
      const { loaded, total } = progressEvent;
      const complete = (loaded / total) * 100;
      percentage.value = Math.floor(complete);
    };

    uploadUserData(fd, onUploadProgress)
      .then(({ data }) => {
        if (!data) return message.error("上传失败");
        message.success("上传成功");
      })
      .catch(console.log);
  };

  function onSelect(rows, row) {
    setSelectChange({ rows, row });
  }

  function handleSelectionChange(rows: AttendanceMachineItemType[]) {
    rowsData.value = rows;
  }

  function onSwitchTable() {
    isAgTable.value = !isAgTable.value;
    currentRow.value = undefined;
    rowsData.value = [];
  }

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "新增", isDropDown: false },
    { clickHandler: onEdit, type: "success", text: "修改", isDropDown: false },
    { clickHandler: onDel, type: "danger", text: "删除", isDropDown: false },
    { clickHandler: onDownloadFace, type: "primary", text: "下载面部", isDropDown: true },
    { clickHandler: onDownloadAttendance, type: "success", text: "下载考勤数据", isDropDown: true },
    {
      type: "danger",
      text: "上传用户信息",
      isDropDown: true,
      uploadProp: { action: "#", accept: ".xlsx, .xls", autoUpload: false, onChange: onUploadUserInfo }
    },
    { clickHandler: onExport, type: "info", text: "导出", isDropDown: true }
  ]);

  return {
    columnDefs,
    isAgTable,
    tableRef,
    loading,
    dataList,
    columns,
    maxHeight,
    buttonList,
    searchOptions,
    loadingStatus,
    onReFresh,
    rowClick,
    onSelect,
    rowDbclick,
    onTagSearch,
    handleSelectionChange,
    onSwitchTable
  };
};
