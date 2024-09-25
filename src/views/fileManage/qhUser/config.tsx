import { Delete, Download, Edit, Plus, RefreshRight } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { addQHUser, delQHUser, exportQHUserList, fetchUserGroupList, resetQHUserPwd, searchQHUserList, updateUserGroupInfo } from "@/api/fileManage";
import editForm, { FormDataItem } from "./form.vue";
import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { h, onMounted, ref } from "vue";

import { addDialog } from "@/components/ReDialog";
import { delEmptyQueryNodes } from "@/utils/common";
import { message } from "@/utils/message";
import { useEleHeight } from "@/hooks";

export type HandleType = "add" | "edit" | "resetPwd";

const currentRowData: any = ref({});
const columns = ref<TableColumnList[]>([]);
const qhUserRef = ref();

export function useTable() {
  const formRef = ref();
  const dataList: any = ref([]);
  const userCurrentGroup = ref([]);

  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 40);
  const loading = ref(false);
  onMounted(() => {
    getConfig();
    onSearch();
  });

  const getConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "序号", prop: "index" },
      { label: "群晖ID", prop: "userId" },
      { label: "账号", prop: "userCode" },
      { label: "工号", prop: "staffId" },
      { label: "姓名", prop: "userName" },
      { label: "描述", prop: "remark" },
      { label: "状态", prop: "state" },
      { label: "部门", prop: "deptName" },
      { label: "操作", prop: "operation" }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false });
  };

  const onSearch = (idx?) => {
    loading.value = true;
    searchQHUserList({ page: 1, limit: 10000 })
      .then((res) => {
        dataList.value = res.data;
        if (typeof idx === "number" && idx >= 0) {
          currentRowData.value = dataList.value[idx];
          qhUserRef.value.getTableRef()?.setCurrentRow(dataList.value[idx]);
        } else {
          currentRowData.value = {};
        }
      })
      .finally(() => (loading.value = false));
  };

  // 新增分组
  const onAdd = () => {
    openDialog("add");
  };

  // 修改分组
  const onEdit = () => {
    if (JSON.stringify(currentRowData.value) == "{}" || !currentRowData.value) {
      ElMessage({ message: "请选择一条记录", type: "warning" });
      return;
    }
    const data = currentRowData.value;
    fetchUserGroupList(delEmptyQueryNodes(data)).then((res: any) => {
      openDialog("edit", data, res.data);
      userCurrentGroup.value = res.data.userInGroup;
    });
  };

  // 删除分组
  const remove = () => {
    if (JSON.stringify(currentRowData.value) == "{}" || !currentRowData.value) {
      ElMessage({ message: "请选择一条记录", type: "warning" });
      return;
    }
    const data = currentRowData.value;
    console.log(data, "del");
    ElMessageBox.confirm(`确认要删除吗?`, "系统提示", {
      type: "warning",
      draggable: true,
      cancelButtonText: "取消",
      confirmButtonText: "确定",
      dangerouslyUseHTMLString: true
    }).then(() => {
      loading.value = true;

      delQHUser(data)
        .then((res) => {
          res.status === 200 && message(`删除成功`, { type: "success" });
          currentRowData.value = {};
          onSearch();
        })
        .catch(console.log)
        .finally(() => (loading.value = false));
    });
  };

  // 添加、编辑弹窗
  function openDialog(type: HandleType, row?: any, resData?) {
    const titleObj = { add: "新增", edit: "修改", resetPwd: "重置密码" };
    const title = titleObj[type];
    const _formData: FormDataItem = {
      userCode: type === "add" ? "" : row.userCode,
      remark: type === "add" ? "" : row.remark,
      newPassword: "",
      staffId: type === "add" ? "" : row.staffId,
      userName: type === "add" ? "" : row.userName
    };
    const setBackDelGroup = (arr) => {
      console.log(arr, "arr");
    };
    addDialog({
      title: `${title}`,
      width: type === "add" || type === "resetPwd" ? "440px" : "680px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      props: {
        type,
        setBackDelGroup,
        formInline: _formData,
        resData,
        labelWidth: type === "add" ? "70px" : "80px"
      },
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormDataItem;
        const selectedUserInfo = formRef.value.selectRowData;
        const userGroups = formRef.value.userInGroup;
        FormRef.validate((valid) => {
          if (valid) {
            ElMessageBox.confirm(`确认要【${title}】吗?`, "系统提示", {
              type: "warning",
              draggable: true,
              cancelButtonText: "取消",
              confirmButtonText: "确定",
              dangerouslyUseHTMLString: true
            }).then(() => {
              onSubmitGroup(
                type,
                title,
                { ...row, ...curData },
                () => {
                  done();
                  const _rowIndex = dataList.value.findIndex((item) => item.userId === currentRowData.value.userId);
                  onSearch(_rowIndex);
                },
                { selectedUserInfo, userGroups }
              );
            });
          }
        });
      }
    });
  }

  // 添加、编辑提交
  const onSubmitGroup = (type: HandleType, title: string, data, callback: Function, selectedUserInfo?) => {
    //比较数组
    const compareArray = (a1, a2) => {
      if (a1 === a2) return true;
      if ((!a1 && a2) || (a1 && !a2)) return false;
      if (a1.length !== a2.length) return false;
      for (let i = 0, n = a1.length; i < n; i++) {
        if (a1[i] !== a2[i]) return false;
      }
      return true;
    };

    const reqParams = {
      addGroup: selectedUserInfo.userGroups,
      delGroup: data.delGroup || [],
      id: selectedUserInfo.selectedUserInfo.id === 0 ? "" : selectedUserInfo.selectedUserInfo.id,
      oldRemark: (currentRowData.value as any).remark,
      remark: data.remark,
      olduserCode: (currentRowData.value as any).userCode,
      staffId: (currentRowData.value as any).staffId || selectedUserInfo.selectedUserInfo.userCode,
      userCode: data.userCode,
      userName: data.userName,
      newPassword: data.newPassword
    };
    if (data.delGroup && Array.isArray(data.delGroup) && data.delGroup.length) {
      reqParams.addGroup = [];
    }
    const sameGroupFlag = compareArray(reqParams.addGroup, userCurrentGroup.value);
    if (sameGroupFlag) {
      reqParams.addGroup = [];
      reqParams.delGroup = [];
    }
    const API = { add: addQHUser, edit: updateUserGroupInfo, resetPwd: resetQHUserPwd };
    API[type](type !== "edit" ? delEmptyQueryNodes(data) : reqParams)
      .then((res) => {
        if (!res.data) throw res.message;
        callback();
        message(`${title}成功`, { type: "success" });
      })
      .catch(console.log);
  };

  const onRefresh = () => {
    getConfig();
    onSearch();
  };

  const exportExcel = () => {
    const jsonArr = columns.value
      .filter((item) => !/(序号|操作)/.test(item.label))
      .map((item) => ({
        title: item.label,
        field: item.prop,
        type: "normal",
        colGroup: false,
        rowspan: 1,
        unresize: true,
        colspan: 1,
        hide: false,
        width: 200
      }));
    loading.value = true;
    exportQHUserList({ page: 1, limit: 100000, excel: { excelName: "群晖用户管理", excelHeader: JSON.stringify(jsonArr) } })
      .then((res) => {
        window.open("/api" + res.data, "_blank");
      })
      .finally(() => (loading.value = false));
  };

  const resetPwd = () => {
    if (JSON.stringify(currentRowData.value) == "{}" || !currentRowData.value) {
      ElMessage({ message: "请选择一条记录", type: "warning" });
      return;
    }
    const row = currentRowData.value;
    openDialog("resetPwd", row);
  };

  const rowClick = (row) => {
    currentRowData.value = row;
  };

  const rowDbClick = (row) => {
    currentRowData.value = row;
    onEdit();
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "新增", icon: Plus },
    { clickHandler: onEdit, type: "warning", text: "修改", icon: Edit },
    { clickHandler: remove, type: "danger", text: "删除", icon: Delete },
    { clickHandler: resetPwd, type: "primary", text: "重置密码", icon: RefreshRight, isDropDown: true },
    { clickHandler: exportExcel, type: "primary", text: "导出", icon: Download, isDropDown: true }
  ]);

  return {
    loading,
    columns,
    dataList,
    qhUserRef,
    maxHeight,
    buttonList,
    rowClick,
    rowDbClick,
    onRefresh
  };
}
