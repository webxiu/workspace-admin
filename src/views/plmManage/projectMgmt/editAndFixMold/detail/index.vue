<template>
  <div class="trial-detail">
    <table>
      <tr>
        <td colspan="4">
          <div style="display: flex">
            <div style="display: flex; align-items: center">
              <div style="width: 60px">编号：</div>
              <el-input v-model="formData.billNo" placeholder=" " />
            </div>
            <div style="display: flex; align-items: center; margin: 0 16px">
              <div style="width: 110px">收件单位：</div>
              <el-input v-model="formData.receivePlace" placeholder=" " />
            </div>
            <div style="display: flex; align-items: center">
              <div style="width: 110px">收件人：</div>
              <el-input v-model="formData.receiveUserName" placeholder=" " />
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="4">
          <div style="display: flex">
            <div style="display: flex; align-items: center; margin: 0 16px">
              <div style="width: 110px">发件单位：</div>
              <el-input v-model="formData.receivePlace" placeholder=" " />
            </div>
            <div style="display: flex; align-items: center">
              <div style="width: 110px">发件人：</div>
              <el-input v-model="formData.receiveUserName" placeholder=" " />
            </div>
          </div>
        </td>
      </tr>
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
      </tr>
      <tr>
        <td class="head-col">试产数量</td>
        <td><el-input-number :controls="false" v-model="formData.tryNum" placeholder=" " class="ui-w-100" /></td>
        <td class="head-col">试产样机颜色</td>
        <td>
          <el-select v-model="formData.tryColor" placeholder="请选择" class="ui-w-100">
            <el-option v-for="item in sampModelColorOpts" :key="item.optionValue" :label="item.optionName" :value="item.optionValue" />
          </el-select>
        </td>
      </tr>
      <tr>
        <td class="head-col">计划试产日期</td>
        <td>
          <el-date-picker
            v-model="formData.planTryDate"
            :clearable="false"
            type="date"
            placeholder="请选择"
            style="width: 100%"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </td>
        <td class="head-col">试产阶段</td>
        <td>
          <el-select v-model="formData.tryStage" placeholder="请选择" class="ui-w-100">
            <el-option v-for="item in tryStageOpts" :key="item.optionValue" :label="item.optionName" :value="item.optionValue" />
          </el-select>
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="tsx">
import { onMounted, reactive, ref } from "vue";
import dayjs from "dayjs";
import { Plus } from "@element-plus/icons-vue";
import { roleUserList } from "@/api/systemManage";
import { getEnumDictList } from "@/utils/table";
import { fetchProductStoreList } from "@/api/plmManage";
import HxModalInput from "@/components/HxModalInput/index.vue";

defineProps(["projectStageOpts"]);

const formData: any = reactive({
  productModel: "",
  productName: ""
});
const pmUserList = ref([]);
const sampModelColorOpts = ref([]);
const tryStageOpts = ref([]);

// const changeGroup = () => {
//   if (formData.projectStage.length > 1) {
//     formData.projectStage.splice(0, 1);
//   }
// };

const fetchOpts = () => {
  roleUserList({
    roleId: 512
  }).then((res) => {
    if (res.data) {
      pmUserList.value = res.data.map((item) => ({ label: item.userName, value: item.userId }));
    }
  });
  getEnumDictList(["TrialProductionColor", "TrialProductionStage"]).then((res) => {
    sampModelColorOpts.value = res["TrialProductionColor"];
    tryStageOpts.value = res["TrialProductionStage"];
  });
};

const onSelect = (val) => {
  // _formData.productModelId = val.id;
  formData.productModel = val.productCode;
};

onMounted(() => {
  fetchOpts();
});

defineExpose({ formData });
</script>

<style scoped lang="scss">
.trial-detail {
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
