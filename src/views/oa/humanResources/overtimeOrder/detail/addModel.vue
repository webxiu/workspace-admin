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
        <el-form-item label="加班类型" prop="overtimeType">
          <el-select v-model="formData.overtimeType" placeholder="请选择加班类型" class="ui-w-100">
            <el-option v-for="item in optionsData.optionList" :label="item.optionName" :value="item.optionValue" :key="item.optionValue" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始日期" prop="startDate">
          <el-date-picker v-model="formData.startDate" @change="changeStartDate" type="date" value-format="YYYY-MM-DD" placeholder="请选择开始日期" />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-time-picker v-model="formData.startTime" value-format="HH:mm" placeholder="请选择开始时间" />
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
    userInfoList: any[];
    optionList: any[];
  };
  updateUserBack: (data) => void;
}

// const props = withDefaults(defineProps<Props>(), {
//   userInfoList: () => [],
//   overTimeOption: () => []
// });

const props = withDefaults(defineProps<Props>(), {
  optionsData: () => ({
    userInfoList: [],
    optionList: []
  }),
  updateUserBack: (data) => {}
});

console.log(props.optionsData.userInfoList, "userInfoList");

const data = ref([]);
const overTimeFormRef = ref();
const userStore = useUserStore();

const disabledDate = (time) => {
  return time.getTime() < dayjs(formData.startDate).valueOf();
};

const formData = reactive({
  useList: [],
  overtimeType: "",
  startDate: dayjs(new Date()).format("YYYY-MM-DD"),
  endDate: dayjs(new Date()).format("YYYY-MM-DD"),
  startTime: "",
  endTime: "",
  remark: ""
});

const formRules = reactive<FormRules>({
  useList: [{ required: true, message: "请选择加班人员", trigger: "blur" }],
  overtimeType: [{ required: true, message: "请选择加班类型", trigger: "blur" }],
  startDate: [{ required: true, message: "请选择开始日期", trigger: "blur" }],
  startTime: [{ required: true, message: "请选择开始时间", trigger: "blur" }],
  endDate: [{ required: true, message: "请选择结束日期", trigger: "blur" }],
  endTime: [{ required: true, message: "请选择结束时间", trigger: "blur" }]
});

const filterMethod = (query, item) => {
  return (item.userName + (item.groupName ?? "")).toLowerCase().includes(query.toLowerCase());
};

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
        startDate: formData.startDate,
        startTime: formData.startTime,
        endDate: formData.endDate,
        endTime: formData.endTime,
        days: "",
        hours: ""
      };
    });
  return { overTimeFormRef, overTimeApplyDTOList };
}

defineExpose({ getRef });
</script>
