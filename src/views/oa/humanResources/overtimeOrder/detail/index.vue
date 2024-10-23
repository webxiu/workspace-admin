<!-- /*
 * @Author: Hailen
 * @Date: 2023-07-05 11:45:27
 * @Last Modified by:   Hailen
 * @Last Modified time: 2023-07-05 11:45:27
 */ -->

<script setup lang="tsx">
import { onMounted, h, reactive, ref, computed, watch } from "vue";
import {
  modifyOvertimeDetailList,
  OvertimeOrderItemType,
  addUserOvertime,
  updateUserOvertime,
  saveUserOvertime,
  OvertimeOrderEditOptionItemType,
  deptUserInfo,
  generateOvertimeOrderList,
  getStaffDeptGroup
} from "@/api/oaManage/humanResources";
import { PureTableBar } from "@/components/RePureTableBar";
import { message, showMessageBox } from "@/utils/message";
import AddModal from "./addModel.vue";
import { setColumn, tableEditRender } from "@/utils/table";
import { Plus, Delete, Setting } from "@element-plus/icons-vue";
import { addDialog } from "@/components/ReDialog";
import { getUserInfo } from "@/utils/storage";
import { AuditState } from "../utils/hook";
import { getBOMTableRowSelectOptions } from "@/api/plmManage";
import { useUserStore } from "@/store/modules/user";
import { dayjs } from "element-plus";
import { getDeptUserList, queryUserDeptList } from "@/api/systemManage";
import { v4 as uuidv4 } from "uuid";

// 加班类型颜色
const colorMap = {
  工作日加班: "#409eff",
  周末加班: "#67c23a",
  节日加班: "#e6a23c"
};

/** 信息中心的查看单据id */
const props = defineProps<{ id?: string; type?: "add" | "edit" | "view" }>();

const userInfo = getUserInfo();
const loading = ref<boolean>(false);
const isDisabled = ref<boolean>(false);
const columns = ref<TableColumnList[]>([]);
const dataList = ref<OvertimeOrderItemType[]>([]);
const maxHeight = 360;
const currentTime = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
const formData = reactive({
  billNo: "保存后自动生成",
  deptId: 0,
  createUserName: userInfo.userName, // 原获取方式从serverData中获取
  createDate: currentTime,
  autoOvertimeType: "",
  startDate: dayjs(new Date()).format("YYYY-MM-DD"),
  endDate: dayjs(new Date()).format("YYYY-MM-DD"),
  startTime: "",
  autoGroupId: "",
  endTime: ""
});
const optionsData = ref<OvertimeOrderEditOptionItemType>({
  optionList: [],
  deptGroupInfoList: [],
  deptId: formData.deptId,
  userInfoList: []
});
const deleteIdList = ref([]);
const deptOptions = ref([]);
const userStore = useUserStore();
const topFormRef = ref();
const groupList = ref([]);

onMounted(() => {
  getUserDeptList();
  getColumnConfig();
  getTableList();
});

