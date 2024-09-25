/*
 * @Author: Hailen
 * @Date: 2024-03-15 16:49:20
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-08-14 15:30:42
 */

import { Ref, ref } from "vue";

import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import FormVerify from "../component/FormVerify.vue";
import { ItemKey } from "@/utils/form";
import { OptionsType } from "@/utils/table";
import { Question } from "@/config/elements";
import { acceptMime } from "@/config/constant";
import { enumDictionaryList } from "@/api/systemManage";
import regExp from "@/utils/regExp";

//======================= 表格配置 =======================

// 输入框选择
export const inputList: OptionsType[] = [
  { optionName: "输入框", optionValue: ItemKey.input },
  { optionName: "下拉框", optionValue: ItemKey.select },
  { optionName: "日期框", optionValue: ItemKey.date },
  { optionName: "数字框", optionValue: ItemKey.inputNumber },
  { optionName: "上传", optionValue: ItemKey.upload },
  { optionName: "树形下拉框", optionValue: ItemKey.treeSelect },
  { optionName: "开关", optionValue: ItemKey.switch },
  { optionName: "单选框", optionValue: ItemKey.radio },
  { optionName: "多选框", optionValue: ItemKey.checkbox }
];

// 是否隐藏
export const hideList: OptionsType[] = [
  { optionName: "是", optionValue: true },
  { optionName: "否", optionValue: false }
];

// 编辑状态
export const editStatusList: OptionsType[] = [
  { optionName: "默认", optionValue: undefined },
  { optionName: "清空", optionValue: "clearable" },
  { optionName: "禁用", optionValue: "disabled" },
  { optionName: "只读", optionValue: "readonly" }
];

// 是否启用插槽
export const slotsList: OptionsType[] = [
  { optionName: "默认", optionValue: undefined },
  { optionName: "启用", optionValue: true },
  { optionName: "关闭", optionValue: false }
];

/** 分割符(默认使用#号) */
export const SplitChar = "#";

//======================= 添加弹窗 =======================

export const formRules = (name): FormRules => ({
  columns: [
    { required: true, message: "输入内容不能为空", trigger: "blur" },
    {
      message: "输入格式错误",
      trigger: "blur",
      pattern: { name: regExp.nameMap2, table: regExp.nameMap2 }[name]
    }
  ]
});

// 问号图标
export const LabelQuestion = (props) => {
  const { label, ...reset } = props;
  return (
    <span>
      {label}
      <el-tooltip placement="top" {...reset}>
        <Question />
      </el-tooltip>
    </span>
  );
};

// 添加配置
export const formConfigs = (type = "table"): FormConfigItemType[] => {
  const name = type === "table" ? `表名${SplitChar}字段` : `名称${SplitChar}字段`;
  const label = type === "table" ? `(表名${SplitChar}字段)` : `(名称${SplitChar}字段)`;
  const placeholder = `输入格式使用${SplitChar}号隔开:
${name}
${name}
${name}
...`;
  return [
    {
      label: "建立表结构" + label,
      prop: "columns",
      colProp: { span: 24 },
      render: ({ formModel, row }) => {
        return (
          <el-input
            v-autoFocus
            type="textarea"
            resize="vertical"
            v-model={formModel[row.prop]}
            autosize={{ minRows: 6, maxRows: 20 }}
            placeholder={placeholder}
            clearable
          />
        );
      }
    }
  ];
};

//======================= 格式化处理弹窗 =======================

function checkApiUrl(formData, message, rule, value, callback) {
  if (formData.apiURL && !value) {
    callback(new Error(message));
  } else {
    callback();
  }
}

// 接口->枚举值
function checkDick(formData, message, rule, value, callback) {
  if (!formData.optionCode && !value) {
    callback(new Error(message));
  } else {
    callback();
  }
}
// 枚举->接口值
function checkApi(formData, message, rule, value, callback) {
  if (!formData.apiURL && !value) {
    callback(new Error(message));
  } else {
    callback();
  }
}

