/*
 * @Author: Hailen
 * @Date: 2024-02-27 10:47:19
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-12-25 16:31:52
 */

import {
  BelongGroupItemType,
  DeptInfoTreeOptionType,
  DeptUserInfoItemType,
  DetartMenttemType,
  GroupLeaderTreeItemType,
  TableGroupItemType,
  addGroupSelectMax,
  detartGroupAdd,
  detartGroupDelete,
  detartGroupLeaderTree,
  detartGroupTree,
  detartGroupUpdate,
  detartMentAdd,
  detartMentDelete,
  detartMentGroup,
  detartMentGroupItemType,
  detartMentList,
  detartMentUpdate,
  getDetartMenuOptionList
} from "@/api/systemManage";
import { CustomPropsType, getFormColumns } from "@/utils/form";
import EditForm, { FormConfigItemType } from "@/components/EditForm/index.vue";
import { formConfigGroups, formConfigs, formGroupRules, formRules } from "./config";
import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { h, onMounted, reactive, ref } from "vue";
import { message, showMessageBox } from "@/utils/message";

import { FormRules } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import TableEditList from "@/components/TableEditList/index.vue";
import { addDialog } from "@/components/ReDialog";
import { handleTree } from "@/utils/tree";
import { useEleHeight } from "@/hooks";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const columns2 = ref<TableColumnList[]>([]);
  const dataList = ref<DetartMenttemType[]>([]);
  const dataList2 = ref<detartMentGroupItemType[]>([]);
  const loading = ref<boolean>(false);
  const loading2 = ref<boolean>(false);
  const rowData = ref<DetartMenttemType>();
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49);
  const groupArrsList = ref<TableGroupItemType[]>([]);

  onMounted(() => {
    getColumnConfig();
    getTableList();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "部门名称", prop: "deptName", minWidth: 240 },
      { label: "部门编号", prop: "deptCode", align: "right" },
      { label: "金蝶部门ID", prop: "k3DeptId", align: "right" },
      { label: "金蝶部门编号", prop: "k3DeptCode" },
      { label: "企业微信部门ID", prop: "qyWeiXinDeptId", align: "right", minWidth: 160 },
      { label: "部门负责人", prop: "principalName" },
      { label: "部门文员", prop: "clerkName" },
      { label: "组织类型", prop: "orgType", align: "right" },
      { label: "显示顺序", prop: "displayOrder", align: "right" }
    ];
    let columnData2: TableColumnList[] = [
      { label: "分组编号", prop: "groupCode" },
      { label: "分组名称", prop: "groupName" },
      { label: "别负责人", prop: "leaderName" },
      { label: "所属部门", prop: "deptName" }
    ];
    const { columnArrs, groupArrs, buttonArrs } = await getMenuColumns();
    const [data, data2] = columnArrs;
    if (data?.length) columnData = data;
    if (data2?.length) columnData2 = data2;
    if (groupArrs?.length) groupArrsList.value = groupArrs;
    updateButtonList(buttonList, buttonArrs[0]);
    updateButtonList(buttonList2, buttonArrs[1]);
    columns.value = setColumn({ columnData, isCustomExpend: true, dragSelector: ".dep-manage" });
    columns2.value = setColumn({ columnData: columnData2, dragSelector: ".dep-manage-group" });
  };

  const onRefresh = () => {
    getColumnConfig();
    getTableList();
  };
  const onRefresh2 = () => {
    getColumnConfig();
    getGroupList(rowData.value.itemId);
  };

  const getTableList = () => {
    loading.value = true;
    detartMentList()
      .then((res) => {
        loading.value = false;
        const result = handleTree(res.data, "itemId", "parentId", "children");
        dataList.value = result;
      })
      .catch((err) => (loading.value = false));
  };

  const onAdd = () => openDepDialog("add", rowData.value);

  const onEdit = (row: DetartMenttemType) => {
    if (row.parentId === -1) {
      return message.error("不能修改顶级");
    }
    openDepDialog("edit", row);
  };

  const onDelete = (row: DetartMenttemType) => {
    detartMentDelete({ id: row.itemId })
      .then((res) => {
        message.success("删除成功");
        getTableList();
      })
      .catch(console.log);
  };

  function openDepDialog(type: string, row?: Partial<DetartMenttemType>) {
    const titleObj = { add: "新增", edit: "修改" };
    const title = titleObj[type];
    const formRef = ref();
    const clerkId = row?.clerkId ? row?.clerkId.split(",").map((c) => Number(c)) : [];

    const _formData = reactive({
      deptCode: type === "edit" ? row?.deptCode : "",
      deptName: type === "edit" ? row?.deptName : "",
      displayOrder: type === "edit" ? row?.displayOrder : "",
      parentId: row?.parentId === undefined ? "" : `${type === "edit" ? row?.parentId : row?.itemId}`,
      qyWeiXinDeptId: type === "edit" ? row?.qyWeiXinDeptId : "",
      k3DeptId: type === "edit" ? row?.k3DeptId : "",
      k3DeptCode: type === "edit" ? row?.k3DeptCode : "",
      principalId: type === "edit" ? row?.principalId : "",
      itemId: type === "edit" ? row?.itemId : "",
      level: type === "add" ? undefined : row?.level,
      select: clerkId,
      examineFlag: type === "edit" ? (row.examineFlag ? row.examineFlag + "" : "") : "0",
      clerkId: type === "add" ? undefined : clerkId
    });

    const customProps = reactive<{ [key: string]: CustomPropsType }>({
      level: { disabled: type === "add" },
      clerkId: { formatAPI: (data) => data.userinfoList },
      principalId: { formatAPI: (data) => data.userinfoList },
      parentId: { formatAPI: (data) => data.deptInfoTree },
      examineFlag: {
        formatAPI: (data) => {
          const result = data.find((el) => el.optionCode === "BeOrNot")?.optionList || [];
          return result;
        }
      }
    });

    addDialog({
      title: `${title}部门`,
      props: {
        params: { groupCode: "1" },
        formConfig: [{ formData: _formData, customProps, formProps: { labelWidth: "140px" } }]
      },
      width: "860px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      showResetButton: true,
      beforeReset: () => formRef.value.resetRef(),
      contentRenderer: () => h(TableEditList, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const newClerkId = _formData.clerkId.join(",");
        const params = {
          ..._formData,
          clerkId: newClerkId,
          select: newClerkId,
          level: type === "add" ? undefined : _formData.level
        };
        formRef.value.getRef().then(({ valid, data }) => {
          // const _formData = data.forms[0];
          if (valid) {
            showMessageBox(`确认要提交吗?`).then(() => {
              onSubmitChange(type, title, params, () => {
                done();
                getTableList();
              });
            });
          }
        });
      }
    });
  }
  // 添加部门&修改部门
  const onSubmitChange = (type: string, title: string, data, callback) => {
    const API = { add: detartMentAdd, edit: detartMentUpdate };
    API[type](data)
      .then((res) => {
        if (res.data) {
          callback();
          message.success(`${title}成功`);
        }
      })
      .catch(console.log);
  };

  // 获取右侧分组列表
  const onCurrentChange = (row: DetartMenttemType) => {
    if (!row) return;
    rowData.value = row;
    setTimeout(() => {
      getGroupList(row.itemId);
    }, 200);
  };

  // =================================================== 分组列表(right) =================================================== */
  // 获取右侧分组列表
  const getGroupList = (deptId: number) => {
    loading2.value = true;
    detartMentGroup({ deptId })
      .then((res) => {
        loading2.value = false;
        dataList2.value = handleTree(res.data, "itemId", "parentId", "children");
      })
      .catch(() => (loading2.value = false));
  };

  // 分组修改
  const onAdd2 = () => {
    if (!rowData.value) {
      return message.error("请选择部门");
    }
    const { deptCode, deptName, itemId } = rowData.value;
    openGroupDialog("add", { deptCode, deptName, deptId: itemId });
  };
  const onEdit2 = (row: detartMentGroupItemType) => {
    openGroupDialog("edit", row);
  };
  const onDelete2 = (row: detartMentGroupItemType) => {
    detartGroupDelete({ id: row.itemId })
      .then((res) => {
        res.data && message.success("删除成功");
        getGroupList(rowData.value.itemId);
      })
      .catch(console.log);
  };
  const onCurrentChange2 = (row: detartMentGroupItemType) => {};

  function openGroupDialog(type: string, row?: Partial<detartMentGroupItemType>) {
    const titleObj = { add: "新增", edit: "修改" };
    const title = titleObj[type];
    const formRef = ref();
    const loading = ref<boolean>(true);
    const parentId = [undefined, null].includes(row?.parentId) ? "" : `${row?.parentId}`;

    const _formData = reactive({
      groupCode: row?.groupCode ?? "",
      groupName: row?.groupName ?? "",
      leaderId: row?.leaderId ?? "",
      parentId: parentId,
      deptCode: row?.deptCode ?? "",
      deptName: row?.deptName ?? "",
      deptId: row?.deptId ?? "",
      id: row?.itemId ?? ""
    });

    //新增分组时调用
    if (type === "add") {
      addGroupSelectMax()
        .then((res) => {
          _formData.groupCode = res.data;
          loading.value = false;
        })
        .catch(() => (loading.value = false));
    }

    const customProps = reactive<{ [key: string]: CustomPropsType }>({
      leaderId: { apiParams: { deptId: row.deptId }, formatAPI: (data) => data },
      parentId: { apiParams: { deptId: row.deptId }, formatAPI: (data) => data }
    });

    addDialog({
      title: `${title}分组`,
      props: {
        params: { groupCode: "2" },
        formConfig: [{ formData: _formData, customProps, formProps: { labelWidth: "140px" } }]
      },
      width: "60%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      showResetButton: true,
      beforeReset: () => formRef.value.resetRef(),
      contentRenderer: () => h(TableEditList, { ref: formRef }),
      beforeSure: (done, { options }) => {
        formRef.value.getRef().then(({ valid, data }) => {
          // const _formData = data.forms[0];
          if (valid) {
            showMessageBox(`确认要提交吗?`).then(() => {
              onGroupChange(type, title, _formData, () => {
                done();
                getGroupList(rowData.value.itemId);
              });
            });
          }
        });
      }
    });
  }
  // 添加分组&修改分组
  const onGroupChange = (type: string, title: string, data, callback) => {
    const API = { add: detartGroupAdd, edit: detartGroupUpdate };
    API[type](data)
      .then((res) => {
        if (res.data) {
          callback();
          message.success(`${title}成功`);
        }
      })
      .catch(console.log);
  };

  const dbClick = (row) => {
    onEdit(row);
  };

  const buttonList = ref<ButtonItemType[]>([{ clickHandler: onAdd, type: "primary", text: "新增部门", icon: Plus, isDropDown: false }]);
  const buttonList2 = ref<ButtonItemType[]>([{ clickHandler: onAdd2, type: "primary", text: "新增分组", icon: Plus, isDropDown: false }]);

  return {
    loading,
    loading2,
    columns,
    columns2,
    dataList,
    dataList2,
    maxHeight,
    buttonList,
    buttonList2,
    groupArrsList,
    onAdd2,
    onEdit,
    onEdit2,
    onDelete,
    onDelete2,
    onRefresh,
    onRefresh2,
    dbClick,
    onCurrentChange,
    onCurrentChange2
  };
};
