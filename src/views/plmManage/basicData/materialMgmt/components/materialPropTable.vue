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
  },
  customCell({ prop, row }) {
    const value = row[prop];
    const defVal = row.defaultValue;
    const defaultName = getCurEnumData(row).find((el) => el.optionValue == defVal)?.optionName;
    if (row.propertyType === 1) {
      if (row.optionType === "多选") {
        // TODO: 给属性值设置默认值
        // if (defVal) {
        //   row.propertyValue = [defVal];
        // }
        const names = row.propertyValue?.map((item) => getCurEnumData(row).find((el) => el.optionValue === item)?.optionName);
        return names?.join(",") || defaultName;
      } else {
        // if (defVal) {
        //   row.propertyValue = defVal;
        // }
        const name = getCurEnumData(row).find((el) => el.optionValue == row.propertyValue)?.optionName;
        return name || defaultName;
      }
    }
    return value || defVal;
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
        cellStyle: { textAlign: "left" },
        eleProps: { multiple: data.row.optionType === "多选", "collapse-tags": data.row.optionType === "多选", "max-collapse-tags": 2 }
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