export const formatRules = (formData: Record<string, any>): FormRules => {
  return {
    itemType: [{ required: true, message: "请选择输入类型", trigger: "blur" }],
    layout: [{ required: true, message: "请选择布局网格", trigger: "blur" }],
    placeholder: [{ required: true, message: "请输入提示文本", trigger: "blur" }],
    format: [{ required: true, message: "请选择日期格式", trigger: "blur" }],
    type: [{ required: true, message: "请选择日期类型", trigger: "blur" }],
    apiURL: [{ validator: checkDick.bind(null, formData, "请输入接口地址"), trigger: "blur" }], // 非必填,可使用枚举字典
    optionCode: [{ validator: checkApi.bind(null, formData, "请选择枚举字段"), trigger: "blur" }], // 枚举字典
    uploadURL: [{ required: true, message: "请输入上传接口", trigger: "blur" }],
    limit: [{ required: true, message: "请输入最大上传数量", trigger: "blur" }],
    headers: [{ required: true, message: "请输入请求头部", trigger: "blur" }],
    accept: [{ required: true, message: "请选择上传文件类型", trigger: "blur" }],
    method: [{ validator: checkApiUrl.bind(null, formData, "请选择请求方式"), trigger: "blur" }],
    optionName: [{ validator: checkApiUrl.bind(null, formData, "请输入名称属性"), trigger: "blur" }],
    optionValue: [{ validator: checkApiUrl.bind(null, formData, "请输入值属性"), trigger: "blur" }],
    "list-type": [{ required: true, message: "列表类型", trigger: "blur" }]
    // clearable: [{ required: false, message: "清空", trigger: "blur" }],
    // disabled: [{ required: false, message: "禁用", trigger: "blur" }],
    // readonly: [{ required: false, message: "只读", trigger: "blur" }],
    // drag: [{ required: false, message: "是否拖拽上传", trigger: "blur" }],
    // multiple: [{ required: false, message: "是否多选", trigger: "blur" }],
    // "show-file-list": [{ required: false, message: "显示文件列表", trigger: "blur" }],
    // style: [{ required: false, message: "样式", trigger: "blur" }]
  };
};

/** 日期格式 */
export const dateFormats = [
  { optionName: "年月日+时分秒", optionValue: "YYYY-MM-DD HH:mm:ss" },
  { optionName: "年月日", optionValue: "YYYY-MM-DD" },
  { optionName: "年月", optionValue: "YYYY-MM" }
];
/** 请求类型 */
export const reqMethods = [
  { optionName: "GET", optionValue: "get" },
  { optionName: "POST", optionValue: "post" },
  { optionName: "PUT", optionValue: "put" },
  { optionName: "DELETE", optionValue: "delete" }
];
/** 日期类型 */
export const dateTypes = ["year", "years", "month", "date", "dates", "datetime", "week", "datetimerange", "daterange", "monthrange"];

