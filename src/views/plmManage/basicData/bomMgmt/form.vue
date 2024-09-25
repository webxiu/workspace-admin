<!-- /*
 * @Author: Hailen 
 * @Date: 2023-06-29 16:50:34 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-06-29 16:50:34 
 */ -->
<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { FormRules } from "element-plus";
import { teamGroupLeader, teamDepGroupList, teamDepGroupCode, GroupLeaderItemType, DepGroupItemType } from "@/api/workbench/teamManage";
import { HandleType } from "./config";

export interface FormDataItem {
  groupName: string;
  groupCode: string;
  parentId: number | string;
  deptName: string;
  leaderId: number;
  deptId: number;
  id?: number;
}
interface FormProps {
  formInline: Partial<FormDataItem>;
  type: HandleType;
}

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({}),
  type: "add"
});

const ruleFormRef = ref();
const loading = ref<boolean>(false);
const leaderList = ref<GroupLeaderItemType[]>([]);
const depGroupList = ref<DepGroupItemType[]>([]);
const formData = reactive<Partial<FormDataItem>>(props.formInline);

const formRules = reactive<FormRules>({
  groupName: [{ required: true, message: "分组名称为必填项", trigger: "blur" }],
  groupCode: [{ required: true, message: "分组编号为必填项", trigger: "blur" }],
  deptName: [{ required: true, message: "所属部门为必填项", trigger: "blur" }]
});

onMounted(() => {
  getDataList();
});

async function getDataList() {
  try {
    loading.value = true;
    const res1 = await teamGroupLeader({ deptId: props.formInline.deptId });
    const res2 = await teamDepGroupList();
    leaderList.value = res1.data;
    depGroupList.value = res2.data;
    if (props.type === "add") {
      const res3 = await teamDepGroupCode();
      formData.groupCode = res3.data;
    }
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
    <el-form-item label="分组名称" prop="groupName">
      <el-input v-model="formData.groupName" placeholder="请输入分组名称" clearable />
    </el-form-item>
    <el-form-item label="分组编号" prop="groupCode">
      <el-input v-model="formData.groupCode" placeholder="请输入分组编号" readonly clearable />
    </el-form-item>
    <el-form-item label="所属分组" prop="parentId">
      <el-tree-select
        clearable
        :data="depGroupList"
        :check-strictly="true"
        check-on-click-node
        :default-expand-all="true"
        :render-after-expand="false"
        v-model="formData.parentId"
        class="ui-w-100"
        placeholder="请选择所属分组"
        :props="{ label: 'title', value: 'id' }"
      />
    </el-form-item>
    <el-form-item label="所属部门" prop="deptName">
      <el-input v-model="formData.deptName" readonly placeholder="请输入所属部门" clearable />
    </el-form-item>
    <el-form-item label="组别负责人" prop="leaderId">
      <el-select v-model="formData.leaderId" filterable placeholder="请直接选择或者搜索选择" clearable class="ui-w-100">
        <el-option v-for="item in leaderList" :label="item.userName" :value="item.id" :key="item.id" />
      </el-select>
    </el-form-item>
  </el-form>
</template>
