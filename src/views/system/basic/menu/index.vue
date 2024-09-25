<!-- /*
 * @Author: Hailen 
 * @Date: 2023-07-05 11:45:27 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-07-05 11:45:27 
 */ -->

<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { ConfUrl, useConfig } from "./utils/hook";
import ButtonList from "@/components/ButtonList/index.vue";
import { Connection } from "@element-plus/icons-vue";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "SystemBasicMenuIndex" });

const { columns, dataList, loading, maxHeight, keyword, buttonList, optionList, onRefresh, onEdit, onDelete, onCurrentChange } = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <PureTableBar :columns="columns" class="flex-1" @refresh="onRefresh" @change-column="setUserMenuColumns">
      <template #title>
        <div>
          <el-select v-model="keyword" clearable filterable default-first-option :reserve-keyword="false" placeholder="请选择项目名称" style="width: 240px">
            <el-option v-for="item in optionList" :key="item.menuName" :label="item.menuName" :value="item.menuName" />
          </el-select>
        </div>
      </template>
      <template #buttons>
        <ButtonList moreActionText="更多选项" :buttonList="buttonList" :auto-layout="false" />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
          :height="maxHeight"
          :max-height="maxHeight"
          row-key="itemId"
          class="menu-manage"
          :adaptive="true"
          align-whole="center"
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :paginationSmall="size === 'small'"
          highlight-current-row
          :default-expand-all="true"
          :show-overflow-tooltip="true"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          @current-change="onCurrentChange"
          @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
        >
          <template #operation="{ row }">
            <el-button size="small" @click.stop="onEdit(row)">修改</el-button>
            <el-popconfirm :width="280" :title="`确认删除\n【${row.menuName}】?`" @confirm="onDelete(row)">
              <template #reference>
                <el-button size="small" @click.stop>删除</el-button>
              </template>
            </el-popconfirm>
          </template>
          <template #itemId="{ row }">
            <router-link v-if="row.menuType === '菜单'" :to="{ path: ConfUrl.table, query: { isNewTag: 'yes', itemId: row.itemId, menuName: row.menuName } }">
              <el-button type="primary" link title="打开表格配置"> {{ row.itemId }}</el-button>
            </router-link>
            <span v-else>{{ row.itemId }} </span>
          </template>
          <template #webRouter="{ row }">
            <span>{{ row.webRouter }}</span>
            <router-link
              v-if="row.menuType === '菜单' && row.webRouter"
              :to="{ path: row.webRouter, query: { menuId: row.itemId, menuName: row.menuName } }"
              class="ml-1"
              title="跳转"
            >
              <el-button type="primary" link>
                <el-icon><Connection /></el-icon>
              </el-button>
            </router-link>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>
