import { ElMessage, FormRules } from "element-plus";
import { reactive, ref } from "vue";
import { setColumn, tableEditRender } from "@/utils/table";

import ProjectBeforeTask from "./projectBeforeTask.vue";
import ProjectRelationPos from "./projectRelationPos.vue";
import dayjs from "dayjs";
import { getBOMTableRowSelectOptions } from "@/api/plmManage";
import { getkkViewUrl } from "@/utils/storage";
import { roleUserList } from "@/api/systemManage";

export const formRules = reactive<FormRules>({
  name: [{ required: true, message: "任务名称为必填项", trigger: "submit" }],
  duration: [{ required: true, message: "工期不能为空", trigger: "submit" }],
  progress: [{ required: true, message: "进度为必填项", trigger: "submit" }],
  status: [{ required: true, message: "状态为必填项", trigger: "submit" }],
  headUser: [{ required: true, message: "负责人为必填项", trigger: "submit" }],
  editResponsePos: [{ required: true, message: "负责岗位为必填项", trigger: "submit" }]
});

export const formDeliverRules = reactive<FormRules>({
  title: [{ required: true, message: "标题为必填项", trigger: "submit" }],
  remark: [{ required: true, message: "说明为必填项", trigger: "submit" }],
  version: [{ required: true, message: "版本为必填项", trigger: "submit" }],
  files: [{ required: true, message: "请选择文件", trigger: "submit" }]
});

export const formDeliverRules2 = reactive<FormRules>({
  title: [{ required: true, message: "标题为必填项", trigger: "submit" }],
  remark: [{ required: true, message: "内容为必填项", trigger: "submit" }],
  version: [{ required: true, message: "版本为必填项", trigger: "submit" }]
});

const curRow: any = reactive({ row: {} });

