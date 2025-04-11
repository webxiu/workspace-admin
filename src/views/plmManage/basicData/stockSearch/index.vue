<script setup lang="ts">
import { useTable } from "./config";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "PlmManageBasicDataStockSearchIndex" });

const {
  isAgTable,
  columnDefs,
  loading,
  dataList,
  columns,
  pagination,
  maxHeight,
  curNodeName,
  buttonList,
  searchOptions,
  categoryTreeData,
  onFresh,
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
      />
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
        @refresh="onFresh"
        @switch="onSwitchTable"
        @sizeChange="handleSizeChange"
        @currentChange="handleCurrentChange"
        :headButtons="{ buttonList, autoLayout: false }"
        :blendedSearch="{ onTagSearch, searchOptions, placeholder: '物料编码', searchField: 'number' }"
      />
      <PureTableBar v-else :columns="columns" @refresh="onFresh" @change-column="setUserMenuColumns">
        <template #title>
          <BlendedSearch @tagSearch="onTagSearch" :searchOptions="searchOptions" placeholder="物料编码" searchField="number" />
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
            :adaptive="true"
            align-whole="left"
            :loading="loading"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            :pagination="pagination"
            :paginationSmall="size === 'small'"
            show-overflow-tooltip
            highlight-current-row
            @page-size-change="handleSizeChange"
            @page-current-change="handleCurrentChange"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
          />
        </template>
      </PureTableBar>
    </Col>
  </Row>
</template>
