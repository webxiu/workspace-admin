import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { h, onMounted, reactive, ref } from "vue";
import { message, showMessageBox } from "@/utils/message";
import { PAGE_CONFIG } from "@/config/constant";
import { PaginationProps } from "@pureadmin/table";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { addDialog } from "@/components/ReDialog";
import { useEleHeight } from "@/hooks";
import TableEditList from "@/components/TableEditList/index.vue";
import { CustomPropsType } from "@/utils/form";
import Rollback from "./rollback.vue";
import {
  deleteHelpDocList,
  fetchHelpDocList,
  insertHelpDocList,
  previewDocFile,
  queryHelpDocInfo,
  rollBackHelpDocHistoryList,
  updateHelpDocList
} from "@/api/systemManage";
import { useRoute } from "vue-router";

export const useMachine = () => {
  const dataList = ref([]);
  const columns = ref<TableColumnList[]>([]);
  const curRow = ref();
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 95);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });

  const route = useRoute();

  const formData: any = reactive({
    pageNo: 1,
    limit: PAGE_CONFIG.pageSize
  });

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "创建人", value: "createUserName" },
    { label: "创建时间", value: "createDate", type: "date", format: "YYYY-MM-DD" }
  ]);

  onMounted(() => {
    getColumnConfig();
    onSearch();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "菜单名称", prop: "menuName" },
      { label: "内容", prop: "text" },
      { label: "创建人", prop: "createUserName" },
      { label: "创建时间", prop: "createDate" },
      { label: "最后修改人", prop: "modifyUserName" },
      { label: "最后修改时间", prop: "modifyDate" }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [menuCols] = columnArrs;
    if (menuCols?.length) columnData = menuCols;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false });
    return columnData;
  };

  const onSearch = () => {
    fetchHelpDocList(formData).then((res: any) => {
      if (res.data) {
        dataList.value = res.data.records || [];
        pagination.total = res.data.total;
      }
    });
  };

  const onFresh = () => {
    getColumnConfig();
    onSearch();
  };

  const handleTagSearch = (values) => {
    Object.assign(formData, values);
    onSearch();
  };

  const openDialog = async (type: "add" | "view" | "edit", row?) => {
    const title = { add: "新增", edit: "修改" }[type];
    const formRef = ref();
    const _formData = reactive({
      id: row?.id ?? "",
      menuId: row?.menuId ? +row?.menuId : "",
      text: row?.text,
      documentId: row?.documentId
    });

    const customProps = reactive<{ [key: string]: CustomPropsType }>({
      menuId: {
        apiParams: {},
        formatAPI(data) {
          return data[0].children;
        }
      }
    });

    if (row?.menuId) {
      // queryHelpDocInfo({ id: row?.id, documentId: row?.documentId }).then((res: any) => {
      //   if (res.data) {
      //     _formData.text = res.data.text;
      //   }
      // });

      previewDocFile({ menuId: row.menuId }).then((res: any) => {
        if (res.data) {
          _formData.text = res.data.text;
        }
      });
    }

    addDialog({
      title: `${title}帮助文档`,
      props: {
        params: { groupCode: "1" },
        formConfig: [
          {
            formData: _formData,
            customProps,
            formProps: { labelWidth: "80px" }
          }
        ]
      },
      width: "800px",
      draggable: true,
      class: "rate-modal-fin",
      fullscreenIcon: true,
      okButtonText: "保存",
      closeOnClickModal: false,
      hideFooter: type === "view",
      contentRenderer: () => h(TableEditList, { ref: formRef }),
      beforeSure: (done) => {
        formRef.value.getRef().then(({ valid, data }) => {
          if (valid) {
            showMessageBox(`确认要${title}吗?`)
              .then(() => {
                onSubmitChange(type, title, _formData, () => {
                  done();
                  onSearch();
                });
              })
              .catch(console.log);
          }
        });
      }
    });
  };

  const onSubmitChange = (type: string, title: string, data, callback) => {
    const apiType = { edit: updateHelpDocList, add: insertHelpDocList };
    apiType[type](data).then((res) => {
      if (res.data) {
        message.success(title + "成功");
        callback();
      }
    });
  };

  const onEdit = () => {
    if (!curRow.value) return message.warning("请选择一条记录");
    openDialog("edit", curRow.value);
  };

  const onAdd = () => {
    openDialog("add");
  };

  const onDel = () => {
    if (!curRow.value) return message.warning("请选择一条记录");
    showMessageBox(`确认要删除吗?`)
      .then(() => {
        deleteHelpDocList({ documentId: curRow.value.documentId }).then((res) => {
          if (res.data || res.status === 200) {
            message.success("删除成功");
            curRow.value = null;
            onSearch();
          }
        });
      })
      .catch(console.log);
  };

  const onRollBack = () => {
    if (!curRow.value) return message.warning("请选择一条记录");
    const formRef = ref();
    addDialog({
      title: `回滚文档`,
      props: { id: curRow.value.id, docId: curRow.value.documentId },
      width: "800px",
      draggable: true,
      fullscreenIcon: true,
      okButtonText: "确认",
      closeOnClickModal: false,
      contentRenderer: () => h(Rollback, { ref: formRef }),
      beforeSure: (done) => {
        if (!formRef.value.rowData) return message.warning("请选择一条记录");
        showMessageBox(`确认要回滚?`)
          .then(() => {
            const rowInfo = formRef.value.rowData;

            rollBackHelpDocHistoryList({
              documentId: rowInfo.documentId,
              id: rowInfo.id,
              menuId: curRow.value.menuId,
              filePath: rowInfo.filePath
            }).then((res) => {
              if (res.data || res.status === 200) {
                message.success("回滚成功");
                done();
                onSearch();
              }
            });
          })
          .catch(console.log);
      }
    });
  };

  const buttonList = ref([
    { clickHandler: onAdd, type: "primary", text: "新增", isDropDown: false },
    { clickHandler: onEdit, type: "warning", text: "修改", isDropDown: false },
    { clickHandler: onDel, type: "danger", text: "删除", isDropDown: false },
    { clickHandler: onRollBack, type: "info", text: "回滚", isDropDown: true }
  ]);

  // 分页相关
  function onSizeChange(val: number) {
    formData.limit = val;
    onSearch();
  }

  function onCurrentChange(val: number) {
    formData.pageNo = val;
    onSearch();
  }

  const rowClick = (row) => {
    curRow.value = row;
  };

  const rowDbClick = (row) => {
    curRow.value = row;
    onEdit();
  };

  return {
    columns,
    onFresh,
    rowClick,
    handleTagSearch,
    searchOptions,
    buttonList,
    maxHeight,
    dataList,
    pagination,
    rowDbClick,
    onSizeChange,
    onCurrentChange
  };
};
