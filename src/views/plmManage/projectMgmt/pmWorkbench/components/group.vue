<template>
  <div class="group" :style="{ 'background-color': titleGroup[type].bgColor }">
    <div class="top">
      <div class="left">
        <div class="title-btn">
          <el-button :color="titleGroup[type].color" type="primary" size="small" :icon="titleGroup[type].icon"
            ><span :class="{ txt: true, 'white-txt': type !== '1' }">{{ titleGroup[type].title + " " + todoList.length }}</span></el-button
          >
        </div>
      </div>
    </div>
    <div class="center-list" @mouseover.stop="item.showFloatPop = true" @mouseleave.stop="item.showFloatPop = false" v-for="(item, idx) in todoList" :key="idx">
      <div class="task">
        <span v-if="!item.editTaskNameFlag" @click="item.editTaskNameFlag = true">{{ item.taskName }}</span>
        <span v-else>
          <el-input placeholder="请输入任务名称" v-model="item.taskName" size="small" @blur="item.editTaskNameFlag = false" />
        </span>
      </div>
      <div class="right-pop" v-if="item.showFloatPop" aria-hidden>
        <div class="icon-list">
          <div class="icon-item">
            <el-icon><Check /></el-icon>
          </div>
          <div class="icon-item" style="margin: 0 8px">
            <el-icon>
              <Plus v-if="!subtaskRef[idx].showAdd" @click.stop="() => addSubtask(idx)" />
              <Close v-else @click.stop="() => (subtaskRef[idx].showAdd = false)" />
            </el-icon>
          </div>
          <div class="icon-item" @click="() => delItem(idx)">
            <el-icon><Delete /></el-icon>
          </div>
        </div>
      </div>
      <el-popover
        v-model:visible="item.visiblePop"
        aria-hidden
        class="user-pop"
        :show-arrow="false"
        placement="bottom-start"
        :offset="4"
        :width="260"
        trigger="click"
      >
        <template #reference>
          <div class="user">
            <div class="pre-icon">
              <el-icon><UserFilled /></el-icon>
            </div>
            <div class="desc">{{ item.curUserName }}</div>
          </div>
        </template>
        <template #default>
          <div class="search">
            <el-input v-model="formData.searchUserName" @change="changeSearchName" size="small" placeholder="请输入姓名" :prefix-icon="Search" />
          </div>
          <div class="line"><el-divider style="margin: 8px 0" /></div>
          <div class="user-list">
            <div class="user-item" v-for="(el, idx2) in userList" :key="idx2" @click="() => clickName(el, idx)">
              <div class="avatar">
                <el-avatar :size="20" :src="el.avatar" />
              </div>
              <div class="name">{{ el.userName }}</div>
            </div>
          </div>
        </template>
      </el-popover>
      <div class="date" @click.stop="() => clickDate(idx)">
        <div class="pre-icon">
          <el-icon><Calendar /></el-icon>
        </div>
        <div class="desc">{{ item.endDate || "截止日期" }}</div>
      </div>
      <el-date-picker
        ref="dateRef"
        placement="right-end"
        v-model="item.endDate"
        type="date"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        placeholder="请选择"
        size="small"
        style="display: none"
      />

      <el-popover v-model:visible="item.visiblePop2" :show-arrow="false" placement="bottom-start" :offset="4" :width="250" trigger="click">
        <template #reference>
          <div class="priority">
            <div class="pre-icon">
              <el-icon :color="curFlagColor"><Flag /></el-icon>
            </div>
            <div class="desc">{{ item.curFlagName || "优先级" }}</div>
          </div>
        </template>
        <template #default>
          <div class="priority-list">
            <div class="top-list">
              <div
                :class="{ 'flag-item': true, 'active-flag': item.curFlagName === el.name }"
                v-for="(el, idx2) in priorityOpts"
                :key="idx2"
                @click="() => clickFlagItem(item, el, idx)"
              >
                <div class="icon">
                  <el-icon :size="14" :color="el.color"><Flag /></el-icon>
                </div>
                <div class="txt">{{ el.name }}</div>
              </div>
            </div>
            <div class="line"><el-divider style="margin: 8px 0" /></div>
            <div class="clear">
              <div class="icon">
                <el-icon :size="14"><Flag /></el-icon>
              </div>
              <div class="txt" @click="() => clearFlag(item)">清除</div>
            </div>
          </div>
        </template>
      </el-popover>
      <div class="subtask-collapse" @click="item.arrowRight = !item.arrowRight" v-if="item.children?.length">
        <div class="pre-icon">
          <el-icon v-if="item.arrowRight"><CaretRight /></el-icon>
          <el-icon v-if="!item.arrowRight"><CaretBottom /></el-icon>
        </div>
        <div class="desc">{{ "二级任务" + " " + (item.children?.length ?? 0) }}</div>
      </div>
      <subtask ref="subtaskRef" :arrowRight="item.arrowRight" :childrenList="item.children" />
    </div>

    <div class="center" v-if="showAdd">
      <div class="task">
        <el-input style="margin-right: 4px" v-model="formData.taskName" size="small" placeholder="任务名称" />
        <el-button color="#7f77f1" size="small" :disabled="!formData.taskName" type="primary" style="height: 22px" @click="onSaveFd">
          <span style="color: #fff; font-size: 10px">保存</span>
        </el-button>
      </div>

      <el-popover v-model:visible="visibleFdPop" class="user-pop" :show-arrow="false" placement="bottom-start" :offset="4" :width="260" trigger="click">
        <template #reference>
          <div class="user">
            <div class="pre-icon">
              <el-icon><UserFilled /></el-icon>
            </div>
            <div class="desc">{{ formData.curUserName || "指派人员" }}</div>
          </div>
        </template>
        <template #default>
          <div class="search">
            <el-input v-model="formData.searchUserName" @change="changeSearchName" size="small" placeholder="请输入姓名" :prefix-icon="Search" />
          </div>
          <div class="line"><el-divider style="margin: 8px 0" /></div>
          <div class="user-list">
            <div class="user-item" v-for="(item, idx) in userList" :key="idx" @click="() => clickNameFd(item)">
              <div class="avatar">
                <el-avatar :size="20" :src="item.avatar" />
              </div>
              <div class="name">{{ item.userName || "指派人员" }}</div>
            </div>
          </div>
        </template>
      </el-popover>
      <div class="date" @click.stop="clickDateFd">
        <div class="pre-icon">
          <el-icon><Calendar /></el-icon>
        </div>
        <div class="desc">{{ formData.endDate || "截止日期" }}</div>
      </div>
      <el-date-picker
        ref="dateFdRef"
        placement="right-end"
        v-model="formData.endDate"
        type="date"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        placeholder="请选择"
        size="small"
        style="display: none"
      />

      <el-popover v-model:visible="visibleFdPop2" :show-arrow="false" placement="bottom-start" :offset="4" :width="250" trigger="click">
        <template #reference>
          <div class="priority">
            <div class="pre-icon">
              <el-icon><Flag /></el-icon>
            </div>
            <div class="desc">{{ formData.curFlagName || "优先级" }}</div>
          </div>
        </template>
        <template #default>
          <div class="priority-list">
            <div class="top-list">
              <div
                :class="{ 'flag-item': true, 'active-flag': formData.curFlagName === item.name }"
                v-for="(item, idx) in priorityOpts"
                :key="idx"
                @click="() => clickFlagItemFd(item)"
              >
                <div class="icon">
                  <el-icon :size="14" :color="item.color"><Flag /></el-icon>
                </div>
                <div class="txt">{{ item.name }}</div>
              </div>
            </div>
            <div class="line"><el-divider style="margin: 8px 0" /></div>
            <div class="clear">
              <div class="icon">
                <el-icon :size="14"><Flag /></el-icon>
              </div>
              <div class="txt" @click="clearFlagFd">清除</div>
            </div>
          </div>
        </template>
      </el-popover>
    </div>
    <div class="bottom">
      <div class="add">
        <el-button
          style="box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12)"
          v-if="!showAdd"
          :color="titleGroup[type].bgColor"
          type="primary"
          class="ui-w-100"
          :icon="CirclePlusFilled"
          @click="addMainTask"
          ><span>{{ titleGroup[type].title }}</span></el-button
        >
        <el-button
          style="box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12)"
          v-if="showAdd"
          :color="titleGroup[type].bgColor"
          type="primary"
          class="ui-w-100"
          :icon="CloseBold"
          @click="showAdd = false"
          ><span>取消添加</span></el-button
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { message } from "@/utils/message";
import {
  Opportunity,
  Check,
  UserFilled,
  CaretBottom,
  CaretRight,
  Calendar,
  Flag,
  CloseBold,
  Search,
  CirclePlusFilled,
  CircleCheckFilled,
  Delete,
  Close,
  Plus
} from "@element-plus/icons-vue";
import dayjs from "dayjs";
import { ref } from "vue";
import subtask from "./subtask.vue";

