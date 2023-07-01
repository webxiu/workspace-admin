// 根据角色动态生成路由

import { MockMethod } from "vite-plugin-mock";

export default [
  {
    url: "/config/login/verifyuser",
    method: "post",
    response: ({ body }) => {
      return {
        status: 200,
        message: "操作成功",
        data: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYmYiOjE2ODgxOTg4NzIsIlVzZXJEYXRhIjoiYTBhZGExNmIxM2I4NWQwZDg5ZTI1ZmY3ZTlmZmVkNDIiLCJpc3MiOiJtYW5hbmdlcmNlbnRlciIsImV4cCI6MTY4ODIyNzY3MiwiaWF0IjoxNjg4MTk4ODcyfQ.OOomwt3FxEoA0mQKm1lOH3da8mddRvb_AW4Z8qscY80",
        timestamp: 1688198872743
      };
    }
  },
  {
    url: "/config/login/logout",
    method: "get",
    response: ({ body }) => {
      return {
        status: 504,
        message: "系统没有检测到TOKEN，请重新登陆",
        data: null,
        timestamp: 1688199311056
      };
    }
  },
  {
    url: "/config/login/getownuserinfo",
    method: "get",
    response: ({ body }) => {
      return {
        status: 200,
        message: "操作成功",
        data: {
          id: "a0ada16b13b85d0d89e25ff7e9ffed42",
          userName: "admin",
          userCode: "admin",
          avater: "",
          state: 1
        },
        timestamp: 1688198875059
      };
    }
  },
  {
    url: "/config/login/updatepassword",
    method: "post",
    response: ({ body }) => {
      return {
        status: 200,
        message: "操作成功",
        data: {
          id: "a0ada16b13b85d0d89e25ff7e9ffed42",
          userName: "admin",
          userCode: "admin",
          avater: "",
          state: 1
        },
        timestamp: 1688198875059
      };
    }
  }
] as MockMethod[];
