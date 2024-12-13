<template>
  <div class="apply-container" ref="printRef">
    <div class="apply-item">
      <div class="flex-col align-center justify-center">
        <img src="@/assets/logo/print_color_logo.png" width="40%" />
        <p class="fz-18 color-222 m-10">变更申请&执行单</p>
      </div>
      <div class="change-bill">
        <span>NO: RD-20240801-01</span>
        <span>单据编号: PD90150016</span>
        <span>FORM:QR-QC-003-09X</span>
      </div>
      <HxTableForm
        class="mb-20"
        ref="tableRef"
        :formRules="formRules"
        :formConfig="formConfig({ onPreviewImg, onTableChange })"
        :formData="formData"
        :formProps="{ labelWidth: '0', requireAsteriskPosition: 'right', inlineMessage: true }"
      />
    </div>
    <div class="apply-item page2">
      <div class="flex-col align-center justify-center">
        <img src="@/assets/logo/print_color_logo.png" width="40%" />
        <p class="fz-18 color-222 m-10">变更申请&执行单</p>
      </div>
      <div class="change-bill">
        <span>NO: RD-20240712-01</span>
        <span>单据编号: PD90150016</span>
        <span>FORM:QR-QC-003-09X</span>
      </div>
      <HxTableForm
        class="mb-10"
        ref="tableRef"
        :formRules="formRules"
        :formConfig="formConfig2()"
        :formData="formData2"
        :formProps="{ labelWidth: '0', requireAsteriskPosition: 'right', inlineMessage: true }"
      />
      <HxTableForm
        class="mb-10"
        ref="tableRef"
        :formRules="formRules"
        :formConfig="formConfig3()"
        :formData="formData3"
        :formProps="{ labelWidth: '0', requireAsteriskPosition: 'right', inlineMessage: true }"
      />
      <div class="ui-ta-c">
        <h2>附 页 (变更申请验证项目清单)</h2>
      </div>
      <HxTableForm
        class="table-form"
        ref="tableRef"
        :formRules="formRules"
        :formConfig="formConfig4()"
        :formData="formData4"
        :formProps="{ labelWidth: '0', requireAsteriskPosition: 'right', inlineMessage: true }"
      />
    </div>

    <el-dialog v-model="dialogVisible" :append-to-body="true" :draggable="true" class="goods-dialog">
      <el-image :src="dialogImageUrl" fit="contain" :zoom-rate="1.2" :preview-src-list="[dialogImageUrl]" :hide-on-click-modal="true">
        <template #error>
          <div class="el-image__error">暂无图片</div>
        </template>
      </el-image>
    </el-dialog>
  </div>
</template>

<script setup lang="tsx">
import { reactive, ref } from "vue";
import HxTableForm from "@/components/HxTableForm/index.vue";
import { formConfig, formConfig2, formConfig3, formConfig4, formRules } from "./config";
import Print from "@/utils/print";

