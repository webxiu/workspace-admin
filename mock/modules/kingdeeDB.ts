// 根据角色动态生成路由

import { MockMethod } from "vite-plugin-mock";
import { responseReturn } from "../index";

export default [
  {
    url: "/config/kingdee/list",
    method: "post",
    response: ({ body }) => {
      const data = [
        {
          id: "0632c897229a551144efbec052198507",
          accountName: "test0509",
          ipAddress: "192.168.1.207",
          linkPort: 1433,
          linkDbName: "TEST230509",
          dbType: 1,
          username: "sa",
          password: "Sa564312",
          nick: "TEST230509",
          accountStatus: 1,
          orgId: "92e6ffbad0f47dcfe1e8bdbd3dff7b67",
          createTime: "2023-06-13",
          updateTime: "2023-06-30"
        },
        {
          id: "2a294d3f0c3285299c501e584404ea19",
          accountName: "test0509",
          ipAddress: "192.168.1.207",
          linkPort: 1433,
          linkDbName: "TEST230509",
          dbType: 1,
          username: "sa",
          password: "Sa564312",
          nick: "TEST230509",
          accountStatus: 1,
          orgId: "532dad6942c17caf4b00bbd5fc498e79",
          createTime: null,
          updateTime: null
        },
        {
          id: "d909b239144e59d3da9e2da8260904ad",
          accountName: "test0509",
          ipAddress: "192.168.1.207",
          linkPort: 1433,
          linkDbName: "TEST230509",
          dbType: 1,
          username: "sa",
          password: "Sa564312",
          nick: "TEST230509",
          accountStatus: 1,
          orgId: "970bdd7bb337031de0e826338687d900",
          createTime: null,
          updateTime: null
        },
        {
          id: "e6748f1eb014b803d5291367e1d34c66",
          accountName: "qqq-test0509",
          ipAddress: "test-192.168.1.207:1433",
          linkPort: 1433,
          linkDbName: "test-TEST230509",
          dbType: 0,
          username: "test-sa",
          password: "test-Sa564312",
          nick: "test-TEST230509",
          accountStatus: 1,
          orgId: "970bdd7bb337031de0e826338687d900",
          createTime: "2023-06-29",
          updateTime: "2023-06-29"
        },
        {
          id: "ee30377289e2e55d773501aa89e8cd37",
          accountName: "test0509",
          ipAddress: "192.168.1.207",
          linkPort: 1433,
          linkDbName: "TEST230509",
          dbType: 1,
          username: "sa",
          password: "Sa564312",
          nick: "TEST230509",
          accountStatus: 1,
          orgId: "508ffc7aff5c56fa4a2e1e45fe636349",
          createTime: "2023-06-12",
          updateTime: "2023-06-12"
        }
      ];
      return responseReturn(data);
    }
  },
  {
    url: "/config/kingdee/insertkingdee",
    method: "post",
    response: ({ body }) => {
      return responseReturn(null);
    }
  },
  {
    url: "/config/kingdee/updatekingdee",
    method: "post",
    response: ({ body }) => {
      const data = [
        {
          id: "0632c897229a551144efbec052198507",
          accountName: "test0509",
          ipAddress: "192.168.1.207",
          linkPort: 1433,
          linkDbName: "TEST230509",
          dbType: 1,
          username: "sa",
          password: "Sa564312",
          nick: "TEST230509",
          accountStatus: 1,
          orgId: "92e6ffbad0f47dcfe1e8bdbd3dff7b67",
          createTime: "2023-06-13",
          updateTime: "2023-06-30"
        },
        {
          id: "2a294d3f0c3285299c501e584404ea19",
          accountName: "test0509",
          ipAddress: "192.168.1.207",
          linkPort: 1433,
          linkDbName: "TEST230509",
          dbType: 1,
          username: "sa",
          password: "Sa564312",
          nick: "TEST230509",
          accountStatus: 1,
          orgId: "532dad6942c17caf4b00bbd5fc498e79",
          createTime: null,
          updateTime: null
        },
        {
          id: "d909b239144e59d3da9e2da8260904ad",
          accountName: "test0509",
          ipAddress: "192.168.1.207",
          linkPort: 1433,
          linkDbName: "TEST230509",
          dbType: 1,
          username: "sa",
          password: "Sa564312",
          nick: "TEST230509",
          accountStatus: 1,
          orgId: "970bdd7bb337031de0e826338687d900",
          createTime: null,
          updateTime: null
        },
        {
          id: "e6748f1eb014b803d5291367e1d34c66",
          accountName: "qqq-test0509",
          ipAddress: "test-192.168.1.207:1433",
          linkPort: 1433,
          linkDbName: "test-TEST230509",
          dbType: 0,
          username: "test-sa",
          password: "test-Sa564312",
          nick: "test-TEST230509",
          accountStatus: 1,
          orgId: "970bdd7bb337031de0e826338687d900",
          createTime: "2023-06-29",
          updateTime: "2023-06-29"
        },
        {
          id: "ee30377289e2e55d773501aa89e8cd37",
          accountName: "test0509",
          ipAddress: "192.168.1.207",
          linkPort: 1433,
          linkDbName: "TEST230509",
          dbType: 1,
          username: "sa",
          password: "Sa564312",
          nick: "TEST230509",
          accountStatus: 1,
          orgId: "508ffc7aff5c56fa4a2e1e45fe636349",
          createTime: "2023-06-12",
          updateTime: "2023-06-12"
        }
      ];
      return responseReturn(data);
    }
  },
  {
    url: "/config/kingdee/deletekingdee",
    method: "post",
    response: ({ body }) => {
      return responseReturn(null);
    }
  }
] as MockMethod[];
