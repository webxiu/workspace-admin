<script setup lang="ts">
import { ElTree } from "element-plus";
import { Col, Row } from "@/layout/Layout";
import { PureTableBar } from "@/components/RePureTableBar";
import { Search } from "@element-plus/icons-vue";
import { useConfig } from "./utils/hook";
import { infoTreeData } from "./utils/config";
import ButtonList from "@/components/ButtonList/index.vue";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "WorkbenchInfoCenterIndex" });

const {
  treeRef,
  loading,
  taskType,
  formData,
  maxHeight,
  dataList,
  columns,
  pagination,
  buttonList,
  onSearch,
  onLookBill,
  onLookFlow,
  getTaskList,
  onRevoke,
  handleSizeChange,
  handleCurrentChange
} = useConfig();
</script>

<template>
  <Row>
    <Col :xs="24" :sm="24" :md="4" :lg="4" :xl="4">
      <div class="info-left-tree border-line">
        <el-tree
          ref="treeRef"
          :data="infoTreeData"
          :expand-on-click-node="false"
          default-expand-all
          node-key="id"
          :props="{ children: 'children', label: 'label' }"
          @node-click="getTaskList"
        />
      </div>
    </Col>
    <Col :xs="24" :sm="24" :md="20" :lg="20" :xl="20">
      <div class="flex-1 ui-ov-h main ui-h-100 ui-w-100" ref="tableRef">
        <PureTableBar title="列表" :columns="columns" @refresh="onSearch" style="padding-top: 0" @change-column="setUserMenuColumns">
          <template #title>
            <div class="inline-flex flex-wrap">
              <el-form :inline="true" :model="formData" class="search-form flex-1">
                <el-form-item class="mt-4 mb-4">
                  <el-input v-model="formData.billNo" @keyup.enter="onSearch" placeholder="请输入业务单号" style="width: 140px" clearable />
                </el-form-item>
                <el-form-item v-if="taskType === 'approve'" class="mt-4 mb-4">
                  <el-input v-model="formData.sendName" @keyup.enter="onSearch" placeholder="发起人" style="width: 140px" clearable />
                </el-form-item>
                <el-form-item v-if="taskType !== 'start'" class="mt-4 mb-4">
                  <el-date-picker
                    v-model="formData.sendTime"
                    :placeholder="taskType === 'approve' ? '发起时间' : '审批时间'"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                    class="wi-140"
                    clearable
                  />
                </el-form-item>
                <el-form-item class="mt-4 mb-4">
                  <el-button type="primary" :icon="Search" @click="onSearch">查询</el-button>
                </el-form-item>
              </el-form>
            </div>
          </template>
          <template #buttons>
            <ButtonList moreActionText="业务操作" :buttonList="buttonList" :auto-layout="false" />
          </template>
          <template v-slot="{ size, dynamicColumns }">
            <pure-table
              border
              row-key="taskId"
              class="info-center"
              :adaptive="true"
              :height="maxHeight - 10"
              :max-height="maxHeight - 10"
              align-whole="center"
              showOverflowTooltip
              :loading="loading"
              :size="size"
              :data="dataList"
              :columns="dynamicColumns"
              :pagination="pagination"
              :paginationSmall="size === 'small'"
              highlight-current-row
              @page-size-change="handleSizeChange"
              @page-current-change="handleCurrentChange"
              @cell-dblclick="onLookBill"
              @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
            >
              <template #operation="{ row }">
                <el-button size="small" class="reset-margin" @click="onLookBill(row)">查看单据</el-button>
                <el-button size="small" class="reset-margin" @click="onLookFlow(row)">流程图</el-button>
                <!-- <el-button size="small" type="danger" class="reset-margin" v-if="taskType === 'start'" @click="onRevoke(row)">撤销</el-button> -->
              </template>
            </pure-table>
          </template>
        </PureTableBar>
      </div>
    </Col>
  </Row>
</template>

<style lang="scss" scoped>
.info-left-tree {
  height: 100%;
  padding: 15px 40px 15px 10px;
}

:deep(.el-tree) {
  .is-current .el-tree-node__content {
    background-color: var(--el-tree-node-hover-bg-color);
  }
}

:deep(.search-form) {
  .el-form-item {
    margin-bottom: 0 !important;
  }
}
</style>
