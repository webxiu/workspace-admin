/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-12-11 17:48:22
 */

import { TableGroupItemType, addTableGroup, deleteTableGroup, tableGroupList, updateTableGroup } from "@/api/systemManage";
import { computed, h, onMounted, reactive, ref } from "vue";
import { formGroupConfigs, formGroupRules } from "./config";
import { message, showMessageBox } from "@/utils/message";
import { useRoute, useRouter } from "vue-router";

import { ConfUrl } from "../../utils/hook";
import EditForm from "@/components/EditForm/index.vue";
import { addDialog } from "@/components/ReDialog";
import { getUserInfo } from "@/utils/storage";
import { useEleHeight } from "@/hooks";

export interface NodeItemProps {
  /** 菜单ID */
  menuId: number;
  /** 分组ID */
  columnGroupId: string;
}

export const useConfig = () => {
  const menuId = computed(() => {
    const mID = Number(route.query?.itemId as string);
    const result = Number.isNaN(mID) ? 0 : mID;
    return result; // 获取菜单ID
  });
  const tableRef = ref();
  const route = useRoute();
  const router = useRouter();
  const currentKey = ref<string>("");
  const loading = ref<boolean>(false);
  const gLoading = ref<boolean>(false);
  const selectNode = ref<TableGroupItemType>();
  const treeOptions = ref<TableGroupItemType[]>([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 84);
  const queryParams = reactive<NodeItemProps>({ menuId: menuId.value, columnGroupId: "" });

  onMounted(() => {
    getTableGroupList();
  });

  // 分组列表
  function getTableGroupList() {
    if (!route.query.itemId) return message.error("菜单ID不存在");
    gLoading.value = true;
    tableGroupList({ menuId: route.query.itemId })
      .then(({ data }) => {
        gLoading.value = false;
        treeOptions.value = data || [];
        const activeRow = selectNode.value || data[0];
        if (activeRow) {
          queryParams.columnGroupId = activeRow.id;
          onNodeClick(activeRow);
        }
      })
      .catch(() => (gLoading.value = false));
  }

  // 选择分组
  function onNodeClick(row: TableGroupItemType) {
    currentKey.value = row.id;
    selectNode.value = row;
    queryParams.columnGroupId = row.id;
    tableRef.value?.onSearch({ columnGroupId: row.id, menuId: row.menuId });
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
          return message.error("分组编号已存在, 请重新输入");
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
                if (!data) return message.error(`${title}失败`);
                done();
                message.success(`${title}成功`);
                getTableGroupList();
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
          if (!data) return message.error("删除失败");
          selectNode.value = undefined;
          message.success("删除成功");
          getTableGroupList();
        })
        .catch(console.log);
    });
  }

  // 返回
  const onBack = () => router.go(-1);

  // 去配置表单
  const onGoTo = () => router.push({ path: ConfUrl.form, query: route.query });

  return {
    tableRef,
    gLoading,
    maxHeight,
    currentKey,
    treeOptions,
    queryParams,
    onBack,
    onGoTo,
    onNodeClick,
    onAddGroup,
    onEditGroup,
    onDeleteGroup
  };
};
