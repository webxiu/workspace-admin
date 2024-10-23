<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="flex flex-1 ui-h-100 ui-w-100 ui-ov-h">
      <PureTableBar :columns="columns" @refresh="onFresh" @change-column="setUserMenuColumns">
        <template #title>
          <BlendedSearch @tagSearch="handleTagSearch" :queryParams="queryParams" :searchOptions="searchOptions" placeholder="姓名" searchField="staffName" />
        </template>
        <template #buttons>
          <ButtonList :buttonList="buttonList" :autoLayout="false" more-action-text="业务操作" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="id"
            class="machine-table"
            id="machineTableId"
            :adaptive="true"
            align-whole="center"
            :loading="loading"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            :pagination="pagination"
            :paginationSmall="size === 'small'"
            highlight-current-row
            :show-overflow-tooltip="true"
            @row-dblclick="rowDbClick"
            @page-size-change="onSizeChange"
            @page-current-change="onCurrentChange"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
          >
            <template #setMorningStart="{ row }">
              <el-space>
                <el-button size="small" @click="() => onSetTimeValue(row, 'morningWorkTime')">设置</el-button>
                <el-button size="small" @click="() => (row.morningWorkTime = null)">清空</el-button>
              </el-space>
            </template>
            <template #setMorningEnd="{ row }">
              <el-space>
                <el-button size="small" @click="() => onSetTimeValue(row, 'morningDownWorkTime')">设置</el-button>
                <el-button size="small" @click="() => (row.morningDownWorkTime = null)">清空</el-button>
              </el-space>
            </template>
            <template #setAfternoonStart="{ row }">
              <el-space>
                <el-button size="small" @click="() => onSetTimeValue(row, 'afternoonWorkTime')">设置</el-button>
                <el-button size="small" @click="() => (row.afternoonWorkTime = null)">清空</el-button>
              </el-space>
            </template>
            <template #setAfternoonEnd="{ row }">
              <el-space>
                <el-button size="small" @click="() => onSetTimeValue(row, 'afternoonDownWorkTime')">设置</el-button>
                <el-button size="small" @click="() => (row.afternoonDownWorkTime = null)">清空</el-button>
              </el-space>
            </template>
            <template #setNightStart="{ row }">
              <el-space>
                <el-button size="small" @click="() => onSetTimeValue(row, 'nightStart')">设置</el-button>
                <el-button size="small" @click="() => (row.nightStart = null)">清空</el-button>
              </el-space>
            </template>
            <template #setNightEnd="{ row }">
              <el-space>
                <el-button size="small" @click="() => onSetTimeValue(row, 'nightEnd')">设置</el-button>
                <el-button size="small" @click="() => (row.nightEnd = null)">清空</el-button>
              </el-space>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMachine } from "./hook";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";
import { PureTableBar } from "@/components/RePureTableBar";
import ButtonList from "@/components/ButtonList/index.vue";

defineOptions({ name: "OaHumanResourcesAttendanceExplicitIndex" });

const {
  columns,
  onFresh,
  handleTagSearch,
  searchOptions,
  rowDbClick,
  buttonList,
  maxHeight,
  loading,
  dataList,
  queryParams,
  pagination,
  onSetTimeValue,
  onSizeChange,
  onCurrentChange
} = useMachine();
</script>

<style scoped>
:deep(.el-input-group__prepend) {
  padding: 0 5px;
  cursor: pointer;
}
</style>
