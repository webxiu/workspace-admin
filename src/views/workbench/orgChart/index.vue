<script setup lang="ts">
import { ref, onMounted } from "vue";
import html2canvas from "html2canvas";
import { orgchartData, OrgCharItemType } from "@/api/workbench/teamManage";
import { showMessageBox } from "@/utils/message";

defineOptions({ name: "WorkbenchOrgChart" });

const chartRef = ref();
const loading = ref<boolean>(false);
const expandKeys = ref<string[]>(["0"]);
const chartData = ref<OrgCharItemType | object>();

onMounted(() => {
  getOrgchartData();
});

const getOrgchartData = () => {
  loading.value = true;
  orgchartData({})
    .then((res) => {
      loading.value = false;
      const data = res.data;
      if (!data.length) return;
      const options = {
        id: "0",
        parentId: "-1",
        displayOrder: "",
        director: "冯瑞聪",
        name: "深圳市德龙电器有限公司",
        title: "深圳市德龙电器有限公司",
        children: data[0].children
      };
      getExpendKeys(data[0].children);
      chartData.value = options;
    })
    .catch(() => (loading.value = false));
};

const getExpendKeys = (options) => {
  for (let i = 0; i < options.length; i++) {
    const item = options[i];
    if (item.children?.length) {
      expandKeys.value.push(item.id);
      getExpendKeys(item.children);
    }
  }
};

const onExport = () => {
  showMessageBox(`您确定要导出德龙组织架构图吗?`).then(() => {
    onHtmltImage();
  });
};

const onHtmltImage = () => {
  if (!chartRef.value) return;
  const renderEle: HTMLElement = document.querySelector(".org-chart .zm-draggable");
  const zoomEl: HTMLElement = document.querySelector(".org-chart .zoom-container");
  zoomEl.style.transform = "scale(1)";

  html2canvas(renderEle, { useCORS: true }).then((canvas) => {
    const imgDataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = imgDataUrl;
    link.download = "德龙组织架构图";
    link.click();
  });
};
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="flex just-end align-center">
      <el-button size="small" class="ml-4" @click="onExport">导出</el-button>
    </div>
    <div class="ui-h-100" v-mainHeight v-loading="loading">
      <vue3-tree-org
        center
        v-if="chartData"
        ref="chartRef"
        class="org-chart"
        :data="chartData"
        :disabled="true"
        :horizontal="false"
        :collapsable="true"
        :props="{ label: 'title' }"
        :default-expand-keys="expandKeys"
        v-slot="{ node }"
      >
        <div class="org-box">
          <div class="org-name">{{ node.label || "&nbsp;" }}</div>
          <div class="org-user">{{ node.$$data.director || "&nbsp;" }}</div>
        </div>
      </vue3-tree-org>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$orgbgColor: #e17572;
$orgLine: #e17572;

.org-chart {
  .org-box {
    display: flex;
    flex-direction: column;
    min-width: 120px;
    overflow: hidden;
    white-space: nowrap;
    background-color: $orgbgColor;
    border: 2px solid $orgLine;
    border-radius: 6px;

    .org-name {
      padding: 2px 6px;
      color: #fff;
      background-color: $orgbgColor;
    }

    .org-user {
      padding: 6px;
      color: #111;
      background: #fff;
    }
  }

  :deep(.zm-draggable) {
    padding: 50px;
  }

  :deep(.tree-org-node__content .tree-org-node__inner) {
    box-shadow: none;
  }
  // 修改线条
  :deep(.tree-org-node::after) {
    z-index: -1;
    border-left: 2px solid $orgLine;
  }

  :deep(.tree-org-node:not(:first-child)::before) {
    border-top: 2px solid $orgLine;
  }

  :deep(.tree-org-node:not(:last-child)::after) {
    border-top: 2px solid $orgLine;
  }

  :deep(.tree-org-node__children::before) {
    border-left: 2px solid $orgLine;
  }

  :deep(.tree-org-node__expand) {
    background: var(--el-bg-color);
    border-color: $orgLine;
  }

  :deep(.collapsable .tree-org-node.collapsed .tree-org-node__content::after) {
    border-right: 2px solid $orgLine;
  }

  /** 加减号 */
  :deep(.tree-org-node__expand .tree-org-node__expand-btn::before) {
    border-color: $orgLine;
  }

  :deep(.tree-org-node__expand .tree-org-node__expand-btn::after) {
    border-color: $orgLine;
  }
}
</style>
