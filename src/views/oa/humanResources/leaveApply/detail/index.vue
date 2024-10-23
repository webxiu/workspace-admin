<!-- /*
 * @Author: Hailen
 * @Date: 2023-07-05 11:45:27
 * @Last Modified by:   Hailen
 * @Last Modified time: 2023-07-05 11:45:27
 */ -->

<script setup lang="tsx">
import { onMounted, h, reactive, ref, watch } from "vue";
import {
  modifyLeaveApplyDetailList,
  LeaveApplyDetailItemType,
  addUserLeaveApply,
  saveUserLeaveApply,
  addSaveUserLeaveApply,
  LeaveApplyEditOptionItemType
} from "@/api/oaManage/humanResources";
import { PureTableBar } from "@/components/RePureTableBar";
import AddModal from "./addModel.vue";
import { setColumn, tableEditRender } from "@/utils/table";
import { Plus, Delete } from "@element-plus/icons-vue";
import { addDialog } from "@/components/ReDialog";
import { dayjs } from "element-plus";
import { getUserInfo } from "@/utils/storage";
import { deptUserInfo } from "@/api/oaManage/humanResources";
import { AuditState } from "../utils/hook";
import { useUserStore } from "@/store/modules/user";
import { getBOMTableRowSelectOptions } from "@/api/plmManage";
import { message, showMessageBox } from "@/utils/message";
import { getDeptUserList, queryUserDeptList } from "@/api/systemManage";
import { v4 as uuidv4 } from "uuid";

// 请假类型颜色
const colorMap = {
  事假: "#409eff",
  婚假: "#e6a23c",
  产假: "#909399",
  陪产假: "#f590e4",
  工伤假: "#f56c6c",
  丧假: "#f60",
  年休假: "#67c23a"
};

/** 信息中心的查看单据id */
const props = defineProps<{ id?: string; type?: "add" | "edit" | "view" }>();

const userInfo = getUserInfo();
const loading = ref<boolean>(false);
const isDisabled = ref<boolean>(false);
const columns = ref<TableColumnList[]>([]);
const dataList = ref<LeaveApplyDetailItemType[]>([]);
const maxHeight = 360;
const currentTime = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
const formData = reactive({
  billNo: "保存后自动生成",
  deptId: 0,
  createUserName: userInfo.userName, // 原获取方式从serverData中获取
  createDate: currentTime
});
const optionsData = ref<LeaveApplyEditOptionItemType>({
  deptUserInfoList: [],
  optionList: [],
  deptId: formData.deptId
});
const deleteIdList = ref([]);
const deptOptions = ref([]);

const userStore = useUserStore();

onMounted(() => {
  getUserDeptList();
  getColumnConfig();
});

const getUserDeptList = () => {
  if (["view", "edit"].includes(props.type)) {
    modifyLeaveApplyDetailList({ id: props.id }).then((res: any) => {
      if (res.data) {
        const row = res.data[0] || {};
        getDeptUserList({ userCode: row.userId, userName: row.userName, deptId: row.deptId }).then((res) => {
          if (res.data) {
            queryUserDeptList({ userId: res.data[0]?.id }).then((res: any) => {
              if (res.data) {
                deptOptions.value = res.data;
                if (props.type === "add") {
                  formData.deptId = res.data.find((item) => item.isMaster)?.deptId;
                }
                getOptionList(formData.deptId);
              }
            });
          }
        });
      }
    });
    return;
  }
  queryUserDeptList({ userId: userStore.userInfo.id }).then((res: any) => {
    if (res.data) {
      deptOptions.value = res.data;
      if (props.type === "add") {
        formData.deptId = res.data.find((item) => item.isMaster)?.deptId;
      }
      getOptionList(formData.deptId);
    }
  });
};

const changeDept = (val) => {
  dataList.value = [];
  getOptionList(val);
};

watch(props, () => getTableList(), { immediate: true });
const getOptionList = (deptId) => {
  // 请假类型
  getBOMTableRowSelectOptions({ optioncode: "AskForLeaveType" }).then(({ data }) => {
    if (!data) return;
    optionsData.value.optionList = data[0]?.optionList || [];
  });

  // 部门用户列表
  deptUserInfo({
    page: 1,
    limit: 100000,
    deptId,
    userState: "A",
    deptIdList: [deptId + ""]
  }).then(({ data }) => {
    if (!data?.records) return;
    optionsData.value.deptUserInfoList = data.records || [];
  });
};

