import { FormRules } from "element-plus";
import { reactive } from "vue";
import { useRoute } from "vue-router";

const formRules = reactive<FormRules>({
  // productName: [{ required: true, message: "产品名称为必填项", trigger: "change" }],
  // customerModel: [{ required: true, message: "客户型号为必填项", trigger: "change" }],
  // customerName: [{ required: true, message: "客户名称为必填项", trigger: "change" }],
  // deograModel: [{ required: true, message: "德龙型号为必填项", trigger: "change" }],
  devTypeSelect: [{ required: true, message: "开发类型为必填项", trigger: "change" }],
  // saleArea: [{ required: true, message: "销售区域为必填项", trigger: "change" }],
  // referenceModel: [{ required: true, message: "参考机型为必填项", trigger: "change" }],
  productLevelSelect: [{ required: true, message: "产品等级为必填项", trigger: "change" }],
  // applyDeptId: [{ required: true, message: "申请部门为必填项", trigger: "change" }],
  // applyUserCode: [{ required: true, message: "申请人为必填项", trigger: "change" }],
  // applyTime: [{ required: true, message: "申请时间为必填项", trigger: "change" }],
  projectPhaseSelect: [{ required: true, message: "项目阶段为必填项", trigger: "change" }]
});

const layoutCol = { span: 6 };
const labelWidth = 90;

const formConfigs = ({ infoId }) => [
  {
    label: "产品名称",
    prop: "productName",
    labelWidth,
    colProp: layoutCol,
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入" readonly={!!infoId} />;
    }
  },
  {
    label: "客户型号",
    labelWidth,

    prop: "customerModel",
    colProp: layoutCol,
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入" readonly={!!infoId} />;
    }
  },
  {
    label: "德龙型号",
    labelWidth,

    prop: "deograModel",
    colProp: layoutCol,
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入" readonly={!!infoId} />;
    }
  },
  {
    label: "开发类型",
    labelWidth,
    prop: "devTypeSelect",
    colProp: layoutCol,
    render: ({ formModel, row }) => {
      return (
        <el-checkbox-group v-model={formModel[row.prop]}>
          <el-checkbox label="全新" disabled={!!infoId} />
          <el-checkbox label="衍生" disabled={!!infoId} />
        </el-checkbox-group>
      );
    }
  },
  {
    label: "销售区域",
    labelWidth,
    prop: "saleArea",
    colProp: layoutCol,
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入" readonly={!!infoId} />;
    }
  },
  {
    label: "客户名称",
    labelWidth,
    prop: "customerName",
    colProp: layoutCol,
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入" readonly={!!infoId} />;
    }
  },
  {
    label: "参考机型",
    labelWidth,
    prop: "referenceModel",
    colProp: layoutCol,
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入" readonly={!!infoId} />;
    }
  },
  {
    label: "产品等级",
    labelWidth,
    prop: "productLevelSelect",
    colProp: layoutCol,
    render: ({ formModel, row }) => {
      return (
        <el-checkbox-group v-model={formModel[row.prop]}>
          <el-checkbox label="A" disabled={!!infoId} />
          <el-checkbox label="B" disabled={!!infoId} />
          <el-checkbox label="C" disabled={!!infoId} />
        </el-checkbox-group>
      );
    }
  },
  {
    label: "申请部门",
    labelWidth,
    prop: "applyDeptId",
    colProp: layoutCol,
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} readonly />;
    }
  },
  {
    label: "申请人",
    labelWidth,
    prop: "applyUserCode",
    colProp: layoutCol,
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} readonly />;
    }
  },
  {
    label: "申请时间",
    labelWidth,
    prop: "applyTime",
    colProp: layoutCol,
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} readonly />;
    }
  },
  {
    label: "项目阶段",
    labelWidth,
    prop: "projectPhaseSelect",
    colProp: layoutCol,
    render: ({ formModel, row }) => {
      return (
        <el-checkbox-group v-model={formModel[row.prop]} readonly={!!infoId}>
          <el-checkbox label="DR1" disabled={!!infoId} />
          <el-checkbox label="DR2" disabled={!!infoId} />
        </el-checkbox-group>
      );
    }
  }
];

export const formatter = (row, column, cellValue, index, type, infoId?) => {
  const route = useRoute();
  return (
    <div>
      {route.query.id || infoId ? (
        row[column.property]
      ) : type && type === "footer" && column.property !== "planSaleStockDate" ? (
        <el-input v-model={row[column.property]} placeholder="请输入" />
      ) : (
        <el-date-picker style={{ width: "100%" }} size="small" value-format="YYYY-MM-DD" v-model={row[column.property]} type="date" placeholder="请选择" />
      )}
    </div>
  );
};

export { formConfigs, formRules };
