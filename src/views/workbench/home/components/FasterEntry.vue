<template>
  <el-row :gutter="20" v-loading="loading">
    <el-col v-if="!entryList.length" :span="24" class="item-box">
      <el-empty :image-size="80" description="暂无数据" />
    </el-col>
    <el-col v-else :xs="8" :sm="8" :md="8" :lg="8" :xl="8" v-for="item in entryList" :key="item.menuId" @click="onFastClick(item)" class="item-box">
      <div class="link-item no-select">
        <i class="fz-32 iconfont" :class="item.icon" />
        <div class="fz-14 ellipsis ui-w-100">{{ item.menuName }}</div>
      </div>
    </el-col>
  </el-row>
</template>
<script lang="ts" setup>
import { FastEntryItemType } from "@/api/user/user";

withDefaults(defineProps<{ loading: boolean; entryList: FastEntryItemType[] }>(), {
  loading: () => false,
  entryList: () => []
});
const emits = defineEmits(["click"]);

const onFastClick = (item: FastEntryItemType) => {
  emits("click", item);
};
</script>
<style lang="scss" scoped>
.item-box {
  box-sizing: border-box;
  height: 100px;
  padding: 5px !important;
  text-align: center;
}

.link-item {
  width: 100%;
  height: 100%;
  padding: 6px;
  cursor: pointer;
  background: var(--el-fill-color-light);
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
</style>
