<template>
  <div class="tab-calendar">
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
              <div class="lunar">
                <div class="icon">
                  <el-icon v-if="item.current" @click.stop="() => clickAddIcon(item)" :size="18" color="#299764"><CirclePlus /></el-icon>
                  <div v-else style="visibility: hidden">empty</div>
                </div>
                <div>{{ item.festival || item.lunar.term || item.lunar.lunarDayName }}</div>
              </div>
              <div v-if="item.taskList?.length" :class="{ 'task-list': true, passed: !item.current }" v-for="(el, taskIdx) in item.taskList" :key="taskIdx">
                <div class="name" @click.stop="() => clickTaskNameEdit(item, el, taskIdx)">{{ el.taskName }}</div>
                <div class="icon">
                  <el-icon @click.stop="() => clickDelIcon(item, taskIdx)"><Delete /></el-icon>
                </div>
              </div>
            </div>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { debounce } from "@/utils/common";
import utils, { LunarType } from "@/components/HxCalendar/utils";
import { onMounted, reactive, ref, h } from "vue";
import { ArrowLeft, ArrowRight, DArrowLeft, DArrowRight, CirclePlus, Delete } from "@element-plus/icons-vue";
import { addDialog } from "@/components/ReDialog";
import EditForm from "@/components/EditForm/index.vue";
import { dayjs, FormRules } from "element-plus";
import { message, showMessageBox } from "@/utils/message";
import { addMainTask, deleteTask, editTask, taskManageList, updateTaskStatus } from "@/api/systemManage";

/** 属性 */
export interface PropsType {
  modelValue?: Date | string;
  boardRef?: any;
}

/** 切换年月 */
export interface DateChangeType {
  year: number;
  month: number;
  day: number;
}

/** 任务类型 */
export interface taskType {
  taskName: string;
  curUserId: string | number;
  endDate: string;
  priority: string;
  curFlagName: string;
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
  /** 任务列表 */
  taskList: taskType[];
}

// const props = withDefaults(defineProps<PropsType>(), {
//   modelValue: () => new Date(),
//   boardRef: null,
//   formData: {}
// });

const props = defineProps(["modelValue", "boardRef", "formData", "taskManageOptions"]);

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
  "5-11": "母亲节",
  "6-1": "儿童节",
  "6-15": "父亲节",
  "7-1": "建党节",
  "8-1": "建军节",
  "9-10": "教师节",
  "10-1": "国庆节",
  "12-24": "平安夜",
  "12-25": "圣诞节"
};

// 补充放假节气(当作节日处理)
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

const setItemTask = () => {
  const startTime = dayjs(dateMonth.value).startOf("month").format("YYYY-MM-DD");
  const endTime = dayjs(dateMonth.value).endOf("month").format("YYYY-MM-DD");

  // taskManageList({
  //   page: 1,
  //   limit: 100,
  //   responsibleUserName: "谢健",
  //   startTime,
  //   endTime,
  //   select: "1,2",
  //   hideChildDone: true
  // });
};

onMounted(() => {
  initCalendar();
  setItemTask();
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
    tempArr.push({ date, today, current, monthType, lunar, week: utils.getWeekOfYear(date), festival, taskList: [] });
    if (tempArr.length === 7) {
      daysList.push(tempArr);
      tempArr = [];
    }
    if (current) curMonthDays.push(date);
  }
  allDays.value = daysList.map((el, idx) => {
    el = el.map((dayEl) => {
      dayEl.taskList = [];
      (dayEl as any).dayStr = dayjs(dayEl.date).format("YYYY-MM-DD");
      return dayEl;
    });
    return el;
  });
  queryRangeData(allDays.value);
};

const findResult = (dateStr, resArr) => {
  return resArr.filter((el) => el.endTime === dateStr);
};

const queryRangeData = (allDays) => {
  const startTime = allDays.at(0).at(0)?.dayStr;
  const endTime = allDays.at(-1).at(-1)?.dayStr;
  // 找未开始和进行中的
  taskManageList({
    page: 1,
    limit: 100,
    responsibleUserName: props.formData?.responsibleUserName,
    startTime,
    endTime,
    select: "1,2",
    hideChildDone: true
  }).then((res) => {
    if (res.data) {
      const result = res.data.records || [];

      allDays.forEach((item) => {
        item.forEach((el) => {
          el.taskList = findResult(el.dayStr, result);
        });
      });
    }
  });
};

// 动态设置类名
function classList(item: CalendarItemType) {
  const today = item.today ? "today" : "";
  const select = isSelect(item.date) ? "select " : "";
  const currentMonth = item.current ? "current-month" : "other-month";
  const festival = item.festival ? "festival" : ""; // 添加节日的类
  return ["day-cell ellipsis", today, select, currentMonth, festival];
}

