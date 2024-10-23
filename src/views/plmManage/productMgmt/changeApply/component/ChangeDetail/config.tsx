import { Delete, Plus } from "@element-plus/icons-vue";
import { FormRules, UploadProps } from "element-plus";
import { message, showMessageBox } from "@/utils/message";
import { reactive, ref } from "vue";
import { setColumn, tableEditRender } from "@/utils/table";

import ChangeTable from "./ChangeTable.vue";
import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { PureTableBar } from "@/components/RePureTableBar";
import { Question } from "@/config/elements";

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

export const formConfigs = ({ onPreviewImg }): FormConfigItemType[] => {
  return [
    {
      label: "日期",
      prop: "date",
      colProp: { span: 8 },
      size: "small",
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
      colProp: { span: 11 },
      size: "small",
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "申请人",
      prop: "applyUser",
      colProp: { span: 5 },
      size: "small",
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "客户名称",
      prop: "customerName",
      colProp: { span: 8 },
      size: "small",
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },

    {
      label: "产品名称",
      prop: "productName",
      colProp: { span: 11 },
      size: "small",
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "产品型号",
      prop: "productModel",
      colProp: { span: 5 },
      size: "small",
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "变更类型",
      prop: "changeType",
      colProp: { span: 8 },
      size: "small",
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "变更阶段",
      prop: "changeStage",
      colProp: { span: 16 },
      size: "small",
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "变更原因",
      prop: "changeReason",
      colProp: { span: 24 },
      size: "small",
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
    },
    {
      label: "变更主题",
      prop: "changeTheme",
      colProp: { span: 24 },
      size: "small",
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "原因描述",
      prop: "reason",
      colProp: { span: 24 },
      size: "small",
      render: ({ formModel, row }) => (
        <el-input type="textarea" v-model={formModel[row.prop]} autosize={{ minRows: 4, maxRows: 4 }} resize="none" placeholder="请输入" />
      )
    },
    {
      label: "变更前",
      prop: "",
      colProp: { span: 8 },
      labelWidth: "100%",
      class: "center-label",
      slots: { label: ({ label }) => <span class="form-label">{label}</span> },
      size: "small",
      render: ({ formModel, row }) => null
    },
    {
      label: "变更后",
      prop: "",
      colProp: { span: 11 },
      labelWidth: "100%",
      class: "center-label",
      slots: { label: ({ label }) => <span class="form-label">{label}</span> },
      size: "small",
      render: ({ formModel, row }) => null
    },
    {
      label: "变更项目",
      prop: "",
      colProp: { span: 5 },
      labelWidth: "100%",
      class: "center-label",
      slots: { label: ({ label }) => <span class="form-label">{label}</span> },
      size: "small",
      render: ({ formModel, row }) => null
    },
    {
      label: "",
      prop: "changeBefore",
      colProp: { span: 8 },
      labelWidth: "-1px",
      size: "small",
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
      colProp: { span: 11 },
      labelWidth: "-1px",
      size: "small",
      render: ({ formModel, row }) => (
        <el-input type="textarea" v-model={formModel[row.prop]} autosize={{ minRows: 4, maxRows: 4 }} resize="none" placeholder="请输入" />
      )
    },
    {
      label: "",
      prop: "changeProject",
      colProp: { span: 5 },
      labelWidth: "-1px",
      size: "small",
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
    },
    {
      label: "变更涉及的相关修改(如有修改,提出修改人需在后面横线上签名):",
      prop: "changeProject",
      colProp: { span: 24 },
      labelWidth: "428px",
      class: "hide-label-left",
      size: "small",
      render: ({ formModel, row }) => null
    },
    {
      label: "",
      prop: "changeModify",
      colProp: { span: 24 },
      labelWidth: "-1px",
      class: "hide-top",
      size: "small",
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
    },
    {
      label: "部门审核:",
      prop: "departmentAudit",
      labelWidth: "140px",
      colProp: { span: 12 },
      class: "hide-label-left hide-top",
      style: { textAlign: "right" },
      size: "small",
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "批准:",
      prop: "ecrApproval",
      labelWidth: "160px",
      colProp: { span: 12 },
      class: "hide-label-left hide-top hide-left",
      style: { textAlign: "right" },
      size: "small",
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    }
  ];
};