const props = defineProps(["type"]);

const titleGroup = {
  1: { title: "待办任务", color: "#ddd", bgColor: "#f3f3f5", icon: Opportunity },
  2: { title: "进行任务", color: "#0880ea", bgColor: "#f2f8fe", icon: Opportunity },
  3: { title: "完成任务", color: "#299764", bgColor: "#f4faf7", icon: CircleCheckFilled }
};

const formData: any = ref({ curUserName: "", curFlagName: "" });
const todoList = ref([
  {
    taskName: "测试任务名称",
    curUserName: "李秀海",
    endDate: dayjs().format("YYYY-MM-DD"),
    curFlagName: "紧急",
    showFloatPop: false,
    editTaskNameFlag: false,
    visiblePop: false,
    visiblePop2: false,
    arrowRight: true,
    children: [
      {
        taskName: "c1",
        curUserName: "李秀海",
        endDate: dayjs().format("YYYY-MM-DD"),
        curFlagName: "紧急",
        showFloatPop: false,
        editTaskNameFlag: false,
        visiblePop: false,
        visiblePop2: false,
        arrowRight: true
      }
    ]
  },
  {
    taskName: "测试任务名称2",
    curUserName: "谢健",
    endDate: dayjs().format("YYYY-MM-DD"),
    curFlagName: "高",
    showFloatPop: false,
    editTaskNameFlag: false,
    visiblePop: false,
    visiblePop2: false,
    arrowRight: true,
    children: [
      {
        taskName: "c2",
        curUserName: "谢健",
        endDate: dayjs().format("YYYY-MM-DD"),
        curFlagName: "紧急",
        showFloatPop: false,
        editTaskNameFlag: false,
        visiblePop: false,
        visiblePop2: false,
        arrowRight: true
      }
    ]
  }
]);
const curUserName = ref("指派人员");
// const arrowRight = ref(true);
const visibleFdPop = ref(false);
const subtaskRef = ref();
const curFlagColor = ref("");
const visibleFdPop2 = ref(false);
const dateRef = ref();
const dateFdRef = ref();
const showAdd = ref(false);
const userList = ref([
  {
    avatar: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
    userName: "李秀海"
  },
  {
    avatar: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
    userName: "谢健"
  }
]);

