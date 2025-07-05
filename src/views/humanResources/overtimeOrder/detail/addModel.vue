<template>
  <el-form ref="overTimeFormRef" :model="formData" :rules="formRules" label-width="140px">
    <div class="flex">
      <el-form-item label="" prop="useList" label-width="0">
        <el-transfer
          v-model="formData.useList"
          :filter-method="filterMethod"
          :data="optionsData.userInfoList"
          filterable
          class="flex-1 no-wrap"
          filter-placeholder="搜索关键词"
          :titles="['部门人员 ', '加班人员']"
          :props="{ label: 'userName', key: 'userCode' }"
        >
          <template #default="{ option }">
            <span>
              {{ option.userName }}
              <span v-if="option.groupName">({{ option.groupName }})</span>
            </span>
          </template>
        </el-transfer>
      </el-form-item>
      <div>
        <el-form-item label="加班日期" prop="overtimeDate">
          <el-date-picker
            style="width: 100%"
            :clearable="false"
            v-model="formData.overtimeDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择加班日期"
          />
        </el-form-item>
        <el-form-item label="加班类型" prop="overtimeType">
          <el-select v-model="formData.overtimeType" placeholder="请选择加班类型" style="width: 100%" @change="changeOvertimeType">
            <el-option v-for="item in optionsData.optionList" :label="item.optionName" :value="item.optionValue" :key="item.optionValue" />
          </el-select>
        </el-form-item>
        <el-form-item label="加班时段" prop="overtimePeriod">
          <el-input style="display: none" v-model="formData.overtimePeriod" />
          <el-checkbox
            v-for="(item, i) in overTimeOption"
            @change="(v) => onChangeOverTime(v, item)"
            v-model="formDataSlice[item.prop]"
            :disabled="formData.overtimeType === '工作日加班' && ['上午', '下午'].includes(item.label)"
            :label="item.label"
            :value="item.label"
            :style="{ marginRight: i === overTimeOption.length - 1 ? 0 : '10px' }"
          />
          <template #label>
            <span style="font-size: var(--el-form-label-font-size); font-weight: 700; color: var(--el-text-color-regular)">加班时段</span>
          </template>
        </el-form-item>
        <!-- 各个时段列表 -->
        <template v-for="option in overTimeRangeList" :key="option.rangeProp" style="display: flex" class="extra-el">
          <div style="display: flex" class="extra-el" v-if="formDataSlice[option.rangeProp]">
            <el-form-item :label="option.rangeName" :prop="option.startHour" style="margin-right: 0">
              <el-select style="width: 71px" filterable clearable v-model="formData[option.startHour]" placeholder="时">
                <el-option v-for="item in option.startHourList" :label="item.optionName" :value="item.optionValue" :key="item.optionValue" />
              </el-select>
            </el-form-item>
            <el-form-item label=":" label-width="20px" :prop="option.startMinute" style="margin-right: 0">
              <el-select style="width: 71px" filterable clearable v-model="formData[option.startMinute]" placeholder="分">
                <el-option v-for="item in option.startMinuteList" :label="item.optionName" :value="item.optionValue" :key="item.optionValue" />
              </el-select>
            </el-form-item>
            <el-form-item label=" ~ " label-width="25px" :prop="option.endHour" style="margin-right: 0">
              <el-select
                style="width: 71px"
                filterable
                clearable
                v-model="formData[option.endHour]"
                placeholder="时"
                @change="(v) => ['eveningOvertime'].includes(option.rangeProp) && changeEvenHour(v)"
              >
                <el-option v-for="item in option.endHourList" :label="item.optionName" :value="item.optionValue" :key="item.optionValue" />
              </el-select>
            </el-form-item>
            <el-form-item label=":" label-width="20px" :prop="option.endMinute">
              <el-select style="width: 71px" filterable clearable v-model="formData[option.endMinute]" placeholder="分">
                <el-option v-for="item in option.endMinuteList" :label="item.optionName" :value="item.optionValue" :key="item.optionValue" />
              </el-select>
            </el-form-item>
          </div>
        </template>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" placeholder="请输入备注" />
        </el-form-item>
      </div>
    </div>
  </el-form>
</template>

<script lang="ts" setup>
import { dayjs } from "element-plus";
import type { FormRules } from "element-plus";
import { computed, reactive, ref, onMounted } from "vue";
import { useLocalStorage } from "@/utils/storage";
import { message } from '@/utils/message';

