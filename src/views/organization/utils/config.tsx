/*
 * @Author: lixiuhai
 * @Date: 2023-06-29 16:49:46
 * @Last Modified by: lixiuhai
 * @Last Modified time: 2023-07-04 17:09:07
 */

import { Ref, reactive } from "vue";

import { FormConfigItemType } from "@/components/EditForm/index.vue";
import type { FormRules } from "element-plus";
import { OrganizationItemType } from "@/api/orgList";
import TitleCate from "@/components/TitleCate.vue";
import dayjs from "dayjs";
import regExp from "@/utils/regExp";

/** 表单规则校验(注释的为不做校验) */
export const formRules = reactive<FormRules>({
  id: [{ required: true, message: "组织ID为必填项", trigger: "blur" }],
  orgName: [{ required: true, message: "组织名称为必填项", trigger: "blur" }],
  shortName: [{ required: true, message: "组织简称为必填项", trigger: "blur" }],
  tel: [
    { required: false, message: "组织简称为必填项", trigger: "blur" },
    { message: "手机号格式不正确", trigger: "blur", pattern: regExp.phone }
  ],
  status: [{ required: true, message: "状态为必选项", trigger: "blur" }],
  kingdeeEnable: [{ required: true, message: "是否启用金蝶为必选项", trigger: "blur" }],
  qywxEnable: [{ required: true, message: "是否启用企业微信为必选项", trigger: "blur" }],
  qhEnable: [{ required: true, message: "是否启用群晖为必选项", trigger: "blur" }]
});

const filterHandler = (value, row, column) => {
  const property = column["property"];
  return row[property] === value;
};

