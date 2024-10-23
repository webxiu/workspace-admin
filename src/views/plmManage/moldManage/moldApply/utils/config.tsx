import { FormRules, UploadProps } from "element-plus";

import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { Plus } from "@element-plus/icons-vue";
import ProductModeModal from "@/views/oa/productMkCenter/engineerDept/operateBook/ProductModeModal.vue";
import { reactive } from "vue";

// 编辑员工信息校验
export const formRules = reactive<FormRules>({
  productCode: [{ required: true, message: "输入产品型号", trigger: ["blur"] }],
  productName: [{ required: true, message: "输入产品名称", trigger: ["blur"] }],
  modelOpeningDate: [{ required: true, message: "请选择开模日期", trigger: ["blur"] }],
  trialDate: [{ required: true, message: "请选择试模日期", trigger: ["blur"] }],
  modelType: [{ required: true, message: "请选择模具类型", trigger: ["blur"] }],
  draftModelQuantity: [{ required: true, message: "请输入拟定模具总数", trigger: ["blur"] }],
  dataProvides: [{ required: true, message: "请选择资料提供", trigger: ["blur"] }],
  plmBillFiles: [{ required: true, message: "请上传附图", trigger: ["blur"] }]
});

// 模具类型
export const modelTypeList = [
  { label: "塑胶", value: "1" },
  { label: "五金", value: "2" },
  { label: "辅料", value: "3" },
  { label: "其他", value: "4" }
];

// 资料提供
export const dataProvideList = [
  { label: "CAD 2D", value: "1" },
  { label: "Pro/E(3D)", value: "2" },
  { label: "其他", value: "3" }
];

export const formConfigs = ({ type }): FormConfigItemType[] => {
  return [
    {
      label: "产品型号",
      prop: "productCode",
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        const onSelect = (val) => {
          formModel.productId = val.id;
          formModel[row.prop] = val.productCode;
        };
        return (
          <el-input v-model={formModel[row.prop]} placeholder="请选择产品型号" readonly>
            {{ append: () => <ProductModeModal onSelect={onSelect} /> }}
          </el-input>
        );
      }
    },
    {
      label: "产品名称",
      prop: "productName",
      colProp: { span: 12 },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "开模日期",
      prop: "modelOpeningDate",
      colProp: { span: 12 },
      render: ({ formModel, row }) => (
        <el-date-picker
          type="date"
          v-model={formModel[row.prop]}
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          placeholder="请选择"
          style="width: 100%;"
          clearable
        />
      )
    },
    {
      label: "试模日期",
      prop: "trialDate",
      colProp: { span: 12 },
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
      label: "模具类型",
      prop: "modelType",
      colProp: { span: 12 },
      render: ({ formModel, row }) => (
        <el-checkbox-group v-model={formModel[row.prop]} class="pl-10">
          {modelTypeList.map((item) => (
            <el-checkbox label={item.value} key={item.value}>
              {item.label}
            </el-checkbox>
          ))}
        </el-checkbox-group>
      )
    },
    {
      label: "拟定模具总数",
      prop: "draftModelQuantity",
      colProp: { span: 12 },
      render: ({ formModel, row }) => (
        <el-input-number v-model={formModel[row.prop]} min={1} placeholder="请输入" class="ui-w-100" controls-position="right" clearable />
      )
    },
    {
      label: "资料提供",
      prop: "dataProvides",
      colProp: { span: 12 },
      render: ({ formModel, row }) => (
        <el-checkbox-group v-model={formModel[row.prop]} class="pl-10">
          {dataProvideList.map((item) => (
            <el-checkbox label={item.value} key={item.value}>
              {item.label}
            </el-checkbox>
          ))}
        </el-checkbox-group>
      )
    },
    {
      label: "",
      prop: "",
      colProp: { span: 12 },
      class: "cell-merge",
      labelWidth: "0px",
      render: ({ formModel, row }) => <p class="ui-w-100 color-f00">(图纸为研发技术中心与模厂确认为准)</p>
    },

    {
      label: "附图",
      prop: "plmBillFiles",
      colProp: { span: 24 },
      slots: { label: ({ label }) => <span class="fw-700">{label}</span> },
      render: ({ formModel, row }) => {
        return (
          <el-upload
            limit={8}
            multiple
            auto-upload={false}
            v-model:file-list={formModel[row.prop]}
            accept=".jpg,.png,.jpeg,.bmp,.gif"
            list-type="picture-card"
            style={{ width: "100%", padding: "10px" }}
          >
            <el-icon>
              <Plus />
            </el-icon>
          </el-upload>
        );
      }
    },
    {
      label: "创建人",
      prop: "createUserName",
      colProp: { span: 12 },
      hide: type === "add",
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable disabled={type === "edit"} />
    },
    {
      label: "创建日期",
      prop: "createDate",
      colProp: { span: 12 },
      hide: type === "add",
      render: ({ formModel, row }) => (
        <el-date-picker
          type="date"
          v-model={formModel[row.prop]}
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          placeholder="请选择"
          clearable
          disabled={type === "edit"}
          style="width: 100%;"
        />
      )
    },
    {
      label: "修改人",
      prop: "modifyUserName",
      colProp: { span: 12 },
      hide: type === "add",
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" disabled={type === "edit"} clearable />
    },
    {
      label: "修改日期",
      prop: "modifyDate",
      colProp: { span: 12 },
      hide: type === "add",
      render: ({ formModel, row }) => (
        <el-date-picker
          type="date"
          v-model={formModel[row.prop]}
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          placeholder="请选择"
          clearable
          disabled={type === "edit"}
          style="width: 100%;"
        />
      )
    }
  ];
};

