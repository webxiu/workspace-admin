<script setup lang="ts">
import Logo from "./logo.vue";
import NavRight from "./NavRight.vue";
import SidebarItem from "./sidebarItem.vue";
import { isAllEmpty } from "@pureadmin/utils";
import { ref, nextTick, computed } from "vue";
import { useNav } from "@/layout/hooks/useNav";
import { useAppStore } from "@/store/modules/app";
import { useTranslationLang } from "../../hooks/useTranslationLang";
import { usePermissionStoreHook } from "@/store/modules/permission";

const menuRef = ref();
const { isCollapse } = useNav();
const { route } = useTranslationLang(menuRef);
const defaultActive = computed(() => (!isAllEmpty(route.meta?.activePath) ? route.meta.activePath : route.path));
const navMenuList = computed(() => usePermissionStoreHook().wholeMenus);

nextTick(() => {
  menuRef.value?.handleResize();
});
</script>

<template>
  <div class="horizontal-header">
    <div class="horizontal-header-left">
      <Logo :collapse="isCollapse" />
    </div>
    <div v-loading="useAppStore().routeLoading" class="ui-w-100 ui-h-100 ui-ov-h no-select">
      <el-menu ref="menuRef" v-show="navMenuList.length > 0" mode="horizontal" class="horizontal-header-menu" :default-active="defaultActive">
        <sidebar-item v-for="route in usePermissionStoreHook().wholeMenus" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </div>
    <NavRight class="horizontal-header-right" />
  </div>
</template>