// 表格列表配置
export const getColumns = (filtersList: Ref<Array<OrganizationItemType>>): TableColumnList[] => [
  {
    label: "组织ID",
    prop: "id",
    sortable: true,
    minWidth: 280,
    filters: filtersList.value?.map(({ id }) => ({ text: id, value: id })),
    filterMethod: filterHandler
  },
  {
    label: "组织名称",
    prop: "orgName",
    sortable: true,
    minWidth: 160,
    filters: filtersList.value?.map(({ orgName }) => ({ text: orgName, value: orgName })),
    filterMethod: filterHandler
  },
  {
    label: "组织简称",
    prop: "shortName",
    sortable: true,
    minWidth: 160,
    filters: filtersList.value?.map(({ orgName }) => ({ text: orgName, value: orgName })),
    filterMethod: filterHandler
  },
  {
    label: "组织内码",
    prop: "orgCode",
    sortable: true,
    minWidth: 160,
    filters: filtersList.value?.map(({ orgCode }) => ({ text: orgCode, value: orgCode })),
    filterMethod: filterHandler
  },
  {
    label: "组织地址",
    prop: "orgAddress",
    sortable: true,
    minWidth: 160,
    filters: filtersList.value?.map(({ orgAddress }) => ({ text: orgAddress, value: orgAddress })),
    filterMethod: filterHandler
  },
  {
    label: "联系方式",
    prop: "tel",
    sortable: true,
    minWidth: 120,
    filters: filtersList.value?.map(({ tel }) => ({ text: tel, value: tel })),
    filterMethod: filterHandler
  },
  {
    label: "传真",
    prop: "tax",
    sortable: true,
    minWidth: 120,
    filters: filtersList.value?.map(({ tax }) => ({ text: tax, value: tax })),
    filterMethod: filterHandler
  },
  {
    label: "状态",
    sortable: true,
    minWidth: 120,
    prop: "status",
    options: [
      { label: "开启", value: 1 },
      { label: "关闭", value: 0 }
    ],
    cellRenderer: ({ row }) => <span>{row.status ? "开启" : "关闭"}</span>
  },
  {
    label: "PC端组织域名",
    prop: "orgDomain",
    sortable: true,
    minWidth: 160,
    filters: filtersList.value?.map(({ orgDomain }) => ({ text: orgDomain, value: orgDomain })),
    filterMethod: filterHandler
  },
  { label: "PC端组织域名端口", prop: "orgDomainPort", sortable: true, minWidth: 180 },
  {
    label: "组织Logo",
    prop: "logo",
    sortable: true,
    minWidth: 160,
    cellRenderer: ({ row }) => {
      const baseApi = import.meta.env.VITE_BASE_API;
      return <img src={`${baseApi}/config/common/down?resource=${row.logo}`} class="border-line-color" style={{ margin: "0 auto", width: "50px", height: "50px", borderRadius: "4px" }} />;
    }
  },
  {
    label: "是否启用金蝶",
    prop: "kingdeeEnable",
    sortable: true,
    minWidth: 140,
    options: [
      { label: "启用", value: true },
      { label: "关闭", value: false }
    ],
    cellRenderer: ({ row }) => <span>{row.kingdeeEnable ? "启用" : "关闭"}</span>
  },
  { label: "AcctId", prop: "kdApiAcctId", sortable: true, minWidth: 160 },
  { label: "AppId", prop: "kdApiAppId", sortable: true, minWidth: 300 },
  { label: "AppSec", prop: "kdApiAppSec", sortable: true, minWidth: 260 },
  { label: "LCID", prop: "kdApiLCID", sortable: true, minWidth: 160 },
  { label: "ServerUrl", prop: "kdApiServerUrl", sortable: true, minWidth: 200 },
  { label: "FcreateorgId", prop: "kdApiFcreateorgid", sortable: true, minWidth: 160 },
  { label: "FuseorgId", prop: "kdApiFuseorgid", sortable: true, minWidth: 160 },
  {
    label: "是否启用群晖",
    prop: "qhEnable",
    sortable: true,
    minWidth: 140,
    options: [
      { label: "启用", value: true },
      { label: "关闭", value: false }
    ],
    cellRenderer: ({ row }) => <span>{row.qhEnable ? "启用" : "关闭"}</span>
  },
  { label: "Host", prop: "qhFileHost", sortable: true, minWidth: 200 },
  { label: "IP", prop: "qhFileIp", sortable: true, minWidth: 160 },
  { label: "Port", prop: "qhFilePort", sortable: true, minWidth: 160 },
  { label: "UserName", prop: "qhFileUserName", sortable: true, minWidth: 160 },
  { label: "Password", prop: "qhFilePassword", sortable: true, minWidth: 160 },
  /** ============ 企业微信配置 ============ */
  {
    label: "是否启用企业微信",
    prop: "qywxEnable",
    sortable: true,
    minWidth: 180,
    options: [
      { label: "启用", value: true },
      { label: "关闭", value: false }
    ],
    cellRenderer: ({ row }) => <span>{row.qywxEnable ? "启用" : "关闭"}</span>
  },
  { label: "OrgDomainPort", prop: "qywxOrgDomainPort", sortable: true, minWidth: 160 },
  { label: "OrgDomain", prop: "qywxOrgDomain", sortable: true, minWidth: 160 },
  { label: "Oauth2Url", prop: "qywxOauth2url", sortable: true, minWidth: 160 },
  { label: "企业微信ID", prop: "corpId", sortable: true, minWidth: 160 },
  { label: "WorkComplaintDetailUrl", prop: "qywxWorkComplaintDetailurl", sortable: true, minWidth: 210 },
  /** ============ 企业微信应用设置 ============ */
  { label: "扫码登录AgentID", prop: "pcLoginAgengId", sortable: true, minWidth: 160 },
  { label: "扫码登录Secret", prop: "pcLoginSecret", sortable: true, minWidth: 160 },
  { label: "工作台AgentId", prop: "workbenchAgentID", sortable: true, minWidth: 160 },
  { label: "工作台Secret", prop: "workbenchSecret", sortable: true, minWidth: 160 },
  { label: "汇报AgentId", prop: "reportAgentId", sortable: true, minWidth: 160 },
  { label: "汇报Secret", prop: "reportSecret", sortable: true, minWidth: 160 },
  { label: "通讯录Secret", prop: "contactsSecret", sortable: true, minWidth: 160 },
  { label: "CCTemplateId", prop: "qywxCCTemplateId", sortable: true, minWidth: 280 },
  { label: "审批AgentId", prop: "approvalAgentId", sortable: true, minWidth: 160 },
  { label: "审批Secret", prop: "approvalSecret", sortable: true, minWidth: 160 },
  { label: "审批Token", prop: "approvalToken", sortable: true, minWidth: 160 },
  { label: "审批EncodingAESKey", prop: "approvalEncodingAESKey", sortable: true, minWidth: 200 },
  { label: "创建时间", prop: "createTime", sortable: true, minWidth: 160 }, // formatter: ({ createTime }) => dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
  { label: "更新时间", prop: "updateTime", sortable: true, minWidth: 160 }
];

