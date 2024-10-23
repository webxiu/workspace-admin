/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-16 14:34:48
 */

import { ElMessage, ElMessageBox, FormRules, dayjs } from "element-plus";
import { Sheet2JSONOpts, read, readFile, utils } from "xlsx";
import { h, reactive, ref } from "vue";

import EditForm from "@/components/EditForm/index.vue";
import { addDialog } from "@/components/ReDialog";
import { commonBack } from "@/api/systemManage";
import { findTreeNodes } from "@/utils/tree";
import { http } from "@/utils/http";
import { message } from "@/utils/message";

/** JSON字符串转换对象 */
export function toParse(str) {
  try {
    const parsed = JSON.parse(str || "{}");
    return parsed;
  } catch (e) {
    return {};
  }
}

/** 获取数据类型 */
export function getType(data) {
  return Object.prototype.toString.call(data).slice(8, -1).toLowerCase();
}

/** 路由地址转驼峰 */
export function toCamelCase(url: string) {
  return url
    .split("/")
    .filter(Boolean)
    .map((dir) => dir.charAt(0).toUpperCase() + dir.slice(1))
    .join("");
}

/** 时间格日期 */
export function formatDate(date: string | number, fmt = "YYYY-MM-DD HH:mm:ss") {
  return date ? dayjs(date).format(fmt) : "";
}

/** 递归删除对象内的空值 */
export const delEmptyQueryNodes = (obj = {}) => {
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    value && typeof value === "object" && delEmptyQueryNodes(value);
    (value === "" || value === null || value === undefined || value.length === 0 || Object.keys(value).length === 0) && delete obj[key];
  });
  return obj;
};

/**
 * 函数防抖
 * @param fn 处理函数
 * @param wait 等待时间
 */
export const debounce = (fn: Function, wait = 300) => {
  let timeout: NodeJS.Timeout;
  return (...arg) => {
    if (timeout !== null) clearTimeout(timeout);
    timeout = setTimeout(fn.bind(null, ...arg), wait);
  };
};

/**
 * 函数节流
 * @param fn 处理函数
 * @param delay 间隔时间
 */
export const throttle = (fn: Function, delay = 300) => {
  let prev = Date.now();
  return (...args: any) => {
    const now = Date.now();
    if (now - prev >= delay) {
      fn.call(null, ...args);
      prev = Date.now();
    }
  };
};

/**
 * 请求接口导出(下载)
 * @param url 下载地址
 * @param fileName 文件名(可带后缀)
 * @param NoNeedTimeNow 是否添加时间戳
 */
export const downloadFile = (url: string, fileName: string, NoNeedTimeNow = false) => {
  // 给文件名添加时间戳, 判断文件名是否存在后缀名
  // fileName待后缀名就使用fileName后缀, 否则获取url文件后缀
  const urlSuffix = url.split(".")[1] ?? "txt";
  const names = fileName.split(".");
  const name = names[0] ?? fileName;
  const suffix = names[1] || urlSuffix;

  http
    .get<object, Blob>(url, { responseType: "blob" })
    .then((res: any) => {
      const blob = new Blob([res]);
      const fileName = `${name}${!NoNeedTimeNow ? "" : "_" + Date.now()}.${suffix}`;
      onDownload(blob, fileName);
    })
    .catch(console.error);
};

// 下载文件
export const onDownload = (blob: Blob, fileName: string) => {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(link.href);
};

/** base64转blob */
export const base64ToBlob = (data: string, mime: string) => {
  data = data.split(",")[1];
  data = window.atob(data);
  const arrs = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) {
    arrs[i] = data.charCodeAt(i);
  }
  return new Blob([arrs], { type: mime });
};

/** 文件转base64 */
export function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

// 数字保留两位小数并且加千分位
export const fixed2AndAddcomma = (num: number | string): string => {
  if (!num && num !== 0) return "";

  let formatNum = "";
  if (typeof num === "string" && /\d/.test(num)) {
    formatNum = (+num).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
  }
  formatNum = (num as number).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");

  return formatNum;
};

