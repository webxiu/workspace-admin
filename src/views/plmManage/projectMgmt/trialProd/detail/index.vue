<template>
  <div class="trial-detail">
    <table>
      <tr>
        <td colspan="4">申请日期：{{ dayjs(formData.applyDate).format("YYYY年MM月D日") }}</td>
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
      <tr>
        <td class="head-col">项目工程师</td>
        <td>
          <el-select v-model="formData.projectUser" placeholder="请选择" class="ui-w-100">
            <el-option v-for="item in pmUserList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </td>
        <td class="head-col">试产次数</td>
        <td><el-input-number :controls="false" v-model="formData.tryCount" placeholder=" " class="ui-w-100" /></td>
      </tr>
      <tr>
        <td colspan="2">
          <div>试产简要描述：</div>
          <ul>
            <li>1.本次试产的目的：</li>
            <li>2.本次功能/结构全新；</li>
            <li>3.试产物有计划与仓储部准备，其他部门全力配合；</li>
            <li>4.试产时相关部门人员到现场跟踪；</li>
            <li>5.试产作为客户样机，测试样机。</li>
          </ul>
        </td>
        <td colspan="2">
          <div style="color: red">图示：</div>
          <div class="row-upload">
            <el-upload action="#" list-type="picture-card" multiple :auto-upload="false" v-model:file-list="formData.fileList">
              <el-icon><Plus /></el-icon>
            </el-upload>
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="4" align="center">
          <span style="font-size: 17px; color: #000">文件资料</span><span style="color: red">（完成的和未完成的统一备注上日期）</span>
        </td>
      </tr>
      <tr>
        <td>1.BOM表</td>
        <td><el-input v-model="formData.bomDate" placeholder=" " /></td>
        <td>5.电子资料</td>
        <td><el-input v-model="formData.eleAssetsDate" placeholder=" " /></td>
      </tr>
      <tr>
        <td>2.产品设计输入表</td>
        <td><el-input v-model="formData.designInputDate" placeholder=" " /></td>
        <td>6.测试报告</td>
        <td><el-input v-model="formData.testReportDate" placeholder=" " /></td>
      </tr>
      <tr>
        <td>3.2D图</td>
        <td><el-input v-model="formData.twoDImgDate" placeholder=" " /></td>
        <td>7.排模表</td>
        <td><el-input v-model="formData.moldSheetDate" placeholder=" " /></td>
      </tr>
      <tr>
        <td>4.规格书</td>
        <td><el-input v-model="formData.specBookDate" placeholder=" " /></td>
        <td />
        <td />
      </tr>
      <tr>
        <td colspan="4">
          <div>备注：</div>
          <div><el-input v-model="formData.remark" :autosize="{ minRows: 1 }" type="textarea" placeholder=" " /></div>
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

const formData = reactive({
  applyDate: dayjs().format("YYYY-MM-DD"),
  bomDate: "",
  eleAssetsDate: "",
  designInputDate: "",
  remark: "",
  testReportDate: "",
  twoDImgDate: "",
  moldSheetDate: "",
  specBookDate: "",
  productModel: "",
  fileList: [],
  productName: "",
  tryNum: 0,
  tryColor: "",
  planTryDate: "",
  tryStage: "",
  projectUser: "",
  tryCount: 0
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
