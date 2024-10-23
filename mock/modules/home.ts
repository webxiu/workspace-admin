
import { MockMethod } from "vite-plugin-mock";

export default [
    // undefined
    { 
      url: "/sys/sys/mymenus/querymymenu",
      method: "post",
      response: ({ body }) => {
        return {
          status: 200,
          message: "操作成功",
          data: [{"controller":"/work/wb/infocenter/index","web_router":"/workbench/infoCenter/index","icon":"iconfont icon-caiwubaobiao","menuId":87,"menuName":"信息中心"},{"controller":"/sys/sys/sqlexecuteapproval/index","web_router":"/system/develop/database/index","icon":"layui-icon layui-icon-note","menuId":241,"menuName":"数据库维护"},{"controller":"/sys/sys/userinfo/index","web_router":"/system/basic/user/index","icon":"iconfont icon-jiaosequnti","menuId":68,"menuName":"用户管理"},{"controller":"/system/develop/taskManage/index","web_router":"/system/develop/taskManage/index","icon":"","menuId":277,"menuName":"任务管理"}],
          timestamp: 1729653829795
        };
      }
    },
    // undefined
    { 
      url: "/home/Countdowns",
      method: "get",
      response: ({ body }) => {
        return {
          status: 200,
          message: "操作成功",
          data: [{"item":"百岁倒计时","auxiliary":"11995","value":"32.8%"},{"item":"加入德龙","auxiliary":"518","value":"1.4"},{"item":"本年倒计时","auxiliary":"297","value":"81.1%"},{"item":"本月倒计时","auxiliary":"23","value":"74.2%"},{"item":"本周倒计时","auxiliary":"3","value":"42.9%"}],
          timestamp: 1729653829803
        };
      }
    },
    // undefined
    { 
      url: "/work/wb/infocenter/selectconuttask",
      method: "post",
      response: ({ body }) => {
        return {
          status: 200,
          message: "操作成功",
          data: {"responsibilityWait":0,"createSuspend":0,"responsibilitySuspend":0,"createWait":0},
          timestamp: 1729653829810
        };
      }
    }] as MockMethod[];
