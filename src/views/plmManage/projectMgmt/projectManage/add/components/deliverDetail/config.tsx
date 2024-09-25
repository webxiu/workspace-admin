import { FormRules } from "element-plus";
import { downloadFile } from "@/utils/common";
import { getkkViewUrl } from "@/utils/storage";
import { reactive } from "vue";

export const formDeliverRules = reactive<FormRules>({
  title: [{ required: true, message: "标题为必填项", trigger: "submit" }],
  remark: [{ required: true, message: "说明为必填项", trigger: "submit" }],
  version: [{ required: true, message: "版本为必填项", trigger: "submit" }]
});

export const formDeliverConfigs = () => {
  return [
    {
      label: "单据编号",
      colProp: { span: 8 },
      labelWidth: 80,
      prop: "billNo",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="保存后自动生成" disabled size="small" />;
      }
    },
    {
      label: "项目名称",
      colProp: { span: 8 },
      labelWidth: 80,
      prop: "projectName",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled size="small" />;
      }
    },
    {
      label: "任务名称",
      colProp: { span: 8 },
      labelWidth: 80,
      prop: "taskName",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled size="small" />;
      }
    },
    {
      label: "创建人",
      colProp: { span: 8 },
      labelWidth: 80,
      prop: "createUserName",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled size="small" />;
      }
    },
    {
      label: "创建时间",
      colProp: { span: 8 },
      labelWidth: 80,
      prop: "createDate",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled size="small" />;
      }
    },
    {
      label: "状态",
      colProp: { span: 8 },
      labelWidth: 80,
      prop: "billState",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled size="small" />;
      }
    },
    {
      label: "标题",
      colProp: { span: 16 },
      labelWidth: 80,
      prop: "title",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled size="small" />;
      }
    },
    {
      label: "版本",
      colProp: { span: 8 },
      labelWidth: 80,
      prop: "version",
      render: ({ formModel, row }) => {
        return <el-input disabled v-model={formModel[row.prop]} size="small" />;
      }
    },
    {
      label: "说明",
      colProp: { span: 16 },
      labelWidth: 80,
      prop: "remark",
      render: ({ formModel, row }) => {
        return <el-input type="textarea" autosize={{ minRows: 1 }} disabled v-model={formModel[row.prop]} size="small" />;
      }
    },
    {
      label: "",
      colProp: { span: 24 },
      labelWidth: 80,
      prop: "fileList",
      render: ({ formModel, row }) => {
        const dataList: any[] = formModel[row.prop];

        const viewFile = (row) => {
          const url = getkkViewUrl(row.virtualFileUrl);
          window.open(url);
        };

        const downFile = (row) => {
          const url = row.virtualFileUrl;
          downloadFile(url, row.fileName);
        };
        console.log(dataList, "file dataList");
        return (
          <div style={{ width: "100%", marginTop: "16px" }}>
            {dataList.map((item) =>
              item.fileName ? (
                <div class="flex align-center" style={{ minWidth: "60%" }}>
                  <div>{item.fileName}</div>
                  <div class="ml-160">
                    <el-space size={16}>
                      <el-link type="primary" size="small" onClick={() => viewFile(item)}>
                        预览
                      </el-link>
                      <el-link type="success" size="small" onClick={() => downFile(item)}>
                        下载
                      </el-link>
                    </el-space>
                  </div>
                </div>
              ) : (
                <div />
              )
            )}
          </div>
        );
      }
    }
  ];
};
