<template>
  <div class="select-user">
    <div class="right-table">
      <PureTableBar :columns="columns1" @refresh="onFresh1" style="padding-top: 0" :show-icon="true" @change-column="setUserMenuColumns">
        <template #title>
          <div style="display: flex; flex: 1; justify-content: space-between">
            <div class="search-ipt">
              <el-date-picker @change="changeDateYear" v-model="defaultHolidayYear" type="year" placeholder="选择年份" valueFormat="YYYY" format="YYYY" />
            </div>
          </div>
        </template>
        <template #buttons>
          <div>
            <ButtonList moreActionText="业务操作" :buttonList="buttonList" :auto-layout="false" />
          </div>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            @row-click="(row, col, ev) => rowClick(row, col, ev, leftTableDbClick)"
            show-overflow-tooltip
            :row-style="{ cursor: 'pointer' }"
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="id"
            class="team-member"
            :adaptive="true"
            align-whole="left"
            :loading="loading"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            highlight-current-row
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns1)"
          >
            <template #calcType="{ row }">
              {{ constantTypeInfo[row.calcType] || "" }}
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useBankTable } from "./config";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

import { PureTableBar } from "@/components/RePureTableBar";
import { useEleHeight } from "@/hooks";

const emits = defineEmits(["leftTableDbClick", "clearRightList"]);
const { columns1, dataList, loading, onFresh1, rowClick, changeDateYear, defaultHolidayYear, buttonList } = useBankTable(emits);
const maxHeight = useEleHeight(".app-main > .el-scrollbar", 40);

defineProps(["setA"]);

const constantTypeInfo = {
  0: "跳过双休",
  1: "跳过单休",
  2: "不跳过周末"
};

const leftTableDbClick = (row) => {
  emits("leftTableDbClick", row);
};
</script>

<style scoped lang="scss">
.search-ipt {
  display: flex;
  width: 140px;
  margin-right: 10px;
}

.select-user {
  display: flex;

  .left-tree {
    flex: 40%;
    height: 480px;
    overflow-y: auto;
  }

  .right-table {
    flex: 60%;
    overflow-y: auto;
    background-color: pink;
  }
}
</style>
