<template>
  <div class="main flex ui-h-100">
    <div class="info-left-tree border-line">
      <el-tree
        :data="categoryTreeData"
        node-key="id"
        :default-expanded-keys="['0']"
        :current-node-key="curNodeName"
        accordion
        :expand-on-click-node="false"
        highlight-current
        :props="{
          children: 'children',
          label: 'title'
        }"
        @node-click="handleNodeClick"
      />
    </div>
    <div class="flex-1 ui-ov-h">
      <PureTableBar :columns="columns" @refresh="onFresh" style="padding-top: 0" @change-column="setUserMenuColumns">
        <template #title>
          <BlendedSearch @tagSearch="handleTagSearch" :searchOptions="searchOptions" placeholder="属性名称" searchField="propertyName" />
        </template>
        <template #buttons>
          <ButtonList :buttonList="buttonList" :auto-layout="false" moreActionText="业务操作" />
          <input style="display: none" type="file" accept=".xls,.xlsx" id="importMaterialProp" @change="onChangeFileInput" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            id="materialPropTableId"
            @row-click="rowClick"
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="id"
            class="team-member"
            :adaptive="true"
            align-whole="left"
            :loading="loading"
            :size="size"
            :data="dataList"
            :row-class-name="rowClassName"
            :columns="dynamicColumns"
            show-overflow-tooltip
            highlight-current-row
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
          />
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useTable } from "./config";
import { PureTableBar } from "@/components/RePureTableBar";
import ButtonList from "@/components/ButtonList/index.vue";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "PlmManageBasicDataMaterialPropIndex" });

const {
  loading,
  dataList,
  columns,
  maxHeight,
  rowClassName,
  onFresh,
  rowClick,
  buttonList,
  categoryTreeData,
  searchOptions,
  handleNodeClick,
  onChangeFileInput,
  handleTagSearch,
  curNodeName
} = useTable();
</script>

<style lang="scss" scoped>
.info-left-tree {
  width: 250px;
  height: calc(100vh - 179.5px);
  padding: 10px 15px;
  overflow-y: auto;
}

.custom-tree-node {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  padding-right: 8px;
  font-size: 14px;
}
</style>
