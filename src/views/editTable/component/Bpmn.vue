<script setup lang="ts">
import { onMounted, ref } from "vue";
const iframeRef = ref();
const flowData = ref();

onMounted(() => {
  window.addEventListener("message", (event) => {
    flowData.value = event.data;
    console.log("====数据获取", event.data);
  });

  const dataMsg = {
    xml: "", // Query the xml
    users: [
      { name: "张三", id: "1" },
      { name: "李四", id: "2" },
      { name: "麻子", id: "3" }
    ],
    isView: false
  };
  // loadData(dataMsg);
});

// 数据回显 方式一
const loadData = (postMsg) => {
  iframeRef.value.onload = () => {
    iframeRef.value.contentWindow.postMessage(postMsg, "*");
  };
};

const loaded = () => {
  console.log("加载iframe");
  // 加载时传递数据给子组件
  // if (iframeRef.value) {
  //   iframeRef.value.contentWindow.postMessage({ cwd: "sendMsg", params: { xmlStr: "" } }, "*");
  // }
};

function getRef() {
  return flowData.value;
}
defineExpose({ getRef });
</script>

<template>
  <div class="bpmn-container">
    <iframe width="100%" height="100%" @load="loaded" style="border: 0" src="/bpmn/index.html" ref="iframeRef" id="iframeRef" />
  </div>
</template>

<style scoped>
.bpmn-container {
  height: 100vh;
}
</style>
