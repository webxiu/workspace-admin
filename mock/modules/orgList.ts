// 根据角色动态生成路由

import { MockMethod } from "vite-plugin-mock";
import { responseReturn } from "../index";

export default [
  {
    url: "/config/org",
    method: "post",
    response: ({ body }) => {
      const data = [
        {
          id: "201eef81d09adda314ed6c3d86ce0512",
          orgName: "深圳市大佬云集科技有限公司 ",
          shortName: "大佬云集",
          orgCode: "",
          logo: "/file/8BA095936E8949D7B63298D5CC458C33.png",
          orgAddress: "广东深圳",
          tel: "",
          tax: "",
          status: 1,
          kingdeeEnable: true,
          qywxEnable: true,
          qhEnable: true,
          orgDomain: "dp.domain.com",
          orgDomainPort: 8443,
          qywxOrgDomain: "jfqywx.domain.com",
          qywxOrgDomainPort: 6443,
          kdApiAcctId: "",
          kdApiAppId: "",
          kdApiAppSec: "",
          kdApiLCID: "2052",
          kdApiServerUrl: "http://192.168.1.206/k3cloud",
          kdApiFcreateorgid: "",
          kdApiFuseorgid: "",
          qhFileHost: "http://192.168.1.81:8005",
          qhFileIp: "192.168.1.81",
          qhFilePort: 8005,
          qhFileUserName: "root",
          qhFilePassword: "Deogra@8701",
          qywxOauth2url: "",
          qywxCorpid: "wwd1992b86c8f68aef",
          qywxPlmAgentid: "",
          qywxPlmSecret: "",
          pcLoginAgengId: "",
          pcLoginSecret: "",
          qywxWorkComplaintDetailurl: "",
          reportAgentId: "",
          reportSecret: "",
          contactsSecret: "RzxXvGaO29czNaK1CvFxtQnHyVOHBuRCaCskRmGfXKA",
          qywxCCTemplateId: "",
          approvalAgentId: "",
          approvalSecret: "",
          approvalToken: "",
          approvalEncodingAESKey: "",
          corpId: "wwd1992b86c8f68aef",
          workbenchAgentID: "1000002",
          workbenchSecret: "lSP4HRzi4tbjuOC94RmpzVp7Wc74ZRlKTM8zJ1Zanps",
          createTime: "2023-07-01",
          updateTime: "2023-07-01"
        },
        {
          id: "40136571f8b494c1be14a38b9b5109b4",
          orgName: "利达科技科技有限公司 ",
          shortName: "利达科技",
          orgCode: "",
          logo: "/file/5ED6BE8332E34704A1120C43766CFE93.png",
          orgAddress: "江苏苏州",
          tel: "",
          tax: "",
          status: 1,
          kingdeeEnable: false,
          qywxEnable: true,
          qhEnable: true,
          orgDomain: "qh.domain.com",
          orgDomainPort: 8443,
          qywxOrgDomain: "qhqywx.domain.com",
          qywxOrgDomainPort: 6443,
          kdApiAcctId: "",
          kdApiAppId: "",
          kdApiAppSec: "",
          kdApiLCID: "",
          kdApiServerUrl: "",
          kdApiFcreateorgid: "",
          kdApiFuseorgid: "",
          qhFileHost: "http://192.168.1.81:8005",
          qhFileIp: "192.168.1.81",
          qhFilePort: 8005,
          qhFileUserName: "admin",
          qhFilePassword: "Deogra@8701",
          qywxOauth2url: "",
          qywxCorpid: "wwaa1d04e3d02b770c",
          qywxPlmAgentid: "",
          qywxPlmSecret: "",
          pcLoginAgengId: "",
          pcLoginSecret: "",
          qywxWorkComplaintDetailurl: "",
          reportAgentId: "",
          reportSecret: "",
          contactsSecret: "fMoqQfDRXWIMxFQBJwKnPjrfgbOSV1Rxw_bfC7fXW0M",
          qywxCCTemplateId: "",
          approvalAgentId: "",
          approvalSecret: "",
          approvalToken: "",
          approvalEncodingAESKey: "",
          corpId: "wwaa1d04e3d02b770c",
          workbenchAgentID: "1000002",
          workbenchSecret: "bVp-ur2mWLvyVy7_h_edauL8ZdqxarG_7pMDFYEUJc4",
          createTime: "2023-07-01",
          updateTime: "2023-07-01"
        },
        {
          id: "532dad6942c17caf4b00bbd5fc498e79",
          orgName: "深圳市牛人集团有限公司",
          shortName: "牛人集团",
          orgCode: "",
          logo: "/file/5577FEE5AB4B4B6B9320D30E4206A4D6.png",
          orgAddress: "广东深圳",
          tel: "",
          tax: "",
          status: 1,
          kingdeeEnable: true,
          qywxEnable: true,
          qhEnable: true,
          orgDomain: "app.domain.com",
          orgDomainPort: null,
          qywxOrgDomain: "qywx.domain.com",
          qywxOrgDomainPort: 6443,
          kdApiAcctId: "6479fa43c33d0b",
          kdApiAppId: "246889_X/drS+Do1kqX2YUuw33NyYwE7LXU4CNI",
          kdApiAppSec: "2c9a6eefe9d64b4086396f47921d4cad",
          kdApiLCID: "2052",
          kdApiServerUrl: "http://192.168.1.206/k3cloud",
          kdApiFcreateorgid: "100",
          kdApiFuseorgid: "100",
          qhFileHost: "http://192.168.1.81:8005",
          qhFileIp: "192.168.1.81",
          qhFilePort: 8005,
          qhFileUserName: "root",
          qhFilePassword: "Deogra@8701",
          qywxOauth2url:
            "https://open.weixin.qq.com/connect/oauth2/authorize?appid={appid}&redirect_uri={redirect_uri}&response_type=code&scope=snsapi_base&state={state}&agentid={agentid}#wechat_redirect",
          qywxCorpid: "ww078d1941bccf8584",
          qywxPlmAgentid: "1000036",
          qywxPlmSecret: "7qYYWe2SUUiFvk7blFvvTCM_j1Vr3IOlSL-dz7QQRU8",
          pcLoginAgengId: "1000016",
          pcLoginSecret: "1v8ZWhwcn_H0qxLMoo6tGMAoIwCS6DinH_Qp4RYXaZ8",
          qywxWorkComplaintDetailurl: "/app/qywx/api/applogin",
          reportAgentId: "3010041",
          reportSecret: "8D_ad9joM-A1MoHL7A-e1S9iZYY03yEXML2tBinZnGg",
          contactsSecret: "X2FPWp3zmdHu3b4bffykt6RWc9dmWRwLE5-xoI2s8oY",
          qywxCCTemplateId: "3TmmkasEG8W4pmaH9j4KpTNrEcQMnSzYgumK3BiH",
          approvalAgentId: "3010040",
          approvalSecret: "Sj4vTbUHi6cc1OFu8p6slY4yKBJTg8RcK50WcGw2J6Y",
          approvalToken: "55PTDkrYPnYf",
          approvalEncodingAESKey: "lanAUTNJIsbnRFdwVVji3vgFRU1kSVTRKV1ISmTbFKL",
          corpId: "ww078d1941bccf8584",
          workbenchAgentID: "1000036",
          workbenchSecret: "7qYYWe2SUUiFvk7blFvvTCM_j1Vr3IOlSL-dz7QQRU8",
          createTime: "2023-06-09",
          updateTime: "2023-07-01"
        },
        {
          id: "f9bffdb8833e744e99ccb1ed49055db4",
          orgName: "东莞朝九晚六科技有限公司",
          shortName: "朝九晚六",
          orgCode: "",
          logo: "/file/019F602DB32842F5BB3A8BFA812690BF.png",
          orgAddress: "广东东莞",
          tel: "",
          tax: "",
          status: 1,
          kingdeeEnable: true,
          qywxEnable: true,
          qhEnable: true,
          orgDomain: "jf.domain.com",
          orgDomainPort: 8443,
          qywxOrgDomain: "",
          qywxOrgDomainPort: null,
          kdApiAcctId: "",
          kdApiAppId: "",
          kdApiAppSec: "",
          kdApiLCID: "2052",
          kdApiServerUrl: "http://192.168.1.206/k3cloud",
          kdApiFcreateorgid: "",
          kdApiFuseorgid: "",
          qhFileHost: "http://192.168.1.81:8005",
          qhFileIp: "192.168.1.81",
          qhFilePort: 8005,
          qhFileUserName: "root",
          qhFilePassword: "Deogra@8701",
          qywxOauth2url: "",
          qywxCorpid: "ww0f7d85baa045a75a",
          qywxPlmAgentid: "",
          qywxPlmSecret: "",
          pcLoginAgengId: "",
          pcLoginSecret: "",
          qywxWorkComplaintDetailurl: "",
          reportAgentId: "",
          reportSecret: "",
          contactsSecret: "Y3M4DykvyM2a5sJhjlYFIpb6LbUhc7T9UBIA5QaM-ZY",
          qywxCCTemplateId: "",
          approvalAgentId: "1000003",
          approvalSecret: "ESZGN25iFa2FTWdB6ZfvmOl-MjYfl1q3TB2YK932S3w",
          approvalToken: "",
          approvalEncodingAESKey: "",
          corpId: "ww0f7d85baa045a75a",
          workbenchAgentID: "1000003",
          workbenchSecret: "i2dWJfb0Xk2T8LGoxGltliV3PvPconm1sZuFI_6pmbM",
          createTime: "2023-07-01",
          updateTime: "2023-07-01"
        }
      ];
      return responseReturn(data);
    }
  },
  {
    url: "/config/org/insertorg",
    method: "post",
    response: ({ body }) => {
      return responseReturn(null);
    }
  },
  {
    url: "/config/org/updateorg",
    method: "post",
    response: ({ body }) => {
      const data = [
        {
          id: "201eef81d09adda314ed6c3d86ce0512",
          orgName: "深圳市大佬云集科技有限公司 ",
          shortName: "大佬云集",
          orgCode: "",
          logo: "/file/8BA095936E8949D7B63298D5CC458C33.png",
          orgAddress: "广东深圳",
          tel: "",
          tax: "",
          status: 1,
          kingdeeEnable: true,
          qywxEnable: true,
          qhEnable: true,
          orgDomain: "dp.domain.com",
          orgDomainPort: 8443,
          qywxOrgDomain: "jfqywx.domain.com",
          qywxOrgDomainPort: 6443,
          kdApiAcctId: "",
          kdApiAppId: "",
          kdApiAppSec: "",
          kdApiLCID: "2052",
          kdApiServerUrl: "http://192.168.1.206/k3cloud",
          kdApiFcreateorgid: "",
          kdApiFuseorgid: "",
          qhFileHost: "http://192.168.1.81:8005",
          qhFileIp: "192.168.1.81",
          qhFilePort: 8005,
          qhFileUserName: "root",
          qhFilePassword: "Deogra@8701",
          qywxOauth2url: "",
          qywxCorpid: "wwd1992b86c8f68aef",
          qywxPlmAgentid: "",
          qywxPlmSecret: "",
          pcLoginAgengId: "",
          pcLoginSecret: "",
          qywxWorkComplaintDetailurl: "",
          reportAgentId: "",
          reportSecret: "",
          contactsSecret: "RzxXvGaO29czNaK1CvFxtQnHyVOHBuRCaCskRmGfXKA",
          qywxCCTemplateId: "",
          approvalAgentId: "",
          approvalSecret: "",
          approvalToken: "",
          approvalEncodingAESKey: "",
          corpId: "wwd1992b86c8f68aef",
          workbenchAgentID: "1000002",
          workbenchSecret: "lSP4HRzi4tbjuOC94RmpzVp7Wc74ZRlKTM8zJ1Zanps",
          createTime: "2023-07-01",
          updateTime: "2023-07-01"
        },
        {
          id: "40136571f8b494c1be14a38b9b5109b4",
          orgName: "利达科技科技有限公司 ",
          shortName: "利达科技",
          orgCode: "",
          logo: "/file/5ED6BE8332E34704A1120C43766CFE93.png",
          orgAddress: "江苏苏州",
          tel: "",
          tax: "",
          status: 1,
          kingdeeEnable: false,
          qywxEnable: true,
          qhEnable: true,
          orgDomain: "qh.domain.com",
          orgDomainPort: 8443,
          qywxOrgDomain: "qhqywx.domain.com",
          qywxOrgDomainPort: 6443,
          kdApiAcctId: "",
          kdApiAppId: "",
          kdApiAppSec: "",
          kdApiLCID: "",
          kdApiServerUrl: "",
          kdApiFcreateorgid: "",
          kdApiFuseorgid: "",
          qhFileHost: "http://192.168.1.81:8005",
          qhFileIp: "192.168.1.81",
          qhFilePort: 8005,
          qhFileUserName: "admin",
          qhFilePassword: "Deogra@8701",
          qywxOauth2url: "",
          qywxCorpid: "wwaa1d04e3d02b770c",
          qywxPlmAgentid: "",
          qywxPlmSecret: "",
          pcLoginAgengId: "dddddd",
          pcLoginSecret: "",
          qywxWorkComplaintDetailurl: "",
          reportAgentId: "",
          reportSecret: "",
          contactsSecret: "fMoqQfDRXWIMxFQBJwKnPjrfgbOSV1Rxw_bfC7fXW0M",
          qywxCCTemplateId: "",
          approvalAgentId: "",
          approvalSecret: "",
          approvalToken: "",
          approvalEncodingAESKey: "",
          corpId: "wwaa1d04e3d02b770c",
          workbenchAgentID: "1000002",
          workbenchSecret: "bVp-ur2mWLvyVy7_h_edauL8ZdqxarG_7pMDFYEUJc4",
          createTime: "2023-07-01",
          updateTime: "2023-07-01"
        },
        {
          id: "532dad6942c17caf4b00bbd5fc498e79",
          orgName: "深圳市牛人集团有限公司",
          shortName: "牛人集团",
          orgCode: "",
          logo: "/file/5577FEE5AB4B4B6B9320D30E4206A4D6.png",
          orgAddress: "广东深圳",
          tel: "",
          tax: "",
          status: 1,
          kingdeeEnable: true,
          qywxEnable: true,
          qhEnable: true,
          orgDomain: "app.domain.com",
          orgDomainPort: null,
          qywxOrgDomain: "qywx.domain.com",
          qywxOrgDomainPort: 6443,
          kdApiAcctId: "6479fa43c33d0b",
          kdApiAppId: "246889_X/drS+Do1kqX2YUuw33NyYwE7LXU4CNI",
          kdApiAppSec: "2c9a6eefe9d64b4086396f47921d4cad",
          kdApiLCID: "2052",
          kdApiServerUrl: "http://192.168.1.206/k3cloud",
          kdApiFcreateorgid: "100",
          kdApiFuseorgid: "100",
          qhFileHost: "http://192.168.1.81:8005",
          qhFileIp: "192.168.1.81",
          qhFilePort: 8005,
          qhFileUserName: "root",
          qhFilePassword: "Deogra@8701",
          qywxOauth2url:
            "https://open.weixin.qq.com/connect/oauth2/authorize?appid={appid}&redirect_uri={redirect_uri}&response_type=code&scope=snsapi_base&state={state}&agentid={agentid}#wechat_redirect",
          qywxCorpid: "ww078d1941bccf8584",
          qywxPlmAgentid: "1000036",
          qywxPlmSecret: "7qYYWe2SUUiFvk7blFvvTCM_j1Vr3IOlSL-dz7QQRU8",
          pcLoginAgengId: "1000016",
          pcLoginSecret: "1v8ZWhwcn_H0qxLMoo6tGMAoIwCS6DinH_Qp4RYXaZ8",
          qywxWorkComplaintDetailurl: "/app/qywx/api/applogin",
          reportAgentId: "3010041",
          reportSecret: "8D_ad9joM-A1MoHL7A-e1S9iZYY03yEXML2tBinZnGg",
          contactsSecret: "X2FPWp3zmdHu3b4bffykt6RWc9dmWRwLE5-xoI2s8oY",
          qywxCCTemplateId: "3TmmkasEG8W4pmaH9j4KpTNrEcQMnSzYgumK3BiH",
          approvalAgentId: "3010040",
          approvalSecret: "Sj4vTbUHi6cc1OFu8p6slY4yKBJTg8RcK50WcGw2J6Y",
          approvalToken: "55PTDkrYPnYf",
          approvalEncodingAESKey: "lanAUTNJIsbnRFdwVVji3vgFRU1kSVTRKV1ISmTbFKL",
          corpId: "ww078d1941bccf8584",
          workbenchAgentID: "1000036",
          workbenchSecret: "7qYYWe2SUUiFvk7blFvvTCM_j1Vr3IOlSL-dz7QQRU8",
          createTime: "2023-06-09",
          updateTime: "2023-07-01"
        },
        {
          id: "f9bffdb8833e744e99ccb1ed49055db4",
          orgName: "东莞朝九晚六科技有限公司",
          shortName: "朝九晚六",
          orgCode: "",
          logo: "/file/019F602DB32842F5BB3A8BFA812690BF.png",
          orgAddress: "广东东莞",
          tel: "",
          tax: "",
          status: 1,
          kingdeeEnable: true,
          qywxEnable: true,
          qhEnable: true,
          orgDomain: "jf.domain.com",
          orgDomainPort: 8443,
          qywxOrgDomain: "",
          qywxOrgDomainPort: null,
          kdApiAcctId: "",
          kdApiAppId: "",
          kdApiAppSec: "",
          kdApiLCID: "2052",
          kdApiServerUrl: "http://192.168.1.206/k3cloud",
          kdApiFcreateorgid: "",
          kdApiFuseorgid: "",
          qhFileHost: "http://192.168.1.81:8005",
          qhFileIp: "192.168.1.81",
          qhFilePort: 8005,
          qhFileUserName: "root",
          qhFilePassword: "Deogra@8701",
          qywxOauth2url: "",
          qywxCorpid: "ww0f7d85baa045a75a",
          qywxPlmAgentid: "",
          qywxPlmSecret: "",
          pcLoginAgengId: "",
          pcLoginSecret: "",
          qywxWorkComplaintDetailurl: "",
          reportAgentId: "",
          reportSecret: "",
          contactsSecret: "Y3M4DykvyM2a5sJhjlYFIpb6LbUhc7T9UBIA5QaM-ZY",
          qywxCCTemplateId: "",
          approvalAgentId: "1000003",
          approvalSecret: "ESZGN25iFa2FTWdB6ZfvmOl-MjYfl1q3TB2YK932S3w",
          approvalToken: "",
          approvalEncodingAESKey: "",
          corpId: "ww0f7d85baa045a75a",
          workbenchAgentID: "1000003",
          workbenchSecret: "i2dWJfb0Xk2T8LGoxGltliV3PvPconm1sZuFI_6pmbM",
          createTime: "2023-07-01",
          updateTime: "2023-07-01"
        }
      ];
      return responseReturn(data);
    }
  },
  {
    url: "/config/org/deleteorg",
    method: "post",
    response: ({ body }) => {
      return responseReturn(null);
    }
  }
] as MockMethod[];
