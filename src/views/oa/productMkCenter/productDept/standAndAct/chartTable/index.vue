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
  { label: "生产日期", prop: "FCREATEDATE" },
  { label: "线别", prop: "FNAME" },
  { label: "生产机型", prop: "aircraftType" },
  { label: "标准单机成本", prop: "standardCostPer", align: "right" },
  { label: "实际单机成本", prop: "CostPer", align: "right" }
]);

const setDataList = ({ list, menuCols = [] }, type) => {
  columns.value = [
    { label: "序号", type: "index" },
    { label: "生产日期", prop: "FCREATEDATE" },
    { label: "线别", prop: "FNAME" },
    { label: "生产机型", prop: "aircraftType" },
    { label: "标准单机成本", prop: "standardCostPer", align: "right" },
    { label: "实际单机成本", prop: "CostPer", align: "right" }
  ];
  const restDateProps: any = [];
  dataList.value = list;
  let oldCols = [];
  if (list[0]) {
    const calcColumns = Object.keys(cloneDeep(list[0])).filter((item) => /\d/.test(item));
    calcColumns.forEach((item) => {
      restDateProps.push({ label: `${item}${type}`, prop: `${item}`, align: "right" });
    });
    oldCols = [...columns.value, ...cloneDeep(restDateProps)];
  } else {
    oldCols = [...columns.value];
  }

  if (menuCols?.length) {
    oldCols = menuCols;
  }
  columns.value = setColumn({ columnData: menuCols, operationColumn: false });
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
