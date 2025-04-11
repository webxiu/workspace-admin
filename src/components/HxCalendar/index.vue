<template>
  <div class="hx-calendar">
    <div class="calendar-header">
      <el-button @click="lastYear" text size="small" :icon="DArrowLeft" title="上一年" style="margin-left: 0" />
      <el-button @click="lastMonth" text size="small" :icon="ArrowLeft" title="上一月" style="margin-left: 0" />
      <el-date-picker
        v-model="dateMonth"
        type="month"
        placeholder="请选择年月"
        :editable="false"
        :clearable="false"
        :prefix-icon="h('p', '')"
        format="YYYY年MM月"
        class="calendar-month"
        @change="onChangeDate"
      />

      <el-button @click="onToday" type="primary" size="small">今天</el-button>
      <el-button @click="nextMonth" text size="small" :icon="ArrowRight" title="下一月" style="margin-left: 0" />
      <el-button @click="nextYear" text size="small" :icon="DArrowRight" title="下一年" style="margin-left: 0" />
    </div>
    <div class="calendar-body">
      <div class="week-item">
        <div class="week-cell" :key="week" v-for="week in weekDays">
          {{ week }}
        </div>
      </div>
      <div class="day-item" :key="index" v-for="(days, index) in allDays">
        <div class="day-cell week-count">{{ days[0].week }}</div>
        <div v-for="(item, idx) in days" @click="chooseDate(item)" :class="classList(item)" :key="idx">
          <slot name="custom-cell" :item="item">
            <div class="day-cell_name">
              <div class="day">{{ item.date.getDate() }}</div>
              <div class="lunar">{{ item.festival || item.lunar.term || item.lunar.lunarDayName }}</div>
            </div>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { debounce } from "@/utils/common";
import utils, { LunarType } from "./utils";
import { onMounted, reactive, ref, watch, h } from "vue";
import { ArrowLeft, ArrowRight, DArrowLeft, DArrowRight } from "@element-plus/icons-vue";

/**
 * 日期说明:
 *  1. 周数: 0-6 => 周日-周六
 *  2. 月份: 0-11 => 1月-12月
 */

/** 属性 */
export interface PropsType {
  modelValue?: Date | string;
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
  /** 月份类型 */
  monthType: "last" | "current" | "next";
  /** 第几周 */
  week: number;
  /** 农历 */
  lunar: LunarType;
  /** 节日名称 */
  festival: string;
}

const props = withDefaults(defineProps<PropsType>(), {
  modelValue: () => new Date()
});

const emits = defineEmits(["update:modelValue", "change", "select"]);
const initValue = utils.isValidDate(props.modelValue) ? new Date(props.modelValue) : new Date();
const weekDays = reactive(["周", "一", "二", "三", "四", "五", "六", "日"]);
const allDays = ref<CalendarItemType[][]>([]);
const dateMonth = ref(initValue);
const selectDay = ref();

/**
 * 阳历(公历)节日
 */
const lunarFestivals = {
  "1-1": "元旦节",
  "3-12": "植树节",
  "2-14": "情人节",
  "3-8": "妇女节",
  "4-1": "愚人节",
  "5-1": "劳动节",
  "5-4": "青年节",
  "5-12": "护士节",
  "6-1": "儿童节",
  "7-1": "建党节",
  "8-1": "建军节",
  "9-10": "教师节",
  "10-1": "国庆节",
  "12-24": "平安夜",
  "12-25": "圣诞节"
};

/** 按某月的第几周的周几作为节日(月-第几周-周几) */
const weekDayFestival = {
  "6-3-0": "父亲节",
  "5-2-0": "母亲节"
};

// 补充放假节气(把节气改为节日处理)
const extraFestival = ["清明节"];

/** 农历(阴历), 处理接口没有返回'节'字*/
const solarFestival = {
  "1-1": "春节",
  "5-5": "端午节",
  "7-7": "七夕",
  "8-15": "中秋节",
  "9-9": "重阳节",
  "1-15": "元宵节"
  // "12-30": "除夕", // 不是固定节日, 需要通过接口获取
};

