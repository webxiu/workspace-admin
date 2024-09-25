<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useFlow } from "./hook";
import { getBOMTableRowSelectOptions } from "@/api/plmManage";
import dayjs from "dayjs";
import { useRoute, useRouter } from "vue-router";

const props = defineProps(["fetchDetailFormData", "detailPageInfo", "isCurrentProjectUser"]);
const {
  dataList,
  currentTreeRow,
  handleAdd,
  handleEdit,
  onSubmitDeliver,
  onRevokeDeliver,
  clickDeliverName,
  onEditDeliver,
  onEditDeliver2,
  columns,
  flowTableRef,
  clickDeliverName2,
  deliverList,
  clickRow,
  deliverLoading,
  onViewNodeDetailDeliver,
  rowClassName,
  statusOpts,
  rowDbClick,
  cellClick,
  handleDel,
  onChangeDeliver,
  billStateOpts,
  selectChange,
  setTemplateId
} = useFlow(props);
const maxHeight = ref(200);
const loading = ref(false);
const optionStatus = ref([]);

const router = useRouter();
const route = useRoute();
const resourceAuthDeptIds = ref([]);

const setHeight = (val: number) => (maxHeight.value = val);

const fetchOptions = () => {
  getBOMTableRowSelectOptions({ optioncode: "ProjectTaskStatus,BillStatus,PLMResourceAuthEnum" }).then((res) => {
    if (res.data) {
      console.log(res.data, "jsljsl");
      optionStatus.value = res.data.find((item) => item.optionCode === "ProjectTaskStatus")?.optionList;
      billStateOpts.value = res.data.find((item) => item.optionCode === "BillStatus").optionList;
      statusOpts.value = res.data.find((item) => item.optionCode === "ProjectTaskStatus")?.optionList;

      // 资料提交的权限数据
      const resourceFindDeptData = res.data.find((item) => item.optionCode === "PLMResourceAuthEnum")?.optionList?.map((item) => item.optionValue) || [];
      resourceAuthDeptIds.value = resourceFindDeptData;
    }
  });
};

const getStateName = (item) => {
  const state = item.generalTemplateVO?.billState;
  return billStateOpts.value.find((item) => item.optionValue == state)?.optionName || "无数据";
};

const getTagType = (item) => {
  const statusColorType = {
    0: "primary",
    1: "warning",
    2: "success",
    3: "info",
    undefined: "danger"
  };
  const keyInfo = item.generalTemplateVO?.billState;
  return statusColorType[keyInfo];
};

const onPrintAction = () => {
  router.push(`/plmManage/projectMgmt/projectManage/print/index?id=${route.query.id}`);
};

onMounted(() => fetchOptions());

defineExpose({ setHeight, dataList, loading, setTemplateId });
</script>

