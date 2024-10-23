<template>
  <div>
    <el-date-picker v-model="searchDate" @change="changeDate" value-format="YYYY-MM" type="month" placeholder="选择年月" />
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="任务分配看板" name="taskBoard">
        <PureTableBar @change-column="setUserMenuColumns" :columns="columns" @refresh="onFresh" style="padding-top: 0">
          <template #title />
          <template #buttons />
          <template v-slot="{ size, dynamicColumns }">
            <pure-table
              border
              :height="maxHeight"
              :max-height="maxHeight"
              row-key="id"
              :adaptive="true"
              align-whole="left"
              :size="size"
              :data="dataList"
              :columns="dynamicColumns"
              :show-overflow-tooltip="true"
              highlight-current-row
            />
          </template>
        </PureTableBar>
      </el-tab-pane>
      <el-tab-pane label="任务绩效" name="taskPerformance">
        <PureTableBar @change-column="setUserMenuColumns" :columns="columns2" @refresh="onFresh2" style="padding-top: 0">
          <template #title />
          <template #buttons />
          <template v-slot="{ size, dynamicColumns }">
            <pure-table
              border
              :height="maxHeight2"
              :max-height="maxHeight2"
              row-key="id"
              :adaptive="true"
              align-whole="left"
              :size="size"
              :data="dataList2"
              :columns="dynamicColumns"
              :show-overflow-tooltip="true"
              highlight-current-row
            />
          </template>
        </PureTableBar>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { ref, onMounted } from "vue";
import { setColumn, getMenuColumns } from "@/utils/table";
import { useEleHeight } from "@/hooks";
import { getTaskPerformanceData, getTaskBoardData } from "@/api/systemManage";
import { PureTableBar } from "@/components/RePureTableBar";
import { setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "SystemDevelopTaskTotalIndex" });

const activeName = ref("taskBoard");
const searchDate = ref(dayjs().format("YYYY-MM"));

const handleClick = ({ paneName }) => {
  activeName.value = paneName;
};

const onFresh = () => {
  getConfig();
};

const onFresh2 = () => {
  getConfig2();
};

const columns = ref([]);
const dataList = ref([]);
const maxHeight = useEleHeight(".app-main > .el-scrollbar", 90);

const getConfig = async () => {
  const [iYear, iMonth] = searchDate.value.split("-");
  const result: any = await getTaskBoardData({ iYear, iMonth: +iMonth });
  const data = result.data;
  if (data && data.length) {
    const columnData = [];

    const keys = Object.keys(data[0]).sort();

    const unicodeChar = keys.find((el) => isNaN(+el));
    keys.unshift(unicodeChar);
    keys.pop();

    keys.forEach((el) => columnData.push({ label: el, prop: el, align: el !== "工程师" ? "right" : "left", width: 62, fixed: el === "工程师" }));

    columns.value = setColumn({ columnData, operationColumn: false, indexColumn: { fixed: true }, radioColumn: { fixed: true } });

    dataList.value = data as any;
  }
};

const columns2 = ref([]);
const dataList2 = ref([]);
const maxHeight2 = useEleHeight(".app-main > .el-scrollbar", 90);

const changeDate = (val) => {
  searchDate.value = val;
  getConfig();
  getConfig2();
};

const getDataList = () => {
  const [iYear, iMonth] = searchDate.value.split("-");
  getTaskPerformanceData({ iYear, iMonth: +iMonth }).then((res: any) => {
    if (res.data) {
      dataList2.value = res.data;
    }
  });
};

const getConfig2 = async () => {
  const { columnArrs } = await getMenuColumns();

  if (columnArrs[0].length) {
    columns2.value = setColumn({ columnData: columnArrs[0], operationColumn: false });
  }

  getDataList();
};

onMounted(() => {
  getConfig();
  getConfig2();
});
</script>
