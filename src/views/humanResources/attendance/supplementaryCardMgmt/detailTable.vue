<template>
  <div style="width: 752px">
    <el-button size="small" type="primary" @click="onAddUser">添加人员</el-button>
    <pure-table
      border
      :height="maxHeight"
      :max-height="maxHeight"
      row-key="id"
      :adaptive="true"
      align-whole="center"
      size="small"
      :data="_formData.detailList"
      :columns="columns"
      highlight-current-row
      :show-overflow-tooltip="true"
    />
  </div>
</template>

<script setup lang="tsx">
import { deptUserInfo, getTimeStandardAttendancel } from "@/api/oaManage/humanResources";
import { addDialog } from "@/components/ReDialog";
import { message } from "@/utils/message";
import { setColumn, tableEditRender } from "@/utils/table";
import dayjs from "dayjs";
import { h, onMounted, reactive, ref, watch } from "vue";

const maxHeight = ref(300);
const columns = ref<TableColumnList[]>([]);
const dataList = ref([]);
const deptUserInfoList = ref([]);

const emits = defineEmits(["loadTableData", "updateLineTime"]);

interface Props {
  _formData: any;
}

const props = withDefaults(defineProps<Props>(), {
  _formData: () => ({})
});

watch(
  () => props._formData.deptId,
  (deptId) => {
    // 部门用户列表
    deptUserInfo({
      page: 1,
      limit: 100000,
      deptId,
      userState: "A",
      deptIdList: [deptId + ""]
    }).then(({ data }) => {
      if (data?.records) {
        deptUserInfoList.value = data.records || [];
      }
    });
  }
);

const supCardAttendanceOpts = [
  { optionName: "早上上班", optionValue: 1, flag: "morningWorkTime" },
  { optionName: "早上下班", optionValue: 2, flag: "morningDownWorkTime" },
  { optionName: "下午上班", optionValue: 3, flag: "afternoonWorkTime" },
  { optionName: "下午下班", optionValue: 4, flag: "afternoonDownWorkTime" },
  { optionName: "晚上上班", optionValue: 5, flag: "eveningWorkTime" },
  { optionName: "晚上下班", optionValue: 6, flag: "eveningDownWorkTime" }
];

const setCol = () => {
  const tableCellRender = tableEditRender({
    editFinish({ row, prop, index }) {
      if (prop === "supCardAttendance") {
        const reqParams = { staffId: row.supCardStaffId, attDate: row.supCardDate };
        const flagStr = supCardAttendanceOpts.find((el) => el.optionValue === row.supCardAttendance)?.flag;
        reqParams[`${flagStr}Flag`] = 1;
        getTimeStandardAttendancel(reqParams).then((res) => {
          if (res.data) {
            emits("updateLineTime", res.data, index);
          }
        });
      }
    }
  });

  const supCardAttendanceRender = (data) =>
    tableCellRender.editCellRender({
      type: "select",
      data,
      options: supCardAttendanceOpts,
      cellStyle: { color: "#606266", textAlign: "left" }
    });

  const supCardTimeRender = (data) =>
    tableCellRender.editCellRender({
      type: "dateTime",
      data,
      cellStyle: { color: "#606266", textAlign: "left" },
      eleProps: { format: "HH:mm", arrowControl: true }
    });

  const supCardDateRender = (data) =>
    tableCellRender.editCellRender({
      type: "date",
      data,
      cellStyle: { color: "#606266", textAlign: "left" },
      eleProps: { format: "YYYY-MM-DD" }
    });

  const columnData: TableColumnList[] = [
    { label: "补签卡人员", prop: "supCardUserName" },
    { label: "补签考勤", prop: "supCardAttendance", cellRenderer: supCardAttendanceRender },
    { label: "补卡日期", prop: "supCardDate", cellRenderer: supCardDateRender },
    { label: "补卡时间", prop: "supCardTime", cellRenderer: supCardTimeRender },
    {
      label: "操作",
      prop: "operation",
      align: "center",
      width: 100,
      cellRenderer({ row }) {
        return (
          <div>
            <el-button type="danger" size="small" onClick={() => delTableRow(row)}>
              删除
            </el-button>
          </div>
        );
      }
    }
  ];

  columns.value = setColumn({ columnData, operationColumn: false });
};

const delTableRow = (row) => {
  const findIdx = props._formData.detailList.findIndex((el) => el.supCardUserCode === row.supCardUserCode);
  const newArr = props._formData.detailList.toSpliced(findIdx, 1);
  emits("loadTableData", newArr);
};

const supCardDateTimeHoursOpts = [];
const supCardDateTimeMinuteOpts = [];

