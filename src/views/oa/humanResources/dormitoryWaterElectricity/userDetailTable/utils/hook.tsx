import { onMounted, reactive, ref, h } from "vue";
import { type PaginationProps } from "@pureadmin/table";

import { ElMessage } from "element-plus";
import { downloadDataToExcel, setColumn } from "@/utils/table";
import EditForm from "@/components/EditForm/index.vue";
import * as CommonUtils from "@/utils/common";

import { useEleHeight } from "@/hooks";
import { addDialog } from "@/components/ReDialog";
import { formConfigs, formConfigs1, formDetailConfigs, formDetailRules, formRules, formRules1 } from "./config";
import { message, showMessageBox } from "@/utils/message";
import dayjs from "dayjs";
import { cloneDeep } from "@pureadmin/utils";

import {
  detailDormitoryWaterElectricity,
  editPerformanceDataInfo,
  exportDetailDormitoryWaterElectricity,
  importPerformanceSheet,
  importUserWaterElectricityDetail,
  validYearAndMonthPerformance
} from "@/api/oaManage/humanResources";

import { PAGE_CONFIG } from "@/config/constant";
import { downloadFile, getFileNameOnUrlPath } from "@/utils/common";
import { QueryParamsType, SearchOptionType } from "@/components/BlendedSearch/index.vue";
import axios from "axios";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const columns2 = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref([]);
  const rowData = ref();

  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49 + 52);

  const formData: any = reactive({
    page: 1,
    limit: PAGE_CONFIG.pageSize,
    yearAndMonth: dayjs(new Date()).format("YYYY-MM"),
    userName: "",
    userCode: ""
  });

  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });

  onMounted(() => {
    onSearch();
  });

  const getColumnConfig = () => {
    const columnData: TableColumnList[] = [
      { label: "年", prop: "year", minWidth: 60, align: "right" },
      { label: "月", prop: "month", minWidth: 60, align: "right" },
      { label: "宿舍楼", prop: "buildingName", minWidth: 60 },
      { label: "房间号", prop: "dormitoryCode", minWidth: 60, align: "right" },
      { label: "工号", prop: "staffCode", align: "right" },
      { label: "姓名", prop: "staffName" },
      { label: "水费", prop: "water", align: "right" },
      { label: "电费", prop: "electric", align: "right" },
      { label: "水电总计", prop: "totalWaterElectric", align: "right" },
      { label: "公摊水费", prop: "publicWater", align: "right" },
      { label: "公摊电费", prop: "publicElectric", align: "right" },
      { label: "当月入住日期", prop: "moveInDate", minWidth: 150 },
      { label: "搬离日期", prop: "removalDate", minWidth: 150 },
      { label: "入住时长(天)", prop: "moveInDays", align: "right" }
    ];
    columns.value = setColumn({ columnData, operationColumn: false });
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

  const onSearch = () => {
    loading.value = true;
    console.log(formData, "formData search");
    formData.year = +formData.yearAndMonth?.split("-")[0];
    formData.month = +formData.yearAndMonth?.split("-")[1];
    detailDormitoryWaterElectricity(formData)
      .then((res: any) => {
        const data = res.data;
        loading.value = false;
        dataList.value = data.records || [];
        pagination.total = data.total;
        getColumnConfig();
      })
      .catch((err) => (loading.value = false));
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

    const _formData = reactive({
      money: row?.money ?? "",
      id: row?.id ?? ""
    });

    const addFormData = reactive({
      row: "",
      userCodeCol: "",
      moneyCol: "",
      file: ""
    });

    addDialog({
      title: type === "add" ? "导入" : "请输入修改金额",
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

  const onSubmitChange = (type: string, title: string, data, callback) => {
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
          ElMessage({ message: "导入成功", type: "success" });
        }
      });
      return;
    }
    const API = { edit: editPerformanceDataInfo };
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
    openDialog("edit", row);
  };

  const onDownload = () => {
    downloadDataToExcel({
      dataList: [],
      columns: getColumnConfig().filter((item) => ["工号", "姓名", "金额"].includes(item.label)),
      sheetName: "绩效管理模板"
    });
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

  const rowDbClick = (row) => {
    console.log(row, "row");
  };

  // 导出
  const onExportAction = () => {
    console.log("export..", formData);
    exportDetailDormitoryWaterElectricity({
      ...formData,
      excelName: "个人水电详情",
      excelHeader: JSON.stringify(
        getColumnConfig()
          .map((item, index) => {
            return { field: item.prop, title: item.label, width: 160, key: `0-${index}`, hide: false, colspan: 1, rowspan: 1, type: "normal", colGroup: false };
          })
          .filter((item) => item.field && item.field !== "index")
      )
    }).then((res: any) => {
      if (res.data) {
        const fileName = getFileNameOnUrlPath(res.data);
        downloadFile(res.data, fileName, true);
      }
    });
  };

  const onSubmitDetailChange = (data, callback) => {
    const copyData = cloneDeep(data);
    copyData.year = +data.yearAndMonth?.split("-")[0];
    copyData.month = +data.yearAndMonth?.split("-")[1];
    delete copyData.yearAndMonth;
    delete copyData.file;

    const fData = new FormData();
    fData.append("files", data.file);
    fData.append("data", JSON.stringify(copyData));
    importUserWaterElectricityDetail(fData).then((res) => {
      if (res.data) {
        ElMessage({ message: "导入成功", type: "success" });
        if (typeof callback === "function") callback();
      }
    });
  };

  //导入
  const onImportAction = () => {
    const _formData = reactive({
      yearAndMonth: dayjs().format("YYYY-MM"),
      startRow: 3,
      nameCol: 2,
      staffCodeCol: 3,
      daysCol: 5,
      dateCol: 4,
      costCol: 15
    });
    const formRef = ref();

    addDialog({
      title: "导入个人水电",
      props: {
        formInline: _formData,
        formRules: formDetailRules,
        formConfigs: formDetailConfigs()
      },
      width: "400px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.validate(async (valid) => {
          if (valid) {
            showMessageBox(`确认要导入吗?`).then(() => {
              onSubmitDetailChange(_formData, () => {
                done();
                onSearch();
              });
            });
          }
        });
      }
    });
  };

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "姓名", value: "userName" },
    { label: "工号", value: "userCode" },
    { label: "年月", value: "yearAndMonth", type: "month", format: "YYYY-MM" }
  ]);

  const queryParams = reactive<QueryParamsType>({ yearAndMonth: dayjs().format("YYYY-MM") });

  const onTagSearch = (values) => {
    Object.assign(formData, values);
    onSearch();
  };

  const onDownloadDetailModel = () => {
    console.log("下载水电详情模板");
    return axios({
      method: "get",
      responseType: "blob",
      url: `${import.meta.env.VITE_PUBLIC_PATH}template/个人水电模板.xlsx`
    })
      .then(({ data }) => CommonUtils.onDownload(data, "个人水电模板.xlsx"))
      .catch(() => {});
  };

  const buttonList2 = ref<ButtonItemType[]>([
    { clickHandler: onImportAction, type: "primary", text: "导入" },
    { clickHandler: onDownloadDetailModel, type: "primary", text: "下载模板", isDropDown: true },
    { clickHandler: onExportAction, type: "info", text: "导出", isDropDown: true }
  ]);

  return {
    loading,
    buttonList2,
    rowDbClick,
    rowStyle,
    changeDateYear,
    onTagSearch,
    searchOptions,
    queryParams,
    columns,
    onEdit,
    dataList,
    maxHeight,
    pagination,
    onSearch,
    onExportAction,
    onImportAction,
    formData,
    onCurrentChange,
    handleSizeChange,
    handleCurrentChange
  };
};