const priorityOpts = ref([
  { status: 1, name: "紧急", color: "#c62a2f" },
  { status: 2, name: "高", color: "#ffc53d" },
  { status: 3, name: "一般", color: "#3e63dd" },
  { status: 4, name: "低", color: "#bbbbbb" }
]);

const delItem = (idx) => {
  todoList.value.splice(idx, 1);
};

const addMainTask = () => {
  showAdd.value = true;
  subtaskRef.value.showAdd = false;
};

const onSaveFd = () => {
  if (!formData.value.curUserName) {
    return message.warning("指派人员必填");
  }
  if (!formData.value.endDate) {
    return message.warning("截止日期必填");
  }
  if (!formData.value.curFlagName) {
    return message.warning("优先级必填");
  }
  todoList.value.push(formData.value);
  showAdd.value = false;
  formData.value = { curUserName: "", curFlagName: "" };
};

const clickName = (item, idx) => {
  // curUserName.value = item.userName;
  todoList.value[idx].visiblePop = false;
  todoList.value[idx].curUserName = item.userName;
};

const clickNameFd = (item) => {
  formData.value.curUserName = item.userName;
  visibleFdPop.value = false;
};

const clickDate = (idx) => {
  dateRef.value[idx]!.handleOpen();
};

const clickDateFd = () => {
  dateFdRef.value!.handleOpen();
};

const clickFlagItem = (item, el, idx) => {
  // item.curFlagName = el.name;
  // curFlagColor.value = el.color;
  // visiblePop2.value = false;

  todoList.value[idx].visiblePop2 = false;
  todoList.value[idx].curFlagName = el.name;
};

const clickFlagItemFd = (item) => {
  formData.value.curFlagName = item.name;

  visibleFdPop2.value = false;
};

const clearFlag = (item) => {
  item.curFlagName = "";
  item.visiblePop2 = false;
};

const addSubtask = (idx) => {
  subtaskRef.value[idx].showAdd = true;
  showAdd.value = false;
};