interface Props {
  optionsData?: { userInfoList: any[]; optionList: any[] };
  rowUserData?: any;
}

const props = withDefaults(defineProps<Props>(), {
  optionsData: () => ({ userInfoList: [], optionList: [] })
});

const overTimeFormRef = ref();
const formData = reactive({
  useList: [],
  overtimeType: "",
  overtimePeriod: undefined,
  overtimeDate: dayjs(new Date()).format("YYYY-MM-DD"),
  remark: "",
  eveningStartHour: "",
  eveningStartMinute: "",
  eveningEndHour: "",
  eveningEndMinute: "",
  morningStartHour: "",
  morningStartMinute: "",
  morningEndHour: "",
  morningEndMinute: "",
  arvoStartHour: "",
  arvoStartMinute: "",
  arvoEndHour: "",
  arvoEndMinute: "",
  // 中午连班
  middleContinuousStartHour: "",
  middleContinuousStartMinute: "",
  middleContinuousEndHour: "",
  middleContinuousEndMinute: "",
  // 下午连班
  nightContinuousStartHour: "",
  nightContinuousStartMinute: "",
  nightContinuousEndHour: "",
  nightContinuousEndMinute: ""
});

// 加班时段多选
const formDataSlice = reactive({
  morningOvertime: false,
  afternoonOvertime: false,
  eveningOvertime: false,
  middayOvertime: false, // 中午连班
  nightfallOvertime: false // 下午连班
});

const formRules = reactive<FormRules>({
  useList: [{ required: true, message: "请选择加班人员", trigger: "blur" }],
  overtimeType: [{ required: true, message: "请选择加班类型", trigger: "blur" }],
  overtimePeriod: [{ required: true, message: "请选择加班时段", trigger: "blur" }],
  overtimeDate: [{ required: true, message: "请选择开始日期", trigger: "blur" }],
  morningStartHour: [{ required: true, message: "时间段必填", trigger: "blur" }], // 上午时段
  morningStartMinute: [{ required: true, message: "时间段必填", trigger: "blur" }],
  morningEndHour: [{ required: true, message: "时间段必填", trigger: "blur" }],
  morningEndMinute: [{ required: true, message: "时间段必填", trigger: "blur" }],
  arvoStartHour: [{ required: true, message: "时间段必填", trigger: "blur" }], // 下午时段
  arvoStartMinute: [{ required: true, message: "时间段必填", trigger: "blur" }],
  arvoEndHour: [{ required: true, message: "时间段必填", trigger: "blur" }],
  arvoEndMinute: [{ required: true, message: "时间段必填", trigger: "blur" }],
  eveningStartHour: [{ required: true, message: "时间段必填", trigger: "blur" }], // 晚上时段
  eveningStartMinute: [{ required: true, message: "时间段必填", trigger: "blur" }],
  eveningEndHour: [{ required: true, message: "时间段必填", trigger: "blur" }],
  eveningEndMinute: [{ required: true, message: "时间段必填", trigger: "blur" }],
  middleContinuousStartHour: [{ required: true, message: "时间段必填", trigger: "blur" }], // 中午连班
  middleContinuousStartMinute: [{ required: true, message: "时间段必填", trigger: "blur" }],
  middleContinuousEndHour: [{ required: true, message: "时间段必填", trigger: "blur" }],
  middleContinuousEndMinute: [{ required: true, message: "时间段必填", trigger: "blur" }],
  nightContinuousStartHour: [{ required: true, message: "时间段必填", trigger: "blur" }], // 下午连班
  nightContinuousStartMinute: [{ required: true, message: "时间段必填", trigger: "blur" }],
  nightContinuousEndHour: [{ required: true, message: "时间段必填", trigger: "blur" }],
  nightContinuousEndMinute: [{ required: true, message: "时间段必填", trigger: "blur" }]
});

const overTimeOption = [
  { label: "上午", prop: "morningOvertime" },
  { label: "下午", prop: "afternoonOvertime" },
  { label: "晚上", prop: "eveningOvertime" },
  { label: "中午连班", prop: "middayOvertime" },
  { label: "下午连班", prop: "nightfallOvertime" }
];

const timeSlice = getRangeTimes(0, 25); // 00点到24点
const minuteOption = getDistanceTime(60, 5); // 60分钟内, 每个隔5分钟的列表
const timeStr = "18,19,20,21,22,23,24,00,01,02,03,04,05,06,07"; // 18点到07点
const eveningEndHoursList = timeStr.split(",").map((i) => ({ optionName: i, optionValue: i }));
const useStorage = useLocalStorage<typeof defData>("__overTime_range");
const defData = useStorage.getItem();

