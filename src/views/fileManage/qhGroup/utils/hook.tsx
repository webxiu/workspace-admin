import { Delete, Download, Edit, Plus } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { addQHGroupInfo, delQHGroupInfo, editQHGroupInfo, exportQHGroupInfo, fetchQHGroupList, searchQHUserList } from "@/api/fileManage";
import { formConfigs, formRules } from "./config";
import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { h, onMounted, reactive, ref } from "vue";

import EditForm from "@/components/EditForm/index.vue";
import { addDialog } from "@/components/ReDialog";
import { message } from "@/utils/message";
import { useEleHeight } from "@/hooks";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const dataList = ref<any[]>([]);
  const loading = ref<boolean>(false);
  const oldgroupName = ref("");
  const currentGroup = ref("");
  const currentRow: any = ref({});
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49);
  const deptOptions = ref<any[]>([]);
  const stateOptions = ref([]);
  const qhGroupRef = ref();

  onMounted(() => {
    getColumnConfig();
    getTableList();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "组名称", prop: "groupName" },
      { label: "角色名称", prop: "roleName" },
      { label: "组成员", prop: "groupByUsers" }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);

    columns.value = setColumn({
      columnData,
      isCustomExpend: false,
      operationColumn: false
    });
  };

  const onRefresh = () => {
    getColumnConfig();
    getTableList();
  };

  const getTableList = (idx?) => {
    loading.value = true;
    fetchQHGroupList({ page: 1, limit: 10000 })
      .then((res: any) => {
        const data = res.data;
        loading.value = false;
        dataList.value = data;

        if (typeof idx === "number" && idx >= 0) {
          currentRow.value = dataList.value[idx];
          qhGroupRef.value.getTableRef()?.setCurrentRow(dataList.value[idx]);
        } else {
          currentRow.value = {};
        }
      })
      .catch(() => console.log)
      .finally(() => (loading.value = false));
  };

  const onAdd = () => {
    openDialog("add");
  };

  const onExport = () => {
    getColumnConfig();
    // 组装后端需要的数据形式 layui
    const reqColumns = [
      { field: "groupName", title: "组名称" },
      { field: "roleName", title: "角色名称" },
      { field: "groupByUsers", title: "组成员" }
    ];

    const jsonArr = reqColumns.map((item) => ({
      field: item.field,
      title: item.title,
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
        excelName: "群晖组管理",
        excelHeader: JSON.stringify(jsonArr)
      }
    };
    loading.value = true;
    exportQHGroupInfo({ ...reqParams })
      .then((res) => {
        window.open("/api" + res.data, "_blank");
      })
      .finally(() => (loading.value = false));
  };

  const onDel = () => {
    if (JSON.stringify(currentRow.value) == "{}" || !currentRow.value) {
      ElMessage({ message: "请选择一条记录", type: "warning" });
      return;
    }
    const data = currentRow.value;
    ElMessageBox.confirm(`确认要删除【${data.groupName}】吗?`, "系统提示", {
      type: "warning",
      draggable: true,
      cancelButtonText: "取消",
      confirmButtonText: "确定",
      dangerouslyUseHTMLString: true
    }).then(() => {
      loading.value = true;
      delQHGroupInfo({ ...data })
        .then((res) => {
          res.status === 200 && message(`删除成功`, { type: "success" });
          currentRow.value = {};
          getTableList();
        })
        .catch(console.log)
        .finally(() => (loading.value = false));
    });
  };

  const onEdit = () => {
    if (JSON.stringify(currentRow.value) == "{}" || !currentRow.value) {
      ElMessage({ message: "请选择一条记录", type: "warning" });
      return;
    }
    const row = currentRow.value;
    oldgroupName.value = row.groupName;
    currentGroup.value = row.groupByUsers ?? "";
    // 获取穿梭框的列表数据
    openDialog("edit", row);
  };

  function openDialog(type: string, row?) {
    const titleObj = { add: "新增", edit: "修改" };
    const title = titleObj[type];
    const formRef = ref();
    const loading3 = ref(false);
    const dataList: any = ref([]);

    const _formData = reactive({
      groupName: row?.groupName ?? "",
      roleName: row?.roleName ?? "",
      userCodes: row?.userCodes ?? []
    });

    if (type === "edit") {
      loading3.value = true;
      searchQHUserList({})
        .then((res) => {
          if (res.data) dataList.value = res.data;
        })
        .finally(() => (loading3.value = false));
    }

    addDialog({
      title: `${title}`,
      props: {
        loading: loading3,
        formInline: _formData,
        formRules: formRules,
        formConfigs: formConfigs({ type, stateOptions, deptOptions }, _formData, dataList, currentGroup.value),
        formProps: { labelWidth: type === "add" ? "50px" : "100px", inline: false }
      },
      width: type === "add" ? "20%" : "790px",
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
            ElMessageBox.confirm(`确认要${type === "add" ? "新增" : "修改"}吗?`, "系统提示", {
              type: "warning",
              draggable: true,
              cancelButtonText: "取消",
              confirmButtonText: "确定",
              dangerouslyUseHTMLString: true
            })
              .then(() => {
                onSubmitChange(type, title, _formData, () => {
                  done();
                  getTableList(row.index);
                });
              })
              .catch(() => (loading.value = false));
          }
        });
      }
    });
  }
  // 新增|修改用户
  const onSubmitChange = (type: string, title: string, data, callback) => {
    type === "edit" && (data.userCodes = data.userCodes.map((item) => item.split("(")[0]));
    type === "edit" && (data.oldgroupName = oldgroupName.value);
    if (type === "add") {
      data = { groupName: data.groupName };
    }
    const API = { add: addQHGroupInfo, edit: editQHGroupInfo };
    API[type](data)
      .then((res) => {
        if (res.data) {
          callback();
          message(`${title}成功`);
        }
      })
      .catch(console.log);
  };

  const rowDbClick = (row) => {
    currentRow.value = row;
    onEdit();
  };

  const rowClick = (row) => {
    currentRow.value = row;
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "新增", icon: Plus },
    { clickHandler: onEdit, type: "warning", text: "修改", icon: Edit },
    { clickHandler: onDel, type: "danger", text: "删除", icon: Delete },
    { clickHandler: onExport, type: "primary", text: "导出", icon: Download, isDropDown: true }
  ]);

  return {
    loading,
    columns,
    dataList,
    maxHeight,
    qhGroupRef,
    buttonList,
    rowClick,
    rowDbClick,
    onRefresh
  };
};
