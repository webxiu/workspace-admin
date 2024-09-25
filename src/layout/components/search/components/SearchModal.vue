<script setup lang="ts">
import { match } from "pinyin-pro";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import SearchResult from "./SearchResult.vue";
import SearchFooter from "./SearchFooter.vue";
import { useNav } from "@/layout/hooks/useNav";
import { transformI18n } from "@/plugins/i18n";
import { ref, computed, shallowRef, onMounted, watch } from "vue";
import { cloneDeep, isAllEmpty } from "@pureadmin/utils";
import { useDebounceFn, onKeyStroke } from "@vueuse/core";
import Search from "@iconify-icons/ri/search-line";
import { useAppStoreHook } from "@/store/modules/app";
import { flatTree } from "@/utils/tree";

interface Props {
  /** 弹窗显隐 */
  value: boolean;
}

interface Emits {
  (e: "update:value", val: boolean): void;
}

const { device } = useNav();
const emit = defineEmits<Emits>();
const props = withDefaults(defineProps<Props>(), {});
const router = useRouter();
const { locale } = useI18n();

const keyword = ref("");
const scrollbarRef = ref();
const resultRef = ref();
const activePath = ref<RouteConfigsTable>();
const inputRef = ref<HTMLInputElement | null>(null);
const resultOptions = shallowRef([]);
const handleSearch = useDebounceFn(search, 300);

/** 菜单树形结构 */
const menusData = computed(() => cloneDeep(useAppStoreHook().asyncRoutes));

onMounted(() => {
  resultOptions.value = menusData.value;
});

const show = computed({
  get() {
    return props.value;
  },
  set(val: boolean) {
    emit("update:value", val);
  }
});

watch(show, (val) => {
  if (val) {
    resultOptions.value = menusData.value;
  }
});

/** 查询 */
function search() {
  const flatMenusData = flatTree(menusData.value);
  resultOptions.value = flatMenusData.filter((menu) =>
    keyword.value
      ? transformI18n(menu.meta?.title).toLocaleLowerCase().includes(keyword.value.toLocaleLowerCase().trim()) ||
        (locale.value === "zh" && !isAllEmpty(match(transformI18n(menu.meta?.title).toLocaleLowerCase(), keyword.value.toLocaleLowerCase().trim())))
      : false
  );
  if (resultOptions.value?.length > 0) {
    activePath.value = resultOptions.value[0];
  } else {
    activePath.value = undefined;
  }
}

function handleClose() {
  show.value = false;
  /** 延时处理防止用户看到某些操作 */
  const timer = setTimeout(() => {
    resultOptions.value = [];
    keyword.value = "";
    clearTimeout(timer);
  }, 200);
}

function scrollTo(index) {
  if (!scrollbarRef.value) return;
  const scrollTop = resultRef.value.handleScroll(index);
  scrollbarRef.value.setScrollTop(scrollTop);
}

/** key up */
function handleUp() {
  const { length } = resultOptions.value;
  if (length === 0) return;
  const index = resultOptions.value.findIndex((item) => item.path === activePath.value?.path);
  if (index === 0) {
    activePath.value = resultOptions.value[length - 1];
    scrollTo(resultOptions.value.length - 1);
  } else {
    activePath.value = resultOptions.value[index - 1];
    scrollTo(index - 1);
  }
}

/** key down */
function handleDown() {
  const { length } = resultOptions.value;
  if (length === 0) return;
  const index = resultOptions.value.findIndex((item) => item.path === activePath.value?.path);
  if (index + 1 === length) {
    activePath.value = resultOptions.value[0];
  } else {
    activePath.value = resultOptions.value[index + 1];
  }
  scrollTo(index + 1);
}

/** key enter */
function handleEnter() {
  const { length } = resultOptions.value;
  const menuItem = activePath.value;
  const hasChild = menuItem?.children?.length > 0;
  if (length === 0 || !menuItem) return;
  // 跳转主菜单
  const mainPath = `/menuPanel?menuCode=${menuItem.menuCode}&from=${menuItem.path}`;
  // 跳转具体页面
  const pagePath = `${menuItem.path}?menuId=${menuItem.id}`;

  router.push(hasChild ? mainPath : pagePath);
  handleClose();
}

onKeyStroke("Enter", handleEnter);
onKeyStroke("ArrowUp", handleUp);
onKeyStroke("ArrowDown", handleDown);
</script>

<template>
  <el-dialog
    top="5vh"
    class="pure-search-dialog"
    v-model="show"
    :show-close="false"
    :width="device === 'mobile' ? '80vw' : '40vw'"
    :before-close="handleClose"
    :style="{ borderRadius: '6px' }"
    append-to-body
    @opened="inputRef.focus()"
    @closed="inputRef.blur()"
  >
    <el-input ref="inputRef" size="large" v-model="keyword" clearable placeholder="搜索菜单" @input="handleSearch">
      <template #prefix>
        <IconifyIconOffline :icon="Search" class="text-primary w-[24px] h-[24px]" />
      </template>
    </el-input>
    <div class="search-result-container">
      <el-scrollbar ref="scrollbarRef" max-height="calc(90vh - 140px)">
        <el-empty v-if="resultOptions.length === 0" description="暂无搜索结果" />
        <SearchResult v-else ref="resultRef" v-model:value="activePath" :options="resultOptions" @click="handleEnter" />
      </el-scrollbar>
    </div>
    <template #footer>
      <SearchFooter :total="resultOptions.length" />
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.search-result-container {
  margin-top: 12px;
}
</style>
