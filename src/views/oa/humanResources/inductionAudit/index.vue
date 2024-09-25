<!-- /*
 * @Author: Hailen 
 * @Date: 2023-09-19 15:09:28 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-09-19 15:09:28 
 */ -->

<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useConfig } from "./utils/hook";
import BasicInfo from "./basicInfo/index.vue";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "OaHumanResourcesInductionAuditIndex" });

const {
  tableRef,
  loading,
  rowData,
  columns,
  dataList,
  maxHeight,
  queryParams,
  searchOptions,
  pagination,
  buttonList,
  onTagSearch,
  onRefresh,
  onAudit,
  onDelete,
  onSelect,
  onSelectAll,
  onRowClick,
  onNodeDetail,
  onSizeChange,
  onCurrentChange
} = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <PureTableBar :columns="columns" @refresh="onRefresh" @change-column="setUserMenuColumns">
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
          :height="maxHeight / 2"
          :max-height="maxHeight / 2"
          row-key="id"
          class="induction-audit"
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
          @select="onSelect"
          @select-all="onSelectAll"
          @row-click="onRowClick"
          @page-size-change="onSizeChange"
          @page-current-change="onCurrentChange"
          @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
        >
          <template #operation="{ row }">
            <el-button size="small" @click.stop="onAudit(row)">审核</el-button>
            <el-button :disabled="![1, 2].includes(row.state)" size="small" @click.stop="onNodeDetail(row)">审核详情</el-button>
            <el-popconfirm :width="280" :title="`确认删除\n【${row.staffName}】吗?`" @confirm="onDelete([row])">
              <template #reference>
                <el-button size="small" type="danger" @click.stop>删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
    <BasicInfo v-if="rowData?.id" :maxHeight="maxHeight" :id="rowData?.id" />
  </div>
</template>
