<template>
  <PureTableBar :columns="columns" class="flex-1" :show-icon="false">
    <template #title v-if="props.searchConfig.length">
      <BlendedSearch
        @tagSearch="onTagSearch"
        :searchOptions="searchOptions"
        :placeholder="`请输入${props.searchConfig[0].label}`"
        :searchField="props.searchConfig[0].value"
      />
    </template>
    <template v-slot="{ size, dynamicColumns }">
      <pure-table
        ref="tableRef"
        border
        :height="maxHeight"
        :max-height="maxHeight"
        :row-key="rowKey"
        :adaptive="true"
        align-whole="left"
        :loading="loading"
        :size="size"
        :data="_dataList"
        :columns="dynamicColumns"
        :paginationSmall="size === 'small'"
        highlight-current-row
        :show-overflow-tooltip="true"
        :pagination="pagination"
        @select="onSelect"
        @select-all="onSelectAll"
        @row-dblclick="rowDbClick"
        @current-change="onCurrentChange"
        @page-size-change="handleSizeChange"
        @page-current-change="handleCurrentChange"
      />
    </template>
  </PureTableBar>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { PAGE_CONFIG } from "@/config/constant";
import { type PaginationProps } from "@pureadmin/table";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { setColumn, usePageSelect } from "@/utils/table";
import { getDeptTreeData } from "@/api/systemManage";
import { getDeptOptions } from "@/utils/requestApi";

interface SearchConfigType extends SearchOptionType {
  /** 自动添加查询字段(已经添加部门) */
  queryFields?: Array<"department">;
}

export interface SelectTableProp {
  /** 唯一ID */
  rowKey?: string;
  /** 是否多选 */
  multiple?: boolean;
  /** 表格最大高度 */
  maxHeight?: number;
  /** 表格列表数据 */
  dataList?: Recordable[];
  /** 表格列配置 */
  columns: TableColumnList[];
  /** 查询参数(默认) */
  paramConfig?: Record<string, any>;
  /** 搜索配置 */
  searchConfig?: SearchConfigType[];
  /** 查询接口 */
  api?: (arg: any) => Promise<any>;
  /** 格式化接口返回数据 */
  formatAPI?: (data: any) => any;
  /** 是否为弹窗 */
  isModal?: boolean;
}

const props = withDefaults(defineProps<SelectTableProp>(), {
  rowKey: "id",
  multiple: false,
  maxHeight: 200,
  paramConfig: () => ({}),
  columns: () => [],
  searchConfig: () => [],
  api: () => void 0
});

const rowData = ref();
const rowsData = ref([]);
const tableRef = ref();
const loading = ref(false);
const _dataList = ref<Recordable[]>([]);
const searchOptions = reactive<SearchConfigType[]>(props.searchConfig);
const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
const formData = reactive<Recordable<any>>({ page: 1, limit: PAGE_CONFIG.pageSize, ...props.paramConfig });
const emits = defineEmits(["select", "dbClick", "mulSelect"]);
const { setSelectCheckbox, setSelectChange, setSelectAllChange } = usePageSelect({ tableRef, dataList: _dataList, rowsData: rowsData, uniId: props.rowKey });

const columns = computed<TableColumnList[]>(() => {
  return setColumn({
    columnData: props.columns,
    operationColumn: false,
    // indexColumn: { hide: true },
    radioColumn: { hide: props.multiple }, // 多选时隐藏单选按钮
    selectionColumn: { hide: !props.multiple } // 单选时隐藏多选按钮
  });
});

onMounted(async () => {
  await getOption();
  getTableList();
});
watch(rowsData, () => emits("mulSelect", rowsData.value), { deep: true });

function getOption() {
  const p1 = getDeptOptions(); // 1.配置department,自动添加部门查询
  //  p2 = 添加其他接口...
  return Promise.all([p1]).then((res) => {
    const data1 = res[0];
    searchOptions.forEach((item) => {
      if (item.queryFields?.includes("department") && data1?.length) {
        formData[item.value] = data1[0].value;
        item.children = data1;
      }
      // 其他接口...
    });
  });
}

function getTableList() {
  if (props.dataList) {
    const list = props.dataList;
    _dataList.value = list;
    pagination.total = list.length;
    pagination.pageSize = list.length;
    return;
  }
  if (!props.api) return;
  loading.value = true;
  props
    .api(formData)
    .then(({ data }) => {
      const _data = props.formatAPI ? props.formatAPI(data) : data;
      loading.value = false;
      if (_data.total !== undefined && _data.records) {
        _dataList.value = _data.records || [];
        pagination.total = _data.total;
        setSelectCheckbox();
      } else {
        _dataList.value = _data || [];
        pagination.total = _data.length;
        pagination.pageSize = _data.length;
      }
    })
    .catch(() => (loading.value = false));
}

const onTagSearch = (values) => {
  Object.assign(formData, values);
  getTableList();
};

function onSelect(rows, row) {
  setSelectChange({ rows, row });
}

function onSelectAll(rows) {
  setSelectAllChange(rows);
}

const rowDbClick = (row) => {
  rowData.value = row;
  emits("dbClick", row);
};

const onCurrentChange = (row) => {
  rowData.value = row;
  if (props.multiple) return;
  emits("select", row);
};

function handleSizeChange(val: number) {
  formData.limit = val;
  getTableList();
}

function handleCurrentChange(val: number) {
  formData.page = val;
  getTableList();
}
</script>
