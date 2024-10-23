<template>
  <div class="ui-h-100 main-content">
    <div class="top_zoom flex flex-wrap">
      <div class="flex-1">
        <BlendedSearch @tagSearch="handleTagSearch" :searchOptions="searchOptions" placeholder="请输入姓名" searchField="userName" />
      </div>
      <ButtonList moreActionText="宿舍楼管理" :buttonList="buttonList" :auto-layout="false" />
      <ButtonList moreActionText="房间管理" :buttonList="buttonList2" :auto-layout="false" />
    </div>
    <div class="tab-outer">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="item in allBuildings" :key="item.id" :label="item.name" :name="item.id" />
      </el-tabs>
      <div class="center-content">
        <el-table :data="tableData" height="calc(100vh - 232px)" style="width: 80%" v-loading="loading">
          <el-table-column prop="floor" label="楼层" align="center" width="55" />
          <el-table-column prop="value" label="房间">
            <template #default="{ row }">
              <!-- D栋 -->
              <div v-if="isD.includes('D')" style="display: flex; flex-wrap: wrap; padding: 20px 0">
                <div class="roomItem" v-for="item in row.value" :key="item.id" :style="{ marginRight: 'auto' }">
                  <el-tooltip placement="top" :show-after="500">
                    <el-tag round :type="currentId === item.id ? 'danger' : ''" effect="dark" @click="clickTag(item)" class="tag-name">{{
                      item.dormitoryCode + "-" + item.num
                    }}</el-tag>
                    <template #content>
                      <div>
                        <div>宿舍房间：{{ item.buildingGroup + "-" + item.dormitoryCode }}</div>
                        <div>宿舍职级：{{ item.dormitoryRank }}</div>
                        <div>宿舍性别：{{ item.dormitorySex }}</div>
                        <div>备注：{{ item.remark }}</div>
                      </div>
                    </template>
                  </el-tooltip>
                </div>
              </div>
              <!-- 非D栋:每隔12个换行 -->
              <div v-else style="display: flex; flex-wrap: wrap" v-for="(_, index) in Math.ceil(row.value.length / RoomLimit)" :key="index">
                <div class="roomItem" v-for="item in splitList(row.value, index)" :key="item.id" :style="{ padding: '4px 0', marginRight: '3%' }">
                  <el-tooltip placement="top" :show-after="500">
                    <el-tag round :type="currentId === item.id ? 'danger' : ''" effect="dark" @click="clickTag(item)" class="tag-name">
                      {{ item.dormitoryCode + "-" + item.num }}
                    </el-tag>
                    <template #content>
                      <div>
                        <div>宿舍房间：{{ item.buildingGroup + "-" + item.dormitoryCode }}</div>
                        <div>宿舍职级：{{ item.dormitoryRank }}</div>
                        <div>宿舍性别：{{ item.dormitorySex }}</div>
                        <div>备注：{{ item.remark }}</div>
                      </div>
                    </template>
                  </el-tooltip>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="right flex-1" v-loading="loading2">
          <div class="ui-ovx-a">
            <div class="zoom-level" v-if="userList.length">
              <div>宿舍职级：{{ currentRoom.dormitoryRank }}</div>
              <div>宿舍性别：{{ currentRoom.dormitorySex }}</div>
            </div>
            <div class="zoom-info">入住信息</div>
            <div v-if="userList.length" class="p-2">
              <div class="btns-top flex-col" v-for="item in userList" :key="item.id">
                <div class="flex">
                  <el-button size="small" type="primary" @click="onLeave(item)">搬离</el-button>
                  <el-button size="small" type="warning" @click="changeZoom(item)">搬迁</el-button>
                  <el-button size="small" type="danger" @click="editUser(item)">修改</el-button>
                </div>
                <div class="dis-group flex-col">
                  <div class="dis-item no-wrap">姓名：{{ item.staffName }}</div>
                  <div class="dis-item no-wrap">工号：{{ item.staffId }}</div>
                  <div class="dis-item no-wrap">部门：{{ item.deptName }}</div>
                  <div class="dis-item no-wrap">入住时间：{{ item.moveInDate }}</div>
                </div>
              </div>
            </div>
            <div v-else style="font-size: 13px; line-height: calc(100vh - 300px); color: #aaa; text-align: center">暂无信息~</div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog destroy-on-close draggable v-model="editUserDialogVisible" title="修改入住时间" width="350px">
      <div style="display: flex; align-items: center">
        <span style="margin-right: 10px">入住时间<span style="color: red">*</span></span>
        <el-date-picker
          value-format="YYYY-MM-DD HH:mm:ss"
          :clearable="false"
          v-model="modalTime"
          type="datetime"
          placeholder="请选择时间"
          :shortcuts="shortcuts"
        />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editUserDialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="userHandleClose">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { fetchAllBuliding, fetchDormitoryAllBuliding, fetchDormitoryAllUser, updateDormitoryAllUserDate } from "@/api/oaManage/humanResources";
import { ArrowDown, EditPen, Plus, Delete } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useActionHook } from "./hook";
import { showMessageBox } from "@/utils/message";
import ButtonList from "@/components/ButtonList/index.vue";
import { getEnumDictList } from "@/utils/table";
import { getDeptOptions } from "@/utils/requestApi";

defineOptions({ name: "OaHumanResourcesDormitoryManageIndex" });
const searchOptions = reactive([
  { label: "姓名", value: "userName" },
  { label: "工号", value: "userCode" },
  { label: "部门", value: "deptId", children: [] },
  { label: "在职状态", value: "state", children: [] }
]);

// 每行房间数量
const RoomLimit = 12;

// 选中的是否为D栋
const isD = computed(() => (allBuildings.value.find(({ id }) => id === activeName.value) || "").name);

