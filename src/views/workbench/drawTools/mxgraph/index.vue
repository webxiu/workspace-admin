<template>
  <div class="ui-h-100" v-loading="loading">
    <iframe v-if="!loading" ref="iframeRef" id="iframe" width="100%" height="100%" @load="loaded" src="/grapheditor/www/index.html" style="border: 0" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import xmlStr, { defultXml } from "./utils/xmlConf";
import { message } from "@/utils/message";
import { DrawListItem } from "../utils/hook";
// import initMain from "./utils/swimlanes";
// import testInit from "./utils/testShap";

type GraphDataType = {
  eventName: "save" | "init" | "exportFile";
  data: { xml: string; svg: string; filename: string };
};

interface Props {
  type?: "add" | "edit";
  row?: DrawListItem;
}

const props = defineProps<Props>();
const xml = ref("");
const iframeRef = ref();
const loading = ref(false);
const emits = defineEmits(["saveGraph"]);

onMounted(() => {
  loadData();
  window.addEventListener("message", messageCallback);
});

const messageCallback = (event) => {
  const data: GraphDataType = event.data;
  console.log("接收message:", data);
  if (!data.eventName) return;
  emits("saveGraph", data.data);
  message("保存成功");
};

// 请求xml数据
const loadData = () => {
  loading.value = true;
  const { row } = props;
  setTimeout(() => {
    loading.value = false;
    const xmlLocal = row?.xml || xmlStr;
    xml.value = xmlLocal;
  }, 1000);
};

const loaded = () => {
  if (!xml.value) return;
  const postMsg = { eventName: "create", data: xml.value };
  iframeRef.value?.contentWindow.postMessage(postMsg, "*");
};
</script>
