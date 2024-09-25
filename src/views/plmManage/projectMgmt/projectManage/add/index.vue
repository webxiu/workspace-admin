<script setup lang="ts">
import { onMounted, ref } from "vue";
import { formRules, formConfigs } from "./config";
import EditForm from "@/components/EditForm/index.vue";
import Flow from "./components/flow/index.vue";
import { backProjectList, fetchAllProjectMsgByProjectId } from "@/api/plmManage";
import { useRoute, useRouter } from "vue-router";
import Gantt from "../Gantt.vue";
import { useEleHeight } from "@/hooks";
import { getIdByBillNumber } from "@/api/systemManage";
import { gantt } from "dhtmlx-gantt";
import { getDeptOptions } from "@/utils/requestApi";
import { useUserStore } from "@/store/modules/user";
import { ElMessageBox } from "element-plus";
import { message } from "@/utils/message";

defineOptions({ name: "PlmManageProjectMgmtProjectManageAddIndex" });

const activeNames = ref(["1"]);
const activeName = ref("first");
const isCurrentProjectUser = ref(false);
const flowRef = ref();
const projectFormRef = ref();
const gantRef = ref();
const projectUsers = ref([]);
const formLoading = ref(false);
const productClassifyList = ref([]);
const projectTemplateOptsList = ref([]);
const route = useRoute();
const router = useRouter();
const detailFormInfo: any = ref({});
const maxHeight = useEleHeight(".app-main > .el-scrollbar", 145 + 55 + 32);
const contH = ref(maxHeight.value);
const treeSelectData = ref([]);

const detailPageInfo: any = ref({});
const userStore = useUserStore();

const props = defineProps(["flowInfoData"]);

const handleChange = (val: string[]) => {
  const autoh = val.length ? maxHeight.value : maxHeight.value + 97;
  contH.value = autoh;
  flowRef.value?.setHeight(autoh - 26);
};

const getProjectTaskTree = (projectInfo) => {
  // 末尾的sort原来为sort字段排序，后面解决甘特图那边显示的顺序才加上的，如果后续后端返回的顺序正常的话就可以去除
  const taskList = projectInfo.projectTaskGroupVoList.map((item) => {
    item.projectGroup = {
      duration: item.projectGroup.duration,
      taskVOList: item.taskVOList.sort((a, b) => {
        return a.sort - b.sort;
      }),
      name: item.projectGroup.groupName,
      id: item.projectGroup.id
    };
    return item.projectGroup;
  });

  return taskList;
};

const fetchDetailFormData = (id?, callback?) => {
  flowRef.value.loading = true;
  fetchAllProjectMsgByProjectId({ id: id ?? route.query.id })
    .then((res: any) => {
      if (res.data) {
        detailPageInfo.value = res.data;
        const isSameUser = res.data.projectInfoListVO?.projectUserId === userStore.userInfo.id;
        isCurrentProjectUser.value = isSameUser;
        gantt.clearAll();
        gantRef.value?.setGanttRefData(res.data);
        const copyResultData = JSON.parse(JSON.stringify(res.data));
        detailFormInfo.value = copyResultData?.projectInfoListVO;
        const treeData = getProjectTaskTree(copyResultData);
        flowRef.value.dataList = treeData;

        setTimeout(() => {
          detailFormInfo.value.deptId = detailFormInfo.value.deptId + "";
        });
        if (typeof callback === "function") {
          callback(treeData);
        }
      }
    })
    .finally(() => {
      flowRef.value.loading = false;
    });
};

const getTreeDeptData = () => {
  getDeptOptions().then((data: any) => {
    treeSelectData.value = data;
  });
};

onMounted(() => {
  getTreeDeptData();
  const { billNo, processDefId } = props.flowInfoData || {};

  if (billNo && processDefId) {
    getIdByBillNumber({ billNo, processDefId }, {}).then((res) => {
      if (res.data) {
        fetchDetailFormData(res.data);
      }
    });
  } else {
    fetchDetailFormData();
  }
  handleChange(["1"]);
  if (route.query.modelId) {
    changeModel(route.query.modelId);
  }
});

const changeModel = (val) => {
  console.log(val, "change model val");
};

const onBackToEdit = () => {
  ElMessageBox.confirm(`确认要回退名称为【${detailFormInfo.value.projectName}】的项目吗?`, "系统提示", {
    type: "warning",
    draggable: true,
    cancelButtonText: "取消",
    confirmButtonText: "确定",
    dangerouslyUseHTMLString: true
  }).then(() => {
    backProjectList({ id: route.query.id }).then((res) => {
      if (res.data) {
        router.replace(`/plmManage/projectMgmt/projectManage/edit/index?modelId=${route.query.modelId}&id=${route.query.id}`);
      }
    });
  });
};
</script>

<template>
  <div class="project-add">
    <div style="text-align: right">
      <el-button type="danger" size="small" @click="onBackToEdit"> 回 退 </el-button>
    </div>
    <div class="top-form">
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item title="基础信息" name="1">
          <div>
            <EditForm
              ref="projectFormRef"
              :loading="formLoading"
              :formRules="formRules"
              :formProps="{ inline: true }"
              :formInline="detailFormInfo"
              :formConfigs="
                formConfigs({ projectUsers, isDetail: true, treeSelectData, detailFormInfo, productClassifyList, projectTemplateOptsList, changeModel })
              "
            />
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="bottom-tabs">
      <el-tabs v-model="activeName" type="card" class="demo-tabs">
        <el-tab-pane label="项目流程" name="first"
          ><Flow ref="flowRef" :fetchDetailFormData="fetchDetailFormData" :detailPageInfo="detailPageInfo" :isCurrentProjectUser="isCurrentProjectUser"
        /></el-tab-pane>
        <el-tab-pane label="甘特图" name="second">
          <Gantt ref="gantRef" :style="{ height: contH + 32 + 'px' }" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-form-item) {
  margin-bottom: 0 !important;
}

.project-add {
  .btns {
    margin-right: 20px;
    text-align: right;
  }

  :deep(.el-collapse-item__content) {
    padding-bottom: 0 !important;
  }

  :deep(.el-collapse),
  :deep(.el-collapse-item__wrap) {
    border: none;
  }

  :deep(.el-collapse-item__header) {
    font-size: 15px;
    font-weight: 600;
    color: #409eff;
  }

  .demo-tabs > .el-tabs__content {
    padding: 32px;
    font-size: 32px;
    font-weight: 600;
    color: #6b778c;
  }
}
</style>
