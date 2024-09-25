<template>
  <div class="footer-area-wrapper">
    <div class="form-area">
      <EditForm
        :disabled="['add', 'view', 'edit'].includes(type)"
        :formInline="formData"
        :formConfigs="formConfigs({ changeHours, changeMaterialFee, changeComprehensiveRate, formData: topFormData, changeUserRate, changeMakeFee }, valid)"
      />
    </div>
    <div class="table-area">
      <SummaryModel ref="summaryModelRef" :type="type" :valid="valid" :setFormData="setFormData" :topFormData="topFormData" />
    </div>
  </div>
</template>

<script setup lang="ts">
import EditForm from "@/components/EditForm/index.vue";
import { reactive, ref, watch } from "vue";
import { formConfigs } from "./config";
import SummaryModel from "./summaryModel.vue";

const summaryModelRef = ref();
const props = defineProps(["topFormData", "setFormData", "type", "valid"]);

const formData: any = reactive({
  companyGrossMargin: props.type === "audit" ? 0.256 : undefined,
  productGrossMargin: props.type === "audit" ? 0.23 : undefined,
  userRate: props.type === "audit" ? 26 : undefined,
  makeFeeRate: props.type === "audit" ? 19 : undefined
});

watch(formData, (newVal) => {
  if (!isNaN(+props.topFormData.notTaxPrice) && newVal.materialFee) {
    formData.bomProportion = (newVal.materialFee / +props.topFormData.notTaxPrice).toFixed(2);
  }
  if (!isNaN(+props.topFormData.notTaxPrice) && !isNaN(+props.topFormData.laborCosts)) {
    formData.userProportion = (+props.topFormData.laborCosts / +props.topFormData.notTaxPrice).toFixed(2);
  }
  if (!isNaN(+props.topFormData.notTaxPrice) && !isNaN(+props.topFormData.manufacturingCosts)) {
    formData.makeFeeProportion = (+props.topFormData.manufacturingCosts / +props.topFormData.notTaxPrice).toFixed(2);
  }
});

/**综合毛利率改变会影响：不含税售价，含税售价以及售价(USD) */
const changeComprehensiveRate = (val) => {
  const notTaxPrice = (+props.topFormData.singleCostTotal / (1 - val)).toFixed(2);
  props.setFormData({ key: "notTaxPrice", val: notTaxPrice });

  const taxPriceFee = (+notTaxPrice * 1.13).toFixed(2);
  props.setFormData({ key: "taxPrice", val: taxPriceFee });
  props.setFormData({ key: "usdPrice", val: (+notTaxPrice / 7).toFixed(2) });
};

/**制造费率改变会影响：制造费用，制造费用占收入比，单机成本合计，单位边际贡献，保本销售量，不含税售价，含税售价以及售价(USD) */
const changeMakeFee = (val) => {
  const manufacturingCostsFee = (+formData.standardHours / 3600) * val;
  props.setFormData({ key: "manufacturingCosts", val: !isNaN(+formData.standardHours) ? manufacturingCostsFee.toFixed(2) : 0 });
  formData.makeFeeProportion = (+props.topFormData.manufacturingCosts / +props.topFormData.notTaxPrice).toFixed(2);

  const singleFee = formData.materialFee + +props.topFormData.laborCosts + +props.topFormData.manufacturingCosts;
  props.setFormData({ key: "singleCostTotal", val: singleFee.toFixed(2) });

  const marginalContributionFee = (+props.topFormData.notTaxPrice - singleFee).toFixed(2);
  props.setFormData({ key: "marginalContribution", val: marginalContributionFee });

  if (summaryModelRef.value?.dataList.some((item) => item.deograFee)) {
    const deograFeeArr = summaryModelRef.value?.dataList.filter((el) => el.deograFee) || [];
    const deograFeeTotal = deograFeeArr.reduce((pre, next) => pre + +next.deograFee, 0);
    props.setFormData({ key: "breakVenSales", val: Math.ceil(deograFeeTotal / +props.topFormData.marginalContribution) });
  }

  const notTaxPrice = (+props.topFormData.singleCostTotal / (1 - formData.companyGrossMargin)).toFixed(2);
  props.setFormData({ key: "notTaxPrice", val: notTaxPrice });

  const taxPriceFee = (+notTaxPrice * 1.13).toFixed(2);
  props.setFormData({ key: "taxPrice", val: taxPriceFee });
  props.setFormData({ key: "usdPrice", val: (+notTaxPrice / 7).toFixed(2) });
};

