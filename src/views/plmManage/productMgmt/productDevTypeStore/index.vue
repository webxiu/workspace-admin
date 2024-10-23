<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useConfig } from "./utils/hook";
import { onMounted, ref } from "vue";
import { getProductClassifyList } from "@/views/plmManage/productMgmt/classify/utils/hook";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "PlmManageProjectMgmtProductDevTypeStoreIndex" });

const {
  columns,
  columns2,
  dataList,
  rightRowClick,
  dataList2,
  buttonList,
  loading,
  loading2,
  maxHeight,
  buttonList2,
  onSearch,
  rowClassName,
  onFresh,
  onAdd,
  onAdd2,
  onEdit,
  onDelete2,
  leftRowDbClick
} = useConfig();

const options = ref([]);

const getOptionList = () => {
  getProductClassifyList({ page: 1, limit: 10000 }).then((data) => (options.value = data));
};

const rowStyle = () => {
  return {
    cursor: "pointer"
  };
};

onMounted(() => {
  getOptionList();
});
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <PureTableBar :columns="columns" class="flex-1" @refresh="onFresh" @change-column="setUserMenuColumns">
      <template #title>
        <div>
          <ButtonList :buttonList="buttonList" :auto-layout="false" moreActionText="类型操作" />
        </div>
      </template>
      <template #buttons>
        <ButtonList :buttonList="buttonList2" :auto-layout="false" moreActionText="值操作" />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <div style="display: flex; width: 100%">
          <div style="width: 60%">
            <pure-table
              border
              :height="maxHeight"
              :max-height="maxHeight"
              row-key="tableId"
              class="bill-manage"
              :adaptive="true"
              align-whole="left"
              :loading="loading"
              :size="size"
              :data="dataList"
              :columns="dynamicColumns"
              :row-style="rowStyle"
              highlight-current-row
              :show-overflow-tooltip="true"
              @row-click="leftRowDbClick"
              :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
              @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
            />
          </div>
          <div style="width: 1%" />
          <div style="width: 39%">
            <pure-table
              border
              :height="maxHeight"
              :max-height="maxHeight"
              row-key="id"
              class="pm-value-table"
              :row-class-name="rowClassName"
              :adaptive="true"
              align-whole="left"
              :loading="loading2"
              :size="size"
              :data="dataList2"
              :columns="columns2"
              highlight-current-row
              @row-click="rightRowClick"
              :show-overflow-tooltip="true"
            />
          </div>
        </div>
      </template>
    </PureTableBar>
  </div>
</template>
