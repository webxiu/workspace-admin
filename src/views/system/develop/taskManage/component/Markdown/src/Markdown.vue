<template>
  <div ref="wrapRef" :style="{ height: height + 'px' }" />
</template>
<script lang="ts">
import type { Ref } from "vue";
import { defineComponent, ref, unref, nextTick, computed, watch, onBeforeUnmount, onDeactivated, onMounted } from "vue";
import Vditor from "vditor";
import "vditor/dist/index.css";
import { getFileNameOnUrlPath } from "@/utils/common";
// import { useModalContext } from "../../Modal";
// import { getTheme } from "./getTheme";

type Lang = "zh_CN" | "en_US" | "ja_JP" | "ko_KR" | undefined;

const { VITE_BASE_API } = import.meta.env;
const url = VITE_BASE_API + "/oa/sys/systaskregister/uploadTempFile";

export default defineComponent({
  inheritAttrs: false,
  props: {
    height: { type: Number, default: 360 },
    value: { type: String, default: "" }
  },
  emits: ["change", "get", "update:value", "setFileItem"],
  setup(props, { attrs, emit }) {
    const wrapRef = ref(null);
    const vditorRef = ref(null) as Ref<Vditor | null>;
    const initedRef = ref(false);
    const fileNameList = ref<string[]>([]);
    // const modalFn = useModalContext();
    const getLocale = ref("'zh_CN'");
    const valueRef = ref(props.value || "");

    const getCurrentLang = computed<Lang>(() => {
      const langs = { en: "en_US", ja: "ja_JP", ko: "ko_KR" };
      return langs[unref(getLocale)] || "zh_CN";
    });
    function init() {
      const wrapEl = unref(wrapRef);
      if (!wrapEl) return;
      const bindValue = { ...attrs, ...props };
      const insEditor = new Vditor(wrapEl, {
        // 设置外观主题
        theme: "classic",
        // cdn: "https://vditor.sec-in.com",
        cdn: "/source/vditor@3.9.6",
        lang: unref(getCurrentLang.value),
        mode: "sv",
        preview: { hljs: { style: "light" }, actions: [] },
        input: (v) => {
          valueRef.value = v;
          emit("update:value", v);
          emit("change", v);
        },
        after: () => {
          nextTick(() => {
            // modalFn?.redoModalHeight?.();
            if (valueRef.value) {
              // 存在值才设置, 否则会影响placeholder显示
              insEditor.setValue(valueRef.value);
            }
            vditorRef.value = insEditor;
            initedRef.value = true;
            emit("get", instance);
          });
        },
        upload: {
          accept: "image/*",
          multiple: false,
          url: url,
          linkToImgUrl: url,
          fieldName: "file",
          filename(name) {
            return name
              .replace(/[^(a-zA-Z0-9\u4e00-\u9fa5.)]/g, "")
              .replace(/[?\\/:|<>*[\]()$%{}@~]/g, "")
              .replace("/\\s/g", "");
          },
          format(files, responseText) {
            const res = JSON.parse(responseText);
            console.log(res);
            const fileName = getFileNameOnUrlPath(res.data as string);
            emit("setFileItem", res.data);
            const result = JSON.stringify({
              code: 0,
              data: { errFiles: "", succMap: { [fileName]: VITE_BASE_API + res.data } }
            });
            console.log("result", result);
            return result;
          }
        },
        blur: () => {
          //unref(vditorRef)?.setValue(props.value);
          // markdownvalue=vditorRef.value.getValue();
        },
        ...bindValue,
        cache: {
          enable: false
        }
      });
    }

    const instance = {
      getVditor: (): Vditor => vditorRef.value!
    };

    function destroy() {
      const vditorInstance = unref(vditorRef);
      if (!vditorInstance) return;
      try {
        vditorInstance?.destroy?.();
      } catch (error) {
        //
      }
      vditorRef.value = null;
      initedRef.value = false;
    }

    onMounted(init);

    onBeforeUnmount(destroy);
    onDeactivated(destroy);
    return {
      wrapRef,
      ...instance
    };
  }
});
</script>
