<template>
  <div style="margin-bottom: 8px">
    <BlendedSearch @tagSearch="handleTagSearch" :searchOptions="searchOptions" placeholder="请输入姓名查询" searchField="userName" />
  </div>
  <div>
    <pure-table
      border
      ref="tableRef"
      :height="300"
      row-key="id"
      :adaptive="true"
      align-whole="left"
      size="small"
      :data="dataList"
      :columns="columns"
      highlight-current-row
      :show-overflow-tooltip="true"
      @select="onSelect"
      @select-all="onSelectAll"
    />
  </div>
</template>

<script setup lang="tsx">
import { onMounted, ref, reactive } from "vue";
import { fetchPersonNameProjectPartData, fetchPersonRoleProjectPartData } from "@/api/plmManage";
import { setColumn, usePageSelect } from "@/utils/table";

const dataList = ref([]);
const columns = ref([]);
const tableRef = ref();
const rowsData = ref([]);
const originList = ref([]);
const searchOptions = reactive([]);

const props = defineProps(["currentTaskRow"]);

const { setSelectCheckbox, setSelectChange, setSelectAllChange } = usePageSelect({ tableRef, dataList, rowsData, uniId: "id" });

const uniqueFunc = (arr, uniId) => {
  const res = new Map();
  return arr.filter((item) => !res.has(item[uniId]) && res.set(item[uniId], 1));
};

const handleTagSearch = (values) => {
  if (values.userName) {
    dataList.value = originList.value.filter((item) => item.userName.includes(values.userName));
  } else {
    dataList.value = originList.value;
  }
  setSelectCheckbox();
};

function onSelect(rows, row) {
  setSelectChange({ rows, row });
}

function onSelectAll(rows) {
  setSelectAllChange(rows);
}

const getConfig = () => {
  const columnData: TableColumnList[] = [
    { label: "姓名", prop: "userName" },
    { label: "工号", prop: "userCode", align: "right" },
    { label: "角色编码", prop: "roleCode", align: "right" },
    { label: "角色名称", prop: "roleName" },
    { label: "所属部门", prop: "deptName" }
  ];

  columns.value = setColumn({
    columnData,
    operationColumn: false,
    radioColumn: { hide: true },
    selectionColumn: { hide: false }
  });
};

const getList = () => {
  fetchPersonNameProjectPartData({}).then((res1: any) => {
    if (res1.data) {
      fetchPersonRoleProjectPartData({}).then((res: any) => {
        if (res.data) {
          const allRelationUsers = [];
          res.data.forEach((item) => {
            const selectData = res1.data.filter((el) => el.roleId === item.id);
            selectData.forEach((el) => {
              allRelationUsers.push({ ...el });
            });
          });
          dataList.value = uniqueFunc(allRelationUsers, "userName");
          originList.value = uniqueFunc(allRelationUsers, "userName");
        }

        // 相关人表格勾选回显
        if (props.currentTaskRow?.projectTaskRelatePersonnelVOList?.length) {
          const curRowCheckRows = props.currentTaskRow?.projectTaskRelatePersonnelVOList;
          const tempRows = [];
          dataList.value.forEach((item) => {
            const row = curRowCheckRows.find((el) => el.userId === item.userId);
            if (row) {
              setTimeout(() => {
                tableRef.value?.getTableRef()?.toggleRowSelection(item, true);
              });
              tempRows.push(item);
              rowsData.value = tempRows;
            }
          });
        }
      });
    }
  });
};

onMounted(() => {
  getConfig();
  getList();
});

defineExpose({ rowsData });
</script>
