<template>
  <div class="flex-1 message" v-fmtMarkdown="message" />
</template>

<script setup lang="ts">
import "highlight.js/styles/atom-one-dark.css";
// import "highlight.js/styles/monokai-sublime.css";
// import "highlight.js/styles/github.css";
// import "highlight.js/styles/solarized-dark.css";
// import "highlight.js/styles/vs2015.css";
// import "highlight.js/styles/a11y-dark.css";

defineProps<{ message: string }>();
</script>
