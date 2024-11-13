import { FormRules, UploadProps } from "element-plus";
import { reactive, ref } from "vue";

import ChangeTable from "./ChangeTable.vue";
import { Plus } from "@element-plus/icons-vue";
import { TableFormItemType } from "@/components/HxPrintTable/index.vue";
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

const merge = [1, 2];
const merge2 = [1, 5];

export const tableList = ({ onPreviewImg, onTableChange }): TableFormItemType[][] => {
  return [
    [
      { label: "ECR申请", merge: [11, 2], merge2: [], width: "7%", tdStyle: { verticalAlign: "middle" }, renderLabel: ({ row }) => <span>{row.label}</span> },
      {
        label: "日期",
        prop: "date",
        merge,
        merge2,
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
        merge,
        merge2,
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      },
      {
        label: "申请人",
        prop: "applyUser",
        merge,
        merge2,
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      }
    ],
    [
      {
        label: "客户名称",
        prop: "customerName",
        merge,
        merge2,
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      },
      {
        label: "产品名称",
        prop: "productName",
        merge,
        merge2,
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      },
      {
        label: "产品型号",
        prop: "productModel",
        merge,
        merge2,
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      }
    ],
    [
      {
        label: "变更类型",
        prop: "changeType",
        merge,
        merge2,
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      },
      {
        label: "变更阶段",
        prop: "changeStage",
        merge,
        merge2: [1, 12],
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      }
    ],
    [
      {
        label: "变更原因",
        prop: "changeReason",
        merge,
        merge2: [1, 19],
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
        merge,
        merge2: [1, 19],
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      }
    ],
    [
      {
        label: "原因描述",
        prop: "reason",
        merge,
        merge2: [1, 19],
        render: ({ formModel, row }) => (
          <el-input type="textarea" v-model={formModel[row.prop]} autosize={{ minRows: 2, maxRows: 2 }} resize="none" placeholder="请输入" />
        )
      }
    ],
    [
      { label: "变更前", merge: [1, 7], merge2: [0, 0], renderLabel: ({ row }) => <span class="lh-32">{row.label}</span> },
      { label: "变更后", merge: [1, 7], merge2: [0, 0], renderLabel: ({ row }) => <span class="lh-32">{row.label}</span> },
      { label: "变更项目", merge: [1, 7], merge2: [0, 0], renderLabel: ({ row }) => <span class="lh-32">{row.label}</span> }
    ],
    [
      {
        label: "",
        prop: "changeBefore",
        merge: [1, 0],
        merge2: [1, 7],
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
        merge: [1, 0],
        merge2: [1, 7],
        tdStyle2: { verticalAlign: "top" },
        render: ({ formModel, row }) => (
          <el-input type="textarea" v-model={formModel[row.prop]} autosize={{ minRows: 4, maxRows: 4 }} resize="none" placeholder="请输入" />
        )
      },
      {
        prop: "changeProject",
        merge: [1, 0],
        merge2: [1, 7],
        tdStyle2: { verticalAlign: "top" },
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
        merge: [1, 21],
        tdStyle: { textAlign: "left", borderBottom: "hidden" }
      }
    ],
    [
      {
        prop: "changeModify",
        merge2: [1, 21],
        tdStyle: { textAlign: "left", border: "none" },
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
        merge: [1, 2],
        merge2: [1, 5],
        tdStyle: { borderTop: "hidden", borderRight: "hidden" },
        tdStyle2: { borderTop: "hidden", borderRight: "hidden" },
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} size="small" placeholder="请输入" clearable />
      },
      {
        prop: "",
        merge2: [1, 4],
        tdStyle: { borderTop: "hidden", borderRight: "hidden" },
        tdStyle2: { borderTop: "hidden", borderRight: "hidden" },
        render: ({ formModel, row }) => <span />
      },
      {
        label: "批准:",
        prop: "ecrApproval",
        merge: [1, 2],
        merge2: [1, 8],
        tdStyle: { borderTop: "hidden", borderRight: "hidden" },
        tdStyle2: { borderTop: "hidden" },
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} size="small" placeholder="请输入" clearable />
      }
    ],
    [
      {
        label: "ECN执行",
        merge: [4, 2],
        merge2: merge2,
        width: "7%",
        tdStyle: { verticalAlign: "middle" },
        renderLabel: ({ row }) => <span>{row.label}</span>
      },
      { label: "变更评审&执行管理", merge: [1, 21], renderLabel: ({ row }) => <span class="lh-32">{row.label}</span> }
    ],
    [
      {
        label: "变更开始日期:",
        prop: "changeStartDate",
        merge: [1, 3],
        merge2: [1, 4],
        render: ({ formModel, row }) => (
          <el-date-picker type="date" v-model={formModel[row.prop]} format="YYYY-MM-DD" value-format="YYYY-MM-DD" placeholder="请选择" style="width: 100%;" />
        )
      },
      {
        label: "变更实施部门:",
        prop: "changeImplementDepartment",
        merge: [1, 3],
        merge2: [1, 4],
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入(制造中心填写)" />
      },
      {
        label: "首批变更标识方式:",
        prop: "changeFirstBatch",
        merge: [1, 3],
        merge2: [1, 4],
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入(制造中心填写)" />
      }
    ],
    [
      {
        label: "BOM变更:",
        prop: "changeBom",
        merge: [1, 3],
        merge2: [1, 4],
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
        merge: [1, 3],
        merge2: [1, 4],
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      },
      {
        label: "新物料编号:",
        prop: "newMaterialCode",
        merge: [1, 3],
        merge2: [1, 4],
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入 (技术研发中心填写)" />
      }
    ],
    [{ merge2: [1, 21], render: ({ formModel, row }) => <ChangeTable onChange={onTableChange} /> }],
    [
      {
        label: "ECN执行",
        merge: [11, 2],
        merge2: merge2,
        width: "7%",
        tdStyle: { verticalAlign: "middle" },
        renderLabel: ({ row }) => <span>{row.label}</span>
      },
      { label: "相关部门评审意见", merge: [1, 21], renderLabel: ({ row }) => <span class="lh-32">{row.label}</span> }
    ],
    // 1.技术研发中心意见
    [
      {
        label: "技术研发中心意见:",
        prop: "technologyDevelopmentCenterOpinion",
        merge: [1, 3],
        merge2: [1, 4],
        tdStyle: { borderRight: "hidden" },
        tdStyle2: { borderRight: "hidden" },
        render: ({ formModel, row }) => (
          <el-input type="textarea" v-model={formModel[row.prop]} autosize={{ minRows: 1, maxRows: 1 }} resize="none" placeholder="请输入" />
        )
      },
      {
        label: "变更范围:",
        prop: "changeScope",
        merge: [1, 2],
        merge2: [1, 5],
        tdStyle: { borderRight: "hidden" },
        tdStyle2: { borderRight: "hidden" },
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
        label: "变更方式:",
        prop: "changeWay",
        merge: [1, 2],
        merge2: [1, 5],
        tdStyle: { borderRight: "hidden" },
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
        merge: [1, 2],
        merge2: [1, 5],
        tdStyle: { borderTop: "hidden", borderRight: "hidden" },
        tdStyle2: { borderTop: "hidden", borderRight: "hidden" },
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      },
      {
        prop: "",
        merge2: [1, 4],
        tdStyle: { borderTop: "hidden", borderRight: "hidden" },
        tdStyle2: { borderTop: "hidden", borderRight: "hidden" },
        render: ({ formModel, row }) => <span />
      },
      {
        label: "审批(总监):",
        prop: "technologyDirector",
        merge: [1, 2],
        merge2: [1, 8],
        tdStyle: { borderTop: "hidden", borderRight: "hidden" },
        tdStyle2: { borderTop: "hidden" },
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      }
    ],
    // 2.品质中心意见
    [
      {
        label: "品质中心意见:",
        prop: "qualityCenterOpinion",
        merge,
        merge2: [1, 19],
        tdStyle: { borderRight: "hidden" },
        render: ({ formModel, row }) => (
          <el-input type="textarea" v-model={formModel[row.prop]} autosize={{ minRows: 1, maxRows: 1 }} resize="none" placeholder="请输入" />
        )
      }
    ],
    [
      {
        label: "担当工程师:",
        prop: "qualityEngineer",
        merge: [1, 2],
        merge2: [1, 5],
        tdStyle: { borderTop: "hidden", borderRight: "hidden" },
        tdStyle2: { borderTop: "hidden", borderRight: "hidden" },
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      },
      {
        prop: "",
        merge2: [1, 4],
        tdStyle: { borderTop: "hidden", borderRight: "hidden" },
        tdStyle2: { borderTop: "hidden", borderRight: "hidden" },
        render: ({ formModel, row }) => <span />
      },
      {
        label: "审批(总监):",
        prop: "qualityDirector",
        merge: [1, 2],
        merge2: [1, 8],
        tdStyle: { borderTop: "hidden", borderRight: "hidden" },
        tdStyle2: { borderTop: "hidden" },
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      }
    ],
    // 3.市场营销中心意见
    [
      {
        label: "市场营销中心意见:",
        prop: "marketingCenterOpinion",
        merge: [1, 3],
        merge2: [1, 4],
        tdStyle: { borderRight: "hidden" },
        tdStyle2: { borderRight: "hidden" },
        render: ({ formModel, row }) => (
          <el-input type="textarea" v-model={formModel[row.prop]} autosize={{ minRows: 1, maxRows: 1 }} resize="none" placeholder="请输入" />
        )
      },
      {
        prop: "",
        merge2: [1, 4],
        tdStyle: { borderRight: "hidden" },
        tdStyle2: { borderRight: "hidden" },
        render: ({ formModel, row }) => <span />
      },
      {
        label: "确认意见:",
        prop: "confirmOpinion",
        merge: [1, 2],
        merge2: [1, 8],
        tdStyle: { borderRight: "hidden" },
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
        merge2: [1, 11],
        tdStyle: { borderTop: "hidden", borderRight: "hidden" },
        tdStyle2: { borderTop: "hidden", borderRight: "hidden" },
        render: ({ formModel, row }) => <span />
      },
      {
        label: "业务经理:",
        prop: "businessManager",
        merge: [1, 2],
        merge2: [1, 8],
        tdStyle: { borderTop: "hidden", borderRight: "hidden" },
        tdStyle2: { borderTop: "hidden" },
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      }
    ],
    // 4.生产制造中心意见
    [
      {
        label: "生产制造中心意见:",
        prop: "productCenterOpinion",
        merge: [1, 3],
        merge2: [1, 4],
        tdStyle: { borderRight: "hidden" },
        tdStyle2: { borderRight: "hidden" },
        render: ({ formModel, row }) => (
          <el-input type="textarea" v-model={formModel[row.prop]} autosize={{ minRows: 1, maxRows: 1 }} resize="none" placeholder="请输入" />
        )
      },
      {
        prop: "",
        merge2: [1, 4],
        tdStyle: { borderRight: "hidden" },
        tdStyle2: { borderRight: "hidden" },
        render: ({ formModel, row }) => <span />
      },
      {
        label: "影响范围:",
        prop: "influenceRange",
        merge: [1, 2],
        merge2: [1, 8],
        tdStyle: { borderRight: "hidden" },
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
        merge: [1, 3],
        merge2: [1, 4],
        tdStyle: { borderTop: "hidden", borderRight: "hidden" },
        tdStyle2: { borderTop: "hidden", borderRight: "hidden" },
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      },
      {
        label: "担当工程师:",
        prop: "productEngineer",
        merge: [1, 3],
        merge2: [1, 4],
        tdStyle: { borderTop: "hidden", borderRight: "hidden" },
        tdStyle2: { borderTop: "hidden", borderRight: "hidden" },
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      },
      {
        label: "审批(总监):",
        prop: "productDirector",
        merge: [1, 3],
        merge2: [1, 4],
        tdStyle: { borderTop: "hidden", borderRight: "hidden" },
        tdStyle2: { borderTop: "hidden" },
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      }
    ],
    // 5.副总批示意见
    [
      {
        label: "副总批示意见:",
        prop: "deputyDirectorOpinion",
        merge: [1, 3],
        merge2: [1, 18],
        tdStyle: { borderRight: "hidden" },
        render: ({ formModel, row }) => (
          <el-input type="textarea" v-model={formModel[row.prop]} autosize={{ minRows: 1, maxRows: 1 }} resize="none" placeholder="请输入" />
        )
      }
    ],
    [
      {
        prop: "",
        merge2: [1, 11],
        tdStyle: { borderTop: "hidden", borderRight: "hidden" },
        tdStyle2: { borderTop: "hidden", borderRight: "hidden" },
        render: ({ formModel, row }) => <span />
      },
      {
        label: "批示签名:",
        prop: "deputyDirectorSign",
        merge: [1, 2],
        merge2: [1, 8],
        tdStyle: { borderTop: "hidden", borderRight: "hidden" },
        tdStyle2: { borderTop: "hidden" },
        render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
      }
    ]
  ];
};
