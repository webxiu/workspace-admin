<!-- /*
 * @Author: Hailen 
 * @Date: 2023-07-05 11:45:27 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-07-05 11:45:27 
 */ -->

<script lang="tsx">
import {
  saveUserLeaveApply,
  addSaveUserLeaveApply,
  fetchOneSupplementaryCardMgmt,
  getTimeStandardAttendancel,
  deptUserInfo
} from "@/api/oaManage/humanResources";
import { FormItemConfigType, FormTableConfigType } from "@/utils/form";
import { RendererType } from "@/utils/table";
import { defineComponent, onMounted, reactive, ref, h, watch } from "vue";
import { message, showMessageBox } from "@/utils/message";
import TableEditList from "@/components/TableEditList/index.vue";
import { useUserStore } from "@/store/modules/user";
import { tableEditRender } from "@/utils/table";
import { Plus } from "@element-plus/icons-vue";
import { queryUserDeptList, userInfoList } from "@/api/systemManage";
import { formatDate } from "@/utils/common";
import { addDialog } from "@/components/ReDialog";

export default defineComponent({
  name: "SupplementaryCardMgmtDetail",
  props: {
    type: { type: String, default: "add" },
    row: { type: Object, default: () => ({}) }
  },
  setup(props, { emit, expose }) {
    const loading = ref(false);
    const sLoading = ref(false);
    const userStore = useUserStore();
    const dataList = ref<any[]>([]);
    const isDisabled = ref<boolean>(false);
    const formRef = ref();
    const editUserId = ref();
    const deptUserInfoList = ref([]);
    const supCardDateTimeHoursOpts = [];
    const supCardDateTimeMinuteOpts = [];

    const formData = reactive({
      billNo: "",
      billState: "",
      deptId: props.row.deptId ? props.row.deptId + "" : "",
      createUserName: "",
      createDate: "",
      modifyUserName: "",
      modifyDate: "",
      detailList: []
    });

    const supCardAttendanceOpts = [
      { optionName: "早上上班", optionValue: 1, flag: "morningWorkTime" },
      { optionName: "早上下班", optionValue: 2, flag: "morningDownWorkTime" },
      { optionName: "下午上班", optionValue: 3, flag: "afternoonWorkTime" },
      { optionName: "下午下班", optionValue: 4, flag: "afternoonDownWorkTime" },
      { optionName: "晚上上班", optionValue: 5, flag: "eveningWorkTime" },
      { optionName: "晚上下班", optionValue: 6, flag: "eveningDownWorkTime" }
    ];
    // 编辑表格
    const { editCellRender } = tableEditRender();

    onMounted(() => {
      initData();
      getOptions();
    });

    watch(
      () => formData.deptId,
      (val) => getUserList(val)
    );

    function getOptions() {
      sLoading.value = true;
      // 获取本部门列表
      if (props.type === "add") {
        queryUserDeptList({ userId: userStore.userInfo.id })
          .then((res: any) => {
            if (res.data) {
              formData.deptId = res.data.find((item) => item.isMaster)?.deptId;
            }
          })
          .finally(() => (sLoading.value = false));
      }
      if (props.type === "edit") {
        fetchOneSupplementaryCardMgmt({ id: props.row.id })
          .then((res: any) => {
            if (res.data) {
              console.log(res.data, "ddd..");
              const { billNo, billState, deptId, createUserName, createDate, modifyUserName, modifyDate } = res.data[0] || {};
              formData.deptId = deptId;
              formData.billNo = billNo;
              formData.billState = billState + "";
              formData.createUserName = createUserName;
              formData.modifyUserName = modifyUserName;
              formData.createDate = formatDate(createDate);
              formData.modifyDate = formatDate(modifyDate);
              dataList.value = res.data.map(({ staffName, reissueType, attDate, attTime, did, staffId }) => ({
                supCardUserName: staffName,
                supCardAttendance: reissueType,
                supCardDate: attDate,
                supCardTime: attTime,
                did: did,
                supCardStaffId: staffId
              }));
            }
          })
          .finally(() => (sLoading.value = false));
      }
    }

    function initData() {
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
    }

    function getUserList(deptId) {
      if (!deptId) return;
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

    // 删除
    const onDelete = (row) => {
      const findIdx = dataList.value.findIndex((el) => el.id === row.id);
      dataList.value.splice(findIdx, 1);
    };

    const onAdd = () => {
      if (!formData.deptId) return message.warning("请选择部门");
      const _formData: any = reactive({
        supCardDate: formatDate(new Date().toDateString(), "YYYY-MM-DD")
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
          dataList.value = [...dataList.value, ...detailList];
          done();
        }
      });
    };

    const filterMethod = (query, item) => {
      return (item.userName + (item.groupName ?? "")).toLowerCase().includes(query.toLowerCase());
    };

    const changeTransData = (val) => {
      // if (Array.isArray(val) && val.length) {
      // }
    };

    const custmRender = (): Record<string, RendererType> => {
      const isEdit = props.type !== "view";
      return {
        supCardAttendance: (data) =>
          editCellRender({ type: "select", data, isEdit, options: supCardAttendanceOpts, cellStyle: { color: "#606266", textAlign: "left" } }),
        supCardDate: (data) =>
          editCellRender({ type: "date", data, isEdit, cellStyle: { color: "#606266", textAlign: "left" }, eleProps: { format: "YYYY-MM-DD" } }),
        supCardTime: (data) =>
          editCellRender({
            type: "dateTime",
            data,
            isEdit,
            cellStyle: { color: "#606266", textAlign: "left" },
            eleProps: { format: "HH:mm", arrowControl: true }
          })
      };
    };
    const tableSlots = () => {
      return {
        operation: ({ row }) => (
          <el-popconfirm width={240} title={`确认删除\n【${row.supCardUserName}】的补卡吗?`} onConfirm={() => onDelete(row)}>
            {{
              reference: () => (
                <el-button size="small" type="danger" disabled={isDisabled.value || props.type === "view"}>
                  删除
                </el-button>
              )
            }}
          </el-popconfirm>
        )
      };
    };

    const getRef = () => {
      return new Promise((resolve, reject) => {
        if (!dataList.value.length) {
          message.error("请添加补卡人员");
          return reject();
        }
        formData.detailList = dataList.value;
        resolve(formData);
      });
    };

    expose({ getRef });

    return () => {
      const formConfig: FormItemConfigType[] = [
        {
          formData: formData,
          formProps: { labelWidth: "100px" },
          customProps: {
            deptId: {
              onChange: () => (dataList.value = []),
              apiParams: { userId: editUserId.value || userStore.userInfo.id }
            }
          }
        }
      ];
      const tableConfig: FormTableConfigType[] = [
        {
          dataList: dataList,
          custmRender: custmRender(),
          tableProps: { height: 260, maxHeight: 260 },
          tableSlots: tableSlots(),
          tableColumnOption: {
            operationColumn: { minWidth: 120 }
          },
          buttonConfig: {
            buttonList: [
              {
                icon: Plus,
                size: "small",
                type: "primary",
                text: "添加人员",
                clickHandler: onAdd,
                disabled: !formData.deptId || props.type === "view"
              }
            ]
          }
        }
      ];
      return <TableEditList ref={formRef} loading={sLoading.value} params={{ groupCode: "1" }} formConfig={formConfig} tableConfig={tableConfig} />;
    };
  }
});
</script>