const layout = { span: 12 };
const lineLayout = { span: 24 };

// 表单编辑配置
export const formConfigs = (type: "add" | "edit"): FormConfigItemType[] => {
  return [
    /** ===================== 组织配置 ========================= */
    { label: "", prop: "", hide: false, colProp: lineLayout, labelWidth: '0px', render: () => <TitleCate name="组织配置" class="ui-w-100" /> },
    { label: "组织ID", prop: "id", hide: type === "add", colProp: layout, render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" disabled clearable /> },
    { label: "组织名称", prop: "orgName", colProp: layout, render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable /> },
    { label: "组织简称", prop: "shortName", colProp: layout, render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable /> },
    { label: "组织内码", prop: "orgCode", colProp: layout, render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable /> },
    { label: "组织地址", prop: "orgAddress", colProp: layout, render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable /> },
    { label: "联系方式", prop: "tel", colProp: layout, render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable /> },
    { label: "传真", prop: "tax", colProp: layout, render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable /> },
    {
      label: "状态",
      prop: "status",
      colProp: layout,
      render: ({ formModel, row }) => {
        const options = [{ label: "开启", value: 1 }, { label: "关闭", value: 0 }];
        return (
          <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
            {options.map((item) => (
              <el-option key={item.value} label={item.label} value={item.value} />
            ))}
          </el-select>
        );
      }
    },
    { label: "PC端组织域名", prop: "orgDomain", colProp: layout, render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable /> },
    { label: "PC端域名端口", prop: "orgDomainPort", colProp: layout, render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable /> },
    { label: "", prop: "", hide: false, colProp: lineLayout, labelWidth: '0px', render: () => <TitleCate name="金蝶API配置" class="ui-w-100" /> },
    {
      label: "是否启用金蝶",
      prop: "kingdeeEnable",
      colProp: layout,
      render: ({ formModel, row }) => {
        const options = [{ label: "启用", value: true }, { label: "关闭", value: false }];
        return (
          <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
            {options.map((item) => (
              <el-option key={item.value} label={item.label} value={item.value} />
            ))}
          </el-select>
        );
      }
    },
    { label: "AcctId", prop: "kdApiAcctId", colProp: layout, render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable /> },
    { label: "AppId", prop: "kdApiAppId", colProp: layout, render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable /> },
    { label: "AppSec", prop: "kdApiAppSec", colProp: layout, render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable /> },
    { label: "LCID", prop: "kdApiLCID", colProp: layout, render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable /> },
    { label: "ServerUrl", prop: "kdApiServerUrl", colProp: layout, render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable /> },
    { label: "FcreateorgId", prop: "kdApiFcreateorgid", colProp: layout, render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable /> },
    { label: "FuseorgId", prop: "kdApiFuseorgid", colProp: layout, render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable /> },
    /** ===================== 群晖配置 ========================= */
    { label: "", prop: "", hide: false, colProp: lineLayout, labelWidth: '0px', render: ({ formModel, row }) => <TitleCate name="群晖配置" class="ui-w-100" /> },
    {
      label: "是否启用群晖",
      prop: "qhEnable",
      colProp: layout,
      render: ({ formModel, row }) => {
        const options = [{ label: "启用", value: true }, { label: "关闭", value: false }];
        return (
          <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
            {options.map((item) => (
              <el-option key={item.value} label={item.label} value={item.value} />
            ))}
          </el-select>
        );
      }
    },
    { label: "Host", prop: "qhFileHost", colProp: layout, render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable /> },
    { label: "IP", prop: "qhFileIp", colProp: layout, render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable /> },
    { label: "Port", prop: "qhFilePort", colProp: layout, render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable /> },
    { label: "UserName", prop: "qhFileUserName", colProp: layout, render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable /> },
    { label: "Password", prop: "qhFilePassword", colProp: layout, render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable /> },
    /** ===================== 企业微信配置 ========================= */
    { label: "", prop: "", hide: false, colProp: lineLayout, labelWidth: '0px', render: ({ formModel, row }) => <TitleCate name="企业微信配置" class="ui-w-100" /> },
    {
      label: "企业微信状态",
      prop: "qywxEnable",
      colProp: layout,
      render: ({ formModel, row }) => {
        const options = [{ label: "启用", value: true }, { label: "关闭", value: false }];
        return (
          <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
            {options.map((item) => (
              <el-option key={item.value} label={item.label} value={item.value} />
            ))}
          </el-select>
        );
      }
    },
    { label: "OrgDomainPort", prop: "qywxOrgDomainPort", colProp: layout, render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable /> },
    { label: "OrgDomain", prop: "qywxOrgDomain", colProp: layout, render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable /> },
    { label: "Oauth2Url", prop: "qywxOauth2url", colProp: layout, render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable /> },
    { label: "企业微信ID", prop: "corpId", colProp: layout, render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable /> },
    { label: "WorkDetailUrl", prop: "qywxWorkComplaintDetailurl", colProp: layout, render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable /> },
    /** ===================== PC端企业微信应用设置 ========================= */
    { label: "", prop: "", hide: false, colProp: lineLayout, labelWidth: '0px', render: () => <TitleCate name="企业微信应用设置" class="ui-w-100" /> },
    { label: "扫码登录AgentID", prop: "pcLoginAgengId", colProp: layout, render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable /> },
    { label: "扫码登录Secret", prop: "pcLoginSecret", colProp: layout, render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable /> },
    { label: "工作台AgentId", prop: "workbenchAgentID", colProp: layout, render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable /> },
    { label: "工作台Secret", prop: "workbenchSecret", colProp: layout, render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable /> },
    { label: "汇报AgentId", prop: "reportAgentId", colProp: layout, render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable /> },
    { label: "汇报Secret", prop: "reportSecret", colProp: layout, render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable /> },
    { label: "通讯录Secret", prop: "contactsSecret", colProp: layout, render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable /> },
    { label: "CCTemplateId", prop: "qywxCCTemplateId", colProp: layout, render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable /> },
    { label: "审批AgentId", prop: "approvalAgentId", colProp: layout, render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable /> },
    { label: "审批Secret", prop: "approvalSecret", colProp: layout, render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable /> },
    { label: "审批Token", prop: "approvalToken", colProp: layout, render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable /> },
    { label: "审批AESKey", prop: "approvalEncodingAESKey", colProp: layout, render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable /> },
    /** ===================== 组织Logo设置设置 ========================= */
    { label: "", prop: "", hide: false, colProp: lineLayout, labelWidth: '0px', render: () => <TitleCate name="Logo设置" class="ui-w-100" /> },
    { label: "组织Logo", prop: "logo", colProp: layout, render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable /> }
  ];
};
