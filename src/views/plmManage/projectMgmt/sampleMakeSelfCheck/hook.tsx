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
    { label: "项目阶段", value: "pmStage", children: [] },
    { label: "生产单号", value: "productNumber" },
    { label: "日期范围", value: "date", type: "daterange", format: "YYYY-MM-DD", startKey: "startDate", endKey: "endDate" }
  ]);
  const currentRow = ref();
  const projectStageOpts = ref([]);
  const formData = reactive({ page: 1, limit: PAGE_CONFIG.pageSize });

  const getOpts = () => {
    getEnumDictList(["ProjectStage"]).then((res) => {
      if (res) {
        searchOptions[0].children = res["ProjectStage"].map((item) => ({ label: item.optionName, value: item.optionValue }));
      }
    });
  };

  onMounted(() => {
    getOpts();
    getConfig(buttonList);
  });

  const getConfig = async (buttonList) => {
    let columnData: TableColumnList[] = [
      { label: "样机型号", prop: "productModel", width: 140 },
      { label: "项目阶段", prop: "pmStage", width: 140 },
      { label: "样机生产单号", prop: "productNumber", width: 140 },
      { label: "样机生产数量", prop: "productAmount", width: 140 },
      { label: "日期", prop: "createDate", width: 140 }
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
      title: `${titleMap[type]}样机制作验证自检表`,
      width: "1600px",
      props: { projectStageOpts },
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(detail, { ref: detailRef }),
      beforeSure: (done) => {
        console.log(detailRef.value, "detailRef===");
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