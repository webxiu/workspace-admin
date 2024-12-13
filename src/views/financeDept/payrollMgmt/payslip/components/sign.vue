<script setup lang="ts">
import { getMoneySignImages } from "@/api/oaManage/financeDept";
import { onMounted, reactive } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const signDataInfo = reactive({ imgStr: "", timeStr: "" });
const baseApi = import.meta.env.VITE_BASE_API;

const getImages = () => {
  getMoneySignImages({ payslipId: (route.query.gzmbNo as string) + (route.query.payslipId as string) }).then((res: any) => {
    if (res.data) {
      // const hasDotFlag = res.data.image1?.indexOf(",") > 0;
      // signDataInfo.imgStr = hasDotFlag ? res.data.image1 + res.data?.image2 : res.data.image1 + "," + res.data?.image2;
      signDataInfo.imgStr = baseApi + res.data.signatureFilePath;
      signDataInfo.timeStr = res.data.inDate;
    }
  });
};

onMounted(() => {
  getImages();
});
</script>

<template>
  <div class="sign-user">
    <div v-if="signDataInfo.imgStr">
      <el-image style="width: 100%; height: 100%" :src="signDataInfo.imgStr" fit="cover" />
      <div class="show-time">签名时间：{{ signDataInfo.timeStr }}</div>
    </div>
    <div v-else class="empty">暂无签名信息~</div>
  </div>
</template>

<style lang="scss" scoped>
.sign-user {
  height: calc(100vh - 214px);
  overflow: auto;

  .show-time {
    position: absolute;
    bottom: 10px;
    left: 30px;
  }

  .empty {
    line-height: calc(100vh - 214px);
    text-align: center;
  }
}
</style>
