<script setup lang="ts">
import path from "path";
import { getConfig } from "@/config";
import { menuType } from "../../types";
import extraIcon from "./extraIcon.vue";
import { useNav } from "@/layout/hooks/useNav";
import { transformI18n } from "@/plugins/i18n";
import { ref, toRaw, PropType, nextTick, computed, CSSProperties } from "vue";
import { useRouter, useRoute } from "vue-router";

const { layout, isCollapse, tooltipEffect } = useNav();

const props = defineProps({
  item: {
    type: Object as PropType<menuType>
  },
  isNest: {
    type: Boolean,
    default: false
  },
  basePath: {
    type: String,
    default: ""
  }
});

const route = useRoute();
const router = useRouter();
const isCurrent = computed(() => {
  if (route.path === "/workbench/home") {
    return route.fullPath.indexOf(props.item.path) > -1;
  }
  return route.query.from?.indexOf(props.item.path) > -1;
});

const getsubMenuIconStyle = computed((): CSSProperties => {
  return {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: layout.value === "horizontal" ? "0 5px 0 0" : isCollapse.value ? "0 auto" : "0 5px 0 0"
  };
});

function resolvePath(routePath) {
  const httpReg = /^http(s?):\/\//;
  if (httpReg.test(routePath) || httpReg.test(props.basePath)) {
    return routePath || props.basePath;
  } else {
    // 使用path.posix.resolve替代path.resolve 避免windows环境下使用electron出现盘符问题
    return path.posix.resolve(props.basePath, routePath);
  }
}

// 跳转到菜单面板
function onClickMenu(item: menuType) {
  router.push({ path: "/menuPanel", query: { menuCode: item.menuCode, from: item.path } });
}
</script>

<template>
  <el-menu-item
    v-if="props.item.path"
    :index="props.item.path"
    :class="{ 'submenu-title-noDropdown': !isNest, 'is-active': isCurrent }"
    :style="{ display: 'flex', alignItems: 'center' }"
    @click="onClickMenu(item)"
  >
    <div v-if="toRaw(props.item.meta.icon)" class="sub-menu-icon" :style="getsubMenuIconStyle">
      <i class="iconfont" :class="'icon-' + props.item.meta.icon" />
    </div>
    <template #title>
      <div class="flex just-between align-center ui-ov-h ui-w-100">
        <span v-if="layout === 'horizontal'">{{ transformI18n(props.item.meta.title) }}</span>
        <el-tooltip v-else placement="top" :effect="tooltipEffect" :offset="-10" :disabled="!props.item.showTooltip">
          <template #content> {{ transformI18n(props.item.meta.title) }}</template>
          <router-link :to="resolvePath(props.item.path)">
            <span class="ellipsis"> {{ transformI18n(props.item.meta.title) }}</span>
          </router-link>
        </el-tooltip>
        <extraIcon :extraIcon="props.item.meta.extraIcon" />
      </div>
    </template>
  </el-menu-item>
</template>
