<template>
  <div>
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" class="demo-dynamic">
      <el-form-item prop="commodityName" label="商品名称">
        <el-input v-model="formData.commodityName" placeholder="请输入商品名称" clearable />
      </el-form-item>
      <el-form-item prop="model" label="型号">
        <el-input v-model="formData.model" placeholder="请输入型号" clearable />
      </el-form-item>
      <el-form-item prop="classifyId" label="分类">
        <el-select v-model="formData.classifyId" placeholder="请选择分类" clearable class="ui-w-100">
          <el-option v-for="item in goodsOptions.classifyList" :key="item.optionValue" :value="item.optionValue" :label="item.optionName" />
        </el-select>
      </el-form-item>
      <el-form-item prop="brandId" label="品牌">
        <el-select v-model="formData.brandId" placeholder="请选择品牌" clearable class="ui-w-100">
          <el-option v-for="item in goodsOptions.brandList" :key="item.optionValue" :value="item.optionValue" :label="item.optionName" />
        </el-select>
      </el-form-item>

      <el-row v-for="(domain, index) in formData?.specs" :key="domain.uuid">
        <el-col :span="6">
          <el-form-item label="规格" :prop="'specs.' + index + '.spec'" :rules="{ required: true, message: '规格不能为空', trigger: 'blur' }">
            <el-input v-model="domain.spec" placeholder="请输入" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item
            label="官方价格"
            :prop="'specs.' + index + '.officialPrice'"
            :rules="[
              { required: true, message: '官方价格不能为空', trigger: 'blur' },
              { message: '价格格式不正确', trigger: 'blur', pattern: regExp.price }
            ]"
          >
            <el-input v-model="domain.officialPrice" placeholder="请输入" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item
            label="折扣价格"
            :prop="'specs.' + index + '.discountPrice'"
            :rules="[
              { required: true, message: '折扣价格不能为空', trigger: 'blur' },
              { message: '价格格式不正确', trigger: 'blur', pattern: regExp.price }
            ]"
          >
            <el-input v-model="domain.discountPrice" placeholder="请输入" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item
            label="库存数量"
            :prop="'specs.' + index + '.stock'"
            :rules="[
              { required: true, message: '库存数量不能为空', trigger: 'blur' },
              { message: '数量格式不正确', trigger: 'blur', pattern: regExp.quantity }
            ]"
          >
            <el-input v-model="domain.stock" placeholder="请输入" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label="" label-width="10px" class="form-delete">
            <el-button @click.prevent="removeDomain(domain)" type="danger" :icon="Delete">删除</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button @click="addDomain" type="primary" :icon="Plus">新增一条规格</el-button>
      </el-form-item>
      <el-form-item prop="state" label="商品状态">
        <el-switch v-model="formData.state" :active-value="1" :inactive-value="0" />
      </el-form-item>
      <el-form-item prop="commodityDescription" label="产品功能介绍">
        <el-input :rows="4" type="textarea" v-model="formData.commodityDescription" placeholder="请输入产品功能介绍" clearable />
      </el-form-item>
      <el-form-item>
        <el-upload
          v-model:file-list="fileList"
          accept=".jpg,.png,.jpeg,.bmp,.gif"
          :action="`${props.baseApi}/oa/hr/commodityManagement/uploadmultifile`"
          list-type="picture-card"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :on-preview="onPreview"
          :on-remove="onRemove"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <el-dialog v-model="dialogVisible" :append-to-body="true" :draggable="true" class="goods-dialog">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import type { FormInstance } from "element-plus";
import { FormRules } from "element-plus";
import type { UploadProps, UploadUserFile } from "element-plus";
import { message } from "@/utils/message";
import { Plus, Delete, UploadFilled } from "@element-plus/icons-vue";
import { onMounted } from "vue";
import regExp from "@/utils/regExp";
import { GoodsManageOptionType } from "@/api/oaManage/humanResources";

interface DomainItem {
  uuid: number;
  id?: number;
  spec: string;
  officialPrice: string;
  discountPrice: string;
  stock: string;
  createDate: string;
  createId: string;
}
interface ImageItem {
  id: number;
  fileName: string;
  filePath?: string;
}
export interface FormDataType {
  commodityName: string;
  model: string;
  classifyId: string;
  brandId: string;
  state: number;
  commodityDescription: string;
  // file: string;
  specs: DomainItem[];
  images: ImageItem[];
  id?: number;
}

const props = defineProps({
  /** 下拉框数据 */
  goodsOptions: { type: Object as PropType<GoodsManageOptionType>, default: () => ({}) },
  /** VITE_BASE_API配置 */
  baseApi: { type: String, default: "" },
  /** 图片下载路径 */
  baseUrl: { type: String, default: "" },
  /** 表单数据Model */
  formInline: {
    type: Object as PropType<FormDataType>,
    default: () => ({})
  }
});

const formData = reactive<FormDataType>(props.formInline);
const formRef = ref<FormInstance>();
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const images = formData.images?.map((item) => {
  return { name: item.fileName, url: props.baseApi + item.filePath + item.fileName, ...item };
});

const fileList = ref<UploadUserFile[]>(images);

// 编辑员工信息校验
const formRules = reactive<FormRules>({
  commodityName: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
  model: [{ required: true, message: "请输入型号", trigger: "blur" }],
  classifyId: [{ required: true, message: "请选择分类", trigger: "blur" }],
  brandId: [{ required: true, message: "请选择品牌", trigger: "blur" }]
});

const removeDomain = (item: DomainItem) => {
  const index = formData.specs.indexOf(item);
  if (index !== -1) {
    formData.specs.splice(index, 1);
  }
};

const addDomain = () => {
  formData.specs.push({ uuid: Date.now(), spec: "", officialPrice: "", discountPrice: "", stock: "", createDate: "", createId: "" });
};

const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  if (!["image/jpeg", "image/png", "image/bmp", "image/gif"].includes(rawFile.type)) {
    message("Logo必须为JPG、PNG、BMP或GIF格式!", { type: "error" });
    return false;
  }
  if (rawFile.size / 1024 / 1024 > 4) {
    message("Logo图片大小不能超过4MB！", { type: "error" });
    return false;
  }
  return true;
};

// 预览
const onPreview: UploadProps["onPreview"] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};

// 上传成功添加图片
function handleAvatarSuccess(response) {
  formData.images.push({
    id: null,
    fileName: response.data
  });
}

// 删除图片
const onRemove: UploadProps["onRemove"] = (uploadFile: any) => {
  if (uploadFile?.response?.data) {
    formData.images = formData.images.filter((item) => item.fileName !== uploadFile?.response?.data);
  } else if (uploadFile.id) {
    formData.images = formData.images.filter((item) => item.id !== uploadFile.id);
  }
};

function getRef() {
  return { formRef, formData };
}
defineExpose({ getRef });
</script>

<style lang="scss">
.goods-dialog .el-dialog__body {
  display: flex;
  justify-content: center;
  width: auto;
}
</style>
