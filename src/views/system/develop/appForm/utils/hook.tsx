import { onMounted, reactive, ref, h } from "vue";
import { type PaginationProps } from "@pureadmin/table";
import { Plus, Delete } from "@element-plus/icons-vue";

import { setColumn, getMenuColumns, updateButtonList, RendererType, tableEditRender, downloadDataToExcel } from "@/utils/table";

import { useEleHeight } from "@/hooks";
import { addDialog } from "@/components/ReDialog";
import { message, showMessageBox } from "@/utils/message";

import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { PAGE_CONFIG } from "@/config/constant";

import TableEditList from "@/components/TableEditList/index.vue";
import { FormTableConfigType } from "@/utils/form";
import { deleteAppFormList, fetchAppFormList, fetchAppFormRecordList, insertAppFormList, updateAppFormList } from "@/api/systemManage";

export const useConfig = () => {
  const currentRow = ref();
  const loading = ref<boolean>(false);
  const columns = ref<TableColumnList[]>([]);
  const dataList = ref<any[]>([]);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49 + 52);

  const formData = reactive({
    page: 1,
    limit: PAGE_CONFIG.pageSize
  });

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "单据ID", value: "billId" },
    { label: "表单编号", value: "formNo" }
  ]);

  onMounted(() => {
    getColumnConfig();
    onSearch();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "单据ID", prop: "billId", width: 110 },
      { label: "表单编号", prop: "formNo", minWidth: 180 },
      { label: "表单名称", prop: "formName", minWidth: 180 },
      { label: "表单类型", prop: "formModel", minWidth: 180 },
      { label: "表单序号", prop: "formSort", minWidth: 120 },
      { label: "创建日期", prop: "createDate", minWidth: 160 },
      { label: "修改日期", prop: "modifyDate", minWidth: 160 }
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false });
    return columnData;
  };

  const handleTagSearch = (values: any) => {
    Object.assign(formData, values);
    onSearch();
  };

  const onSearch = (idx?) => {
    fetchAppFormRecordList(formData).then((res: any) => {
      const data = res.data;
      dataList.value = data.records || [];
      pagination.total = data.total;

      if (typeof idx === "number" && idx >= 0) {
        currentRow.value = dataList.value[idx];
      } else {
        currentRow.value = null;
      }
    });
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

  const onCurrentChange = (row: any) => {
    if (!row) return;
    currentRow.value = row;
  };

  const onDelete = (row) => {
    deleteAppFormList(row).then((res) => {
      if (res.data) {
        message.success("删除成功!");
        currentRow.value = null;
        onSearch();
      }
    });
  };

  // 批量删除
  const onDeleteAll = () => {
    if (!currentRow.value) return message.warning("请选择单据");

    showMessageBox(`确认删除名称为【${currentRow.value?.formName}】的表单吗？`)
      .then(() => onDelete(currentRow.value))
      .catch(console.log);
  };

  const onExport = () => {
    downloadDataToExcel({
      dataList: dataList.value,
      columns: columns.value,
      sheetName: "移动端审批表"
    });
  };

  const rowClick = (row) => {
    currentRow.value = row;
  };

  const onDbClick = (row) => {
    currentRow.value = row;
    onEditAction();
  };
  const openImportAddDialog = (type, row?) => {
    const title = { add: "新增", edit: "修改", view: "查看" };
    const formRef = ref();
    const dataImportList = ref([]);
    const testData: any = ref([]);
    const _formData = reactive({
      billId: row?.billId ?? "",
      formNo: row?.formNo ?? "",
      formSort: row?.formSort ?? "",
      formName: row?.formName ?? "",
      formModel: row?.formModel ?? "",
      id: row?.id ?? "",
      createUserId: row?.createUserId ?? null,
      createUserName: row?.createUserName,
      createDate: row?.createDate,
      modifyUserName: row?.modifyUserName,
      modifyDate: row?.modifyDate
    });

    const onDelete = (index) => {
      if (typeof index === "number") {
        dataImportList.value.splice(index, 1);
        testData.value.splice(index, 1);
        if (!dataImportList.value.length) testData.value = [];
        return;
      }
    };

    if (row) {
      fetchAppFormList({ ...row }).then((res: any) => {
        if (res.data) {
          dataImportList.value = res.data;
        }
      });
    }

    // 编辑表格
    const { editCellRender } = tableEditRender();

    const tableSlots = () => {
      return {
        operation: ({ index }) => (
          <el-popconfirm width={280} title={`确认删除吗?`} onConfirm={() => onDelete(index)}>
            {{
              reference: () => (
                <el-button size="small" type="danger" icon={Delete} onClick={(e) => e.preventDefault()} disabled={type === "view"}>
                  删除
                </el-button>
              )
            }}
          </el-popconfirm>
        )
      };
    };

    const custmRender = (): Record<string, RendererType> => {
      const isEdit = type !== "view";
      return {
        inputItemFieldName: (data) => editCellRender({ data, isEdit }),
        inputItemName: (data) => editCellRender({ data, isEdit }),
        inputItemModel: (data) => editCellRender({ data, isEdit })
      };
    };

    const onAdd = () => {
      dataImportList.value.push({
        inputItemFieldName: "",
        id: "",
        inputItemName: "",
        inputItemModel: ""
      });
    };

    const tableConfig: FormTableConfigType[] = [
      {
        dataList: dataImportList,
        custmRender: custmRender(),
        tableProps: { height: 300, maxHeight: 300, rowKey: "id", className: "app-form-tableClass" },
        tableSlots: tableSlots(),
        buttonConfig: {
          autoLayout: false,
          buttonList: [{ icon: Plus, size: "small", type: "primary", text: "添加", disabled: type === "view", clickHandler: onAdd }]
        },
        tableColumnOption: {
          operationColumn: { width: 125 },
          dragSelector: ".app-form-tableClass",
          isDragRow: true,
          dataList: dataImportList
        }
      }
    ];

    addDialog({
      title: `${title[type]}移动端审批表单`,
      props: {
        params: { groupCode: "1" },
        tableConfig,
        formConfig: [
          {
            formData: _formData,
            customProps: {
              formName: {
                onChange: (value) => (_formData.billId = value)
              }
            },
            formProps: { labelWidth: "90px", size: "small" }
          }
        ]
      },
      width: "900px",
      class: "app-form-modal",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      hideFooter: type === "view",
      contentRenderer: () => h(TableEditList, { ref: formRef }),
      beforeSure: (done) => {
        formRef.value.getRef().then(({ valid }) => {
          if (valid) {
            const filteredList = dataImportList.value.filter((el) => el.inputItemFieldName).map((item, index) => ({ ...item, inputItemSort: index + 1 }));
            if (!filteredList.length) return message.error("明细数据不能为空");
            showMessageBox(`确认要${title[type]}吗?`)
              .then(() => {
                const apiType = { add: insertAppFormList, edit: updateAppFormList };
                const params = {
                  ..._formData,
                  list: filteredList
                };
                apiType[type](params).then((res) => {
                  if (res.data) message.success(`${title[type]}成功`);
                  done();
                  if (type === "edit") {
                    const _rowIndex = dataList.value.findIndex((item) => item.id === row?.id);
                    onSearch(_rowIndex);
                  } else {
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

  const onAddAction = () => {
    openImportAddDialog("add");
  };

  const onEditAction = () => {
    if (!currentRow.value) return message.warning("请选择单据");
    openImportAddDialog("edit", currentRow.value);
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAddAction, type: "primary", text: "新增" },
    { clickHandler: onEditAction, type: "warning", text: "修改" },
    { clickHandler: onDeleteAll, type: "danger", text: "删除" },
    { clickHandler: onExport, type: "info", text: "导出", isDropDown: true }
  ]);

  return {
    columns,
    dataList,
    loading,
    maxHeight,
    pagination,
    buttonList,
    searchOptions,
    onDelete,
    onSearch,
    handleTagSearch,
    onCurrentChange,
    handleSizeChange,
    rowClick,
    onDbClick,
    handleCurrentChange
  };
};
