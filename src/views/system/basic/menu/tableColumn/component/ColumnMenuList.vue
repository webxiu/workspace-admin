<template>
  <el-tree-select
    clearable
    filterable
    :size="size"
    :data="treeList"
    v-model="activeMenu"
    :default-expand-all="true"
    :render-after-expand="false"
    :props="{ label: 'title', value: 'id' }"
    check-on-click-node
    placeholder="选择菜单配置"
    v-slot:default="{ data }"
  >
    <el-button link @click="onChangeMenu(data)" :disabled="data.menuType !== '菜单'">{{ data.title }}</el-button>
  </el-tree-select>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAppStore } from "@/store/modules/app";
import { useSettingStoreHook } from "@/store/modules/settings";

const props = withDefaults(defineProps<{ url: string; size?: "default" | "small" | "large" }>(), { size: "small" });
const route = useRoute();
const router = useRouter();

const menuId = computed(() => {
  const mID = Number(route.query?.itemId as string);
  return Number.isNaN(mID) ? 0 : mID;
});
const activeMenu = ref<number>(menuId.value);
const treeList = computed(() => useAppStore().getAsyncRoutes);
const menusList = computed(() => useSettingStoreHook().gableConfigMenuRoutes);

function onChangeMenu({ id, menuType }) {
  if (menuType !== "菜单") return;
  const item = menusList.value.find((f) => f.id === id);
  activeMenu.value = id;
  router.push({
    path: props.url,
    query: { itemId: id, isNewTag: "yes", menuName: item?.menuName }
  });
}
</script>
