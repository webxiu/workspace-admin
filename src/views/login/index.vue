<script setup lang="ts">
import { toRaw } from "vue";
import { useI18n } from "vue-i18n";
import Motion from "./utils/motion";
import { loginRules } from "./utils/config";
import { useNav } from "@/layout/hooks/useNav";
import { $t, transformI18n } from "@/plugins/i18n";
import { useLayout } from "@/layout/hooks/useLayout";
import { bg, avatar, illustration } from "./utils/static";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useTranslationLang } from "@/layout/hooks/useTranslationLang";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";

import dayIcon from "@/assets/svg/day.svg?component";
import darkIcon from "@/assets/svg/dark.svg?component";
import globalization from "@/assets/svg/globalization.svg?component";
import Lock from "@iconify-icons/ri/lock-fill";
import Check from "@iconify-icons/ep/check";
import User from "@iconify-icons/ri/user-3-fill";
import { useConfig } from "./utils/hook";
import * as pkg from "~/package.json";

defineOptions({ name: "Login" });

const { ruleFormRef, ruleForm, loading, activeName, clientList, clientInfo, onLogin, onForgetPassword } = useConfig();
const { locale, translationCh, translationEn } = useTranslationLang();
const { appConfig, getDropdownItemStyle, getDropdownItemClass } = useNav();
const { dataTheme, dataThemeChange } = useDataThemeChange();
const { initStorage } = useLayout();
const { t } = useI18n();

initStorage();
dataThemeChange();
</script>

