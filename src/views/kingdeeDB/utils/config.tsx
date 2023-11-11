/*
 * @Author: lixiuhai
 * @Date: 2023-06-29 16:49:53
 * @Last Modified by: lixiuhai
 * @Last Modified time: 2023-07-04 17:18:42
 */

import { Ref, reactive } from "vue";

import { FormConfigItemType } from "@/components/EditForm/index.vue";
import type { FormRules } from "element-plus";
import TitleCate from "@/components/TitleCate.vue";
import dayjs from "dayjs";

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
export const getColumns = (orgOptions: Ref<Array<OptionsType>>): TableColumnList[] => [
  { label: "数据库ID", prop: "id", sortable: true, minWidth: 160 },
  { label: "数据库简称", prop: "accountName", sortable: true, minWidth: 160 },
  { label: "IP地址", prop: "ipAddress", sortable: true, minWidth: 160 },
  { label: "连接数据库名", prop: "linkDbName", sortable: true, minWidth: 160 },
  { label: "端口", prop: "linkPort", sortable: true, minWidth: 160 },
  {
    label: "连接类型",
    prop: "dbType",
    sortable: true,
    minWidth: 160,
    cellRenderer: ({ row }) => <span>{row.dbType === 0 ? "Mysql" : "SqlServer"}</span>
  },
  { label: "用户名", prop: "username", sortable: true, minWidth: 160 },
  { label: "密码", prop: "password", sortable: true, minWidth: 160 },
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
      const item = orgOptions.value.find((item) => item.value === row.orgId);
      return <span>{item ? item.label : ""}</span>;
    }
  },
  { label: "创建时间", prop: "createTime", sortable: true, minWidth: 160 },
  { label: "更新时间", prop: "updateTime", sortable: true, minWidth: 160 }
];

const layout = { span: 12 };
const lineLayout = { span: 24 };

export const formConfigs = (type: "add" | "edit", orgOptions: Array<OptionsType>): FormConfigItemType[] => {
  return [
    {
      label: "",
      prop: "",
      hide: false,
      colProp: lineLayout,
      render: ({ formModel, row }) => <TitleCate name="数据库配置" class="ui-w-100" />
    },
    {
      label: "数据库ID",
      prop: "id",
      hide: type === "add",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" disabled clearable />
    },
    {
      label: "数据库简称",
      prop: "accountName",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "连接数据库名",
      prop: "linkDbName",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "端口",
      prop: "linkPort",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "IP地址",
      prop: "ipAddress",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "连接类型",
      prop: "dbType",
      colProp: layout,
      render: ({ formModel, row }) => {
        const options = [
          { label: "SqlServer", value: 1 },
          { label: "Mysql", value: 0 }
        ];
        return (
          <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
            {options.map((item) => (
              <el-option key={item.value} label={item.label} value={item.value} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "用户名",
      prop: "username",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "密码",
      prop: "password",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "状态",
      prop: "accountStatus",
      colProp: layout,
      render: ({ formModel, row }) => {
        const options = [
          { label: "开启", value: 1 },
          { label: "关闭", value: 0 }
        ];
        return (
          <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
            {options.map((item) => (
              <el-option key={item.value} label={item.label} value={item.value} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "组织ID",
      prop: "orgId",
      colProp: layout,
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
            {orgOptions.map((item) => (
              <el-option key={item.value} label={item.label} value={item.value} />
            ))}
          </el-select>
        );
      }
    }
  ];
};
