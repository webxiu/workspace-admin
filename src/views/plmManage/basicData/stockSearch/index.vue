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
          <BlendedSearch @tagSearch="handleTagSearch" :searchOptions="searchOptions" placeholder="物料编码" searchField="number" />
        </template>
        <template #buttons>
          <ButtonList :buttonList="buttonList" :auto-layout="false" moreActionText="业务操作" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            @row-click="rowClick"
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="id"
            class="team-member"
            :adaptive="true"
            align-whole="left"
            :loading="loading"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            :pagination="pagination"
            :paginationSmall="size === 'small' ? true : false"
            show-overflow-tooltip
            highlight-current-row
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
          </pure-table>
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useTable } from "./config";
import { PureTableBar } from "@/components/RePureTableBar";
import ButtonList from "@/components/ButtonList/index.vue";
import { fetchSearchSelectStockList, getMaterialGroupTreeData } from "@/api/plmManage";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "PlmManageBasicDataStockSearchIndex" });

const {
  loading,
  dataList,
  columns,
  pagination,
  maxHeight,
  onFresh,
  rowClick,
  buttonList,
  handleSizeChange,
  handleCurrentChange,
  handleNodeClick,
  handleTagSearch,
  curNodeName
} = useTable();

const categoryTreeData = ref([]);

const stockList = ref([]);

const searchOptions = reactive([
  { label: "物料名称", value: "name" },
  { label: "仓库", value: "stockNoLineName", children: [] }
]);

const getLeftGroup = () => {
  getMaterialGroupTreeData({}).then((res: any) => {
    if (res.data) {
      categoryTreeData.value = res.data;
    }
  });
};

const getSelectStockOptionList = () => {
  fetchSearchSelectStockList({}).then((res: any) => {
    if (res.data) {
      stockList.value = res.data;
      searchOptions[1].children = res.data.map((item) => ({ label: item.fname, value: item.fnumber + "-" + item.fname }));
    }
  });
};

onMounted(() => {
  getSelectStockOptionList();
  getLeftGroup();
});
</script>

<style lang="scss" scoped>
.info-left-tree {
  width: 250px;
  height: calc(100vh - 179.5px);
  padding: 10px 15px;
  overflow-y: auto;
}

.custom-tree-node {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  padding-right: 8px;
  font-size: 14px;
}
</style>
