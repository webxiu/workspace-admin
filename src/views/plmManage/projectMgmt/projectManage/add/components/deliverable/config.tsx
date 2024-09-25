import { setColumn } from "@/utils/table";

const columnsData: TableColumnList[] = [
  { label: "交付物名称", prop: "taskModelName" },
  { label: "交付物模板", prop: "taskModel" }
];

const columns2Data: TableColumnList[] = [
  { label: "负责人角色", prop: "taskRelateRole" },
  { label: "任务负责人", prop: "taskRelateUser" }
];
const columns3Data: TableColumnList[] = [
  { label: "相关人角色", prop: "taskRelateRole" },
  { label: "任务相关人", prop: "taskRelateUser" }
];

const columns = setColumn({ columnData: columnsData, operationColumn: false });
const columns2 = setColumn({ columnData: columns2Data, operationColumn: false });
const columns3 = setColumn({ columnData: columns3Data, operationColumn: false });

export { columns, columns2, columns3 };
