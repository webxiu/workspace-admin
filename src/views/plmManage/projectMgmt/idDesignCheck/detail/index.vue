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
      </tr>
      <tr>
        <td class="head-col">项目阶段</td>
        <td class="head-col" colspan="3">
          <el-checkbox-group v-model="_formData.projectStage" @change="changeGroup">
            <el-checkbox label="设计输入" value="设计输入" />
            <el-checkbox label="外观输入" value="外观输入" />
            <el-checkbox label="结构设计" value="结构设计" />
            <el-checkbox label="手板评审" value="手板评审" />
            <el-checkbox label="模具评审" value="模具评审" />
          </el-checkbox-group>
        </td>
        <td class="head-col">评审时间</td>
        <td class="head-col">{{ _formData.auditDate }}</td>
      </tr>
      <tr>
        <td class="head-col" colspan="7">评审方法：</td>
      </tr>
      <tr>
        <td class="head-col" colspan="7">“□” 内打 “✓” 表示评审通过。</td>
      </tr>
      <tr>
        <td class="head-col" colspan="7">“□” 内打 “×” 表示评审不通过，须注明错误的原因，提出改善建议。</td>
      </tr>
      <tr>
        <td class="head-col" colspan="7">“□” 内打 “？” 表示有疑问，须注明待验证的事项或建议。</td>
      </tr>
      <tr>
        <td align="center" class="head-col" colspan="2">审核意见：</td>
        <td align="center" class="head-col">业务</td>
        <td align="center" class="head-col">业务部负责人</td>
        <td align="center" class="head-col">技术研发中心经理</td>
        <td align="center" class="head-col">技术研发中心副总</td>
      </tr>
      <tr>
        <td class="head-col" colspan="2">1.美观性 □</td>
        <td class="head-col"><el-input v-model="_formData.beautyRemark" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col"><el-input v-model="_formData.beautyRemark1" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col"><el-input v-model="_formData.beautyRemark2" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col"><el-input v-model="_formData.beautyRemark3" autosize type="textarea" placeholder=" " /></td>
      </tr>
      <tr>
        <td class="head-col" colspan="2">2.结构合理性、可行性 □</td>
        <td class="head-col"><el-input v-model="_formData.buildRemark" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col"><el-input v-model="_formData.buildRemark1" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col"><el-input v-model="_formData.buildRemark2" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col"><el-input v-model="_formData.buildRemark3" autosize type="textarea" placeholder=" " /></td>
      </tr>
      <tr>
        <td class="head-col" colspan="2">3.标准符合性 □</td>
        <td class="head-col"><el-input v-model="_formData.standardRemark" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col"><el-input v-model="_formData.standardRemark1" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col"><el-input v-model="_formData.standardRemark2" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col"><el-input v-model="_formData.standardRemark3" autosize type="textarea" placeholder=" " /></td>
      </tr>
      <tr>
        <td class="head-col" colspan="2">4.外观尺寸可行性 □</td>
        <td class="head-col"><el-input v-model="_formData.sizeRemark" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col"><el-input v-model="_formData.sizeRemark1" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col"><el-input v-model="_formData.sizeRemark2" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col"><el-input v-model="_formData.sizeRemark3" autosize type="textarea" placeholder=" " /></td>
      </tr>
      <tr>
        <td class="head-col" colspan="2">5.风格 □</td>
        <td class="head-col"><el-input v-model="_formData.styleRemark" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col"><el-input v-model="_formData.styleRemark1" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col"><el-input v-model="_formData.styleRemark2" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col"><el-input v-model="_formData.styleRemark3" autosize type="textarea" placeholder=" " /></td>
      </tr>
      <tr>
        <td class="head-col" colspan="2">6.颜色 □</td>
        <td class="head-col"><el-input v-model="_formData.colorRemark" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col"><el-input v-model="_formData.colorRemark1" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col"><el-input v-model="_formData.colorRemark2" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col"><el-input v-model="_formData.colorRemark3" autosize type="textarea" placeholder=" " /></td>
      </tr>
      <tr>
        <td class="head-col" colspan="2">7.创新度（与同类产品差异化） □</td>
        <td class="head-col"><el-input v-model="_formData.createRemark" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col"><el-input v-model="_formData.createRemark1" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col"><el-input v-model="_formData.createRemark2" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col"><el-input v-model="_formData.createRemark3" autosize type="textarea" placeholder=" " /></td>
      </tr>
      <tr>
        <td class="head-col" colspan="2">8.操作方便（外观与功能结合度） □</td>
        <td class="head-col"><el-input v-model="_formData.operateRemark" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col"><el-input v-model="_formData.operateRemark1" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col"><el-input v-model="_formData.operateRemark2" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col"><el-input v-model="_formData.operateRemark3" autosize type="textarea" placeholder=" " /></td>
      </tr>
      <tr>
        <td class="head-col" colspan="2">9.外观与环境适用度 □</td>
        <td class="head-col"><el-input v-model="_formData.envRemark" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col"><el-input v-model="_formData.envRemark1" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col"><el-input v-model="_formData.envRemark2" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col"><el-input v-model="_formData.envRemark3" autosize type="textarea" placeholder=" " /></td>
      </tr>
      <tr>
        <td class="head-col" colspan="2">10.继承性 □</td>
        <td class="head-col"><el-input v-model="_formData.extendsRemark" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col"><el-input v-model="_formData.extendsRemark1" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col"><el-input v-model="_formData.extendsRemark2" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col"><el-input v-model="_formData.extendsRemark3" autosize type="textarea" placeholder=" " /></td>
      </tr>
      <tr>
        <td class="head-col" colspan="2">11.工艺匹配度 □</td>
        <td class="head-col"><el-input v-model="_formData.technologyRemark" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col"><el-input v-model="_formData.technologyRemark1" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col"><el-input v-model="_formData.technologyRemark2" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col"><el-input v-model="_formData.technologyRemark3" autosize type="textarea" placeholder=" " /></td>
      </tr>
      <tr>
        <td class="head-col" colspan="2">12.表面处理工艺明确 □</td>
        <td class="head-col"><el-input v-model="_formData.surfaceRemark" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col"><el-input v-model="_formData.surfaceRemark1" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col"><el-input v-model="_formData.surfaceRemark2" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col"><el-input v-model="_formData.surfaceRemark3" autosize type="textarea" placeholder=" " /></td>
      </tr>
      <tr>
        <td class="head-col" colspan="2">13.零部件拆装工艺合理 □</td>
        <td class="head-col"><el-input v-model="_formData.partRemark" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col"><el-input v-model="_formData.partRemark1" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col"><el-input v-model="_formData.partRemark2" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col"><el-input v-model="_formData.partRemark3" autosize type="textarea" placeholder=" " /></td>
      </tr>
      <tr>
        <td class="head-col" colspan="2">14.按键定义正确 □</td>
        <td class="head-col"><el-input v-model="_formData.pressKeyRemark" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col"><el-input v-model="_formData.pressKeyRemark1" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col"><el-input v-model="_formData.pressKeyRemark2" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col"><el-input v-model="_formData.pressKeyRemark3" autosize type="textarea" placeholder=" " /></td>
      </tr>
      <tr>
        <td class="head-col" colspan="2">15.专利申请 □</td>
        <td class="head-col"><el-input v-model="_formData.patentRemark" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col"><el-input v-model="_formData.patentRemark1" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col"><el-input v-model="_formData.patentRemark2" autosize type="textarea" placeholder=" " /></td>
        <td class="head-col"><el-input v-model="_formData.patentRemark3" autosize type="textarea" placeholder=" " /></td>
      </tr>
      <tr>
        <td colspan="6" style="padding: 6px; font-size: 15px; text-align: left">
          <div style="color: #000">评审结论：</div>
          <div><el-input v-model="_formData.auditResult" :autosize="{ minRows: 2 }" type="textarea" placeholder=" " /></div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { reactive } from "vue";

