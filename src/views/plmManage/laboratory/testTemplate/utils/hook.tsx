import { h, onMounted, reactive, ref } from "vue";
import { type PaginationProps } from "@pureadmin/table";

import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { useEleHeight } from "@/hooks";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { ProductClassifyManageItemType } from "@/api/plmManage";

import EditForm from "@/components/EditForm/index.vue";
import { message, showMessageBox, wrapFn } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { formConfigs, formRules } from "./config";
import {
  delTestTemplateList,
  copyTestTemplateList,
  exportTestTemplateList,
  fetchTestTemplateList,
  saveTemplateList,
  TestTemplateItemType,
  detailTestTemplate,
  TemplateDataItemType
} from "@/api/plmManage/laboratory";
import { PAGE_CONFIG } from "@/config/constant";
import { getProductClassifyList } from "@/views/plmManage/productMgmt/classify/utils/hook";
import { formatDate, getFileNameOnUrlPath, downloadFile } from "@/utils/common";

export const useTestReportConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref<TestTemplateItemType[]>([]);
  const rowData = ref<TestTemplateItemType>();
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const classifyOptions = ref<ProductClassifyManageItemType[]>([]);
  const formData = reactive({ page: 1, limit: PAGE_CONFIG.pageSize });
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49 + 46);

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "模板名称", value: "templateName" },
    { label: "模板编号", value: "templateCode" }
    // { label: "产品种类", value: "productTypeId", children: [] }
  ]);

  onMounted(() => {
    getColumnConfig();
    // getOptions();
    getTableList();
  });

  const getOptions = () => {
    getProductClassifyList({}).then((data) => {
      classifyOptions.value = data;
      searchOptions[1].children = data;
    });
  };

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "模板编号", prop: "templateCode", minWidth: 130 },
      { label: "模板名称", prop: "templateName", minWidth: 140 },
      // {
      //   label: "产品种类",
      //   prop: "productTypeId",
      //   minWidth: 80,
      //   cellRenderer: ({ row }) => {
      //     const stateInfo = classifyOptions.value?.find((item) => item.id == row.productTypeId);
      //     return stateInfo?.optionName || "";
      //   }
      // },
      { label: "创建人", prop: "createUserName", minWidth: 80 },
      { label: "创建时间", prop: "createDate", minWidth: 150, cellRenderer: ({ row }) => formatDate(row.createDate) },
      { label: "修改人", prop: "modifyUserName", minWidth: 80 },
      { label: "修改时间", prop: "modifyDate", minWidth: 150, cellRenderer: ({ row }) => formatDate(row.modifyDate) }
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

  const getTableList = () => {
    loading.value = true;

    fetchTestTemplateList(formData)
      .then((res: any) => {
        const data = res.data;
        loading.value = false;
        dataList.value = data.records || [];
        pagination.total = data.total;
      })
      .catch((err) => (loading.value = false));
  };

  const onFresh = () => {
    getColumnConfig();
    getTableList();
  };

  const onTagSearch = (values) => {
    Object.assign(formData, values);
    getTableList();
  };

  const onAdd = () => {
    openDialog("add", {});
  };

  const onEdit = wrapFn(rowData, () => {
    openDialog("edit", rowData.value);
  });

  const openDialog = async (type: string, row: Partial<TestTemplateItemType>) => {
    const title = { add: "新增", edit: "修改", view: "查看" }[type];
    const formRef = ref();
    const sLoading = ref(false);
    const detailInfo = ref<Partial<TestTemplateItemType>>({});
    const dymicData = ref<TemplateDataItemType[]>([]);
    const _formData = reactive({ ...row });

    const getDetail = () => {
      if (row.id) {
        sLoading.value = true;
        detailTestTemplate({ id: row.id })
          .then(({ data }) => {
            sLoading.value = false;
            detailInfo.value = data;
          })
          .catch(() => (sLoading.value = false));
      }
    };
    getDetail();
    const onChange = (data) => (dymicData.value = data);

    addDialog({
      title: title,
      props: {
        loading: sLoading,
        formInline: _formData,
        formRules: formRules,
        formConfigs: formConfigs({ type, classifyOptions, detailInfo, onChange })
      },
      width: "80%",
      draggable: true,
      fullscreenIcon: true,
      hideFooter: type === "view",
      closeOnClickModal: false,
      closeOnPressEscape: false,
      okButtonText: "保存",
      showResetButton: type === "edit",
      beforeReset: () => showMessageBox(`确认要重置数据吗?`).then(getDetail),
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.validate(async (valid) => {
          if (valid) {
            showMessageBox(`确认要${title}吗?`).then(() => {
              const params = { ..._formData, testTemplateDetails: dymicData.value };
              saveTemplateList(params).then(({ data }) => {
                if (!data) return message("保存失败", { type: "error" });
                message("保存成功");
                getTableList();
                done();
              });
            });
          }
        });
      }
    });
  };

  const onDelete = wrapFn(rowData, () => {
    const row = rowData.value;
    showMessageBox(`删除模板会将该模板下的数据同步删除, 确认要删除模板【${row.templateName}】吗?`).then(() => {
      delTestTemplateList({ id: row.id }).then(({ data }) => {
        if (!data) return message("删除失败", { type: "error" });
        message("删除成功");
        getTableList();
      });
    });
  });

  const onCopy = wrapFn(rowData, () => {
    const row = rowData.value;
    copyTestTemplateList({ id: row.id }).then(({ data }) => {
      if (!data) return message("复制失败", { type: "error" });
      message("复制成功");
      getTableList();
    });
  });

  const onExport = () => {
    exportTestTemplateList(formData).then(({ data }) => {
      if (!data) return message("导出失败", { type: "error" });
      const fileName = getFileNameOnUrlPath(data);
      downloadFile(data, fileName);
    });
  };

  const onRowClick = (row: TestTemplateItemType) => {
    rowData.value = row;
  };
  const onDblclick = (row: TestTemplateItemType) => {
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
    { clickHandler: onAdd, type: "primary", text: "新增", isDropDown: false },
    { clickHandler: onEdit, type: "warning", text: "修改", isDropDown: false },
    { clickHandler: onDelete, type: "danger", text: "删除", isDropDown: false },
    { clickHandler: onCopy, type: "primary", text: "复制", isDropDown: true },
    { clickHandler: onExport, type: "primary", text: "导出", isDropDown: true }
  ]);

  return {
    loading,
    columns,
    dataList,
    maxHeight,
    pagination,
    searchOptions,
    buttonList,
    onFresh,
    onTagSearch,
    onRowClick,
    onDblclick,
    handleSizeChange,
    handleCurrentChange
  };
};
