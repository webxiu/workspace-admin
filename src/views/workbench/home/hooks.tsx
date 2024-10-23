import { Calendar, Clock, Plus, SetUp, WindPower } from "@element-plus/icons-vue";
import { FastEntryItemType, FastEntryLeftItemType, addFastEntry, fastEntry, fastEntryLeftList, fastEntryRightList, getPendingTask } from "@/api/user/user";
import { h, onMounted, reactive, ref } from "vue";
import { message, showMessageBox } from "@/utils/message";

import DateTime from "./components/DateTime.vue";
import EditForm from "@/components/EditForm/index.vue";
import FasterEntry from "./components/FasterEntry.vue";
import MyCalendar from "./components/MyCalendar.vue";
import TaskStatus from "./components/TaskStatus.vue";
import { addDialog } from "@/components/ReDialog";
import { getTreeArrItem } from "@/utils/common";
import { removeChatMsg } from "./components/KimiChat/utils";
import { useAppStore } from "@/store/modules/app";
import { useEleHeight } from "@/hooks";
import { useRouter } from "vue-router";

export interface TaskStatusType {
  /** 标题 */
  title: string;
  /** 字段(匹配接口返回) */
  field: string;
  /** 创建的任务 */
  search_from: string;
  /** 状态 */
  task_state: string;
  /** 状态数量 */
  value: number;
  /** 任务树形列表选择id */
  id: string;
}

/** 状态名称 */
export const statusText = {
  1: "已暂停",
  2: "待处理"
};

const maxCount = 9; // 快捷入口最大数量

export const useHome = () => {
  const kimiChatRef = ref();
  const router = useRouter();
  const appstore = useAppStore();
  const isFullScreen = ref<boolean>(false);
  const entryLoading = ref<boolean>(false);
  const entryAddLoading = ref<boolean>(false);
  const entryList = ref<FastEntryItemType[]>([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", -20);

  const taskPendingList = reactive<TaskStatusType[]>([
    // 待处理
    { title: "我创建的任务", field: "createWait", search_from: "2", task_state: "2", id: "2.2", value: 0 },
    // 已暂停
    { title: "我创建的任务", field: "createSuspend", search_from: "2", task_state: "1", id: "2.1", value: 0 },
    // 待处理
    { title: "我负责的任务", field: "responsibilityWait", search_from: "3", task_state: "2", id: "3.2", value: 0 },
    // 已暂停
    { title: "我负责的任务", field: "responsibilitySuspend", search_from: "3", task_state: "1", id: "3.1", value: 0 }
  ]);

  onMounted(() => {
    getTaskStatus();
    getFastEntryData();
  });

  // 获取处理任务
  const getTaskStatus = () => {
    getPendingTask()
      .then(({ data }) => {
        if (!data) return;
        taskPendingList.forEach((item) => data[item.field] && (item.value = data[item.field]));
      })
      .catch(console.log);
  };

  // 获取快捷入口列表
  const getFastEntryData = () => {
    entryLoading.value = true;
    fastEntry()
      .then(({ data }) => {
        entryLoading.value = false;
        if (!data?.length) return;
        entryList.value = data;
      })
      .catch(() => (entryLoading.value = false));
  };

  // 添加快捷入口
  const onAddFastEntry = () => {
    const formRef = ref();
    const menuList = ref<FastEntryLeftItemType[]>([]);
    const _formData = reactive({ menuIds: [] });

    const p1 = fastEntryLeftList();
    const p2 = fastEntryRightList();
    entryAddLoading.value = true;
    Promise.all([p1, p2])
      .then((data) => {
        entryAddLoading.value = false;
        const res1 = data[0];
        const res2 = data[1];
        if (res1.status === 200) menuList.value = res1.data;
        if (res2.status === 200) _formData.menuIds = res2.data.map((item) => item.menuId);
      })
      .catch(() => (entryAddLoading.value = false));

    const render = ({ formModel, row }) => (
      <el-transfer
        data={menuList.value}
        v-model={formModel[row.prop]}
        filterable
        props={{ key: "menuId", label: "menuName" }}
        filter-placeholder="关键词搜索"
        titles={["关键词搜索", "我的快捷入口"]}
      />
    );
    addDialog({
      title: "为快捷入口添加项目",
      props: {
        loading: entryAddLoading,
        formInline: _formData,
        formProps: {},
        formRules: { menuIds: [{ required: true, message: "请选择项目", trigger: "blur" }] },
        formConfigs: [{ label: "", prop: "menuIds", colProp: { span: 24 }, render: render }]
      },
      width: "750px",
      draggable: true,
      fullscreenIcon: false,
      closeOnClickModal: false,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        if (_formData.menuIds.length > maxCount) {
          return message(`最多只能设置${maxCount}个快捷入口！`, { type: "warning" });
        }
        FormRef.validate((valid) => {
          if (valid) {
            showMessageBox(`确认要添加吗?`).then(() => {
              addFastEntry({ menuIds: _formData.menuIds.join(",") })
                .then(({ data }) => {
                  if (data) {
                    done();
                    message("添加成功");
                    getFastEntryData();
                  } else {
                    message("添加失败", { type: "error" });
                  }
                })
                .catch(console.log);
            });
          }
        });
      }
    });
  };

  // 点击任务状态 跳转到审核地址
  const onTaskClick = (item: TaskStatusType) => {
    const menuId = getTreeArrItem(appstore.asyncRoutes, "path", "/workbench/infoCenter/index").id;
    const { search_from, task_state, id } = item;
    router.push({ path: "/workbench/infoCenter/index", query: { menuId: menuId, search_from, task_state, id, type: "normal" } });
  };

  // 快捷入口跳转
  const onFastClick = (item: FastEntryItemType) => {
    if (!item.web_router) return message("跳转地址错误", { type: "error" });
    router.push({ path: item.web_router, query: { menuId: item.menuId, menuName: item.menuName } });
  };

  function onFullScreen() {
    isFullScreen.value = !isFullScreen.value;
  }

  function onClearChat() {
    removeChatMsg(kimiChatRef);
  }

  const homeList = [
    {
      icon: WindPower,
      name: "待处理",
      body: () => <TaskStatus style={{ height: "300px" }} taskPendingList={taskPendingList} onClick={onTaskClick} />
    },
    {
      icon: SetUp,
      name: "快捷入口",
      handle: () => (
        <el-button class="button" type="primary" link onClick={onAddFastEntry} icon={Plus}>
          点击添加
        </el-button>
      ),
      body: () => <FasterEntry style={{ height: "300px" }} entryList={entryList.value} loading={entryLoading.value} onClick={onFastClick} />
    },
    { icon: Clock, name: "时间", body: () => <DateTime style={{ minHeight: "308px" }} /> },
    { icon: Calendar, name: "日历", body: () => <MyCalendar /> }
  ];

  return { maxHeight, homeList, kimiChatRef, isFullScreen, onFullScreen, onClearChat };
};
