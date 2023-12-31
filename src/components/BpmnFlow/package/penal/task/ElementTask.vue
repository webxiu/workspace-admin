<template>
  <div class="panel-tab__content">
    <el-form size="small" label-width="90px" @submit.prevent>
      <el-form-item label="异步延续">
        <el-checkbox v-model="taskConfigForm.asyncBefore" label="异步前" @change="changeTaskAsync" />
        <el-checkbox v-model="taskConfigForm.asyncAfter" label="异步后" @change="changeTaskAsync" />
        <el-checkbox v-model="taskConfigForm.exclusive" v-if="taskConfigForm.asyncAfter || taskConfigForm.asyncBefore" label="排除" @change="changeTaskAsync" />
      </el-form-item>
      <component :is="tasks[witchTaskComponent]" v-bind="$props" />
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import UserTask from "./task-components/UserTask.vue";
import ScriptTask from "./task-components/ScriptTask.vue";
import ReceiveTask from "./task-components/ReceiveTask.vue";
import { reactive, ref, toRaw, watch } from "vue";

const props = defineProps<{ id: string; type: string }>();

const tasks = { UserTask, ScriptTask, ReceiveTask };
const taskConfigForm = reactive({
  asyncAfter: false,
  asyncBefore: false,
  exclusive: false
});
const witchTaskComponent = ref("");
const installedComponent = reactive({
  // 手工任务与普通任务一致，不需要其他配置
  // 接收消息任务，需要在全局下插入新的消息实例，并在该节点下的 messageRef 属性绑定该实例
  // 发送任务、服务任务、业务规则任务共用一个相同配置
  UserTask: "UserTask", // 用户任务配置
  ScriptTask: "ScriptTask", // 脚本任务配置
  ReceiveTask: "ReceiveTask" // 消息接收任务
});

//
const bpmnElement = ref();

watch(
  props,
  (val) => {
    bpmnElement.value = window.bpmnInstances.bpmnElement;
    taskConfigForm.asyncBefore = bpmnElement.value?.businessObject?.asyncBefore;
    taskConfigForm.asyncAfter = bpmnElement.value?.businessObject?.asyncAfter;
    taskConfigForm.exclusive = bpmnElement.value?.businessObject?.exclusive;
    // type
    witchTaskComponent.value = installedComponent[val.type];
  },
  { immediate: true }
);

const changeTaskAsync = () => {
  if (!taskConfigForm.asyncBefore && !taskConfigForm.asyncAfter) {
    taskConfigForm.exclusive = false;
  }
  window.bpmnInstances.modeling.updateProperties(toRaw(window.bpmnInstances.bpmnElement), {
    ...taskConfigForm
  });
};
</script>
