<template>
  <div class="quotaion_detail"><Detail :formInline="formInline" type="audit" ref="detailRef" /></div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import Detail from "./detail.vue";
import { formConfigs } from "./config";
import { getBOMTableRowSelectOptions } from "@/api/plmManage";
import { findByIdSaleQuotationList } from "@/api/oaManage/marketing";
import { roleUserList } from "@/api/systemManage";
import { approvalBillNO, backBillNO } from "@/api/workbench/infoCenter";

const formInline: any = reactive({});
const detailRef = ref();
const tabsRef = ref();
const optionValues = ref([]);
const devUsers = ref([]);
const props = defineProps(["id", "rowData"]);
const billState = ref();

const setFormData = ({ key, val }) => (formInline[key] = val);

const initFormInfo = (valid, fn) => {
  getBOMTableRowSelectOptions({ optioncode: "MaterialUnits,QuotationFixedCost" }).then((res) => {
    if (res.data) {
      optionValues.value = res.data || [];
      const modelTypeList = res.data.find((item) => item.optionCode === "QuotationFixedCost")?.optionList || [];
      tabsRef.value.summaryListRef.summaryModelRef.dataList = modelTypeList.map((item) => ({
        id: "",
        projectId: item?.optionValue,
        modelType: item?.optionName,
        deograFee: "",
        customerFee: "",
        remark: ""
      }));

      if (typeof fn === "function") fn();
    }
  });

  roleUserList({ roleId: 39 }).then((res) => {
    if (res.data) {
      devUsers.value = res.data;
    }
  });
  detailRef.value.formConfigs = formConfigs({ setFormData, formData: formInline, tabsRef, optionValues, type: "audit" }, devUsers, valid).filter((item) => {
    if (valid.assignee) return item;

    return item.prop !== "assignee";
  });
};

const initData = ({ id, processInstId, taskId }) => {
  findByIdSaleQuotationList({ id, processInsId: processInstId, taskId }).then((res: any) => {
    if (res.data) {
      const initSetData = () => {
        setTimeout(() => {
          // 回显bom清单
          tabsRef.value.bomRef.dataList =
            res.data.bomDetails?.map((item) => ({
              id: item.id,
              level: item.bomLevel,
              childMaterialNo: item.subItemMaterialCode,
              materialName: item.materialName,
              specifications: item.specificationModel,
              materialAttr: item.materialProperty,
              bomVersion: item.bomVersion,
              dataStatus: item.dataState,
              unit: item.unit,
              numerator: item.dosageNumerator,
              denominator: item.dosageDenominator,
              standardDosage: item.standardDosage,
              noTaxPrice: item.exTaxUnitPrice,
              noTaxMoney: item.exTaxAmount,
              remark: item.remark
            })) || [];

          // 回显模具清单
          tabsRef.value.modelRef.dataList3 =
            res.data.moldCostDetails?.map((item) => ({
              "3DName": item.name3D,
              partName: item.partName,
              noOfModel: item.cavityCount,
              materialAndNo: item.materialAndGrade,
              modelSurfaceTreatment: item.moldSurfaceTreatment,
              prodSurfaceTreatment: item.productSurfaceTreatment,
              modelNo: item.moldNumber,
              weight: item.weight,
              t1: item.dataT1,
              type: item.moldType,
              deograFee: item.delongCost,
              customerFee: item.customerCost,
              modelHasTax: item.moldIncludingTax,
              clampHasTax: item.fixtureMoldIncludingTax,
              supplier: item.supplier,
              remark: item.remark
            })) || [];
          setFormData({ key: "customerName", val: res.data.masterDetails?.customerName });
          billState.value = res.data.masterDetails?.billState;
          setFormData({ key: "productDescription", val: res.data.masterDetails?.productDescription });
          setFormData({ key: "isRepeatOrder", val: res.data.masterDetails?.isRepeatOrder });
          setFormData({ key: "referenceNumber", val: res.data.masterDetails?.referenceNumber });
          setFormData({ key: "processRequirements", val: res.data.masterDetails?.processRequirements });
          setFormData({ key: "expectedSalesVolume", val: res.data.masterDetails?.expectedSalesVolume });
          setFormData({ key: "expectedSalesAmount", val: res.data.masterDetails?.expectedSalesAmount });
          setFormData({ key: "remark", val: res.data.masterDetails?.remark });

          // 回显生产排位表
          tabsRef.value.productSheetRef.dataList2 =
            res.data.assembleDetails?.assemblyChildrenDTOList?.map((item) => ({
              productPCS: item.capacityPCS,
              id: item.id,
              workContent: item.operationContent,
              peopleAmount: item.peopleCount,
              combine: item.personnelEquipmentFixtures,
              posNo: item.scheduleNumber,
              st: item.stSeconds,
              workshop: item.type
            })) || [];
        });
      };

      initFormInfo(res.data.valida, initSetData);
    }
  });
};

