/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-06-17 17:27:36
 */

import { MenuColumnItemType, TableGroupItemType, addTableGroup, deleteTableGroup, tableGroupList, updateTableGroup } from "@/api/systemManage";
import { computed, h, onMounted, reactive, ref } from "vue";
import { formGroupConfigs, formGroupRules, formLayoutConfigs } from "./config";
import { message, showMessageBox } from "@/utils/message";

import EditForm from "@/components/EditForm/index.vue";
import { addDialog } from "@/components/ReDialog";
import { getUserInfo } from "@/utils/storage";
import { useEleHeight } from "@/hooks";
import { useRoute } from "vue-router";

export const useConfig = () => {
  const menuId = computed(() => {
    const mID = Number(route.query?.itemId as string);
    const result = Number.isNaN(mID) ? 0 : mID;
    return result; // 获取菜单ID
  });
  const treeRef = ref();
  const route = useRoute();
  const loading = ref<boolean>(false);
  const gLoading = ref<boolean>(false);
  const selectNode = ref<TableGroupItemType | any>({});
  const dataList = ref<MenuColumnItemType[]>([]);
  const treeOptions = ref<TableGroupItemType[]>([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 94);
  const queryParams = reactive({ menuId: menuId.value, columnGroupId: "", columnname: "" });

  onMounted(() => {
    getTableGroupList();
  });

  // 分组列表
  function getTableGroupList() {
    gLoading.value = true;
    tableGroupList({ menuId: route.query.itemId })
      .then((res) => {
        const data: any = [
          {
            uid: "1",
            id: "9a8579d6e1ec11ee81cd74852a1e09ea",
            page: null,
            limit: null,
            createDate: "Mon Mar 18 16:15:45 CST 2024",
            createUserId: "1385115",
            createUserName: null,
            modifyDate: null,
            modifyUserId: null,
            modifyUserName: null,
            menuId: "64",
            groupName: "主表格",
            remark: "",
            groupCode: "1",
            children: [
              {
                uid: "2",
                id: "9a8579d6e1ec11ee81cd74852a1e09ea",
                page: null,
                limit: null,
                createDate: "Mon Mar 18 16:15:45 CST 2024",
                createUserId: "1385115",
                createUserName: null,
                modifyDate: null,
                modifyUserId: null,
                modifyUserName: null,
                menuId: "64",
                remark: "",
                groupCode: "1",
                groupName: "表单配置",
                layoutType: "form"
              },
              {
                uid: "3",
                id: "9a8579d6e1ec11ee81cd74852a1e09ea",
                page: null,
                limit: null,
                createDate: "Mon Mar 18 16:15:45 CST 2024",
                createUserId: "1385115",
                createUserName: null,
                modifyDate: null,
                modifyUserId: null,
                modifyUserName: null,
                menuId: "64",
                remark: "",
                groupName: "表格配置",
                groupCode: "1",
                layoutType: "table"
              },
              {
                uid: "4",
                id: "9a8579d6e1ec11ee81cd74852a1e09ea",
                page: null,
                limit: null,
                createDate: "Mon Mar 18 16:15:45 CST 2024",
                createUserId: "1385115",
                createUserName: null,
                modifyDate: null,
                modifyUserId: null,
                modifyUserName: null,
                menuId: "64",
                remark: "",
                groupName: "按钮配置",
                groupCode: "1",
                layoutType: "button"
              }
            ]
          }
        ];
        console.log("获取分组", data);
        treeOptions.value = data || [];
        const activeRow = data[0].children[0];
        if (activeRow) {
          selectNode.value = activeRow;
          queryParams.menuId = +activeRow.menuId;
          queryParams.columnGroupId = activeRow.id;
          queryParams.columnname = activeRow.groupName;
          setSelectGroup(activeRow);
        }
      })
      .catch(console.log)
      .finally(() => (gLoading.value = false));
  }

  // 设置选中分组
  function setSelectGroup(row: TableGroupItemType) {
    treeRef.value?.setCheckedKeys([row.id], false);
  }
  // 选择分组
  function onNodeClick(row: TableGroupItemType) {
    selectNode.value = row;
    queryParams.menuId = +row.menuId;
    queryParams.columnGroupId = row.id;
    queryParams.columnname = row.groupName;
    setSelectGroup(row);
  }

  // 添加分组
  function onAddGroup() {
    openGroupDialog("add", {});
  }
  // 编辑分组
  function onEditGroup(row: TableGroupItemType) {
    openGroupDialog("edit", row);
  }

  async function openGroupDialog(type: "add" | "edit", row: Partial<TableGroupItemType>) {
    const formRef = ref();
    const title = { add: "新增", edit: "修改" }[type];
    const groupCodes = treeOptions.value.map((item) => +item.groupCode);
    const maxCode = Math.max(...groupCodes);
    const menuName = route.query.menuName ? `【${route.query?.menuName}】` : "";
    const createUserName = type === "edit" ? row.createUserName : getUserInfo().userName;

    const groupData = reactive({
      ...row,
      id: row.id ?? "",
      remark: row.remark ?? "",
      groupName: row.groupName ?? "",
      groupCode: row.groupCode ?? `${maxCode + 1}`,
      modifyUserName: row.modifyUserName,
      createUserName: createUserName,
      menuId: row.menuId ?? route.query?.itemId
    });

    addDialog({
      title: title + "分组" + menuName,
      props: {
        loading: loading,
        formInline: groupData,
        formRules: formGroupRules,
        formConfigs: formGroupConfigs(),
        formProps: { labelWidth: "100px" }
      },
      width: "640px",
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
        const groupCodes = treeOptions.value.map((item) => `${item.groupCode}`);
        if (groupCodes.includes(`${groupData.groupCode}`) && +groupData.groupCode !== +row.groupCode) {
          return message("分组编号已存在, 请重新输入", { type: "error" });
        }
        let tipMsg = "";
        if (type === "edit" && +groupData.groupCode !== +row.groupCode) {
          tipMsg = "注意:<br /> 修改分组编号, 会导致各分组获取到的表格配置数据错误, 建议保持当前顺序, 如需修改请联系前端人员。<br /> ";
        }

        FormRef.validate((valid) => {
          if (!valid) return;
          showMessageBox(`${tipMsg}确定要提交吗?`).then(() => {
            const reqApi = { add: addTableGroup, edit: updateTableGroup };
            reqApi[type](groupData)
              .then(({ data }) => {
                if (!data) return message(`${title}失败`, { type: "error" });
                done();
                message(`${title}成功`);
                getTableGroupList();
                setSelectGroup(selectNode.value);
              })
              .catch(console.log);
          });
        });
      }
    });
  }

  // 删除分组
  function onDeleteGroup(row: TableGroupItemType) {
    showMessageBox(`确定要删除分组【${row.groupName}】吗?`).then(() => {
      deleteTableGroup({ id: row.id })
        .then(({ data }) => {
          if (!data) return message("删除失败", { type: "error" });
          message("删除成功");
          selectNode.value = undefined;
          getTableGroupList();
        })
        .catch(console.log);
    });
  }

  // 添加布局
  function onAddLayout(row: TableGroupItemType | any) {
    const type = row.children ? "add" : "edit";
    openLayoutDialog(type, row);
  }

  async function openLayoutDialog(type: "add" | "edit", row: Partial<TableGroupItemType | any>) {
    const formRef = ref();
    const title = { add: "新增", edit: "修改" }[type];
    const menuName = route.query.menuName ? `【${route.query?.menuName}】` : "";
    const createUserName = type === "edit" ? row.createUserName : getUserInfo().userName;

    const groupData = reactive({
      ...row,
      id: row.id ?? "",
      remark: row.remark ?? "",
      groupName: row.groupName ?? "",
      layoutType: row.layoutType ?? "",
      groupCode: row.groupCode ?? "",
      modifyUserName: row.modifyUserName,
      createUserName: createUserName,
      menuId: row.menuId ?? route.query?.itemId
    });

    addDialog({
      title: title + "布局" + menuName,
      props: {
        loading: loading,
        formInline: groupData,
        formRules: formGroupRules,
        formConfigs: formLayoutConfigs(),
        formProps: { labelWidth: "100px" }
      },
      width: "640px",
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
        const groupCodes = treeOptions.value.map((item) => `${item.groupCode}`);
        if (groupCodes.includes(`${groupData.groupCode}`) && +groupData.groupCode !== +row.groupCode) {
          return message("分组编号已存在, 请重新输入", { type: "error" });
        }
        let tipMsg = "";
        if (type === "edit" && +groupData.groupCode !== +row.groupCode) {
          tipMsg = "注意:<br /> 修改分组编号, 会导致各分组获取到的表格配置数据错误, 建议保持当前顺序, 如需修改请联系前端人员。<br /> ";
        }

        FormRef.validate((valid) => {
          if (!valid) return;
          showMessageBox(`${tipMsg}确定要提交吗?`).then(() => {
            const reqApi = { add: addTableGroup, edit: updateTableGroup };
            reqApi[type](groupData)
              .then(({ data }) => {
                if (!data) return message(`${title}失败`, { type: "error" });
                done();
                message(`${title}成功`);
                getTableGroupList();
                setSelectGroup(selectNode.value);
              })
              .catch(console.log);
          });
        });
      }
    });
  }

  return {
    route,
    treeRef,
    gLoading,
    maxHeight,
    treeOptions,
    queryParams,
    selectNode,
    onNodeClick,
    onAddGroup,
    onAddLayout,
    onEditGroup,
    onDeleteGroup
  };
};
