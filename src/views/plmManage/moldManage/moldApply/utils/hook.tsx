import { h, onMounted, reactive, ref } from "vue";
import { type PaginationProps } from "@pureadmin/table";

import { getMenuColumns, RendererType, setColumn, updateButtonList } from "@/utils/table";
import { useEleHeight } from "@/hooks";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { moldApplyList, MoldApplyItemType, addMoldApply, editMoldApply, deleteMoldApply, printMoldApply, MoldFileItemType } from "@/api/plmManage";

import EditForm from "@/components/EditForm/index.vue";
import { message, showMessageBox, wrapFn } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { PAGE_CONFIG } from "@/config/constant";
import Print from "../print.vue";
import { formRules, formConfigs, modelTypeList, dataProvideList } from "./config";
import { commonBack, commonSubmit } from "@/api/systemManage";
import NodeDetailList from "@/components/NodeDetailList/index.vue";

export const useTestReportConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref<MoldApplyItemType[]>([]);
  const rowData = ref<MoldApplyItemType>();
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const formData = reactive({ page: 1, limit: PAGE_CONFIG.pageSize });
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49 + 46);
  const baseApi = import.meta.env.VITE_BASE_API;

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "产品名称", value: "productName" },
    { label: "产品型号", value: "productCode" },
    { label: "开模日期", value: "modelOpeningDate", type: "date", format: "YYYY-MM-DD" },
    { label: "创建人", value: "createUserName" }
  ]);

  onMounted(() => {
    getColumnConfig();
    getTableList();
  });

  const getColumnConfig = async () => {
    const colors = "primary,success,warning,danger,info".split(",");
    const getValue = (prop: string, val: string) => {
      const options = { modelType: modelTypeList, dataProvides: dataProvideList }[prop] || [];
      return options.find((item) => item.value === val)?.label;
    };
    const tagRenderer: RendererType = ({ row, column }) => {
      const prop = column["property"];
      const values = row[prop]?.split(",").filter(Boolean);
      return values.map((val, i) => {
        return (
          <el-tag type={colors[i]} size="small" effect="plain" class="mr-1" round>
            {getValue(prop, val)}
          </el-tag>
        );
      });
    };
    let columnData: TableColumnList[] = [
      { label: "产品型号", prop: "productCode", minWidth: 140 },
      { label: "产品名称", prop: "productName", minWidth: 140 },
      { label: "开模日期", prop: "modelOpeningDate", minWidth: 160 },
      { label: "试模日期", prop: "trialDate", minWidth: 160 },
      { label: "模具类型", prop: "modelType", minWidth: 140 },
      { label: "拟定模具总数", prop: "draftModelQuantity", minWidth: 140 },
      { label: "资料提供", prop: "dataProvides", minWidth: 140 },
      { label: "创建人", prop: "createUserName", minWidth: 140 },
      { label: "创建日期", prop: "createDate", minWidth: 140 },
      { label: "修改人", prop: "modifyUserName", minWidth: 140 },
      { label: "修改日期", prop: "modifyDate", minWidth: 140 }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns([{ modelType: tagRenderer, dataProvides: tagRenderer }]);
    const [menuCols] = columnArrs;
    if (menuCols?.length) columnData = menuCols;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false });
    return columnData;
  };

  const getTableList = () => {
    loading.value = true;

    moldApplyList(formData)
      .then((res) => {
        const data = res.data;
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
    openDialog("add", {} as MoldApplyItemType);
  }

  const onEdit = wrapFn(rowData, () => {
    openDialog("edit", rowData.value);
  });

  const openDialog = (type: "add" | "edit", row?: MoldApplyItemType) => {
    const title = { add: "新增", edit: "修改" }[type];
    const formRef = ref();
    const sloading = ref(false);
    const _formData = reactive({
      ...row,
      modelType: row.modelType?.split(",").filter(Boolean) || [],
      dataProvides: row.dataProvides?.split(",").filter(Boolean) || [],
      plmBillFiles: row?.plmBillFiles?.map((m) => ({ ...m, url: baseApi + m.filePath + "/" + m.fileName }))
    });

    addDialog({
      title: `${title}开模申请`,
      props: {
        loading: sloading,
        formInline: _formData,
        formRules: formRules,
        formConfigs: formConfigs({ type }),
        formProps: { labelWidth: "120px" }
      },
      width: "960px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeReset: () => formRef.value.getRef()?.resetFields(),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.validate((valid) => {
          if (valid) {
            const { plmBillFiles, ...param } = _formData;
            const fd = new FormData();
            if (Array.isArray(plmBillFiles)) {
              plmBillFiles.forEach((item: any) => item.raw && fd.append("files", item.raw));
            }
            const deleteFiles = row.plmBillFiles?.filter((item: MoldFileItemType) => {
              return !plmBillFiles?.some((m: MoldFileItemType) => m.id === item.id);
            });
            const result = {
              ...param,
              plmBillFiles: deleteFiles,
              dataProvides: _formData.dataProvides.join(","),
              modelType: _formData.modelType.join(",")
            };
            fd.append("dto", JSON.stringify(result));
            showMessageBox("确认提交吗").then(() => {
              const reqApi = { add: addMoldApply, edit: editMoldApply };
              reqApi[type](fd).then((res) => {
                if (res.data) {
                  message(`${title}成功`);
                  getTableList();
                  done();
                } else {
                  message(`${title}失败`, { type: "error" });
                }
              });
            });
          }
        });
      }
    });
  };

  const onDelete = wrapFn(rowData, () => {
    const { id, productName } = rowData.value;
    showMessageBox(`确认要删除【${productName}】吗?`).then(() => {
      deleteMoldApply({ id }).then(({ data }) => {
        if (!data) return message("删除失败", { type: "error" });
        message("删除成功");
        getTableList();
      });
    });
  });

  const onPrint = wrapFn(rowData, () => {
    const row = rowData.value;
    const formRef = ref();
    addDialog({
      title: "打印开模申请单",
      props: { row },
      width: "90%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      okButtonText: "打印",
      contentRenderer: () => h(Print, { ref: formRef }),
      beforeSure: (done, { options }) => {
        formRef.value.onPrint();
      }
    });
  });

  const onCurrentChange = (row: MoldApplyItemType) => {
    rowData.value = row;
  };
  const onDblclick = (row: MoldApplyItemType) => {
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

  const onSubmit = wrapFn(rowData, () => {
    const { productName, id } = rowData.value;
    showMessageBox(`确认要提交【${productName}】吗?`).then(() => {
      commonSubmit({ id, billId: "10061" }).then(({ data }) => {
        if (data) {
          message("提交成功");
          getTableList();
        }
      });
    });
  });

  const onRevoke = wrapFn(rowData, () => {
    const { productName, billNo } = rowData.value;
    showMessageBox(`确认要撤销【${productName}】吗?`).then(() => {
      commonBack({ comment: "", backToActivityId: "startEvent1", billNo }).then(({ data }) => {
        if (data) {
          message("撤销成功");
          getTableList();
        }
      });
    });
  });

  const onAuditDetail = wrapFn(rowData, () => {
    addDialog({
      title: "查看审批详情",
      width: "900px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: true,
      hideFooter: true,
      contentRenderer: ({ options }) =>
        h(NodeDetailList, { options, billNo: rowData.value.billNo, billType: "openModeApply", billState: rowData.value.billState })
    });
  });

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "新增", isDropDown: false },
    { clickHandler: onEdit, type: "warning", text: "修改", isDropDown: false },
    { clickHandler: onDelete, type: "danger", text: "删除", isDropDown: false },
    { clickHandler: onSubmit, type: "primary", text: "提交", isDropDown: true },
    { clickHandler: onRevoke, type: "primary", text: "撤销", isDropDown: true },
    { clickHandler: onAuditDetail, type: "primary", text: "审批详情", isDropDown: true },
    { clickHandler: onPrint, type: "primary", text: "打印", isDropDown: true }
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
