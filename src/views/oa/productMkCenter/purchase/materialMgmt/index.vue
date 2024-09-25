<template>
  <Row>
    <Col :xs="24" :sm="24" :md="4" :lg="4" :xl="4">
      <div class="info-left-tree border-line">
        <el-tree
          :data="categoryTreeData"
          node-key="id"
          :default-expanded-keys="['0']"
          :current-node-key="curNodeName"
          accordion
          :expand-on-click-node="false"
          highlight-current
          :props="{ children: 'children', label: 'title' }"
          @node-click="handleNodeClick"
        />
      </div>
    </Col>
    <Col :xs="24" :sm="24" :md="20" :lg="20" :xl="20">
      <div class="flex-1 ui-ov-h main ui-h-100 ui-w-100">
        <PureTableBar :columns="columns" @refresh="onFresh" @change-column="setUserMenuColumns">
          <template #title>
            <BlendedSearch @tagSearch="handleTagSearch" :searchOptions="searchOptions" placeholder="物料编号" searchField="number" />
          </template>
          <template #buttons>
            <div>
              <ButtonList moreActionText="更多操作" :buttonList="buttonList" :auto-layout="false" />
            </div>
          </template>
          <template v-slot="{ size, dynamicColumns }">
            <pure-table
              ref="materialMainTable"
              border
              :height="maxHeight"
              :max-height="maxHeight"
              row-key="id"
              :adaptive="true"
              align-whole="left"
              :size="size"
              :data="dataList"
              :columns="dynamicColumns"
              :pagination="pagination"
              :paginationSmall="size === 'small' ? true : false"
              show-overflow-tooltip
              highlight-current-row
              @row-click="rowClick"
              @row-dblclick="dbClick"
              @page-size-change="handleSizeChange"
              @page-current-change="handleCurrentChange"
              @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
            >
              <template #pushState="{ row }">
                {{ row.pushState == 1 ? "已下推" : "待下推" }}
              </template>
              <template #cbcertification="{ row }">
                {{ row.cbcertification == 1 ? "是" : "否" }}
              </template>
              <template #isfrozen="{ row }">
                {{ row.isfrozen == 1 ? "是" : "否" }}
              </template>
              <template #fixedBeforeMag="{ row }">
                {{ row.materialOtherVO?.fFixLeadTime ?? "" }}
              </template>
              <template #fixedBeforeMagUnit="{ row }">
                {{ row.materialOtherVO?.fFixLeadTimeType ?? "" }}
              </template>
              <template #changeBeforeMag="{ row }">
                {{ row.materialOtherVO?.fVarLeadTime ?? "" }}
              </template>
              <template #changeBeforeMagUnit="{ row }">
                {{ row.materialOtherVO?.fVarLeadTimeType ?? "" }}
              </template>
              <template #checkBeforeMag="{ row }">
                {{ row.materialOtherVO?.fCheckLeadTime ?? "" }}
              </template>
              <template #checkBeforeMagUnit="{ row }">
                {{ row.materialOtherVO?.fCheckLeadTimeType ?? "" }}
              </template>
              <template #totalBeforeMag="{ row }">
                {{ row.materialOtherVO?.fAccuLeadTime ?? "" }}
              </template>
              <template #maxOrderCount="{ row }">
                {{ row.materialOtherVO?.fMaxPOQty ?? "" }}
              </template>
              <template #minOrderCount="{ row }">
                {{ row.materialOtherVO?.fMinPOQty ?? "" }}
              </template>
              <template #minPackageCount="{ row }">
                {{ row.materialOtherVO?.fIncreaseQty ?? "" }}
              </template>
              <template #safeStockCount="{ row }">
                {{ row.materialOtherVO?.fPlanSafeStockQty ?? "" }}
              </template>
            </pure-table>
          </template>
        </PureTableBar>
      </div>
    </Col>
  </Row>
</template>
<script setup lang="ts">
import { useTable } from "./hooks";
import { PureTableBar } from "@/components/RePureTableBar";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";
defineOptions({ name: "OaProductMkCenterPurchaseMaterialMgmtIndex" });

const {
  dataList,
  columns,
  searchOptions,
  pagination,
  maxHeight,
  buttonList,
  curNodeName,
  materialMainTable,
  onFresh,
  dbClick,
  categoryTreeData,
  rowClick,
  handleSizeChange,
  handleCurrentChange,
  handleNodeClick,
  handleTagSearch
} = useTable();
</script>

<style lang="scss">
.modal-class .el-form-item {
  margin-bottom: 0 !important;
}
.info-left-tree {
  height: 100%;
  padding: 15px 40px 15px 10px;
}
</style>
