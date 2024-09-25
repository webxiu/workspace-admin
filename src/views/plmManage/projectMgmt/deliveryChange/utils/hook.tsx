import EditForm, { FormConfigItemType } from "@/components/EditForm/index.vue";
import { addDialog } from "@/components/ReDialog";
import { getkkViewUrl } from "@/utils/storage";
import { ElMessage, FormRules } from "element-plus";
import { h, reactive, ref } from "vue";
import SelectProjectModal from "../selectProjectModal/index.vue";
import SelectTaskModal from "../selectTaskModal/index.vue";
import { message, showMessageBox } from "@/utils/message";
import {
  addProjectTaskDeliversChange,
  fetchAllProjectMsgByProjectId,
  fetchProjectTaskDelivers,
  getBOMTableRowSelectOptions,
  getProjectTaskDeliversChangeDetail,
  getProjectTaskDeliversChangeFileList,
  submitProjectTaskDeliversChange
} from "@/api/plmManage";

export const commonDeliverChangeAction = (
  {
    row,
    type,
    freshDeliverableNow,
    disabledSomeCtrl,
    fromTaskList
  }: {
    type: "add" | "view" | "edit";
    row?: any;
    freshDeliverableNow?: boolean;
    disabledSomeCtrl?: boolean;
    fromTaskList?: boolean;
  },
  callBack?: () => void
) => {
  const _formData: any = reactive({
    projectName: row?.projectName ?? "",
    taskName: row?.taskName ?? "",
    billNo: row?.billNo ?? "",
    projectId: row?.projectId ?? "",
    taskId: row?.taskId ?? "",
    id: row?.id ?? "",
    deliverableName: row?.deliverableName ?? "",
    deliverableId: row?.deliverableId ?? "",
    title: row?.title ?? "",
    remark: row?.remark ?? "",
    describeChange: row?.describeChange ?? "",
    createUserName: row?.createUserName,
    createUserId: row?.createUserId,
    createDate: row?.createDate,
    version: row?.version,
    billState: row?.billState,
    files: row?.files ?? []
  });
  const formRef = ref();
  const deleteFileDtoList = ref([]);
  const deliveryOpts = ref([]);
  const billStateOpts = ref([]);
  const formRules = reactive<FormRules>({
    projectName: [{ required: true, message: "请选择变更项目", trigger: "submit" }],
    taskName: [{ required: true, message: "请选择变更任务", trigger: "submit" }],
    deliveryTemplate: [{ required: true, message: "请选择变更交付物", trigger: "submit" }],
    title: [{ required: true, message: "请填写标题", trigger: "submit" }],
    remark: [{ required: true, message: "请填写说明", trigger: "submit" }],
    describeChange: [{ required: true, message: "请填写变更说明", trigger: "submit" }]
  });

  getBOMTableRowSelectOptions({ optioncode: "BillStatus" }).then((res) => {
    if (res.data) {
      const findRes = res.data.find((item) => item.optionCode === "BillStatus")?.optionList || [];
      billStateOpts.value = findRes.map((item) => ({ ...item, optionValue: +item.optionValue }));
    }
  });

  if (type === "view") {
    getProjectTaskDeliversChangeDetail({ id: row.id }).then((res) => {
      if (res.data) {
        const result = res.data[0] || {};
        console.log(result, "detail..");
        _formData.billNo = result.billNo;
        _formData.billState = result.billState;
        _formData.projectName = result.projectName;
        _formData.version = result.changeVersion;
        _formData.deliverableId = result.changeDeliverableId;
        _formData.title = result.changeTitleAfter;
        _formData.remark = result.changeRemarkAfter;
        _formData.describeChange = result.changeNote;
        _formData.createUserName = result.createUserName;
        _formData.createDate = result.createDate;
        _formData.files = result.projectFileChangeRecordDTOList?.map((item) => ({ ...item, name: item.changeFileName }));
      }
    });
  }

  const chooseProject = () => {
    const formRef = ref();

    addDialog({
      title: `选择项目`,
      props: {},
      width: "950px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(SelectProjectModal, { ref: formRef }),
      beforeSure: (done) => {
        const formIns = formRef.value;
        if (!formIns.currentLeftRow) {
          message("请选择项目", { type: "warning" });
        } else {
          _formData.projectId = formIns.currentLeftRow.id;
          _formData.projectName = formIns.currentLeftRow.projectName;
          done();
        }
      }
    });
  };

  const chooseTask = () => {
    const formRef = ref();
    const taskOpts = ref([]);

    fetchAllProjectMsgByProjectId({ id: _formData.projectId }).then((res: any) => {
      if (res.data) {
        const flatArr = res.data.projectTaskGroupVoList?.map((item) => item.taskVOList).flat(Infinity);
        taskOpts.value = flatArr;
      }
    });

    if (_formData.projectId && _formData.taskId) {
      fetchProjectTaskDelivers({ taskId: _formData.taskId }).then((res: any) => {
        if (res.data) {
          const changeDeliveries = res.data.map((item) => ({ optionName: item.deliverableName, optionValue: item.id, ...item }));
          deliveryOpts.value = changeDeliveries;
        }
      });
    }

    addDialog({
      title: `选择任务`,
      props: { taskOpts },
      width: "950px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(SelectTaskModal, { ref: formRef }),
      beforeSure: (done) => {
        const formIns = formRef.value;
        if (!formIns.currentLeftRow) {
          message("请选择任务", { type: "warning" });
        } else {
          _formData.taskId = formIns.currentLeftRow.id;
          _formData.taskName = formIns.currentLeftRow.name;
          fetchProjectTaskDelivers({ taskId: _formData.taskId }).then((res: any) => {
            if (res.data) {
              const changeDeliveries = res.data.map((item) => ({ optionName: item.deliverableName, optionValue: item.id, ...item }));
              deliveryOpts.value = changeDeliveries;
            }
          });
          done();
        }
      }
    });
  };

  if (freshDeliverableNow) {
    fetchProjectTaskDelivers({ taskId: _formData.taskId }).then((res: any) => {
      if (res.data) {
        const changeDeliveries = res.data.map((item) => ({ optionName: item.deliverableName, optionValue: item.id, ...item }));
        deliveryOpts.value = changeDeliveries;
      }
    });
  }

  const changeDeliverOpts = (val) => {
    getProjectTaskDeliversChangeFileList({ deliverableId: val }).then((res: any) => {
      if (res.data) {
        _formData.title = res.data.title;
        _formData.remark = res.data.remark;

        _formData.beforeTitle = res.data.title;
        _formData.beforeRemark = res.data.remark;

        _formData.files = res.data.projectChangeFileList?.map((item) => ({ ...item, name: item.fileName }));
      }
    });
  };

  if (fromTaskList) changeDeliverOpts(row.deliverableId);

  const formConfigs = (): FormConfigItemType[] => {
    const arr = [
      {
        label: "单据编号",
        prop: "billNo",
        labelWidth: 95,
        colProp: { span: 8 },
        render: ({ formModel, row }) => {
          return <el-input v-model={formModel[row.prop]} disabled placeholder="自动生成" />;
        }
      },
      {
        label: "变更项目",
        prop: "projectName",
        labelWidth: 95,
        colProp: { span: 8 },
        render: ({ formModel, row }) => {
          return (
            <el-input
              v-model={formModel[row.prop]}
              disabled={disabledSomeCtrl || type === "view"}
              readonly
              placeholder="请选择"
              onClick={() => chooseProject()}
            />
          );
        }
      },
      {
        label: "变更任务",
        prop: "taskName",
        labelWidth: 95,
        colProp: { span: 8 },
        render: ({ formModel, row }) => {
          return (
            <el-input v-model={formModel[row.prop]} disabled={disabledSomeCtrl || type === "view"} readonly placeholder="请选择" onClick={() => chooseTask()} />
          );
        }
      },
      {
        label: "变更交付物",
        prop: "deliverableId",
        labelWidth: 95,
        colProp: { span: 8 },
        render: ({ formModel, row }) => {
          return (
            <el-select
              disabled={disabledSomeCtrl || type === "view"}
              v-model={formModel[row.prop]}
              placeholder="请选择"
              style={{ width: "100%" }}
              onChange={changeDeliverOpts}
            >
              {deliveryOpts.value?.map((item) => (
                <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
              ))}
            </el-select>
          );
        }
      },
      {
        label: "版本",
        labelWidth: 95,
        prop: "version",
        colProp: { span: 8 },
        render: ({ formModel, row }) => {
          return <el-input v-model={formModel[row.prop]} disabled />;
        }
      },
      {
        label: "单据状态",
        prop: "billState",
        labelWidth: 95,
        colProp: { span: 8 },
        render: ({ formModel, row }) => {
          return (
            <el-select disabled v-model={formModel[row.prop]} style={{ width: "100%" }} placeholder=" ">
              {billStateOpts.value?.map((item) => (
                <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
              ))}
            </el-select>
          );
        }
      },
      {
        label: "标题",
        labelWidth: 95,
        prop: "title",
        colProp: { span: 24 },
        render: ({ formModel, row }) => {
          return <el-input v-model={formModel[row.prop]} disabled={type === "view"} />;
        }
      },
      {
        label: "说明",
        labelWidth: 95,
        prop: "remark",
        colProp: { span: 24 },
        render: ({ formModel, row }) => {
          return <el-input type="textarea" autosize v-model={formModel[row.prop]} disabled={type === "view"} />;
        }
      },
      {
        label: "变更说明",
        prop: "describeChange",
        labelWidth: 95,
        colProp: { span: 24 },
        render: ({ formModel, row }) => {
          return <el-input type="textarea" autosize v-model={formModel[row.prop]} disabled={type === "view"} />;
        }
      },
      {
        slots: { label: () => <span style={{ fontSize: "14px", color: "#606266", fontWeight: "700" }}>变更附件</span> },
        colProp: { span: 24 },
        labelWidth: 95,
        prop: "files",
        render: ({ formModel, row }) => {
          const handleRemove = (file) => {
            if (file.changeMode) {
              deleteFileDtoList.value.push({ id: file.id, changeMode: 1, taskId: file.taskId, changeFileId: file.changeFileId });
            }
          };
          const beforeRemove = () => type !== "view";
          const uploadFile = () => {};

          const handlePreview = async (row) => {
            const url = getkkViewUrl(row.virtualFilePath);
            window.open(url);
          };
          return (
            <el-upload
              v-model:file-list={formModel[row.prop]}
              style={{ width: "100%" }}
              class="change-deliver-modal"
              auto-upload={false}
              on-change={uploadFile}
              action="#"
              multiple
              on-remove={handleRemove}
              on-preview={handlePreview}
              before-remove={beforeRemove}
            >
              <el-button type="primary" disabled={type === "view"}>
                选择文件
              </el-button>
            </el-upload>
          );
        }
      },
      {
        labelWidth: 95,
        label: "创建人",
        prop: "createUserName",
        colProp: { span: 8 },
        render: ({ formModel, row }) => {
          return <el-input v-model={formModel[row.prop]} disabled />;
        }
      },
      {
        label: "创建时间",
        labelWidth: 95,
        prop: "createDate",
        colProp: { span: 8 },
        render: ({ formModel, row }) => {
          return <el-input v-model={formModel[row.prop]} disabled />;
        }
      }
    ];

    return arr;
  };

  const title = { add: "交付物变更", view: "查看变更", edit: "交付物变更修改" };
  addDialog({
    title: title[type],
    props: { formInline: _formData, formRules: formRules, formConfigs: formConfigs().filter(Boolean) },
    width: "1000px",
    draggable: true,
    fullscreenIcon: true,
    okButtonText: "保存",
    closeOnClickModal: false,
    hideFooter: type === "view",
    contentRenderer: () => h(EditForm, { ref: formRef }),
    beforeSure: (done) => {
      const formIns = formRef.value.getRef();
      formIns?.validate(async (valid) => {
        if (valid) {
          // 组装请求参数
          const fd = new FormData();
          if (_formData.files && Array.isArray(_formData.files) && _formData.files.length) {
            _formData.files
              .filter((item) => item.raw)
              .forEach((item) => {
                fd.append("files", item.raw);
              });
          }
          const reqParams = {
            changeProjectId: _formData.projectId,
            changeNote: _formData.describeChange,
            changeDeliverableId: _formData.deliverableId,
            changeTitleBefore: _formData.beforeTitle,
            changeRemarkBefore: _formData.beforeRemark,
            changeRemarkAfter: _formData.remark,
            changeTitleAfter: _formData.title,
            taskId: _formData.taskId,
            projectFileChangeRecordDTOList: _formData.files
              .map((item) => {
                const itemInfo = {
                  id: item.virtualFilePath ? item.id : "",
                  changeMode: item.virtualFilePath ? item.changeMode : 3,
                  changeFileId: null
                };

                if (itemInfo.changeMode == 4) itemInfo.changeFileId = item.changeFileId;
                return itemInfo;
              })
              .concat(deleteFileDtoList.value)
          };
          fd.append("params", JSON.stringify(reqParams));

          addProjectTaskDeliversChange(fd).then((res) => {
            if (res.data || res.status === 200) {
              showMessageBox(`保存成功，是否提交?`)
                .then(() => {
                  submitProjectTaskDeliversChange({ billId: "10054", billNo: res.data }).then((resp) => {
                    if (resp.data) {
                      ElMessage({ message: "提交成功", type: "success" });
                      if (callBack) callBack();
                      done();
                    }
                  });
                })
                .catch(() => {
                  if (callBack) callBack();
                  done();
                });
            }
          });
        }
      });
    }
  });
};