onMounted(() => {
  if (props.id && props.rowData) {
    initData(props.rowData);
  }
});

const submitAction = (auditData, fn) => {
  console.log(auditData, "auditData=>>");
  const { processDefId, processInstId, callbackFn, backToActivityId, billNo, taskId, comment, projectId, id } = auditData;
  if (backToActivityId) {
    //回退
    backBillNO(
      {
        processInsId: processInstId,
        processDefId,
        billNo,
        projectId,
        comment,
        backToActivityId
      },
      { dbKey: projectId }
    ).then((res) => {
      if (res.data) {
        if (typeof callbackFn === "function") callbackFn();
      }
    });
    return;
  }
  /** 1. 校验表单信息 */
  const formIns = detailRef.value.formRef.getRef();
  formIns?.validate(async (valid) => {
    if (valid) {
      const summaryListFormData = tabsRef.value?.summaryListRef?.formData;
      const fixedCostList = tabsRef.value?.summaryListRef?.summaryModelRef?.dataList || [];
      const modelTotalList = fixedCostList?.filter((item) => !isNaN(item.deograFee)).map((item) => +item.deograFee);
      const modelUserTotalList = fixedCostList?.filter((item) => !isNaN(item.customerFee)).map((item) => +item.customerFee);
      const summaryNum = modelTotalList.reduce((pre, next) => pre + next);
      const userSummaryNum = modelUserTotalList.reduce((pre, next) => pre + next);

      const assembleArr = tabsRef.value.productSheetRef.dataList2 || [];

      const assemblePosDataList = assembleArr.map((item) => ({
        capacityPCS: item.productPCS,
        id: "",
        mainTableId: "",
        operationContent: item.workContent,
        peopleCount: item.peopleAmount,
        personnelEquipmentFixtures: item.combine,
        scheduleNumber: item.posNo,
        stSeconds: item.st,
        type: item.workshop
      }));

      const moldCostDetailList = tabsRef.value.modelRef.dataList3?.map((item) => ({
        name3D: item["3DName"],
        partName: item.partName,
        cavityCount: item.noOfModel,
        materialAndGrade: item.materialAndNo,
        moldSurfaceTreatment: item.modelSurfaceTreatment,
        productSurfaceTreatment: item.prodSurfaceTreatment,
        moldNumber: item.modelNo,
        weight: item.weight,
        dataT1: item.t1,
        moldType: item.type,
        delongCost: item.deograFee,
        customerCost: item.customerFee,
        moldIncludingTax: item.modelHasTax,
        fixtureMoldIncludingTax: item.clampHasTax,
        supplier: item.supplier,
        remark: item.remark
      }));

      const bomDetailList = tabsRef.value.bomRef.dataList?.map((item) => ({
        id: "",
        bomLevel: item.level,
        subItemMaterialCode: item.childMaterialNo,
        materialName: item.materialName,
        specificationModel: item.specifications,
        materialProperty: item.materialAttr,
        bomVersion: item.bomVersion,
        dataStatus: item.dataState,
        unit: item.unit,
        dosageNumerator: item.numerator,
        dosageDenominator: item.denominator,
        standardDosage: item.standardDosage,
        exTaxUnitPrice: +item.noTaxPrice,
        exTaxAmount: +item.noTaxMoney,
        remark: item.remark
      }));

      const mapFixedCostList = fixedCostList?.map((item) => ({
        id: "",
        unit: "RMB",
        projectTypeId: item.projectId,
        delongCost: +item.deograFee,
        customerCost: +item.customerFee,
        masterDataId: id,
        remark: item.remark,
        projectName: item.modelType
      }));

      const assembleUserTotal = assemblePosDataList.filter((item) => !isNaN(item.peopleCount)).reduce((pre, next) => pre + +next.peopleCount, 0);

      const assembleStTotal = assemblePosDataList.filter((item) => !isNaN(item.stSeconds)).reduce((pre, next) => pre + +next.stSeconds, 0);

      const assemblePCSTotal = assemblePosDataList.filter((item) => !isNaN(item.capacityPCS)).reduce((pre, next) => pre + +next.capacityPCS, 0);

      // 组装审批参数
      const approvalParams = {
        processDefId,
        processInsId: processInstId,
        billNo,
        billId: "10052",
        comment,
        taskId,
        dataLists: [
          {
            formModel: "",
            billId: "10052",
            dataHashMap: {
              assignee: formInline.assignee,
              masterDetails: {
                id,
                billNo,
                billState: billState.value,
                productDescription: formInline.productDescription,
                customerName: formInline.customerName,
                isRepeatOrder: formInline.isRepeatOrder,
                referenceNumber: formInline.referenceNumber,
                processRequirements: formInline.processRequirements,
                expectedSalesAmount: formInline.expectedSalesAmount,
                remark: formInline.remark,
                expectedSalesVolume: formInline.expectedSalesVolume,
                breakevenSalesVolume: isNaN(+formInline.breakVenSales) ? 0 : +formInline.breakVenSales,
                exTaxSalesCompanyGrossMargin: isNaN(+formInline.notTaxPrice) ? 0 : +formInline.notTaxPrice,
                exTaxSalesCompanyGrossMarginRate: summaryListFormData.companyGrossMargin,
                exTaxSalesCustomerProductGrossMargin: !isNaN(+formInline.singleCostTotal)
                  ? (formInline.singleCostTotal / (1 - summaryListFormData.productGrossMargin)).toFixed(2)
                  : 0,
                exTaxSalesCustomerProductGrossMarginRate: summaryListFormData.productGrossMargin,
                inTaxSalesCompanyGrossMargin: isNaN(+formInline.taxPrice) ? 0 : +formInline.taxPrice,
                inTaxSalesCompanyGrossMarginRate: 0.272,
                inTaxSalesCustomerProductGrossMargin: !isNaN(+formInline.singleCostTotal)
                  ? ((formInline.singleCostTotal / (1 - summaryListFormData.productGrossMargin)) * 1.13).toFixed(2)
                  : 0,
                inTaxSalesCustomerProductGrossMarginRate: summaryListFormData.productGrossMargin,
                salesCompanyGrossMargin: isNaN(+formInline.usdPrice) ? 0 : +formInline.usdPrice,
                salesCompanyGrossMarginRate: 0.272,
                salesCustomerProductGrossMargin: !isNaN(+formInline.singleCostTotal)
                  ? (formInline.singleCostTotal / (1 - summaryListFormData.productGrossMargin) / 7).toFixed(2)
                  : 0,
                salesCustomerProductGrossMarginRate: summaryListFormData.productGrossMargin,
                materialCostExTaxAmount: summaryListFormData.materialFee ?? 0,
                materialCostIncomeRatio: isNaN(+summaryListFormData.bomProportion) ? 0 : +summaryListFormData.bomProportion,
                materialCostRemark: "BOM",
                laborCostExTaxAmount: formInline.laborCosts ?? 0,
                laborCostRate: summaryListFormData.userRate,
                laborCostIncomeRatio: isNaN(+summaryListFormData.userProportion) ? 0 : summaryListFormData.userProportion,
                laborCostRemark: "",
                manufacturingCostExTaxAmount: formInline.manufacturingCosts ?? 0,
                manufacturingCostRate: summaryListFormData.makeFeeRate,
                manufacturingCostIncomeRatio: isNaN(+summaryListFormData.makeFeeProportion) ? 0 : +summaryListFormData.makeFeeProportion,
                manufacturingCostRemark: "",
                totalUnitCostExTaxAmount: isNaN(+formInline.singleCostTotal) ? 0 : +formInline.singleCostTotal,
                unitContributionMarginExTaxAmount: isNaN(+formInline.marginalContribution) ? 0 : +formInline.marginalContribution,
                totalFixedDelongCost: summaryNum,
                totalFixedCustomerCost: userSummaryNum,
                totalFixedCostRemark: "",
                bomTotalExTaxAmount: summaryListFormData.materialFee ?? 0
              },
              fixedCostDetails: mapFixedCostList,
              bomDetails: bomDetailList,
              moldCostDetails: moldCostDetailList,
              assembleDetails: {
                assemblyChildrenDTOList: assemblePosDataList,
                capacityPCS: assemblePCSTotal,
                fileName: "",
                fileNumber: "",
                hc: assembleUserTotal,
                id: "",
                masterDataId: id,
                standardTime: assembleUserTotal & assembleStTotal ? (assembleUserTotal * assembleStTotal * 1.05).toFixed(2) : 0,
                totalPeople: assembleUserTotal,
                totalSt: assembleStTotal,
                uph: assembleStTotal ? (3600 / assembleStTotal).toFixed(2) : 0,
                upph: assembleStTotal & assembleUserTotal ? (3600 / assembleStTotal / assembleUserTotal).toFixed(2) : 0,
                version: ""
              }
            }
          }
        ]
      };
      console.log(approvalParams, "approvalParams=>>");
      // return;
      approvalBillNO(approvalParams, { dbKey: projectId }).then((res) => {
        if (res.data) {
          if (typeof callbackFn === "function") callbackFn();
        }
      });
      if (typeof fn === "function") fn();
    }
  });
};

defineExpose({ formInline, tabsRef, submitAction });
</script>

<style lang="scss">
.quotaion_detail {
  .el-form-item--small.el-form-item {
    margin-bottom: 2px !important;
  }

  .dialog-form {
    padding: 0 !important;
  }

  .el-dialog__body {
    padding-top: 8px !important;
  }

  .el-form-item__content {
    width: 200px;
  }
}
</style>
