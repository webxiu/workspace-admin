import { ElMessage, FormRules } from "element-plus";

import { reactive } from "vue";

export const formRules = reactive<FormRules>({
  reportName: [{ required: true, message: "测试报告名称为必填项", trigger: "submit" }]
});

export const formConfigs = ({ curType, backRows, curMultipeUserList, fileList, handleDown, handleAdd, handleUp, formData, treeSelectData }) => [
  {
    label: "单据编号",
    labelWidth: 120,
    colProp: { span: 8 },
    prop: "billNo",
    render: ({ formModel, row }) => {
      return <el-input disabled v-model={formModel[row.prop]} />;
    }
  },
  {
    label: "申请表名称",
    labelWidth: 120,
    colProp: { span: 8 },
    prop: "applyName",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入申请表名称" />;
    }
  },
  {
    label: "审批状态",
    labelWidth: 120,
    colProp: { span: 8 },
    prop: "billStateName",
    render: ({ formModel, row }) => {
      return <el-input disabled v-model={formModel[row.prop]} />;
    }
  },
  {
    label: "项目评估",
    labelWidth: 120,
    colProp: { span: 8 },
    prop: "projectAssess",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入项目评估" />;
    }
  },
  {
    label: "评估人",
    labelWidth: 120,
    colProp: { span: 8 },
    prop: "projectAssessUserName",
    render: ({ formModel, row }) => {
      // formData.projectAssessUserName = curMultipeUserList.value[0]?.userName;
      // formData.projectAssessUserId = curMultipeUserList.value[0]?.id + "";
      return <el-input readonly v-model={formModel[row.prop]} placeholder="请选择评估人" onClick={() => handleAdd(formData)} />;
      // return <el-input v-model={formModel[row.prop]} placeholder="请输入评估人" />;
    }
  },
  {
    label: "样机名称",
    colProp: { span: 8 },
    labelWidth: 120,
    prop: "prototypeName",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入样机名称" />;
    }
  },
  {
    label: "产品型号",
    colProp: { span: 8 },
    labelWidth: 120,
    prop: "productModel",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入产品型号" />;
    }
  },
  {
    label: "程序校验码",
    colProp: { span: 8 },
    labelWidth: 120,
    prop: "validationCode",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入程序校验码" />;
    }
  },
  {
    label: "送样数量",
    colProp: { span: 8 },
    labelWidth: 120,
    prop: "sampleNum",
    render: ({ formModel, row }) => {
      return <el-input-number v-model={formModel[row.prop]} min={0} />;
    }
  },
  {
    label: "申请测试原因",
    colProp: { span: 12 },
    labelWidth: 120,
    prop: "applyTestReason",
    render: ({ formModel, row }) => {
      return <el-input type="textarea" v-model={formModel[row.prop]} placeholder="请输入申请测试原因" />;
    }
  },
  {
    label: "一般测试要求",
    colProp: { span: 12 },
    labelWidth: 120,
    prop: "testRequire",
    render: ({ formModel, row }) => {
      return <el-input type="textarea" v-model={formModel[row.prop]} placeholder="请输入一般测试要求" />;
    }
  },
  {
    label: "特殊测试要求",
    colProp: { span: 12 },
    labelWidth: 120,
    prop: "specialTestRequire",
    render: ({ formModel, row }) => {
      return <el-input type="textarea" v-model={formModel[row.prop]} placeholder="请输入特殊测试要求" />;
    }
  },
  {
    label: "差异说明",
    colProp: { span: 12 },
    labelWidth: 120,
    prop: "divideRemark",
    render: ({ formModel, row }) => {
      return <el-input type="textarea" v-model={formModel[row.prop]} placeholder="请输入差异说明" />;
    }
  },
  {
    label: "参考机型",
    labelWidth: 120,
    colProp: { span: 12 },
    prop: "referenceModel",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入参考机型" />;
    }
  },
  {
    label: "更改内容",
    labelWidth: 120,
    colProp: { span: 12 },
    prop: "changeContent",
    render: ({ formModel, row }) => {
      return <el-input type="textarea" v-model={formModel[row.prop]} placeholder="请输入更改内容" />;
    }
  },
  {
    label: "要求完成日期",
    colProp: { span: 8 },
    labelWidth: 120,
    prop: "completionDate",
    render: ({ formModel, row }) => {
      return <el-date-picker v-model={formModel[row.prop]} format="YYYY-MM-DD" value-format="YYYY-MM-DD" type="date" placeholder="请选择完成日期" />;
    }
  },
  {
    label: "申请人",
    colProp: { span: 8 },
    labelWidth: 120,
    prop: "applyUserName",
    render: ({ formModel, row }) => {
      return (
        <div style={{ width: "100%" }}>
          <el-input v-model={formModel[row.prop]} disabled />
        </div>
      );
    }
  }

  // {
  //   label: "申请部门审核",
  //   colProp: { span: 8 },
  //   labelWidth: 120,
  //   prop: "applyDeptAppr",
  //   render: ({ formModel, row }) => {
  //     return (
  //       <el-tree-select
  //         props={{ children: "children", label: "deptName", value: "itemId" }}
  //         v-model={formModel[row.prop]}
  //         data={treeSelectData.value}
  //         filterable
  //         check-strictly
  //         default-expanded-keys={[0]}
  //         node-key="itemId"
  //         render-after-expand={false}
  //         class="ui-w-100"
  //       />
  //     );
  //   }
  // },
  // {
  //   label: "测试单位",
  //   colProp: { span: 8 },
  //   labelWidth: 120,
  //   prop: "testUnit",
  //   render: ({ formModel, row }) => {
  //     return <el-input style={{ width: 50 }} v-model={formModel[row.prop]} placeholder="请输入测试单位" />;
  //   }
  // },
  // {
  //   label: "批准",
  //   labelWidth: 120,
  //   colProp: { span: 8 },
  //   prop: "ratify",
  //   render: ({ formModel, row }) => {
  //     return <el-input style={{ width: 50 }} placeholder="请输入" v-model={formModel[row.prop]} />;
  //   }
  // }
];
