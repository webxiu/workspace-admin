<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="flex flex-1 ui-h-100 ui-w-100 ui-ov-h">
      <PureTableBar :columns="columns" @refresh="onFresh" :show-icon="false">
        <template #title>
          <BlendedSearch @tagSearch="handleTagSearch" :searchOptions="searchOptions" placeholder="姓名" searchField="staffName" />
        </template>
        <template #buttons />
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="id"
            :adaptive="true"
            align-whole="center"
            :size="size"
            :data="dataList"
            @row-click="rowClick"
            :columns="dynamicColumns"
            :pagination="pagination"
            :paginationSmall="size === 'small'"
            highlight-current-row
            :show-overflow-tooltip="true"
            @page-size-change="onSizeChange"
            @page-current-change="onCurrentChange"
          />
        </template>
      </PureTableBar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { StaffInfoItemType, staffInfoList } from "@/api/oaManage/humanResources";
import { ref, reactive, onMounted } from "vue";
import { PAGE_CONFIG } from "@/config/constant";
import { PaginationProps } from "@pureadmin/table";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { getDeptOptions } from "@/utils/requestApi";
import { setColumn } from "@/utils/table";

const maxHeight = ref(400);
const dataList = ref<StaffInfoItemType[]>([]);
const columns = ref<TableColumnList[]>([]);
const currentRow = ref();
const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
const formData: any = reactive({
  page: 1,
  limit: PAGE_CONFIG.pageSize,
  state: "在职"
});

const searchOptions = reactive<SearchOptionType[]>([
  { label: "工号", value: "staffId" },
  { label: "部门", value: "deptId", children: [] }
]);

const onFresh = () => {
  onSearch();
};

const getConfig = () => {
  const columnData: TableColumnList[] = [
    {
      label: "姓名",
      prop: "staffName"
    },
    {
      label: "工号",
      prop: "staffId"
    },
    {
      label: "部门",
      prop: "deptName"
    }
  ];
  columns.value = setColumn({ columnData, operationColumn: false });
};

const rowClick = (row) => {
  currentRow.value = row;
};

const onSearch = () => {
  staffInfoList({
    ...formData,
    deptIdList: formData.deptId ? [formData.deptId] : []
  }).then((res) => {
    if (res.data) {
      dataList.value = res.data.records;
      pagination.total = res.data.total;
    }
  });
};

const handleTagSearch = (values) => {
  Object.assign(formData, values);
  onSearch();
};

// 分页相关
function onSizeChange(val: number) {
  formData.limit = val;
  onSearch();
}

function onCurrentChange(val: number) {
  formData.page = val;
  onSearch();
}

const getOptions = () => {
  getDeptOptions().then((data: any) => {
    searchOptions[1].children = data;
  });
};

onMounted(() => {
  getOptions();
  getConfig();
  onSearch();
});

defineExpose({ currentRow });
</script>
