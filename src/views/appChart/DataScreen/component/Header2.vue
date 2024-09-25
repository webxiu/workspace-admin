<template>
  <div class="header-wrap">
    <div class="header-left">
      <div class="left-btn">
        <DateTime class="home" />
      </div>
    </div>
    <div class="header-center">
      <h2 class="header-title">项目看板</h2>
    </div>

    <div class="header-right">
      <div class="right-btn">
        <div class="time-wrap">
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
import { onMounted, onUnmounted, ref } from "vue";

import RefreshIcon from "@/components/RePureTableBar/src/svg/refresh.svg?component";
import { dayjs } from "element-plus";
import { delay } from "@pureadmin/utils";
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
const emits = defineEmits(["refresh"]);

const timer = ref();
const loading = ref(false);
const timeDown = ref("00:00");
const time = props.time * 1000;
let end = Date.now() + time;

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
</script>

<style scoped lang="scss">
.header-wrap {
  z-index: 22;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 50px;
  background: url("@/assets/dataScreen/header_04.png") top center no-repeat;
  background-size: 100% 80%;

  .header-center {
    display: flex;
    flex: 0.5;
    align-items: center;
    justify-content: center;

    .header-title {
      font-weight: 700;
      margin-top: -10px;
      font-size: 18px;
      text-align: center;
      letter-spacing: 5px;
    }
  }

  .header-left {
    display: flex;
    flex: 1;
    align-items: center;
    height: 100%;

    .left-btn {
      display: flex;
      flex: 1;
      margin-left: 15%;
    }

    .home {
      position: relative;
      width: 230px;
      height: 24px;
      padding-left: 12px;
      margin-right: 18%;
      font-size: 11px;
      line-height: 24px;
      text-align: left;

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
    padding-right: 24px;
    justify-content: center;
    height: 100%;
    font-size: 10px;

    .right-btn {
      margin-right: 12%;
    }

    .time-wrap {
      display: flex;
      align-items: flex-end;

      .time-down {
        display: flex;
        // margin-left: 10px;
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
