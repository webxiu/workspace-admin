import { fetchArrangeMgmtRecord, queryArrangeMgmtRecord, updateArrangeMgmtRecordBulk, updateArrangeMgmtRecord } from "@/api/oaManage/humanResources";
import { getMenuColumns, setColumn, updateButtonList, usePageSelect } from "@/utils/table";
import { h, onMounted, reactive, ref } from "vue";
import { message, showMessageBox } from "@/utils/message";

import type { ColDef } from "ag-grid-community";
import { FormItemConfigType } from "@/utils/form";
import { LoadingType } from "@/components/ButtonList/index.vue";
import { PAGE_CONFIG } from "@/config/constant";
import { PaginationProps } from "@pureadmin/table";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import TableEditList from "@/components/TableEditList/index.vue";
import { addDialog } from "@/components/ReDialog";
import { dayjs } from "element-plus";
import { getAgGridColumns } from "@/components/AgGridTable/config";
import { getDeptOptions } from "@/utils/requestApi";
import { useEleHeight } from "@/hooks";

export const useMachine = () => {
  const isAgTable = ref(true);
  const columnDefs = ref<ColDef[]>([]);
  const dataList = ref([]);
  const columns = ref<TableColumnList[]>([]);
  const loading = ref(false);
  const currentRow = ref();
  const loadingStatus = ref<LoadingType>({ loading: false, text: "" });
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 95);
  const formData: any = reactive({ page: 1, limit: PAGE_CONFIG.pageSize });
  const tableRef = ref();
  const rowsData = ref([]);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const searchOptions = reactive<SearchOptionType[]>([
    { label: "工号", value: "staffCode" },
    { label: "部门", value: "deptId", children: [] },
    { label: "排班日期", value: "date", type: "daterange", format: "YYYY-MM-DD", startKey: "startDate", endKey: "endDate" }
  ]);

  const nowDate = dayjs().format("YYYY-MM-DD");

  const queryParams = reactive({ date: `${nowDate} ~ ${nowDate}` });

  const { setSelectCheckbox, setSelectChange, setSelectAllChange } = usePageSelect({ tableRef, dataList, rowsData, uniId: "id" });

  onMounted(() => {
    getColumnConfig();
    getOptions();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "工号", prop: "staffCode" },
      { label: "姓名", prop: "staffName" },
      { label: "部门", prop: "deptName" },
      { label: "排班日期", prop: "schedulingDate" },
      { label: "上午上班", prop: "morningWorkTime" },
      { label: "上午下班", prop: "morningDownWorkTime" },
      { label: "下午上班", prop: "afternoonWorkTime" },
      { label: "下午下班", prop: "afternoonDownWorkTime" }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [menuCols] = columnArrs;
    if (menuCols?.length) columnData = menuCols;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false, selectionColumn: { hide: false }, radioColumn: { hide: true } });
    columnDefs.value = getAgGridColumns({ formData, columnData, operationColumn: false, selectionColumn: { hide: false }, radioColumn: { hide: true } });

    return columnData;
  };

  const getOptions = () => {
    getDeptOptions().then((data) => {
      searchOptions[1].children = data[0].children;
    });
  };

  const getTableList = () => {
    fetchArrangeMgmtRecord(formData).then((res: any) => {
      if (res.data) {
        dataList.value = res.data.records || [];
        pagination.total = res.data.total;
        setSelectCheckbox();
      }
    });
  };

  const onFresh = () => {
    getColumnConfig();
    getTableList();
  };

  const onTagSearch = (values) => {
    Object.assign(formData, values);
    getTableList();
  };

  const onExport = () => {
    message.warning("接口未开发");
  };

  const openDialog = async (type: "add" | "view" | "edit", rows?) => {
    const rowObj = rows.at(-1);
    const title = { add: "新增", edit: "修改" }[type];
    const formRef = ref();
    const _formData = reactive({});

    queryArrangeMgmtRecord({ id: rowObj.id }).then((res) => {
      if (res.data) {
        Object.keys(rowObj).forEach((el) => {
          if (el === "deptId") {
            console.log(res.data[el]);
            _formData[el] = res.data[el] + "";
          } else {
            _formData[el] = res.data[el];
          }
        });
      }
    });

    const formConfig: FormItemConfigType[] = [{ formData: _formData, formProps: { labelWidth: "80px" } }];

    addDialog({
      title: `${title}`,
      props: {
        params: { groupCode: "1" },
        formConfig: formConfig
      },
      width: "400px",
      draggable: true,
      fullscreenIcon: true,
      okButtonText: "保存",
      closeOnClickModal: false,
      hideFooter: type === "view",
      contentRenderer: () => h(TableEditList, { ref: formRef }),
      beforeSure: (done) => {
        formRef.value.getRef().then(({ valid, data }) => {
          if (valid) {
            showMessageBox(`确认要${title}吗?`)
              .then(() => {
                if (rows.length > 1) {
                  onSubmitChangeBulk(type, title, _formData, () => {
                    done();
                    getTableList();
                  });
                }
                else{
                  onSubmitChange(type, title, _formData, () => {
                    done();
                    getTableList();
                  });
                }
              })
              .catch(console.log);
          }
        });
      }
    });
  };

  const onSubmitChange = (type: string, title: string, data, callback) => {
    const apiType = { edit: updateArrangeMgmtRecord };
    const reqParams = rowsData.value
      .map((item) => ({
        ...item,
        afternoonDownWorkTime: data.afternoonDownWorkTime,
        afternoonWorkTime: data.afternoonWorkTime,
        morningDownWorkTime: data.morningDownWorkTime,
        morningWorkTime: data.morningWorkTime
      }))
      .at(-1);
    if (!rowsData.value.length) return message.warning("请选择记录");
    apiType[type](reqParams).then((res) => {
      if (res.data) {
        message.success(`${title}成功`);
        callback();
      }
    });
  };

  const onSubmitChangeBulk = (type: string, title: string, data, callback) => {
    console.log(rowsData);
    const apiType = { edit: updateArrangeMgmtRecordBulk };
    const reqParams = rowsData.value
      .map((item) => ({
        ...item,
        afternoonDownWorkTime: data.afternoonDownWorkTime,
        afternoonWorkTime: data.afternoonWorkTime,
        morningDownWorkTime: data.morningDownWorkTime,
        morningWorkTime: data.morningWorkTime
      }));
    
    console.log(apiType);
    console.log(reqParams);
    if (!rowsData.value.length) return message.warning("请选择记录");
    apiType[type](reqParams).then((res) => {
      if (res.data) {
        message.success(`${title}成功`);
        callback();
      }
    });
  };  

  const onEdit = () => {
    if (!rowsData.value.length) {
      message.warning("请选择一条记录");
      return;
    }
    openDialog("edit", rowsData.value);
  };


  const rowDbclick = (row) => {
    onEdit();
    onSelectAll([row]);
  };
  const rowClick = (row) => {
    currentRow.value = row;
  };

  function onSelect(rows, row) {
    setSelectChange({ rows, row });
  }

  function onSelectAll(rows) {
    setSelectAllChange(rows);
  }

  // 分页相关
  function onSizeChange(val: number) {
    formData.limit = val;
    getTableList();
  }

  function onCurrentChange(val: number) {
    formData.page = val;
    getTableList();
  }

  function onSwitchTable() {
    isAgTable.value = !isAgTable.value;
    currentRow.value = undefined;
    rowsData.value = [];
  }

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onEdit, type: "warning", text: "修改", isDropDown: false },
    { clickHandler: onExport, type: "primary", text: "导出", isDropDown: false }
  ]);
  return {
    columnDefs,
    isAgTable,
    tableRef,
    loading,
    columns,
    dataList,
    maxHeight,
    pagination,
    queryParams,
    buttonList,
    searchOptions,
    loadingStatus,
    onFresh,
    rowClick,
    rowDbclick,
    onSelect,
    onSelectAll,
    onTagSearch,
    onSizeChange,
    onCurrentChange,
    onSwitchTable
  };
};
