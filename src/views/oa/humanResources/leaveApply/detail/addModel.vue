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
          <el-date-picker v-model="formData.startDate" type="date" @change="changeStartDate" value-format="YYYY-MM-DD" placeholder="请选择开始日期" />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-time-picker v-model="formData.startTime" value-format="HH:mm" @change="changeStartTime" placeholder="请选择开始时间" />
        </el-form-item>
        <el-form-item label="结束日期" prop="endDate">
          <el-date-picker v-model="formData.endDate" type="date" value-format="YYYY-MM-DD" placeholder="请选择结束日期" :disabled-date="disabledDate" />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-time-picker v-model="formData.endTime" value-format="HH:mm" placeholder="请选择结束时间" :disabled-hours="disabledHours" />
        </el-form-item>
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
import { useUserStore } from "@/store/modules/user";
import { deptUserInfo, getStaffDetail, selectUserDormitory, timeSettingList } from "@/api/oaManage/humanResources";

interface Props {
  optionsData: {
    deptUserInfoList: any[];
    optionList: any[];
  };
  updateUserBack: (data) => void;
}

const props = withDefaults(defineProps<Props>(), {
  optionsData: () => ({
    deptUserInfoList: [],
    optionList: []
  }),
  updateUserBack: (data) => {}
});

const data = ref([]);
const holidayFormRef = ref();
const userStore = useUserStore();

const disabledDate = (time) => {
  return time.getTime() < dayjs(formData.startDate).valueOf();
};

const formData = reactive({
  useList: [],
  holidayType: "",
  startDate: dayjs(new Date()).format("YYYY-MM-DD"),
  endDate: dayjs(new Date()).format("YYYY-MM-DD"),
  startTime: "",
  endTime: "",
  remark: ""
});

const formRules = reactive<FormRules>({
  useList: [{ required: true, message: "请选择请假人员", trigger: "blur" }],
  holidayType: [{ required: true, message: "请选择请假类型", trigger: "blur" }],
  startDate: [{ required: true, message: "请选择开始日期", trigger: "blur" }],
  startTime: [{ required: true, message: "请选择开始时间", trigger: "blur" }],
  endDate: [{ required: true, message: "请选择结束日期", trigger: "blur" }],
  endTime: [{ required: true, message: "请选择结束时间", trigger: "blur" }]
});

const changeTransData = (val) => {
  if (Array.isArray(val) && val.length) {
    selectUserDormitory({ userCode: val[0] }).then((res: any) => {
      getStaffDetail({ id: res.data[0]?.id }).then((res: any) => {
        const workRuleId = res.data?.workRuleId;
        timeSettingList({ page: 1, limit: 10000 }).then((res) => {
          if (res.data && res.data.length) {
            const workTimeInfo = res.data.find((item) => item.id === workRuleId);
            formData.startTime = workTimeInfo.forenoonStart;
            formData.endTime = workTimeInfo.afternoonEnd;
          }
        });
      });
    });
  }
};

const changeStartDate = (val) => (formData.endDate = val);

const changeStartTime = (val) => (formData.startTime = val);

const makeRange = (start: number, end: number, type?: string) => {
  const result: number[] = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};
const disabledHours = () => {
  if (formData.startTime) {
    const startDevideHour = formData.startTime.split(":")[0];
    return makeRange(0, +startDevideHour);
  }
};

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
        startTime: formData.startTime,
        endDate: formData.endDate,
        endTime: formData.endTime,
        days: "",
        hours: ""
      };
    });
  return { holidayFormRef, askForLeaveDTOList };
}

defineExpose({ getRef });
</script>
