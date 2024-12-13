<template>
  <el-tabs v-model="activeName" @tab-click="handleClick" class="sale-tabs">
    <!-- :disabled="['add', 'view', 'edit'].includes(type)" -->
    <el-tab-pane label="各项汇总" name="SUMMARYLIST">
      <SummaryList ref="summaryListRef" :setFormData="setFormData" :topFormData="formData" :type="type" :valid="valid" />
    </el-tab-pane>
    <el-tab-pane label="BOM" name="BOM">
      <BomTable
        ref="bomRef"
        :valid="valid"
        :setFormData="setFormData"
        :formData="formData"
        :optionValues="optionValues"
        :summaryListRef="summaryListRef"
        :type="type"
      />
    </el-tab-pane>
    <el-tab-pane label="生产排位表" name="PRODSHEET">
      <ProductPosSheet :setFormData="setFormData" :valid="valid" :formData="formData" ref="productSheetRef" :summaryListRef="summaryListRef" :type="type" />
    </el-tab-pane>
    <el-tab-pane label="模具费" name="MODELFEE">
      <ModelFee
        ref="modelRef"
        :valid="valid"
        :setFormData="setFormData"
        :formData="formData"
        :optionValues="optionValues"
        :summaryListRef="summaryListRef"
        :type="type"
      />
    </el-tab-pane>
  </el-tabs>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import BomTable from "./bomTable.vue";
import ProductPosSheet from "./productPos.vue";
import ModelFee from "./modelFee.vue";
import SummaryList from "./summaryList/index.vue";

const activeName = ref("SUMMARYLIST");
const productSheetRef = ref();
const summaryListRef = ref();
const bomRef = ref();
const modelRef = ref();

defineProps(["setFormData", "formData", "optionValues", "type", "valid"]);

const handleClick = ({ paneName }) => {
  // console.log(paneName, "paneName");
};

defineExpose({ productSheetRef, summaryListRef, bomRef, modelRef });
</script>