export const printFormConfigs = ({ onPreviewImg }): FormConfigItemType[] => {
  const styleEl = { height: "40px", display: "inline-flex", alignItems: "center" };
  const styleItem = { alignItems: "center" };
  return [
    {
      label: "产品型号",
      prop: "productCode",
      colProp: { span: 14 },
      class: "center-label",
      style: styleItem,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly style={styleEl} />
    },
    {
      label: "产品名称",
      prop: "productName",
      colProp: { span: 10 },
      class: "center-label",
      style: styleItem,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly style={styleEl} />
    },
    {
      label: "开模日期",
      prop: "modelOpeningDate",
      colProp: { span: 14 },
      class: "center-label",
      style: styleItem,
      render: ({ formModel, row }) => (
        <el-date-picker
          type="date"
          v-model={formModel[row.prop]}
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          placeholder="请选择"
          readonly
          class="ui-w-100"
          style={styleEl}
        />
      )
    },
    {
      label: "试模日期",
      prop: "trialDate",
      colProp: { span: 10 },
      class: "center-label",
      style: styleItem,
      render: ({ formModel, row }) => (
        <el-date-picker type="date" v-model={formModel[row.prop]} format="YYYY-MM-DD" value-format="YYYY-MM-DD" readonly class="ui-w-100" style={styleEl} />
      )
    },
    {
      label: "模具类型",
      prop: "modelType",
      colProp: { span: 14 },
      class: "center-label",
      style: styleItem,
      render: ({ formModel, row }) => (
        <el-checkbox-group v-model={formModel[row.prop]} class="pl-10" style={styleEl}>
          {modelTypeList.map((item) => (
            <el-checkbox label={item.value}>{item.label}</el-checkbox>
          ))}
        </el-checkbox-group>
      )
    },
    {
      label: "拟定模具总数",
      prop: "draftModelQuantity",
      colProp: { span: 10 },
      class: "center-label",
      style: styleItem,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly style={styleEl} />
    },
    {
      label: "资料提供",
      prop: "dataProvides",
      colProp: { span: 14 },
      class: "center-label",
      style: styleItem,
      render: ({ formModel, row }) => (
        <el-checkbox-group v-model={formModel[row.prop]} class="pl-10" style={styleEl}>
          {dataProvideList.map((item) => (
            <el-checkbox label={item.value}>{item.label}</el-checkbox>
          ))}
        </el-checkbox-group>
      )
    },
    {
      label: "",
      prop: "",
      colProp: { span: 10 },
      class: "cell-merge",
      style: styleItem,
      render: ({ formModel, row }) => <p class="ui-w-100">图纸为研发技术中心与模厂确认为准</p>
    },

    {
      label: "附图:",
      prop: "plmBillFiles",
      colProp: { span: 24 },
      class: "hide-content-left",
      labelWidth: "auto",
      slots: { label: ({ label }) => <span class="pl-4 pr-40">{label}</span> },
      render: ({ formModel, row }) => {
        const onPreview: UploadProps["onPreview"] = (uploadFile) => {
          onPreviewImg({ url: uploadFile.url });
        };
        return (
          <el-upload
            disabled
            v-model:file-list={formModel[row.prop]}
            accept=".jpg,.png,.jpeg,.bmp,.gif"
            list-type="picture-card"
            on-preview={onPreview}
            style={{ width: "100%", height: "350px", padding: "10px" }}
          >
            <el-icon>
              <Plus />
            </el-icon>
          </el-upload>
        );
      }
    },
    {
      label: "编制:",
      prop: "user1",
      colProp: { span: 5 },
      class: "hide-content-left",
      labelWidth: "52px",
      style: { height: "50px", alignItems: "center" },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly />
    },
    {
      label: "核准:",
      prop: "user2",
      colProp: { span: 5 },
      class: "hide-content-left hide-left",
      style: { height: "50px", alignItems: "center" },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly />
    },
    {
      label: "经管审批:",
      prop: "user3",
      colProp: { span: 5 },
      class: "hide-content-left hide-left",
      style: { height: "50px", alignItems: "center" },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly />
    },
    {
      label: "总监审批:",
      prop: "user4",
      colProp: { span: 9 },
      class: "hide-content-left hide-left",
      style: { height: "50px", alignItems: "center" },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly />
    },
    {
      label: "总(副总)经理意见:",
      prop: "",
      colProp: { span: 24 },
      class: "hide-content-left",
      labelWidth: "auto",
      slots: { label: ({ label }) => <span class="pl-4">{label}</span> },
      render: () => null
    },
    {
      label: "",
      prop: "user5",
      colProp: { span: 24 },
      labelWidth: "-1px",
      class: "hide-top",
      render: ({ formModel, row }) => (
        <el-input type="textarea" v-model={formModel[row.prop]} autosize={{ minRows: 10, maxRows: 10 }} resize="none" class="ui-w-100" />
      )
    },
    { label: "", prop: "", colProp: { span: 8 }, labelWidth: "-1px", class: "hide-top", render: () => null },

    {
      label: "批准:",
      prop: "user6",
      colProp: { span: 8, offset: 8 },
      class: "hide-top hide-left hide-content-left",
      style: { textAlign: "right" },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly />
    }
  ];
};
