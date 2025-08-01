/** 纸张尺寸 */
var papers = ["A3", "A4", "A5", "A6", "B3", "B4", "B5"];

/** 操作按钮 */
var toolButtons = [
  ...papers.map((item) => ({ name: item, action: item })),
  { name: "widthId", action: "widthId" },
  { name: "heightId", action: "heightId" },
  { name: "自定义", action: "customSize" },
  { name: "scaleRate", action: "scaleRate" },
  { name: "旋转", action: "rotatePaper" },
  { name: "清空", action: "clearTemplate", color: "#fff", bgColor: "#d9534f" },
  { name: "重置", action: "onReset", color: "#fff", bgColor: "#d9534f" },
  { name: "预览", action: "onPreview", color: "#fff", bgColor: "#047752" },
  { name: "打印", action: "onPrint", color: "#fff", bgColor: "#3366FF" },
  { name: "PDF", action: "onExportPdf", color: "#fff", bgColor: "#3366FF" },
  { name: "网格", action: "gridLine", color: "#fff", bgColor: "#1c7793" },
  { name: "配置", action: "getJson", color: "#fff", bgColor: "#1c7793" },
  // { name: "获取所有元素", action: "getPanels" },
];

/** 拖拽元件 */
var elements = [
  {
    title: "🔠文本",
    children: [
      { title: "文本", tid: "configModule.text", icon: "glyphicon-text-width" },
      { title: "长文本", tid: "configModule.longText", icon: "glyphicon-subscript" },
      { title: "自定义文本", tid: "configModule.customText", icon: "glyphicon-text-size" },
    ],
  },
  {
    title: "🎨图片",
    children: [
      { title: "图片", tid: "configModule.image", icon: "glyphicon-picture" },
      { title: "二维码", tid: "configModule.qrcode", icon: "glyphicon-qrcode" },
      { title: "条形码", tid: "configModule.barcode", icon: "glyphicon-barcode" },
    ],
  },
  {
    title: "📅表格",
    children: [
      { title: "表格", tid: "configModule.table", icon: "glyphicon-th" },
      { title: "表格(分组)", tid: "configModule.groupTable", icon: "glyphicon-th" },
      { title: "表格(多表头)", tid: "configModule.tableMulHead", icon: "glyphicon-th" },
      { title: "表格(自定义)", tid: "configModule.tableCustom", icon: "glyphicon-th" },
    ],
  },
  {
    title: "📐辅助",
    children: [
      { title: "横线", tid: "configModule.hline", icon: "glyphicon-resize-horizontal" },
      { title: "竖线", tid: "configModule.vline", icon: "glyphicon-resize-vertical" },
      { title: "矩形", tid: "configModule.rect", icon: "glyphicon-unchecked" },
      { title: "椭圆", tid: "configModule.oval", icon: "glyphicon-record" },
    ],
  },
  {
    title: "🌳HTML",
    children: [{ title: "html字符串", tid: "configModule.html", icon: "glyphicon-menu-hamburger" }],
  },
];

/** 创建拖拽列表组件 */
function createDragElement() {
  const result = elements.map((item) => {
    return `<li>
      <span class="title">${item.title}</span>
      <ul>
        ${item.children
          .map((child) => {
            return `<li>
                    <a class="ep-draggable-item" tid="${child.tid}">
                      <span class="glyphicon ${child.icon}"></span>
                      <span class="glyphicon-class" title="${child.title}">${child.title}</span>
                    </a>
                  </li>`;
          })
          .join("")}
      </ul>
    </li>`;
  });
  return result.join("");
}

/** 创建工具按钮 */
function creatToolButton() {
  const result = toolButtons.map((item) => {
    const { action, name, color = "", bgColor = "" } = item;
    const customElement = (item) => {
      return {
        widthId: '<input id="customWidth" type="text" style="width: 45px; height: 16px; outline: none; border: 0px" placeholder="宽/mm" />',
        heightId: '<input id="customHeight" type="text" style="width: 45px; height: 16px; outline: none; border: 0px" placeholder="高/mm" />',
        scaleRate:
          '<input id="scaleEle" type="text" style="width: 40px;height: 16px;outline: none;border: 0px;user-select: none;cursor: pointer;" placeholder="100%" readonly />',
      }[item.action];
    };

    const attrs = {
      color: color,
      "background-color": bgColor,
      "border-color": bgColor,
    };
    const style = Object.entries(attrs)
      .map(([k, v]) => (v ? `${k}: ${v};` : ""))
      .join("");

    return `<li>
              <a id="${action}" 
                onclick='onToolClick(event,${JSON.stringify(item)})' 
                class="hiprint-toolbar-item" 
                data-action="${action}"
                style="${style}" >
                  ${customElement(item) || name}
              </a>
            </li>`;
  });
  return result.join("");
}

