<!-- /*
 * @Author: lixiuhai 
 * @Date: 2023-06-29 16:50:45 
 * @Last Modified by:   lixiuhai 
 * @Last Modified time: 2023-06-29 16:50:45 
 */ -->
<script setup lang="ts">
import { ref } from "vue";
import { useConfig } from "./utils/hook";

const { mx } = useConfig();
</script>

<template>
  <div class="main ui-h-100" ref="boxRef">流程图</div>
</template>

<style scoped lang="scss"></style>
