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

defineOptions({ name: "BusinessCenterBudgetManageIndex" });

const { editMap, loading, columns, dataList, maxHeight, searchOptions, buttonList, queryParams, onEdit, onSave, onCancel, onRefresh, onTagSearch } =
  useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="flex flex-1 ui-h-100 ui-w-100 ui-ov-h">
      <PureTableBar :columns="columns" @refresh="onRefresh" @change-column="setUserMenuColumns">
        <template #title>
          <BlendedSearch
            @tagSearch="onTagSearch"
            :queryParams="queryParams"
            :searchOptions="searchOptions"
            placeholder="请选择"
            searchField="search"
            :immediate="false"
          />
        </template>
        <template #buttons>
          <ButtonList :buttonList="buttonList" :auto-layout="false" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="id"
            :adaptive="true"
            align-whole="center"
            :loading="loading"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            highlight-current-row
            :show-overflow-tooltip="true"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
          >
            <template #operation="{ row, index }">
              <el-button v-if="!editMap[index]?.editable" class="reset-margin" link type="primary" @click="onEdit(row, index)"> 修改 </el-button>
              <div v-else>
                <el-button class="reset-margin" link type="primary" @click="onSave(index)"> 保存 </el-button>
                <el-button class="reset-margin" link type="danger" @click="onCancel(index)"> 取消 </el-button>
              </div>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
