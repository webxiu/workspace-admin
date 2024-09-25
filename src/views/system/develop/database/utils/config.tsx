import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import { reactive } from "vue";

/** 单据状态枚举 */
export enum StatusType {
  /** 待提交 */
  pending = 0,
  /** 待审核 */
  audit = 1,
  /** 已审批 */
  audited = 2,
  /** 驳回重审 */
  rebut = 3
}

/** 单据状态配置 */
export const BillStatus = {
  [StatusType.pending]: { color: "#e6a23c", name: "待提交" },
  [StatusType.audit]: { color: "#409eff", name: "待审核" },
  [StatusType.audited]: { color: "#67c23a", name: "已审批" },
  [StatusType.rebut]: { color: "#DC143C", name: "驳回重审" }
};

// 编辑SQL单据校验
export const formRules = reactive<FormRules>({
  title: [{ required: true, message: "标题为必填项", trigger: "blur" }],
  dbKey: [{ required: true, message: "数据库为必选项", trigger: "blur" }],
  reason: [{ required: true, message: "执行原因为必填项", trigger: "blur" }],
  content: [{ required: true, message: "SQL内容为必填项", trigger: "blur" }]
});

/** 执行数据库下拉选项 */
export const dbKeyList = [
  { label: "DeograOA", value: "oamaster" },
  { label: "DeograPLM", value: "plmmaster" },
  { label: "DeograSYS", value: "sysmaster" },
  { label: "K3Master", value: "k3master" }
];

// 编辑SQL单据表单
export const formConfigs = (): FormConfigItemType[] => {
  return [
    {
      label: "标题",
      prop: "title",
      colProp: { span: 24 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入标题" clearable />;
      }
    },
    {
      label: "数据库选择",
      prop: "dbKey",
      colProp: { span: 24 },
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} placeholder="请选择" clearable class="ui-w-100">
            {dbKeyList.map((item) => (
              <el-option key={item.value} label={item.label} value={item.value} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "执行原因",
      prop: "reason",
      colProp: { span: 24 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入执行原因" clearable />;
      }
    },
    {
      label: "审批通过后是否立即执行",
      prop: "isNeedFinishExecute",
      colProp: { span: 24 },
      render: ({ formModel, row }) => {
        return <el-switch v-model={formModel[row.prop]} active-value={1} inactive-value={0} />;
      }
    },
    {
      label: "要执行的SQL内容",
      prop: "content",
      colProp: { span: 24 },
      render: ({ formModel, row }) => {
        return <el-input type="textarea" rows={10} v-model={formModel[row.prop]} placeholder="请输入SQL内容" clearable />;
      }
    }
  ];
};

// 查看SQL单据表单
export const lookFormConfigs = (): FormConfigItemType[] => {
  return [
    {
      label: "标题",
      prop: "title",
      colProp: { span: 24 },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} disabled />
    },
    {
      label: "执行原因",
      prop: "reason",
      colProp: { span: 24 },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} disabled />
    },
    {
      label: "单据状态",
      prop: "billState",
      colProp: { span: 24 },
      render: ({ formModel, row }) => {
        const value = BillStatus[Number(formModel[row.prop])]?.name;
        return <el-input v-model={value} disabled />;
      }
    },
    {
      label: "是否已经执行",
      prop: "isExecute",
      colProp: { span: 24 },
      render: ({ formModel, row }) => {
        const value = { 1: "已执行", 0: "未执行" }[formModel[row.prop]];
        return <el-input v-model={value} disabled />;
      }
    },
    {
      label: "是否审核通过后立即执行",
      prop: "isNeedFinishExecute",
      colProp: { span: 24 },
      render: ({ formModel, row }) => {
        const value = { 1: "是", 0: "否" }[formModel[row.prop]];
        return <el-input v-model={value} disabled />;
      }
    },
    {
      label: "执行的数据库",
      prop: "dbKey",
      colProp: { span: 24 },
      render: ({ formModel, row }) => {
        const dbName = dbKeyList.find((item) => item.value === formModel[row.prop])?.label;
        const value = dbName || formModel[row.prop];
        return <el-input v-model={value} disabled />;
      }
    },
    {
      label: "申请人",
      prop: "userName",
      colProp: { span: 24 },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} disabled />
    },
    {
      label: "执行的SQL内容",
      prop: "content",
      colProp: { span: 24 },
      render: ({ formModel, row }) => <el-input type="textarea" rows={10} v-model={formModel[row.prop]} disabled />
    }
  ];
};
