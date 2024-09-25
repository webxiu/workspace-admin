<script setup lang="ts">
import { getDeliveryRightURLList } from "@/api/plmManage";
import { onMounted, watch } from "vue";
import { ref } from "vue";
import { getProductClassifyList } from "@/views/plmManage/productMgmt/classify/utils/hook";

const options = ref([]);
const loading = ref(false);
const props = defineProps(["leftId"]);

const tableData: any = defineModel({ default: [], local: true });

const handleDel = (row, idx) => {
  console.log(row, "row", idx);
  tableData.value.splice(idx, 1);
};

const addRow = () => {
  tableData.value.push({ urlAddress: "", templateProductEntryList: [] });
};

const fetchTableDataById = (deliverableId) => {
  loading.value = true;
  getDeliveryRightURLList({ deliverableId })
    .then((res: any) => {
      if (res.data) {
        tableData.value = res.data.map((item) => ({ ...item, templateProductEntryList: item.templateProductEntryList.map((el) => +el.value) }));
      }
    })
    .finally(() => (loading.value = false));
};

onMounted(() => {
  getProductClassifyList({ page: 1, limit: 1000 }).then((data) => {
    options.value = data;
    if (props.leftId) fetchTableDataById(props.leftId);
  });
});
</script>

<template>
  <div style="width: 100%">
    <el-button type="primary" size="small" style="margin-bottom: 8px" plain @click="addRow">新增</el-button>

    <el-table :data="tableData" :max-height="300" :height="300" v-loading="loading">
      <el-table-column prop="urlAddress" label="URL地址">
        <template #default="{ row }">
          <el-input v-model="row.urlAddress" />
        </template>
      </el-table-column>
      <el-table-column prop="templateProductEntryList" label="应用产品分类">
        <template #default="{ row }">
          <el-select v-model="row.templateProductEntryList" multiple collapse-tags collapse-tags-tooltip placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="操作" :width="80">
        <template #default="{ row, $index }">
          <el-button plain type="danger" size="small" @click="handleDel(row, $index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
