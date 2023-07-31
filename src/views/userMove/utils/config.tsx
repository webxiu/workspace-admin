/*
 * @Author: lixiuhai
 * @Date: 2023-06-29 16:49:46
 * @Last Modified by: lixiuhai
 * @Last Modified time: 2023-07-22 08:54:37
 */

import { Ref, nextTick, reactive, ref } from "vue";
import { UserMoveItemType, UserMoveRequestQueryType } from "@/api/userMove";
import { columnDrop, rowDrop } from "@/hooks/common";

import type { FormRules } from "element-plus";

/** 表单规则校验 */
export const formRules = reactive<FormRules>({
  userIds: [{ required: true, message: "请选择员工", trigger: "blur" }],
  newOrgId: [{ required: true, message: "请选择组织", trigger: "blur" }]
});

const filterHandler = (value, row, column) => {
  const property = column["property"];
  return row[property] === value;
};

// 表格配置
export const getColumns = (dataList: Ref<UserMoveItemType[]>, formData: UserMoveRequestQueryType): TableColumnList[] => {
  const columnsDrag = ref([
    { label: "多选", prop: "selection" },
    { label: "序号", prop: "index" },
    { label: "员工ID", prop: "id" },
    { label: "员工工号", prop: "userCode" },
    { label: "员工姓名", prop: "userName" },
    { label: "部门编号", prop: "deptId" },
    { label: "部门", prop: "deptName" },
    { label: "员工状态", prop: "userState" },
    { label: "移动电话", prop: "mobile" },
    { label: "企业微信ID", prop: "wxOpenid" },
    { label: "创建时间", prop: "createdate" }
  ]);

  const columns: TableColumnList[] = [
    { type: "selection", align: "center", width: 55 },
    { label: "序号", type: "index", width: 65, cellRenderer: ({ $index }) => <span>{(formData.page - 1) * formData.limit + $index + 1}</span> },
    { label: "员工ID", prop: (index) => columnsDrag.value[index].prop as string, sortable: true, minWidth: 110 },
    { label: "员工工号", prop: (index) => columnsDrag.value[index].prop as string, sortable: true, minWidth: 120 },
    {
      label: "员工姓名",
      prop: (index) => columnsDrag.value[index].prop as string,
      sortable: true,
      minWidth: 120
      // filters: dataList.value?.map(({ userName }) => ({ text: userName, value: userName })),
      // filterMethod: filterHandler
    },
    { label: "部门编号", prop: (index) => columnsDrag.value[index].prop as string, sortable: true, minWidth: 120 },
    { label: "部门", prop: (index) => columnsDrag.value[index].prop as string, sortable: true, minWidth: 140 },
    {
      label: "员工状态",
      prop: (index) => columnsDrag.value[index].prop as string,
      sortable: true,
      minWidth: 140,
      cellRenderer: ({ row }) => <span>{row.userState === "A" ? "在职" : "离职"}</span>
    },
    { label: "移动电话", prop: (index) => columnsDrag.value[index].prop as string, sortable: true, minWidth: 120 },
    { label: "企业微信ID", prop: (index) => columnsDrag.value[index].prop as string, sortable: true, minWidth: 160, showOverflowTooltip: true },
    { label: "创建时间", prop: "createdate", sortable: true, minWidth: 160 },
    { label: "操作", fixed: "right", slot: "operation" }
  ];

  nextTick(() => {
    rowDrop(dataList, ".user-move");
    columnDrop(columnsDrag, ".user-move");
  });
  return columns;
};
