<template>
  <!-- 任务管理 -->
  <el-form size="small" :model="formData" label-width="90px" @submit.prevent>
    <template v-if="elementBaseInfo.$type === 'bpmn:UserTask'">
      <el-divider content-position="center" style="margin: 36px 0">任务管理</el-divider>
      <!-- 审批方式 -->
      <el-form-item label="审批方式">
        <template #label>
          <el-tooltip class="box-item" effect="light" placement="top-start">
            <template #default>
              <div>
                <span>审批方式</span>
                <el-icon style="margin-left: 2px" class="ui-va-tt fz-14">
                  <QuestionFilled style="color: orange" />
                </el-icon>
              </div>
            </template>
            <template #content>
              <div>
                <div class="fw-700">分配方式：</div>
                <div class="fw-700">用户：</div>
                <div>1、单用户：UEL标识为flowable:assignee</div>
                <div>2、多用户：UEL标识为flowable:collection</div>
                <div class="fw-700">角色：</div>
                <div>1、UEL标识为flowable:collection，UEL表达式为变量</div>
              </div>
            </template>
          </el-tooltip>
        </template>
        <el-radio-group v-model="formData.personFrom">
          <el-radio v-for="item in auditList" :label="item.value" :key="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="['用户', '角色'].includes(formData.personFrom)" :label="formData.personFrom">
        <ApprovalWay type="审批方式" :personFrom="formData.personFrom" :formData="formData.taskUsers" @add="updateTask" @delete="updateTask" />
      </el-form-item>
      <!-- 截止层级 -->
      <el-form-item v-if="['部门递归'].includes(formData.personFrom)" label="截止层级">
        <el-select v-model="formData.deptLevel" placeholder="请选择" clearable filterable style="width: 160px">
          <el-option v-for="item in flowStore.deptLevels" :label="item.optionName" :value="item.optionValue" :key="item.optionValue" />
        </el-select>
      </el-form-item>
      <!-- 抄送方式 -->
      <el-form-item label="抄送方式">
        <el-radio-group v-model="formData.carbonPersonFrom">
          <template v-for="item in auditList" :key="item.value">
            <el-radio v-if="['用户', '角色'].includes(item.value)" :label="item.value" :key="item.value">{{ item.label }}</el-radio>
          </template>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="['用户', '角色'].includes(formData.carbonPersonFrom)" :label="formData.carbonPersonFrom">
        <ApprovalWay type="抄送方式" :personFrom="formData.carbonPersonFrom" :formData="formData.carbonTaskUsers" @add="updateTask" @delete="updateTask" />
      </el-form-item>
      <!-- 通知对象 -->
      <el-form-item label="通知对象">
        <el-radio-group v-model="formData.notifyObjectFrom">
          <template v-for="item in auditList" :key="item.value">
            <el-radio v-if="['用户', '角色'].includes(item.value)" :label="item.value" :key="item.value">{{ item.label }}</el-radio>
          </template>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="['用户', '角色'].includes(formData.notifyObjectFrom)" :label="formData.notifyObjectFrom">
        <ApprovalWay type="通知对象" :personFrom="formData.notifyObjectFrom" :formData="formData.notifyTaskUsers" @add="updateTask" @delete="updateTask" />
      </el-form-item>
      <!-- 通知时机 -->
      <el-form-item label="通知时机">
        <el-radio-group v-model="formData.notifyOpportunity">
          <el-radio v-for="item in noticeTime" :label="item.value" :key="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 结束通知 -->
      <el-form-item label="结束通知">
        <el-checkbox-group v-model="formData.finishAdviceWay">
          <el-checkbox v-for="item in finishNotice" :label="item.value" :key="item.value">{{ item.label }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </template>
  </el-form>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import { QuestionFilled } from "@element-plus/icons-vue";
import ApprovalWay from "@/views/system/workflow/manage/taskManage/ApprovalWay.vue";
import { useBpmnStore, BpmnStoreKey } from "@/components/BpmnFlow/hooks";
import { FlowManageItemType, FlowTaskManageItemType } from "@/api/systemManage";
import { useBpmnFlowStore } from "@/store/modules/bpmn";

/** 元素信息 */
interface ElementBaseInfoType {
  $type: string;
  id: string;
}

/** 流程图操作存储store类型 */
interface BpmnStoreType {
  row: FlowManageItemType;
  deleteTaskFn: Function;
}
const props = withDefaults(defineProps<{ elementBaseInfo: ElementBaseInfoType; activeId: string }>(), {});

enum UserType {
  user = "用户",
  role = "角色"
}
const auditList = [
  { label: "用户", value: "用户" },
  { label: "角色", value: "角色" },
  { label: "部门", value: "部门" },
  { label: "部门递归", value: "部门递归" },
  { label: "直接上级", value: "直接上级" },
  { label: "动态指定", value: "动态指定" },
  { label: "自定义", value: "自定义" }
];
const noticeTime = [
  { label: "审批前", value: 1 },
  { label: "审批后", value: 2 }
];
const finishNotice = [
  { label: "部门文员", value: "1" },
  { label: "单据提交人", value: "2" }
];

const flowStore = useBpmnFlowStore();
const taskLists = ref<FlowTaskManageItemType[]>([]);
const { store, setBpmnStore } = useBpmnStore<BpmnStoreType>();
const formData = reactive({
  personFrom: "",
  persons: "",
  roleId: "",
  carbonPersonFrom: "",
  carbonPersons: "",
  carbonRoleId: "",
  taskUsers: { 用户: [], 角色: [] },
  carbonTaskUsers: { 用户: [], 角色: [] },
  notifyObjectFrom: "",
  notifyObjectRoleId: "",
  notifyTaskUsers: { 用户: [], 角色: [] },
  notifyOpportunity: "",
  finishAdviceWay: [],
  deptLevel: undefined
});

onMounted(() => {
  // 节点删除同时删除任务
  setBpmnStore(BpmnStoreKey.deleteTaskFn, ({ id }) => {
    taskLists.value = taskLists.value.filter((t) => t.taskId !== id);
  });
});

// 设置任务数据
watch(flowStore, (val) => (taskLists.value = val.taskLists), { immediate: true });

// 选中节点更新侧边任务
watch(props, (val) => {
  const taskEle = val.elementBaseInfo;
  if (taskEle.$type === "bpmn:UserTask") {
    if (val.activeId === taskEle.id) getTableData(taskEle.id);
  }
});

// 监听侧边任务选择
watch(formData, (val) => {
  const newList = taskLists.value.map((item) => {
    if (item.taskId === props.elementBaseInfo.id) {
      Object.keys(item).forEach((key) => {
        const itemRadios = ["personFrom", "carbonPersonFrom", "notifyObjectFrom", "notifyOpportunity"];
        if (key === "finishAdviceWay") {
          item[key] = (val[key] || []).join(","); // 数组选项转字符串
        } else if (itemRadios.includes(key) && val[key]) {
          item[key] = val[key]; // 仅更新表单选项
        }
      });
    }
    return item;
  });
  taskLists.value = newList;
});

watch(taskLists, (val) => saveData(val), { deep: true });

const getSelectId = (item: FlowTaskManageItemType, itemField: string, userField: string) => {
  const userCodes = item[userField]?.用户 ? item[userField]?.用户.map((item) => item.userCode) : [];
  const roleIds = item[userField]?.角色 ? item[userField]?.角色.map((item) => item.id) : [];
  const userId: string = item[itemField] === UserType.user ? userCodes.join(",") : undefined;
  const roleId: string = item[itemField] === UserType.role ? roleIds.join(",") : undefined;
  return { userId, roleId };
};

// 保存每次修改数据
const saveData = (tList: FlowTaskManageItemType[]) => {
  const resulst = tList.map((item) => {
    const processId = store.row?.processId;
    const result1 = getSelectId(item, "personFrom", "taskUsers");
    const result2 = getSelectId(item, "carbonPersonFrom", "carbonTaskUsers");
    const result3 = getSelectId(item, "notifyObjectFrom", "notifyTaskUsers");
    return {
      personFrom: item.personFrom,
      processId: item.processId || processId,
      taskId: item.taskId,
      carbonPersonFrom: item.carbonPersonFrom,
      persons: result1.userId,
      roleId: result1.roleId,
      carbonPersons: result2.userId,
      carbonRoleId: result2.roleId,
      id: item?.id,
      orgId: item.orgId,
      notifyObjectFrom: item.notifyObjectFrom,
      notifyOpportunity: item.notifyOpportunity,
      finishAdviceWay: item.finishAdviceWay,
      notifyObjectPersons: result3.userId,
      notifyObjectRoleId: result3.roleId,
      deptLevel: formData.personFrom === "部门递归" ? formData.deptLevel : undefined
      // uelexpr: "",
      // uelmark: ""
    };
  });
  console.log("resulst", resulst);
  setBpmnStore(BpmnStoreKey.taskConfig, resulst);
};

const getTableData = (taskId) => {
  const processId = store.row?.processId;
  if (!taskId) return;
  let oItem = taskLists.value?.find((f) => f.taskId === taskId);
  if (!oItem) {
    oItem = {
      processId: processId,
      taskId: taskId,
      persons: "",
      personFrom: "",
      roleId: "",
      carbonPersonFrom: "",
      carbonPersons: "",
      carbonRoleId: "",
      orgId: "",
      taskUsers: { 用户: [], 角色: [] },
      carbonTaskUsers: { 用户: [], 角色: [] },
      uelmark: "",
      uelexpr: "",
      notifyObjectFrom: "",
      notifyObjectPersons: "",
      notifyObjectRoleId: "",
      notifyTaskUsers: { 用户: [], 角色: [] },
      notifyOpportunity: "",
      finishAdviceWay: "",
      deptLevel: undefined
    };
    taskLists.value.push(oItem);
  }
  Object.keys(oItem).forEach((key) => {
    if (key === "finishAdviceWay") {
      const val = oItem[key]; // 字符串转数组回显表单
      if (!val) formData.finishAdviceWay = [];
      else formData.finishAdviceWay = val.split(",");
    } else {
      formData[key] = oItem[key];
    }
  });
};

// 缓存已选择的任务管理数据
const updateTask = ({ type, list }) => {
  const newList = taskLists.value.map((item) => {
    if (item.taskId === props.elementBaseInfo.id) {
      Object.keys(item).forEach((key) => {
        if (type === "审批方式" && key === "taskUsers") {
          item.taskUsers[item.personFrom] = list;
        } else if (type === "抄送方式" && key === "carbonTaskUsers") {
          item.carbonTaskUsers[item.carbonPersonFrom] = list;
        } else if (type === "通知对象" && key === "notifyTaskUsers") {
          item.notifyTaskUsers[item.notifyObjectFrom] = list;
        }
      });
    }
    return item;
  });
  taskLists.value = newList;
};
</script>
