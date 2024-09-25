import { ElMessage, ElMessageBox } from "element-plus";
import {
  addFetchRightValueInfo,
  addProductDevTypeInfo,
  deletefetchRightValueInfo,
  fetchGroupNameOptionList,
  fetchLeftTypeTreeList,
  fetchRightValueList,
  fetchSelectList,
  getBOMTableRowSelectOptions,
  updateProductDevTypeInfo
} from "@/api/plmManage";
import { formConfigs, formConfigs1, formRules, formRules1 } from "./config";
import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { h, onMounted, reactive, ref } from "vue";

import EditForm from "@/components/EditForm/index.vue";
import { PAGE_CONFIG } from "@/config/constant";
import { addDialog } from "@/components/ReDialog";
import { handleTree } from "@/utils/tree";
import { message } from "@/utils/message";
import { useEleHeight } from "@/hooks";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const columns2 = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const loading2 = ref<boolean>(false);
  const dataList = ref([]);
  const dataList2: any = ref([]);
  const productDevValueOptions = ref([]);
  const groupNameOptions = ref([]);
  const productCategoryIdList = ref([]);
  const currentLeftRow: any = ref({});
  const currentRightRow: any = ref({});
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49);
  const formData: any = reactive({
    name: "",
    number: "",
    urlAddress: "",
    select: "",
    page: 1,
    limit: PAGE_CONFIG.pageSize
  });

  const getOptionList = () => {
    getBOMTableRowSelectOptions({ optioncode: "HTMLInputType" }).then((res: any) => {
      if (res.data) {
        const result = res.data[0]?.optionList || [];
        productDevValueOptions.value = result.map((item) => ({ label: item.optionName, value: item.optionValue }));
      }
    });
    fetchGroupNameOptionList({}).then((res: any) => {
      if (res.data) groupNameOptions.value = res.data.map((item) => ({ label: item, value: item }));
    });
  };

  onMounted(() => {
    getColumnConfig();
    onSearch();
    onSearch2();
    getOptionList();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "类型名称", prop: "typeName", width: 430, align: "left" },
      { label: "备注", prop: "remark", minWidth: 180 }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const menuCols = columnArrs[0];
    if (menuCols?.length) {
      columnData = menuCols;
      columns.value = setColumn({ columnData, operationColumn: false });
    } else {
      columns.value = columnData;
    }
    updateButtonList(buttonList, buttonArrs[0]);
    return columnData;
  };

  const getColumnConfig2 = async () => {
    let columnData: TableColumnList[] = [{ label: "要求描述", prop: "valueAll" }];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const menuCols = columnArrs[1];
    if (menuCols?.length) {
      columnData = menuCols;
      columns2.value = setColumn({ columnData, operationColumn: false });
    } else {
      columns2.value = columnData;
    }
    updateButtonList(buttonList2, buttonArrs[1]);
    columns2.value = setColumn({ columnData, operationColumn: false });
    return columnData;
  };

  const onSearch = () => {
    if (productCategoryIdList.value.length) {
      formData.productCategoryIdList = productCategoryIdList.value;
    } else {
      formData.productCategoryIdList = undefined;
    }
    formData.select = String(productCategoryIdList.value);
    loading.value = true;
    fetchLeftTypeTreeList(formData)
      .then((res: any) => {
        const data = res.data;
        loading.value = false;
        dataList.value = handleTree(data, "tableId", "tablePid", "children");
      })
      .catch((err) => (loading.value = false));
  };

  const onFresh = () => {
    getColumnConfig();
    onSearch();
  };

  const onSearch2 = () => {
    getColumnConfig2();
  };

  const onAdd = () => {
    openDialog("add");
  };

  const onAdd2 = () => {
    if (!currentLeftRow.value.id) {
      ElMessage({ message: "请选择一个类型", type: "warning" });
      return;
    }
    openDialog("add", true);
  };

  const openDialog = async (type: string, isRight?, row?) => {
    const titleObj = { add: "新增", edit: "修改" };
    const title = titleObj[type];
    const formRef = ref();
    console.log(row, "clickEdit");

    const _formData = reactive({
      id: row?.id ?? "",
      newGroupName: row?.newGroupName ?? "",
      groupName: row?.groupName ?? "",
      remark: row?.remark ?? "",
      typeName: row?.typeName ?? "",
      valueType: row?.valueType ? row?.valueType + "" : ""
    });

    const _formData1 = reactive({
      valueAll: row?.valueAll ?? ""
    });

    addDialog({
      title: `${title}${isRight ? "值" : "类型"}`,
      props: {
        formInline: isRight ? _formData1 : _formData,
        formRules: isRight ? formRules1 : formRules,
        formConfigs: isRight ? formConfigs1() : formConfigs(groupNameOptions.value, productDevValueOptions.value)
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
              onSubmitChange(
                type,
                title,
                isRight ? _formData1 : _formData,
                () => {
                  done();
                  isRight ? leftRowDbClick(currentLeftRow.value) : onSearch();
                },
                isRight
              );
            });
          }
        });
      }
    });
  };

  const onSubmitChange = (type: string, title: string, data, callback, isRight) => {
    if (data.newGroupName) data.groupName = data.newGroupName;
    if (isRight) data.typeId = currentLeftRow.value.id;

    const API = { add: isRight ? addFetchRightValueInfo : addProductDevTypeInfo, edit: updateProductDevTypeInfo };
    API[type](data)
      .then((res) => {
        if (res.data) {
          callback();
          message(`${title}成功`);
        }
      })
      .catch(console.log);
  };

  const onEdit = () => {
    if (JSON.stringify(currentLeftRow.value) != "{}" && !currentLeftRow.value.children) {
      openDialog("edit", false, currentLeftRow.value);
    } else {
      ElMessage({ message: "请选择类型记录", type: "warning" });
    }
  };

  const onDelete2 = () => {
    const row = currentRightRow.value;
    if (JSON.stringify(row) != "{}") {
      ElMessageBox.confirm(`确认要删除值为【${row.valueAll}】的记录吗?`, "系统提示", {
        type: "warning",
        draggable: true,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          loading2.value = true;
          deletefetchRightValueInfo({ id: row.id }).then((res) => {
            if (res.data) {
              ElMessage({ message: `删除成功`, type: "success" });
              leftRowDbClick(currentLeftRow.value);
            }
          });
        })
        .catch(() => {})
        .finally(() => (loading2.value = false));
    } else {
      ElMessage({ message: "请选择值记录", type: "warning" });
    }
  };

  const leftRowDbClick = (row) => {
    currentLeftRow.value = row;
    if (!row.id && row.children) return;

    loading2.value = true;

    fetchRightValueList({ typeId: row.id })
      .then((res) => {
        if (res.data) {
          dataList2.value = res.data;
        }
      })
      .finally(() => (loading2.value = false));
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "新增类型" },
    { clickHandler: onEdit, type: "warning", text: "修改类型" }
  ]);

  const buttonList2 = ref<ButtonItemType[]>([
    { clickHandler: onAdd2, type: "primary", text: "新增值" },
    { clickHandler: onDelete2, type: "warning", text: "删除值" }
  ]);

  const rightRowClick = (row) => (currentRightRow.value = row);

  return {
    loading,
    loading2,
    columns,
    columns2,
    dataList,
    dataList2,
    buttonList,
    buttonList2,
    maxHeight,
    onSearch,
    onFresh,
    rightRowClick,
    onAdd,
    onAdd2,
    onEdit,
    onDelete2,
    leftRowDbClick
  };
};
