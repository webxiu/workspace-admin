// 根据角色动态生成路由

import { MockMethod } from "vite-plugin-mock";

export default [
  {
    url: "/login",
    method: "post",
    response: ({ body }) => {
      if (body.username === "admin") {
        return {
          success: true,
          data: {
            username: "admin",
            // 一个用户可能有多个角色
            roles: ["admin"],
            accessToken: "eyJhbGciOiJIUzUxMiJ9.admin",
            refreshToken: "eyJhbGciOiJIUzUxMiJ9.adminRefresh",
            expires: "2023/10/30 00:00:00"
          }
        };
      } else {
        return {
          success: true,
          data: {
            username: "common",
            // 一个用户可能有多个角色
            roles: ["common"],
            accessToken: "eyJhbGciOiJIUzUxMiJ9.common",
            refreshToken: "eyJhbGciOiJIUzUxMiJ9.commonRefresh",
            expires: "2023/10/30 00:00:00"
          }
        };
      }
    }
  },
  // undefined
  {
    url: "/getowneruserinfo",
    method: "get",
    response: ({ body }) => {
      return {
        status: 200,
        message: "操作成功",
        data: {
          id: 1385115,
          userCode: "659",
          userName: "李秀海",
          createDate: null,
          deptId: 9,
          userState: null,
          mobile: null,
          wxOpenid: null,
          avatar: "https://wework.qpic.cn/wwpic/519179_NlkY7xfUTDun8Mc_1658887588/0",
          workRuleId: null,
          password: null,
          postName: null,
          qunhuiAccount: null,
          qunhuiPassword: null,
          k3UserAccount: null,
          roleName: null,
          deptCode: null,
          email: null,
          orgId: "532dad6942c17caf4b00bbd5fc498e79",
          deptName: null,
          groupId: null,
          groupName: null,
          wageAccountingType: null,
          sysUserDeptMiddleVOList: null
        },
        timestamp: 1729590452202
      };
    }
  },
  // 枚举字典
  {
    url: "/getloginpagemessage",
    method: "get",
    response: ({ body }) => {
      return {
        status: 200,
        message: "操作成功",
        data: {
          redirect: "https://app.deogra.com/api/app/qywx/api/login",
          clientPathMac: "/static/virtual/files/DeograWorkspace-1.0.0-arm64-mac.zip",
          agentid: "1000036",
          orgName: "深圳市德龙电器有限公司",
          appid: "ww078d1941bccf8584",
          esopPath: "/static/virtual/files/sys/application/apk/esop_install.apk",
          orgShortName: "德龙电器",
          clientPathWin: "/static/virtual/files/DeograWorkspace_Setup_1.0.0.exe",
          clientPathWin32: "/static/virtual/files/DeograWorkspace_Setup_32_1.0.0.exe",
          version: "2024.0.356",
          logoUrl: "/static/virtual/files/managercenter/file/5577FEE5AB4B4B6B9320D30E4206A4D6.png"
        },
        timestamp: 1729590814911
      };
    }
  },
  {
    url: "/verifyuser",
    method: "post",
    response: ({ body }) => {
      return {
        status: 200,
        message: "操作成功",
        data: "",
        timestamp: 1729650382863
      };
    }
  },
  {
    url: "/sys/system/getPrevewDomain",
    method: "get",
    response: ({ body }) => {
      return {
        status: 200,
        message: "操作成功",
        data: "https://dlpctest.deogra.com/",
        timestamp: 1729650385354
      };
    }
  }
] as MockMethod[];
