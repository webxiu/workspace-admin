<!-- /*
 * @Author: Hailen 
 * @Date: 2023-07-05 11:45:27 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-07-05 11:45:27 
 */ -->

<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { Plus, Delete, Back, Edit } from "@element-plus/icons-vue";
import ButtonList from "@/components/ButtonList/index.vue";
import ButtonConfigList from "./component/ButtonConfigList/index.vue";
import { useConfig } from "./utils/hook";
import "vue-json-pretty/lib/styles.css";
import ColumnMenuList from "./component/ColumnMenuList.vue";
import { ConfUrl } from "../utils/hook";

defineOptions({ name: "SystemBasicMenuTableColumn" });

const {
  route,
  treeRef,
  tableRef,
  columns,
  dataList,
  loading,
  gLoading,
  maxHeight,
  buttonList2,
  treeOptions,
  queryParams,
  loadingStatus,
  onBack,
  onNodeClick,
  onRefresh,
  onDelete,
  onAddGroup,
  onEditGroup,
  onDeleteGroup,
  onRowClick,
  onCopyColumn,
  handleSelectionChange
} = useConfig();
</script>

<template>
  <div class="ui-h-100 flex flex-1 main main-content">
    <div class="flex-col info-left-tree border-line">
      <div class="flex-col just-between border-line-bottom p-10" style="padding-top: 0">
        <div class="flex just-between align-center">
          <el-button @click="onBack" :icon="Back" size="small">返回</el-button>
          <ColumnMenuList :url="ConfUrl.table" />
        </div>
        <div class="flex just-between align-center mt-10">
          <div class="ellipsis">{{ route.query?.menuName }}分组</div>
          <el-button type="primary" size="small" :icon="Plus" @click="onAddGroup">添加分组</el-button>
        </div>
      </div>
      <div style="padding: 8px 10px" v-loading="gLoading">
        <el-tree
          ref="treeRef"
          node-key="id"
          :data="treeOptions"
          :default-expand-all="true"
          @node-click="onNodeClick"
          :props="{ children: 'children', label: 'groupName' }"
          :style="{ width: '220px', height: maxHeight - 30 + 'px' }"
        >
          <template #default="{ data }">
            <span class="custom-tree-node">
              <div class="ellipsis" :title="data.groupName">{{ data.groupCode }}.{{ data.groupName }}</div>
              <div class="group-btn">
                <el-icon><Edit @click.stop="onEditGroup(data)" title="修改分组" class="ui-d-ib fz-16 ui-va-m" /></el-icon>
                <el-icon><Delete @click.stop="onDeleteGroup(data)" title="删除分组" class="ui-d-ib fz-16 ui-va-m" /></el-icon>
              </div>
            </span>
          </template>
        </el-tree>
      </div>
    </div>

    <div class="ui-h-100 flex-col flex-1 ui-ov-h pl-10">
      <PureTableBar :columns="columns" class="flex-1" @refresh="onRefresh" style="padding-top: 0">
        <template #title>
          <div
            class="no-wrap block-quote-tip ui-w-100 mr-100"
            @contextmenu.prevent="() => onCopyColumn('paste')"
            @dblclick.prevent="() => onCopyColumn('copy')"
          >
            表格配置<span class="fz-14 color-f00 ml-1">(注: 名称、字段列必填项, 其他单元格不填默认值为空)</span>
          </div>
        </template>
        <template #buttons>
          <ButtonList moreActionText="更多选项" :buttonList="buttonList2" :loadingStatus="loadingStatus" :auto-layout="false" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            ref="tableRef"
            :height="maxHeight * 0.6"
            :max-height="maxHeight * 0.6"
            row-key="id"
            class="table-config"
            :adaptive="true"
            align-whole="center"
            :loading="loading"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            :paginationSmall="size === 'small'"
            highlight-current-row
            :show-overflow-tooltip="false"
            @row-click="onRowClick"
            @selection-change="handleSelectionChange"
          >
            <template #operation="{ row }">
              <el-popconfirm :width="280" :title="`确认删除字段\n【${row.prop}】吗?`" @confirm="onDelete([row])">
                <template #reference>
                  <el-button type="danger" size="small" @click.stop>删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
      <ButtonConfigList :height="maxHeight * 0.4 - 31" :menuId="queryParams.menuId" :columnGroupId="queryParams.columnGroupId" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.info-left-tree {
  padding: 10px 0;

  .custom-tree-node {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;
    font-size: 14px;
  }

  :deep(.el-tree-node:focus > .el-tree-node__content) {
    background-color: inherit;
  }

  :deep(.el-tree-node) {
    padding: 0 10px;

    .el-icon.is-leaf {
      display: none;
    }

    &.is-checked {
      color: #fff;
      background-color: rgb(127 178 255);

      .el-tree-node__content:hover {
        background-color: rgb(127 178 255);
      }
    }
  }

  .group-btn {
    display: inline-flex;

    .el-icon {
      margin-left: 5px;
    }
  }
}
</style>
