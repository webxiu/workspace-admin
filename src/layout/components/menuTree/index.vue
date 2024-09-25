<script setup lang="ts">
import { debounce, openInVScode } from "@/utils/common";
import { Grid, Reading } from "@element-plus/icons-vue";
import { useAppStoreHook } from "@/store/modules/app";
import { computed, onMounted, onUnmounted, ref } from "vue";
const vscodePath = import.meta.env.VITE_OPEN_IN_VSCODE;

const height = ref(600);
const menuRoutes = computed(() => useAppStoreHook().asyncRoutes);

onMounted(() => {
  onResize();
  window.addEventListener("resize", onResize);
});
onUnmounted(() => {
  window.removeEventListener("resize", onResize);
});

const onResize = debounce(() => {
  height.value = window.innerHeight - 140;
}, 300);

function fmtRoute(data) {
  const parentRoute = menuRoutes.value?.find((item) => data.path.includes(item.path));
  return {
    path: data.path,
    query: {
      menuCode: parentRoute?.menuCode,
      from: parentRoute?.path,
      menuId: data.id,
      menuName: data.meta?.title
    }
  };
}
</script>

<template>
  <div class="w-[40px] h-[48px] flex-c cursor-pointer navbar-bg-hover">
    <el-popover title="菜单列表" trigger="hover" width="auto" placement="bottom-start">
      <template #reference>
        <el-icon :size="20">
          <Grid />
        </el-icon>
      </template>
      <el-tree
        v-if="menuRoutes.length"
        node-key="id"
        class="ui-ovy-a menu-tree-popover"
        :data="menuRoutes"
        default-expand-all
        :trigger="['click', 'hover', 'focus']"
        :props="{ children: 'children', label: 'title' }"
        :style="{ width: '212px', height: height + 'px' }"
      >
        <template #default="{ data }">
          <router-link v-if="data?.menuType === '菜单'" :to="fmtRoute(data)" style="width: 144px; overflow: hidden">
            <el-icon v-if="vscodePath" color="#409eff" class="ui-va-m mr-4" @click.stop="openInVScode(vscodePath, data)" title="在VSCode中打开">
              <Reading />
            </el-icon>
            <el-button type="primary" link>{{ data.title }}</el-button>
          </router-link>
          <el-button v-else type="default" link disabled>{{ data.title }}</el-button>
        </template>
      </el-tree>
      <el-empty v-else :image-size="60" description="暂无数据~" style="padding: 10px" />
    </el-popover>
  </div>
</template>
