<template>
  <div class="flex ui-p-r">
    <div ref="viewerRef" v-loading="loading" id="markdownViewer" class="flex-1" :class="$props.class" />
    <div ref="outlineRef" id="outline-anchor" />
    <el-image
      fit="contain"
      class="viewer-image"
      :showProgress="true"
      :hideOnClickModal="true"
      :initialIndex="imageViewer.index"
      :previewSrcList="imageViewer.images"
      :src="imageViewer.images[imageViewer.index]"
      style="width: 0px; height: 0px"
    />
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onDeactivated, Ref, ref, unref, watch, onMounted, nextTick, reactive } from "vue";
import VditorPreview from "vditor/dist/method.min";
import { getTheme } from "./getTheme";
const props = defineProps({
  loading: { type: Boolean },
  value: { type: String },
  class: { type: String },
  hideOutline: { type: Boolean }
});

const viewerRef = ref(null);
const outlineRef = ref(null);
const vditorPreviewRef = ref(null) as Ref<VditorPreview | null>;
const imageViewer = reactive({ index: 0, images: [] });

onMounted(() => {
  create();
  viewImage();
});

onBeforeUnmount(destroy);
onDeactivated(destroy);

watch(
  () => props.value,
  (v, oldValue) => {
    v !== oldValue && create();
  }
);

function destroy() {
  const vditorInstance = unref(vditorPreviewRef);
  if (!vditorInstance) return;
  vditorInstance.destroy?.();
  vditorPreviewRef.value = null;
}

/** 通过弹出层预览图片 */
function viewImage() {
  const viewDom = document.querySelector("#markdownViewer");
  viewDom.addEventListener("load", loadImage, true);
  viewDom.addEventListener("click", clickImage);

  function loadImage({ target }) {
    const suffix = target.src.split(".").pop();
    const excludeSuffix = ["svg"].includes(suffix);
    if (target.tagName === "IMG" && !excludeSuffix) {
      imageViewer.images.push(target.src);
    }
  }

  function clickImage({ target }) {
    if (target.tagName === "IMG") {
      imageViewer.index = imageViewer.images.indexOf(target.src);
      nextTick(() => {
        const imgDom = document.querySelector(".viewer-image img");
        (imgDom as HTMLImageElement)?.click();
      });
    }
  }
}

function create() {
  const viewerEl = unref(viewerRef);
  const outlineEl = unref(outlineRef);
  vditorPreviewRef.value = VditorPreview.preview(viewerEl, props.value, {
    markdown: {
      toc: true,
      listStyle: false
    },
    speech: {
      enable: true
    },
    mode: getTheme("light", "content"),
    anchor: 1,
    lazyLoadImage: "https://unpkg.com/vditor/dist/images/img-loading.svg",
    theme: {
      // 设置内容主题
      current: getTheme("light", "content")
    },
    hljs: {
      // 设置代码块主题
      style: getTheme("light", "code")
    },
    after() {
      // if (window.innerWidth <= 768) {
      //   return;
      // }
      VditorPreview.outlineRender(viewerEl, outlineEl);
      if (outlineEl.innerText.trim() !== "") {
        const isHide = props.hideOutline;
        outlineEl.style.display = !isHide ? "block" : "none";
        outlineEl
          .querySelector("ul")
          .querySelectorAll("li")
          .forEach((e, i) => {
            if (e.querySelector("ul")) {
              e.querySelector("ul").style.display = "none";
            }
          });
        outlineEl.querySelectorAll("svg").forEach((e, i) => {
          e.classList.value = "vditor-outline__action vditor-outline__action--close";
        });
      }
    },
    renderers: {
      renderHeading: (node, entering) => {
        const id = Lute.GetHeadingID(node);
        if (entering) {
          return [`<h${node.__internal_object__.HeadingLevel} id="${id}" class="vditor__heading"><span class="prefix"></span><span>`, Lute.WalkContinue];
        } else {
          return [
            `</span>
              <a id="vditorAnchor-${id}" class="vditor-anchor" href="#${id}">
               <!-- <svg viewBox="0 0 16 16" version="1.1" width="16" height="16">
                  <path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z">
                    </path>
                </svg>
                -->
              </a>
              </h${node.__internal_object__.HeadingLevel}>`,
            Lute.WalkContinue
          ];
        }
      }
    }
  });
}
</script>

<style lang="scss">
#outline-anchor {
  --border-color: #eee;
  --toolbar-icon-hover-color: #4285f4;
  --textarea-text-color: #616161;
  --hover-background-color: #f6f8fa;

  min-width: 186px;
  overflow: auto;
  font-size: 12px;
  border-right: 0;
  border-left: 1px solid var(--border-color);
  background: var(--el-bg-color);
}
</style>
