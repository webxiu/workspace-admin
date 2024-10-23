import { onMounted, reactive, ref, h } from "vue";
import { type PaginationProps } from "@pureadmin/table";

import { ElMessage, dayjs } from "element-plus";
import { downloadDataToExcel, setColumn, getMenuColumns, updateButtonList } from "@/utils/table";
import EditForm from "@/components/EditForm/index.vue";

import { useEleHeight } from "@/hooks";
import { addDialog } from "@/components/ReDialog";
import { formConfigs, formConfigs1, formConfigsTop, formRules, formRules1, formRulesTop } from "./config";
import { message, showMessageBox } from "@/utils/message";
import {
  addDormitoryWaterElectricity,
  devideDormitoryWaterElectricity,
  exportDormitoryWaterElectricity,
  fetchAllBuliding,
  fetchDormitoryWaterElectricity,
  fetchPublicDormitoryWaterElectricity,
  importDormitoryWaterElectricity,
  updateDormitoryWaterElectricity,
  updatePublicDormitoryWaterElectricity
} from "@/api/oaManage/humanResources";
import { downloadFile, getFileNameOnUrlPath } from "@/utils/common";
import SelectUserModal from "../selectUserModal/modal.vue";

import { PAGE_CONFIG } from "@/config/constant";
import { cloneDeep } from "@pureadmin/utils";
import { SearchOptionType, QueryParamsType } from "@/components/BlendedSearch/index.vue";
import { TableGroupItemType } from "@/api/systemManage";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const columns2 = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const loading2 = ref<boolean>(false);
  const dataList = ref([]);
  const dataList2: any = ref([]);
  const rowData = ref();
  const dialogVisible = ref(false);
  const curBuildingsId = ref("");
  const buildings: any = ref([]);
  const currentRow: any = ref({});
  const curMultipeOtherUserList: any = ref([]);
  const curDate = ref(dayjs().format("YYYY-MM"));
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49 + 52);
  const groupArrsList = ref<TableGroupItemType[]>([]);

  const formData = reactive({
    page: 1,
    limit: PAGE_CONFIG.pageSize,
    dormitoryCode: "",
    buildingName: "",
    year: curDate.value.split("-")[0],
    month: curDate.value.split("-")[1]
  });

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "房间号", value: "dormitoryCode" },
    {
      label: "宿舍楼",
      value: "buildingName",
      children: [
        { label: "A栋", value: "A" },
        { label: "D栋", value: "D" }
      ]
    },
    { label: "日期", value: "curDate", type: "month", format: "YYYY-MM" }
  ]);
  const queryParams = reactive<QueryParamsType>({ curDate: curDate.value });

  onMounted(() => {
    getColumnConfig();
    onSearch();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "年", prop: "year", width: 110 },
      { label: "月", prop: "month", width: 110 },
      { label: "宿舍楼", prop: "buildingName", width: 90 },
      { label: "房间号", prop: "dormitoryCode", width: 100 },
      { label: "上月电表数", prop: "lastElectric", minWidth: 180 },
      { label: "本月电表数", prop: "electric", minWidth: 120 },
      { label: "电用量", prop: "useElectric", minWidth: 120 },
      { label: "本月电费用", prop: "electricCharge", minWidth: 120 },
      { label: "上月水表数", prop: "lastWater", minWidth: 120 },
      { label: "本月水表数", prop: "water", minWidth: 120 },
      { label: "水用量", prop: "useWater", minWidth: 120 },
      { label: "本月水费用", prop: "waterCharge", minWidth: 120 }
    ];

    let columnData2: TableColumnList[] = [
      { label: "年", prop: "year", width: 110 },
      { label: "月", prop: "month", width: 110 },
      { label: "宿舍楼", prop: "buildingName", width: 90 },
      { label: "上月电表数", prop: "lastElectric", minWidth: 180 },
      { label: "电表数", prop: "electric", minWidth: 120 },
      { label: "电用量", prop: "electricityDosage", minWidth: 120 },
      { label: "电费用", prop: "electricCharge", minWidth: 120 },
      { label: "上月水表数", prop: "lastWater", minWidth: 120 },
      { label: "水表数", prop: "water", minWidth: 120 },
      { label: "水用量", prop: "waterDosage", minWidth: 120 },
      { label: "水费用", prop: "waterCharge", minWidth: 120 }
    ];
    const { columnArrs, groupArrs, buttonArrs } = await getMenuColumns();
    const [data, data2] = columnArrs;
    if (data?.length) columnData = data;
    if (data2?.length) columnData2 = data2;
    if (groupArrs?.length) groupArrsList.value = groupArrs;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, indexColumn: { label: "宿舍水电/序号", width: 120 }, operationColumn: { width: 80 } });
    columns2.value = setColumn({ columnData: columnData2, indexColumn: { label: "公摊水电/序号", width: 120 }, operationColumn: { width: 80 } });
    return columnData;
  };

  const onTagSearch = ({ curDate, ...values }) => {
    formData.year = curDate?.split("-")[0];
    formData.month = curDate?.split("-")[1];
    Object.assign(formData, values);
    onSearch();
  };

  const onSearch = () => {
    // if (!formData.year || !formData.month) {
    //   return ElMessage({ message: "请先选择年月", type: "warning" });
    // }
    loading.value = true;
    loading2.value = true;
    fetchDormitoryWaterElectricity(formData)
      .then((res: any) => {
        const data = res.data;
        loading.value = false;
        dataList.value = data.records || [];
        pagination.total = data.total;
      })
      .catch((err) => (loading.value = false));

    fetchPublicDormitoryWaterElectricity(formData)
      .then((res) => {
        if (res.data) {
          dataList2.value = res.data;
        }
      })
      .finally(() => (loading2.value = false));
  };

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

  const openDialog = async (type: string, row?) => {
    const titleObj = { add: "导入", edit: "修改" };
    const title = titleObj[type];
    const formRef = ref();

    const _formData: any = reactive({
      buildingId: row?.buildingId,
      electric: row?.electric,
      id: row?.id,
      month: row?.month ?? "",
      water: row?.water,
      year: row?.year ?? ""
    });

    if (row && row.year && row.month) {
      _formData.yearAndMonth = dayjs(new Date(row?.year + "-" + row?.month)).format("YYYY-MM");
    } else {
      _formData.yearAndMonth = dayjs(new Date(formData.year + "-" + formData.month)).format("YYYY-MM");
    }

    const addFormData = reactive({
      files: "",
      yearAndMonth: dayjs().format("YYYY-MM")
    });

    addDialog({
      title,
      props: {
        formInline: type === "add" ? addFormData : _formData,
        formRules: type === "add" ? formRules1 : formRules,
        formConfigs: type === "add" ? formConfigs1() : formConfigs()
      },
      width: type === "add" ? "400px" : "200px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.validate(async (valid) => {
          if (valid) {
            showMessageBox(`确认要${title}吗?`).then(() => {
              onSubmitChange(type, title, type === "add" ? addFormData : _formData, () => {
                done();
                onSearch();
              });
            });
          }
        });
      }
    });
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
        const lastClick = curMultipeOtherUserList.value[curMultipeOtherUserList.value.length - 1];
        const names = lastClick.dormitoryCode;
        configData.dormitoryCode = String(names);
        configData.dormitoryId = lastClick.id;
        configData.buildingId = lastClick.buildingId;
        done();
      }
    });
  };

  const changeBuilding = (val) => {
    console.log(val, "val");
    curBuildingsId.value = val;
  };

  const openDialogTop = async (type: string, rowData?: any) => {
    const titleObj = { add: "新增宿舍水电", edit: "修改宿舍水电" };
    const title = titleObj[type];
    const formRef = ref();
    const formLoading = ref(true);

    const _formData: any = reactive({
      name: "",
      dormitoryCode: "",
      lastElectric: "",
      lastWater: "",
      electric: "",
      id: "",
      month: "",
      water: "",
      year: "",
      buildingId: "",
      yearAndMonth: ""
    });

    if (type === "add") {
      _formData.yearAndMonth = dayjs(new Date()).format("YYYY-MM");
      _formData.buildingId = curBuildingsId.value;
    }

    if (type === "edit") {
      fetchDormitoryWaterElectricity({
        ...formData,
        dormitoryCode: rowData?.dormitoryCode ?? "",
        dormitoryId: rowData?.dormitoryId ?? ""
      })
        .then((rowRes: any) => {
          if (rowRes.data?.records?.length > 1) {
            ElMessage({ message: "数据存在多条记录", type: "error" });
            return;
          }

          if (rowRes.data.records && Array.isArray(rowRes.data.records) && rowRes.data.records.length === 1) {
            const row = rowRes.data.records[0];
            Object.keys(_formData).forEach((key) => {
              if (row[key]) {
                row.yearAndMonth = dayjs(`${row.year}-${row.month}`).format("YYYY-MM");
                console.log(row.yearAndMonth, " row.yearAndMonth");
                _formData[key] = row[key];
              }
            });
          }
        })
        .finally(() => (formLoading.value = false));

      _formData.name = rowData.buildingName;
    }

    fetchAllBuliding({})
      .then((res) => {
        if (res.data) {
          buildings.value = res.data;
        }
      })
      .finally(() => (formLoading.value = false));

    addDialog({
      title,
      props: {
        loading: type === "edit" ? formLoading : false,
        formInline: _formData,
        formRules: formRulesTop,
        formConfigs: formConfigsTop({ type, buildings, changeBuilding, handleAddOtherUserNames: () => handleAddOtherUserNames(_formData) })
      },
      width: "700px",
      draggable: true,
      fullscreenIcon: true,
      okButtonText: "保存",
      closeOnClickModal: false,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.validate(async (valid) => {
          if (valid) {
            showMessageBox(`确认要${title}吗?`).then(() => {
              onSubmitChangeTop(type, title, _formData, () => {
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
    if (type === "add") {
      const param = {
        year: +data.yearAndMonth.split("-")[0],
        month: +data.yearAndMonth.split("-")[1]
      };
      const fData = new FormData();
      fData.append("files", data.files);
      fData.append("data", JSON.stringify(param));

      importDormitoryWaterElectricity(fData).then((res) => {
        if (res.data) {
          callback();
          ElMessage({ message: "导入成功", type: "success" });
        }
      });
      return;
    }
    const API = { edit: updatePublicDormitoryWaterElectricity };
    const copyData = cloneDeep(data);
    const sendData = { ...copyData, year: +data.yearAndMonth.split("-")[0], month: +data.yearAndMonth.split("-")[1], yearAndMonth: undefined };
    API[type](sendData)
      .then((res) => {
        if (res.data) {
          callback();
          message(`${title}成功`);
        }
      })
      .catch(console.log);
  };

  const onSubmitChangeTop = (type: string, title: string, data, callback) => {
    if (type === "add") {
      const buildingName = buildings.value.find((item) => item.id === data.name)?.name;
      data.name = buildingName ?? data.name;
      const [year, month] = data.yearAndMonth.split("-");
      data.year = +year;
      data.month = +month;

      const reqData = {
        buildingName: data.name,
        dormitoryCode: data.dormitoryCode,
        dormitoryId: data.dormitoryId,
        electric: data.electric,
        month: data.month,
        water: data.water,
        buildingId: data.buildingId,
        year: data.year
      };
      addDormitoryWaterElectricity(reqData).then((res) => {
        if (res.data) {
          callback();
          message(`${title}成功`);
        }
      });
      return;
    }

    const API = { edit: updateDormitoryWaterElectricity };
    const reqData = {
      id: data.id,
      electric: data.electric,
      water: data.water,
      lastWater: data.lastWater,
      buildingId: data.buildingId,
      lastElectric: data.lastElectric
    };
    API[type](reqData)
      .then((res) => {
        if (res.data) {
          callback();
          message(`${title}成功`);
        }
      })
      .catch(console.log);
  };

  const onEdit = (row) => {
    openDialog("edit", row);
  };

  const onEditTop = (row) => {
    openDialogTop("edit", row);
  };

  const onDownload = async () => {
    const calcCols = await getColumnConfig();
    downloadDataToExcel({
      dataList: [],
      columns: [{ label: "序号", prop: "number" }, ...calcCols.filter((item) => ["序号", "宿舍楼", "房间号", "本月电表数", "本月水表数"].includes(item.label))],
      sheetName: "宿舍水电管理模板"
    });
  };

  const validYearAndMonth = () => {
    onAdd();
  };

  const onImport = () => {
    validYearAndMonth();
  };

  const onDevideWaterAndElectronic = () => {
    if (!formData.year || !formData.month) {
      return ElMessage({ message: "请先选择年月", type: "warning" });
    }
    const yearMonth = dayjs(`${formData.year}-${formData.month}`).format("YYYY-MM");
    showMessageBox(`确认分摊【${yearMonth}】水电费吗？`)
      .then(() => {
        loading.value = true;
        loading2.value = true;
        devideDormitoryWaterElectricity({ yearAndMonth: yearMonth + "-01" })
          .then((res) => {
            if (res.data) {
              ElMessage({ message: "分摊成功", type: "success" });
              onSearch();
            }
          })
          .finally(() => {
            loading.value = false;
            loading2.value = false;
          });
      })
      .catch(() => {});
  };

  const onExport = () => {
    if (!formData.year || !formData.month) {
      return ElMessage({ message: "请先选择年月", type: "warning" });
    }
    loading.value = true;
    exportDormitoryWaterElectricity({ ...formData })
      .then((res: any) => {
        if (res.data) {
          const fileName = getFileNameOnUrlPath(res.data);
          downloadFile(res.data, fileName, true);
        }
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const onAddAction = () => {
    openDialogTop("add");
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAddAction, type: "primary", text: "新增", isDropDown: false },
    { clickHandler: onImport, type: "danger", text: "导入", isDropDown: true },
    { clickHandler: onExport, type: "danger", text: "导出", isDropDown: true },
    { clickHandler: onDownload, type: "primary", text: "下载模板", isDropDown: true },
    { clickHandler: onDevideWaterAndElectronic, type: "success", text: "分摊水电", isDropDown: true },
    { clickHandler: () => (dialogVisible.value = true), type: "info", text: "个人水电详情", isDropDown: true }
  ]);

  const rowStyle = () => {
    return { cursor: "pointer" };
  };

  return {
    columns,
    columns2,
    dataList,
    dataList2,
    loading,
    loading2,
    maxHeight,
    pagination,
    buttonList,
    dialogVisible,
    searchOptions,
    queryParams,
    groupArrsList,
    onEdit,
    onEditTop,
    onSearch,
    onCurrentChange,
    handleSizeChange,
    rowStyle,
    onTagSearch,
    handleCurrentChange
  };
};
