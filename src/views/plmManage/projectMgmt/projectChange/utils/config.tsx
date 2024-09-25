import { h, reactive, ref } from "vue";
import SelectProjectModal from "../projectModal/index.vue";
import { FormRules } from "element-plus";
import { addDialog } from "@/components/ReDialog";
import { message } from "@/utils/message";
import SourceTableList from "../sourceTable/index.vue";
import TaskTableList from "../taskListTable/index.vue";
import { fetchAllProjectMsgByProjectId, fetchProjectMgmtList, fetchProjectTemplatePersons } from "@/api/plmManage";

export const formRules = reactive<FormRules>({
  // duration: [{ required: true, message: "工期为必填项", trigger: "submit" }],
});

const activeName = ref("taskList");
const taskRef = ref();
const sourceRef = ref();

const handleClick = (val) => {
  // console.log(val, "val..");
};

export const formConfigs = ({ categoryOpts, projectModelOpts, deptSelectData, _formData, taskTreeData }) => {
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

          done();
          if (_formData.projectId) {
            fetchAllProjectMsgByProjectId({ id: _formData.projectId }).then((res: any) => {
              if (res.data) {
                _formData.productName = res.data.projectInfoListVO?.projectName;
                _formData.projectNo = res.data.projectInfoListVO?.billNo;
                _formData.category = res.data.projectInfoListVO?.productCategoryId;
                _formData.startDate = res.data.projectInfoListVO?.startDate;
                _formData.projectModel = res.data.projectInfoListVO?.projectModelId;
                _formData.duration = res.data.projectInfoListVO?.duration;
                _formData.projectUserName = res.data.projectInfoListVO?.projectUserName;

                if (res.data.projectInfoListVO?.deptId) {
                  _formData.projectDeptId = res.data.projectInfoListVO?.deptId + "";
                }

                taskRef.value.setDataList(res.data.projectTaskGroupVoList || []);
                taskTreeData.value = res.data.projectTaskGroupVoList;

                fetchProjectTemplatePersons({ id: _formData.projectModel }).then((res: any) => {
                  if (res.data) {
                    sourceRef.value.dataList = res.data.projectModelResponsiblePersonnel || [];
                    sourceRef.value.dataList2 = res.data.projectModelRelatePersonnel || [];
                  }
                });

                // 回显项目角色相关数据
                fetchProjectMgmtList({ id: _formData.projectId }).then((res: any) => {
                  if (res.data) {
                    const resultData = res.data.records[0] || {};
                    const responeseUser = resultData.projectModelResponsiblePersonnel || [];

                    responeseUser.forEach((item) => {
                      sourceRef.value.dataList.forEach((el) => {
                        if (el.id === item.id) el.resUserOptions = item.userInfoVOList[0]?.id;
                      });
                    });

                    const relationUser = resultData.projectModelRelatePersonnel || [];
                    relationUser.forEach((item) => {
                      sourceRef.value.dataList2.forEach((el) => {
                        if (el.id === item.id) el.relateUserOptions = item.userInfoVOList[0]?.id;
                      });
                    });
                  }
                });
              }
            });
          }
        }
      }
    });
  };

  return [
    {
      label: "单据编号",
      colProp: { span: 8 },
      labelWidth: 80,
      prop: "billNo",
      render: ({ formModel, row }) => {
        return <el-input disabled v-model={formModel[row.prop]} placeholder="自动生成" />;
      }
    },
    {
      label: "项目编号",
      colProp: { span: 8 },
      labelWidth: 80,
      prop: "projectNo",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="点击选择" readonly style={{ cursor: "pointer" }} onClick={() => chooseProject()} />;
      }
    },
    {
      label: "产品名称",
      colProp: { span: 8 },
      labelWidth: 80,
      prop: "productName",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "产品分类",
      prop: "category",
      labelWidth: 80,
      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} style={{ width: "100%" }} placeholder="选择产品分类">
            {categoryOpts.value?.map((item) => (
              <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "立项日期",
      colProp: { span: 8 },
      labelWidth: 80,
      prop: "startDate",
      render: ({ formModel, row }) => {
        return <el-date-picker v-model={formModel[row.prop]} type="date" placeholder="选择立项日期" />;
      }
    },
    {
      label: "项目模板",
      colProp: { span: 8 },
      labelWidth: 80,
      prop: "projectModel",
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} style={{ width: "100%" }} placeholder="选择项目模板">
            {projectModelOpts.value?.map((item) => (
              <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "工期(天)",
      colProp: { span: 8 },
      labelWidth: 80,
      prop: "duration",
      render: ({ formModel, row }) => {
        return <el-input-number style={{ width: "100%" }} controls={false} v-model={formModel[row.prop]} min={1} />;
      }
    },
    {
      label: "负责人",
      colProp: { span: 8 },
      labelWidth: 80,
      prop: "projectUserName",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "负责部门",
      colProp: { span: 8 },
      labelWidth: 80,
      prop: "projectDeptId",
      render: ({ formModel, row }) => {
        return (
          <el-tree-select
            placeholder="选择部门"
            v-model={formModel[row.prop]}
            data={deptSelectData}
            filterable
            check-strictly
            default-expanded-keys={["0"]}
            node-key="value"
            render-after-expand={false}
            style={{ width: "100%" }}
          />
        );
      }
    },
    {
      label: "",
      labelWidth: 20,
      colProp: { span: 24 },
      prop: "sourceAndTask",
      render: ({ formModel, row }) => {
        return (
          <el-tabs v-model={activeName} onTabClick={handleClick} style={{ width: "100%" }}>
            <el-tab-pane label="项目任务" name="taskList">
              <TaskTableList ref={taskRef} formTopData={_formData} taskTreeData={taskTreeData} />
            </el-tab-pane>
            <el-tab-pane label="资源设置" name="source">
              <SourceTableList ref={sourceRef} />
            </el-tab-pane>
          </el-tabs>
        );
      }
    },
    {
      label: "变更说明",
      colProp: { span: 24 },
      labelWidth: 80,
      prop: "changeRemark",
      render: ({ formModel, row }) => {
        return <el-input type="textarea" autosize v-model={formModel[row.prop]} />;
      }
    },
    {
      slots: { label: () => <span style={{ fontSize: "12px", color: "#606266", fontWeight: "700" }}>附件</span> },
      colProp: { span: 24 },
      labelWidth: 80,
      prop: "files",
      render: ({ formModel, row }) => {
        const handleRemove = (file) => {
          if (file.changeMode) {
            // deleteFileDtoList.value.push({ id: file.id, changeMode: 1, taskId: file.taskId, changeFileId: file.changeFileId });
          }
        };
        const beforeRemove = () => {
          // type !== "view";
        };
        const uploadFile = () => {};

        const handlePreview = async (row) => {
          // const url = getkkViewUrl(row.virtualFilePath);
          // window.open(url);
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
            <el-button type="primary">选择文件</el-button>
          </el-upload>
        );
      }
    }
  ];
};
