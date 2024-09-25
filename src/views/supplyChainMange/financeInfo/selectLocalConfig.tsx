import { onMounted, reactive, ref } from "vue";
import { type PaginationProps } from "@pureadmin/table";
import { fetchBankLocalList } from "@/api/supplyChain";
import { PAGE_CONFIG } from "@/config/constant";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";

let formData = reactive({ fnumber: "", fname: "", page: 1, limit: PAGE_CONFIG.pageSize });

const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });

const searchOptions = reactive<SearchOptionType[]>([{ label: "联行号", value: "fnumber" }]);

export const getConfig = () => {
  // 我发起
  const columns: TableColumnList[] = [
    { label: "", align: "center", width: 62, cellRenderer: () => <el-radio label="&nbsp;" size="small" /> },

    {
      label: "序号",
      align: "center",
      type: "index",
      width: 65,
      cellRenderer: ({ $index }) => <span>{$index + 1}</span>
    },

    { label: "银联号", prop: "FNUMBER" },
    { label: "银行名称", prop: "FNAME" },
    { label: "银行", prop: "BANK" },
    { label: "国别", prop: "FCOUNTRY" },
    { label: "省份", prop: "FPROVINCE" },
    { label: "城市", prop: "FCITY" },
    { label: "地区", prop: "FDISTRICT" },
    { label: "地区码", prop: "FDISTRICTCODE" }
  ];

  return columns;
};

export function useLocalTable() {
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
    fetchBankLocalList({ ...formData })
      .then((res: any) => {
        const data = res.data;
        dataList.value = data.records || [];
        pagination.total = data.total;
      })
      .finally(() => (loading.value = false));
  };

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
    handleTagSearch,
    searchOptions,
    handleSizeChange,
    handleCurrentChange,
    pagination
  };
}
