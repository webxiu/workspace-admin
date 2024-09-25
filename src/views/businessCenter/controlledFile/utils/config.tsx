import { ElMessage, FormRules } from "element-plus";

import { Upload } from "@element-plus/icons-vue";
import { downloadFile } from "@/utils/common";
import { getkkViewUrl } from "@/utils/storage";
import { reactive } from "vue";

export const formRules = reactive<FormRules>({
  fileCode: [{ required: true, message: "文件编号为必填项", trigger: "submit" }],
  fileName: [{ required: true, message: "文件名称为必填项", trigger: "submit" }],
  pageNumber: [{ required: true, message: "页数为必填项", trigger: "submit" }],
  lastVersion: [{ required: true, message: "版本为必填项", trigger: "submit" }],
  usedDate: [{ required: true, message: "发出日期为必填项", trigger: "submit" }],
  deptId: [{ required: true, message: "部门为必填项", trigger: "submit" }],
  shelfLife: [{ required: true, message: "保存期限为必填项", trigger: "submit" }],
  file: [{ required: true, message: "请上传附件", trigger: "submit" }]
});

export const formConfigs = ({ treeData, type, formData, fileList, rowFileName }) => {
  return [
    {
      label: "文件编号",
      labelWidth: 80,
      colProp: { span: 12 },
      prop: "fileCode",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入" />;
      }
    },
    {
      label: "文件名称",
      labelWidth: 80,
      colProp: { span: 12 },
      prop: "fileName",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入" />;
      }
    },
    {
      label: "页数",
      labelWidth: 80,
      colProp: { span: 12 },
      prop: "pageNumber",
      render: ({ formModel, row }) => {
        return <el-input-number min={1} controls={false} style={{ width: "100%" }} v-model={formModel[row.prop]} placeholder="请输入" />;
      }
    },
    {
      label: "版本",
      labelWidth: 80,
      colProp: { span: 12 },
      prop: "lastVersion",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入" />;
      }
    },
    {
      label: "发出日期",
      colProp: { span: 12 },
      labelWidth: 80,
      prop: "usedDate",
      render: ({ formModel, row }) => {
        return (
          <el-date-picker
            style={{ width: "100%" }}
            v-model={formModel[row.prop]}
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            type="date"
            placeholder="请选择"
          />
        );
      }
    },
    {
      label: "部门",
      labelWidth: 80,
      colProp: { span: 12 },
      prop: "deptId",
      render: ({ formModel, row }) => {
        console.log(treeData, "treeData");
        console.log(formModel[row.prop], "formModel[row.prop]");
        return (
          <el-tree-select
            default-expanded-keys={["0"]}
            v-model={formModel[row.prop]}
            filterable
            data={treeData}
            node-key="value"
            check-strictly={true}
            check-on-click-node
            render-after-expand={false}
            class="ui-w-100"
            props={{ label: "name", value: "value" }}
          />
        );
      }
    },
    {
      label: "保存期限",
      labelWidth: 80,
      colProp: { span: 12 },
      prop: "shelfLife",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入" />;
      }
    },
    {
      slots: { label: () => <span style={{ fontSize: "14px", color: "#606266", fontWeight: "700" }}>附件</span> },
      prop: "file",
      labelWidth: 80,
      colProp: { span: 24 },
      render: ({ formModel, row }) => {
        const onUpload = () => {
          const files: any = (document.getElementById("controllerFileId") as HTMLInputElement).files;
          for (let i = 0; i < [files[0]].length; i++) {
            if (files[i]?.size > 1024 * 1024 * 10) {
              ElMessage({ message: "上传文件不能超过10M", type: "error" });
              return;
            }
            fileList.push(files[i]);
          }
          if (files.length) {
            formData.file = [files[0]];
          }
          console.log(fileList[0], "fileList");
          console.log(formData.file[0], "formData.file");

          const dom = document.getElementById("controllerFileId");
          (dom as any).value = null;
        };

        const handleUpload = () => {
          const dom = document.getElementById("controllerFileId");
          dom.click();
        };

        const handleDelAttr = (idx) => {
          fileList.splice(idx, 1);
          formData.file = [];
        };

        // 弹窗内文件下载
        const handleDownload = (row) => {
          const url = row.filePath;
          downloadFile(url, getFileName(row));
        };

        const handleView = async (row) => {
          const url = getkkViewUrl(row.filePath);
          window.open(url);
        };

        const getFileName = (item) => item.filePath?.split("/").at(-1);
        return (
          <div style={{ width: "100%" }}>
            <el-button style={{ width: "42.2%", height: 52 }} type="primary" disabled={type === "view"} onClick={handleUpload}>
              <el-icon class="el-icon--right">
                <Upload />
              </el-icon>
              点击上传附件
            </el-button>
            <input
              type="file"
              style="display: none"
              multiple
              id="controllerFileId"
              ref="files"
              accept="image/*,.pdf,.ppt,.pptx,.bmp,.doc,.docx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.gif"
              onInput={onUpload}
            />
            <div>
              <ul>
                {fileList.slice(0, 1).map((item, idx) => {
                  console.log(item, "item==");
                  return (
                    (item.name || item.filePath) && (
                      <li key={item.lastModified} style={{ display: "flex", justifyContent: "space-between" }}>
                        <div>{getFileName(item) || item.name}</div>
                        <div>
                          <el-link disabled={type === "view"} type="danger" plain size="small" onClick={() => handleDelAttr(idx)}>
                            删除
                          </el-link>
                          <el-link
                            style={{ marginLeft: "20px", visibility: (item.name || rowFileName) && fileList[0]?.filePath ? "visible" : "hidden" }}
                            type="warning"
                            plain
                            size="small"
                            onClick={() => handleView(item)}
                          >
                            预览
                          </el-link>
                          <el-link
                            style={{ marginLeft: "20px", visibility: (item.name || rowFileName) && fileList[0]?.filePath ? "visible" : "hidden" }}
                            type="success"
                            plain
                            size="small"
                            onClick={() => handleDownload(item)}
                          >
                            下载
                          </el-link>
                        </div>
                      </li>
                    )
                  );
                })}
              </ul>
            </div>
          </div>
        );
      }
    }
  ];
};
