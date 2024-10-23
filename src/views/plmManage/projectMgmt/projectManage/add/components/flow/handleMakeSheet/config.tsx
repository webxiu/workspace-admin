import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import { reactive, Ref, ref } from "vue";

export const formRules = reactive<FormRules>({
  productName: [{ required: true, message: "产品名称为必填项", trigger: "change" }],
  forecastCode: [{ required: true, message: "产品预研号为必填项", trigger: "change" }],
  applyDate: [{ required: true, message: "申请时间为必填项", trigger: "change" }],
  handleCategory: [{ required: true, message: "手板类别为必填项", trigger: "change" }],
  assumeFee: [{ required: true, message: "费用承担为必填项", trigger: "change" }],
  estimateFee: [{ required: true, message: "费用预估为必填项", trigger: "change" }],
  reqFinishDate: [{ required: true, message: "要求完成时间为必填项", trigger: "change" }],
  normalTestRequire: [{ required: true, message: "一般测试要求为必填项", trigger: "change" }],
  applyDeptId: [{ required: true, message: "申请部门为必填项", trigger: "change" }],
  applyUserId: [{ required: true, message: "申请人为必填项", trigger: "change" }],
  estimateDate: [{ required: true, message: "预计完成时间为必填项", trigger: "change" }]
  // applyReason: [{ required: true, message: "申请原因为必填项", trigger: "change" }],
  // otherTestRequire: [{ required: true, message: "特殊测试要求为必填项", trigger: "change" }],
  // devReply: [{ required: true, message: "研发部回复为必填项", trigger: "change" }]
});

export const formConfigs = ({ selectOpts, treeSelectData, changeTreeData, userList }): Ref<FormConfigItemType[]> => {
  const configInitArr: FormConfigItemType[] = [
    {
      label: "产品名称/型号",
      prop: "productName",
      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请填写产品名称/型号" />;
      }
    },
    {
      label: "产品预研号",
      prop: "forecastCode",
      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请填写产品预研号" />;
      }
    },
    {
      label: "申请时间",
      prop: "applyDate",
      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        return <el-date-picker v-model={formModel[row.prop]} type="date" placeholder="请选择申请时间" valueFormat="YYYY-MM-DD" format="YYYY-MM-DD" />;
      }
    },
    {
      label: "手板类别",
      prop: "handleCategory",
      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        return (
          <el-select filterable v-model={formModel[row.prop]} placeholder="请选择手板类别">
            {selectOpts.HandleCategory?.map((item) => (
              <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "费用承担",
      prop: "assumeFee",
      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        return <el-input-number class="ui-w-100" v-model={formModel[row.prop]} min={0} controls={false} placeholder="请填写承担费用" />;
      }
    },
    {
      label: "费用预估",
      prop: "estimateFee",
      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        return <el-input-number class="ui-w-100" v-model={formModel[row.prop]} min={0} controls={false} placeholder="请填写费用预估" />;
      }
    },
    {
      label: "要求完成时间",
      prop: "reqFinishDate",
      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        return <el-date-picker v-model={formModel[row.prop]} type="date" placeholder="请选择完成时间" valueFormat="YYYY-MM-DD" format="YYYY-MM-DD" />;
      }
    },
    {
      label: "一般测试要求",
      prop: "normalTestRequire",
      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        return (
          <el-select filterable v-model={formModel[row.prop]} placeholder="请选择一般测试要求">
            {selectOpts.NormalTestRequire?.map((item) => (
              <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "申请部门",
      prop: "applyDeptId",
      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        return (
          <el-tree-select
            v-model={formModel[row.prop]}
            data={treeSelectData}
            placeholder="请选择申请部门"
            filterable
            check-strictly
            default-expanded-keys={["0"]}
            node-key="value"
            render-after-expand={false}
            onChange={changeTreeData}
            class="ui-w-100"
          />
        );
      }
    },
    {
      label: "申请人",
      prop: "applyUserId",
      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        return (
          <el-select filterable v-model={formModel[row.prop]} placeholder="请选择申请人">
            {userList.map((item) => (
              <el-option key={item.id} label={item.userName} value={item.id} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "预计完成时间",
      prop: "estimateDate",
      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        return <el-date-picker v-model={formModel[row.prop]} type="date" placeholder="请选择预计完成时间" valueFormat="YYYY-MM-DD" format="YYYY-MM-DD" />;
      }
    },
    {
      label: "申请原因",
      prop: "applyReason",
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input type="textarea" autosize v-model={formModel[row.prop]} placeholder="请填写申请原因" />;
      }
    },

    {
      label: "特殊测试要求",
      prop: "otherTestRequire",
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input type="textarea" autosize v-model={formModel[row.prop]} placeholder="请填写特殊测试要求" />;
      }
    },

    {
      label: "研发部回复",
      prop: "devReply",
      colProp: { span: 24 },
      render: ({ formModel, row }) => {
        return <el-input type="textarea" autosize={{ minRows: 3 }} v-model={formModel[row.prop]} placeholder="请填写研发部回复" />;
      }
    }
  ];

  const newList = ref(configInitArr);
  const changeStockCheck = (val) => {
    const findResIdx = newList.value.findIndex((item) => item.prop === "reCheckDays");
    if (val === "enable") {
      if (findResIdx >= 0) {
        newList.value[findResIdx].hide = false;
      }
    } else {
      newList.value[findResIdx].hide = true;
    }
  };

  const changeNotice = (val) => {
    const findResIdx = newList.value.findIndex((item) => item.prop === "stockReCheckNoticeDays");
    if (val === "enable") {
      if (findResIdx >= 0) {
        newList.value[findResIdx].hide = false;
      }
    } else {
      newList.value[findResIdx].hide = true;
    }
  };

  /** @ts-ignore */
  return newList;
};
