<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useConfig } from "./utils/hook";
import ButtonList from "@/components/ButtonList/index.vue";

defineOptions({ name: "OaProductMkCenterPurchasePurchaseSettingsIndex" });

const { loading, columns, dataList, buttonList, rowClick, maxHeight } = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="flex flex-1 ui-h-100 ui-w-100 ui-ov-h">
      <PureTableBar :columns="columns" :showIcon="false">
        <template #title />
        <template #buttons>
          <div>
            <ButtonList :buttonList="buttonList" :autoLayout="false" more-action-text="业务操作" />
          </div>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="itemId"
            class="role-setting"
            :adaptive="true"
            align-whole="left"
            :loading="loading"
            :size="size"
            :data="dataList"
            :expand-row-keys="['0']"
            @row-click="rowClick"
            :columns="dynamicColumns"
            :paginationSmall="size === 'small'"
            highlight-current-row
            :default-expand-all="false"
            :show-overflow-tooltip="true"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          />
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
