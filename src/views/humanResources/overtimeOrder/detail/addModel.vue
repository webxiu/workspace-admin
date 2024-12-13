<template>
  <el-form ref="overTimeFormRef" :model="formData" :rules="formRules" label-width="140px">
    <div class="flex">
      <el-form-item label="" prop="useList" label-width="0">
        <el-transfer
          v-model="formData.useList"
          :filter-method="filterMethod"
          @change="changeTransData"
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
            style="width: 175px"
            :clearable="false"
            v-model="formData.overtimeDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择加班日期"
          />
        </el-form-item>
        <el-form-item label="加班类型" prop="overtimeType">
          <el-select v-model="formData.overtimeType" placeholder="请选择加班类型" style="width: 175px" @change="changeOvertimeType">
            <el-option v-for="item in optionsData.optionList" :label="item.optionName" :value="item.optionValue" :key="item.optionValue" />
          </el-select>
        </el-form-item>
        <el-form-item label="加班时段" prop="overtimePeriod">
          <el-input style="display: none" v-model="formData.overtimePeriod" />
          <el-checkbox @change="changeMorning" v-model="formData.morningOvertime" label="上午" value="上午" />
          <el-checkbox @change="changeAfternoon" v-model="formData.afternoonOvertime" label="下午" value="下午" />
          <el-checkbox @change="changeEvening" v-model="formData.eveningOvertime" label="晚上" value="晚上" />
          <template #label>
            <span style="font-size: var(--el-form-label-font-size); font-weight: 700; color: var(--el-text-color-regular)">加班时段</span>
          </template>
        </el-form-item>
        <!-- 上午时段 -->
        <div style="display: flex" class="extra-el" v-if="formData.morningOvertime">
          <el-form-item label="上午时段" prop="morningStartHour" style="margin-right: 0">
            <el-select style="width: 60px" filterable clearable v-model="formData.morningStartHour" placeholder="时">
              <el-option v-for="item in startTimeHoursList" :label="item.optionName" :value="item.optionValue" :key="item.optionValue" />
            </el-select>
          </el-form-item>
          <el-form-item label=":" label-width="18px" prop="morningStartMinute" style="margin-right: 0">
            <el-select style="width: 60px" filterable clearable v-model="formData.morningStartMinute" placeholder="分">
              <el-option v-for="item in startTimeMinuteList" :label="item.optionName" :value="item.optionValue" :key="item.optionValue" />
            </el-select>
          </el-form-item>
          <el-form-item label="~ " label-width="25px" prop="morningEndHour" style="margin-right: 0">
            <el-select style="width: 60px" filterable clearable v-model="formData.morningEndHour" placeholder="时">
              <el-option v-for="item in morningEndHoursList" :label="item.optionName" :value="item.optionValue" :key="item.optionValue" />
            </el-select>
          </el-form-item>
          <el-form-item label=":" label-width="18px" prop="morningEndMinute">
            <el-select style="width: 60px" filterable clearable v-model="formData.morningEndMinute" placeholder="分">
              <el-option v-for="item in startTimeMinuteList" :label="item.optionName" :value="item.optionValue" :key="item.optionValue" />
            </el-select>
          </el-form-item>
        </div>
        <!-- 下午时段 -->
        <div style="display: flex" class="extra-el" v-if="formData.afternoonOvertime">
          <el-form-item label="下午时段" prop="arvoStartHour" style="margin-right: 0">
            <el-select style="width: 60px" filterable clearable v-model="formData.arvoStartHour" placeholder="时">
              <el-option v-for="item in afternoonStartHoursList" :label="item.optionName" :value="item.optionValue" :key="item.optionValue" />
            </el-select>
          </el-form-item>
          <el-form-item label=":" label-width="18px" prop="arvoStartMinute" style="margin-right: 0">
            <el-select style="width: 60px" filterable clearable v-model="formData.arvoStartMinute" placeholder="分">
              <el-option v-for="item in startTimeMinuteList" :label="item.optionName" :value="item.optionValue" :key="item.optionValue" />
            </el-select>
          </el-form-item>
          <el-form-item label="~ " label-width="25px" prop="arvoEndHour" style="margin-right: 0">
            <el-select style="width: 60px" filterable clearable v-model="formData.arvoEndHour" placeholder="时">
              <el-option v-for="item in afternoonEndHoursList" :label="item.optionName" :value="item.optionValue" :key="item.optionValue" />
            </el-select>
          </el-form-item>
          <el-form-item label=":" label-width="18px" prop="arvoEndMinute">
            <el-select style="width: 60px" filterable clearable v-model="formData.arvoEndMinute" placeholder="分">
              <el-option v-for="item in startTimeMinuteList" :label="item.optionName" :value="item.optionValue" :key="item.optionValue" />
            </el-select>
          </el-form-item>
        </div>
        <!-- 晚上时段 -->
        <div style="display: flex" class="extra-el" v-if="formData.eveningOvertime">
          <el-form-item label="晚上时段" prop="eveningStartHour" style="margin-right: 0">
            <el-select style="width: 60px" filterable clearable v-model="formData.eveningStartHour" placeholder="时">
              <el-option v-for="item in eveningStartHoursList" :label="item.optionName" :value="item.optionValue" :key="item.optionValue" />
            </el-select>
          </el-form-item>
          <el-form-item label=":" label-width="18px" prop="eveningStartMinute" style="margin-right: 0">
            <el-select style="width: 60px" filterable clearable v-model="formData.eveningStartMinute" placeholder="分">
              <el-option v-for="item in startTimeMinuteList" :label="item.optionName" :value="item.optionValue" :key="item.optionValue" />
            </el-select>
          </el-form-item>
          <el-form-item label="~ " label-width="25px" prop="eveningEndHour" style="margin-right: 0">
            <el-select style="width: 60px" filterable clearable v-model="formData.eveningEndHour" placeholder="时">
              <el-option v-for="item in eveningEndHoursList" :label="item.optionName" :value="item.optionValue" :key="item.optionValue" />
            </el-select>
          </el-form-item>
          <el-form-item label=":" label-width="18px" prop="eveningEndMinute">
            <el-select style="width: 60px" filterable clearable v-model="formData.eveningEndMinute" placeholder="分">
              <el-option v-for="item in startTimeMinuteList" :label="item.optionName" :value="item.optionValue" :key="item.optionValue" />
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" placeholder="请输入备注" />
        </el-form-item>
      </div>
    </div>
  </el-form>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, watch } from "vue";
