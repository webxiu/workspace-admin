<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useConfig } from "./utils/hook";
import ButtonList from "@/components/ButtonList/index.vue";

const {
  columns,
  dataList,
  loading,
  pagination,
  onEdit,
  onSearch,
  onCurrentChange,
  handleSizeChange,
  buttonList2,
  rowDbClick,
  rowStyle,
  onTagSearch,
  searchOptions,
  queryParams,
  handleCurrentChange
} = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <PureTableBar :columns="columns" class="flex-1" @refresh="onSearch" :show-icon="false">
      <template #title>
        <BlendedSearch @tagSearch="onTagSearch" :searchOptions="searchOptions" :queryParams="queryParams" placeholder="请输入姓名" searchField="userName" />
      </template>
      <template #buttons>
        <ButtonList :buttonList="buttonList2" :autoLayout="false" more-action-text="更多操作" />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <div>
          <div>
            <pure-table
              border
              :height="400"
              row-key="id"
              class="bill-manage"
              :adaptive="true"
              align-whole="left"
              :loading="loading"
              size="small"
              :data="dataList"
              :columns="dynamicColumns"
              :row-style="rowStyle"
              :paginationSmall="size === 'small'"
              highlight-current-row
              :show-overflow-tooltip="true"
              :pagination="pagination"
              @row-dblclick="rowDbClick"
              @current-change="onCurrentChange"
              @page-size-change="handleSizeChange"
              @page-current-change="handleCurrentChange"
            >
              <template #operation="{ row }">
                <el-button type="warning" plain size="small" @click="onEdit(row)">修改</el-button>
              </template>
            </pure-table>
          </div>
        </div>
      </template>
    </PureTableBar>
  </div>
</template>
