<template>
  <div class="ui-h-100 flex-col flex-1 main main-content" :style="{ minHeight: `${maxHeight}px` }">
    <MarkdownViewer :loading="sLoading" :value="mdContent" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { MarkdownViewer } from "./component/Markdown";
import { useRoute } from "vue-router";
import { viewTask } from "@/api/systemManage";
import { useEleHeight } from "@/hooks";

defineOptions({ name: "SystemDevelopTaskManagePreview" });

const route = useRoute();
const sLoading = ref(false);
const mdContent = ref(`# 数据加载中...`);
const maxHeight = useEleHeight(".app-main > .el-scrollbar", -20);

onMounted(() => getData());

function getData() {
  const row = route.query;
  if (!row.id) return;
  sLoading.value = true;
  viewTask({ ids: row.id })
    .then(({ data }) => {
      if (!data?.markdown_content) return;
      mdContent.value = data?.markdown_content;
    })
    .catch((err) => err.message && (mdContent.value = `# ${err.message}`))
    .finally(() => (sLoading.value = false));
}
</script>
