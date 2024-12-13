/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-12-12 11:08:00
 */

import { FormColumnItemType, FormGroupItemType, FormTypeItemType, addFormGroup, deleteFormGroup, formGroupList } from "@/api/systemManage";
import { computed, h, nextTick, onMounted, reactive, ref } from "vue";
import { formConfigs, formRules, formTypeOptions } from "./config";
import { message, showMessageBox } from "@/utils/message";
import { useRoute, useRouter } from "vue-router";

import { ConfUrl } from "../../utils/hook";
import EditForm from "@/components/EditForm/index.vue";
import { addDialog } from "@/components/ReDialog";
import { useEleHeight } from "@/hooks";

export const useConfig = () => {
  const formRef = ref();
  const route = useRoute();
  const router = useRouter();
  const loading = ref<boolean>(false);
  const currentKey = ref<string>("");
  const selectNode = ref<FormTypeItemType>();
  const dataList = ref<FormColumnItemType[]>([]);
  const treeOptions = ref<FormGroupItemType[]>([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 98);
  const showType = computed(() => selectNode.value?.groupType === formTypeOptions[0].optionValue);

  onMounted(() => {
    getFormGroupList();
  });

  // 获取分组表单
  function getFormGroupList(isReload = true) {
    if (!route.query.itemId) return message.error("菜单ID不存在");
    loading.value = true;
    formGroupList({ menuId: route.query.itemId })
      .then(({ data }) => {
        loading.value = false;
        // data = [
        //   {
        //     id: "185c799fe21311ee9687ec2a721046a8",
        //     page: null,
        //     limit: null,
        //     createDate: null,
        //     createUserId: null,
        //     createUserName: null,
        //     modifyDate: null,
        //     modifyUserId: null,
        //     modifyUserName: null,
        //     menuId: "64",
        //     groupName: "主表格",
        //     remark: "批量生成",
        //     groupCode: "1",
        //     groupType: "1",
        //     formGroupList: [
        //       {
        //         page: 1,
        //         limit: 50,
        //         id: "f400832caafc11ef9e1cec2a721046a8",
        //         menuId: 64,
        //         tableName: "sys_menulist",
        //         menuName: "菜单管理",
        //         groupName: "菜单管理主信息",
        //         groupType: "1",
        //         createUserId: null,
        //         createDate: "2024-11-25",
        //         modifyUserId: null,
        //         columnGroupName: null,
        //         columnGroupId: "185c799fe21311ee9687ec2a721046a8",
        //         modifyDate: null,
        //         deleteIds: null,
        //         createUserName: "原侃",
        //         modifyUserName: null
        //       },
        //       {
        //         page: 1,
        //         limit: 50,
        //         id: "f400832caafc11ef9e1cec2a721046a8",
        //         menuId: 64,
        //         tableName: "sys_menulist",
        //         menuName: "菜单管理",
        //         groupName: "测试2",
        //         groupType: "2",
        //         createUserId: null,
        //         createDate: "2024-11-25",
        //         modifyUserId: null,
        //         columnGroupName: null,
        //         columnGroupId: "185c799fe21311ee9687ec2a721046a8",
        //         modifyDate: null,
        //         deleteIds: null,
        //         createUserName: "原侃",
        //         modifyUserName: null
        //       }
        //     ]
        //   }
        // ];
        treeOptions.value = data || [];
        // 默认获取第一个分组下的第一个表单名称
        if (data?.[0] && data[0].formGroupList && isReload) {
          const activeRow = selectNode.value || data[0].formGroupList[0];
          if (activeRow) onNodeClick(activeRow);
        }
      })
      .catch(() => (loading.value = false));
  }

  // 选择分组
  function onNodeClick(row: FormTypeItemType) {
    currentKey.value = row.id;
    selectNode.value = row;
    nextTick(() => formRef.value?.onSearch(row));
  }

  // 添加分组
  function onAddGroup(row: FormTypeItemType) {
    const { menuId, id: columnGroupId, formGroupList } = row;
    openGroupDialog("add", { menuId, columnGroupId, formGroupList });
  }

  // 编辑分组
  function onEditGroup(row: FormGroupItemType) {
    openGroupDialog("edit", row);
  }

  function openGroupDialog(type: "add" | "edit", row: Partial<FormTypeItemType | FormGroupItemType>) {
    const title = { add: "新增", edit: "修改" }[type];
    const formRef = ref();
    const formData = reactive({ ...row });
    const name = type === "add" ? "" : `【${row.groupName}】`;
    addDialog({
      title: `${title}表单名称${name}`,
      props: {
        formInline: formData,
        formRules: formRules,
        formConfigs: formConfigs(),
        formProps: { labelWidth: "60px" }
      },
      width: "460px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const result = row.formGroupList?.find((f) => f.groupName === formData.groupName);
        if (result) return message.error(`表单名称【${formData.groupName}】已存在`);
        FormRef.validate((valid) => {
          if (!valid) return;
          showMessageBox(`确定要提交吗?`).then(() => {
            addFormGroup(formData)
              .then(({ data }) => {
                if (!data) return message.error(`${title}失败`);
                done();
                getFormGroupList(type === "add");
                message.success(`${title}成功`);
              })
              .catch(console.log);
          });
        });
      }
    });
  }

  // 删除分组
  function onDeleteGroup(row: FormTypeItemType) {
    showMessageBox(`确定要删除表单名称【${row.groupName}】吗?`).then(() => {
      deleteFormGroup({ id: row.id })
        .then(({ data }) => {
          if (!data) return message.error("删除失败");
          selectNode.value = undefined;
          message.success("删除成功");
          getFormGroupList();
        })
        .catch(console.log);
    });
  }

  // 返回
  const onBack = () => router.go(-1);

  // 去配置表格
  const onGoTo = () => router.push({ path: ConfUrl.table, query: route.query });

  return {
    formRef,
    loading,
    dataList,
    maxHeight,
    currentKey,
    showType,
    treeOptions,
    onBack,
    onGoTo,
    onNodeClick,
    onAddGroup,
    onEditGroup,
    onDeleteGroup
  };
};
