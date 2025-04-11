<template>
  <div>
    <pure-table
      border
      :height="maxHeight"
      :max-height="maxHeight"
      row-key="id"
      class="bill-manage-calc"
      :adaptive="true"
      align-whole="left"
      size="small"
      :data="dataList"
      :columns="columns"
      paginationSmall
      :pagination="pagination"
      @page-size-change="handleSizeChange"
      @page-current-change="handleCurrentChange"
      highlight-current-row
      :show-overflow-tooltip="true"
    />
  </div>
</template>

<script setup lang="tsx">
import { ref, reactive, watch } from "vue";
import { type PaginationProps } from "@pureadmin/table";
import { PAGE_CONFIG } from "@/config/constant";
import { setColumn } from "@/utils/table";

const maxHeight = ref(300);
const dataList = ref([]);
const columns = ref<TableColumnList[]>([]);
const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });

const formData = reactive({
  page: 1,
  limit: PAGE_CONFIG.pageSize
});

const props = defineProps(["cols"]);

watch(
  props,
  (newVal) => {
    columns.value = setColumn({ columnData: newVal.cols, operationColumn: false, radioColumn: { hide: true } });
  },
  { immediate: true }
);

const onSearch = () => {
  console.log(formData, "formData");
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
</script>

<style scoped></style>