/** 获取地址参数 */
function getQuery(url) {
  const params = url.match(/([^?=&]+)(=([^&]*))/g) || [];
  const res = params.reduce(function (a, v) {
    const val = decodeURIComponent(v.slice(v.indexOf("=") + 1));
    a[v.slice(0, v.indexOf("="))] = val;
    return a;
  }, {});
  return res;
}

/**
 * 递归移除空值字段
 * @param data 要处理的数据
 * @param excludeKeys 需要排除的字段名
 */
function removeEmpty(data, excludeKeys = []) {
  function isEmpty(value) {
    if (value === null || value === undefined || value === "") return true;
    return false;
  }
  if (Array.isArray(data)) {
    return data.map((item) => removeEmpty(item, excludeKeys)).filter((item) => !isEmpty(item));
  } else if (typeof data === "object" && data !== null) {
    const result = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        if (excludeKeys.includes(key)) continue;
        const value = removeEmpty(data[key], excludeKeys);
        if (!isEmpty(value)) result[key] = value;
      }
    }
    return result;
  }
  return data;
}

/** 复制文本 */
function copyText(text, callback) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(
      () => callback(),
      (error) => callback(error)
    );
    return;
  }
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed"; // 避免滚动到底部
  textArea.style.opacity = 0; // 隐藏元素
  document.body.appendChild(textArea);

  try {
    const success = document.execCommand("copy");
    if (success) callback();
    else callback(new Error("复制失败，请手动复制"));
  } catch (err) {
    callback(err);
  } finally {
    document.body.removeChild(textArea);
  }
}

let scaleRate = 1;
let offsetX = 0,
  offsetY = 0; // 累计偏移量
let isDragging = false;
let lastX = 0,
  lastY = 0;

$(document).on("click", "#scaleEle", () => {
  scaleRate = 1;
  offsetX = 0;
  offsetY = 0;
  onUpdateScale({ x: 0, y: 0, percent: "100%", scale: 1, transition: "transform 0.3s" });
});

// 添加绑定事件,使用滚轮调整缩放比例
window.addEventListener(
  "wheel",
  (ev) => {
    if (!ev.ctrlKey && !ev.metaKey) return;
    ev.preventDefault();
    ev.stopImmediatePropagation();
    const direction = ev.deltaY > 0 ? "scaleMinus" : "scalePlus";
    setScale(direction);
  },
  { passive: false, capture: true }
);

function setScale(action) {
  if (action === "scaleMinus") scaleRate -= 0.1;
  if (action === "scalePlus") scaleRate += 0.1;
  scaleRate = Math.min(Math.max(scaleRate, 0.3), 5.0);
  const percent = (scaleRate * 100).toFixed(0) + "%";
  
  if (percent) $("#scaleEle").val(percent);
  hiprintTemplate.zoom(scaleRate, false)
}

// 设置缩放
function onUpdateScale({ x, y, percent, scale, transition = "none" }) {
  if (percent) $("#scaleEle").val(percent);
  $(".hiprint-printPaper").css({ transform: `translate(${x}px, ${y}px) scale(${scale})`, transformOrigin: "-2% -1%", transition });
}

function onMouseDown(ev) {
  if (!ev.altKey) return;
  ev.preventDefault();
  ev.stopPropagation();
  isDragging = true;
  lastX = ev.clientX;
  lastY = ev.clientY;
  document.addEventListener("mousemove", onMouseMove, true);
  document.addEventListener("mouseup", onMouseUp, true);
}

function onMouseMove(ev) {
  if (!isDragging || !ev.altKey) return;
  ev.preventDefault();
  ev.stopPropagation();
  const dx = ev.clientX - lastX;
  const dy = ev.clientY - lastY;
  lastX = ev.clientX;
  lastY = ev.clientY;
  offsetX += dx; // 累计偏移
  offsetY += dy;
  onUpdateScale({ x: offsetX, y: offsetY, scale: scaleRate });
}

function onMouseUp(ev) {
  isDragging = false;
  ev.preventDefault();
  document.removeEventListener("mousemove", onMouseMove);
  document.removeEventListener("mouseup", onMouseUp);
  ev.preventDefault();
}
document.addEventListener("mousedown", onMouseDown, true);
