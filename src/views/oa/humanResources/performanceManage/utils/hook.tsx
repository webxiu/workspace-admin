import { onMounted, reactive, ref, h } from "vue";
import { type PaginationProps } from "@pureadmin/table";
import { utils, write } from "xlsx";
import { saveAs } from "file-saver";
import { getDeptOptions } from "@/utils/requestApi";

import { ElMessage } from "element-plus";
import { SummaryMethodProps, downloadDataToExcel, setColumn, getMenuColumns, getSummaries, updateButtonList, usePageSelect } from "@/utils/table";
import EditForm from "@/components/EditForm/index.vue";

import { useEleHeight } from "@/hooks";
import { addDialog } from "@/components/ReDialog";
import { formConfigs, formConfigs1, formRules, formRules1 } from "./config";
import { message, showMessageBox } from "@/utils/message";
import dayjs from "dayjs";

import { SearchOptionType, QueryParamsType } from "@/components/BlendedSearch/index.vue";
import { PAGE_CONFIG } from "@/config/constant";
import { getChildIDs, getTreeArrItem, getFileNameOnUrlPath, downloadFile } from "@/utils/common";
import {
  deletePerformanceInfo,
  editPerformanceDataInfo,
  exportPerformanceSheet,
  fetchPerformanceList,
  importPerformanceSheet,
  PerformanceManageItemType
} from "@/api/oaManage/humanResources";

