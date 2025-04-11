<script setup lang="ts">
import { ref } from "vue";
import { useConfig } from "./utils/hook";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";
import ContextMenu, { ContextMenuItem } from "./utils/supplierGroup/contextMenu.vue";
import { message } from "@/utils/message";

defineOptions({ name: "ProductMkCenterPurchaseSupplierMgmtIndex" });
const emits = defineEmits(["select"]);
const contextMenuRef = ref<InstanceType<typeof ContextMenu>>();
const {
  columns,
  dataList,
  rowDbClick,
  rowClick,
  maxHeight,
  buttonList,
  handleSizeChange,
  handleCurrentChange,
  onCurrentChange,
  searchOptions,
  onFresh,
  pagination,
  handleTagSearch,
  categoryTreeData,
  curNodeName,
  fetchLeftData,
  handleNodeClick
} = useConfig(emits, contextMenuRef);

const menuItems = ref<ContextMenuItem[]>([
  {
    name: "新增",
    action: (item: any) => {
      if (item.data.id != "0") return message.warning("不允许在此操作分组");
      contextMenuRef.value.onAdd(item, fetchLeftData);
    }
  },
  {
    name: "修改",
    action: (item: any) => {
      if (item.data.id == "0") return message.warning("不允许操作此分组");
      contextMenuRef.value.onEdit(item, fetchLeftData);
    }
  },
  {
    name: "删除",
    action: (item: any) => {
      if (item.data.id == "0") return message.warning("不允许操作此分组");
      contextMenuRef.value.onDelete(item, fetchLeftData);
    }
  }
]);
</script>

<template>
  <div class="main flex ui-h-100">
    <div class="info-left-tree-sup border-line">
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
          label: 'groupName'
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
      <PureTableBar :columns="columns" class="flex-1" @refresh="onFresh" @change-column="setUserMenuColumns" show-icon>
        <template #title>
          <BlendedSearch @tagSearch="handleTagSearch" :searchOptions="searchOptions" placeholder="供应商名称" searchField="supplierName" />
        </template>
        <template #buttons>
          <ButtonList :buttonList="buttonList" :auto-layout="false" moreActionText="业务操作" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            id="productStoreTableId"
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="id"
            :adaptive="true"
            align-whole="left"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            :paginationSmall="size === 'small'"
            :pagination="pagination"
            :show-overflow-tooltip="true"
            highlight-current-row
            @current-change="onCurrentChange"
            @page-size-change="handleSizeChange"
            @page-current-change="handleCurrentChange"
            @row-dblclick="rowDbClick"
            @row-click="rowClick"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
          />
        </template>
      </PureTableBar>
    </div>
  </div>
</template>

<style lang="scss">
.info-left-tree-sup {
  width: 250px;
  height: calc(100vh - 179.5px);
  margin-top: 8px;
  padding: 10px 15px;
  overflow-y: auto;
}

.supplier-modal-mkt {
  .el-form-item--small {
    margin-bottom: 8px !important;
  }
}
</style>
