// 根据角色动态生成路由

import Mock from "mockjs";
import { MockMethod } from "vite-plugin-mock";

export default [
  {
    url: "/config/usermove/list",
    method: "post",
    response: ({ body }) => {
      const records = Mock.mock([
        {
          id: 1384864,
          userCode: "ayu",
          userName: "系统管理员",
          createdate: "2023-07-13 00:00:00",
          deptId: 9,
          userState: "A",
          mobile: null,
          wxOpenid: null,
          avatar: null,
          workRuleId: null,
          password: null,
          postName: null,
          qunhuiAccount: null,
          qunhuiPassword: null,
          k3UserAccount: null,
          roleName: null,
          orgId: null,
          deptName: "系统组",
          groupName: null
        },
        {
          id: 1384872,
          userCode: "3366",
          userName: "@cname()",
          createdate: "2023-07-17 14:38:04",
          deptId: 1,
          userState: "A",
          mobile: "13728880394",
          wxOpenid: "485",
          avatar: null,
          workRuleId: null,
          password: null,
          postName: null,
          qunhuiAccount: null,
          qunhuiPassword: null,
          k3UserAccount: null,
          roleName: null,
          orgId: null,
          deptName: "总经办",
          groupName: null
        },
        {
          id: 1384874,
          userCode: "test-617",
          userName: "吴道屿",
          createdate: "2022-12-19 08:30:11",
          deptId: 9,
          userState: "A",
          mobile: "12312312301",
          wxOpenid: "test-617",
          avatar: null,
          workRuleId: null,
          password: null,
          postName: null,
          qunhuiAccount: "gmowdy",
          qunhuiPassword: "Rw581d98",
          k3UserAccount: null,
          roleName: "软件工程师",
          orgId: null,
          deptName: "系统组",
          groupName: null
        }
      ]);
      return {
        status: 200,
        message: "操作成功",
        data: {
          records: records,
          total: 3,
          size: 20,
          current: 1,
          orders: [],
          optimizeCountSql: true,
          searchCount: true,
          countId: null,
          maxLimit: null,
          pages: 1
        },
        timestamp: 1690798811683
      };
    }
  },
  {
    url: "/config/usermove/copy",
    method: "post",
    response: ({ body }) => {
      return {
        status: 200,
        message: "添加成功",
        data: true,
        timestamp: 1688199311056
      };
    }
  }
] as MockMethod[];
