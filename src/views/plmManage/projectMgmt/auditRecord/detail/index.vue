<!-- 评审记录表示例代码 -->
<template>
  <div class="effect-detail">
    <table>
      <tr>
        <td class="head-col">产品型号</td>
        <td>
          <HxModalInput
            title="选择产品"
            placeholder="请选择产品型号"
            valueKey="productModel"
            v-model="formData.productModel"
            readonly
            showButton
            @select="onSelect"
            :componentProp="{
              searchConfig: [{ label: '产品型号', value: 'productCode' }],
              maxHeight: 520,
              columns: [
                { label: '产品型号', prop: 'productCode', headerAlign: 'center' },
                { label: '产品类别', prop: 'productType', headerAlign: 'center' }
              ],
              api: fetchProductStoreList
            }"
          />
        </td>
        <td class="head-col">产品名称</td>
        <td><el-input v-model="formData.productName" placeholder=" " /></td>
        <td class="head-col">评审主持人</td>
        <td>{{ formData.auditHoldUserName }}</td>
      </tr>
      <tr>
        <td class="head-col">项目阶段</td>
        <td colspan="3">
          <el-checkbox-group v-model="formData.projectStage" @change="changeGroup">
            <el-checkbox v-for="item in projectStageOpts" :label="item.label" :value="item.value" :key="item.value" />
          </el-checkbox-group>
        </td>
        <td class="head-col">评审时间</td>
        <td>{{ formData.auditDate }}</td>
      </tr>
      <tr>
        <td class="head-col bold" colspan="6">评审内容</td>
      </tr>
      <tr>
        <td colspan="6">
          <div>结构风险：</div>
          <div><el-input type="textarea" :autosize="{ minRows: 3 }" v-model="formData.constructChance" placeholder=" " /></div>
        </td>
      </tr>
      <tr>
        <td colspan="6">
          <div>性能风险：</div>
          <div><el-input type="textarea" :autosize="{ minRows: 3 }" v-model="formData.performChance" placeholder=" " /></div>
        </td>
      </tr>
      <tr>
        <td colspan="6">
          <div>成本：</div>
          <div><el-input type="textarea" :autosize="{ minRows: 3 }" v-model="formData.cost" placeholder=" " /></div>
        </td>
      </tr>
      <tr>
        <td colspan="3">
          <div>敬孚意见：</div>
          <div><el-input type="textarea" :autosize="{ minRows: 3 }" v-model="formData.jfAdvice" placeholder=" " /></div>
        </td>
        <td colspan="3">
          <div>采购部意见：</div>
          <div><el-input type="textarea" :autosize="{ minRows: 3 }" v-model="formData.purchaseAdvice" placeholder=" " /></div>
        </td>
      </tr>
      <tr>
        <td colspan="3">
          <div>工程部意见：</div>
          <div><el-input type="textarea" :autosize="{ minRows: 3 }" v-model="formData.engineeringAdvice" placeholder=" " /></div>
        </td>
        <td colspan="3">
          <div>品质部意见：</div>
          <div><el-input type="textarea" :autosize="{ minRows: 3 }" v-model="formData.qualityAdvice" placeholder=" " /></div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="tsx">
import { reactive } from "vue";
import { useUserStore } from "@/store/modules/user";
import dayjs from "dayjs";
import { fetchProductStoreList } from "@/api/plmManage";
import HxModalInput from "@/components/HxModalInput/index.vue";

defineProps(["projectStageOpts"]);

const formData = reactive({
  productModel: "",
  productName: "",
  engineeringAdvice: "",
  qualityAdvice: "",
  jfAdvice: "",
  purchaseAdvice: "",
  projectStage: [],
  constructChance: "",
  performChance: "",
  cost: "",
  auditHoldUserName: useUserStore().userInfo.userName,
  auditDate: dayjs().format("YYYY-MM-DD HH:mm:ss")
});

const changeGroup = () => {
  if (formData.projectStage.length > 1) {
    formData.projectStage.splice(0, 1);
  }
};
const onSelect = (val) => {
  // _formData.productModelId = val.id;
  formData.productModel = val.productCode;
};
defineExpose({ formData });
</script>

<style scoped lang="scss">
.effect-detail {
  table {
    width: 100%;

    :deep(.el-upload--picture-card) {
      background-color: #fff;
    }

    .head-col {
      text-align: center;
    }

    .bold {
      font-weight: 600;
    }

    td,
    th {
      border: 1px solid #000;
      padding: 4px 8px;
    }
  }
}
</style>
