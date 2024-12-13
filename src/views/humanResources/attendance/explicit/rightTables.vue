<template>
  <div class="right-outer">
    <div class="table-item1">
      <div class="label-top">请假记录</div>
      <pure-table
        border
        :height="maxHeight"
        :max-height="maxHeight"
        row-key="id"
        :adaptive="true"
        align-whole="center"
        size="small"
        :data="dataList1"
        :columns="columns1"
        highlight-current-row
      />
    </div>
    <div class="table-item">
      <div class="label-top">加班记录</div>
      <pure-table
        border
        :height="maxHeight"
        :max-height="maxHeight"
        row-key="id"
        :adaptive="true"
        align-whole="center"
        size="small"
        :data="dataList2"
        :columns="columns2"
        highlight-current-row
      />
    </div>
    <div class="table-item">
      <div class="label-top">外出记录</div>
      <pure-table
        border
        :height="maxHeight"
        :max-height="maxHeight"
        row-key="id"
        :adaptive="true"
        align-whole="center"
        :show-overflow-tooltip="true"
        size="small"
        :data="dataList3"
        :columns="columns3"
        highlight-current-row
      >
        <template #operation="{ row }"
          ><el-dropdown trigger="click" @command="(v) => handleCommand3(v, row)">
            <el-button type="primary" size="small">
              设 置<el-icon style="margin-left: 6px"><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="morningWorkTime">上午上班</el-dropdown-item>
                <el-dropdown-item command="morningDownWorkTime">上午下班</el-dropdown-item>
                <el-dropdown-item command="afternoonWorkTime">下午上班</el-dropdown-item>
                <el-dropdown-item command="afternoonDownWorkTime">下午下班</el-dropdown-item>
                <el-dropdown-item command="eveningWorkTime">晚上上班</el-dropdown-item>
                <el-dropdown-item command="eveningDownWorkTime">晚上下班</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </pure-table>
    </div>
    <div class="table-item">
      <div class="label-top">打卡记录</div>
      <pure-table
        border
        :height="196"
        :max-height="196"
        row-key="id"
        :adaptive="true"
        align-whole="center"
        size="small"
        :data="dataList5"
        :columns="columns5"
        highlight-current-row
      >
        <template #operation="{ row }"
          ><el-dropdown trigger="click" @command="(v) => handleCommand2(v, row)">
            <el-button type="primary" size="small">
              设 置<el-icon style="margin-left: 6px"><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="morningWorkTime">上午上班</el-dropdown-item>
                <el-dropdown-item command="morningDownWorkTime">上午下班</el-dropdown-item>
                <el-dropdown-item command="afternoonWorkTime">下午上班</el-dropdown-item>
                <el-dropdown-item command="afternoonDownWorkTime">下午下班</el-dropdown-item>
                <el-dropdown-item command="eveningWorkTime">晚上上班</el-dropdown-item>
                <el-dropdown-item command="eveningDownWorkTime">晚上下班</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button size="small" v-if="row.deleteStatus == 1" type="success" style="margin-left: 16px" @click="() => revertRowRecords(row)">恢复</el-button>
          <el-button size="small" v-else type="danger" style="margin-left: 16px" @click="() => deleteRowRecords(row)">删除</el-button>
        </template>
      </pure-table>
    </div>
    <div class="table-item">
      <div class="label-top">补卡记录</div>
      <pure-table border row-key="id" :adaptive="true" align-whole="center" size="small" :data="dataList4" :columns="columns4" highlight-current-row>
        <template #operation="{ row }"
          ><el-dropdown trigger="click" @command="(v) => handleCommand(v, row)">
            <el-button type="primary" size="small">
              设 置<el-icon style="margin-left: 6px"><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="morningWorkTime">上午上班</el-dropdown-item>
                <el-dropdown-item command="morningDownWorkTime">上午下班</el-dropdown-item>
                <el-dropdown-item command="afternoonWorkTime">下午上班</el-dropdown-item>
                <el-dropdown-item command="afternoonDownWorkTime">下午下班</el-dropdown-item>
                <el-dropdown-item command="eveningWorkTime">晚上上班</el-dropdown-item>
                <el-dropdown-item command="eveningDownWorkTime">晚上下班</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template></pure-table
      >
    </div>
  </div>
</template>

<script setup lang="tsx">
import { setColumn } from "@/utils/table";
import dayjs from "dayjs";
import { onMounted, ref } from "vue";
import { ArrowDown } from "@element-plus/icons-vue";
import { delAttendanceRecord, fetchAttendanceRecord, getTimeStandardAttendancel, revertAttendanceRecord } from "@/api/oaManage/humanResources";
import { message, showMessageBox } from "@/utils/message";

const maxHeight = ref(84);
const dataList1 = ref([]);
const dataList2 = ref([]);
const dataList3 = ref([]);
const dataList4 = ref([]);
const dataList5 = ref([]);
const columns1 = ref<TableColumnList[]>([]);
const columns2 = ref<TableColumnList[]>([]);
const columns3 = ref<TableColumnList[]>([]);
const columns4 = ref<TableColumnList[]>([]);
const columns5 = ref<TableColumnList[]>([]);

