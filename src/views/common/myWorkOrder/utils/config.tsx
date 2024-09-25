import { ElMessage, FormRules } from "element-plus";
import { reactive, ref } from "vue";

import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { Upload } from "@element-plus/icons-vue";
import { deleteTaskFile } from "@/api/systemManage";
import { downloadFile } from "@/utils/common";
import { getkkViewUrl } from "@/utils/storage";
import { showMessageBox } from "@/utils/message";

export const formRules = reactive<FormRules>({
  systemName: [{ required: true, message: "系统为必填项", trigger: "submit" }],
  // taskName: [{ required: true, message: "功能菜单为必填项", trigger: "submit" }],
  // taskTypeCode: [{ required: true, message: "类型为必填项", trigger: "submit" }],
  // expectDate: [{ required: true, message: "预计完成日期为必填项", trigger: "submit" }],
  taskContent: [{ required: true, message: "需求描述为必填项", trigger: "submit" }]
  // attr: [{ required: true, message: "附件为必填项", trigger: "submit" }]
});

export const formConfigs = ({ fileList, formData, type, taskType, sysTypeOpts }): FormConfigItemType[] => {
  const isView = type === "view";
  const fileLoading = ref(false);
  let confArr: FormConfigItemType[] = [
    {
      label: "工单号",
      prop: "billNo",
      labelWidth: 80,
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input disabled v-model={formModel[row.prop]} placeholder="保存后自动生成" />;
      }
    },
    { label: "", prop: "", labelWidth: 120, colProp: { span: 12 }, render: () => null },
    {
      label: "系统",
      prop: "systemName",
      labelWidth: 80,
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} placeholder="请选择" style={{ width: "100%" }} disabled={isView}>
            {sysTypeOpts.value.map((item) => (
              <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "功能菜单",
      labelWidth: 120,
      colProp: { span: 12 },
      prop: "taskName",
      render: ({ formModel, row }) => {
        return <el-input disabled={isView} v-model={formModel[row.prop]} placeholder="请输入" />;
      }
    },
    {
      label: "类型",
      prop: "taskTypeCode",
      labelWidth: 80,
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} placeholder="请选择" style={{ width: "100%" }} disabled={isView}>
            {taskType.value.map((item) => (
              <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "期望完成时间",
      prop: "expectDate",
      labelWidth: 120,
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return (
          <el-date-picker
            style={{ width: "100%" }}
            placeholder="请选择"
            value-format="YYYY-MM-DD"
            v-model={formModel[row.prop]}
            type="date"
            disabled={isView}
          />
        );
      }
    },

    {
      label: "需求描述",
      prop: "taskContent",
      labelWidth: 80,
      colProp: { span: 24 },
      render: ({ formModel, row }) => {
        return (
          <el-input autosize={{ minRows: 4 }} type="textarea" style={{ width: "100%" }} v-model={formModel[row.prop]} placeholder="请输入" disabled={isView} />
        );
      }
    },
    {
      slots: { label: () => <span style={{ fontSize: "14px", color: "#606266", fontWeight: "700" }}>附件</span> },
      prop: "attr",
      labelWidth: 80,
      colProp: { span: 24 },
      render: ({ formModel, row }) => {
        const onUpload = () => {
          const files: any = (document.getElementById("workOrderFile") as HTMLInputElement).files;
          for (let i = 0; i < files.length; i++) {
            if (files[i]?.size > 1024 * 1024 * 10) {
              ElMessage({ message: "上传文件不能超过10M", type: "error" });
              return;
            }
            fileList.value.push(files[i]);
          }
          formData.value.attr = fileList.value;
          const dom = document.getElementById("workOrderFile");
          (dom as any).value = null;
        };

        const handleUpload = () => {
          const dom = document.getElementById("workOrderFile");
          dom.click();
        };

        const handleDelAttr = (item, idx) => {
          if (item.id) {
            showMessageBox(`确认要删除名称为【${item.name || item.fileName}】的附件吗?`)
              .then(() => {
                fileLoading.value = true;
                deleteTaskFile({ id: item.id })
                  .then((res) => {
                    if (res.data) {
                      fileList.value.splice(idx, 1);
                    }
                  })
                  .finally(() => (fileLoading.value = false));
              })
              .catch(console.log);
          } else {
            fileList.value.splice(idx, 1);
          }
        };

        // 弹窗内文件下载
        const handleDownload = (row) => {
          const url = row.filePath + "/" + row.fileName;
          downloadFile(url, row.fileName, true);
        };

        const handleView = async (row) => {
          const url = getkkViewUrl(`${row.filePath}/${row.fileName}`);
          window.open(url);
        };
        return (
          <div style={{ width: "100%" }}>
            <el-button style={{ width: "40%", height: 52 }} type="primary" disabled={isView} onClick={handleUpload}>
              <el-icon class="el-icon--right">
                <Upload />
              </el-icon>
              点击上传附件（支持上传多个文件）
            </el-button>
            <input
              type="file"
              style="display: none"
              multiple
              id="workOrderFile"
              ref="files"
              accept="image/*,.pdf,.ppt,.pptx,.bmp,.doc,.docx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.gif"
              onInput={onUpload}
            />
            <div>
              <ul v-loading={fileLoading.value}>
                {fileList.value?.map((item, idx) => (
                  <li key={item.lastModified} style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>{item.name || item.fileName}</div>
                    <div>
                      <el-link disabled={isView} type="danger" plain size="small" onClick={() => handleDelAttr(item, idx)}>
                        删除
                      </el-link>
                      <el-link
                        style={{ marginLeft: "20px", visibility: item.fileName && item.filePath ? "visible" : "hidden" }}
                        type="warning"
                        plain
                        size="small"
                        onClick={() => handleView(item)}
                      >
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
      prop: "createUserName",
      labelWidth: 80,
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input disabled v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "创建时间",
      prop: "createDate",
      labelWidth: 120,
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input disabled v-model={formModel[row.prop]} />;
      }
    }
  ];

  if (type === "add") {
    confArr = confArr.filter((item) => !["createUserName", "billNo", "", "createDate"].includes(item.prop));
  }

  return confArr;
};
