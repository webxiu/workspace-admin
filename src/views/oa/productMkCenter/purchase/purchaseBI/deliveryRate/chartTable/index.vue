<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useEleHeight } from "@/hooks";
import { setColumn } from "@/utils/table";
import { cloneDeep } from "@pureadmin/utils";
import { ref } from "vue";

const dataList = ref([]);
const maxHeight = useEleHeight(".app-main > .el-scrollbar", 109);

const columns = ref<any[]>([
  { label: "序号", type: "index" },
  { label: "年月", prop: "YearAndMonth" },
  { label: "项目", prop: "Item" }
]);

const setDataList = ({ list, menuCols = [] }, type) => {
  columns.value = [
    { label: "序号", type: "index" },
    { label: "年月", prop: "YearAndMonth" },
    { label: "项目", prop: "Item" }
  ];
  const restDateProps = [];
  dataList.value = list;
  const calcColumns = Object.keys(cloneDeep(list[0] || {})).filter((item) => /\d/.test(item));
  calcColumns.forEach((item) => {
    restDateProps.push({ label: `${item}${type}`, prop: `${item}`, align: "right" });
  });
  // columns.value = [...columns.value, ...cloneDeep(restDateProps)];
  if (menuCols.length && type === "月") {
    columns.value = setColumn({ columnData: menuCols, operationColumn: false });
  } else {
    columns.value = [...columns.value, ...cloneDeep(restDateProps)];
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
