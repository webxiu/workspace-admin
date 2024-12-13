<!-- /*
 * @Author: Hailen 
 * @Date: 2023-07-05 11:45:27 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-07-05 11:45:27 
 */ -->

<script setup lang="ts">
import { useConfig } from "./utils/hook";
import { ConfUrl } from "../utils/hook";
import { Plus, Back } from "@element-plus/icons-vue";
import ColumnMenuList from "./component/ColumnMenuList.vue";
import TableConfigList from "./component/TableConfigList/index.vue";
import ButtonConfigList from "./component/ButtonConfigList/index.vue";

defineOptions({ name: "SystemBasicMenuTableColumn" });

const { tableRef, gLoading, maxHeight, currentKey, treeOptions, queryParams, onBack, onGoTo, onNodeClick, onAddGroup, onEditGroup, onDeleteGroup } =
  useConfig();
</script>

<template>
  <div class="ui-h-100 flex flex-1 main main-content">
    <div class="flex-col info-left-tree border-line">
      <div class="flex-col just-between border-line-bottom p-10">
        <div class="flex just-between align-center">
          <div class="label-colon fz-14">配置菜单</div>
          <ColumnMenuList :url="ConfUrl.table" />
        </div>
        <div class="flex just-between align-center mt-10">
          <el-button @click="onBack" :icon="Back" size="small" type="danger">返回</el-button>
          <HxIcon icon="SetUp" @click="onGoTo" size="20" color="#409eff" class="ml-10 pointer" title="表单配置" />
          <el-button type="primary" size="small" :icon="Plus" @click="onAddGroup" style="margin-left: auto">添加分组</el-button>
        </div>
      </div>
      <div style="padding: 8px 10px" v-loading="gLoading">
        <el-tree
          node-key="id"
          :key="currentKey"
          :data="treeOptions"
          :current-node-key="currentKey"
          :default-expand-all="true"
          :highlight-current="true"
          @node-click="onNodeClick"
          :props="{ children: 'children', label: 'groupName' }"
          :style="{ width: '240px', height: maxHeight - 30 + 'px' }"
        >
          <template #default="{ data }">
            <span class="flex just-between flex-1">
              <div class="ellipsis" :title="data.groupName">{{ data.groupCode }}.{{ data.groupName }}</div>
              <div class="inline-flex">
                <HxIcon icon="Edit" size="18" title="修改分组" @click.stop="onEditGroup(data)" />
                <HxIcon icon="Delete" size="18" title="删除分组" @click.stop="onDeleteGroup(data)" class="ml-1" />
              </div>
            </span>
          </template>
        </el-tree>
      </div>
    </div>

    <div class="ui-h-100 flex-col flex-1 ui-ov-h pl-10">
      <TableConfigList ref="tableRef" :height="maxHeight * 0.9" />
      <ButtonConfigList :height="maxHeight * 0.4 + 12" :menuId="queryParams.menuId" :columnGroupId="queryParams.columnGroupId" />
    </div>
  </div>
</template>
