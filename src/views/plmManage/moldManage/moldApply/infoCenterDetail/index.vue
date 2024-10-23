<template>
  <div>
    <OpenModeDetail :row="detailInfo" />
  </div>
</template>

<script setup lang="ts">
import { MoldApplyItemType, moldApplyList } from "@/api/plmManage";
import OpenModeDetail from "@/views/plmManage/moldManage/moldApply/print.vue";
import { onMounted, ref } from "vue";

const detailInfo = ref<MoldApplyItemType>();
const props = defineProps(["id"]);

const initData = (id) => {
  moldApplyList({ page: 1, limit: 100000 }).then((res) => {
    if (res.data) {
      const findRes = res.data.records.find((el) => el.id === id);
      console.log(findRes, "findRes===");
      detailInfo.value = findRes;
    }
  });
};

onMounted(() => {
  if (props.id) initData(props.id);
});
</script>