/**人工费率改变会影响：人工成本，人工成本占收入比，单机成本合计，单位边际贡献，保本销售量，不含税售价，含税售价以及售价(USD) */
const changeUserRate = (val) => {
  const laborFee = (+formData.standardHours / 3600) * val;
  props.setFormData({ key: "laborCosts", val: !isNaN(+formData.standardHours) ? laborFee.toFixed(2) : 0 });
  formData.userProportion = (+props.topFormData.laborCosts / +props.topFormData.notTaxPrice).toFixed(2);

  const singleFee = formData.materialFee + +laborFee + +props.topFormData.manufacturingCosts;
  props.setFormData({ key: "singleCostTotal", val: singleFee.toFixed(2) });

  const marginalContributionFee = (+props.topFormData.notTaxPrice - singleFee).toFixed(2);
  props.setFormData({ key: "marginalContribution", val: marginalContributionFee });

  if (summaryModelRef.value?.dataList.some((item) => item.deograFee)) {
    const deograFeeArr = summaryModelRef.value?.dataList.filter((el) => el.deograFee) || [];
    const deograFeeTotal = deograFeeArr.reduce((pre, next) => pre + +next.deograFee, 0);
    props.setFormData({ key: "breakVenSales", val: Math.ceil(deograFeeTotal / +props.topFormData.marginalContribution) });
  }

  const notTaxPrice = (+props.topFormData.singleCostTotal / (1 - formData.companyGrossMargin)).toFixed(2);
  props.setFormData({ key: "notTaxPrice", val: notTaxPrice });

  const taxPriceFee = (+notTaxPrice * 1.13).toFixed(2);
  props.setFormData({ key: "taxPrice", val: taxPriceFee });
  props.setFormData({ key: "usdPrice", val: (+notTaxPrice / 7).toFixed(2) });
};

const changeMaterialFee = (materialFee, laborCostsFee, manufacturingCostsFee) => {
  const singleFee = materialFee + +laborCostsFee + +manufacturingCostsFee;
  props.setFormData({ key: "singleCostTotal", val: singleFee.toFixed(2) });

  const notTaxPrice = (singleFee / (1 - formData.companyGrossMargin)).toFixed(2);
  props.setFormData({ key: "notTaxPrice", val: notTaxPrice });

  const marginalContributionFee = (+notTaxPrice - singleFee).toFixed(2);
  props.setFormData({ key: "marginalContribution", val: marginalContributionFee });

  const taxPriceFee = (+notTaxPrice * 1.13).toFixed(2);
  props.setFormData({ key: "taxPrice", val: taxPriceFee });
  props.setFormData({ key: "usdPrice", val: (+notTaxPrice / 7).toFixed(2) });
};

const changeHours = (val) => {
  const laborCostsFee = ((val / 3600) * formData.userRate).toFixed(2);
  const manufacturingCostsFee = ((val / 3600) * formData.makeFeeRate).toFixed(2);
  props.setFormData({ key: "laborCosts", val: laborCostsFee });
  props.setFormData({ key: "manufacturingCosts", val: manufacturingCostsFee });
  const materialFee = isNaN(+formData.materialFee) ? 0 : +formData.materialFee;
  const singleFee = materialFee + +laborCostsFee + +manufacturingCostsFee;
  props.setFormData({ key: "singleCostTotal", val: singleFee.toFixed(2) });

  const notTaxPrice = (singleFee / (1 - formData.companyGrossMargin)).toFixed(2);
  props.setFormData({ key: "notTaxPrice", val: notTaxPrice });

  const marginalContributionFee = (+notTaxPrice - singleFee).toFixed(2);
  props.setFormData({ key: "marginalContribution", val: marginalContributionFee });

  const taxPriceFee = (+notTaxPrice * 1.13).toFixed(2);
  props.setFormData({ key: "taxPrice", val: taxPriceFee });
  props.setFormData({ key: "usdPrice", val: (+notTaxPrice / 7).toFixed(2) });
};

defineExpose({ formData, summaryModelRef });
</script>

<style scoped lang="scss">
.footer-area-wrapper {
  display: flex;
  justify-content: space-between;
}

.form-area {
  width: 40%;
}

.table-area {
  width: 60%;
  padding-left: 28px;
}
</style>
