<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useConfig } from "./utils/hook";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

interface Props {
  /** 是否在弹窗中加载, 默认否 */
  isModal?: boolean;
  /** 表格高度 */
  tableHeight?: number;
}

defineOptions({ name: "PlmManageProjectMgmtProductStoreIndex" });
const props = defineProps<Props>();
const emits = defineEmits(["selectRow"]);

const {
  loading,
  columns,
  dataList,
  rowDbClick,
  rowClick,
  maxHeight,
  buttonList,
  handleSizeChange,
  handleCurrentChange,
  onCurrentChange,
  searchOptions,
  onFresh,
  getMergeImgUlrList,
  pagination,
  handleTagSearch
} = useConfig(emits, props.isModal);
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <PureTableBar :columns="columns" class="flex-1" @refresh="onFresh" @change-column="setUserMenuColumns" :show-icon="!isModal">
      <template #title>
        <BlendedSearch @tagSearch="handleTagSearch" :searchOptions="searchOptions" placeholder="产品型号" searchField="productCode" />
      </template>
      <template #buttons>
        <ButtonList v-if="!isModal" :buttonList="buttonList" :auto-layout="false" moreActionText="业务操作" />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
          id="productStoreTableId"
          :height="tableHeight || maxHeight"
          :max-height="tableHeight || maxHeight"
          row-key="id"
          :adaptive="true"
          align-whole="left"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :paginationSmall="size === 'small'"
          :pagination="pagination"
          :show-overflow-tooltip="true"
          :loading="loading"
          highlight-current-row
          @current-change="onCurrentChange"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
          @row-dblclick="rowDbClick"
          @row-click="rowClick"
          @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
        >
          <template #productImgs="{ row }">
            <div class="wrap-img-prod">
              <el-image
                v-if="row.pmProductImageVOS?.length"
                style="width: 40px; height: 20px"
                :src="getMergeImgUlrList(row.pmProductImageVOS, 'first')"
                :zoom-rate="1.2"
                :max-scale="7"
                :min-scale="0.2"
                preview-teleported
                :preview-src-list="getMergeImgUlrList(row.pmProductImageVOS, null)"
                :initial-index="4"
                fit="cover"
              />
              <div v-else />
            </div>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<style scoped lang="scss">
.wrap-img-prod {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