const overTimeRangeList = reactive([
  {
    rangeName: "上午时段",
    rangeProp: "morningOvertime",
    startHour: "morningStartHour",
    startMinute: "morningStartMinute",
    startHourList: timeSlice.slice(7, 13), // 07-12点
    startMinuteList: minuteOption,
    endHour: "morningEndHour",
    endMinute: "morningEndMinute",
    endHourList: timeSlice.slice(7, 15), // 07-14点
    endMinuteList: minuteOption
  },
  {
    rangeName: "下午时段",
    rangeProp: "afternoonOvertime",
    startHour: "arvoStartHour",
    startMinute: "arvoStartMinute",
    startHourList: timeSlice.slice(12, 19), // 12-18点
    startMinuteList: minuteOption,
    endHour: "arvoEndHour",
    endMinute: "arvoEndMinute",
    endHourList: timeSlice.slice(12, 25), // 12-24点
    endMinuteList: minuteOption
  },
  {
    rangeName: "晚上时段",
    rangeProp: "eveningOvertime",
    startHour: "eveningStartHour",
    startMinute: "eveningStartMinute",
    startHourList: timeSlice.slice(16, 25), // 16-24点
    startMinuteList: minuteOption,
    endHour: "eveningEndHour",
    endMinute: "eveningEndMinute",
    endHourList: eveningEndHoursList,
    endMinuteList: minuteOption
  },
  {
    rangeName: "中午连班",
    rangeProp: "middayOvertime",
    startHour: "middleContinuousStartHour",
    startMinute: "middleContinuousStartMinute",
    startHourList: timeSlice.slice(11, 13), // 11-12点
    startMinuteList: minuteOption,
    endHour: "middleContinuousEndHour",
    endMinute: "middleContinuousEndMinute",
    endHourList: timeSlice.slice(12, 15), // 12-14点
    endMinuteList: minuteOption
  },

  {
    rangeName: "下午连班",
    rangeProp: "nightfallOvertime",
    startHour: "nightContinuousStartHour",
    startMinute: "nightContinuousStartMinute",
    startHourList: timeSlice.slice(17, 19), // 17-18点
    startMinuteList: minuteOption,
    endHour: "nightContinuousEndHour",
    endMinute: "nightContinuousEndMinute",
    endHourList: timeSlice.slice(17, 20), // 17-19点
    endMinuteList: minuteOption
  }
]);

// 计算结束日期
const calcEndDate = computed(() => {
  let initEndDate = formData.overtimeDate;
  if (formData.eveningStartHour && formData.eveningEndHour) {
    if (formData.eveningStartHour > formData.eveningEndHour) {
      initEndDate = dayjs(formData.overtimeDate).add(1, "day").format("YYYY-MM-DD");
    }
  }
  return initEndDate;
});

// 计算开始时间
const calcStartTime = computed(() => {
  const timeList = [
    { hours: formData.morningStartHour, minute: formData.morningStartMinute },
    { hours: formData.arvoStartHour, minute: formData.arvoStartMinute },
    { hours: formData.eveningStartHour, minute: formData.eveningStartMinute },
    { hours: formData.middleContinuousStartHour, minute: formData.middleContinuousStartMinute },
    { hours: formData.nightContinuousStartHour, minute: formData.nightContinuousStartMinute }
  ];
  const minInfo = getMinMax(timeList, "min");
  if (minInfo) return minInfo.hours + ":" + minInfo.minute;
  return "";
});

// 计算结束时间
const calcEndTime = computed(() => {
  const timeList = [
    { hours: formData.morningEndHour, minute: formData.morningEndMinute },
    { hours: formData.arvoEndHour, minute: formData.arvoEndMinute },
    { hours: formData.eveningEndHour, minute: formData.eveningEndMinute },
    { hours: formData.middleContinuousEndHour, minute: formData.middleContinuousEndMinute },
    { hours: formData.nightContinuousEndHour, minute: formData.nightContinuousEndMinute }
  ];
  const maxInfo = getMinMax(timeList, "max");
  if (maxInfo) return maxInfo.hours + ":" + maxInfo.minute;
  return "";
});

// 计算天数
const calcDays = computed(() => {
  const initDay = calcHours.value / 8;
  return parseFloat(initDay.toFixed(2));
});

