<script setup lang="ts">
import { useTable } from "./config";
import ButtonList from "@/components/ButtonList/index.vue";
import ContextMenu from "./components/bomGroup/contextMenu.vue";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "PlmManageBasicDataBomMgmtIndex" });

const {
  isAgTable,
  columnDefs,
  loading,
  dataList,
  columns,
  pagination,
  curNodeName,
  maxHeight,
  buttonList,
  loadingStatus,
  searchOptions,
  categoryTreeData,
  menuItems,
  contextMenuRef,
  rowStyle,
  onFresh,
  rowClick,
  rowDbClick,
  onTagSearch,
  handleNodeClick,
  handleSizeChange,
  handleCurrentChange,
  onSwitchTable
} = useTable();
</script>

<template>
  <Row :gutter="8">
    <Col :xs="24" :sm="24" :md="4" :lg="4" :xl="4">
      <el-tree
        class="ui-ovy-a border-line mobile-tree mb-10"
        :data="categoryTreeData"
        node-key="id"
        :default-expanded-keys="['0']"
        :current-node-key="curNodeName"
        accordion
        :expand-on-click-node="false"
        highlight-current
        :style="{ height: `${maxHeight + 50}px` }"
        :props="{ children: 'children', label: 'title' }"
        @node-click="handleNodeClick"
      >
        <template #default="{ node }">
          <span @contextmenu.prevent="contextMenuRef!.openMenu($event, node)">
            {{ node.label }}
          </span>
        </template>
      </el-tree>
      <ContextMenu :menu-items="menuItems" ref="contextMenuRef" />
    </Col>
    <Col :xs="24" :sm="24" :md="20" :lg="20" :xl="20">
      <AgGridTable
        v-if="isAgTable"
        ref="tableRef"
        rowKey="id"
        :rowData="dataList"
        :loading="loading"
        :columnDefs="columnDefs"
        :height="maxHeight + 12"
        :paginations="pagination"
        :getRowStyle="rowStyle"
        @refresh="onFresh"
        @switch="onSwitchTable"
        @cellClicked="rowClick"
        @cellDoubleClicked="rowDbClick"
        @sizeChange="handleSizeChange"
        @currentChange="handleCurrentChange"
        :headButtons="{ buttonList, loadingStatus, autoLayout: false }"
        :blendedSearch="{ onTagSearch, searchOptions, placeholder: '父级物料编码', searchField: 'materialNumber' }"
      />
      <PureTableBar v-else :columns="columns" @refresh="onFresh" style="padding-top: 0" @change-column="setUserMenuColumns">
        <template #title>
          <BlendedSearch @tagSearch="onTagSearch" :searchOptions="searchOptions" placeholder="父级物料编码" searchField="materialNumber" />
        </template>
        <template #buttons>
          <ButtonList :buttonList="buttonList" :loadingStatus="loadingStatus" :auto-layout="false" moreActionText="业务操作" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="id"
            :adaptive="true"
            align-whole="left"
            :loading="loading"
            :row-style="rowStyle"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            :pagination="pagination"
            :paginationSmall="size === 'small'"
            show-overflow-tooltip
            highlight-current-row
            @row-click="rowClick"
            @row-dblclick="rowDbClick"
            @page-size-change="handleSizeChange"
            @page-current-change="handleCurrentChange"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
          >
            <template #disableStatus="{ row }">
              {{ row.disableStatus == 1 ? "禁用" : "未禁用" }}
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </Col>
  </Row>
</template>
