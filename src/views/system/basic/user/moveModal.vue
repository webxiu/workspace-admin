<template>
  <el-form ref="holidayFormRef" :model="formData" :inline="true" :rules="formRules" label-width="140px">
    <div class="flex">
      <div>
        <el-form-item label="移出部门">
          <el-tree-select
            v-model="formData.deptValue"
            filterable
            :data="deptOptions"
            :check-strictly="true"
            :default-expand-all="true"
            :render-after-expand="false"
            placeholder="请选择移出部门"
            @current-change="onNodeClick"
            :props="{ label: 'name', value: 'id' }"
          />
        </el-form-item>
        <el-form-item label="移出用户" prop="useList">
          <el-transfer
            v-loading="loading"
            v-model="formData.useList"
            :data="userData"
            filterable
            class="flex-1 no-wrap"
            filter-placeholder="搜索关键词"
            :titles="['用户列表 ', '已选用户']"
            :props="{ label: 'userName', key: 'userCode' }"
          >
            <template #default="{ option }">
              <span>
                {{ option.userName }}
                <span v-if="option.wageAccountingType === '员工'">({{ option.groupName }})</span>
              </span>
            </template></el-transfer
          >
        </el-form-item>
      </div>
      <div class="flex-col">
        <el-form-item label="移入部门" prop="toDept">
          <el-tree-select
            v-model="formData.toDept"
            filterable
            :data="deptOptions"
            :check-strictly="true"
            :default-expand-all="true"
            :render-after-expand="false"
            placeholder="请选择移入部门"
            @change="onDeptChange"
            :props="{ label: 'name', value: 'id' }"
          />
        </el-form-item>
        <el-form-item label="移入组别" prop="groupId">
          <el-select v-model="formData.groupId" placeholder="请选择">
            <el-option v-for="item in staffGroup" :label="item.groupName" :value="item.id" :key="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="移入岗位" prop="mPosition">
          <el-input v-model.trim="formData.mPosition" placeholder="请选择" clearable />
        </el-form-item>
      </div>
    </div>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from "vue";
import type { FormRules } from "element-plus";
import { DetartMenttemType, userInfoList } from "@/api/systemManage";
import { getStaffDeptGroup } from "@/api/oaManage/humanResources";

const props = withDefaults(defineProps<{ deptOptions?: DetartMenttemType[] }>(), {
  deptOptions: () => []
});

const userData = ref([]);
const moveOption = reactive([
  { optionName: "部门", optionValue: "1" },
  { optionName: "组别", optionValue: "2" },
  { optionName: "岗位", optionValue: "3" }
]);
const loading = ref(false);
const staffGroup = ref([]);

const formData = reactive({
  moveType: "",
  deptValue: "",
  useList: [],
  toDept: "",
  groupId: "",
  mPosition: ""
});

const formRules = reactive<FormRules>({
  moveType: [{ required: true, message: "请选择请假类型", trigger: "blur" }],
  deptValue: [{ required: true, message: "请选择开始日期", trigger: "blur" }],
  useList: [{ required: true, message: "请选择迁移用户", trigger: "blur" }]
});

// 获取部门id列表
const onNodeClick = (row: DetartMenttemType): void => {
  const childIds: string[] = [`${row.id}`];
  const fn = <T extends DetartMenttemType>(arr: T[]) => {
    arr.forEach((item) => {
      childIds.push(`${item.id}`);
      if (item?.children) fn(item.children);
    });
  };
  if (row.children) fn<DetartMenttemType>(row.children);
  getTableList(`${row.id}`, childIds);
};

// 获取根据部门ID, 获取用户列表
const getTableList = (deptId: string, deptIdList: string[]) => {
  loading.value = true;
  userInfoList({ page: 1, limit: 100000, userName: "", userCode: "", deptId, userState: "A", deptIdList })
    .then(({ data }) => {
      loading.value = false;
      userData.value = data?.records || [];
    })
    .catch(() => (loading.value = false));
};

// 选择部门
const onDeptChange = async (deptId) => {
  formData.groupId = "";
  const res = await getStaffDeptGroup({ deptId });
  staffGroup.value = res.data;
};

watch(
  props,
  (value) => {
    const rowNode = value.deptOptions[0];
    formData.deptValue = rowNode.id;
    onNodeClick(rowNode);
  },
  { immediate: true }
);

function getRef() {
  return {};
}

defineExpose({ getRef });
</script>
