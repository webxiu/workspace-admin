<!-- /*
 * @Author: Hailen 
 * @Date: 2023-07-05 11:45:27 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-07-05 11:45:27 
 */ -->

<script lang="tsx">
import {
  modifyLeaveApplyDetailList,
  LeaveApplyDetailItemType,
  addUserLeaveApply,
  saveUserLeaveApply,
  addSaveUserLeaveApply,
  LeaveApplyEditOptionItemType
} from "@/api/oaManage/humanResources";
import { FormItemConfigType, FormTableConfigType } from "@/utils/form";
import { getEnumDictList, RendererType } from "@/utils/table";
import { defineComponent, onMounted, reactive, ref, h, watch } from "vue";
import { getDeptUserList, queryUserDeptList } from "@/api/systemManage";
import { message, showMessageBox } from "@/utils/message";
import { AuditState } from "../utils/hook";
import { deptUserInfo } from "@/api/oaManage/humanResources";
import TableEditList from "@/components/TableEditList/index.vue";
import { tagColors } from "@/config/constant";
import { addDialog } from "@/components/ReDialog";
import AddModal from "./addModel.vue";
import { v4 as uuidv4 } from "uuid";
import { getUserInfo } from "@/utils/storage";
import { dayjs } from "element-plus";
import { useUserStore } from "@/store/modules/user";
import { tableEditRender } from "@/utils/table";
import { Plus, Delete, Operation, Upload } from "@element-plus/icons-vue";
import UploadDetail from "./uploadModel.vue";

