<!-- /*
 * @Author: Hailen 
 * @Date: 2023-07-05 11:45:27 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-07-05 11:45:27 
 */ -->

<script lang="tsx">
import {
  OvertimeOrderItemType,
  modifyOvertimeDetailList,
  OvertimeOrderEditOptionItemType,
  saveUserOvertime,
  updateUserOvertime
} from "@/api/oaManage/humanResources";
import { FormItemConfigType, FormTableConfigType } from "@/utils/form";
import { getEnumDictList, RendererType } from "@/utils/table";
import { defineComponent, onMounted, reactive, ref, h, watch } from "vue";
import { getDeptUserList, queryUserDeptList } from "@/api/systemManage";
import { message, showMessageBox } from "@/utils/message";
import { AuditState } from "../utils/hook";
import { deptUserInfo } from "@/api/oaManage/humanResources";
import TableEditList from "@/components/TableEditList/index.vue";
import { addDialog } from "@/components/ReDialog";
import AddModal from "./addModel.vue";
import { v4 as uuidv4 } from "uuid";
import { getUserInfo } from "@/utils/storage";
import { useUserStore } from "@/store/modules/user";
import { tableEditRender } from "@/utils/table";
import { Plus } from "@element-plus/icons-vue";
import { dayjs } from "element-plus";

export default defineComponent({
  name: "OvertimeDetail",
  props: {
    type: { type: String, default: "" },
    id: { type: String, default: "" },
    pageUrl: { type: String, default: "" }
  },
  setup(props, { emit, expose }) {
    const loading = ref(false);
    const sLoading = ref(false);
    const userInfo = getUserInfo();
    const currentTime = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
    const userStore = useUserStore();
    const dataList = ref<OvertimeOrderItemType[]>([]);
    const deleteIdList = ref([]);
    const deptOptions = ref<Record<string, any>[]>([]);
    const isDisabled = ref<boolean>(false);
    const formRef = ref();
    const formData = reactive({
      billNo: "保存后自动生成",
      deptId: 0,
      createUserName: userInfo.userName,
      createDate: currentTime
    });

    const optionsData = ref<OvertimeOrderEditOptionItemType>({
      optionList: [],
      deptGroupInfoList: [],
      deptId: formData.deptId,
      userInfoList: []
    });

    // 编辑表格
    const { editCellRender } = tableEditRender();

    onMounted(() => {
      getUserDeptList();
    });

    const getUserDeptList = () => {
      sLoading.value = true;
      modifyOvertimeDetailList({ id: props.id }).then(async (res: any) => {
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
      // 加班类型
      getEnumDictList(["OvertimeType"]).then(({ OvertimeType }) => {
        optionsData.value.optionList = OvertimeType as any[];
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
        (optionsData.value as any).userInfoList = data.records || [];
      });
    };

    function getTableList() {
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
    }

    const onAdd = () => {
      openDialog("add");
    };
    const onEditTime = (row, index) => {
      openDialog("edit", row, index);
    };
    const updateUserBack = (data) => {
      optionsData.value.userInfoList = data;
    };
    const openDialog = (type, row?, index?) => {
      const formRef = ref();
      addDialog({
        title: "选择加班人员",
        props: { optionsData, updateUserBack, rowUserData: row },
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
                const calcDataHours = overTimeApplyDTOList.map((item) => ({
                  id: uuidv4(),
                  isNew: true,
                  ...item,
                  productLine: item.productLine
                }));

                if (type === "add") {
                  let duplicateUserName = calcDataHours.filter((item, index) => {
                    return dataList.value.some((el, i) => el.staffId === item.staffId);
                  });
                  if (duplicateUserName.length) {
                    return message.error(`存在重复的人员: ${duplicateUserName.map((item) => item.staffName).join(",")}`);
                  }

                  dataList.value = [...dataList.value, ...calcDataHours];
                } else if (type === "edit") {
                  const findId = dataList.value.find((el: any) => el.staffId === calcDataHours[0].staffId)?.id;
                  dataList.value[index] = { ...calcDataHours[0], isNew: false, id: findId };
                }
                done();
              });
            }
          });
        }
      });
    };

    const onDelete = (row: OvertimeOrderItemType) => {
      dataList.value = dataList.value.filter((item) => {
        if (item?.staffCode === row.staffCode) {
          row.id && deleteIdList.value.push(row.id);
          return false;
        }
        return true;
      });
    };

    const onSave = () => {
      return new Promise((resolve, reject) => {
        formRef.value.getRef().then(({ valid, data }) => {
          showMessageBox(`确认要提交吗?`).then(() => {
            for (let i = 0; i < dataList.value.length; i++) {
              const item = dataList.value[i];
              if (!item.days) {
                return message.error(`请输入${item.staffName}的加班天数`);
              } else if (!item.hours) {
                return message.error(`请输入${item.staffName}的加班时长`);
              }
            }
            if (!dataList.value.length) {
              message.error("还没有添加加班人员");
              reject("还没有添加加班人员");
              return;
            }
            const overTimeApplyDTOList = dataList.value.map((item, index) => {
              if (item.isNew) item.id = undefined;
              return { ...item, itemSequence: ++index };
            });
            if (deleteIdList.value.length === 0 && overTimeApplyDTOList.length === 0) {
              return message.error(`加班单集合不能为空`);
            }
            const isSameDept = new Set(overTimeApplyDTOList.map((item) => (item as any).deptId)).size === 1;
            if (!isSameDept) {
              message.error("不能添加不同部门人员的加班单");
              reject("不能添加不同部门人员的加班单");
              return;
            }
            const params = {
              billNo: formData.billNo,
              createUserName: formData.createUserName,
              createDate: formData.createDate,
              deptId: formData.deptId,
              operationType: 2,
              overTimeApplyDTOList: overTimeApplyDTOList.map((item) => ({ ...item, overtimeUUID: props.id })),
              deleteIdList: deleteIdList.value
            };
            loading.value = true;
            const cTitle = { add: "新增", edit: "修改" }[props.type];
            const apiReq = { add: saveUserOvertime, edit: updateUserOvertime };

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
      return { remark: (data) => editCellRender({ data, isEdit }) };
    };
    const tableSlots = () => {
      return {
        operation: ({ row, index }) => (
          <>
            <el-button type="warning" size="small" onClick={() => onEditTime(row, index)} disabled={isDisabled.value}>
              修改
            </el-button>
            <el-popconfirm width={280} title={`确认删除\n【${row.staffName}】的加班单吗?`} onConfirm={() => onDelete(row)}>
              {{
                reference: () => (
                  <el-button type="danger" size="small" onClick={(e) => e.preventDefault()} disabled={isDisabled.value}>
                    删除
                  </el-button>
                )
              }}
            </el-popconfirm>
          </>
        )
      };
    };

    expose({ onSave });

    return () => {
      const formConfig: FormItemConfigType[] = [
        {
          formData: formData,
          customProps: {
            deptId: { onChange: changeDept, disabled: props.type === "view" }
          },
          formProps: { labelWidth: "100px" },
          dataOption: { deptId: deptOptions.value }
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
          tableColumnOption: {
            operationColumn: { minWidth: 140 }
          }
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
