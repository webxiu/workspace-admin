import { onMounted, reactive, ref, h } from "vue";
import { type PaginationProps } from "@pureadmin/table";

import { ElMessage, ElMessageBox } from "element-plus";
import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import EditForm from "@/components/EditForm/index.vue";

import { useEleHeight } from "@/hooks";
import {
  addDeliveryInfo,
  deleteDeliveryInfo,
  editDeliveryInfo,
  exportDeliveryTemplateList,
  getDeliveryRightURLList,
  getDeliveryTemplateList
} from "@/api/plmManage";
import { addDialog } from "@/components/ReDialog";
import { formConfigs, formRules } from "./config";
import { message } from "@/utils/message";
import { PAGE_CONFIG } from "@/config/constant";
import { cloneDeep } from "@pureadmin/utils";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const columns2 = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const loading2 = ref<boolean>(false);
  const dataList = ref([]);
  const dataList2: any = ref([]);
  const rowData = ref();
  const productCategoryIdList = ref([]);
  const currentLeftRow: any = ref({});

  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49 + 52);
  const tableSelectedList = ref([]);

  let formData: any = reactive({
    name: "",
    number: "",
    urlAddress: "",
    select: "",
    page: 1,
    limit: PAGE_CONFIG.pageSize
  });

  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const searchOptions: any[] = reactive([
    { label: "交付物名称", value: "name" },
    {
      label: "产品种类",
      value: "productCategoryIdList",
      children: []
    },
    { label: "URL地址", value: "urlAddress" }
  ]);

  onMounted(() => {
    getColumnConfig(buttonList);

    onSearch();
    onSearch2();
  });

  const getColumnConfig = async (buttonList) => {
    let columnData: TableColumnList[] = [
      { label: "", prop: "", align: "center", width: 62, slot: "choice" },
      { label: "序号", type: "index", prop: "index", width: 60 },
      { label: "交付物编码", prop: "number", width: 110 },
      { label: "交付物名称", prop: "name", minWidth: 180 },
      { label: "创建人", prop: "createUserName" },
      { label: "创建时间", prop: "createDate", width: 170 },
      { label: "最后修改人", prop: "modifyUserName", width: 150 },
      { label: "最后修改时间", prop: "modifyDate", width: 170 }
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

  const getColumnConfig2 = () => {
    const columnData: TableColumnList[] = [
      { label: "URL地址", prop: "urlAddress" },
      {
        label: "应用产品种类",
        prop: "templateProductEntryList",
        cellRenderer({ row }) {
          return row.templateProductEntryList
            .map((item) => item.name)
            .filter((item) => item)
            .join("、");
        }
      }
    ];
    columns2.value = setColumn({ columnData, operationColumn: false });
  };

  const onSearch = () => {
    const cloneData = cloneDeep(formData);

    cloneData.select = String(cloneData.productCategoryIdList || "");
    cloneData.productCategoryIdList = undefined;
    loading.value = true;
    getDeliveryTemplateList(cloneData)
      .then((res: any) => {
        const data = res.data;
        loading.value = false;
        dataList.value = data.records || [];
        pagination.total = data.total;
      })
      .catch((err) => (loading.value = false));
  };

  const onFresh = () => {
    getColumnConfig(buttonList);
    onSearch();
  };

  const onSearch2 = () => {
    getColumnConfig2();
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
    openDialog("add");
  };

  const openDialog = async (type: string, row?) => {
    const titleObj = { add: "新增", edit: "修改" };
    const title = titleObj[type];
    const formRef = ref();

    const _formData = reactive({
      name: row?.name ?? "",
      number: row?.number ?? "",
      pageUrl: row?.pageUrl ?? "",
      serviceName: row?.serviceName ?? "",
      id: row?.id ?? "",
      deliverableTemplateEntryList: row?.deliverableTemplateEntryList ?? []
    });

    addDialog({
      title: `${title}交付物`,
      props: {
        formInline: _formData,
        formRules: formRules,
        formConfigs: formConfigs(row?.id ?? "")
      },
      width: "600px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.validate(async (valid) => {
          if (valid) {
            ElMessageBox.confirm(`确认要${title}吗?`, "系统提示", {
              type: "warning",
              draggable: true,
              cancelButtonText: "取消",
              confirmButtonText: "确定",
              dangerouslyUseHTMLString: true
            }).then(() => {
              onSubmitChange(type, title, _formData, () => {
                done();
                onSearch();
              });
            });
          }
        });
      }
    });
  };

  const tipError = (tableItem) => {
    if (!tableItem.urlAddress) {
      ElMessage({ message: `URL地址不能为空`, type: "error" });
      return false;
    }
    if (!tableItem.templateProductEntryList.length) {
      ElMessage({ message: `应用产品种类不能为空`, type: "error" });
      return false;
    }

    return true;
  };
  const onSubmitChange = (type: string, title: string, data, callback) => {
    if (!data.deliverableTemplateEntryList.length) {
      ElMessage({ message: `子项表格不能为空`, type: "error" });
      return;
    }
    const validArr = data.deliverableTemplateEntryList.map((el) => tipError(el));

    if (validArr.some((item) => !item)) return;
    data.deliverableTemplateEntryList = data.deliverableTemplateEntryList.map((item) => {
      return {
        ...item,
        templateProductEntryList: item.templateProductEntryList.map((el) => ({ productCategoryId: el }))
      };
    });

    console.log(data, "submitData");

    const API = { add: addDeliveryInfo, edit: editDeliveryInfo };
    API[type](data)
      .then((res) => {
        if (res.data) {
          callback();
          message(`${title}成功`);
        }
      })
      .catch(console.log);
  };

  // 多选表格行
  const handleSelectionChange = (row) => {
    tableSelectedList.value = row;
  };

  const onEdit = () => {
    if (JSON.stringify(currentLeftRow.value) === "{}") {
      ElMessage({ message: "请选择记录", type: "warning" });
      return;
    }
    openDialog("edit", currentLeftRow.value);
  };

  const onDelete = () => {
    if (JSON.stringify(currentLeftRow.value) !== "{}") {
      const row = currentLeftRow.value;
      ElMessageBox.confirm(`确认要删除名称为【${row.name}】的记录吗?`, "系统提示", {
        type: "warning",
        draggable: true,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          loading.value = true;
          deleteDeliveryInfo({ id: row.id }).then((res) => {
            if (res.data) {
              ElMessage({ message: `删除成功`, type: "success" });
              dataList2.value = [];
              currentLeftRow.value = {};
              onSearch();
            }
          });
        })
        .catch(() => {})
        .finally(() => (loading.value = false));
    } else {
      ElMessage({ message: `请选择记录`, type: "warning" });
    }
  };
  const onExport = async () => {
    loading.value = true;
    const calcHeader = columns.value
      .map((item, index) => {
        return { field: item.prop, title: item.label, width: 160, key: `0-${index}`, hide: false, colspan: 1, rowspan: 1, type: "normal", colGroup: false };
      })
      .filter((el) => el.field && el.field !== "index");

    const headConfig = {
      excel: {
        excelName: "交付物管理",
        excelHeader: JSON.stringify(calcHeader)
      },
      ...formData,
      page: 1,
      limit: 100000
    };

    exportDeliveryTemplateList(headConfig)
      .then((res: any) => {
        window.open("/api" + res.data, "_blank");
      })
      .catch((err) => {
        console.log("err", err);
      })
      .finally(() => (loading.value = false));
  };

  const leftRowDbClick = (row) => {
    loading2.value = true;
    getDeliveryRightURLList({ deliverableId: row.id })
      .then((res) => {
        if (res.data) {
          dataList2.value = res.data;
        }
      })
      .finally(() => (loading2.value = false));
  };

  const removeTag = () => {
    onSearch();
  };

  const leftRowClick = (row) => {
    currentLeftRow.value = row;
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "新增" },
    { clickHandler: onEdit, type: "warning", text: "修改" },
    { clickHandler: onDelete, type: "danger", text: "删除" },
    { clickHandler: onExport, type: "info", text: "导出", isDropDown: true }
  ]);

  return {
    loading,
    loading2,
    columns,
    columns2,
    dataList,
    dataList2,
    maxHeight,
    pagination,
    searchOptions,
    onSearch,
    onFresh,
    onSearch2,
    onAdd,
    onEdit,
    onDelete,
    onExport,
    handleTagSearch,
    onCurrentChange,
    handleSizeChange,
    leftRowDbClick,
    removeTag,
    buttonList,
    leftRowClick,
    handleCurrentChange,
    handleSelectionChange,
    productCategoryIdList
  };
};
