/*
 * @Author: Hailen
 * @Date: 2023-07-06 14:57:33
 * @Last Modified by: Hailen
 * @Last Modified time: 2023-10-25 14:20:25
 */

import { RowHandleType } from "./hook";
import { ref } from "vue";

export interface TreeDataTtype {
  label: string;
  id: string;
  type?: string;
  taskState?: string;
  searchFrom?: string;
  parentId?: string;
  children?: TreeDataTtype[];
}

/** 左侧任务树列表 */
export const infoTreeData: TreeDataTtype[] = [
  {
    label: "我的单据",
    id: "1",
    type: "",
    parentId: "0",
    children: [
      { label: "我发起", id: "1.3", parentId: "1", type: "start" },
      { label: "待审批", id: "1.1", parentId: "1", type: "approve" },
      { label: "已审批", id: "1.2", parentId: "1", type: "approved" }
    ]
  },

  {
    label: "我创建的任务",
    id: "2",
    type: "normal",
    searchFrom: "2",
    parentId: "0",
    children: [
      { label: "待处理", id: "2.2", parentId: "2", type: "normal", searchFrom: "2", taskState: "2" },
      { label: "已处理", id: "2.3", parentId: "2", type: "normal", searchFrom: "2", taskState: "3" },
      { label: "已暂停", id: "2.1", parentId: "2", type: "normal", searchFrom: "2", taskState: "1" },
      { label: "已终止", id: "2.4", parentId: "2", type: "normal", searchFrom: "2", taskState: "4" }
    ]
  },

  {
    label: "我负责的任务",
    id: "3",
    searchFrom: "3",
    type: "normal",
    parentId: "0",
    children: [
      { label: "待处理", id: "3.2", parentId: "3", type: "normal", searchFrom: "3", taskState: "2" },
      { label: "已处理", id: "3.3", parentId: "3", type: "normal", searchFrom: "3", taskState: "3" },
      { label: "已暂停", id: "3.1", parentId: "3", type: "normal", searchFrom: "3", taskState: "1" },
      { label: "已终止", id: "3.4", parentId: "3", type: "normal", searchFrom: "3", taskState: "4" }
    ]
  }
];

export const getTableConfig = (taskType: string) => {
  // 我发起
  const columns1: TableColumnList[] = [
    { label: "业务单号", prop: "billNo", sortable: true, minWidth: 160 },
    { label: "流程ID", prop: "processDefId", sortable: true, minWidth: 220 },
    { label: "流程实例ID", prop: "processInstId", sortable: true },
    { label: "发起时间", prop: "startTime", sortable: true, minWidth: 160 },
    { label: "结束时间", prop: "endTime", sortable: true, minWidth: 160 }
  ];
  // 待审批
  const columns2: TableColumnList[] = [
    { label: "发起人", prop: "sendName", sortable: true },
    { label: "流程名称", prop: "flowName", sortable: true, minWidth: 160 },
    { label: "业务单号", prop: "billNo", sortable: true, minWidth: 160 },
    { label: "发起时间", prop: "sendTime", sortable: true, minWidth: 140 }
  ];
  // 已审批
  const columns3: TableColumnList[] = [
    { label: "流程名称", prop: "flowName", sortable: true, minWidth: 160 },
    { label: "业务单号", prop: "billNo", sortable: true, minWidth: 160 },
    { label: "任务名称", prop: "activityName", sortable: true },
    { label: "处理人", prop: "assignee", sortable: true },
    { label: "审批时间", prop: "endTime", sortable: true, minWidth: 160 },
    { label: "耗时", prop: "duration", sortable: true },
    { label: "处理意见", prop: "handleComment", sortable: true },
    { label: "删除原因", prop: "deleteReason", sortable: true },
    { label: "流程节点ID", prop: "activityId", sortable: true },
    { label: "流程实例ID", prop: "processInstId", sortable: true },
    { label: "实例执行ID", prop: "executionId", sortable: true },
    { label: "任务ID", prop: "taskId", sortable: true }
  ];
  // 我创建和我负责的任务
  const columns4: TableColumnList[] = [
    { label: "状态", prop: "stateName", sortable: true },
    { label: "项目编号", prop: "projectNo", sortable: true },
    { label: "任务编号", prop: "taskNo", sortable: true },
    { label: "项目名称", prop: "projectName", sortable: true },
    { label: "任务名称", prop: "taskName", sortable: true },
    { label: "完成目标", prop: "completeTarget", sortable: true },
    { label: "计划完成时间", prop: "planCompleteDate", sortable: true, minWidth: 160 },
    { label: "处理时间", prop: "taskCompleteDate", sortable: true, minWidth: 160 },
    { label: "处理人", prop: "completeManName", sortable: true },
    { label: "优先级", prop: "priority", sortable: true },
    { label: "备注", prop: "taskRemark", sortable: true },
    { label: "创建时间", prop: "createDate", sortable: true },
    { label: "创建人", prop: "createUserName", sortable: true }
  ];
  const colomnState = {
    start: columns1,
    approve: columns2,
    approved: columns3,
    normal: columns4
  };
  return colomnState[taskType];
};
