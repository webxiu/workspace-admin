<template>
  <div style="width: 100%">
    <pure-table
      border
      row-key="id"
      class="bill-manage"
      :height="250"
      :adaptive="true"
      empty-text="暂无角色信息"
      align-whole="left"
      size="small"
      :loading="loading"
      :data="dataList"
      :columns="columns"
      highlight-current-row
      :show-overflow-tooltip="true"
    >
      <template #operation="data">
        <el-button type="danger" size="small" @click="() => delRight(data)">删除</el-button>
      </template>
    </pure-table>
  </div>
</template>

<script setup lang="ts">
import { setColumn, tableEditRender } from "@/utils/table";
import { ref } from "vue";
const dataList = ref([]);
const columns = ref([]);
const loading = ref(false);

const dataModel = defineModel({ default: [] });
const props = defineProps(["type"]);

// 编辑表格
const { editCellRender } = tableEditRender({
  editFinish: ({ index, prop }) => {
    dataModel.value = dataList.value;
  }
});

const columnData: TableColumnList[] = [
  { label: "责任角色", prop: "roleName" },
  {
    label: "成员",
    prop: "userInfoVOList",
    align: "left",
    cellRenderer: (data) => {
      const options = data.row?.userOptions?.map(({ userName, id }) => ({ optionName: userName, optionValue: id }));
      return editCellRender({ type: "select", data, options: options, isEdit: props.type !== "view", cellStyle: { color: "#606266", textAlign: "left" } });
    }
  }
];

columns.value = setColumn({ columnData, operationColumn: false });

const delRight = ({ $index }) => {
  dataList.value.splice($index, 1);
};

defineExpose({ dataList, loading });
</script>
