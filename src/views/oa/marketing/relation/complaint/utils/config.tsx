import { FormRules, UploadProps } from "element-plus";

import { CustomerComplaintItemType } from "@/api/oaManage/marketing";
import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { message } from "@/utils/message";
import { reactive } from "vue";
import regExp from "@/utils/regExp";

interface DetailType {
  detailData?: CustomerComplaintItemType;
  onDownload: () => void;
}

// 新增验证
export const addformRules = reactive<FormRules>({
  customer: [{ required: true, message: "请输入客户名称", trigger: "blur" }],
  title: [{ required: true, message: "请输入标题", trigger: "blur" }]
});
// 新增客诉明细验证
export const detailFormRules = reactive<FormRules>({
  productModel: [{ required: true, message: "请输入产品型号", trigger: "blur" }],
  unit: [{ required: true, message: "请输入单位", trigger: "blur" }],
  orderQuantity: [
    { required: true, message: "请输入订单数量", trigger: "blur" },
    { required: true, message: "请输入数字", trigger: "blur", pattern: regExp.number }
  ],
  quantity: [
    { required: true, message: "请输入客诉数量", trigger: "blur" },
    { required: true, message: "请输入数字", trigger: "blur", pattern: regExp.number }
  ],
  type: [{ required: true, message: "请选择客诉类型", trigger: "blur" }],
  complaintDate: [{ type: "date", required: true, message: "请选择客诉日期", trigger: "change" }],
  question: [{ required: true, message: "请输入客诉问题", trigger: "blur" }],
  sampleSubmitDate: [{ type: "date", required: true, message: "请选择样品提交日期", trigger: "change" }],
  questionDescribe: [{ required: true, message: "请输入问题描述", trigger: "blur" }]
});

const layout = { span: 12 };
const baseApi = import.meta.env.VITE_BASE_API;

export enum BillState {
  /** 待提交 */
  submit = 0,
  /** 已提交 */
  submited = 1,
  /** 已接收 */
  receive = 2,
  /** 已回复 */
  reply = 3,
  /** 已作废 */
  discard = 4
}
export enum AuditState {
  /** 待提交 */
  submit = 0,
  /** 审核中 */
  auditing = 1,
  /** 已审核 */
  audited = 2,
  /** 重新审核 */
  reAudit = 3
}

export const billState = {
  [BillState.submit]: "待提交",
  [BillState.submited]: "已提交",
  [BillState.receive]: "已接收",
  [BillState.reply]: "已回复",
  [BillState.discard]: "已作废"
};
export const auditState = {
  [AuditState.submit]: "待提交",
  [AuditState.auditing]: "审核中",
  [AuditState.audited]: "已审核",
  [AuditState.reAudit]: "重新审核"
};

// 上传客诉文件
const accept = [".gif", ".jfif", ".pjpeg", ".jpeg", ".pjp", ".jpg", ".png", ".xls", ".xlsx", ".dot", ".doc", ".docx", ".pdf", ".m4v", ".mp4", ".wmv", ".avi"];

const replyAccept = [".ppt", ".pptx", ".xls", ".xlsx", ".dot", ".doc", ".docx", ".pdf", ".zip"];

