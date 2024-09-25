<!-- /*
 * @Author: Hailen 
 * @Date: 2023-07-05 11:45:27 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-07-05 11:45:27 
 */ -->

<script setup lang="ts">
import { Plus, Delete, Edit, CirclePlus } from "@element-plus/icons-vue";
import { useConfig } from "./utils/hook";
import ButtonConfig from "./component/ButtonConfig/index.vue";
import TableConfig from "./component/TableConfig/index.vue";
import FormConfig from "./component/FormConfig/index.vue";

defineOptions({ name: "LayoutColumn" });

const { route, treeRef, gLoading, maxHeight, treeOptions, queryParams, selectNode, onNodeClick, onAddGroup, onAddLayout, onEditGroup, onDeleteGroup } =
  useConfig();
</script>

<template>
  <div class="ui-h-100 flex flex-1 main main-content">
    <div class="flex-col info-left-tree border-line">
      <div class="flex just-between border-line-bottom p-10" style="width: 254px">
        <div class="ellipsis">{{ route.query?.menuName }}分组</div>
        <el-button type="primary" size="small" :icon="Plus" @click="onAddGroup">添加分组</el-button>
      </div>
      <div style="padding: 8px 10px" v-loading="gLoading">
        <el-tree
          ref="treeRef"
          node-key="uid"
          :data="treeOptions"
          :default-expand-all="true"
          @node-click="onNodeClick"
          :props="{ children: 'children', label: 'groupName' }"
          :style="{ width: '220px', height: maxHeight + 'px' }"
        >
          <template #default="{ data }">
            <span class="custom-tree-node">
              <div class="ellipsis" :title="data.groupName">{{ data.groupCode }}.{{ data.groupName }}</div>
              <div class="group-btn">
                <el-icon v-if="data.children"><CirclePlus @click.stop="onAddLayout(data)" title="添加布局" class="ui-d-ib fz-16 ui-va-m" /></el-icon>
                <el-icon v-if="data.layoutType"><Edit @click.stop="onAddLayout(data)" title="修改分组" class="ui-d-ib fz-16 ui-va-m" /></el-icon>
                <el-icon v-else><Edit @click.stop="onEditGroup(data)" title="修改分组" class="ui-d-ib fz-16 ui-va-m" /></el-icon>
                <el-icon><Delete @click.stop="onDeleteGroup(data)" title="删除分组" class="ui-d-ib fz-16 ui-va-m" /></el-icon>
              </div>
            </span>
          </template>
        </el-tree>
      </div>
    </div>

    <div class="ui-h-100 flex-col flex-1 ui-ov-h pl-10 ui-p-r">
      <div>测试 菜单管理 配置(将表格、表单、按钮配置合并一个配置页面)-待开发...</div>
      <TableConfig v-show="selectNode.layoutType === 'table'" :menuId="queryParams.menuId" :groupId="queryParams.columnGroupId" />
      <FormConfig v-show="selectNode.layoutType === 'form'" :menuId="queryParams.menuId" :groupId="queryParams.columnGroupId" />
      <ButtonConfig v-show="selectNode.layoutType === 'button'" :menuId="queryParams.menuId" :groupId="queryParams.columnGroupId" />
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
