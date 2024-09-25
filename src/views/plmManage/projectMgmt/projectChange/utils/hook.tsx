import { h, onMounted, reactive, ref } from "vue";
import { type PaginationProps } from "@pureadmin/table";

import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { useEleHeight } from "@/hooks";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { ElMessage, ElMessageBox, formProps } from "element-plus";
import { formConfigs, formRules } from "./config";
import { addDialog } from "@/components/ReDialog";
import EditForm from "@/components/EditForm/index.vue";
import { utils, write } from "xlsx";
import { saveAs } from "file-saver";

import { PAGE_CONFIG } from "@/config/constant";
import { fetchProjectTemplateList } from "@/api/plmManage";
import { getDeptOptions } from "@/utils/requestApi";
import { getProductClassifyList } from "@/views/plmManage/productMgmt/classify/utils/hook";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const dataList = ref([]);
  const rowData = ref();
  const currentRow: any = ref({});
  const categoryOpts = ref([]);
  const taskTreeData = ref([]);

  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49 + 45);

  let formData: any = reactive({
    startTime: "",
    endTime: "",
    date: "",
    page: 1,
    limit: PAGE_CONFIG.pageSize,
    billNo: ""
  });

  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const searchOptions = reactive<SearchOptionType[]>([
    { label: "产品名称", value: "productName" },
    { label: "产品分类", value: "categoryName", children: [] },
    { label: "日期范围", value: "date", type: "daterange", format: "YYYY-MM-DD" }
  ]);

  onMounted(() => {
    getColumnConfig({ buttonList });
    fetchOpts();
    onSearch();
  });

  const fetchOpts = () => {
    getProductClassifyList({}).then((data) => {
      searchOptions[1].children = data
        .sort((a, b) => Date.parse(a.createDate) - Date.parse(b.createDate))
        .map((item) => ({ label: item.categoryName, value: item.categoryName }));
      categoryOpts.value = data.map((item) => ({ optionName: item.categoryName, optionValue: item.id }));
    });
  };

  const getColumnConfig = async (btns) => {
    let columnData: TableColumnList[] = [
      { label: "单据编号", prop: "billNo" },
      { label: "单据状态", prop: "billState" },
      { label: "产品名称", prop: "productName" },
      { label: "产品分类", prop: "categoryName" },
      { label: "立项日期", prop: "startDate" },
      { label: "项目模板", prop: "projectModel" },
      { label: "工期(天)", prop: "duration" },
      { label: "创建人", prop: "createUserName" },
      { label: "创建时间", prop: "createDate" }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) {
      columnData = data;
      updateButtonList(btns.buttonList, buttonArrs[0]);
    }

    columns.value = setColumn({ columnData, operationColumn: false });
  };

  const onSearch = () => {
    const { date = "" } = formData;
    const [startTime, endTime] = date ? date.split("~").map((item) => item.trim()) : [undefined, undefined];
    formData.startTime = startTime;
    formData.endTime = endTime;
    if (!date) formData.date = undefined;
    // fetchTaskStoreList(formData).then((res: any) => {
    //   const data = res.data;
    //   dataList.value = data.records || [];
    //   pagination.total = data.total;
    // });
    dataList.value = [];
  };

  const onFresh = () => {
    getColumnConfig(buttonList);
    onSearch();
  };

  const handleTagSearch = (values = {}) => {
    const { page, limit } = formData;
    Object.keys(values)?.forEach((key) => {
      formData[key] = values[key];
    });
    formData = { ...values };

    formData.page = page;
    formData.limit = limit;
    onSearch();
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

  // 导出单据
  const onExport = () => {
    const timeStep = Date.now();
    const workbook = utils.table_to_book(document.querySelector("#projectChangeTable"), {
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
      `项目变更${timeStep}.xlsx`
    );
  };

  const rowClick = (row) => {
    currentRow.value = row;
  };

  const onAdd = () => {
    openDialog("add");
  };

  const onEdit = () => {
    if (JSON.stringify(currentRow.value) === "{}") {
      ElMessage({ message: "请选择一条记录", type: "warning" });
    } else {
      openDialog("edit", currentRow.value);
    }
  };

  const onDelete = () => {
    if (JSON.stringify(currentRow.value) === "{}") {
      ElMessage({ message: "请选择一条记录", type: "warning" });
    } else {
      ElMessageBox.confirm(`确认要删除名称为【${currentRow.value.taskName}】的任务吗?`, "系统提示", {
        type: "warning",
        draggable: true,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          // delTaskStoreList({ id: currentRow.value.id }).then((res) => {
          //   if (res.data) {
          //     ElMessage({ message: `删除成功`, type: "success" });
          //     currentRow.value = {};
          //     onSearch();
          //   }
          // });
        })
        .catch(() => {});
    }
  };

  const openDialog = async (type: string, row?) => {
    const titleObj = { add: "新增", edit: "修改", view: "查看" };
    const title = titleObj[type];
    const formRef = ref();
    const projectModelOpts = ref([]);
    const deptSelectData = ref([]);

    const _formData = reactive({});

    fetchProjectTemplateList({ page: 1, limit: 100000 }).then((res: any) => {
      if (res.data) {
        const result = res.data.records?.map((item) => ({ optionName: item.projectModelName, optionValue: item.id }));
        projectModelOpts.value = result;
      }
    });

    getDeptOptions().then((data: any) => {
      deptSelectData.value = data;
    });

    addDialog({
      title: `${title}`,
      props: {
        formInline: _formData,
        formRules: formRules,
        formProps: { size: "small" },
        formConfigs: formConfigs({ categoryOpts, projectModelOpts, deptSelectData, _formData, taskTreeData })
      },
      width: "1000px",
      class: "project-change-modal",
      draggable: true,
      fullscreenIcon: true,
      hideFooter: type === "view",
      closeOnClickModal: false,
      okButtonText: "保存",
      cancelButtonText: "取消",
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();

        FormRef.validate(async (valid) => {
          if (valid) {
            ElMessageBox.confirm(`确认要${title}吗?`, "系统提示", {
              type: "warning",
              draggable: true,
              cancelButtonText: "取消",
              confirmButtonText: "确定",
              dangerouslyUseHTMLString: true
            }).then(() => {
              onSubmitChange(type, title, _formData, () => {
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
    console.log(data, "submit data.");

    // console.log(reqParams, "请求参数");
    // const APIs = { add: addTaskStoreList, edit: updateTaskStoreList };

    // APIs[type](reqParams).then((res) => {
    //   if (res.data) {
    //     ElMessage({ message: "保存成功", type: "success" });
    //     callback();
    //   }
    // });
  };

  const rowDbClick = (row) => {
    currentRow.value = row;
    onEdit();
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "新增", isDropDown: false },
    { clickHandler: onEdit, type: "warning", text: "修改", isDropDown: false },
    { clickHandler: onDelete, type: "danger", text: "删除", isDropDown: false },
    { clickHandler: onExport, type: "primary", text: "导出", isDropDown: true }
  ]);

  return {
    columns,
    dataList,
    maxHeight,
    pagination,
    searchOptions,
    buttonList,
    onFresh,
    handleTagSearch,
    onCurrentChange,
    handleSizeChange,
    rowClick,
    rowDbClick,
    handleCurrentChange
  };
};
