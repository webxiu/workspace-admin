<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useConfig } from "./utils/hook";
import ButtonList from "@/components/ButtonList/index.vue";

defineOptions({ name: "OaProductMkCenterPurchaseQualityCustomerComplaintIndex" });

const { columns, dataList, buttonList, handleTagSearch, searchOptions, rowClick, onChangeFileInput, maxHeight } = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="flex flex-1 ui-h-100 ui-w-100 ui-ov-h">
      <PureTableBar :columns="columns" :showIcon="false">
        <template #title>
          <BlendedSearch @tagSearch="handleTagSearch" :searchOptions="searchOptions" placeholder="客户名称" searchField="customerName" />
        </template>
        <template #buttons>
          <div>
            <ButtonList :buttonList="buttonList" :autoLayout="false" more-action-text="更多操作" />
            <input style="display: none" type="file" accept=".xls,.xlsx" id="importQCCCInput" @change="onChangeFileInput" />
          </div>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="id"
            class="qc-cc"
            :adaptive="true"
            align-whole="left"
            :size="size"
            :data="dataList"
            @row-click="rowClick"
            :columns="dynamicColumns"
            :paginationSmall="size === 'small'"
            highlight-current-row
            :default-expand-all="false"
            :show-overflow-tooltip="true"
          />
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
<style lang="scss">
.qc-cc-modal {
  .el-form-item--small {
    margin-bottom: 8px !important;
  }
}
</style>