export const useConfig = () => {
  const tableRef = ref();
  const treeData = ref([]);
  const currentRow: any = ref({});
  const loading = ref<boolean>(false);
  const columns = ref<TableColumnList[]>([]);
  const rowData = ref<PerformanceManageItemType>();
  const rowsData = ref<PerformanceManageItemType[]>([]);
  const dataList = ref<PerformanceManageItemType[]>([]);
  const yearMonthStr = dayjs(new Date()).format("YYYY-MM");
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49 + 52);

  const formData = reactive({
    deptId: "0",
    deptIdList: [],
    userName: "",
    userCode: "",
    page: 1,
    limit: PAGE_CONFIG.pageSize,
    yearAndMonth: yearMonthStr
  });

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "姓名", value: "userName" },
    { label: "工号", value: "userCode" },
    { label: "部门", value: "deptId", children: [] },
    { label: "日期", value: "yearAndMonth", type: "month", format: "YYYY-MM" }
  ]);

  const queryParams = reactive<QueryParamsType>({ yearAndMonth: yearMonthStr });
  const { setSelectCheckbox, setSelectChange, setSelectAllChange } = usePageSelect({ tableRef, dataList, rowsData, uniId: "id" });

  onMounted(() => {
    getColumnConfig();
    getOptions();
    onSearch();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "年月", prop: "yearAndMonth", width: 110 },
      { label: "部门", prop: "deptName", minWidth: 180 },
      { label: "工号", prop: "userCode", minWidth: 180 },
      { label: "姓名", prop: "staffName", minWidth: 180 },
      { label: "金额", prop: "money", minWidth: 120, align: "right" },
      { label: "创建日期", prop: "createDate", minWidth: 160 },
      { label: "修改日期", prop: "modifyDate", minWidth: 160 }
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, selectionColumn: { hide: false }, radioColumn: { width: 50 } });
    return columnData;
  };

  const getOptions = () => {
    getDeptOptions().then((data: any) => {
      treeData.value = data;
      searchOptions[2].children = data;
    });
  };

  const handleTagSearch = (values: any) => {
    formData.deptId = values.deptId;
    formData.userName = values.userName;
    formData.userCode = values.userCode;
    formData.yearAndMonth = values.yearAndMonth;
    formData.deptIdList = [];
    if (values.deptId) {
      const result = getTreeArrItem(treeData.value, "value", values.deptId);
      formData.deptIdList = getChildIDs([result], "value");
    }
    onSearch();
  };

  const onSearch = (idx?) => {
    loading.value = true;
    fetchPerformanceList(formData)
      .then((res) => {
        const data = res.data;
        loading.value = false;
        dataList.value = data.records || [];
        pagination.total = data.total;

        if (typeof idx === "number" && idx >= 0) {
          currentRow.value = dataList.value[idx];
        } else {
          currentRow.value = {};
        }
        setSelectCheckbox();
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

  const onCurrentChange = (row: PerformanceManageItemType) => {
    if (!row) return;
    rowData.value = row;
  };

  // 添加单据
  const onAdd = () => {
    openDialog("add");
  };

  const fetchRowData = (formLoading, _formData) => {
    fetchPerformanceList({
      page: formData.page,
      limit: formData.limit,
      userCode: currentRow.value.userCode,
      yearAndMonth: formData.yearAndMonth
    })
      .then((res: any) => {
        if (res.data && Array.isArray(res.data.records) && res.data.records.length === 1) {
          const dataRow = res.data.records[0] || {};
          const keys = Object.keys(_formData);
          keys.forEach((item) => (_formData[item] = dataRow[item]));
        }
      })
      .finally(() => {
        formLoading.value = false;
      });
  };

  const openDialog = async (type: string, row?) => {
    const titleObj = { add: "导入", edit: "修改" };
    const title = titleObj[type];
    const formRef = ref();
    const formLoading = ref(true);

    const _formData = reactive({
      money: row?.money ?? "",
      id: row?.id ?? "",
      userCode: row?.userCode ?? "",
      staffName: row?.staffName ?? "",
      deptName: row?.deptName ?? "",
      yearAndMonth: row?.yearAndMonth ?? ""
    });

    const addFormData = reactive({
      row: "2",
      userCodeCol: "1",
      moneyCol: "3",
      yearAndMonth: yearMonthStr,
      file: ""
    });

    fetchRowData(formLoading, _formData);

    addDialog({
      title: type === "add" ? "导入" : "请输入修改金额",
      props: {
        loading: formLoading,
        formInline: type === "add" ? addFormData : _formData,
        formRules: type === "add" ? formRules1 : formRules,
        formConfigs: type === "add" ? formConfigs1(treeData) : formConfigs()
      },
      width: type === "add" ? "400px" : "650px",
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
                const _rowIndex = dataList.value.findIndex((item) => item.id === currentRow.value.id);
                onSearch(_rowIndex);
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
        deptId: data.deptId,
        yearAndMonth: data.yearAndMonth,
        isCover: false
      };
      const fData = new FormData();
      fData.append("files", data.file);
      fData.append("param", JSON.stringify(param));

      importPerformanceSheet(fData).then((res) => {
        if (res.data) {
          callback();
          ElMessage({ message: "导入成功", type: "success" });
        } else {
          showMessageBox(`导入数据重复, 请确认是否覆盖？`)
            .then(() => {
              // 重新发起: 覆盖导入
              const fData2 = new FormData();
              fData2.append("files", data.file);
              fData2.append("param", JSON.stringify({ ...param, isCover: true }));
              importPerformanceSheet(fData2)
                .then(({ data }) => {
                  if (data) {
                    callback();
                    message("导入成功");
                  } else {
                    message("导入失败", { type: "error" });
                  }
                })
                .catch(console.log);
            })
            .catch(console.log);
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

  const onEdit = (row: PerformanceManageItemType) => {
    openDialog("edit", row);
  };

  const onDownload = async () => {
    const colArr = await getColumnConfig();
    downloadDataToExcel({
      dataList: [],
      columns: colArr.filter((item) => ["工号", "姓名", "金额"].includes(item.label)),
      sheetName: "绩效管理模板"
    });
  };

  const validYearAndMonth = () => {
    onAdd();
  };

  const onImport = () => {
    validYearAndMonth();
  };

  const onDelete = (rows: PerformanceManageItemType[]) => {
    const deleteIdList = rows.map((item) => item.id);
    deletePerformanceInfo({ deleteIdList: deleteIdList }).then((res) => {
      if (res.data) {
        ElMessage({ message: "删除成功!", type: "success" });
        const _rowIndex = dataList.value.findIndex((item) => item.id === currentRow.value.id);
        onSearch(_rowIndex);
      }
    });
  };

  // 批量删除
  const onDeleteAll = () => {
    if (rowsData.value.length === 0) {
      return message("请选择要删除的记录", { type: "error" });
    }
    showMessageBox(`确认删除选中的记录吗？`)
      .then(() => onDelete(rowsData.value))
      .catch(console.log);
  };

  const onExport = () => {
    const localExport = () => {
      const timeStep = Date.now();
      const workbook = utils.table_to_book(document.querySelector("#performanceTableId"), {
        raw: true //有的是日期、小数等格式，直接乱码#。所以这里直接保留原始字符串
      });
      workbook.Sheets.Sheet1["!cols"][0] = { hidden: true };
      const wbout = write(workbook, { bookType: "xlsx", bookSST: true, type: "array" });
      saveAs(new Blob([wbout], { type: "application/octet-stream" }), `绩效管理表${timeStep}.xlsx`);
    };
    exportPerformanceSheet({ ...formData })
      .then((res: any) => {
        if (res.data) {
          const fileName = getFileNameOnUrlPath(res.data);
          downloadFile(res.data, fileName, true);
        } else {
          localExport();
        }
      })
      .catch(() => localExport());
  };

  const rowClick = (row) => {
    currentRow.value = row;
    // tableRef.value?.getTableRef()?.toggleRowSelection(row);
  };

  const onDbClick = (row) => {
    currentRow.value = row;
    onEdit(row);
  };

  function onSelect(rows: PerformanceManageItemType[], row: PerformanceManageItemType) {
    setSelectChange({ rows, row });
  }

  function onSelectAll(rows: PerformanceManageItemType[]) {
    setSelectAllChange(rows);
  }

  /** 自定的统计 */
  const onSummaryMethod = (params: SummaryMethodProps<PerformanceManageItemType>) => {
    return getSummaries({ params: params, moneyCommaProps: ["money"] });
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onDeleteAll, type: "danger", text: "批量删除" },
    { clickHandler: onImport, type: "primary", text: "导入", isDropDown: true },
    { clickHandler: onDownload, type: "info", text: "下载模板", isDropDown: true },
    { clickHandler: onExport, type: "info", text: "导出", isDropDown: true }
  ]);

  return {
    tableRef,
    columns,
    dataList,
    loading,
    maxHeight,
    pagination,
    buttonList,
    searchOptions,
    queryParams,
    onEdit,
    onDelete,
    onSearch,
    handleTagSearch,
    onCurrentChange,
    handleSizeChange,
    onSelect,
    onSelectAll,
    rowClick,
    onDbClick,
    onSummaryMethod,
    handleCurrentChange
  };
};
