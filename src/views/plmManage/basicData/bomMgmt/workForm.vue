<!-- /*
 * @Author: Hailen 
 * @Date: 2023-06-29 16:50:34 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-06-29 16:50:34 
 */ -->
<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { FormRules } from "element-plus";
import {
  roleAndGroupList,
  teamDepGroupList,
  TeamMemberItemType,
  teamDepGroupCode,
  GroupLeaderItemType,
  DepGroupItemType,
  RoleAndGroupType
} from "@/api/workbench/teamManage";

export interface FormWorkDataItem {
  staffName: string;
  roleId: string;
  deptId: string;
  groupId: string;
  id: string;
}

/** 部门类型 */
export interface DepInfoItemTree {
  id: string;
  parentId: string;
  name: string;
  title: string;
  director: string;
  displayOrder: number;
  children?: DepInfoItemTree[];
}

interface FormProps {
  formInline: Partial<FormWorkDataItem>;
  row: Partial<TeamMemberItemType>;
  depInfoTree: DepInfoItemTree[];
}

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({}),
  row: () => ({}),
  depInfoTree: () => []
});

const ruleFormRef = ref();
const loading = ref<boolean>(false);
const depGroupList = ref<DepGroupItemType[]>([]);
const formData = reactive<Partial<FormWorkDataItem>>(props.formInline);
const roleAndGroup = ref<RoleAndGroupType>({
  roleInfoList: [],
  deptGroupInfoList: []
});
const formRules = reactive<FormRules>({
  roleId: [{ required: true, message: "岗位为必选项", trigger: "blur" }],
  deptId: [{ required: true, message: "部门为必选项", trigger: "blur" }]
});

onMounted(() => {
  getDataList();
});

async function getDataList() {
  try {
    loading.value = true;
    const res = await teamDepGroupList();
    const res2 = await roleAndGroupList({ deptId: props.row.deptId });
    depGroupList.value = res.data;
    roleAndGroup.value = res2.data;
    loading.value = false;
  } catch (err) {
    loading.value = false;
  }
}

function getRef() {
  return ruleFormRef.value;
}
defineExpose({ getRef });
</script>

<template>
  <el-form ref="ruleFormRef" :model="formData" :rules="formRules" v-loading="loading" label-width="140px" class="pr-10">
    <el-form-item label="姓名" prop="staffName">
      <el-input v-model="formData.staffName" placeholder="请输入姓名" clearable />
    </el-form-item>
    <el-form-item label="岗位" prop="roleId">
      <el-select v-model="formData.roleId" filterable placeholder="请选择岗位" clearable class="ui-w-100">
        <el-option v-for="item in roleAndGroup.roleInfoList" :label="item.roleName" :value="item.id" :key="item.id" />
      </el-select>
    </el-form-item>
    <el-form-item label="部门" prop="deptId">
      <el-tree-select
        clearable
        :data="props.depInfoTree"
        :check-strictly="true"
        check-on-click-node
        :default-expand-all="true"
        :render-after-expand="false"
        v-model="formData.deptId"
        class="ui-w-100"
        placeholder="请选择部门"
        :props="{ label: 'title', value: 'id' }"
      />
    </el-form-item>
    <el-form-item label="组别" prop="groupId">
      <el-tree-select
        clearable
        v-model="formData.groupId"
        :data="depGroupList"
        :check-strictly="true"
        check-on-click-node
        :default-expand-all="true"
        :render-after-expand="false"
        class="ui-w-100"
        placeholder="请选择组别"
        :props="{ label: 'title', value: 'id' }"
      />
    </el-form-item>
  </el-form>
</template>