const props = defineProps(["currentLeftRow", "setCurLeftRowByKey"]);

const deleteRowRecords = (row) => {
  const { attDate, staffCode } = props.currentLeftRow;
  showMessageBox(`确认要删除【${row.staffName} ${dayjs(row.attTime).format("YYYY-MM-DD HH:mm:ss")}】的考勤记录吗?`)
    .then(() => {
      delAttendanceRecord({ id: row.id }).then((res) => {
        if (res.data || res.status === 200) {
          message.success("删除成功");
          fetchAttendanceRecord({ page: 1, limit: 30, attDate, staffCode }).then((resp: any) => {
            if (resp.data) {
              dataList5.value = resp.data.records;
            }
          });
        }
      });
    })
    .catch(console.log);
};

const revertRowRecords = (row) => {
  const { attDate, staffCode } = props.currentLeftRow;
  showMessageBox(`确认要恢复【${row.staffName} ${dayjs(row.attTime).format("YYYY-MM-DD HH:mm:ss")}】的考勤记录吗?`)
    .then(() => {
      revertAttendanceRecord({ id: row.id }).then((res) => {
        if (res.data || res.status === 200) {
          message.success("恢复成功");
          fetchAttendanceRecord({ page: 1, limit: 30, attDate, staffCode }).then((resp: any) => {
            if (resp.data) {
              dataList5.value = resp.data.records;
            }
          });
        }
      });
    })
    .catch(console.log);
};

const handleCommand = (command, rightRow) => {
  const reTime = rightRow.reissueDate?.split(" ")[1].slice(0, 5);
  props.setCurLeftRowByKey(command, reTime, 3);
};

const handleCommand2 = (command, rightRow) => {
  const reTime = rightRow.attTime?.split("T")[1].slice(0, 5);
  props.setCurLeftRowByKey(command, reTime, 4);
};

const handleCommand3 = (command, rightRow) => {
  const reqParams = { staffId: props.currentLeftRow.staffId, attDate: props.currentLeftRow.attDate };
  reqParams[`${command}Flag`] = props.currentLeftRow[`${command}Flag`];
  getTimeStandardAttendancel(reqParams).then((res) => {
    if (res.data) {
      props.setCurLeftRowByKey(command, res.data, 5);
    }
  });
};

const getConfig = () => {
  const columns1Data = [
    { label: "请假时长", prop: "hours", width: 90 },
    { label: "开始日期", prop: "startDate" },
    { label: "开始时间", prop: "startTime" },
    { label: "结束日期", prop: "endDate" },
    { label: "结束时间", prop: "endTime" }
  ];
  const columns2Data = [
    { label: "加班时长", prop: "hours", width: 90 },
    { label: "开始日期", prop: "startDate" },
    { label: "开始时间", prop: "startTime" },
    { label: "结束日期", prop: "endDate" },
    { label: "结束时间", prop: "endTime" }
  ];
  const columns3Data = [
    { label: "目地的", prop: "destination" },
    { label: "预计外出时间", prop: "planOutDate" },
    { label: "预计返回时间", prop: "planBackDate" }
  ];
  const columns4Data: TableColumnList[] = [
    { label: "补卡时间", prop: "reissueDate", align: "center" },
    { label: "补卡说明", prop: "reissueComent", align: "center" }
  ];
  const columns5Data: TableColumnList[] = [
    { label: "考勤机", prop: "attMachineName" },
    {
      label: "打卡时间",
      width: 155,
      prop: "attTime",
      cellRenderer(data) {
        return <span>{dayjs(data.row.attTime).format("YYYY-MM-DD HH:mm:ss")}</span>;
      }
    },
    {
      label: "状态",
      width: 100,
      prop: "deleteStatus",
      cellRenderer(data) {
        const delState = { 0: "未删除", 1: "已删除" };
        return <span>{delState[data.row.deleteStatus]}</span>;
      }
    }
  ];

  columns1.value = columns1Data;
  columns2.value = columns2Data;
  columns3.value = setColumn({
    columnData: columns3Data,
    radioColumn: { hide: true },
    indexColumn: { hide: true },
    operationColumn: { width: 100, align: "left" }
  });
  columns5.value = setColumn({
    columnData: columns5Data,
    radioColumn: { hide: true },
    indexColumn: { hide: true },
    operationColumn: { width: 160, align: "left" }
  });
  columns4.value = setColumn({
    columnData: columns4Data,
    radioColumn: { hide: true },
    indexColumn: { hide: true },
    operationColumn: { width: 120, align: "left" }
  });
};

onMounted(() => {
  getConfig();
});

defineExpose({ dataList1, dataList2, dataList3, dataList4, dataList5 });
</script>

<style lang="scss" scoped>
.right-outer {
  .table-item {
    margin: 8px 0;
  }

  .label-top {
    font-size: 13px;
    font-weight: 600;
  }
}
</style>
