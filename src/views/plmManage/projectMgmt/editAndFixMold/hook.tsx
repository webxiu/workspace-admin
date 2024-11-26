import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
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
    { label: "产品型号", value: "productModel" },
    { label: "模具编号", value: "moldNo" },
    { label: "零件名称", value: "partName" },
    { label: "日期范围", value: "date", type: "daterange", format: "YYYY-MM-DD", startKey: "startDate", endKey: "endDate" }
  ]);
  const currentRow = ref();
  const projectStageOpts = ref([]);
  const formData = reactive({ page: 1, limit: PAGE_CONFIG.pageSize });

  onMounted(() => {
    getConfig(buttonList);
  });

  const getConfig = async (buttonList) => {
    let columnData: TableColumnList[] = [
      { label: "编号", prop: "billNo", width: 140 },
      { label: "收件单位", prop: "receivingPlace", width: 140 },
      { label: "收件人", prop: "receivingUserName", width: 140 },
      { label: "发件单位", prop: "sendPlace", width: 140 },
      { label: "发件人", prop: "sendUserName", width: 140 },
      { label: "分发部门", prop: "dispatchDept", width: 140 },
      { label: "发件日期", prop: "sendDate", width: 140 },
      { label: "产品型号", prop: "productModel", width: 140 },
      { label: "产品名称", prop: "productName", width: 140 },
      { label: "模具编号", prop: "moldNo", width: 140 },
      { label: "零件名称", prop: "partName", width: 140 },
      { label: "材料", prop: "material", width: 140 },
      { label: "更改次数", prop: "changeCount", width: 140 },
      { label: "要求完成日期", prop: "reqFinishDate", width: 140 },
      { label: "回复完成日期", prop: "replyFinishDate", width: 140 },
      { label: "责任人", prop: "resUserName", width: 140 },
      { label: "改模/修模原因", prop: "reason", width: 140 },
      { label: "3D名称", prop: "threeDName", width: 140 },
      { label: "试模要求", prop: "tryReq", width: 140 },
      { label: "参考ECN编号", prop: "ecnNo", width: 140 },
      { label: "旧物料处理", prop: "oldMaterialResolve", width: 140 }
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
      title: `${titleMap[type]}改模修模确认单`,
      class: "eidt-fix-mold-modal",
      // width: "1100px",
      width: "1300px",
      props: { projectStageOpts },
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(detail, { ref: detailRef }),
      beforeSure: (done) => {
        console.log(detailRef.value.formData, "formData===");
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

  const handleTagSearch = (values) => {
    Object.assign(formData, values);
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
