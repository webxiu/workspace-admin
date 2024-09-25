import { onMounted, reactive, ref } from "vue";
import { type PaginationProps } from "@pureadmin/table";
import { utils, write } from "xlsx";
import { ElMessage, ElMessageBox } from "element-plus";
import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { useEleHeight } from "@/hooks";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { addSupplierCount, fetchSupplierList } from "@/api/supplyChain";
import { saveAs } from "file-saver";
import { PAGE_CONFIG } from "@/config/constant";

import { Plus, Download } from "@element-plus/icons-vue";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref([]);
  const rowData = ref();
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49 + 52);
  const tableSelectedList = ref([]);
  const supplierTable = ref();

  let formData: any = reactive({
    fshortName: "",
    fcontact: "",
    getIsCreate: "",
    page: 1,
    limit: PAGE_CONFIG.pageSize
  });

  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const searchOptions: SearchOptionType[] = [
    { label: "简称", value: "fshortName" },
    { label: "联系人", value: "fcontact" },
    {
      label: "创建状态",
      value: "getIsCreate",
      children: [
        { label: "是", value: "true" },
        { label: "否", value: "false" }
      ]
    }
  ];

  onMounted(() => {
    getColumnConfig();
    onSearch();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "供应商编码", prop: "fnumber" },
      { label: "简称", prop: "fshortName" },
      { label: "名称", prop: "fname", minWidth: 220 },
      { label: "联系人", prop: "fcontact" },
      { label: "默认联系人手机号", prop: "fmobile" },
      { label: "邮箱", prop: "femail" },
      { label: "非默认联系人信息", prop: "noDefaultFContact" },
      { label: "是否创建账号", prop: "userCode", slot: "userCode" }
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false, selectionColumn: { hide: false }, radioColumn: false });
  };

  const onRefresh = () => {
    getColumnConfig();
    onSearch();
  };

  const onSearch = () => {
    loading.value = true;
    fetchSupplierList(formData)
      .then((res) => {
        const data = res.data;
        loading.value = false;
        dataList.value = data.records || [];
        pagination.total = data.total;
      })
      .catch((err) => (loading.value = false));
  };

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

  // 添加单据
  const onAdd = () => {
    if (tableSelectedList.value.length) {
      ElMessageBox.confirm("确认创建所选账号？", "温馨提示", {
        type: "warning",
        draggable: true,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          loading.value = true;
          // 添加账号
          addSupplierCount(tableSelectedList.value)
            .then((res) => {
              if (res.data && res.status === 200) {
                ElMessage({
                  message: "创建成功",
                  type: "success"
                });
              }
              onSearch();
            })
            .finally(() => (loading.value = false));
        })
        .catch(() => {});

      return;
    }
    ElMessage({
      message: "您至少要选中一条记录行",
      type: "warning"
    });
  };

  // 多选表格行
  const handleSelectionChange = (row) => {
    tableSelectedList.value = row;
  };

  // 表格某一行的单击事件
  const rowClick = (row) => {
    // supplierTable.value?.getTableRef()?.toggleRowSelection(row);
  };

  const onExport = () => {
    const timeStep = Date.now();
    const workbook = utils.table_to_book(document.querySelector("#supplierTableId"), {
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
      `供应商表${timeStep}.xlsx`
    );
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "创建账号", icon: Plus, isDropDown: false },
    { clickHandler: onExport, type: "primary", text: "导出", icon: Download, isDropDown: true }
  ]);

  return {
    columns,
    dataList,
    loading,
    maxHeight,
    pagination,
    searchOptions,
    supplierTable,
    buttonList,
    onRefresh,
    handleTagSearch,
    onCurrentChange,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    rowClick
  };
};
