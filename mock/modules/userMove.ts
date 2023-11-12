// 根据角色动态生成路由

import Mock, { Random } from "mockjs";
import { MockMethod } from "vite-plugin-mock";
import { responseReturn } from "../index";

export default [
  {
    url: "/config/usermove/list",
    method: "post",
    response: ({ body }) => {
      const result = Mock.mock({
        "records|10": [
          {
            id: "@increment",
            userCode: "@integer(10000, 99999)",
            userName: "@cname()",
            createdate: Random.datetime("yyyy-MM-dd HH:mm:ss"),
            deptId: "@integer(10, 100)",
            "userState|1": ["A", "B", "C"],
            mobile: "1" + Random.cword("356789", 1) + Random.cword("0123456789", 9),
            wxOpenid: null,
            avatar: null,
            workRuleId: null,
            password: null,
            postName: null,
            qunhuiAccount: null,
            qunhuiPassword: null,
            k3UserAccount: null,
            "roleName|1": ["管理员", "超级管理员", "普通管理员", "检验员", "销售员", "服务员", "作业员"],
            orgId: null,
            "deptName|1": ["测试部", "技术部", "研发部"],
            groupName: null
          }
        ]
      });

      const data = {
        ...result,
        total: 3,
        size: 20,
        current: 1,
        orders: [],
        optimizeCountSql: true,
        searchCount: true,
        countId: null,
        maxLimit: null,
        pages: 1
      };
      return responseReturn(data);
    }
  },
  {
    url: "/config/usermove/copy",
    method: "post",
    response: ({ body }) => {
      return responseReturn(true, 200, "添加成功");
    }
  }
] as MockMethod[];
