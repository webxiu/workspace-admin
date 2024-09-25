<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useConfig } from "./utils/hook";
import { onMounted, ref } from "vue";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";
import { getProductClassifyList } from "@/views/plmManage/productMgmt/classify/utils/hook";

defineOptions({ name: "PlmManageProjectMgmtDeliveryTemplateMgmtIndex" });

const {
  columns,
  columns2,
  dataList,
  dataList2,
  loading,
  loading2,
  maxHeight,
  pagination,
  searchOptions,
  onSearch,
  onAdd,
  onFresh,
  onEdit,
  onDelete,
  onExport,
  handleTagSearch,
  onCurrentChange,
  handleSizeChange,
  leftRowDbClick,
  buttonList,
  removeTag,
  leftRowClick,
  handleCurrentChange,
  productCategoryIdList
} = useConfig();

const options = ref([]);

const getOptionList = () => {
  getProductClassifyList({ page: 1, limit: 10000 }).then((data) => {
    searchOptions[1].children = data;
    options.value = data;
  });
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
        <BlendedSearch @tagSearch="handleTagSearch" :searchOptions="searchOptions" placeholder="交付物编码" searchField="number" />
      </template>
      <template #buttons>
        <ButtonList moreActionText="业务操作" :buttonList="buttonList" :auto-layout="false" />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <div style="display: flex; width: 100%">
          <div style="width: 60%">
            <pure-table
              border
              :height="maxHeight"
              :max-height="maxHeight"
              row-key="id"
              class="bill-manage"
              :adaptive="true"
              align-whole="left"
              :loading="loading"
              :size="size"
              :data="dataList"
              :columns="dynamicColumns"
              :row-style="rowStyle"
              :paginationSmall="size === 'small'"
              highlight-current-row
              :show-overflow-tooltip="true"
              :pagination="pagination"
              @row-dblclick="leftRowDbClick"
              @row-click="leftRowClick"
              @current-change="onCurrentChange"
              @page-size-change="handleSizeChange"
              @page-current-change="handleCurrentChange"
              @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
            >
              <template #choice>
                <el-radio label="&nbsp;" size="small" />
              </template>
            </pure-table>
          </div>
          <div style="width: 1%" />
          <div style="width: 39%">
            <pure-table
              border
              :height="maxHeight"
              :max-height="maxHeight"
              row-key="id"
              class="bill-manage"
              :adaptive="true"
              align-whole="left"
              :loading="loading2"
              :size="size"
              :data="dataList2"
              :columns="columns2"
              highlight-current-row
              :show-overflow-tooltip="true"
            >
              <template #operation>
                <el-button type="success" size="small" color="#009688">查看模板</el-button>
              </template>
            </pure-table>
          </div>
        </div>
      </template>
    </PureTableBar>
  </div>
</template>
