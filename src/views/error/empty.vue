<script setup lang="ts">
import { useRouter } from "vue-router";
import noServer from "@/assets/status/500.svg?component";

/**
 * 空页面路由(请勿删除):
 * 解决最后一个路由跳转报错的问题, 添加到接口返回路由列表最后
 */
defineOptions({ name: "Empty" });

const router = useRouter();
</script>

<template>
  <div class="flex justify-center items-center h-[640px]">
    <noExist />
    <div class="ml-12">
      <p class="font-medium text-4xl mb-4 dark:text-white" v-motion :initial="{ opacity: 0, y: 100 }" :enter="{ opacity: 1, y: 0, transition: { delay: 100 } }">
        当前内容为空
      </p>
      <p class="mb-4 text-gray-500" v-motion :initial="{ opacity: 0, y: 100 }" :enter="{ opacity: 1, y: 0, transition: { delay: 300 } }">抱歉，页面出错了</p>
      <el-button
        type="primary"
        v-motion
        :initial="{ opacity: 0, y: 100 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 500 } }"
        @click="router.push('/workbench/home')"
      >
        返回首页
      </el-button>
    </div>
  </div>
</template>
