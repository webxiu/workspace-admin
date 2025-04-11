<template>
  <div>
    <pure-table
      border
      :height="maxHeight"
      :max-height="maxHeight"
      row-key="id"
      :adaptive="true"
      align-whole="center"
      size="small"
      :data="dataList"
      :columns="columns"
      :pagination="pagination"
      paginationSmall
      highlight-current-row
      :show-overflow-tooltip="true"
      @row-click="rowClick"
      @row-dblclick="rowDbClick"
      @page-size-change="onSizeChange"
      @page-current-change="onCurrentChange"
    />
  </div>
</template>

<script setup lang="tsx">
import { onMounted, reactive, ref } from "vue";
import { PaginationProps } from "@pureadmin/table";
import { PAGE_CONFIG } from "@/config/constant";
import { setColumn } from "@/utils/table";
import { showMessageBox, message } from "@/utils/message";
import { deleteHistoryHelpDocFile, fetchHelpDocHistoryList } from "@/api/systemManage";
import { getkkViewUrl } from "@/utils/storage";

const props = defineProps(["id", "docId"]);

const maxHeight = ref(400);
const dataList = ref([]);
const columns = ref<TableColumnList[]>([]);
const rowData = ref();

const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
const formData: any = reactive({
  pageNo: 1,
  limit: PAGE_CONFIG.pageSize
});

const rowClick = (row) => {
  rowData.value = row;
};

const rowDbClick = (row) => {
  const url = getkkViewUrl(row.filePath);
  window.open(url);
};

const handleDelFile = (e, row) => {
  e.stopPropagation();

  showMessageBox(`确认要删除名称为【${row.fileName}】的文件吗?`)
    .then(() => {
      deleteHistoryHelpDocFile({ id: row.id }).then((res) => {
        if (res.data || res.status) {
          message.success("删除成功");
          onSearch();
        }
      });
    })
    .catch(console.log);
};

const getColumnConfig = () => {
  const columnData: TableColumnList[] = [{ label: "文件名称", prop: "fileName" }];

  columns.value = setColumn({
    columnData,
    operationColumn: {
      width: 80,
      cellRenderer(data) {
        return (
          <el-button size="small" type="danger" onClick={(e) => handleDelFile(e, data.row)}>
            删除
          </el-button>
        );
      }
    }
  });
};

const onSearch = () => {
  if (props.id && props.docId) {
    console.log(props.id, "id===");
    console.log(props.docId, "docId===");
  }

  fetchHelpDocHistoryList({ ...formData, documentId: props.docId, id: props.id }).then((res: any) => {
    if (res.data) {
      dataList.value = res.data.records?.map((item) => ({ ...item, fileName: item.filePath?.split("/").at(-1) })) || [];
      pagination.total = res.data.total;
    }
  });
};

// 分页相关
function onSizeChange(val: number) {
  formData.limit = val;
  onSearch();
}

function onCurrentChange(val: number) {
  formData.pageNo = val;
  onSearch();
}

onMounted(() => {
  getColumnConfig();
  onSearch();
});

defineExpose({ rowData });
</script>

<style scoped></style>
