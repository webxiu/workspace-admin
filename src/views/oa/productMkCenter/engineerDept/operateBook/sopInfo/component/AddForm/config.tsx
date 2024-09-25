import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import InputUpload from "../InputUpload.vue";
import WangEditor from "@/components/WangEditor/index.vue";
import { reactive } from "vue";

const layout = { span: 24 };

export const formRules = reactive<FormRules>({
  withToolFixture: [{ required: true, message: "请输入工具及治具", trigger: "blur" }],
  jobContent: [{ required: true, message: "请输入作业内容", trigger: "blur" }],
  precautions: [{ required: true, message: "请输入注意事项", trigger: "blur" }]
});

export const formConfigs = ({ disabled, onHandleImg }): FormConfigItemType[] => [
  {
    label: "工具及治具",
    prop: "withToolFixture",
    colProp: layout,
    slots: { label: () => <strong>工具及治具</strong> },
    render: ({ formModel, row }) => {
      return <WangEditor v-model={formModel[row.prop]} placeholder="请输入工具及治具" disabled={disabled} height={80} />;
    }
  },
  {
    label: "作业内容",
    prop: "jobContent",
    colProp: layout,
    slots: { label: () => <strong>作业内容</strong> },
    render: ({ formModel, row }) => {
      return <WangEditor v-model={formModel[row.prop]} placeholder="请输入作业内容" disabled={disabled} height={220} />;
    }
  },
  {
    label: "注意事项",
    prop: "precautions",
    colProp: layout,
    slots: { label: () => <strong>注意事项</strong> },
    render: ({ formModel, row }) => {
      return <WangEditor v-model={formModel[row.prop]} placeholder="请输入注意事项" disabled={disabled} height={120} />;
    }
  },
  {
    label: "作业工程",
    prop: "imgList",
    colProp: layout,
    required: true,
    slots: { label: () => <strong>作业工程</strong> },
    render: ({ formModel, row }) => <InputUpload v-model={formModel[row.prop]} disabled={disabled} onHandleImg={onHandleImg} />
  }
];