// 编辑表格
const { editCellRender } = tableEditRender({
  editFinish: ({ index, prop, row }) => {
    if (["startDate", "startTime", "endDate", "endTime"].includes(prop)) {
      onEditCell({ prop, index, value: row[prop], row });
    }
  }
});
const getColumnConfig = () => {
  const isEdit = props.type !== "view";
  const columnData: TableColumnList[] = [
    { label: "工号", prop: "userId", minWidth: 60 },
    { label: "姓名", prop: "userName", minWidth: 90 },
    {
      label: "请假类型",
      prop: "holidayType",
      cellRenderer: (data) => {
        const { row, column } = data;
        return editCellRender({
          type: "select",
          data,
          options: optionsData.value.optionList,
          isEdit,
          cellStyle: { background: colorMap[row[column["property"]]], color: "#fff" }
        });
      }
    },
    {
      label: "开始日期",
      prop: "startDate",
      minWidth: 120,
      cellRenderer: (data) => editCellRender({ type: "date", data, isEdit, eleProps: { placeholder: "开始日期" } })
    },
    {
      label: "开始时间",
      prop: "startTime",
      minWidth: 100,
      cellRenderer: (data) => editCellRender({ type: "dateTime", data, isEdit, eleProps: { placeholder: "开始时间" } })
    },
    {
      label: "结束日期",
      prop: "endDate",
      minWidth: 120,
      cellRenderer: (data) => editCellRender({ type: "date", data, isEdit, eleProps: { placeholder: "结束日期" } })
    },
    {
      label: "结束时间",
      prop: "endTime",
      minWidth: 100,
      cellRenderer: (data) => editCellRender({ type: "dateTime", data, isEdit, eleProps: { placeholder: "结束时间" } })
    },
    { label: "天数", prop: "days", minWidth: 60 },
    { label: "时长", prop: "hours", minWidth: 60 },
    {
      label: "备注",
      prop: "remark",
      cellRenderer: (data) => editCellRender({ data, isEdit })
    }
  ];
  columns.value = setColumn({ columnData });
};

const onSearch = () => {
  getTableList();
};

function getTableList() {
  if (!props.id) return;
  loading.value = true;
  modifyLeaveApplyDetailList({ id: props.id })
    .then((res) => {
      const data = res.data;
      if (!data?.length) return;
      const row = data[0];
      dataList.value = data;
      loading.value = false;
      isDisabled.value = false;
      formData.billNo = row.billNo;
      formData.deptId = row.deptId;
      formData.createUserName = row.createUserName;
      formData.createDate = row.createDate;
      //取加班单集合的第一条数据 , 禁止编辑和删除
      if (![AuditState.submit, AuditState.reAudit].includes(row?.billState)) {
        isDisabled.value = true;
      }
    })
    .catch((err) => {
      loading.value = false;
    });
}

const onAdd = () => {
  openDialog();
};

