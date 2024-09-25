<template>
  <div class="main flex ui-h-100">
    <div class="flex-1 ui-ov-h">
      <PureTableBar :columns="columns" style="padding-top: 0" @refresh="onRefresh" @change-column="setUserMenuColumns">
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
import { PureTableBar } from "@/components/RePureTableBar";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "FileManageQhUserIndex" });

const { loading, columns, dataList, qhUserRef, maxHeight, buttonList, rowClick, rowDbClick, onRefresh } = useTable();
</script>

<style lang="scss" scoped>
.search-ipt {
  margin-left: 20px;
}

.lv-box {
  width: 35vw;
  height: 39px;
  padding: 0 10px;
  overflow-x: auto;
  overflow-y: hidden;
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

.custom-tree-node {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  padding-right: 8px;
  font-size: 14px;
}
</style>