// 计算总时长(小时)
const calcHours = computed(() => {
  let initHours = 0;
  const morningStartTime = joinTime(formData.morningStartHour, formData.morningStartMinute);
  const morningEndTime = joinTime(formData.morningEndHour, formData.morningEndMinute);

  const afternoonStartTime = joinTime(formData.arvoStartHour, formData.arvoStartMinute);
  const afternoonEndTime = joinTime(formData.arvoEndHour, formData.arvoEndMinute);

  const eveningStartTime = joinTime(formData.eveningStartHour, formData.eveningStartMinute);
  const eveningEndTime = joinTime(formData.eveningEndHour, formData.eveningEndMinute);

  const middleContinuousStartTime = joinTime(formData.middleContinuousStartHour, formData.middleContinuousStartMinute);
  const middleContinuousEndTime = joinTime(formData.middleContinuousEndHour, formData.middleContinuousEndMinute);

  const nightContinuousStartTime = joinTime(formData.nightContinuousStartHour, formData.nightContinuousStartMinute);
  const nightContinuousEndTime = joinTime(formData.nightContinuousEndHour, formData.nightContinuousEndMinute);

  const morningTotalHours = timeDifference(formData.overtimeDate + " " + morningStartTime, formData.overtimeDate + " " + morningEndTime);
  const afternoonTotalHours = timeDifference(formData.overtimeDate + " " + afternoonStartTime, formData.overtimeDate + " " + afternoonEndTime);
  const eveningTotalHours = timeDifference(formData.overtimeDate + " " + eveningStartTime, calcEndDate.value + " " + eveningEndTime);
  const noonTotalHours = timeDifference(formData.overtimeDate + " " + middleContinuousStartTime, formData.overtimeDate + " " + middleContinuousEndTime);
  const afterTotalHours = timeDifference(formData.overtimeDate + " " + nightContinuousStartTime, calcEndDate.value + " " + nightContinuousEndTime);

  initHours = +morningTotalHours + +afternoonTotalHours + +eveningTotalHours + +noonTotalHours + +afterTotalHours;
  return parseFloat((initHours / 60).toFixed(2));
});

onMounted(() => {
  initEditData();
});

// 初始化数据
const initEditData = () => {
  if (props.rowUserData) {
    formData.overtimeType = props.rowUserData.overtimeType;
    formData.overtimeDate = props.rowUserData.startDate;
    formData.remark = props.rowUserData.remark;
    formData.useList = [props.rowUserData.staffCode];

    formDataSlice.morningOvertime = props.rowUserData.morningOvertime;
    formDataSlice.afternoonOvertime = props.rowUserData.afternoonOvertime;
    formDataSlice.eveningOvertime = props.rowUserData.eveningOvertime;
    formDataSlice.middayOvertime = props.rowUserData.middayOvertime;
    formDataSlice.nightfallOvertime = props.rowUserData.nightfallOvertime;

    formData.overtimePeriod = props.rowUserData.overtimeType;

    if (props.rowUserData.morningOvertime) {
      formData.morningStartHour = props.rowUserData.morningStartTime.split(":")[0];
      formData.morningStartMinute = props.rowUserData.morningStartTime.split(":")[1];

      formData.morningEndHour = props.rowUserData.morningEndTime.split(":")[0];
      formData.morningEndMinute = props.rowUserData.morningEndTime.split(":")[1];
    }

    if (props.rowUserData.afternoonOvertime) {
      formData.arvoStartHour = props.rowUserData.afternoonStartTime.split(":")[0];
      formData.arvoStartMinute = props.rowUserData.afternoonStartTime.split(":")[1];

      formData.arvoEndHour = props.rowUserData.afternoonEndTime.split(":")[0];
      formData.arvoEndMinute = props.rowUserData.afternoonEndTime.split(":")[1];
    }

    if (props.rowUserData.eveningOvertime) {
      formData.eveningStartHour = props.rowUserData.eveningStartTime.split(":")[0];
      formData.eveningStartMinute = props.rowUserData.eveningStartTime.split(":")[1];

      formData.eveningEndHour = props.rowUserData.eveningEndTime.split(":")[0];
      formData.eveningEndMinute = props.rowUserData.eveningEndTime.split(":")[1];
    }
    // 中午连班
    if (props.rowUserData.middayOvertime) {
      formData.middleContinuousStartHour = props.rowUserData.middayStarttime.split(":")[0];
      formData.middleContinuousStartMinute = props.rowUserData.middayStarttime.split(":")[1];

      formData.middleContinuousEndHour = props.rowUserData.middayEndTime.split(":")[0];
      formData.middleContinuousEndMinute = props.rowUserData.middayEndTime.split(":")[1];
    }
    // 下午连班
    if (props.rowUserData.nightfallOvertime) {
      formData.nightContinuousStartHour = props.rowUserData.ninghtfallStarttime.split(":")[0];
      formData.nightContinuousStartMinute = props.rowUserData.ninghtfallStarttime.split(":")[1];

      formData.nightContinuousEndHour = props.rowUserData.nightfallEndTime.split(":")[0];
      formData.nightContinuousEndMinute = props.rowUserData.nightfallEndTime.split(":")[1];
    }
  }
};

