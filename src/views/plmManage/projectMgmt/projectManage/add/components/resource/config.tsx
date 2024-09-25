import { setColumn } from "@/utils/table";

const columnsData: TableColumnList[] = [
  { label: "任务负责人角色", prop: "taskRole" },
  { label: "任务负责人", prop: "taskUser" }
];

const columns2Data: TableColumnList[] = [
  { label: "任务相关人员角色", prop: "taskRelateRole" },
  { label: "任务相关人员", prop: "taskRelateUser" }
];

const columns = setColumn({ columnData: columnsData, operationColumn: false });
const columns2 = setColumn({ columnData: columns2Data, operationColumn: false });

export { columns, columns2 };
