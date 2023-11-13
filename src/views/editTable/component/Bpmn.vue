<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import axios from "axios";
const { VITE_PUBLIC_PATH } = import.meta.env;

interface XMLDataType {
  xml: string;
}

const props = withDefaults(defineProps<{ xml?: string; loading?: boolean }>(), {
  xml: "",
  loading: false
});

const iframeRef = ref();
const flowData = ref();
const iframeReload = ref(false);
const xmlStr = ref("");

onMounted(() => {
  getXml();
  window.addEventListener("message", (event) => {
    // 保存XML 接收返回数据
    flowData.value = event.data;
    console.log("iframe_message==>:", event.data);
  });
});

watch(props, (val) => {
  xmlStr.value = val.xml;
  if (!val.loading && iframeReload.value) {
    loadData({ xml: val.xml });
  }
});

const getXml = () => {
  axios({
    method: "get",
    url: `${VITE_PUBLIC_PATH}审批.bpmn20.xml`
  })
    .then(({ data }) => {
      xmlStr.value = data;
      if (iframeReload.value) {
        loadData({ xml: data });
      }
    })
    .catch((error) => {
      console.log("error", error);
    });
};

const loadData = (postMsg: XMLDataType) => {
  // 方式一: 流程图加载快 直接回显数据
  console.log("数据回显", postMsg);
  nextTick(() => {
    iframeRef.value?.contentWindow.postMessage(postMsg, "*");
    xmlStr.value = "";
  });
};

/** 方式二: 流程图加载慢 等待iframe加载完成再回显数据 */
const loaded = () => {
  iframeReload.value = true;
  console.log("iframe完成回调", { xml: xmlStr.value });
  if (xmlStr.value) {
    iframeRef.value?.contentWindow.postMessage({ xml: xmlStr.value }, "*");
  }
};
onUnmounted(() => {
  iframeReload.value = false;
});

function getRef() {
  return flowData.value;
}
defineExpose({ getRef });
</script>

<template>
  <div class="bpmn-container" v-loading="loading">
    <!-- https://github.com/miyuesc/bpmn-process-designer -->
    <iframe width="100%" height="100%" @load="loaded" style="border: 0" src="/bpmn/index.html" ref="iframeRef" id="iframeRef" />
  </div>
</template>

<style scoped>
.bpmn-container {
  height: 100vh;
}
</style>
