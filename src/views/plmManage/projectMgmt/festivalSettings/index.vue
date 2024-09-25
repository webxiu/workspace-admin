<template>
  <div class="wrapper">
    <!-- <div class="left"><LeftTable @leftTableDbClick="leftTableDbClick" @clearRightList="clearRightListAction" /></div> -->
    <div class="right"><RightTable ref="rightRef" :leftRow="{}" /></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import LeftTable from "./components/leftTable/index.vue";
import RightTable from "./components/rightTable/index.vue";
import { getRightFreeDayList } from "@/api/plmManage";

defineOptions({ name: "PlmManageProjectMgmtFestivalSettingsIndex" });

const leftRow: any = ref({});

const clearRightListAction = () => {
  // rightRef.value.setList([]);
  // rightRef.value.setCurLeftRow(null);
};

const leftTableDbClick = (v) => {
  // rightRef.value.setLoading(true);
  // rightRef.value.setCurLeftRow(v);
  // leftRow.value = v;
  // getRightFreeDayList({})
  //   .then((res) => {
  //     if (res.data) {
  //       rightRef.value.setList(res.data);
  //     }
  //   })
  //   .finally(() => rightRef.value.setLoading(false));
};

const rightRef = ref();
</script>

<style scoped lang="scss">
.wrapper {
  display: flex;

  .left {
    flex: 50%;
    overflow: auto;
  }

  .right {
    flex: 50%;
    overflow: auto;
  }
}
</style>
