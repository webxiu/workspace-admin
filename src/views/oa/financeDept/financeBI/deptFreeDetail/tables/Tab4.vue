<script setup lang="ts">
import { ref } from "vue";
import { setColumn } from "@/utils/table";
import { PureTableBar } from "@/components/RePureTableBar";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";
import { cloneDeep } from "@pureadmin/utils";
import { formatPercent } from "../utils";

const maxHeight = 400;
const dataList = ref([]);
const columns = ref<TableColumnList[]>([]);
const emits = defineEmits(["refresh"]);
const tabName = "费用占比";

const setDataList = (list, column) => {
  dataList.value = formatPercent(cloneDeep(list));
  columns.value = setColumn({ columnData: column, operationColumn: { hide: true } });
  return { dataList: dataList.value, columns: columns.value, sheetName: tabName };
};
defineExpose({ setDataList });
</script>

<template>
  <PureTableBar :columns="columns" class="flex-1" @refresh="emits('refresh')" @change-column="setUserMenuColumns" style="padding-top: 0">
    <template #title>
      <TitleCate :name="tabName" :border="false" />
    </template>
    <template v-slot="{ dynamicColumns }">
      <pure-table
        border
        :height="maxHeight"
        :max-height="maxHeight"
        row-key="id"
        class="bill-manage"
        :adaptive="true"
        align-whole="left"
        size="small"
        :data="dataList"
        :columns="dynamicColumns"
        highlight-current-row
        :show-overflow-tooltip="true"
        @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
      />
    </template>
  </PureTableBar>
</template>
