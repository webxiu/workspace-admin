<script setup lang="ts">
import { onMounted, ref } from "vue";
import axios from "axios";
const { VITE_PUBLIC_PATH } = import.meta.env;
import BpmnV3 from "@/components/BpmnV3/index.vue";

const xmlStr = ref("");

onMounted(() => {
  getXml();
});

const getXml = () => {
  axios({
    method: "get",
    url: `${VITE_PUBLIC_PATH}审批.bpmn20.xml`
  })
    .then(({ data }) => {
      xmlStr.value = data;
    })
    .catch((error) => {
      console.log("error", error);
    });
};
</script>

<template>
  <div class="bpmn-container">
    <!-- https://github.com/miyuesc/bpmn-process-designer -->
    <!-- <iframe width="100%" height="100%" @load="loaded" style="border: 0" src="/bpmn/index.html" ref="iframeRef" id="iframeRef" /> -->
    <BpmnV3 :xml="xmlStr" />
  </div>
</template>

<style scoped>
.bpmn-container {
  height: 100vh;
}
</style>
