import { computed, h, reactive } from "vue";

import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import SelectRoles from "../SelectRoles.vue";
import { addDialog } from "@/components/ReDialog";

// 编辑员工信息校验
export const formRules = reactive<FormRules>({
  groupName: [{ required: true, message: "组名为必填项", trigger: "submit" }],
  roleName: [{ required: true, message: "角色必填项", trigger: "submit" }]
});

// 编辑员工信息表单
export const formConfigs = ({ type, stateOptions, deptOptions }, formData, resData, currentGroup): FormConfigItemType[] => {
  formData.userCodes = currentGroup.split(",");

  const treeData = computed(() => {
    const dataArr: any[] = [];
    resData.value.forEach((item) => {
      dataArr.push({
        label: item.userCode + (item.deptName ? `(${item.deptName})` : ""),
        key: item.userCode,
        initial: item.userCode + `(${item.deptName})`
      });
    });
    return dataArr;
  });

  const clickInput = () => {
    const setA = (v) => {
      formData.roleName = v.roleName;
      formData.roleId = v.id;
    };
    addDialog({
      title: "系统角色列表",
      width: "900px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(SelectRoles, { setA }),
      beforeSure: (done, { options }) => {
        done();
      }
    });
  };

  const filterMethod = (query, item) => {
    return item.initial.toLowerCase().includes(query.toLowerCase());
  };

  return [
    {
      label: "组名",
      prop: "groupName",
      colProp: { span: type === "add" ? 24 : 11 },
      labelWidth: type === "add" ? 50 : 100,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入组名" />;
      }
    },
    {
      label: "角色设置",
      prop: "roleName",
      hide: type === "add",
      labelWidth: 118,
      colProp: { span: 11 },
      render: ({ formModel, row }) => {
        return <el-input readonly v-model={formModel[row.prop]} placeholder="点击选择" onClick={() => clickInput()} />;
      }
    },
    {
      label: "",
      prop: "userCodes",
      hide: type === "add",
      colProp: { span: 24 },
      render: ({ formModel, row }) => {
        return type === "edit" ? (
          <el-transfer
            v-model={formModel[row.prop]}
            filterable
            filter-method={filterMethod}
            filter-placeholder="关键词搜索"
            data={treeData.value}
            titles={["全部组", "所在组"]}
          />
        ) : null;
      }
    }
  ];
};
