<script setup lang="ts">
import { useConfig } from "./utils/hook";
import LogTimeLine from "./component/LogTimeLine.vue";
import { MarkdownViewer } from "./component/Markdown";

const props = defineProps(["formData"]);

const {
  tableRef,
  loading,
  oLoading,
  columns,
  dataList,
  maxHeight,
  taskView,
  activeView,
  loadingStatus,
  buttonList,
  pagination,
  taskLogList,
  rowClick,
  onStart,
  onSubmit,
  onFinish,
  getTableList,
  onRowDBClick,
  onPageSizeChange,
  onPageCurrentChange
} = useConfig(props);

defineExpose({ getTableList });
</script>

<template>
  <Row>
    <Col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
      <PureTableBar :columns="columns" :show-icon="false" style="padding-left: 0">
        <template #title>
          <ButtonList :buttonList="buttonList" :loadingStatus="loadingStatus" :auto-layout="false" more-action-text="业务操作" style="width: auto" />
        </template>
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
    </Col>
    <Col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
      <div v-loading="oLoading" class="content-warp" :style="{ height: maxHeight + 48 + 'px', overflowY: 'auto', boxSizing: 'border-box' }">
        <el-tabs v-model="activeView">
          <el-tab-pane label="任务预览" name="task">
            <div v-if="!taskView"><el-empty description="暂无数据" :imageSize="100" /></div>
            <MarkdownViewer v-else :value="taskView" :hideOutline="true" />
          </el-tab-pane>
          <el-tab-pane label="操作日志" name="log">
            <LogTimeLine :taskLogList="taskLogList" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </Col>
  </Row>
</template>
<style lang="scss" scoped>
:deep(.task-manage .el-table__expand-icon) {
  color: inherit;
}
:deep(.content-warp .el-loading-mask) {
  z-index: 2 !important;
}
</style>
