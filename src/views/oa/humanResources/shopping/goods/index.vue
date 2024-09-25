<!-- /*
 * @Author: Hailen 
 * @Date: 2023-07-05 11:45:27 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-07-05 11:45:27 
 */ -->

<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useConfig } from "./utils/hook";
import ButtonList from "@/components/ButtonList/index.vue";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "OaHumanResourcesShoppingGoodsIndex" });

const { loading, columns, dataList, maxHeight, enableSort, buttonList, timeStemp, searchOptions, onRefresh, onTagSearch, rowClick, handleChangeSwitch } =
  useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="flex flex-1 ui-h-100 ui-w-100 ui-ov-h">
      <PureTableBar :columns="columns" :show-icon="true" @refresh="onRefresh" @change-column="setUserMenuColumns">
        <template #title>
          <BlendedSearch @tagSearch="onTagSearch" :searchOptions="searchOptions" placeholder="请输入商品编号" searchField="billNo" />
          <div style="display: flex; align-items: center">
            <span>商品调整：</span>
            <el-switch
              @change="handleChangeSwitch"
              style="--el-switch-on-color: #13ce66"
              v-model="enableSort"
              inline-prompt
              active-text="启用"
              inactive-text="暂停"
            />
          </div>
        </template>
        <template #buttons>
          <ButtonList :buttonList="buttonList" :autoLayout="false" more-action-text="业务操作" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight"
            :max-height="maxHeight"
            :key="timeStemp"
            row-key="uuid"
            class="goods-manage"
            :adaptive="true"
            align-whole="center"
            :loading="loading"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            :paginationSmall="size === 'small'"
            highlight-current-row
            :show-overflow-tooltip="true"
            @row-click="rowClick"
            :tree-props="{ children: 'specs', hasChildren: 'hasChildren' }"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
          />
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
