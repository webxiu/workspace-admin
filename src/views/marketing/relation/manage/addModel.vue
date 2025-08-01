<template>
  <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" class="demo-dynamic">
    <el-row v-for="(domain, index) in formData?.mkCustomerLinkmanList" :key="domain.id">
      <el-col :span="7">
        <el-form-item
          label="联系人姓名"
          label-width="85px"
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
import { reactive, ref, onMounted } from "vue";
import { FormRules } from "element-plus";
import type { FormInstance, UploadProps } from "element-plus";
import { Plus, Delete, UploadFilled } from "@element-plus/icons-vue";
import { message } from "@/utils/message";
import { CustomerOptionDataType } from "@/api/oaManage/marketing";
import { getBOMTableRowSelectOptions } from "@/api/plmManage";
import { fetchCountryList } from "@/api/supplyChain";
import { v4 as uuidv4 } from "uuid";

export interface FormDataType {
  mkCustomerLinkmanList: { id: number; fname: string; phone: string; email: string }[];
  customerName?: string;
  customerAreaId: string | number;
  customerOANumber: string;
  customerCountryEntryId: string;
  customerLocation: string;
  file?: string;
  customerArea: string;
  customerCountryName?: string;
  customerLogo: string;
  id?: number;
}

interface DomainItem {
  id: number;
  fname: string;
  phone: string;
  email: string;
}

const baseApi = import.meta.env.VITE_BASE_API;
const formRef = ref<FormInstance>();
const optionInfo = ref<CustomerOptionDataType>({
  customerData: null,
  customerAreaResult: [],
  countryMessage: []
});

const props = defineProps({
  /** 表单数据Model */
  formInline: {
    type: Object as PropType<FormDataType>,
    default: () => ({})
  }
});

const formData = reactive<FormDataType>(props.formInline);

// 编辑员工信息校验
const formRules = reactive<FormRules>({
  customerName: [{ required: true, message: "请输入客户名称", trigger: "blur" }],
  customerAreaId: [{ required: true, message: "请输入客户区域", trigger: "blur" }],
  customerOANumber: [{ required: true, message: "请输入客户编码", trigger: "blur" }],
  customerCountryName: [{ required: true, message: "请输入国家", trigger: "blur" }]
  // customerLocation: [{ required: true, message: "请输入地址", trigger: "blur" }]
});

onMounted(() => {
  getAreaOptions();
});

const getAreaOptions = () => {
  // 获取国家
  fetchCountryList({}).then((res: any) => {
    if (res.data) {
      const resultData = res.data.map((item) => ({ optionKey: item.FDATAVALUE, optionValue: item.FENTRYID }));
      optionInfo.value.countryMessage = resultData;
    }
  });
  getBOMTableRowSelectOptions({ optioncode: "CustomerArea" }).then((res: any) => {
    if (res.data) {
      const resultData = res.data[0]?.optionList.map((item) => ({ optionKey: item.optionName, optionValue: item.optionValue }));
      optionInfo.value.customerAreaResult = resultData;
    }
  });
};

const removeDomain = (item: DomainItem) => {
  const index = formData.mkCustomerLinkmanList.indexOf(item);
  if (index !== -1) {
    formData.mkCustomerLinkmanList.splice(index, 1);
  }
};

const addDomain = () => {
  formData.mkCustomerLinkmanList.push({ id: uuidv4(), fname: "", phone: "", email: "" });
};

const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  if (!["image/jpeg", "image/png", "image/bmp", "image/gif"].includes(rawFile.type)) {
    message.error("Logo必须为JPG、PNG、BMP或GIF格式!");
    return false;
  }
  if (rawFile.size / 1024 / 1024 > 2) {
    message.error("Logo图片大小不能超过2MB！");
    return false;
  }
  return true;
};
function handleAvatarSuccess(response) {
  formData.customerLogo = response.data;
}

function getRef() {
  const customerName = optionInfo.value.countryMessage.find((f) => f.optionValue === formData.customerCountryEntryId)?.optionKey;
  const customerArea = optionInfo.value.customerAreaResult.find((f) => f.optionValue === formData.customerAreaId)?.optionKey;
  formData.customerCountryName = customerName;
  formData.customerArea = customerArea;
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
