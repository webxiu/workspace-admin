<script setup lang="ts">
import { useConfig } from "./utils/hook";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "ProductMkCenterMaterialControlOweMaterialIndex" });

const {
  tableRef,
  columns,
  dataList,
  pagination,
  onSizeChange,
  onCurrentChange,
  maxHeight,
  dayBtnList,
  searchOptions,
  clickDayBtn,
  formData,
  buttonList,
  onRefresh,
  onTagSearch
} = useConfig();
</script>

<template>
  <div class="flex-col flex-1 ui-h-100 ui-ov-h main main-content">
    <PureTableBar :columns="columns" @refresh="onRefresh" @change-column="setUserMenuColumns">
      <template #title>
        <BlendedSearch @tagSearch="onTagSearch" :searchOptions="searchOptions" placeholder="子物料编码" searchField="materialNumber" />
        <el-space :size="6">
          <el-button
            v-for="item in dayBtnList"
            :key="item.key"
            :color="item.key === formData.day ? '#409EFF' : ''"
            type="primary"
            :style="{ color: item.key === formData.day ? '#fff' : '' }"
            :plain="item.key !== formData.day"
            @click="() => clickDayBtn(item)"
            >{{ item.title }}</el-button
          >
        </el-space>
      </template>
      <template #buttons>
        <ButtonList :buttonList="buttonList" :auto-layout="false" />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          ref="tableRef"
          border
          :height="maxHeight"
          :max-height="maxHeight"
          row-key="FBILLNO"
          :adaptive="true"
          align-whole="center"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          highlight-current-row
          :show-overflow-tooltip="true"
          @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
          :pagination="pagination"
          :paginationSmall="size === 'small'"
          @page-size-change="onSizeChange"
          @page-current-change="onCurrentChange"
        />
      </template>
    </PureTableBar>
  </div>
</template>
