<template>
  <div class="effect-detail">
    <table>
      <tr>
        <td class="head-col">产品型号</td>
        <td class="head-col">
          <HxModalInput
            title="选择产品"
            placeholder="请选择产品型号"
            valueKey="productModel"
            v-model="_formData.productModel"
            readonly
            showButton
            @select="onSelect"
            showModel="product"
          />
        </td>
        <td class="head-col">产品名称</td>
        <td class="head-col"><el-input v-model="_formData.productName" /></td>
        <td class="head-col">评审主持人</td>
        <td class="head-col"><el-input v-model="_formData.auditMasterUserName" /></td>
        <td class="head-col">评审时间</td>
        <td class="head-col">{{ _formData.auditDate }}</td>
      </tr>
      <tr>
        <td class="head-col bold" colspan="8">评审内容</td>
      </tr>
      <tr>
        <td class="head-col" colspan="3">评审内容</td>
        <td class="head-col">评审结果</td>
        <td class="head-col" colspan="3">评审内容</td>
        <td class="head-col">评审结果</td>
      </tr>
      <tr>
        <td class="head-col" colspan="3" style="text-align: left">1.标准符合性</td>
        <td class="head-col"><el-checkbox v-model="_formData.checked1" label=" " /></td>
        <td class="head-col" colspan="3">
          <div style="display: flex; align-items: center">
            <div style="width: 20px; margin-right: 8px">7</div>
            <el-input v-model="_formData.checkInput7" />
          </div>
        </td>
        <td class="head-col"><el-checkbox v-model="_formData.checked7" label=" " /></td>
      </tr>
      <tr>
        <td class="head-col" colspan="3" style="text-align: left">2.结构合理性</td>
        <td class="head-col"><el-checkbox v-model="_formData.checked2" label=" " /></td>
        <td class="head-col" colspan="3">
          <div style="display: flex; align-items: center">
            <div style="width: 20px; margin-right: 8px">8</div>
            <el-input v-model="_formData.checkInput8" />
          </div>
        </td>
        <td class="head-col"><el-checkbox v-model="_formData.checked8" label=" " /></td>
      </tr>
      <tr>
        <td class="head-col" colspan="3">
          <div style="display: flex; align-items: center">
            <div style="width: 20px; margin-right: 8px">3</div>
            <el-input v-model="_formData.checkInput3" />
          </div>
        </td>
        <td class="head-col"><el-checkbox v-model="_formData.checked3" label=" " /></td>
        <td class="head-col" colspan="3">
          <div style="display: flex; align-items: center">
            <div style="width: 20px; margin-right: 8px">9</div>
            <el-input v-model="_formData.checkInput9" />
          </div>
        </td>
        <td class="head-col"><el-checkbox v-model="_formData.checked9" label=" " /></td>
      </tr>
      <tr>
        <td class="head-col" colspan="3">
          <div style="display: flex; align-items: center">
            <div style="width: 20px; margin-right: 8px">4</div>
            <el-input v-model="_formData.checkInput4" />
          </div>
        </td>
        <td class="head-col"><el-checkbox v-model="_formData.checked4" label=" " /></td>
        <td class="head-col" colspan="3">
          <div style="display: flex; align-items: center">
            <div style="width: 20px; margin-right: 8px">10</div>
            <el-input v-model="_formData.checkInput10" />
          </div>
        </td>
        <td class="head-col"><el-checkbox v-model="_formData.checked10" label=" " /></td>
      </tr>
      <tr>
        <td class="head-col" colspan="3">
          <div style="display: flex; align-items: center">
            <div style="width: 20px; margin-right: 8px">5</div>
            <el-input v-model="_formData.checkInput5" />
          </div>
        </td>
        <td class="head-col"><el-checkbox v-model="_formData.checked5" label=" " /></td>
        <td class="head-col" colspan="3">
          <div style="display: flex; align-items: center">
            <div style="width: 20px; margin-right: 8px">11</div>
            <el-input v-model="_formData.checkInput11" />
          </div>
        </td>
        <td class="head-col"><el-checkbox v-model="_formData.checked11" label=" " /></td>
      </tr>
      <tr>
        <td class="head-col" colspan="3">
          <div style="display: flex; align-items: center">
            <div style="width: 20px; margin-right: 8px">6</div>
            <el-input v-model="_formData.checkInput6" />
          </div>
        </td>
        <td class="head-col"><el-checkbox v-model="_formData.checked6" label=" " /></td>
        <td class="head-col" colspan="3">
          <div style="display: flex; align-items: center">
            <div style="width: 20px; margin-right: 8px">12</div>
            <el-input v-model="_formData.checkInput12" />
          </div>
        </td>
        <td class="head-col"><el-checkbox v-model="_formData.checked12" label=" " /></td>
      </tr>
      <tr>
        <td class="head-col bold" colspan="8">评审小结</td>
      </tr>
      <tr>
        <td class="head-col" colspan="2">问题描述</td>
        <td class="head-col" colspan="2">原因分析</td>
        <td class="head-col" colspan="2">解决措施</td>
        <td class="head-col">责任人</td>
        <td class="head-col">计划完成时间</td>
      </tr>
      <tr>
        <td class="head-col" colspan="2"><el-input v-model="_formData.desc1" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col" colspan="2"><el-input v-model="_formData.reason1" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col" colspan="2"><el-input v-model="_formData.measure1" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col"><el-input v-model="_formData.resUserName1" /></td>
        <td class="head-col"><el-date-picker v-model="_formData.finishDate1" type="date" placeholder=" " value-format="YYYY-MM-DD" format="YYYY-MM-DD" /></td>
      </tr>
      <tr>
        <td class="head-col" colspan="2"><el-input v-model="_formData.desc2" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col" colspan="2"><el-input v-model="_formData.reason2" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col" colspan="2"><el-input v-model="_formData.measure2" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col"><el-input v-model="_formData.resUserName2" /></td>
        <td class="head-col"><el-date-picker v-model="_formData.finishDate2" type="date" placeholder=" " value-format="YYYY-MM-DD" format="YYYY-MM-DD" /></td>
      </tr>
      <tr>
        <td class="head-col" colspan="2"><el-input v-model="_formData.desc3" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col" colspan="2"><el-input v-model="_formData.reason3" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col" colspan="2"><el-input v-model="_formData.measure3" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col"><el-input v-model="_formData.resUserName3" /></td>
        <td class="head-col"><el-date-picker v-model="_formData.finishDate3" type="date" placeholder=" " value-format="YYYY-MM-DD" format="YYYY-MM-DD" /></td>
      </tr>
      <tr>
        <td class="head-col" colspan="2"><el-input v-model="_formData.desc4" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col" colspan="2"><el-input v-model="_formData.reason4" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col" colspan="2"><el-input v-model="_formData.measure4" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col"><el-input v-model="_formData.resUserName4" /></td>
        <td class="head-col"><el-date-picker v-model="_formData.finishDate4" type="date" placeholder=" " value-format="YYYY-MM-DD" format="YYYY-MM-DD" /></td>
      </tr>
      <tr>
        <td class="head-col bold" colspan="8">评审裁决</td>
      </tr>
      <tr>
        <td colspan="8"><el-checkbox v-model="_formData.rule1" label="符合设计输入要求，可交付。" /></td>
      </tr>
      <tr>
        <td colspan="8"><el-checkbox v-model="_formData.rule2" label="符合设计输入要求，尚有问题需持续改进，可交付。" /></td>
      </tr>
      <tr>
        <td colspan="8"><el-checkbox v-model="_formData.rule3" label="其它：" /></td>
      </tr>
      <tr>
        <td colspan="8"><div style="visibility: hidden">占位行，无特殊意义</div></td>
      </tr>
      <tr>
        <td class="head-col bold" colspan="8">文件资料（完成的打 " √ " ）</td>
      </tr>
      <tr>
        <td class="head-col" colspan="3" style="text-align: left">1.产品开发申请表</td>
        <td class="head-col"><el-checkbox v-model="_formData.fileChecked1" label=" " /></td>
        <td class="head-col" colspan="3" style="text-align: left">5.电子原理/布线图</td>
        <td class="head-col"><el-checkbox v-model="_formData.fileChecked5" label=" " /></td>
      </tr>
      <tr>
        <td class="head-col" colspan="3" style="text-align: left">2.产品设计输入表</td>
        <td class="head-col"><el-checkbox v-model="_formData.fileChecked2" label=" " /></td>
        <td class="head-col" colspan="3" style="text-align: left">6.功能手板测试报告</td>
        <td class="head-col"><el-checkbox v-model="_formData.fileChecked6" label=" " /></td>
      </tr>
      <tr>
        <td class="head-col" colspan="3" style="text-align: left">3.3D图</td>
        <td class="head-col"><el-checkbox v-model="_formData.fileChecked3" label=" " /></td>
        <td class="head-col" colspan="3" style="text-align: left">7.排摸表</td>
        <td class="head-col"><el-checkbox v-model="_formData.fileChecked7" label=" " /></td>
      </tr>
      <tr>
        <td class="head-col" colspan="3" style="text-align: left">4.手板BOM</td>
        <td class="head-col"><el-checkbox v-model="_formData.fileChecked4" label=" " /></td>
        <td class="head-col" colspan="3" style="text-align: left">
          <div style="display: flex; align-items: center">
            <div style="width: 20px; margin-right: 8px">8</div>
            <el-input v-model="_formData.fileCheckInput8" />
          </div>
        </td>
        <td class="head-col"><el-checkbox v-model="_formData.fileChecked8" label=" " /></td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { reactive } from "vue";

