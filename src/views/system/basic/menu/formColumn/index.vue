<!-- /*
 * @Author: Hailen 
 * @Date: 2023-07-05 11:45:27 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-07-05 11:45:27 
 */ -->

<script setup lang="ts">
import { ConfUrl } from "../utils/hook";
import { useConfig } from "./utils/hook";
import PreviewForm from "./component/PreviewForm.vue";
import FormConfigList from "./component/FormConfigList/index.vue";
import { Plus, Delete, Edit, Back } from "@element-plus/icons-vue";
import ColumnMenuList from "../tableColumn/component/ColumnMenuList.vue";

defineOptions({ name: "SystemBasicMenuFormColumn" });

const { treeRef, gLoading, queryParams, dataList, maxHeight, route, treeOptions, onNodeClick, onAddGroup, onEditGroup, onDeleteGroup, onBack } = useConfig();
</script>

<template>
  <div class="ui-h-100 flex flex-1 main main-content">
    <div class="flex-col pt-10 info-left-tree border-line">
      <div class="flex-col just-between border-line-bottom p-10" style="padding-top: 0">
        <div class="flex just-between align-center">
          <el-button @click="onBack" :icon="Back" size="small">返回</el-button>
          <ColumnMenuList :url="ConfUrl.table" />
        </div>
        <div class="flex just-between align-center mt-10">
          <div class="ellipsis">{{ route.query?.menuName }}</div>
          <el-button type="primary" size="small" :icon="Plus" @click="onAddGroup">添加表单</el-button>
        </div>
      </div>
      <div style="padding: 8px 10px" v-loading="gLoading">
        <el-tree
          ref="treeRef"
          node-key="uid"
          :data="treeOptions"
          :default-expand-all="true"
          @node-click="onNodeClick"
          :props="{ children: 'children', label: 'groupName' }"
          :style="{ width: '240px', height: maxHeight + 'px' }"
        >
          <template #default="{ data }">
            <span class="flex just-between ui-w-100">
              <div class="ellipsis" :title="data.groupName">{{ data.groupName }}</div>
              <div class="group-btn">
                <el-icon v-if="!data.children" size="18" title="修改"><Edit @click.stop="onEditGroup(data)" class="ui-d-ib ui-va-m" /></el-icon>
                <el-icon v-if="!data.children" size="18" title="删除"><Delete @click.stop="onDeleteGroup(data)" class="ui-d-ib ui-va-m" /></el-icon>
              </div>
            </span>
          </template>
        </el-tree>
      </div>
    </div>
    <div class="ui-h-100 flex-col flex-1 ui-ov-h pl-10 ui-p-r">
      <FormConfigList :height="maxHeight * 0.5" :queryParams="queryParams" @dataList="(data) => (dataList = data)" />
      <PreviewForm :height="maxHeight * 0.4" :columnList="dataList" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.info-left-tree {
  padding-top: 10px;

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
