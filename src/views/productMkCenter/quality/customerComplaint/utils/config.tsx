import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import { reactive } from "vue";

// 编辑员工信息校验
export const formRules = reactive<FormRules>({
  date: [{ required: true, message: "日期为必填项", trigger: "blur" }]
});

// 编辑角色
export const formConfigs = (): FormConfigItemType[] => {
  return [
    {
      label: "日期",
      prop: "date",
      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        return <el-date-picker class="ui-w-100" v-model={formModel[row.prop]} type="date" placeholder="选择日期" />;
      }
    },
    {
      label: "客户名称",
      prop: "customerName",
      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        return <el-input class="ui-w-100" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "德龙产品型号",
      prop: "deograProductModel",
      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        return <el-input class="ui-w-100" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "流水码",
      prop: "waterCode",
      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        return <el-input class="ui-w-100" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "生产日期",
      prop: "productDate",
      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        return <el-date-picker class="ui-w-100" v-model={formModel[row.prop]} type="date" placeholder="选择生产日期" />;
      }
    },
    {
      label: "不良数量",
      prop: "badCount",
      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        return <el-input-number class="ui-w-100" controls={false} v-model={formModel[row.prop]} min={1} />;
      }
    },
    {
      label: "问题类别",
      prop: "questionClass",
      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        const questionClassifyList = [
          { label: "制程", value: "制程" },
          { label: "设计", value: "设计" }
        ];
        return (
          <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="选择问题类别">
            {questionClassifyList.map((item) => (
              <el-option key={item.value} label={item.label} value={item.value} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "问题描述",
      prop: "questionDes",
      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        return <el-input type="textarea" autosize v-model={formModel[row.prop]} />;
      }
    },
    {
      slots: { label: () => <span style={{ fontSize: "12px", color: "#606266", fontWeight: "700" }}>缺陷图片</span> },
      prop: "badPhoto",
      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        // return <el-input class="ui-w-100" v-model={formModel[row.prop]} />;
        return (
          <el-button size="small" type="primary">
            点击上传
          </el-button>
        );
      }
    },
    {
      label: "产生原因",
      prop: "appearReason",
      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        return <el-input type="textarea" autosize v-model={formModel[row.prop]} />;
      }
    },
    {
      slots: { label: () => <span style={{ fontSize: "12px", color: "#606266", fontWeight: "700" }}>分析图片</span> },
      prop: "thinkPhoto",
      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        // return <el-input class="ui-w-100" v-model={formModel[row.prop]} />;
        return (
          <el-button size="small" type="primary">
            点击上传
          </el-button>
        );
      }
    },
    {
      label: "临时改善",
      prop: "tempFinish",
      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        return <el-input type="textarea" autosize v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "长期改善措施",
      prop: "finishWay",
      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        return <el-input type="textarea" autosize v-model={formModel[row.prop]} />;
      }
    },
    {
      slots: { label: () => <span style={{ fontSize: "12px", color: "#606266", fontWeight: "700" }}>改善效果</span> },
      prop: "finishRes",
      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        // return <el-input class="ui-w-100" v-model={formModel[row.prop]} />;
        return (
          <el-button size="small" type="primary">
            点击上传
          </el-button>
        );
      }
    },
    {
      label: "改善后流水号",
      prop: "firstWaterCode",
      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        return <el-input class="ui-w-100" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "8D报告连接",
      prop: "nightLink",
      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        return <el-input class="ui-w-100" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "状态",
      prop: "status",
      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        const statusList = [
          { label: "close", value: "close" },
          { label: "follow up", value: "follow up" }
        ];
        return (
          <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="选择状态">
            {statusList.map((item) => (
              <el-option key={item.value} label={item.label} value={item.value} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "确认人",
      prop: "confirmUserName",
      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        return <el-input class="ui-w-100" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "备注",
      prop: "remark",
      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        return <el-input type="textarea" autosize v-model={formModel[row.prop]} />;
      }
    }
  ];
};
