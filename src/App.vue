<template>
  <el-config-provider :locale="currentLocale" :message="{ max: 1 }">
    <a-config-provider :locale="antdvLocal">
      <router-view />
      <ReDialog />
    </a-config-provider>
  </el-config-provider>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import en from "element-plus/lib/locale/lang/en";
import { ReDialog } from "@/components/ReDialog";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import enUS from "ant-design-vue/es/locale/en_US";
export default defineComponent({
  name: "app",
  components: {
    [ElConfigProvider.name]: ElConfigProvider,
    ReDialog
  },
  computed: {
    currentLocale() {
      return this.$storage.locale?.locale === "zh" ? zhCn : en;
    },
    antdvLocal() {
      return this.$storage.locale?.locale === "zh" ? zhCN : enUS;
    }
  }
});
</script>
