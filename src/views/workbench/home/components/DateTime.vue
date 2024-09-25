<template>
  <div>
    <div class="flex align-center fz-16 no-wrap">
      <span>加入德龙电器：</span>
      <el-tag type="primary" effect="dark"> {{ joinTime?.value || "0" }} </el-tag>
      <span class="ml-4 mr-4">年 共计</span>
      <el-tag type="success" effect="dark"> {{ joinTime?.auxiliary || "0" }} </el-tag>
      <span class="ml-4 mr-4">天</span>
    </div>
    <el-empty v-if="!timeList.length" :image-size="60" description="暂无数据" />
    <template v-for="item in timeList" :key="item.value">
      <div class="mb-4 mt-40" v-if="timeObj[item.item]">
        <span class="fz-14">{{ timeObj[item.item]?.title }}：{{ formatTime(item) }}</span>
        <el-progress :text-inside="true" :stroke-width="22" :percentage="parseFloat(item.value)" :status="timeObj[item.item]?.status" />
      </div>
    </template>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { countDowns, CountDownsResponseType } from "@/api/user/user";

const timeList = ref<CountDownsResponseType[]>([]);
const joinTime = ref<CountDownsResponseType>();
const timeObj = {
  百岁倒计时: { title: "百岁计时", status: "exception" },
  本年倒计时: { title: "本年已过", status: "warning" },
  本月倒计时: { title: "本月已过", status: "success" },
  本周倒计时: { title: "本周已过", status: "" }
};

onMounted(() => getCountDowns());

const getCountDowns = () => {
  countDowns()
    .then(({ data }) => {
      if (!data?.length) return;
      const newList = data.filter((item) => item.item !== "百岁倒计时"); // 不显示百岁倒计时
      joinTime.value = data.filter((item) => item.item === "加入德龙")[0];
      timeList.value = newList.reverse();
    })
    .catch(console.log);
};
const formatTime = (item: CountDownsResponseType) => {
  switch (item.item) {
    case "百岁倒计时":
      return `${(Number(item.auxiliary) / 365).toFixed(1)}` + "年";
    case "加入德龙":
      return `${item.value}年, 共计${item.auxiliary}天`;
    case "本年倒计时":
    case "本月倒计时":
    case "本周倒计时":
      return `${item.auxiliary}天`;
  }
};
</script>
