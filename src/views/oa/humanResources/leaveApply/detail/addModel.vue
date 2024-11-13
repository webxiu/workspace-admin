<template>
  <el-form ref="holidayFormRef" :model="formData" :rules="formRules" label-width="140px">
    <div class="flex">
      <el-form-item label="" prop="useList" label-width="0">
        <el-transfer
          v-model="formData.useList"
          :filter-method="filterMethod"
          :data="optionsData.deptUserInfoList"
          filterable
          @change="changeTransData"
          class="flex-1 no-wrap"
          filter-placeholder="搜索关键词"
          :titles="['部门人员 ', '请假人员']"
          :props="{ label: 'userName', key: 'userCode' }"
        >
          <template #default="{ option }">
            <span>
              {{ option.userName }}
              <span v-if="option.groupName">({{ option.groupName }})</span>
            </span>
          </template></el-transfer
        >
      </el-form-item>
      <div>
        <el-form-item label="请假类型" prop="holidayType">
          <el-select v-model="formData.holidayType" placeholder="请选择请假类型" class="ui-w-100">
            <el-option v-for="item in optionsData.optionList" :label="item.optionName" :value="item.optionValue" :key="item.optionValue" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始日期" prop="startDate">
          <el-date-picker
            style="width: 100%"
            v-model="formData.startDate"
            type="date"
            @change="changeStartDate"
            value-format="YYYY-MM-DD"
            placeholder="请选择开始日期"
          />
        </el-form-item>
        <div style="display: flex">
          <el-form-item label="开始时间" prop="startTimeHours" style="margin-right: 0">
            <el-select style="width: 60px" filterable clearable v-model="formData.startTimeHours" placeholder="时">
              <el-option v-for="item in startTimeHoursList" :label="item.optionName" :value="item.optionValue" :key="item.optionValue" />
            </el-select>
          </el-form-item>
          <el-form-item label=":" :required="false" label-width="25px" prop="startTimeMinute">
            <el-select style="width: 60px" filterable clearable v-model="formData.startTimeMinute" placeholder="分">
              <el-option v-for="item in startTimeMinuteList" :label="item.optionName" :value="item.optionValue" :key="item.optionValue" />
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="结束日期" prop="endDate">
          <el-date-picker v-model="formData.endDate" type="date" value-format="YYYY-MM-DD" placeholder="请选择结束日期" :disabled-date="disabledDate" />
        </el-form-item>
        <div style="display: flex">
          <el-form-item label="结束时间" prop="endTimeHours" style="margin-right: 0">
            <el-select style="width: 60px" filterable clearable v-model="formData.endTimeHours" placeholder="时">
              <el-option v-for="item in startTimeHoursList" :label="item.optionName" :value="item.optionValue" :key="item.optionValue" />
            </el-select>
          </el-form-item>
          <el-form-item label=":" :required="false" label-width="25px" prop="endTimeMinute">
            <el-select style="width: 60px" filterable clearable v-model="formData.endTimeMinute" placeholder="分">
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
import { reactive, ref, watch } from "vue";
import { dayjs } from "element-plus";
import type { FormRules } from "element-plus";
import { getStaffDetail, selectUserDormitory, timeSettingList } from "@/api/oaManage/humanResources";

interface Props {
  optionsData: {
    deptUserInfoList: any[];
    optionList: any[];
  };
  updateUserBack: (data) => void;
}

const startTimeHoursList = [];
for (let i = 0; i < 24; i++) {
  let numStr = "";
  if (i < 10) {
    numStr = "0" + i;
  } else {
    numStr = "" + i;
  }
  startTimeHoursList.push({ optionName: numStr, optionValue: numStr });
}

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
    deptUserInfoList: [],
    optionList: []
  }),
  updateUserBack: (data) => {}
});

const holidayFormRef = ref();

const disabledDate = (time) => {
  return time.getTime() < dayjs(formData.startDate).valueOf();
};

const formData = reactive({
  useList: [],
  holidayType: "",
  startDate: dayjs(new Date()).format("YYYY-MM-DD"),
  endDate: dayjs(new Date()).format("YYYY-MM-DD"),
  remark: "",
  startTimeHours: "",
  startTimeMinute: "",
  endTimeHours: "",
  endTimeMinute: ""
});

const formRules = reactive<FormRules>({
  useList: [{ required: true, message: "请选择请假人员", trigger: "blur" }],
  holidayType: [{ required: true, message: "请选择请假类型", trigger: "blur" }],
  startDate: [{ required: true, message: "请选择开始日期", trigger: "blur" }],
  endDate: [{ required: true, message: "请选择结束日期", trigger: "blur" }],

  startTimeHours: [{ required: true, message: "请选择开始时间", trigger: "blur" }],
  startTimeMinute: [{ required: true, message: "请选择开始时间", trigger: "blur" }],
  endTimeHours: [{ required: true, message: "请选择结束时间", trigger: "blur" }],
  endTimeMinute: [{ required: true, message: "请选择结束时间", trigger: "blur" }]
});

const changeTransData = (val) => {
  if (Array.isArray(val) && val.length) {
    selectUserDormitory({ userCode: val[0] }).then((res: any) => {
      getStaffDetail({ id: res.data[0]?.id }).then((res: any) => {
        const workRuleId = res.data?.workRuleId;
        timeSettingList({ page: 1, limit: 10000 }).then((res) => {
          if (res.data && res.data.length) {
            const workTimeInfo = res.data.find((item) => item.id === workRuleId);
            const startTimeArr = workTimeInfo.forenoonStart.split(":");
            formData.startTimeHours = startTimeArr[0];
            formData.startTimeMinute = startTimeArr[1];

            const endTimeArr = workTimeInfo.afternoonEnd.split(":");
            formData.endTimeHours = endTimeArr[0];
            formData.endTimeMinute = endTimeArr[1];
          }
        });
      });
    });
  }
};

const changeStartDate = (val) => (formData.endDate = val);

watch(
  props,
  () => {
    console.log("props :>> ", props);
  },
  { immediate: true }
);
const filterMethod = (query, item) => {
  return (item.userName + (item.groupName ?? "")).toLowerCase().includes(query.toLowerCase());
};

function getRef() {
  const askForLeaveDTOList = props.optionsData.deptUserInfoList
    .filter((item) => formData.useList.includes(item.userCode))
    .map((item) => {
      return {
        userId: item.userCode,
        staffId: item.id,
        deptId: item.deptId,
        userName: item.userName,
        remark: formData.remark,
        holidayType: formData.holidayType,
        startDate: formData.startDate,
        startTime: formData.startTimeHours + ":" + formData.startTimeMinute,
        endDate: formData.endDate,
        endTime: formData.endTimeHours + ":" + formData.endTimeMinute,
        days: "",
        hours: ""
      };
    });
  return { holidayFormRef, askForLeaveDTOList };
}

defineExpose({ getRef });
</script>