onMounted(() => {
  initCalendar();
});

const initCalendar = () => {
  const { year, month } = utils.getYearMonthDay(dateMonth.value);
  // 获取每月第一天
  const currentFirstDay: any = utils.getDate(year, month, 1);
  // 周几(0-6)
  const week = currentFirstDay.getDay();
  const cWeek = week - 1 < 0 ? 6 : week - 1;
  // 开始的天数
  const startDay = currentFirstDay - cWeek * 60 * 60 * 1000 * 24;
  // 循环42天
  let tempArr: CalendarItemType[] = [];
  const daysList: CalendarItemType[][] = [];
  const curMonthDays: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDay + i * 60 * 60 * 1000 * 24);
    const today = isToday(date); // 是否今天
    const current = isCurrentMonth(date); // 是否当前月
    let monthType: CalendarItemType["monthType"] = "current"; // 月份类型
    if (!current) {
      monthType = date.getTime() - currentFirstDay.getTime() > 0 ? "next" : "last";
    }
    const lunar = utils.getNongLi(date);
    const festival = getFestivalDay({ date, lunar });
    tempArr.push({ date, today, current, monthType, lunar, week: utils.getWeekOfYear(date), festival });
    if (tempArr.length === 7) {
      daysList.push(tempArr);
      tempArr = [];
    }
    if (current) curMonthDays.push(date);
  }
  allDays.value = daysList;
};

// 动态设置类名
function classList(item: CalendarItemType) {
  const today = item.today ? "today" : "";
  const select = isSelect(item.date) ? "select " : "";
  const currentMonth = item.current ? "current-month" : "other-month";
  const festival = item.festival ? "festival" : ""; // 添加节日的类
  return ["day-cell ellipsis", today, select, currentMonth, festival];
}

/**
 * 获取当前年月的第N周的周几的日期
 * @param year 年
 * @param month 月
 * @param weekNumber 第几周
 * @param weekday 周几
 */
function getNthWeekdayOfMonth(year, month, weekNumber, weekday) {
  const date = new Date(year, month - 1, 1);
  // 计算该月的第一个指定星期几的日期
  const firstWeekday = ((7 + weekday - date.getDay()) % 7) + 1;
  // 计算第N个指定星期几的日期
  const nthWeekday = firstWeekday + (weekNumber - 1) * 7;
  // 返回结果
  return new Date(year, month - 1, nthWeekday);
}

/** 获取节日(在格子中高亮显示) */
function getFestivalDay({ date, lunar }) {
  const { year, month, day } = utils.getYearMonthDay(date);
  const { lunarMonth, lunarDay, term } = lunar; // 农历

  // 节气节日:由于term包含了很多节气(如:清明节被当作节气处理了)
  const extraDay = extraFestival.find((f) => f.includes(term));
  // 阳历节日
  const festival = lunarFestivals[`${month + 1}-${day}`] || solarFestival[`${lunarMonth}-${lunarDay}`];

  // 查找当前日期是否是按周几配置的节日
  const weekDayKey = Object.keys(weekDayFestival).find((key) => {
    const [_month, _week, _weekDay] = key.split("-").map(Number);
    const festivalDay = getNthWeekdayOfMonth(year, _month, _week, _weekDay);
    const { year: y, month: m, day: d } = utils.getYearMonthDay(festivalDay);
    return year === y && month === m && day === d;
  });
  if (weekDayKey) return weekDayFestival[weekDayKey as string];
  return festival || lunar.lunarFestival || extraDay;
}

// 是否当月
function isCurrentMonth(date: Date) {
  const { year, month } = utils.getYearMonthDay(dateMonth.value);
  const { year: y, month: m } = utils.getYearMonthDay(date);
  return year === y && month === m;
}
// 是否今天
function isToday(date: Date) {
  const { year, month, day } = utils.getYearMonthDay(new Date());
  const { year: y, month: m, day: d } = utils.getYearMonthDay(date);
  return year === y && month === m && day === d;
}

