import { onMounted, reactive, ref, h } from "vue";
import { type PaginationProps } from "@pureadmin/table";

import { ElMessage, ElMessageBox } from "element-plus";
import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import EditForm from "@/components/EditForm/index.vue";

import { useEleHeight } from "@/hooks";
import {
  deleteProjectTemplate,
  exportProjectGroupTemplate,
  fetchProjectSelectOpts,
  fetchProjectTemplateList,
  getBOMTableRowSelectOptions,
  insertProjectTemplateList
} from "@/api/plmManage";
import { addDialog } from "@/components/ReDialog";
import { formConfigs, formRules } from "./config";
import dayjs from "dayjs";
import { useRouter } from "vue-router";
import { PAGE_CONFIG } from "@/config/constant";
import { getProductClassifyList } from "@/views/plmManage/productMgmt/classify/utils/hook";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const columns2 = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const loading2 = ref<boolean>(false);
  const dataList = ref([]);
  const dataList2: any = ref([]);
  const rowData = ref();
  const productCategoryIdList = ref([]);
  const currentLeftRow: any = ref({});
  const durationUnitOpts: any = ref([]);
  const projectSelectOpts: any = ref([]);
  const classList: any = ref([]);
  const canDelDeptIds = ref([]);

  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49 + 52);
  const tableSelectedList = ref([]);
  const router = useRouter();

  let formData: any = reactive({
    projectModelName: "",
    projectModelCode: "",
    page: 1,
    limit: PAGE_CONFIG.pageSize
  });

  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const searchOptions: any[] = reactive([{ label: "模板名称", value: "projectModelName" }]);

  const fetchOpts = () => {
    getBOMTableRowSelectOptions({
      optioncode: "ProjectCycleUnits,ProjectModelDeleteAuth"
    }).then((res) => {
      if (res.data) {
        const durationOpts = res.data.find((item) => item.optionCode === "ProjectCycleUnits")?.optionList || [];
        durationUnitOpts.value = durationOpts;
        const canDelDeptIdArr =
          res.data
            .find((item) => item.optionCode === "ProjectModelDeleteAuth")
            ?.optionList?.map((item) => +item.optionValue)
            ?.filter(Boolean) || [];
        canDelDeptIds.value = canDelDeptIdArr;
      }
    });

    fetchProjectSelectOpts({}).then((res) => {
      if (res.data) {
        console.log(res.data, "项目阶段返回");
        projectSelectOpts.value = res.data;
      }
    });

    getProductClassifyList({ page: 1, limit: 10000 }).then((data) => (classList.value = data));
  };

  onMounted(() => {
    getColumnConfig(buttonList);

    fetchOpts();
    onSearch();
  });

  const getColumnConfig = async (buttonList) => {
    let columnData: TableColumnList[] = [
      { label: "", prop: "", align: "center", width: 40, slot: "choice" },
      { label: "序号", type: "index", prop: "index", width: 60, align: "center", headerAlign: "center" },
      { label: "模板编号", prop: "projectModelCode", minWidth: 130 },
      { label: "模板名称", prop: "projectModelName", minWidth: 180 },
      { label: "项目阶段", prop: "projectStageName", minWidth: 180 },
      { label: "工期(天)", prop: "duration", minWidth: 180 },
      { label: "状态", prop: "state", minWidth: 120, slot: "state" },
      { label: "创建人", prop: "createUser" },
      {
        label: "创建时间",
        prop: "createDate",
        width: 250,
        cellRenderer(data: any) {
          return <span>{data.row.createDate ? dayjs(data.row.createDate).format("YYYY-MM-DD HH:mm:ss") : ""}</span>;
        }
      },
      { label: "修改人", prop: "updateUser", width: 150 },
      {
        label: "修改时间",
        prop: "modifyDate",
        width: 250,
        cellRenderer(data: any) {
          return <span>{data.row.modifyDate ? dayjs(data.row.modifyDate).format("YYYY-MM-DD HH:mm:ss") : ""}</span>;
        }
      }
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
    fetchProjectTemplateList(formData)
      .then((res: any) => {
        const data = res.data;
        loading.value = false;
        dataList.value = data.records || [];
        pagination.total = data.total;
      })
      .catch((err) => (loading.value = false));
  };

  const onFresh = () => {
    getColumnConfig(buttonList);
    onSearch();
  };

  const onSearch2 = () => {
    getColumnConfig2();
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

  // 添加单据
  const onAdd = () => {
    openDialog("add");
  };

  const openDialog = async (type: string, row?) => {
    const titleObj = { add: "新增", edit: "修改" };
    const title = titleObj[type];
    const formRef = ref();

    const _formData = reactive({});

    addDialog({
      title: `${title}项目模板`,
      props: {
        formInline: _formData,
        formRules: formRules,
        formConfigs: formConfigs({ selectOpts: projectSelectOpts, classList })
      },
      width: "400px",
      draggable: true,
      fullscreenIcon: true,
      okButtonText: "保存",
      cancelButtonText: "关闭",
      closeOnClickModal: false,
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
    console.log(data, "submitData");

    if (type === "add") {
      data.state = 0;
      data.duration = 0;
    }

    const API = { add: insertProjectTemplateList };
    API[type](data)
      .then((res) => {
        if (res.data && res.data.id) {
          callback();
          router.push("/plmManage/projectMgmt/projectTemplate/edit/index?id=" + res.data.id);
        }
      })
      .catch(console.log);
  };

  // 多选表格行
  const handleSelectionChange = (row) => {
    tableSelectedList.value = row;
  };

  const onEdit = () => {
    if (JSON.stringify(currentLeftRow.value) === "{}") {
      ElMessage({ message: "请选择记录", type: "warning" });
      return;
    }
    router.push("/plmManage/projectMgmt/projectTemplate/edit/index?id=" + currentLeftRow.value.id);
  };

  const onDelete = () => {
    if (JSON.stringify(currentLeftRow.value) !== "{}") {
      const row = currentLeftRow.value;
      ElMessageBox.confirm(`确认要删除名称为【${row.projectModelName}】的项目模板吗?`, "系统提示", {
        type: "warning",
        draggable: true,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          loading.value = true;
          deleteProjectTemplate({ id: row.id }).then((res) => {
            if (res.data) {
              ElMessage({ message: `删除成功`, type: "success" });
              currentLeftRow.value = {};
              onSearch();
            }
          });
        })
        .catch(() => {})
        .finally(() => (loading.value = false));
    } else {
      ElMessage({ message: `请选择记录`, type: "warning" });
    }
  };
  const onExport = async () => {
    loading.value = true;
    const calcHeader = columns.value
      .map((item, index) => {
        return { field: item.prop, title: item.label, width: 160, key: `0-${index}`, hide: false, colspan: 1, rowspan: 1, type: "normal", colGroup: false };
      })
      .filter((el) => el.field && el.field !== "index");

    const headConfig = {
      excelName: "项目模板",
      excelHeader: JSON.stringify(calcHeader)
    };

    exportProjectGroupTemplate(headConfig)
      .then((res: any) => {
        window.open("/api" + res.data, "_blank");
      })
      .catch((err) => {
        console.log("err", err);
      })
      .finally(() => (loading.value = false));
  };

  const leftRowDbClick = (row) => {
    router.push("/plmManage/projectMgmt/projectTemplate/edit/index?id=" + row.id);
  };

  const removeTag = () => {
    onSearch();
  };

  const leftRowClick = (row) => {
    currentLeftRow.value = row;
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "新增" },
    { clickHandler: onEdit, type: "warning", text: "修改" },
    { clickHandler: onDelete, type: "danger", text: "删除" },
    { clickHandler: onExport, type: "info", text: "导出", isDropDown: true }
  ]);

  return {
    loading,
    loading2,
    columns,
    columns2,
    dataList,
    dataList2,
    maxHeight,
    pagination,
    searchOptions,
    onSearch,
    onFresh,
    onSearch2,
    onAdd,
    onEdit,
    onDelete,
    onExport,
    buttonList,
    handleTagSearch,
    onCurrentChange,
    handleSizeChange,
    leftRowDbClick,
    removeTag,
    leftRowClick,
    handleCurrentChange,
    handleSelectionChange,
    productCategoryIdList
  };
};
