<script setup lang="ts">
import { addProductsDevApplayInfo, fetchProjectTemplateConfigList, viewProductsDevApplayInfo } from "@/api/plmManage";
import { cloneDeep } from "@pureadmin/utils";
import { ElMessage, ElMessageBox } from "element-plus";
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import CenterTable from "./components/centerTable.vue";
import FileUpload from "./components/filesUpload.vue";
import FooterTable from "./components/footerTable.vue";
import TopForm from "./components/topForm.vue";
import TopTable from "./components/topTable.vue";
import Print from "@/utils/print";

/** 信息中心的查看单据id */
const props = defineProps<{ id: string }>();

// 信息中心id是否存在
const infoCenterDeal = computed(() => !!props.id);

defineOptions({ name: "AddProductsDevApplay" });

const configInfo = ref({});
const title = ref("");
const mode = ref("edit");
const router = useRouter();
const route = useRoute();
const centerTableRef = ref();
const topTableRef = ref();
const fileUploadRef = ref();
const topFormRef = ref();
const footerTableRef = ref();
const detailInfo: any = ref({});
const loading = ref<boolean>(false);
const devSheetRef = ref(null);

const getConfigInfo = () => {
  if (route.query.templateId) {
    fetchProjectTemplateConfigList({ templateId: route.query.templateId }).then((res) => {
      if (res.data) {
        configInfo.value = res.data;
        centerTableRef.value?.setDataInfo(res.data);
        centerTableRef.value?.setrowspans();
      }
    });
  }
};

const showErrMsg = (key) => {
  const errMsgConfig = {
    basic: "请完整填写产品申请必填项!",
    title: "请填写产品开发申请表名称!",
    date: "请填写开发日程要求!",
    base: "请完整填写基本功能要求!",
    before: "请填写商品策划时前期考虑内容!"
  };
  ElMessage({ message: errMsgConfig[key], type: "error" });
};

const validateFields = () => {
  // if (!title.value) {
  //   showErrMsg("title");
  //   return;
  // }
  // if (!Object.values(topTableRef.value.tableData[0]).every((item) => item)) {
  //   showErrMsg("date");
  //   return;
  // }
  /** 基本信息验证 异步放最后 */
  topFormRef.value.formRef?.getRef()?.validate((valid) => {
    if (!valid) {
      showErrMsg("basic");
    } else {
      onBeforeSave();
    }
  });
};

const onBeforeSave = () => {
  ElMessageBox.confirm(`确认要保存吗?`, "系统提示", {
    type: "warning",
    draggable: true,
    cancelButtonText: "取消",
    confirmButtonText: "确定",
    dangerouslyUseHTMLString: true
  })
    .then(() => onSave())
    .catch(() => {});
};

const onSave = () => {
  const productDevSheet = { templateId: route.query.templateId, titleName: title.value };
  const productDevSheetRise = {
    ...topFormRef.value.formData,
    productLevelSelect: String(topFormRef.value.formData.productLevelSelect),
    projectPhaseSelect: String(topFormRef.value.formData.projectPhaseSelect),
    devTypeSelect: String(topFormRef.value.formData.devTypeSelect)
  };
  const productDevSheetDesignPictureList = fileUploadRef.value.postFileList;
  const productDevSheetSchedule = topTableRef.value.tableData[0];

  const resolveViewArr = cloneDeep(centerTableRef.value.dataList).map((item, idx) => {
    resolveInputGroup(item);
    return item;
  });
  console.log(resolveViewArr, "resolveViewArr");
  const productDevSheetSchemeList = footerTableRef.value.tableData;
  delete productDevSheetRise.applyDeptIdCopy;
  delete productDevSheetRise.applyUserCodeCopy;

  const reqData = {
    productDevSheet,
    productDevSheetRise,
    productDevSheetSchedule,
    productDevSheetSchemeList,
    productTypeVoList: resolveViewArr,
    productDevSheetDesignPictureList
  };
  productDevSheetRise.applyDeptId = productDevSheetRise.applyDeptIdCopy;
  productDevSheetRise.applyUserCode = productDevSheetRise.applyUserCodeCopy;

  console.log(reqData, "reqData");

  addProductsDevApplayInfo(reqData).then((res) => {
    if (res.data) {
      ElMessage({ message: "保存成功", type: "success" });
    }
  });
};

