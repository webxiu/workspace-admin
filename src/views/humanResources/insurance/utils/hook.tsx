import { onMounted, reactive, ref, h, watchEffect } from "vue";
import { type PaginationProps } from "@pureadmin/table";
import { getDeptOptions } from "@/utils/requestApi";
import { Plus, Delete, Upload } from "@element-plus/icons-vue";

import { setColumn, getMenuColumns, updateButtonList, usePageSelect, getChildDeptIds } from "@/utils/table";

import { useEleHeight } from "@/hooks";
import { addDialog } from "@/components/ReDialog";
import { message, showMessageBox } from "@/utils/message";
import dayjs from "dayjs";
import EditForm from "@/components/EditForm/index.vue";
import { SearchOptionType, QueryParamsType } from "@/components/BlendedSearch/index.vue";
import { PAGE_CONFIG } from "@/config/constant";
import { deleteHrMoney, fetchHrMoneyPageList, importHrMoney, updateHrMoney } from "@/api/oaManage/humanResources";
import TableEditList from "@/components/TableEditList/index.vue";
import { FormItemConfigType } from "@/utils/form";
import { formConfigs1, formRules1, updateItem } from "./config";

export const useConfig = () => {
  const tableRef = ref();
  const treeData = ref([]);
  const currentRow = ref();
  const loading = ref<boolean>(false);
  const columns = ref<TableColumnList[]>([]);
  const rowData = ref<any>();
  const rowsData = ref<any[]>([]);
  const dataList = ref<any[]>([]);
  const yearMonthStr = dayjs(new Date()).add(-1, "month").format("YYYY-MM");

  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49 + 52);

  enum UserType {
    employee = "员工",
    clerk = "职员"
  }
  const formData = reactive({
    month: +yearMonthStr?.split("-")[1],
    year: +yearMonthStr?.split("-")[0],
    userType: UserType.employee,
    yearMonth: yearMonthStr,
    staffName: "",
    staffCode: "",
    deptId: "",
    deptIdList: [],
    page: 1,
    limit: PAGE_CONFIG.pageSize
  });

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "工号", value: "staffCode" },
    { label: "日期", value: "yearMonth", type: "month", format: "YYYY-MM" },
    {
      label: "核算标准",
      value: "userType",
      children: [
        { label: "员工", value: UserType.employee },
        { label: "职员", value: UserType.clerk }
      ]
    },
    { label: "部门", value: "deptId", children: [] }
  ]);

  const queryParams = reactive<QueryParamsType>({
    yearMonth: yearMonthStr,
    userType: { value: "员工", valueLabel: UserType.employee }
  });
  const { setSelectCheckbox, setSelectChange, setSelectAllChange } = usePageSelect({ tableRef, dataList, rowsData, uniId: "id" });

  onMounted(() => {
    getColumnConfig();
    getOptions();
    onSearch();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "日期", prop: "yearMonth" },
      { label: "工号", prop: "staffCode" },
      { label: "姓名", prop: "staffName" },
      { label: "身份证号", prop: "idCard", minWidth: 220 },
      { label: "部门", prop: "deptName" },
      { label: "入职日期", prop: "startDate" },
      { label: "养老保险", prop: "oldInsurance" },
      { label: "医疗保险", prop: "hospitalInsurance" },
      { label: "失业保险", prop: "sybx" },
      { label: "住房公积金", prop: "housingFund" }
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, selectionColumn: { hide: false }, radioColumn: { width: 50 }, operationColumn: false });
    return columnData;
  };

  const getOptions = () => {
    getDeptOptions().then((data: any) => {
      treeData.value = data;
      searchOptions[3].children = data;
    });
  };

  const handleTagSearch = (values: any) => {
    Object.assign(formData, values);
    formData.year = +values.yearMonth?.split("-")[0];
    formData.month = +values.yearMonth?.split("-")[1];
    formData.deptIdList = getChildDeptIds(treeData.value, values.deptId);
    onSearch();
  };

  const onSearch = (idx?) => {
    fetchHrMoneyPageList(formData).then((res: any) => {
      const data = res.data;
      dataList.value = data.records || [];
      pagination.total = data.total;

      if (typeof idx === "number" && idx >= 0) {
        currentRow.value = dataList.value[idx];
      } else {
        currentRow.value = null;
      }
      setSelectCheckbox();
    });
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

  const onCurrentChange = (row: any) => {
    if (!row) return;
    rowData.value = row;
  };

  const onDownload = async () => {
    message.warning("暂无模版");
    // return axios({
    //   method: "get",
    //   responseType: "blob",
    //   url: `${import.meta.env.VITE_PUBLIC_PATH}template/其他调整模板.xlsx`
    // })
    //   .then(({ data }) => CommonUtils.onDownload(data, "其他调整模板.xlsx"))
    //   .catch(() => {});
  };

  const onDelete = (rows: any[]) => {
    const ids = rows.map((item) => item.id);
    deleteHrMoney({ ids, yearMonth: formData.yearMonth }).then((res) => {
      if (res.data) {
        message.success("删除成功!");
        currentRow.value = null;
        const _rowIndex = dataList.value.findIndex((item) => item.id === currentRow.value?.id);
        onSearch(_rowIndex);
      }
    });
  };

  // 批量删除
  const onDeleteAll = () => {
    if (rowsData.value.length === 0) {
      return message.error("请选择要删除的记录");
    }
    showMessageBox(`确认删除选中的记录吗？`)
      .then(() => onDelete(rowsData.value))
      .catch(console.log);
  };

  const onExport = () => {
    message.warning("接口未开发");
    // exportOtherAdjustmentSheetDetail({ ...formData }).then((res: any) => {
    //   if (res.data) {
    //     const fileName = getFileNameOnUrlPath(res.data);
    //     downloadFile(res.data, fileName, true);
    //   }
    // });
  };

  const rowClick = (row) => {
    currentRow.value = row;
  };

  const onDbClick = (row) => {
    row.deptId = +row.deptId;
    currentRow.value = row;
    onEditAction();
  };

  function onSelect(rows: any[], row: any) {
    setSelectChange({ rows, row });
  }

  function onSelectAll(rows: any[]) {
    setSelectAllChange(rows);
  }

  const openDialog = async (type: "add" | "view" | "edit", row?) => {
    const title = { add: "新增", edit: "修改", view: "查看" }[type];
    const formRef = ref();
    const _formData = reactive({
      id: row?.id ?? "",
      staffCode: row?.staffCode ?? "",
      staffName: row?.staffName ?? "",
      deptId: row?.deptId ? row?.deptId + "" : "",
      yearMonth: row?.yearMonth ?? "",
      idCard: row?.idCard ?? "",
      startDate: row?.startDate ?? "",
      oldInsurance: row?.oldInsurance,
      hospitalInsurance: row?.hospitalInsurance,
      unemploymentInsurance: row?.unemploymentInsurance,
      reserveFund: row?.reserveFund
    });

    const formConfig: FormItemConfigType[] = [
      {
        formData: _formData,
        formProps: { labelWidth: "80px", size: "small" }
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
      okButtonText: "保存",
      class: "insurance-modal",
      closeOnClickModal: false,
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
                  onSearch();
                });
              })
              .catch(console.log);
          }
        });
      }
    });
  };

  const onSubmitChange = (type: string, title: string, data, callback) => {
    const apiType = { edit: updateHrMoney };

    apiType[type](data).then((res) => {
      if (res.data) {
        message.success(title + "成功");
        callback();
      }
    });
  };

  const onEditAction = () => {
    if (!currentRow.value) return message.warning("请选择单据");
    openDialog("edit", currentRow.value);
    console.log("edit..");
  };

  const openImportDialog = async (type: string, row?) => {
    const titleObj = { add: "选择导入类型", edit: "修改" };
    const title = titleObj[type];
    const formRef = ref();

    const addFormData = reactive({
      yearMonth: dayjs(new Date()).add(-1, "month").format("YYYY-MM"),
      choose: "社保",
      row: "4",
      cardCol: "C",
      reserveFundCol: "0",
      deptCol: "",
      oldInsuranceCol: "M",
      hospitalInsuranceCol: "O",
      unemploymentInsuranceCol: "AK"
    });

    addDialog({
      title: `${title}`,
      props: {
        formInline: addFormData,
        formRules: formRules1,
        formProps: { labelWidth: 90 },
        formConfigs: formConfigs1(addFormData)
      },
      width: "600px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const { choose, file, yearMonth, ...reset } = addFormData as any;
        updateItem({ [choose]: reset }); // 存储提交过的数据
        const FormRef = formRef.value.getRef();
        FormRef.validate(async (valid) => {
          if (valid) {
            showMessageBox("确认要导入吗?")
              .then(() => {
                onSubmitImportChange(type, title, addFormData, () => {
                  done();
                  const _rowIndex = dataList.value.findIndex((item) => item.id === currentRow.value?.id);
                  onSearch(_rowIndex);
                });
              })
              .catch(console.log);
          }
        });
      }
    });
  };

  const onSubmitImportChange = (type: string, title: string, data, callback) => {
    const reqFormData = {
      ...data,
      year: +data.yearMonth.split("-")[0],
      month: +data.yearMonth.split("-")[1]
    };

    delete reqFormData.file;

    const reqParams = new FormData();
    reqParams.append("files", data.file);
    reqParams.append("param", JSON.stringify(reqFormData));

    importHrMoney(reqParams).then((res) => {
      if (res.status === 200) {
        message.success("导入成功");
        callback();
      }
    });
  };

  const onImportAction = () => {
    openImportDialog("add");
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onEditAction, type: "warning", text: "修改" },
    { clickHandler: onDeleteAll, type: "danger", text: "批量删除" },
    { clickHandler: onDownload, type: "info", text: "下载模板", isDropDown: true },
    { clickHandler: onImportAction, type: "info", text: "导入", isDropDown: true },
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
    onDelete,
    onSearch,
    handleTagSearch,
    onCurrentChange,
    handleSizeChange,
    onSelect,
    onSelectAll,
    rowClick,
    onDbClick,
    handleCurrentChange
  };
};