// 获取最小|最大时间
const getMinMax = (timeList, type: "min" | "max") => {
  const list = timeList.filter((el) => el.hours && el.minute).map((m) => +m.hours);
  const num = type === "min" ? Math.min(...list) : Math.max(...list);
  const result = timeList.find((el) => +el.hours === num);
  return result;
};

// 两个时间差分钟数计算
function timeDifference(Stime, Ttime) {
  //判断开始时间是否大于结束日期
  if (Stime > Ttime) {
    console.log("开始时间不能大于结束时间！");
    message.error("开始时间不能大于结束时间");
    return false;
  }
  if (Ttime && Stime) {
    const startDate = new Date(Stime);
    const stopDate = new Date(Ttime);
    const startTime = startDate.getTime();
    const stopTime = stopDate.getTime();
    const cTime = Number(stopTime) - Number(startTime);
    const secondTime = cTime / 1000 / 60;
    return secondTime.toFixed(2);
  } else {
    return 0;
  }
}

const changeEvenHour = (val) => {
  formData.eveningEndMinute = "00";
};

const changeOvertimeType = (val) => {
  formData.overtimePeriod = !!val;
  if (val === "工作日加班") {
    setFormDataSliceCheck(["eveningOvertime"]); // 默认选中晚上
    clearformData("morning");
    clearformData("arvo");
    clearformData("middleContinuous");
    clearformData("nightContinuous");
  } else if (["休息日加班", "法定假加班", "特殊加班"].includes(val)) {
    setFormDataSliceCheck(["morningOvertime", "afternoonOvertime", "eveningOvertime"]); // 默认选中上午,下午,晚上
    clearformData("middleContinuous");
    clearformData("nightContinuous");
  }
  calcInitTimeOpts();
};

/** 按字段开头单词清空该字段数值 */
const clearformData = (firstWord?) => {
  Object.keys(formData).forEach((key) => {
    if (firstWord) {
      if (key.startsWith(firstWord)) formData[key] = undefined;
    } else {
      formData[key] = undefined;
    }
  });
};

/** 加班时设置指定选中,其他不选 */
const setFormDataSliceCheck = (include = []) => {
  Object.keys(formDataSlice).forEach((key) => {
    if (include.includes(key)) {
      formDataSlice[key] = true;
    } else {
      formDataSlice[key] = false;
    }
  });
};

/** 选择加班类型 */
const onChangeOverTime = (checked, item) => {
  // 字段单词前缀
  const periodMap = {
    上午: "morning",
    下午: "arvo",
    晚上: "evening",
    中午连班: "middleContinuous",
    下午连班: "nightContinuous"
  };
  const prefix = periodMap[item.label];
  if (prefix && !checked) {
    clearformData(prefix);
  } else if (checked) {
    calcInitTimeOpts();
  }
  const hasChecked = Object.values(formDataSlice).some((s) => s); // 加班时段是否有任意一个选中
  formData.overtimePeriod = hasChecked ? true : undefined;
};

