<script setup lang="ts">
import { useConfig } from "./utils/hook";
import { Col, Row } from "@/layout/Layout";
import Edit from "@iconify-icons/ep/edit";
import Delete from "@iconify-icons/ep/delete";
import CirclePlus from "@iconify-icons/ep/circle-plus";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "WorkbenchTeamManageMemberIndex" });

const {
  columnDefs,
  isAgTable,
  memberOption,
  loading,
  dataList,
  columns,
  pagination,
  maxHeight,
  searchOptions,
  onAdd,
  onEdit,
  remove,
  onSearch,
  onTagSearch,
  onNodeClick,
  handleEdit,
  handleSizeChange,
  handleCurrentChange,
  onSwitchTable
} = useConfig();
</script>

<template>
  <Row :gutter="8">
    <Col :xs="24" :sm="24" :md="4" :lg="5" :xl="5">
      <div class="ui-ovy-a border-line mobile-tree pt-10 mb-10" :style="{ height: `${maxHeight + 50}px` }">
        <el-divider style="margin: 10px auto">部门组管理</el-divider>
        <el-tree :data="memberOption.deptGroupTree" :default-expand-all="true" :props="{ children: 'children', label: 'title' }" @node-click="onNodeClick">
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              <span>{{ data.title }}</span>
              <span>
                <span v-if="!data.parentId" title="新增分组">
                  <IconifyIconOffline @click="onAdd(data)" :icon="CirclePlus" class="ui-d-ib fz-16 ui-va-m" />
                </span>
                <template v-else>
                  <span title="修改分组">
                    <IconifyIconOffline @click="onEdit(data)" :icon="Edit" title="修改分组" class="ui-d-ib fz-16 ui-va-m" />
                  </span>
                  <span title="删除分组">
                    <IconifyIconOffline @click="remove(data, node)" :icon="Delete" title="删除分组" class="ui-d-ib fz-16 ui-va-m ml-2" />
                  </span>
                </template>
              </span>
            </span>
          </template>
        </el-tree>
      </div>
    </Col>
    <Col :xs="24" :sm="24" :md="20" :lg="19" :xl="19">
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
        @refresh="onSearch"
        @sizeChange="handleSizeChange"
        @currentChange="handleCurrentChange"
        :blendedSearch="{ onTagSearch, searchOptions, placeholder: '请输入查询内容', searchField: 'staffId' }"
      />
      <PureTableBar v-else :columns="columns" @refresh="onSearch" @change-column="setUserMenuColumns">
        <template #title>
          <BlendedSearch @tagSearch="onTagSearch" :searchOptions="searchOptions" placeholder="请输入查询内容" searchField="staffId" />
        </template>
        <template #buttons />
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="id"
            class="team-member"
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
            @page-size-change="handleSizeChange"
            @page-current-change="handleCurrentChange"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
          >
            <template #operation="{ row }">
              <el-button size="small" @click.stop="handleEdit(row)">修改</el-button>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </Col>
  </Row>
</template>

<style lang="scss" scoped>
.custom-tree-node {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  padding-right: 8px;
  font-size: 14px;
}
</style>
