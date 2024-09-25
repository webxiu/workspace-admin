<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useEleHeight } from "@/hooks";
import { setColumn } from "@/utils/table";
import { cloneDeep } from "@pureadmin/utils";
import { ref } from "vue";

const dataList = ref([]);
const maxHeight = useEleHeight(".app-main > .el-scrollbar", 165);

const columns = ref<any[]>([{ label: "项目明细(单位：元)", prop: "prop1" }]);

const setListKey = (list = []) => {
  const newList = cloneDeep(list);
  newList.map((item) => {
    const keys = Object.keys(item);

    keys.map((el) => {
      if (el === "ItemNameDetail") {
        item["prop1"] = item[el];
      }
      if (el === "上年平均") {
        item["prop15"] = item[el];
      }
      if (el === "差异") {
        item["prop16"] = item[el];
      }
      if (el === "本年累计") {
        item["prop14"] = item[el];
      }

      if (/\d/.test(el)) {
        const calcKey = "prop" + (+el.substring(4, 6) + 1);
        item[calcKey] = item[el];
      }
    });
  });
  return newList;
};

const setDataList = async (list, type = "", menusCols: TableColumnList[]) => {
  columns.value = [{ label: "项目明细(单位：元)", prop: "prop1" }];
  const restDateProps = [];
  dataList.value = setListKey(list);
  const calcColumns = Object.keys(cloneDeep(list[0])).filter((item) => !["Number", "ItemName", "ItemNameDetail"].includes(item));
  calcColumns.forEach((item) => {
    const copyItem = cloneDeep(item);
    if (/\d/.test(item)) item = `${item.substring(0, 4)}年${item.substring(4, 6)}月`;
    const itemProp = /\d/.test(copyItem) ? "prop" + (+copyItem.substring(4, 6) + 1) : copyItem;
    restDateProps.push({
      label: item,
      prop: `${itemProp}`
    });
  });

  const resultCols = [...cloneDeep(columns.value), ...cloneDeep(restDateProps)];

  resultCols.forEach((el) => {
    if (el.label === "本年累计") {
      el.prop = "prop14";
    } else if (el.label === "上年平均") {
      el.prop = "prop15";
    } else if (el.label === "差异") {
      el.prop = "prop16";
    }
  });

  const finalColArr = menusCols.filter((item) => {
    const innerKeys = resultCols.map((el) => el.prop);

    return innerKeys.includes(item.prop);
  });

  const columnData = finalColArr.map((item, idx) => {
    item = { ...finalColArr[idx], ...resultCols[idx] };

    return item;
  });

  columns.value = setColumn({ columnData, operationColumn: { hide: true } });
  console.log(columns.value, "col val");
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
