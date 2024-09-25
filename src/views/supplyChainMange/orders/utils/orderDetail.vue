<template>
  <div v-loading="loading">
    <div class="top-edit">
      <EditForm :formRules="formRules" :formInline="formData" :formConfigs="formConfigs()" ref="formRef" />
    </div>
    <div class="tabs-info">
      <el-tabs v-model="activeName" type="card" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="回签附件" name="first"><FileListModal :disabled="true" ref="fileRef" /></el-tab-pane>
        <el-tab-pane label="物料信息" name="second"><MaterialTable ref="materialRef" /></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { formRules, formConfigs } from "./orderConfig";
import EditForm from "@/components/EditForm/index.vue";
import FileListModal from "../modal.vue";
import MaterialTable from "./materialTable.vue";
import { fetchSupMaterialList, fetchSupOrderList, viewSignBackAttrList } from "@/api/supplyChain";

// 回签状态
const signBackConstantInfo = {
  0: "待提交",
  1: "审核中",
  2: "已回签",
  3: "已驳回",
  null: "待回签"
};

const loading = ref(false);
const formRef = ref();
const fileRef = ref();
const materialRef = ref();
const activeName = ref("first");

const props = defineProps(["fbillno", "source"]);
console.log(props.fbillno, "props.fbillno");

const handleClick = ({ paneName }) => {
  console.log(paneName, "click paneName");
};

const formData: any = reactive({});

watch(
  props,
  (newVal) => {
    console.log(newVal, "newVal");
    if (newVal.fbillno) {
      loading.value = true;
      // 订单详情数据获取
      const orderData: any = { page: 1, limit: 30 };
      if (newVal.source === "home") {
        orderData.fbillno = newVal.fbillno;
      } else if (newVal.source === "infoCenter") {
        orderData.fhqdh = newVal.fbillno; // TODO: 这里可以改回签单号查询条件的字段名称
      }
      fetchSupOrderList(orderData)
        .then((res: any) => {
          if (res.data && res.data.records.length) {
            const dataInfo = res.data.records[0] || {};
            Object.keys(dataInfo).forEach((item) => {
              formData[item] = dataInfo[item];
            });
            formData.fclosestatus = formData.fclosestatus === "A" ? "未关闭" : "已关闭";
            formData.billState = signBackConstantInfo[formData.billState];
          }
        })
        .finally(() => (loading.value = false));

      // 附件信息获取
      const attrData: any = {};
      if (newVal.source === "home") {
        attrData.fbillno = newVal.fbillno;
      } else if (newVal.source === "infoCenter") {
        attrData.fhqdh = newVal.fbillno; // TODO: 这里可以改回签单号查询条件的字段名称
      }
      viewSignBackAttrList(attrData).then((res) => {
        if (res.data) {
          if (fileRef.value) {
            fileRef.value.tableData = res.data || [];
          }
        }
      });

      // 物料表格数据获取
      const materialData: any = {};
      if (newVal.source === "home") {
        materialData.fbillno = newVal.fbillno;
      } else if (newVal.source === "infoCenter") {
        materialData.fhqdh = newVal.fbillno; // TODO: 这里可以改回签单号查询条件的字段名称
      }
      fetchSupMaterialList(materialData).then((res) => {
        if (res.data) {
          if (materialRef.value) {
            materialRef.value.dataList = res.data || [];
          }
        }
      });
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.tabs-info {
  padding-left: 16px;
}
</style>
