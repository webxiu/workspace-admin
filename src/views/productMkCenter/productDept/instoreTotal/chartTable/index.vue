<script setup lang="ts">
import { useEleHeight } from "@/hooks";
import { cloneDeep } from "@pureadmin/utils";
import { ref } from "vue";

const dataList = ref([]);
const maxHeight = ref(200);

const columns = ref<any[]>([
  { label: "序号", type: "index" },
  { label: "年份", prop: "YearAndMonth" },
  { label: "项目", prop: "Item" }
]);

const setDataList = (list, type) => {
  columns.value = [
    { label: "序号", type: "index" },
    { label: "年份", prop: "YearAndMonth" },

    { label: "项目", prop: "Item" }
  ];
  const restDateProps: any = [];
  dataList.value = list;
  if (list[0]) {
    const calcColumns = Object.keys(cloneDeep(list[0])).filter((item) => /\d/.test(item));
    calcColumns.forEach((item) => {
      restDateProps.push({ label: `${item}${type}`, prop: `${item}`, align: "right" });
    });
    columns.value = [...columns.value, ...cloneDeep(restDateProps)];
  } else {
    columns.value = [...columns.value];
  }
};

defineExpose({ setDataList });
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <PureTableBar :columns="columns" class="flex-1" :show-icon="false">
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
        />
      </template>
    </PureTableBar>
  </div>
</template>
