import { getEnumDictList, getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { h, onMounted, reactive, ref } from "vue";

import { PAGE_CONFIG } from "@/config/constant";
import { PaginationProps } from "@pureadmin/table";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { addDialog } from "@/components/ReDialog";
import detail from "./detail/index.vue";
import { message } from "@/utils/message";
import { useEleHeight } from "@/hooks";

export const useConfig = () => {
  const columns = ref([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 95);
  const dataList = ref([]);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const searchOptions = reactive<SearchOptionType[]>([
    { label: "严重度", value: "severity", children: [] },
    { label: "分类", value: "categorize", children: [] },
    { label: "日期范围", value: "date", type: "daterange", format: "YYYY-MM-DD", startKey: "startDate", endKey: "endDate" }
  ]);
  const currentRow = ref();
  const formData = reactive({ page: 1, limit: PAGE_CONFIG.pageSize });

  const fetchOpts = () => {
    getEnumDictList(["LoseModeListSeverity", "LoseModeListCategorize"]).then((res) => {
      searchOptions[0].children = res.LoseModeListSeverity;
      searchOptions[1].children = res.LoseModeListCategorize;
    });
  };

  onMounted(() => {
    fetchOpts();
    getConfig(buttonList);
  });

  const getConfig = async (buttonList) => {
    let columnData: TableColumnList[] = [
      { label: "项目/功能", prop: "projectFunc", width: 140 },
      { label: "潜在失效模式", prop: "latentMode", width: 140 },
      { label: "潜在失效模式后果", prop: "latentModeResult", width: 140 },
      { label: "严重度", prop: "severity", width: 140 },
      { label: "分类", prop: "categorize", width: 140 },
      { label: "潜在失效原因", prop: "latentReason", width: 140 },
      { label: "预防措施", prop: "precaution", width: 140 },
      { label: "建议措施", prop: "suggestion", width: 140 },
      { label: "确认结果", prop: "confirmResult", width: 140 },
      { label: "责任人", prop: "resUserName", width: 140 },
      { label: "完成时间", prop: "finishDate", width: 140 }
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

  const onFresh = () => {};

  const onAdd = () => {
    openDialog("add");
  };

  const openDialog = (type, row?) => {
    const detailRef = ref();

    const titleMap = { add: "新增", edit: "修改" };

    addDialog({
      title: `${titleMap[type]}失效模式清单`,
      class: "loseMode-list-modal",
      width: "1700px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(detail, { ref: detailRef }),
      beforeSure: (done) => {
        console.log(detailRef.value.tableConfList, "tableConfList===");
        message.warning("接口未接入");
        done();
      }
    });
  };

  const onSearch = () => {
    pagination.total = 0;
    dataList.value = [];
  };

  const onEdit = () => {
    if (!currentRow.value) return message.warning("请选择记录");
    openDialog("edit", currentRow.value);
  };

  const handleTagSearch = (values) => {
    Object.assign(formData, values);
  };

  const onExport = () => {
    message.warning("功能未开发");
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

  const onDel = () => {
    if (!currentRow.value) return message.warning("请选择记录");
    console.log("del", currentRow.value);
  };

  const rowClick = (row) => {
    currentRow.value = row;
  };

  const buttonList = ref([
    { clickHandler: onAdd, type: "primary", text: "新增", isDropDown: false },
    { clickHandler: onEdit, type: "warning", text: "修改", isDropDown: false },
    { clickHandler: onDel, type: "danger", text: "删除", isDropDown: false },
    { clickHandler: onExport, type: "info", text: "导出", isDropDown: true }
  ]);

  return { columns, onFresh, handleTagSearch, rowClick, searchOptions, buttonList, maxHeight, dataList, pagination, onSizeChange, onCurrentChange };
};
