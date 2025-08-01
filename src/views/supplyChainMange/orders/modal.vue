<template>
  <el-table :data="tableData" style="width: 100%; height: 300px" v-loading="loading">
    <el-table-column type="index" label="序号" width="60" align="center" />
    <el-table-column prop="fileName" label="文件名" />
    <el-table-column prop="createDate" label="回签时间" width="160">
      <template #default="{ row }">
        {{ row.createDate ? dayjs(row.createDate).format("YYYY-MM-DD HH:mm:ss") : "" }}
      </template>
    </el-table-column>
    <!-- <el-table-column prop="billState" label="附件状态" align="center" width="90">
      <template #default="{ row }">
        {{ displayStateNameMap[row.billState] }}
      </template>
    </el-table-column> -->
    <el-table-column prop="operate" label="操作">
      <template #default="{ row, index }">
        <el-space :size="16">
          <el-button type="danger" size="small" :disabled="['已回签', '审核中'].includes(formData.billState)" @click="onDel(row, index)">删除</el-button>
          <el-button type="success" size="small" @click="onView(row)">查看</el-button>
          <el-button type="primary" size="small" @click="onDownload(row)">下载</el-button>
        </el-space>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { deleteFileTableRow, fetchSupOrderList } from "@/api/supplyChain";
import { ElMessageBox } from "element-plus";
import { ref } from "vue";
import dayjs from "dayjs";
import { downloadFile } from "@/utils/common";
import { message } from "@/utils/message";

interface Props {
  /** 是否禁用删除 */
  disabled?: boolean;
  formData?: any;
  currentLeftRow: any;
  onFresh: () => {};
}

const props = defineProps<Props>();

const tableData = ref([]);
const loading = ref(false);

const displayStateNameMap = {
  0: "待提交",
  1: "审核中",
  2: "已驳回",
  3: "已回签",
  null: "待回签"
};

const onView = (row) => {
  // VITE_VIRTUAL_PATH
  const vPath = import.meta.env.VITE_BASE_API + row.filePath + "/" + row.fileName;
  window.open(vPath);
};

const onDownload = (row) => {
  const url = row.filePath + "/" + row.fileName;
  downloadFile(url, row.fileName);
};

const onDel = (row, index) => {
  ElMessageBox.confirm(`确认删除文件名为${row.fileName}的附件吗？`, "温馨提示", {
    type: "warning",
    draggable: true,
    cancelButtonText: "取消",
    confirmButtonText: "确定",
    dangerouslyUseHTMLString: true
  })
    .then(() => {
      loading.value = true;
      deleteFileTableRow({ id: row.id, fileName: row.fileName })
        .then((res) => {
          if (res.data) {
            message.success("删除成功");
            tableData.value.splice(index, 1);

            if (!tableData.value.length) {
              fetchSupOrderList({ page: 1, limit: 10, fbillno: props.currentLeftRow.fbillno }).then((res: any) => {
                if (res.data) {
                  const resStatus = res.data.records[0]?.billState;
                  props.formData.billState = displayStateNameMap[resStatus];
                }
              });
            }
          }
        })
        .finally(() => (loading.value = false));
    })
    .catch(() => {});
};

defineExpose({ tableData, loading });
</script>

<style scoped lang="scss">
:deep(.el-table__empty-text) {
  line-height: 250px;
}
</style>
