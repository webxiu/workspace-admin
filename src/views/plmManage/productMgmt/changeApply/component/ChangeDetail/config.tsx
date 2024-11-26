import { FormRules, UploadProps } from "element-plus";
import { h, reactive, ref } from "vue";

import ChangeTable from "./ChangeTable.vue";
import { Plus } from "@element-plus/icons-vue";
import { TableFormItemType } from "@/components/HxTableForm/index.vue";
import { message } from "@/utils/message";

const baseApi = import.meta.env.VITE_BASE_API;

// 编辑员工信息校验
export const formRules = reactive<FormRules>({
  date: [{ required: true, message: "请选择日期", trigger: ["blur", "change"] }],
  applyDepartment: [{ required: true, message: "请选择申请部门", trigger: ["blur", "change"] }],
  applyUser: [{ required: true, message: "请输入申请人", trigger: ["blur", "change"] }],
  customerName: [{ required: true, message: "请输入客户名称", trigger: ["blur", "change"] }],
  reason: [{ required: true, message: "请输入原因描述", trigger: ["blur", "change"] }],
  changeProject: [{ required: true, message: "请选择变更项目", trigger: ["blur", "change"] }]
});
const cWidth = "110px";

export const formConfig = ({ onPreviewImg, onTableChange }): TableFormItemType[][] => {
  return [
    [
      {
        label: "ECR申请",
        labelConf: { width: cWidth, rowspan: 11 },
        renderLabel: ({ row }) => <span>{row.label}</span>
      },
      {
        label: "日期",
        prop: "date",
        labelConf: { width: "15%", colspan: 2 },
        contentConf: { colspan: 2 },
        render: ({ formModel, row }) => (
          <el-date-picker
            type="date"
            v-model={formModel[row.prop]}
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            placeholder="请选择"
            clearable
            style="width: 100%;"
          />
        )
      },
      {
        label: "申请部门",
        prop: "applyDepartment",
        labelConf: { width: "15%", colspan: 2 },
        contentConf: { colspan: 2 },
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      },
      {
        label: "申请人",
        prop: "applyUser",
        labelConf: { width: "15%", colspan: 2 },
        contentConf: { colspan: 2 },
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      }
    ],
    [
      {
        label: "客户名称",
        prop: "customerName",
        labelConf: { colspan: 2 },
        contentConf: { colspan: 2 },
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      },
      {
        label: "产品名称",
        prop: "productName",
        labelConf: { colspan: 2 },
        contentConf: { colspan: 2 },
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      },
      {
        label: "产品型号",
        prop: "productModel",
        labelConf: { colspan: 2 },
        contentConf: { colspan: 2 },
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      }
    ],
    [
      {
        label: "变更类型",
        prop: "changeType",
        labelConf: { colspan: 2 },
        contentConf: { colspan: 2 },
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      },
      {
        label: "变更阶段",
        prop: "changeStage",
        labelConf: { colspan: 2 },
        contentConf: { colspan: 6 },
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      }
    ],
    [
      {
        label: "变更原因",
        prop: "changeReason",
        labelConf: { colspan: 2 },
        contentConf: { colspan: 10 },
        render: ({ formModel, row }) => (
          <el-checkbox-group v-model={formModel[row.prop]} class="pl-10">
            {[
              { value: "设计改良", label: "设计改良" },
              { value: "工艺改进", label: "工艺改进" },
              { value: "文件错误", label: "文件错误" },
              { value: "原材料更改", label: "原材料更改" },
              { value: "降低成本", label: "降低成本" },
              { value: "供应商变更", label: "供应商变更" },
              { value: "客户变更", label: "客户变更" },
              { value: "其它", label: "其它" }
            ].map((item) => (
              <el-checkbox label={item.value}>{item.label}</el-checkbox>
            ))}
          </el-checkbox-group>
        )
      }
    ],
    [
      {
        label: "变更主题",
        prop: "changeTheme",
        labelConf: { colspan: 2 },
        contentConf: { colspan: 10 },
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      }
    ],
    [
      {
        label: "原因描述",
        prop: "reason",
        labelConf: { colspan: 2 },
        contentConf: { colspan: 10 },
        render: ({ formModel, row }) => (
          <el-input type="textarea" v-model={formModel[row.prop]} autosize={{ minRows: 2, maxRows: 2 }} resize="none" placeholder="请输入" />
        )
      }
    ],
    [
      { label: "变更前", labelConf: { colspan: 4, tdProp: { class: "lh-32" } } },
      { label: "变更后", labelConf: { colspan: 4, tdProp: { class: "lh-32" } } },
      { label: "变更项目", labelConf: { colspan: 4, tdProp: { class: "lh-32" } } }
    ],
    [
      {
        label: "",
        prop: "changeBefore",
        contentConf: { colspan: 4 },
        render: ({ formModel, row }) => {
          const fileList = ref([
            { fileName: "休息休息.jpg", id: 1, url: `https://app.deogra.com/api/static/virtual/files/OA/ESOP/jobEngineering/1.png` },
            { fileName: "休息休息.jpg", id: 2, url: `http://192.168.1.235/uploads/-/system/user/avatar/1/avatar.png?width=32` },
            { fileName: "休息休息.jpg", id: 3, url: `http://192.168.1.235/uploads/-/system/user/avatar/1/avatar.png?width=32` },
            { fileName: "休息休息.jpg", id: 4, url: `http://192.168.1.235/uploads/-/system/user/avatar/1/avatar.png?width=32` },
            { fileName: "休息休息.jpg", id: 5, url: `http://192.168.1.235/uploads/-/system/user/avatar/1/avatar.png?width=32` },
            { fileName: "休息休息.jpg", id: 6, url: `http://192.168.1.235/uploads/-/system/user/avatar/1/avatar.png?width=32` },
            { fileName: "休息休息.jpg", id: 7, url: `http://192.168.1.235/uploads/-/system/user/avatar/1/avatar.png?width=32` },
            { fileName: "休息休息.jpg", id: 8, url: `http://192.168.1.235/uploads/-/system/user/avatar/1/avatar.png?width=32` }
          ]);

          const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
            if (!["image/jpeg", "image/png", "image/bmp", "image/gif"].includes(rawFile.type)) {
              message("Logo必须为JPG、PNG、BMP或GIF格式!", { type: "error" });
              return false;
            }
            if (rawFile.size / 1024 / 1024 > 4) {
              message("Logo图片大小不能超过4MB！", { type: "error" });
              return false;
            }
            return true;
          };

          // 预览
          const onPreview: UploadProps["onPreview"] = (uploadFile) => {
            // dialogImageUrl.value = uploadFile.url!;
            // dialogVisible.value = true;
            onPreviewImg({ url: uploadFile.url });
          };

          // 上传成功添加图片
          function handleAvatarSuccess(response) {
            console.log("response", response);
            // fileList.value.push({
            //   id: null,
            //   fileName: response.data
            // });
          }

          // 删除图片
          const onRemove: UploadProps["onRemove"] = (uploadFile: any) => {
            if (uploadFile?.response?.data) {
              fileList.value = fileList.value.filter((item) => item.fileName !== uploadFile?.response?.data);
            } else if (uploadFile.id) {
              fileList.value = fileList.value.filter((item) => item.id !== uploadFile.id);
            }
          };

          return (
            <>
              <el-input type="textarea" v-model={formModel[row.prop]} autosize={{ minRows: 4, maxRows: 4 }} resize="none" placeholder="请输入" />
              <div class="mt-4 p-4">
                <el-upload
                  limit={8}
                  v-model:file-list={fileList.value}
                  accept=".jpg,.png,.jpeg,.bmp,.gif"
                  action={`${baseApi}/oa/hr/commodityManagement/uploadmultifile`}
                  list-type="picture-card"
                  on-success={handleAvatarSuccess}
                  before-upload={beforeAvatarUpload}
                  on-preview={onPreview}
                  on-remove={onRemove}
                  class="change-upload"
                >
                  <el-icon>
                    <Plus />
                  </el-icon>
                </el-upload>
              </div>
            </>
          );
        }
      },
      {
        label: "",
        prop: "changeAfter",
        contentConf: { colspan: 4, tdProp: { style: { verticalAlign: "top" } } },
        render: ({ formModel, row }) => (
          <el-input type="textarea" v-model={formModel[row.prop]} autosize={{ minRows: 4, maxRows: 4 }} resize="none" placeholder="请输入" />
        )
      },
      {
        prop: "changeProject",
        contentConf: { colspan: 4, tdProp: { style: { verticalAlign: "top" } } },
        render: ({ formModel, row }) => (
          <el-checkbox-group v-model={formModel[row.prop]} class="pl-10">
            {[
              { value: "生产场所变更", label: "生产场所变更" },
              { value: "制造方法变更", label: "制造方法变更" },
              { value: "工具变更", label: "工具变更" },
              { value: "检查方法变更", label: "检查方法变更" },
              { value: "材料变更", label: "材料变更" },
              { value: "设计变更", label: "设计变更(安全/法规)" },
              { value: "RoHS或其他", label: "RoHS或其他" }
            ].map((item) => (
              <el-checkbox label={item.value}>{item.label}</el-checkbox>
            ))}
          </el-checkbox-group>
        )
      }
    ],
    [
      {
        label: "变更涉及的相关修改(如有修改,提出修改人需在后面横线上签名):",
        labelConf: { colspan: 12, tdProp: { class: "ui-ta-l" } }
      }
    ],
    [
      {
        prop: "changeModify",
        labelConf: { tdProp: { style: { border: "none" } } },
        contentConf: { colspan: 12 },
        render: ({ formModel, row }) => (
          <div>
            <el-checkbox-group v-model={formModel[row.prop]} class="pl-10">
              {[
                { value: "2D设计图", label: "2D设计图" },
                { value: "工程签样", label: "工程签样" },
                { value: "工具变更", label: "工具变更" },
                { value: "BOM", label: "BOM" },
                { value: "作业指导书", label: "作业指导书" },
                { value: "3D设计图", label: "3D设计图" },
                { value: "检验标准", label: "检验标准" },
                { value: "认证", label: "认证" },
                { value: "客户验收标准", label: "客户验收标准" },
                { value: "其它", label: "其它" }
              ].map((item) => (
                <>
                  <el-checkbox label={item.value}>
                    {{
                      default: () => (
                        <div class="flex align-center">
                          {item.label}
                          {item.value !== "其它" ? (
                            <el-input
                              style={{
                                width: "50px",
                                marginLeft: "4px",
                                borderBottom: "1px solid #111",
                                height: "14px",
                                lineHeight: "14px"
                              }}
                              v-model={formModel[row.prop]}
                              placeholder="请输入"
                            />
                          ) : null}
                        </div>
                      )
                    }}
                  </el-checkbox>
                </>
              ))}
            </el-checkbox-group>
          </div>
        )
      }
    ],
    [
      {
        label: "部门审核:",
        prop: "departmentAudit",
        labelConf: { tdProp: { style: { borderTop: "hidden", borderRight: "hidden", textAlign: "right" } } },
        contentConf: { colspan: 5, tdProp: { style: { borderTop: "hidden", borderRight: "hidden" } } },
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} size="small" placeholder="请输入" clearable />
      },
      {
        label: "批准:",
        prop: "ecrApproval",
        labelConf: { tdProp: { style: { borderTop: "hidden", borderRight: "hidden", textAlign: "right" } } },
        contentConf: { colspan: 5, tdProp: { style: { borderTop: "hidden" } } },
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} size="small" placeholder="请输入" clearable />
      }
    ],
    [
      { label: "ECN执行", labelConf: { width: "80px", rowspan: 4 } },
      { label: "变更评审&执行管理", labelConf: { colspan: 12, tdProp: { class: "lh-32" } }, renderLabel: ({ row }) => <span class="lh-32">{row.label}</span> }
    ],
    [
      {
        label: "变更开始日期:",
        prop: "changeStartDate",
        labelConf: { colspan: 2 },
        contentConf: { colspan: 2 },
        render: ({ formModel, row }) => (
          <el-date-picker type="date" v-model={formModel[row.prop]} format="YYYY-MM-DD" value-format="YYYY-MM-DD" placeholder="请选择" style="width: 100%;" />
        )
      },
      {
        label: "变更实施部门:",
        prop: "changeImplementDepartment",
        labelConf: { colspan: 2 },
        contentConf: { colspan: 2 },
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入(制造中心填写)" />
      },
      {
        label: "首批变更标识方式:",
        prop: "changeFirstBatch",
        labelConf: { colspan: 2 },
        contentConf: { colspan: 2 },
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入(制造中心填写)" />
      }
    ],
    [
      {
        label: "BOM变更:",
        prop: "changeBom",
        labelConf: { colspan: 2 },
        contentConf: { colspan: 2 },
        render: ({ formModel, row }) => (
          <el-checkbox-group v-model={formModel[row.prop]} class="pl-10">
            {[
              { value: "1", label: "是" },
              { value: "2", label: "否" }
            ].map((item) => (
              <el-checkbox label={item.label} value={item.value}></el-checkbox>
            ))}
          </el-checkbox-group>
        )
      },
      {
        label: "旧物料编号:",
        prop: "oldMaterialCode",
        labelConf: { colspan: 2 },
        contentConf: { colspan: 2 },
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      },
      {
        label: "新物料编号:",
        prop: "newMaterialCode",
        labelConf: { colspan: 2 },
        contentConf: { colspan: 2 },
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入 (技术研发中心填写)" />
      }
    ],
    [{ contentConf: { colspan: 12 }, render: ({ formModel, row }) => <ChangeTable onChange={onTableChange} /> }],
    [
      { label: "ECN执行", labelConf: { rowspan: 16 } },
      { label: "相关部门评审意见", labelConf: { colspan: 12, tdProp: { class: "lh-32" } } }
    ],
    // 1.技术研发中心意见
    [
      {
        label: "技术研发中心意见:",
        prop: "technologyDevelopmentCenterOpinion",
        labelConf: { colspan: 2, tdProp: { style: { borderRight: "hidden", textAlign: "left" } } },
        contentConf: { colspan: 2, tdProp: { style: { borderRight: "hidden" } } },
        render: ({ formModel, row }) => (
          <el-input type="textarea" v-model={formModel[row.prop]} autosize={{ minRows: 1, maxRows: 1 }} resize="none" placeholder="请输入" />
        )
      },
      {
        label: "变更范围:",
        prop: "changeScope",
        labelConf: { tdProp: { style: { borderRight: "hidden", textAlign: "right" } } },
        contentConf: { colspan: 3, tdProp: { style: { borderRight: "hidden" } } },
        render: ({ formModel, row }) => (
          <el-checkbox-group v-model={formModel[row.prop]} class="pl-10">
            {[
              { value: "1", label: "电子" },
              { value: "2", label: "结构" },
              { value: "3", label: "认证" }
            ].map((item) => (
              <el-checkbox label={item.label} value={item.value} />
            ))}
          </el-checkbox-group>
        )
      },
      {
        label: "切换方式:",
        prop: "changeWay",
        labelConf: { tdProp: { style: { borderRight: "hidden", textAlign: "right" } } },
        contentConf: { colspan: 3 },
        render: ({ formModel, row }) => (
          <el-checkbox-group v-model={formModel[row.prop]} class="pl-10">
            {[
              { value: "1", label: "立即变更" },
              { value: "2", label: "临时变更" },
              { value: "3", label: "用完旧品后自然切换新品" }
            ].map((item) => (
              <el-checkbox label={item.label} value={item.value} />
            ))}
          </el-checkbox-group>
        )
      }
    ],
    [
      {
        label: "担当工程师:",
        prop: "technologyEngineer",
        labelConf: { colspan: 2, tdProp: { style: { borderTop: "hidden", borderRight: "hidden", textAlign: "right" } } },
        contentConf: { colspan: 4, tdProp: { style: { borderTop: "hidden", borderRight: "hidden" } } },
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      },
      {
        label: "审批(总监):",
        prop: "technologyDirector",
        labelConf: { tdProp: { style: { borderTop: "hidden", borderRight: "hidden" } } },
        contentConf: { colspan: 5, tdProp: { style: { borderTop: "hidden" } } },
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      }
    ],

    // 2.品质中心意见
    [
      {
        label: "品质中心意见:",
        prop: "qualityCenterOpinion",
        labelConf: { colspan: 2, tdProp: { style: { borderRight: "hidden", textAlign: "left" } } },
        contentConf: { colspan: 10 },
        render: ({ formModel, row }) => (
          <el-input type="textarea" v-model={formModel[row.prop]} autosize={{ minRows: 1, maxRows: 1 }} resize="none" placeholder="请输入" />
        )
      }
    ],
    [
      {
        label: "担当工程师:",
        prop: "qualityEngineer",
        labelConf: { colspan: 2, tdProp: { style: { borderTop: "hidden", borderRight: "hidden", textAlign: "right" } } },
        contentConf: { colspan: 4, tdProp: { style: { borderTop: "hidden", borderRight: "hidden" } } },
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      },

      {
        label: "审批(总监):",
        prop: "qualityDirector",
        labelConf: { tdProp: { style: { borderTop: "hidden", borderRight: "hidden", textAlign: "right" } } },
        contentConf: { colspan: 5, tdProp: { style: { borderTop: "hidden" } } },
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      }
    ],
    // 3.市场营销中心意见
    [
      {
        label: "市场营销中心意见:",
        prop: "marketingCenterOpinion",
        labelConf: { colspan: 2, tdProp: { style: { borderRight: "hidden", textAlign: "left" } } },
        contentConf: { colspan: 4, tdProp: { style: { borderRight: "hidden" } } },
        render: ({ formModel, row }) => (
          <el-input type="textarea" v-model={formModel[row.prop]} autosize={{ minRows: 1, maxRows: 1 }} resize="none" placeholder="请输入" />
        )
      },
      {
        label: "",
        prop: "confirmOpinion",
        labelConf: { colspan: 2 },
        contentConf: { colspan: 6, tdProp: { style: {} } },
        render: ({ formModel, row }) => (
          <el-checkbox-group v-model={formModel[row.prop]} class="pl-10">
            {[
              { value: "1", label: "需客户确认" },
              { value: "2", label: "不需要客户确认" }
            ].map((item) => (
              <el-checkbox label={item.label} value={item.value} />
            ))}
          </el-checkbox-group>
        )
      }
    ],
    [
      {
        prop: "",
        labelConf: { tdProp: { style: { borderRight: "hidden" } } },
        contentConf: { colspan: 3, tdProp: { style: { borderTop: "hidden", borderRight: "hidden" } } },
        render: () => <span />
      },
      {
        label: "业务经理:",
        prop: "businessManager",
        labelConf: { colspan: 5, tdProp: { style: { borderTop: "hidden", borderRight: "hidden", textAlign: "right" } } },
        contentConf: { colspan: 4, tdProp: { style: { borderTop: "hidden" } } },
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      }
    ],
    // 4.生产制造中心意见
    [
      {
        label: "生产制造中心意见:",
        prop: "productCenterOpinion",
        labelConf: { colspan: 2, tdProp: { style: { borderRight: "hidden", textAlign: "left" } } },
        contentConf: { colspan: 4, tdProp: { style: { borderRight: "hidden" } } },
        render: ({ formModel, row }) => (
          <el-input type="textarea" v-model={formModel[row.prop]} autosize={{ minRows: 1, maxRows: 1 }} resize="none" placeholder="请输入" />
        )
      },

      {
        label: "影响范围:",
        prop: "influenceRange",
        labelConf: { colspan: 1, tdProp: { style: { borderRight: "hidden", textAlign: "right" } } },
        contentConf: { colspan: 5 },
        render: ({ formModel, row }) => (
          <el-checkbox-group v-model={formModel[row.prop]} class="pl-10">
            {[
              { value: "1", label: "作业书" },
              { value: "2", label: "工装治具" },
              { value: "3", label: "生产工艺" }
            ].map((item) => (
              <el-checkbox label={item.label} value={item.value} />
            ))}
          </el-checkbox-group>
        )
      }
    ],
    [
      {
        label: "生产经理:",
        prop: "productManager",
        labelConf: { colspan: 2, tdProp: { style: { borderTop: "hidden", borderRight: "hidden", textAlign: "right" } } },
        contentConf: { colspan: 2, tdProp: { style: { borderTop: "hidden", borderRight: "hidden" } } },
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      },
      {
        label: "担当工程师:",
        prop: "productEngineer",
        labelConf: { colspan: 2, tdProp: { style: { borderTop: "hidden", borderRight: "hidden", textAlign: "right" } } },
        contentConf: { colspan: 2, tdProp: { style: { borderTop: "hidden", borderRight: "hidden" } } },
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      },
      {
        label: "审批(总监):",
        prop: "productDirector",
        labelConf: { colspan: 2, tdProp: { style: { borderTop: "hidden", borderRight: "hidden", textAlign: "right" } } },
        contentConf: { colspan: 2, tdProp: { style: { borderTop: "hidden" } } },
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      }
    ],

    // 5.副总批示意见
    [
      {
        label: "副总批示意见:",
        prop: "deputyDirectorOpinion",
        labelConf: { colspan: 2, tdProp: { style: { borderRight: "hidden", textAlign: "left" } } },
        contentConf: { colspan: 10, tdProp: { style: {} } },
        render: ({ formModel, row }) => (
          <el-input type="textarea" v-model={formModel[row.prop]} autosize={{ minRows: 1, maxRows: 1 }} resize="none" placeholder="请输入" />
        )
      }
    ],
    [
      {
        prop: "",
        labelConf: { tdProp: { style: { borderRight: "hidden" } } },
        contentConf: { colspan: 3, tdProp: { style: { borderTop: "hidden", borderRight: "hidden" } } },
        render: () => <span />
      },
      {
        label: "批示签名:",
        prop: "deputyDirectorSign",
        labelConf: { colspan: 5, tdProp: { style: { borderTop: "hidden", borderRight: "hidden", textAlign: "right" } } },
        contentConf: { colspan: 4, tdProp: { style: { borderTop: "hidden" } } },
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      }
    ]
  ];
};
export const formConfig2 = (): TableFormItemType[][] => {
  return [
    [
      {
        label: "变更效果验证",
        labelConf: { width: cWidth, rowspan: 12 },
        renderLabel: ({ row }) => <span>{row.label}</span>
      },
      {
        label: "1.验证描述",
        prop: "bbb1",
        labelConf: { width: "120px", colspan: 1, tdProp: { class: "ui-ta-l", style: { borderRight: "hidden" } } },
        contentConf: { colspan: 15 },
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      },
      {
        label: "验证工程师",
        prop: "bbb2",
        labelConf: { width: "120px" }
      },
      {
        label: "部门负责人",
        prop: "bbb3",
        labelConf: { width: "120px" }
      }
    ],
    [
      {
        label: "2.验证结果",
        prop: "bbb2",
        labelConf: { colspan: 3, tdProp: { class: "ui-ta-l", style: { borderRight: "hidden" } } },
        contentConf: { colspan: 13 },
        render: ({ formModel, row }) => (
          <el-checkbox-group v-model={formModel[row.prop]} class="pl-10">
            {[
              { value: "NG", label: "NG" },
              { value: "OK", label: "OK" }
            ].map((item) => (
              <el-checkbox label={item.value}>{item.label}</el-checkbox>
            ))}
          </el-checkbox-group>
        )
      },
      {
        prop: "bbb3",
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      },
      {
        prop: "bbb4",
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      }
    ],
    [
      {
        label: "技术研发中心意见:",
        prop: "bbb5",
        labelConf: { width: "140px", colspan: 2, tdProp: { class: "ui-ta-l", style: { borderRight: "hidden", borderBottom: "hidden" } } },
        contentConf: { colspan: 16, tdProp: { style: { borderBottom: "hidden" } } },
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      }
    ],
    [
      {
        label: "责任人:",
        prop: "bbb6",
        labelConf: { colspan: 12, tdProp: { class: "ui-ta-r", style: { borderRight: "hidden" } } },
        contentConf: { colspan: 6 },
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      }
    ],
    [
      {
        label: "生产制造中心意见:",
        prop: "bbb7",
        labelConf: { width: "140px", colspan: 2, tdProp: { class: "ui-ta-l", style: { borderRight: "hidden", borderBottom: "hidden" } } },
        contentConf: { colspan: 16, tdProp: { style: { borderBottom: "hidden" } } },
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      }
    ],
    [
      {
        label: "责任人:",
        prop: "bbb8",
        labelConf: { colspan: 12, tdProp: { class: "ui-ta-r", style: { borderRight: "hidden" } } },
        contentConf: { colspan: 6 },
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      }
    ],
    [
      {
        label: "市场营销中心意见:",
        prop: "bbb9",
        labelConf: { width: "140px", colspan: 2, tdProp: { class: "ui-ta-l", style: { borderRight: "hidden", borderBottom: "hidden" } } },
        contentConf: { colspan: 16, tdProp: { style: { borderBottom: "hidden" } } },
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      }
    ],
    [
      {
        label: "责任人:",
        prop: "bbb10",
        labelConf: { colspan: 12, tdProp: { class: "ui-ta-r", style: { borderRight: "hidden" } } },
        contentConf: { colspan: 6 },
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      }
    ],
    [
      {
        label: "副总审批意见:",
        prop: "bbb11",
        labelConf: { width: "140px", colspan: 2, tdProp: { class: "ui-ta-l", style: { borderRight: "hidden", borderBottom: "hidden" } } },
        contentConf: { colspan: 16, tdProp: { style: { borderBottom: "hidden" } } },
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      }
    ],
    [
      {
        label: "审批签名:",
        prop: "bbb12",
        labelConf: { colspan: 12, tdProp: { class: "ui-ta-r", style: { borderRight: "hidden" } } },
        contentConf: { colspan: 6 },
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      }
    ]
  ];
};
export const formConfig3 = (): TableFormItemType[][] => {
  const mergeRow = 7;
  return [
    [
      {
        label: "技术研发中心",
        labelConf: { width: cWidth, rowspan: mergeRow },
        renderLabel: ({ row }) => <span>{row.label}</span>
      },
      {
        prop: "ccc1",
        contentConf: { rowspan: 2 },
        render: ({ formModel, row }) => (
          <el-checkbox-group v-model={formModel[row.prop]} class="pl-10">
            {[{ value: "设计图纸", label: "设计图纸" }].map((item) => (
              <el-checkbox label={item.value}>{item.label}</el-checkbox>
            ))}
          </el-checkbox-group>
        )
      },
      { label: "修改", labelConf: { tdProp: { class: "lh-28" } } },
      { label: "审核" },
      { label: "市场营销中心", labelConf: { rowspan: 2 } },
      {
        prop: "ccc2",
        contentConf: { rowspan: 2 },
        render: ({ formModel, row }) => (
          <el-checkbox-group v-model={formModel[row.prop]} class="pl-10">
            {[{ value: "客户书面批准", label: "客户书面批准" }].map((item) => (
              <el-checkbox label={item.value}>{item.label}</el-checkbox>
            ))}
          </el-checkbox-group>
        )
      },
      { label: "修改" },
      { label: "审核" }
    ],
    [
      {
        prop: "ccc3",
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      },
      {
        prop: "ccc4",
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      },
      {
        prop: "ccc5",
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      },
      {
        prop: "ccc6",
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      }
    ],
    [
      {
        prop: "ccc7",
        contentConf: { colspan: 1 },
        render: ({ formModel, row }) => (
          <el-checkbox-group v-model={formModel[row.prop]} class="pl-10">
            {[{ value: "产品规格书", label: "产品规格书" }].map((item) => (
              <el-checkbox label={item.value}>{item.label}</el-checkbox>
            ))}
          </el-checkbox-group>
        )
      },
      {
        prop: "ccc8",
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      },
      {
        prop: "ccc9",
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      },
      {
        label: "生产制造中心",
        labelConf: { rowspan: mergeRow - 2 }
      },
      {
        prop: "ccc10",
        contentConf: { colspan: 1 },
        render: ({ formModel, row }) => (
          <el-checkbox-group v-model={formModel[row.prop]} class="pl-10">
            {[{ value: "作业指导书", label: "作业指导书" }].map((item) => (
              <el-checkbox label={item.value}>{item.label}</el-checkbox>
            ))}
          </el-checkbox-group>
        )
      },
      {
        prop: "ccc11",
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      },
      {
        prop: "ccc12",
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      }
    ],
    [
      {
        prop: "ccc13",
        contentConf: { colspan: 1 },
        render: ({ formModel, row }) => (
          <el-checkbox-group v-model={formModel[row.prop]} class="pl-10">
            {[{ value: "BOM变更", label: "BOM变更" }].map((item) => (
              <el-checkbox label={item.value}>{item.label}</el-checkbox>
            ))}
          </el-checkbox-group>
        )
      },
      {
        prop: "ccc14",
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      },
      {
        prop: "ccc15",
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      },
      {
        prop: "ccc16",
        contentConf: { colspan: 1 },
        render: ({ formModel, row }) => (
          <el-checkbox-group v-model={formModel[row.prop]} class="pl-10">
            {[{ value: "首批品试产", label: "首批品试产" }].map((item) => (
              <el-checkbox label={item.value}>{item.label}</el-checkbox>
            ))}
          </el-checkbox-group>
        )
      },
      {
        prop: "ccc17",
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      },
      {
        prop: "ccc18",
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      }
    ],
    [
      {
        prop: "ccc19",
        contentConf: { colspan: 1 },
        render: ({ formModel, row }) => (
          <el-checkbox-group v-model={formModel[row.prop]} class="pl-10">
            {[{ value: "承认样品书", label: "承认样品书" }].map((item) => (
              <el-checkbox label={item.value}>{item.label}</el-checkbox>
            ))}
          </el-checkbox-group>
        )
      },
      {
        prop: "ccc20",
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      },
      {
        prop: "ccc21",
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      },
      {
        prop: "ccc22",
        contentConf: { colspan: 1 },
        render: ({ formModel, row }) => (
          <el-checkbox-group v-model={formModel[row.prop]} class="pl-10">
            {[{ value: "QC工程图", label: "QC工程图" }].map((item) => (
              <el-checkbox label={item.value}>{item.label}</el-checkbox>
            ))}
          </el-checkbox-group>
        )
      },
      {
        prop: "ccc23",
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      },
      {
        prop: "ccc24",
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      }
    ],
    [
      {
        prop: "ccc25",
        contentConf: { colspan: 1 },
        render: ({ formModel, row }) => (
          <el-checkbox-group v-model={formModel[row.prop]} class="pl-10">
            {[{ value: "认证", label: "认证" }].map((item) => (
              <el-checkbox label={item.value}>{item.label}</el-checkbox>
            ))}
          </el-checkbox-group>
        )
      },
      {
        prop: "ccc26",
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      },
      {
        prop: "ccc27",
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      },
      {
        prop: "ccc28",
        contentConf: { colspan: 1 },
        render: ({ formModel, row }) => (
          <el-checkbox-group v-model={formModel[row.prop]} class="pl-10">
            {[{ value: "检验标准书", label: "检验标准书" }].map((item) => (
              <el-checkbox label={item.value}>{item.label}</el-checkbox>
            ))}
          </el-checkbox-group>
        )
      },
      {
        prop: "ccc29",
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      },
      {
        prop: "ccc30",
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      }
    ],
    [
      {
        prop: "ccc31",
        contentConf: { colspan: 1 },
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      },
      {
        prop: "ccc32",
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      },
      {
        prop: "ccc33",
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      },
      {
        prop: "ccc34",
        contentConf: { colspan: 1 },
        render: ({ formModel, row }) => (
          <el-checkbox-group v-model={formModel[row.prop]} class="pl-10">
            {[{ value: "RoHS 其他报告", label: "RoHS 其他报告" }].map((item) => (
              <el-checkbox label={item.value}>{item.label}</el-checkbox>
            ))}
          </el-checkbox-group>
        )
      },
      {
        prop: "ccc35",
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      },
      {
        prop: "ccc36",
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      }
    ]
  ];
};
export const formConfig4 = (): TableFormItemType[][] => {
  function getCells(prefix: string, arr: any[], placeholder = ""): TableFormItemType[][] {
    const list = arr.map((m, idx) => {
      const { prop1, prop2, prop3, prop4, cate, name, content } = m;
      const _prefix = `${prefix + idx}_`;
      const cateCol = cate ? [cate] : [];
      const render = ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder={placeholder} clearable />;
      return [
        ...cateCol,
        {
          prop: _prefix + prop1,
          contentConf: { colspan: 1 },
          render: ({ formModel, row }) => (
            <el-checkbox-group v-model={formModel[row.prop]} class="pl-10">
              {[{ value: name, label: name }].map((item) => (
                <el-checkbox label={item.value}>{item.label}</el-checkbox>
              ))}
            </el-checkbox-group>
          )
        },
        {
          label: content,
          prop: content ? "" : _prefix + "content",
          labelConf: { tdProp: { class: "ui-ta-l" } },
          render: content ? null : render
        },
        { prop: _prefix + prop2, render },
        { prop: _prefix + prop3, render },
        { prop: _prefix + prop4, render }
      ];
    });
    return list;
  }
  const result1 = getCells("tech_", [
    {
      cate: {
        label: "技术研发中心",
        labelConf: { rowspan: 9 },
        renderLabel: () => h("div", [h("div", "技术研"), h("span", "发中心")])
      },
      prop1: "project",
      name: "结构验证",
      content: "比是否符合客户规格要求,与变更前对比",
      prop2: "result",
      prop3: "verifier",
      prop4: "manager"
    },
    { prop1: "project", name: "功能验证", content: "比是否符合客户规格要求,与变更前对比", prop2: "result", prop3: "verifier", prop4: "manager" },
    { prop1: "project", name: "安规确认", content: "是否符合法规要求,与变更前对比", prop2: "result", prop3: "verifier", prop4: "manager" },
    { prop1: "project", name: "老化实验", content: "组装整机后确认是否满足客户规格要求,对比变更前", prop2: "result", prop3: "verifier", prop4: "manager" },
    { prop1: "project", name: "温度确认", content: "组装整机后确认是否满足客户规格要求,对比变更前", prop2: "result", prop3: "verifier", prop4: "manager" },
    { prop1: "project", name: "功率确认", content: "组装整机后确认是否满足客户规格要求,对比变更前", prop2: "result", prop3: "verifier", prop4: "manager" },
    { prop1: "project", name: "", content: "", prop2: "result", prop3: "verifier", prop4: "manager" },
    { prop1: "project", name: "", content: "", prop2: "result", prop3: "verifier", prop4: "manager" },
    { prop1: "project", name: "", content: "", prop2: "result", prop3: "verifier", prop4: "manager" }
  ]);
  const result2 = getCells("prod_", [
    {
      cate: {
        label: "生产制造中心及品质部",
        labelConf: { rowspan: 12 },
        renderLabel: () => h("div", [h("div", "生产制造中"), h("span", "心及品质部")])
      },
      prop1: "ddd1",
      name: "工装方面",
      content: "是否有利于实际作业,对比变更前",
      prop2: "ddd2",
      prop3: "ddd3",
      prop4: "ddd4"
    },
    { prop1: "ddd1", name: "设备方面", content: "是否降低损耗或提高工作效率,对比变更前", prop2: "ddd2", prop3: "ddd3", prop4: "ddd4" },
    { prop1: "ddd1", name: "生产连续性", content: "对生产连续性的影响确认,对比变更前", prop2: "ddd2", prop3: "ddd3", prop4: "ddd4" },
    { prop1: "ddd1", name: "操作合理性", content: "与变更前状态对比是否有好转并满足要求", prop2: "ddd2", prop3: "ddd3", prop4: "ddd4" },
    { prop1: "ddd1", name: "颜色色差", content: "与变更前量产品及客户样进行比对", prop2: "ddd2", prop3: "ddd3", prop4: "ddd4" },
    { prop1: "ddd1", name: "丝印效果", content: "与变更前量产品及客户样进行比对", prop2: "ddd2", prop3: "ddd3", prop4: "ddd4" },
    { prop1: "ddd1", name: "外观效果", content: "与变更前量产品及客户样进行比对", prop2: "ddd2", prop3: "ddd3", prop4: "ddd4" },
    { prop1: "ddd1", name: "RoHS确认", content: "是否符合要求", prop2: "ddd2", prop3: "ddd3", prop4: "ddd4" },
    { prop1: "ddd1", name: "Reach确认", content: "是否符合要求", prop2: "ddd2", prop3: "ddd3", prop4: "ddd4" },
    { prop1: "ddd1", name: "XRF确认", content: "是否符合要求", prop2: "ddd2", prop3: "ddd3", prop4: "ddd4" },
    { prop1: "ddd1", name: "", content: "", prop2: "ddd2", prop3: "ddd3", prop4: "ddd4" },
    { prop1: "ddd1", name: "", content: "", prop2: "ddd2", prop3: "ddd3", prop4: "ddd4" }
  ]);
  const result3 = getCells("other_", [
    {
      cate: {
        label: "其他(可补充)",
        labelConf: { rowspan: 12 },
        renderLabel: () => h("div", [h("div", "其他"), h("span", "(可补充)")])
      },
      prop1: "ddd1",
      name: "",
      content: "",
      prop2: "ddd2",
      prop3: "ddd3",
      prop4: "ddd4"
    },
    { prop1: "ddd1", name: "", content: "", prop2: "ddd2", prop3: "ddd3", prop4: "ddd4" },
    { prop1: "ddd1", name: "", content: "", prop2: "ddd2", prop3: "ddd3", prop4: "ddd4" }
  ]);

  return [
    [
      { labelConf: { width: cWidth, tdProp: { style: { borderRight: "hidden" } } }, renderLabel: () => <span /> },
      { label: "项目", labelConf: { width: "15%", tdProp: { class: "ui-ta-l lh-28" } } },
      { label: "具体确认内容", labelConf: { width: "45%" } },
      { label: "验证结果" },
      { label: "验证者" },
      { label: "部门负责人" }
    ],
    ...result1, // 技术研发中心
    ...result2, // 生产制造中心及品质部
    ...result3 // 其他
  ];
};