// 上一月
function lastMonth() {
  const d = dateMonth.value; // 获取当前的年月的一个日期
  d.setMonth(d.getMonth() - 1);
  onChangeDate(d);
}
// 下一月
function nextMonth() {
  const d = dateMonth.value;
  d.setMonth(d.getMonth() + 1);
  onChangeDate(d);
}
// 上一年
function lastYear() {
  const d = dateMonth.value;
  d.setFullYear(d.getFullYear() - 1);
  onChangeDate(d);
}
// 下一年
function nextYear() {
  const d = dateMonth.value;
  d.setFullYear(d.getFullYear() + 1);
  onChangeDate(d);
}
// 今天
function onToday() {
  const d = new Date();
  onChangeDate(d);
}

// 选中某天
function isSelect(date: Date) {
  const { year, month, day } = utils.getYearMonthDay(selectDay.value);
  const { year: y, month: m, day: d } = utils.getYearMonthDay(date);
  return year === y && month === m && day === d;
}

// 选择当天
function chooseDate(item: CalendarItemType) {
  const { monthType, date } = item;
  const monthFn = { next: nextMonth, last: lastMonth };
  selectDay.value = date;
  emits("select", date);
  monthFn[monthType]?.();
}

// 切换年月
const onChangeDate = debounce((date: Date) => {
  dateMonth.value = new Date(date);
  emits("update:modelValue", date);
  emits("change", date);
  initCalendar();
}, 500);
</script>

<style lang="scss">
$cell-height: 18px;
$weekColor: #57a3dc;
$color: var(--el-text-color-primary);
$borderColor: var(--el-card-border-color);

.hx-calendar {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
  background: var(--el-fill-color-blank);
  border-top: 1px solid $borderColor;
  border-left: 1px solid $borderColor;

  .calendar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 42px;
    white-space: nowrap;
    user-select: none;
    border-right: 1px solid $borderColor;

    .calendar-month {
      width: 100px;
      font-size: 18px;
      text-align: center;
      border: none;
      box-shadow: none;

      .el-input__wrapper,
      .el-input__wrapper.is-focus {
        box-shadow: none;
      }

      .el-input__prefix-inner {
        display: none;
      }
    }

    .calendar-today {
      flex: 1;
      font-size: 20px;
      line-height: 40px;
      text-align: center;
    }
  }

  .calendar-body {
    display: flex;
    flex: 1;
    flex-direction: column;

    .week-item {
      display: flex;
      font-size: 14px;
      background: rgb(145 219 224 / 35%);

      .week-cell {
        flex: 1;
        padding: 5px;
        font-weight: 700;
        text-align: center;
        user-select: none;
        border: 1px solid $borderColor;
        border-left: none;

        &:nth-child(1) {
          color: $weekColor;
        }
      }
    }

    .day-item {
      display: flex;
      flex: 1;
      width: 100%;
      color: $color;

      .today {
        color: #fff !important;
        background: var(--el-color-primary);
      }

      .festival {
        color: var(--el-color-primary);
      }

      .current-month {
        font-size: 14px;
      }

      .other-month {
        color: #b5b5b5;
      }

      .week-count {
        color: $weekColor;
      }

      .day-cell {
        box-sizing: border-box;
        display: flex;
        flex: 1;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 4px;
        line-height: $cell-height;
        text-align: center;
        white-space: nowrap;
        cursor: pointer;
        border-right: 1px solid $borderColor;
        border-bottom: 1px solid $borderColor;

        &:hover,
        &.select {
          color: #fff !important;
          background: #1bac46;
        }

        .day {
          font-size: 18px;
          line-height: 1em;
        }

        .lunar {
          margin-top: 2px;
          font-size: 12px;
          line-height: 1em;
          opacity: 0.7;
        }
      }
    }
  }
}
</style>
