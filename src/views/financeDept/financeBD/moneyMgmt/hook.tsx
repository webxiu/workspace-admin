import { downloadFile, getFileNameOnUrlPath } from "@/utils/common";
import { formConfigs, formRules } from "./configs";
import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { h, onMounted, reactive, ref } from "vue";
import { message, showMessageBox } from "@/utils/message";
import EditForm from "@/components/EditForm/index.vue";
import { PAGE_CONFIG } from "@/config/constant";
import { PaginationProps } from "@pureadmin/table";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { addDialog } from "@/components/ReDialog";
import dayjs from "dayjs";
import { useEleHeight } from "@/hooks";
import { deleteMoneyClassList, exportMoneyClassList, fetchMoneyClassList, insertMoneyClassList, updateMoneyClassList } from "@/api/oaManage/financeDept";
import TableEditList from "@/components/TableEditList/index.vue";
import { CustomPropsType } from "@/utils/form";
import { cloneDeep } from "@pureadmin/utils";

export const useMachine = () => {
  const dataList = ref([]);
  const columns = ref<TableColumnList[]>([]);
  const curRow = ref();
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 95);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });

  const formData: any = reactive({
    page: 1,
    limit: PAGE_CONFIG.pageSize
  });

  const nowDate = dayjs().format("YYYY-MM-DD");

  const queryParams = reactive({ date: `${nowDate} ~ ${nowDate}` });

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "币种名称", value: "currencyName" },
    {
      label: "自动采集汇率",
      value: "automaticExchangeRates",
      children: [
        { label: "是", value: true },
        { label: "否", value: false }
      ]
    },
    {
      label: "本位币",
      value: "standardCurrency",
      children: [
        { label: "是", value: true },
        { label: "否", value: false }
      ]
    },
    { label: "日期范围", value: "date", type: "daterange", format: "YYYY-MM-DD", startKey: "startDate", endKey: "endDate" }
  ]);

  onMounted(() => {
    getColumnConfig();
    onSearch();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "币种编号", prop: "currencyNumber" },
      { label: "币种名称", prop: "currencyName" },
      { label: "自动采集汇率", prop: "automaticExchangeRates" },
      { label: "本位币", prop: "standardCurrency" },
      { label: "创建人", prop: "createUserName" },
      { label: "创建时间", prop: "createDate" },
      { label: "最后修改人", prop: "modifyUserName" },
      { label: "最后修改时间", prop: "modifyDate" }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [menuCols] = columnArrs;
    if (menuCols?.length) columnData = menuCols;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false });
    return columnData;
  };

  const onSearch = () => {
    fetchMoneyClassList(formData).then((res: any) => {
      if (res.data) {
        dataList.value = res.data.records || [];
        pagination.total = res.data.total;
      }
    });
  };

  const onFresh = () => {
    getColumnConfig();
    onSearch();
  };

  const handleTagSearch = (values) => {
    Object.assign(formData, values);
    onSearch();
  };

  const onExport = () => {
    exportMoneyClassList({ ...formData, limit: 1000000 }).then((res: any) => {
      if (res.data) {
        const fileName = getFileNameOnUrlPath(res.data);
        downloadFile(res.data, fileName);
      }
    });
  };

  const openDialog = async (type: "add" | "view" | "edit", row?) => {
    const title = { add: "新增", edit: "修改" }[type];
    const formRef = ref();
    const _formData = reactive({
      id: row?.id ?? "",
      currencyNumber: row?.currencyNumber ?? "",
      currencyName: row?.currencyName ?? "",
      automaticExchangeRates: row ? [row?.automaticExchangeRates] : undefined,
      standardCurrency: row ? [row?.standardCurrency] : undefined,
      createUserName: row?.createUserName,
      createDate: row?.createDate,
      modifyUserName: row?.modifyUserName,
      modifyDate: row?.modifyDate
    });

    const commonDictList = [{ optionName: "", optionValue: true }];

    addDialog({
      title: `${title}币种`,
      props: {
        params: { groupCode: "1" },
        formConfig: [
          { formData: _formData, dataOption: { automaticExchangeRates: commonDictList, standardCurrency: commonDictList }, formProps: { labelWidth: "120px" } }
        ]
      },
      width: "800px",
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
    const apiType = { edit: updateMoneyClassList, add: insertMoneyClassList };
    const reqData = cloneDeep(data);
    reqData.automaticExchangeRates = reqData.automaticExchangeRates.at(-1) ?? false;
    reqData.standardCurrency = reqData.standardCurrency.at(-1) ?? false;
    apiType[type](reqData).then((res) => {
      if (res.data) {
        message.success(title + "成功");
        callback();
      }
    });
  };

  const onEdit = () => {
    if (!curRow.value) return message.warning("请选择一条记录");
    openDialog("edit", curRow.value);
  };

  const onAdd = () => {
    openDialog("add");
  };

  const onDel = () => {
    if (!curRow.value) return message.warning("请选择一条记录");
    showMessageBox(`确认要删除名称为【${curRow.value.currencyName}】的币种吗?`)
      .then(() => {
        deleteMoneyClassList({ id: curRow.value.id }).then((res) => {
          if (res.data || res.status === 200) {
            message.success("删除成功");
            curRow.value = null;
            onSearch();
          }
        });
      })
      .catch(console.log);
  };

  const buttonList = ref([
    { clickHandler: onAdd, type: "primary", text: "新增", isDropDown: false },
    { clickHandler: onEdit, type: "warning", text: "修改", isDropDown: false },
    { clickHandler: onDel, type: "danger", text: "删除", isDropDown: false },
    { clickHandler: onExport, type: "info", text: "导出", isDropDown: true }
  ]);

  // 分页相关
  function onSizeChange(val: number) {
    formData.limit = val;
    onSearch();
  }

  function onCurrentChange(val: number) {
    formData.page = val;
    onSearch();
  }

  const rowClick = (row) => {
    curRow.value = row;
  };

  const rowDbClick = (row) => {
    curRow.value = row;
    onEdit();
  };

  return {
    columns,
    onFresh,
    queryParams,
    rowClick,
    handleTagSearch,
    searchOptions,
    buttonList,
    maxHeight,
    dataList,
    pagination,
    rowDbClick,
    onSizeChange,
    onCurrentChange
  };
};
