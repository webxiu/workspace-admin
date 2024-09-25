<!-- /*
 * @Author: Hailen 
 * @Date: 2023-09-27 14:02:53 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-09-27 14:02:53 
 */ -->

<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useConfig, AuditState } from "./utils/hook";
import ButtonList from "@/components/ButtonList/index.vue";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "OaHumanResourcesLeaveApplyIndex" });

const {
  loading,
  columns,
  dataList,
  maxHeight,
  pagination,
  searchOptions,
  buttonList,
  onSearch,
  onAdd,
  queryParams,
  onSubmit,
  onEdit,
  onDelete,
  rowClick,
  handleTagSearch,
  onExport,
  onSizeChange,
  rowDbClick,
  onCurrentChange
} = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="flex flex-1 ui-h-100 ui-w-100 ui-ov-h">
      <PureTableBar :columns="columns" @refresh="onSearch" @change-column="setUserMenuColumns">
        <template #title>
          <BlendedSearch
            @tagSearch="handleTagSearch"
            :queryParams="queryParams"
            :searchOptions="searchOptions"
            placeholder="请输入姓名"
            searchField="userName"
          />
        </template>
        <template #buttons>
          <ButtonList :buttonList="buttonList" :autoLayout="false" more-action-text="业务操作" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight"
            @row-dblclick="rowDbClick"
            @row-click="rowClick"
            :max-height="maxHeight"
            row-key="id"
            class="leave-apply"
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
            @page-size-change="onSizeChange"
            @page-current-change="onCurrentChange"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
          >
            <template #operation="{ row }">
              <div style="text-align: left">
                <el-button size="small" @click.stop="onEdit(row)">{{
                  [AuditState.submit, AuditState.reAudit, AuditState.audited].includes(row.billState) ? "修改" : "查看"
                }}</el-button>
                <el-button size="small" @click.stop="onSubmit(row)" :disabled="![AuditState.submit, AuditState.reAudit].includes(row.billState)">
                  提交
                </el-button>
                <el-popconfirm :width="280" :title="`确认删除\n【${row.userName}】的请假单吗?`" @confirm="onDelete(row)">
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
