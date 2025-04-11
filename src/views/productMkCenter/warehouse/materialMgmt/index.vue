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
        :props="{ children: 'children', label: 'title' }"
        :style="{ height: `${maxHeight + 50}px` }"
        @node-click="handleNodeClick"
      />
    </Col>
    <Col :xs="24" :sm="24" :md="20" :lg="20" :xl="20">
      <AgGridTable
        v-if="isAgTable"
        ref="tableRef"
        rowKey="id"
        :loading="loading"
        :rowData="dataList"
        :columnDefs="columnDefs"
        :height="maxHeight + 12"
        :paginations="pagination"
        @switch="onSwitchTable"
        @refresh="onRefresh"
        @cellClicked="rowClick"
        @cellDoubleClicked="dbClick"
        @sizeChange="handleSizeChange"
        @currentChange="handleCurrentChange"
        :headButtons="{ buttonList, autoLayout: false }"
        :blendedSearch="{ onTagSearch, searchOptions, placeholder: '物料编号', searchField: 'number' }"
      />
      <PureTableBar v-else :columns="columns" @refresh="onRefresh" @change-column="setUserMenuColumns">
        <template #title>
          <BlendedSearch @tagSearch="onTagSearch" :searchOptions="searchOptions" placeholder="物料编号" searchField="number" />
        </template>
        <template #buttons>
          <ButtonList moreActionText="更多操作" :buttonList="buttonList" :auto-layout="false" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            ref="tableRef"
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
            @row-click="rowClick"
            @row-dblclick="dbClick"
            @page-size-change="handleSizeChange"
            @page-current-change="handleCurrentChange"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
          >
            <template #pushState="{ row }">
              {{ row.pushState == 1 ? "已下推" : "待下推" }}
            </template>
            <template #cbcertification="{ row }">
              {{ row.cbcertification == 1 ? "是" : "否" }}
            </template>
            <template #isfrozen="{ row }">
              {{ row.isfrozen == 1 ? "是" : "否" }}
            </template>
            <template #miniQuantity="{ row }">
              {{ row.materialOtherVO?.fMinIssueQty ?? "" }}
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </Col>
  </Row>
</template>
<script setup lang="ts">
import { useTable } from "./hooks";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "ProductMkCenterWarehouseMaterialMgmtIndex" });

const {
  columnDefs,
  isAgTable,
  tableRef,
  columns,
  dataList,
  loading,
  pagination,
  maxHeight,
  buttonList,
  curNodeName,
  searchOptions,
  categoryTreeData,
  onRefresh,
  dbClick,
  rowClick,
  onTagSearch,
  handleNodeClick,
  handleSizeChange,
  handleCurrentChange,
  onSwitchTable
} = useTable();
</script>

<style lang="scss">
.modal-class .el-form-item {
  margin-bottom: 0 !important;
}
</style>
