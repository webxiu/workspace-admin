import { http } from "@/utils/http";

export interface OrganizationItemType {
  /* 组织ID */
  id: string;
  /* 组织名称 */
  orgName: string;
  /* 组织简称 */
  shortName: string;
  /* 组织内码 */
  orgCode: string;
  /* 组织Logo */
  logo: string;
  /* 组织地址 */
  orgAddress: string;
  /* 联系方式 */
  tel: string;
  /* 传真 */
  tax: string;
  /* 状态 */
  status: number;
  /* 是否启用金蝶 */
  kingdeeEnable: boolean;
  /* 是否启用企业微信 */
  qywxEnable: boolean;
  /* 是否启用群晖 */
  qhEnable: boolean;
  /* PC端组织域名 */
  orgDomain: string;
  /* PC端组织域名端口 */
  orgDomainPort: number;
  /* 企业微信端组织域名 */
  qywxOrgDomain: string;
  /* 企业微信端组织端口 */
  qywxOrgDomainPort: number;
  /* 金蝶api */
  kdApiAcctId: string;
  /* 金蝶ApiAppId */
  kdApiAppId: string;
  /* 金蝶ApiAppSec */
  kdApiAppSec: string;
  /* 金蝶ApiLCID */
  kdApiLCID: string;
  /* 金蝶ApiServerUrl */
  kdApiServerUrl: string;
  /* 金蝶ApiFcreateorgid */
  kdApiFcreateorgid: string;
  /* 金蝶ApiFuseorgid */
  kdApiFuseorgid: string;
  /* 群晖信息设置 */
  qhFileHost: string;
  /* 群晖FileIp */
  qhFileIp: string;
  /* 群晖FilePort */
  qhFilePort: number;
  /* 群晖FileUserName */
  qhFileUserName: string;
  /* 群晖FilePassword */
  qhFilePassword: string;
  /* 企业微信信息设置 */
  qywxOauth2url: string;
  /* 企业微信Corpid */
  qywxCorpid: string;
  /* 企业微信PlmAgentid */
  qywxPlmAgentid: string;
  /* 企业微信PlmSecret */
  qywxPlmSecret: string;
  /* 企业微信WorkAgentid */
  qywxWorkAgentid: string;
  /* 企业微信WorkSecret */
  qywxWorkSecret: string;
  /* 企业微信WorkComplaintDetailurl */
  qywxWorkComplaintDetailurl: string;
  /* 企业微信ReportAgentid */
  qywxReportAgentid: string;
  /* 企业微信ReportSecret */
  qywxReportSecret: string;
  /* 企业微信ContactsSecret */
  qywxContactsSecret: string;
  /* 企业微信CCTemplateId */
  qywxCCTemplateId: string;
  /* 企业微信AppAgentid */
  qywxAppAgentid: string;
  /* 企业微信AppSecret */
  qywxAppSecret: string;
  /* 企业微信SToken */
  qywxSToken: string;
  /* 企业微信SEncodingAESKey */
  qywxSEncodingAESKey: string;
  /* pc端企业微信应用设置 */
  pcQywxCorpid: string;
  /* pc端企业微信WorkAgentid */
  pcQywxWorkAgentid: string;
  /* pc端企业微信WorkSecret */
  pcQywxWorkSecret: string;
  /* 创建时间 */
  createTime: string;
  /* 更新时间 */
  updateTime: string;
}

/**========================= 组织列表 =========================*/
// 组织列表
export const organizationList = (params) => {
  return http.request<OrganizationItemType[]>("post", "/config/org", { data: params });
};
// 增加组织
export const addOrganization = (data) => {
  return http.request("post", "/config/org/insertorg", { data });
};
// 编辑组织
export const updateOrganization = (data) => {
  return http.request("post", "/config/org/updateorg", { data });
};
// 删除组织
export const deleteOrganization = (data) => {
  return http.request("post", "/config/org/deleteorg", { data });
};
// 上传组织Logo
export const uploadOrganizatioLogo = (data) => {
  return http.request("post", "/config/common/uploadfile", { data });
};
