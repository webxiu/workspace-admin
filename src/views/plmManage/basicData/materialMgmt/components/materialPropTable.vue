<template>
  <div>
    <pure-table
      border
      :height="maxHeight"
      :max-height="maxHeight"
      row-key="id"
      :adaptive="true"
      align-whole="left"
      size="small"
      class-name="materialProp-box"
      :data="dataList"
      :columns="columns"
      show-overflow-tooltip
      highlight-current-row
    />
  </div>
</template>
<script setup lang="tsx">
import { CellOptionType, tableEditRender, setColumn } from "@/utils/table";
import { onMounted, ref } from "vue";

const maxHeight = ref("77vh");
const dataList = defineModel({ type: Array<any>, default: [] });
const columns = ref([]);
const materialPropEnumList = ref([]);

// 编辑表格
const { editCellRender } = tableEditRender({
  editFinish: ({ prop, index, row }) => {
    const value = row[prop];
    dataList.value[index][prop] = value;
  }
});

// 获取对应枚举
const getCurEnumData = (row) => {
  const findResult: CellOptionType[] = materialPropEnumList.value.find((item) => item.optionCode === row.enumCode)?.optionList || [];
  return findResult;
};

const getConfig = () => {
  const propertyValueRender = (data) => {
    if (data.row.propertyType === 1) {
      return editCellRender({
        data,
        type: "select",
        options: getCurEnumData(data.row),
        cellStyle: { textAlign: "left" }
      });
    }
    return editCellRender({ data });
  };
  const columnData: TableColumnList[] = [
    { label: "属性名称", prop: "propertyName" },
    { label: "属性值", prop: "propertyValue", cellRenderer: propertyValueRender }
  ];
  columns.value = setColumn({ columnData, operationColumn: false });
};

onMounted(() => {
  getConfig();
});

defineExpose({ dataList, materialPropEnumList });
</script>

<style lang="scss" scoped></style>
