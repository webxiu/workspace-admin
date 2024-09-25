<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useConfig } from "./utils/hook";
import ButtonList from "@/components/ButtonList/index.vue";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "PlmManageProjectMgmtProjectManageIndex" });

const {
  columns,
  dataList,
  loading,
  maxHeight,
  pagination,
  searchOptions,
  buttonList,
  onFresh,
  handleTagSearch,
  onCurrentChange,
  handleSizeChange,
  leftRowDbClick,
  leftRowClick,
  onViewGantt,
  cellStyle,
  handleCurrentChange
} = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <PureTableBar :columns="columns" class="flex-1" @refresh="onFresh" @change-column="setUserMenuColumns">
      <template #title>
        <BlendedSearch @tagSearch="handleTagSearch" :searchOptions="searchOptions" placeholder="项目名称" searchField="projectName" />
      </template>
      <template #buttons>
        <ButtonList moreActionText="业务操作" :buttonList="buttonList" :auto-layout="false" />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <div>
          <div>
            <pure-table
              border
              :height="maxHeight"
              :max-height="maxHeight"
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
              @row-dblclick="leftRowDbClick"
              @row-click="leftRowClick"
              :cell-style="cellStyle"
              @current-change="onCurrentChange"
              @page-size-change="handleSizeChange"
              @page-current-change="handleCurrentChange"
              @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
            >
              <template #choice>
                <el-radio label="&nbsp;" size="small" />
              </template>
              <template #state="{ row }">
                {{ row.state == 0 ? "正常" : "禁用" }}
              </template>
              <template #operation="{ row }">
                <el-button :size="size" @click="onViewGantt(row)"> 甘特图 </el-button>
              </template>
              <template #progress="{ row }">
                <div><el-progress :text-inside="true" :stroke-width="16" :percentage="row.progress" status="success" /></div>
              </template>
            </pure-table>
          </div>
        </div>
      </template>
    </PureTableBar>
  </div>
</template>
