<!-- /*
 * @Author: Hailen
 * @Date: 2023-10-05 14:07:10
 * @Last Modified by:   Hailen
 * @Last Modified time: 2023-10-05 14:07:10
 */ -->

<script setup lang="ts">
import { useConfig, AuditState } from "./utils/hook";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "HumanResourcesOvertimeOrderIndex" });

const {
  loading,
  columns,
  dataList,
  maxHeight,
  queryParams,
  pagination,
  buttonList,
  searchOptions,
  onSearch,
  rowClick,
  onAdd,
  onEdit,
  onDelete,
  onSubmit,
  onExport,
  onSizeChange,
  rowDbClick,
  handleTagSearch,
  onCurrentChange
} = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="flex flex-1 ui-h-100 ui-w-100 ui-ov-h">
      <PureTableBar :columns="columns" @refresh="onSearch" @change-column="setUserMenuColumns">
        <template #title>
          <BlendedSearch
            :queryParams="queryParams"
            @tagSearch="handleTagSearch"
            :searchOptions="searchOptions"
            placeholder="请输入姓名"
            searchField="staffName"
          />
        </template>
        <template #buttons>
          <ButtonList :buttonList="buttonList" :autoLayout="false" more-action-text="业务操作" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="id"
            class="overtime-order"
            :adaptive="true"
            align-whole="center"
            @row-click="rowClick"
            :loading="loading"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            :pagination="pagination"
            :paginationSmall="size === 'small'"
            highlight-current-row
            :show-overflow-tooltip="true"
            @row-dblclick="rowDbClick"
            @page-size-change="onSizeChange"
            @page-current-change="onCurrentChange"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
          >
            <template #operation="{ row }">
              <div style="text-align: left">
                <el-button size="small" @click.stop="onEdit(row)">{{
                  [AuditState.submit, AuditState.reAudit].includes(row.billState) ? "修改" : "查看"
                }}</el-button>
                <el-button size="small" @click.stop="onSubmit(row)" :disabled="![AuditState.submit, AuditState.reAudit].includes(row.billState)">
                  提交
                </el-button>
                <el-popconfirm :width="280" :title="`确认删除\n【${row.staffName}】的加班单吗?`" @confirm="onDelete(row)">
                  <template #reference>
                    <el-button size="small" type="danger" :disabled="![AuditState.submit, AuditState.reAudit].includes(row.billState)" @click.stop>
                      删除
                    </el-button>
                  </template>
                </el-popconfirm>
              </div>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
