import Lunar from "lunar-calendar";
import dayjs from "dayjs";

/** 年月日类型 */
export interface CalendarDateType {
  year: number;
  month: number;
  day: number;
}

/** 农历结果类型 */
export interface LunarType {
  zodiac: string;
  GanZhiYear: string;
  GanZhiMonth: string;
  GanZhiDay: string;
  worktime: number;
  term: string;
  lunarYear: number;
  lunarMonth: number;
  lunarDay: number;
  lunarMonthName: string;
  lunarDayName: string;
  lunarLeapMonth: number;
  solarFestival: string;
  lunarFestival: string;
}

export default {
  /** 检查是否合法日期 */
  isValidDate(value) {
    const date = new Date(value);
    return !isNaN(date.getTime());
  },
  /** 日期对象转日期 */
  getYearMonthDay(dd: Date | string): CalendarDateType {
    const date = new Date(dd);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    return { year, month, day };
  },
  /** 日期转日期对象 */
  getDate(year: number, month: number, day: number): Date {
    return new Date(year, month, day);
  },
  /** 日期格式化 */
  formatDate(date: string | Date, fmt = "YYYY-MM-DD HH:mm:ss") {
    return date ? dayjs(date).format(fmt) : "";
  },
  /** 获取农历和节气等 */
  getNongLi(date: Date): LunarType {
    const { year, month, day } = this.getYearMonthDay(date);
    return Lunar.solarToLunar(year, month + 1, day);
  },
  // 获取当天是第几周
  getWeekOfYear(date: Date) {
    // 创建一个新的日期对象，设置为该年的第一天
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    // 计算该日期是该年的第几天
    const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)) + 1;
    // 计算该日期是第几周
    return Math.ceil(days / 7);
  }
};
