/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-06-17 17:27:30
 */

import {
  SystemParamsListItemType,
  SystemParamsNumberItemType,
  SystemParamsValueItemType,
  TableGroupItemType,
  systemParamsList,
  systemParamsNumbeDelete,
  systemParamsNumberAdd,
  systemParamsNumberList,
  systemParamsNumberUpdate,
  systemParamsValueAdd,
  systemParamsValueDelete,
  systemParamsValueList,
  systemParamsValueUpdate
} from "@/api/systemManage";
import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { h, onMounted, reactive, ref } from "vue";
import { message, showMessageBox } from "@/utils/message";
import { nameFormConfig, nameFormRules, valueFormConfig, valueFormRules } from "./config";

import EditForm from "@/components/EditForm/index.vue";
import { Plus } from "@element-plus/icons-vue";
import { addDialog } from "@/components/ReDialog";
import { handleTree } from "@/utils/tree";
import { useEleHeight } from "@/hooks";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const columns2 = ref<TableColumnList[]>([]);
  const columns3 = ref<TableColumnList[]>([]);
  const dataList = ref<SystemParamsListItemType[]>([]);
  const dataList2 = ref<SystemParamsNumberItemType[]>([]);
  const dataList3 = ref<SystemParamsValueItemType[]>([]);
  const loading = ref<boolean>(false);
  const loading2 = ref<boolean>(false);
  const loading3 = ref<boolean>(false);
  const rowData = ref<SystemParamsListItemType>();
  const rowData2 = ref<SystemParamsNumberItemType>();
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49);
  const groupArrsList = ref<TableGroupItemType[]>([]);

  onMounted(() => {
    getColumnConfig();
    getTableList();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "菜单树", prop: "menuName", minWidth: 190 },
      { label: "菜单类型", prop: "menuType", width: 100 }
    ];

    let columnData2: TableColumnList[] = [
      { label: "参数编号", prop: "systemparamCode" },
      { label: "名称", prop: "systemparamName" },
      { label: "说明", prop: "remark" }
    ];
    let columnData3: TableColumnList[] = [
      { label: "值", prop: "systemparamValue" },
      { label: "说明", prop: "remark" },
      { label: "最后操作时间", prop: "createDate" }
    ];
    const { columnArrs, groupArrs, buttonArrs } = await getMenuColumns();
    const [data, data2, data3] = columnArrs;
    if (data?.length) columnData = data;
    if (data2?.length) columnData2 = data2;
    if (data3?.length) columnData3 = data3;
    if (groupArrs?.length) groupArrsList.value = groupArrs;
    updateButtonList(buttonList2, buttonArrs[0]);
    updateButtonList(buttonList3, buttonArrs[1]);
    columns.value = setColumn({ columnData, isCustomExpend: true, dragSelector: ".sys-params", operationColumn: false });
    columns2.value = setColumn({ columnData: columnData2, operationColumn: { minWidth: 160 }, dragSelector: ".sys-params-name" });
    columns3.value = setColumn({ columnData: columnData3, operationColumn: { minWidth: 160 }, dragSelector: ".sys-params-value" });
  };

  const onRefresh = () => {
    getColumnConfig();
    getTableList();
  };
  const onRefresh2 = () => {
    if (!rowData.value) return;
    getColumnConfig();
    getMiddleList(rowData.value.itemId);
  };
  const onRefresh3 = () => {
    if (!rowData2.value) return;
    getColumnConfig();
    getRightList(rowData2.value.id);
  };

  const getTableList = () => {
    loading.value = true;
    systemParamsList()
      .then((res) => {
        loading.value = false;
        dataList.value = handleTree(res.data, "itemId", "parentId");
      })
      .catch((err) => (loading.value = false));
  };

  const onCurrentChange = (row: SystemParamsListItemType) => {
    if (!row) return;
    rowData.value = row;
    getMiddleList(row.itemId);
  };

  // 获取中间参数编号
  const getMiddleList = (menuId) => {
    loading2.value = true;
    const params = {
      page: 1,
      limit: 10000,
      menuId: menuId
    };
    systemParamsNumberList(params)
      .then((res) => {
        const data = res.data;
        loading2.value = false;
        dataList2.value = res.data;

        if (data[0]) {
          getRightList(data[0].id);
        } else {
          dataList3.value = [];
        }
      })
      .catch(() => (loading2.value = false));
  };

  // 参数编号相关操作
  const onAdd2 = () => {
    if (!rowData.value) return message("请选择菜单树", { type: "error" });
    openDialog("add");
  };
  const onEdit2 = (row: SystemParamsNumberItemType) => {
    openDialog("edit", row);
  };
  const onDelete2 = (row: SystemParamsNumberItemType) => {
    systemParamsNumbeDelete({ id: row.id })
      .then((res) => {
        getMiddleList(rowData.value.itemId);
        message("删除成功");
      })
      .catch(console.log);
  };
  const onCurrentChange2 = (row: SystemParamsNumberItemType) => {
    if (!row) return;
    rowData2.value = row;
    getRightList(row.id);
  };

  function openDialog(type: "add" | "edit", row?: Partial<SystemParamsNumberItemType>) {
    const titleObj = { add: "新增", edit: "修改" };
    const title = titleObj[type];
    const formRef = ref();

    const _formData = reactive({
      systemparamCode: row?.systemparamCode ?? "",
      systemparamName: row?.systemparamName ?? "",
      remark: row?.remark ?? "",
      id: row?.id ?? "",
      menuId: rowData.value.itemId ?? ""
    });

    addDialog({
      title: title,
      props: {
        formInline: _formData,
        formRules: nameFormRules,
        formConfigs: nameFormConfig()
      },
      width: "460px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      showResetButton: true,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeReset: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.resetFields();
      },
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.validate((valid) => {
          if (valid) {
            showMessageBox(`确认要提交吗?`).then(() => {
              onSubmitChange(type, title, _formData, () => {
                done();
                getMiddleList(rowData.value.itemId);
              });
            });
          }
        });
      }
    });
  }

  // 新增|修改提交
  const onSubmitChange = (type: string, title: string, data, callback) => {
    const API = { add: systemParamsNumberAdd, edit: systemParamsNumberUpdate };
    API[type](data)
      .then((res) => {
        if (res.data) {
          callback();
          message(`${title}成功`);
        }
      })
      .catch(console.log);
  };

  // 获取中间参数值列表
  const getRightList = (id) => {
    loading3.value = true;
    const params = { page: 1, limit: 10000, id: id };
    systemParamsValueList(params)
      .then((res) => {
        loading3.value = false;
        dataList3.value = res.data;
      })
      .catch(() => (loading3.value = false));
  };

  const onAdd3 = () => {
    if (!rowData2.value) return message("请选择参数编号", { type: "error" });
    openDialog2("add", { systemparamId: rowData2.value.id });
  };
  const onEdit3 = (row: SystemParamsValueItemType) => {
    openDialog2("edit", row);
  };

  const onDelete3 = (row: SystemParamsValueItemType) => {
    systemParamsValueDelete({ id: row.id })
      .then((res) => {
        getMiddleList(rowData.value.itemId);
        message("删除成功");
      })
      .catch(console.log);
  };

  function openDialog2(type: "add" | "edit", row?: Partial<SystemParamsValueItemType>) {
    const titleObj = { add: "新增", edit: "修改" };
    const title = titleObj[type];
    const formRef = ref();
    const _formData = reactive({
      systemparamValue: row?.systemparamValue ?? "",
      remark: row?.remark ?? "",
      id: row?.id ?? "",
      systemparamId: row?.systemparamId ?? undefined
    });
    addDialog({
      title: title,
      props: {
        formInline: _formData,
        formRules: valueFormRules,
        formConfigs: valueFormConfig(),
        formProps: { labelWidth: "100px" }
      },
      width: "460px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      showResetButton: true,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeReset: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.resetFields();
      },
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.validate((valid) => {
          if (valid) {
            showMessageBox(`确认要提交吗?`).then(() => {
              onSubmitChange2(type, title, _formData, () => {
                done();
                getRightList(rowData2.value.id);
              });
            });
          }
        });
      }
    });
  }

  // 新增|修改提交2
  const onSubmitChange2 = (type: string, title: string, data, callback) => {
    const API = { add: systemParamsValueAdd, edit: systemParamsValueUpdate };
    API[type](data)
      .then((res) => {
        if (res.data) {
          callback();
          message(`${title}成功`);
        }
      })
      .catch(console.log);
  };

  const buttonList2 = ref<ButtonItemType[]>([{ clickHandler: onAdd2, type: "primary", text: "新增", icon: Plus, isDropDown: false }]);
  const buttonList3 = ref<ButtonItemType[]>([{ clickHandler: onAdd3, type: "primary", text: "新增", icon: Plus, isDropDown: false }]);

  return {
    loading,
    loading2,
    loading3,
    columns,
    columns2,
    columns3,
    dataList,
    dataList2,
    dataList3,
    maxHeight,
    buttonList2,
    buttonList3,
    groupArrsList,
    onEdit2,
    onEdit3,
    onDelete2,
    onDelete3,
    onRefresh,
    onRefresh2,
    onRefresh3,
    onCurrentChange,
    onCurrentChange2
  };
};
