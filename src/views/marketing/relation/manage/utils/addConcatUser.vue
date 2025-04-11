<template>
  <div style="padding-top: 6px">
    <el-form ref="formRef" :model="formData" label-width="100px" class="demo-dynamic">
      <el-row v-for="(domain, index) in mkCustomerLinkmanList" :key="domain.id">
        <el-col :span="7">
          <el-form-item
            label-width="85px"
            label="联系人姓名"
            :prop="'mkCustomerLinkmanList.' + index + '.fname'"
            :rules="{ required: true, message: '联系人姓名不能为空', trigger: 'blur' }"
          >
            <el-input v-model="domain.fname" placeholder="请输入联系人姓名" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item
            label="联系方式"
            :prop="'mkCustomerLinkmanList.' + index + '.phone'"
            :rules="{ required: true, message: '联系方式不能为空', trigger: 'blur' }"
          >
            <el-input v-model="domain.phone" placeholder="请输入联系方式" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="Email" :prop="'mkCustomerLinkmanList.' + index + '.email'">
            <el-input v-model="domain.email" placeholder="请输入Email" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="" label-width="10px" class="form-delete">
            <el-button @click.prevent="removeDomain(domain)" type="danger" :icon="Delete">删除</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { Delete } from "@element-plus/icons-vue";
import { reactive } from "vue";

// defineProps(["formData"]);
const formData = reactive({});

const mkCustomerLinkmanList: any = defineModel();

const removeDomain = (domain) => {
  console.log(domain, "domain..");
};
</script>

<style lang="scss" scoped></style>
