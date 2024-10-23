<template>
  <div class="kimi-container flex-col">
    <div ref="msgRef" class="message-cont" :style="{ maxHeight: isFullScreen ? '100%' : maxHeight - 164 + 'px' }" v-mainHeight="{ offset: 50 }">
      <div class="flex flex-1 mb-10" :key="item.id" :class="`${item.role}-item`" v-for="(item, index) in historyList">
        <img class="user-role" v-if="['ai'].includes(item.role)" :src="aiImg" />
        <Typeing v-if="replying && index === historyList.length - 1 && ['ai'].includes(item.role)" :message="item.message" @finish="onFinish" />
        <Markdown v-else :message="item.message" />
        <img class="user-role" v-if="['user'].includes(item.role)" :src="userAvatar" />
      </div>
    </div>
    <div class="flex align-end mt-10">
      <el-input
        ref="inputRef"
        type="textarea"
        clearable
        resize="none"
        @keyup="onKeyup"
        v-model="formData.message"
        placeholder="请输入您的问题, 按Shift + Enter换行"
        :autosize="{ minRows: 2, maxRows: 4 }"
      />
      <el-button type="primary" class="ml-10" @click="onSubmit" :icon="Position" :loading="loading" :disabled="!formData.message || replying">
        {{ loading ? "回答中..." : "发送" }}
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import axios from "axios";
import Typeing from "./Typeing.vue";
import Markdown from "./Markdown.vue";
import { message } from "@/utils/message";
import { useEleHeight, useObserElement } from "@/hooks";
import aiImg from "@/assets/ai_img.png";
import { Position } from "@element-plus/icons-vue";
import { ref, reactive, computed, onMounted } from "vue";
import { ChatItemType, setChatMsg, getChattMsg } from "./utils";
import { useUserStore, useUserStoreHook } from "@/store/modules/user";

defineProps<{ isFullScreen: boolean }>();

const loading = ref(false);
const replying = ref(false);
const msgRef = ref<HTMLDivElement>();
const inputRef = ref<HTMLTextAreaElement>();
const formData = reactive({ message: "" });
const userAvatar = useUserStore().userInfo?.avatar;
const userInfo = computed(() => useUserStoreHook()?.userInfo);
const { initObserver, sendToBottom } = useObserElement(msgRef, 20);
const apiKey = atob(import.meta.env.VITE_KIMI_API_KEY);
const maxHeight = useEleHeight(".app-main > .el-scrollbar", -20);

const defaultMsg = {
  name: "Ai",
  role: "ai",
  id: Date.now(),
  message: `Hi，我是AI智能小助手～, 你可以随时问我任何问题，我会尽我所能回答你的问题。`,
  userCode: userInfo.value?.userCode,
  timestamp: new Date().toISOString()
};

const chatList = computed(() => {
  const msgList = getChattMsg();
  const list = msgList.filter(({ userCode }) => (userCode ? userCode === userInfo.value?.userCode : true));
  return list.length > 0 ? list : [defaultMsg];
});
const historyList = ref<ChatItemType[]>(chatList.value);

const kimiApi = axios.create({
  baseURL: "https://api.moonshot.cn/v1",
  headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }
});

onMounted(() => initObserver());

// 获取名字
function extractName(name) {
  if (name.length === 3) return name.slice(1);
  if (name.length >= 4) return name.slice(-2);
  return name;
}

/**
 * 添加消息
 * @param message 消息内容
 * @param role 角色{user|ai}
 * @param name 用户名称
 */
function setMessage(message, role = "user", name = "") {
  const item = {
    name: name,
    role: role,
    id: Date.now(),
    message: message,
    userCode: userInfo.value?.userCode,
    timestamp: new Date().toISOString()
  };
  historyList.value.push(item);
  setChatMsg(item);
  sendToBottom();
}

function onFinish() {
  replying.value = false;
}
function onKeyup(e) {
  if (!e.shiftKey && e.key === "Enter") onSubmit();
}

function onSubmit() {
  if (loading.value || replying.value) return;
  const content = formData.message.trim();
  if (!content) {
    formData.message = "";
    return message("请输入您的问题", { type: "warning" });
  }
  setMessage(content, "user", userInfo.value.userName);
  loading.value = true;
  replying.value = true;
  kimiApi
    .post(`/chat/completions`, {
      model: "moonshot-v1-8k",
      messages: [{ role: "user", content }],
      temperature: 0.3
    })
    .then((data) => {
      const reply = data.data.choices[0].message.content;
      loading.value = false;
      setMessage(reply, "ai", "AI");
    })
    .catch(() => {
      loading.value = false;
      replying.value = false;
    });
  formData.message = "";
}

// 后端接入消息
function onSubmit2() {
  loading.value = true;
  formData.message = "";
  fetch("http://192.168.2.202:3000/kimi/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("data", data);
      const reply = data.data;
      setMessage(reply, "ai");
    })
    .catch((error) => message(error, { type: "error" }))
    .finally(() => (loading.value = false));
}

function onClear() {
  historyList.value = [defaultMsg];
}

defineExpose({ onClear });
</script>

<style lang="scss" scoped>
.mobile {
  .message-cont {
    height: 653px !important;
  }
}
.kimi-container {
  width: 100%;
  height: 100%;
  min-width: 250px;
  border-radius: 8px;
  .message-cont {
    flex: 1;
    padding: 10px 10px 30px;
    overflow-y: auto;
    border-radius: 4px;
    background-color: var(--el-fill-color-light);
    height: 633px;
  }
  .user-role {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #dbdbdb;
  }
  .message {
    padding: 10px;
    border-radius: 10px;
    max-width: 100%;
    margin: 0 10px 10px;
    overflow-x: hidden;
  }
  .ai-item .message {
    margin-right: 50px;
    background: var(--el-color-primary-light-6);
  }
  .user-item .message {
    margin-left: 50px;
    background: var(--el-menu-border-color);
  }
}
</style>
