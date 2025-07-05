
import { MockMethod } from "vite-plugin-mock";

export default [
    // undefined
    { 
      url: "/work/wb/infocenter/querypendingtask",
      method: "post",
      response: ({ body }) => {
        return {
          status: 200,
          message: "操作成功",
          data: {"records":[{"sendKey":"661","sendName":"谢健","flowName":"","billNo":"MO20240929005_7c7fe80702d4437eba26bb2787c32ece","sendTime":"2024-10-09 10:34:03","processDefId":"DieSinkingApply:1:1972516","processInstId":"1972537","taskId":"1972561","formUrl":null,"projectId":"","billId":null}],"total":0,"size":30,"current":1,"orders":[],"optimizeCountSql":true,"searchCount":true,"countId":null,"maxLimit":null,"pages":0},
          timestamp: 1744351203928
        };
      }
    },
    // 组织架构图
    { 
      url: "/work/sys/orgchart/select",
      method: "post",
      response: ({ body }) => {
        return {
          status: 200,
          message: "操作成功",
          data: [{"id":"0","parentId":"-1","name":"所有部门","title":"所有部门","director":"","displayOrder":null,"spread":true,"open":true,"children":[{"id":"1","parentId":"0","name":"总经办","title":"总经办","director":null,"displayOrder":1},{"id":"63","parentId":"0","name":"营销处","title":"营销处","director":null,"displayOrder":2,"children":[{"id":"14","parentId":"63","name":"市场中心","title":"市场中心","director":"阿尔法特","displayOrder":1},{"id":"2","parentId":"63","name":"销售中心","title":"销售中心","director":"樊鸣宇","displayOrder":2,"children":[{"id":"22","parentId":"2","name":"日本组","title":"日本组","director":"江仕容","displayOrder":1},{"id":"21","parentId":"2","name":"欧美组","title":"欧美组","director":"江仕容","displayOrder":2}]}]},{"id":"64","parentId":"0","name":"产品处","title":"产品处","director":"朱丽","displayOrder":4,"children":[{"id":"6","parentId":"64","name":"技术研发中心","title":"技术研发中心","director":"朱丽","displayOrder":1,"children":[{"id":"34","parentId":"6","name":"风筒组","title":"风筒组","director":"陈映杰","displayOrder":1},{"id":"46","parentId":"6","name":"卷直组","title":"卷直组","director":"杨样新","displayOrder":2},{"id":"41","parentId":"6","name":"电推剪组","title":"电推剪组","director":"罗伟柏","displayOrder":3},{"id":"83","parentId":"6","name":"厨电组","title":"厨电组","director":"严定胜","displayOrder":4},{"id":"77","parentId":"6","name":"电子组","title":"电子组","director":"叶小萌","displayOrder":5},{"id":"38","parentId":"6","name":"测试组","title":"测试组","director":"李昀","displayOrder":6},{"id":"39","parentId":"6","name":"样品组","title":"样品组","director":"阳远众","displayOrder":7},{"id":"40","parentId":"6","name":"资料组","title":"资料组","director":"朱丽","displayOrder":8}]},{"id":"16","parentId":"64","name":"制造工程部","title":"制造工程部","director":"方向均","displayOrder":2},{"id":"10","parentId":"64","name":"采购部","title":"采购部","director":"白飞雄","displayOrder":3},{"id":"4","parentId":"64","name":"制造中心","title":"制造中心","director":"赵永松","displayOrder":4,"children":[{"id":"121","parentId":"4","name":"前加工部","title":"前加工部","director":"赵永松","displayOrder":1},{"id":"15","parentId":"4","name":"制造一部","title":"制造一部","director":"赵永松","displayOrder":2},{"id":"81","parentId":"4","name":"制造二部","title":"制造二部","director":"赵永松","displayOrder":3}]},{"id":"82","parentId":"64","name":"计划部","title":"计划部","director":"简凯辉","displayOrder":5,"children":[{"id":"122","parentId":"82","name":"计划组","title":"计划组","director":"简凯辉","displayOrder":1},{"id":"11","parentId":"82","name":"仓储组","title":"仓储组","director":"简凯辉","displayOrder":2}]}]},{"id":"67","parentId":"0","name":"品质中心","title":"品质中心","director":"朱丽","displayOrder":5,"children":[{"id":"7","parentId":"67","name":"品质管理部","title":"品质管理部","director":"李现伟","displayOrder":1},{"id":"120","parentId":"67","name":"品质工程部","title":"品质工程部","director":"李现伟","displayOrder":2},{"id":"23","parentId":"67","name":"体系认证部","title":"体系认证部","director":"邓常兰","displayOrder":3}]},{"id":"128","parentId":"0","name":"财务中心","title":"财务中心","director":"曾玉霞","displayOrder":6,"children":[{"id":"8","parentId":"128","name":"财务部","title":"财务部","director":"曾玉霞","displayOrder":1},{"id":"69","parentId":"128","name":"经管部","title":"经管部","director":"郑锦","displayOrder":2}]},{"id":"70","parentId":"0","name":"人力行政部","title":"人力行政部","director":"来俊利","displayOrder":7,"children":[{"id":"118","parentId":"70","name":"人事组","title":"人事组","director":"来俊利","displayOrder":1},{"id":"119","parentId":"70","name":"行政组","title":"行政组","director":"雷阳娟","displayOrder":2}]},{"id":"9","parentId":"0","name":"IT资讯部","title":"IT资讯部","director":"原侃","displayOrder":8}]}],
          timestamp: 1734080848788
        };
      }
    },
    // 画图工具
    { 
      url: "/work/wb/drawtool/select",
      method: "post",
      response: ({ body }) => {
        return {
          status: 200,
          message: "操作成功",
          data: {"records":[{"id":"a0397275b88b753b9ff3c768adfd1b4d","processName":"测试流程2","processCode":"110","billNo":"DRAW20250705002","billState":0,"version":2,"filePath":"SYS/drawPicture/DRAW20250705002","fileName":"测试流程2.xml","resourceName":"c566753e676148b8aa6c5c778109a23e.xml","virtualPath":"/static/virtual/file/ftpfile/SYS/drawPicture/DRAW20250705002/c566753e676148b8aa6c5c778109a23e.xml","createDate":"2025-07-05","modifyDate":null,"createUserId":1385115,"createUserName":"李秀海","modifyUserId":null,"modifyUserName":null},{"id":"f72497dfca9ccbf90028df094a38a45f","processName":"测试流程","processCode":"100","billNo":"DRAW20250705001","billState":0,"version":1,"filePath":"SYS/drawPicture/DRAW20250705001","fileName":"测试流程.xml","resourceName":"08b8507e361643738f72eadc21f3bc52.xml","virtualPath":"/static/virtual/file/ftpfile/SYS/drawPicture/DRAW20250705001/08b8507e361643738f72eadc21f3bc52.xml","createDate":"2025-07-05","modifyDate":null,"createUserId":1385115,"createUserName":"李秀海","modifyUserId":null,"modifyUserName":null}],"total":2,"size":30,"current":1,"orders":[],"optimizeCountSql":true,"searchCount":true,"countId":null,"maxLimit":null,"pages":1},
          timestamp: 1751709534716
        };
      }
    },
    // 画图工具
    { 
      url: "/work/wb/drawtool/update",
      method: "post",
      response: ({ body }) => {
        return {
          status: 200,
          message: "操作成功",
          data: true,
          timestamp: 1734664414418
        };
      }
    },
    // 画图工具
    { 
      url: "/work/wb/drawtool/insert",
      method: "post",
      response: ({ body }) => {
        return {
          status: 200,
          message: "操作成功",
          data: true,
          timestamp: 1751709510450
        };
      }
    },
    // 画图工具
    { 
      url: "/work/wb/drawtool/delete",
      method: "post",
      response: ({ body }) => {
        return {
          status: 200,
          message: "操作成功",
          data: true,
          timestamp: 1734664501658
        };
      }
    },
    // 信息中心
    { 
      url: "/work/wb/infocenter/queryfinishtask",
      method: "post",
      response: ({ body }) => {
        return {
          status: 200,
          message: "操作成功",
          data: {"records":[],"total":0,"size":0,"current":1,"orders":[],"optimizeCountSql":true,"searchCount":true,"countId":null,"maxLimit":null,"pages":0},
          timestamp: 1744351212125
        };
      }
    },
    // 信息中心
    { 
      url: "/work/wb/infocenter/querystarttask",
      method: "post",
      response: ({ body }) => {
        return {
          status: 200,
          message: "操作成功",
          data: {"records":[{"executionId":null,"activityId":null,"taskId":null,"activityName":null,"assignee":null,"startTime":"2025-04-01 22:11:04","endTime":"2025-04-01 22:28:01","handleComment":null,"deleteReason":null,"duration":"16分钟","billNo":"ALF25040114","flowName":"请假单审批流","processDefId":"AskForLeave:7:1635118","processInstId":"2629986","formUrl":"/oa/hr/askforleave/edit","projectId":"/oa/hr/askforleave/edit","processStatus":"已完毕","statusColor":"#07c160","billId":null},{"executionId":null,"activityId":null,"taskId":null,"activityName":null,"assignee":null,"startTime":"2025-04-01 22:09:33","endTime":"2025-04-01 22:28:07","handleComment":null,"deleteReason":null,"duration":"18分钟","billNo":"ALF25040113","flowName":"请假单审批流","processDefId":"AskForLeave:7:1635118","processInstId":"2629961","formUrl":"/oa/hr/askforleave/edit","projectId":"/oa/hr/askforleave/edit","processStatus":"已完毕","statusColor":"#07c160","billId":null},{"executionId":null,"activityId":null,"taskId":null,"activityName":null,"assignee":null,"startTime":"2025-03-22 07:20:56","endTime":"2025-03-22 07:28:11","handleComment":null,"deleteReason":null,"duration":"7分钟","billNo":"ALF25032201","flowName":"请假单审批流","processDefId":"AskForLeave:7:1635118","processInstId":"2600072","formUrl":"/oa/hr/askforleave/edit","projectId":"/oa/hr/askforleave/edit","processStatus":"已完毕","statusColor":"#07c160","billId":null},{"executionId":null,"activityId":null,"taskId":null,"activityName":null,"assignee":null,"startTime":"2025-02-26 07:42:53","endTime":"2025-02-26 08:18:18","handleComment":null,"deleteReason":null,"duration":"35分钟","billNo":"ALF25022601","flowName":"请假单审批流","processDefId":"AskForLeave:7:1635118","processInstId":"2510008","formUrl":"/oa/hr/askforleave/edit","projectId":"/oa/hr/askforleave/edit","processStatus":"已完毕","statusColor":"#07c160","billId":null},{"executionId":null,"activityId":null,"taskId":null,"activityName":null,"assignee":null,"startTime":"2025-02-23 20:31:07","endTime":"2025-02-23 20:31:52","handleComment":null,"deleteReason":null,"duration":"44秒","billNo":"ALF25022302","flowName":"请假单审批流","processDefId":"AskForLeave:7:1635118","processInstId":"2500046","formUrl":"/oa/hr/askforleave/edit","projectId":"/oa/hr/askforleave/edit","processStatus":"已完毕","statusColor":"#07c160","billId":null},{"executionId":null,"activityId":null,"taskId":null,"activityName":null,"assignee":null,"startTime":"2025-02-23 20:30:27","endTime":"2025-02-23 20:31:48","handleComment":null,"deleteReason":null,"duration":"1分钟","billNo":"ALF25022301","flowName":"请假单审批流","processDefId":"AskForLeave:7:1635118","processInstId":"2500021","formUrl":"/oa/hr/askforleave/edit","projectId":"/oa/hr/askforleave/edit","processStatus":"已完毕","statusColor":"#07c160","billId":null},{"executionId":null,"activityId":null,"taskId":null,"activityName":null,"assignee":null,"startTime":"2025-02-05 15:19:27","endTime":"2025-02-05 15:19:51","handleComment":null,"deleteReason":null,"duration":"24秒","billNo":"ALF25020507","flowName":"请假单审批流","processDefId":"AskForLeave:7:1635118","processInstId":"2440471","formUrl":"/oa/hr/askforleave/edit","projectId":"/oa/hr/askforleave/edit","processStatus":"已完毕","statusColor":"#07c160","billId":null},{"executionId":null,"activityId":null,"taskId":null,"activityName":null,"assignee":null,"startTime":"2024-12-11 08:18:20","endTime":"2024-12-11 08:22:48","handleComment":null,"deleteReason":null,"duration":"4分钟","billNo":"ALF24121101","flowName":"请假单审批流","processDefId":"AskForLeave:7:1635118","processInstId":"2272501","formUrl":"/oa/hr/askforleave/edit","projectId":"/oa/hr/askforleave/edit","processStatus":"已完毕","statusColor":"#07c160","billId":null},{"executionId":null,"activityId":null,"taskId":null,"activityName":null,"assignee":null,"startTime":"2024-12-07 17:36:02","endTime":"2024-12-07 17:56:37","handleComment":null,"deleteReason":null,"duration":"20分钟","billNo":"ALF24120707","flowName":"请假单审批流","processDefId":"AskForLeave:7:1635118","processInstId":"2252914","formUrl":"/oa/hr/askforleave/edit","projectId":"/oa/hr/askforleave/edit","processStatus":"已完毕","statusColor":"#07c160","billId":null},{"executionId":null,"activityId":null,"taskId":null,"activityName":null,"assignee":null,"startTime":"2024-09-28 17:51:41","endTime":"2024-09-28 17:51:54","handleComment":null,"deleteReason":null,"duration":"13秒","billNo":"ALF24092706_1a70ee44af41467cbdd1d2ebd6ae00cb","flowName":"请假单审批流","processDefId":"AskForLeave:7:1635118","processInstId":"2010809","formUrl":"/oa/hr/askforleave/edit","projectId":"/oa/hr/askforleave/edit","processStatus":"已完毕","statusColor":"#07c160","billId":null},{"executionId":null,"activityId":null,"taskId":null,"activityName":null,"assignee":null,"startTime":"2024-09-27 12:18:18","endTime":"2024-09-27 12:31:41","handleComment":null,"deleteReason":null,"duration":"13分钟","billNo":"ALF24092706","flowName":"请假单审批流","processDefId":"AskForLeave:7:1635118","processInstId":"2007501","formUrl":"/oa/hr/askforleave/edit","projectId":"/oa/hr/askforleave/edit","processStatus":"已完毕","statusColor":"#07c160","billId":null},{"executionId":null,"activityId":null,"taskId":null,"activityName":null,"assignee":null,"startTime":"2024-05-09 08:40:12","endTime":"2024-05-09 08:41:31","handleComment":null,"deleteReason":null,"duration":"1分钟","billNo":"AFL240509003","flowName":"请假单审批流","processDefId":"AskForLeave:1:20004","processInstId":"1485222","formUrl":"/oa/hr/askforleave/edit","projectId":"/oa/hr/askforleave/edit","processStatus":"已完毕","statusColor":"#07c160","billId":null},{"executionId":null,"activityId":null,"taskId":null,"activityName":null,"assignee":null,"startTime":"2024-04-16 17:17:06","endTime":"2024-04-16 17:34:05","handleComment":null,"deleteReason":null,"duration":"16分钟","billNo":"AFL240416003","flowName":"请假单审批流","processDefId":"AskForLeave:1:20004","processInstId":"1400414","formUrl":"/oa/hr/askforleave/edit","projectId":"/oa/hr/askforleave/edit","processStatus":"已完毕","statusColor":"#07c160","billId":null},{"executionId":null,"activityId":null,"taskId":null,"activityName":null,"assignee":null,"startTime":"2024-02-24 12:46:22","endTime":"2024-02-24 12:52:29","handleComment":null,"deleteReason":null,"duration":"6分钟","billNo":"AFL240224005","flowName":"请假单审批流","processDefId":"AskForLeave:1:20004","processInstId":"1250403","formUrl":"/oa/hr/askforleave/edit","projectId":"/oa/hr/askforleave/edit","processStatus":"已完毕","statusColor":"#07c160","billId":null},{"executionId":null,"activityId":null,"taskId":null,"activityName":null,"assignee":null,"startTime":"2024-02-18 07:45:22","endTime":"2024-02-18 07:50:24","handleComment":null,"deleteReason":null,"duration":"5分钟","billNo":"AFL240218005","flowName":"请假单审批流","processDefId":"AskForLeave:1:20004","processInstId":"1232935","formUrl":"/oa/hr/askforleave/edit","projectId":"/oa/hr/askforleave/edit","processStatus":"已完毕","statusColor":"#07c160","billId":null},{"executionId":null,"activityId":null,"taskId":null,"activityName":null,"assignee":null,"startTime":"2024-01-02 09:08:06","endTime":"2024-01-04 09:47:58","handleComment":null,"deleteReason":null,"duration":"2天","billNo":"VR2024010201","flowName":"访客接待审批流程","processDefId":"VisitorReception:2:1155719","processInstId":"1155720","formUrl":"/oa/visitor/reception","projectId":"/oa/visitor/reception","processStatus":"已完毕","statusColor":"#07c160","billId":null},{"executionId":null,"activityId":null,"taskId":null,"activityName":null,"assignee":null,"startTime":"2023-08-31 08:46:03","endTime":"2023-08-31 18:22:44","handleComment":null,"deleteReason":null,"duration":"9小时","billNo":"AFL230823003","flowName":"请假单审批流","processDefId":"AskForLeave:1:20004","processInstId":"830534","formUrl":"/oa/hr/askforleave/edit","projectId":"/oa/hr/askforleave/edit","processStatus":"已完毕","statusColor":"#07c160","billId":null},{"executionId":null,"activityId":null,"taskId":null,"activityName":null,"assignee":null,"startTime":"2023-07-11 07:55:02","endTime":"2023-08-15 20:33:31","handleComment":null,"deleteReason":null,"duration":"35天","billNo":"AFL230711001","flowName":"请假单审批流","processDefId":"AskForLeave:1:20004","processInstId":"660032","formUrl":"/oa/hr/askforleave/edit","projectId":"/oa/hr/askforleave/edit","processStatus":"已完毕","statusColor":"#07c160","billId":null},{"executionId":null,"activityId":null,"taskId":null,"activityName":null,"assignee":null,"startTime":"2023-06-08 08:31:13","endTime":"2023-06-08 08:53:59","handleComment":null,"deleteReason":null,"duration":"22分钟","billNo":"AFL230608002","flowName":"请假单审批流","processDefId":"AskForLeave:1:20004","processInstId":"555008","formUrl":"/oa/hr/askforleave/edit","projectId":"/oa/hr/askforleave/edit","processStatus":"已完毕","statusColor":"#07c160","billId":null},{"executionId":null,"activityId":null,"taskId":null,"activityName":null,"assignee":null,"startTime":"2023-06-06 17:56:12","endTime":"2023-06-06 18:29:42","handleComment":null,"deleteReason":null,"duration":"33分钟","billNo":"AFL230606003","flowName":"请假单审批流","processDefId":"AskForLeave:1:20004","processInstId":"547668","formUrl":"/oa/hr/askforleave/edit","projectId":"/oa/hr/askforleave/edit","processStatus":"已完毕","statusColor":"#07c160","billId":null}],"total":20,"size":20,"current":1,"orders":[],"optimizeCountSql":true,"searchCount":true,"countId":null,"maxLimit":null,"pages":1},
          timestamp: 1744280438487
        };
      }
    },
    // 信息中心
    { 
      url: "/work/wb/infocenter/querymytasks",
      method: "post",
      response: ({ body }) => {
        return {
          status: 200,
          message: "操作成功",
          data: {"records":[],"total":0,"size":30,"current":1,"orders":[],"optimizeCountSql":true,"searchCount":true,"countId":null,"maxLimit":null,"pages":0},
          timestamp: 1744351214878
        };
      }
    }] as MockMethod[];
