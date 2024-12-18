/**
 * 定义全局变量和方法
 */

// iframe通信事件名
var GRAPH_SAVE = "save"; // 保存
var GRAPH_EXPORT = "export"; // 导出
window.GRAPH_CREATE = "create"; // 创建
window.GRAPH_BACKGROUND = "#fff"; // 图表背景色

// SVG转PNG
function svgToPng(svgStr, cb) {
  const blob = new Blob([svgStr], { type: "image/svg+xml" });
  const reader = new FileReader();
  reader.onload = (evt) => cb(evt.target.result);
  reader.onerror = (err) => cb("");
  reader.readAsDataURL(blob);
}

/**
 * 图表操作方法
 */
function Operate(fn) {
  // 接收iframe父窗口消息 创建图表
  window.addEventListener("message", function (e) {
    fn(e);
  });
}

/**
 * 发送消息给iframe父窗口
 */
Operate.prototype.sendMessage = function (eventName, { xml, svg, fileName }) {
  svgToPng(svg, (img) => {
    var sendData = { xml, svg, img, fileName };
    console.log(`事件名${eventName}:`, sendData);
    window.parent.postMessage({ eventName: eventName, data: sendData }, "*");
  });
};

/**
 * 保存图表
 */
Operate.prototype.saveGraph = function (xml, svg, fileName) {
  this.sendMessage(GRAPH_SAVE, { xml, svg, fileName });
};

/**
 * 导出图表
 */
Operate.prototype.exportGraph = function (xml, svg, fileName) {
  this.sendMessage(GRAPH_EXPORT, { xml, svg, fileName });
};

/**
 * 编辑图表
 */
Operate.prototype.editGraph = function (editor, ui) {
  console.log('111', 'editor, ui', editor, ui)
  // 初始化文件名及保存更新
  if (!editor.getFilename()) {
    editor.setFilename(window.xmlData.fileName);
    ui.saveFile(false);
  }
  var graph = editor.graph; // 图表
  var model = graph.getModel(); // 节点模型
  graph.addListener(mxEvent.CLICK, function (sender, evt) {
    var cell = evt.getProperty("cell");
    console.log('111', "点击节点_cell1:", cell);
    // console.log("sender:", sender);
    // if (!cell) return console.error("未找到具有指定 ID 的单元格: cellId")
    // cell.setValue("新内容" + Date.now());
    // cell.data = JSON.stringify({ name: "单据测试", value: 10086 });
    // graph.refresh(); // 刷新图形以显示更改
    // console.log("cell2", cell);
  });

  model.addListener("change", function (sender, evt) {
    ui.saveFile(false); // 保存图表
    console.log("图表修改:", sender, evt);
  });
};
