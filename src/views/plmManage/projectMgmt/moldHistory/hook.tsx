import { addDialog } from "@/components/ReDialog";
import detail from "./detail/index.vue";
import { h, onMounted, reactive, ref } from "vue";
import { message } from "@/utils/message";
import { useEleHeight } from "@/hooks";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { PAGE_CONFIG } from "@/config/constant";
import { PaginationProps } from "@pureadmin/table";
import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";

export const useConfig = () => {
  const columns = ref([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 95);
  const dataList = ref([]);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const searchOptions = reactive<SearchOptionType[]>([
    { label: "产品型号", value: "productModel" },
    { label: "模具编号", value: "moldNo" },
    { label: "零件名称", value: "partName" }
  ]);
  const currentRow = ref();
  const projectStageOpts = ref([]);
  const formData = reactive({ page: 1, limit: PAGE_CONFIG.pageSize });

  onMounted(() => {
    getConfig(buttonList);
  });

  const getConfig = async (buttonList) => {
    let columnData: TableColumnList[] = [
      { label: "产品型号", prop: "productModel", width: 140 },
      { label: "产品名称", prop: "productName", width: 140 },
      { label: "模具编号", prop: "moldNo", width: 140 },
      { label: "模具型腔数", prop: "thoraxNum", width: 140 },
      { label: "前模芯材料", prop: "beforeMaterial", width: 140 },
      { label: "后模芯材料", prop: "afterMaterial", width: 140 },
      { label: "塑胶原料", prop: "plasticMaterial", width: 140 },
      { label: "缩水率", prop: "shrinkRate", width: 140 },
      { label: "零件名称", prop: "partName", width: 140 },
      { label: "产品表面要求", prop: "surfaceReq", width: 140 }
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
      title: `${titleMap[type]}模具修改履历表`,
      class: "eidt-history-mold-modal",
      width: "1200px",
      props: { projectStageOpts },
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(detail, { ref: detailRef }),
      beforeSure: (done) => {
        console.log(detailRef.value, "detailRef===");
        message("接口未接入", { type: "warning" });
        done();
      }
    });
  };

  const onSearch = () => {
    pagination.total = 0;
    dataList.value = [];
  };

  const onEdit = () => {
    if (!currentRow.value) return message("请选择记录", { type: "warning" });
    openDialog("edit", currentRow.value);
  };

  const handleTagSearch = (val) => {
    formData["productModel"] = val.productModel;
    formData["productName"] = val.productName;
    formData["moldNo"] = val.moldNo;
    formData["partName"] = val.partName;
  };

  const onExport = () => {
    message("功能未开发", { type: "warning" });
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
    if (!currentRow.value) return message("请选择记录", { type: "warning" });
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