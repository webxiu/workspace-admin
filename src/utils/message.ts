import { type VNode, Ref } from "vue";
import { type MessageHandler, ElMessage, MessageOptions, ElMessageBox, MessageBoxData, ElMessageBoxOptions } from "element-plus";

type MessageType = string | VNode | (() => VNode);
type MessageFunction = (message: MessageType, params?: Omit<MessageOptions, "message">) => MessageHandler;

/**
 * `Message` 创建函数
 */
export const customMessage = (type: MessageOptions["type"]): MessageFunction => {
  return (message, params) => {
    return ElMessage({ message, type, offset: 20, duration: 3000, customClass: "pure-message", ...params });
  };
};

/**
 * 不同状态的 `Message` 消息提示函数
 */
export const message: {
  [key in MessageOptions["type"]]: MessageFunction;
} = {
  success: customMessage("success"),
  error: customMessage("error"),
  warning: customMessage("warning"),
  info: customMessage("info")
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
      if (!rowData.length) return message.warning(msg);
    } else {
      if (!rowData) return message.warning(msg);
    }
    func.call(null, ...arg);
  };
};
