/**
 * @description 根据文件的bit计算大小
 * @param bit 树
 * @returns 显示的文件大小
 */

export const getSizeByBit = (bit) => {
  let res = "0",
    cv = 0;
  if (bit > 1024) {
    cv = bit / 1024;
    res = cv.toFixed(1) + " KB";
    if (cv > 1024) {
      cv = cv / 1024;
      res = cv.toFixed(1) + " MB";
      if (cv > 1024) {
        cv = cv / 1024;
        res = cv.toFixed(1) + " GB";
      }
    }
  } else {
    res = bit.toFixed(1) + " Bytes";
  }
  return res;
};

/**
 * @description 时间戳转换成年-月-日
 * @param time 时间戳
 * @param format 格式化
 * @returns 显示的字符串日期
 */

export const TSToDate = (time, format) => {
  if (time == "") return "";
  const t = new Date(time);
  const tf = function (i) {
    return (i < 10 ? "0" : "") + i;
  };
  return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
    switch (a) {
      case "yyyy":
        return tf(t.getFullYear());
      case "MM":
        return tf(t.getMonth() + 1);
      case "mm":
        return tf(t.getMinutes());
      case "dd":
        return tf(t.getDate());
      case "HH":
        return tf(t.getHours());
      case "ss":
        return tf(t.getSeconds());
    }
  });
};
