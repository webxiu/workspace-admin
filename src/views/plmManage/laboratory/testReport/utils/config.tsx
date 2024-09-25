import { ElMessage, FormRules } from "element-plus";

import { delTestReportAttrList } from "@/api/plmManage";
import { downloadFile } from "@/utils/common";
import { getkkViewUrl } from "@/utils/storage";
import { reactive } from "vue";
import { showMessageBox } from "@/utils/message";

export const formRules = reactive<FormRules>({
  reportName: [{ required: true, message: "测试报告名称为必填项", trigger: "submit" }]
});

export const formConfigs = ({ type, backRows, fileList, handleDown, handleAdd, handleUp, formData }) => [
  {
    label: "测试报告编号",
    labelWidth: 120,
    prop: "billNo",
    render: ({ formModel, row }) => {
      return <el-input disabled v-model={formModel[row.prop]} placeholder="请输入测试报告编号" />;
    }
  },
  {
    label: "测试报告名称",
    labelWidth: 120,
    prop: "reportName",
    render: ({ formModel, row }) => {
      return <el-input disabled={type === "view"} v-model={formModel[row.prop]} placeholder="请输入测试报告名称" />;
    }
  },
  {
    label: "备注",
    labelWidth: 120,
    prop: "remark",
    render: ({ formModel, row }) => {
      return <el-input disabled={type === "view"} rows={3} type="textarea" v-model={formModel[row.prop]} placeholder="请输入备注" />;
    }
  },
  {
    label: "审批人",
    labelWidth: 120,
    prop: "approval",
    render: ({ formModel, row }) => {
      const handleDel = (idx) => backRows.value.splice(idx, 1);
      return (
        <div style={{ width: "100%" }}>
          <el-button disabled={type === "view"} type="primary" plain size="small" onClick={handleAdd}>
            添加
          </el-button>
          <div>
            <ul>
              {backRows.value?.map((item, idx) => (
                <li key={item.id} style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>{idx + 1}</div>
                  <div>{item.userName}</div>
                  <div style={{ display: "flex" }}>
                    <div style={{ marginRight: "20px" }}>
                      <el-link disabled={type === "view"} type="danger" plain size="small" onClick={() => handleDel(idx)}>
                        删除
                      </el-link>
                    </div>
                    <div style={{ marginRight: "20px" }}>
                      <el-link disabled={!idx || type === "view"} type="primary" plain size="small" onClick={() => handleUp(idx)}>
                        上移
                      </el-link>
                    </div>
                    <div style={{ marginRight: "20px" }}>
                      <el-link
                        disabled={idx === backRows.value.length - 1 || type === "view"}
                        type="success"
                        plain
                        size="small"
                        onClick={() => handleDown(idx)}
                      >
                        下移
                      </el-link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }
  },
  {
    label: "附件",
    labelWidth: 120,
    prop: "attr",
    render: ({ formModel, row }) => {
      const onUpload = () => {
        const files: any = (document.getElementById("attrFile") as HTMLInputElement).files;
        for (let i = 0; i < files.length; i++) {
          if (files[i]?.size > 1024 * 1024 * 10) {
            ElMessage({ message: "上传文件不能超过10M", type: "error" });
            return;
          }
          if (fileList.value.length === 0) {
            formData.reportName = files[i].name;
          }
          fileList.value.push(files[i]);
        }

        const dom = document.getElementById("attrFile");
        (dom as any).value = null;
      };

      const handleUpload = () => {
        const dom = document.getElementById("attrFile");
        dom.click();
      };

      const handleDelAttr = (item, idx) => {
        if (item.id) {
          showMessageBox(`确认要删除名称为【${item.name || item.fileName}】的附件吗?`)
            .then(() => {
              delTestReportAttrList({ id: item.id }).then((res) => {
                if (res.data) {
                  ElMessage({ message: "删除附件成功", type: "success" });
                  fileList.value.splice(idx, 1);
                }
              });
            })
            .catch(console.log);
        } else {
          fileList.value.splice(idx, 1);
        }
      };

      // 弹窗内文件下载
      const handleDownload = (row) => {
        const url = row.filePath + row.fileName;
        downloadFile(url, row.fileName);
      };

      const handleView = async (row) => {
        const url = getkkViewUrl(`${row.filePath}${row.fileName}`);
        window.open(url);
      };
      return (
        <div style={{ width: "83.6%" }}>
          <el-button type="primary" disabled={type === "view"} size="small" onClick={handleUpload}>
            上传
          </el-button>
          <input
            type="file"
            style="display: none"
            multiple
            id="attrFile"
            ref="files"
            accept="image/*,.pdf,.ppt,.pptx,.bmp,.doc,.docx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.gif"
            onInput={onUpload}
          />
          <div>
            <ul>
              {fileList.value?.map((item, idx) => (
                <li key={item.lastModified} style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>{item.name || item.fileName}</div>
                  <div>
                    <el-link disabled={type === "view"} type="danger" plain size="small" onClick={() => handleDelAttr(item, idx)}>
                      删除
                    </el-link>
                    <el-link style={{ marginLeft: "20px" }} type="warning" plain size="small" onClick={() => handleView(item)}>
                      预览
                    </el-link>
                    <el-link
                      style={{ marginLeft: "20px", visibility: item.fileName && item.filePath ? "visible" : "hidden" }}
                      type="success"
                      plain
                      size="small"
                      onClick={() => handleDownload(item)}
                    >
                      下载
                    </el-link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }
  },
  {
    label: "创建人",
    labelWidth: 120,
    prop: "createUserName",
    render: ({ formModel, row }) => {
      return <el-input disabled style={{ width: 50 }} v-model={formModel[row.prop]} />;
    }
  },
  {
    label: "创建时间",
    labelWidth: 120,
    prop: "createDate",
    render: ({ formModel, row }) => {
      return <el-input disabled style={{ width: 50 }} v-model={formModel[row.prop]} />;
    }
  }
];
