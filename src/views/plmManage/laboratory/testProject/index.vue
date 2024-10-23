<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useTestProjectConfig } from "./utils/hook";
import ButtonList from "@/components/ButtonList/index.vue";
import ContextMenu from "./components/contextMenu.vue";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "PlmManageLaboratoryTestProjectIndex" });

const {
  columns,
  dataList,
  loading,
  maxHeight,
  pagination,
  searchOptions,
  buttonList,
  leftTwoLevelData,
  nodeItem,
  contextMenuRef,
  newMenusItems,
  onFresh,
  onTagSearch,
  handleSizeChange,
  onRowClick,
  onNodeClick,
  handleCurrentChange
} = useTestProjectConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="flex">
      <div class="info-left-tree border-line">
        <el-tree
          :data="leftTwoLevelData"
          node-key="id"
          :default-expanded-keys="['0']"
          :current-node-key="nodeItem?.id"
          accordion
          :expand-on-click-node="false"
          highlight-current
          @node-click="onNodeClick"
        >
          <template #default="{ node }">
            <span @contextmenu.prevent="contextMenuRef!.openMenu($event, node)">
              {{ node.label }}
            </span>
          </template>
        </el-tree>
        <context-menu :menu-items="newMenusItems" ref="contextMenuRef" />
      </div>
      <PureTableBar :columns="columns" class="flex-1" @refresh="onFresh" @change-column="setUserMenuColumns">
        <template #title>
          <BlendedSearch @tagSearch="onTagSearch" :searchOptions="searchOptions" placeholder="项目名称" searchField="projectName" />
        </template>
        <template #buttons>
          <ButtonList :buttonList="buttonList" :auto-layout="false" moreActionText="业务操作" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="id"
            class="bill-manage"
            :adaptive="true"
            align-whole="left"
            :loading="loading"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            :paginationSmall="size === 'small'"
            highlight-current-row
            :show-overflow-tooltip="true"
            :pagination="pagination"
            @row-click="onRowClick"
            @page-size-change="handleSizeChange"
            @page-current-change="handleCurrentChange"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
          />
        </template>
      </PureTableBar>
    </div>
  </div>
</template>

<style scoped lang="scss">
.info-left-tree {
  width: 250px;
  height: calc(100vh - 179.5px);
  padding: 10px 15px;
  margin-top: 7px;
  overflow-y: auto;
}
</style>