<template>
  <div class="pro_flow">
    <div style="margin-bottom: 8px; display: flex; align-items: center">
      <el-button type="primary" @click="handleAdd" size="small" :disabled="[3, 4].includes(detailPageInfo.projectInfoListVO?.projectState)">新增</el-button>
      <el-button type="warning" @click="handleEdit" size="small" :disabled="[3, 4].includes(detailPageInfo.projectInfoListVO?.projectState)">编辑</el-button>
      <el-button type="danger" @click="handleDel" size="small" :disabled="[3, 4].includes(detailPageInfo.projectInfoListVO?.projectState)">删除</el-button>
      <el-button type="success" @click="onPrintAction" size="small">打印</el-button>
      <div style="font-size: 14px; margin-left: 16px; color: red">注意：红色字体的任务为已延期任务</div>
      <div style="font-size: 14px; display: flex">
        <div style="display: flex; align-items: center">
          <div style="background-color: #ffbf00; width: 12px; height: 12px; border-radius: 100%; margin-left: 12px; margin-right: 4px" />
          等待
        </div>
        <div style="display: flex; align-items: center">
          <div style="background-color: #00cd66; width: 12px; height: 12px; border-radius: 100%; margin-left: 12px; margin-right: 4px" />
          进行中
        </div>
        <div style="display: flex; align-items: center">
          <div style="background-color: #1e90ff; width: 12px; height: 12px; border-radius: 100%; margin-left: 12px; margin-right: 4px" />
          已完成
        </div>
      </div>
    </div>
    <div style="display: flex">
      <div style="flex: 0.7; overflow-x: auto">
        <pure-table
          border
          :height="maxHeight"
          :max-height="maxHeight"
          row-key="id"
          class="pm-task-table"
          default-expand-all
          ref="flowTableRef"
          :adaptive="true"
          align-whole="left"
          :loading="loading"
          size="small"
          :data="dataList"
          :columns="columns"
          highlight-current-row
          :tree-props="{ children: 'taskVOList', hasChildren: 'hasChildren' }"
          :show-overflow-tooltip="true"
          :row-class-name="rowClassName"
          @row-click="clickRow"
          @row-dblclick="rowDbClick"
          @cell-click="cellClick"
          @selection-change="selectChange"
        >
          <template #status="{ row }">
            <div>{{ optionStatus?.find((item) => item.optionValue == row.status)?.optionName || "" }}</div>
          </template>
        </pure-table>
      </div>
      <div class="deliver" :style="{ height: maxHeight + 'px', paddingLeft: '16px' }" v-loading="deliverLoading">
        <el-empty v-if="!deliverList.length" description="暂无相关信息" />
        <div class="deliver-list" v-else>
          <div class="list_item" v-for="item in deliverList" :key="item.id">
            <div v-if="item.deliverableTemplateId == 14">
              <div class="top-info">
                <div class="deliver-name" @click="clickDeliverName2(item)">
                  <el-tooltip effect="light" :content="item.deliverableName" placement="bottom"> {{ item.deliverableName }}</el-tooltip>
                </div>
                <div class="opt">
                  <el-space :size="12">
                    <el-button
                      :disabled="[3, 4].includes(detailPageInfo.projectInfoListVO?.projectState)"
                      link
                      type="warning"
                      @click="onEditDeliver2(item, detailPageInfo, fetchDetailFormData, flowTableRef, currentTreeRow, resourceAuthDeptIds)"
                      >{{ [1, 2].includes(item.generalTemplateVO?.billState) ? "查看" : "编辑" }}</el-button
                    >
                    <el-button
                      link
                      :disabled="[3, 4].includes(detailPageInfo.projectInfoListVO?.projectState)"
                      v-if="[0, 3].includes(item.generalTemplateVO?.billState)"
                      type="success"
                      @click="onSubmitDeliver(item, detailPageInfo, fetchDetailFormData, flowTableRef, resourceAuthDeptIds)"
                      >提交</el-button
                    >
                    <el-button
                      link
                      :disabled="[3, 4].includes(detailPageInfo.projectInfoListVO?.projectState)"
                      v-if="[1].includes(item.generalTemplateVO?.billState)"
                      type="danger"
                      @click="onRevokeDeliver(item, detailPageInfo, fetchDetailFormData, flowTableRef, resourceAuthDeptIds)"
                      >撤销</el-button
                    >
                  </el-space>
                </div>
                <div class="status">
                  <el-tag effect="light" @click="onViewNodeDetailDeliver(item)" :type="getTagType(item)">{{ getStateName(item) }}</el-tag>
                </div>
              </div>
              <div class="userHistory">
                <div class="name">{{ item.generalTemplateVO?.modifyUserName || "" }}</div>
                <div class="date">{{ item.generalTemplateVO?.modifyDate ? dayjs(item.generalTemplateVO?.modifyDate).format("YYYY-MM-DD HH:mm:ss") : "" }}</div>
              </div>
            </div>
            <div v-else>
              <div class="top-info">
                <div class="deliver-name" @click="clickDeliverName(item)">
                  <el-tooltip effect="light" :content="item.deliverableName" placement="bottom"> {{ item.deliverableName }}</el-tooltip>
                </div>
                <div class="opt">
                  <el-space :size="12">
                    <el-button
                      :disabled="[3, 4].includes(detailPageInfo.projectInfoListVO?.projectState)"
                      link
                      type="warning"
                      @click="onEditDeliver(item, detailPageInfo, fetchDetailFormData, flowTableRef, currentTreeRow, resourceAuthDeptIds)"
                      >{{ [1, 2].includes(item.generalTemplateVO?.billState) ? "查看" : "编辑" }}</el-button
                    >
                    <el-button
                      link
                      :disabled="[3, 4].includes(detailPageInfo.projectInfoListVO?.projectState)"
                      v-if="[0, 3].includes(item.generalTemplateVO?.billState)"
                      type="success"
                      @click="onSubmitDeliver(item, detailPageInfo, fetchDetailFormData, flowTableRef, resourceAuthDeptIds)"
                      >提交</el-button
                    >
                    <el-button
                      link
                      :disabled="[3, 4].includes(detailPageInfo.projectInfoListVO?.projectState)"
                      v-if="[1].includes(item.generalTemplateVO?.billState)"
                      type="danger"
                      @click="onRevokeDeliver(item, detailPageInfo, fetchDetailFormData, flowTableRef, resourceAuthDeptIds)"
                      >撤销</el-button
                    >
                    <el-button
                      link
                      v-if="[2].includes(item.generalTemplateVO?.billState)"
                      type="primary"
                      @click="onChangeDeliver(item, detailPageInfo, fetchDetailFormData, flowTableRef, resourceAuthDeptIds)"
                      >变更</el-button
                    >
                  </el-space>
                </div>
                <div class="status">
                  <el-tag effect="light" @click="onViewNodeDetailDeliver(item)" :type="getTagType(item)">{{ getStateName(item) }}</el-tag>
                </div>
              </div>
              <div class="userHistory">
                <div class="name">{{ item.generalTemplateVO?.modifyUserName || "" }}</div>
                <div class="date">{{ item.generalTemplateVO?.modifyDate ? dayjs(item.generalTemplateVO?.modifyDate).format("YYYY-MM-DD HH:mm:ss") : "" }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.deliverable-modal {
  .deliverable-upload {
    ul {
      max-height: 200px;
      overflow: auto;
    }
  }
}

.deliver {
  flex: 0.3;
  overflow: auto;

  .list_item {
    margin-bottom: 32px;

    .top-info {
      display: flex;
      align-items: center;
    }

    .userHistory {
      display: flex;
      margin-top: 6px;
      font-size: 14px;

      .name {
        flex: 0.42;
      }

      .date {
        flex: 0.58;
      }
    }

    .deliver-name {
      flex: 0.5;
      overflow: hidden;
      font-size: 14px;
      color: #4ca4ff;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
    }

    .opt {
      flex: 0.4;
      font-size: 14px;
      text-align: left;
    }

    .status {
      cursor: pointer;
      width: 100px;
      text-align: right;
    }
  }
}
</style>
