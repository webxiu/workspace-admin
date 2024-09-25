<template>
  <el-table
    :data="dataList"
    style="width: 100%"
    class="centerTable"
    :span-method="objectSpanMethod"
    :header-cell-style="{ background: '#fff !important', borderColor: 'black' }"
    :cell-style="{ borderColor: 'black' }"
    :style="{ borderColor: 'black' }"
  >
    <el-table-column label="基本功能要求" align="center">
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column
        v-for="item in columns"
        :width="item.width"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :formatter="item.formatter"
        align="left"
      />
    </el-table-column>
  </el-table>
</template>

<script lang="tsx" setup>
import { fetchSelectList, getBOMTableRowSelectOptions } from "@/api/plmManage";
import { onMounted, ref } from "vue";
import { generateComponent } from "./activeFormComp";
import { useRoute } from "vue-router";

const dataList = ref([]);
const route = useRoute();

const initItem = (item) => {
  item.selectValue = item.selectValue?.split(",");
  if (item.valueType == 3) {
    item.selectValue?.forEach((it) => {
      const itemArr = it.split(":");
      item[itemArr[0]] = itemArr[1];
    });
    return item;
  }
  return item;
};

const setDataInfo = (info) => {
  dataList.value = info.productTypeVoList.map((item, idx) => ({ ...item, rowspan: 1, ...initItem(item) }));
  // console.log(dataList.value, "list");
};

const columns = [
  { label: "类型", prop: "groupName", width: 130 },
  {
    label: "",
    prop: "typeName",
    width: 130,
    formatter: (row, column, cellValue, index) => {
      return <span>{cellValue}</span>;
    }
  },
  {
    label: "要求描述",
    prop: "selectValue",
    formatter: (row, column, cellValue, index) => {
      return generateComponent(row);
    }
  },
  {
    label: "特殊要求描述",
    prop: "descValue",
    formatter: (row, column, cellValue, index) => {
      if (route.query.id) return row.descValue;
      return (
        <div>
          <el-input v-model={row.descValue} placeholder="请输入" rows={2} type="textarea" />
        </div>
      );
    }
  }
];

const currentSelectOptions = ref([]);

const objectSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
  if (columnIndex < 2) {
    return {
      rowspan: row.rowspan,
      colspan: 1
    };
  }
};

onMounted(() => {
  getBOMTableRowSelectOptions({ optioncode: "HTMLInputType" }).then((res: any) => {
    if (res.data) {
      currentSelectOptions.value = res.data[0]?.optionList || [];
    }
  });
});

const setrowspans = () => {
  // 先给所有的数据都加一个v.rowspan = 1
  dataList.value.forEach((v) => {
    v.rowspan = 1;
  });
  // 双层循环
  for (let i = 0; i < dataList.value.length; i++) {
    // 内层循环，上面已经给所有的行都加了v.rowspan = 1
    // 这里进行判断
    // 如果当前行的id和下一行的id相等
    // 就把当前v.rowspan + 1
    // 下一行的v.rowspan - 1
    for (let j = i + 1; j < dataList.value.length; j++) {
      if (dataList.value[i].groupName === dataList.value[j].groupName) {
        dataList.value[i].rowspan++;
        dataList.value[j].rowspan--;
      }
    }
    // 这里跳过已经重复的数据
    i = i + dataList.value[i].rowspan - 1;
  }
};
// setrowspans();
defineExpose({
  setDataInfo,
  setrowspans,
  dataList
});
</script>

<style scoped lang="scss">
.centerTable {
  border: 1px solid black;
  border-top: none;
}
</style>
