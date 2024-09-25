<script setup lang="ts">
import { ref } from "vue";
import Search from "../search/index.vue";
import Check from "@iconify-icons/ep/check";
import MenuTree from "../menuTree/index.vue";
import { useNav } from "@/layout/hooks/useNav";
import Setting from "@iconify-icons/ri/settings-3-line";
import { useTranslationLang } from "../../hooks/useTranslationLang";
import globalization from "@/assets/svg/globalization.svg?component";

const menuRef = ref();
const { t, locale, translationCh, translationEn } = useTranslationLang(menuRef);
const { navDropList, userInfo, userAvatar, avatarsStyle, getDropdownItemStyle, getDropdownItemClass, onNavDropClick, onPanel } = useNav();
</script>

<template>
  <div>
    <!-- 快捷菜单 -->
    <MenuTree />
    <!-- 搜索菜单 -->
    <Search />
    <!-- 通知 -->
    <!-- <Notice id="header-notice" /> -->
    <!-- 国际化 -->
    <el-dropdown id="header-translation" trigger="click">
      <globalization class="navbar-bg-hover w-[40px] h-[48px] p-[11px] cursor-pointer outline-none" />
      <template #dropdown>
        <el-dropdown-menu class="translation">
          <el-dropdown-item
            :style="getDropdownItemStyle(locale, 'zh')"
            :class="['dark:!text-white', getDropdownItemClass(locale, 'zh')]"
            @click="translationCh"
          >
            <span class="check-zh" v-show="locale === 'zh'">
              <IconifyIconOffline :icon="Check" />
            </span>
            简体中文
          </el-dropdown-item>
          <el-dropdown-item
            :style="getDropdownItemStyle(locale, 'en')"
            :class="['dark:!text-white', getDropdownItemClass(locale, 'en')]"
            @click="translationEn"
          >
            <span class="check-en" v-show="locale === 'en'">
              <IconifyIconOffline :icon="Check" />
            </span>
            English
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <!-- 退出登录 -->
    <el-dropdown trigger="click">
      <span class="el-dropdown-link navbar-bg-hover">
        <img :src="userAvatar" :style="avatarsStyle" />
        <p v-if="userInfo.userName" class="dark:text-white no-wrap">{{ userInfo.userName }}</p>
      </span>
      <template #dropdown>
        <el-dropdown-menu class="logout">
          <el-dropdown-item v-for="item in navDropList" :key="item.value" @click="onNavDropClick(item)" :divided="item.value === 'logout'">
            <IconifyIconOffline :icon="item.icon" style="margin: 5px" />
            {{ t(item.label) }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <span class="set-icon navbar-bg-hover" :title="t('buttons.hssystemSet')" @click="onPanel">
      <IconifyIconOffline :icon="Setting" />
    </span>
  </div>
</template>

<style lang="scss" scoped>
.translation {
  ::v-deep(.el-dropdown-menu__item) {
    padding: 5px 40px;
  }

  .check-zh {
    position: absolute;
    left: 20px;
  }

  .check-en {
    position: absolute;
    left: 20px;
  }
}

.logout {
  width: auto;
}
</style>
