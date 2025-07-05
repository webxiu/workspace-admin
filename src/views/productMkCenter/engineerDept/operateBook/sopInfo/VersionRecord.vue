<template>
  <div>
    <div class="sop-title block-quote-tip mt-20 mb-20">
      <el-tag type="success" effect="dark" round>(1/1) 变更记录表</el-tag>
    </div>
    <table class="version-table" cellpadding="8">
      <thead>
        <tr>
          <td colspan="8" style="padding: 0px">
            <div class="header-title">
              <img class="logo" :src="logo" width="80" height="80" alt="" />
              <div class="name">
                <img :src="titleLogo" width="40%" alt="" />
                <div>
                  <span class="mr-6">{{ row.productCode }}</span>
                  <span>{{ row.manualName }}变更记录表</span>
                </div>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="8" style="padding: 4px"></td>
        </tr>
        <tr>
          <td v-for="item in headerTitles" class="no-wrap fw-700 ui-ta-c" :style="item.style" :key="item.prop">{{ item.title }}</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in printData.esopManualResumeList" :key="index">
          <td class="ui-ta-c">{{ index + 1 }}</td>
          <td class="ui-ta-c">{{ fmtDate(item.createDate) }}</td>
          <td class="ui-ta-c">{{ item.oldVer }}</td>
          <td class="ui-ta-c">{{ item.changeContent }}</td>
          <td class="ui-ta-c">{{ item.ver }}</td>
          <td class="ui-ta-c">
            <span>{{ printData.createUserName }}</span>
            <p class="fz-10" v-show="printData.createUserName">{{ fmtDate(printData.createDate) }}</p>
          </td>
          <td class="ui-ta-c">
            <span>{{ item.auditing }}</span>
            <p class="fz-10" v-show="item.auditing">{{ fmtDate(item.auditingDate) }}</p>
          </td>
          <td class="ui-ta-c">
            <span>{{ item.approveName }}</span>
            <p class="fz-10" v-show="item.approveName">{{ fmtDate(item.approveDate) }}</p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from "@/utils/common";
import logo from "@/assets/images/logo.png";
import titleLogo from "@/assets/images/titleLogo.png";
import { PrintOperateBookStationResType, OperateBookItemType } from "@/api/oaManage/productMkCenter";

interface Props {
  row?: OperateBookItemType;
  printData: PrintOperateBookStationResType;
}
withDefaults(defineProps<Props>(), {
  row: () => ({} as OperateBookItemType),
  printData: () => ({}) as PrintOperateBookStationResType
});

const headerTitles = [
  { title: "序号", prop: "index", style: { width: "40px" } },
  { title: "变更日期", prop: "createDate", style: { width: "90px" } },
  { title: "变更前版本号", prop: "oldVer", style: { width: "90px" } },
  { title: "变更内容", prop: "changeContent" },
  { title: "变更后版本号", prop: "ver", style: { width: "90px" } },
  { title: "变更申请", prop: "peuserName", style: { width: "80px" } },
  { title: "审核", prop: "auditing", style: { width: "80px" } },
  { title: "批准", prop: "approveName", style: { width: "80px" } }
];

function fmtDate(date: string) {
  return formatDate(date, "YYYY-MM-DD");
}
</script>

<style scoped lang="scss">
$size: 12px;
$borderColor: #000;

.header-title {
  display: flex;
  justify-content: center;
  overflow: hidden;
  position: relative;
  .logo {
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
  }
  .name {
    font-size: 26px;
    line-height: 34px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
.version-table {
  width: 100%;
  line-height: 18px;
  text-align: left;
  border: 1px solid $borderColor;
  font-family: STKaiti, sans-serif;
  color: $borderColor;
  th,
  td {
    font-size: $size;
    border-top: 1px solid $borderColor;
    border-left: 1px solid $borderColor;
  }
}
</style>