<template>
  <div class="select-none">
    <div :style="{ background: `url(${bg}) 0 0 / cover no-repeat` }" class="wave" />
    <div class="flex-c absolute right-5 top-3">
      <!-- 主题 -->
      <el-switch v-model="dataTheme" inline-prompt :active-icon="dayIcon" :inactive-icon="darkIcon" @change="dataThemeChange" />
      <!-- 国际化 -->
      <el-dropdown trigger="click">
        <globalization class="hover:text-primary hover:!bg-[transparent] w-[20px] h-[20px] ml-1.5 cursor-pointer outline-none duration-300" />
        <template #dropdown>
          <el-dropdown-menu class="translation">
            <el-dropdown-item
              :style="getDropdownItemStyle(locale, 'zh')"
              :class="['dark:!text-white', getDropdownItemClass(locale, 'zh')]"
              @click="translationCh"
            >
              <IconifyIconOffline class="check-zh" v-show="locale === 'zh'" :icon="Check" />
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
    </div>
    <div class="login-container">
      <div class="img">
        <component :is="toRaw(illustration)" />
      </div>

      <div class="login-box">
        <div class="login-form">
          <Motion>
            <div class="login-title">Beauty Your Life</div>
            <h2 class="outline-none">{{ clientInfo.orgShortName || appConfig.title }}</h2>
          </Motion>
          <!-- <avatar class="avatar" /> -->
          <div class="login-content">
            <el-tabs v-model="activeName" class="demo-tabs">
              <el-tab-pane :label="t('login.account')" name="account" />
              <el-tab-pane :label="t('login.wechat')" name="wechat" />
            </el-tabs>
            <div class="content-main" :style="{ height: activeName === 'account' ? '218px' : '400px', transition: 'all 0.5s' }">
              <!-- 帐号密码 -->
              <el-form v-show="activeName === 'account'" ref="ruleFormRef" :model="ruleForm" :rules="loginRules" size="large" class="form-demo">
                <Motion :delay="100">
                  <el-form-item :rules="[{ required: true, message: transformI18n($t('login.usernameReg')), trigger: 'blur' }]" prop="userNo">
                    <el-input
                      clearable
                      v-model="ruleForm.userNo"
                      @keyup.enter="onLogin(ruleFormRef)"
                      :placeholder="t('login.usernameReg')"
                      :prefix-icon="useRenderIcon(User)"
                    />
                  </el-form-item>
                </Motion>

                <Motion :delay="150">
                  <el-form-item prop="password" style="margin-bottom: 15px">
                    <el-input
                      clearable
                      show-password
                      v-model="ruleForm.password"
                      @keyup.enter="onLogin(ruleFormRef)"
                      :placeholder="t('login.passwordReg')"
                      :prefix-icon="useRenderIcon(Lock)"
                    />
                  </el-form-item>
                </Motion>
                <Motion :delay="250">
                  <el-form-item prop="remember" style="margin-bottom: 5px">
                    <el-checkbox v-model="ruleForm.remember" label="记住密码" />
                  </el-form-item>
                </Motion>
                <Motion :delay="350">
                  <el-button class="w-full mt-4 mb-5" size="default" type="primary" :loading="loading" @click="onLogin(ruleFormRef)">
                    {{ t("login.login") }}
                  </el-button>
                </Motion>
              </el-form>
              <!-- 企业微信 -->
              <div v-show="activeName === 'wechat'" style="min-height: 400px" id="wx_qrcode" class="flex just-center" />
            </div>
            <!-- 底部链接 -->
            <div class="flex just-between align-center mt-8">
              <div class="download-link">
                <a v-for="item in clientList" :key="item.name" :href="item.href">
                  <el-button link type="primary" class="app-download">{{ item.name }}</el-button>
                </a>
              </div>
              <div class="flex just-end">
                <el-button link @click="onForgetPassword">{{ t("login.forgotPassword") }}</el-button>
              </div>
            </div>
            <div class="version-outer">
              <div class="version v1">{{ "Fv-" + pkg.version }}</div>
              <div class="version">{{ "Bv-" + (clientInfo.version || "") }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wave {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  filter: brightness(0.6);
}

.layout-theme-default.dark .wave {
  filter: brightness(0.3);
}

.login-container {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-gap: 18rem;
  width: 100vw;
  height: 100vh;
  padding: 0 2rem;
}

.img {
  display: flex;
  display: none;
  align-items: center;
  justify-content: flex-end;
}

.img img {
  width: 500px;
}

.login-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.login-form {
  width: 430px;
  overflow: hidden;
  background: var(--el-bg-color);
  border-radius: 12px;
  box-shadow: 0 -1px 14px 1px #888 !important;
}

.login-title {
  position: relative;
  height: 100px;
  overflow: hidden;
  font-family: SourceHanSansCN-Regular, sans-serif;
  font-size: 30px;
  font-weight: 400;
  font-stretch: normal;
  line-height: 100px;
  color: #fff;
  text-align: center;
  letter-spacing: 0;
  background-color: #c12f38;

  &::before {
    position: absolute;
    top: 40px;
    left: -36px;
    display: inline-block;
    width: 100px;
    height: 100px;
    content: "";
    background: rgb(255 227 227 / 12%);
    border-radius: 50%;
    animation: mymove1 8s infinite alternate cubic-bezier(0.17, 0.86, 0.73, 0.14);
  }

  &::after {
    position: absolute;
    top: -16px;
    right: -16px;
    display: inline-block;
    width: 94px;
    height: 94px;
    content: "";
    background: rgb(255 243 243 / 12%);
    border-radius: 50%;
    animation: mymove2 10s infinite alternate cubic-bezier(0.17, 0.86, 0.73, 0.14);
  }
}

@keyframes mymove1 {
  from {
    top: 40px;
    left: -10px;
  }

  to {
    top: -10px;
    left: 500px;
  }
}

@keyframes mymove2 {
  from {
    right: -20px;
  }

  to {
    right: 500px;
  }
}

.avatar {
  width: 350px;
  height: 80px;
}

.login-form h2 {
  margin: 15px 0;
  font: bold 200% Consolas, Monaco, monospace;
  color: #999;
  text-transform: uppercase;
}

.login-content {
  padding: 0 36px;
}

.download-link {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-start;
}

.app-download {
  margin-right: 15px;
  font-size: 14px;
  color: #9abcda;
}

.version-outer {
  display: flex;
  margin-bottom: 6px;

  .version {
    font-size: 14px;
    line-height: 36px;
    color: #9abcda;
  }

  .v1 {
    margin-right: 15px;
  }
}

@media screen and (width <= 768px) {
  .login-container {
    grid-gap: 9rem;
  }

  .login-form {
    width: 100%;
  }

  .login-form h2 {
    margin: 8px 0;
    font-size: 2.4rem;
  }

  .img img {
    width: 360px;
  }

  .avatar {
    width: 280px;
    height: 80px;
  }
}

@media screen and (width <= 768px) {
  .login-container {
    grid-template-columns: 1fr;
    background: #a9a9a9;
  }

  .wave {
    display: none;
  }

  .img {
    display: none;
  }

  .login-box {
    justify-content: center;
  }
}

:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
}

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
</style>
