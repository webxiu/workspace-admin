<script setup lang="ts">
import { SearchModal } from "./components";
import { useBoolean } from "../../hooks/useBoolean";
import Search from "@iconify-icons/ep/search";
import { computed, onMounted } from "vue";
import { onUnmounted } from "vue";
const { bool: show, toggle } = useBoolean();

function registerHotKey(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault();
    toggle();
  }
}

const keyTitle = computed(() => {
  const isMac = /Mac/.test(navigator.platform);
  return isMac ? "⌘ + k" : "Ctrl + k";
});

onMounted(() => {
  window.addEventListener("keydown", registerHotKey);
});
onUnmounted(() => {
  window.removeEventListener("keydown", registerHotKey);
});
</script>

<template>
  <div class="search-container w-[40px] h-[48px] flex-c cursor-pointer navbar-bg-hover" @click="toggle" :title="keyTitle">
    <IconifyIconOffline :icon="Search" />
  </div>
  <SearchModal v-model:value="show" />
</template>
