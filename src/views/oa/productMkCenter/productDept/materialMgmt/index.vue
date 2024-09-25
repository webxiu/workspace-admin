<template>
  <div class="main flex ui-h-100">
    <div class="info-left-tree border-line">
      <el-tree
        :data="categoryTreeData"
        node-key="id"
        :default-expanded-keys="['0']"
        :current-node-key="curNodeName"
        accordion
        :expand-on-click-node="false"
        highlight-current
        :props="{
          children: 'children',
          label: 'title'
        }"
        @node-click="handleNodeClick"
      />
    </div>
    <div class="flex-1 ui-ov-h">
      <PureTableBar :columns="columns" @refresh="onFresh" style="padding-top: 0" @change-column="setUserMenuColumns">
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
            class="team-member"
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

            <template #dailyProduction="{ row }">
              {{ row.materialOtherVO?.fDailyOutQty ?? "" }}
            </template>
            <template #standardPeople="{ row }">
              {{ row.materialOtherVO?.fDegStandardPersonCount ?? "" }}
            </template>
            <template #standardCapacity="{ row }">
              {{ row.materialOtherVO?.fDegCapacity ?? "" }}
            </template>
            <template #standardWorkTime="{ row }">
              {{ row.materialOtherVO?.fPerUnitStandHour ?? "" }}
            </template>
            <template #standardWorkTimeUnit="{ row }">
              {{ row.materialOtherVO?.fStandHourUnitId ?? "" }}
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useTable } from "./hooks";
import { PureTableBar } from "@/components/RePureTableBar";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "OaProductMkCenterProductDeptMaterialMgmtIndex" });

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
  width: 250px;
  padding: 10px 15px;
  overflow-y: auto;
}
</style>
