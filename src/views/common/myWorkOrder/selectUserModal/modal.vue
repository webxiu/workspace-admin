<template>
  <div class="select-user">
    <div class="right-table">
      <PureTableBar :columns="columns" :showIcon="false" style="padding-top: 0">
        <template #title>
          <BlendedSearch class="action-search" @tagSearch="handleTagSearch" :searchOptions="searchOptions" placeholder="模块名称" searchField="menuName" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            ref="modalTableRef"
            border
            @row-click="(row, col, ev) => rowClick(row, col, ev, setA)"
            @row-dblclick="(row, col, ev) => rowClick(row, col, ev, setA)"
            show-overflow-tooltip
            :row-style="{ cursor: 'pointer' }"
            :height="440"
            :max-height="440"
            row-key="itemId"
            class="team-member"
            :adaptive="true"
            align-whole="left"
            :loading="loading"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            highlight-current-row
            :default-expand-all="true"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          >
            <template #name="{ row }">
              <div style="display: flex">
                <div style="margin-left: 5px">{{ row.name }}</div>
              </div>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useUserTable } from "./config";
import { PureTableBar } from "@/components/RePureTableBar";

const props = defineProps(["setA", "curBuildingsId"]);
const { columns, dataList, loading, onSearch, rowClick, selectMultipeChange, handleTagSearch, searchOptions, modalTableRef } = useUserTable(props);
</script>

<style scoped lang="scss">
.search-ipt {
  display: flex;
}

.select-user {
  display: flex;

  .left-tree {
    flex: 40%;
    height: 480px;
    overflow-y: auto;
  }

  .right-table {
    flex: 60%;
    overflow-y: auto;
    background-color: pink;
  }
}
</style>
