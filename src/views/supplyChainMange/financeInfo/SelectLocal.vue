<template>
  <div class="select-user">
    <div class="right-table">
      <PureTableBar :columns="columns" :showIcon="false" style="padding-top: 0">
        <template #title>
          <BlendedSearch @tagSearch="handleTagSearch" :searchOptions="searchOptions" placeholder="银行名称" searchField="fname" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            @row-click="(row, col, ev) => rowClick(row, col, ev, setA)"
            show-overflow-tooltip
            :row-style="{ cursor: 'pointer' }"
            :height="440"
            :max-height="440"
            row-key="id"
            class="team-member"
            :adaptive="true"
            align-whole="left"
            :loading="loading"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            @page-size-change="handleSizeChange"
            @page-current-change="handleCurrentChange"
            :paginationSmall="size === 'small'"
            :pagination="pagination"
            highlight-current-row
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
import { PureTableBar } from "@/components/RePureTableBar";
import { useLocalTable } from "./selectLocalConfig";

defineProps(["setA"]);

const { columns, dataList, loading, rowClick, handleTagSearch, searchOptions, handleSizeChange, handleCurrentChange, pagination } = useLocalTable();
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
