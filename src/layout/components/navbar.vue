<script setup lang="ts">
import mixNav from "./sidebar/mixNav.vue";
import NavRight from "./sidebar/NavRight.vue";
import { useNav } from "@/layout/hooks/useNav";
import Breadcrumb from "./sidebar/breadCrumb.vue";
import topCollapse from "./sidebar/topCollapse.vue";

const { layout, device, pureApp, toggleSideBar } = useNav();
</script>

<template>
  <div class="navbar bg-[#fff] shadow-sm shadow-[rgba(0, 21, 41, 0.08)] dark:shadow-[#0d0d0d]">
    <topCollapse v-if="device === 'mobile'" class="hamburger-container" :is-active="pureApp.sidebar.opened" @toggleClick="toggleSideBar" />
    <Breadcrumb v-if="layout !== 'mix' && device !== 'mobile'" class="breadcrumb-container" />
    <mixNav v-if="layout === 'mix'" />
    <NavRight v-if="layout === 'vertical'" class="vertical-header-right" />
  </div>
</template>