/** 处理输入框组提交 */
const resolveInputGroup = (selectGroupInputValues) => {
  const selectValue = [];
  const cnKeys = Object.keys(selectGroupInputValues).filter((item) => /[\u4e00-\u9fa5]/.test(item));
  cnKeys.forEach((item) => {
    selectValue.push(`${item}:${selectGroupInputValues[item]}`);
    delete selectGroupInputValues[item];
  });
  if (selectGroupInputValues.valueType === 3) {
    selectGroupInputValues.selectValue = String(selectValue);
  } else {
    selectGroupInputValues.selectValue = String(selectGroupInputValues.selectValue);
  }
  delete selectGroupInputValues.rowspan;
  delete selectGroupInputValues.productDevTypeSettingList;
  return selectGroupInputValues;
};

const queryDetailInfo = (id) => {
  loading.value = true;
  viewProductsDevApplayInfo({ id })
    .then((res) => {
      loading.value = false;
      if (res.data) {
        detailInfo.value = res.data;
        initAllValue();
      }
    })
    .catch(() => (loading.value = false));
};

const initAllValue = () => {
  title.value = detailInfo.value.productDevSheet?.titleName;
  topFormRef.value.formData.productName = detailInfo.value.productDevSheetRise?.productName;
  topFormRef.value.formData.customerModel = detailInfo.value.productDevSheetRise?.customerModel;
  topFormRef.value.formData.deograModel = detailInfo.value.productDevSheetRise?.deograModel;
  topFormRef.value.formData.devTypeSelect = detailInfo.value.productDevSheetRise?.devTypeSelect.split(",");
  topFormRef.value.formData.saleArea = detailInfo.value.productDevSheetRise?.saleArea;
  topFormRef.value.formData.customerName = detailInfo.value.productDevSheetRise?.customerName;
  topFormRef.value.formData.referenceModel = detailInfo.value.productDevSheetRise?.referenceModel;
  topFormRef.value.formData.productLevelSelect = detailInfo.value.productDevSheetRise?.productLevelSelect.split(",");
  topFormRef.value.formData.projectPhaseSelect = detailInfo.value.productDevSheetRise?.projectPhaseSelect.split(",");

  /** 开发日程要求 */
  topTableRef.value.tableData = [detailInfo.value.productDevSheetSchedule];

  /** 外观设计图 */
  fileUploadRef.value.initImages(detailInfo.value.productDevSheetDesignPictureList);

  /** 基本功能要求 */
  centerTableRef.value.setDataInfo(detailInfo.value);
  centerTableRef.value.setrowspans();

  /** 商品策划 */
  footerTableRef.value.tableData = [detailInfo.value.productDevSheetSchemeList[0]];
};

const printAction = () => {
  // if (devSheetRef.value) {
  //   Print(devSheetRef.value);
  // }
  router.push("/plmManage/productMgmt/productsDevApplay/print/index");
};

onMounted(() => {
  getConfigInfo();
  if (route.query.type === "view" || props.id) {
    queryDetailInfo(route.query.id);
  }
});
</script>

<template>
  <div class="add-box" v-loading="loading">
    <el-affix :offset="100" v-if="!infoCenterDeal">
      <el-button v-if="!route.query.id" type="primary" @click="validateFields()">保存</el-button>
      <!-- v-if="route.query.id" -->
      <el-button type="info" @click="printAction">打印</el-button>
      <el-button @click="router.back()">返回</el-button>
    </el-affix>

    <div class="add-page" ref="devSheetRef">
      <div class="title">
        <div>产品开发申请表</div>
      </div>
      <TopForm ref="topFormRef" :infoId="id" />
      <TopTable ref="topTableRef" :infoId="id" />
      <FileUpload ref="fileUploadRef" :infoId="id" />
      <CenterTable ref="centerTableRef" />
      <FooterTable ref="footerTableRef" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@page {
  margin: 5mm;
}

.add-box {
  // height: calc(100vh - 105px);
  // overflow: auto;
}

.add-page {
  width: 1100px;
  margin: 0 auto;

  .title {
    display: flex;
    justify-content: center;
    margin: 16px;
    font-size: 30px;
    font-weight: bold;

    :deep(.el-input__wrapper) {
      border-radius: 0 !important;
      box-shadow: 0 0 0 0 var(--el-input-border-color, var(--el-border-color)) inset;

      .el-input__inner {
        border-bottom: 1px solid black;
      }
    }
  }

  .footer-text {
    display: flex;
    align-items: center;
    margin-top: 8px;

    .txt {
      flex: 0.45;
      padding-left: 5px;
      font-size: 13px;
    }

    .right-tbs {
      display: flex;
      flex: 0.55;

      .dev,
      .sale {
        flex: calc(5 / 12);
      }

      .fin {
        flex: calc(1 / 6);
        margin: 0 15px;
      }

      .row-title {
        padding: 2px 0;
        font-size: 13px;
        border: 1px solid black;
      }
    }
  }
}
</style>
