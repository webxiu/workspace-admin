import { FormRules } from "element-plus";
import { reactive } from "vue";
const baseApi = import.meta.env.VITE_BASE_API;
import { UploadFilled } from "@element-plus/icons-vue";

export const formConfigs = ({ formData, handleAvatarSuccess, beforeAvatarUpload, optionInfo }) => {
  return [
    {
      label: "客户名称",
      colProp: { span: 6 },
      prop: "customerName",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请填写客户名称" />;
      }
    },
    {
      label: "客户区域",
      colProp: { span: 6 },
      prop: "customerAreaId",
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} placeholder="请选择客户区域" clearable class="ui-w-100">
            {optionInfo.value.customerAreaOpts?.map((item) => (
              <el-option key={item.optionValue} value={item.optionValue} label={item.optionName} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "客户编码",
      colProp: { span: 6 },
      prop: "customerOANumber",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请填写客户编码" />;
      }
    },
    {
      label: "国家",
      colProp: { span: 6 },
      prop: "customerCountryName",
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} placeholder="请选择国家" clearable class="ui-w-100">
            {optionInfo.value.countryMessage?.map((item) => (
              <el-option key={item.optionValue} value={item.optionValue} label={item.optionKey} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "地址",
      colProp: { span: 12 },
      prop: "customerLocation",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请填写地址" />;
      }
    },
    {
      label: "邮编",
      colProp: { span: 6 },
      prop: "zipCode",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请填写邮编" />;
      }
    },
    {
      label: "客户网址",
      colProp: { span: 6 },
      prop: "website",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请填写客户网址" />;
      }
    },
    {
      label: "传真",
      colProp: { span: 6 },
      prop: "fax",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请填写传真" />;
      }
    },
    {
      label: "纳税登记号",
      colProp: { span: 6 },
      prop: "taxRegisterCode",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请填写纳税登记号" />;
      }
    },
    {
      label: "交易币种",
      colProp: { span: 6 },
      prop: "tradingCurrId",
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} placeholder="请选择交易币种" clearable class="ui-w-100">
            {optionInfo.value.moneyClassify?.map((item) => (
              <el-option key={item.id} value={item.id} label={item.currencyName} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "销售员",
      colProp: { span: 6 },
      prop: "sellerId",
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} placeholder="请选择销售员" clearable class="ui-w-100">
            {optionInfo.value.saleUserOpts?.map((item) => (
              <el-option key={item.value} value={item.value} label={item.label} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "运输提前期",
      colProp: { span: 6 },
      prop: "transLeadTime",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请填写运输提前期" />;
      }
    },
    {
      label: "结算方式",
      colProp: { span: 6 },
      prop: "settlTypeId",
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} placeholder="请选择结算方式" clearable class="ui-w-100">
            {optionInfo.value.otherOpts?.map((item) => (
              <el-option key={item.value} value={item.value} label={item.label} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "收款币别",
      colProp: { span: 6 },
      prop: "receiveCurrId",
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} placeholder="请选择收款币别" clearable class="ui-w-100">
            {optionInfo.value.otherOpts?.map((item) => (
              <el-option key={item.value} value={item.value} label={item.label} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "收款条件",
      colProp: { span: 6 },
      prop: "recconditionId",
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} placeholder="请选择收款条件" clearable class="ui-w-100">
            {optionInfo.value.otherOpts?.map((item) => (
              <el-option key={item.value} value={item.value} label={item.label} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "税率",
      colProp: { span: 6 },
      prop: "taxRate",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请填写税率" />;
      }
    },
    {
      label: "禁用状态",
      colProp: { span: 6 },
      prop: "forbidStatus",
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} placeholder="请选择禁用状态" clearable class="ui-w-100">
            {optionInfo.value.statusOpts?.map((item) => (
              <el-option key={item.value} value={item.value} label={item.label} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "优先级",
      colProp: { span: 6 },
      prop: "priority",
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} placeholder="请选择优先级" clearable class="ui-w-100">
            {optionInfo.value.priorityOpts?.map((item) => (
              <el-option key={item.value} value={item.value} label={item.label} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "发票类型",
      colProp: { span: 6 },
      prop: "invoiceType",
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} placeholder="请选择发票类型" clearable class="ui-w-100">
            {optionInfo.value.invoiceTypeOpts?.map((item) => (
              <el-option key={item.value} value={item.value} label={item.label} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "联系人",
      colProp: { span: 6 },
      prop: "fname",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请填写联系人" />;
      }
    },
    {
      label: "联系方式",
      colProp: { span: 6 },
      prop: "phone",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请填写联系方式" />;
      }
    },
    {
      label: "邮箱",
      colProp: { span: 6 },
      prop: "email",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请填写邮箱" />;
      }
    },
    {
      label: "",
      labelWidth: 0,
      colProp: { span: 24 },
      prop: "customerLogo",
      render: () => {
        return (
          <el-upload
            drag
            style={{ width: "100px", height: "100px" }}
            class="avatar-logo"
            accept=".jpg,.png,.jpeg,.bmp,.gif"
            action={`${baseApi}/oa/mk/customermanager/uploadmultifile`}
            show-file-list={false}
            onSuccess={handleAvatarSuccess}
            before-upload={beforeAvatarUpload}
          >
            {formData.customerLogo ? (
              <img style={{ width: "100px" }} src={`${baseApi}/oa/mk/customermanager/down?resource=${formData.customerLogo}`} />
            ) : (
              <div style={{ display: "flex", height: "77px", "align-items": "center", "justify-content": "center" }}>
                <el-icon size={30}>
                  <UploadFilled />
                </el-icon>
              </div>
            )}
          </el-upload>
        );
      }
    }
  ];
};

// 编辑员工信息校验
export const formRules = reactive<FormRules>({
  customerName: [{ required: true, message: "请输入客户名称", trigger: "submit" }],
  customerAreaId: [{ required: true, message: "请选择客户区域", trigger: "submit" }],
  customerOANumber: [{ required: true, message: "请输入客户编码", trigger: "submit" }]
  // customerCountryName: [{ required: true, message: "请选择国家", trigger: "blur" }]
  // customerLocation: [{ required: true, message: "请输入地址", trigger: "blur" }]
});
