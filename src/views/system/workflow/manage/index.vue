<!-- /*
 * @Author: Hailen 
 * @Date: 2023-07-05 11:45:27 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-07-05 11:45:27 
 */ -->

<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useConfig } from "./utils/hook";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "SystemWorkflowManageIndex" });

const {
  loading,
  columns,
  dataList,
  maxHeight,
  loadingStatus,
  buttonList,
  queryParams,
  searchOptions,
  onRefresh,
  onTagSearch,
  onEditTemplate,
  onEditFlow,
  onRowClick,
  onCurrentChange
} = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="no-wrap block-quote-tip ml-2">发起流程实例时需要 传入流程ID。暂停状态会影响到实例的发起</div>
    <div class="flex flex-1 ui-h-100 ui-w-100 ui-ov-h">
      <PureTableBar :columns="columns" @refresh="onRefresh" @change-column="setUserMenuColumns">
        <template #title>
          <BlendedSearch
            :queryParams="queryParams"
            @tagSearch="onTagSearch"
            :searchOptions="searchOptions"
            placeholder="请输入部署名称"
            searchField="deployName"
          />
        </template>
        <template #buttons>
          <ButtonList :buttonList="buttonList" :loadingStatus="loadingStatus" :auto-layout="false" more-action-text="业务操作" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="id"
            class="workflow-manage"
            :adaptive="true"
            align-whole="center"
            :loading="loading"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            :paginationSmall="size === 'small'"
            highlight-current-row
            :show-overflow-tooltip="true"
            @row-click="onRowClick"
            @row-dblclick="onEditTemplate"
            @page-current-change="onCurrentChange"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
          >
            <template #operation="{ row }">
              <el-button size="small" @click.stop="onEditTemplate(row)">修改</el-button>
              <el-button size="small" @click.stop="onEditFlow(row)">流程图</el-button>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
