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
            <span class="cell-text">{{ getNongLi(item.date) }}</span>
          </div>
          <div class="holidy">
            <span class="holidy-content" :class="[getInWork(item.date).class, !isCurrentMonth(item.date) ? 'other-month' : '']">
              {{ getInWork(item.date).name }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import * as utils from "./utils";
import { dayjs } from "element-plus";
import { ArrowLeft, ArrowRight, DArrowLeft, DArrowRight } from "@element-plus/icons-vue";
import { HolidaySettingDataType, HolidaySettingItemType } from "@/api/oaManage/humanResources";
import { debounce } from "@/utils/common";

/** 属性 */
export interface PropsType {
  loading?: boolean;
  value?: Date;
  dataList: HolidaySettingDataType[];
  calendarList: HolidaySettingItemType[];
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
  value: () => new Date(),
  dataList: () => [],
  calendarList: () => []
});

const weekDays = ref(["周一", "周二", "周三", "周四", "周五", "周六", "周日"]);
const { year, month, day } = utils.getYearMonthDay(props.value);
const time = ref<DateChangeType>({ year, month, day });
const currentDateList = ref<HolidaySettingDataType[]>([]);
const allDays = ref<CalendarItemType[][]>([]);

const emits = defineEmits(["change"]);

onMounted(() => {
  initCalendar();
});

watch(props, (value) => {
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

  // 生成当前月加班列表
  const currentHoliday = curMonthDays.map((day) => {
    const workDate = dayjs(day).format("YYYY-MM-DD");
    return { id: Math.random(), workDate: workDate, isWork: "", isHoliday: 0, inDate: "", keyIn: "", category: 0, work: "" };
  });

  // 如果将接口返回的加班设置与默认加班(isWork默认为空)合并
  const map = new Map();
  const resultArr = [...props.dataList, ...currentHoliday].reduce((pre, cur) => {
    const dateItem = dayjs(new Date(cur.workDate)).format("YYYY-MM-DD");
    if (!map.get(dateItem)) {
      map.set(dateItem, true);
      pre.push(cur);
    }
    return pre;
  }, []);
  currentDateList.value = resultArr;
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
// 获取农历
function getNongLi(date: Date) {
  const dateTime2 = dayjs(date).format("YYYYMMDD");
  const item2 = props.calendarList.find((item) => item.date === dateTime2);
  const nongli = item2?.lunarDateCn.split("年")[1];
  return nongli ? `(${nongli})` : "";
}
// 获取工作
function getInWork(date: Date) {
  const dateTime = dayjs(date).format("YYYY-MM-DD");
  const item = currentDateList.value.find((item) => dayjs(new Date(item.workDate)).format("YYYY-MM-DD") === dateTime);
  if (item) {
    return {
      name: { 0: "休", 1: "班" }[item.isWork] || "",
      class: { 0: "xiu", 1: "ban" }[item.isWork] || ""
    };
  }
  return { name: "", class: "" };
}

// 选择当天
function chooseDate(item: CalendarItemType) {
  const { date, monthType } = item;
  const dateTime = dayjs(date).format("YYYY-MM-DD");
  currentDateList.value.map((item) => {
    if (dayjs(new Date(item.workDate)).format("YYYY-MM-DD") === dateTime) {
      item.isWork = item.isWork === 1 ? 0 : 1;
    }
    return item;
  });
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
  // 提交保存只保存当前月
  const { year, month, day } = time.value;
  const selectTime = dayjs(new Date(year, month, day)).format("YYYY-MM");
  const filterArr = currentDateList.value.filter((item) => {
    const dateItem = dayjs(new Date(item.workDate)).format("YYYY-MM");
    return item.workDate.indexOf(selectTime) > -1 && dateItem === selectTime;
  });
  return { holidayData: filterArr };
}

defineExpose({ getRef });
</script>

<style lang="scss" scoped>
$cell-height: 100px;
$border-color: #ebeef5;

.hailen-calendar {
  background: var(--el-bg-color);
  border: 1px solid #ccc;

  .calendar-header {
    display: inline-block;
    display: flex;
    align-items: center;
    justify-content: space-between;
    line-height: 48px;
    user-select: none;
  }

  .calendar-today {
    flex: 1;
    font-size: 24px;
    font-weight: 400;
    line-height: 30px;
    text-align: center;
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
      text-align: center;
      user-select: none;
      border: 1px solid $border-color;
    }

    .row-date {
      display: flex;
    }

    .cell-date {
      box-sizing: border-box;
      display: flex;
      flex: 1;
      flex-direction: column;
      min-height: $cell-height;
      padding: 4px;
      border: 1px solid $border-color;
    }

    .current-day {
      &:hover {
        cursor: pointer;
        border-color: #598bf7;
      }

      .holidy {
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: center;
        color: #000;
      }

      .holidy-content {
        position: relative;
        box-sizing: border-box;
        display: inline-block;
        width: 46px;
        height: 46px;
        font-size: 30px;
        font-weight: 400;
        line-height: 46px;
        text-align: center;
        user-select: none;
        background: transparent;
        border-radius: 6px;
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
      padding: 4px 2px;
      font-size: 14px;
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
  background: var(--el-fill-color-light);
  border: 1px solid #598bf7 !important;
}
</style>
