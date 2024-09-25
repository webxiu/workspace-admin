/* eslint-disable prefer-rest-params */

import mx from "../../utils/loadMxGraph";

const {
  mxClient,
  mxUtils,
  mxConstants,
  mxPerimeter,
  mxEditor,
  mxPoint,
  mxLayoutManager,
  mxEdgeStyle,
  mxStackLayout,
  mxSwimlaneManager,
  mxEvent,
  mxGraphModel,
  mxConnectionHandler,
  mxImage,
  mxVertexHandler
} = mx;

mxConnectionHandler.prototype.connectImage = new mxImage("images/connector.gif", 16, 16);

mxVertexHandler.prototype.rotationEnabled = true;

const initMain = (container) => {
  // Checks if browser is supported
  if (!mxClient.isBrowserSupported()) {
    // Displays an error message if the browser is
    // not supported.
    mxUtils.error("Browser is not supported!", 200, false);
  } else {
    // Creates a wrapper editor around a new graph inside
    // the given container using an XML config for the
    // keyboard bindings
    const config = mxUtils.load("editors/config/keyhandler-commons.xml").getDocumentElement();
    const editor = new mxEditor(config);
    console.log(editor, "mx");

    editor.setGraphContainer(container);
    const graph = editor.graph;
    const model = graph.getModel();

    // Auto-resizes the container
    graph.border = 80;
    graph.getView().translate = new mxPoint(graph.border / 2, graph.border / 2);
    graph.setResizeContainer(true);
    graph.graphHandler.setRemoveCellsFromParent(false);

    // Changes the default vertex style in-place
    let style = graph.getStylesheet().getDefaultVertexStyle();

    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_SWIMLANE;
    style[mxConstants.STYLE_VERTICAL_ALIGN] = "middle";
    style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = "white";
    style[mxConstants.STYLE_FONTSIZE] = 11;
    style[mxConstants.STYLE_STARTSIZE] = 22;
    style[mxConstants.STYLE_HORIZONTAL] = 1;
    style[mxConstants.STYLE_FONTCOLOR] = "black";
    style[mxConstants.STYLE_STROKECOLOR] = "black";
    style.horizontalStack = true;
    delete style[mxConstants.STYLE_FILLCOLOR];

    style = mxUtils.clone(style);
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
    style[mxConstants.STYLE_FONTSIZE] = 12;
    style[mxConstants.STYLE_ROUNDED] = true;
    style[mxConstants.STYLE_STROKECOLOR] = "#93BEDE";

    style[mxConstants.STYLE_HORIZONTAL] = 1;
    style[mxConstants.STYLE_VERTICAL_ALIGN] = "middle";
    delete style[mxConstants.STYLE_STARTSIZE];
    style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = "none";
    style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = "none";
    // style[mxConstants.STYLE_ROTATION] = -90;
    graph.getStylesheet().putCellStyle("process", style);

    style = mxUtils.clone(style);
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_ELLIPSE;
    style[mxConstants.STYLE_PERIMETER] = mxPerimeter.EllipsePerimeter;
    delete style[mxConstants.STYLE_ROUNDED];
    graph.getStylesheet().putCellStyle("state", style);

    style = mxUtils.clone(style);
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RHOMBUS;
    style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RhombusPerimeter;
    style[mxConstants.STYLE_VERTICAL_ALIGN] = "middle";
    graph.getStylesheet().putCellStyle("condition", style);

    style = mxUtils.clone(style);
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_DOUBLE_ELLIPSE;
    style[mxConstants.STYLE_PERIMETER] = mxPerimeter.EllipsePerimeter;
    style[mxConstants.STYLE_SPACING_TOP] = 28;
    style[mxConstants.STYLE_FONTSIZE] = 14;
    style[mxConstants.STYLE_FONTSTYLE] = 1;
    delete style[mxConstants.STYLE_SPACING_RIGHT];
    graph.getStylesheet().putCellStyle("end", style);

    style = graph.getStylesheet().getDefaultEdgeStyle();
    style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
    style[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_BLOCK;
    style[mxConstants.STYLE_ROUNDED] = true;
    style[mxConstants.STYLE_FONTCOLOR] = "black";
    style[mxConstants.STYLE_STROKECOLOR] = "#93BEDE";
    style[mxConstants.STYLE_STROKEWIDTH] = "2";

    style = mxUtils.clone(style);
    style[mxConstants.STYLE_DASHED] = true;
    style[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_OPEN;
    style[mxConstants.STYLE_STARTARROW] = mxConstants.ARROW_OVAL;
    graph.getStylesheet().putCellStyle("crossover", style);

    // Installs double click on middle control point and
    // changes style of edges between empty and this value
    graph.alternateEdgeStyle = "elbow=vertical";

    // Adds automatic layout and letious switches if the
    // graph is enabled
    if (graph.isEnabled()) {
      // Allows new connections but no dangling edges
      graph.setConnectable(true);
      graph.setAllowDanglingEdges(false);

      // End-states are no valid sources
      const previousIsValidSource = graph.isValidSource;

      graph.isValidSource = function (cell) {
        if (previousIsValidSource.apply(this, arguments)) {
          const style = this.getModel().getStyle(cell);

          return style == null || !(style == "end" || style.indexOf("end") == 0);
        }

        return false;
      };

      // Start-states are no valid targets, we do not
      // perform a call to the superclass function because
      // this would call isValidSource
      // Note: All states are start states in
      // the example below, so we use the state
      // style below
      graph.isValidTarget = function (cell) {
        const style = this.getModel().getStyle(cell);

        return !this.getModel().isEdge(cell) && !this.isSwimlane(cell) && (style == null || !(style == "state" || style.indexOf("state") == 0));
      };

      // Allows dropping cells into new lanes and
      // lanes into new pools, but disallows dropping
      // cells on edges to split edges
      graph.setDropEnabled(true);
      graph.setSplitEnabled(false);

      // Returns true for valid drop operations
      graph.isValidDropTarget = function (target, cells, evt) {
        if (this.isSplitEnabled() && this.isSplitTarget(target, cells, evt)) {
          return true;
        }

        const model = this.getModel();
        let lane = false;
        let pool = false;
        let cell = false;

        // Checks if any lanes or pools are selected
        for (let i = 0; i < cells.length; i++) {
          const tmp = model.getParent(cells[i]);
          lane = lane || this.isPool(tmp);
          pool = pool || this.isPool(cells[i]);

          cell = cell || !(lane || pool);
        }

        return !pool && cell != lane && ((lane && this.isPool(target)) || (cell && this.isPool(model.getParent(target))));
      };

      // Adds new method for identifying a pool
      graph.isPool = function (cell) {
        const model = this.getModel();
        const parent = model.getParent(cell);

        return parent != null && model.getParent(parent) == model.getRoot();
      };

      // Changes swimlane orientation while collapsed
      graph.model.getStyle = function (cell) {
        let style = mxGraphModel.prototype.getStyle.apply(this, arguments);

        if (graph.isCellCollapsed(cell)) {
          if (style != null) {
            style += ";";
          } else {
            style = "";
          }

          style += "horizontal=1;align=left;spacingLeft=14;";
        }

        return style;
      };

      // Keeps widths on collapse/expand
      const foldingHandler = function (sender, evt) {
        const cells = evt.getProperty("cells");

        for (let i = 0; i < cells.length; i++) {
          const geo = graph.model.getGeometry(cells[i]);

          if (geo.alternateBounds != null) {
            geo.width = geo.alternateBounds.width;
          }
        }
      };

      graph.addListener(mxEvent.FOLD_CELLS, foldingHandler);
    }

    // Applies size changes to siblings and parents
    new mxSwimlaneManager(graph);

    // Creates a stack depending on the orientation of the swimlane
    const layout = new mxStackLayout(graph, false);

    // Makes sure all children fit into the parent swimlane
    layout.resizeParent = true;

    // Applies the size to children if parent size changes
    layout.fill = true;
    layout.horizontal = true;
    // layout.border = 10;

    // Only update the size of swimlanes
    layout.isVertexIgnored = function (vertex) {
      return !graph.isSwimlane(vertex);
    };

    // Keeps the lanes and pools stacked
    const layoutMgr = new mxLayoutManager(graph);

    layoutMgr.getLayout = function (cell) {
      if (!model.isEdge(cell) && graph.getModel().getChildCount(cell) > 0 && (model.getParent(cell) == model.getRoot() || graph.isPool(cell))) {
        layout.fill = graph.isPool(cell);

        return layout;
      }

      return null;
    };

    // Gets the default parent for inserting new cells. This
    // is normally the first child of the root (ie. layer 0).
    const parent = graph.getDefaultParent();
    parent.style = "horizontal=1;horizontalStack=1";

    // Adds cells to the model in a single step
    model.beginUpdate();
    try {
      const pool01 = graph.insertVertex(parent, null, "输入", 0, 0, 200, 0);
      pool01.setConnectable(false);
      const lane1a0 = graph.insertVertex(pool01, null, "职责及流程说明", 0, 0, 200, 800);
      lane1a0.setConnectable(false);
      const pool2 = graph.insertVertex(parent, null, "执行部门", 0, 0, 0, 800, "horizontal=1;");
      pool2.setConnectable(false);
      const lane2b = graph.insertVertex(pool2, null, "供应商", 0, 0, 100, 110, "horizontal=1");
      lane2b.setConnectable(false);
      const lane2a = graph.insertVertex(pool2, null, "物控部", 0, 0, 120, 110, "horizontal=1");
      lane2a.setConnectable(false);
      const lane2c = graph.insertVertex(pool2, null, "品质部", 0, 0, 400, 300, "horizontal=1");
      const lane2d = graph.insertVertex(pool2, null, "采购部主导：\n研发/物控/生产/工程/品质", 0, 0, 200, 160, "horizontal=1");
      lane2c.setConnectable(false);
      lane2d.setConnectable(false);
      const pool1 = graph.insertVertex(parent, null, "输出", 0, 0, 200, 800);
      pool1.setConnectable(false);
      const lane1a = graph.insertVertex(pool1, null, "依据文件 & 表格表单", 0, 0, 200, 800);
      lane1a.setConnectable(false);

      const start2 = graph.insertVertex(lane2b, null, "来料", 20, 40, 60, 60, "process;fillColor=#C5E0B5;fontSize=12;fontBold=1");

      // 输入职责流程说明
      const lane1a1 = graph.insertVertex(lane1a0, null, "供应商来料: 合格供应商", 10, 60, 140, 20, "process;rounded=0;fillColor=#07c160;fontColor=#fff;");
      const lane1a2 = graph.insertVertex(
        lane1a0,
        null,
        "收料送检:\n由仓库负责收料, 按定位定点\n摆放到收料区,并开出《送检\n单》交IQC检验",
        10,
        110,
        160,
        70,
        "process;rounded=0;fillColor=#07c160;fontColor=#fff;align=left"
      );
      const lane1a3 = graph.insertVertex(
        lane1a0,
        null,
        "来料检验:\nIQC根据《送检单》，对材料\n外观，结构，性能进行检验",
        10,
        200,
        160,
        70,
        "process;rounded=0;fillColor=#07c160;fontColor=#fff;align=left"
      );
      const lane1a4 = graph.insertVertex(
        lane1a0,
        null,
        "来料异常:\n1）对来料检验批量不合格的，\n有IQC直接判定退货\n2）对来料检验不合格的，可\n根据生产需求评估，但不影响\n功能安全的情况下，由采购部\n发起MRB评审流程，评审不通\n过直接判定退货；通过评审的\n由IQC进行综合结论并贴特采\n标签入库",
        10,
        310,
        160,
        150,
        "process;rounded=0;fillColor=#07c160;fontColor=#fff;align=left"
      );
      const lane1a5 = graph.insertVertex(
        lane1a0,
        null,
        "检验判定:\nIQC根据来料检验判定的结果，\n对物料进行标识 & 盖章",
        10,
        495,
        160,
        70,
        "process;rounded=0;fillColor=#07c160;fontColor=#fff;align=left"
      );
      const lane1a6 = graph.insertVertex(
        lane1a0,
        null,
        "来料异常处理:\n1）经IQC检验不合格或MRB评审不合格，由\n品质部开出《供应商纠正预防报告》，要求\n供应商回复改善，并跟进闭环；\n2）仓库依据《IQC来料检验报告》判定结果，\n开出《不良材料报告单》进行退货",
        10,
        600,
        240,
        90,
        "process;rounded=0;fillColor=#07c160;fontColor=#fff;align=left"
      );
      const lane1a7 = graph.insertVertex(lane1a0, null, "检验合格: 由仓库安排入库", 10, 720, 140, 20, "process;rounded=0;fillColor=#07c160;fontColor=#fff;");
      // 输入流程结束

      // 输出流程开始
      const lane1a8 = graph.insertVertex(
        pool1,
        null,
        "供应商: 送货单/装箱单/出货检验\n报告\n采购部：采购订单/样品承认书/\nRoHS检测报告",
        10,
        60,
        180,
        60,
        "process;rounded=0;fillColor=#07c160;fontColor=#fff;align=left"
      );
      const lane1a9 = graph.insertVertex(pool1, null, "收料送检单", 10, 161, 180, 20, "process;rounded=0;fillColor=#07c160;fontColor=#fff;align=left");
      const lane1a10 = graph.insertVertex(
        pool1,
        null,
        "来料检验程序\nIQC来料检验标准\nRoHS测试抽样规范\n供应商RoHS检测报告\n物料承认流程\n样品承认书\nAQL抽样水准\nIQC来料检验报告",
        10,
        200,
        180,
        120,
        "process;rounded=0;fillColor=#07c160;fontColor=#fff;align=left"
      );
      const lane1a11 = graph.insertVertex(
        pool1,
        null,
        "IQC来料检验报告\n（MRB评审意见）\n特采管理流程\n特采标签",
        10,
        370,
        180,
        60,
        "process;rounded=0;fillColor=#07c160;fontColor=#fff;align=left"
      );
      const lane1a12 = graph.insertVertex(
        pool1,
        null,
        "品质部：\n合格标签\n不合格标签\n特采标签\n盖章（依据状态）",
        10,
        500,
        180,
        80,
        "process;rounded=0;fillColor=#07c160;fontColor=#fff;align=left"
      );
      const lane1a13 = graph.insertVertex(
        pool1,
        null,
        "品质部：\nIQC来料检验报告/供应商纠正预\n防改善报告\n物控部：不良材料报告单",
        10,
        630,
        180,
        70,
        "process;rounded=0;fillColor=#07c160;fontColor=#fff;align=left"
      );
      const lane1a14 = graph.insertVertex(
        pool1,
        null,
        "依据品质部结论：\n收料送检单\nIQC来料检验报告\n仓库管理程序",
        10,
        720,
        180,
        70,
        "process;rounded=0;fillColor=#07c160;fontColor=#fff;align=left"
      );
      // 输出流程结束

      const step2 = graph.insertVertex(lane2b, null, "退货", 20, 620, 60, 60, "process;fillColor=#C5E0B5;fontColor=red;");
      const step4 = graph.insertVertex(lane2a, null, "收料/送检", 30, 120, 60, 60, "process;fillColor=#F8CBAE;");
      const step44 = graph.insertVertex(lane2a, null, "入库", 30, 700, 60, 60, "process;fillColor=#F8CBAC");
      const step444 = graph.insertVertex(lane2c, null, "IQ检验&性能测试", 20, 200, 140, 70, "condition;fillColor=#FFE69B");
      const step445 = graph.insertVertex(lane2c, null, "IQC标识盖章", 40, 500, 100, 60, "process;fillColor=#FFE69B");
      const step447 = graph.insertVertex(lane2c, null, "发出SCAR", 180, 620, 100, 60, "process;fillColor=#FFE69B;fontColor=red;");
      const step446 = graph.insertVertex(lane2d, null, "召开MRB评审", 50, 350, 120, 60, "condition;fillColor=#DBE4F5;fontColor=red;");

      graph.insertEdge(lane2a, null, null, step4, step444);
      graph.insertEdge(lane2a, null, null, step447, step2);
      graph.insertEdge(lane2a, null, null, step2, start2);
      graph.insertEdge(lane2a, null, null, step445, step44);
      graph.insertEdge(lane2a, null, "OK", step444, step445, "verticalAlign=bottom;fontColor=blue;fontSize=14");
      graph.insertEdge(lane2a, null, "NG", step444, step446, "verticalAlign=bottom;fontColor=red;fontSize=14");
      graph.insertEdge(lane2d, null, "NG", step446, step447, "verticalAlign=bottom;fontColor=red;fontSize=14");
      graph.insertEdge(lane2d, null, "特采（贴特采标签）", step446, step445, "verticalAlign=bottom;fontColor=blue;fontSize=14");
      graph.insertEdge(parent, null, null, start2, step4);
    } finally {
      // Updates the display
      model.endUpdate();
    }
  }
};

export default initMain;
