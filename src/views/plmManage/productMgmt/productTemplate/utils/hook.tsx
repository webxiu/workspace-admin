import { ElMessage, ElMessageBox } from "element-plus";
import { deleteProductTemplate, fetchProductTemplateList } from "@/api/plmManage";
import { downloadDataToExcel, getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { onMounted, reactive, ref } from "vue";

import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { getProductClassifyList } from "@/views/plmManage/productMgmt/classify/utils/hook";
import { useEleHeight } from "@/hooks";
import { useRouter } from "vue-router";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref([]);
  const currentId = ref("");
  const currentRow: any = ref({});
  const productClassList: any = ref([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49);
  const router = useRouter();

  let formData: any = reactive({
    productClassId: "",
    templateName: "",
    page: 1,
    limit: 10000
  });

  const searchOptions: SearchOptionType[] = reactive([
    {
      label: "产品分类",
      value: "productClassId",
      children: productClassList.value
    }
  ]);

  const getOptionList = () => {
    getProductClassifyList({ page: 1, limit: 10000 }).then((data) => (searchOptions[0].children = data));
  };

  onMounted(() => {
    getColumnConfig(buttonList);
    onSearch();
    getOptionList();
  });

  const getColumnConfig = async (buttonList) => {
    let columnData: TableColumnList[] = [
      { label: "模板名称", prop: "templateName" },
      { label: "产品分类名称", prop: "productClassName" },
      { label: "创建人", prop: "createUser" },
      { label: "创建时间", prop: "createDate" },
      { label: "最后修改人", prop: "modifyUser" },
      { label: "最后修改时间", prop: "modifyDate" }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [menuCols] = columnArrs;
    if (menuCols?.length) {
      columnData = menuCols;
    }

    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData: JSON.parse(JSON.stringify(columnData)), operationColumn: false });
    return columnData;
  };

  const onSearch = (_rowIndex?) => {
    loading.value = true;
    fetchProductTemplateList(formData)
      .then((res: any) => {
        const data = res.data;
        loading.value = false;
        dataList.value = data;

        if (typeof _rowIndex === "number" && _rowIndex >= 0) {
          currentRow.value = dataList.value[_rowIndex];
        } else {
          currentRow.value = {};
        }
      })
      .catch((err) => (loading.value = false));
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

  const onAdd = () => {
    router.push(`/plmManage/productMgmt/productTemplate/add/index?type=add`);
  };

  const onEdit = () => {
    const row = currentRow.value;
    currentId.value = row.id;
    router.push(`/plmManage/productMgmt/productTemplate/edit/index?type=edit&id=${row.id}`);
  };

  const onDelete = () => {
    const row = currentRow.value;
    ElMessageBox.confirm(`确认要删除名称为【${row.templateName}】的模板吗?`, "系统提示", {
      type: "warning",
      draggable: true,
      cancelButtonText: "取消",
      confirmButtonText: "确定",
      dangerouslyUseHTMLString: true
    })
      .then(() => {
        loading.value = true;
        deleteProductTemplate({ id: row.id }).then((res) => {
          if (res.data) {
            ElMessage({ message: `删除成功`, type: "success" });
            currentRow.value = {};
            onSearch();
          }
        });
      })
      .catch(() => {})
      .finally(() => (loading.value = false));
  };

  const onBeforeEdit = () => {
    console.log("edit");
    if (JSON.stringify(currentRow.value) == "{}" || !currentRow.value) {
      ElMessage({ message: "请选择一条记录", type: "warning" });
      return;
    } else {
      onEdit();
    }
  };

  const onBeforeDel = () => {
    console.log("beforeOnDelete");
    if (JSON.stringify(currentRow.value) == "{}" || !currentRow.value) {
      ElMessage({ message: "请选择一条记录", type: "warning" });
      return;
    } else {
      onDelete();
    }
  };

  const onExport = async () => {
    downloadDataToExcel({
      dataList: dataList.value,
      columns: columns.value,
      sheetName: "产品开发模板数据表"
    });
  };

  const rowClick = (row) => {
    currentRow.value = row;
  };

  const rowDbClick = (row) => {
    currentRow.value = row;
    onEdit();
  };

  const clickHandler = ({ text }) => {
    switch (text) {
      case "导出":
        onExport();
        break;
      case "新增":
        onAdd();
        break;
      case "修改":
        onBeforeEdit();
        break;
      case "删除":
        onBeforeDel();
        break;

      default:
        break;
    }
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler, type: "primary", text: "新增" },
    { clickHandler, type: "warning", text: "修改" },
    { clickHandler, type: "danger", text: "删除" },
    { clickHandler, type: "primary", text: "导出", isDropDown: true }
  ]);

  return {
    loading,
    rowDbClick,
    rowClick,
    columns,
    dataList,
    maxHeight,
    onExport,
    searchOptions,
    onBeforeEdit,
    onBeforeDel,
    onFresh,
    onSearch,
    onAdd,
    onEdit,
    buttonList,
    handleTagSearch,
    onDelete
  };
};
