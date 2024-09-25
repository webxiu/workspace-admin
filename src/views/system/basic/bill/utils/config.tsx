import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import { reactive } from "vue";
import regExp from "@/utils/regExp";

const GridSpan = 12;
const layout = { span: GridSpan, xs: 24, sm: 12, md: 12, lg: 12, xl: 12 };

// 编辑员工信息校验
export const formRules = reactive<FormRules>({
  billId: [{ required: true, message: "业务ID为必填项", trigger: "blur" }],
  yearLength: [{ required: true, message: "年份长度为必填项", trigger: "blur" }],
  monthLength: [{ required: true, message: "月份长度为必填项", trigger: "blur" }],
  dayLength: [{ required: true, message: "日期长度为必填项", trigger: "blur" }],
  sequenceLength: [{ required: true, message: "序列号长度为必填项", trigger: "blur" }],
  projectNo: [{ required: true, message: "归属模块为必选项", trigger: "blur" }],
  menuName: [{ required: true, message: "菜单为必选项", trigger: "blur" }]
});

// 编辑员工信息表单
export const formConfigs = ({ projectsList, onSelectMenu }): FormConfigItemType[] => {
  return [
    {
      label: "业务ID",
      prop: "billId",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入业务ID" clearable />;
      }
    },
    {
      label: "前缀字符",
      prop: "prefix",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入前缀字符" clearable />;
      }
    },
    {
      label: "年份长度",
      prop: "yearLength",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入年份长度" clearable />;
      }
    },
    {
      label: "月份长度",
      prop: "monthLength",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入月份长度" clearable />;
      }
    },
    {
      label: "日期长度",
      prop: "dayLength",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入日期长度" clearable />;
      }
    },
    {
      label: "序列号长度",
      prop: "sequenceLength",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入序列号长度" clearable />;
      }
    },
    {
      label: "后缀字符",
      prop: "suffix",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入后缀字符" clearable />;
      }
    },
    {
      label: "备注",
      prop: "remark",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入备注" clearable />;
      }
    },
    {
      label: "归属模块",
      prop: "projectNo",
      colProp: layout,
      render: ({ formModel, row }) => {
        return (
          <el-select
            v-model={formModel[row.prop]}
            placeholder="请选择"
            filterable
            value-key="projectNo"
            clearable
            collapse-tags
            collapse-tags-tooltip
            class="ui-w-100"
          >
            {projectsList.value.map((item) => (
              <el-option key={item.projectNo} label={item.projectName} value={item.projectNo} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "菜单",
      prop: "menuName",
      colProp: layout,
      render: ({ formModel, row }) => {
        return (
          <el-input v-model={formModel[row.prop]} placeholder="请选择菜单" readonly>
            {{ append: () => <el-button onClick={onSelectMenu}>选择</el-button> }}
          </el-input>
        );
      }
    }
  ];
};
