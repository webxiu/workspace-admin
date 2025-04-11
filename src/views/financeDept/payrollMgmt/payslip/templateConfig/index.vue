<script setup lang="ts">
import { useConfig } from "./hook";

defineOptions({ name: "TemplateConfig" });

const { columns, dataList, maxHeight, buttonList2, onRefresh } = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <PureTableBar :columns="columns" class="flex-1" @refresh="onRefresh">
      <template #title>
        <ButtonList moreActionText="更多操作" :buttonList="buttonList2" :auto-layout="false" />
      </template>
      <template #buttons />
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
          :height="maxHeight"
          class="template-config-table"
          :max-height="maxHeight"
          row-key="id"
          :adaptive="true"
          align-whole="left"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          highlight-current-row
          :show-overflow-tooltip="true"
        />
      </template>
    </PureTableBar>
  </div>
</template>
