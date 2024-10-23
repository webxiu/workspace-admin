<script setup lang="ts">
import { ref, Ref, nextTick, onUnmounted, watch, onMounted } from "vue";
import { PureTableBar } from "@/components/RePureTableBar";
import Border from "./Border.vue";
import { mouseInOut } from "./utils";

type TableItemType = Record<string, any>;

interface Props {
  title: Ref<string>;
  columns: TableColumnList[];
  dataList: Ref<Array<TableItemType>>;
}
const props = withDefaults(defineProps<Props>(), {
  dataTheme: "borderLine",
  columns: () => [],
  dataList: () => ref([])
});

const timer = ref();
const timerFlag = ref(false);
// const maxHeight = ref(190);
const maxHeight = ref(120);
const tableData = ref<TableItemType[]>([]);
onMounted(() => {
  mouseInOut(".scroll-table", (bool) => (timerFlag.value = bool));
});

onUnmounted(() => timer.value && clearInterval(timer.value));
watch(props, ({ dataList }) => getTableList(dataList), { deep: true, immediate: true });

function getTableList(dataList) {
  tableData.value = dataList.value;
  nextTick(() => {
    const scrollTable = document.querySelector(".scroll-table") as HTMLDivElement;
    const thead = document.querySelector(".el-table__header") as HTMLDivElement;
    const tBody = document.querySelector(".el-table__body") as HTMLDivElement;
    maxHeight.value = scrollTable.offsetHeight - 16;
    if (timer.value) {
      clearInterval(timer.value);
    }
    if (!tableData.value.length || tableData.value.length <= 9) return; // TODO: 此处限制进行滚动
    timer.value = setInterval(() => {
      if (timerFlag.value) return;
      const rowH = thead.offsetHeight;
      const data = tableData.value[0];
      const t1 = setTimeout(() => {
        tableData.value.push(data);
        tBody.style.transition = "all .5s";
        tBody.style.marginTop = -rowH + "px";
        clearTimeout(t1);
      }, 300);
      const t2 = setTimeout(() => {
        tableData.value.splice(0, 1);
        tBody.style.transition = "all 0s ease 0s";
        tBody.style.marginTop = "0";
        clearTimeout(t2);
      }, 800);
    }, 2000);
  });
}
</script>
<template>
  <Border class="flex-col flex-1" :title="props.title.value" :className="''">
    <PureTableBar :columns="props.columns" :show-icon="false" class="scroll-table flex-1">
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          :height="maxHeight"
          row-key="id"
          align-whole="center"
          :size="size"
          :data="tableData"
          :columns="dynamicColumns"
          :show-overflow-tooltip="true"
        >
          <template #empty>
            <span />
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </Border>
</template>

<style lang="scss">
.scroll-table {
  margin-top: 22px;
  background-color: transparent !important;
}
</style>

<style scoped lang="scss">
$thColor: #74aeff;
$tdColor: #8fc754;
$borderColor: #233653;
$hoverColor: rgb(5 16 43 / 50%);

.scroll-table {
  padding-top: 0;
  background-color: transparent !important;
}

.scroll-table .pure-table {
  padding-top: 0;

  :deep(.el-table th),
  :deep(.el-table td) {
    border-color: $borderColor !important;
  }

  :deep(.el-table__inner-wrapper::before) {
    display: none;
  }

  :deep(.el-table--fit),
  :deep(.el-table tr) {
    color: $tdColor !important;
    background-color: transparent !important;
  }

  :deep(.el-table tr td) {
    color: $tdColor !important;
  }

  :deep(.el-table th) {
    color: $thColor;
    background-color: transparent !important;

    .cell {
      white-space: nowrap;
    }
  }

  :deep(.el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell) {
    background-color: $hoverColor;
  }
}
</style>
