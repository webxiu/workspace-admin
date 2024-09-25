<script setup lang="ts">
import { ref } from "vue";
import { columns, columns2, columns3 } from "./config";

const treeData = ref([]);
const curNodeName = ref("");
const maxHeight = ref("58vh");
const loading = ref(false);
const loading2 = ref(false);
const loading3 = ref(false);
const dataList = ref([]);
const dataList2 = ref([]);
const dataList3 = ref([]);

const defaultProps = { children: "projectModelTasks", label: "name", id: "id" };

const setTreeData = (data) => {
  treeData.value = data;
  curNodeName.value = data[0].id;
  console.log(data, "get tree");
};

const onNodeClick = () => {};

const setHeight = (val) => {
  if (!val["0"]) {
    maxHeight.value = "74.5vh";
  } else {
    maxHeight.value = "58vh";
  }
};

defineExpose({ setTreeData, setHeight });
</script>

<template>
  <div class="deliver-box">
    <div class="left-tree">
      <el-tree
        accordion
        :data="treeData"
        :props="defaultProps"
        :defaultProps="defaultProps"
        :expand-on-click-node="false"
        :highlight-current="true"
        :default-expand-all="true"
        node-key="id"
        @node-click="onNodeClick"
      />
    </div>
    <div class="deliver">
      <pure-table
        border
        :height="maxHeight"
        :max-height="maxHeight"
        row-key="id"
        :adaptive="true"
        align-whole="left"
        :loading="loading"
        size="small"
        :data="dataList"
        :columns="columns"
        highlight-current-row
        :show-overflow-tooltip="true"
      />
    </div>
    <div class="resp-user">
      <pure-table
        border
        :height="maxHeight"
        :max-height="maxHeight"
        row-key="id"
        :adaptive="true"
        align-whole="left"
        :loading="loading2"
        size="small"
        :data="dataList2"
        :columns="columns2"
        highlight-current-row
        :show-overflow-tooltip="true"
      />
    </div>
    <div class="relate-user">
      <pure-table
        border
        :height="maxHeight"
        :max-height="maxHeight"
        row-key="id"
        :adaptive="true"
        align-whole="left"
        :loading="loading3"
        size="small"
        :data="dataList3"
        :columns="columns3"
        highlight-current-row
        :show-overflow-tooltip="true"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.deliver-box {
  display: flex;
  justify-content: space-between;

  .left-tree {
    width: 25vw;
  }

  .deliver {
    width: 24vw;
    margin-left: 10px;
  }

  .resp-user {
    width: 24vw;
    margin-left: 10px;
  }

  .relate-user {
    width: 24vw;
    margin-left: 10px;
  }
}
</style>
