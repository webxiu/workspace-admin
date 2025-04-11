import { FormConfigItemType } from "@/components/EditForm/index.vue";

const formConfigs = (): FormConfigItemType[] => [
  {
    label: "工资年月",
    prop: "yearMonth",
    colProp: { span: 6 },
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} disabled />;
    }
  },
  // {
  //   label: "职员工资",
  //   prop: "zySalary",
  //   colProp: { span: 6 },
  //   render: ({ formModel, row }) => {
  //     return <el-input v-model={formModel[row.prop]} disabled />;
  //   }
  // },
  // {
  //   label: "员工工资",
  //   prop: "ygSalary",
  //   colProp: { span: 6 },
  //   render: ({ formModel, row }) => {
  //     return <el-input v-model={formModel[row.prop]} disabled />;
  //   }
  // },
  {
    label: "工资总额",
    prop: "salaryTotal",
    colProp: { span: 6 },
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} disabled />;
    }
  },
  {
    label: "单据编号",
    prop: "billNo",
    colProp: { span: 6 },
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} disabled />;
    }
  },
  {
    label: "单据状态",
    prop: "billState",
    colProp: { span: 6 },
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} disabled />;
    }
  },
  {
    label: "创建人",
    prop: "createUserName",
    colProp: { span: 6 },
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} disabled />;
    }
  },
  {
    label: "创建时间",
    prop: "createDate",
    colProp: { span: 6 },
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} disabled />;
    }
  }
  // {
  //   label: "修改人",
  //   prop: "modifyUserName",
  //   colProp: { span: 6 },
  //   render: ({ formModel, row }) => {
  //     return <el-input v-model={formModel[row.prop]} disabled />;
  //   }
  // },
  // {
  //   label: "修改时间",
  //   prop: "modifyDate",
  //   colProp: { span: 6 },
  //   render: ({ formModel, row }) => {
  //     return <el-input v-model={formModel[row.prop]} disabled />;
  //   }
  // }
];

export { formConfigs };
