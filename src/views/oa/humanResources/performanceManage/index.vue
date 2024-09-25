<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useConfig } from "./utils/hook";
import ButtonList from "@/components/ButtonList/index.vue";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "OaHumanResourcesPerformanceManageIndex" });

const {
  tableRef,
  columns,
  dataList,
  loading,
  maxHeight,
  pagination,
  buttonList,
  searchOptions,
  queryParams,
  onEdit,
  onDelete,
  onSearch,
  handleTagSearch,
  onCurrentChange,
  handleSizeChange,
  onSelect,
  onSelectAll,
  rowClick,
  onDbClick,
  onSummaryMethod,
  handleCurrentChange
} = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <PureTableBar :columns="columns" class="flex-1" @refresh="onSearch" @change-column="setUserMenuColumns">
      <template #title>
        <BlendedSearch
          @tagSearch="handleTagSearch"
          :searchOptions="searchOptions"
          :queryParams="queryParams"
          :immediate="false"
          placeholder="请输入姓名"
          searchField="userName"
        />
      </template>
      <template #buttons>
        <ButtonList :buttonList="buttonList" :auto-layout="false" more-action-text="业务操作" />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <div>
          <div>
            <pure-table
              id="performanceTableId"
              show-summary
              border
              :height="maxHeight"
              :max-height="maxHeight"
              ref="tableRef"
              row-key="id"
              class="bill-manage"
              :adaptive="true"
              align-whole="left"
              :loading="loading"
              :size="size"
              :data="dataList"
              :columns="dynamicColumns"
              :row-style="() => ({ cursor: 'pointer' })"
              :paginationSmall="size === 'small'"
              highlight-current-row
              :show-overflow-tooltip="true"
              :pagination="pagination"
              @current-change="onCurrentChange"
              @row-dblclick="onDbClick"
              @row-click="rowClick"
              @select="onSelect"
              @select-all="onSelectAll"
              @page-size-change="handleSizeChange"
              @page-current-change="handleCurrentChange"
              :summary-method="onSummaryMethod"
              @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
            >
              <template #operation="{ row }">
                <el-button size="small" type="default" @click="onEdit(row)">修改</el-button>
                <el-popconfirm :width="280" :title="`确认删除\n【${row.staffName}】的记录吗?`" @confirm="onDelete([row])">
                  <template #reference>
                    <el-button size="small" type="danger" @click.stop>删除</el-button>
                  </template>
                </el-popconfirm>
              </template>
            </pure-table>
          </div>
        </div>
      </template>
    </PureTableBar>
  </div>
</template>
