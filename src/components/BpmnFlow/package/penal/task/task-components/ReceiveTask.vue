<template>
  <div style="margin-top: 16px">
    <el-form-item label="消息实例">
      <div style="display: flex; flex-wrap: nowrap; align-items: center; justify-content: space-between">
        <el-select v-model="bindMessageId" @change="updateTaskMessage" class="ui-w-100">
          <el-option v-for="id in Object.keys(messageMap)" :value="id" :label="messageMap[id]" :key="id" />
        </el-select>
        <el-button size="small" type="primary" :icon="Plus" style="margin-left: 8px" @click="openMessageModel" />
      </div>
    </el-form-item>
    <el-dialog v-model="messageModelVisible" :close-on-click-modal="false" title="创建新消息" width="400px" append-to-body destroy-on-close>
      <el-form :model="newMessageForm" size="small" label-width="90px" @submit.prevent>
        <el-form-item label="消息ID">
          <el-input v-model="newMessageForm.id" clearable />
        </el-form-item>
        <el-form-item label="消息名称">
          <el-input v-model="newMessageForm.name" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="small" type="primary" @click="createNewMessage">确 认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { message } from "@/utils/message";
import { onUnmounted, toRaw } from "vue";
import { onMounted } from "vue";
import { ref, nextTick, watch, reactive } from "vue";
import { Plus } from "@element-plus/icons-vue";

const props = defineProps<{ id: string; type: string }>();

const bindMessageId = ref("");
const newMessageForm = reactive({
  id: "",
  name: ""
});
const messageMap = reactive({});
const messageModelVisible = ref(false);
const bpmnMessageRefsMap = reactive({});
const bpmnRootElements = ref();
const bpmnElement = ref();

watch(
  props,
  (val) => {
    nextTick(() => getBindMessage());
  },
  { immediate: true }
);

onMounted(() => {
  bpmnRootElements.value = window.bpmnInstances.modeler.getDefinitions().rootElements;
  bpmnRootElements.value
    .filter((el) => el.$type === "bpmn:Message")
    .forEach((m) => {
      bpmnMessageRefsMap[m.id] = m;
      messageMap[m.id] = m.name;
    });
  messageMap["-1"] = "无"; // 添加一个空对象，保证可以取消原消息绑定
});

onUnmounted(() => {
  bpmnElement.value = null;
});

const getBindMessage = () => {
  bpmnElement.value = window.bpmnInstances.bpmnElement;
  bindMessageId.value = bpmnElement.value.businessObject?.messageRef?.id || "-1";
};
const openMessageModel = () => {
  messageModelVisible.value = true;
};
const createNewMessage = () => {
  if (messageMap[newMessageForm.id]) {
    message("该消息已存在，请修改id后重新保存", { type: "error" });
    return;
  }
  const newMessage = window.bpmnInstances.moddle.create("bpmn:Message", newMessageForm);
  bpmnRootElements.value.push(newMessage);
  messageMap[newMessageForm.id] = newMessageForm.name;
  bpmnMessageRefsMap[newMessageForm.id] = newMessage;
  messageModelVisible.value = false;
};
const updateTaskMessage = (messageId) => {
  if (messageId === "-1") {
    window.bpmnInstances.modeling.updateProperties(toRaw(bpmnElement.value), {
      messageRef: null
    });
  } else {
    window.bpmnInstances.modeling.updateProperties(toRaw(bpmnElement.value), {
      messageRef: bpmnMessageRefsMap[messageId]
    });
  }
};
</script>
