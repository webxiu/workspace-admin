import { useEleHeight } from "@/hooks";
import { h, onMounted, reactive, ref } from "vue";
import { addDialog } from "@/components/ReDialog";
import { type PaginationProps } from "@pureadmin/table";
import { message, showMessageBox, wrapFn } from "@/utils/message";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { BillState_Color, BillState, PAGE_CONFIG } from "@/config/constant";
import { getMenuColumns, RendererType, setColumn, updateButtonList } from "@/utils/table";
import { resignApplyList, addResignApply, updateResignApply, deleteResignApply, ResignApplyItemType } from "@/api/oaManage/humanResources";
import Print from "../print.vue";
import Detail from "../Detail.vue";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref<ResignApplyItemType[]>([]);
  const rowData = ref<ResignApplyItemType>();
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const formData = reactive({ page: 1, limit: PAGE_CONFIG.pageSize });
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49 + 46);

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "姓名", value: "staffName" },
    { label: "工号", value: "staffCode" }
  ]);

  onMounted(() => {
    getColumnConfig();
    getTableList();
  });

  const getColumnConfig = async () => {
    const transferTypeRender: RendererType = ({ row, column }) => {
      const value = row[column["property"]] as string;
      const typeStr = value.slice(0, 2);
      if (typeStr === "其他") return <span>{typeStr}</span>;
      return <span>{value}</span>;
    };
    let columnData: TableColumnList[] = [
      { label: "姓名", prop: "staffName", minWidth: 140 },
      { label: "工号", prop: "staffCode", minWidth: 140 },
      { label: "部门", prop: "deptName", minWidth: 160 },
      { label: "职务", prop: "roleName", minWidth: 160 },
      { label: "入职日期", prop: "startDate", minWidth: 140 },
      { label: "申请日期", prop: "applyDate", minWidth: 140 },
      {
        label: "单据状态",
        prop: "billState",
        minWidth: 140,
        align: "center",
        cellRenderer({ row, column }) {
          const item = BillState_Color[row[column["property"]]];
          const styleBox = { color: "#fff", padding: "3px 6px", borderRadius: "4px", background: item.color };
          return <span style={styleBox}>{item.name}</span>;
        }
      },
      { label: "离职类别", prop: "resignationType", minWidth: 140, cellRenderer: transferTypeRender },
      { label: "离职原因", prop: "resignationReason", minWidth: 140 }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns([{ resignationType: transferTypeRender }]);
    const [menuCols] = columnArrs;
    if (menuCols?.length) columnData = menuCols;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false });
    return columnData;
  };

  const getTableList = () => {
    loading.value = true;
    resignApplyList(formData)
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
    openDialog("add", {} as ResignApplyItemType);
  }

  const onEdit = wrapFn(rowData, () => {
    openDialog("edit", rowData.value);
  });

  const openDialog = (type: "add" | "edit", row?: ResignApplyItemType) => {
    const title = { add: "新增", edit: "修改" }[type];
    const formRef = ref();
    addDialog({
      title: `${title}离职申请`,
      props: { type: type, id: row?.id },
      width: "960px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(Detail, { ref: formRef }),
      beforeReset: () => formRef.value.getRef()?.resetFields(),
      beforeSure: (done, { options }) => {
        formRef.value.getRef().then(({ formData, data }) => {
          const { other, ...reset } = formData;
          if (type === "edit" && ![BillState.submit, BillState.reject].includes(row.billState)) {
            return message.error("只能提交【待提交/重新审核】的记录");
          }
          if (reset.resignationType === "其他") {
            reset.resignationType = reset.resignationType + (other ?? "");
          }
          showMessageBox("确认提交吗").then(() => {
            const reqApi = { add: addResignApply, edit: updateResignApply };
            reqApi[type](reset).then((res) => {
              if (res.data) {
                message.success(`${title}成功`);
                getTableList();
                done();
              } else {
                message.error(`${title}失败`);
              }
            });
          });
        });
      }
    });
  };

  const onDelete = wrapFn(rowData, () => {
    const { id, deptName } = rowData.value;
    showMessageBox(`确认要删除【${deptName}】吗?`).then(() => {
      deleteResignApply({ id }).then(({ data }) => {
        if (!data) return message.error("删除失败");
        message.success("删除成功");
        getTableList();
      });
    });
  });

  const onPrint = wrapFn(rowData, () => {
    const row = rowData.value;
    const formRef = ref();
    addDialog({
      title: "打印离职申请单",
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

  const onCurrentChange = (row: ResignApplyItemType) => {
    rowData.value = row;
  };
  const onDblclick = (row: ResignApplyItemType) => {
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
    onAdd,
    onEdit,
    onDelete,
    onPrint,
    onReFresh,
    onTagSearch,
    onDblclick,
    onCurrentChange,
    handleSizeChange,
    handleCurrentChange
  };
};
