<!-- /*
 * @Author: Hailen 
 * @Date: 2023-07-05 11:45:27 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-07-05 11:45:27 
 */ -->

<script setup lang="ts">
import { ref, h, reactive } from "vue";
import { addDialog } from "@/components/ReDialog";
import AddModal from "./addModal.vue";
import { message } from "@/utils/message";
import type { FormInstance, FormRules } from "element-plus";

export type FormModelType = Record<string, any>;

const props = {
  /** 表单数据Model */
  formData: {
    type: Object as PropType<FormModelType>,
    default: () => ({})
  },
  /** 表单规则 */
  formRules: {
    type: Object as PropType<FormRules>,
    default: () => ({})
  }
};

const formRef = ref<FormInstance>();
const formInline = reactive<FormModelType>(props.formData);

// 1.部门编辑弹窗表单校验规则
const formRules = reactive<FormRules>({
  oldName: [{ required: true, message: "请输入旧的审批人", trigger: "blur" }],
  newName: [{ required: true, message: "请输入新的审批人", trigger: "blur" }]
});

function onChangeOld() {
  onOpenDialog("old");
}
function onChangeNew() {
  onOpenDialog("new");
}

const onOpenDialog = (type: "old" | "new") => {
  const userRef = ref();
  addDialog({
    title: "选择用户",
    width: "860px",
    draggable: true,
    fullscreenIcon: true,
    closeOnClickModal: false,
    contentRenderer: () => h(AddModal, { ref: userRef }),
    beforeSure: (done, { options }) => {
      const userRow = userRef.value.getRef();
      if (!userRow.userCode) {
        return message("请选择用户", { type: "error" });
      }
      if (type === "old") {
        formInline.oldAssign = userRow.userCode;
        formInline.oldName = userRow.userName;
      } else {
        formInline.newAssign = userRow.userCode;
        formInline.newName = userRow.userName;
      }
      done();
    }
  });
};

function getRef() {
  formRef.value.validate((valid) => {});
  return formInline;
}

defineExpose({ getRef });
</script>

<template>
  <el-form ref="formRef" :inline="true" :model="formInline" :rules="formRules" class="demo-form-inline">
    <el-form-item label="旧的审批人" class="flex" prop="oldName" style="margin-bottom: 20px">
      <div class="flex">
        <el-input v-model.trim="formInline.oldName" placeholder="旧审批人名字" readonly clearable />
        <el-button type="primary" @click="onChangeOld" class="ml-4">选择旧审批人</el-button>
      </div>
    </el-form-item>
    <el-form-item label="新的审批人" prop="newName">
      <div class="flex">
        <el-input v-model.trim="formInline.newName" placeholder="新审批人名字" readonly clearable />
        <el-button type="primary" @click="onChangeNew" class="ml-4">选择新审批人</el-button>
      </div>
    </el-form-item>
  </el-form>
</template>
