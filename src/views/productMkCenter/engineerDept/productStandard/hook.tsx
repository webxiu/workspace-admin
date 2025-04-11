import { downloadFile, getFileNameOnUrlPath, onDownload } from "@/utils/common";
import { exportProductStandard, fetchProductStandard, importProductStandard, updateProductStandard } from "@/api/oaManage/productMkCenter";
import { formConfigs, formRules } from "./config";
import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { h, onMounted, reactive, ref } from "vue";

import type { ColDef } from "ag-grid-community";
import EditForm from "@/components/EditForm/index.vue";
import { ElMessageBox } from "element-plus";
import { PAGE_CONFIG } from "@/config/constant";
import { PaginationProps } from "@pureadmin/table";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { addDialog } from "@/components/ReDialog";
import axios from "axios";
import { getAgGridColumns } from "@/components/AgGridTable/config";
import { message } from "@/utils/message";
import { useEleHeight } from "@/hooks";

export const useMachine = () => {
  const isAgTable = ref(true);
  const columnDefs = ref<ColDef[]>([]);
  const dataList = ref([]);
  const columns = ref<TableColumnList[]>([]);
  const loading = ref(false);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 95);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const currentRow = ref();
  const formData = reactive({
    productCode: "",
    page: 1,
    limit: PAGE_CONFIG.pageSize
  });

  const searchOptions = reactive<SearchOptionType[]>([]);

  onMounted(() => {
    getColumnConfig();
    onSearch();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "产品型号", prop: "productCode" },
      { label: "前加工标准人数", prop: "preProcessingStandardWorkers" },
      { label: "前加工标准产能/H", prop: "preProcessingStandardCapacity" },
      { label: "前加工标准工时", prop: "preProcessingStandardDuration" },
      { label: "组装标准人数", prop: "assembleStandardWorkers" },
      { label: "组装标准产能/H", prop: "assembleStandardCapacity" },
      { label: "组装标准工时", prop: "assembleStandardDuration" }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [menuCols] = columnArrs;
    if (menuCols?.length) columnData = menuCols;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false });
    columnDefs.value = getAgGridColumns({ columnData, formData, operationColumn: false });
  };

  const onSearch = () => {
    fetchProductStandard(formData).then((res: any) => {
      if (res.data) {
        dataList.value = res.data.records || [];
        pagination.total = res.data.total;
      }
    });
  };

  const onRefresh = () => {
    getColumnConfig();
    onSearch();
  };

  const onTagSearch = (values) => {
    Object.assign(formData, values);
    onSearch();
  };

  const onExport = () => {
    exportProductStandard({ ...formData, limit: 1000000 }).then((res: any) => {
      if (res.data) {
        const fileName = getFileNameOnUrlPath(res.data);
        downloadFile(res.data, fileName);
      }
    });
  };

  const openDialog = (type, row?) => {
    const _formData = reactive({
      productCode: row?.productCode ?? "",
      preProcessingStandardWorkers: row?.preProcessingStandardWorkers,
      preProcessingStandardCapacity: row?.preProcessingStandardCapacity,
      preProcessingStandardDuration: row?.preProcessingStandardDuration,
      assembleStandardWorkers: row?.assembleStandardWorkers,
      assembleStandardCapacity: row?.assembleStandardCapacity,
      assembleStandardDuration: row?.assembleStandardDuration,
      id: row?.id,
      productId: row.productId,
      remark: row?.remark ?? ""
    });
    const formRef = ref();
    const typeTitle = { add: "新增", edit: "修改" };
    addDialog({
      title: `${typeTitle[type]}生产标准`,
      props: {
        formInline: _formData,
        formRules: formRules,
        formConfigs: formConfigs()
      },
      width: "500px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: true,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();

        FormRef.validate(async (valid) => {
          if (valid) {
            ElMessageBox.confirm("确认要保存吗", "系统提示", {
              type: "warning",
              draggable: true,
              cancelButtonText: "取消",
              confirmButtonText: "确定",
              dangerouslyUseHTMLString: true
            })
              .then(() => {
                updateProductStandard(_formData).then((res) => {
                  if (res.data) {
                    message.success("保存成功");
                    done();
                    onSearch();
                  }
                });
              })
              .catch(console.log);
          }
        });
      }
    });
  };

  const onEdit = () => {
    if (!currentRow.value) return message.warning("请选择一条记录");
    openDialog("edit", currentRow.value);
  };

  const onImportAction = () => {
    const dom = document.getElementById("importProductStandardId");
    dom.click();
  };

  const onChangeFileInput = (e) => {
    const file = e.target.files[0];

    const fd = new FormData();
    fd.append("file", file);

    importProductStandard(fd)
      .then((res) => {
        if (res.data) {
          message.success("导入成功");
          onSearch();
        }
      })
      .finally(() => {
        const dom = document.getElementById("importProductStandardId");
        (dom as any).value = null;
      });
  };

  const onDownloadTemplate = () => {
    return axios({
      method: "get",
      responseType: "blob",
      url: `${import.meta.env.VITE_PUBLIC_PATH}template/生产标准导入模板.xlsx`
    })
      .then(({ data }) => onDownload(data, "生产标准导入模板.xlsx"))
      .catch(() => {});
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

  const rowClick = (row) => (currentRow.value = row);

  const rowDbClick = (row) => {
    openDialog("edit", row);
  };

  function onSwitchTable() {
    isAgTable.value = !isAgTable.value;
    currentRow.value = undefined;
  }

  const buttonList = ref([
    { clickHandler: onEdit, type: "warning", text: "修改", isDropDown: false },
    { clickHandler: onDownloadTemplate, type: "warning", text: "下载模板", isDropDown: true },
    { clickHandler: onImportAction, type: "warning", text: "导入", isDropDown: true },
    { clickHandler: onExport, type: "info", text: "导出", isDropDown: true }
  ]);

  return {
    columnDefs,
    isAgTable,
    columns,
    searchOptions,
    buttonList,
    maxHeight,
    loading,
    dataList,
    pagination,
    onRefresh,
    rowClick,
    rowDbClick,
    onTagSearch,
    onSizeChange,
    onCurrentChange,
    onChangeFileInput,
    onSwitchTable
  };
};
