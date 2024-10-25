
import { MockMethod } from "vite-plugin-mock";

export default [
    // undefined
    { 
      url: "/oa/hr/StaffResign/getStaffResignById",
      method: "get",
      response: ({ body }) => {
        return {
          status: 200,
          message: "操作成功",
          data: {"id":"fdec7bc4ba159541c57e2e66b37496db","billId":"10061","billNo":"SR20241019001","billState":1,"staffId":24205,"staffCode":"659","staffName":"李秀海","deptName":"IT资讯部","roleName":"软件工程师","startDate":"2023-05-24","applyDate":"2024-10-19","resignationType":"其他其他原因xx","resignationReason":"离职原因嗖嗖嗖sdddd","createUserName":"谢健","createDate":"2024-10-19T09:04:19","modifyUserName":"李秀海","modifyDate":"2024-10-21T18:13:23","orgId":"532dad6942c17caf4b00bbd5fc498e79"},
          timestamp: 1729750491287
        };
      }
    },
    // 画图工具
    { 
      url: "/work/sys/orgchart/select",
      method: "post",
      response: ({ body }) => {
        return {
          status: 200,
          message: "操作成功",
          data: [{"id":"0","parentId":"-1","name":"所有部门","title":"所有部门","director":"","displayOrder":null,"spread":true,"open":true,"children":[{"id":"1","parentId":"0","name":"总经办","title":"总经办","director":null,"displayOrder":1},{"id":"63","parentId":"0","name":"营销处","title":"营销处","director":null,"displayOrder":2,"children":[{"id":"14","parentId":"63","name":"市场中心","title":"市场中心","director":"阿尔法特","displayOrder":1},{"id":"2","parentId":"63","name":"销售中心","title":"销售中心","director":"樊鸣宇","displayOrder":2,"children":[{"id":"22","parentId":"2","name":"日本组","title":"日本组","director":"江仕容","displayOrder":1},{"id":"21","parentId":"2","name":"欧美组","title":"欧美组","director":"江仕容","displayOrder":2}]}]},{"id":"64","parentId":"0","name":"产品处","title":"产品处","director":"朱丽","displayOrder":4,"children":[{"id":"6","parentId":"64","name":"技术研发中心","title":"技术研发中心","director":"朱丽","displayOrder":1,"children":[{"id":"34","parentId":"6","name":"风筒组","title":"风筒组","director":"陈映杰","displayOrder":1},{"id":"46","parentId":"6","name":"卷直组","title":"卷直组","director":"杨样新","displayOrder":2},{"id":"41","parentId":"6","name":"电推剪组","title":"电推剪组","director":"罗伟柏","displayOrder":3},{"id":"83","parentId":"6","name":"厨电组","title":"厨电组","director":"严定胜","displayOrder":4},{"id":"77","parentId":"6","name":"电子组","title":"电子组","director":"叶小萌","displayOrder":5},{"id":"38","parentId":"6","name":"测试组","title":"测试组","director":"李昀","displayOrder":6},{"id":"39","parentId":"6","name":"样品组","title":"样品组","director":"阳远众","displayOrder":7},{"id":"40","parentId":"6","name":"资料组","title":"资料组","director":"朱丽","displayOrder":8}]},{"id":"16","parentId":"64","name":"制造工程部","title":"制造工程部","director":"方向均","displayOrder":2},{"id":"10","parentId":"64","name":"采购部","title":"采购部","director":"白飞雄","displayOrder":3},{"id":"4","parentId":"64","name":"制造中心","title":"制造中心","director":"赵永松","displayOrder":4,"children":[{"id":"121","parentId":"4","name":"前加工部","title":"前加工部","director":"赵永松","displayOrder":1},{"id":"15","parentId":"4","name":"制造一部","title":"制造一部","director":"赵永松","displayOrder":2},{"id":"81","parentId":"4","name":"制造二部","title":"制造二部","director":"赵永松","displayOrder":3}]},{"id":"82","parentId":"64","name":"计划部","title":"计划部","director":"简凯辉","displayOrder":5,"children":[{"id":"122","parentId":"82","name":"计划组","title":"计划组","director":"简凯辉","displayOrder":1},{"id":"11","parentId":"82","name":"仓储组","title":"仓储组","director":"简凯辉","displayOrder":2}]}]},{"id":"67","parentId":"0","name":"品质中心","title":"品质中心","director":"朱丽","displayOrder":5,"children":[{"id":"7","parentId":"67","name":"品质管理部","title":"品质管理部","director":"李现伟","displayOrder":1},{"id":"120","parentId":"67","name":"品质工程部","title":"品质工程部","director":"李现伟","displayOrder":2},{"id":"23","parentId":"67","name":"体系认证部","title":"体系认证部","director":"邓常兰","displayOrder":3}]},{"id":"128","parentId":"0","name":"财务中心","title":"财务中心","director":"曾玉霞","displayOrder":6,"children":[{"id":"8","parentId":"128","name":"财务部","title":"财务部","director":"曾玉霞","displayOrder":1},{"id":"69","parentId":"128","name":"经管部","title":"经管部","director":"郑锦","displayOrder":2}]},{"id":"70","parentId":"0","name":"人力行政部","title":"人力行政部","director":"来俊利","displayOrder":7,"children":[{"id":"118","parentId":"70","name":"人事组","title":"人事组","director":"来俊利","displayOrder":1},{"id":"119","parentId":"70","name":"行政组","title":"行政组","director":"雷阳娟","displayOrder":2}]},{"id":"9","parentId":"0","name":"IT资讯部","title":"IT资讯部","director":"原侃","displayOrder":8}]}],
          timestamp: 1729675535655
        };
      }
    },
    // 信息中心
    { 
      url: "/work/wb/infocenter/querypendingtask",
      method: "post",
      response: ({ body }) => {
        return {
          status: 200,
          message: "操作成功",
          data: {"records":[{"sendKey":"661","sendName":"谢健","flowName":"","billNo":"MO20240929005_7c7fe80702d4437eba26bb2787c32ece","sendTime":"2024-10-09 10:34:03","processDefId":"DieSinkingApply:1:1972516","processInstId":"1972537","taskId":"1972561","formUrl":null,"projectId":"","billId":null}],"total":1,"size":500,"current":1,"orders":[],"optimizeCountSql":true,"searchCount":true,"countId":null,"maxLimit":null,"pages":1},
          timestamp: 1729750473436
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
          data: {"records":[{"executionId":null,"activityId":null,"taskId":null,"activityName":null,"assignee":null,"startTime":"2024-10-22 14:45:16","endTime":null,"handleComment":null,"deleteReason":null,"duration":null,"billNo":"SR20241019001","flowName":"离职申请审批流","processDefId":"StaffResign:1:2020004","processInstId":"2025001","formUrl":"/oa/hr/resignapply","projectId":"/oa/hr/resignapply","processStatus":"审核中","statusColor":"#1e9fff","billId":null},{"executionId":null,"activityId":null,"taskId":null,"activityName":null,"assignee":null,"startTime":"2024-10-22 09:55:22","endTime":null,"handleComment":null,"deleteReason":null,"duration":null,"billNo":"OM241021001","flowName":"离职申请审批流","processDefId":"StaffResign:1:2020004","processInstId":"2020005","formUrl":"/oa/hr/resignapply","projectId":"/oa/hr/resignapply","processStatus":"审核中","statusColor":"#1e9fff","billId":null},{"executionId":null,"activityId":null,"taskId":null,"activityName":null,"assignee":null,"startTime":"2024-10-21 16:29:46","endTime":"2024-10-22 10:04:12","handleComment":null,"deleteReason":null,"duration":"17小时","billNo":"ALF24102101","flowName":"请假单审批流","processDefId":"AskForLeave:7:1635118","processInstId":"2015001","formUrl":"/oa/hr/askforleave/edit","projectId":"/oa/hr/askforleave/edit","processStatus":"已完毕","statusColor":"#07c160","billId":null},{"executionId":null,"activityId":null,"taskId":null,"activityName":null,"assignee":null,"startTime":"2024-09-18 10:43:09","endTime":"2024-09-18 10:43:21","handleComment":null,"deleteReason":null,"duration":"12秒","billNo":"ALF24091801","flowName":"请假单审批流","processDefId":"AskForLeave:7:1635118","processInstId":"1955001","formUrl":"/oa/hr/askforleave/edit","projectId":"/oa/hr/askforleave/edit","processStatus":"已完毕","statusColor":"#07c160","billId":null},{"executionId":null,"activityId":null,"taskId":null,"activityName":null,"assignee":null,"startTime":"2024-05-09 08:40:12","endTime":"2024-05-09 08:41:31","handleComment":null,"deleteReason":null,"duration":"1分钟","billNo":"AFL240509003","flowName":"请假单审批流","processDefId":"AskForLeave:1:20004","processInstId":"1485222","formUrl":"/oa/hr/askforleave/edit","projectId":"/oa/hr/askforleave/edit","processStatus":"已完毕","statusColor":"#07c160","billId":null},{"executionId":null,"activityId":null,"taskId":null,"activityName":null,"assignee":null,"startTime":"2024-04-16 17:17:06","endTime":"2024-04-16 17:34:05","handleComment":null,"deleteReason":null,"duration":"16分钟","billNo":"AFL240416003","flowName":"请假单审批流","processDefId":"AskForLeave:1:20004","processInstId":"1400414","formUrl":"/oa/hr/askforleave/edit","projectId":"/oa/hr/askforleave/edit","processStatus":"已完毕","statusColor":"#07c160","billId":null},{"executionId":null,"activityId":null,"taskId":null,"activityName":null,"assignee":null,"startTime":"2024-02-24 12:46:22","endTime":"2024-02-24 12:52:29","handleComment":null,"deleteReason":null,"duration":"6分钟","billNo":"AFL240224005","flowName":"请假单审批流","processDefId":"AskForLeave:1:20004","processInstId":"1250403","formUrl":"/oa/hr/askforleave/edit","projectId":"/oa/hr/askforleave/edit","processStatus":"已完毕","statusColor":"#07c160","billId":null},{"executionId":null,"activityId":null,"taskId":null,"activityName":null,"assignee":null,"startTime":"2024-02-18 07:45:22","endTime":"2024-02-18 07:50:24","handleComment":null,"deleteReason":null,"duration":"5分钟","billNo":"AFL240218005","flowName":"请假单审批流","processDefId":"AskForLeave:1:20004","processInstId":"1232935","formUrl":"/oa/hr/askforleave/edit","projectId":"/oa/hr/askforleave/edit","processStatus":"已完毕","statusColor":"#07c160","billId":null},{"executionId":null,"activityId":null,"taskId":null,"activityName":null,"assignee":null,"startTime":"2024-01-02 09:08:06","endTime":"2024-01-04 09:47:58","handleComment":null,"deleteReason":null,"duration":"2天","billNo":"VR2024010201","flowName":"访客接待审批流程","processDefId":"VisitorReception:2:1155719","processInstId":"1155720","formUrl":"/oa/visitor/reception","projectId":"/oa/visitor/reception","processStatus":"已完毕","statusColor":"#07c160","billId":null},{"executionId":null,"activityId":null,"taskId":null,"activityName":null,"assignee":null,"startTime":"2023-08-31 08:46:03","endTime":"2023-08-31 18:22:44","handleComment":null,"deleteReason":null,"duration":"9小时","billNo":"AFL230823003","flowName":"请假单审批流","processDefId":"AskForLeave:1:20004","processInstId":"830534","formUrl":"/oa/hr/askforleave/edit","projectId":"/oa/hr/askforleave/edit","processStatus":"已完毕","statusColor":"#07c160","billId":null},{"executionId":null,"activityId":null,"taskId":null,"activityName":null,"assignee":null,"startTime":"2023-07-11 07:55:02","endTime":"2023-08-15 20:33:31","handleComment":null,"deleteReason":null,"duration":"35天","billNo":"AFL230711001","flowName":"请假单审批流","processDefId":"AskForLeave:1:20004","processInstId":"660032","formUrl":"/oa/hr/askforleave/edit","projectId":"/oa/hr/askforleave/edit","processStatus":"已完毕","statusColor":"#07c160","billId":null},{"executionId":null,"activityId":null,"taskId":null,"activityName":null,"assignee":null,"startTime":"2023-06-08 08:31:13","endTime":"2023-06-08 08:53:59","handleComment":null,"deleteReason":null,"duration":"22分钟","billNo":"AFL230608002","flowName":"请假单审批流","processDefId":"AskForLeave:1:20004","processInstId":"555008","formUrl":"/oa/hr/askforleave/edit","projectId":"/oa/hr/askforleave/edit","processStatus":"已完毕","statusColor":"#07c160","billId":null},{"executionId":null,"activityId":null,"taskId":null,"activityName":null,"assignee":null,"startTime":"2023-06-06 17:56:12","endTime":"2023-06-06 18:29:42","handleComment":null,"deleteReason":null,"duration":"33分钟","billNo":"AFL230606003","flowName":"请假单审批流","processDefId":"AskForLeave:1:20004","processInstId":"547668","formUrl":"/oa/hr/askforleave/edit","projectId":"/oa/hr/askforleave/edit","processStatus":"已完毕","statusColor":"#07c160","billId":null}],"total":13,"size":13,"current":1,"orders":[],"optimizeCountSql":true,"searchCount":true,"countId":null,"maxLimit":null,"pages":1},
          timestamp: 1729750485770
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
          timestamp: 1729750482941
        };
      }
    },
    // 岗位管理
    { 
      url: "/work/tm/teamposition/selectposition",
      method: "post",
      response: ({ body }) => {
        return {
          status: 200,
          message: "操作成功",
          data: [{"id":77,"roleCode":"045","roleName":"软件工程师","k3RoleId":2066034,"k3RoleCode":"045","remark":"","deptId":9,"deptName":"IT资讯部","itemId":null,"tagid":158,"parentId":"279","parentName":"系统组长","mnemonics":null,"staffingPeopleCount":5,"rolePeopleCount":5,"deptPath":"IT资讯部"},{"id":216,"roleCode":"142","roleName":"网络工程师","k3RoleId":2066044,"k3RoleCode":"142","remark":"","deptId":9,"deptName":"IT资讯部","itemId":null,"tagid":67,"parentId":"279","parentName":"系统组长","mnemonics":null,"staffingPeopleCount":1,"rolePeopleCount":1,"deptPath":"IT资讯部"},{"id":263,"roleCode":"184","roleName":"ERP工程师","k3RoleId":2066237,"k3RoleCode":"184","remark":"","deptId":9,"deptName":"IT资讯部","itemId":null,"tagid":149,"parentId":"279","parentName":"系统组长","mnemonics":null,"staffingPeopleCount":1,"rolePeopleCount":1,"deptPath":"IT资讯部"},{"id":279,"roleCode":"200","roleName":"系统组长","k3RoleId":2066045,"k3RoleCode":"200","remark":"","deptId":9,"deptName":"IT资讯部","itemId":null,"tagid":29,"parentId":null,"parentName":null,"mnemonics":null,"staffingPeopleCount":1,"rolePeopleCount":1,"deptPath":"IT资讯部"},{"id":542,"roleCode":"293","roleName":"IT顾问","k3RoleId":2152155,"k3RoleCode":"293","remark":"","deptId":9,"deptName":"IT资讯部","itemId":null,"tagid":272,"parentId":"-1","parentName":null,"mnemonics":null,"staffingPeopleCount":1,"rolePeopleCount":2,"deptPath":"IT资讯部"}],
          timestamp: 1729675479562
        };
      }
    },
    // 岗位管理
    { 
      url: "/work/tm/teamposition/selectresponsibilities",
      method: "post",
      response: ({ body }) => {
        return {
          status: 200,
          message: "操作成功",
          data: [{"id":3,"roleInfoId":77,"responsibilities":"根据项目具体要求，承担软件的开发任务，按照项目预期目标完成软件开发；","sequence":null},{"id":18,"roleInfoId":77,"responsibilities":"负责编写项目相关的技术文档、操作说明","sequence":null},{"id":19,"roleInfoId":77,"responsibilities":"负责对外购系统软件的维护、改善工作","sequence":null},{"id":20,"roleInfoId":77,"responsibilities":"负责在软件设计完成后，对软件进行运行试验与测试，对于测试中发现的问题及时进行修改","sequence":null},{"id":21,"roleInfoId":77,"responsibilities":"负责进行用户需求调查分析，根据分析结果对软件系统及模块功能进行调整","sequence":null},{"id":22,"roleInfoId":77,"responsibilities":"负责参加与各部门提出的问题、需求沟通，协助上级确定解决方案","sequence":null},{"id":23,"roleInfoId":77,"responsibilities":"负责对公司信息化建设提出建议；","sequence":null}],
          timestamp: 1729675486421
        };
      }
    },
    // 团队成员
    { 
      url: "/work/tm/teammembers/getteammembers",
      method: "get",
      response: ({ body }) => {
        return {
          status: 200,
          message: "操作成功",
          data: {"stateList":[{"id":null,"optionId":9,"optionValue":"在职","optionName":"在职","reserve1":null,"reserve2":null,"displaySeq":1,"kingdeeValue":null,"title":null,"optionCode":"EmployeeStatus"},{"id":null,"optionId":9,"optionValue":"离职","optionName":"离职","reserve1":null,"reserve2":null,"displaySeq":2,"kingdeeValue":null,"title":null,"optionCode":"EmployeeStatus"}],"deptGroupTree":[{"id":9,"parentId":null,"title":"IT资讯部","field":null,"spread":null,"checked":null,"disabled":null,"iconClass":null,"href":null,"checkArr":null,"type":"部门","groupCode":null,"deptId":null,"leaderId":null,"groupRoot":null,"children":null}],"deptInfoTree":[{"id":"0","parentId":"-1","name":"所有部门","title":"所有部门","director":"","displayOrder":null,"spread":true,"open":true,"children":[{"id":"1","parentId":"0","name":"总经办","title":"总经办","director":null,"displayOrder":1},{"id":"63","parentId":"0","name":"营销处","title":"营销处","director":null,"displayOrder":2,"children":[{"id":"14","parentId":"63","name":"市场中心","title":"市场中心","director":"阿尔法特","displayOrder":1},{"id":"2","parentId":"63","name":"销售中心","title":"销售中心","director":"樊鸣宇","displayOrder":2,"children":[{"id":"22","parentId":"2","name":"日本组","title":"日本组","director":"江仕容","displayOrder":1},{"id":"21","parentId":"2","name":"欧美组","title":"欧美组","director":"江仕容","displayOrder":2}]}]},{"id":"3","parentId":"0","name":"国内销售部","title":"国内销售部","director":"来俊利","displayOrder":3},{"id":"64","parentId":"0","name":"产品处","title":"产品处","director":"朱丽","displayOrder":4,"children":[{"id":"6","parentId":"64","name":"技术研发中心","title":"技术研发中心","director":"朱丽","displayOrder":1,"children":[{"id":"34","parentId":"6","name":"风筒组","title":"风筒组","director":"陈映杰","displayOrder":1},{"id":"46","parentId":"6","name":"卷直组","title":"卷直组","director":"杨样新","displayOrder":2},{"id":"41","parentId":"6","name":"电推剪组","title":"电推剪组","director":"罗伟柏","displayOrder":3},{"id":"83","parentId":"6","name":"厨电组","title":"厨电组","director":"严定胜","displayOrder":4},{"id":"77","parentId":"6","name":"电子组","title":"电子组","director":"叶小萌","displayOrder":5},{"id":"38","parentId":"6","name":"测试组","title":"测试组","director":"李昀","displayOrder":6},{"id":"39","parentId":"6","name":"样品组","title":"样品组","director":"阳远众","displayOrder":7},{"id":"40","parentId":"6","name":"资料组","title":"资料组","director":"朱丽","displayOrder":8}]},{"id":"16","parentId":"64","name":"制造工程部","title":"制造工程部","director":"方向均","displayOrder":2},{"id":"10","parentId":"64","name":"采购部","title":"采购部","director":"白飞雄","displayOrder":3},{"id":"4","parentId":"64","name":"制造中心","title":"制造中心","director":"赵永松","displayOrder":4,"children":[{"id":"121","parentId":"4","name":"前加工部","title":"前加工部","director":"赵永松","displayOrder":1},{"id":"15","parentId":"4","name":"制造一部","title":"制造一部","director":"赵永松","displayOrder":2},{"id":"81","parentId":"4","name":"制造二部","title":"制造二部","director":"赵永松","displayOrder":3}]},{"id":"82","parentId":"64","name":"计划部","title":"计划部","director":"简凯辉","displayOrder":5,"children":[{"id":"122","parentId":"82","name":"计划组","title":"计划组","director":"简凯辉","displayOrder":1},{"id":"11","parentId":"82","name":"仓储组","title":"仓储组","director":"简凯辉","displayOrder":2}]}]},{"id":"67","parentId":"0","name":"品质中心","title":"品质中心","director":"朱丽","displayOrder":5,"children":[{"id":"7","parentId":"67","name":"品质管理部","title":"品质管理部","director":"李现伟","displayOrder":1},{"id":"120","parentId":"67","name":"品质工程部","title":"品质工程部","director":"李现伟","displayOrder":2},{"id":"23","parentId":"67","name":"体系认证部","title":"体系认证部","director":"邓常兰","displayOrder":3}]},{"id":"128","parentId":"0","name":"财务中心","title":"财务中心","director":"曾玉霞","displayOrder":6,"children":[{"id":"8","parentId":"128","name":"财务部","title":"财务部","director":"曾玉霞","displayOrder":1},{"id":"69","parentId":"128","name":"经管部","title":"经管部","director":"郑锦","displayOrder":2}]},{"id":"70","parentId":"0","name":"人力行政部","title":"人力行政部","director":"来俊利","displayOrder":7,"children":[{"id":"118","parentId":"70","name":"人事组","title":"人事组","director":"来俊利","displayOrder":1},{"id":"119","parentId":"70","name":"行政组","title":"行政组","director":"雷阳娟","displayOrder":2}]},{"id":"9","parentId":"0","name":"IT资讯部","title":"IT资讯部","director":"原侃","displayOrder":8}]}]},
          timestamp: 1729675502785
        };
      }
    },
    // 审批代理人
    { 
      url: "/work/tm/approvalagent/selectapprovalagentdate",
      method: "post",
      response: ({ body }) => {
        return {
          status: 200,
          message: "操作成功",
          data: [{"id":null,"deptId":null,"userId":null,"billId":10007,"modifyDate":null,"userName":null,"wx_openid":null,"userCode":null,"flowName":"物料审批"},{"id":null,"deptId":null,"userId":null,"billId":10013,"modifyDate":null,"userName":null,"wx_openid":null,"userCode":null,"flowName":"客户投诉审批流"},{"id":null,"deptId":null,"userId":null,"billId":10029,"modifyDate":null,"userName":null,"wx_openid":null,"userCode":null,"flowName":"供应商回签审批"},{"id":null,"deptId":null,"userId":null,"billId":10031,"modifyDate":null,"userName":null,"wx_openid":null,"userCode":null,"flowName":"产品开发申请审批流"},{"id":null,"deptId":null,"userId":null,"billId":10039,"modifyDate":null,"userName":null,"wx_openid":null,"userCode":null,"flowName":"测试报告审批流程"},{"id":null,"deptId":null,"userId":null,"billId":10043,"modifyDate":null,"userName":null,"wx_openid":null,"userCode":null,"flowName":"访客接待审批流程"},{"id":null,"deptId":null,"userId":null,"billId":10046,"modifyDate":null,"userName":null,"wx_openid":null,"userCode":null,"flowName":"供应商对账单单据流程"},{"id":null,"deptId":null,"userId":null,"billId":10047,"modifyDate":null,"userName":null,"wx_openid":null,"userCode":null,"flowName":"对账单发票审批流程"},{"id":null,"deptId":null,"userId":null,"billId":10003,"modifyDate":null,"userName":null,"wx_openid":null,"userCode":null,"flowName":"我的工单审批流程"},{"id":null,"deptId":null,"userId":null,"billId":10001,"modifyDate":null,"userName":null,"wx_openid":null,"userCode":null,"flowName":"请假单审批流"},{"id":null,"deptId":null,"userId":null,"billId":10038,"modifyDate":null,"userName":null,"wx_openid":null,"userCode":null,"flowName":"外出申请单审批流程"},{"id":null,"deptId":null,"userId":null,"billId":10052,"modifyDate":null,"userName":null,"wx_openid":null,"userCode":null,"flowName":"报价申请审批流程"},{"id":null,"deptId":null,"userId":null,"billId":10053,"modifyDate":null,"userName":null,"wx_openid":null,"userCode":null,"flowName":"作业指导书审批流"},{"id":null,"deptId":null,"userId":null,"billId":10002,"modifyDate":null,"userName":null,"wx_openid":null,"userCode":null,"flowName":"加班单审批流"},{"id":null,"deptId":null,"userId":null,"billId":10012,"modifyDate":null,"userName":null,"wx_openid":null,"userCode":null,"flowName":"DR0开发申请流程"},{"id":null,"deptId":null,"userId":null,"billId":10061,"modifyDate":null,"userName":null,"wx_openid":null,"userCode":null,"flowName":"离职申请审批流"}],
          timestamp: 1729675524479
        };
      }
    },
    // 信息中心
    { 
      url: "/work/wb/infocenter/gettasksdatabybillno",
      method: "post",
      response: ({ body }) => {
        return {
          status: 200,
          message: "操作成功",
          data: {"nodes":[{"id":"startEvent1","type":"bpmn:startEvent","x":-28,"y":292,"text":"开始","isSequential":null,"isActive":false,"properties":{"isPass":true,"isSequential":null,"personList":null}},{"id":"dept","type":"bpmn:userTask","x":60,"y":270,"text":"部门递归审批\r原侃","isSequential":true,"isActive":true,"properties":{"isPass":false,"isSequential":true,"personList":[{"userCode":"485","userName":"原侃","isPass":false,"status":null,"deleteSeason":null,"endTime":null,"taskId":null,"nodeId":"dept","nodeType":null}]}},{"id":"HumanResouce","type":"bpmn:userTask","x":220,"y":270,"text":"人力资源部审批\r郑小轩","isSequential":true,"isActive":false,"properties":{"isPass":false,"isSequential":true,"personList":[{"userCode":"777","userName":"郑小轩","isPass":false,"status":null,"deleteSeason":null,"endTime":null,"taskId":null,"nodeId":"HumanResouce","nodeType":null}]}},{"id":"GeneralManager","type":"bpmn:userTask","x":380,"y":270,"text":"总经理审批\r冯瑞聪","isSequential":true,"isActive":false,"properties":{"isPass":false,"isSequential":true,"personList":[{"userCode":"001","userName":"冯瑞聪","isPass":false,"status":null,"deleteSeason":null,"endTime":null,"taskId":null,"nodeId":"GeneralManager","nodeType":null}]}},{"id":"Event_1694gir","type":"bpmn:endEvent","x":542,"y":292,"text":"结束","isSequential":null,"isActive":false,"properties":{"isPass":false,"isSequential":null,"personList":null}}],"edges":[{"id":"Flow_0lmt9mn","sourceNodeId":"startEvent1","targetNodeId":"dept","type":"bpmn:customFlowLine","text":null,"properties":{"isPass":true}},{"id":"Flow_0wrdmim","sourceNodeId":"dept","targetNodeId":"HumanResouce","type":"bpmn:customFlowLine","text":null,"properties":{"isPass":false}},{"id":"Flow_071vkgg","sourceNodeId":"HumanResouce","targetNodeId":"GeneralManager","type":"bpmn:customFlowLine","text":null,"properties":{"isPass":false}},{"id":"Flow_0x5urla","sourceNodeId":"GeneralManager","targetNodeId":"Event_1694gir","type":"bpmn:customFlowLine","text":null,"properties":{"isPass":false}}]},
          timestamp: 1729750496976
        };
      }
    },
    // 信息中心
    { 
      url: "/work/wb/infocenter/getbacknodes",
      method: "post",
      response: ({ body }) => {
        return {
          status: 200,
          message: "操作成功",
          data: [{"activeId":"startEvent1","activeName":"发起人","assignee":null}],
          timestamp: 1729750491294
        };
      }
    },
    // 信息中心
    { 
      url: "/work/wb/infocenter/getfinishhisactinstancebyprocessinstanceid",
      method: "post",
      response: ({ body }) => {
        return {
          status: 200,
          message: "操作成功",
          data: [{"executionId":"2025013","activityId":"startEvent1","taskId":null,"activityName":"流程开始","assignee":"李秀海","startTime":"2024-10-22 14:45:16","endTime":"2024-10-22 14:45:16","handleComment":"","deleteReason":null,"duration":"","billNo":null,"flowName":null,"processDefId":"StaffResign:1:2020004","processInstId":"2025001","formUrl":null,"projectId":null,"processStatus":null,"statusColor":null,"billId":null}],
          timestamp: 1729750490339
        };
      }
    },
    // 信息中心
    { 
      url: "/work/wb/infocenter/getidbybillno",
      method: "get",
      response: ({ body }) => {
        return {
          status: 200,
          message: "操作成功",
          data: "fdec7bc4ba159541c57e2e66b37496db",
          timestamp: 1729750489835
        };
      }
    }] as MockMethod[];
