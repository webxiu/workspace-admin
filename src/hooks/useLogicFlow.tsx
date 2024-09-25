/*
 * @Author: Hailen
 * @Date: 2023-07-06 14:21:11
 * @Last Modified by: Hailen
 * @Last Modified time: 2023-11-15 10:50:36
 */

import "@logicflow/core/dist/style/index.css";

import { CircleNode, CircleNodeModel, DiamondNode, DiamondNodeModel, PolylineEdge, PolylineEdgeModel, RectNode, RectNodeModel } from "@logicflow/core";
import { nextTick, ref } from "vue";

import { BpmnElement } from "@logicflow/extension";
import LogicFlow from "@logicflow/core";

export function useLogicFlow(selector: string) {
  const lf = ref();
  LogicFlow.use(BpmnElement);
  lf.value = new LogicFlow({
    container: document.querySelector(selector),
    grid: false,
    animation: true,
    isSilentMode: true,
    baseNode: { fill: "#FFFFFF", stroke: "#000000", strokeWidth: 2 }
  });

  nextTick(() => {
    const lfGraph: HTMLDivElement = document.querySelector(".lf-graph");
    if (lfGraph) lfGraph.style.background = "transparent";
  });

  // 设置审核状态样式
  const setStyle = (instance, style) => {
    const { properties } = instance;
    const color = properties.isPass ? "#008000" : "#187dff";
    style.stroke = color;
    return style;
  };

  // 1.自定义边
  class CustomPolyline extends PolylineEdge {}
  class CustomPolylineModel extends PolylineEdgeModel {
    getEdgeStyle() {
      const style = super.getEdgeStyle();
      return setStyle(this, style);
    }
  }

  // 2.自定义圆角节点
  class CircleView extends CircleNode {}
  class CircleModel extends CircleNodeModel {
    setAttributes() {
      this.r = 18;
    }
    getNodeStyle() {
      const style = super.getNodeStyle();
      return setStyle(this, style);
    }
  }

  // 2.1自定义圆角结束节点
  class CircleEndView extends CircleNode {}
  class CircleEndModel extends CircleNodeModel {
    setAttributes() {
      this.r = 18;
    }
    getNodeStyle() {
      const style = super.getNodeStyle();
      return setStyle(this, style);
    }
  }

  // 3.自定义任务节点
  class RectView extends RectNode {}
  class CustomRectModel extends RectNodeModel {
    getNodeStyle() {
      const style = super.getNodeStyle();
      return setStyle(this, style);
    }
  }

  // 4.自定义条件判断
  class DiamondView extends DiamondNode {}
  class CustomDiamondModel extends DiamondNodeModel {
    getNodeStyle() {
      const style = super.getNodeStyle();
      return setStyle(this, style);
    }
  }

  const CustomFlowLine = { type: "bpmn:customFlowLine", model: CustomPolylineModel, view: CustomPolyline };
  const CustomStartNode = { type: "bpmn:startEvent", view: CircleView, model: CircleModel };
  const CustomEndNode = { type: "bpmn:endEvent", view: CircleEndView, model: CircleEndModel };
  const CustomTaskNode = { type: "bpmn:userTask", view: RectView, model: CustomRectModel };
  const CustomGatewayNode = { type: "bpmn:exclusiveGateway", view: DiamondView, model: CustomDiamondModel };

  lf.value.register(CustomFlowLine);
  lf.value.register(CustomStartNode);
  lf.value.register(CustomEndNode);
  lf.value.register(CustomTaskNode);
  lf.value.register(CustomGatewayNode);

  return { lf };
}
