export const formConfigs = ({ opts }) => [
  {
    label: "供应商编号",
    labelWidth: 90,
    colProp: { span: 6 },
    prop: "supplierNumber",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入" />;
    }
  },
  {
    label: "供应商名称",
    colProp: { span: 6 },
    labelWidth: 90,
    prop: "supplierName",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入" />;
    }
  },
  {
    label: "供应商简称",
    labelWidth: 90,
    colProp: { span: 6 },
    prop: "shortName",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入" />;
    }
  },
  {
    label: "公司网址",
    labelWidth: 90,
    colProp: { span: 6 },
    prop: "website",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入" />;
    }
  },
  {
    label: "通讯地址",
    labelWidth: 90,
    colProp: { span: 12 },
    prop: "address",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入" />;
    }
  },
  {
    label: "邮编",
    labelWidth: 90,
    colProp: { span: 6 },
    prop: "zipCode",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入" />;
    }
  },

  {
    label: "联系电话",
    labelWidth: 90,
    colProp: { span: 6 },
    prop: "tel",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入" />;
    }
  },
  {
    label: "工商登记号",
    labelWidth: 90,
    colProp: { span: 6 },
    prop: "registerCode",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入" />;
    }
  },
  {
    label: "经营许可证",
    labelWidth: 90,
    colProp: { span: 6 },
    prop: "tendPermit",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入" />;
    }
  },
  {
    label: "采购员",
    labelWidth: 90,
    colProp: { span: 6 },
    prop: "sellerId",
    render: ({ formModel, row }) => {
      return (
        <el-select v-model={formModel[row.prop]} placeholder="请选择" style={{ width: "100%" }}>
          {opts.value.purchaseOpts.map((item) => (
            <el-option key={item.optionValue} label={item.optionKey} value={item.optionValue} />
          ))}
        </el-select>
      );
    }
  },
  {
    label: "供应商分类",
    labelWidth: 90,
    colProp: { span: 6 },
    prop: "supplierClassify",
    render: ({ formModel, row }) => {
      return (
        <el-select v-model={formModel[row.prop]} placeholder="请选择" style={{ width: "100%" }}>
          {opts.value.supplierOpts.map((item) => (
            <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
          ))}
        </el-select>
      );
    }
  },
  {
    label: "供应商类别",
    labelWidth: 90,
    colProp: { span: 6 },
    prop: "supplyClassify",
    render: ({ formModel, row }) => {
      return (
        <el-select v-model={formModel[row.prop]} placeholder="请选择" style={{ width: "100%" }}>
          {opts.value.supplierOtherOpts.map((item) => (
            <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
          ))}
        </el-select>
      );
    }
  },
  {
    label: "供应商等级",
    labelWidth: 90,
    colProp: { span: 6 },
    prop: "supplierGrade",
    render: ({ formModel, row }) => {
      return (
        <el-select v-model={formModel[row.prop]} placeholder="请选择" style={{ width: "100%" }}>
          {opts.value.supplierLevelOpts.map((item) => (
            <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
          ))}
        </el-select>
      );
    }
  },
  {
    label: "客户",
    labelWidth: 90,
    colProp: { span: 6 },
    prop: "customerId",
    render: ({ formModel, row }) => {
      return (
        <el-select v-model={formModel[row.prop]} placeholder="请选择" style={{ width: "100%" }}>
          {opts.value.customerOpts.map((item) => (
            <el-option key={item.id} label={item.customerName} value={item.id} />
          ))}
        </el-select>
      );
    }
  },
  {
    label: "付款币种",
    colProp: { span: 6 },
    labelWidth: 90,
    prop: "payCurrencyId",
    render: ({ formModel, row }) => {
      return (
        <el-select v-model={formModel[row.prop]} placeholder="请选择" style={{ width: "100%" }}>
          {opts.value.currencyOpts.map((item) => (
            <el-option key={item.id} label={item.currencyName} value={item.id} />
          ))}
        </el-select>
      );
    }
  },
  {
    label: "付款条件",
    colProp: { span: 6 },
    labelWidth: 90,
    prop: "payCondition",
    render: ({ formModel, row }) => {
      return (
        <el-select v-model={formModel[row.prop]} placeholder="请选择" style={{ width: "100%" }}>
          {opts.value.paymentTermsOpts.map((item) => (
            <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
          ))}
        </el-select>
      );
    }
  },
  {
    label: "付款方式",
    colProp: { span: 6 },
    labelWidth: 90,
    prop: "paymentType",
    render: ({ formModel, row }) => {
      return (
        <el-select v-model={formModel[row.prop]} placeholder="请选择" style={{ width: "100%" }}>
          {opts.value.settlementModeOpts.map((item) => (
            <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
          ))}
        </el-select>
      );
    }
  },
  {
    label: "预付额度",
    labelWidth: 90,
    colProp: { span: 6 },
    prop: "payAdvanceAmount",
    render: ({ formModel, row }) => {
      return <el-input-number class="ui-w-100" controls={false} v-model={formModel[row.prop]} placeholder="请输入" />;
    }
  },
  {
    label: "预付比例%",
    labelWidth: 90,
    colProp: { span: 6 },
    prop: "payAdvanceRate",
    render: ({ formModel, row }) => {
      return <el-input-number class="ui-w-100" controls={false} v-model={formModel[row.prop]} placeholder="请输入" />;
    }
  },
  {
    label: "税分类",
    labelWidth: 90,
    colProp: { span: 6 },
    prop: "taxType",
    render: ({ formModel, row }) => {
      return (
        <el-select v-model={formModel[row.prop]} placeholder="请选择" style={{ width: "100%" }}>
          {opts.value.taxClassificationOpts.map((item) => (
            <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
          ))}
        </el-select>
      );
    }
  },
  {
    label: "税率%",
    labelWidth: 90,
    colProp: { span: 6 },
    prop: "taxRateId",
    render: ({ formModel, row }) => {
      return (
        <el-select v-model={formModel[row.prop]} placeholder="请选择" style={{ width: "100%" }}>
          {opts.value.customerTaxRateOpts.map((item) => (
            <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
          ))}
        </el-select>
      );
    }
  },
  {
    label: "税务登记号",
    labelWidth: 90,
    colProp: { span: 6 },
    prop: "taxRegisterCode",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入" />;
    }
  },
  {
    label: "增值税登记号",
    labelWidth: 90,
    colProp: { span: 6 },
    prop: "addedTaxRegisterCode",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入" />;
    }
  },
  {
    label: "经营类型",
    labelWidth: 90,
    colProp: { span: 6 },
    prop: "tendType",
    render: ({ formModel, row }) => {
      return (
        <el-select v-model={formModel[row.prop]} placeholder="请选择" style={{ width: "100%" }}>
          {opts.value.businessTypeOpts.map((item) => (
            <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
          ))}
        </el-select>
      );
    }
  },
  {
    label: "发票类型",
    labelWidth: 90,
    colProp: { span: 6 },
    prop: "invoiceType",
    render: ({ formModel, row }) => {
      return (
        <el-select v-model={formModel[row.prop]} placeholder="请选择" style={{ width: "100%" }}>
          {opts.value.invoiceTypeOpts.map((item) => (
            <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
          ))}
        </el-select>
      );
    }
  },
  {
    label: "最小订单量",
    labelWidth: 90,
    colProp: { span: 6 },
    prop: "minPOValue",
    render: ({ formModel, row }) => {
      return <el-input-number class="ui-w-100" controls={false} v-model={formModel[row.prop]} placeholder="请输入" />;
    }
  },
  {
    label: "交货周期(天)",
    labelWidth: 90,
    colProp: { span: 6 },
    prop: "leadTime",
    render: ({ formModel, row }) => {
      return <el-input-number class="ui-w-100" controls={false} v-model={formModel[row.prop]} placeholder="请输入" />;
    }
  },
  {
    label: "银行类型",
    labelWidth: 90,
    colProp: { span: 6 },
    prop: "bankType",
    render: ({ formModel, row }) => {
      return (
        <el-select v-model={formModel[row.prop]} placeholder="请选择" style={{ width: "100%" }}>
          {opts.value.bankTypeOpts.map((item) => (
            <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
          ))}
        </el-select>
      );
    }
  },
  {
    label: "开户行名称",
    labelWidth: 90,
    colProp: { span: 6 },
    prop: "openBankName",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入" />;
    }
  },
  {
    label: "开户行编号",
    labelWidth: 90,
    colProp: { span: 6 },
    prop: "openBankNumber",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入" />;
    }
  },
  {
    label: "银行账户",
    labelWidth: 90,
    colProp: { span: 6 },
    prop: "bankCode",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入" />;
    }
  },
  {
    label: "户主",
    labelWidth: 90,
    colProp: { span: 6 },
    prop: "bankHolder",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入" />;
    }
  },
  {
    label: "币种",
    labelWidth: 90,
    colProp: { span: 6 },
    prop: "currencyId",
    render: ({ formModel, row }) => {
      return (
        <el-select v-model={formModel[row.prop]} placeholder="请选择" style={{ width: "100%" }}>
          {opts.value.currencyOpts.map((item) => (
            <el-option key={item.id} label={item.currencyName} value={item.id} />
          ))}
        </el-select>
      );
    }
  }
];
