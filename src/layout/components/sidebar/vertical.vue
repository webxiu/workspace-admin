<script setup lang="ts">
import Logo from "./logo.vue";
import { useRoute } from "vue-router";
import { emitter } from "@/utils/mitt";
import SidebarItem from "./sidebarItem.vue";
import leftCollapse from "./leftCollapse.vue";
import { useNav } from "@/layout/hooks/useNav";
import { responsiveStorageNameSpace } from "@/config";
import { storageLocal, isAllEmpty } from "@pureadmin/utils";
import { findRouteByPath, getParentPaths } from "@/router/utils";
import { usePermissionStoreHook } from "@/store/modules/permission";
import { useAppStore } from "@/store/modules/app";
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";

const route = useRoute();
const subMenuData = ref([]);
const { device, pureApp, isCollapse, menuSelect, toggleSideBar } = useNav();
const showLogo = ref(storageLocal().getItem<StorageConfigs>(`${responsiveStorageNameSpace()}configure`)?.showLogo ?? true);

const wholeMenuList = computed(() => usePermissionStoreHook().wholeMenus);
const navMenuList = computed(() => (pureApp.layout === "mix" && device.value !== "mobile" ? subMenuData.value : wholeMenuList.value));
const loading = computed(() => (pureApp.layout === "mix" ? false : navMenuList.value.length === 0));
const defaultActive = computed(() => (!isAllEmpty(route.meta?.activePath) ? route.meta.activePath : route.path));

function getSubMenuData() {
  let path = "";
  path = defaultActive.value;
  subMenuData.value = [];
  // path的上级路由组成的数组
  const parentPathArr = getParentPaths(path, wholeMenuList.value);
  // 当前路由的父级路由信息
  const parenetRoute = findRouteByPath(parentPathArr[0] || path, wholeMenuList.value);
  if (!parenetRoute?.children) return;
  subMenuData.value = parenetRoute?.children;
}

watch(
  () => [route.path, wholeMenuList.value],
  () => {
    if (route.path.includes("/redirect")) return;
    getSubMenuData();
    menuSelect(route.path);
  }
);

onMounted(() => {
  getSubMenuData();

  emitter.on("logoChange", (key) => {
    showLogo.value = key;
  });
});

onBeforeUnmount(() => {
  // 解绑`logoChange`公共事件，防止多次触发
  emitter.off("logoChange");
});
</script>

<template>
  <div v-loading="loading" :class="['sidebar-container', showLogo ? 'has-logo' : '']">
    <Logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar v-loading="useAppStore().routeLoading" wrap-class="scrollbar-wrapper" :class="[device === 'mobile' ? 'mobile' : 'pc']">
      <el-menu unique-opened mode="vertical" class="outer-most select-none" :collapse="isCollapse" :default-active="defaultActive" :collapse-transition="false">
        <sidebar-item v-for="routes in navMenuList" :key="routes.path" :item="routes" :base-path="routes.path" class="outer-most select-none" />
      </el-menu>
    </el-scrollbar>
    <leftCollapse v-if="device !== 'mobile'" :is-active="pureApp.sidebar.opened" @toggleClick="toggleSideBar" />
  </div>
</template>
