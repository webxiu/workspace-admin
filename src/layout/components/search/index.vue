<script setup lang="ts">
import { SearchModal } from "./components";
import { useBoolean } from "../../hooks/useBoolean";
import Search from "@iconify-icons/ep/search";
import { onKeyStroke } from "@vueuse/core";
import { onMounted } from "vue";

const { bool: show, toggle } = useBoolean();
function handleSearch() {
  toggle();
}

onMounted(() => {
  onKeyStroke(["Ctrl", "k"], (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggle();
  });
});
</script>

<template>
  <div class="search-container w-[40px] h-[48px] flex-c cursor-pointer navbar-bg-hover" @click="handleSearch" title="Ctrl + K">
    <IconifyIconOffline :icon="Search" />
  </div>
  <SearchModal v-model:value="show" />
</template>