const _formData = reactive({
  productModel: "",
  productName: "",
  auditMasterUserName: "",
  auditDate: dayjs().format("YYYY-MM-DD HH:mm:ss"),
  checked1: false,
  checked2: false,
  checked3: false,
  checked4: false,
  checked5: false,
  checked6: false,
  checked8: false,
  checked7: false,
  checked9: false,
  checked10: false,
  checked11: false,
  checked12: false,
  checkInput3: "",
  checkInput4: "",
  checkInput5: "",
  checkInput6: "",
  checkInput7: "",
  checkInput8: "",
  checkInput9: "",
  checkInput10: "",
  checkInput11: "",
  checkInput12: "",
  desc1: "",
  reason1: "",
  measure1: "",
  resUserName1: "",
  finishDate1: "",
  desc2: "",
  reason2: "",
  measure2: "",
  resUserName2: "",
  finishDate2: "",
  desc3: "",
  reason3: "",
  measure3: "",
  resUserName3: "",
  finishDate3: "",
  desc4: "",
  reason4: "",
  measure4: "",
  resUserName4: "",
  finishDate4: "",
  rule1: false,
  rule2: false,
  rule3: false,
  fileChecked1: false,
  fileChecked2: false,
  fileChecked3: false,
  fileChecked4: false,
  fileChecked5: false,
  fileChecked6: false,
  fileChecked7: false,
  fileChecked8: false,
  fileCheckInput8: ""
});

const changeGroup = () => {
  // if (_formData.projectStage.length > 1) {
  //   _formData.projectStage.splice(0, 1);
  // }
};

const onSelect = (val) => {
  // _formData.productModelId = val.id;
  _formData.productModel = val.productCode;
};

defineExpose({ _formData });
</script>

<style scoped lang="scss">
.effect-detail {
  table {
    width: 100%;

    :deep(.el-upload--picture-card) {
      background-color: #fff;
    }

    .head-col {
      color: #000;
      // font-weight: 600;
      text-align: center;
    }

    .bold {
      font-weight: 600;
    }

    td {
      // text-align: center;
      padding: 4px 8px;
      border: 1px solid #000;
    }
  }
}
</style>