import { dayjs } from "element-plus";
import type { FormRules } from "element-plus";
import { getStaffDetail, selectUserDormitory, timeSettingList } from "@/api/oaManage/humanResources";

interface Props {
  optionsData: {
    userInfoList: any[];
    optionList: any[];
  };
  updateUserBack: (data) => void;
}

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
  morningOvertime: false,
  afternoonOvertime: false,
  eveningOvertime: false
});

// 两个时间差分钟数计算
function timeDifference(Stime, Ttime) {
  //判断开始时间是否大于结束日期
  if (Stime > Ttime) {
    console.log("开始时间不能大于结束时间！");
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

const changeOvertimeType = (val) => {
  formData.overtimePeriod = val;
  if (val !== "工作日加班") {
    formData.morningOvertime = true;
    formData.afternoonOvertime = true;
    formData.eveningOvertime = false;
  } else {
    formData.morningOvertime = false;
    formData.afternoonOvertime = false;

    // 清空上午和下午的时间段
    formData.morningStartHour = undefined;
    formData.morningStartMinute = undefined;
    formData.morningEndHour = undefined;
    formData.morningEndMinute = undefined;

    formData.arvoStartHour = undefined;
    formData.arvoStartMinute = undefined;
    formData.arvoEndHour = undefined;
    formData.arvoEndMinute = undefined;
  }
  formData.eveningOvertime = true;

  calcInitTimeOpts();
};

const changeMorning = (val) => {
  if (!val) {
    // 清空上午时段所有时间
    formData.morningStartHour = undefined;
    formData.morningStartMinute = undefined;
    formData.morningEndHour = undefined;
    formData.morningEndMinute = undefined;
  } else {
    formData.overtimePeriod = val;

    calcInitTimeOpts();
  }
};

const changeAfternoon = (val) => {
  if (!val) {
    // 清空下午时段所有时间
    formData.arvoStartHour = undefined;
    formData.arvoStartMinute = undefined;
    formData.arvoEndHour = undefined;
    formData.arvoEndMinute = undefined;
  } else {
    formData.overtimePeriod = val;

    calcInitTimeOpts();
  }
};

const changeEvening = (val) => {
  if (!val) {
    // 清空晚上时段所有时间
    formData.eveningStartHour = undefined;
    formData.eveningStartMinute = undefined;
    formData.eveningEndHour = undefined;
    formData.eveningEndMinute = undefined;
  } else {
    formData.overtimePeriod = val;
    calcInitTimeOpts();
  }
};

const calcInitTimeOpts = () => {
  if (formData.morningOvertime) {
    // 初始化
    formData.morningStartHour = "08";
    formData.morningStartMinute = "00";
    formData.morningEndHour = "11";
    formData.morningEndMinute = "45";
  }
  if (formData.afternoonOvertime) {
    // 初始化
    formData.arvoStartHour = "13";
    formData.arvoStartMinute = "00";
    formData.arvoEndHour = "17";
    formData.arvoEndMinute = "15";
  }
  if (formData.eveningOvertime) {
    // 初始化
    formData.eveningStartHour = "18";
    formData.eveningStartMinute = "00";
    formData.eveningEndHour = "22";
    formData.eveningEndMinute = "00";
  }
};

// watch(formData, (newVal) => {
//   if (formData.morningOvertime) {
//     // 初始化
//     formData.morningStartHour = "08";
//     formData.morningStartMinute = "00";
//     formData.morningEndHour = "11";
//     formData.morningEndMinute = "45";
//   }
//   if (formData.afternoonOvertime) {
//     // 初始化
//     formData.arvoStartHour = "13";
//     formData.arvoStartMinute = "00";
//     formData.arvoEndHour = "17";
//     formData.arvoEndMinute = "15";
//   }
//   if (formData.eveningOvertime) {
//     // 初始化
//     formData.eveningStartHour = "18";
//     formData.eveningStartMinute = "00";
//     formData.eveningEndHour = "22";
//     formData.eveningEndMinute = "00";
//   }
// });

const startTimeHoursList = [];
for (let i = 8; i < 13; i++) {
  let numStr = "";
  if (i < 10) {
    numStr = "0" + i;
  } else {
    numStr = "" + i;
  }
  startTimeHoursList.push({ optionName: numStr, optionValue: numStr });
}

const afternoonStartHoursList = [];
for (let i = 12; i < 18; i++) {
  let numStr = "";
  if (i < 10) {
    numStr = "0" + i;
  } else {
    numStr = "" + i;
  }
  afternoonStartHoursList.push({ optionName: numStr, optionValue: numStr });
}

const afternoonEndHoursList = [];
for (let i = 12; i < 24; i++) {
  let numStr = "";
  if (i < 10) {
    numStr = "0" + i;
  } else {
    numStr = "" + i;
  }
  afternoonEndHoursList.push({ optionName: numStr, optionValue: numStr });
}

const morningEndHoursList = [];
for (let i = 8; i < 15; i++) {
  let numStr = "";
  if (i < 10) {
    numStr = "0" + i;
  } else {
    numStr = "" + i;
  }
  morningEndHoursList.push({ optionName: numStr, optionValue: numStr });
}

const eveningStartHoursList = [];
for (let i = 16; i < 24; i++) {
  let numStr = "";
  if (i < 10) {
    numStr = "0" + i;
  } else {
    numStr = "" + i;
  }
  eveningStartHoursList.push({ optionName: numStr, optionValue: numStr });
}

const eveningEndHoursList = [
  { optionName: "18", optionValue: "18" },
  { optionName: "19", optionValue: "19" },
  { optionName: "20", optionValue: "20" },
  { optionName: "21", optionValue: "21" },
  { optionName: "22", optionValue: "22" },
  { optionName: "23", optionValue: "23" },
  { optionName: "01", optionValue: "01" },
  { optionName: "02", optionValue: "02" },
  { optionName: "03", optionValue: "03" },
  { optionName: "04", optionValue: "04" },
  { optionName: "05", optionValue: "05" },
  { optionName: "06", optionValue: "06" },
  { optionName: "07", optionValue: "07" }
];

const startTimeMinuteList = [];
for (let i = 0; i < 60; i++) {
  if (i % 5 === 0) {
    let numStr = "";
    if (i < 10) {
      numStr = "0" + i;
    } else {
      numStr = "" + i;
    }
    startTimeMinuteList.push({ optionName: numStr, optionValue: numStr });
  }
}

const props = withDefaults(defineProps<Props>(), {
  optionsData: () => ({
    userInfoList: [],
    optionList: []
  }),
  updateUserBack: (data) => {}
});

console.log(props.optionsData.userInfoList, "userInfoList");

const overTimeFormRef = ref();

const formRules = reactive<FormRules>({
  useList: [{ required: true, message: "请选择加班人员", trigger: "blur" }],
  overtimeType: [{ required: true, message: "请选择加班类型", trigger: "blur" }],
  overtimePeriod: [{ required: true, message: "请选择加班时段", trigger: "blur" }],
  overtimeDate: [{ required: true, message: "请选择开始日期", trigger: "blur" }],
  eveningStartHour: [{ required: true, message: "时间段必填", trigger: "blur" }],
  eveningStartMinute: [{ required: true, message: "时间段必填", trigger: "blur" }],
  eveningEndHour: [{ required: true, message: "时间段必填", trigger: "blur" }],
  eveningEndMinute: [{ required: true, message: "时间段必填", trigger: "blur" }],
  morningStartHour: [{ required: true, message: "时间段必填", trigger: "blur" }],
  morningStartMinute: [{ required: true, message: "时间段必填", trigger: "blur" }],
  morningEndHour: [{ required: true, message: "时间段必填", trigger: "blur" }],
  morningEndMinute: [{ required: true, message: "时间段必填", trigger: "blur" }],
  arvoStartHour: [{ required: true, message: "时间段必填", trigger: "blur" }],
  arvoStartMinute: [{ required: true, message: "时间段必填", trigger: "blur" }],
  arvoEndHour: [{ required: true, message: "时间段必填", trigger: "blur" }],
  arvoEndMinute: [{ required: true, message: "时间段必填", trigger: "blur" }]
});

const filterMethod = (query, item) => {
  return (item.userName + (item.groupName ?? "")).toLowerCase().includes(query.toLowerCase());
};

const changeTransData = (val) => {
  // if (Array.isArray(val) && val.length) {
  //   selectUserDormitory({ userCode: val[0] }).then((res: any) => {
  //     getStaffDetail({ id: res.data[0]?.id }).then((res: any) => {
  //       const workRuleId = res.data?.workRuleId;
  //       timeSettingList({ page: 1, limit: 10000 }).then((res) => {
  //         if (res.data && res.data.length) {
  //           const workTimeInfo = res.data.find((item) => item.id === workRuleId);
  //           const startTimeArr = workTimeInfo.forenoonStart.split(":");
  //           formData.startTimeHours = startTimeArr[0];
  //           formData.startTimeMinute = startTimeArr[1];
  //           const endTimeArr = workTimeInfo.afternoonEnd.split(":");
  //           formData.endTimeHours = endTimeArr[0];
  //           formData.endTimeMinute = endTimeArr[1];
  //         }
  //       });
  //     });
  //   });
  // }
};

const calcEndDate = computed(() => {
  let initEndDate = formData.overtimeDate;
  if (formData.eveningStartHour && formData.eveningEndHour) {
    if (formData.eveningStartHour > formData.eveningEndHour) {
      initEndDate = dayjs(formData.overtimeDate).add(1, "day").format("YYYY-MM-DD");
    }
  }
  return initEndDate;
});

// 获取最小|最大时间
const getMinMax = (timeList, type: "min" | "max") => {
  const list = timeList.filter((el) => el.hours && el.minute).map((m) => +m.hours);
  const num = type === "min" ? Math.min(...list) : Math.max(...list);
  const result = timeList.find((el) => +el.hours === num);
  return result;
};

const calcStartTime = computed(() => {
  const timeList = [
    { hours: formData.morningStartHour, minute: formData.morningStartMinute },
    { hours: formData.arvoStartHour, minute: formData.arvoStartMinute },
    { hours: formData.eveningStartHour, minute: formData.eveningStartMinute }
  ];
  const minInfo = getMinMax(timeList, "min");
  if (formData.eveningOvertime && !formData.morningOvertime && !formData.afternoonOvertime) {
    return formData.eveningStartHour + ":" + formData.eveningStartMinute;
  }
  if (minInfo) {
    return minInfo.hours + ":" + minInfo.minute;
  }
  return "";
});

const calcEndTime = computed(() => {
  const timeList = [
    { hours: formData.morningEndHour, minute: formData.morningEndMinute },
    { hours: formData.arvoEndHour, minute: formData.arvoEndMinute },
    { hours: formData.eveningEndHour, minute: formData.eveningEndMinute }
  ];
  const maxInfo = getMinMax(timeList, "max");
  if (maxInfo) {
    return maxInfo.hours + ":" + maxInfo.minute;
  }
  if (formData.eveningOvertime && !formData.afternoonOvertime && !formData.morningOvertime) {
    return formData.eveningEndHour + ":" + formData.eveningEndMinute;
  }
  return "";
});

const calcDays = computed(() => {
  const initDay = calcHours.value / 8;
  return parseFloat(initDay.toFixed(2));
});

const calcHours = computed(() => {
  let initHours = 0;
  const morningStartTime = formData.morningStartHour && formData.morningStartMinute ? formData.morningStartHour + ":" + formData.morningStartMinute : "";
  const morningEndTime = formData.morningEndHour && formData.morningEndMinute ? formData.morningEndHour + ":" + formData.morningEndMinute : "";

  const afternoonStartTime = formData.arvoStartHour && formData.arvoStartMinute ? formData.arvoStartHour + ":" + formData.arvoStartMinute : "";
  const afternoonEndTime = formData.arvoEndHour && formData.arvoEndMinute ? formData.arvoEndHour + ":" + formData.arvoEndMinute : "";

  const eveningStartTime = formData.eveningStartHour && formData.eveningStartMinute ? formData.eveningStartHour + ":" + formData.eveningStartMinute : "";
  const eveningEndTime = formData.eveningEndHour && formData.eveningEndMinute ? formData.eveningEndHour + ":" + formData.eveningEndMinute : "";

  const morningTotalHours = timeDifference(formData.overtimeDate + " " + morningStartTime, formData.overtimeDate + " " + morningEndTime);
  const afternoonTotalHours = timeDifference(formData.overtimeDate + " " + afternoonStartTime, formData.overtimeDate + " " + afternoonEndTime);
  const eveningTotalHours = timeDifference(formData.overtimeDate + " " + eveningStartTime, calcEndDate.value + " " + eveningEndTime);
  initHours = +morningTotalHours + +afternoonTotalHours + +eveningTotalHours;
  return parseFloat((initHours / 60).toFixed(2));
});

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
        morningOvertime: formData.morningOvertime,
        afternoonOvertime: formData.afternoonOvertime,
        eveningOvertime: formData.eveningOvertime,
        hours: calcHours.value,

        morningStartTime: formData.morningStartHour && formData.morningStartMinute ? formData.morningStartHour + ":" + formData.morningStartMinute : "",
        morningEndTime: formData.morningEndHour && formData.morningEndMinute ? formData.morningEndHour + ":" + formData.morningEndMinute : "",
        afternoonStartTime: formData.arvoStartHour && formData.arvoStartMinute ? formData.arvoStartHour + ":" + formData.arvoStartMinute : "",
        afternoonEndTime: formData.arvoEndHour && formData.arvoEndMinute ? formData.arvoEndHour + ":" + formData.arvoEndMinute : "",
        eveningStartTime: formData.eveningStartHour && formData.eveningStartMinute ? formData.eveningStartHour + ":" + formData.eveningStartMinute : "",
        eveningEndTime: formData.eveningEndHour && formData.eveningEndMinute ? formData.eveningEndHour + ":" + formData.eveningEndMinute : ""
      };
    });
  return { overTimeFormRef, overTimeApplyDTOList };
}

defineExpose({ getRef });
</script>

<style lang="scss">
// .extra-el {
//   .el-form-item.is-required:not(.is-no-asterisk).asterisk-left > .el-form-item__label-wrap > .el-form-item__label:before,
//   .el-form-item.is-required:not(.is-no-asterisk).asterisk-left > .el-form-item__label:before {
//     content: "";
//     color: var(--el-color-danger);
//     margin-right: 4px;
//   }
// }
</style>
