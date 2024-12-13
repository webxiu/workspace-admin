<template>
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="90px" class="demo-ruleForm" :size="formSize">
    <el-form-item label="年月" prop="yearAndMonth">
      <el-date-picker v-model="ruleForm.yearAndMonth" type="month" placeholder="选择年月" value-format="YYYY-MM" />
    </el-form-item>
    <el-form-item label="核算目标" prop="switchType">
      <el-select v-model="ruleForm.switchType" placeholder="选择核算目标">
        <el-option label="全部" value="all" />
        <el-option label="职员" value="clerk" />
        <el-option label="员工" value="staff" />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import dayjs from "dayjs";
import type { FormInstance } from "element-plus";
import { reactive, ref } from "vue";

interface RuleForm {
  yearAndMonth: string;
  switchType: string;
}

const formSize = "default";
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<RuleForm>({
  yearAndMonth: dayjs().add(-1, "month").format("YYYY-MM"),
  switchType: "all"
});

const rules = reactive({
  yearAndMonth: [{ required: true, message: "请选择年月", trigger: "change" }],
  switchType: [
    {
      required: true,
      message: "请选择核算目标",
      trigger: "change"
    }
  ]
});

defineExpose({ ruleFormRef, ruleForm });
</script>
