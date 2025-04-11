import { addMenuFavorite, deleteMenuFavorite } from "@/api/user/user";
import { computed, ref, watch } from "vue";

import { cloneDeep } from "@pureadmin/utils";
import { message } from "@/utils/message";
import { useAppStoreHook } from "@/store/modules/app";
import { useRoute } from "vue-router";

export const useConfig = () => {
  const route = useRoute();
  const routeLink = ref<RouteConfigsTable[]>([]);
  const allRoute = cloneDeep(useAppStoreHook().asyncRoutes);

  const routes = computed<RouteConfigsTable[]>(() => {
    if (route.params) {
      const newRoutes = allRoute.filter((item) => {
        return item.menuCode === route.query.menuCode;
      })[0];
      return newRoutes?.children;
    } else {
      return [];
    }
  });

  watch(
    routes,
    (value) => {
      if (value) routeLink.value = value;
    },
    { immediate: true }
  );
  /** 没有子级菜单就添加一级 */
  const getChildItem = (item: RouteConfigsTable) => {
    if (!item?.children) item.children = [item];
    return item;
  };

  function onFavorite(type, cell: RouteConfigsTable, index, idx) {
    const curItem = routeLink.value[index].children[idx];
    const title = { cancel: "取消", submit: "添加" }[type];
    const API = { submit: addMenuFavorite, cancel: deleteMenuFavorite };
    API[type]({ menuId: curItem.id })
      .then((res) => {
        if (res.data) {
          message.success(`${title}成功`);
          routeLink.value[index].children[idx].isNoLike = !routeLink.value[index].children[idx].isNoLike;
        } else {
          message.error(`${title}失败`);
        }
      })
      .catch(console.log);
  }

  return { route, routeLink, onFavorite, getChildItem };
};
