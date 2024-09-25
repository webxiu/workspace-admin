import { type VNode, Ref } from "vue";
import { isFunction } from "@pureadmin/utils";
import { type MessageHandler, ElMessage, ElMessageBox, MessageBoxData, ElMessageBoxOptions } from "element-plus";

type messageStyle = "el" | "antd";
type messageTypes = "info" | "success" | "warning" | "error";

interface MessageParams {
  /** 消息类型，可选 `info` 、`success` 、`warning` 、`error` ，默认 `info` */
  type?: messageTypes;
  /** 自定义图标，该属性会覆盖 `type` 的图标 */
  icon?: any;
  /** 是否将 `message` 属性作为 `HTML` 片段处理，默认 `false` */
  dangerouslyUseHTMLString?: boolean;
  /** 消息风格，可选 `el` 、`antd` ，默认 `antd` */
  customClass?: messageStyle;
  /** 显示时间，单位为毫秒。设为 `0` 则不会自动关闭，`element-plus` 默认是 `3000` ，平台改成默认 `2000` */
  duration?: number;
  /** 是否显示关闭按钮，默认值 `false` */
  showClose?: boolean;
  /** 文字是否居中，默认值 `false` */
  center?: boolean;
  /** `Message` 距离窗口顶部的偏移量，默认 `20` */
  offset?: number;
  /** 设置组件的根元素，默认 `document.body` */
  appendTo?: string | HTMLElement;
  /** 合并内容相同的消息，不支持 `VNode` 类型的消息，默认值 `false` */
  grouping?: boolean;
  /** 关闭时的回调函数, 参数为被关闭的 `message` 实例 */
  onClose?: Function | null;
}

/** 用法非常简单，参考 src/views/components/message/index.vue 文件 */

/**
 * `Message` 消息提示函数
 */
export const message = (message: string | VNode | (() => VNode), params?: MessageParams): MessageHandler => {
  if (!params) {
    return ElMessage({
      message,
      type: "success",
      customClass: "pure-message"
    });
  } else {
    const {
      icon,
      type = "success",
      dangerouslyUseHTMLString = false,
      customClass = "antd",
      duration = 3000,
      showClose = false,
      center = false,
      offset = 20,
      appendTo = document.body,
      grouping = false,
      onClose
    } = params;

    return ElMessage({
      message,
      type,
      icon,
      dangerouslyUseHTMLString,
      duration,
      showClose,
      center,
      offset,
      appendTo,
      grouping,
      // 全局搜 pure-message 即可知道该类的样式位置
      customClass: customClass === "antd" ? "pure-message" : "",
      onClose: () => (isFunction(onClose) ? onClose() : null)
    });
  }
};

/**
 * 关闭所有 `Message` 消息提示函数
 */
export const closeAllMessage = (): void => ElMessage.closeAll();

/** 提示消息框简单封装 */
export const showMessageBox = (msg: ElMessageBoxOptions["message"], options?: ElMessageBoxOptions) => {
  return new Promise<MessageBoxData>((resolve, reject) => {
    ElMessageBox.confirm(msg, "系统提示", {
      type: "warning",
      draggable: true,
      cancelButtonText: "取消",
      confirmButtonText: "确定",
      dangerouslyUseHTMLString: true,
      distinguishCancelAndClose: true,
      ...options
    })
      .then(resolve)
      .catch(reject);
  });
};

/**
 * 提交拦截函数
 * @param row 选择数据
 * @param func 执行回调
 * @param msg 提示信息(可选)
 */
export const wrapFn = (row: Ref<any | any[]>, func: Function, msg = "请选择记录") => {
  return (...arg: any) => {
    const rowData = row.value;
    if (Array.isArray(rowData)) {
      if (!rowData.length) return message(msg, { type: "warning" });
    } else {
      if (!rowData) return message(msg, { type: "warning" });
    }
    func.call(null, ...arg);
  };
};
