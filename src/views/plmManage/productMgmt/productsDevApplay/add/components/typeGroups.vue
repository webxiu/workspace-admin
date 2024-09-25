<script setup lang="ts">
import TableLeft from "./tableLeft.vue";
import TableRight from "./tableRight.vue";
import RightTrans from "./rightTrans.vue";
import { DArrowRight, DArrowLeft } from "@element-plus/icons-vue";
import { ref } from "vue";
import { computed } from "vue";
import { getConfigListBySelectedType, updateConfigBySelectedType } from "@/api/plmManage";
import { useRoute } from "vue-router";

const leftRef = ref();
const rightRef = ref();
const transRef = ref();
const currentClickRow: any = ref({});
const emits = defineEmits(["toLeft", "toRight"]);
const props = defineProps(["currentId"]);
const route = useRoute();

const calcLeftLen = computed(() => JSON.stringify(leftRef.value?.currentLeftRow) !== "{}");
const calcRightLen = computed(() => JSON.stringify(rightRef.value?.currentRightRow) !== "{}");

const addToRight = () => {
  emits("toRight", leftRef.value.currentLeftRow);
};

const addToLeft = () => {
  emits("toLeft", rightRef.value.currentRightRow);
};

const changeTransArrow = (values) => {
  updateConfigBySelectedType({ typeId: currentClickRow.value.id, id: props.currentId || route.query.id, typeIds: values }).then((res) => {
    if (res.data) {
      refreshTrans(currentClickRow.value);
    }
  });
};

const refreshTrans = (v) => {
  if (v.id) {
    getConfigListBySelectedType({ id: props.currentId || route.query.id, typeId: v.id }).then((res: any) => {
      if (res.data) {
        transRef.value.data = res.data.allTypeSettingList;
        transRef.value.selectValue = res.data.alreadyTypeSettingListIds;
      }
    });
  }
};

const dbClickRightTableRow = (v) => {
  currentClickRow.value = v;
  refreshTrans(v);
};

defineExpose({ leftRef, rightRef });
</script>

<template>
  <div class="groups">
    <div class="left-table">
      <TableLeft ref="leftRef" />
      <div class="center-trans">
        <div style="margin: 15px 0"><el-button type="success" :disabled="!calcLeftLen" :icon="DArrowRight" @click="addToRight" /></div>
        <div style="margin: 15px 0"><el-button :disabled="!calcRightLen" :icon="DArrowLeft" @click="addToLeft" /></div>
      </div>
      <TableRight ref="rightRef" @dbClickRightTableRow="dbClickRightTableRow" />
    </div>
    <div class="right-transfer">
      <RightTrans ref="transRef" @changeTransArrow="changeTransArrow" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.groups {
  display: flex;

  .left-table {
    display: flex;
    width: 65%;
  }

  .center-trans {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .right-transfer {
    flex: 50%;
  }
}
</style>
