<template>
  <div>
    <PureTableBar :columns="columns" :showIcon="false">
      <template v-slot="{ dynamicColumns }">
        <pure-table
          border
          :height="maxHeight"
          :loading="loading"
          row-key="id"
          class="bill-manage"
          :adaptive="true"
          align-whole="left"
          size="small"
          :data="tableData"
          :columns="dynamicColumns"
          @row-click="rowClick"
          highlight-current-row
          :show-overflow-tooltip="true"
        />
      </template>
    </PureTableBar>
  </div>
</template>

<script lang="ts" setup>
import { bomHistoryListByBomId, bomHistoryTableData } from "@/api/plmManage";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useHistoryConfig } from "./hook";
import { PureTableBar } from "@/components/RePureTableBar";

const { columns, maxHeight, setHeight } = useHistoryConfig();

const route = useRoute();
const props = defineProps(["setDataList", "setRightLoading", "initList"]);

const tableData: any = ref([]);
const loading = ref(false);

const rowClick = (row) => {
  props.setRightLoading(true);
  bomHistoryListByBomId({ id: row.id })
    .then((res) => {
      if (res.data) {
        console.log(res.data, "历史数据");
        console.log(props, "props");
        props.initList(res.data[0]);

        props.setDataList(res.data);
      }
    })
    .finally(() => props.setRightLoading(false));
};

onMounted(() => {
  console.log(route.query.id, "left");
  if (route.query.id) {
    loading.value = true;
    bomHistoryTableData({ bomId: route.query.id })
      .then((res) => {
        if (res.data && Array.isArray(res.data) && res.data.length) {
          tableData.value = res.data;
          rowClick(res.data[0]);
        }
      })
      .finally(() => (loading.value = false));
  }
});

defineExpose({ setHeight });
</script>