const clearFlagFd = () => {
  visibleFdPop2.value = false;
  formData.value.curFlagName = "";
};

const changeSearchName = (val) => {
  if (val) {
    userList.value = userList.value.filter((el) => el.userName.includes(val));
  } else {
    userList.value = [
      {
        avatar: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
        userName: "李秀海"
      },
      {
        avatar: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
        userName: "谢健"
      }
    ];
  }
};
</script>

<style scoped lang="scss">
.search {
  :deep(.el-input__wrapper.is-focus) {
    box-shadow: none;
  }
}

.priority-list {
  .top-list {
    .flag-item {
      display: flex;
      align-items: center;
      padding: 4px 4px;
      &:nth-last-child(1) {
        margin-bottom: 0;
      }

      &:hover {
        background-color: #ddd;
        border-radius: 4px;
        cursor: pointer;
      }

      .icon {
        display: flex;
        align-items: center;
      }
      .txt {
        display: flex;
        margin-left: 4px;
        font-size: 14px;
        line-height: 6px;
      }
    }

    .active-flag {
      background-color: #ddd;
      border-radius: 4px;
      cursor: pointer;
    }
  }

  .clear {
    display: flex;
    align-items: center;
    padding: 4px 4px;

    &:hover {
      background-color: #ddd;
      border-radius: 4px;
      cursor: pointer;
    }

    .icon {
      display: flex;
      align-items: center;
    }
    .txt {
      display: flex;
      margin-left: 4px;
      font-size: 14px;
      line-height: 6px;
    }
  }
}

.user-list {
  .user-item {
    display: flex;
    align-items: center;
    margin: 6px 0;
    padding: 4px 8px;
    &:hover {
      background-color: #ddd;
      border-radius: 4px;
      cursor: pointer;
    }

    .avatar {
      display: flex;
    }
    .name {
      display: flex;
      margin-left: 6px;
      line-height: 8px;
    }
  }
}
.group {
  background-color: #f3f3f5;
  border-radius: 8px;
  padding: 8px;

  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;

    .left,
    .right {
      display: flex;
      align-items: center;
    }

    .left {
      .task-total {
        font-size: 14px;
        margin-left: 16px;
      }

      :deep(.el-icon) {
        // color: #aaa;
      }

      .title-btn .txt,
      .task-total {
        color: #656f7d;
      }

      .white-txt {
        color: #fff !important;
        font-weight: bold;
      }
    }

    .right {
      :deep(.el-icon) {
        font-size: 13px;
        color: #656f7d;
        cursor: pointer;
      }

      .more {
        margin-right: 16px;
      }
    }
  }

  .center,
  .center-list {
    margin-bottom: 8px;
    border: 1px solid #7f77f1;
    border-radius: 6px;
    padding: 4px 8px;
    color: #656f7d;
    .task {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
    }

    :deep(.el-input__wrapper.is-focus) {
      box-shadow: none;
    }

    .user,
    .date,
    .subtask-collapse,
    .priority {
      display: flex;
      align-items: center;
      font-size: 13px;
      padding: 4px 8px;
      vertical-align: baseline;
      margin: 4px 0;
      :deep(.el-icon) {
        font-size: 13px;
        display: flex;
      }

      .desc {
        margin-left: 6px;
        display: flex;
        font-size: 13px;
        line-height: 13px;
      }

      &:hover {
        background-color: #ddd;
        border-radius: 4px;
        cursor: pointer;
      }
    }
  }

  .center-list {
    background-color: #fff;
    border-color: #ddd;
    position: relative;
    .task {
      font-size: 14px;
      font-weight: 900;
      color: #000;
    }

    .right-pop {
      position: absolute;
      right: 2px;
      top: 2px;
      font-size: 14px;
      padding: 2px 8px;
      border-radius: 6px;
      box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
      border: 1px solid #ddd;

      .icon-list {
        display: flex;
        padding: 4px 0;
        align-items: center;
        justify-content: space-between;

        .icon-item {
          display: flex;
          cursor: pointer;
          font-size: 16px;
        }
      }
    }
  }

  .bottom {
    display: flex;
    align-items: center;
    vertical-align: middle;
    padding: 4px 0 0 0;
    color: #656f7d;

    :deep(.el-icon) {
      font-size: 13px;
      color: #656f7d;
    }

    .txt {
      font-size: 14px;
      margin-left: 4px;
    }

    .add {
      width: 100%;
    }
  }
}
</style>
