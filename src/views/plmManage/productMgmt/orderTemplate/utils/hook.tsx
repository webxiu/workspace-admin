import Detail from "../Detail.vue";
import { useEleHeight } from "@/hooks";
import { PAGE_CONFIG } from "@/config/constant";
import { h, onMounted, reactive, ref } from "vue";
import { addDialog } from "@/components/ReDialog";
import { type PaginationProps } from "@pureadmin/table";
import { message, showMessageBox, wrapFn } from "@/utils/message";
import { downloadFile, getFileNameOnUrlPath } from "@/utils/common";
import { Plus, Edit, Delete, Download } from "@element-plus/icons-vue";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { getExportConfig, getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { orderTemplateList, addOrderTemplate, updateOrderTemplate, OrderTemplateItemType, deleteOrderTemplate, exportOrderTemplate } from "@/api/plmManage";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref<OrderTemplateItemType[]>([]);
  const rowData = ref<OrderTemplateItemType>();
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const formData = reactive({ page: 1, limit: PAGE_CONFIG.pageSize });
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49 + 46);

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "产品型号", value: "productCode" },
    { label: "模号", value: "modelNumber" },
    { label: "部件名称", value: "partName" }
  ]);

  onMounted(() => {
    getColumnConfig();
    getTableList();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "产品型号", prop: "productCode", minWidth: 140 },
      { label: "模号", prop: "modelNumber", minWidth: 140 },
      { label: "部件名称", prop: "partName", minWidth: 160 },
      { label: "备注", prop: "remarks", minWidth: 200 },
      { label: "创建人", prop: "createUserName", minWidth: 140 },
      { label: "创建时间", prop: "createDate", minWidth: 140 },
      { label: "修改人", prop: "modifyUserName", minWidth: 140 },
      { label: "修改时间", prop: "modifyDate", minWidth: 140 }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [menuCols] = columnArrs;
    if (menuCols?.length) columnData = menuCols;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false });
    return columnData;
  };

  const getTableList = () => {
    loading.value = true;
    orderTemplateList(formData)
      .then(({ data }) => {
        loading.value = false;
        dataList.value = data.records || [];
        pagination.total = data.total;
      })
      .catch((err) => (loading.value = false));
  };

  const onReFresh = () => {
    getColumnConfig();
    getTableList();
  };

  const onTagSearch = (values) => {
    Object.assign(formData, values);
    getTableList();
  };

  function onAdd() {
    openDialog("add", {} as OrderTemplateItemType);
  }

  const onEdit = wrapFn(rowData, () => {
    openDialog("edit", rowData.value);
  });

  const openDialog = (type: "add" | "edit", row?: OrderTemplateItemType) => {
    const title = { add: "新增", edit: "修改" }[type];
    const formRef = ref();
    const _formData = reactive({ ...row });
    addDialog({
      title: `${title}订单模板`,
      props: { formData: _formData, type: type, id: row?.id },
      width: "960px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(Detail, { ref: formRef }),
      beforeReset: () => formRef.value.getRef()?.resetFields(),
      beforeSure: (done, { options }) => {
        const { getRef, param, files, deleteIds } = formRef.value.getRef();
        const fd = new FormData();
        fd.append("data", JSON.stringify(param));
        fd.append("deleteIds", JSON.stringify(deleteIds));
        files.forEach((file: File) => fd.append("files", file));

        getRef?.validate((valid) => {
          if (valid) {
            showMessageBox("确认提交吗").then(() => {
              const reqApi = { add: addOrderTemplate, edit: updateOrderTemplate };
              reqApi[type](fd).then((res) => {
                if (res.data) {
                  message.success(`${title}成功`);
                  getTableList();
                  done();
                } else {
                  message.error(`${title}失败`);
                }
              });
            });
          }
        });
      }
    });
  };

  const onDelete = wrapFn(rowData, () => {
    const { id, productCode } = rowData.value;
    showMessageBox(`确认要删除【${productCode}】吗?`).then(() => {
      deleteOrderTemplate({ id }).then(() => {
        message.success("删除成功");
        getTableList();
      });
    });
  });

  const onExport = () => {
    const headConfig = getExportConfig("订单模板", columns.value, formData);
    exportOrderTemplate(headConfig)
      .then(({ data }) => downloadFile(data, getFileNameOnUrlPath(data), true))
      .catch(console.log);
  };

  const onCurrentChange = (row: OrderTemplateItemType) => {
    rowData.value = row;
  };
  const onDblclick = (row: OrderTemplateItemType) => {
    openDialog("edit", row);
  };

  // 分页相关
  function handleSizeChange(val: number) {
    formData.limit = val;
    getTableList();
  }

  function handleCurrentChange(val: number) {
    formData.page = val;
    getTableList();
  }

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "新增", icon: Plus, isDropDown: false },
    { clickHandler: onEdit, type: "warning", text: "修改", icon: Edit, isDropDown: false },
    { clickHandler: onDelete, type: "danger", text: "删除", icon: Delete, isDropDown: false },
    { clickHandler: onExport, type: "default", text: "导出", icon: Download, isDropDown: true }
  ]);

  return {
    loading,
    columns,
    dataList,
    maxHeight,
    pagination,
    searchOptions,
    buttonList,
    onReFresh,
    onTagSearch,
    onDblclick,
    onCurrentChange,
    handleSizeChange,
    handleCurrentChange
  };
};
