<template>
  <div class="wrapper-source">
    <div class="wrapper-source-left">
      <pure-table
        border
        row-key="id"
        :height="maxHeight"
        :max-height="maxHeight"
        empty-text="暂无责任角色信息"
        :adaptive="true"
        align-whole="left"
        size="small"
        :data="dataList"
        :columns="columns"
        highlight-current-row
        :show-overflow-tooltip="true"
      />
    </div>
    <div class="wrapper-source-right">
      <pure-table
        border
        row-key="id"
        :height="maxHeight"
        :max-height="maxHeight"
        empty-text="暂无相关角色信息"
        :adaptive="true"
        align-whole="left"
        size="small"
        :data="dataList2"
        :columns="columns2"
        highlight-current-row
        :show-overflow-tooltip="true"
      />
    </div>
  </div>
</template>

<script setup lang="tsx">
import { tableEditRender, setColumn } from "@/utils/table";
import { onMounted, ref } from "vue";

const dataList = ref([]);
const dataList2 = ref([]);
const columns = ref([]);
const columns2 = ref([]);
const maxHeight = ref(590);

const getConfig = () => {
  // 编辑表格
  const editTable1 = tableEditRender();
  const editTable2 = tableEditRender();

  const columnsData: TableColumnList[] = [
    { label: "责任角色", prop: "roleName" },
    {
      label: "成员",
      prop: "resUserOptions",
      cellRenderer: (data) => {
        const options = data.row?.userInfoVOList?.map(({ userName, id }) => ({ optionName: userName, optionValue: id }));
        return editTable1.editCellRender({ type: "select", data, options: options, cellStyle: { color: "#606266", textAlign: "left" } });
      }
    }
  ];
  const columnsData2: TableColumnList[] = [
    { label: "相关角色", prop: "roleName" },
    {
      label: "成员",
      prop: "relateUserOptions",
      cellRenderer: (data) => {
        const options = data.row?.userInfoVOList?.map(({ userName, id }) => ({ optionName: userName, optionValue: id }));
        return editTable2.editCellRender({ type: "select", data, options: options, cellStyle: { color: "#606266", textAlign: "left" } });
      }
    }
  ];

  columns.value = setColumn({ columnData: columnsData, operationColumn: false });
  columns2.value = setColumn({ columnData: columnsData2, operationColumn: false });
};

onMounted(() => {
  getConfig();
});

defineExpose({ dataList, dataList2 });
</script>

<style scoped lang="scss">
.wrapper-source {
  display: flex;

  .wrapper-source-left {
    width: 500px;
  }

  .wrapper-source-right {
    width: 500px;
    margin-left: 16px;
  }
}
</style>
