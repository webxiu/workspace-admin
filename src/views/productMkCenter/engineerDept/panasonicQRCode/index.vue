<template>
  <Content direction="row">
    <div class="border-line-right form-info">
      <div style="margin: 10px 10px 40px 0">
        <ButtonList :buttonList="buttonList" :auto-layout="false" />
      </div>
      <EditForm
        :formInline="formData"
        :loading="loading"
        :formConfigs="formConfigs({ qrCodeList, onDateChange, onChangeModel })"
        :formProps="{ labelWidth: '120px' }"
        class="print-form"
      />

      <div>
        <TitleCate name="打印设置" class="mb-10">
          <span class="fz-14 color-f00">(单位: mm)</span>
        </TitleCate>
        <EditForm ref="offsetFormRef" :formInline="offsetData" :formConfigs="offsetFormConfigs({ onSave, onReset })" :formProps="{ labelWidth: '120px' }" />
      </div>
    </div>
    <div class="flex-col flex-1 ui-p-r" style="min-height: 620px">
      <div class="flex just-between align-center">
        <div class="flex-1">
          <div class="no-wrap block-quote-tip ml-2 fz-14 color-f00">提示: 打印纸张尺寸设置为A6纸, 边距设置为默认, 打印快捷键 Ctrl + P</div>
        </div>
        <el-button type="primary" :icon="Printer" class="print-code ml-20" @click="onPrint" :title="printTitle">打印</el-button>
      </div>
      <div class="flex flex-1 just-center align-center ui-w-100 ui-p-r">
        <div
          class="print-show flex just-center align-center"
          :style="{
            zIndex: offsetData.showPrint ? 0 : 11,
            opacity: offsetData.showPrint ? 0 : 1
          }"
        >
          <div class="preview-box">
            <img class="show-img" :src="clubTemplate" />
            <img class="code-img" :src="codeUrl" />
            <div class="model">{{ formData.model }}</div>
            <div class="dateTime">{{ formData.mfgModel }}</div>
          </div>
        </div>
        <div class="print" ref="printRef" :style="offsetStyle">
          <img class="code-img" :src="codeUrl" />
          <div class="model">{{ formData.model }}</div>
          <div class="dateTime">{{ formData.mfgModel }}</div>
        </div>
      </div>
    </div>
  </Content>
</template>

<script setup lang="ts">
import Content from "@/layout/Content.vue";
import { useConfig } from "./utils/hook";
import EditForm from "@/components/EditForm/index.vue";
import { Printer } from "@element-plus/icons-vue";
import clubTemplate from "@/assets/images/club_template.png";

defineOptions({ name: "ProductMkCenterEngineerDeptPanasonicQRCodeIndex" });

const {
  loading,
  codeUrl,
  formData,
  offsetData,
  offsetFormRef,
  printRef,
  printTitle,
  qrCodeList,
  buttonList,
  offsetStyle,
  formConfigs,
  offsetFormConfigs,
  onDateChange,
  onChangeModel,
  onPrint,
  onSave,
  onReset
} = useConfig();
</script>

<style scoped lang="scss">
.form-info {
  width: 50%;
  padding-right: 10px;

  :deep(.print-form label),
  :deep(.print-form input),
  :deep(.print-form textarea) {
    font-size: 14px;
  }
}

.print-show {
  position: absolute;
  z-index: 11;
  width: 100%;
  font-weight: 700;
  background: #fff;

  .preview-box {
    position: relative;
    width: 105mm;
    height: 148mm;
    .show-img {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background-color: #fff;
      box-shadow: 0 0 0 1px #000 inset;
    }

    .code-img {
      position: absolute;
      right: 30px;
      bottom: 150px;
      width: 20mm;
      max-width: 100%;
      height: 20mm;
    }

    .model {
      position: absolute;
      bottom: 96px;
      left: 105px;
      font-family: "Times New Roman", Arial, sans-serif;
    }

    .dateTime {
      position: absolute;
      right: 46px;
      bottom: 97px;
      font-family: fangsong, Arial, sans-serif;
    }
  }
}
.print {
  position: relative;
  width: 105mm;
  height: 148mm;
  font-size: 20px;
  font-weight: 700;
  box-shadow: 0 0 0 1px #a3a3a3;

  .code-img {
    right: var(--codeRight);
    bottom: var(--codeBottom);
    position: absolute;
    width: 20mm;
    height: 20mm;
  }

  .model {
    left: var(--modelLeft);
    bottom: var(--modelBottom);
    position: absolute;
    font-family: "Times New Roman", Arial, sans-serif;
  }

  .dateTime {
    right: var(--dateTimeRight);
    bottom: var(--dateTimeBottom);
    position: absolute;
    font-family: fangsong, Arial, sans-serif;
  }
}

@media print {
  @page {
    size: A6;
    margin: 4mm;
  }
  body {
    zoom: 1;
  }
  .print {
    box-shadow: none;
  }
}
</style>
