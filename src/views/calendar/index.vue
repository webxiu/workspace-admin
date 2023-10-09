<template>
  <div v-loading="loading" class="hailen-calendar">
    <div class="calendar-header">
      <div class="calendar-today">{{ time.year }}年{{ `${time.month + 1}`.padStart(2, "0") }}月</div>
      <div>
        <el-button @click="onToday" type="primary" size="small">今天</el-button>
        <el-button @click="prevYear" text :icon="DArrowLeft" title="上一年" />
        <el-button @click="prevMonth" text :icon="ArrowLeft" title="上一月" />
        <el-button @click="nextMonth" text :icon="ArrowRight" title="下一月" />
        <el-button @click="nextYear" text :icon="DArrowRight" title="下一年" />
      </div>
    </div>
    <div class="calendar-content">
      <div class="row-name">
        <div v-for="k in weekDays" :key="k" class="row-item-name">{{ k }}</div>
      </div>
      <div v-for="(days, index) in allDays" :key="index" class="row-date">
        <div
          class="cell-date current-day"
          v-for="(item, idx) in days"
          :key="idx"
          @click="chooseDate(item)"
          :class="[{ 'other-month': !isCurrentMonth(item.date) }, { today: isToday(item.date) }, { select: isSelect(item.date) }]"
        >
          <div class="cell-date_name">
            <span class="cell-num">{{ item.date.getDate() }}日</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import * as utils from "./utils";
import { dayjs } from "element-plus";
import { ArrowLeft, ArrowRight, DArrowLeft, DArrowRight } from "@element-plus/icons-vue";
import { onMounted } from "vue";
import { debounce } from "@/utils/common";

/** 属性 */
export interface PropsType {
  loading?: boolean;
  value?: Date;
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

const props = withDefaults(defineProps<PropsType>(), {
  loading: false,
  value: () => new Date()
});

const weekDays = ref(["周一", "周二", "周三", "周四", "周五", "周六", "周日"]);
const { year, month, day } = utils.getYearMonthDay(props.value);
const time = ref<DateChangeType>({ year, month, day });
const allDays = ref<CalendarItemType[][]>([]);

const emits = defineEmits(["change"]);

onMounted(() => {
  initCalendar();
});

watch(time, (value) => {
  initCalendar();
});

const initCalendar = () => {
  const { year, month } = utils.getYearMonthDay(utils.getDate(time.value.year, time.value.month, 1));
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
  const { year, month } = utils.getYearMonthDay(utils.getDate(time.value.year, time.value.month, 1));
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
  const d = utils.getDate(time.value.year, time.value.month, 1); // 获取当前的年月的一个日期
  d.setMonth(d.getMonth() - 1);
  onChangeDate(d);
}
// 下一月
function nextMonth() {
  const d = utils.getDate(time.value.year, time.value.month, 1);
  d.setMonth(d.getMonth() + 1);
  onChangeDate(d);
}
// 上一年
function prevYear() {
  const d = utils.getDate(time.value.year, time.value.month, 1);
  d.setFullYear(d.getFullYear() - 1);
  onChangeDate(d);
}
// 下一年
function nextYear() {
  const d = utils.getDate(time.value.year, time.value.month, 1);
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
  const { date, monthType } = item;
  const dateTime = dayjs(date).format("YYYY-MM-DD");

  if (monthType === "next") {
    nextMonth();
  } else if (monthType === "prev") {
    prevMonth();
  }
}

// 切换年月
const onChangeDate = debounce((date: Date) => {
  time.value = utils.getYearMonthDay(date);
  emits("change", time.value);
}, 500);

function getRef() {
  const { year, month, day } = time.value;
  const selectTime = dayjs(new Date(year, month, day)).format("YYYY-MM");
  return { selectTime: selectTime };
}

defineExpose({ getRef });
</script>

<style lang="scss" scoped>
$cell-height: 100px;
$border-color: #ebeef5;
.hailen-calendar {
  background: #fff;
  border: 1px solid #ccc;
  .calendar-header {
    display: inline-block;
    line-height: 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    user-select: none;
  }
  .calendar-today {
    line-height: 30px;
    text-align: center;
    flex: 1;
    font-weight: 400;
    font-size: 24px;
  }

  .calendar-content {
    .row-name {
      display: flex;
      text-align: center;
    }
    .row-name .row-item-name {
      flex: 1;
      padding: 10px;
      font-weight: 700;
      user-select: none;
      text-align: center;
      border: 1px solid $border-color;
    }
    .row-date {
      display: flex;
    }
    .cell-date {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: $cell-height;
      padding: 4px;
      box-sizing: border-box;
      border: 1px solid $border-color;
    }
    .current-day {
      &:hover {
        border-color: #598bf7;
        cursor: pointer;
      }
      .holidy {
        display: flex;
        flex: 1;
        justify-content: center;
        align-items: center;
        color: #000;
      }
      .holidy-content {
        position: relative;
        display: inline-block;
        width: 46px;
        height: 46px;
        line-height: 46px;
        box-sizing: border-box;
        background: transparent;
        border-radius: 6px;
        font-size: 30px;
        font-weight: 400;
        text-align: center;
        user-select: none;
        transition: transform 0.5s;
        &.ban {
          background: #28a745;
          transform: rotateY(360deg);
        }
        &.xiu {
          background: #ffc107;
          transform: rotateY(720deg);
        }
      }
    }
    .select {
      cursor: pointer;
    }

    .cell-date_name {
      font-size: 16px;
      padding: 4px 2px;
      text-align: right;
    }
  }
}
.other-month {
  // color: #d0d0d0;
  opacity: 0.4;
}
.today {
  color: #409eff;
  background: #f5f5f5;
  border: 1px solid #598bf7 !important;
}
</style>
