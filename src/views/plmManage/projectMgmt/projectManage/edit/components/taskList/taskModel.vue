<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { onMounted, reactive, ref } from "vue";
import { type PaginationProps } from "@pureadmin/table";
import { PAGE_CONFIG } from "@/config/constant";
import { setColumn, usePageSelect } from "@/utils/table";
import { fetchTaskStoreList } from "@/api/plmManage";
import { useRoute } from "vue-router";

const columns = ref([]);
const dataList = ref([]);
const tableRef = ref();
const modalSelectedRows = ref([]);

const pagination = reactive<PaginationProps>({
  ...PAGE_CONFIG /** 总条数 */,
  /** 分页尺寸 */
  small: false,
  /** 背景 */
  background: true,
  /** 分页位置 */
  align: "right",
  /** 当前页 */
  currentPage: 1
});

const formData: any = reactive({
  page: 1,
  limit: PAGE_CONFIG.pageSize
});

const props: any = defineProps(["selectRowsCallBack", "dataTreeList"]);
const route = useRoute();

function onSelect(rows, row) {
  setSelectChange({ rows, row });
}

function onSelectAll(rows) {
  setSelectAllChange(rows);
}

const onSearch = () => {
  formData.projectModelId = route.query.modelId;
  fetchTaskStoreList(formData).then((res: any) => {
    const data = res.data;
    dataList.value = data.records;
    pagination.total = data.total;
    setSelectCheckbox();
  });
};

const getColumnConfig = () => {
  const flatTaskArr = props.dataTreeList
    ?.map((item) => item.taskVOList)
    .flat(Infinity)
    .map((item) => item.name);

  const columnData: TableColumnList[] = [
    { label: "序号", type: "index", width: 60, align: "center", headerAlign: "center" },
    { label: "任务名称", prop: "taskName", minWidth: 100 },
    { label: "工期(天)", prop: "duration", width: 80, align: "right", headerAlign: "center" },
    { label: "负责岗位", prop: "relatedPost", slot: "relatedPost", minWidth: 80 },
    { label: "交付物", prop: "relevantPost1", slot: "relevantPost1", minWidth: 200 },
    { label: "相关岗位", prop: "relevantPost", slot: "relevantPost", minWidth: 120 }
  ];

  columns.value = setColumn({
    columnData,
    operationColumn: false,
    indexColumn: false,
    selectionColumn: {
      hide: false,
      selectable: (row) => !flatTaskArr.includes(row.taskName)
    },
    radioColumn: false
  });
};

const handleTagSearch = (values: any) => {
  formData.taskName = values.taskName;
  onSearch();
};

// 分页相关
function handleSizeChange(val: number) {
  formData.limit = val;
  onSearch();
}

function handleCurrentChange(val: number) {
  formData.page = val;
  onSearch();
}

const rowClick = () => {};

const { setSelectCheckbox, setSelectChange, setSelectAllChange } = usePageSelect({ tableRef, dataList, rowsData: modalSelectedRows, uniId: "id" });

onMounted(() => {
  getColumnConfig();
  onSearch();
});
defineExpose({ modalSelectedRows });
</script>

<template>
  <div style="display: flex">
    <div class="ui-h-100" style="width: 100%">
      <PureTableBar :columns="columns" class="flex-1" @refresh="onSearch">
        <template #title>
          <BlendedSearch @tagSearch="handleTagSearch" placeholder="任务名称" searchField="taskName" />
        </template>
        <template #buttons />
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            ref="tableRef"
            border
            :height="300"
            row-key="id"
            class="bill-manage"
            :adaptive="true"
            align-whole="left"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            :paginationSmall="size === 'small'"
            highlight-current-row
            :show-overflow-tooltip="true"
            :pagination="pagination"
            @row-click="rowClick"
            @page-size-change="handleSizeChange"
            @page-current-change="handleCurrentChange"
            @select="onSelect"
            @select-all="onSelectAll"
          >
            <template #fGiveaway="{ row }">
              {{ row.fGiveaway == "0" ? "否" : "是" }}
            </template>
            <template #relatedPost="{ row }">
              {{ String(row.taskModelResponsibleRolesList?.map((item) => item.roleName).filter((item) => item) ?? "") }}
            </template>
            <template #relevantPost1="{ row }">
              {{ String(row.taskModelDeliverablesList?.map((item) => item.name).filter((item) => item) ?? "") }}
            </template>

            <template #relevantPost="{ row }">
              {{ String(row.taskRelateRoleList?.map((item) => item.roleName).filter((item) => item) ?? "") }}
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
