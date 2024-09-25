<template>
  <div class="apply-container" ref="printRef">
    <div class="flex-col align-center justify-center">
      <img src="@/assets/logo/print_color_logo.png" width="40%" />
      <p class="fz-16 color-222 m-10">变更申请&执行单</p>
    </div>
    <div class="change-bill">
      <span>NO: RD-20240801-01</span>
      <span>单据编号: PD90150016</span>
      <span>FORM:QR-QC-003-09X</span>
    </div>
    <div class="item-box border-form-line">
      <div class="cate-title no-wrap">ECR申请</div>
      <EditForm
        ref="formRef"
        :formInline="formData"
        :formItemGutter="0"
        :formRules="formRules"
        :formProps="{ labelWidth: '70px', requireAsteriskPosition: 'right', inlineMessage: true }"
        :formConfigs="formConfigs({ onPreviewImg })"
        class="border-form form1"
      />
    </div>
    <div class="item-box border-form-line">
      <div class="cate-title no-wrap">ECN执行</div>
      <EditForm
        ref="formRef2"
        :formInline="formData"
        :formItemGutter="0"
        :formProps="{ labelWidth: '80px', requireAsteriskPosition: 'right', inlineMessage: true }"
        :formConfigs="formConfigs2({ onTableChange })"
        class="border-form"
      />
    </div>
    <div class="item-box border-form-line end-item">
      <div class="cate-title no-wrap">ECN执行</div>
      <EditForm
        ref="formRef3"
        :formInline="formData"
        :formItemGutter="0"
        :formProps="{ labelWidth: '80px', requireAsteriskPosition: 'right', inlineMessage: true }"
        :formConfigs="formConfigs3()"
        class="border-form"
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

<script setup lang="ts">
import { ref } from "vue";
import EditForm from "@/components/EditForm/index.vue";
import { formConfigs, formRules, formConfigs2, formConfigs3 } from "./config";
import Print from "@/utils/print";

const dialogVisible = ref(false);
const dialogImageUrl = ref("");
const printRef = ref();
const formRef = ref();
const formRef2 = ref();
const formRef3 = ref();
const formData = ref({
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

function getRef() {
  const FormRef = formRef.value.getRef();
  const FormRef2 = formRef2.value.getRef();
  const FormRef3 = formRef3.value.getRef();

  console.log("==========", { ...formData.value });

  FormRef.validate((valid) => {
    if (valid) {
      console.log("submit!");
    }
  });
  return formData;
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
@media print {
  @page {
    size: a4 portrait;
    margin: 10mm;
  }

  .apply-container {
    font-size: 12px;
    page-break-after: avoid;
    // min-height: 100% !important;
    // min-width: 100% !important;
    // transform: scale(0.85);
    .change-bill {
      font-size: 10px !important;
    }
    .end-item {
      page-break-inside: avoid; /* 避免在元素内部换页 */
      page-break-after: always; /* 在元素后强制换页 */
    }
    .cate-title {
      padding: 0 6px !important;
      font-size: 10px !important;
    }

    .form-label {
      font-weight: normal !important;
    }

    .border-form {
      width: 100%;
      overflow: hidden;
      .el-form-item__label {
        font-size: 10px !important;
        font-weight: normal !important;
      }
      &.form1 .el-form-item__label {
        max-height: 14px !important;
        line-height: 14px !important;
      }
    }
    .el-checkbox.el-checkbox--small .el-checkbox__label {
      font-size: 10px !important;
      font-weight: normal !important;
    }
    .el-input {
      line-height: 14px !important;
    }

    .el-upload--picture-card,
    .el-upload-list__item {
      width: 46px !important;
      height: 40px !important;
      &:nth-child(4n) {
        margin-right: 0px;
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

.apply-container {
  // min-height: calc(100vh - 100px);
  // min-width: 1438px;
  overflow: hidden;
  .change-bill {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    padding-bottom: 2px;
  }
  .border-form-line {
    box-shadow: 0px 0px 1px 1px #111 inset;
  }

  .form-label {
    font-weight: 700;
  }
  .item-box {
    width: 100%;
    display: flex;
    align-items: center;
    &:not(:first-child) {
      margin-top: -1px;
    }
  }
  .cate-title {
    text-align: right;
    padding: 0 10px;
  }

  /** 表单添加边框 */
  .border-form {
    // 添加右、下表框
    border-right: 1px solid #111;
    border-bottom: 1px solid #111;
    padding: 0 !important;

    &.form1 .el-form-item__label {
      align-items: center;
      text-align: justify;
      display: block;
      padding: 0 6px;
      align-self: center;
      &::after {
        width: 100%;
        content: "" !important;
        display: inline-block;
      }
    }

    // 居中label
    .center-label .el-form-item__label {
      display: inline-block;
      text-align: center !important;
    }
    // 添加左、上表框
    .el-form-item {
      border-top: 1px solid #111;
      border-left: 1px solid #111;
      margin: 0 !important;
      height: 100%;
    }

    // 错误提示靠右
    .el-form-item__content {
      align-items: flex-start;
      position: relative;
      .el-form-item__error {
        position: absolute;
        top: 9px;
        right: 5px;
      }
    }
    .el-form-item__content {
      border-left: 1px solid #111;
    }

    // 隐藏边框
    .hide-label-left .el-form-item__content {
      border-left: none;
    }
    .hide-top.el-form-item {
      border-top: none;
    }
    .hide-left.el-form-item {
      border-left: none;
    }

    // 隐藏输入框边框
    .el-textarea__inner,
    .el-input__wrapper,
    .el-form-item.is-error .el-textarea__inner,
    .el-form-item.is-error .el-input__wrapper {
      border-radius: 0;
      box-shadow: 0 0 0 0 var(--el-input-border-color, var(--el-border-color)) inset;
    }

    .el-upload--picture-card,
    .el-upload-list__item {
      width: 79px;
      height: 79px;
      transition: none !important;
      &:nth-child(5n) {
        margin-right: 0px;
      }
    }
  }
  .el-table .cell {
    font-weight: normal !important;
    font-size: 10px !important;
  }
}
</style>
