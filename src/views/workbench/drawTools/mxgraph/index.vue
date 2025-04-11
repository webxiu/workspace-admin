<template>
  <div class="ui-h-100" v-loading="loading">
    <iframe v-if="!loading" ref="iframeRef" id="iframe" width="100%" height="100%" @load="loaded" src="/mxgraph-editor/www/index.html" style="border: 0" />
  </div>
</template>

<script setup lang="ts">
import { http } from "@/utils/http";
import { ref, onMounted } from "vue";
import xmlConf from "./utils/xmlConf";
// import testInit from "./utils/testShap";
// import initMain from "./utils/swimlanes";
import { DrawToolItemType } from "@/api/workbench/teamManage";

type GraphDataType = {
  eventName: "save" | "init" | "exportFile";
  data: { xml: string; svg: string; filename: string };
};

interface Props {
  type?: "add" | "edit";
  row?: DrawToolItemType;
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
  // message.success("保存成功");
};

// 请求xml数据
const loadData = () => {
  loading.value = true;
  const { row } = props;
  if (props.type === "edit") {
    http.get(row?.virtualPath).then((res: any) => {
      loading.value = false;
      xml.value = res;
    });
  } else {
    loading.value = false;
  }
};

const loaded = () => {
  const { processName } = props.row;
  const postMsg = { eventName: "create", xml: xml.value, fileName: processName };
  iframeRef.value?.contentWindow.postMessage(postMsg, "*");
};
</script>
