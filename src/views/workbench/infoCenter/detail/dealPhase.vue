<!-- /*
 * @Author: Hailen 
 * @Date: 2023-07-05 11:45:27 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-07-05 11:45:27 
 */ -->

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { PureTableBar } from "@/components/RePureTableBar";
import { setColumn } from "@/utils/table";
import { dealPhaseOptionList, DealPhaseOptionItemType } from "@/api/workbench/infoCenter";

const props = withDefaults(defineProps<{ billNo: string; processInstId: string }>(), {
  billNo: () => "",
  processInstId: () => ""
});

const columns = ref<TableColumnList[]>([]);
const dataList = ref<DealPhaseOptionItemType[]>([]);
const loading = ref<boolean>(false);
const maxHeight = 480;

onMounted(() => {
  getColumnConfig();
});

watch(props, () => getTableList(), { immediate: true });

const getColumnConfig = () => {
  const columnData: TableColumnList[] = [
    { label: "任务ID", prop: "taskId" },
    { label: "任务名称", prop: "activityName" },
    { label: "处理人", prop: "assignee" },
    { label: "接收时间", prop: "startTime", minWidth: 160 },
    { label: "审批时间", prop: "endTime", minWidth: 160 },
    { label: "耗时", prop: "duration" },
    { label: "处理意见", prop: "handleComment" },
    { label: "删除原因", prop: "deleteReason" },
    { label: "流程节点ID", prop: "activityId", minWidth: 160 },
    { label: "流程实例ID", prop: "processInstId" },
    { label: "实例执行ID", prop: "executionId" }
  ];
  columns.value = setColumn({ columnData, operationColumn: false });
};

function getTableList() {
  loading.value = true;
  const { billNo, processInstId } = props;
  dealPhaseOptionList({ billNo, piid: processInstId })
    .then(({ data }) => {
      loading.value = false;
      if (data?.length) dataList.value = data;
    })
    .catch(() => (loading.value = false));
}
</script>
<template>
  <PureTableBar :columns="columns" :show-icon="false">
    <template v-slot="{ size, dynamicColumns }">
      <pure-table
        border
        class="deal-phase"
        row-key="id"
        :adaptive="true"
        :height="maxHeight"
        :max-height="maxHeight"
        align-whole="center"
        showOverflowTooltip
        :loading="loading"
        :size="size"
        :data="dataList"
        :columns="dynamicColumns"
        :paginationSmall="size === 'small'"
        highlight-current-row
      />
    </template>
  </PureTableBar>
</template>
