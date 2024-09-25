import { fetchProjectTaskDelivers, getBOMTableRowSelectOptions } from "@/api/plmManage";
import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { getkkViewUrl } from "@/utils/storage";
import { FormRules } from "element-plus";
import { reactive, ref } from "vue";

export const formRules = reactive<FormRules>({
  projectName: [{ required: true, message: "请选择变更项目", trigger: "submit" }],
  taskName: [{ required: true, message: "请选择变更任务", trigger: "submit" }],
  deliveryTemplate: [{ required: true, message: "请选择变更交付物", trigger: "submit" }],
  title: [{ required: true, message: "请填写标题", trigger: "submit" }],
  remark: [{ required: true, message: "请填写说明", trigger: "submit" }],
  describeChange: [{ required: true, message: "请填写变更说明", trigger: "submit" }]
});

export const formConfigs = ({ formData }): FormConfigItemType[] => {
  const billStateOpts = ref([]);
  const deliverOpts = ref([]);
  getBOMTableRowSelectOptions({ optioncode: "BillStatus" }).then((res) => {
    if (res.data) {
      const findRes = res.data.find((item) => item.optionCode === "BillStatus")?.optionList?.map((item) => ({ ...item, optionValue: +item.optionValue })) || [];
      billStateOpts.value = findRes;
    }
  });

  if (formData.taskId) {
    fetchProjectTaskDelivers({ taskId: formData.taskId }).then((res: any) => {
      if (res.data) {
        deliverOpts.value = res.data.map((item) => ({ optionName: item.deliverableName, optionValue: item.id }));
      }
    });
  }

  const arr = [
    {
      label: "单据编号",
      prop: "billNo",
      labelWidth: 95,
      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "变更项目",
      prop: "projectName",
      labelWidth: 95,
      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "变更任务",
      prop: "taskName",
      labelWidth: 95,
      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "变更交付物",
      prop: "deliverableId",
      labelWidth: 95,
      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        return (
          <el-select disabled v-model={formModel[row.prop]} style={{ width: "100%" }} placeholder=" ">
            {deliverOpts.value?.map((item) => (
              <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "版本",
      labelWidth: 95,
      prop: "version",
      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "单据状态",
      prop: "billState",
      labelWidth: 95,
      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        return (
          <el-select disabled v-model={formModel[row.prop]} style={{ width: "100%" }} placeholder=" ">
            {billStateOpts.value?.map((item) => (
              <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "标题",
      labelWidth: 95,
      prop: "title",
      colProp: { span: 24 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "说明",
      labelWidth: 95,
      prop: "remark",
      colProp: { span: 24 },
      render: ({ formModel, row }) => {
        return <el-input type="textarea" autosize v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "变更说明",
      prop: "describeChange",
      labelWidth: 95,
      colProp: { span: 24 },
      render: ({ formModel, row }) => {
        return <el-input type="textarea" autosize v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      slots: { label: () => <span style={{ fontSize: "14px", color: "#606266", fontWeight: "700" }}>变更附件</span> },
      colProp: { span: 24 },
      labelWidth: 95,
      prop: "files",
      render: ({ formModel, row }) => {
        const handlePreview = async (row) => {
          const url = getkkViewUrl(row.virtualFilePath);
          window.open(url);
        };
        return (
          <el-upload
            v-model:file-list={formModel[row.prop]}
            before-remove={() => false}
            style={{ width: "100%" }}
            auto-upload={false}
            action="#"
            multiple
            on-preview={handlePreview}
          >
            <el-button type="primary" disabled>
              选择文件
            </el-button>
          </el-upload>
        );
      }
    },
    {
      labelWidth: 95,
      label: "创建人",
      prop: "createUserName",
      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "创建时间",
      labelWidth: 95,
      prop: "createDate",
      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    }
  ];

  return arr;
};
