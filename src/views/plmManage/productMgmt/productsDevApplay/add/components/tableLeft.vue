<script setup lang="ts">
import { ref } from "vue";
import { PureTableBar } from "@/components/RePureTableBar";
import { useEleHeight } from "@/hooks";

const loading = ref(false);
const columns = ref([
  { label: "类型名称", prop: "typeName", width: 240 },
  { label: "备注", prop: "remark" }
]);
const dataList = ref([]);
const maxHeight = useEleHeight(".app-main > .el-scrollbar", 123);
const currentLeftRow = ref({});

const rowClick = (row) => {
  currentLeftRow.value = row;
};

const rowStyle = () => {
  return {
    cursor: "pointer"
  };
};

defineExpose({ dataList, loading, currentLeftRow });
</script>

<template>
  <div class="left">
    <PureTableBar :columns="columns" :showIcon="false">
      <template #title><div style="width: 100%; font-size: 14px; text-align: center">可选类型</div></template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
          :height="maxHeight"
          :max-height="maxHeight"
          row-key="tableId"
          class="role-setting"
          :adaptive="true"
          align-whole="left"
          :loading="loading"
          size="small"
          :data="dataList"
          @row-click="rowClick"
          :columns="dynamicColumns"
          :paginationSmall="size === 'small'"
          highlight-current-row
          :default-expand-all="false"
          :show-overflow-tooltip="true"
          :row-style="rowStyle"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        />
      </template>
    </PureTableBar>
  </div>
</template>

<style lang="scss" scoped>
.left {
  flex: 37%;
}
</style>
