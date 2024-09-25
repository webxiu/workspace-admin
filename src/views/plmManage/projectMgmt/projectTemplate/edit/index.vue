<script setup lang="ts">
import { onMounted, ref, reactive } from "vue";
import { useRoute } from "vue-router";
import { fetchProjectSelectOpts, fetchProjectTemplateList, fetchSelectList, getBOMTableRowSelectOptions } from "@/api/plmManage";
import { formRules, formConfigs } from "../utils/config";
import EditForm, { FormConfigItemType } from "@/components/EditForm/index.vue";
import { useEditPage } from "./hook";
import { getProductClassifyList } from "@/views/plmManage/productMgmt/classify/utils/hook";

defineOptions({ name: "PlmManageProjectMgmtProjectTemplateEditIndex" });

const route = useRoute();
const projectSelectOpts: any = ref([]);
const dayOpts: any = ref([]);
const allFormData: any = ref({});

const {
  columnsLeft,
  columnsRight,
  onAddTask,
  leftRowClick,
  rightRowClick,
  onEdit,
  editRight,
  onAddGroup,
  onDelete,
  delRight,
  dataListLeft,
  dataListRight,
  loadingLeft,
  onMoveUp,
  currentLeftRow,
  currentRightRow,
  onMoveGroupUp,
  onMoveGroupDown,
  onMoveDown,
  durationDays,
  onSaveSort,
  onSaveGroupSort,
  loadingRight
} = useEditPage(allFormData);
const formData: any = reactive({
  projectModelCode: "",
  projectModelName: "",
  projectStage: "",
  productCategoryId: "",
  duration: durationDays
});

const classList: any = ref([]);

const addSpanConfigs = (formData) =>
  formConfigs({ selectOpts: projectSelectOpts, isDetail: true, classList, formData }, dayOpts).map((item: FormConfigItemType) => {
    item.colProp = { span: 4 };
    return item;
  });

const fetchProjectOpts = () => {
  fetchProjectSelectOpts({}).then((res) => {
    if (res.data) {
      projectSelectOpts.value = res.data;
    }
  });

  getProductClassifyList({ page: 1, limit: 10000 }).then((data) => (classList.value = data));
};

const fetchDaySelectOpts = () => {
  getBOMTableRowSelectOptions({
    optioncode: "ProjectCycleUnits"
  }).then((res) => {
    if (res.data) {
      dayOpts.value = res.data[0]?.optionList || [];
    }
  });
};

onMounted(() => {
  fetchProjectOpts();
  fetchDaySelectOpts();
  fetchProjectTemplateList({ id: route.query.id, page: 1, limit: 10 }).then((res: any) => {
    if (res.data) {
      const resultData: any = res.data?.records[0];
      allFormData.value = resultData;
      const keys = Object.keys(formData);
      keys.forEach((item) => {
        if (item !== "duration") {
          formData[item] = item === "projectStage" ? resultData[item] + "" : resultData[item];
        }
      });
    }
  });
});

const editLeft = ({ row }) => {
  onEdit(row);
};
</script>

<template>
  <div class="outer">
    <div class="top_form">
      <EditForm :formRules="formRules" :formProps="{ inline: true }" :formInline="formData" :formConfigs="addSpanConfigs(formData)" />
    </div>
    <div class="tables">
      <div class="left_table">
        <div class="left-btn">
          <el-button type="primary" size="small" plain @click="onAddGroup">新增分组</el-button>
          <el-button type="warning" size="small" plain @click="onSaveGroupSort" v-if="dataListLeft.length > 1">保存排序</el-button>
          <el-button v-if="dataListLeft.length > 1" :disabled="currentLeftRow.sort === 1" type="success" size="small" plain @click="onMoveGroupUp"
            >上移</el-button
          >
          <el-button
            v-if="dataListLeft.length > 1"
            :disabled="currentLeftRow.sort === dataListLeft.length"
            type="success"
            size="small"
            plain
            @click="onMoveGroupDown"
            >下移</el-button
          >
        </div>
        <pure-table
          border
          row-key="id"
          class="bill-manage"
          :adaptive="true"
          align-whole="left"
          height="72vh"
          :loading="loadingLeft"
          size="small"
          :data="dataListLeft"
          @row-click="leftRowClick"
          :columns="columnsLeft"
          highlight-current-row
          :show-overflow-tooltip="true"
        >
          <template #operation="data">
            <el-button type="danger" size="small" @click.stop="() => onDelete(data)">删除</el-button>
            <el-button type="warning" size="small" @click.stop="() => editLeft(data)">修改</el-button>
          </template>
        </pure-table>
      </div>
      <div class="right_table">
        <div class="right-btn">
          <el-button type="primary" size="small" plain @click="onAddTask">添加任务</el-button>
          <el-button type="warning" size="small" plain @click="onSaveSort" v-if="dataListRight.length > 1">保存排序</el-button>
          <el-button v-if="dataListRight.length > 1" type="success" size="small" :disabled="currentRightRow.sort == 1" plain @click="onMoveUp">上移</el-button>
          <el-button
            v-if="dataListRight.length > 1"
            type="success"
            :disabled="currentRightRow.sort === dataListRight.length"
            size="small"
            plain
            @click="onMoveDown"
            >下移</el-button
          >
        </div>
        <pure-table
          border
          row-key="id"
          class="bill-manage"
          :adaptive="true"
          align-whole="left"
          height="72vh"
          size="small"
          :loading="loadingRight"
          :data="dataListRight"
          @row-click="rightRowClick"
          :columns="columnsRight"
          highlight-current-row
          :show-overflow-tooltip="true"
        >
          <template #operation="data">
            <el-button type="danger" size="small" @click.stop="() => delRight(data)">删除</el-button>
            <el-button type="warning" size="small" @click.stop="() => editRight(data)">修改</el-button>
          </template>
        </pure-table>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.top_form {
  margin: 16px 0;
}

.tables {
  display: flex;

  .left_table {
    flex: 0.28;

    .left-btn {
      margin-bottom: 10px;
    }
  }

  .right_table {
    flex: 0.72;
    margin-left: 24px;
    overflow-x: auto;

    .right-btn {
      margin-bottom: 10px;
    }
  }
}
</style>