export const formConfigs2 = ({ onTableChange }): FormConfigItemType[] => {
  return [
    {
      label: "变更评审&执行管理",
      prop: "",
      colProp: { span: 24 },
      labelWidth: "100%",
      class: "center-label",
      slots: { label: ({ label }) => <span class="form-label">{label}</span> },
      size: "small",
      render: ({ formModel, row }) => null
    },
    {
      label: "变更开始日期:",
      prop: "changeStartDate",
      labelWidth: 90,
      colProp: { span: 8 },
      class: "hide-label-left",
      size: "small",
      render: ({ formModel, row }) => (
        <el-date-picker type="date" v-model={formModel[row.prop]} format="YYYY-MM-DD" value-format="YYYY-MM-DD" placeholder="请选择" style="width: 100%;" />
      )
    },
    {
      label: "变更实施部门:",
      prop: "changeImplementDepartment",
      labelWidth: 100,
      colProp: { span: 8 },
      class: "hide-label-left hide-left",
      size: "small",
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入(制造中心填写)" />
    },
    {
      label: "首批变更标识方式:",
      prop: "changeFirstBatch",
      labelWidth: 120,
      colProp: { span: 8 },
      class: "hide-label-left hide-left",
      size: "small",
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入(制造中心填写)" />
    },
    {
      label: "BOM变更:",
      prop: "changeBom",
      labelWidth: 90,
      colProp: { span: 8 },
      class: "hide-label-left",
      size: "small",
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
      labelWidth: 100,
      colProp: { span: 8 },
      class: "hide-label-left hide-left",
      size: "small",
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "新物料编号:",
      prop: "newMaterialCode",
      labelWidth: 120,
      colProp: { span: 8 },
      class: "hide-label-left hide-left",
      size: "small",
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入 (技术研发中心填写)" />
    },
    {
      label: "",
      prop: "",
      colProp: { span: 24 },
      labelWidth: "0px",
      class: "hide-label-left",
      size: "small",
      render: ({ formModel, row }) => <ChangeTable onChange={onTableChange} />
    }
  ];
};
export const formConfigs3 = (): FormConfigItemType[] => {
  return [
    {
      label: "相关部门评审意见",
      prop: "",
      colProp: { span: 24 },
      labelWidth: "100%",
      class: "center-label",
      slots: { label: ({ label }) => <span class="form-label">{label}</span> },
      size: "small",
      render: ({ formModel, row }) => null
    },
    // 1.技术研发中心意见
    {
      label: "技术研发中心意见:",
      prop: "technologyDevelopmentCenterOpinion",
      labelWidth: 140,
      colProp: { span: 5 },
      class: "hide-label-left",
      size: "small",
      render: ({ formModel, row }) => (
        <el-input type="textarea" v-model={formModel[row.prop]} autosize={{ minRows: 2, maxRows: 2 }} resize="none" placeholder="请输入" />
      )
    },
    {
      label: "变更范围:",
      prop: "changeScope",
      labelWidth: 90,
      colProp: { span: 9 },
      class: "hide-label-left hide-left",
      size: "small",
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
      labelWidth: 90,
      colProp: { span: 10 },
      class: "hide-label-left hide-left",
      size: "small",
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
    },
    {
      label: "担当工程师:",
      prop: "technologyEngineer",
      labelWidth: 180,
      colProp: { span: 12 },
      class: "hide-label-left hide-top",
      size: "small",
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "审批(总监):",
      prop: "technologyDirector",
      labelWidth: 180,
      colProp: { span: 12 },
      class: "hide-label-left hide-top hide-left",
      size: "small",
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    // 2.品质中心意见
    {
      label: "品质中心意见:",
      prop: "qualityCenterOpinion",
      labelWidth: 140,
      colProp: { span: 24 },
      class: "hide-label-left",
      size: "small",
      render: ({ formModel, row }) => (
        <el-input type="textarea" v-model={formModel[row.prop]} autosize={{ minRows: 2, maxRows: 2 }} resize="none" placeholder="请输入" />
      )
    },
    {
      label: "担当工程师:",
      prop: "qualityEngineer",
      labelWidth: 180,
      colProp: { span: 12 },
      class: "hide-label-left hide-top",
      size: "small",
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "审批(总监):",
      prop: "qualityDirector",
      labelWidth: 180,
      colProp: { span: 12 },
      class: "hide-label-left hide-top hide-left",
      size: "small",
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    // 3.市场营销中心意见
    {
      label: "市场营销中心意见:",
      prop: "marketingCenterOpinion",
      labelWidth: 140,
      colProp: { span: 12 },
      class: "hide-label-left",
      size: "small",
      render: ({ formModel, row }) => (
        <el-input type="textarea" v-model={formModel[row.prop]} autosize={{ minRows: 2, maxRows: 2 }} resize="none" placeholder="请输入" />
      )
    },
    {
      label: "确认意见:",
      prop: "confirmOpinion",
      labelWidth: 90,
      colProp: { span: 12 },
      class: "hide-label-left hide-left",
      size: "small",
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
    },
    {
      label: "业务经理:",
      prop: "businessManager",
      labelWidth: "60%",
      colProp: { span: 24 },
      class: "hide-label-left hide-top",
      size: "small",
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    // 4.生产制造中心意见
    {
      label: "生产制造中心意见:",
      prop: "productCenterOpinion",
      labelWidth: 140,
      colProp: { span: 12 },
      class: "hide-label-left",
      size: "small",
      render: ({ formModel, row }) => (
        <el-input type="textarea" v-model={formModel[row.prop]} autosize={{ minRows: 2, maxRows: 2 }} resize="none" placeholder="请输入" />
      )
    },
    {
      label: "影响范围:",
      prop: "influenceRange",
      labelWidth: 90,
      colProp: { span: 12 },
      class: "hide-label-left hide-left",
      size: "small",
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
    },
    {
      label: "生产经理:",
      prop: "productManager",
      labelWidth: 180,
      colProp: { span: 8 },
      class: "hide-label-left hide-top",
      size: "small",
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "担当工程师:",
      prop: "productEngineer",
      labelWidth: 180,
      colProp: { span: 8 },
      class: "hide-label-left hide-top hide-left",
      size: "small",
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "审批(总监):",
      prop: "productDirector",
      labelWidth: 140,
      colProp: { span: 8 },
      class: "hide-label-left hide-top hide-left",
      size: "small",
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    // 5.副总批示意见
    {
      label: "副总批示意见:",
      prop: "deputyDirectorOpinion",
      labelWidth: 140,
      colProp: { span: 24 },
      class: "hide-label-left ",
      size: "small",
      render: ({ formModel, row }) => (
        <el-input type="textarea" v-model={formModel[row.prop]} autosize={{ minRows: 2, maxRows: 2 }} resize="none" placeholder="请输入" />
      )
    },
    {
      label: "批示签名:",
      prop: "deputyDirectorSign",
      labelWidth: "60%",
      colProp: { span: 24 },
      class: "hide-label-left hide-top",
      style: { textAlign: "right" },
      size: "small",
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    }
  ];
};
