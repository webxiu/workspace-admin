<template>
  <div class="detail">
    <div class="btns">
      <el-button size="small" type="default" @click="router.push('/plmManage/basicData/bomMgmt/index?menuId=3')">返回</el-button>
      <el-button size="small" type="primary" @click="submit" v-if="route.query.type !== 'view'">保存</el-button>
      <el-button size="small" plain type="primary" @click="copyBom">复制</el-button>
      <el-button size="small" plain type="success" @click="submitAction" v-if="route.query.type !== 'add'">提交</el-button>
      <el-button size="small" plain type="danger" @click="backAction" v-if="detailInfo.billState == 2">回退</el-button>
      <el-button size="small" type="success" @click="pushAction" v-if="detailInfo.billState == 2 && detailInfo.disableStatus !== 1">下推</el-button>
      <el-button size="small" type="info" v-if="route.query.type !== 'add'" @click="exportDetail">导出</el-button>
      <el-button size="small" type="info" v-if="route.query.type !== 'add'" @click="printAction">打印</el-button>
    </div>
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item title="基本信息" name="1">
        <div class="edit-form">
          <EditForm
            :loading="loading"
            :formRules="formRules"
            :formInline="formData"
            :formConfigs="formConfigs(opts, formData, treeSelectData, submit)"
            ref="formRef"
          />
        </div>
      </el-collapse-item>
    </el-collapse>
    <div class="add-table" style="margin-top: 5px">
      <BomTable ref="addTableRef" @loadData="onLoadFormData" />
    </div>
  </div>
</template>

<script setup lang="ts">
import EditForm from "@/components/EditForm/index.vue";
import { formConfigs, formRules } from "./components/config";
import BomTable from "./BomTable/index.vue";

import { useConfig } from "./hooks";

defineOptions({ name: "BOMMgmtAdd" });

const {
  opts,
  loading,
  formData,
  activeNames,
  route,
  router,
  formRef,
  addTableRef,
  detailInfo,
  treeSelectData,
  onLoadFormData,
  submit,
  copyBom,
  submitAction,
  backAction,
  pushAction,
  exportDetail,
  printAction,
  handleChange
} = useConfig();
</script>

<style scoped lang="scss">
.detail {
  :deep(.el-collapse-item__content) {
    padding-bottom: 0 !important;
  }

  :deep(.el-form-item) {
    margin-bottom: 0 !important;
  }

  .btns {
    text-align: right;
  }

  .edit-form {
    padding-top: 20px;
  }

  :deep(.el-collapse),
  :deep(.el-collapse-item__wrap) {
    border: none;
  }

  :deep(.el-collapse-item__header) {
    font-size: 15px;
    font-weight: 600;
    color: #409eff;
  }
}
</style>