export const formConfigs = ({
  _formData,
  row,
  allDeliverTemplates,
  type,
  taskList,
  projectRelationRef,
  projectBeforeTaskRef,
  statusOpts,
  responseUserList,
  isReadOnly
}) => {
  const dataList: any = ref([..._formData.deliverablesTemplateVOS]);
  const userList = ref([]);
  const beforeModeList = ref([]);

  const isDisabledAll = row?.status === "STATUS_DONE" || type === "view";

  // 获取前置模式列表
  getBOMTableRowSelectOptions({ optioncode: "RequireMode" }).then((res) => {
    if (res.data) {
      const modeList = res.data[0]?.optionList || [];
      beforeModeList.value = modeList.map((item) => ({ optionName: item.optionName, optionValue: +item.optionValue }));
      projectBeforeTaskRef.value.beforeTaskModeList = modeList.map((item) => ({ optionName: item.optionName, optionValue: +item.optionValue }));
    }
  });

  const changeResOptions = (val, sign?) => {
    roleUserList({ roleId: val }).then((res) => {
      if (res.data && res.data.length) {
        userList.value = res.data.map(({ userId, userName }) => ({ label: userName, value: userId }));

        if (!sign) {
          _formData.headUser = userList.value[0]?.value;
        }
      } else {
        _formData.headUser = undefined;
      }
    });
  };

  if (["edit", "view"].includes(type)) {
    const clickRoleId = row.projectTaskResponsiblePersonnelVOList[0]?.roleId;
    changeResOptions(clickRoleId, true);
  }

  const addRow = () => {
    _formData.deliverablesTemplateVOS.push({ name: "", deliverableId: "" });
    dataList.value = _formData.deliverablesTemplateVOS;
  };

  const delRow = () => {
    if (JSON.stringify(curRow.row) != "{}") {
      dataList.value.splice(curRow.row.index, 1);
      _formData.deliverablesTemplateVOS = dataList.value;
      curRow.row = {};
    } else {
      ElMessage({ message: "请选择记录", type: "warning" });
    }
  };

  // 编辑表格
  const { editCellRender } = tableEditRender();

  const columns: TableColumnList[] = [
    { label: "交付物名称", prop: "name", cellRenderer: (data) => editCellRender({ data, isEdit: !isReadOnly }) },
    {
      label: "交付物模板",
      prop: "deliverableTemplateId",
      cellRenderer: (data) => {
        return editCellRender({
          type: "select",
          data,
          options: allDeliverTemplates.value,
          isEdit: !isReadOnly,
          cellStyle: { color: "#606266", textAlign: "left" }
        });
      }
    }
  ];

  const handleClickRow = (row, column) => {
    curRow.row = row;
  };

  const tableRowClassName = ({ row, rowIndex }) => {
    //把每一行的索引放进row
    row.index = rowIndex;
  };

  const changeTaskStore = (val) => {
    const filterDeliverInfo = taskList.value.find((item) => item.taskName == val) || {};
    _formData.deliverablesTemplateVOS =
      filterDeliverInfo.taskModelDeliverablesList?.map((item) => ({ ...item, deliverableTemplateId: item.deliverableId })) || [];
    _formData.duration = filterDeliverInfo.duration;
    _formData.editResponsePos = filterDeliverInfo.taskModelResponsibleRolesList[0]?.roleId;

    roleUserList({ roleId: _formData.editResponsePos }).then((res) => {
      if (res.data) {
        userList.value = res.data.map(({ userId, userName }) => ({ label: userName, value: userId }));
      }
    });
  };

  const changeStartDate = (val) => {
    if (_formData.start && _formData.end) {
      if (dayjs(val).isAfter(dayjs(_formData.end))) {
        ElMessage({ message: "开始日期不能晚于结束日期", type: "error" });
        _formData.start = undefined;
        return;
      }
      _formData.duration = dayjs(_formData.end).diff(val, "day");
    }
  };

  const changeEndDate = (val) => {
    if (_formData.start && _formData.end) {
      if (dayjs(val).isBefore(dayjs(_formData.start))) {
        ElMessage({ message: "结束日期不能早于开始日期", type: "error" });
        _formData.end = undefined;
        return;
      }
      _formData.duration = dayjs(val).diff(dayjs(_formData.start).format("YYYY-MM-DD"), "day");
    }
  };

  const changeStatus = (status) => {
    switch (status) {
      case "STATUS_ACTIVE":
        if (!_formData.realStart) {
          _formData.realStart = dayjs().format("YYYY-MM-DD");
        }
        break;
      case "STATUS_DONE":
        if (!_formData.realEnd) {
          _formData.realEnd = dayjs().format("YYYY-MM-DD");
        }
        break;

      default:
        break;
    }
  };

  return [
    {
      label: "任务名称",
      colProp: { span: 8 },
      labelWidth: 100,
      prop: "name",
      render: ({ formModel, row }) => {
        return (
          <el-select
            disabled={["edit", "view"].includes(type)}
            filterable
            onChange={changeTaskStore}
            style={{ width: "100%" }}
            v-model={formModel[row.prop]}
            placeholder="请选择任务"
          >
            {taskList.value.map((item) => (
              <el-option key={item.id} label={item.taskName} value={item.taskName} disabled={item.disabled} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "负责岗位",
      colProp: { span: 8 },
      labelWidth: 100,
      prop: "editResponsePos",
      render: ({ formModel, row }) => {
        return (
          <el-select
            disabled={isDisabledAll}
            style={{ width: "100%" }}
            onChange={changeResOptions}
            filterable
            v-model={formModel[row.prop]}
            placeholder="请选择负责岗位"
          >
            {responseUserList.value.map((item) => (
              <el-option key={item.value} label={item.label} value={item.value} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "负责人",
      colProp: { span: 8 },
      labelWidth: 100,
      prop: "headUser",
      render: ({ formModel, row }) => {
        return (
          <el-select disabled={isDisabledAll} filterable style={{ width: "100%" }} v-model={formModel[row.prop]} placeholder="请选择负责人">
            {userList.value.map((item) => (
              <el-option key={item.roleId} label={item.label} value={item.value} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "开始日期",
      colProp: { span: 8 },
      labelWidth: 100,
      prop: "start",
      render: ({ formModel, row }) => {
        return (
          <el-date-picker
            style={{ width: "100%" }}
            onChange={changeStartDate}
            v-model={formModel[row.prop]}
            type="date"
            disabled={type === "add" || isDisabledAll}
            placeholder="自动计算"
            format="YYYY-MM-DD"
            valueFormat="YYYY-MM-DD"
          />
        );
      }
    },
    {
      label: "结束日期",
      colProp: { span: 8 },
      labelWidth: 100,
      prop: "end",
      render: ({ formModel, row }) => {
        return (
          <el-date-picker
            style={{ width: "100%" }}
            onChange={changeEndDate}
            v-model={formModel[row.prop]}
            type="date"
            placeholder="自动计算"
            disabled={type === "add" || isDisabledAll}
            format="YYYY-MM-DD"
            valueFormat="YYYY-MM-DD"
          />
        );
      }
    },
    {
      label: "状态",
      colProp: { span: 8 },
      labelWidth: 100,
      prop: "status",
      render: ({ formModel, row }) => {
        return (
          <el-select
            onChange={changeStatus}
            filterable
            disabled={isDisabledAll}
            style={{ width: "100%" }}
            v-model={formModel[row.prop]}
            placeholder="请选择状态"
          >
            {statusOpts.value?.map((item) => (
              <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "实际开始日期",
      colProp: { span: 8 },
      labelWidth: 100,
      prop: "realStart",
      render: ({ formModel, row }) => {
        return (
          <el-date-picker
            style={{ width: "100%" }}
            v-model={formModel[row.prop]}
            type="date"
            disabled
            placeholder="请选择"
            format="YYYY-MM-DD"
            valueFormat="YYYY-MM-DD"
          />
        );
      }
    },
    {
      label: "实际结束日期",
      colProp: { span: 8 },
      labelWidth: 100,
      prop: "realEnd",
      render: ({ formModel, row }) => {
        return (
          <el-date-picker
            style={{ width: "100%" }}
            v-model={formModel[row.prop]}
            type="date"
            placeholder="请选择"
            disabled
            format="YYYY-MM-DD"
            valueFormat="YYYY-MM-DD"
          />
        );
      }
    },
    {
      label: "工期(天)",
      colProp: { span: 8 },
      labelWidth: 100,
      prop: "duration",
      render: ({ formModel, row }) => {
        return <el-input-number disabled={type === "edit" || isDisabledAll} style={{ width: "100%" }} max={100} v-model={formModel[row.prop]} min={0} />;
      }
    },
    {
      label: "进度(%)",
      colProp: { span: 8 },
      labelWidth: 100,
      prop: "progress",
      render: ({ formModel, row }) => {
        return <el-input-number disabled={isDisabledAll} style={{ width: "100%" }} v-model={formModel[row.prop]} min={0} max={100} />;
      }
    },
    {
      label: "描述",
      colProp: { span: 8 },
      labelWidth: 100,
      prop: "description",
      render: ({ formModel, row }) => {
        return <el-input autosize disabled={isDisabledAll} type="textarea" v-model={formModel[row.prop]} placeholder="请输入描述内容" />;
      }
    },
    {
      label: "",
      colProp: { span: 8 },
      prop: "",
      render: () => null
    },
    {
      label: "",
      labelWidth: 0,
      colProp: { span: 6 },
      prop: "taskRelateRoleList",
      render: ({ formModel, row }) => {
        return (
          <div>
            <ProjectRelationPos v-model={formModel[row.prop]} ref={projectRelationRef} disabled={isDisabledAll} />
          </div>
        );
      }
    },
    {
      label: "",
      colProp: { span: 9 },
      labelWidth: 0,
      prop: "taskRequires",
      render: ({ formModel, row }) => {
        return (
          <div>
            <ProjectBeforeTask ref={projectBeforeTaskRef} v-model={formModel[row.prop]} formData={_formData} disabled={isDisabledAll} />
          </div>
        );
      }
    },
    {
      label: "",
      colProp: { span: 9 },
      labelWidth: 0,
      prop: "deliverablesTemplateVOS",
      render: ({ formModel, row }) => {
        return (
          <div style=" width: 100%">
            <div style="margin-bottom: 10px">
              <el-button type="primary" plain size="small" onClick={addRow} disabled={isReadOnly || isDisabledAll}>
                增行
              </el-button>
              <el-button type="danger" plain size="small" onClick={delRow} disabled={isReadOnly || isDisabledAll}>
                删行
              </el-button>
            </div>
            <pure-table
              border
              height={275}
              row-key="id"
              class="bill-manage"
              adaptive
              align-whole="left"
              row-class-name={tableRowClassName}
              size="small"
              data={formModel[row.prop]}
              columns={setColumn({ columnData: columns, operationColumn: false, indexColumn: false })}
              onRow-click={handleClickRow}
              highlight-current-row
              show-overflow-tooltip
            />
          </div>
        );
      }
    }
  ];
};

export const formDeliverConfigs = (readOnly = false, deleteFileIds) => {
  return [
    {
      label: "单据编号",
      colProp: { span: 8 },
      labelWidth: 80,
      prop: "billNo",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="保存后自动生成" disabled />;
      }
    },
    {
      label: "项目名称",
      colProp: { span: 8 },
      labelWidth: 80,
      prop: "projectName",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "任务名称",
      colProp: { span: 8 },
      labelWidth: 80,
      prop: "taskName",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "创建人",
      colProp: { span: 8 },
      labelWidth: 80,
      prop: "createUserName",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "创建时间",
      colProp: { span: 8 },
      labelWidth: 80,
      prop: "createDate",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "状态",
      colProp: { span: 8 },
      labelWidth: 80,
      prop: "billState",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "标题",
      colProp: { span: 16 },
      labelWidth: 80,
      prop: "title",
      render: ({ formModel, row }) => {
        return <el-input disabled={readOnly} v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "版本",
      colProp: { span: 8 },
      labelWidth: 80,
      prop: "version",
      render: ({ formModel, row }) => {
        return <el-input disabled v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "说明",
      colProp: { span: 24 },
      labelWidth: 80,
      prop: "remark",
      render: ({ formModel, row }) => {
        return <el-input disabled={readOnly} type="textarea" autosize={{ minRows: 3 }} v-model={formModel[row.prop]} />;
      }
    },
    {
      slots: { label: () => <span style={{ fontSize: "14px", color: "#606266", fontWeight: "700" }}>文件</span> },
      colProp: { span: 24 },
      labelWidth: 80,
      prop: "files",
      render: ({ formModel, row }) => {
        const handleRemove = (file) => {
          if (file.entryid) {
            deleteFileIds.value.push(file.entryid);
          }
        };
        const beforeRemove = () => !readOnly;
        const uploadFile = () => {};

        const handlePreview = async (row) => {
          const url = getkkViewUrl(row.virtualFileUrl);
          window.open(url);
        };
        return (
          <el-upload
            v-model:file-list={formModel[row.prop]}
            style={{ width: "100%" }}
            class="deliverable-upload"
            auto-upload={false}
            on-change={uploadFile}
            action="#"
            multiple
            on-remove={handleRemove}
            on-preview={handlePreview}
            before-remove={beforeRemove}
          >
            <el-button type="primary" disabled={readOnly}>
              选择文件
            </el-button>
          </el-upload>
        );
      }
    }
  ];
};

export const formDeliverConfigs2 = (readOnly = false, deleteFileIds) => {
  return [
    {
      label: "单据编号",
      colProp: { span: 8 },
      labelWidth: 80,
      prop: "billNo",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="保存后自动生成" disabled />;
      }
    },
    {
      label: "项目名称",
      colProp: { span: 8 },
      labelWidth: 80,
      prop: "projectName",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "任务名称",
      colProp: { span: 8 },
      labelWidth: 80,
      prop: "taskName",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "创建人",
      colProp: { span: 8 },
      labelWidth: 80,
      prop: "createUserName",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "创建时间",
      colProp: { span: 8 },
      labelWidth: 80,
      prop: "createDate",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "状态",
      colProp: { span: 8 },
      labelWidth: 80,
      prop: "billState",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "标题",
      colProp: { span: 16 },
      labelWidth: 80,
      prop: "title",
      render: ({ formModel, row }) => {
        return <el-input disabled={readOnly} v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "内容",
      colProp: { span: 24 },
      labelWidth: 80,
      prop: "remark",
      render: ({ formModel, row }) => {
        return <el-input disabled={readOnly} type="textarea" autosize={{ minRows: 6 }} v-model={formModel[row.prop]} />;
      }
    }
  ];
};
