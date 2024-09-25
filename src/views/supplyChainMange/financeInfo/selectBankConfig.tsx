import { onMounted, reactive, ref } from "vue";
import { type PaginationProps } from "@pureadmin/table";
import { fetchBankList } from "@/api/supplyChain";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { PAGE_CONFIG } from "@/config/constant";

const columnsDragDom = ref([]);
const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });

const searchOptions = reactive<SearchOptionType[]>([{ label: "编号", value: "number" }]);

let formData = reactive({ number: "", name: "", page: 1, limit: PAGE_CONFIG.pageSize });

export const getConfig = () => {
  const columnsDrag: any[] = [
    { label: "选择" },
    { label: "序号", prop: "index" },

    { label: "用户编号", prop: "FNUMBER" },
    { label: "用户名称", prop: "FNAME" }
  ];

  // 我发起
  const columns: TableColumnList[] = [
    { label: "", align: "center", width: 40, cellRenderer: () => <el-radio label="&nbsp;" size="small" /> },

    {
      label: "序号",
      align: "center",
      type: "index",
      width: 65,
      cellRenderer: ({ $index }) => <span>{$index + 1}</span>
    },
    {
      label: "编码",
      width: 80,
      prop: (index) => columnsDragDom.value[index].prop as string
    },
    { label: "名称", prop: (index) => columnsDragDom.value[index].prop as string }
  ];

  columnsDragDom.value = columnsDrag;

  return columns;
};

export function useBankTable() {
  const columns = ref<TableColumnList[]>([]);
  const dataList: any = ref([]);
  const currentBankRow = ref({});

  const loading = ref(false);
  onMounted(() => {
    onSearch();
  });

  const onSearch = () => {
    loading.value = true;

    columns.value = getConfig();
    fetchBankList({ ...formData })
      .then((res: any) => {
        const data = res.data;
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
    currentBankRow.value = row;

    if (typeof setA === "function") setA({ ...row });
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

  const handleTagSearch = (values = {}) => {
    const { page, limit } = formData;
    Object.keys(values)?.forEach((key) => {
      formData[key] = values[key];
    });
    formData = { ...values };

    formData.page = page;
    formData.limit = limit;
    onSearch();
  };

  return {
    columns,
    dataList,
    loading,
    onSearch,
    rowClick,
    handleSizeChange,
    handleCurrentChange,
    pagination,
    formData,
    handleTagSearch,
    searchOptions
  };
}
