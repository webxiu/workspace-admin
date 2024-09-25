<template>
  <div class="wrapper-trans">
    <el-transfer
      v-model="selectValue"
      filterable
      :filter-method="filterMethod"
      filter-placeholder="关键字搜索"
      :data="data"
      :titles="['可选配置项', '已选配置项']"
      :props="{
        key: 'id',
        label: 'valueAll'
      }"
      @change="changeOptions"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const emits = defineEmits(["changeTransArrow"]);

const filterMethod = (query, item) => {
  return item.valueAll.toLowerCase().includes(query.toLowerCase());
};

const data = ref([]);
const selectValue = ref([]);

const changeOptions = (value) => {
  emits("changeTransArrow", value);
};

defineExpose({ data, selectValue });
</script>

<style scoped lang="scss">
.wrapper-trans {
  height: 100%;
  padding-top: 38px;
}
</style>