const getUserDeptList = () => {
  if (["view", "edit"].includes(props.type)) {
    modifyOvertimeDetailList({ id: props.id }).then((res: any) => {
      if (res.data) {
        const row = res.data[0] || {};
        getDeptUserList({ userCode: row.staffCode, userName: row.staffName, deptId: row.deptId }).then((res) => {
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

watch(
  () => formData.deptId,
  (newVal) => {
    getStaffDeptGroup({ deptId: newVal }).then((res) => {
      if (res.data) {
        groupList.value = res.data;
      }
    });
  }
);

const changeDept = (val) => {
  dataList.value = [];
  getOptionList(val);
};

const getOptionList = (deptId) => {
  // 加班类型
  getBOMTableRowSelectOptions({ optioncode: "OvertimeType" }).then(({ data }) => {
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
  } as any).then(({ data }) => {
    if (!data.records) return;
    optionsData.value.userInfoList = data.records || [];
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
    { label: "工号", prop: "staffCode", minWidth: 70 },
    { label: "姓名", prop: "staffName", minWidth: 80 },
    { label: "生产线", prop: "productLine", minWidth: 65 },
    {
      label: "加班类型",
      prop: "overtimeType",
      cellRenderer: (data) => {
        const { row, column } = data;
        return editCellRender({
          type: "select",
          data,
          options: optionsData.value.optionList,
          isEdit: isEdit,
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
    {
      label: "天数",
      prop: "days",
      minWidth: 60,
      cellRenderer: (data) => editCellRender({ data, isEdit: isEdit })
    },
    {
      label: "时长",
      prop: "hours",
      minWidth: 60,
      cellRenderer: (data) => editCellRender({ data, isEdit: isEdit })
    },
    { label: "备注", prop: "remark", cellRenderer: (data) => editCellRender({ data, isEdit: isEdit }) }
  ];
  columns.value = setColumn({ columnData });
};

const onSearch = () => {
  getTableList();
};

const getTableList = () => {
  if (!props.id) return;
  loading.value = true;
  modifyOvertimeDetailList({ id: props.id })
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
};

const onAdd = () => {
  openDialog();
};

// 生成加班数据
const onGenerate = () => {
  const reqParams: any = { deptId: formData.deptId };
  if (formData.autoGroupId) reqParams.groupId = formData.autoGroupId;
  topFormRef.value.validate((valid) => {
    if (valid) {
      generateOvertimeOrderList(reqParams).then((res: any) => {
        if (res.data) {
          const setDateList = res.data.map((item) => ({
            ...item,
            startDate: formData.startDate,
            startTime: formData.startTime,
            overtimeType: formData.autoOvertimeType,
            endDate: formData.endDate,
            endTime: formData.endTime,
            staffId: optionsData.value.userInfoList.find((el) => el.userName === item.staffName)?.id
          }));

          addUserOvertime({ overTimeApplyDTOList: [setDateList[0]] })
            .then((res) => {
              if (res.data) {
                const { days, hours } = res.data[0] || {};
                dataList.value = setDateList.map((item) => ({ ...item, days, hours }));
              }
            })
            .catch(() => {
              dataList.value = setDateList.map((item) => ({ ...item, days: 0, hours: 0 }));
            });
        }
      });
    }
  });
};

const updateUserBack = (data) => {
  optionsData.value.userInfoList = data;
};
const openDialog = () => {
  console.log(optionsData, "optionsData");
  const formRef = ref();
  addDialog({
    title: "选择加班人员",
    props: {
      optionsData,
      updateUserBack
    },
    width: "auto",
    draggable: true,
    fullscreenIcon: true,
    closeOnClickModal: false,
    okButtonText: "添加",
    contentRenderer: () => h(AddModal, { ref: formRef }),
    beforeSure: (done, { options }) => {
      const { overTimeFormRef, overTimeApplyDTOList } = formRef.value.getRef();
      overTimeFormRef.value.validate((valid) => {
        if (valid) {
          showMessageBox(`确认添加加班人员吗?`).then(() => {
            addUserOvertime({ overTimeApplyDTOList })
              .then((res) => {
                if (res.data) {
                  const { days, hours, productLine } = res.data[0];
                  const calcDataHours = overTimeApplyDTOList.map((item) => ({
                    id: uuidv4(),
                    isNew: true,
                    ...item,
                    days,
                    hours,
                    productLine: item.productLine
                  }));
                  done();
                  dataList.value = [...dataList.value, ...calcDataHours];
                  // message("添加成功");
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
const onDelete = (row: OvertimeOrderItemType) => {
  dataList.value = dataList.value.filter((item) => {
    if (item?.staffCode === row.staffCode) {
      row.id && deleteIdList.value.push(row.id);
      return false;
    }
    return true;
  });
};

// 编辑单元格
function onEditCell({ prop, index, value, row }) {
  addUserOvertime({ overTimeApplyDTOList: [row] })
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

const onSave = () => {
  for (let i = 0; i < dataList.value.length; i++) {
    const item = dataList.value[i];
    if (!item.days) {
      return message(`请输入${item.staffName}的加班天数`, { type: "error" });
    } else if (!item.hours) {
      return message(`请输入${item.staffName}的加班时长`, { type: "error" });
    }
  }
  return new Promise((resolve, reject) => {
    if (!dataList.value.length) {
      message("还没有添加加班人员", { type: "error" });
      reject("还没有添加加班人员");
      return;
    }

    const overTimeApplyDTOList = dataList.value.map((item, index) => {
      if (item.isNew) item.id = undefined;
      return { ...item, itemSequence: ++index };
    });
    if (deleteIdList.value.length === 0 && overTimeApplyDTOList.length === 0) {
      return message(`加班单集合不能为空`, { type: "error" });
    }
    const isSameDept = new Set(overTimeApplyDTOList.map((item) => (item as any).deptId)).size === 1;
    if (!isSameDept) {
      message("不能添加不同部门人员的加班单", { type: "error" });
      reject("不能添加不同部门人员的加班单");
      return;
    }
    const params = {
      billNo: formData.billNo,
      createUserName: formData.createUserName,
      createDate: formData.createDate,
      deptId: formData.deptId,
      operationType: 2,
      overTimeApplyDTOList: overTimeApplyDTOList,
      deleteIdList: deleteIdList.value
    };
    loading.value = true;
    const cTitle = { add: "新增", edit: "修改" }[props.type];
    const apiReq = { add: saveUserOvertime, edit: updateUserOvertime };
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

const changeStartDate = (val) => (formData.endDate = val);

const disabledDate = (time) => {
  return time.getTime() < dayjs(formData.startDate).valueOf();
};

const makeRange = (start: number, end: number, type?: string) => {
  const result: number[] = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};

const disabledHours = () => {
  if (formData.startTime) {
    const startDevideHour = formData.startTime.split(":")[0];
    return makeRange(0, +startDevideHour);
  }
};

const changeOvertimeType = (type) => {
  const dynamicTime = {
    周末加班: { startTime: "08:00", endTime: "22:00" },
    节日加班: { startTime: "08:00", endTime: "22:00" },
    工作日加班: { startTime: "18:00", endTime: "22:00" }
  };

  formData.startTime = dynamicTime[type]?.startTime;
  formData.endTime = dynamicTime[type]?.endTime;
};

defineExpose({ onSave });
</script>
<template>
  <div class="ui-h-100 flex-1 main main-content">
    <div class="bill-table auto-overtime" v-loading="loading">
      <el-form ref="topFormRef" size="small" :inline="true" :model="formData" label-width="70px">
        <el-form-item label="单据编号">
          <el-input v-model="formData.billNo" placeholder="单据编号" style="min-width: 160px" readonly />
        </el-form-item>
        <el-form-item label="创建人">
          <el-input v-model="formData.createUserName" placeholder="创建人" style="min-width: 160px" readonly />
        </el-form-item>
        <el-form-item label="创建时间">
          <el-input v-model="formData.createDate" placeholder="创建时间" style="min-width: 160px" readonly />
        </el-form-item>
        <br v-if="type === 'add'" />

        <el-form-item label="部门">
          <el-select v-model="formData.deptId" placeholder="请选择" @change="changeDept" style="width: 160px">
            <el-option v-for="item in deptOptions" :key="item.deptId" :label="item.deptName" :value="item.deptId" />
          </el-select>
        </el-form-item>

        <!-- 自动生成相关数据 -->
        <el-form-item label="组别" v-if="type === 'add'" prop="autoGroupId">
          <el-select v-model="formData.autoGroupId" placeholder="请选择组别" style="width: 160px" clearable>
            <el-option v-for="item in groupList" :label="item.groupName" :value="item.id" :key="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="加班类型"
          v-if="type === 'add'"
          prop="autoOvertimeType"
          :rules="{ required: true, trigger: ['submit', 'change'], message: '请选择加班类型' }"
        >
          <el-select v-model="formData.autoOvertimeType" placeholder="请选择加班类型" @change="changeOvertimeType" style="width: 160px">
            <el-option v-for="item in optionsData.optionList" :label="item.optionName" :value="item.optionValue" :key="item.optionValue" />
          </el-select>
        </el-form-item>
        <br />
        <el-form-item
          label="开始日期"
          prop="startDate"
          v-if="type === 'add'"
          :rules="{ required: true, trigger: ['submit', 'change'], message: '请选择开始日期' }"
        >
          <el-date-picker
            style="width: 160px"
            v-model="formData.startDate"
            @change="changeStartDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择开始日期"
          />
        </el-form-item>
        <el-form-item
          label="开始时间"
          prop="startTime"
          v-if="type === 'add'"
          :rules="{ required: true, trigger: ['submit', 'change'], message: '请选择开始时间' }"
        >
          <el-time-picker style="width: 160px" v-model="formData.startTime" value-format="HH:mm" format="HH:mm" placeholder="请选择开始时间" />
        </el-form-item>
        <el-form-item
          label="结束日期"
          prop="endDate"
          v-if="type === 'add'"
          :rules="{ required: true, trigger: ['submit', 'change'], message: '请选择结束日期' }"
        >
          <el-date-picker
            style="width: 160px"
            v-model="formData.endDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择结束日期"
            :disabled-date="disabledDate"
          />
        </el-form-item>
        <el-form-item
          label="结束时间"
          prop="endTime"
          v-if="type === 'add'"
          :rules="{ required: true, trigger: ['submit', 'change'], message: '请选择结束时间' }"
        >
          <el-time-picker
            style="width: 160px"
            v-model="formData.endTime"
            format="HH:mm"
            value-format="HH:mm"
            placeholder="请选择结束时间"
            :disabled-hours="disabledHours"
          />
        </el-form-item>
      </el-form>
      <el-divider :style="{ margin: '0px' }" />
      <PureTableBar :columns="columns" :show-icon="false" @refresh="onSearch" style="padding: 15px 0 0">
        <template #title>
          <div class="flex">
            <el-button @click="onAdd" type="primary" :icon="Plus" :disabled="isDisabled || type === 'view'">添加人员</el-button>
            <el-button @click="onGenerate" type="success" :icon="Setting" v-if="type === 'add'">自动生成</el-button>
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
              <el-popconfirm :width="280" :title="`确认删除\n【${row.staffName}】的加班单吗?`" @confirm="onDelete(row)">
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

.auto-overtime {
  .el-form-item--small {
    margin-bottom: 8px !important;
  }
}
</style>
