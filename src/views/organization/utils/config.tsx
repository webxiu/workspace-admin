/*
 * @Author: lixiuhai
 * @Date: 2023-06-29 16:49:46
 * @Last Modified by: lixiuhai
 * @Last Modified time: 2023-07-04 17:09:07
 */

import type { FormRules } from "element-plus";
import { OrganizationItemType } from "@/api/orgList";
import dayjs from "dayjs";
import { reactive } from "vue";
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
export const getColumns = (filtersList: Array<OrganizationItemType>): TableColumnList[] => [
  {
    label: "组织ID",
    prop: "id",
    sortable: true,
    minWidth: 280,
    filters: filtersList.map(({ id }) => ({ text: id, value: id })),
    filterMethod: filterHandler
  },
  {
    label: "组织名称",
    prop: "orgName",
    sortable: true,
    minWidth: 160,
    filters: filtersList.map(({ orgName }) => ({ text: orgName, value: orgName })),
    filterMethod: filterHandler
  },
  {
    label: "组织简称",
    prop: "shortName",
    sortable: true,
    minWidth: 160,
    filters: filtersList.map(({ orgName }) => ({ text: orgName, value: orgName })),
    filterMethod: filterHandler
  },
  {
    label: "组织内码",
    prop: "orgCode",
    sortable: true,
    minWidth: 160,
    filters: filtersList.map(({ orgCode }) => ({ text: orgCode, value: orgCode })),
    filterMethod: filterHandler
  },
  {
    label: "组织地址",
    prop: "orgAddress",
    sortable: true,
    minWidth: 160,
    filters: filtersList.map(({ orgAddress }) => ({ text: orgAddress, value: orgAddress })),
    filterMethod: filterHandler
  },
  {
    label: "联系方式",
    prop: "tel",
    sortable: true,
    minWidth: 120,
    filters: filtersList.map(({ tel }) => ({ text: tel, value: tel })),
    filterMethod: filterHandler
  },
  {
    label: "传真",
    prop: "tax",
    sortable: true,
    minWidth: 120,
    filters: filtersList.map(({ tax }) => ({ text: tax, value: tax })),
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
    filters: filtersList.map(({ orgDomain }) => ({ text: orgDomain, value: orgDomain })),
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
  { label: "更新时间", prop: "updateTime", sortable: true, minWidth: 160 },
  { label: "操作", fixed: "right", width: 140, slot: "operation" }
];

const GridSpan = 12; // 24格列网格, 每个表单项占8格

// 表单编辑配置
export const formConfigs = (type: "add" | "edit"): TableColumnList[] => {
  let idItem: TableColumnList[] = [];
  if (type === "edit") {
    idItem = [{ label: "组织ID", prop: "id", disabled: true, span: GridSpan }];
  }
  return [
    /** ===================== 组织配置 ========================= */
    { label: "组织配置", hide: true /** 配置标题使用 */ },
    ...idItem,
    { label: "组织名称", prop: "orgName", span: GridSpan },
    { label: "组织简称", prop: "shortName", span: GridSpan },
    { label: "组织内码", prop: "orgCode", span: GridSpan },
    { label: "组织地址", prop: "orgAddress", span: GridSpan },
    { label: "联系方式", prop: "tel", span: GridSpan },
    { label: "传真", prop: "tax", span: GridSpan },
    {
      label: "状态",
      prop: "status",
      span: GridSpan,
      options: [
        { label: "开启", value: 1 },
        { label: "关闭", value: 0 }
      ]
    },
    { label: "PC端组织域名", prop: "orgDomain", span: GridSpan },
    { label: "PC端组织域名端口", prop: "orgDomainPort", span: GridSpan },
    /** ===================== 金蝶配置 ========================= */
    { label: "金蝶API配置", hide: true /** 配置标题使用 */ },
    {
      label: "是否启用金蝶",
      prop: "kingdeeEnable",
      span: GridSpan,
      options: [
        { label: "启用", value: true },
        { label: "关闭", value: false }
      ]
    },
    { label: "AcctId", prop: "kdApiAcctId", span: GridSpan },
    { label: "AppId", prop: "kdApiAppId", span: GridSpan },
    { label: "AppSec", prop: "kdApiAppSec", span: GridSpan },
    { label: "LCID", prop: "kdApiLCID", span: GridSpan },
    { label: "ServerUrl", prop: "kdApiServerUrl", span: GridSpan },
    { label: "FcreateorgId", prop: "kdApiFcreateorgid", span: GridSpan },
    { label: "FuseorgId", prop: "kdApiFuseorgid", span: GridSpan },
    /** ===================== 群晖配置 ========================= */
    { label: "群晖配置", hide: true /** 配置标题使用 */ },
    {
      label: "是否启用群晖",
      prop: "qhEnable",
      span: GridSpan,
      options: [
        { label: "启用", value: true },
        { label: "关闭", value: false }
      ]
    },
    { label: "Host", prop: "qhFileHost", span: GridSpan },
    { label: "IP", prop: "qhFileIp", span: GridSpan },
    { label: "Port", prop: "qhFilePort", span: GridSpan },
    { label: "UserName", prop: "qhFileUserName", span: GridSpan },
    { label: "Password", prop: "qhFilePassword", span: GridSpan },
    /** ===================== 企业微信配置 ========================= */
    { label: "企业微信配置", hide: true /** 配置标题使用 */ },
    {
      label: "是否启用企业微信",
      prop: "qywxEnable",
      span: GridSpan,
      options: [
        { label: "启用", value: true },
        { label: "关闭", value: false }
      ]
    },
    { label: "OrgDomainPort", prop: "qywxOrgDomainPort", span: GridSpan },
    { label: "OrgDomain", prop: "qywxOrgDomain", span: GridSpan },
    { label: "Oauth2Url", prop: "qywxOauth2url", span: GridSpan },
    { label: "企业微信ID", prop: "corpId", span: GridSpan },
    { label: "WorkComplaintDetailUrl", prop: "qywxWorkComplaintDetailurl", span: GridSpan },
    /** ===================== PC端企业微信应用设置 ========================= */
    { label: "企业微信应用设置", hide: true /** 配置标题使用 */ },
    { label: "扫码登录AgentID", prop: "pcLoginAgengId", span: GridSpan },
    { label: "扫码登录Secret", prop: "pcLoginSecret", span: GridSpan },
    { label: "工作台AgentId", prop: "workbenchAgentID", span: GridSpan },
    { label: "工作台Secret", prop: "workbenchSecret", span: GridSpan },
    { label: "汇报AgentId", prop: "reportAgentId", span: GridSpan },
    { label: "汇报Secret", prop: "reportSecret", span: GridSpan },
    { label: "通讯录Secret", prop: "contactsSecret", span: GridSpan },
    { label: "CCTemplateId", prop: "qywxCCTemplateId", span: GridSpan },
    { label: "审批AgentId", prop: "approvalAgentId", span: GridSpan },
    { label: "审批Secret", prop: "approvalSecret", span: GridSpan },
    { label: "审批Token", prop: "approvalToken", span: GridSpan },
    { label: "审批EncodingAESKey", prop: "approvalEncodingAESKey", span: GridSpan },
    /** ===================== 组织Logo设置设置 ========================= */
    { label: "Logo设置", hide: true /** 配置标题使用 */ },
    { label: "组织Logo", prop: "logo", span: GridSpan }
  ];
};
