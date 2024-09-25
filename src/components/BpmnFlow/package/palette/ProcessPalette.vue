<template>
  <div class="my-process-palette">
    <p>设计面板</p>
    <el-collapse>
      <el-collapse-item v-for="item in taskList" :title="item.title" :name="item.type" :key="item.type">
        <div
          :key="cell.type"
          class="custom-button"
          v-for="cell in item.children"
          @click="onClickPalette($event, cell, item.type)"
          @mousedown="onClickPalette($event, cell, item.type)"
        >
          {{ cell.title }}
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script lang="ts" setup>
import { assign } from "min-dash";

interface TaskItem {
  type: string;
  title: string;
  children?: TaskItem[];
}

// 面板列表
const taskList: TaskItem[] = [
  {
    title: "任务",
    type: "1",
    children: [
      { type: "Task", title: "任务" },
      { type: "UserTask", title: "用户任务" },
      { type: "SendTask", title: "发送任务" },
      { type: "ReceiveTask", title: "接收任务" },
      { type: "ScriptTask", title: "脚本任务" },
      { type: "ServiceTask", title: "服务任务" }
    ]
  },
  { title: "网关", type: "2", children: [{ type: "Gateway", title: "网关" }] },
  { title: "开始", type: "3", children: [{ type: "StartEvent", title: "开始" }] },
  { title: "结束", type: "4", children: [{ type: "EndEvent", title: "结束" }] },
  {
    title: "工具",
    type: "5",
    children: [
      { type: "handTool", title: "手型工具" },
      { type: "lassoTool", title: "框选工具" },
      { type: "connectTool", title: "连线工具" }
    ]
  }
];

const onClickPalette = (event: MouseEvent, cell: TaskItem, collapseName: string) => {
  if (collapseName === "5") {
    startTool(event, cell.type);
  } else {
    createElement(event, cell.type);
  }
};

// 任务元素
const createElement = (event, type, options?) => {
  const ElementFactory = window.bpmnInstances.elementFactory;
  const create = window.bpmnInstances.modeler.get("create");
  const shape = ElementFactory.createShape(assign({ type: `bpmn:${type}` }, options));
  if (options) {
    shape.businessObject.di.isExpanded = options.isExpanded;
  }
  create.start(event, shape);
};

// 工具
const startTool = (event, type) => {
  if (type === "handTool") {
    window.bpmnInstances.modeler.get("handTool").activateHand(event);
  }
  if (type === "lassoTool") {
    window.bpmnInstances.modeler.get("lassoTool").activateSelection(event);
  }
  if (type === "connectTool") {
    window.bpmnInstances.modeler.get("globalConnect").toggle(event);
  }
};
</script>

<style scoped lang="scss">
.my-process-palette {
  box-sizing: border-box;
  padding: 8px;

  .custom-button {
    box-sizing: border-box;
    padding: 4px 8px;
    margin-bottom: 8px;
    cursor: pointer;
    border: 1px solid rgb(24 144 255 / 80%);
    border-radius: 4px;

    &:first-child {
      margin-top: 8px;
    }
  }
}
</style>
