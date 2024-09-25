<template>
  <div class="header-wrap">
    <div class="header-left">
      <div class="left-btn">
        <div class="home" @click="onBack">返回</div>
      </div>
    </div>
    <div class="header-center">
      <h2 class="header-title">{{ bigTitle }}</h2>
    </div>

    <div class="header-right">
      <div class="right-btn">
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
  min-height: 68px;
  background: url("@/assets/dataScreen/header_04.png") top center no-repeat;
  background-size: 100% 80%;

  .header-center {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;

    .header-title {
      font-weight: 700;
      margin-top: -10px;
      text-align: center;
      letter-spacing: 5px;
    }
  }

  .header-left {
    display: flex;
    flex: 1;
    align-items: center;
    width: 100%;
    height: 100%;

    .left-btn {
      display: flex;
      flex: 1;
      margin-left: 80px;
    }

    .home {
      position: relative;
      width: 92px;
      height: 24px;
      margin-right: 18%;
      font-size: 12px;
      line-height: 24px;
      text-align: center;
      cursor: pointer;

      &::before {
        position: absolute;
        inset: 0;
        content: "";
        border: 1px solid #6176af;
        border-color: #1cbcbe;
        box-shadow: 0 0 4px 1px #1cbcbe inset;
        transform: skewX(-38deg);
      }

      &:hover {
        color: #22e7eb;

        &::before {
          border-color: #22e7eb;
          box-shadow: 0 0 4px 1px #22e7eb inset;
        }
      }
    }
  }

  .header-right {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    height: 100%;
    font-size: 14px;

    .right-btn {
      margin-right: 12%;
    }

    .time-wrap {
      display: flex;
      align-items: flex-end;

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
}
</style>
