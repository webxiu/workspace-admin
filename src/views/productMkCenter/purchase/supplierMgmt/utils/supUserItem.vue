<template>
  <el-form ref="formRef" :model="formData" label-width="100px" class="demo-dynamic">
    <el-row v-for="(domain, index) in formData?.linkmanList" :key="domain.id">
      <el-col :span="7">
        <el-form-item
          label="联系人姓名"
          label-width="85px"
          :prop="'linkmanList.' + index + '.contact'"
          :rules="{ required: true, message: '联系人姓名不能为空', trigger: 'blur' }"
        >
          <el-input v-model="domain.contact" placeholder="请输入联系人姓名" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="7">
        <el-form-item label="手机号码" :prop="'linkmanList.' + index + '.mobile'" :rules="{ required: true, message: '手机号码不能为空', trigger: 'blur' }">
          <el-input v-model="domain.mobile" placeholder="请输入手机号码" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="7">
        <el-form-item label="邮箱" :prop="'linkmanList.' + index + '.email'">
          <el-input v-model="domain.email" placeholder="请输入邮箱" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="3">
        <el-form-item label="" label-width="10px" class="form-delete">
          <el-button size="small" @click.prevent="removeDomain(domain)" type="danger" :icon="Delete">删除</el-button>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item>
      <el-button @click="addDomain" type="primary" :icon="Plus">新增一条联系人信息</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import type { FormInstance } from "element-plus";
import { Plus, Delete } from "@element-plus/icons-vue";
import { v4 as uuidv4 } from "uuid";

export interface FormDataType {
  linkmanList: { id: number; contact: string; mobile: string; email: string }[];
  id?: number;
}

interface DomainItem {
  id: number;
  contact: string;
  mobile: string;
  email: string;
}

const formRef = ref<FormInstance>();

const props = defineProps({
  /** 表单数据Model */
  formInline: {
    type: Object as PropType<FormDataType>,
    default: () => ({})
  }
});

const formData = reactive<FormDataType>(props.formInline);

const removeDomain = (item: DomainItem) => {
  const index = formData.linkmanList.indexOf(item);
  if (index !== -1) {
    formData.linkmanList.splice(index, 1);
  }
};

const addDomain = () => {
  formData.linkmanList.push({ id: uuidv4(), contact: "", mobile: "", email: "" });
};

function getRef() {
  return { formRef, formData };
}
defineExpose({ getRef });
</script>

<style lang="scss" scoped>
:deep(.form-delete .el-form-item__content) {
  justify-content: end;
}

:deep(.avatar-logo) {
  .el-upload-dragger {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100px;
    padding: 0;
    font-size: 28px;
    color: #8c939d;
    text-align: center;

    .el-icon--upload {
      margin-bottom: 0;
    }
  }
}
</style>