/** 获取节日(在格子中高亮显示) */
function getFestivalDay({ date, lunar }) {
  const { month, day } = utils.getYearMonthDay(date);
  const { lunarMonth, lunarDay, term } = lunar;
  // 特殊处理:由于term包含了很多节气(如:清明节被当作节气处理了)
  const extraDay = extraFestival.find((f) => f.includes(term));
  const festival = lunarFestivals[`${month + 1}-${day}`] || solarFestival[`${lunarMonth}-${lunarDay}`];
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

// 点击添加任务图标
const clickAddIcon = (item) => {
  openDialog("add", item);
};

// 点击任务名称进行修改
const clickTaskNameEdit = (item, row, taskIdx) => {
  openDialog("edit", item, taskIdx, row);
};

const openDialog = (type, item, taskIdx?, row?) => {
  const title = { add: "新增", edit: "修改" };
  const formRules = reactive<FormRules>({
    taskName: [{ required: true, message: "任务名称必填", trigger: "submit" }],
    curUserId: [{ required: true, message: "任务负责人必填", trigger: "submit" }],
    priority: [{ required: true, message: "优先级必填", trigger: "submit" }]
  });

  const priorityOptionValue = ref([
    { optionName: "紧急", optionValue: "紧急" },
    { optionName: "高", optionValue: "高" },
    { optionName: "中", optionValue: "中" },
    { optionName: "低", optionValue: "低" }
  ]);
  const formRef = ref();
  const _formData = reactive({
    taskName: row?.taskName,
    curUserId: row?.responsibleUserCode,
    priority: row?.priority
  });
  addDialog({
    title: `${title[type]}任务`,
    props: {
      formInline: _formData,
      formRules: formRules,
      formConfigs: [
        {
          label: "任务名称",
          labelWidth: 80,
          colProp: { span: 24 },
          prop: "taskName",
          render: ({ formModel, row }) => {
            return <el-input v-model={formModel[row.prop]} placeholder="请输入任务名称" />;
          }
        },
        {
          label: "负责人",
          labelWidth: 80,
          colProp: { span: 24 },
          prop: "curUserId",
          render: ({ formModel, row }) => {
            return (
              <el-select v-model={formModel[row.prop]} placeholder="请选择负责人" style={{ width: "100%" }}>
                {props.taskManageOptions?.userinfoList?.map((item) => (
                  <el-option key={item.userCode} label={item.userName} value={item.userCode} />
                ))}
              </el-select>
            );
          }
        },
        {
          label: "优先级",
          labelWidth: 80,
          colProp: { span: 24 },
          prop: "priority",
          render: ({ formModel, row }) => {
            return (
              <el-select v-model={formModel[row.prop]} placeholder="请选择优先级" style={{ width: "100%" }}>
                {priorityOptionValue.value.map((item) => (
                  <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
                ))}
              </el-select>
            );
          }
        }
      ]
    },
    width: "500px",
    draggable: true,
    destroyOnClose: true,
    fullscreenIcon: true,
    closeOnClickModal: false,
    contentRenderer: () => h(EditForm, { ref: formRef }),
    beforeSure: (done) => {
      const FormRef = formRef.value.getRef();
      FormRef.validate(async (valid) => {
        if (valid) {
          showMessageBox(`确认要${title[type]}任务吗?`)
            .then(() => {
              const reqParams = {
                taskName: _formData.taskName,
                startTime: item.dayStr,
                endTime: item.dayStr,
                id: row?.id,
                billNo: row?.billNo,
                responsibleUserCode: _formData.curUserId,
                priority: _formData.priority,
                responsibleUserName: props.formData.responsibleUserName
              };

              if (type === "edit") reqParams.parentId = 0;
              const fd = new FormData();

              fd.append("param", JSON.stringify(reqParams));

              const typeApi = { add: addMainTask, edit: editTask };

              typeApi[type](fd).then((res) => {
                if (res.data) {
                  message.success(`${title[type]}成功`);
                  done();
                  initCalendar();
                }
              });
            })
            .catch(console.log);
        }
      });
    }
  });
};

// 公共逻辑抽取
const commonActionFn = (newStatus, title, row, cb?) => {
  showMessageBox(`确认要${title}吗?`)
    .then(() => {
      updateTaskStatus({ ...row, newStatus }).then(({ data }) => {
        if (data) {
          message.success("操作成功");
          if (cb) cb();
          props.boardRef.changeUserName(props.boardRef.searchName);
        }
      });
    })
    .catch(() => {});
};

// 点击删除图标
const clickDelIcon = (item, taskIdx) => {
  const row = item.taskList[taskIdx];
  commonActionFn("4", `删除名称为${row.taskName}的任务`, row, () => {
    deleteTask({ id: row.id, parentId: row.parentId }).then((res) => {
      if (res.data) {
        message.success("删除成功");
        initCalendar();
      }
    });
  });
};

const searchData = (searchName) => {
  console.log(searchName, "name===");
};

defineExpose({ searchData });
</script>

<style lang="scss">
$cell-height: 120px;
$weekColor: #57a3dc;
$color: var(--el-text-color-primary);
$borderColor: var(--el-card-border-color);

.tab-calendar {
  display: flex;
  width: calc(100vw - 40px);
  height: calc(100vh - 215px);
  flex-direction: column;
  overflow-y: auto;
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
        color: red;
        font-weight: bold;

        .task-list {
          font-weight: normal;
        }
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
        padding: 4px 8px;
        text-align: center;
        white-space: nowrap;
        cursor: pointer;
        border: 0.5px solid #ddd;

        &:hover,
        &.select {
          background: #fff;
        }

        .day {
          font-size: 18px;
          text-align: right;
        }

        .lunar {
          font-size: 12px;
          text-align: right;
          display: flex;
          justify-content: space-between;
          opacity: 0.7;
          margin-bottom: 8px;

          .icon {
            width: 50px;
            display: flex;
            justify-content: flex-start;
          }
        }

        .task-list {
          text-align: left;
          font-size: 12px;
          color: #409eff;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .passed {
          color: #ccc !important;
        }

        .day-cell_name {
          width: 100%;
        }
      }
    }
  }
}
</style>
