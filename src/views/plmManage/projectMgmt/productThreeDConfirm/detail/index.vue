<template>
  <div class="trial-detail">
    <table>
      <tr>
        <td class="head-col" width="80px">产品型号</td>
        <td>
          <HxModalInput
            title="选择产品"
            placeholder="请选择产品型号"
            valueKey="sampleModel"
            v-model="formData.productModel"
            readonly
            showButton
            @select="onSelect"
            showModel="product"
          />
        </td>
        <td class="head-col">产品名称</td>
        <td><el-input placeholder=" " v-model="formData.productName" /></td>
        <td class="head-col">客户</td>
        <td><el-input placeholder=" " v-model="formData.customer" /></td>
        <td class="head-col">提交日期</td>
        <td>
          <el-date-picker
            v-model="formData.submitDate"
            disabled
            :clearable="false"
            type="date"
            placeholder="请选择"
            style="width: 100%"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </td>
      </tr>
      <tr>
        <td class="head-col">结构担当</td>
        <td>
          <el-input placeholder=" " v-model="formData.structureBear" />
        </td>
        <td class="head-col">项目担当</td>
        <td><el-input placeholder=" " v-model="formData.projectBear" /></td>
        <td class="head-col">文件名</td>
        <td><el-input placeholder=" " v-model="formData.fileName" /></td>
        <td class="head-col">版本号</td>
        <td>
          <el-input placeholder=" " v-model="formData.version" disabled />
        </td>
      </tr>
      <tr>
        <td>结构总体图示/文件确认信息源</td>
        <td colspan="7">
          <div class="row-upload">
            <el-upload action="#" list-type="picture-card" multiple :auto-upload="false" v-model:file-list="formData.fixtureImgs">
              <el-icon><Plus class="plus" /></el-icon>
            </el-upload>
          </div>
        </td>
      </tr>
      <tr>
        <td class="fw head-col" colspan="8" style="background-color: #bbb">已确认3D图包含的结构部件信息</td>
      </tr>
    </table>

    <table class="table-tow">
      <tr>
        <td class="head-col top-h" width="60px">序号</td>
        <td class="head-col top-h" width="260px">结构部件名称</td>
        <td class="head-col top-h">部件图示</td>
        <td class="head-col top-h">备注</td>
        <td class="head-col top-h" width="110px">状态</td>
      </tr>
      <tr v-for="(item, idx) in dataList" :key="idx">
        <td class="head-col top-h" width="60px">{{ idx + 1 }}</td>
        <td class="head-col top-h" width="260px"><el-input v-model="item.partName" :autosize="{ minRows: 3 }" type="textarea" placeholder=" " /></td>
        <td class="top-h">
          <div class="row-upload">
            <el-upload class="custom-upload" action="#" list-type="picture-card" multiple :auto-upload="false" v-model:file-list="item.partImgs">
              <el-icon><Plus class="plus" /></el-icon>
            </el-upload>
          </div>
        </td>
        <td class="head-col top-h" width="320px"><el-input v-model="item.remark" :autosize="{ minRows: 3 }" type="textarea" placeholder=" " /></td>
        <td class="top-h" width="260px">
          <el-checkbox-group v-model="item.status" @change="() => changeGroup(idx)">
            <el-checkbox v-for="el in statusOpts" :key="el.value" :label="el.label" :value="el.value" />
          </el-checkbox-group>
        </td>
      </tr>
      <tr>
        <td class="head-col">其它<br />意⻅</td>
        <td colspan="4"><el-input v-model="formData.otherAdvice" :autosize="{ minRows: 3 }" type="textarea" placeholder=" " /></td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="tsx">
import { reactive, ref } from "vue";
import HxModalInput from "@/components/HxModalInput/index.vue";
import dayjs from "dayjs";
import { Plus } from "@element-plus/icons-vue";

const formData: any = reactive({ version: "V0", submitDate: dayjs().format("YYYY-MM-DD") });

const statusOpts = ref([
  { label: "测试状态一", value: 1 },
  { label: "测试状态二", value: 2 }
]);

const dataListConfig = [];
for (let i = 0; i < 10; i++) {
  dataListConfig.push({ partName: "", partImgs: [], remark: "", status: [] });
}
const dataList = ref(dataListConfig);

const changeGroup = (idx) => {
  if (dataList.value[idx].status.length > 1) {
    dataList.value[idx].status.splice(0, 1);
  }
};

const onSelect = (val) => {
  formData.productModel = val.productCode;
};

defineExpose({ formData, dataList });
</script>

<style scoped lang="scss">
.plus {
  font-size: 17px; /* 图标大小 */
  line-height: 80px; /* 垂直居中对齐 */
}

.trial-detail {
  table {
    width: 100%;

    .top-h {
      border-top: 0 !important;
    }

    :deep(.el-upload--picture-card) {
      background-color: #fff;
    }

    .line-txt {
      padding: 6px;
      font-weight: 700;
    }

    .fw {
      font-weight: 700;
      color: #000;
    }

    .head-col {
      text-align: center;
    }

    .bold {
      font-weight: 600;
    }

    td,
    th {
      padding: 4px 8px;
      border: 1px solid #000;
    }
  }

  .table-tow {
    :deep(.el-upload--picture-card) {
      --el-upload-picture-card-size: 80px;
    }

    :deep(.el-upload-list--picture-card) {
      --el-upload-list-picture-card-size: 80px;
    }

    .custom-upload {
      width: 80px; /* 设置上传框的宽度 */
      height: 80px; /* 设置上传框的高度 */
      .el-upload {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