const calcInitTimeOpts = () => {
  if (formDataSlice.morningOvertime) {
    // 默认值(上午)
    formData.morningStartHour = defData.morningStartHour || "08";
    formData.morningStartMinute = defData.morningStartMinute || "00";
    formData.morningEndHour = defData.morningEndHour || "11";
    formData.morningEndMinute = defData.morningEndMinute || "45";
  }
  if (formDataSlice.afternoonOvertime) {
    // 默认值(下午)
    formData.arvoStartHour = defData.arvoStartHour || "13";
    formData.arvoStartMinute = defData.arvoStartMinute || "00";
    formData.arvoEndHour = defData.arvoEndHour || "17";
    formData.arvoEndMinute = defData.arvoEndMinute || "15";
  }
  if (formDataSlice.eveningOvertime) {
    // 默认值(晚上)
    formData.eveningStartHour = defData.eveningStartHour || "18";
    formData.eveningStartMinute = defData.eveningStartMinute || "00";
    formData.eveningEndHour = defData.eveningEndHour || "22";
    formData.eveningEndMinute = defData.eveningEndMinute || "00";
  }
  if (formDataSlice.middayOvertime) {
    // 默认值(中午连班)
    formData.middleContinuousStartHour = defData.middleContinuousStartHour || "12";
    formData.middleContinuousStartMinute = defData.middleContinuousStartMinute || "00";
    formData.middleContinuousEndHour = defData.middleContinuousEndHour || "13";
    formData.middleContinuousEndMinute = defData.middleContinuousEndMinute || "00";
  }
  if (formDataSlice.nightfallOvertime) {
    // 默认值(下午连班)
    formData.nightContinuousStartHour = defData.nightContinuousStartHour || "17";
    formData.nightContinuousStartMinute = defData.nightContinuousStartMinute || "15";
    formData.nightContinuousEndHour = defData.nightContinuousEndHour || "18";
    formData.nightContinuousEndMinute = defData.nightContinuousEndMinute || "00";
  }
};

/** 根据开始时间获取制定长度列表 */
function getRangeTimes(start: number, length: number) {
  const result = Array.from({ length }, (_, i) => {
    const num = start + i;
    const val = `${num}`.padStart(2, "0");
    return { optionName: val, optionValue: val };
  });
  return result;
}

/** 根据最大时间获取间隔时间列表 */
function getDistanceTime(length: number, distance: number) {
  const result = Array.from({ length }, (_, i) => i)
    .filter((i) => i % distance === 0)
    .map((i) => {
      const val = i.toString().padStart(2, "0");
      return { optionName: val, optionValue: val };
    });
  return result;
}

const filterMethod = (query, item) => {
  return (item.userName + (item.groupName ?? "")).toLowerCase().includes(query.toLowerCase());
};

function joinTime(hour, minute) {
  return hour && minute ? `${hour}:${minute}` : "";
}

function getRef() {
  const overTimeApplyDTOList = props.optionsData.userInfoList
    .filter((item) => formData.useList.includes(item.userCode))
    .map((item) => {
      return {
        staffCode: item.userCode,
        deptId: item.deptId,
        staffId: item.id,
        staffName: item.userName,
        productLine: item.groupName,
        remark: formData.remark,
        overtimeType: formData.overtimeType,
        startDate: formData.overtimeDate,
        endDate: calcEndDate.value,
        startTime: calcStartTime.value,
        endTime: calcEndTime.value,
        days: calcDays.value,
        morningOvertime: formDataSlice.morningOvertime,
        afternoonOvertime: formDataSlice.afternoonOvertime,
        eveningOvertime: formDataSlice.eveningOvertime,
        middayOvertime: formDataSlice.middayOvertime, // 中午连班标识
        nightfallOvertime: formDataSlice.nightfallOvertime, // 午连班标识
        hours: calcHours.value,

        morningStartTime: joinTime(formData.morningStartHour, formData.morningStartMinute),
        morningEndTime: joinTime(formData.morningEndHour, formData.morningEndMinute),
        afternoonStartTime: joinTime(formData.arvoStartHour, formData.arvoStartMinute),
        afternoonEndTime: joinTime(formData.arvoEndHour, formData.arvoEndMinute),
        eveningStartTime: joinTime(formData.eveningStartHour, formData.eveningStartMinute),
        eveningEndTime: joinTime(formData.eveningEndHour, formData.eveningEndMinute),
        // 中午和下午连班数据
        middayStarttime: joinTime(formData.middleContinuousStartHour, formData.middleContinuousStartMinute),
        middayEndTime: joinTime(formData.middleContinuousEndHour, formData.middleContinuousEndMinute),
        ninghtfallStarttime: joinTime(formData.nightContinuousStartHour, formData.nightContinuousStartMinute),
        nightfallEndTime: joinTime(formData.nightContinuousEndHour, formData.nightContinuousEndMinute)
      };
    });
  useStorage.setItem({ ...formData });
  return { overTimeFormRef, overTimeApplyDTOList };
}

defineExpose({ getRef });
</script>
