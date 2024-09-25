/* eslint-disable prefer-rest-params */

import mx from "../../utils/loadMxGraph";

const { mxConnectionHandler, mxImage, mxGraph, mxVertexHandler } = mx;

mxConnectionHandler.prototype.connectImage = new mxImage("images/connector.gif", 16, 16);

mxVertexHandler.prototype.rotationEnabled = true;

const initMain = (container) => {
  // 创建画布
  const graph = new mxGraph(container);
  const parent = graph.getDefaultParent();
  // 开始更新画布
  graph.getModel().beginUpdate();
  try {
    // 插入节点
    const v1 = graph.insertVertex(parent, null, "圆角矩形", 20, 20, 80, 30, "rounded=1");
    const v2 = graph.insertVertex(parent, null, "直角矩形", 110, 20, 80, 30);
    const v3 = graph.insertVertex(parent, null, "头像", 220, 20, 40, 40, "shape=actor;");
    const v4 = graph.insertVertex(parent, null, "云朵", 280, 20, 40, 40, "shape=cloud");
    const v5 = graph.insertVertex(parent, null, "圆柱", 330, 20, 40, 40, "shape=cylinder");
    const v6 = graph.insertVertex(parent, null, "圆", 390, 20, 40, 40, "shape=ellipse");
    const v7 = graph.insertVertex(parent, null, "圆环", 440, 20, 40, 40, "shape=doubleEllipse");
    const v8 = graph.insertVertex(parent, null, "六边形", 500, 20, 40, 40, "shape=hexagon");
    const v9 = graph.insertVertex(parent, null, "六边形", 580, 20, 40, 40, "shape=line");
    // 插入连线
    // graph.insertEdge(parent, null, "", v1, v2);
  } finally {
    // 画布更新结束
    graph.getModel().endUpdate();
  }
};

export default initMain;
