<script setup lang="tsx">
import { PureTableBar } from "@/components/RePureTableBar";
import { setColumn, formatMoneyComma, getFormatType } from "@/utils/table";
import { cloneDeep } from "@pureadmin/utils";
import { ref } from "vue";

const dataList = ref([]);
const props = defineProps(["unitPcs", "point"]);

const columns = ref<any[]>([]);

const setDataList = (list, type?, columnData?: TableColumnList[]) => {
  dataList.value = list;
  const pos = columnData.findIndex((item) => item.prop === "FYear");
  if (pos !== -1) {
    columnData[pos].label = `年份(单位：${props.unitPcs ? "Pcs" : props.point ? "%" : "元"})`;
  }

  let cols = [];
  cols = cloneDeep(columnData).map((item: TableColumnList) => {
    if (item.formatType) {
      item.cellRenderer = ({ row, column }) => {
        const prop = column["property"];
        const result = props.unitPcs ? formatMoneyComma(row[prop], 0, true) : getFormatType(item, row[prop]);

        return <span>{result}</span>;
      };
    }
    return item;
  });
  columns.value = setColumn({ columnData: cols, operationColumn: false });
};

defineExpose({ setDataList });
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content" style="width: 100%; margin: auto">
    <PureTableBar :columns="columns" class="flex-1" :show-icon="false">
      <template v-slot="{ dynamicColumns }">
        <pure-table
          border
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
