<script setup lang="ts">
import { closeDialog, dialogStore, type EventType, type ButtonProps, type DialogOptions, type BtnClickDialog } from "./index";
import { ref, computed } from "vue";
import { isFunction } from "@pureadmin/utils";
import Fullscreen from "@iconify-icons/ri/fullscreen-fill";
import ExitFullscreen from "@iconify-icons/ri/fullscreen-exit-fill";

const fullscreen = ref(false);

/**
 * 生成事件的回调方法
 * command: 注册的事件名(例: 注册reset事件,回调方法就是:beforeReset)
 */
const callbackFn = (command: string, dialog: BtnClickDialog) => {
  const { options, index } = dialog;
  const eventName = command.slice(0, 1).toUpperCase() + command.slice(1);
  const done = () => closeDialog(options, index, { command });
  const fn = options[`before${eventName}`];
  if (fn && isFunction(fn)) {
    fn(done, dialog);
  } else {
    done();
  }
};

const footerButtons = computed(() => {
  return (options: DialogOptions) => {
    const { resetButtonText, cancelButtonText, okButtonText, customButtonText, showResetButton, hideItem } = options;
    const buttons: Array<ButtonProps> = [
      { label: resetButtonText || "重置", btnType: "reset", text: true, bg: true, btnClick: ({ dialog }) => callbackFn("reset", dialog) },
      { label: cancelButtonText || "取消", btnType: "cancel", text: true, bg: true, btnClick: ({ dialog }) => callbackFn("cancel", dialog) },
      { label: okButtonText || "确定", btnType: "ok", text: false, bg: true, btnClick: ({ dialog }) => callbackFn("sure", dialog), type: "primary" },
      { label: customButtonText || "自定义", btnType: "custom", text: false, bg: true, btnClick: ({ dialog }) => callbackFn("custom", dialog), type: "primary" }
    ];
    // 重置与自定义按钮是否显示(自定义按钮配置名称才显示)
    const newButtons = buttons.filter(({ btnType }) => {
      if (btnType === "reset") return showResetButton;
      if (btnType === "custom") return customButtonText;
      return !hideItem?.includes(btnType);
    });
    return options?.footerButtons?.length > 0 ? options.footerButtons : newButtons;
  };
});

const fullscreenClass = computed(() => {
  return ["el-icon", "el-dialog__close", "-translate-x-2", "cursor-pointer", "hover:!text-[red]"];
});

function eventsCallBack(event: EventType, options: DialogOptions, index: number) {
  fullscreen.value = options?.fullscreen ?? false;
  if (options?.[event] && isFunction(options?.[event])) {
    return options?.[event]({ options, index });
  }
}

function handleClose(options: DialogOptions, index: number, args = { command: "close" }) {
  closeDialog(options, index, args);
  eventsCallBack("close", options, index);
}
</script>

<template>
  <el-dialog
    class="pure-dialog"
    v-for="(options, index) in dialogStore"
    :key="index"
    v-bind="options"
    v-model="options.visible"
    :fullscreen="fullscreen ? true : options?.fullscreen ? true : false"
    @close="handleClose(options, index)"
    @opened="eventsCallBack('open', options, index)"
    @openAutoFocus="eventsCallBack('openAutoFocus', options, index)"
    @closeAutoFocus="eventsCallBack('closeAutoFocus', options, index)"
  >
    <!-- header -->
    <template v-if="options?.fullscreenIcon || options?.headerRenderer" #header="{ close, titleId, titleClass }">
      <div v-if="options?.fullscreenIcon" class="flex items-center justify-between" style="padding-right: 20px">
        <span :id="titleId" :class="titleClass">{{ options?.title }}</span>
        <i v-if="!options?.fullscreen" :class="fullscreenClass" @click="fullscreen = !fullscreen">
          <IconifyIconOffline class="pure-dialog-svg" :icon="options?.fullscreen ? ExitFullscreen : fullscreen ? ExitFullscreen : Fullscreen" />
        </i>
      </div>
      <component v-else :is="options?.headerRenderer({ close, titleId, titleClass })" />
    </template>
    <component v-bind="options?.props" :is="options.contentRenderer({ options, index })" @close="(args) => handleClose(options, index, args)" />
    <!-- footer -->
    <template v-if="!options?.hideFooter" #footer>
      <template v-if="options?.footerRenderer">
        <component :is="options?.footerRenderer({ options, index })" />
      </template>
      <span v-else>
        <el-button
          v-for="(btn, key) in footerButtons(options)"
          :key="key"
          v-bind="btn"
          @click="btn.btnClick({ dialog: { options, index }, button: { btn, index: key } })"
        >
          {{ btn?.label }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
