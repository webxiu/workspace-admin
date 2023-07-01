/*
 * @Author: lixiuhai
 * @Date: 2023-06-29 16:49:53
 * @Last Modified by: lixiuhai
 * @Last Modified time: 2023-07-01 16:53:45
 */

import type { FormRules } from "element-plus";
import dayjs from "dayjs";
import { reactive } from "vue";

export type OptionsType = { label: string; value: any };

/** 表单规则校验 */
export const formRules = reactive<FormRules>({
  id: [{ required: true, message: "ID为必填项", trigger: "blur" }],
  accountName: [{ required: true, message: "数据库简称为必填项", trigger: "blur" }],
  ipAddress: [{ required: true, message: "IP地址为必填项", trigger: "blur" }],
  linkDbName: [{ required: true, message: "连接数据库名称为必填项", trigger: "blur" }],
  dbType: [{ required: true, message: "连接类型为必填项", trigger: "blur" }],
  username: [{ required: true, message: "用户名为必填项", trigger: "blur" }],
  password: [{ required: true, message: "密码为必填项", trigger: "blur" }],
  // nick: [{ required: true, message: "昵称为必填项", trigger: "blur" }],
  accountStatus: [{ required: true, message: "状态为必填项", trigger: "blur" }],
  orgId: [{ required: true, message: "组织ID为必填项", trigger: "blur" }]
});

// 表格列表配置
export const getColumns = (orgOptions: Array<OptionsType>): TableColumnList[] => [
  { label: "数据库ID", prop: "id", sortable: true, minWidth: 160 },
  { label: "数据库简称", prop: "accountName", sortable: true, minWidth: 160 },
  { label: "IP地址", prop: "ipAddress", sortable: true, minWidth: 160 },
  { label: "连接数据库名", prop: "linkDbName", sortable: true, minWidth: 160 },
  {
    label: "连接类型",
    prop: "dbType",
    sortable: true,
    minWidth: 160,
    cellRenderer: ({ row }) => <span>{row.dbType === 0 ? "Mysql" : "SqlServer"}</span>
  },
  { label: "用户名", prop: "username", sortable: true, minWidth: 160 },
  { label: "密码", prop: "password", sortable: true, minWidth: 160 },
  { label: "昵称", prop: "nick", sortable: true, minWidth: 160 },
  {
    label: "状态",
    prop: "accountStatus",
    sortable: true,
    minWidth: 120,
    cellRenderer: ({ row }) => <span>{row.accountStatus === 0 ? "关闭" : "开启"}</span>
  },
  {
    label: "组织ID名称",
    prop: "orgId",
    sortable: true,
    minWidth: 160,
    cellRenderer: ({ row }) => {
      const item = orgOptions.find((item) => item.value === row.orgId);
      return <span>{item ? item.label : "-"}</span>;
    }
  },
  { label: "创建时间", prop: "createTime", sortable: true, minWidth: 160 },
  { label: "更新时间", prop: "updateTime", sortable: true, minWidth: 160 },
  { label: "操作", fixed: "right", width: 140, slot: "operation" }
];

const GridSpan = 8; // 24格列网格, 每个表单项占8格

// 表单编辑配置
export const formConfigs = (type: "add" | "edit", orgOptions: Array<OptionsType>): TableColumnList[] => {
  let idItem: TableColumnList[] = [];
  if (type === "edit") {
    idItem = [{ label: "数据库ID", prop: "id", disabled: true, span: GridSpan }];
  }
  return [
    /** ===================== 数据库配置 ========================= */
    { label: "数据库配置", hide: true /** 配置标题使用 */ },
    ...idItem,
    { label: "数据库简称", prop: "accountName", span: GridSpan },
    { label: "连接数据库名", prop: "linkDbName", span: GridSpan },
    { label: "IP地址", prop: "ipAddress", span: GridSpan },
    {
      label: "连接类型",
      prop: "dbType",
      span: GridSpan,
      options: [
        { label: "SqlServer", value: 1 },
        { label: "Mysql", value: 0 }
      ]
    },
    { label: "用户名", prop: "username", span: GridSpan },
    { label: "密码", prop: "password", span: GridSpan },
    { label: "昵称", prop: "nick", span: GridSpan },
    {
      label: "状态",
      prop: "accountStatus",
      span: GridSpan,
      options: [
        { label: "开启", value: 1 },
        { label: "关闭", value: 0 }
      ]
    },
    { label: "组织ID", prop: "orgId", span: GridSpan, options: orgOptions }
  ];
};
