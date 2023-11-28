<template>
  <div style="margin-top: 16px">
    <el-form-item label="处理用户">
      <el-select v-model="userTaskForm.assignee" @change="updateElementTask('assignee')" class="ui-w-100">
        <el-option v-for="ak in mockData" :key="'ass-' + ak" :label="`用户${ak}`" :value="`user${ak}`" />
      </el-select>
    </el-form-item>
    <el-form-item label="候选用户">
      <el-select v-model="userTaskForm.candidateUsers" multiple collapse-tags @change="updateElementTask('candidateUsers')" class="ui-w-100">
        <el-option v-for="uk in mockData" :key="'user-' + uk" :label="`用户${uk}`" :value="`user${uk}`" />
      </el-select>
    </el-form-item>
    <el-form-item label="候选分组">
      <el-select v-model="userTaskForm.candidateGroups" multiple collapse-tags @change="updateElementTask('candidateGroups')" class="ui-w-100">
        <el-option v-for="gk in mockData" :key="'ass-' + gk" :label="`分组${gk}`" :value="`group${gk}`" />
      </el-select>
    </el-form-item>
    <el-form-item label="到期时间">
      <el-input v-model="userTaskForm.dueDate" clearable @change="updateElementTask('dueDate')" />
    </el-form-item>
    <el-form-item label="跟踪时间">
      <el-input v-model="userTaskForm.followUpDate" clearable @change="updateElementTask('followUpDate')" />
    </el-form-item>
    <el-form-item label="优先级">
      <el-input v-model="userTaskForm.priority" clearable @change="updateElementTask('priority')" />
    </el-form-item>
  </div>
</template>

<script lang="ts" setup>
import { onUnmounted, watch, reactive, ref, nextTick, toRaw } from "vue";

const props = defineProps<{ id: string; type: string }>();
const defaultTaskForm = reactive({
  assignee: "",
  candidateUsers: [],
  candidateGroups: [],
  dueDate: "",
  followUpDate: "",
  priority: ""
});
const userTaskForm = reactive({
  assignee: "",
  candidateUsers: "",
  candidateGroups: "",
  dueDate: "",
  followUpDate: "",
  priority: ""
});
const mockData = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
const bpmnElement = ref();

onUnmounted(() => {
  bpmnElement.value = null;
});
watch(
  props,
  (val) => {
    bpmnElement.value = window.bpmnInstances.bpmnElement;
    nextTick(() => {
      resetTaskForm();
    });
  },
  { immediate: true }
);

const resetTaskForm = () => {
  for (const key in defaultTaskForm) {
    let value;
    if (key === "candidateUsers" || key === "candidateGroups") {
      value = bpmnElement.value?.businessObject[key] ? bpmnElement.value.businessObject[key].split(",") : [];
    } else {
      value = bpmnElement.value?.businessObject[key] || defaultTaskForm[key];
    }
    userTaskForm[key] = value;
  }
};
const updateElementTask = (key) => {
  const taskAttr = Object.create(null);
  if (key === "candidateUsers" || key === "candidateGroups") {
    taskAttr[key] = userTaskForm[key] && userTaskForm[key].length ? userTaskForm[key].join() : null;
  } else {
    taskAttr[key] = userTaskForm[key] || null;
  }
  window.bpmnInstances.modeling.updateProperties(toRaw(bpmnElement.value), taskAttr);
};
</script>
