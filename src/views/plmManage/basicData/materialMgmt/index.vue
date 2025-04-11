<script setup lang="ts">
import { useTable } from "./config";
import ButtonList from "@/components/ButtonList/index.vue";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

interface Props {
  /** 是否在弹窗中加载, 默认否 */
  isModal?: boolean;
  /** 表格高度 */
  tableHeight?: number;
  /** 产品库物料型号 */
  productCode?: string;
}

defineOptions({ name: "PlmManageBasicDataMaterialMgmtIndex" });
const emits = defineEmits(["select"]);

const props = defineProps<Props>();

const {
  isAgTable,
  columnDefs,
  tableRef,
  loading,
  columns,
  dataList,
  maxHeight,
  pagination,
  queryParams,
  searchOptions,
  buttonList,
  curNodeName,
  loadingStatus,
  categoryTreeData,
  rowStyle,
  onFresh,
  dbClick,
  rowClick,
  onSelect,
  onSelectAll,
  onTagSearch,
  onSwitchTable,
  handleNodeClick,
  handleSizeChange,
  onSelectionChange,
  handleCurrentChange
} = useTable(emits, props);
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
        :getRowStyle="rowStyle"
        @refresh="onFresh"
        @switch="onSwitchTable"
        @cellClicked="rowClick"
        @rowSelected="onSelect"
        @cellDoubleClicked="dbClick"
        @sizeChange="handleSizeChange"
        @currentChange="handleCurrentChange"
        :headButtons="{ buttonList, autoLayout: false }"
        :blendedSearch="{ onTagSearch, queryParams, searchOptions, placeholder: '物料编号', searchField: 'number' }"
      />
      <PureTableBar v-else :columns="columns" @refresh="onFresh" @change-column="setUserMenuColumns" :show-icon="!isModal">
        <template #title>
          <BlendedSearch @tagSearch="onTagSearch" :queryParams="queryParams" :searchOptions="searchOptions" placeholder="物料编号" searchField="number" />
        </template>
        <template #buttons>
          <ButtonList v-if="!isModal" moreActionText="业务操作" :buttonList="buttonList" :loadingStatus="loadingStatus" :auto-layout="false" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            ref="tableRef"
            border
            :height="tableHeight || maxHeight"
            :max-height="tableHeight || maxHeight"
            row-key="id"
            :adaptive="true"
            :row-style="rowStyle"
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
            @select="onSelect"
            @selectAll="onSelectAll"
            @selection-change="onSelectionChange"
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
          </pure-table>
        </template>
      </PureTableBar>
    </Col>
  </Row>
</template>
