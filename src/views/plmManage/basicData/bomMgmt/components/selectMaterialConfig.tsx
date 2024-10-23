import { h, reactive, ref } from "vue";

import { ElMessage } from "element-plus";
import { PAGE_CONFIG } from "@/config/constant";
import { PaginationProps } from "@pureadmin/table";
import SelectModal from "./selectModel.vue";
import { addDialog } from "@/components/ReDialog";
import { selectMaterialInfo } from "@/api/plmManage";
import { setColumn } from "@/utils/table";

const currentRow = ref({});
const currentRowArr = ref([]);
const selectWay = ref("");

export const getConfig = () => {
  const columnData: TableColumnList[] = [
    { label: "物料编码", prop: "number" },
    { label: "物料名称", prop: "name" },
    { label: "物料规格", prop: "specification" },
    { label: "基本单位", prop: "baseUnitName" },
    { label: "最后修改人", prop: "modifyUserName" },
    { label: "最后修改时间", prop: "modifyDate" },
    { label: "创建人", prop: "createUserName" },
    { label: "创建时间", prop: "createDate" }
  ];

  if (selectWay.value === "single") {
    return setColumn({
      columnData,
      operationColumn: false,
      indexColumn: { hide: false },
      selectionColumn: { hide: true },
      radioColumn: { hide: false }
    });
  } else {
    return setColumn({ columnData, operationColumn: false, indexColumn: false, selectionColumn: { hide: false }, radioColumn: false });
  }
};

export function useMaterialTable() {
  const columns = ref<TableColumnList[]>([]);
  const dataList: any = ref([]);
  const loading = ref(false);
  const materialTableRef = ref();
  const isSingleTrueFlag = ref(false);
  const searchParams = reactive({ number: "", name: "", groupIdList: [], specification: "", selectBOM: false, page: 1, limit: PAGE_CONFIG.pageSize });

  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });

  const onSearch = (v) => {
    loading.value = true;
    console.log(isSingleTrueFlag.value, "is singletreu===");

    if (selectWay.value === "multiple") {
      v.selectBOM = true;
    }
    selectMaterialInfo({ ...v })
      .then((res: any) => {
        columns.value = getConfig();
        const data = res.data;
        loading.value = false;
        dataList.value = data.records || [];
        pagination.total = data.total;
      })
      .finally(() => (loading.value = false));
  };

  // 点击行
  const rowClick = (row, column, event, setA) => {
    if (event.target.tagName === "INPUT") {
      return;
    }

    console.log(column, "column vv");
    currentRow.value = row;
    materialTableRef.value?.getTableRef()?.toggleRowSelection(row);
  };

  const handleSelectionChange = (selections) => {
    currentRowArr.value = selections;
  };

  const handleSelectAction = (selectType, fn?, isSingleTrue?) => {
    isSingleTrueFlag.value = isSingleTrue;
    console.log(selectType, "选择的类型");
    selectWay.value = selectType;
    addDialog({
      title: `选择物料`,
      width: "70%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(SelectModal, { isSingleTrue }),
      beforeReset: (done, { options }) => {},
      beforeSure: (done, { options }) => {
        if (JSON.stringify(currentRow.value) !== "{}" && selectWay.value === "single") {
          fn(currentRow.value);
          done();
          return;
        } else if (currentRowArr.value.length && selectWay.value === "multiple") {
          fn(currentRowArr.value);
          done();
          return;
        }
        ElMessage({
          message: "请选择一条记录",
          type: "warning"
        });
      }
    });
  };

  // 分页相关
  function handleSizeChange(val: number) {
    searchParams.limit = val;
    onSearch({ ...searchParams });
  }

  function handleCurrentChange(val: number) {
    searchParams.page = val;
    onSearch({ ...searchParams });
  }

  return {
    columns,
    searchParams,
    dataList,
    handleSizeChange,
    pagination,
    handleCurrentChange,
    loading,
    isSingleTrueFlag,
    onSearch,
    handleSelectAction,
    materialTableRef,
    rowClick,
    handleSelectionChange
  };
}
