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
      <PureTableBar :columns="columns" @refresh="onFresh" style="padding-top: 0" @change-column="setUserMenuColumns" :show-icon="!isModal">
        <template #title>
          <BlendedSearch @tagSearch="handleTagSearch" :searchOptions="searchOptions" placeholder="物料编号" searchField="number" />
        </template>
        <template #buttons>
          <div>
            <ButtonList v-if="!isModal" moreActionText="业务操作" :buttonList="buttonList" :loadingStatus="loadingStatus" :auto-layout="false" />
          </div>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            ref="materialMainTable"
            border
            :height="tableHeight || maxHeight"
            :max-height="tableHeight || maxHeight"
            row-key="id"
            class="team-member"
            :adaptive="true"
            :row-style="rowStyle"
            align-whole="left"
            :loading="loading"
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
            @selection-change="onSelectionChange"
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
import { onMounted, ref } from "vue";
import { useTable } from "./config";
import { PureTableBar } from "@/components/RePureTableBar";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import ButtonList, { LoadingType } from "@/components/ButtonList/index.vue";
import { getMaterialGroupTreeData } from "@/api/plmManage";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

interface Props {
  /** 是否在弹窗中加载, 默认否 */
  isModal?: boolean;
  /** 表格高度 */
  tableHeight?: number;
  /** 产品库物料型号 */
  productCode?: string;
}

defineOptions({ name: "PlmManageBasicDataMaterialMgmtIndex" });
const emits = defineEmits(["selectRow"]);

const props = defineProps<Props>();

const {
  loading,
  dataList,
  columns,
  pagination,
  maxHeight,
  buttonList,
  curNodeName,
  materialMainTable,
  rowStyle,
  onFresh,
  dbClick,
  rowClick,
  handleSizeChange,
  handleCurrentChange,
  onSelectionChange,
  handleNodeClick,
  handleTagSearch
} = useTable(emits, props);

const categoryTreeData = ref([]);
const loadingStatus = ref<LoadingType>({ loading: false, text: "" });
const searchOptions: SearchOptionType[] = [
  { label: "物料名称", value: "name" },
  { label: "规格型号", value: "specification" },
  { label: "模号", value: "model" },
  { label: "日期范围", value: "date", type: "daterange", format: "YYYY-MM-DD" },
  {
    label: "物料状态",
    value: "state",
    children: [
      { label: "待提交", value: "0" },
      { label: "审核中", value: "1" },
      { label: "已审核", value: "2" },
      { label: "重新审核", value: "3" }
    ]
  },
  {
    label: "是否禁用",
    value: "isfrozen",
    children: [
      { label: "否", value: "0" },
      { label: "是", value: "1" }
    ]
  }
];

const getLeftTreeData = () => {
  getMaterialGroupTreeData({}).then((res: any) => {
    if (res.data) {
      categoryTreeData.value = res.data;
    }
  });
};

onMounted(() => {
  getLeftTreeData();
});
</script>

<style lang="scss" scoped>
.info-left-tree {
  width: 250px;
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
