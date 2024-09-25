// 配置选项类型
interface OptionsType {
  width: number;
  height: number;
  lineWidth: number;
  lineStyle: string;
  fillStyle: string;
  lineCap: CanvasLineCap;
}

// 路径类型
interface PathType {
  lineWidth: number;
  lineStyle: string;
  move: number[];
  line: {
    x: number;
    y: number;
    lineWidth: number;
    lineStyle: string;
  }[];
}

// 默认配置
const defaultOption: OptionsType = {
  width: 0,
  height: 200,
  lineWidth: 3,
  lineStyle: "#000000",
  fillStyle: "#ffffff",
  lineCap: "round"
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
  ratio = 1;

  constructor(selector, options: Partial<OptionsType>) {
    this.updateOption(options);
    const wrapDom: HTMLDivElement = document.querySelector(selector);
    // const { width, height } = wrapDom.getBoundingClientRect();
    const { width, height } = this.getContentDimensions(wrapDom);
    this.canvas = document.createElement("canvas");
    wrapDom.appendChild(this.canvas);
    this.ratio = window.devicePixelRatio;

    this.ctx = this.canvas.getContext("2d")!;
    this.canvas.width = width * this.ratio;
    this.canvas.height = this.options.height * this.ratio;
    // this.canvas.style.width = width + "px";
    // this.canvas.style.height = this.options.height + "px";
    this.ctx.fillStyle = this.options.fillStyle;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.create(this.canvas);
    console.log("this.options", this.options);
  }

  getContentDimensions = (element: HTMLElement) => {
    const style = window.getComputedStyle(element);
    const paddingTop = parseInt(style.paddingTop, 10);
    const paddingRight = parseInt(style.paddingRight, 10);
    const paddingBottom = parseInt(style.paddingBottom, 10);
    const paddingLeft = parseInt(style.paddingLeft, 10);
    const borderTop = parseInt(style.borderTopWidth, 10);
    const borderRight = parseInt(style.borderRightWidth, 10);
    const borderBottom = parseInt(style.borderBottomWidth, 10);
    const borderLeft = parseInt(style.borderLeftWidth, 10);

    const contentWidth = element.offsetWidth - (paddingLeft + paddingRight + borderLeft + borderRight);
    const contentHeight = element.offsetHeight - (paddingTop + paddingBottom + borderTop + borderBottom);
    return {
      width: contentWidth,
      height: contentHeight
    };
  };

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

  create = (dom: HTMLCanvasElement) => {
    this.addEvent(dom, "mousedown", (ev: MouseEvent) => this.onTouchstart(ev));
    this.addEvent(dom, "mousemove", (ev: MouseEvent) => this.onTouchmove(ev));
    this.addEvent(dom, "mouseup", (ev: MouseEvent) => this.onTouchend(ev));
  };

  private onTouchstart = (ev: MouseEvent) => {
    this.isDrawing = true;
    const rect = this.canvas.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    this.drawLine(x, y, false);
    this.recoverList = [];
    this.historyList.push({
      lineWidth: this.options.lineWidth,
      lineStyle: this.options.lineStyle,
      move: [x, y],
      line: []
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
        lineStyle: this.options.lineStyle
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
  };

  onRestore = (type?: "revoke" | "recover") => {
    const { width, height } = this.canvas;
    const { fillStyle } = this.options;
    if (type === "revoke") {
      const history = this.historyList.pop();
      history && this.recoverList.push(history);
    } else if (type === "recover") {
      const recover = this.recoverList.pop();
      recover && this.historyList.push(recover);
    }
    this.ctx.clearRect(0, 0, width * this.ratio, height * this.ratio);
    this.ctx.fillStyle = fillStyle;
    this.ctx.fillRect(0, 0, width * this.ratio, height * this.ratio);
    this.historyList.forEach((m) => {
      this.ctx.beginPath();
      this.ctx.strokeStyle = m.lineStyle;
      this.ctx.lineWidth = m.lineWidth * this.ratio;
      this.ctx.moveTo(m.move[0] * this.ratio, m.move[1] * this.ratio);
      m.line.forEach((v) => {
        this.ctx.strokeStyle = v.lineStyle;
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

  onExport = (mime = "image/png") => {
    const imgData = this.canvas.toDataURL(mime);
    return imgData;
  };

  getHistory = () => {
    return this.historyList;
  };
}

export { DrawBoard, type OptionsType };