// 分割房间
const splitList = (arr, index) => {
  const nArr = arr.slice(index * RoomLimit, index * RoomLimit + RoomLimit);
  return nArr;
};

const getAllBuildings = () => {
  fetchAllBuliding({}).then((res: any) => {
    if (res.data) {
      allBuildings.value = res.data;
      activeName.value = res.data[0].id;
      currentBuilding.value = { name: res.data[0].id, label: res.data[0].name };
      fetchCurTabTables(res.data[0].id);
    }
  });
};

const fetchCurTabTables = (id) => {
  loading.value = true;

  fetchDormitoryAllBuliding({ buildingCode: id })
    .then((res: any) => {
      if (res.data) {
        tableData.value = res.data;
      }
    })
    .finally(() => (loading.value = false));
};
const {
  currentId,
  userList,
  loading,
  loading2,
  buttonList,
  buttonList2,
  activeName,
  currentBuilding,
  currentRoom,
  onLeave,
  fetchUsers,
  setPaneProps,
  clickTag,
  changeZoom
} = useActionHook(getAllBuildings, fetchCurTabTables);

const allBuildings = ref([]);
const modalTime = ref("");
const tableData = ref([]);
const searchData: any = ref({});
const currentUserItem: any = ref({});

const editUserDialogVisible = ref(false);

const shortcuts = [
  {
    text: "今天",
    value: new Date()
  },
  {
    text: "昨天",
    value: () => {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24);
      return date;
    }
  },
  {
    text: "一周前",
    value: () => {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
      return date;
    }
  }
];

const userHandleClose = () => {
  if (!modalTime.value) {
    ElMessage({ message: "入住时间必填", type: "warning" });
    return;
  }
  showMessageBox("确认要修改吗？")
    .then(() => {
      const { dormitoryId, id, staffInfoId } = currentUserItem.value;
      const reqParams = {
        dormitoryId,
        id,
        staffInfoId,
        moveInDate: modalTime.value,
        updateTimeDate: modalTime.value
      };
      updateDormitoryAllUserDate(reqParams)
        .then((res) => {
          if (res.data) {
            ElMessage({ message: "修改成功", type: "success" });
            fetchUsers(currentId.value);
          }
        })
        .finally(() => {
          editUserDialogVisible.value = false;
        });
    })
    .catch(() => {});
};

watch(editUserDialogVisible, (newVal) => {
  if (!newVal) modalTime.value = "";
});

const editUser = (item) => {
  if (item.moveInDate) {
    const [date, time] = item.moveInDate.split(" ");
    const dateArr = date.split("-");

    dateArr[0] = "20" + dateArr[0];
    const finalDateStr = dateArr.join("-") + " " + time + ":00";

    modalTime.value = finalDateStr;
  }
  currentUserItem.value = item;
  editUserDialogVisible.value = true;
};

const handleClick = (val) => {
  currentId.value = "";
  userList.value = [];
  setPaneProps(val.props);
  activeName.value = val.paneName;

  if (JSON.stringify(searchData.value) == "{}") {
    fetchCurTabTables(val.paneName);
  } else {
    fetchDormitoryAllBuliding({ buildingCode: activeName.value, ...searchData.value })
      .then((res: any) => {
        if (res.data) {
          tableData.value = res.data.filter((item) => item.value?.length);
          clickTag(tableData.value[0]?.value[0]);
        }
      })
      .finally(() => (loading.value = false));
  }
};

const handleTagSearch = (values) => {
  searchData.value = values;
  loading.value = true;

  if (JSON.stringify(values) == "{}") {
    fetchDormitoryAllBuliding({ buildingCode: activeName.value })
      .then((res: any) => {
        if (res.data) {
          tableData.value = res.data;
          currentId.value = "";
          currentRoom.value = {};
          userList.value = [];
        }
      })
      .finally(() => (loading.value = false));
  } else {
    fetchDormitoryAllBuliding({ buildingCode: activeName.value, ...searchData.value })
      .then((res: any) => {
        if (res.data) {
          tableData.value = res.data.filter((item) => item.value?.length);
          if (!tableData.value.length) {
            userList.value = [];
          }
          clickTag(tableData.value[0]?.value[0]);
        }
      })
      .finally(() => (loading.value = false));
  }
};

const fetchOpts = () => {
  getEnumDictList(["EmployeeStatus"]).then((res) => {
    searchOptions[3].children = res.EmployeeStatus?.map((item) => ({ label: item.optionName, value: item.optionValue }));
  });

  getDeptOptions().then((data) => {
    searchOptions[2].children = data;
  });
};
onMounted(() => {
  fetchOpts();
  getAllBuildings();
});
</script>

<style scoped lang="scss">
.mobile .tab-outer .el-table {
  width: 60% !important;
}
.top_zoom {
  margin-top: 15px;
}

.btns {
  margin-bottom: 5px;
}

.center-content {
  display: flex;

  .tag-name {
    width: 54px;
    margin-bottom: 5px;
    cursor: pointer;
  }

  .right {
    display: flex;
    flex: 1;
    justify-content: center;
    height: calc(100vh - 232px);
    overflow: auto;

    .zoom-info {
      padding: 0 0 8px;
      margin: 0 0 8px 8px;
      font-size: 14px;
      font-weight: bold;
    }

    .zoom-level {
      display: flex;
      justify-content: space-between;
      // padding: 8px 0;
      margin: 0 0 0 8px;
      font-size: 14px;
    }

    .dis-group {
      margin-top: 5px;
      margin-bottom: 20px;
      font-size: 13px;

      .dis-item {
        margin: 0 5px;
      }
    }
  }
}

:deep(.el-table__empty-text) {
  line-height: calc(100vh - 262px);
}
</style>
