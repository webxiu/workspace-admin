<script setup lang="ts">
import { useHome } from "./hooks";
import KimiChat from "./components/KimiChat/index.vue";
import { ChatDotRound } from "@element-plus/icons-vue";
import FullScreen from "@iconify-icons/ep/full-screen";
import CloseCircle from "@iconify-icons/ri/delete-back-2-line";
import FullScreenExit from "@iconify-icons/ri/fullscreen-exit-fill";
const { maxHeight, kimiChatRef, homeList, isFullScreen, onClearChat, onFullScreen } = useHome();
</script>

<template>
  <div class="flex flex-1 main main-content welcome home" v-mainHeight="{ offset: -10 }">
    <el-row :gutter="20" style="width: -webkit-fill-available">
      <el-col :xs="24" :sm="24" :md="14" :lg="14" :xl="13" style="display: flex">
        <el-row :gutter="20" class="panel-box">
          <el-col class="mb-5" v-for="item in homeList" :key="item.name" :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-card class="box-card" :class="{ calendar: item.name === '日历' }">
              <template #header>
                <span class="flex just-between">
                  <span class="flex align-center">
                    <el-icon><component :is="item.icon" /></el-icon>
                    <span class="ml-1">{{ item.name }}</span>
                  </span>
                  <component v-if="item.handle" :is="item.handle" />
                </span>
              </template>
              <component :is="item.body" />
            </el-card>
          </el-col>
        </el-row>
      </el-col>
      <el-col :xs="24" :sm="24" :md="10" :lg="10" :xl="11">
        <div class="flex-1 ui-w-100 ui-h-100" :class="isFullScreen ? 'chat-kimi' : ''">
          <el-card class="box-card flex-col">
            <template #header>
              <span class="flex just-between">
                <span />
                <span class="flex align-center">
                  <el-icon><ChatDotRound /></el-icon>
                  <span class="ml-1">AI聊天问答</span>
                </span>
                <div class="flex align-center">
                  <span class="mr-10" title="清空消息">
                    <IconifyIconOffline class="pointer" :icon="CloseCircle" title="清空消息" @click="onClearChat" />
                  </span>
                  <span title="全屏显示" v-show="!isFullScreen">
                    <IconifyIconOffline class="pointer" :icon="FullScreen" @click="onFullScreen" />
                  </span>
                  <span title="退出全屏" v-show="isFullScreen">
                    <IconifyIconOffline class="pointer" :icon="FullScreenExit" title="全屏显示" @click="onFullScreen" />
                  </span>
                </div>
              </span>
            </template>
            <KimiChat ref="kimiChatRef" :isFullScreen="isFullScreen" />
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<style lang="scss" scoped>
.home {
  .box-card {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    &.calendar :deep(.el-card__body) {
      padding: 10px;
    }
  }
  :deep(.el-card__header) {
    padding: 6px 15px;
    background: var(--el-fill-color-light);
  }

  :deep(.el-card__body) {
    flex: 1;
    overflow: hidden;
  }

  .grid-container {
    display: flex;
    flex-wrap: wrap;
    .item {
      width: calc(50% - 20px);
      border-radius: 4px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      margin: 10px;
      overflow: hidden;
      box-sizing: border-box;
    }
  }
}

.chat-kimi {
  position: fixed;
  top: 0;
  left: 0;
  width: 100% !important;
  height: 100% !important;
  z-index: 2009; /* 确保元素覆盖其他内容 */
}
</style>

<style lang="scss">
@media screen and (max-height: 768px) {
  .home {
    .item-box {
      height: 72px !important;
      i {
        font-size: 22px !important;
      }
      .ellipsis {
        font-size: 12px !important;
      }
    }
    .el-card__body {
      padding-top: 10px !important;
      padding-bottom: 10px !important;
    }
  }
}
@media only screen and (min-width: 992px) {
  .panel-box {
    &:only-child {
      flex: 1;
    }
    > div:nth-last-child(-n + 2) {
      margin-bottom: 0px !important;
    }
  }
}
</style>
