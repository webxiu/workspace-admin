import { h, reactive } from "vue";

import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import SelectBank from "../SelectBank.vue";
import SelectLocal from "../SelectLocal.vue";
import { addDialog } from "@/components/ReDialog";

const GridSpan = 12;
const layout = { span: GridSpan, xs: 24, sm: 12, md: 12, lg: 12, xl: 12 };

// 编辑员工信息校验
export const formRules = reactive<FormRules>({
  FDATAVALUE: [{ required: true, message: "国家为必填项", trigger: "submit" }],
  FBANKCODE: [{ required: true, message: "银行账号为必填项", trigger: "submit" }],
  FBANKHOLDER: [{ required: true, message: "账户名称为必填项", trigger: "submit" }],
  FOPENBANKNAME: [{ required: true, message: "开户银行为必填项", trigger: "submit" }]
});

// 编辑员工信息表单
export const formConfigs = ({ projectsList }, countryList = [], formData): FormConfigItemType[] => {
  // 点击收款银行
  const clickBank = () => {
    let rowData: any = {};
    const setA = (val) => {
      console.log(val, "选择的银行");
      rowData = val;
    };

    addDialog({
      title: `选择收款银行`,
      width: "40%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(SelectBank, { setA }),
      beforeReset: (done, { options }) => {},
      beforeSure: (done, { options }) => {
        formData.bankName = rowData.FNAME;
        formData.FBANKTYPEREC = rowData.FNUMBER;
        done();
      }
    });
  };

  // 点击银行网点
  const clickLocal = () => {
    let rowData: any = {};
    const setA = (val) => {
      console.log(val, "选择的银行");
      rowData = val;
    };

    addDialog({
      title: `选择银行网点`,
      width: "70%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(SelectLocal, { setA }),
      beforeReset: (done, { options }) => {},
      beforeSure: (done, { options }) => {
        formData.FNAME = rowData.FNAME;
        formData.FOPENBANKNAME = rowData.BANK;
        formData.FCNAPS = rowData.FNUMBER;
        formData.FBANKDETAIL = rowData.FNUMBER;
        done();
      }
    });
  };
  console.log(countryList, "国家列表");

  return [
    {
      label: "国家",
      prop: "FCountry",
      colProp: layout,
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} class=" ui-w-100" placeholder="选择国家">
            {countryList.map((item) => (
              <el-option key={item.FDATAVALUE} label={item.FDATAVALUE} value={item.FNUMBER} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "银行账号",
      prop: "FBANKCODE",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入银行账号" clearable />;
      }
    },
    {
      label: "账户名称",
      prop: "FBANKHOLDER",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入账户名称" clearable />;
      }
    },
    {
      label: "收款银行",
      prop: "bankName",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input onClick={clickBank} readonly v-model={formModel[row.prop]} placeholder="请输入收款银行" clearable />;
      }
    },
    {
      label: "银行网点",
      prop: "FNAME",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input onClick={clickLocal} readonly v-model={formModel[row.prop]} placeholder="请输入银行网点" clearable />;
      }
    },
    {
      label: "开户银行",
      prop: "FOPENBANKNAME",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入开户银行" clearable />;
      }
    },
    {
      label: "银联号",
      prop: "FCNAPS",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入银联号" clearable />;
      }
    }
  ];
};
