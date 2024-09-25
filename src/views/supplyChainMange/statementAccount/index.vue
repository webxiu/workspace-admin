<!-- /*
 * @Author: Hailen 
 * @Date: 2023-09-05 08:52:07 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-09-05 08:52:07 
 */ -->

<script setup lang="ts">
import { useConfig, StateInfo } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "SupplyChainMangeStatementAccountIndex" });

const {
  tableRef,
  loading,
  columns,
  dataList,
  columns2,
  loading2,
  dataList2,
  maxHeight,
  pagination,
  buttonList,
  loadingStatus,
  searchOptions,
  onTagSearch,
  onSubmitStatement,
  onSubmitInvoice,
  onRefresh,
  onSizeChange,
  onPageCurrentChange,
  onCurrentChange
} = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <PureTableBar :columns="columns" @refresh="onRefresh" @change-column="setUserMenuColumns">
      <template #title>
        <BlendedSearch @tagSearch="onTagSearch" :searchOptions="searchOptions" placeholder="请输入供应商简称" searchField="shortName" />
      </template>
      <template #buttons>
        <ButtonList :buttonList="buttonList" :loadingStatus="loadingStatus" :autoLayout="false" more-action-text="业务操作" />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
          ref="tableRef"
          :height="maxHeight / 2"
          :max-height="maxHeight / 2"
          row-key="fbillno"
          class="statement-account"
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
          @page-size-change="onSizeChange"
          @page-current-change="onPageCurrentChange"
          @current-change="onCurrentChange"
          @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
        >
          <template #operation="{ row }">
            <el-button
              size="small"
              :type="[StateInfo.submit, StateInfo.reAudit].includes(row.statementOAVO?.billState) ? 'primary' : 'default'"
              :disabled="![StateInfo.submit, StateInfo.reAudit].includes(row.statementOAVO?.billState)"
              @click.stop="onSubmitStatement(row)"
            >
              提交对账单
            </el-button>
            <el-button
              size="small"
              :type="[StateInfo.submit, StateInfo.reAudit].includes(row.statementInvoiceOAVO?.billState) ? 'primary' : 'default'"
              :disabled="row.statementOAVO?.billState !== 2 || ![StateInfo.submit, StateInfo.reAudit].includes(row.statementInvoiceOAVO?.billState)"
              @click.stop="onSubmitInvoice(row)"
            >
              提交发票
            </el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
    <PureTableBar :columns="columns2" :showIcon="false">
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
          :height="maxHeight / 2"
          :max-height="maxHeight / 2"
          row-key="fmaterialid"
          class="statement-account-minor"
          :adaptive="true"
          align-whole="center"
          :loading="loading2"
          :size="size"
          :data="dataList2"
          :columns="dynamicColumns"
          :paginationSmall="size === 'small'"
          highlight-current-row
          :show-overflow-tooltip="true"
        />
      </template>
    </PureTableBar>
  </div>
</template>
<style lang="scss">
.statement-list {
  margin-right: 5px;
  margin-bottom: 4px;

  .el-link__inner {
    display: inline;
  }
}
</style>