for (let i = 0; i < 24; i++) {
  let numStr = "";
  if (i < 10) {
    numStr = "0" + i;
  } else {
    numStr = "" + i;
  }
  supCardDateTimeHoursOpts.push({ optionName: numStr, optionValue: numStr });
}

for (let i = 0; i < 60; i++) {
  if (i % 5 === 0) {
    let numStr = "";
    if (i < 10) {
      numStr = "0" + i;
    } else {
      numStr = "" + i;
    }
    supCardDateTimeMinuteOpts.push({ optionName: numStr, optionValue: numStr });
  }
}

const onAddUser = () => {
  if (!props._formData.deptId) return message.warning("请选择部门");
  const _formData: any = reactive({
    supCardDate: dayjs().format("YYYY-MM-DD")
  });

  const changeAtt = (val) => {
    const staffId = deptUserInfoList.value[0]?.id;
    const reqParams = { staffId: staffId, attDate: _formData.supCardDate };
    const flagStr = supCardAttendanceOpts.find((el) => el.optionValue === val)?.flag;
    reqParams[`${flagStr}Flag`] = 1;
    getTimeStandardAttendancel(reqParams).then((res: any) => {
      if (res.data) {
        const [hours, minute] = res.data.split(":");
        _formData.supCardDateTimeHours = hours;
        _formData.supCardDateTimeMinute = minute;
      }
    });
  };

  addDialog({
    title: `添加人员`,
    props: {},
    width: "600px",
    draggable: true,
    fullscreenIcon: true,
    okButtonText: "保存",
    closeOnClickModal: false,
    contentRenderer: () =>
      h(
        <div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
            <div>补卡考勤：</div>
            <div>
              <el-select
                clearable
                style={{ width: "160px" }}
                size="small"
                onChange={changeAtt}
                v-model={_formData.supCardAttendance}
                placeholder="请选择补卡考勤"
              >
                {supCardAttendanceOpts.map((item) => (
                  <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
                ))}
              </el-select>
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div>补卡日期：</div>
              <div>
                <el-date-picker style={{ width: "160px" }} v-model={_formData.supCardDate} type="date" placeholder="请选择" size="small" />
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", margin: "0 0 0 62px" }}>
              <div>补卡时间：</div>
              <div>
                <el-select clearable style={{ width: "85px" }} size="small" v-model={_formData.supCardDateTimeHours} placeholder="时">
                  {supCardDateTimeHoursOpts.map((item) => (
                    <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
                  ))}
                </el-select>
                <span style={{ margin: "0 2px", fontWeight: "bold" }}> : </span>
                <el-select clearable style={{ width: "85px" }} size="small" v-model={_formData.supCardDateTimeMinute} placeholder="分">
                  {supCardDateTimeMinuteOpts.map((item) => (
                    <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
                  ))}
                </el-select>
              </div>
            </div>
          </div>
          <div style={{ marginTop: "16px" }}>
            <el-transfer
              v-model={_formData.userList}
              filter-method={filterMethod}
              data={deptUserInfoList.value}
              filterable
              onChange={changeTransData}
              class="flex-1 no-wrap"
              filter-placeholder="搜索关键词"
              titles={["全部人员 ", "已选人员"]}
              props={{ label: "userName", key: "userCode" }}
            >
              {{
                default: ({ option }) => (
                  <>
                    <span>
                      {option.userName}
                      {option.groupName && <span>({option.groupName})</span>}
                    </span>
                  </>
                )
              }}
            </el-transfer>
          </div>
        </div>
      ),
    beforeSure: (done) => {
      if (!_formData.supCardAttendance) return message.warning("补签考勤不能为空");
      if (!_formData.userList?.length) return message.warning("请选择补签卡人员");
      const findInfo = (item) => deptUserInfoList.value.find((el) => el.userCode == item) || {};
      const detailList = _formData.userList.map((item) => ({
        supCardAttendance: _formData.supCardAttendance,
        supCardDate: _formData.supCardDate,
        supCardTime: _formData.supCardDateTimeHours + ":" + _formData.supCardDateTimeMinute,
        supCardUserCode: item,
        supCardUserName: findInfo(item).userName,
        supCardStaffId: findInfo(item).id,
        supCardDeptId: findInfo(item).deptId
      }));

      emits("loadTableData", detailList);
      done();
    }
  });
};

const changeTransData = (val) => {
  // if (Array.isArray(val) && val.length) {
  // }
};

const filterMethod = (query, item) => {
  return (item.userName + (item.groupName ?? "")).toLowerCase().includes(query.toLowerCase());
};

onMounted(() => {
  setCol();
});
</script>
