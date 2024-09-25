<!-- /*
 * @Author: Hailen
 * @Date: 2023-10-24 16:57:38
 * @Last Modified by:   Hailen
 * @Last Modified time: 2023-10-24 16:57:38
 */ -->

<script setup lang="ts">
import { useConfig } from "./utils/hook";
import { Col, Row } from "@/layout/Layout";
import { Edit } from "@element-plus/icons-vue";
import { PureTableBar } from "@/components/RePureTableBar";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "WorkbenchTeamManageApprovalIndex" });

const {
  tableRef,
  loading,
  loading2,
  columns,
  columns2,
  dataList,
  dataList2,
  maxHeight,
  groupArrsList,
  onEdit,
  onAllEdit,
  onRefresh,
  onRefresh2,
  onRowClick,
  onClear,
  onCurrentChange,
  handleSelectionChange
} = useConfig();
</script>

<template>
  <Row>
    <Col :xs="24" :sm="24" :md="15" :lg="15" :xl="15">
      <PureTableBar :columns="columns" @refresh="onRefresh" @change-column="setUserMenuColumns">
        <template #title>
          <TitleCate :name="groupArrsList[0]?.groupName" :border="false" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="itemId"
            class="approval-dep"
            :adaptive="true"
            align-whole="center"
            :loading="loading"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            :paginationSmall="size === 'small'"
            highlight-current-row
            :default-expand-all="true"
            :show-overflow-tooltip="true"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            @current-change="onCurrentChange"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
          />
        </template>
      </PureTableBar>
    </Col>
    <Col :xs="24" :sm="24" :md="9" :lg="9" :xl="9">
      <PureTableBar :columns="columns2" @refresh="onRefresh2" @change-column="setUserMenuColumns">
        <template #title>
          <el-button type="primary" @click="onAllEdit" :icon="Edit">批量修改</el-button>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            ref="tableRef"
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="itemId"
            class="approval-agent"
            :adaptive="true"
            align-whole="center"
            :loading="loading2"
            :size="size"
            :data="dataList2"
            :columns="dynamicColumns"
            :paginationSmall="size === 'small'"
            :show-overflow-tooltip="true"
            @row-click="onRowClick"
            @selection-change="handleSelectionChange"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns2)"
          >
            <template #operation="{ row }">
              <el-button type="warning" size="small" @click.stop="onEdit(row)">修改</el-button>
              <el-button :disabled="!row.userId" type="danger" size="small" @click.stop="onClear(row)">清空</el-button>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </Col>
  </Row>
</template>

<style scoped lang="scss">
:deep(.pure-table .approval-agent .el-table__expand-icon > .el-icon) {
  font-size: 16px;
}
</style>
