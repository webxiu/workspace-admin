<template>
  <div class="trial-detail">
    <table>
      <tr>
        <td colspan="3" class="head-col">产品型号</td>
        <td width="240px">
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
        </td>
        <td class="head-col">产品名称</td>
        <td colspan="2"><el-input placeholder=" " v-model="formData.productName" /></td>
        <td class="head-col">作成日期</td>
        <td>
          <el-date-picker
            v-model="formData.doneDate"
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
        <td colspan="9" class="line-txt">一、产品策划内容</td>
      </tr>
      <tr>
        <td colspan="3" class="head-col">目标价格</td>
        <td colspan="2"><el-input placeholder=" " v-model="formData.targetPrice" /></td>
        <td colspan="2" class="head-col">预计年销售量</td>
        <td colspan="2"><el-input placeholder=" " v-model="formData.saleCountYear" /></td>
      </tr>
      <tr>
        <td colspan="9" class="line-txt">二、产品单机成本</td>
      </tr>
      <tr>
        <td class="head-col">序号</td>
        <td class="head-col" colspan="2">内容</td>
        <td class="head-col">费用核算部门</td>
        <td class="head-col" colspan="3">预算金额</td>
        <td class="head-col" colspan="2">承认</td>
      </tr>
      <tr v-for="(item, idx) in singleDataList" :key="idx">
        <td class="head-col">{{ idx + 1 }}</td>
        <td class="head-col" colspan="2">{{ item.content }}</td>
        <td class="head-col">{{ item.deptName }}</td>
        <td class="head-col" colspan="3"><el-input placeholder=" " v-model="item.money" /></td>
        <td class="head-col" colspan="2"><el-input placeholder=" " v-model="item.recognizeStr" /></td>
      </tr>
      <tr>
        <td colspan="9" class="line-txt">三、产品开发成本</td>
      </tr>
      <tr>
        <td class="head-col">序号</td>
        <td class="head-col" colspan="2">内容</td>
        <td class="head-col">费用核算部门</td>
        <td class="head-col" colspan="3">预算金额</td>
        <td class="head-col" colspan="2">费用承担方</td>
      </tr>
      <tr v-for="(item, idx) in devFeeDataList" :key="idx">
        <td class="head-col">{{ idx + 1 }}</td>
        <td class="head-col" colspan="2">{{ item.content }}</td>
        <td class="head-col">{{ item.deptName }}</td>
        <td class="head-col" colspan="3"><el-input placeholder=" " v-model="item.money" /></td>
        <td class="head-col" colspan="2">
          <el-checkbox-group v-model="item.recognize" @change="() => changeGroup(idx)">
            <el-checkbox label="德龙承担" value="德龙承担" />
            <el-checkbox label="客户承担" value="客户承担" />
          </el-checkbox-group>
        </td>
      </tr>
      <tr>
        <td :rowspan="3" width="50px" class="head-col">6</td>
        <td :rowspan="3" width="50px" class="head-col">验证样机费用</td>
        <td width="100px" class="head-col">PR试产</td>
        <td width="140px" class="head-col" :rowspan="3">技术研发中心</td>
        <td :colspan="3"><el-input placeholder=" " v-model="formData.prMoney" /></td>
        <td :colspan="2"><el-input placeholder=" " v-model="formData.prRecognizeStr" /></td>
      </tr>
      <tr>
        <td width="100px" class="head-col">PP试产</td>
        <td :colspan="3"><el-input placeholder=" " v-model="formData.ppMoney" /></td>
        <td :colspan="2"><el-input placeholder=" " v-model="formData.ppRecognizeStr" /></td>
      </tr>
      <tr>
        <td width="100px" class="head-col">其它试产</td>
        <td :colspan="3"><el-input placeholder=" " v-model="formData.otherMoney" /></td>
        <td :colspan="2"><el-input placeholder=" " v-model="formData.otherRecognizeStr" /></td>
      </tr>
      <tr v-for="(item, idx) in extraDevFeeDataList" :key="idx">
        <td class="head-col">7</td>
        <td class="head-col" colspan="2">{{ item.content }}</td>
        <td class="head-col">{{ item.deptName }}</td>
        <td class="head-col" colspan="3"><el-input placeholder=" " v-model="item.money" /></td>
        <td class="head-col" colspan="2">
          <el-checkbox-group v-model="item.recognize" @change="changeGroup2">
            <el-checkbox label="德龙承担" value="德龙承担" />
            <el-checkbox label="客户承担" value="客户承担" />
          </el-checkbox-group>
        </td>
      </tr>
      <tr>
        <td colspan="9" class="line-txt">四、项目预算统计</td>
      </tr>
      <tr>
        <td colspan="3" class="head-col">产品单机成本合计</td>
        <td colspan="4"><el-input placeholder=" " v-model="formData.singleFeeTotal" /></td>
        <td colspan="2" rowspan="3">
          <div>
            <div>费用分摊：</div>
            <div><el-input v-model="formData.shareEquallyFee" :autosize="{ minRows: 4 }" type="textarea" placeholder=" " /></div>
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="3" class="head-col">产品开发成本合计</td>
        <td colspan="4"><el-input placeholder=" " v-model="formData.devFeeTotal" /></td>
      </tr>
      <tr>
        <td colspan="3" class="head-col">产品单机成本合计</td>
        <td colspan="4"><el-input placeholder=" " v-model="formData.projectTotal" /></td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="tsx">
import { reactive, ref } from "vue";

const singleDataList = ref([
  { content: "裸机材料成本", deptName: "采购部", money: "", recognizeStr: "" },
  { content: "包材", deptName: "市场营销中心", money: "", recognizeStr: "" },
  { content: "制造成本", deptName: "工程部", money: "", recognizeStr: "" },
  { content: "工装治具费用", deptName: "工程部", money: "", recognizeStr: "" }
]);

const devFeeDataList = ref([
  { content: "外观手板", deptName: "技术研发中心", money: "", recognizeStr: "", recognize: [] },
  { content: "功能手板", deptName: "技术研发中心", money: "", recognizeStr: "", recognize: [] },
  { content: "研发费用", deptName: "技术研发中心", money: "", recognizeStr: "", recognize: [] },
  { content: "模具费用", deptName: "敬孚", money: "", recognizeStr: "", recognize: [] },
  { content: "修模费用", deptName: "敬孚", money: "", recognizeStr: "", recognize: [] }
]);

const extraDevFeeDataList = ref([{ content: "认证费用", deptName: "技术研发中心", money: "", recognize: [] }]);

const formData: any = reactive({
  productModel: "",
  productName: ""
});

const changeGroup = (idx) => {
  if (devFeeDataList.value[idx].recognize.length > 1) {
    devFeeDataList.value[idx].recognize.splice(0, 1);
  }
};

const changeGroup2 = () => {
  if (extraDevFeeDataList.value[0].recognize.length > 1) {
    extraDevFeeDataList.value[0].recognize.splice(0, 1);
  }
};

const onSelect = (val) => {
  formData.productModel = val.productCode;
};

defineExpose({ formData, singleDataList, devFeeDataList, extraDevFeeDataList });
</script>

<style scoped lang="scss">
.trial-detail {
  table {
    width: 100%;

    :deep(.el-upload--picture-card) {
      background-color: #fff;
    }

    .line-txt {
      padding: 6px;
      font-weight: 700;
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
