/*
 * @Author: lixiuhai
 * @Date: 2023-07-06 14:21:11
 * @Last Modified by: lixiuhai
 * @Last Modified time: 2023-07-22 15:54:21
 */

import "@logicflow/core/dist/style/index.css";

import { PolylineEdge, PolylineEdgeModel } from "@logicflow/core";

import { BpmnElement } from "@logicflow/extension";
import LogicFlow from "@logicflow/core";
import { ref } from "vue";

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

  class CustomPolylineModel extends PolylineEdgeModel {
    getEdgeStyle() {
      const style = super.getEdgeStyle();
      const { properties } = this;
      if (properties.isPass) {
        style.stroke = "green";
      } else {
        style.stroke = "rgb(24, 125, 255)";
      }
      return style;
    }
  }

  class CustomPolyline extends PolylineEdge {}

  const CustomFlowLine = {
    type: "bpmn:customFlowLine",
    model: CustomPolylineModel,
    view: CustomPolyline
  };

  lf.value.register(CustomFlowLine);

  return { lf };
}
