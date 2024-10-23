import { reactive, ref } from "vue";
import { setColumn, tableEditRender } from "@/utils/table";

import { ElMessage } from "element-plus";
import { FormRules } from "element-plus";

export const formRules = reactive<FormRules>({
  taskName: [{ required: true, message: "任务名称为必填项", trigger: "submit" }],
  duration: [{ required: true, message: "工期为必填项", trigger: "submit" }],
  assignsTemplateVOS: [{ required: true, message: "负责岗位为必填项", trigger: "submit" }]
});

const curRow: any = reactive({ row: {} });

export const formConfigs = ({ roleList, _formData, allDeliverTemplates }) => {
  const dataList: any = ref(_formData.deliverablesTemplateVOS);

  const selectionOpts = roleList.value?.map((item) => ({ label: item.roleName, value: item.id }));

  const transData = roleList.value?.map((item) => ({ label: item.roleName, key: item.id }));
  console.log(transData, "transdata");

  const filterMethod = (query, item) => {
    return item.label.toLowerCase().includes(query.toLowerCase());
  };

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

  const handleClickRow = (row, column) => {
    curRow.row = row;
  };

  const tableRowClassName = ({ row, rowIndex }) => {
    //把每一行的索引放进row
    row.index = rowIndex;
  };

  // 编辑表格
  const { editCellRender } = tableEditRender();

  const columns: TableColumnList[] = [
    { label: "交付物名称", prop: "name", cellRenderer: (data) => editCellRender({ data }) },
    {
      label: "交付物模板",
      prop: "deliverableId",
      cellRenderer: (data) => {
        return editCellRender({ type: "select", data, options: allDeliverTemplates.value, cellStyle: { color: "#606266", textAlign: "left" } });
      }
    }
  ];

  return [
    {
      label: "任务名称",
      colProp: { span: 8 },
      labelWidth: 80,
      prop: "taskName",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入任务名称" />;
      }
    },
    {
      label: "工期(天)",
      colProp: { span: 5 },
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
      colProp: { span: 5 },
      prop: "keyTask",
      labelWidth: 40,
      render: ({ formModel, row }) => {
        return <el-checkbox v-model={formModel[row.prop]} label="关键任务" />;
      }
    },
    {
      label: "",
      labelWidth: 0,
      colProp: { span: 15 },
      prop: "taskRelateRoleList",
      render: ({ formModel, row }) => {
        return (
          <el-transfer
            titles={["可选相关岗位", "已选相关岗位"]}
            v-model={formModel[row.prop]}
            filterable
            filter-method={filterMethod}
            filter-placeholder="关键词搜索"
            data={transData}
          />
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