/** 获取浏览器参数 */
export const getUrlParameters = (url: string = location.href): any => {
  const params: any = url.match(/([^?=&]+)(=([^&]*))/g) || [];
  const res = params.reduce((a, v) => ((a[v.slice(0, v.indexOf("="))] = decodeURIComponent(v.slice(v.indexOf("=") + 1))), a), {});
  return res;
};

/** 格式化excel 读取的日期数字 */
export const getFormatDate_XLSX = (serial) => {
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);
  const fractional_day = serial - Math.floor(serial) + 0.0000001;
  let total_seconds = Math.floor(86400 * fractional_day);
  const seconds = total_seconds % 60;
  total_seconds -= seconds;
  const hours = Math.floor(total_seconds / (60 * 60));
  const minutes = Math.floor(total_seconds / 60) % 60;
  const d = new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);

  return d;
};

/** 根据身份证号码获取年龄、性别和出生日期 */
export const getIdCardInfo = (userCard, num) => {
  /** 获取出生日期 */
  if (num == 1) {
    const birth = userCard.substring(6, 10) + "-" + userCard.substring(10, 12) + "-" + userCard.substring(12, 14);
    return birth;
  }
  /** 获取性别 */
  if (num == 2) {
    if (parseInt(userCard.substr(16, 1)) % 2 == 1) {
      return "男";
    } else {
      return "女";
    }
  }
  /** 获取年龄 */
  if (num == 3) {
    const myDate = new Date();
    const month = myDate.getMonth() + 1;
    const day = myDate.getDate();
    let age = myDate.getFullYear() - userCard.substring(6, 10) - 1;
    if (userCard.substring(10, 12) < month || (userCard.substring(10, 12) == month && userCard.substring(12, 14) <= day)) {
      age++;
    }
    return age;
  }
};

/**
 * 查找树形列表某项
 * @param arr 树形列表
 * @param field 查找的字段
 * @param id 查找的值
 */
export const getTreeArrItem = <T extends Record<string, any>>(arr: T[], field: string, id: any) => {
  let result: T;
  const fn = (arr: T[], id: any) => {
    for (const item of arr) {
      if (item[field] === id) {
        result = item;
        break;
      }
      if (item.children?.length) fn(item.children, id);
    }
  };
  fn(arr, id);
  return result;
};

/**
 * 获取树形列表下的所有字段集合
 * @param treeData 树形列表
 * @param field 查找的字段
 * @param children 子列表属性
 */
export const getChildIDs = <T extends Record<string, any>, R>(arr: T[], field: string, children = "children"): R[] => {
  if (!arr?.length) return [];
  const ids: R[] = [];
  const fn = (arr: T[]) => {
    arr.forEach((item) => {
      if (item[field]) ids.push(item[field]);
      if (item[children]?.length) fn(item[children]);
    });
  };
  fn(arr);
  return ids;
};

/** 复制文本 */
export function copyText(text: string, msg?: string) {
  navigator.clipboard.writeText(text).then(
    () => message(msg || "复制成功"),
    (error: Error) => message("复制失败!" + error.message, { type: "error" })
  );
}

// 读取剪切板
export function readClipboard() {
  return new Promise<string>((resolve, reject) => {
    navigator.clipboard.readText().then(resolve, reject);
  });
}

/** 替换树形列表字段 */
export function treeArrayTraverse(tree, fieldMap) {
  function traverseField(nodes) {
    nodes.forEach((node) => {
      for (const oldField in fieldMap) {
        if (node[oldField]) {
          node[fieldMap[oldField]] = node[oldField];
          delete node[oldField];
        }
      }
      if (Array.isArray(node.children) && node.children.length > 0) {
        traverseField(node.children);
      }
    });
  }
  traverseField(tree);
  return tree;
}

/** 获取导出文件名 */
export const getFileNameOnUrlPath = (url: string) => url.split("/").at(-1);

