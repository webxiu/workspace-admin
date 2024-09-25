<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useConfig } from "./utils/hook";
import { ref } from "vue";
import { fixed2AndAddcomma } from "@/utils/common";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "BusinessCenterProdAndOrderIndex" });

const { loading, columns, dataList, maxHeight, buttonList, onRefresh, onCurrentChange } = useConfig();

const orderMoney = ref("");
const totalMoney = ref("");

const getSummaries = (param) => {
  const { columns, data } = param;
  const sums: string[] = [];
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = "合计";
      return;
    }

    if (["saleOutRate", "saleInRqte"].includes(column.property)) {
      sums[index] = "";
      return;
    }

    const values = data.map((item) => Number(item[column.property]));
    if (!values.every((value) => Number.isNaN(value)) && index > 2) {
      const curTotal = values.reduce((prev, curr) => {
        const value = Number(curr);
        if (!Number.isNaN(value)) {
          return prev + curr;
        } else {
          return 0;
        }
      }, 0);

      if (column.property === "saleAmount") {
        orderMoney.value = curTotal;
      }

      if (column.property === "outAmountTotal") {
        totalMoney.value = curTotal;
      }
      sums[index] = ["saleAmount", "outAmountBefore", "outAmount", "outAmountTotal"].includes(column.property)
        ? fixed2AndAddcomma(curTotal)
        : Number(curTotal).toLocaleString();
    } else {
      sums[index] = "";
    }
  });

  return sums;
};

const tableRowClassName = ({ _, rowIndex }) => (rowIndex % 2 === 0 ? "success-row" : "");
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <PureTableBar :columns="columns" class="flex-1" @refresh="onRefresh" @change-column="setUserMenuColumns">
      <template #title>
        <div
          style="width: 100%; margin-bottom: 10px; font-size: 40px; font-weight: 800; color: red; text-align: center"
          v-if="!isNaN(+totalMoney / +orderMoney)"
        >
          本期销售达成率：{{ ((+totalMoney / +orderMoney) * 100).toFixed(2) + "%" }}
        </div>
      </template>
      <template #buttons>
        <ButtonList :buttonList="buttonList" :auto-layout="false" moreActionText="业务操作" />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
          id="businessId"
          :height="maxHeight"
          :max-height="maxHeight"
          row-key="id"
          class="prod-order not-ellipsis"
          :adaptive="true"
          align-whole="left"
          :row-class-name="tableRowClassName"
          :loading="loading"
          :size="size"
          :data="dataList"
          :summary-method="getSummaries"
          show-summary
          :columns="dynamicColumns"
          :paginationSmall="size === 'small'"
          highlight-current-row
          :show-overflow-tooltip="true"
          @current-change="onCurrentChange"
          @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
        >
          <template #fGiveaway="{ row }">
            {{ row.fGiveaway == "0" ? "否" : "是" }}
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<style lang="scss">
.success-row {
  background-color: #f0f2f5 !important;
}
</style>