const _formData = reactive({
  productModel: "",
  projectStage: [],
  productName: "",
  auditResult: "",
  auditMasterUserName: "",
  auditDate: dayjs().format("YYYY-MM-DD HH:mm:ss"),
  beautyRemark: "",
  beautyRemark1: "",
  beautyRemark2: "",
  beautyRemark3: "",
  buildRemark: "",
  buildRemark1: "",
  buildRemark2: "",
  buildRemark3: "",
  standardRemark: "",
  standardRemark1: "",
  standardRemark2: "",
  standardRemark3: "",
  sizeRemark: "",
  sizeRemark1: "",
  sizeRemark2: "",
  sizeRemark3: "",
  styleRemark: "",
  styleRemark1: "",
  styleRemark2: "",
  styleRemark3: "",
  colorRemark: "",
  colorRemark1: "",
  colorRemark2: "",
  colorRemark3: "",
  createRemark: "",
  createRemark1: "",
  createRemark2: "",
  createRemark3: "",
  operateRemark: "",
  operateRemark1: "",
  operateRemark2: "",
  operateRemark3: "",
  envRemark: "",
  envRemark1: "",
  envRemark2: "",
  envRemark3: "",
  extendsRemark: "",
  extendsRemark1: "",
  extendsRemark2: "",
  extendsRemark3: "",
  technologyRemark: "",
  technologyRemark1: "",
  technologyRemark2: "",
  technologyRemark3: "",
  surfaceRemark: "",
  surfaceRemark1: "",
  surfaceRemark2: "",
  surfaceRemark3: "",
  partRemark: "",
  partRemark1: "",
  partRemark2: "",
  partRemark3: "",
  pressKeyRemark: "",
  pressKeyRemark1: "",
  pressKeyRemark2: "",
  pressKeyRemark3: "",
  patentRemark: "",
  patentRemark1: "",
  patentRemark2: "",
  patentRemark3: ""
});

const changeGroup = () => {
  if (_formData.projectStage.length > 1) {
    _formData.projectStage.splice(0, 1);
  }
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
      // font-weight: 600;
      color: #000;
    }

    td {
      // text-align: center;
      padding: 4px 8px;
      border: 1px solid #000;
    }
  }
}
</style>