/** 公共回退逻辑 */
export const commonBackLogic = (billNo: string, callBack: () => void, headers?) => {
  const formRef = ref();
  const backToActivityId = "startEvent1";
  const _formData = reactive({ comment: "" });
  const formRules = reactive<FormRules>({
    comment: [{ required: true, message: "备注为必填项", trigger: "submit" }]
  });

  addDialog({
    title: `单据回退【${billNo}】`,
    props: {
      formInline: _formData,
      formRules: formRules,
      formConfigs: [
        {
          label: "备注",
          colProp: { span: 24 },
          prop: "comment",
          render: ({ formModel, row }) => {
            return <el-input type="textarea" v-model={formModel[row.prop]} placeholder="请填写备注" autosize={{ minRows: 3 }} />;
          }
        }
      ]
    },
    width: "500px",
    draggable: true,
    fullscreenIcon: true,
    closeOnClickModal: true,
    contentRenderer: () => h(EditForm, { ref: formRef }),
    beforeSure: (done, { options }) => {
      const FormRef = formRef.value.getRef();

      FormRef.validate(async (valid) => {
        if (valid) {
          ElMessageBox.confirm("确认要回退吗", "系统提示", {
            type: "warning",
            draggable: true,
            cancelButtonText: "取消",
            confirmButtonText: "确定",
            dangerouslyUseHTMLString: true
          })
            .then(() => {
              commonBack({ ..._formData, backToActivityId, billNo }, headers).then((res) => {
                if (res.data) {
                  ElMessage({ message: "回退成功", type: "success" });
                  done();
                  callBack();
                }
              });
            })
            .catch(console.log);
        }
      });
    }
  });
};

/** 深度对比 */
export function deepEqual(obj1, obj2) {
  if (obj1 === obj2) return true;
  if (typeof obj1 !== "object" || obj1 === null || typeof obj2 !== "object" || obj2 === null) {
    return false;
  }
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;
  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }
  return true;
}

/**
 * 查找数据列表
 * @param arr 查找数组
 * @param keyword 查找关键字
 * @param fields 查找字段数组
 */
export const findDataList = <T extends Record<string, any>>(arr: T[], keyword: string | number, fields: string[]) => {
  const fn = (t: T) => {
    if (!keyword) return true;
    return fields.some((s) => t[s]?.includes(keyword));
  };
  return findTreeNodes(arr, fn, [], true);
};
/**
 * 读取excel文件数据
 * @param file xlsx文件
 * @param sheetConfig 配置读取起始行(配置格式: {sheet1: { header: 1, range: 5 }} sheet1的第6行作为表头，从第7行开始读取数据)
 * @returns { Promise<Record<string, any[]>> }
 */
export const readXlsx = (file: File, sheetConfig = {}) => {
  return new Promise<Record<string, any[]>>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = read(data, { type: "array" });
      const allSheetsData: Record<string, any[]> = workbook.SheetNames.reduce((current, sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
        const opts: Sheet2JSONOpts = sheetConfig[sheetName] || { header: 0, range: null };
        const jsonData = utils.sheet_to_json(worksheet, opts);
        const headers = jsonData[0] as string[]; // 表头行
        // 复杂表格数据格式不统一, 数据返回格式有差异
        if (Array.isArray(headers)) {
          const dataRows = jsonData.slice(1); // 数据行
          const formattedData = dataRows.map((row) => {
            return headers.reduce((acc, header, index) => {
              acc[header] = row[index];
              return acc;
            }, {});
          });
          current[sheetName] = formattedData;
        } else {
          current[sheetName] = jsonData;
        }
        return current;
      }, {});
      resolve(allSheetsData);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

/**
 * 在vscode中打开
 */
export const openInVScode = (vscodeMain, { path }) => {
  path = !path.includes("index") ? `${path}/index` : path;
  const openURL = vscodeMain + __ROOT__ + `/src/views${path}.vue`;
  const newWindow = window.open(openURL, "在vscode中打开", "width=50,height=50,resizable=yes");
  const timer = setTimeout(() => {
    newWindow.close();
    clearTimeout(timer);
  }, 1000);
};
