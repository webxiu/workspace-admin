<template>
  <div class="trial-detail">
    <table>
      <tr>
        <td>
          <div style="display: flex; align-items: center">
            <div class="fw">项目评估：</div>
            <div>
              <el-checkbox-group v-model="formData.pmValuation" @change="changeGroup1">
                <el-checkbox label="紧急" value="紧急" />
                <el-checkbox label="一般" value="一般" />
              </el-checkbox-group>
            </div>
            <div style="margin-left: 240px">评估人：</div>
            <div>
              <el-input placeholder=" " v-model="formData.valuationUserName" />
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <div style="display: flex; align-items: center">
            <div class="fw">样机名称：</div>
            <div>
              <el-checkbox-group v-model="formData.sampleName" @change="changeGroup2">
                <el-checkbox label="直发器" value="直发器" />
                <el-checkbox label="吹风筒" value="吹风筒" />
                <el-checkbox label="卷发器" value="卷发器" />
                <el-checkbox label="其它" value="其它" />
              </el-checkbox-group>
            </div>
            <div style="margin-left: 24px" v-if="showOther">
              <el-input placeholder=" " v-model="formData.otherSampleName" />
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <div style="display: flex; align-items: center">
            <div class="fw">产品型号：</div>
            <div>
              <HxModalInput
                title="选择产品"
                placeholder="请选择产品型号"
                valueKey="productModel"
                v-model="formData.productModel"
                readonly
                showButton
                @select="onSelect"
                showModel="product"
              />
            </div>
            <div style="margin-left: 60px">程序校验码：</div>
            <div><el-input placeholder=" " v-model="formData.appCheckCode" /></div>
            <div style="margin-left: 60px">送样数量：</div>
            <div><el-input-number :controls="false" v-model="formData.sampleNum" /></div>
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <div style="display: flex; align-items: center">
            <div class="fw">样机类别：</div>
            <div>
              <el-checkbox-group v-model="formData.sampleClassName" @change="changeGroup3">
                <el-checkbox label="工程样机" value="工程样机" />
                <el-checkbox label="客供机" value="客供机" />
                <el-checkbox label="自购机" value="自购机" />
                <el-checkbox label="重测样机" value="重测样机" />
                <el-checkbox label="其它" value="其它" />
              </el-checkbox-group>
            </div>
            <div style="margin-left: 24px" v-if="showClassOther">
              <el-input placeholder=" " v-model="formData.otherSampleClassName" />
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <div>
            <div class="fw">申请测试原因：</div>
            <div><el-input v-model="formData.applyTestReason" :autosize="{ minRows: 4 }" type="textarea" placeholder=" " /></div>
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <div style="display: flex; align-items: center">
            <div class="fw">一般测试要求：</div>
            <div>
              <el-checkbox-group v-model="formData.normalTestReq" @change="changeGroup4">
                <el-checkbox label="按公司内部标准测试" value="按公司内部标准测试" />
                <el-checkbox label="按客户标准测试" value="按客户标准测试" />
                <el-checkbox label="按其它标准测试" value="按其它标准测试" />
              </el-checkbox-group>
            </div>
            <div style="margin-left: 24px" v-if="showCustomerTestReqOther">
              <el-input placeholder=" " v-model="formData.otherCostomerTestReq" />
            </div>
            <div style="margin-left: 24px" v-if="showNormalTestReqOther">
              <el-input placeholder=" " v-model="formData.otherNormalTestReq" />
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <div>
            <div class="fw">特殊测试要求：</div>
            <div><el-input v-model="formData.specialTestReq" :autosize="{ minRows: 4 }" type="textarea" placeholder=" " /></div>
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <div>
            <div class="fw">差异说明：</div>
            <div><el-input v-model="formData.diffDesc" autosize type="textarea" placeholder=" " /></div>
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <div style="display: flex; align-items: center">
            <div class="fw">参考机型：</div>
            <div><el-input v-model="formData.referenceModel" placeholder=" " /></div>
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <div>
            <div class="fw">更改内容：</div>
            <div><el-input v-model="formData.changeContent" :autosize="{ minRows: 4 }" type="textarea" placeholder=" " /></div>
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <div style="display: flex; align-items: center">
            <div class="fw">要求完成日期：</div>
            <div>
              <el-date-picker
                v-model="formData.reqFinishDate"
                :clearable="false"
                type="date"
                placeholder="请选择"
                style="width: 100%"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </div>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="tsx">
import { reactive, ref } from "vue";

const formData: any = reactive({});
const showOther = ref(false);
const showClassOther = ref(false);
const showNormalTestReqOther = ref(false);
const showCustomerTestReqOther = ref(false);

const onSelect = (val) => {
  formData.productModel = val.productCode;
};

const changeGroup1 = () => {
  if (formData.pmValuation.length > 1) {
    formData.pmValuation.splice(0, 1);
  }
};

const changeGroup4 = () => {
  if (formData.normalTestReq.length > 1) {
    formData.normalTestReq.splice(0, 1);
  }

  if (formData.normalTestReq[0] === "按其它标准测试") {
    showNormalTestReqOther.value = true;
    showCustomerTestReqOther.value = false;
  } else if (formData.normalTestReq[0] === "按客户标准测试") {
    showCustomerTestReqOther.value = true;
    showNormalTestReqOther.value = false;
  } else {
    showNormalTestReqOther.value = false;
    showCustomerTestReqOther.value = false;
    formData.otherNormalTestReq = undefined;
    formData.otherCostomerTestReq = undefined;
  }
};

const changeGroup3 = () => {
  if (formData.sampleClassName.length > 1) {
    formData.sampleClassName.splice(0, 1);
  }

  if (formData.sampleClassName[0] === "其它") {
    showClassOther.value = true;
  } else {
    showClassOther.value = false;
    formData.otherSampleClassName = undefined;
  }
};

const changeGroup2 = () => {
  if (formData.sampleName.length > 1) {
    formData.sampleName.splice(0, 1);
  }

  if (formData.sampleName[0] === "其它") {
    showOther.value = true;
  } else {
    showOther.value = false;
    formData.otherSampleName = undefined;
  }
};

defineExpose({ formData });
</script>

<style scoped lang="scss">
.trial-detail {
  table {
    width: 100%;

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
}
</style>
