<template>
  <div class="header-wrap">
    <div class="ui-ta-l flex-1">
      <div class="home" @click="onBack">返回</div>
    </div>
    <h3 class="ui-ta-c flex-1">{{ bigTitle }}</h3>
    <div class="header-right">
      <DateTime />
      <div class="time-wrap">
        <SwitchButton :buttonsConfig="buttonsConfig" :active="active" @change="onChange" />
        <div class="time-down">
          更新倒计时:{{ timeDown }}
          <RefreshIcon :class="['refresh-icon', loading ? 'animate-spin' : '']" @click="() => onRefresh()" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import SwitchButton, { ButtonOptionType } from "@/components/DataScreen/component/SwitchButton.vue";

import RefreshIcon from "@/components/RePureTableBar/src/svg/refresh.svg?component";
import { dayjs } from "element-plus";
import { delay } from "@pureadmin/utils";
import { message } from "@/utils/message";
import DateTime from "./DateTime.vue";

interface Props {
  /** 默认显示 */
  active: string;
  /** 刷新间隔(60秒) */
  time: number;
}

const props = withDefaults(defineProps<Props>(), {
  active: "KingDee",
  time: 60
});
const emits = defineEmits(["refresh", "change"]);

const timer = ref();
const loading = ref(false);
const route = useRoute();
const router = useRouter();
const timeDown = ref("00:00");
const time = props.time * 1000;
let end = Date.now() + time;

const buttonsConfig = reactive<ButtonOptionType[]>([
  { label: "金蝶", value: "KingDee" },
  { label: "WS", value: "WS" }
]);

const bigTitle = computed(() => {
  if (!route.query.menuName) {
    message("参数错误", { type: "error" });
  }
  return route.query.menuName;
});

onMounted(() => timeDownFn());
onUnmounted(() => clearInterval(timer.value));

function timeDownFn() {
  timer.value = setInterval(() => {
    const disTime = end - Date.now();
    if (disTime < 1000) {
      end = Date.now() + time;
      onRefresh();
    }
    timeDown.value = dayjs(disTime).format("mm:ss");
  }, 1000);
}

function onRefresh() {
  loading.value = true;
  emits("refresh");
  end = Date.now() + time;
  delay(500).then(() => (loading.value = false));
}

function onChange(v) {
  emits("change", v);
}

function onBack() {
  router.push({ path: "/menuPanel", query: { menuCode: route.query.menuCode, from: "/businessCenter" } });
}
</script>

<style scoped lang="scss">
.header-wrap {
  z-index: 22;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 68px;
  background: url("@/assets/dataScreen/header_01.png") center center no-repeat;
  background-color: rgb(126 141 199 / 8%);
  background-size: contain;

  .home {
    width: 120px;
    height: 27px;
    padding-right: 30px;
    font-size: 12px;
    line-height: 24px;
    text-align: center;
    cursor: pointer;
    background: url("@/assets/dataScreen/btn_01.png") no-repeat center center;
    background-size: contain;
  }

  .header-right {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-around;
    height: 100%;
    font-size: 14px;
  }

  .time-wrap {
    display: flex;
    align-items: flex-end;
    margin-left: 20px;

    .time-down {
      display: flex;
      margin-left: 10px;
      line-height: 19px;
    }

    .refresh-icon {
      width: 18px;
      height: 18px;
      margin-left: 4px;
      color: #94bb00;
      cursor: pointer;
    }
  }
}
</style>
