<script setup lang="ts">
import { $t } from "@/plugins/i18n";
import { emitter } from "@/utils/mitt";
import { RouteConfigs } from "../../types";
import { useTags } from "../../hooks/useTag";
import { routerArrays } from "@/layout/types";
import { handleAliveRoute, getTopMenu } from "@/router/utils";
import { useSettingStoreHook } from "@/store/modules/settings";
import { useResizeObserver, useFullscreen } from "@vueuse/core";
import { isEqual, isAllEmpty, debounce } from "@pureadmin/utils";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { ref, watch, unref, toRaw, nextTick, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";

import ExitFullscreen from "@iconify-icons/ri/fullscreen-exit-fill";
import Fullscreen from "@iconify-icons/ri/fullscreen-fill";
import ArrowDown from "@iconify-icons/ri/arrow-down-s-line";
import ArrowRightSLine from "@iconify-icons/ri/arrow-right-s-line";
import ArrowLeftSLine from "@iconify-icons/ri/arrow-left-s-line";
import CloseBold from "@iconify-icons/ep/close-bold";

const {
  route,
  router,
  visible,
  showTags,
  instance,
  multiTags,
  tagsViews,
  buttonTop,
  buttonLeft,
  showModel,
  translateX,
  pureSetting,
  activeIndex,
  getTabStyle,
  iconIsActive,
  linkIsActive,
  currentSelect,
  scheduleIsActive,
  getContextMenuStyle,
  closeMenu,
  onMounted,
  onMouseenter,
  onMouseleave,
  transformI18n,
  onContentFullScreen
} = useTags();

const routeObj = useRoute();
const tabDom = ref();
const containerDom = ref();
const scrollbarDom = ref();
const isShowArrow = ref(false);
const topPath = getTopMenu()?.path;
const { VITE_HIDE_HOME } = import.meta.env;
const { isFullscreen, toggle } = useFullscreen();

const dynamicTagView = async () => {
  await nextTick();
  const index = multiTags.value.findIndex((item) => {
    if (!isAllEmpty(route.query)) {
      return isEqual(route.query, item.query);
    } else if (!isAllEmpty(route.params)) {
      return isEqual(route.params, item.params);
    } else {
      return route.path === item.path;
    }
  });
  moveToView(index);
};

const moveToView = async (index: number): Promise<void> => {
  await nextTick();
  const tabNavPadding = 10;
  if (!instance.refs["dynamic" + index]) return;
  const tabItemEl = instance.refs["dynamic" + index][0];
  const tabItemElOffsetLeft = (tabItemEl as HTMLElement)?.offsetLeft;
  const tabItemOffsetWidth = (tabItemEl as HTMLElement)?.offsetWidth;
  // 标签页导航栏可视长度（不包含溢出部分）
  const scrollbarDomWidth = scrollbarDom.value ? scrollbarDom.value?.offsetWidth : 0;

  // 已有标签页总长度（包含溢出部分）
  const tabDomWidth = tabDom.value ? tabDom.value?.offsetWidth : 0;

  scrollbarDomWidth <= tabDomWidth ? (isShowArrow.value = true) : (isShowArrow.value = false);
  if (tabDomWidth < scrollbarDomWidth || tabItemElOffsetLeft === 0) {
    translateX.value = 0;
  } else if (tabItemElOffsetLeft < -translateX.value) {
    // 标签在可视区域左侧
    translateX.value = -tabItemElOffsetLeft + tabNavPadding;
  } else if (tabItemElOffsetLeft > -translateX.value && tabItemElOffsetLeft + tabItemOffsetWidth < -translateX.value + scrollbarDomWidth) {
    // 标签在可视区域
    translateX.value = Math.min(0, scrollbarDomWidth - tabItemOffsetWidth - tabItemElOffsetLeft - tabNavPadding);
  } else {
    // 标签在可视区域右侧
    translateX.value = -(tabItemElOffsetLeft - (scrollbarDomWidth - tabNavPadding - tabItemOffsetWidth));
  }
};

const handleScroll = (offset: number): void => {
  const scrollbarDomWidth = scrollbarDom.value ? scrollbarDom.value?.offsetWidth : 0;
  const tabDomWidth = tabDom.value ? tabDom.value.offsetWidth : 0;
  if (offset > 0) {
    translateX.value = Math.min(0, translateX.value + offset);
  } else {
    if (scrollbarDomWidth < tabDomWidth) {
      if (translateX.value >= -(tabDomWidth - scrollbarDomWidth)) {
        translateX.value = Math.max(translateX.value + offset, scrollbarDomWidth - tabDomWidth);
      }
    } else {
      translateX.value = 0;
    }
  }
};

function dynamicRouteTag(value: string): void {
  const hasValue = multiTags.value.some((item) => {
    return item.path === value;
  });

  function concatPath(arr: object[], value: string) {
    arr.forEach((arrItem: any) => {
      if (arrItem.path === value) {
        useMultiTagsStoreHook().handleTags(hasValue ? "update" : "push", {
          path: value,
          meta: arrItem.meta,
          name: arrItem.name,
          query: routeObj.query
        });
      } else {
        if (arrItem.children && arrItem.children.length > 0) {
          concatPath(arrItem.children, value);
        }
      }
    });
  }
  concatPath(router.options.routes as any, value);
}

/** 刷新路由 */
function onFresh() {
  const { fullPath, query } = unref(route);
  router.replace({
    path: "/redirect" + fullPath,
    query
  });
  handleAliveRoute(route as ToRouteType, "refresh");
}

function deleteDynamicTag(obj: any, current: any, tag?: string) {
  const valueIndex: number = multiTags.value.findIndex((item: any) => {
    if (item.query) {
      if (item.path === obj.path) {
        return item.query === obj.query;
      }
    } else if (item.params) {
      if (item.path === obj.path) {
        return item.params === obj.params;
      }
    } else {
      return item.path === obj.path;
    }
  });

  const spliceRoute = (startIndex?: number, length?: number, other?: boolean): void => {
    if (other) {
      useMultiTagsStoreHook().handleTags("equal", [VITE_HIDE_HOME === "false" ? routerArrays[0] : toRaw(getTopMenu()), obj]);
    } else {
      useMultiTagsStoreHook().handleTags("splice", "", {
        startIndex,
        length
      }) as any;
    }
    dynamicTagView();
  };

  if (tag === "other") {
    spliceRoute(1, 1, true);
  } else if (tag === "left") {
    spliceRoute(1, valueIndex - 1);
  } else if (tag === "right") {
    spliceRoute(valueIndex + 1, multiTags.value.length);
  } else {
    // 从当前匹配到的路径中删除
    spliceRoute(valueIndex, 1);
  }
  const newRoute = useMultiTagsStoreHook().handleTags("slice");
  if (current === route.path) {
    // 如果删除当前激活tag就自动切换到最后一个tag
    if (tag === "left") return;
    if (newRoute[0]?.query) {
      router.push({ name: newRoute[0].name, query: newRoute[0].query });
    } else if (newRoute[0]?.params) {
      router.push({ name: newRoute[0].name, params: newRoute[0].params });
    } else {
      router.push({ path: newRoute[0].path });
    }
  } else {
    if (!multiTags.value.length) return;
    if (multiTags.value.some((item) => item.path === route.path)) return;
    if (newRoute[0]?.query) {
      router.push({ name: newRoute[0].name, query: newRoute[0].query });
    } else if (newRoute[0]?.params) {
      router.push({ name: newRoute[0].name, params: newRoute[0].params });
    } else {
      router.push({ path: newRoute[0].path });
    }
  }
}

function deleteMenu(item, tag?: string) {
  deleteDynamicTag(item, item.path, tag);
  handleAliveRoute(route as ToRouteType);
}

function onClickDrop(key, item, selectRoute?: RouteConfigs) {
  if (item && item.disabled) return;

  let selectTagRoute;
  if (selectRoute) {
    selectTagRoute = {
      path: selectRoute.path,
      meta: selectRoute.meta,
      name: selectRoute.name,
      query: selectRoute?.query,
      params: selectRoute?.params
    };
  } else {
    selectTagRoute = { path: route.path, meta: route.meta };
  }

  // 当前路由信息
  switch (key) {
    case 0:
      // 刷新路由
      onFresh();
      break;
    case 1:
      // 关闭当前标签页
      deleteMenu(selectTagRoute);
      break;
    case 2:
      // 关闭左侧标签页
      deleteMenu(selectTagRoute, "left");
      break;
    case 3:
      // 关闭右侧标签页
      deleteMenu(selectTagRoute, "right");
      break;
    case 4:
      // 关闭其他标签页
      deleteMenu(selectTagRoute, "other");
      break;
    case 5:
      // 关闭全部标签页
      useMultiTagsStoreHook().handleTags("splice", "", {
        startIndex: 1,
        length: multiTags.value.length
      });
      router.push(topPath);
      handleAliveRoute(route as ToRouteType);
      break;
    case 6:
      // 整体页面全屏
      toggle();
      setTimeout(() => {
        if (isFullscreen.value) {
          tagsViews[6].icon = ExitFullscreen;
          tagsViews[6].text = $t("buttons.hswholeExitFullScreen");
        } else {
          tagsViews[6].icon = Fullscreen;
          tagsViews[6].text = $t("buttons.hswholeFullScreen");
        }
      }, 100);
      break;
    case 7:
      // 内容区全屏
      onContentFullScreen();
      setTimeout(() => {
        if (pureSetting.hiddenSideBar) {
          tagsViews[7].icon = ExitFullscreen;
          tagsViews[7].text = $t("buttons.hscontentExitFullScreen");
        } else {
          tagsViews[7].icon = Fullscreen;
          tagsViews[7].text = $t("buttons.hscontentFullScreen");
        }
      }, 100);
      break;
  }
  setTimeout(() => {
    showMenuModel(route.fullPath, route.query);
  });
}

function handleCommand(command: any) {
  const { key, item } = command;
  onClickDrop(key, item);
}

/** 触发右键中菜单的点击事件 */
function selectTag(key, item) {
  onClickDrop(key, item, currentSelect.value);
}

function showMenus(value: boolean) {
  Array.of(1, 2, 3, 4, 5).forEach((v) => {
    tagsViews[v].show = value;
  });
}

function disabledMenus(value: boolean) {
  Array.of(1, 2, 3, 4, 5).forEach((v) => {
    tagsViews[v].disabled = value;
  });
}

/** 检查当前右键的菜单两边是否存在别的菜单，如果左侧的菜单是顶级菜单，则不显示关闭左侧标签页，如果右侧没有菜单，则不显示关闭右侧标签页 */
function showMenuModel(currentPath: string, query: object = {}, refresh = false) {
  const allRoute = multiTags.value;
  const routeLength = multiTags.value.length;
  let currentIndex = -1;
  if (isAllEmpty(query)) {
    currentIndex = allRoute.findIndex((v) => v.path === currentPath);
  } else {
    currentIndex = allRoute.findIndex((v) => isEqual(v.query, query));
  }

  showMenus(true);

  if (refresh) {
    tagsViews[0].show = true;
  }

  /**
   * currentIndex为1时，左侧的菜单顶级菜单，则不显示关闭左侧标签页
   * 如果currentIndex等于routeLength-1，右侧没有菜单，则不显示关闭右侧标签页
   */
  if (currentIndex === 1 && routeLength !== 2) {
    // 左侧的菜单是顶级菜单，右侧存在别的菜单
    tagsViews[2].show = false;
    Array.of(1, 3, 4, 5).forEach((v) => {
      tagsViews[v].disabled = false;
    });
    tagsViews[2].disabled = true;
  } else if (currentIndex === 1 && routeLength === 2) {
    disabledMenus(false);
    // 左侧的菜单是顶级菜单，右侧不存在别的菜单
    Array.of(2, 3, 4).forEach((v) => {
      tagsViews[v].show = false;
      tagsViews[v].disabled = true;
    });
  } else if (routeLength - 1 === currentIndex && currentIndex !== 0) {
    // 当前路由是所有路由中的最后一个
    tagsViews[3].show = false;
    Array.of(1, 2, 4, 5).forEach((v) => {
      tagsViews[v].disabled = false;
    });
    tagsViews[3].disabled = true;
  } else if (currentIndex === 0 || currentPath === `/redirect${topPath}`) {
    // 当前路由为顶级菜单
    disabledMenus(true);
  } else {
    disabledMenus(false);
  }
}

function openMenu(tag, e) {
  closeMenu();
  if (tag.path === topPath) {
    // 右键菜单为顶级菜单，只显示刷新
    showMenus(false);
    tagsViews[0].show = true;
  } else if (route.path !== tag.path && route.name !== tag.name) {
    // 右键菜单不匹配当前路由，隐藏刷新
    tagsViews[0].show = false;
    showMenuModel(tag.path, tag.query);
  } else if (
    // eslint-disable-next-line no-dupe-else-if
    multiTags.value.length === 2 &&
    route.path !== tag.path
  ) {
    showMenus(true);
    // 只有两个标签时不显示关闭其他标签页
    tagsViews[4].show = false;
  } else if (route.path === tag.path) {
    // 右键当前激活的菜单
    showMenuModel(tag.path, tag.query, true);
  }

  currentSelect.value = tag;
  const menuMinWidth = 105;
  const offsetLeft = unref(containerDom).getBoundingClientRect().left;
  const offsetWidth = unref(containerDom).offsetWidth;
  const maxLeft = offsetWidth - menuMinWidth;
  const left = e.clientX - offsetLeft + 5;
  if (left > maxLeft) {
    buttonLeft.value = maxLeft;
  } else {
    buttonLeft.value = left;
  }
  useSettingStoreHook().hiddenSideBar ? (buttonTop.value = e.clientY) : (buttonTop.value = e.clientY - 40);
  nextTick(() => {
    visible.value = true;
  });
}

/** 触发tags标签切换 */
function tagOnClick(item) {
  const { name, path, query, params } = item;
  if (name) {
    if (item.query) {
      router.push({ name, query });
    } else if (item.params) {
      router.push({ name, params });
    } else {
      router.push({ name });
    }
  } else {
    router.push({ path });
  }
  // showMenuModel(item?.path, item?.query);
}

watch(route, () => {
  activeIndex.value = -1;
  dynamicTagView();
});

watch(isFullscreen, () => {
  tagsViews[6].icon = Fullscreen;
  tagsViews[6].text = $t("buttons.hswholeFullScreen");
});

onMounted(() => {
  if (!instance) return;

  // 根据当前路由初始化操作标签页的禁用状态
  showMenuModel(route.fullPath);

  // 触发隐藏标签页
  emitter.on("tagViewsChange", (key: any) => {
    if (unref(showTags as any) === key) return;
    (showTags as any).value = key;
  });

  // 改变标签风格
  emitter.on("tagViewsShowModel", (key) => {
    showModel.value = key;
  });

  //  接收侧边栏切换传递过来的参数
  emitter.on("changLayoutRoute", (indexPath) => {
    dynamicRouteTag(indexPath);
    setTimeout(() => {
      showMenuModel(indexPath);
    });
  });

  useResizeObserver(
    scrollbarDom,
    debounce(() => dynamicTagView())
  );
});

onBeforeUnmount(() => {
  // 解绑`tagViewsChange`、`tagViewsShowModel`、`changLayoutRoute`公共事件，防止多次触发
  emitter.off("tagViewsChange");
  emitter.off("tagViewsShowModel");
  emitter.off("changLayoutRoute");
});
</script>

<template>
  <div ref="containerDom" class="tags-view" v-if="!showTags">
    <span v-show="isShowArrow" class="arrow-left">
      <IconifyIconOffline :icon="ArrowLeftSLine" @click="handleScroll(200)" />
    </span>
    <div ref="scrollbarDom" class="scroll-container">
      <div class="tab select-none" ref="tabDom" :style="getTabStyle">
        <div
          :ref="'dynamic' + index"
          v-for="(item, index) in multiTags"
          :key="index"
          :class="['scroll-item is-closable', linkIsActive(item), route.path === item.path && showModel === 'card' ? 'card-active' : '']"
          @contextmenu.prevent="openMenu(item, $event)"
          @mouseenter.prevent="onMouseenter(index)"
          @mouseleave.prevent="onMouseleave(index)"
          @click="tagOnClick(item)"
        >
          <router-link :to="{ path: item.path, query: item.query }" class="dark:!text-text_color_primary dark:hover:!text-primary">
            {{ transformI18n(item.meta.title) }}{{ item.query?.title ? `【${item.query.title}】` : "" }}
          </router-link>
          <span v-if="iconIsActive(item, index) || (index === activeIndex && index !== 0)" class="el-icon-close" @click.stop="deleteMenu(item)">
            <IconifyIconOffline :icon="CloseBold" />
          </span>
          <div :ref="'schedule' + index" v-if="showModel !== 'card'" :class="[scheduleIsActive(item)]" />
        </div>
      </div>
    </div>
    <span v-show="isShowArrow" class="arrow-right">
      <IconifyIconOffline :icon="ArrowRightSLine" @click="handleScroll(-200)" />
    </span>
    <!-- 右键菜单按钮 -->
    <transition name="el-zoom-in-top">
      <ul v-show="visible" :key="Math.random()" :style="getContextMenuStyle" class="contextmenu">
        <div v-for="(item, key) in tagsViews.slice(0, 6)" :key="key" style="display: flex; align-items: center">
          <li v-if="item.show" @click="selectTag(key, item)">
            <IconifyIconOffline :icon="item.icon" />
            {{ transformI18n(item.text) }}
          </li>
        </div>
      </ul>
    </transition>
    <!-- 右侧功能按钮 -->
    <el-dropdown trigger="click" placement="bottom-end" @command="handleCommand">
      <span class="arrow-down">
        <IconifyIconOffline :icon="ArrowDown" class="dark:text-white" />
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="(item, key) in tagsViews" :key="key" :command="{ key, item }" :divided="item.divided" :disabled="item.disabled">
            <IconifyIconOffline :icon="item.icon" />
            {{ transformI18n(item.text) }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style lang="scss" scoped>
@import url("./index.scss");
</style>