const updateUserBack = (data) => {
  optionsData.value.deptUserInfoList = data;
};
const openDialog = () => {
  const formRef = ref();
  addDialog({
    title: "选择请假人员",
    props: { optionsData, updateUserBack },
    width: "auto",
    draggable: true,
    fullscreenIcon: true,
    okButtonText: "添加",
    closeOnClickModal: false,
    contentRenderer: () => h(AddModal, { ref: formRef }),
    beforeSure: (done, { options }) => {
      const { holidayFormRef, askForLeaveDTOList } = formRef.value.getRef();
      holidayFormRef.value.validate((valid) => {
        if (valid) {
          showMessageBox(`确认添加请假人员吗?`).then(() => {
            addUserLeaveApply({ askForLeaveDTOList })
              .then((res) => {
                if (res.data) {
                  const { days, hours } = res.data[0];
                  const calcDataHours = askForLeaveDTOList.map((item) => ({ id: uuidv4(), isNew: true, ...item, days, hours }));
                  done();
                  dataList.value = [...dataList.value, ...calcDataHours];
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

// 删除
const onDelete = (row: LeaveApplyDetailItemType) => {
  dataList.value = dataList.value.filter((item) => {
    if (item?.userId === row.userId) {
      row.id && deleteIdList.value.push(row.id);
      return false;
    }
    return true;
  });
};

// 编辑单元格
function onEditCell({ prop, index, value, row }) {
  addUserLeaveApply({ askForLeaveDTOList: [row] })
    .then((res) => {
      if (res.data) {
        const { days, hours } = res.data[0];
        dataList.value[index] = { ...row, days, hours };
      } else {
        dataList.value[index] = { ...row, days: 0, hours: 0 };
        message("修改失败", { type: "error" });
      }
    })
    .catch(() => {
      dataList.value[index] = { ...row, days: 0, hours: 0 };
    });
}

const onSave = (updateType?: string) => {
  return new Promise((resolve, reject) => {
    if (!dataList.value.length) {
      message("还没有添加请假人员", { type: "error" });
      reject("还没有添加请假人员");
      return;
    }

    for (let i = 0; i < dataList.value.length; i++) {
      const item = dataList.value[i];
      if (!item.days || !item.hours) {
        let msg = ``;
        if (!item.days) {
          msg = `${item.userName}的请假天数设置不正确`;
        } else if (!item.hours) {
          msg = `${item.userName}的请假时长设置不正确`;
        }
        message(msg, { type: "error" });
        reject(msg);
        return;
      }
    }
    const askForLeaveDTOList = dataList.value.map((item, index) => {
      if (item.isNew) item.id = undefined;
      return { ...item, itemSequence: ++index };
    });
    const isSameDept = new Set(askForLeaveDTOList.map((item) => (item as any).deptId)).size === 1;
    if (!isSameDept) {
      message("不能添加不同部门人员的请假单", { type: "error" });
      reject("不能添加不同部门人员的请假单");
      return;
    }
    const params = {
      billNo: formData.billNo,
      createUserName: formData.createUserName,
      createDate: formData.createDate,
      deptId: formData.deptId,
      operationType: 2,
      askForLeaveDTOList: askForLeaveDTOList,
      deleteIdList: deleteIdList.value
    };

    if (updateType === "forceUpdate") {
      (params as any).isFinishUpdate = true;
    }
    loading.value = true;
    const cTitle = { add: "新增", edit: "修改" }[props.type];
    const apiReq = { add: addSaveUserLeaveApply, edit: saveUserLeaveApply };
    apiReq[props.type](params)
      .then((res) => {
        loading.value = false;
        if (res.data) {
          message(`${cTitle}成功`);
          resolve(res);
        } else {
          message(`${cTitle}失败`, { type: "error" });
          reject(res.message);
        }
      })
      .catch((err) => {
        loading.value = false;
        reject(err);
      });
  });
};

defineExpose({ onSave });
</script>
<template>
  <div class="ui-h-100 flex-1 main main-content">
    <div class="bill-table" v-loading="loading">
      <el-form :inline="true" :model="formData">
        <el-form-item label="单据编号">
          <el-input v-model="formData.billNo" placeholder="单据编号" style="min-width: 160px" readonly />
        </el-form-item>
        <el-form-item label="创建人">
          <el-input v-model="formData.createUserName" placeholder="创建人" style="min-width: 160px" readonly />
        </el-form-item>
        <el-form-item label="创建时间">
          <el-input v-model="formData.createDate" placeholder="创建时间" style="min-width: 180px" readonly />
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="formData.deptId" placeholder="请选择" @change="changeDept">
            <el-option v-for="item in deptOptions" :key="item.deptId" :label="item.deptName" :value="item.deptId" />
          </el-select>
        </el-form-item>
      </el-form>
      <el-divider :style="{ margin: '0px' }" />
      <PureTableBar :columns="columns" :show-icon="false" @refresh="onSearch" style="padding: 15px 0 0">
        <template #title>
          <div class="flex">
            <el-button @click="onAdd" type="primary" :icon="Plus" :disabled="isDisabled || type === 'view'">添加人员</el-button>
          </div>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="id"
            class="leave-apply-detail"
            :adaptive="true"
            align-whole="center"
            :loading="false"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            :paginationSmall="size === 'small'"
            highlight-current-row
            :show-overflow-tooltip="true"
          >
            <template #operation="{ row }">
              <el-popconfirm :width="280" :title="`确认删除\n【${row.userName}】的请假单吗?`" @confirm="onDelete(row)">
                <template #reference>
                  <el-button size="small" :icon="Delete" type="danger" @click.stop :disabled="isDisabled">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
  </div>
</template>

<style scoped lang="scss">
.info-select_radio {
  .el-radio {
    margin-right: 0;
  }
}
</style>
