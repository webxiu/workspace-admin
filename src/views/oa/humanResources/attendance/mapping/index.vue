<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="flex flex-1 ui-h-100 ui-w-100 ui-ov-h">
      <PureTableBar :columns="columns" @refresh="onFresh" @change-column="setUserMenuColumns">
        <template #title>
          <BlendedSearch @tagSearch="handleTagSearch" :searchOptions="searchOptions" placeholder="姓名" searchField="staffName" />
        </template>
        <template #buttons>
          <ButtonList :buttonList="buttonList" :autoLayout="false" more-action-text="业务操作" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <div style="display: flex">
            <div>
              <pure-table
                border
                :height="maxHeight"
                :max-height="maxHeight"
                row-key="id"
                :adaptive="true"
                align-whole="center"
                :size="size"
                :data="dataList1"
                :columns="columns1"
                :pagination="pagination"
                :paginationSmall="size === 'small'"
                highlight-current-row
                :show-overflow-tooltip="true"
                @row-click="rowClick2"
                @page-size-change="onSizeChange"
                @page-current-change="onCurrentChange"
              />
            </div>
            <div style="margin: 0 16px">
              <pure-table
                border
                :height="maxHeight"
                :max-height="maxHeight"
                row-key="id"
                class="mapping-table"
                id="mappingTableId"
                :adaptive="true"
                align-whole="center"
                :loading="loading"
                :size="size"
                :data="dataList"
                :columns="dynamicColumns"
                highlight-current-row
                :show-overflow-tooltip="true"
                @row-click="rowClick"
                @row-dblclick="rowDbclick"
                @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
              />
            </div>
            <div class="block">
              <el-image>
                <template #error>
                  <div class="image-slot">
                    <el-icon><icon-picture /></el-icon>
                  </div>
                </template>
              </el-image>
            </div>
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
import { Picture as IconPicture } from "@element-plus/icons-vue";

defineOptions({ name: "OaHumanResourcesAttendanceMappingIndex" });

const {
  columns,
  columns1,
  onFresh,
  handleTagSearch,
  searchOptions,
  buttonList,
  rowDbclick,
  rowClick,
  maxHeight,
  loading,
  dataList,
  dataList1,
  rowClick2,
  pagination,
  onSizeChange,
  onCurrentChange
} = useMachine();
</script>

<style scoped>
.block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  display: inline-block;
  width: 49%;
  box-sizing: border-box;
  vertical-align: top;
}

.el-image {
  padding: 0 5px;
  max-width: 200px;
  max-height: 300px;
  width: 100%;
  height: 200px;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 30px;
}
.image-slot .el-icon {
  font-size: 30px;
}
</style>
