import { getEnumDictList, getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { h, onMounted, reactive, ref, watch } from "vue";

import { PAGE_CONFIG } from "@/config/constant";
import { PaginationProps } from "@pureadmin/table";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { addDialog } from "@/components/ReDialog";
import { message } from "@/utils/message";
import { useEleHeight } from "@/hooks";
import { getDeptOptions } from "@/utils/requestApi";
import EditForm from "@/components/EditForm/index.vue";
import { formConfigs, formRules } from "./config";

export const useConfig = () => {
  const columns = ref([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 95);
  const dataList = ref([]);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const treeSelectData = ref([]);
  const searchOptions = reactive<SearchOptionType[]>([
    { label: "单据编号", value: "billNo" },
    { label: "单据状态", value: "billState", children: [] },
    { label: "部门", value: "deptId", children: [] },
    { label: "日期范围", value: "date", type: "daterange", format: "YYYY-MM-DD", startKey: "startDate", endKey: "endDate" }
  ]);
  const currentRow = ref();
  const formData = reactive({ page: 1, limit: PAGE_CONFIG.pageSize });

  const getOpts = () => {
    getEnumDictList(["BillStatus"]).then((res) => {
      if (res) {
        searchOptions[1].children = res["BillStatus"].map((item) => ({ label: item.optionName, value: item.optionValue }));
      }
    });

    getDeptOptions().then((data) => {
      searchOptions[2].children = data;
    });
  };

  onMounted(() => {
    getOpts();
    getConfig(buttonList);
  });

  const getConfig = async (buttonList) => {
    let columnData: TableColumnList[] = [
      { label: "单据编号", prop: "billNo", width: 140 },
      { label: "单据状态", prop: "billState", width: 140 },
      { label: "部门", prop: "deptName", width: 140 },
      { label: "创建人", prop: "createUserName", width: 140 },
      { label: "创建时间", prop: "createDate", width: 140 },
      { label: "最后修改人", prop: "modifyUserName", width: 140 },
      { label: "最后修改时间", prop: "modifyDate", width: 140 }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [menuCols] = columnArrs;
    if (menuCols?.length) {
      columnData = menuCols;
    }
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false });
    return columnData;
  };

  const onFresh = () => {};

  const onAdd = () => {
    openDialog("add");
  };

  const openDialog = (type, row?) => {
    const title = { add: "新增", edit: "修改" }[type];
    const formRef = ref();
    const formLoading = ref(false);
    const _formData = reactive({ detailList: [] });

    const loadTableData = (tableData) => {
      _formData.detailList = tableData;
    };

    const updateLineTime = (time, idx) => (_formData.detailList[idx]["supCardTime"] = time);

    addDialog({
      title: `${title}`,
      props: {
        loading: formLoading,
        formInline: _formData,
        formRules: formRules,
        formConfigs: formConfigs({ searchOptions, loadTableData, _formData, updateLineTime })
      },
      width: "900px",
      draggable: true,
      class: "card-modal",
      fullscreenIcon: true,
      okButtonText: "保存",
      closeOnClickModal: false,
      hideFooter: type === "view",
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done) => {
        // const formIns = formRef.value.getRef();
        // formIns?.validate(async (valid) => {
        //   if (valid) {
        //     showMessageBox(`确认要${title}吗?`)
        //       .then(() => {
        //         onSubmitChange(type, title, _formData, () => {
        //           done();
        //           getTableList();
        //         });
        //       })
        //       .catch(console.log);
        //   }
        // });
        console.log(_formData, "_formData==");
        message.warning("接口未开发");
        done();
      }
    });
  };

  // const onSubmitChange = (type: string, title: string, data, callback) => {
  //   console.log(type, data);
  //   const apiType = { add: registerMachine, edit: updateMachine };
  //   apiType[type](data).then((res) => {
  //     if (res.data) {
  //       ElMessage({ message: `${title}成功`, type: "success" });
  //       callback();
  //     }
  //   });
  // };

  const onSearch = () => {
    pagination.total = 0;
    dataList.value = [];
  };

  const onEdit = () => {
    if (!currentRow.value) return message.warning("请选择记录");
    openDialog("edit", currentRow.value);
  };

  const handleTagSearch = (values) => {
    Object.assign(formData, values);
  };

  const onExport = () => {
    message.warning("接口未开发");
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

  const onDel = () => {
    if (!currentRow.value) return message.warning("请选择记录");
    message.warning("接口未开发");
    console.log("del", currentRow.value);
  };

  const onSubmit = () => {
    if (!currentRow.value) return message.warning("请选择记录");
    message.warning("接口未开发");
    console.log("submit", currentRow.value);
  };

  const rowClick = (row) => {
    currentRow.value = row;
  };

  const buttonList = ref([
    { clickHandler: onAdd, type: "primary", text: "新增", isDropDown: false },
    { clickHandler: onEdit, type: "warning", text: "修改", isDropDown: false },
    { clickHandler: onDel, type: "danger", text: "删除", isDropDown: false },
    { clickHandler: onSubmit, type: "success", text: "提交", isDropDown: false },
    { clickHandler: onExport, type: "info", text: "导出", isDropDown: true }
  ]);

  return { columns, onFresh, handleTagSearch, rowClick, searchOptions, buttonList, maxHeight, dataList, pagination, onSizeChange, onCurrentChange };
};
