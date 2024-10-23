<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useConfig } from "./utils/hook";
import ButtonList from "@/components/ButtonList/index.vue";
import { fixed2AndAddcomma } from "@/utils/common";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "OaFinanceDeptPayrollMgmtPayslipIndex" });

const {
  tableRef,
  columns,
  dataList,
  loading,
  showSign,
  maxHeight,
  searchOptions,
  queryParams,
  loadingStatus,
  buttonList,
  onView,
  onShowSign,
  onRefresh,
  onRowClick,
  handleTagSearch,
  onChangeFileInput,
  handleSelectionChange
} = useConfig();

const baseApi = import.meta.env.VITE_BASE_API;

const getSummaries = (param) => {
  const { columns, data } = param;
  const sums: string[] = [];
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = "合计";
      return;
    }

    if (["SFZ", "GH", undefined].includes(column.property)) {
      sums[index] = "";
      return;
    }

    const values = data.map((item) => Number(item[column.property]));
    if (!values.every((value) => Number.isNaN(value))) {
      const curTotal = values.reduce((prev, curr) => {
        const value = Number(curr);
        if (!Number.isNaN(value)) {
          return prev + curr;
        } else {
          return 0;
        }
      }, 0);
      sums[index] = fixed2AndAddcomma(curTotal);
    } else {
      sums[index] = "";
    }
  });

  return sums;
};
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <PureTableBar :columns="columns" class="flex-1" @refresh="onRefresh" @change-column="setUserMenuColumns">
      <template #title>
        <BlendedSearch
          @tagSearch="handleTagSearch"
          :searchOptions="searchOptions"
          :queryParams="queryParams"
          :immediate="false"
          placeholder="请输入姓名"
          searchField="userName"
        />
        <el-switch v-model="showSign" inline-prompt active-text="隐藏签名" inactive-text="显示签名" @change="onShowSign" />
      </template>
      <template #buttons>
        <ButtonList :buttonList="buttonList" :loadingStatus="loadingStatus" more-action-text="业务操作" :autoLayout="false" />
        <input style="display: none" type="file" accept=".xls,.xlsx" id="imporMoneyImportInput" @change="onChangeFileInput" />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
          ref="tableRef"
          :height="maxHeight"
          :max-height="maxHeight"
          :summary-method="getSummaries"
          show-summary
          row-key="id"
          class="bill-manage"
          :adaptive="true"
          align-whole="left"
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          @row-dblclick="onView"
          highlight-current-row
          :show-overflow-tooltip="true"
          @row-click="onRowClick"
          @selection-change="handleSelectionChange"
          @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
        >
          <template #signatureFilePath="{ row }">
            <div class="wrap-img-money">
              <el-image
                alt="加载失败"
                v-if="row.signatureFilePath"
                style="width: 60px; height: 20px"
                :src="baseApi + row.signatureFilePath"
                :zoom-rate="1.2"
                :max-scale="7"
                :min-scale="0.2"
                preview-teleported
                :preview-src-list="[baseApi + row.signatureFilePath]"
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

<style scoped>
.wrap-img-money {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
