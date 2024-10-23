<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useConfig } from "./utils/hook";
import ButtonList from "@/components/ButtonList/index.vue";

defineOptions({ name: "OaProductMkCenterPurchaseQualityCustomerComplaintIndex" });

const {
  columns,
  dataList,
  buttonList,
  handleTagSearch,
  pagination,
  handleSizeChange,
  handleCurrentChange,
  searchOptions,
  rowClick,
  onChangeFileInput,
  getMergeImgUlrList,
  maxHeight
} = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="flex flex-1 ui-h-100 ui-w-100 ui-ov-h">
      <PureTableBar :columns="columns" :showIcon="false">
        <template #title>
          <BlendedSearch @tagSearch="handleTagSearch" :searchOptions="searchOptions" placeholder="客户名称" searchField="customerName" />
        </template>
        <template #buttons>
          <div>
            <ButtonList :buttonList="buttonList" :autoLayout="false" more-action-text="更多操作" />
            <input style="display: none" type="file" accept=".xls,.xlsx" id="importQCCCInput" @change="onChangeFileInput" />
          </div>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="id"
            class="qc-cc"
            :adaptive="true"
            align-whole="left"
            :size="size"
            :data="dataList"
            @row-click="rowClick"
            :columns="dynamicColumns"
            :paginationSmall="size === 'small'"
            :pagination="pagination"
            @page-size-change="handleSizeChange"
            @page-current-change="handleCurrentChange"
            highlight-current-row
            :default-expand-all="false"
            :show-overflow-tooltip="true"
          >
            <template #defectImageList="{ row }">
              <div class="wrap-img">
                <el-image
                  v-if="row.defectImageList?.length"
                  style="width: 40px; height: 20px"
                  :src="getMergeImgUlrList(row.defectImageList, 'first')"
                  :zoom-rate="1.2"
                  :max-scale="7"
                  :min-scale="0.2"
                  preview-teleported
                  :preview-src-list="getMergeImgUlrList(row.defectImageList, null)"
                  :initial-index="4"
                  fit="cover"
                />
                <div v-else />
              </div>
            </template>

            <template #analysisImageList="{ row }">
              <div class="wrap-img">
                <el-image
                  v-if="row.analysisImageList?.length"
                  style="width: 24px; height: 24px"
                  :src="getMergeImgUlrList(row.analysisImageList, 'first')"
                  :zoom-rate="1.2"
                  :max-scale="7"
                  :min-scale="0.2"
                  preview-teleported
                  :preview-src-list="getMergeImgUlrList(row.analysisImageList, null)"
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
  </div>
</template>
<style lang="scss">
.qc-cc-modal {
  .el-form-item--small {
    margin-bottom: 8px !important;
  }
}

.wrap-img {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
