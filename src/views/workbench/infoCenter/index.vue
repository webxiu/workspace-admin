<script setup lang="ts">
import { Col, Row } from "@/layout/Layout";
import { useConfig } from "./utils/hook";
import { infoTreeData } from "./utils/config";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "WorkbenchInfoCenterIndex" });

const {
  columnDefs,
  isAgTable,
  treeRef,
  loading,
  maxHeight,
  dataList,
  columns,
  pagination,
  buttonList,
  searchOptions,
  onTagSearch,
  onSearch,
  onLookBill,
  onLookFlow,
  getTaskList,
  onRevoke,
  handleSizeChange,
  handleCurrentChange,
  onSwitchTable
} = useConfig();
</script>

<template>
  <Row :gutter="8">
    <Col :xs="24" :sm="24" :md="4" :lg="4" :xl="4">
      <el-tree
        class="ui-ovy-a border-line mobile-tree mb-10"
        style="padding: 15px 40px 15px 10px"
        ref="treeRef"
        :data="infoTreeData"
        :expand-on-click-node="false"
        default-expand-all
        highlight-current
        node-key="id"
        :style="{ height: `${maxHeight + 50}px` }"
        :props="{ children: 'children', label: 'label' }"
        @node-click="getTaskList"
      />
    </Col>
    <Col :xs="24" :sm="24" :md="20" :lg="20" :xl="20">
      <AgGridTable
        v-if="isAgTable"
        rowKey="taskId"
        :rowData="dataList"
        :loading="loading"
        :columnDefs="columnDefs"
        :height="maxHeight + 12"
        :paginations="pagination"
        @refresh="onSearch"
        @switch="onSwitchTable"
        @cellDoubleClicked="onLookBill"
        @sizeChange="handleSizeChange"
        @currentChange="handleCurrentChange"
        :headButtons="{ buttonList, autoLayout: false }"
        :blendedSearch="{ onTagSearch, searchOptions, placeholder: '请输入业务单号', searchField: 'billNo' }"
      />
      <PureTableBar v-else :columns="columns" @refresh="onSearch" @change-column="setUserMenuColumns">
        <template #title>
          <BlendedSearch @tagSearch="onTagSearch" :searchOptions="searchOptions" placeholder="请输入业务单号" searchField="billNo" />
        </template>
        <template #buttons>
          <ButtonList moreActionText="业务操作" :buttonList="buttonList" :auto-layout="false" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            row-key="taskId"
            :adaptive="true"
            :height="maxHeight"
            :max-height="maxHeight"
            align-whole="center"
            showOverflowTooltip
            :loading="loading"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            :pagination="pagination"
            :paginationSmall="size === 'small'"
            highlight-current-row
            @page-size-change="handleSizeChange"
            @page-current-change="handleCurrentChange"
            @cell-dblclick="onLookBill"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
          >
            <template #operation="{ row }">
              <el-button size="small" class="reset-margin" @click="onLookBill(row)">查看单据</el-button>
              <el-button size="small" class="reset-margin" @click="onLookFlow(row)">流程图</el-button>
              <!-- <el-button size="small" type="danger" class="reset-margin" v-if="taskType === 'start'" @click="onRevoke(row)">撤销</el-button> -->
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </Col>
  </Row>
</template>
