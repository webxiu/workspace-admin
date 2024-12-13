import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import { carSourceConstant } from "@/config/constant";
import { reactive } from "vue";

export const formRules = reactive<FormRules>({
  projectName: [{ required: true, message: "项目名称为必填项", trigger: "submit" }],
  companyName: [{ required: true, message: "第三方公司名称为必填项", trigger: "submit" }],
  dateOfCertificate: [{ required: true, message: "证书日期为必填项", trigger: "submit" }],
  effectiveDate: [{ required: true, message: "有效日期为必填项", trigger: "submit" }],
  money: [{ required: true, message: "金额为必填项", trigger: "submit" }],
  remark: [{ required: true, message: "备注为必填项", trigger: "submit" }]
});

export const billStateInfo = {
  0: "待提交",
  1: "审核中",
  2: "已审核",
  3: "重新审核"
};

export const billStateList = [
  { optionName: "待提交", optionValue: 0 },
  { optionName: "审核中", optionValue: 1 },
  { optionName: "已审核", optionValue: 2 },
  { optionName: "重新审核", optionValue: 3 }
];

export const formConfigs = ({ type, carsOpts, formData, handleAddUserNames, useOpts }): FormConfigItemType[] => {
  return [
    {
      label: "单据编号",
      prop: "billNo",
      labelWidth: 100,
      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "申请人",
      prop: "applyName",
      labelWidth: 100,
      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "目的地",
      prop: "destination",
      labelWidth: 100,
      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "外出事由",
      prop: "gooutReason",
      labelWidth: 100,
      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "状态",
      prop: "billState",
      labelWidth: 100,
      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} disabled placeholder="请选择" class="ui-w-100">
            {billStateList.map((item) => (
              <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "车辆来源",
      prop: "vehicleSource",
      labelWidth: 100,
      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        let val = "";
        if (/\d/.test(formModel[row.prop])) {
          val = carSourceConstant[formModel[row.prop]];
        } else {
          val = formModel[row.prop];
        }
        return <el-input v-model={val} disabled />;
      }
    },
    {
      label: "用车方式",
      labelWidth: 100,
      colProp: { span: 8 },
      prop: "applyVehicleUsage",
      render: ({ formModel, row }) => {
        return (
          <el-select disabled={type === "view"} v-model={formModel[row.prop]} placeholder="请选择用车方式" style={{ width: "100%" }}>
            {useOpts.map((item) => (
              <el-option key={item.value} label={item.label} value={item.value} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "司机",
      labelWidth: 100,
      prop: "driverName",
      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled={type === "view"} placeholder="请填写司机姓名" />;
      }
    },
    {
      label: "车牌",
      labelWidth: 100,
      colProp: { span: 8 },
      prop: "plateNumber",
      render: ({ formModel, row }) => {
        return formData.value.vehicleSource === "私家车" ? (
          <el-input disabled value={formData.value.goOutVehicleVO?.plateNumber} />
        ) : (
          <el-select v-model={formModel[row.prop]} disabled={type === "view"} placeholder="请选择车辆" style={{ width: "100%" }}>
            {carsOpts.value.map((item) => (
              <el-option key={item.value} label={item.label} value={item.value} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "同行人",
      labelWidth: 100,
      colProp: { span: 24 },
      prop: "userNames",
      render: ({ formModel, row }) => {
        return (
          <el-input readonly onClick={() => handleAddUserNames && handleAddUserNames(formData)} v-model={formModel[row.prop]} placeholder="请填写同行人" />
        );
      }
    },
    {
      label: "出车公里数",
      labelWidth: 100,
      colProp: { span: 8 },
      prop: "outMileage",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled={type === "view"} placeholder="请填写出车公里数" />;
      }
    },
    {
      label: "返程公里数",
      labelWidth: 100,
      colProp: { span: 8 },
      prop: "backMileage",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled={type === "view"} placeholder="请填写返程公里数" />;
      }
    },
    {
      label: "预计外出时间",
      prop: "planOutDate",
      labelWidth: 100,
      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        return <el-input disabled v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "预计返回时间",
      prop: "planBackDate",
      labelWidth: 100,
      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        return <el-input disabled v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "情况说明",
      labelWidth: 100,
      prop: "vehicleInfo",
      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        return <el-input disabled v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "创建时间",
      labelWidth: 100,
      prop: "createDate",
      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        return <el-input disabled v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "实际返回日期",
      labelWidth: 100,
      colProp: { span: 8 },
      prop: "backDay",
      render: ({ formModel, row }) => {
        return (
          <el-date-picker
            style={{ width: "100%" }}
            disabled={type === "view"}
            v-model={formModel[row.prop]}
            type="date"
            placeholder="请选择实际返回日期"
            valueFormat="YYYY-MM-DD"
          />
        );
      }
    },
    {
      label: "实际返回时间",
      labelWidth: 100,
      colProp: { span: 8 },
      prop: "backTime",
      render: ({ formModel, row }) => {
        return (
          <el-time-picker
            style={{ width: "100%" }}
            v-model={formModel[row.prop]}
            disabled={type === "view"}
            format="HH:mm"
            placeholder="请选择实际返回时间"
            value-format="HH:mm:ss"
          />
        );
      }
    },
    {
      label: "备注",
      labelWidth: 100,
      prop: "remarks",
      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        return <el-input disabled v-model={formModel[row.prop]} />;
      }
    }
  ];
};
