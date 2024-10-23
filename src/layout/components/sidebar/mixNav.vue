<script setup lang="ts">
import NavRight from "./NavRight.vue";
import extraIcon from "./extraIcon.vue";
import { isAllEmpty } from "@pureadmin/utils";
import { useNav } from "@/layout/hooks/useNav";
import { transformI18n } from "@/plugins/i18n";
import { ref, watch, onMounted, nextTick, computed } from "vue";
import { getParentPaths, findRouteByPath } from "@/router/utils";
import { useTranslationLang } from "../../hooks/useTranslationLang";
import { usePermissionStoreHook } from "@/store/modules/permission";

const menuRef = ref();
const defaultActive = ref(null);
const { route } = useTranslationLang(menuRef);
const { device, resolvePath, getDivStyle } = useNav();
const navMenuList = computed(() => usePermissionStoreHook().wholeMenus);

function getDefaultActive(routePath) {
  /** 当前路由的父级路径 */
  const parentRoutes = getParentPaths(routePath, navMenuList.value)[0];
  defaultActive.value = !isAllEmpty(route.meta?.activePath) ? route.meta.activePath : findRouteByPath(parentRoutes, navMenuList.value)?.children[0]?.path;
}

onMounted(() => getDefaultActive(route.path));
nextTick(() => menuRef.value?.handleResize());
watch(
  () => [route.path, navMenuList.value],
  () => getDefaultActive(route.path)
);
</script>

<template>
  <div v-if="device !== 'mobile'" class="horizontal-header" v-loading="navMenuList.length === 0">
    <el-menu ref="menuRef" mode="horizontal" class="horizontal-header-menu" :default-active="defaultActive">
      <el-menu-item v-for="route in navMenuList" :key="route.path" :index="resolvePath(route) || route.redirect">
        <template #title>
          <router-link :to="resolvePath(route) || route.redirect" :style="getDivStyle">
            <!-- TODO: 这里先注释，后续根据是否需要显示顶部导航图标在做处理 -->
            <!-- <div v-if="toRaw(route.meta.icon)" :class="['sub-menu-icon', route.meta.icon]">
              <component :is="useRenderIcon(route.meta && toRaw(route.meta.icon))" />
            </div> -->
            <div :style="getDivStyle">
              <span class="select-none">
                {{ transformI18n(route.meta.title) }}
              </span>
              <extraIcon :extraIcon="route.meta.extraIcon" />
            </div>
          </router-link>
        </template>
      </el-menu-item>
    </el-menu>
    <NavRight class="horizontal-header-right" />
  </div>
</template>
