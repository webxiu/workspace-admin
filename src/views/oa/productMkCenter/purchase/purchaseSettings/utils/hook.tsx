import { ElMessage, ElMessageBox } from "element-plus";
import { editPurchaseList, exportPurchaseList, getPurchaseList, getPurchaseOptionList } from "@/api/oaManage/productMkCenter";
import { formConfigs, formRules } from "./config";
import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { h, onMounted, reactive, ref } from "vue";

import EditForm from "@/components/EditForm/index.vue";
import { addDialog } from "@/components/ReDialog";
import { handleTree } from "@/utils/tree";
import { message } from "@/utils/message";
import { useEleHeight } from "@/hooks";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const dataList = ref<any[]>([]);
  const loading = ref<boolean>(false);
  const operatorList = ref([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49);
  const currentRow = ref({});
  const deptOptions = ref<any[]>([]);

  const getPurchaseUserList = () => {
    console.log("采购员列表");
    getPurchaseOptionList({}).then((res: any) => {
      if (res.data) {
        console.log(res.data, "采购员返回");
        operatorList.value = res.data;
      }
    });
  };

  onMounted(() => {
    getColumnConfig();

    getPurchaseUserList();
    getTableList();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "物料类别", prop: "materialGroupName", width: 460 },
      { label: "采购员", prop: "operatorName", width: 160 },
      { label: "操作", width: 100, slot: "operation" }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [menuCols] = columnArrs;

    if (menuCols?.length) {
      columnData = menuCols;
    }

    updateButtonList(buttonList, buttonArrs[0]);

    columns.value = setColumn({
      columnData,
      isCustomExpend: true,
      operationColumn: false
    });

    return columnData;
  };

  const getTableList = () => {
    loading.value = true;
    getPurchaseList({})
      .then((res: any) => {
        loading.value = false;
        const result = handleTree(res.data, "itemId", "parentId", "children");
        dataList.value = result;
      })
      .catch((err) => (loading.value = false));
  };

  const onEdit = () => {
    if (JSON.stringify(currentRow.value) == "{}") {
      ElMessage({ message: "请选择记录", type: "warning" });
    } else {
      openDialog("edit", currentRow.value);
    }
  };

  const onExport = async () => {
    const reqColumns = await getColumnConfig();
    reqColumns.filter((item) => item.prop !== "操作").concat({ label: "物料类别", prop: "materialGroupName" });

    const jsonArr = reqColumns.map((item) => ({
      field: item.prop,
      title: item.label,
      type: "normal",
      colGroup: false,
      rowspan: 1,
      unresize: true,
      colspan: 1,
      hide: false,
      width: 200
    }));

    const reqParams = {
      page: 1,
      limit: 100000,
      excel: {
        excelName: "物料类别设置",
        excelHeader: JSON.stringify(jsonArr)
      }
    };
    loading.value = true;
    exportPurchaseList({ ...reqParams })
      .then((res) => {
        window.open("/api" + res.data, "_blank");
      })
      .finally(() => (loading.value = false));
  };

  function openDialog(type: string, row?) {
    console.log(row, "row");
    const titleObj = { add: "新增", edit: "修改" };
    const title = titleObj[type];
    const loading = ref<boolean>(false);
    const formRef = ref();

    const _formData = reactive({
      materialId: row?.itemId ?? "",
      operatorId: row?.OPERATORENTRY_FID ?? ""
    });

    addDialog({
      title: `设置采购员`,
      props: {
        loading: loading,
        formInline: _formData,
        formRules: formRules,
        formConfigs: formConfigs({ deptOptions: operatorList.value }),
        formProps: { labelWidth: "140px" }
      },
      width: "400px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeReset: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.resetFields();
      },
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.validate((valid) => {
          if (valid) {
            ElMessageBox.confirm(`确认要提交吗?`, "系统提示", {
              type: "warning",
              draggable: true,
              cancelButtonText: "取消",
              confirmButtonText: "确定",
              dangerouslyUseHTMLString: true
            }).then(() => {
              onSubmitChange(type, title, _formData, () => {
                done();
                getTableList();
              });
            });
          }
        });
      }
    });
  }
  // 新增|修改角色
  const onSubmitChange = (type: string, title: string, data, callback) => {
    const API = { edit: editPurchaseList };
    API[type](data)
      .then((res) => {
        if (res.data) {
          callback();
          message(`${title}成功`);
        }
      })
      .catch(console.log);
  };

  const buttonList = ref<ButtonItemType[]>([
    {
      clickHandler: onEdit,
      type: "warning",
      text: "修改",
      isDropDown: false
    },
    {
      clickHandler: onExport,
      type: "default",
      text: "导出",
      isDropDown: true
    }
  ]);

  const rowClick = (row) => (currentRow.value = row);

  return {
    loading,
    columns,
    rowClick,
    buttonList,
    dataList,
    maxHeight,
    onEdit,
    onExport
  };
};