// 新增表单
export const formConfigs = ({ detailData, onDownload }: DetailType): FormConfigItemType[] => {
  // 单据状态为已接收或已回复，禁用客诉明细修改, 显示回复表单
  const isShowReply = detailData?.marketState && [2, 3, 4].includes(detailData.marketState);

  return [
    {
      label: "品质部回复",
      prop: "reply",
      hide: !isShowReply,
      colProp: { span: 24 },
      render: ({ formModel, row }) => {
        return (
          <el-input
            v-model={formModel[row.prop]}
            rows={2}
            autofocus
            resize="none"
            type="textarea"
            autosize={{ minRows: 2, maxRows: 4 }}
            placeholder="请输入品质部回复"
            clearable
          />
        );
      }
    },
    {
      label: "回复附件",
      prop: "fileName",
      hide: !isShowReply,
      colProp: { span: 24 },
      render: ({ formModel, row }) => {
        const handleAvatarSuccess = (response) => {
          formModel["resourceName"] = response.data;
          formModel["updateReplyFile"] = true;
        };
        const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
          formModel[row.prop] = rawFile.name;
          const ext = rawFile.name.split(".")[1];
          if (!replyAccept.includes(`.${ext}`)) {
            message("文件格式不正确!", { type: "error" });
            return false;
          }
          return true;
        };
        return (
          <div class="flex ui-w-100">
            <el-input v-model={formModel[row.prop]} placeholder="请上传回复附件" clearable readonly class="flex-1" />
            {[AuditState.submit, AuditState.reAudit].includes(detailData?.state) ? (
              <el-upload
                class="ml-4"
                accept={replyAccept.join(",")}
                action={`${baseApi}/oa/mk/customercomplaint/uploadcomplaint`}
                show-file-list={false}
                on-success={handleAvatarSuccess}
                before-upload={beforeAvatarUpload}
              >
                <el-button type="primary">选择文件</el-button>
              </el-upload>
            ) : null}
            {[BillState.reply, BillState.discard].includes(detailData?.marketState) && detailData.resourceName ? (
              <el-button type="primary" class="ml-4" onClick={onDownload}>
                下载文件
              </el-button>
            ) : null}
          </div>
        );
      }
    },
    {
      label: "客户名称",
      prop: "customer",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入客户名称" clearable />;
      }
    },
    {
      label: "标题",
      prop: "title",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入标题" clearable />;
      }
    },
    {
      label: "订单号",
      prop: "orderNo",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入订单号" clearable />;
      }
    },
    {
      label: "创建人",
      prop: "createUserName",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入创建人" disabled />;
      }
    },
    {
      label: "创建时间",
      prop: "createDate",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="创建时间" disabled />;
      }
    }
  ];
};

// 新增客诉明细
export const detailFormConfigs = ({ isEdit, complaintOptions }): FormConfigItemType[] => {
  console.log("是否未编辑:", isEdit);
  return [
    {
      label: "产品型号",
      prop: "productModel",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入产品型号" clearable />;
      }
    },
    {
      label: "单位",
      prop: "unit",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入单位" clearable />;
      }
    },
    {
      label: "订单数量",
      prop: "orderQuantity",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入订单数量" />;
      }
    },
    {
      label: "客诉数量",
      prop: "quantity",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入客诉数量" />;
      }
    },
    {
      label: "客诉类型",
      prop: "type",
      colProp: layout,
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} placeholder="请选择客诉类型" value-key="optionValue" clearable class="ui-w-100">
            {complaintOptions.value.map((item) => (
              <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "客诉日期",
      prop: "complaintDate",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-date-picker v-model={formModel[row.prop]} placeholder="请选择客诉日期" clearable style={{ width: "100%" }} />;
      }
    },
    {
      label: "客诉问题",
      prop: "question",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入客诉问题" clearable />;
      }
    },
    {
      label: "样品提交日期",
      prop: "sampleSubmitDate",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-date-picker v-model={formModel[row.prop]} placeholder="请选择样品提交日期" clearable style={{ width: "100%" }} />;
      }
    },
    {
      label: "问题描述",
      prop: "questionDescribe",
      colProp: { span: 24 },
      render: ({ formModel, row }) => {
        return (
          <el-input
            v-model={formModel[row.prop]}
            rows={4}
            autofocus
            resize="none"
            type="textarea"
            autosize={{ minRows: 4, maxRows: 4 }}
            placeholder="请输入问题描述"
            clearable
          />
        );
      }
    },
    {
      label: "客诉附件",
      prop: "fileName",
      colProp: { span: 24 },
      render: ({ formModel, row }) => {
        const handleAvatarSuccess = (response) => {
          formModel["resourceName"] = response.data;
        };
        const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
          formModel[row.prop] = rawFile.name;
          const ext = rawFile.type.split("/")[1];
          if (!accept.includes(`.${ext}`)) {
            message("文件格式不正确!", { type: "error" });
            return false;
          }
          return true;
        };

        return (
          <div class="flex">
            <el-input v-model={formModel[row.prop]} placeholder="请选择客诉附件" disabled />
            <el-upload
              class="ml-4"
              accept={accept.join(",")}
              action={`${baseApi}/oa/mk/customercomplaint/uploadcomplaint`}
              show-file-list={false}
              on-success={handleAvatarSuccess}
              before-upload={beforeAvatarUpload}
            >
              <el-button type="primary">选择文件</el-button>
            </el-upload>
          </div>
        );
      }
    }
  ];
};
