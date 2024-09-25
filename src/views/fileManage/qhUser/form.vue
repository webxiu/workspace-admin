<script setup lang="ts">
import { ref, reactive, h, watch } from "vue";
import { FormRules } from "element-plus";
import { HandleType } from "./config";
import SelectUser from "./SelectUser.vue";
import { addDialog } from "@/components/ReDialog";

export interface FormDataItem {
  userCode: string;
  remark: string;
  newPassword: string;
  staffId: string;
  userName: string;
  userId?: number;
  delGroup?: string[];
}
interface FormProps {
  formInline: Partial<FormDataItem>;
  type: HandleType;
  resData?: any;
  setBackDelGroup?: (v) => void;
}

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({}),
  type: "add",
  setBackDelGroup: () => (v) => {},
  resData: () => ({})
});
interface Option {
  key: string;
  label: string;
  initial: string;
}

const generateData = () => {
  const data: Option[] = [];
  props.resData.allGroup?.forEach((item, index) => {
    data.push({
      label: item,
      key: item,
      initial: item
    });
  });
  return data;
};
const data = ref<Option[]>(generateData());
const userInGroup = ref(props.resData.userInGroup);

const ruleFormRef = ref();
const loading = ref<boolean>(false);
const formData = reactive<Partial<FormDataItem>>(props.formInline);
const formRules = reactive<FormRules>({
  userCode: [{ required: true, message: "账号为必填项", trigger: "blur" }],
  remark: [{ required: true, message: "描述为必填项", trigger: "blur" }],
  newPassword: [{ required: true, message: "密码为必填项", trigger: "blur" }]
});

const selectRowData = reactive({ userName: "", userCode: "", id: 0 });

watch(
  () => props.resData,
  (newVal, oldVal) => {
    console.log(newVal, "newVal");
    console.log(oldVal, "oldVal");
  }
);

const filterMethod = (query, item) => {
  return item.initial.toLowerCase().includes(query.toLowerCase());
};

const clickAccount = () => {
  const setA = (v) => {
    selectRowData.userCode = v.userCode;
    selectRowData.userName = v.userName;
    selectRowData.id = v.id;
  };
  addDialog({
    title: "选择用户",
    width: "900px",
    draggable: true,
    fullscreenIcon: true,
    closeOnClickModal: false,
    contentRenderer: () => h(SelectUser, { setA }),
    beforeSure: (done, { options }) => {
      formData.userName = selectRowData.userName;
      formData.staffId = selectRowData.userCode;
      done();
    }
  });
};

const changeRightArr = (curVal, align, keyArr) => {
  if (align === "left") {
    formData.delGroup = keyArr;
  }
};

const getRef = () => {
  return ruleFormRef.value;
};
defineExpose({ getRef, generateData, selectRowData, userInGroup });
</script>

<template>
  <el-form
    :label-width="type === 'edit' || type === 'resetPwd' ? 80 : 140"
    ref="ruleFormRef"
    :model="formData"
    :rules="formRules"
    v-loading="loading"
    class="pr-10"
  >
    <el-form-item v-if="type !== 'resetPwd'" label="账号" prop="userCode">
      <el-input v-model="formData.userCode" placeholder="请输入账号" />
    </el-form-item>

    <el-form-item v-if="type !== 'resetPwd'" label="描述" prop="remark">
      <el-input v-model="formData.remark" placeholder="请输入描述" />
    </el-form-item>

    <el-form-item v-if="type === 'add' || type === 'resetPwd'" label="密码" prop="newPassword">
      <el-input v-model="formData.newPassword" placeholder="请输入密码" />
    </el-form-item>

    <el-form-item v-if="type === 'edit'" label="用户账号" prop="staffId" @click="clickAccount">
      <el-input v-model="formData.staffId" placeholder="请选择用户账号" readonly />
    </el-form-item>

    <el-form-item v-if="type === 'edit'" label="用户姓名" prop="userName">
      <el-input v-model="formData.userName" placeholder="请填写用户姓名" readonly />
    </el-form-item>

    <el-transfer
      v-if="type === 'edit'"
      style="padding-left: 12px"
      v-model="userInGroup"
      filterable
      :filter-method="filterMethod"
      filter-placeholder="关键词搜索"
      :data="data"
      :titles="['全部组', '所在组']"
      @change="changeRightArr"
    />
  </el-form>
</template>
