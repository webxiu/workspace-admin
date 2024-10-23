<template>
  <div class="wrap-handle-form">
    <EditForm
      ref="formRef"
      :formInline="formData"
      :formRules="formRules"
      :formProps="{ size: 'small', labelWidth: '100px' }"
      :formConfigs="formConfigs({ selectOpts, treeSelectData, changeTreeData, userList })"
    />
  </div>
</template>

<script setup>
import EditForm from "@/components/EditForm/index.vue";
import { formConfigs, formRules } from "./config";
import { onMounted, reactive, ref } from "vue";
import { getEnumDictList } from "@/utils/table";
import { getDeptOptions } from "@/utils/requestApi";
import { userInfoList } from "@/api/systemManage";

const formData = reactive({});
const selectOpts = ref([]);
const treeSelectData = ref([]);
const formRef = ref();
const userList = ref([]);

const changeTreeData = (val) => {
  formData.applyUserId = undefined;
  userInfoList({
    page: 1,
    limit: 100000,
    userState: "A",
    deptId: val,
    deptIdList: [val]
  }).then((res) => {
    if (res.data) {
      userList.value = res.data.records;
      console.log(userList.value, "userList.value==");
    }
  });
};

onMounted(() => {
  getEnumDictList(["HandleCategory", "NormalTestRequire"]).then((data) => {
    selectOpts.value = data;
  });

  getDeptOptions().then((data) => {
    treeSelectData.value = data;
  });
});

defineExpose({ formRef, formData });
</script>

<style lang="scss">
.wrap-handle-form {
  .el-form-item--small {
    margin-bottom: 8px !important;
  }
}
</style>
