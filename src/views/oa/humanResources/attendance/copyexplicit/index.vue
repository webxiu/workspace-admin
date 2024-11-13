<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="flex flex-1 ui-h-100 ui-w-100 ui-ov-h">
      <PureTableBar :columns="columns" @refresh="onFresh" @change-column="setUserMenuColumns">
        <template #title>
          <BlendedSearch @tagSearch="handleTagSearch" :queryParams="queryParams" :searchOptions="searchOptions" placeholder="姓名" searchField="staffName" />
        </template>
        <template #buttons />
        <template v-slot="{ size, dynamicColumns }">
          <div style="display: flex; justify-content: space-between">
            <div style="width: 70%">
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
                @row-click="leftRowClick"
                :row-class-name="rowClassName"
                @row-dblclick="rowDbClick"
                @page-size-change="onSizeChange"
                @page-current-change="onCurrentChange"
                @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
              >
                <template #setMorningStart="{ row }">
                  <el-space style="display: flex; align-items: center" v-if="row">
                    <el-button
                      @click="() => onSetTimeValue(row, 'morningWorkTime')"
                      size="small"
                      type="primary"
                      :icon="Setting"
                      style="width: 10px; height: 20px"
                    />
                    <el-button @click="() => (row.morningWorkTime = null)" size="small" type="danger" :icon="Delete" style="width: 10px; height: 20px" />
                  </el-space>
                  <span v-else />
                </template>
                <template #setMorningEnd="{ row }">
                  <el-space style="display: flex; align-items: center" v-if="row">
                    <el-button
                      @click="() => onSetTimeValue(row, 'morningDownWorkTime')"
                      size="small"
                      type="primary"
                      :icon="Setting"
                      style="width: 10px; height: 20px"
                    />
                    <el-button
                      @click="() => (row.morningDownWorkTime = null)"
                      size="small"
                      type="danger"
                      :icon="Delete"
                      style="width: 10px; height: 20px"
                    /> </el-space
                  ><span v-else />
                </template>
                <template #setAfternoonStart="{ row }">
                  <el-space style="display: flex; align-items: center" v-if="row">
                    <el-button
                      @click="() => onSetTimeValue(row, 'afternoonWorkTime')"
                      size="small"
                      type="primary"
                      :icon="Setting"
                      style="width: 10px; height: 20px"
                    />
                    <el-button @click="() => (row.afternoonWorkTime = null)" size="small" type="danger" :icon="Delete" style="width: 10px; height: 20px" />
                  </el-space>
                  <span v-else />
                </template>
                <template #setAfternoonEnd="{ row }">
                  <el-space style="display: flex; align-items: center" v-if="row">
                    <el-button
                      @click="() => onSetTimeValue(row, 'afternoonDownWorkTime')"
                      size="small"
                      type="primary"
                      :icon="Setting"
                      style="width: 10px; height: 20px"
                    />
                    <el-button @click="() => (row.afternoonDownWorkTime = null)" size="small" type="danger" :icon="Delete" style="width: 10px; height: 20px" />
                  </el-space>
                  <span v-else />
                </template>
                <template #setNightStart="{ row }">
                  <el-space style="display: flex; align-items: center" v-if="row">
                    <el-button @click="() => onSetTimeValue(row, 'nightStart')" size="small" type="primary" :icon="Setting" style="width: 10px; height: 20px" />
                    <el-button @click="() => (row.nightStart = null)" size="small" type="danger" :icon="Delete" style="width: 10px; height: 20px" />
                  </el-space>
                  <span v-else />
                </template>
                <template #setNightEnd="{ row }">
                  <el-space style="display: flex; align-items: center" v-if="row">
                    <el-button @click="() => onSetTimeValue(row, 'nightEnd')" size="small" type="primary" :icon="Setting" style="width: 10px; height: 20px" />
                    <el-button @click="() => (row.nightEnd = null)" size="small" type="danger" :icon="Delete" style="width: 10px; height: 20px" />
                  </el-space>
                  <span v-else />
                </template>
              </pure-table>
            </div>
            <div style="width: 29%"><RightTables ref="rightTableRef" /></div>
          </div>
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
import RightTables from "./rightTables.vue";
import { Setting, Delete } from "@element-plus/icons-vue";

defineOptions({ name: "CopyOaHumanResourcesAttendanceExplicitIndex" });

const {
  columns,
  onFresh,
  rightTableRef,
  handleTagSearch,
  searchOptions,
  rowDbClick,
  leftRowClick,
  rowClassName,
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
