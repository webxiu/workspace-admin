<!-- /*
 * @Author: lixiuhai 
 * @Date: 2023-06-29 16:50:01 
 * @Last Modified by:   lixiuhai 
 * @Last Modified time: 2023-06-29 16:50:01 
 */ -->
<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/config";
import { FormProps } from "./utils/types";
import TitleCate from "@/components/TitleCate.vue";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({}),
  formConfigs: () => []
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
const formConfigs = ref(props.formConfigs);

function getRef() {
  return ruleFormRef.value;
}
defineExpose({ getRef });
</script>

<template>
  <el-form ref="ruleFormRef" :model="newFormInline" :rules="formRules" label-width="160px" label-suffix=":">
    <el-row :gutter="20">
      <template :key="item.prop" v-for="item in formConfigs">
        <el-col :span="item.span">
          <TitleCate v-if="item.hide" :name="item.label" />
          <el-form-item v-else :label="item.label" :prop="item.prop">
            <el-select v-if="item.options" v-model="newFormInline[item.prop]" :disabled="item.disabled" placeholder="请选择" :style="{ width: '100%', minWidth: '100px' }">
              <el-option v-for="cell in item.options" :key="cell.value" :label="cell.label" :value="cell.value" />
            </el-select>
            <el-input v-else v-model="newFormInline[item.prop]" :disabled="item.disabled" clearable placeholder="请输入" :style="{ width: '100%', minWidth: '100px' }" />
          </el-form-item>
        </el-col>
      </template>
    </el-row>
  </el-form>
</template>
