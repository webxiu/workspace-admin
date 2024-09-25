<script setup lang="ts">
import { transformI18n } from "@/plugins/i18n";
import { useConfig } from "./utils";

defineOptions({ name: "RouterPanel" });
const { route, routeLink, onFavorite, getChildItem } = useConfig();
</script>

<template>
  <div class="menu-panel">
    <div v-for="(item, index) in routeLink" :key="item.menuCode">
      <div class="title">{{ transformI18n(item.meta.title) }}</div>
      <el-divider style="margin: 5px 0" />
      <div class="menu-content">
        <div v-for="(cell, idx) in getChildItem(item).children" :key="cell.menuCode" class="menu-link">
          <router-link :to="{ path: cell.path, query: { ...route.query, menuId: cell.id, menuName: cell.meta.title } }">
            <el-button type="primary" link class="link-btn">{{ transformI18n(cell.meta.title) }}</el-button>
          </router-link>
          <i v-show="!cell.isNoLike" class="iconfont icon-shoucang collect" @click="onFavorite('cancel', cell, index, idx)" title="取消快捷入口" />
          <i
            class="iconfont icon-soucang collect"
            style="display: none"
            :class="{ sc: cell.isNoLike }"
            @click="onFavorite('submit', cell, index, idx)"
            title="添加为快捷入口"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.menu-panel {
  min-height: calc(100vh - 106px);
  padding: 20px 30px !important;

  .title {
    font-size: 16px;
    font-weight: 700;
  }
}

.menu-content {
  display: flex;
  flex-wrap: wrap;
  padding: 0 15px;
  margin-bottom: 30px;

  .menu-link {
    display: flex;
    align-items: flex-end;
    width: 200px;
    margin: 15px 0;
    line-height: 20px;
  }

  .collect {
    font-size: 14px;
    color: #f60;
    cursor: pointer;
  }

  .menu-link:hover .collect.sc {
    display: block !important;
  }

  .link-btn {
    background: linear-gradient(to right, #ff9751, #f0f) no-repeat right bottom;
    background-size: 0 2px;
    transition: background-size 0.4s;
    &:hover {
      background-position: left bottom;
      background-size: 100% 2px;
    }
  }
}
</style>
