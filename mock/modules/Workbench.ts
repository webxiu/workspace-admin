
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
          data: {"records":[{"sendKey":"661","sendName":"谢健","flowName":"","billNo":"MO20240929005_7c7fe80702d4437eba26bb2787c32ece","sendTime":"2024-10-09 10:34:03","processDefId":"DieSinkingApply:1:1972516","processInstId":"1972537","taskId":"1972561","formUrl":null,"projectId":"","billId":null}],"total":1,"size":30,"current":1,"orders":[],"optimizeCountSql":true,"searchCount":true,"countId":null,"maxLimit":null,"pages":1},
          timestamp: 1734078916322
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
    }] as MockMethod[];
