<script setup lang="ts">
import { debounce, openInVScode } from "@/utils/common";
import { useAppStoreHook } from "@/store/modules/app";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRoute } from "vue-router";
import HxIcon from "@/components/HxIcon";
import { ConfUrl } from "@/views/system/basic/menu/utils/hook";
const vscodePath = import.meta.env.VITE_OPEN_IN_VSCODE;

const height = ref(600);
const route = useRoute();
const menuRoutes = computed(() => useAppStoreHook().asyncRoutes);

onMounted(() => {
  onResize();
  window.addEventListener("resize", onResize);
});
onUnmounted(() => {
  window.removeEventListener("resize", onResize);
});

const onResize = debounce(() => {
  height.value = window.innerHeight - 170;
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
// 打开表格配置
function onDevTable(env) {
  const queryString = Object.entries({ isNewTag: "yes", ...route.query })
    .filter(([_, value]) => value)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  let link = `/#${ConfUrl.table}?${queryString}`;
  if (env === "prod") link = "https://app.deogra.com" + link;
  window.open(link);
}
</script>

<template>
  <div class="w-[40px] h-[48px] flex-c cursor-pointer navbar-bg-hover">
    <el-popover title="快捷菜单列表" trigger="hover" width="auto" placement="bottom-start">
      <template #reference>
        <HxIcon icon="Grid" size="20" />
      </template>
      <div v-if="vscodePath" class="flex mb-4 border-line-bottom">
        <el-button link @click.stop="openInVScode(vscodePath, { path: route.path })" size="small" type="primary" title="在VSCode中打开当前菜单">
          VSCode编辑
        </el-button>
        <el-button link @click.stop="onDevTable('dev')" size="small" type="success" title="配置当前表格">表格配置</el-button>
        <el-button link @click.stop="onDevTable('prod')" size="small" type="warning" title="配置生产表格">生产配置</el-button>
      </div>
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
            <HxIcon v-if="vscodePath" icon="Reading" color="#409eff" class="ui-va-m mr-4" @click.stop="openInVScode(vscodePath, data)" title="在VSCode中打开" />
            <el-button type="primary" link>{{ data.title }}</el-button>
          </router-link>
          <el-button v-else type="default" link disabled>{{ data.title }}</el-button>
        </template>
      </el-tree>
      <el-empty v-else :image-size="60" description="暂无数据~" style="padding: 10px" />
    </el-popover>
  </div>
</template>
