import { ElMessage, ElMessageBox } from "element-plus";
import { deleteProductsDevApplayInfo, fetchProductsDevApplayList, submitProductsDevApplayInfo } from "@/api/plmManage";
import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { h, onMounted, reactive, ref } from "vue";
import { utils, write } from "xlsx";

import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { getProductClassifyList } from "@/views/plmManage/productMgmt/classify/utils/hook";
import { saveAs } from "file-saver";
import { useEleHeight } from "@/hooks";
import { useRouter } from "vue-router";
import { message, showMessageBox } from "@/utils/message";
import { commonBack, commonSubmit } from "@/api/systemManage";
import { addDialog } from "@/components/ReDialog";
import NodeDetailList from "@/components/NodeDetailList/index.vue";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref([]);
  const currentId = ref("");
  const currentRow: any = ref({});
  const productClassList: any = ref([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49);
  const router = useRouter();
  const dialogVisible = ref<boolean>(false);

  let formData: any = reactive({
    productClassId: "",
    titleName: "",
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
      { label: "单据编号", prop: "billNo" },
      { label: "标题名称", prop: "titleName" },
      { label: "单据状态", prop: "billState", slot: "billState" },
      { label: "产品分类", prop: "productClassName" },
      { label: "申请人", prop: "createUserName" },
      { label: "申请日期", prop: "createDate" }
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
    fetchProductsDevApplayList(formData)
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

  const onAdd = (templateId) => {
    router.push(`/plmManage/productMgmt/productsDevApplay/add/index?type=add&templateId=${templateId}`);
  };

  const onEdit = () => {
    const row = currentRow.value;
    currentId.value = row.id;
    router.push(`/plmManage/productMgmt/productsDevApplay/view/index?type=view&id=${row.id}`);
  };

  const onSubmitAction = () => {
    if (JSON.stringify(currentRow.value) == "{}" || !currentRow.value) {
      return message("请选择一条记录", { type: "warning" });
    } else {
      const { billNo, id } = currentRow.value;
      showMessageBox(`确认要提交【${billNo}】吗?`).then(() => {
        commonSubmit({ id, billId: "10031" }).then(({ data }) => {
          if (data) {
            message("提交成功");
            onSearch();
          }
        });
      });
    }
  };

  const onDelete = () => {
    const row = currentRow.value;
    if (row.billState !== 0) {
      ElMessage({ message: `只能删除待提交的记录`, type: "error" });
      return;
    }
    ElMessageBox.confirm(`确认要删除标题为【${row.titleName}】的申请单吗?`, "系统提示", {
      type: "warning",
      draggable: true,
      cancelButtonText: "取消",
      confirmButtonText: "确定",
      dangerouslyUseHTMLString: true
    })
      .then(() => {
        loading.value = true;
        deleteProductsDevApplayInfo({ id: row.id }).then((res) => {
          if (res.data) {
            ElMessage({ message: `删除成功`, type: "success" });
            const _rowIndex = dataList.value.findIndex((item) => item.id === currentRow.value.id);
            onSearch(_rowIndex);
          }
        });
      })
      .catch(() => {})
      .finally(() => (loading.value = false));
  };

  const onExport = () => {
    const timeStep = Date.now();
    const workbook = utils.table_to_book(document.querySelector("#productDevApplyTableId"), {
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
      `产品开发申请表${timeStep}.xlsx`
    );
  };

  const onBeforeSubmit = () => {
    if (JSON.stringify(currentRow.value) == "{}" || !currentRow.value) {
      ElMessage({ message: "请选择一条记录", type: "warning" });
      return;
    } else {
      onSubmitAction();
    }
  };

  const onBeforeDel = () => {
    if (JSON.stringify(currentRow.value) == "{}" || !currentRow.value) {
      ElMessage({ message: "请选择一条记录", type: "warning" });
      return;
    } else {
      onDelete();
    }
  };

  const onBeforeView = () => {
    if (JSON.stringify(currentRow.value) == "{}" || !currentRow.value) {
      ElMessage({ message: "请选择一条记录", type: "warning" });
      return;
    } else {
      onEdit();
    }
  };

  const rowDbClick = (row) => {
    currentRow.value = row;
    onEdit();
  };

  const rowClick = (row) => {
    currentRow.value = row;
  };
  const beforeOnRevoke = () => {
    if (JSON.stringify(currentRow.value) == "{}" || !currentRow.value) {
      return message("请选择一条记录", { type: "warning" });
    } else {
      const { billNo } = currentRow.value;
      showMessageBox(`确认要撤销【${billNo}】吗?`).then(() => {
        commonBack({ comment: "", backToActivityId: "startEvent1", billNo }).then(({ data }) => {
          if (data) {
            message("撤销成功");
            onSearch();
          }
        });
      });
    }
  };

  const beforeOnViewDetail = () => {
    if (JSON.stringify(currentRow.value) == "{}" || !currentRow.value) {
      return message("请选择一条记录", { type: "warning" });
    } else {
      addDialog({
        title: "查看审批详情",
        width: "900px",
        draggable: true,
        fullscreenIcon: true,
        closeOnClickModal: true,
        hideFooter: true,
        contentRenderer: ({ options }) =>
          h(NodeDetailList, { options, billNo: currentRow.value.billNo, billType: "productDevApply", billState: currentRow.value.billState })
      });
    }
  };

  const beforePrint = () => {
    // if (JSON.stringify(currentRow.value) == "{}" || !currentRow.value) {
    //   return message("请选择一条记录", { type: "warning" });
    // } else {

    // }
    router.push("/plmManage/productMgmt/productsDevApplay/print/index");
  };

  const clickHandler = ({ text }) => {
    switch (text) {
      case "导出":
        onExport();
        break;
      case "新增":
        dialogVisible.value = true;
        break;
      case "提交":
        onBeforeSubmit();
        break;
      case "删除":
        onBeforeDel();
        break;
      case "查看":
        onBeforeView();
        break;
      case "撤销":
        beforeOnRevoke();
        break;
      case "审批详情":
        beforeOnViewDetail();
        break;
      case "打印":
        beforePrint();
        break;
      default:
        break;
    }
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler, type: "primary", text: "新增" },
    { clickHandler, type: "danger", text: "删除" },
    { clickHandler, type: "primary", text: "提交", isDropDown: true },
    { clickHandler, type: "primary", text: "撤销", isDropDown: true },
    { clickHandler, type: "primary", text: "审批详情", isDropDown: true },
    { clickHandler, type: "primary", text: "查看", isDropDown: true },
    { clickHandler, type: "primary", text: "导出", isDropDown: true },
    { clickHandler, type: "primary", text: "打印", isDropDown: true }
  ]);

  return {
    loading,
    columns,
    dataList,
    maxHeight,
    buttonList,
    searchOptions,
    onSearch,
    onAdd,
    onFresh,
    onEdit,
    dialogVisible,
    onSubmitAction,
    handleTagSearch,
    onDelete,
    onExport,
    onBeforeSubmit,
    rowDbClick,
    rowClick,
    onBeforeView,
    onBeforeDel
  };
};
