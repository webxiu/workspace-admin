import { onMounted, reactive, ref, h } from "vue";
import { type PaginationProps } from "@pureadmin/table";
import { utils, write } from "xlsx";
import { saveAs } from "file-saver";

import { setColumn, getMenuColumns, updateButtonList, usePageSelect } from "@/utils/table";
import EditForm from "@/components/EditForm/index.vue";

import { useEleHeight } from "@/hooks";
import { addDialog } from "@/components/ReDialog";
import { formConfigs, formConfigs2, formRules, formRules2 } from "./config";
import { message, showMessageBox } from "@/utils/message";
import dayjs from "dayjs";

import { SearchOptionType, QueryParamsType } from "@/components/BlendedSearch/index.vue";
import { getFileNameOnUrlPath, downloadFile } from "@/utils/common";
import { PAGE_CONFIG } from "@/config/constant";
import {
  deleteMealCostManage,
  updateMealCostManage,
  exportMealCostManage,
  mealCostManageList,
  importMealCostManage,
  MealCostManageListItemType
} from "@/api/oaManage/humanResources";
import { ElMessage } from "element-plus";

export const useConfig = () => {
  const tableRef = ref();
  const loading = ref<boolean>(false);
  const columns = ref<TableColumnList[]>([]);
  const rowDatas = ref<MealCostManageListItemType[]>([]);
  const dataList = ref<MealCostManageListItemType[]>([]);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49 + 52);
  const lastMonth = dayjs().add(-1, "month").startOf("month").format("YYYY-MM");

  const formData = reactive({
    page: 1,
    staffName: "",
    staffCode: "",
    yearMonth: lastMonth,
    limit: PAGE_CONFIG.pageSize
  });

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "姓名", value: "staffName" },
    { label: "工号", value: "staffCode" },
    { label: "年月", value: "yearMonth", type: "month", format: "YYYY-MM" }
  ]);

  const queryParams = reactive<QueryParamsType>({ yearMonth: lastMonth });
  const { setSelectCheckbox, setSelectChange, setSelectAllChange } = usePageSelect({ tableRef, dataList, rowsData: rowDatas, uniId: "id" });

  onMounted(() => {
    getColumnConfig();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "年月", prop: "yearMonth", minWidth: 140 },
      { label: "工号", prop: "staffCode", minWidth: 140 },
      { label: "姓名", prop: "staffName", minWidth: 140 },
      { label: "金额", prop: "mealTicket", minWidth: 140, align: "right" },
      { label: "备注", prop: "remark", minWidth: 140 }
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({
      columnData,
      selectionColumn: { hide: false },
      operationColumn: false,
      radioColumn: { hide: true }
    });
    return columnData;
  };

  const onTagSearch = (values) => {
    Object.assign(formData, values);
    onSearch();
  };

  const onSearch = () => {
    loading.value = true;
    mealCostManageList(formData)
      .then(({ data }) => {
        loading.value = false;
        dataList.value = data.records || [];
        pagination.total = data.total;
        setSelectCheckbox();
      })
      .catch((err) => (loading.value = false));
  };

  const onEdit = (row) => openDialog("edit", row);
  const onImport = () => openDialog("import");

  const openDialog = async (type: "import" | "edit", row?: MealCostManageListItemType) => {
    const title = { import: "导入", edit: "修改" }[type];
    const formRef = ref();
    // 修改
    const _formData = reactive({
      id: row?.id ?? "",
      staffCode: row?.staffCode ?? "",
      staffName: row?.staffName ?? "",
      mealTicket: row?.mealTicket ?? "",
      remark: row?.remark ?? "",
      yearMonth: row?.yearMonth ?? ""
    });

    // 导入
    const importFormData = reactive({
      dataStartRow: "3",
      // staffCodeCol: "2",
      nameCol: "2",
      moneyCol: "3",
      remarkCol: "4",
      yearMonth: lastMonth,
      file: ""
    });

    const formInline = type === "import" ? importFormData : _formData;

    addDialog({
      title: title,
      props: {
        formInline: formInline,
        formRules: type === "import" ? formRules2 : formRules,
        formConfigs: type === "import" ? formConfigs2() : formConfigs()
      },
      width: type === "import" ? "400px" : "650px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.validate(async (valid) => {
          if (valid) {
            showMessageBox(`确认要${title}吗?`).then(() => {
              onSubmitChange(type, title, formInline, () => {
                done();
                onSearch();
              });
            });
          }
        });
      }
    });
  };

  const onSubmitChange = (type: "import" | "edit", title: string, data, callback) => {
    if (type === "import") {
      const { file, ...reset } = data;
      const fData = new FormData();
      fData.append("files", file);
      fData.append("param", JSON.stringify(reset));
      importMealCostManage(fData).then((res) => {
        if (data) {
          callback();
          message(`${title}成功`);
        } else {
          message(`${title}失败`, { type: "error" });
        }
      });
      return;
    }
    updateMealCostManage(data)
      .then(({ data }) => {
        if (data) {
          callback();
          message(`${title}成功`);
        } else {
          message(`${title}失败`, { type: "error" });
        }
      })
      .catch(console.log);
  };

  // 批量删除
  const onDeleteAll = () => {
    if (!rowDatas.value.length) return message("请选择要删除的记录", { type: "error" });
    showMessageBox(`确认删除选中的记录吗？`)
      .then(() => onDelete(rowDatas.value))
      .catch(console.log);
  };

  const onDelete = (rows: MealCostManageListItemType[]) => {
    const ids = rows.map((item) => item.id);
    deleteMealCostManage(ids).then((res) => {
      if (res.data) {
        message("删除成功");
        rowDatas.value = [];
        onSearch();
      } else {
        message("删除失败", { type: "error" });
      }
    });
  };

  const onExport = () => {
    const localExport = () => {
      const timeStep = Date.now();
      const workbook = utils.table_to_book(document.querySelector("#mealCostManage"), { raw: true });
      workbook.Sheets.Sheet1["!cols"][0] = { hidden: true };
      const wbout = write(workbook, { bookType: "xlsx", bookSST: true, type: "array" });
      saveAs(new Blob([wbout], { type: "application/octet-stream" }), `餐费管理表_${timeStep}.xlsx`);
    };
    exportMealCostManage({ ...formData })
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

  // 分页相关
  function handleSizeChange(val: number) {
    formData.limit = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    formData.page = val;
    onSearch();
  }

  function onSelect(rows: MealCostManageListItemType[], row: MealCostManageListItemType) {
    setSelectChange({ rows, row });
  }

  function onSelectAll(rows: MealCostManageListItemType[]) {
    setSelectAllChange(rows);
  }

  const rowClick = (row: MealCostManageListItemType) => {
    // tableRef.value?.getTableRef()?.toggleRowSelection(row);
  };

  const onDbClick = (row: MealCostManageListItemType) => {
    onEdit(row);
  };

  const onEditAction = () => {
    if (!rowDatas.value.length) return ElMessage({ message: "请选择一条记录", type: "warning" });
    onEdit(rowDatas.value.at(-1));
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onEditAction, type: "warning", text: "修改" },
    { clickHandler: onDeleteAll, type: "danger", text: "删除" },
    { clickHandler: onImport, type: "primary", text: "导入", isDropDown: true },
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
    onTagSearch,
    handleSizeChange,
    onSelect,
    onSelectAll,
    rowClick,
    onDbClick,
    handleCurrentChange
  };
};
