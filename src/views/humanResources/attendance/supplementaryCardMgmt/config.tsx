import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import { reactive } from "vue";
import DetailTable from "./detailTable.vue";

export const formRules = reactive<FormRules>({});

export const formConfigs = ({ searchOptions, loadTableData, _formData, updateLineTime }): FormConfigItemType[] => {
  return [
    {
      label: "单据编号",
      prop: "billNo",
      labelWidth: 98,
      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        return <el-input size="small" v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "单据状态",
      prop: "billState",
      colProp: { span: 8 },
      labelWidth: 98,
      render: ({ formModel, row }) => {
        return (
          <el-select size="small" v-model={formModel[row.prop]} placeholder="请选择单据状态" class="ui-w-100" disabled>
            {searchOptions[1].children.map((item) => (
              <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "部门",
      prop: "deptId",
      colProp: { span: 8 },
      labelWidth: 98,
      render: ({ formModel, row }) => {
        return (
          <el-tree-select
            size="small"
            v-model={formModel[row.prop]}
            data={searchOptions[2].children[0].children}
            filterable
            check-strictly
            default-expanded-keys={[0]}
            node-key="value"
            render-after-expand={false}
            class="ui-w-100"
          />
        );
      }
    },
    {
      label: "创建人",
      prop: "createUserName",
      colProp: { span: 8 },
      labelWidth: 98,
      render: ({ formModel, row }) => {
        return <el-input size="small" v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "创建时间",
      prop: "createDate",
      colProp: { span: 8 },
      labelWidth: 98,
      render: ({ formModel, row }) => {
        return <el-input size="small" v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "最后修改人",
      prop: "modifyUserName",
      colProp: { span: 8 },
      labelWidth: 98,
      render: ({ formModel, row }) => {
        return <el-input size="small" v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "最后修改时间",
      prop: "modifyDate",
      colProp: { span: 8 },
      labelWidth: 98,
      render: ({ formModel, row }) => {
        return <el-input size="small" v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "",
      prop: "detailList",
      labelWidth: 98,
      colProp: { span: 24 },
      render: ({ formModel, row }) => {
        return <DetailTable v-model={formModel[row.prop]} onLoadTableData={loadTableData} _formData={_formData} onUpdateLineTime={updateLineTime} />;
      }
    }
  ];
};
