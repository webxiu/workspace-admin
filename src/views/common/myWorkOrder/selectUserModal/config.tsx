import { onMounted, reactive, ref } from "vue";

import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { fetchDormitoryAllBuliding } from "@/api/oaManage/humanResources";
import { handleTree } from "@/utils/tree";
import { menuList } from "@/api/systemManage";
import { setColumn } from "@/utils/table";

export function useUserTable(props) {
  const columns = ref<TableColumnList[]>([]);
  const dataList: any = ref([]);
  const modalTableRef = ref();
  const currentMultipRow: any = ref({});
  let searchFormData: any = reactive({});
  const curSingleRow: any = ref({});

  const searchOptions = reactive<SearchOptionType[]>([
    {
      label: "模块类型",
      value: "menuType",
      children: [
        { label: "目录", value: "目录" },
        { label: "菜单", value: "菜单" }
      ]
    }
  ]);

  const loading = ref(false);
  onMounted(() => {
    getConfig();
    onSearch();
  });

  const getConfig = () => {
    // 我发起
    const columnData: TableColumnList[] = [
      {
        label: "模块名称",
        prop: "menuName"
      },
      { label: "模块类型", prop: "menuType" }
    ];

    columns.value = setColumn({ columnData, operationColumn: false });
  };

  const onSearch = () => {
    loading.value = true;
    searchOptions[0].children = [
      { label: "目录", value: "目录" },
      { label: "菜单", value: "菜单" }
    ];
    menuList({})
      .then((res: any) => {
        if (res.data) {
          console.log(searchFormData, "searchFormData");
          let result = res.data;

          if (searchFormData.menuType) {
            result = res.data.filter((item) => item.menuType === searchFormData.menuType);
          }

          if (searchFormData.menuName) {
            result = res.data.filter((item) => item.menuName === searchFormData.menuName);
          }

          if (searchFormData.menuType && searchFormData.menuName) {
            result = res.data.filter((item) => item.menuName === searchFormData.menuName && item.menuType === searchFormData.menuType);
          }

          dataList.value = handleTree(result, "menuCode", "parentCode", "children");
        }
      })
      .finally(() => (loading.value = false));
  };

  const handleTagSearch = (values = {}) => {
    searchFormData = { ...values };
    onSearch();
  };

  // 点击行
  const rowClick = (row, column, event, setA) => {
    curSingleRow.value = row;
    // modalTableRef.value?.getTableRef()?.toggleRowSelection(row);
    setA(curSingleRow.value);
  };

  const selectMultipeChange = (data, setA) => {
    currentMultipRow.value = data;
    setA(curSingleRow.value);
  };

  return {
    columns,
    dataList,
    selectMultipeChange,
    handleTagSearch,
    searchOptions,
    modalTableRef,
    loading,
    onSearch,
    rowClick
  };
}
