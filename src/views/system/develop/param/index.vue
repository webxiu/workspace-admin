<!-- /*
 * @Author: Hailen 
 * @Date: 2023-07-05 11:45:27 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-07-05 11:45:27 
 */ -->

<script setup lang="ts">
import { useConfig } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "SystemDevelopParam" });

const {
  loading,
  loading2,
  loading3,
  columns,
  columns2,
  columns3,
  dataList,
  dataList2,
  dataList3,
  maxHeight,
  buttonList2,
  buttonList3,
  groupArrsList,
  onEdit2,
  onEdit3,
  onDelete2,
  onDelete3,
  onRefresh,
  onRefresh2,
  onRefresh3,
  onCurrentChange,
  onCurrentChange2
} = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="flex flex-1 ui-h-100 ui-w-100 ui-ov-h">
      <PureTableBar :columns="columns" style="width: 33.3%" @refresh="onRefresh" @change-column="setUserMenuColumns">
        <template #title>
          <TitleCate :name="groupArrsList[0]?.groupName" :border="false" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="itemId"
            class="sys-params"
            :adaptive="true"
            align-whole="center"
            :loading="loading"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            :paginationSmall="size === 'small'"
            highlight-current-row
            :show-overflow-tooltip="true"
            :default-expand-all="false"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            @current-change="onCurrentChange"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
          />
        </template>
      </PureTableBar>
      <PureTableBar :columns="columns2" style="width: 33.3%" @refresh="onRefresh2" @change-column="setUserMenuColumns">
        <template #title>
          <TitleCate :name="groupArrsList[1]?.groupName" :border="false" />
        </template>
        <template #buttons>
          <ButtonList :buttonList="buttonList2" :autoLayout="false" more-action-text="业务操作" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="id"
            class="sys-params-name"
            :adaptive="true"
            align-whole="center"
            :loading="loading2"
            :size="size"
            :data="dataList2"
            :columns="dynamicColumns"
            :paginationSmall="size === 'small'"
            highlight-current-row
            :show-overflow-tooltip="true"
            @current-change="onCurrentChange2"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns2)"
          >
            <template #operation="{ row }">
              <el-button size="small" @click.stop="onEdit2(row)">修改</el-button>
              <el-popconfirm :width="280" :title="`确认删除参数\n【${row.systemparamName}】?`" @confirm="onDelete2(row)">
                <template #reference>
                  <el-button size="small" @click.stop>删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
      <PureTableBar :columns="columns3" style="width: 33.3%" @refresh="onRefresh3" @change-column="setUserMenuColumns">
        <template #title>
          <TitleCate :name="groupArrsList[2]?.groupName" :border="false" />
        </template>
        <template #buttons>
          <ButtonList :buttonList="buttonList3" :autoLayout="false" more-action-text="业务操作" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="id"
            class="sys-params-value"
            :adaptive="true"
            align-whole="center"
            :loading="loading3"
            :size="size"
            :data="dataList3"
            :columns="dynamicColumns"
            :paginationSmall="size === 'small'"
            highlight-current-row
            :show-overflow-tooltip="true"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns3)"
          >
            <template #operation="{ row }">
              <el-button size="small" @click.stop="onEdit3(row)">修改</el-button>
              <el-popconfirm :width="280" :title="`确认删除参数值\n【${row.systemparamValue}】?`" @confirm="onDelete3(row)">
                <template #reference>
                  <el-button size="small" @click.stop>删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
