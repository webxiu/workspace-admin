<template>
  <div class="history">
    <div class="left">
      <el-table v-loading="loading" height="635" :row-style="rowStyle" :data="tableData" highlight-current-row @current-change="handleCurrentChange">
        <el-table-column property="userName" label="修改人" width="120" />
        <el-table-column property="recordDate" label="修改时间" width="180" />
      </el-table>
    </div>
    <div class="right">
      <AddPage :is-view="true" :history-data="currentHistoryInfo" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElTable } from "element-plus";
import AddPage from "../add.vue";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { fetchEditUserList, fetchHistoryInfo } from "@/api/plmManage";

defineOptions({ name: "MaterialHistory" });

const currentRow = ref();
const currentHistoryInfo: any = ref({});
const route = useRoute();

const rowStyle = () => {
  return { cursor: "pointer" };
};

const tableData: any = ref([]);
const loading = ref(false);

const handleCurrentChange = (val) => {
  currentRow.value = val;
  fetchInfo(val.id);
};

const fetchInfo = (id) => {
  fetchHistoryInfo({ id }).then((resp) => {
    currentHistoryInfo.value = resp.data;
  });
};

const fetchLeftList = (materialId) => {
  loading.value = true;
  fetchEditUserList({ materialId })
    .then(({ data }) => {
      tableData.value = data || [];
      if (data.length > 0) {
        fetchInfo(data[0].id);
      }
    })
    .finally(() => (loading.value = false));
};

onMounted(() => {
  if (route.query.materialId) {
    fetchLeftList(route.query.materialId);
  }
});
</script>

<style scoped lang="scss">
.history {
  display: flex;
  height: calc(100vh - 105px);
  overflow: auto;

  .left {
    padding: 15px;
  }
}
</style>
