// 配置选项类型
interface OptionsType {
  width: number;
  height: number;
  lineWidth: number;
  lineStyle: string;
  fillStyle: string;
  lineCap: CanvasLineCap;
  brushSize: number;
}

// 路径类型
interface PathType {
  lineWidth: number;
  lineStyle: string;
  move: number[];
  eraseMode: boolean;
  line: {
    x: number;
    y: number;
    lineWidth: number;
    lineStyle: string;
    eraseMode: boolean;
  }[];
}

// 默认配置
const defaultOption: OptionsType = {
  width: 0,
  height: 200,
  lineWidth: 3,
  lineStyle: "#000000",
  fillStyle: "#ffffff",
  lineCap: "round",
  brushSize: 10
};

class DrawBoard {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  signaturePaths: CanvasRenderingContext2D[] = [];
  lastX = 0;
  lastY = 0;
  isDrawing = false;
  historyList: PathType[] = [];
  recoverList: PathType[] = [];
  options: OptionsType = { ...defaultOption };
  optionsTemp: OptionsType = { ...defaultOption };
  ratio = 1;
  eraseMode: boolean = false;
  wrapDom: HTMLDivElement;

  constructor(selector, options: Partial<OptionsType> = {}) {
    this.wrapDom = document.querySelector(selector);
    if (!this.wrapDom) return;
    const { width, height } = this.wrapDom.getBoundingClientRect();
    this.updateOption(options);
    this.canvas = document.createElement("canvas");
    this.wrapDom.appendChild(this.canvas);
    this.ratio = window.devicePixelRatio;
    this.setCanvasSize({ width, height });
    this.ctx = this.canvas.getContext("2d")!;
    this.ctx.fillStyle = this.options.fillStyle;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.bindEvent(this.canvas);
  }

  bindEvent = (dom: HTMLCanvasElement) => {
    this.addEvent(dom, "mousedown", (ev: MouseEvent) => this.onTouchstart(ev));
    this.addEvent(dom, "mousemove", (ev: MouseEvent) => this.onTouchmove(ev));
    this.addEvent(dom, "mouseup", (ev: MouseEvent) => this.onTouchend(ev));
  };

