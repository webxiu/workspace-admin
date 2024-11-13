<!-- /*
 * @Author: Hailen
 * @Date: 2023-11-20 14:18:00
 * @Last Modified by:   Hailen
 * @Last Modified time: 2023-11-20 14:18:00
 */ -->

<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useConfig } from "./utils/hook";
import { Search } from "@element-plus/icons-vue";
import ButtonList from "@/components/ButtonList/index.vue";
import LogTimeLine from "./component/LogTimeLine.vue";

defineOptions({ name: "SystemDevelopParamTaskManageIndex" });

const {
  tableRef,
  formData,
  loading,
  oLoading,
  columns,
  dataList,
  maxHeight,
  loadingStatus,
  buttonList,
  pagination,
  taskLogList,
  queryParams,
  searchOptions,
  taskManageOptions,
  rowStyle,
  onSearch,
  rowClick,
  onStart,
  onSubmit,
  onFinish,
  onHideDone,
  onRowDBClick,
  handleTagSearch,
  onPageSizeChange,
  onPageCurrentChange
} = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="flex just-between flex-wrap">
      <el-form ref="overTimeFormRef" :inline="true" :model="formData" class="flex flex-1 ml-2">
        <div class="flex">
          <BlendedSearch
            @tagSearch="handleTagSearch"
            :searchOptions="searchOptions"
            :queryParams="queryParams"
            placeholder="请输入任务名称"
            searchField="taskName"
            class="mb-8"
          />
          <el-form-item label="任务状态" prop="select">
            <el-select
              v-model="formData.select"
              multiple
              collapse-tags
              :max-collapse-tags="4"
              collapse-tags-tooltip
              placeholder="请选择任务状态"
              style="min-width: 388px"
            >
              <el-option v-for="item in taskManageOptions?.taskStatusList" :label="item.optionName" :value="item.optionValue" :key="item.optionValue" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="formData.hideChildDone" label="隐藏完成的子任务" @change="onHideDone" />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" type="primary" @click="onSearch">搜索</el-button>
          </el-form-item>
        </div>
      </el-form>
      <ButtonList :buttonList="buttonList" :loadingStatus="loadingStatus" :auto-layout="false" more-action-text="业务操作" style="width: auto" class="mb-4" />
    </div>
    <div class="flex flex-1 ui-h-100 ui-w-100 ui-ov-h">
      <PureTableBar :columns="columns" :showIcon="false" style="width: 75%">
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            ref="tableRef"
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="id"
            class="task-manage"
            :adaptive="true"
            align-whole="center"
            :loading="loading"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            :pagination="pagination"
            :paginationSmall="size === 'small'"
            highlight-current-row
            :default-expand-all="false"
            :show-overflow-tooltip="true"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            @row-click="rowClick"
            @row-dblclick="onRowDBClick"
            @page-size-change="onPageSizeChange"
            @page-current-change="onPageCurrentChange"
          >
            <template #operation="{ row }">
              <div style="text-align: left">
                <el-button size="small" type="danger" @click.stop="onStart(row)">开始</el-button>
                <el-popconfirm :width="180" :title="`确定要提交该任务吗?`" @confirm="onSubmit(row)">
                  <template #reference>
                    <el-button size="small" type="primary" @click.stop> 提交 </el-button>
                  </template>
                </el-popconfirm>
                <el-popconfirm :width="180" :title="`确定要完成该任务吗?`" @confirm="onFinish(row)">
                  <template #reference>
                    <el-button size="small" type="success" @click.stop> 完成 </el-button>
                  </template>
                </el-popconfirm>
              </div>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
      <div v-loading="oLoading" :style="{ width: '25%', height: maxHeight + 'px', overflowY: 'auto', boxSizing: 'border-box' }">
        <LogTimeLine :taskLogList="taskLogList" />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
:deep(.task-manage .el-table__expand-icon) {
  color: inherit;
}
</style>
