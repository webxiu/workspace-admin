// 模拟后端动态生成路由

import Mock from "mockjs";
import { MockMethod } from "vite-plugin-mock";

export default [
  {
    url: "/config/org",
    method: "get",
    response: () => {
      const list = Array.from(new Array(20)).map(() => {
        return Mock.mock({
          id: "@id",
          orgName: "@first",
          shortName: "@increment",
          orgCode: "@cword(10,20)",
          logo: "name",
          orgAddress: "@integer(300, 5000)",
          tel: "@cname()",
          tax: "@email",
          status: 1,
          kingdeeEnable: "@cname()",
          qywxEnable: "@cname()",
          qhEnable: "@cname()",
          orgDomain: "@cname()",
          orgDomainPort: "@cname()",
          qywxOrgDomain: "@cname()",
          qywxOrgDomainPort: "@cname()",
          kdApiAcctId: "@cname()",
          kdApiAppId: "@cname()",
          kdApiAppSec: "@cname()",
          kdApiLCID: "@cname()",
          kdApiServerUrl: "@cname()",
          kdApiFcreateorgid: "@cname()",
          kdApiFuseorgid: "@cname()",
          qhFileHost: "@cname()",
          qhFileIp: "@cname()",
          qhFilePort: "@cname()",
          qhFileUserName: "@cname()",
          qhFilePassword: "@cname()",
          qywxOauth2url: "@cname()",
          qywxCorpid: "@cname()",
          qywxPlmAgentid: "@cname()",
          qywxPlmSecret: "@cname()",
          qywxWorkAgentid: "@cname()",
          qywxWorkSecret: "@cname()",
          qywxWorkComplaintDetailurl: "@cname()",
          qywxReportAgentid: "@cname()",
          qywxReportSecret: "@cname()",
          qywxContactsSecret: "@cname()",
          qywxCCTemplateId: "@cname()",
          qywxAppAgentid: "@cname()",
          qywxAppSecret: "@cname()",
          qywxSToken: "@cname()",
          qywxSEncodingAESKey: "@cname()",
          pcQywxCorpid: "@cname()",
          pcQywxWorkAgentid: "@cname()",
          pcQywxWorkSecret: "@cname()",
          createTime: "@datetime",
          updateTime: "@datetime"
        });
      });
      return {
        success: true,
        data: { list: list, total: 2, pageSize: 10, currentPage: 1 }
      };
    }
  },
  {
    url: "/kingdee/list",
    method: "get",
    response: () => {
      const list = Array.from(new Array(20)).map(() => {
        return Mock.mock({
          id: "@id",
          orgName: "@first",
          shortName: "@increment",
          orgCode: "@cword(10,20)",
          logo: "name",
          orgAddress: "@integer(300, 5000)",
          tel: "@cname()",
          tax: "@email",
          status: 1,
          kingdeeEnable: "@cname()",
          qywxEnable: "@cname()",
          qhEnable: "@cname()",
          orgDomain: "@cname()",
          orgDomainPort: "@cname()",
          qywxOrgDomain: "@cname()",
          qywxOrgDomainPort: "@cname()",
          kdApiAcctId: "@cname()",
          kdApiAppId: "@cname()",
          kdApiAppSec: "@cname()",
          kdApiLCID: "@cname()",
          kdApiServerUrl: "@cname()",
          kdApiFcreateorgid: "@cname()",
          kdApiFuseorgid: "@cname()",
          qhFileHost: "@cname()",
          qhFileIp: "@cname()",
          qhFilePort: "@cname()",
          qhFileUserName: "@cname()",
          qhFilePassword: "@cname()",
          qywxOauth2url: "@cname()",
          qywxCorpid: "@cname()",
          qywxPlmAgentid: "@cname()",
          qywxPlmSecret: "@cname()",
          qywxWorkAgentid: "@cname()",
          qywxWorkSecret: "@cname()",
          qywxWorkComplaintDetailurl: "@cname()",
          qywxReportAgentid: "@cname()",
          qywxReportSecret: "@cname()",
          qywxContactsSecret: "@cname()",
          qywxCCTemplateId: "@cname()",
          qywxAppAgentid: "@cname()",
          qywxAppSecret: "@cname()",
          qywxSToken: "@cname()",
          qywxSEncodingAESKey: "@cname()",
          pcQywxCorpid: "@cname()",
          pcQywxWorkAgentid: "@cname()",
          pcQywxWorkSecret: "@cname()",
          createTime: "@datetime",
          updateTime: "@datetime"
        });
      });
      return {
        success: true,
        data: { list: list, total: 2, pageSize: 10, currentPage: 1 }
      };
    }
  }
] as MockMethod[];