  // 窗口尺寸变化
  resize = debounce(() => {
    const { width, height } = this.wrapDom.getBoundingClientRect();
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height); // 保存当前画布内容
    this.setCanvasSize({ width, height });
    this.ctx.putImageData(imageData, 0, 0); // 恢复画布内容
    this.ctx.fillStyle = this.options.fillStyle;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.onRestore();
  });

  // 设置canvas宽高
  setCanvasSize({ width, height }) {
    this.options.width = width;
    this.options.height = height;
    this.canvas.width = width * this.ratio;
    this.canvas.height = height * this.ratio;
    this.canvas.style.width = width + "px";
    this.canvas.style.height = height + "px";
  }

  // 移动端和PC端事件
  private addEvent = (el: Element, eventName, cb: Function) => {
    const isMobile = navigator.userAgent.match(/Mobile/);
    const eventObj = {
      mousedown: "touchstart",
      mousemove: "touchmove",
      mouseup: "touchend"
    };

    const fn = (ev: TouchEvent) => {
      ev.preventDefault();
      ev.stopPropagation();
      if (isMobile) cb(ev.touches[0]);
      else cb(ev);
    };

    if (isMobile) {
      el.addEventListener(eventObj[eventName], fn);
    } else {
      el.addEventListener(eventName, fn);
    }
    return () => el.removeEventListener(eventObj[eventName], fn);
  };

  private onTouchstart = (ev: MouseEvent) => {
    this.isDrawing = true;
    const rect = this.canvas.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    this.setErase(this.eraseMode);
    this.drawLine(x, y, false);
    this.recoverList = [];
    this.historyList.push({
      lineWidth: this.options.lineWidth,
      lineStyle: this.options.lineStyle,
      move: [x, y],
      line: [],
      eraseMode: this.eraseMode
    });
  };

  private onTouchmove = (ev: MouseEvent) => {
    if (this.isDrawing) {
      const rect = this.canvas.getBoundingClientRect();
      const mx = ev.clientX - rect.left;
      const my = ev.clientY - rect.top;
      this.drawLine(mx, my, true);
      this.historyList[this.historyList.length - 1].line.push({
        x: mx,
        y: my,
        lineWidth: this.options.lineWidth,
        lineStyle: this.options.lineStyle,
        eraseMode: this.eraseMode
      });
    }
  };

  private onTouchend = (ev: MouseEvent) => {
    this.isDrawing = false;
  };

  drawLine = (x: number, y: number, isMove: boolean) => {
    if (isMove) {
      this.ctx.beginPath();
      this.ctx.lineWidth = this.options.lineWidth * this.ratio;
      this.ctx.strokeStyle = this.options.lineStyle;
      this.ctx.lineCap = this.options.lineCap;
      this.ctx.lineJoin = "round";
      this.ctx.moveTo(this.lastX * this.ratio, this.lastY * this.ratio);
      this.ctx.lineTo(x * this.ratio, y * this.ratio);
      this.ctx.stroke();
      this.ctx.closePath();
    }
    this.lastX = x;
    this.lastY = y;
  };

  updateOption = (options: Partial<OptionsType>) => {
    Object.keys(options).forEach((key) => {
      if (options[key]) this.options[key] = options[key];
    });
    this.optionsTemp = { ...this.options };
    this.onSetLine();
  };

  /* 重绘所有历史记录 */
  onRestore = (type?: "revoke" | "recover" | "edit", item?: { historyList: PathType[]; fillStyle: string }) => {
    const { width, height } = this.canvas;
    const { fillStyle } = this.options;
    const oTemp = this.optionsTemp;
    if (type === "revoke") {
      const history = this.historyList.pop();
      history && this.recoverList.push(history);
    } else if (type === "recover") {
      const recover = this.recoverList.pop();
      recover && this.historyList.push(recover);
    }
    this.ctx.clearRect(0, 0, width * this.ratio, height * this.ratio);
    this.ctx.fillStyle = item?.fillStyle || fillStyle;
    this.ctx.fillRect(0, 0, width * this.ratio, height * this.ratio);

    const _historyList = item?.historyList || this.historyList;
    _historyList.forEach((m) => {
      this.ctx.beginPath();
      this.ctx.strokeStyle = m.eraseMode ? oTemp.fillStyle : m.lineStyle;
      this.ctx.lineWidth = m.lineWidth * this.ratio;
      this.setErase(m.eraseMode);
      this.ctx.moveTo(m.move[0] * this.ratio, m.move[1] * this.ratio);
      m.line.forEach((v) => {
        this.ctx.strokeStyle = v.eraseMode ? oTemp.fillStyle : v.lineStyle;
        this.ctx.lineWidth = v.lineWidth * this.ratio;
        this.ctx.lineTo(v.x * this.ratio, v.y * this.ratio);
      });
      this.ctx.stroke();
    });
  };

  onClear = () => {
    const { width, height } = this.canvas;
    this.ctx.beginPath();
    this.ctx.clearRect(0, 0, width * this.ratio, height * this.ratio);
    this.ctx.closePath();
    this.historyList = [];
    this.recoverList = [];
    this.options = { ...defaultOption };
  };

  // 设置擦除颜色
  setErase = (eraseMode) => {
    this.options.lineStyle = eraseMode ? this.options.fillStyle : this.optionsTemp.lineStyle;
  };

  // 设置线大小颜色
  onSetLine = () => {
    this.options.lineWidth = this.eraseMode ? this.options.brushSize : this.optionsTemp.lineWidth;
  };

  onEraser = () => {
    this.eraseMode = !this.eraseMode;
    this.onSetLine();
    return this.eraseMode;
  };

  onExport = (mime = "image/png") => {
    const imgData = this.canvas.toDataURL(mime);
    return { imgData, mime, fillStyle: this.options.fillStyle, historyList: [...this.historyList] };
  };

  getHistory = () => {
    return this.historyList;
  };
}

/* 防抖 */
function debounce(fn: Function, wait = 300) {
  let timeout: NodeJS.Timeout;
  return (...arg) => {
    if (timeout !== null) clearTimeout(timeout);
    timeout = setTimeout(fn.bind(null, ...arg), wait);
  };
}

export { DrawBoard, type OptionsType };
