import { onMounted, reactive, ref } from "vue";
import { type PaginationProps } from "@pureadmin/table";

import { downloadDataToExcel, getMenuColumns, setColumn, tableEditRender } from "@/utils/table";
import { useEleHeight } from "@/hooks";

import { PAGE_CONFIG } from "@/config/constant";
import { getBOMTableRowSelectOptions } from "@/api/plmManage";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { getApiList, initApiList, updateApiList } from "@/api/systemManage";
import { showMessageBox } from "@/utils/message";
import { ElMessage } from "element-plus";
import { MessageBox, PriceTag, Download } from "@element-plus/icons-vue";

export const useApiList = () => {
  const columns = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref([]);
  const rowData = ref();
  const authTypeOpts = ref([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49 + 45);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });

  const formData = reactive({
    className: "",
    methodName: "",
    permissionType: "",
    remark: "",
    page: 1,
    limit: PAGE_CONFIG.pageSize
  });
  const searchOptions = ref<SearchOptionType[]>([
    { label: "类名", value: "className" },
    { label: "方法名", value: "methodName" },
    { label: "权限类型", value: "permissionType", children: [] },
    { label: "说明", value: "remark" }
  ]);

  onMounted(() => {
    getColumnConfig();
    fetchOptions();
    onSearch();
  });
  // 编辑表格
  const { editCellRender } = tableEditRender();

  const fetchOptions = () => {
    getBOMTableRowSelectOptions({ optioncode: "PermissionType" }).then((res) => {
      if (res.data) {
        authTypeOpts.value = res.data[0]?.optionList || [];
        searchOptions.value[2].children = res.data[0]?.optionList.map((item) => ({ label: item.optionName, value: item.optionValue }));
      }
    });
  };

  const getColumnConfig = async () => {
    const authTypeRender = (data) => editCellRender({ type: "select", data, options: authTypeOpts.value, cellStyle: { color: "#606266", textAlign: "left" } });
    let columnData: TableColumnList[] = [
      { label: "接口", prop: "mappingUrl" },
      { label: "类名", prop: "className" },
      { label: "方法名", prop: "methodName" },
      { label: "说明", prop: "remark" },
      { label: "权限类型", prop: "permissionType", minWidth: 120, cellRenderer: authTypeRender }
    ];
    const { columnArrs } = await getMenuColumns([{ permissionType: authTypeRender }]);
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    columns.value = setColumn({ columnData, operationColumn: false });
  };

  const onRefresh = () => {
    getColumnConfig();
    onSearch();
  };

  const onTagSearch = (values) => {
    Object.assign(formData, values);
    onSearch();
  };
  const onSearch = () => {
    loading.value = true;
    getApiList(formData)
      .then((res: any) => {
        const data = res.data;
        loading.value = false;
        dataList.value = data.records.map((item) => ({ ...item, permissionType: item.permissionType + "" })) || [];
        pagination.total = data.total;
      })
      .catch((err) => (loading.value = false));
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

  const onCurrentChange = (row) => {
    if (!row) return;
    rowData.value = row;
  };

  const onExport = () => {
    downloadDataToExcel({
      dataList: dataList.value,
      columns: columns.value,
      sheetName: "接口集表"
    });
  };

  const onInit = () => {
    showMessageBox("确认要初始化接口集吗?")
      .then(() => {
        initApiList({}).then((res) => {
          if (res.data || res.status === 200) {
            ElMessage({ message: "初始化成功", type: "success" });
            onSearch();
          }
        });
      })
      .catch(console.log);
  };

  const onSave = () => {
    showMessageBox("确认要保存修改吗?")
      .then(() => {
        updateApiList(dataList.value).then((res) => {
          if (res.data || res.status === 200) {
            ElMessage({ message: "保存成功", type: "success" });
            onSearch();
          }
        });
      })
      .catch(console.log);
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onSave, type: "success", text: "保存", icon: MessageBox, isDropDown: false },
    { clickHandler: onInit, type: "primary", text: "获取接口", icon: PriceTag, isDropDown: true },
    { clickHandler: onExport, type: "primary", text: "导出", icon: Download, isDropDown: true }
  ]);

  return {
    columns,
    dataList,
    loading,
    maxHeight,
    searchOptions,
    pagination,
    buttonList,
    onRefresh,
    onTagSearch,
    onCurrentChange,
    handleSizeChange,
    handleCurrentChange
  };
};
