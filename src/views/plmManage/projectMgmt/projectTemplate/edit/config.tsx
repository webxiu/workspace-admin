import { ElMessage, FormRules } from "element-plus";
import { reactive, ref } from "vue";
import { setColumn, tableEditRender } from "@/utils/table";

import RelationPos from "./relationPos.vue";
import { getBOMTableRowSelectOptions } from "@/api/plmManage";

export const formRulesEdit = reactive<FormRules>({
  taskName: [{ required: true, message: "任务名称为必填项", trigger: "submit" }],
  duration: [{ required: true, message: "工期为必填项", trigger: "submit" }],
  assignsTemplateVOS: [{ required: true, message: "负责岗位为必填项", trigger: "submit" }]
});

const curRow: any = reactive({ row: {} });
const curRow2: any = reactive({ row: {} });

export const formConfigsEdit = ({ roleList, _formData, allDeliverTemplates, modelBeforeTaskRef, modelRelationRef, beforeTaskList }) => {
  const dataList: any = ref(_formData.deliverablesTemplateVOS);
  const dataList2: any = ref(_formData.projectModelTaskRequireList);
  const selectionOpts = roleList.value?.map((item) => ({ label: item.roleName, value: item.id }));
  const beforeTaskModeList2: any = ref([]);

  // 编辑表格
  const editCell_1 = tableEditRender();
  const editCell_2 = tableEditRender();

  // 获取前置模式列表
  getBOMTableRowSelectOptions({ optioncode: "RequireMode" }).then((res) => {
    if (res.data) {
      const modeList = res.data[0]?.optionList || [];
      beforeTaskModeList2.value = modeList.map((item) => ({ optionName: item.optionName, optionValue: item.optionValue }));
    }
  });
  const addRow = () => {
    dataList.value.push({ name: "", deliverableId: "" });
  };

  const delRow = () => {
    if (JSON.stringify(curRow.row) !== "{}") {
      dataList.value.splice(curRow.row.index, 1);
    } else {
      ElMessage({ message: "请选择记录", type: "warning" });
    }
  };

  const freshSelectOpts = () => {
    const selectedArr = _formData.projectModelTaskRequireList.map((item) => item.beforeTaskId);

    const filterOpts = beforeTaskList.value?.map((item) => {
      if (item.optionName === _formData.taskName || selectedArr.includes(item.optionValue)) {
        item.disabled = true;
      } else {
        item.disabled = false;
      }
      return item;
    });
    beforeTaskList.value = filterOpts;
  };

  const addRow2 = () => {
    freshSelectOpts();
    _formData.projectModelTaskRequireList.push({ beforeTaskId: "", requireMode: "", delayDays: "" });
  };

  const delRow2 = () => {
    if (JSON.stringify(curRow2.row) !== "{}") {
      _formData.projectModelTaskRequireList.splice(curRow2.row.index, 1);
    } else {
      ElMessage({ message: "请选择记录", type: "warning" });
    }
    freshSelectOpts();
  };

  const handleClickRow = (row, column) => {
    curRow.row = row;
  };
  const handleClickRow2 = (row, column) => {
    curRow2.row = row;
  };

  const tableRowClassName = ({ row, rowIndex }) => {
    //把每一行的索引放进row
    row.index = rowIndex;
  };

  const columns: TableColumnList[] = [
    { label: "交付物名称", prop: "name", cellRenderer: (data) => editCell_1.editCellRender({ data }) },
    {
      label: "交付物模板",
      prop: "deliverableId",
      cellRenderer: (data) => {
        return editCell_1.editCellRender({ type: "select", data, options: allDeliverTemplates.value, cellStyle: { color: "#606266", textAlign: "left" } });
      }
    }
  ];

  const columns2: TableColumnList[] = [
    {
      label: "前置任务",
      prop: "beforeTaskId",
      cellRenderer: (data) => {
        return editCell_2.editCellRender({ type: "treeSelect", data, options: beforeTaskList.value, cellStyle: { color: "#606266", textAlign: "left" } });
      }
    },
    {
      label: "前置模式",
      prop: "requireMode",
      cellRenderer: (data) => {
        if (data.row.requireMode == 1) data.row.delayDays = "";
        return editCell_2.editCellRender({
          type: "select",
          data,
          options: beforeTaskModeList2.value,
          isEdit: data.row.beforeTaskId,
          cellStyle: { color: "#606266", textAlign: "left" }
        });
      }
    },
    {
      label: "延迟天数",
      prop: "delayDays",
      cellRenderer: (data) => editCell_2.editCellRender({ data, isEdit: data.row.requireMode && data.row.requireMode != 1 })
    }
  ];

  return [
    {
      label: "任务名称",
      colProp: { span: 6 },
      labelWidth: 80,
      prop: "taskName",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入任务名称" />;
      }
    },
    {
      label: "工期(天)",
      colProp: { span: 6 },
      labelWidth: 80,
      prop: "duration",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入工期天数" />;
      }
    },
    {
      label: "负责岗位",
      colProp: { span: 6 },
      labelWidth: 80,
      prop: "assignsTemplateVOS",
      render: ({ formModel, row }) => {
        return (
          <el-select filterable style={{ width: "100%" }} v-model={formModel[row.prop]} placeholder="请选择负责岗位">
            {selectionOpts.map((item) => (
              <el-option key={item.value} label={item.label} value={item.value} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "",
      labelWidth: 0,
      colProp: { span: 6 },
      render: () => {
        return null;
      }
    },
    {
      label: "",
      labelWidth: 0,
      colProp: { span: 6 },
      prop: "taskRelateRoleList",
      render: ({ formModel, row }) => {
        return (
          <div>
            <RelationPos v-model={formModel[row.prop]} ref={modelRelationRef} />
          </div>
        );
      }
    },
    {
      label: "",
      colProp: { span: 9 },
      labelWidth: 0,
      prop: "projectModelTaskRequireList",
      render: ({ formModel, row }) => {
        return (
          <div style=" width: 100%">
            <div style="margin-bottom: 10px">
              <el-button type="primary" plain size="small" onClick={addRow2}>
                增行
              </el-button>
              <el-button type="danger" plain size="small" onClick={delRow2}>
                删行
              </el-button>
            </div>
            <pure-table
              border
              height={275}
              row-key="beforeTaskId"
              adaptive
              align-whole="left"
              row-class-name={tableRowClassName}
              size="small"
              data={formModel[row.prop]}
              columns={setColumn({ columnData: columns2, operationColumn: false, indexColumn: false })}
              onRow-click={handleClickRow2}
              highlight-current-row
              show-overflow-tooltip
            />
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
              <el-button type="primary" plain size="small" onClick={addRow}>
                增行
              </el-button>
              <el-button type="danger" plain size="small" onClick={delRow}>
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