export default defineComponent({
  name: "LeaveApplyDetail",
  props: {
    type: { type: String, default: "" },
    id: { type: String, default: "" },
    /** 菜单路径, 用于获取配置菜单ID */
    pageUrl: { type: String, default: "" }
  },
  setup(props, { emit, expose }) {
    const loading = ref(false);
    const sLoading = ref(false);
    const userInfo = getUserInfo();
    const currentTime = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
    const userStore = useUserStore();
    const dataList = ref<LeaveApplyDetailItemType[]>([]);
    const deleteIdList = ref([]);
    const baseApi = import.meta.env.VITE_BASE_API;
    const deptOptions = ref<Record<string, any>[]>([]);
    const isDisabled = ref<boolean>(false);
    const formRef = ref();
    const formData = reactive({
      billNo: "保存后自动生成",
      deptId: 0,
      createDate: currentTime,
      createUserName: userInfo.userName
    });

    const optionsData = ref<LeaveApplyEditOptionItemType>({
      optionList: [],
      deptUserInfoList: [],
      deptId: formData.deptId
    });

    // 请假类型颜色
    const colorMap = {
      年休假: tagColors[0].background,
      事假: tagColors[1].background,
      婚假: tagColors[2].background,
      产假: tagColors[3].background,
      陪产假: tagColors[4].background,
      工伤假: tagColors[5].background,
      丧假: tagColors[6].background,
      病假: tagColors[7].background
    };

    onMounted(() => {
      getUserDeptList();
    });

    const getUserDeptList = () => {
      sLoading.value = true;
      modifyLeaveApplyDetailList({ id: props.id }).then(async (res: any) => {
        if (res.data) {
          const { userId: userCode, userName, deptId } = res.data[0] || {};
          let userId = userStore.userInfo.id;
          if (["view", "edit"].includes(props.type)) {
            const { data } = await getDeptUserList({ userCode, userName, deptId });
            userId = data[0]?.id;
          }
          queryUserDeptList({ userId })
            .then((res: any) => {
              if (res.data) {
                deptOptions.value = res.data;
                if (props.type === "add") {
                  formData.deptId = res.data.find((item) => item.isMaster)?.deptId;
                }
                getOptionList(formData.deptId);
              }
            })
            .finally(() => (sLoading.value = false));
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
      getEnumDictList(["AskForLeaveType"]).then((data) => {
        optionsData.value.optionList = data.AskForLeaveType;
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
        (optionsData.value as any).deptUserInfoList = data.records || [];
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

    // 编辑单元格
    function onEditCell({ prop, index, value, row }) {
      addUserLeaveApply({ askForLeaveDTOList: [row] })
        .then((res) => {
          if (res.data) {
            const { days, hours } = res.data[0];
            dataList.value[index] = { ...row, days, hours };
          } else {
            dataList.value[index] = { ...row, days: 0, hours: 0 };
            message.error("修改失败");
          }
        })
        .catch(() => {
          dataList.value[index] = { ...row, days: 0, hours: 0 };
        });
    }

    const onAdd = () => {
      openDialog();
    };

    const updateUserBack = (data) => {
      optionsData.value.deptUserInfoList = data;
    };

    const openDialog = () => {
      const modelRef = ref();
      addDialog({
        title: "选择请假人员",
        props: { optionsData, updateUserBack },
        width: "auto",
        draggable: true,
        fullscreenIcon: true,
        okButtonText: "添加",
        closeOnClickModal: false,
        contentRenderer: () => h(AddModal, { ref: modelRef }),
        beforeSure: (done, { options }) => {
          const { holidayFormRef, askForLeaveDTOList } = modelRef.value.getRef();
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
                      message.error("添加失败");
                    }
                  })
                  .catch(console.log);
              });
            }
          });
        }
      });
    };

    const onDelete = (row: LeaveApplyDetailItemType) => {
      dataList.value = dataList.value.filter((item) => {
        if (item?.userId === row.userId) {
          row.id && deleteIdList.value.push(row.id);
          return false;
        }
        return true;
      });
    };

    const onSave = (updateType?: string) => {
      return new Promise((resolve, reject) => {
        formRef.value.getRef().then(({ valid, data }) => {
          showMessageBox(`确认要提交吗?`).then(() => {
            if (!dataList.value.length) {
              message.error("还没有添加请假人员");
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
                message.error(msg);
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
              message.error("不能添加不同部门人员的请假单");
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
                  message.success(`${cTitle}成功`);
                  resolve(res);
                } else {
                  message.error(`${cTitle}失败`);
                  reject(res.message);
                }
              })
              .catch((err) => {
                loading.value = false;
                reject(err);
              });
          });
        });
      });
    };

    const custmRender = (): Record<string, RendererType> => {
      const isEdit = props.type !== "view";
      return {
        holidayType: (data) => {
          const { row, column } = data;
          const cellStyle = { background: colorMap[row[column["property"]]], color: "#fff" };
          return editCellRender({ type: "select", data, options: optionsData.value.optionList, isEdit, cellStyle });
        },
        startDate: (data) => editCellRender({ type: "date", data, isEdit, eleProps: { placeholder: "开始日期" } }),
        startTime: (data) => editCellRender({ type: "dateTime", data, isEdit, eleProps: { placeholder: "开始时间" } }),
        endDate: (data) => editCellRender({ type: "date", data, isEdit, eleProps: { placeholder: "结束日期" } }),
        endTime: (data) => editCellRender({ type: "dateTime", data, isEdit, eleProps: { placeholder: "结束时间" } }),
        remark: (data) => editCellRender({ data, isEdit }),
        attrImgs: ({ row }) => (
          <div class="flex-center">
            {row.attrImgs?.length ? (
              <el-image
                src={baseApi + row.attrImgs[0]?.url}
                preview-src-list={row.attrImgs?.map((item) => baseApi + item.url)}
                preview-teleported={true}
                hide-on-click-modal={true}
                z-index={2222}
                fit="cover"
                style="height: 20px; width: 60px; border: 1px solid #eee"
              >
                {{ error: () => <div class="lh-20 ui-ta-c fz-12 pl-2 pr-2"> 暂无附件 </div> }}
              </el-image>
            ) : (
              <div class="lh-20 ui-ta-c fz-12 pl-2 pr-2"> 暂无附件 </div>
            )}
          </div>
        )
      };
    };
    const handleUploadAttr = (row) => {
      console.log(row, "row.. upload..");
      const formRef = ref();
      addDialog({
        title: `附件管理`,
        props: { id: row.id },
        width: "800px",
        draggable: true,
        fullscreenIcon: true,
        closeOnClickModal: false,
        hideItem: ["ok"],
        contentRenderer: () => h(UploadDetail, { ref: formRef })
      });
    };
    const tableSlots = () => {
      return {
        operation: ({ row }) => (
          <div>
            <el-popconfirm width={280} title={`确认删除\n【${row.userName}】的请假单吗?`} onConfirm={() => onDelete(row)}>
              {{
                reference: () => (
                  <el-button size="small" type="danger" icon={Delete} onClick={(e) => e.preventDefault()} disabled={isDisabled.value}>
                    删除
                  </el-button>
                )
              }}
            </el-popconfirm>
            <el-button size="small" type="success" icon={Upload} onClick={() => handleUploadAttr(row)} disabled={row.isNew}>
              附件管理
            </el-button>
          </div>
        )
      };
    };

    expose({ onSave });

    return () => {
      const formConfig: FormItemConfigType[] = [
        {
          formData: formData,
          customProps: {
            billNo: { disabled: true },
            createUserName: { disabled: true },
            createDate: { disabled: true },
            deptId: { onChange: changeDept, disabled: props.type === "view" }
          },
          customElement: undefined,
          formProps: { labelWidth: "100px" },
          dataOption: { deptId: deptOptions.value }
          // header: () => <div>头部占位区域</div>,
          // footer: () => <div>占位区域</div>
        }
      ];
      const tableConfig: FormTableConfigType[] = [
        {
          dataList: dataList,
          custmRender: custmRender(),
          tableProps: { height: 300, maxHeight: 300 },
          tableSlots: tableSlots(),
          buttonConfig: {
            buttonList: [
              {
                icon: Plus,
                size: "small",
                type: "primary",
                text: "添加人员",
                clickHandler: onAdd,
                disabled: isDisabled.value || props.type === "view"
              }
            ]
          },
          tableColumnOption: { operationColumn: { width: 220 } }
          // buttons: [{ name: "删除", type: "danger", icon: Delete }],
          // header: () => <div>头部占位区域</div>,
          // footer: () => <div>占位区域</div>
        }
      ];
      return (
        <TableEditList
          ref={formRef}
          loading={sLoading.value}
          params={{ pageUrl: props.pageUrl, groupCode: "1" }}
          formConfig={formConfig}
          tableConfig={tableConfig}
        />
      );
    };
  }
});
</script>
