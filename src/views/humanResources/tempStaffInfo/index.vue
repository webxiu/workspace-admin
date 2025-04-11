<!-- /*
 * @Author: Hailen
 * @Date: 2023-09-25 11:10:58
 * @Last Modified by:   Hailen
 * @Last Modified time: 2023-09-25 11:10:58
 */ -->

<script setup lang="ts">
import { useConfig2 } from "./utils/hook";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "HumanResourcesTempStaffInfo" });

const {
  columnDefs,
  isAgTable,
  tableRef,
  loading,
  columns,
  dataList,
  maxHeight,
  pagination,
  treeOptions,
  treeLoading,
  buttonList,
  queryParams,
  searchOptions,
  onEdit,
  onDelete,
  onSearch,
  onRowClick,
  onDbClick,
  onTagSearch,
  onSelect,
  onSelectAll,
  onNodeClick,
  onSizeChange,
  onCurrentChange,
  onSwitchTable
} = useConfig2();
</script>

<template>
  <Row :gutter="8">
    <Col :xs="24" :sm="24" :md="4" :lg="3" :xl="3">
      <el-tree
        node-key="id"
        class="ui-ovy-a border-line mobile-tree mb-10"
        v-loading="treeLoading"
        :data="treeOptions"
        :default-expand-all="false"
        :expand-on-click-node="false"
        :highlight-current="true"
        :default-expanded-keys="['0']"
        :props="{ children: 'children', label: 'name' }"
        :style="{ height: `${maxHeight + 50}px` }"
        @node-click="onNodeClick"
      />
    </Col>
    <Col :xs="24" :sm="24" :md="20" :lg="21" :xl="21">
      <AgGridTable
        v-if="isAgTable"
        ref="tableRef"
        rowKey="id"
        :rowData="dataList"
        :loading="loading"
        :columnDefs="columnDefs"
        :height="maxHeight + 12"
        :paginations="pagination"
        @refresh="onSearch"
        @switch="onSwitchTable"
        @cellClicked="onRowClick"
        @cellDoubleClicked="onEdit"
        @sizeChange="onSizeChange"
        @currentChange="onCurrentChange"
        :headButtons="{ buttonList, autoLayout: false }"
        :blendedSearch="{ onTagSearch, queryParams, searchOptions, searchField: 'staffName', placeholder: '请输入姓名' }"
      />
      <PureTableBar v-else :columns="columns" @refresh="onSearch" @change-column="setUserMenuColumns">
        <template #title>
          <BlendedSearch @tagSearch="onTagSearch" :searchOptions="searchOptions" :queryParams="queryParams" placeholder="请输入姓名" searchField="staffName" />
        </template>
        <template #buttons>
          <ButtonList :buttonList="buttonList" :autoLayout="false" more-action-text="业务操作" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            ref="tableRef"
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="id"
            class="temp-staffInfo"
            :adaptive="true"
            align-whole="center"
            :loading="loading"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            :pagination="pagination"
            :paginationSmall="size === 'small'"
            highlight-current-row
            :show-overflow-tooltip="true"
            @row-click="onRowClick"
            @select-all="onSelectAll"
            @row-dblclick="onDbClick"
            @page-size-change="onSizeChange"
            @page-current-change="onCurrentChange"
            @select="onSelect"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
          >
            <template #operation="{ row }">
              <el-button size="small" @click.stop="onEdit(row)">修改</el-button>
              <el-popconfirm :width="280" :title="`确认删除\n【${row.staffName}】吗?`" @confirm="onDelete(row)">
                <template #reference>
                  <el-button size="small" @click.stop>删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </Col>
  </Row>
</template>
