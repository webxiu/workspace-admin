import { ElMessage, ElMessageBox } from "element-plus";
import {
  addFetchRightValueInfo,
  addProductDevTypeInfo,
  deletefetchRightValueInfo,
  fetchGroupNameOptionList,
  fetchLeftTypeTreeList,
  fetchRightValueList,
  getBOMTableRowSelectOptions,
  saveFetchRightValueInfo,
  updateProductDevTypeInfo
} from "@/api/plmManage";
import { formConfigs, formConfigs1, formRules, formRules1 } from "./config";
import { getMenuColumns, setColumn, tableEditRender, updateButtonList } from "@/utils/table";
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
  const delRows: any = ref([]);
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

  // 编辑表格
  const { editCellRender } = tableEditRender();

  const getColumnConfig2 = async () => {
    const reqRender = (data) => editCellRender({ type: "input", data, isEdit: true });
    let columnData: TableColumnList[] = [{ label: "要求描述", prop: "valueAll", cellRenderer: reqRender }];
    const { columnArrs, buttonArrs } = await getMenuColumns([{ valueAll: reqRender }]);
    const menuCols = columnArrs[1];
    if (menuCols?.length) {
      columnData = menuCols;
      columns2.value = setColumn({ columnData, operationColumn: false });
    } else {
      columns2.value = columnData;
    }
    updateButtonList(buttonList2, buttonArrs[1]);
    columns2.value = setColumn({ columnData, operationColumn: false, dragSelector: ".pm-value-table", isDragRow: true, dataList: dataList2 });
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
    dataList2.value.push({ valueAll: "", typeId: currentLeftRow.value.id, isDelete: false });
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
      // ElMessageBox.confirm(`确认要删除值为【${row.valueAll}】的记录吗?`, "系统提示", {
      //   type: "warning",
      //   draggable: true,
      //   cancelButtonText: "取消",
      //   confirmButtonText: "确定",
      //   dangerouslyUseHTMLString: true
      // })
      //   .then(() => {
      //     loading2.value = true;
      //     deletefetchRightValueInfo({ id: row.id }).then((res) => {
      //       if (res.data) {
      //         ElMessage({ message: `删除成功`, type: "success" });
      //         leftRowDbClick(currentLeftRow.value);
      //       }
      //     });
      //   })
      //   .catch(() => {})
      //   .finally(() => (loading2.value = false));

      dataList2.value[currentRightRow.value.index].isDelete = true;
      delRows.value.push(dataList2.value[currentRightRow.value.index]);
      dataList2.value.splice(currentRightRow.value.index, 1);
      currentRightRow.value = {};
    } else {
      ElMessage({ message: "请选择值记录", type: "warning" });
    }
  };

  const onSave2 = () => {
    const filterDelRows = delRows.value.filter((el) => el.id);
    const sendAfterSortList = [...dataList2.value, ...filterDelRows].map((item, idx) => ({ ...item, sort: idx + 1 }));
    console.log(sendAfterSortList, "sendAfterSortList==");
    saveFetchRightValueInfo(sendAfterSortList).then((res) => {
      if (res.data) {
        message("保存成功", { type: "success" });
        leftRowDbClick(currentLeftRow.value);
        delRows.value = [];
      }
    });
  };

  const rowClassName = ({ row, rowIndex }) => {
    row.index = rowIndex;
    return "";
  };

  const leftRowDbClick = (row) => {
    currentLeftRow.value = row;
    if (!row.id && row.children) return;

    loading2.value = true;

    fetchRightValueList({ typeId: row.id })
      .then((res: any) => {
        if (res.data) {
          dataList2.value = res.data.map((el) => ({ ...el, isDelete: el.isDelete ?? false }));
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
    { clickHandler: onDelete2, type: "warning", text: "删除值" },
    { clickHandler: onSave2, type: "success", text: "保存" }
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
    rowClassName,
    onDelete2,
    leftRowDbClick
  };
};
