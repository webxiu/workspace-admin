<template>
  <div class="main flex ui-h-100">
    <div class="flex-1 ui-ov-h">
      <AgGridTable
        v-if="isAgTable"
        rowKey="id"
        :rowData="dataList"
        :loading="loading"
        :columnDefs="columnDefs"
        :height="maxHeight - 10"
        @refresh="onRefresh"
        @switch="onSwitchTable"
        @cellClicked="rowClick"
        @cellDoubleClicked="rowDbClick"
        :headButtons="{ buttonList, autoLayout: false }"
      />
      <PureTableBar v-else :columns="columns" style="padding-top: 0" @refresh="onRefresh" @change-column="setUserMenuColumns">
        <template #buttons>
          <div style="flex: 1">
            <ButtonList :buttonList="buttonList" :auto-layout="false" more-action-text="业务操作" />
          </div>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            ref="qhUserRef"
            show-overflow-tooltip
            :row-style="{ cursor: 'pointer' }"
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="userId"
            class="team-member"
            :adaptive="true"
            align-whole="left"
            :loading="loading"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            highlight-current-row
            @row-dblclick="rowDbClick"
            @row-click="rowClick"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
          />
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useTable } from "./config";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "FileManageQhUserIndex" });

const { columnDefs, isAgTable, loading, columns, dataList, qhUserRef, maxHeight, buttonList, rowClick, rowDbClick, onRefresh, onSwitchTable } = useTable();
</script>

<style lang="scss" scoped>
.search-ipt {
  margin-left: 20px;
}

.lv-box {
  width: 35vw;
  height: 39px;
  padding: 0 10px;
  overflow: auto hidden;
  line-height: 39px;
  color: #a8abb2;
  border: 1px solid #dcdfe6;
  border-radius: 4px;

  &::-webkit-scrollbar {
    height: 3px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 0;
  }

  .pathItem {
    flex-shrink: 0;
    cursor: pointer;

    &:hover {
      font-weight: 800;
      color: #409eff;
    }
  }
}

.info-left-tree {
  padding: 10px 15px;
}
</style>
