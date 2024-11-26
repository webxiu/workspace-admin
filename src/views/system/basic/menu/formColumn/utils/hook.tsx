/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-11-26 16:31:02
 */

import { FormColumnItemType, addFormGroup, deleteFormGroup, formGroupDetail, tableGroupList, updateFormGroup } from "@/api/systemManage";
import { computed, h, onMounted, reactive, ref } from "vue";
import { formConfigs, formRules } from "./config";
import { message, showMessageBox } from "@/utils/message";
import { useRoute, useRouter } from "vue-router";

import EditForm from "@/components/EditForm/index.vue";
import { addDialog } from "@/components/ReDialog";
import { useEleHeight } from "@/hooks";

type GroupTreeItemType = {
  id: string;
  createDate: string;
  tableName: string;
  groupName: string;
  type: string;
  menuId: string;
  groupCode: string;
};

export const useConfig = () => {
  const route = useRoute();
  const router = useRouter();

  const loading = ref<boolean>(false);
  const dataList = ref<FormColumnItemType[]>([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 98);
  const menuId = computed(() => {
    const mID = Number(route.query?.itemId as string);
    const result = Number.isNaN(mID) ? 0 : mID;
    return result; // 获取菜单ID
  });
  const treeRef = ref();
  const gLoading = ref<boolean>(false);
  const selectNode = ref<GroupTreeItemType | any>({});
  const treeOptions = ref<GroupTreeItemType[]>([]);
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
            id: "9a8579d6e1ec11e823cd74852a1e09ea",
            createDate: "Mon Mar 18 16:15:45 CST 2024",
            tableName: "xxxx_admin",
            groupName: "画图工具",
            type: "1",
            menuId: route.query.itemId,
            groupCode: "11",
            children: [
              {
                id: "9a85792a1e09ea",
                tableName: "xxxx_admin",
                groupName: "分组1",
                type: "2",
                menuId: route.query.itemId,
                groupCode: "22",
                children: [
                  { id: "9a8579d6e1ec", tableName: "xxxx_admin", groupName: "单据头", groupCode: "33", menuId: route.query.itemId, type: "2" },
                  { id: "11e1cd7485", tableName: "xxxx_admin", groupName: "单据明细", groupCode: "44", menuId: route.query.itemId, type: "2" },
                  { id: "2a1e09ea", tableName: "xxxx_admin", groupName: "阿里附近", groupCode: "66", menuId: route.query.itemId, type: "1" }
                ]
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
  function setSelectGroup(row: GroupTreeItemType) {
    treeRef.value?.setCheckedKeys([row.id], false);
  }
  // 选择分组
  function onNodeClick(row: GroupTreeItemType) {
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
  function onEditGroup(row: GroupTreeItemType) {
    openGroupDialog("edit", row);
  }

  // 删除分组
  function onDeleteGroup(row: GroupTreeItemType) {
    showMessageBox(`确定要删除分组【${row.groupName}】吗?`).then(() => {
      deleteFormGroup({ id: row.id })
        .then(({ data }) => {
          if (!data) return message("删除失败", { type: "error" });
          message("删除成功");
          selectNode.value = undefined;
          getTableGroupList();
        })
        .catch(console.log);
    });
  }

  async function openGroupDialog(type: "add" | "edit", row: Partial<GroupTreeItemType>) {
    const formRef = ref();
    const title = { add: "新增", edit: "修改" }[type];
    const formData = reactive({ ...row });
    addDialog({
      title: title + "表单类别",
      props: {
        loading: loading,
        formInline: formData,
        formRules: formRules,
        formConfigs: formConfigs(),
        formProps: { labelWidth: "100px" }
      },
      width: "460px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      showResetButton: true,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.validate((valid) => {
          if (!valid) return;
          showMessageBox(`确定要提交吗?`).then(() => {
            const reqApi = { add: addFormGroup, edit: updateFormGroup };
            reqApi[type](formData)
              .then(({ data }) => {
                if (!data) return message(`${title}失败`, { type: "error" });
                done();
                message(`${title}成功`);
                setSelectGroup(selectNode.value);
              })
              .catch(console.log);
          });
        });
      }
    });
  }
  const onBack = () => router.go(-1);

  return {
    treeRef,
    gLoading,
    queryParams,
    dataList,
    maxHeight,
    route,
    treeOptions,
    onNodeClick,
    onAddGroup,
    onEditGroup,
    onDeleteGroup,
    onBack
  };
};
