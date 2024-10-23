import { ElMessage, ElMessageBox, FormRules } from "element-plus";
import {
  ProductClassifyManageItemType,
  deleteClassifyTableInfo,
  exportClassifyTableData,
  insertClassifyTableInfo,
  productClassifyManageList,
  updateClassifyTableInfo
} from "@/api/plmManage";
import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { h, onMounted, reactive, ref } from "vue";

import EditForm from "@/components/EditForm/index.vue";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { addDialog } from "@/components/ReDialog";
import { message } from "@/utils/message";
import { useEleHeight } from "@/hooks";

/** 获取产品分类管理列表 */
export const getProductClassifyList = (param) => {
  return new Promise<ProductClassifyManageItemType[]>((resolve, reject) => {
    productClassifyManageList(param)
      .then(({ data }) => {
        if (!data?.length) return resolve([]);
        const options = data.map((m) => ({ label: m.categoryName, value: m.id, ...m }));
        resolve(options);
      })
      .catch(reject);
  });
};

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref<ProductClassifyManageItemType[]>([]);
  const currentId = ref("");
  const currentRow: any = ref({});
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49);

  const formRules = reactive<FormRules>({
    categoryName: [{ required: true, message: "产品分类名称为必填项", trigger: "submit" }],
    categoryNo: [{ required: true, message: "产品分类编码为必填项", trigger: "submit" }]
  });

  let formData: any = reactive({
    categoryName: "",
    categoryNo: "",
    page: 1,
    limit: 10000
  });

  const searchOptions: SearchOptionType[] = [{ label: "产品分类名称", value: "categoryName" }];

  const formConfigs = () => [
    {
      label: "产品分类编码",
      prop: "categoryNo",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入产品分类编码" clearable />;
      }
    },
    {
      label: "产品分类名称",
      prop: "categoryName",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入账户名称" clearable />;
      }
    }
  ];

  onMounted(() => {
    getColumnConfig(buttonList);
    onSearch();
  });

  const getColumnConfig = async (buttonList) => {
    let columnData: TableColumnList[] = [
      { label: "产品分类编码", prop: "categoryNo" },
      { label: "产品分类名称", prop: "categoryName" },
      { label: "创建人", prop: "createUserName" },
      { label: "创建时间", prop: "createDate" },
      { label: "最后修改人", prop: "modifyUserName" },
      { label: "最后修改时间", prop: "modifyDate" }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [menuCols] = columnArrs;
    if (menuCols?.length) {
      columnData = menuCols;
    }
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData: JSON.parse(JSON.stringify(columnData)), operationColumn: false });
    return columnData;
  };

  const onSearch = (_rowIndex?) => {
    loading.value = true;
    getProductClassifyList(formData)
      .then((data) => {
        loading.value = false;
        dataList.value = data;
        if (typeof _rowIndex === "number" && _rowIndex >= 0) {
          currentRow.value = dataList.value[_rowIndex];
        } else {
          currentRow.value = {};
        }
      })
      .catch((err) => (loading.value = false));
  };

  const onFresh = () => {
    getColumnConfig(buttonList);
    onSearch();
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

  const onAdd = () => {
    openDialog("add");
  };

  const onEdit = () => {
    currentId.value = currentRow.value.id;
    openDialog("edit", currentRow.value);
  };

  const fetchRowData = (_formData, formLoading) => {
    getProductClassifyList({
      page: formData.page,
      categoryNo: currentRow.value.categoryNo,
      limit: formData.limit
    })
      .then((data) => {
        if (data && Array.isArray(data) && data.length === 1) {
          const dataRow = data[0];
          _formData.categoryNo = dataRow?.categoryNo;
          _formData.categoryName = dataRow?.categoryName;
        }
      })
      .finally(() => (formLoading.value = false));
  };

  const openDialog = async (type: string, row?) => {
    const titleObj = { add: "新增", edit: "修改" };
    const title = titleObj[type];
    const formRef = ref();
    const formLoading = ref(true);

    const _formData = reactive({
      categoryNo: "",
      categoryName: ""
    });

    fetchRowData(_formData, formLoading);

    addDialog({
      title: `${title}`,
      props: {
        loading: formLoading,
        formInline: _formData,
        formRules: formRules,
        formConfigs: formConfigs()
      },
      width: "400px",
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
                const _rowIndex = dataList.value.findIndex((item) => item.id === currentRow.value.id);
                onSearch(_rowIndex);
              });
            });
          }
        });
      }
    });
  };

  const onSubmitChange = (type: string, title: string, data, callback) => {
    if (type === "edit") data.id = currentId.value;

    const API = { add: insertClassifyTableInfo, edit: updateClassifyTableInfo };
    API[type](data)
      .then((res) => {
        if (res.data) {
          callback();
          message(`${title}成功`);
        }
      })
      .catch(console.log);
  };

  // 导出
  const onExport = async () => {
    loading.value = true;
    const calcHeader = columns.value
      .map((item, index) => {
        return { field: item.prop, title: item.label, width: 160, key: `0-${index}`, hide: false, colspan: 1, rowspan: 1, type: "normal", colGroup: false };
      })
      .filter((item) => item.field && item.field !== "index");

    const headConfig = {
      excel: {
        excelName: "产品分类管理",
        excelHeader: JSON.stringify(calcHeader)
      },
      ...formData,
      page: 1,
      limit: 100000
    };

    exportClassifyTableData(headConfig)
      .then((res: any) => {
        window.open("/api" + res.data, "_blank");
      })
      .catch((err) => {
        console.log("err", err);
      })
      .finally(() => (loading.value = false));
  };

  const onDelete = () => {
    const row = currentRow.value;
    ElMessageBox.confirm(`确认要删除编码为【${row.categoryNo}】的分类吗?`, "系统提示", {
      type: "warning",
      draggable: true,
      cancelButtonText: "取消",
      confirmButtonText: "确定",
      dangerouslyUseHTMLString: true
    })
      .then(() => {
        loading.value = true;
        deleteClassifyTableInfo({ id: row.id }).then((res) => {
          if (res.data) {
            ElMessage({ message: `删除成功`, type: "success" });
            // const _rowIndex = dataList.value.findIndex((item) => item.id === currentRow.value.id);
            // onSearch(_rowIndex);
            currentRow.value = {};
            onSearch();
          }
        });
      })
      .catch(() => {})
      .finally(() => (loading.value = false));
  };

  const beforeOnEdit = () => {
    console.log("beforeOnEdit");
    if (JSON.stringify(currentRow.value) == "{}" || !currentRow.value) {
      ElMessage({ message: "请选择一条记录", type: "warning" });
      return;
    } else {
      onEdit();
    }
  };

  const beforeOnDelete = () => {
    console.log("beforeOnDelete");
    if (JSON.stringify(currentRow.value) == "{}" || !currentRow.value) {
      ElMessage({ message: "请选择一条记录", type: "warning" });
      return;
    } else {
      onDelete();
    }
  };

  const rowClick = (row) => {
    currentRow.value = row;
  };

  const rowDbClick = (row) => {
    console.log("row db click", row);
    currentRow.value = row;
    onEdit();
  };

  const clickHandler = ({ text }) => {
    switch (text) {
      case "导出":
        onExport();
        break;
      case "新增":
        onAdd();
        break;
      case "修改":
        beforeOnEdit();
        break;
      case "删除":
        beforeOnDelete();
        break;

      default:
        break;
    }
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler, type: "primary", text: "新增" },
    { clickHandler, type: "warning", text: "修改" },
    { clickHandler, type: "danger", text: "删除" },
    { clickHandler, type: "primary", text: "导出", isDropDown: true }
  ]);

  return {
    loading,
    columns,
    dataList,
    rowDbClick,
    rowClick,
    maxHeight,
    searchOptions,
    onSearch,
    onFresh,
    onAdd,
    onEdit,
    handleTagSearch,
    onDelete,
    onExport,
    beforeOnEdit,
    buttonList,
    beforeOnDelete
  };
};
