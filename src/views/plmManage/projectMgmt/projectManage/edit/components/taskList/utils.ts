import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

/** 获取时间范围内的日期数组 */
export const getRangeDate = (startDate, endDate) => {
  const targetArr = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  const startDateInfo = {
    year: start.getFullYear(),
    month: start.getMonth() + 1,
    day: start.getDate()
  };
  const endDateInfo = {
    year: end.getFullYear(),
    month: end.getMonth() + 1,
    day: end.getDate()
  };
  if (startDateInfo.year === endDateInfo.year) {
    //同年
    if (startDateInfo.month !== endDateInfo.month) {
      //同年，不同月份
      //获取开始时间所在月的月底日期
      const startMax = new Date(startDateInfo.year, startDateInfo.month, 0).getDate();
      const endNum = startMax - startDateInfo.day + endDateInfo.day;
      for (let i = startDateInfo.day; i <= startDateInfo.day + endNum; i++) {
        if (i > startMax) {
          targetArr.push(
            `${endDateInfo.year}-${endDateInfo.month < 10 ? "0" + endDateInfo.month : endDateInfo.month}-${
              i - startMax < 10 ? "0" + (i - startMax) : i - startMax
            }`
          );
        } else {
          targetArr.push(`${startDateInfo.year}-${startDateInfo.month < 10 ? "0" + startDateInfo.month : startDateInfo.month}-${i < 10 ? "0" + i : i}`);
        }
      }
    } else {
      //同年同月
      for (let i = startDateInfo.day; i <= endDateInfo.day; i++) {
        targetArr.push(`${startDateInfo.year}-${startDateInfo.month < 10 ? "0" + startDateInfo.month : startDateInfo.month}-${i < 10 ? "0" + i : i}`);
      }
    }
  } else {
    //不同年   【既然不同年那肯定也不同月】
    const startMax = new Date(startDateInfo.year, startDateInfo.month, 0).getDate();
    const endNum = startMax - startDateInfo.day + endDateInfo.day;
    for (let i = startDateInfo.day; i <= startDateInfo.day + endNum; i++) {
      if (i > startMax) {
        targetArr.push(
          `${endDateInfo.year}-${endDateInfo.month < 10 ? "0" + endDateInfo.month : endDateInfo.month}-${
            i - startMax < 10 ? "0" + (i - startMax) : i - startMax
          }`
        );
      } else {
        targetArr.push(`${startDateInfo.year}-${startDateInfo.month < 10 ? "0" + startDateInfo.month : startDateInfo.month}-${i < 10 ? "0" + i : i}`);
      }
    }
  }

  return targetArr;
};

/**
 * 根据前置任务自动更新开始日期
 * @param allDateArr 放假日期数组
 * @param row 表格行数据
 */
export const updateStartDate = (allDateArr, row) => {
  const list = allDateArr.map((item) => getRangeDate(item.beginDate, item.endDate)).flat(Infinity);
  const holidays = new Set(list.map((date) => new Date(date).toISOString().split("T")[0]));
  const currentDate = new Date(row.start);
  let mark = true;
  while (mark) {
    const currentDateString = currentDate.toISOString().split("T")[0];
    if (holidays.has(currentDateString)) {
      currentDate.setDate(currentDate.getDate() + 1);
    } else {
      row.start = currentDate.toISOString().split("T")[0];
      mark = false;
    }
  }
};

/**
 * 获取结束日期
 * @param allDateArr 放假日期数组
 * @param startDate 开始日期
 * @param duration 工期
 * @returns 放假天数和结束日期
 */
export const getHolidays = (allDateArr, startDate: string, duration: number) => {
  const list = allDateArr.map((item) => getRangeDate(item.beginDate, item.endDate)).flat(Infinity);
  const holidays = new Set(list.map((date) => new Date(date).toISOString().split("T")[0]));
  const currentDate = new Date(startDate);
  let workDaysCount = 0; // 用于统计工作日天数
  let holidaysCount = 0; // 用于统计假期天数

  while (workDaysCount < duration) {
    const currentDateString = currentDate.toISOString().split("T")[0];
    if (!holidays.has(currentDateString)) {
      workDaysCount++;
    } else {
      holidaysCount++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  // 回退一天，因为最后一天是多加的一天
  currentDate.setDate(currentDate.getDate() - 1);

  return {
    holidays: holidaysCount,
    endDate: currentDate.toISOString().split("T")[0]
  };
};

/** 根据日期获取对应节假日天数  */
export const getHolidaysByOneDate = (dateString, holidaysArr) => {
  const allHolidays = holidaysArr.map((item) => {
    return getRangeDate(item.beginDate, item.endDate);
  });

  const findHolidays = allHolidays.find((item) => item.some((el) => el === dateString));

  return findHolidays ? findHolidays.length : 0;
};
