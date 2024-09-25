<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="flex flex-1 ui-h-100 ui-w-100 ui-ov-h">
      <PureTableBar :columns="columns" @refresh="onFresh" @change-column="setUserMenuColumns">
        <template #title>
          <BlendedSearch @tagSearch="handleTagSearch" :searchOptions="searchOptions" placeholder="序列号" searchField="sn" />
        </template>
        <template #buttons>
          <ButtonList :buttonList="buttonList" :loadingStatus="loadingStatus" :autoLayout="false" more-action-text="业务操作" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="id"
            class="machine-table"
            id="machineTableId"
            :adaptive="true"
            align-whole="center"
            :loading="loading"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            highlight-current-row
            :show-overflow-tooltip="true"
            @row-click="rowClick"
            @row-dblclick="rowDbclick"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
            @selection-change="handleSelectionChange"
          />
        </template>
      </PureTableBar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMachine } from "./hook";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";
import { PureTableBar } from "@/components/RePureTableBar";
import ButtonList from "@/components/ButtonList/index.vue";

defineOptions({ name: "OaHumanResourcesAttendanceMachineIndex" });

const {
  loading,
  dataList,
  columns,
  maxHeight,
  buttonList,
  searchOptions,
  loadingStatus,
  onFresh,
  rowClick,
  rowDbclick,
  handleTagSearch,
  handleSelectionChange
} = useMachine();
</script>