const dialogVisible = ref(false);
const dialogImageUrl = ref("");
const printRef = ref();
const tableRef = ref();
const formData = reactive({
  xxx1: "数据1",
  xxx2: "数据2",
  xxx3: "数据3",
  xxx4: "数据4",
  xxx5: "数据5",
  xxx6: "数据6",
  xxx7: "数据7",
  xxx8: "数据8",
  xxx9: ["好的B", "好的D"],
  xxx10: "数据10",
  xxx11: "数据11",
  xxx12: "数据12",
  xxx13: "数据13",
  xxx14: [],
  xxx15: "数据15",
  xxx16: "数据16",
  xxx17: "数据17",
  xxx18: "数据18",
  xxx19: "数据19",
  date: "2024-08-01",
  applyDepartment: "1",
  applyUser: "2",
  customerName: "3",
  productName: "4",
  productModel: "5",
  changeType: "6",
  changeStage: "7",
  changeReason: ["工艺改进", "供应商变更"],
  changeTheme: "9",
  reason: "10",
  changeBefore: "11",
  changeAfter: "12",
  changeProject: ["1", "工具变更", "检查方法变更"],
  changeModify: ["作业指导书", "客户验收标准"],
  changeStartDate: "2024-08-14",
  changeImplementDepartment: "15",
  changeFirstBatch: "16",
  changeBom: ["是"],
  oldMaterialCode: "17",
  newMaterialCode: "18",
  departmentAudit: "13",
  ecrApproval: "14",
  technologyDevelopmentCenterOpinion: "18",
  changeScope: ["结构", "电子"],
  changeWay: ["用完旧品后自然切换新品"],
  technologyEngineer: "19",
  technologyDirector: "20",
  qualityCenterOpinion: "21",
  qualityEngineer: "22",
  qualityDirector: "23",
  marketingCenterOpinion: "24",
  confirmOpinion: ["不需要客户确认"],
  businessManager: "25",
  productCenterOpinion: "26",
  productManager: "27",
  productEngineer: "28",
  productDirector: "29",
  deputyDirectorOpinion: "30",
  deputyDirectorSign: "31",
  influenceRange: ["工装治具", "生产工艺"]
});
const formData2 = reactive({
  bbb1: "数据1",
  bbb2: ["OK"],
  bbb3: "数据3",
  bbb4: "数据4",
  bbb5: "数据5",
  bbb6: "数据6",
  bbb7: "数据7",
  bbb8: "数据8",
  bbb9: ["好的", "好的"],
  bbb10: "数据10",
  bbb11: "数据11",
  bbb12: "数据12"
});
const formData3 = reactive({
  ccc1: [],
  ccc2: ["客户书面批准"],
  ccc3: "数据3",
  ccc4: "数据4",
  ccc5: "数据5",
  ccc6: "数据6",
  ccc7: [],
  ccc8: "数据8",
  ccc9: "s",
  ccc10: [],
  ccc11: "数据11",
  ccc12: "数据12",
  ccc13: ["BOM变更"],
  ccc14: "数据14",
  ccc15: "",
  ccc16: "数据16",
  ccc17: "数据17",
  ccc18: "",
  ccc19: "数据19",
  ccc20: "",
  ccc21: "数据21",
  ccc22: "数据22",
  ccc23: "数据23",
  ccc24: "数据24",
  ccc25: ["认证"],
  ccc26: "数据26",
  ccc27: "",
  ccc28: "数据28",
  ccc29: "数据29",
  ccc30: "数据30",
  ccc31: "数据31",
  ccc32: "数据32",
  ccc33: "数据33",
  ccc34: ["RoHS 其他报告"],
  ccc35: "数据35",
  ccc36: "数据36"
});
const formData4 = reactive({
  // ddd1: [],
  // ddd2: "数据2",
  // ddd3: "数据3",
  // ddd4: "数据4",
  // ddd5: [],
  // ddd6: "数据6",
  // ddd7: "数据7",
  // ddd8: "数据8",
  // ddd9: [],
  // ddd10: "s",
  // ddd11: "数据11",
  // ddd12: "数据12",
  // ddd13: ["老化实验"],
  // ddd14: "数据14",
  // ddd15: "",
  // ddd16: "数据16",
  // ddd17: ["温度确认"],
  // ddd18: "",
  // ddd19: "数据19",
  // ddd20: "",
  // ddd21: ["功率确认"],
  // ddd22: "数据22",
  // ddd23: "数据23",
  // ddd24: "数据24",
  // ddd25: [],
  // ddd26: "数据26",
  // ddd27: "",
  // ddd28: "数据28",
  // ddd29: "数据29",
  // ddd30: [],
  // ddd31: "数据31",
  // ddd32: "数据32",
  // ddd33: "数据33",
  // ddd34: ["RoHS 其他报告"],
  // ddd35: "数据35",
  // ddd36: "数据36",
  // ddd37: "数据37",
  // ddd38: "数据38",
  // ddd39: "数据39",
  // ddd40: ["工装方面"],
  // ddd41: "数据41",
  // ddd42: "数据42",
  // ddd43: "数据43",
  // ddd44: "数据44",
  // ddd45: "数据45",
  // ddd46: "数据46",
  // ddd47: "数据47",
  // ddd48: "数据48",
  // ddd49: "数据49",
  // ddd50: "数据50",
  // ddd51: "数据51",
  // ddd52: ["操作合理性"],
  // ddd53: "数据53",
  // ddd54: "数据54",
  // ddd55: "数据55",
  // ddd56: "数据56",
  // ddd57: "数据57",
  // ddd58: "数据58",
  // ddd59: "数据59",
  // ddd60: "数据60",
  // ddd61: "数据61",
  // ddd62: "数据62",
  // ddd63: "数据63",
  // ddd64: "数据64",
  // ddd65: "数据65",
  // ddd66: "数据66",
  // ddd67: "数据67",
  // ddd68: ["RoHS确认"],
  // ddd69: "数据69",
  // ddd70: "数据70",
  // ddd71: "数据71",
  // ddd72: "数据72",
  // ddd73: "数据73",
  // ddd74: "数据74",
  // ddd75: "数据75",
  // ddd76: ["XRF确认"],
  // ddd77: "数据77"
});
function getRef() {
  if (printRef.value) Print(printRef.value);
  const formRef = tableRef.value.getRef();
  return { formData, formData3, formData4, formRef };
}

const onTableChange = (data) => {
  console.log("表格", data);
};
const onPreviewImg = ({ url }) => {
  dialogImageUrl.value = url;
  dialogVisible.value = true;
};
const onPrint = () => {
  if (printRef.value) {
    Print(printRef.value);
  }
};

defineExpose({ onPrint, getRef });
</script>

<style lang="scss">
$color: #111;
$size: 16px;

@media print {
  @page {
    size: a4 portrait;
    margin: 10mm;
  }

  .el-checkbox__inner {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .apply-item {
    font-size: 12px;
    page-break-after: always;

    .change-bill {
      font-size: 10px !important;
    }

    .el-upload--picture-card,
    .el-upload-list__item {
      width: 46px !important;
      height: 40px !important;

      &:nth-child(4n) {
        margin-right: 0;
      }

      &:nth-child(5n) {
        margin-right: 8px !important;
      }
    }

    .el-upload.el-upload--picture-card {
      display: none !important;
    }
  }
}

.apply-item {
  padding: 0 2px;

  .change-bill {
    display: flex;
    justify-content: space-between;
    padding-bottom: 2px;
    font-size: 14px;
  }

  .table-form {
    .el-table .cell {
      overflow: hidden !important;
      font-size: 10px !important;
      font-weight: normal !important;
    }
  }

  .table-form table tr td {
    padding: 0 2px !important;
    font-family: "宋体", Arial, sans-serif, serif;
    color: $color !important;
  }

  .el-input__prefix {
    display: none;
  }

  .el-form-item label,
  .el-input__inner,
  .el-textarea__inner {
    font-family: "宋体", Arial, sans-serif, serif;
    font-size: $size;
    color: $color;
    cursor: default;
  }

  .el-checkbox__inner,
  .el-checkbox__inner::after {
    border-color: $color;
  }

  .el-checkbox__input.is-checked .el-checkbox__inner,
  .el-checkbox__input.is-disabled .el-checkbox__inner,
  .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
    background-color: transparent;
    border-color: $color;
  }

  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: $color !important;
  }

  .el-checkbox.el-checkbox--small .el-checkbox__label {
    font-size: $size;
    color: $color;
    cursor: default;
  }
}
</style>
