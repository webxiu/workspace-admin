<template>
  <div class="pm-workspace-wrapper">
    <div class="flex just-between flex-wrap">
      <el-form ref="overTimeFormRef" :inline="true" :model="formData" class="flex flex-1" style="height: 32px">
        <div class="flex">
          <BlendedSearch
            @tagSearch="handleTagSearch"
            :searchOptions="searchOptions"
            :queryParams="queryParams"
            placeholder="请输入任务名称"
            searchField="taskName"
          />
          <el-form-item label="任务状态" prop="select">
            <el-select
              v-model="formData.select"
              multiple
              collapse-tags
              :max-collapse-tags="4"
              collapse-tags-tooltip
              placeholder="请选择任务状态"
              style="min-width: 388px"
            >
              <el-option v-for="item in taskStateList" :label="item.optionName" :value="item.optionValue" :key="item.optionValue" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="formData.hideChildDone" label="隐藏完成的子任务" @change="onHideDone" />
          </el-form-item>
          <el-form-item>
            <el-button :icon="Search" type="primary" @click="onSearch">搜索</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane name="Board">
        <template #default>
          <div><board :listRef="listRef" ref="boardRef" :formData="formData" :onSearch="onSearch" /></div>
        </template>
        <template #label>
          <div style="display: flex; align-items: center">
            <el-icon style="margin-right: 4px"><Menu /></el-icon>看板
          </div>
        </template>
      </el-tab-pane>
      <el-tab-pane name="List">
        <template #default>
          <div><listGroup ref="listRef" :boardRef="boardRef" /></div>
        </template>
        <template #label>
          <div style="display: flex; align-items: center">
            <el-icon style="margin-right: 4px"><List /></el-icon>列表
          </div>
        </template>
      </el-tab-pane>
      <el-tab-pane name="Table">
        <template #default>
          <tableTab ref="tableRef" :formData="formData" />
        </template>
        <template #label>
          <div style="display: flex; align-items: center">
            <el-icon style="margin-right: 4px"><Document /></el-icon>表格
          </div>
        </template>
      </el-tab-pane>
      <el-tab-pane name="Calendar">
        <template #default>
          <div style="flex: 1"><calendarTab :boardRef="boardRef" :formData="formData" :taskManageOptions="taskManageOptions" /></div>
        </template>
        <template #label>
          <div style="display: flex; align-items: center">
            <el-icon style="margin-right: 4px"><Calendar /></el-icon>日历
          </div>
        </template>
      </el-tab-pane>
      <!-- <el-tab-pane label="Gantt" name="Gantt"
        ><template #default>
          <div><ganttTab /></div>
        </template>
        <template #label>
          <div style="display: flex; align-items: center">
            <el-icon style="margin-right: 4px"><Operation /></el-icon>甘特图
          </div>
        </template></el-tab-pane
      > -->
    </el-tabs>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { Menu, List, Document, Calendar, Operation } from "@element-plus/icons-vue";
import board from "./component/Tab/components/board.vue";
import listGroup from "./component/Tab/components/listGroup.vue";
import tableTab from "./table.vue";
import calendarTab from "./component/Tab/components/calendarTab.vue";
import ganttTab from "./component/Tab/components/ganttTab.vue";
import { PAGE_CONFIG } from "@/config/constant";
import { TaskStatus } from "./utils/hook";
import { QueryParamsType, SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { getUserInfo } from "@/utils/storage";
import { TaskMangeOptionType, userInfoList } from "@/api/systemManage";
import { useUserStore } from "@/store/modules/user";
import { Search } from "@element-plus/icons-vue";
import { getEnumDictList } from "@/utils/table";

defineOptions({ name: "SystemDevelopTaskManageIndex" });

const userInfo = getUserInfo();
const userStore = useUserStore();

const taskManageOptions = ref<Partial<TaskMangeOptionType>>({ userinfoList: [] });
const taskStateList: any = ref([]);
const activeName = ref("Table");
const listRef = ref();
const tableRef = ref();
const boardRef = ref();
const formData = reactive<Record<string, any>>({
  page: 1,
  limit: PAGE_CONFIG.pageSize,
  responsibleUserName: userInfo.userName,
  startTime: "",
  endTime: "",
  select: [TaskStatus.pending, TaskStatus.start, TaskStatus.confirm, TaskStatus.back],
  hideChildDone: true
});

const searchOptions = reactive<SearchOptionType[]>([
  { label: "任务名称", value: "taskName" },
  { label: "责任人", value: "responsibleUserName", children: [] },
  { label: "日期范围", value: "date", type: "daterange", format: "YYYY-MM-DD", startKey: "startTime", endKey: "endTime" },
  { label: "任务编号", value: "billNo" }
]);
const queryParams = reactive<QueryParamsType>({
  responsibleUserName: { value: userInfo.userName, valueLabel: userInfo.userName }
});

// 获取列表
const getTableList = () => {
  tableRef.value.getTableList();
  // boardRef.value.changeUserName(formData.responsibleUserName);
};

const onSearch = () => {
  boardRef.value.fetchList(formData.responsibleUserName);
  getTableList();
};

const handleClick = (tab) => {
  console.log(tab, "tab==");
};

const handleTagSearch = (values) => {
  Object.assign(formData, values);
};

// 隐藏子任务
const onHideDone = (val) => {
  formData.hideChildDone = val;
};

const getOpts = () => {
  userInfoList({
    page: 1,
    limit: 100000,
    deptId: userStore.userInfo.deptId + "",
    userState: "A",
    deptIdList: [userStore.userInfo.deptId + ""]
  }).then(({ data }) => {
    if (data && data.records) {
      taskManageOptions.value.userinfoList = data.records;
      searchOptions[1].children = data.records.map((item) => ({ label: item.userName, value: item.userName }));
    }
  });

  getEnumDictList(["WorkOrderTaskStatus"]).then(({ WorkOrderTaskStatus }) => {
    taskStateList.value = WorkOrderTaskStatus;
  });
};

onMounted(() => {
  getOpts();
});
</script>

<style scoped>
.demo-tabs {
  width: 100%;
}
</style>
