import { QueryParamsType, SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { downloadFile, getFileNameOnUrlPath, onDownload } from "@/utils/common";
import { getChildDeptIds, getExportConfig, getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { getMoneySettingsList, moneySettingsExport, updateMoneySettingsInfo, uploadMoneySettingsInfo } from "@/api/oaManage/financeDept";
import { h, onMounted, reactive, ref } from "vue";
import { message, showMessageBox } from "@/utils/message";

import type { ColDef } from "ag-grid-community";
import { ElMessage } from "element-plus";
import { FormItemConfigType } from "@/utils/form";
import { PAGE_CONFIG } from "@/config/constant";
import { PaginationProps } from "@pureadmin/table";
import TableEditList from "@/components/TableEditList/index.vue";
import { Upload } from "@element-plus/icons-vue";
import { addDialog } from "@/components/ReDialog";
import axios from "axios";
import { getAgGridColumns } from "@/components/AgGridTable/config";
import { getDeptOptions } from "@/utils/requestApi";
import { insertClassifyTableInfo } from "@/api/plmManage";
import { useEleHeight } from "@/hooks";

export const useConfig = () => {
  const isAgTable = ref(true);
  const columnDefs = ref<ColDef[]>([]);
  const columns = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref([]);
  const currentId = ref("");
  const currentRow: any = ref({});
  const moneyRef = ref(null);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 95);
  const treeData = ref([]);

  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });

  const formData: any = reactive({
    deptId: "0",
    staffCode: "",
    staffName: "",
    state: "在职",
    wageAccountingType: "职员",
    entryDeadline: "",
    page: 1,
    limit: PAGE_CONFIG.pageSize
  });

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "姓名", value: "staffName" },
    { label: "工号", value: "staffCode" },
    {
      label: "状态",
      value: "state",
      children: [
        { label: "在职", value: "在职" },
        { label: "离职", value: "离职" }
      ]
    },
    {
      label: "核算标准",
      value: "wageAccountingType",
      children: [
        { label: "职员", value: "职员" },
        { label: "员工", value: "员工" }
      ]
    },
    { label: "部门", value: "deptId", children: [] },
    { label: "入职截止日期", value: "entryDeadline", type: "date", format: "YYYY-MM-DD" }
  ]);

  const queryParams = reactive<QueryParamsType>({
    state: { value: "在职", valueLabel: "在职" },
    wageAccountingType: { value: "职员", valueLabel: "职员" }
  });

  onMounted(() => {
    getColumnConfig();
    getOptions();
    onSearch();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "姓名", prop: "staffName" },
      { label: "工号", prop: "staffCode" },
      { label: "正班工资", prop: "regularSalary" },
      { label: "级别工资", prop: "levelSalary" },
      { label: "岗位津贴", prop: "positionSubsidy" },
      { label: "保密费", prop: "confidentialitySubsidy" },
      { label: "工龄金额/年", prop: "workAgeSubsidy" },
      { label: "房屋补贴", prop: "rentAllowance" },
      { label: "是否计算", prop: "isSalary" }
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ formData, columnData: JSON.parse(JSON.stringify(columnData)), operationColumn: false });
    columnDefs.value = getAgGridColumns({ formData, columnData, operationColumn: false });
    return columnData;
  };

  const getOptions = () => {
    getDeptOptions().then((data: any) => {
      treeData.value = data;
      searchOptions[4].children = data;
    });
  };

  const onRefresh = () => {
    getColumnConfig();
    onSearch();
  };

  const onSearch = (_rowIndex?) => {
    loading.value = true;
    getMoneySettingsList(formData)
      .then((res: any) => {
        const data = res.data;
        loading.value = false;
        dataList.value = data.records || [];
        pagination.total = data.total;
        if (typeof _rowIndex === "number" && _rowIndex >= 0) {
          currentRow.value = dataList.value[_rowIndex];

          if (moneyRef.value) {
            moneyRef.value.getTableRef().setCurrentRow(dataList.value[_rowIndex]);
          }
        } else {
          currentRow.value = {};
        }
      })
      .catch((err) => (loading.value = false));
  };

  const onTagSearch = (values) => {
    formData.staffCode = values.staffCode;
    formData.staffName = values.staffName;
    formData.state = values.state;
    formData.wageAccountingType = values.wageAccountingType;
    formData.deptId = values.deptId;
    formData.entryDeadline = values.entryDeadline;
    formData.deptIdList = getChildDeptIds(treeData.value, values.deptId);
    onSearch();
  };

  const onEdit = () => {
    const row = currentRow.value;
    currentId.value = row.staffCode;
    openDialog("edit", row);
  };

  const openDialog = async (type: string, row?) => {
    const titleObj = { add: "新增", edit: "修改薪资" };
    const title = titleObj[type];
    const formRef = ref();

    const _formData = reactive({
      ...row,
      regularSalary: row?.regularSalary,
      levelSalary: row?.levelSalary,
      positionSubsidy: row?.positionSubsidy,
      rentAllowance: row?.rentAllowance,
      workAgeSubsidy: row?.workAgeSubsidy,
      confidentialitySubsidy: row?.confidentialitySubsidy,
      bigWeekOverTime: row?.bigWeekOverTime,
      isSalary: row?.isSalary ?? "",
      staffName: row?.staffName ?? "",
      staffCode: row?.staffCode ?? "",
      staffId: row?.staffId,
      standardSalary: row?.standardSalary
    });

    const formConfig: FormItemConfigType[] = [
      {
        formData: _formData,
        formProps: { labelWidth: "90px" },
        customColumn: {
          positionSubsidy: { hide: row?.wageAccountingType === "职员" }
        }
      }
    ];

    addDialog({
      title: `${title}`,
      props: {
        params: { groupCode: "1" },
        formConfig
      },
      width: "900px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(TableEditList, { ref: formRef }),
      beforeSure: (done) => {
        formRef.value.getRef().then(({ valid, data }) => {
          if (valid) {
            showMessageBox(`确认要${title}吗?`)
              .then(() => {
                onSubmitChange(type, title, _formData, () => {
                  done();
                  const _rowIndex = dataList.value.findIndex((item) => item.staffCode === currentRow.value.staffCode);
                  onSearch(_rowIndex);
                });
              })
              .catch(console.log);
          }
        });
      }
    });
  };

  const onSubmitChange = (type: string, title: string, data, callback) => {
    if (type === "edit") data.staffCode = currentId.value;

    const API = { add: insertClassifyTableInfo, edit: updateMoneySettingsInfo };
    API[type](data)
      .then((res) => {
        if (res.data) {
          callback();
          message.success(`${title}成功`);
        }
      })
      .catch(console.log);
  };

  // 导出
  const onExport = async () => {
    const fileName = "薪资设置导入模板.xlsx";
    axios({
      method: "get",
      responseType: "blob",
      url: `${import.meta.env.VITE_PUBLIC_PATH}template/${fileName}`
    })
      .then((res) => onDownload(res.data, fileName))
      .catch(() => {});
  };

  // 上传导入
  const onImport = (file) => {
    const files = file.raw;
    if (!files) return message.warning("请选择文件");
    if (!/\.(xls|xlsx)$/.test(files.name.toLowerCase())) {
      message.warning("上传格式不正确，请上传xls或者xlsx格式");
      return false;
    } else {
      loading.value = true;
      const formData = new FormData();
      formData.append("files", files);
      uploadMoneySettingsInfo(formData)
        .then((res) => {
          if (res.data) message.success("导入成功");
        })
        .finally(() => (loading.value = false));
    }
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

  const onExport2 = () => {
    const headConfig = getExportConfig("薪资设置", columns.value, formData);
    moneySettingsExport(headConfig)
      .then((res) => {
        if (res.data) {
          const fileName = getFileNameOnUrlPath(res.data);
          downloadFile(res.data, fileName, true);
        } else {
          message.error("导出失败");
        }
      })
      .catch(console.log);
  };

  const onBeforeEdit = () => {
    if (JSON.stringify(currentRow.value) == "{}" || !currentRow.value) {
      ElMessage({ message: "请选择一条记录", type: "warning" });
      return;
    } else {
      onEdit();
    }
  };

  const rowClick = (row) => {
    currentRow.value = row;
  };

  const rowDbClick = (row) => {
    currentRow.value = row;
    onEdit();
  };

  function onSwitchTable() {
    isAgTable.value = !isAgTable.value;
    currentRow.value = undefined;
  }

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onBeforeEdit, type: "warning", text: "修改", isDropDown: false },
    {
      type: "primary",
      text: "导入",
      icon: Upload,
      disabled: false,
      isDropDown: true,
      uploadProp: { action: "#", accept: ".xls,.xlsx", autoUpload: false, multiple: true, onChange: onImport }
    },
    { clickHandler: onExport, type: "info", text: "下载模板", isDropDown: true },
    { clickHandler: onExport2, type: "info", text: "导出", isDropDown: true }
  ]);

  return {
    moneyRef,
    loading,
    columns,
    dataList,
    maxHeight,
    searchOptions,
    queryParams,
    pagination,
    buttonList,
    columnDefs,
    isAgTable,
    onRefresh,
    handleSizeChange,
    handleCurrentChange,
    onTagSearch,
    rowDbClick,
    rowClick,
    onSwitchTable
  };
};
