<template>
  <div class="pm-edit-page">
    <div class="pm-edit-btns">
      <div class="pm-left-text">基础信息</div>
      <el-space :size="16">
        <el-button size="small" type="primary" @click="onSave">保存</el-button>
        <el-button size="small" type="warning" @click="onSubmit">提交</el-button>
        <el-button size="small" type="default" @click="onBack">返回</el-button>
      </el-space>
    </div>
    <div class="pm-edit-top">
      <EditForm
        :formRules="formRules"
        :formProps="{ size: 'small' }"
        :formInline="formData"
        :formConfigs="formConfigs({ projectModelsOpts, treeDeptSelectData, changeFormDataStartDate, productClassifyList, changeTreeData, userListOpts })"
        ref="formRef"
      />
    </div>
    <div class="pm-edit-task">
      <el-tabs v-model="activeName" type="card" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="项目流程" name="flow">
          <TaskList ref="taskListRef" :formData="formData" :sourceRef="sourceRef" />
        </el-tab-pane>
        <el-tab-pane label="相关资源" name="source"> <SourceList ref="sourceRef" /></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import EditForm from "@/components/EditForm/index.vue";
import { usePMEdit } from "./utils/hook";
import { formConfigs, formRules } from "./utils/config";
import TaskList from "./components/taskList/index.vue";
import SourceList from "./components/sourceList/index.vue";

defineOptions({ name: "PlmManageProjectMgmtProjectManageEditIndex" });

const {
  formData,
  fetchDetailFormData,
  formRef,
  activeName,
  handleClick,
  onBack,
  onSubmit,
  onSave,
  userListOpts,
  sourceRef,
  taskListRef,
  changeTreeData,
  productClassifyList,
  projectModelsOpts,
  changeFormDataStartDate,
  treeDeptSelectData
} = usePMEdit();
</script>

<style lang="scss" scoped>
.pm-edit-page {
  .pm-edit-btns {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;

    .pm-left-text {
      color: #409eff;
      font-size: 15px;
      font-weight: 600;
    }
  }

  .pm-edit-top {
    :deep(.el-form-item--small) {
      margin-bottom: 8px !important;
    }

    :deep(.el-input-number.is-without-controls .el-input__wrapper) {
      padding-left: 7px;
    }
  }
}
</style>
