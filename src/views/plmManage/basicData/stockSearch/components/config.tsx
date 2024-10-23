import ButtonList from "@/components/ButtonList/index.vue";
import { reactive } from "vue";

import { FormRules } from "element-plus";
import MyUpload from "./MyUpload.vue";

// 编辑员工信息校验
export const formRules = reactive<FormRules>({
  number: [{ required: true, message: "编码为必填项", trigger: "submit" }],
  specification: [{ required: true, message: "规格型号为必填项", trigger: "submit" }],
  baseUnit: [{ required: true, message: "基本单位为必填项", trigger: "submit" }],
  materialGroup: [{ required: true, message: "物料分组为必填项", trigger: "submit" }],
  goodsType: [{ required: true, message: "存货类别为必填项", trigger: "submit" }]
});

// 编辑员工信息表单
export const formConfigs = (selectOpts: any, fn?): any[] => {
  const clickHandler = (v) => {
    if (v.text === "保存" && fn && typeof fn === "function") {
      fn();
    }
  };

  const buttonList = [
    { clickHandler, type: "primary", text: "保存" },
    { clickHandler, type: "primary", text: "刷新" }
  ];
  const defaultGroup = [
    {
      colProp: { span: 24 },
      render: () => {
        return <ButtonList buttonList={buttonList} />;
      }
    },
    {
      label: "编码",
      prop: "number",
      colProp: { span: 7 },
      labelWidth: 80,
      required: true,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入物料编码" clearable />;
      }
    },
    {
      label: "名称",
      prop: "name",
      labelWidth: 80,
      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入名称" clearable />;
      }
    },
    {
      label: "旧编码",
      prop: "oldCode",
      labelWidth: 85,
      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入旧物料编码" clearable />;
      }
    },
    {
      label: "规格型号",
      required: true,
      labelWidth: 80,
      prop: "specification",
      colProp: { span: 13 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入规格型号" clearable />;
      }
    },
    {
      label: "模号",
      prop: "model",
      labelWidth: 85,

      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入模号" clearable />;
      }
    },
    {
      label: "成品类型",
      labelWidth: 80,
      prop: "productType",
      colProp: { span: 7 },
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
            {selectOpts.productTypeOpts?.map((item) => (
              <el-option label={item.optionName} value={item.optionValue} key={item.id} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "基本单位",
      required: true,
      labelWidth: 80,

      prop: "baseUnit",
      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
            {selectOpts.basicUnitOpts?.map((item) => (
              <el-option label={item.optionName} value={item.optionValue} key={item.id} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "是否客供料",
      prop: "customerProvided",
      labelWidth: 85,

      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
            {selectOpts.isCustomerProviderOpts?.map((item) => (
              <el-option label={item.optionName} value={item.optionValue} key={item.id} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "采购单位",
      prop: "purchaseUnit",
      colProp: { span: 7 },
      labelWidth: 80,
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
            {selectOpts.basicUnitOpts?.map((item) => (
              <el-option label={item.optionName} value={item.optionValue} key={item.id} />
            ))}
          </el-select>
        );
      }
    },

    {
      label: "库存单位",
      prop: "stockUnit",
      colProp: { span: 6 },
      labelWidth: 80,

      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
            {selectOpts.basicUnitOpts?.map((item) => (
              <el-option label={item.optionName} value={item.optionValue} key={item.id} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "销售单位",
      prop: "saleUnti",
      colProp: { span: 6 },
      labelWidth: 85,

      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
            {selectOpts.basicUnitOpts?.map((item) => (
              <el-option label={item.optionName} value={item.optionValue} key={item.id} />
            ))}
          </el-select>
        );
      }
    },

    {
      label: "选择图片",
      prop: "file",
      colProp: { span: 7 },
      labelWidth: 80,
      render: ({ formModel, row }) => {
        return <MyUpload v-model={formModel[row.prop]} />;
      }
    },
    {
      colProp: { span: 24 },
      labelWidth: 0,
      render: () => {
        return (
          <el-divider content-position="left" border-style="dashed">
            基础属性
          </el-divider>
        );
      }
    }
  ];

  const basicProp = [
    {
      label: "仓库",
      prop: "warehouse",
      colProp: { span: 7 },
      labelWidth: 80,
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
            {selectOpts.warehourseOpts?.map((item) => (
              <el-option label={item.optionName} value={item.optionValue} key={item.id} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "物料种类",
      prop: "materialType",
      colProp: { span: 6 },
      labelWidth: 80,
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
            {selectOpts.materialTypeOpts?.map((item) => (
              <el-option label={item.optionName} value={item.optionValue} key={item.id} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "存货类别",
      required: true,
      prop: "goodsType",
      colProp: { span: 6 },
      labelWidth: 85,
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
            {selectOpts.stockTypeOpts?.map((item) => (
              <el-option label={item.optionName} value={item.optionValue} key={item.id} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "版本号",
      prop: "nation",
      colProp: { span: 5 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} readonly />;
      }
    },
    {
      label: "是否认证",
      prop: "cbcertification",
      colProp: { span: 7 },
      labelWidth: 80,
      render: ({ formModel, row }) => {
        return (
          <el-switch
            style="--el-switch-on-color: #13ce66"
            v-model={formModel[row.prop]}
            active-value={"1"}
            inactive-value={"0"}
            inline-prompt
            active-text="承认"
            inactive-text="承认"
          />
        );
      }
    },
    {
      label: "物料分组",
      prop: "materialGroup",
      required: true,
      colProp: { span: 6 },
      labelWidth: 80,
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
            {selectOpts.materialGroupOpts?.map((item) => (
              <el-option label={item.optionName} value={item.optionValue} key={item.id} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "备注",
      prop: "remark",
      colProp: { span: 11 },
      labelWidth: 85,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入备注" clearable />;
      }
    }
  ];

  const productProp = [
    {
      colProp: { span: 24 },
      labelWidth: 0,
      render: () => {
        return (
          <el-divider content-position="left" border-style="dashed">
            生产属性
          </el-divider>
        );
      }
    },
    {
      label: "物料属性",
      prop: "erpClsid",
      colProp: { span: 7 },
      labelWidth: 80,
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
            {selectOpts.materialAttributeOpts?.map((item) => (
              <el-option label={item.optionName} value={item.optionValue} key={item.id} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "生产车间",
      prop: "manufacturingShop",
      colProp: { span: 6 },
      labelWidth: 80,
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
            <el-option label="生产部" value={15} />
          </el-select>
        );
      }
    }
  ];

  const dateProp = [
    {
      colProp: { span: 24 },
      labelWidth: 0,
      render: () => {
        return (
          <el-divider border-style="dashed" content-position="left">
            日期属性
          </el-divider>
        );
      }
    },
    {
      label: "创建人",
      prop: "createUserName",
      colProp: { span: 7 },
      labelWidth: 80,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} readonly />;
      }
    },
    {
      label: "创建日期",
      prop: "createDate",
      colProp: { span: 6 },
      labelWidth: 80,

      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} readonly />;
      }
    },
    {
      label: "修改日期",
      prop: "modifyDate",
      colProp: { span: 6 },
      labelWidth: 85,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} readonly />;
      }
    },
    {
      label: "修改人",
      prop: "modifyUserName",
      colProp: { span: 5 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} readonly />;
      }
    }
  ];

  const groupInfo = [...defaultGroup, ...basicProp, ...productProp, ...dateProp];

  return groupInfo;
};
