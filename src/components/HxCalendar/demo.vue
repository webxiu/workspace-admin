<script lang="tsx">
import * as utils from "./utils";
import { ArrowLeft, ArrowRight, DArrowLeft, DArrowRight } from "@element-plus/icons-vue";
import { defineComponent, defineExpose, onMounted, reactive, ref, watch } from "vue";

import Lunar from "lunar-calendar";
import { debounce } from "@/utils/common";

export type { CalendarDateType } from "./utils";

/** 属性 */
export interface PropsType {
  loading?: boolean;
  value?: Date | string;
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

/** 切换年月 */
export interface DateChangeType {
  year: number;
  month: number;
  day: number;
}

/** 日历格子类型 */
export interface CalendarItemType {
  /** 日期 */
  date: Date;
  /** 是否当前月 */
  current: boolean;
  /** 是否当天 */
  today: boolean;
  /** 选中某天 */
  select: boolean;
  /** 月份类型 */
  monthType: "prev" | "current" | "next";
}

// 获取农历
export function getNongLi(date: Date): LunarType {
  const { year, month, day } = utils.getYearMonthDay(date);
  return Lunar.solarToLunar(year, month + 1, day);
}

const props = {
  loading: { type: Boolean, default: true },
  value: { type: Array as PropType<Date>, default: () => new Date() }
};

export default defineComponent({
  name: "HxCalendar",
  props,
  emits: ["change"],
  setup(props, { emit, slots, attrs }) {
    const weekDays = reactive(["一", "二", "三", "四", "五", "六", "日"]);
    const { year, month, day } = utils.getYearMonthDay(props.value);
    const dayTime = ref<DateChangeType>({ year, month, day });
    const allDays = ref<CalendarItemType[][]>([]);

    onMounted(() => {
      initCalendar();
    });

    watch(props, (value) => {
      initCalendar();
    });

    const initCalendar = () => {
      const { year, month } = utils.getYearMonthDay(utils.getDate(dayTime.value.year, dayTime.value.month, 1));
      // 获取每月第一天
      const currentFirstDay: any = utils.getDate(year, month, 1);
      // 周几(0-6)
      const week = currentFirstDay.getDay();
      const cWeek = week - 1 < 0 ? 6 : week - 1;
      // 开始的天数
      const startDay: any = currentFirstDay - cWeek * 60 * 60 * 1000 * 24;
      // 循环42天
      let tempArr: CalendarItemType[] = [];
      const daysList: CalendarItemType[][] = [];
      const curMonthDays: Date[] = [];
      for (let i = 0; i < 42; i++) {
        const date = new Date(startDay + i * 60 * 60 * 1000 * 24);
        const today = isToday(date); // 是否今天
        const select = isSelect(date); // 选中某天
        const current = isCurrentMonth(date); // 是否当前月
        let monthType: CalendarItemType["monthType"] = "current"; // 月份类型
        if (!current) {
          monthType = date.getTime() - currentFirstDay.getTime() > 0 ? "next" : "prev";
        }
        tempArr.push({ date, today, select, current, monthType });
        if (tempArr.length === 7) {
          daysList.push(tempArr);
          tempArr = [];
        }
        if (current) {
          curMonthDays.push(date);
        }
      }
      allDays.value = daysList;
    };

    // 是否当月
    function isCurrentMonth(date: Date) {
      const { year, month } = utils.getYearMonthDay(utils.getDate(dayTime.value.year, dayTime.value.month, 1));
      const { year: y, month: m } = utils.getYearMonthDay(date);
      return year === y && month === m;
    }
    // 是否今天
    function isToday(date: Date) {
      const { year, month, day } = utils.getYearMonthDay(new Date());
      const { year: y, month: m, day: d } = utils.getYearMonthDay(date);
      return year === y && month === m && day === d;
    }
    // 选中某天
    function isSelect(date: Date) {
      const { year, month, day } = utils.getYearMonthDay(props.value);
      const { year: y, month: m, day: d } = utils.getYearMonthDay(date);
      return year === y && month === m && day === d;
    }
    // 上一月
    function prevMonth() {
      const d = utils.getDate(dayTime.value.year, dayTime.value.month, 1); // 获取当前的年月的一个日期
      d.setMonth(d.getMonth() - 1);
      onChangeDate(d);
    }
    // 下一月
    function nextMonth() {
      const d = utils.getDate(dayTime.value.year, dayTime.value.month, 1);
      d.setMonth(d.getMonth() + 1);
      onChangeDate(d);
    }
    // 上一年
    function prevYear() {
      const d = utils.getDate(dayTime.value.year, dayTime.value.month, 1);
      d.setFullYear(d.getFullYear() - 1);
      onChangeDate(d);
    }
    // 下一年
    function nextYear() {
      const d = utils.getDate(dayTime.value.year, dayTime.value.month, 1);
      d.setFullYear(d.getFullYear() + 1);
      onChangeDate(d);
    }
    // 今天
    function onToday() {
      const d = new Date();
      onChangeDate(d);
    }

    // 选择当天
    function chooseDate(item: CalendarItemType) {
      const { monthType } = item;
      if (monthType === "next") {
        nextMonth();
      } else if (monthType === "prev") {
        prevMonth();
      }
    }

    // 切换年月
    const onChangeDate = debounce((date: Date) => {
      dayTime.value = utils.getYearMonthDay(date);
      emit("change", dayTime.value);
    }, 500);

    function getRef() {
      // 提交保存只保存当前月
      const { year, month, day } = dayTime.value;
      const selectTime = utils.formatDate(new Date(year, month, day), "YYYY-MM");
      return { selectTime };
    }

    defineExpose({ getRef });

    return () => (
      <div v-loading={props.loading} class="hailen-calendar">
        <div class="calendar-header">
          <el-button onClick={prevYear} text icon={DArrowLeft} title="上一年" />
          <el-button onClick={prevMonth} text icon={ArrowLeft} title="上一月" />
          <div class="calendar-today">{utils.formatDate(new Date(dayTime.value.year, dayTime.value.month), "YYYY年MM月")}</div>
          <el-button onClick={onToday} type="primary" size="small">
            今天
          </el-button>
          <el-button onClick={nextMonth} text icon={ArrowRight} title="下一月" />
          <el-button onClick={nextYear} text icon={DArrowRight} title="下一年" />
        </div>
        <div class="calendar-body">
          <div class="week-item">
            {weekDays.map((week) => (
              <div class="week-cell" key={week}>
                {week}
              </div>
            ))}
          </div>
          {allDays.value.map((days, index) => (
            <div class="day-item" key={index}>
              {days.map((item, idx) => {
                const nongLi = getNongLi(item.date);
                const today = item.today ? "today" : "";
                const select = item.select ? "select " : "";
                const otherMonth = item.current ? "current-month" : "other-month";

                index === 0 && console.log("nongLi", JSON.stringify(nongLi, null, 2));
                return (
                  <div key={idx} onClick={chooseDate.bind(null, item)} class={["day-cell", today, select, otherMonth]}>
                    {slots?.renderDay ? (
                      slots.renderDay(item)
                    ) : (
                      <div class={{ "day-cell_name": true, todayss: nongLi.term }}>
                        <div class="day">{item.date.getDate()}</div>
                        <div class="lunar">{nongLi.term || nongLi.lunarDayName} </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  }
});
</script>

<style lang="scss">
$cell-height: 18px;
$borderColor: #d6d9e2;

.hailen-calendar {
  background: #fff;
  border-top: 1px solid $borderColor;
  border-left: 1px solid $borderColor;

  .calendar-header {
    display: inline-block;
    display: flex;
    align-items: center;
    justify-content: space-between;
    line-height: 48px;
    user-select: none;
    border-right: 1px solid $borderColor;
    .calendar-today {
      flex: 1;
      font-size: 20px;
      line-height: 40px;
      text-align: center;
    }
  }

  .calendar-body {
    .week-item {
      display: flex;
      font-size: 14px;
      .week-cell {
        flex: 1;
        padding: 5px;
        font-weight: 700;
        text-align: center;
        user-select: none;
        border: 1px solid $borderColor;
        border-left: none;
      }
    }

    .day-item {
      display: flex;

      .today {
        color: #fff !important;
        background: #409eff;
      }

      .current-month {
        color: #303133;
      }
      .other-month .day-cell_name {
        opacity: 0.4;
      }

      .day-cell {
        display: flex;
        flex: 1;
        padding: 4px;
        cursor: pointer;
        flex-direction: column;
        min-height: $cell-height;
        line-height: $cell-height;
        box-sizing: border-box;
        border-right: 1px solid $borderColor;
        border-bottom: 1px solid $borderColor;
        text-align: center;

        &:hover,
        .select {
          color: #fff;
          background: #598bf7;
        }
        .day {
          font-size: 16px;
        }
        .lunar {
          font-size: 12px;
        }
      }
    }
  }
}
</style>
