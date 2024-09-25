<template>
  <div class="select-user">
    <div class="right-table">
      <PureTableBar :columns="columns2" :showIcon="true" @refresh="onFresh2" style="padding-top: 0" @change-column="setUserMenuColumns">
        <template #title>
          <!-- <div style="display: flex; flex: 1; justify-content: space-between">
            <div class="search-ipt">
              <el-input :prefix-icon="Search" @keyup.enter="btnClickSearch" v-model="searchParams.holidayName" placeholder="请输入假日名称" />
            </div>
          </div> -->
          <BlendedSearch @tagSearch="handleTagSearch" :searchOptions="searchOptions" placeholder="假日名称" searchField="holidayName" />
        </template>
        <template #buttons>
          <div>
            <ButtonList moreActionText="更多操作" :buttonList="buttonList2" :auto-layout="false" />
            <input style="display: none" type="file" accept=".xls,.xlsx" id="importHolidayId" @change="onChangeHolidayInput" />
          </div>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            @row-click="rowClick"
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
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns2)"
          >
            <template #skipWeekend="{ row }">
              {{ row.skipWeekend ? "是" : "否" }}
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
import { Search } from "@element-plus/icons-vue";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

import { PureTableBar } from "@/components/RePureTableBar";
import { useEleHeight } from "@/hooks";
defineProps(["leftRow"]);

const {
  columns2,
  dataList,
  loading,
  onSearch,
  onFresh2,
  setCurLeftRow,
  rowClick,
  onChangeHolidayInput,
  handleTagSearch,
  searchOptions,
  buttonList2,
  setLoading,
  setList
} = useBankTable();
const maxHeight = useEleHeight(".app-main > .el-scrollbar", 40);

// const searchParams = reactive({ holidayName: "" });

// const btnClickSearch = () => onSearch({ ...searchParams });

defineExpose({ setList, setLoading, setCurLeftRow });
</script>

<style scoped lang="scss">
.search-ipt {
  display: flex;
  width: 160px;
  margin-right: 20px;
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
