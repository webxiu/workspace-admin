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
      >
        <template #default="{ node }">
          <span @contextmenu.prevent="contextMenuRef!.openMenu($event, node)">
            {{ node.label }}
          </span>
        </template>
      </el-tree>
      <context-menu :menu-items="menuItems" ref="contextMenuRef" />
    </div>
    <div class="flex-1 ui-ov-h">
      <PureTableBar :columns="columns" @refresh="onFresh" style="padding-top: 0" @change-column="setUserMenuColumns">
        <template #title>
          <BlendedSearch @tagSearch="handleTagSearch" :searchOptions="searchOptions" placeholder="父级物料编码" searchField="materialNumber" />
        </template>
        <template #buttons>
          <div>
            <ButtonList moreActionText="业务操作" :buttonList="buttonList" :loadingStatus="loadingStatus" :auto-layout="false" />
          </div>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            @row-click="rowClick"
            @row-dblclick="dblclick"
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="id"
            class="team-member"
            :adaptive="true"
            align-whole="left"
            :loading="loading"
            :row-style="rowStyle"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            :pagination="pagination"
            :paginationSmall="size === 'small' ? true : false"
            show-overflow-tooltip
            highlight-current-row
            @page-size-change="handleSizeChange"
            @page-current-change="handleCurrentChange"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
          >
            <template #disableStatus="{ row }">
              {{ row.disableStatus == 1 ? "禁用" : "未禁用" }}
            </template>
            <template #disableDate="{ row }">
              {{ row.disableDate ? dayjs(row.disableDate).format("YYYY-MM-DD HH:mm:ss") : "" }}
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import dayjs from "dayjs";
import { useTable } from "./config";
import { PureTableBar } from "@/components/RePureTableBar";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import ButtonList, { LoadingType } from "@/components/ButtonList/index.vue";
import ContextMenu from "./components/bomGroup/contextMenu.vue";
import { ContextMenuItem } from "./components/bomGroup/contextMenu.vue";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "PlmManageBasicDataBomMgmtIndex" });

const contextMenuRef = ref<InstanceType<typeof ContextMenu>>();

const {
  loading,
  dataList,
  columns,
  pagination,
  maxHeight,
  rowStyle,
  onFresh,
  dblclick,
  rowClick,
  handleSizeChange,
  handleCurrentChange,
  handleNodeClick,
  fetchLeftData,
  handleTagSearch,
  buttonList,
  categoryTreeData,
  curNodeName
} = useTable(contextMenuRef);

const menuItems = ref<ContextMenuItem[]>([
  {
    name: "新增",
    action: (item: any) => {
      contextMenuRef.value.onAdd(item, fetchLeftData);
    }
  },
  {
    name: "修改",
    action: (item: any) => {
      contextMenuRef.value.onEdit(item, fetchLeftData);
    }
  },
  {
    name: "删除",
    action: (item: any) => {
      contextMenuRef.value.onDelete(item, fetchLeftData);
    }
  }
]);

const loadingStatus = ref<LoadingType>({ loading: false, text: "" });

const searchOptions: SearchOptionType[] = [
  { label: "父级物料名称", value: "materialName" },
  {
    label: "审核状态",
    value: "state",
    children: [
      { label: "待提交", value: "0" },
      { label: "审核中", value: "1" },
      { label: "已审核", value: "2" },
      { label: "重新审核", value: "3" }
    ]
  }
];
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
