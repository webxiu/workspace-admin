<script setup lang="ts">
import { setColumn } from "@/utils/table";
import { cloneDeep } from "@pureadmin/utils";
import { ref } from "vue";

const dataList = ref([]);
const maxHeight = ref(160);

const columns = ref<any[]>([
  { label: "产线", prop: "FNAME" },
  { label: "项目", prop: "type" }
]);

const setDataList = ({ list, menuCols = [] }, type) => {
  columns.value = [
    { label: "产线", prop: "FNAME" },
    { label: "项目", prop: "type" }
  ];
  const restDateProps: any = [];
  dataList.value = list;
  let oldCols = [];
  if (list[0]) {
    const calcColumns = Object.keys(cloneDeep(list[0])).filter((item) => /\d/.test(item));
    calcColumns.forEach((item) => {
      restDateProps.push({ label: `${item}${type}`, prop: `${item}`, align: "right", headerAlign: "right" });
    });
    oldCols = [...columns.value, ...cloneDeep(restDateProps)];
  } else {
    oldCols = [...columns.value];
  }

  if (menuCols.length && type === "月") {
    oldCols = menuCols;
  }

  columns.value = setColumn({ columnData: oldCols, operationColumn: false });
};

defineExpose({ setDataList });
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <PureTableBar :columns="columns" class="flex-1" :show-icon="false">
      <template v-slot="{ dynamicColumns }">
        <pure-table
          border
          row-key="id"
          class="bill-manage"
          :adaptive="true"
          align-whole="center"
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