// 格式化配置表单
export const formatConfigs = ({ formData, rowData }): Ref<FormConfigItemType[]> => {
  const enumList = ref([]);
  enumDictionaryList({}).then(({ data }) => (enumList.value = data));
  const configFn = (): FormConfigItemType[] => [
    { label: "", prop: "ctitle", labelWidth: "0px", colProp: { span: 24 }, render: () => <title-cate name="表单配置" /> },
    {
      label: "类型选择",
      prop: "itemType",
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} placeholder="请选择" onChange={onChange} class="ui-w-100">
            {inputList.map((item) => (
              <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
            ))}
          </el-select>
        );
      }
    },
    // ############### 公共 ###############
    {
      label: "布局",
      prop: "layout",
      colProp: { span: 12 },
      hide: false,
      slots: {
        label: ({ label }) => <LabelQuestion label={label} content="每行分为24格, 当配置的表单项超过24格, 则换行显示" />
      },
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} filterable placeholder="请选择" class="ui-w-100">
            {Array.from(new Array(24)).map((_, i) => (
              <el-option key={i} label={i + 1} value={i + 1} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "编辑状态",
      prop: "editInput",
      colProp: { span: 12 },
      hide: false,
      render: ({ formModel, row }) => {
        function disables({ optionValue }) {
          return [ItemKey.switch, ItemKey.radio].includes(formData.itemType) && optionValue === "readonly";
        }
        return (
          <el-select v-model={formModel[row.prop]} filterable placeholder="请选择" class="ui-w-100">
            {editStatusList.map((item) => (
              <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} disabled={disables(item)} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "输入提示",
      prop: "placeholder",
      colProp: { span: 12 },
      hide: [ItemKey.upload, ItemKey.radio, ItemKey.checkbox, ItemKey.switch].includes(formData.itemType),
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="输入框提示" clearable />
    },

    // ############### 数字框 ###############
    {
      label: "最小值",
      prop: "min",
      hide: formData.itemType !== ItemKey.inputNumber,
      colProp: { span: 12 },
      render: ({ formModel, row }) => (
        <el-input-number v-model={formModel[row.prop]} placeholder="请输入" controls-position="right" clearable class="ui-w-100" />
      )
    },
    {
      label: "最大值",
      prop: "max",
      hide: formData.itemType !== ItemKey.inputNumber,
      colProp: { span: 12 },
      render: ({ formModel, row }) => (
        <el-input-number v-model={formModel[row.prop]} placeholder="请输入" controls-position="right" clearable class="ui-w-100" />
      )
    },
    // ############### 日期 ###############
    {
      label: "日期格式",
      prop: "format",
      hide: formData.itemType !== ItemKey.date,
      colProp: { span: 12 },
      slots: {
        label: ({ label }) => <LabelQuestion label={label} content="数据必须是时间格式(时间戳、日期字符串)" />
      },
      render: ({ formModel, row }) => (
        <el-select v-model={formModel[row.prop]} filterable placeholder="请选择" clearable class="ui-w-100">
          {dateFormats.map((item) => (
            <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
          ))}
        </el-select>
      )
    },
    {
      label: "日期类型",
      prop: "type",
      hide: formData.itemType !== ItemKey.date,
      colProp: { span: 12 },
      render: ({ formModel, row }) => (
        <el-select v-model={formModel[row.prop]} filterable placeholder="请选择" clearable class="ui-w-100">
          {dateTypes.map((item) => (
            <el-option key={item} label={item} value={item} />
          ))}
        </el-select>
      )
    },
    // ############### 下拉框 ###############
    {
      label: "接口地址",
      prop: "apiURL",
      hide: ![ItemKey.select, ItemKey.treeSelect].includes(formData.itemType),
      colProp: { span: 12 },
      slots: {
        label: ({ label }) => <LabelQuestion label={label} content="配置接口地址, 请求方式、名称字段、值字段必填" />
      },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入接口地址" clearable />
    },
    {
      label: "请求方式",
      prop: "method",
      hide: ![ItemKey.select, ItemKey.treeSelect].includes(formData.itemType),
      colProp: { span: 12 },
      render: ({ formModel, row }) => (
        <el-select v-model={formModel[row.prop]} filterable placeholder="请输入请求方式" clearable class="ui-w-100">
          {reqMethods.map((item) => (
            <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
          ))}
        </el-select>
      )
    },
    {
      label: "名称字段",
      prop: "optionName",
      colProp: { span: 12 },
      hide: ![ItemKey.select, ItemKey.treeSelect].includes(formData.itemType),
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入数据名称字段" clearable />
    },
    {
      label: "值字段",
      prop: "optionValue",
      colProp: { span: 12 },
      hide: ![ItemKey.select, ItemKey.treeSelect].includes(formData.itemType),
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="输入数据值字段" clearable />
    },
    {
      label: "是否多选",
      prop: "multiple",
      hide: ![ItemKey.select, ItemKey.treeSelect, ItemKey.upload].includes(formData.itemType),
      colProp: { span: 12 },
      render: ({ formModel, row }) => (
        <el-radio-group v-model={formModel[row.prop]}>
          <el-radio label={true}>是</el-radio>
          <el-radio label={false}>否</el-radio>
        </el-radio-group>
      )
    },
    {
      label: "枚举字典",
      prop: "optionCode",
      hide: ![ItemKey.select, ItemKey.radio].includes(formData.itemType),
      slots: {
        label: ({ label }) => <LabelQuestion label={label} content="同时配置接口地址和枚举字典, 使用枚举字典数据" />
      },
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} filterable placeholder="请选择" clearable class="ui-w-100">
            {enumList.value.map((item) => (
              <el-option key={item.optionCode} label={item.optionName} value={item.optionCode}>
                <div class="flex">
                  <span class="ellipsis" style="width: 120px; margin-right: 10px">
                    {item.optionName}
                  </span>
                  <span class="ellipsis">{item.optionCode}</span>
                </div>
              </el-option>
            ))}
          </el-select>
        );
      }
    },
    // ############### 上传 ###############
    {
      label: "上传接口",
      prop: "uploadURL",
      hide: formData.itemType !== ItemKey.upload,
      colProp: { span: 12 },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入上传接口" clearable />
    },
    {
      label: "最大上传数量",
      prop: "limit",
      hide: formData.itemType !== ItemKey.upload,
      colProp: { span: 12 },
      render: ({ formModel, row }) => (
        <el-input-number v-model={formModel[row.prop]} min={1} placeholder="请输入" controls-position="right" clearable class="ui-w-100" />
      )
    },
    {
      label: "请求头部",
      prop: "headers",
      hide: formData.itemType !== ItemKey.upload,
      colProp: { span: 12 },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入请求头部" clearable />
    },
    {
      label: "上传文件类型",
      prop: "accept",
      hide: formData.itemType !== ItemKey.upload,
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return (
          <el-select
            v-model={formModel[row.prop]}
            filterable
            multiple
            value-key="value"
            clearable
            collapse-tags
            max-collapse-tags={3}
            collapse-tags-tooltip
            placeholder="请选择文件后缀"
            class="ui-w-100"
          >
            {acceptMime
              .map((item) => ({ label: item, vlaue: item }))
              .map((item) => (
                <el-option key={item.vlaue} label={item.label} value={item.vlaue} />
              ))}
          </el-select>
        );
      }
    },
    {
      label: "拖拽上传",
      prop: "drag",
      hide: formData.itemType !== ItemKey.upload,
      colProp: { span: 24 },
      render: ({ formModel, row }) => (
        <el-radio-group v-model={formModel[row.prop]}>
          <el-radio label={true}>是</el-radio>
          <el-radio label={false}>否</el-radio>
        </el-radio-group>
      )
    },
    {
      label: "文件列表",
      prop: "showFileList",
      hide: formData.itemType !== ItemKey.upload,
      colProp: { span: 24 },
      render: ({ formModel, row }) => (
        <el-radio-group v-model={formModel[row.prop]}>
          <el-radio label={true}>显示</el-radio>
          <el-radio label={false}>隐藏</el-radio>
        </el-radio-group>
      )
    },
    {
      label: "列表类型",
      prop: "listType",
      hide: formData.itemType !== ItemKey.upload,
      colProp: { span: 24 },
      render: ({ formModel, row }) => (
        <el-radio-group v-model={formModel[row.prop]}>
          <el-radio label="text">文本</el-radio>
          <el-radio label="picture">图片</el-radio>
          <el-radio label="picture-card">图片卡片</el-radio>
        </el-radio-group>
      )
    },
    // ############### 样式 ###############
    {
      label: "类名",
      prop: "className",
      colProp: { span: 12 },
      hide: false,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入类名(选填)" clearable />
    },
    {
      label: "样式",
      prop: "style",
      colProp: { span: 12 },
      hide: false,
      slots: {
        label: ({ label }) => <LabelQuestion label={label} content="扩展CSS原生样式(如: font-size: 14px; margin: 0px), 多个样式使用分号(;)隔开" />
      },
      render: ({ formModel, row }) => (
        <el-input
          type="textarea"
          v-model={formModel[row.prop]}
          autosize={{ minRows: 1, maxRows: 3 }}
          resize="none"
          placeholder="请输入样式(选填)"
          style="width: 100%"
          clearable
        />
      )
    },
    { label: "", prop: "ctitle", labelWidth: "0px", colProp: { span: 24 }, render: () => <title-cate name="表单校验" /> },
    {
      label: "",
      prop: "rules",
      colProp: { span: 24 },
      hide: false,
      labelWidth: "20px",
      render: ({ formModel, row }) => <FormVerify v-model={formModel[row.prop]} rowData={rowData} />
    }
  ];

  const newConf = ref(configFn());
  function onChange() {
    newConf.value = configFn();
  }
  return newConf;
};

// 复制配置
export const pasteConfigs = ({ type, formData, onCopy, onCreate, onPreview, onPaste, onClear }): FormConfigItemType[] => {
  return [
    {
      label: "",
      prop: "",
      colProp: { span: 24 },
      render: ({ formModel, row }) => {
        return {
          copy: (
            <div class="ui-w-100 ui-ta-c">
              <el-button type="primary" onClick={onCopy}>
                复制表格配置
              </el-button>
              <el-button type="success" onClick={onCreate}>
                添加表格配置
              </el-button>
            </div>
          ),
          paste: (
            <>
              <el-button type="primary" disabled={!formData.content} onClick={onPreview}>
                预览
              </el-button>
              <el-button type="warning" onClick={onClear}>
                清空
              </el-button>
            </>
          )
        }[type];
      }
    },
    {
      label: "",
      prop: "content",
      colProp: { span: 24 },
      hide: type !== "paste",
      render: ({ formModel, row }) => {
        return (
          <el-input
            // readonly
            type="textarea"
            resize="vertical"
            v-model={formModel[row.prop]}
            autosize={{ minRows: 6, maxRows: 20 }}
            placeholder="点击此处粘贴表格配置"
            onClick={onPaste}
            clearable
          />
        );
      }
    }
  ];
};
