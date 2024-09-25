<!-- /*
 * @Author: Hailen 
 * @Date: 2023-07-05 11:45:27 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-08-21 11:45:27 
 */ -->

<script setup lang="ts">
import AddModal from "./addModal.vue";
import { message, showMessageBox } from "@/utils/message";
import { ref, PropType, h, computed, reactive } from "vue";
import { addDialog } from "@/components/ReDialog";
import { FlowTaskItemType } from "@/api/systemManage";
import { PureTableBar } from "@/components/RePureTableBar";
import { TaskApprovalInfoItemType, getTaskApprovalInfo } from "@/api/systemManage";
import EditForm, { FormConfigItemType, FormModelType } from "@/components/EditForm/index.vue";

const props = defineProps({
  taskList: {
    type: Array as PropType<FlowTaskItemType[]>,
    default: () => []
  },
  tableList: {
    type: Array as PropType<TaskApprovalInfoItemType[]>,
    default: () => []
  },
  formInline: {
    type: Object as PropType<FormModelType>,
    default: () => ({ personFrom: "", persons: "", finishAdviceWay: [], roleId: "", taskId: "" })
  },
  formConfigs: {
    type: Array as PropType<FormConfigItemType[]>,
    default: () => []
  },
  loading: { type: Boolean, default: false }
});

const maxHeight = 520;
const tableLoading = ref<boolean>(false);
const newFormInline = ref(props.formInline);
const queryData = ref();
const dataListObj = reactive<{ [key: string]: TaskApprovalInfoItemType[] }>({
  用户: [],
  角色: []
});
const rowsData = ref<TaskApprovalInfoItemType[]>([]);
const tableRef = ref();

const columns = computed<TableColumnList[]>(() => {
  const { personFrom } = props.formInline;
  const colObj = {
    用户: [
      { type: "selection" }, //
      { label: "工号", prop: "userCode" },
      { label: "姓名", prop: "userName" },
      { label: "操作", slot: "operation" }
    ],
    角色: [
      { type: "selection" }, //
      { label: "角色编号", prop: "roleCode" },
      { label: "角色名称", prop: "roleName" },
      { label: "操作", slot: "operation" }
    ]
  };
  return colObj[personFrom] || colObj["用户"];
});
const dataList = computed<TaskApprovalInfoItemType[]>(() => {
  const { personFrom } = props.formInline;
  return dataListObj[personFrom] || [];
});

const getTableData = (data) => {
  if (!data) return;
  tableLoading.value = true;
  getTaskApprovalInfo(data)
    .then(({ data }) => {
      tableLoading.value = false;
      Object.keys(dataListObj).forEach((key) => (dataListObj[key] = []));
      Object.keys(data).forEach((key) => {
        if (key === "finishAdviceWay") {
          newFormInline.value.finishAdviceWay = data[key].split(",").filter(Boolean);
        } else {
          newFormInline.value.personFrom = key;
          dataListObj[key] = (data[key] as TaskApprovalInfoItemType[]) || [];
        }
      });
    })
    .catch(() => (tableLoading.value = false));
};
const handleSelectionChange = (rows: TaskApprovalInfoItemType[]) => {
  rowsData.value = rows;
};

const onRowClick = (row: TaskApprovalInfoItemType) => {
  // tableRef.value?.getTableRef()?.toggleRowSelection(row);
};

const onAdd = () => {
  const formRef = ref();
  const { personFrom, taskId } = props.formInline;
  const title = personFrom === "用户" ? "选择用户" : "系统角色列表";
  const personType = personFrom === "用户" ? "user" : "role";

  if (!["用户", "角色"].includes(personFrom)) {
    return message("审批方式是用户或角色才能添加", { type: "error" });
  } else if (!taskId) {
    return message("请选择任务列表", { type: "error" });
  }

  addDialog({
    title: title,
    props: { personType: personType },
    width: "840px",
    draggable: true,
    fullscreenIcon: true,
    destroyOnClose: true,
    closeOnClickModal: false,
    showResetButton: false,
    contentRenderer: () => h(AddModal, { ref: formRef }),
    beforeSure: (done, { options }) => {
      const FormRef = formRef.value.getRef();
      showMessageBox(`确认要添加吗?`)
        .then(() => {
          if (FormRef.length > 0) {
            const tableData = dataListObj[newFormInline.value.personFrom];
            const selectIds = tableData.map((item) => item.id);
            const newList = FormRef.filter((item) => !selectIds.includes(item.id));
            dataListObj[newFormInline.value.personFrom] = [...tableData, ...newList];
            message("添加成功");
            done();
          } else {
            message("未选择" + personFrom, { type: "warning" });
          }
        })
        .catch(console.log);
    }
  });
};

// 单个删除
const onDelete = (row) => {
  onDeleteUpdate([row]);
};

// 批量删除
const onDeleteAll = () => {
  onDeleteUpdate(rowsData.value);
};

// 执行删除
const onDeleteUpdate = (rows: TaskApprovalInfoItemType[]) => {
  if (rows.length <= 0) {
    return message("请选择删除" + props.formInline.personFrom, { type: "error" });
  }
  showMessageBox(`确认要删除吗?`)
    .then(() => {
      const selectIds = rows.map((item) => item.id);
      const newDataList = dataListObj[newFormInline.value.personFrom].filter((item) => !selectIds.includes(item.id));
      dataListObj[newFormInline.value.personFrom] = newDataList;
    })
    .catch(console.log);
};

function getTableList(data) {
  queryData.value = data;
  getTableData(data);
}

function getRef() {
  return dataList.value;
}
defineExpose({ getRef, getTableList });
</script>

<template>
  <div class="ui-w-100 ui-h-100 flex-col flex-1 main main-content">
    <div class="flex flex-1 ui-h-100 ui-w-100 ui-ov-h">
      <EditForm
        :formConfigs="formConfigs"
        :formInline="newFormInline"
        :loading="loading"
        labelWidth="140px"
        style="width: 45%"
        :formProps="{ labelPosition: 'top' }"
      />
      <PureTableBar :columns="columns" :showIcon="false" style="width: 55%; padding-top: 0">
        <template #title>
          <div>
            <el-button type="primary" @click="onAdd">新增</el-button>
            <el-button type="danger" @click="onDeleteAll">批量删除</el-button>
          </div>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            ref="tableRef"
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="id"
            class="user-manage"
            :adaptive="true"
            align-whole="center"
            :loading="tableLoading"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            highlight-current-row
            :default-expand-all="true"
            :show-overflow-tooltip="true"
            @row-click="onRowClick"
            @selection-change="handleSelectionChange"
          >
            <template #operation="{ row }">
              <el-button size="small" @click.stop="onDelete(row)">删除</el-button>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
