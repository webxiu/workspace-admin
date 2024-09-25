import {
  deleteDeliveralbeChangeInfo,
  fetchProjectTaskDeliversChangeList,
  revokeProjectTaskDeliverableInfo,
  submitProjectTaskDeliversChange
} from "@/api/plmManage";
import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { h, onMounted, reactive, ref } from "vue";
import { message, showMessageBox } from "@/utils/message";
import { utils, write } from "xlsx";

import NodeDetailList from "@/components/NodeDetailList/index.vue";
import { PAGE_CONFIG } from "@/config/constant";
import { PaginationProps } from "@pureadmin/table";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { addDialog } from "@/components/ReDialog";
import { commonDeliverChangeAction } from "./utils/hook";
import { saveAs } from "file-saver";
import { useEleHeight } from "@/hooks";

export const useMachine = () => {
  const dataList = ref([]);
  const columns = ref<TableColumnList[]>([]);
  const loading = ref(false);
  const currentRow = ref();
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 95);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const changeTableRef = ref();
  const formData: any = reactive({
    page: 1,
    limit: PAGE_CONFIG.pageSize
  });

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "项目名称", value: "projectName" },
    { label: "时间范围", value: "date", type: "daterange", format: "YYYY-MM-DD" }
  ]);

  onMounted(() => {
    getColumnConfig();
    onSearch();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "项目名称", prop: "projectName" },
      { label: "变更备注", prop: "changeNote" },
      { label: "操作人", prop: "createUserName" },
      { label: "操作时间", prop: "createUserDate" }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [menuCols] = columnArrs;
    if (menuCols?.length) columnData = menuCols;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false });
    return columnData;
  };

  const onSearch = () => {
    if (formData.date) {
      const [startDate, endDate] = formData.date.split("~").map((item) => item.trim());
      formData.startDate = startDate;
      formData.endDate = endDate;
    }
    fetchProjectTaskDeliversChangeList(formData).then((res: any) => {
      if (res.data) {
        dataList.value = res.data.records || [];
        pagination.total = res.data.total;
        if (currentRow.value) {
          const findIndex = dataList.value.findIndex((item) => item.id === currentRow.value.id);
          if (findIndex >= 0) {
            changeTableRef.value?.getTableRef()?.setCurrentRow(dataList.value[findIndex]);
          }
        }
      }
    });
    dataList.value = [];
  };

  const onFresh = () => {
    getColumnConfig();
    onSearch();
  };

  const handleTagSearch = (val) => {
    formData.createUserName = val.createUserName;
    formData.projectName = val.projectName;
    formData.date = val.date;
    onSearch();
  };

  const onAdd = () => {
    addNewChangeDialog("add"); // 新的变更页面
  };

  const addNewChangeDialog = (type) => {
    commonDeliverChangeAction({ type }, onSearch); //改造后公共的变更弹窗
  };

  const onExportAction = () => {
    const timeStep = Date.now();
    const workbook = utils.table_to_book(document.querySelector("#machineTableId"), {
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
      `交付物变更${timeStep}.xlsx`
    );
  };

  const onSubmit = () => {
    if (!currentRow.value) return message("请选择一条记录", { type: "warning" });
    if (![0, 3].includes(currentRow.value.billState)) {
      return message("当前状态不能进行提交", { type: "error" });
    }
    showMessageBox(`确认要提交项目名称为【${currentRow.value.projectName}】的变更吗?`)
      .then(() => {
        submitProjectTaskDeliversChange({ billId: "10054", billNo: currentRow.value.billNo }).then((res) => {
          if (res.data || res.status === 200) {
            message("提交成功");
            onSearch();
          }
        });
      })
      .catch(console.log);
  };

  const onViewDetail = () => {
    if (!currentRow.value) return message("请选择一条记录", { type: "warning" });
    addDialog({
      title: "查看审批节点详情",
      width: "900px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: true,
      hideFooter: true,
      contentRenderer: ({ options }) =>
        h(NodeDetailList, { options, billNo: currentRow.value?.billNo, billType: "deliverableChange", billState: +currentRow.value?.billState })
    });
  };

  const onDelete = () => {
    if (!currentRow.value) return message("请选择一条记录", { type: "warning" });

    if (![1, 2].includes(currentRow.value.billState)) {
      showMessageBox(`确认要删除项目名称为【${currentRow.value.projectName}】的变更吗?`)
        .then(() => {
          deleteDeliveralbeChangeInfo({ id: currentRow.value.id }).then((res) => {
            if (res.status === 200 || res.data) {
              message("删除成功", { type: "success" });
              currentRow.value = null;
              onSearch();
            }
          });
        })
        .catch(console.log);
    } else {
      message("当前状态不能进行删除", { type: "error" });
    }
  };
  const onRevoke = () => {
    if (!currentRow.value) return message("请选择一条记录", { type: "warning" });
    if (currentRow.value.billState == 1) {
      showMessageBox(`确认要撤销项目名称为【${currentRow.value.projectName}】的变更吗?`)
        .then(() => {
          revokeProjectTaskDeliverableInfo({ billNo: currentRow.value.billNo }).then((res) => {
            if (res.status === 200 || res.data) {
              message("撤销成功", { type: "success" });
              onSearch();
            }
          });
        })
        .catch(console.log);
    } else {
      message("只有审核中才能进行撤销", { type: "error" });
    }
  };

  const buttonList = ref([
    { clickHandler: onAdd, type: "primary", text: "新增", isDropDown: false },
    { clickHandler: onDelete, type: "danger", text: "删除", isDropDown: false },
    { clickHandler: onSubmit, type: "primary", text: "提交", isDropDown: true },
    { clickHandler: onRevoke, type: "warning", text: "撤销", isDropDown: true },
    { clickHandler: onViewDetail, type: "primary", text: "审批详情", isDropDown: true },
    { clickHandler: onExportAction, type: "primary", text: "导出", isDropDown: true }
  ]);

  // 分页相关
  function onSizeChange(val: number) {
    formData.limit = val;
    onSearch();
  }

  function onCurrentChange(val: number) {
    formData.page = val;
    onSearch();
  }

  const rowClick = (row) => {
    currentRow.value = row;
  };

  const rowDbClick = (row) => {
    commonDeliverChangeAction({ type: "view", row: { id: row.id }, freshDeliverableNow: true });
  };

  const onCurrentRowChange = (row) => {
    if (!row) return;
    currentRow.value = row;
  };

  return {
    columns,
    onFresh,
    handleTagSearch,
    rowClick,
    rowDbClick,
    searchOptions,
    buttonList,
    maxHeight,
    loading,
    dataList,
    changeTableRef,
    pagination,
    onSizeChange,
    onCurrentRowChange,
    onCurrentChange
  };
};
