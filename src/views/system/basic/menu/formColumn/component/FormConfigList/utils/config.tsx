/*
 * @Author: Hailen
 * @Date: 2024-03-15 16:49:20
 * @Last Modified by: Hailen
 * @Last Modified time: 2025-02-07 14:59:09
 */

import { Ref, ref } from "vue";
import { acceptMime, boolOptions } from "@/config/constant";

import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import FormVerify from "../../FormVerify.vue";
import { ItemKey } from "@/utils/form";
import { OptionsType } from "@/utils/table";
import { Question } from "@/config/elements";
import regExp from "@/utils/regExp";

//======================= 表格配置 =======================

// 输入框选择
export const typeOptions: OptionsType[] = [
  { optionName: "输入框", optionValue: ItemKey.input },
  { optionName: "下拉框", optionValue: ItemKey.select },
  { optionName: "日期框", optionValue: ItemKey.date },
  { optionName: "时间框", optionValue: ItemKey.dateTime },
  { optionName: "文本域", optionValue: ItemKey.textArea },
  { optionName: "数字框", optionValue: ItemKey.inputNumber },
  { optionName: "上传", optionValue: ItemKey.upload },
  { optionName: "树形下拉框", optionValue: ItemKey.treeSelect },
  { optionName: "开关", optionValue: ItemKey.switch },
  { optionName: "单选框", optionValue: ItemKey.radio },
  { optionName: "多选框", optionValue: ItemKey.checkbox },
  { optionName: "穿梭框", optionValue: ItemKey.transfer },
  { optionName: "无", optionValue: ItemKey.empty }
];

export const layouts = Array.from(new Array(24)).map((_, i) => {
  return { optionName: i + 1, optionValue: i + 1 };
});

// 编辑状态
export const editStatusList: OptionsType[] = [
  { optionName: "默认", optionValue: undefined },
  { optionName: "禁用", optionValue: "disabled" },
  { optionName: "只读", optionValue: "readonly" }
];

// 是否启用插槽
export const slotsList: OptionsType[] = [
  { optionName: "默认", optionValue: undefined },
  { optionName: "启用", optionValue: true },
  { optionName: "关闭", optionValue: false }
];
// 文本域输入缩放控制
export const resizeList: OptionsType[] = [
  { optionName: "不缩放", optionValue: "none" },
  { optionName: "水平方向", optionValue: "horizontal" },
  { optionName: "垂直方向", optionValue: "vertical" },
  { optionName: "水平垂直方向", optionValue: "both" }
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

// 添加表结构
export const formConfigs = (type = "table"): FormConfigItemType[] => {
  const name = type === "table" ? `表名${SplitChar}字段` : `名称${SplitChar}字段`;
  const label = type === "table" ? `(表名${SplitChar}字段)` : `(名称${SplitChar}字段)`;
  const placeholder = `输入格式使用${SplitChar}号隔开 (表名不填默认从左侧获取):
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

//======================= 自定义渲染弹窗 =======================

function checkApiUrl(formData, message, rule, value, callback) {
  if (formData.apiURL && !value) {
    callback(new Error(message));
  } else {
    callback();
  }
}

// 接口->枚举值
function checkDick(formData, message, rule, value, callback) {
  if (formData.method === "custom") callback();
  if (!formData.enumKey && !value) {
    callback(new Error(message));
  } else {
    callback();
  }
}
// 枚举->接口值
function checkApi(formData, message, rule, value, callback) {
  if (formData.method === "custom") callback();
  if (!formData.apiURL && !value) {
    callback(new Error(message));
  } else {
    callback();
  }
}

// 开启自动上传=>上传接口必填校验
function checkUpload(formData, message, rule, value, callback) {
  if (formData.autoUpload && !value) {
    callback(new Error(message));
  } else {
    callback();
  }
}

export const formatRules = (formData: Record<string, any>): FormRules => {
  return {
    itemType: [{ required: true, message: "请选择输入类型", trigger: "blur" }],
    layout: [{ required: true, message: "请选择布局网格", trigger: "blur" }],
    type: [{ required: true, message: "请选择日期类型", trigger: "blur" }],
    dateFormat: [{ required: true, message: "请选择日期格式", trigger: "blur" }],
    dateTime: [{ required: true, message: "请选择时间类型", trigger: "blur" }],
    apiURL: [{ validator: checkDick.bind(null, formData, "请输入接口地址"), trigger: "blur" }], // 非必填,可使用枚举字典
    enumKey: [{ validator: checkApi.bind(null, formData, "请选择枚举字段"), trigger: "blur" }], // 枚举字典
    uploadURL: [{ validator: checkUpload.bind(null, formData, "请输入上传接口"), trigger: "blur" }],
    limit: [{ required: true, message: "请输入最大上传数量", trigger: "blur" }],
    accept: [{ required: true, message: "请选择上传文件类型", trigger: "blur" }],
    method: [{ validator: checkApiUrl.bind(null, formData, "请选择请求方式"), trigger: "blur" }],
    optionName: [{ validator: checkApiUrl.bind(null, formData, "请输入名称属性"), trigger: "blur" }],
    optionValue: [{ validator: checkApiUrl.bind(null, formData, "请输入值属性"), trigger: "blur" }],
    listType: [{ required: true, message: "列表类型", trigger: "blur" }]
    // placeholder: [{ required: false, message: "请输入提示文本", trigger: "blur" }]
    // activeValue: [{ required: true, message: "请选择开启数值", trigger: "blur" }],
    // inactiveValue: [{ required: true, message: "请选择关闭数值", trigger: "blur" }]
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
  { optionName: "年月", optionValue: "YYYY-MM" },
  { optionName: "年", optionValue: "YYYY" }
];
/** 时间格式 */
export const dateTimeFormats = [
  { optionName: "时分", optionValue: "HH:mm" },
  { optionName: "时分秒", optionValue: "HH:mm:ss" }
];
/** 请求类型 */
export const reqMethods = [
  { optionName: "自定义", optionValue: "custom" },
  { optionName: "GET", optionValue: "get" },
  { optionName: "POST", optionValue: "post" },
  { optionName: "PUT", optionValue: "put" },
  { optionName: "DELETE", optionValue: "delete" }
];
/** 输入框尺寸 */
export const sizeOptions = [
  { optionName: "较大", optionValue: "large" },
  { optionName: "默认", optionValue: "default" },
  { optionName: "较小", optionValue: "small" }
];
/** 值类型 */
export const valueOptions = [
  { optionName: "字符串", optionValue: "string" },
  { optionName: "数字", optionValue: "number" },
  { optionName: "布尔", optionValue: "boolean" }
];
/** 日期类型 */
export const dateTypes = ["year", "years", "month", "date", "dates", "datetime", "week", "datetimerange", "daterange", "monthrange"];

// 格式化配置表单
export const formatConfigs = ({ formData, rowData, enumList, onPlaceholderChange }): Ref<FormConfigItemType[]> => {
  const configFn = (): FormConfigItemType[] => [
    { label: "", prop: "ctitle", labelWidth: "0px", colProp: { span: 24 }, render: () => <title-cate name="表单配置" /> },
    {
      label: "类型选择",
      prop: "itemType",
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} placeholder="请选择" onChange={onChange} class="ui-w-100">
            {typeOptions.map((item) => (
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
      slot: {
        label: ({ label }) => <Question label={label} tipMsg="每行分为24格, 当配置的表单项超过24格, 则换行显示" />
      },
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} filterable placeholder="请选择" class="ui-w-100">
            {layouts.map(({ optionName, optionValue }) => (
              <el-option key={optionValue} label={optionName} value={optionValue} />
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
      label: "是否清空",
      prop: "clearable",
      colProp: { span: 12 },
      hide: [ItemKey.upload, ItemKey.radio, ItemKey.checkbox, ItemKey.switch, ItemKey.inputNumber].includes(formData.itemType),
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} placeholder="选填" class="ui-w-100">
            {boolOptions.map((item) => (
              <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "输入提示",
      prop: "placeholder",
      colProp: { span: 12 },
      hide: [ItemKey.upload, ItemKey.radio, ItemKey.checkbox, ItemKey.switch, ItemKey.transfer].includes(formData.itemType),
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="选填" clearable />
    },
    {
      label: "默认值",
      prop: "defaultValue",
      colProp: { span: 12 },
      hide: [ItemKey.radio, ItemKey.checkbox, ItemKey.upload, ItemKey.transfer].includes(formData.itemType),
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="选填" clearable />
    },
    {
      label: "字段说明",
      prop: "labelMsg",
      colProp: { span: 12 },
      hide: false,
      slot: { label: ({ label }) => <Question label={label} tipMsg="为字段添加问号小图标" /> },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="选填" clearable />
    },
    {
      label: "尺寸",
      prop: "size",
      colProp: { span: 12 },
      hide: [ItemKey.upload, ItemKey.transfer].includes(formData.itemType),
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} placeholder="选填" class="ui-w-100">
            {sizeOptions.map((item) => (
              <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "搜索提示",
      prop: "filterPlaceholder",
      colProp: { span: 12 },
      hide: ![ItemKey.transfer].includes(formData.itemType),
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="选填" clearable />
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
    {
      label: "控制按钮",
      prop: "controls",
      hide: formData.itemType !== ItemKey.inputNumber,
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} placeholder="是否显示(选填)" clearable class="ui-w-100">
            {boolOptions.map((item) => (
              <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
            ))}
          </el-select>
        );
      }
    },
    // ############### 日期 ###############
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
    {
      label: "日期格式",
      prop: "dateFormat",
      hide: formData.itemType !== ItemKey.date,
      colProp: { span: 12 },
      slot: { label: ({ label }) => <Question label={label} tipMsg="数据必须是时间格式(时间戳、日期字符串)" /> },
      render: ({ formModel, row }) => (
        <el-select v-model={formModel[row.prop]} filterable placeholder="请选择" clearable class="ui-w-100">
          {dateFormats.map((item) => (
            <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
          ))}
        </el-select>
      )
    },
    {
      label: "时间格式",
      prop: "dateTime",
      hide: formData.itemType !== ItemKey.dateTime,
      colProp: { span: 12 },
      render: ({ formModel, row }) => (
        <el-select v-model={formModel[row.prop]} filterable placeholder="请选择" clearable class="ui-w-100">
          {dateTimeFormats.map((item) => (
            <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
          ))}
        </el-select>
      )
    },
    {
      label: "时间范围",
      prop: "isRange",
      hide: formData.itemType !== ItemKey.dateTime,
      colProp: { span: 12 },
      render: ({ formModel, row }) => (
        <el-radio-group v-model={formModel[row.prop]}>
          {boolOptions.map((item) => (
            <el-radio key={item.optionValue} label={item.optionValue}>
              {item.optionName}
            </el-radio>
          ))}
        </el-radio-group>
      )
    },
    // ############### 下拉框 ###############
    {
      label: "请求方式",
      prop: "method",
      hide: ![ItemKey.select, ItemKey.treeSelect, ItemKey.radio, ItemKey.checkbox].includes(formData.itemType),
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
      label: "接口地址",
      prop: "apiURL",
      hide: ![ItemKey.select, ItemKey.treeSelect, ItemKey.radio, ItemKey.checkbox].includes(formData.itemType),
      colProp: { span: 12 },
      slot: {
        label: ({ label }) => <Question label={label} tipMsg="配置接口地址, 请求方式、名称字段、值字段必填" />
      },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入接口地址" clearable />
    },
    {
      label: "名称字段",
      prop: "optionName",
      colProp: { span: 12 },
      hide: ![ItemKey.select, ItemKey.treeSelect, ItemKey.radio, ItemKey.checkbox, ItemKey.transfer].includes(formData.itemType),
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入数据名称字段" clearable />
    },
    {
      label: "值字段",
      prop: "optionValue",
      colProp: { span: 12 },
      hide: ![ItemKey.select, ItemKey.treeSelect, ItemKey.radio, ItemKey.checkbox, ItemKey.transfer].includes(formData.itemType),
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="输入数据值字段" clearable />
    },
    {
      label: "类型转换",
      prop: "valueType",
      colProp: { span: 12 },
      hide: ![ItemKey.radio, ItemKey.checkbox, ItemKey.select, ItemKey.treeSelect].includes(formData.itemType),
      slot: { label: ({ label }) => <Question label={label} tipMsg="将表单数据转换为选中类型" /> },
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} placeholder="选填" clearable class="ui-w-100">
            {valueOptions.map((item) => (
              <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "枚举字典",
      prop: "enumKey",
      hide: ![ItemKey.select, ItemKey.radio, ItemKey.checkbox].includes(formData.itemType),
      slot: {
        label: ({ label }) => <Question label={label} tipMsg="同时配置接口地址和枚举字典, 使用枚举字典数据" />
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
    {
      label: "是否多选",
      prop: "multiple",
      hide: ![ItemKey.select, ItemKey.treeSelect, ItemKey.upload, ItemKey.checkbox].includes(formData.itemType),
      colProp: { span: 12 },
      render: ({ formModel, row }) => (
        <el-radio-group v-model={formModel[row.prop]}>
          {boolOptions.map((item) => (
            <el-radio key={item.optionValue} label={item.optionValue}>
              {item.optionName}
            </el-radio>
          ))}
        </el-radio-group>
      )
    },
    {
      label: "是否筛选",
      prop: "filterable",
      hide: ![ItemKey.select, ItemKey.treeSelect, ItemKey.transfer].includes(formData.itemType),
      colProp: { span: 12 },
      render: ({ formModel, row }) => (
        <el-radio-group v-model={formModel[row.prop]}>
          {boolOptions.map((item) => (
            <el-radio key={item.optionValue} label={item.optionValue}>
              {item.optionName}
            </el-radio>
          ))}
        </el-radio-group>
      )
    },
    {
      label: "多选文字展示",
      prop: "collapseTags",
      hide: ![ItemKey.select, ItemKey.treeSelect].includes(formData.itemType),
      colProp: { span: 12 },
      render: ({ formModel, row }) => (
        <el-radio-group v-model={formModel[row.prop]}>
          {boolOptions.map((item) => (
            <el-radio key={item.optionValue} label={item.optionValue}>
              {item.optionName}
            </el-radio>
          ))}
        </el-radio-group>
      )
    },
    {
      label: "标签显示数量",
      prop: "maxCollapseTags",
      hide: ![ItemKey.select, ItemKey.treeSelect].includes(formData.itemType),
      colProp: { span: 12 },
      render: ({ formModel, row }) => (
        <el-input-number v-model={formModel[row.prop]} placeholder="请输入" controls-position="right" clearable class="ui-w-100" />
      )
    },
    {
      label: "是否悬停提示",
      prop: "collapseTagsTooltip",
      hide: ![ItemKey.select, ItemKey.treeSelect].includes(formData.itemType),
      colProp: { span: 12 },
      render: ({ formModel, row }) => (
        <el-radio-group v-model={formModel[row.prop]}>
          {boolOptions.map((item) => (
            <el-radio key={item.optionValue} label={item.optionValue}>
              {item.optionName}
            </el-radio>
          ))}
        </el-radio-group>
      )
    },
    {
      label: "开启数值",
      prop: "activeValue",
      hide: ![ItemKey.switch].includes(formData.itemType),
      colProp: { span: 12 },
      render: ({ formModel, row }) => (
        <el-select v-model={formModel[row.prop]} placeholder="请选择" clearable class="ui-w-100">
          <el-option label="true" value={true} />
          <el-option label="1" value={1} />
        </el-select>
      )
    },
    {
      label: "关闭数值",
      prop: "inactiveValue",
      hide: ![ItemKey.switch].includes(formData.itemType),
      colProp: { span: 12 },
      render: ({ formModel, row }) => (
        <el-select v-model={formModel[row.prop]} placeholder="请选择" clearable class="ui-w-100">
          <el-option label="false" value={false} />
          <el-option label="0" value={0} />
        </el-select>
      )
    },
    {
      label: "开启名称",
      prop: "activeText",
      hide: ![ItemKey.switch].includes(formData.itemType),
      colProp: { span: 12 },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="例如:是/启用 (选填)" clearable />
    },
    {
      label: "关闭名称",
      prop: "inactiveText",
      hide: ![ItemKey.switch].includes(formData.itemType),
      colProp: { span: 12 },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="例如:否/禁用 (选填)" clearable />
    },
    // ############### 上传 ###############
    {
      label: "自动上传",
      prop: "autoUpload",
      hide: formData.itemType !== ItemKey.upload,
      colProp: { span: 12 },
      render: ({ formModel, row }) => (
        <el-radio-group v-model={formModel[row.prop]}>
          {boolOptions.map((item) => (
            <el-radio key={item.optionValue} label={item.optionValue}>
              {item.optionName}
            </el-radio>
          ))}
        </el-radio-group>
      )
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
      label: "上传接口",
      prop: "uploadURL",
      hide: formData.itemType !== ItemKey.upload,
      colProp: { span: 12 },
      slot: { label: ({ label }) => <Question label={label} tipMsg="仅对自动上传有效" /> },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="接口格式: /v1/list/test" clearable />
    },
    {
      label: "数量限制",
      prop: "limit",
      hide: formData.itemType !== ItemKey.upload,
      colProp: { span: 12 },
      render: ({ formModel, row }) => (
        <el-input-number v-model={formModel[row.prop]} min={0} placeholder="请输入" controls-position="right" clearable class="ui-w-100" />
      )
    },
    {
      label: "文件限制(M)",
      prop: "fileSize",
      hide: formData.itemType !== ItemKey.upload,
      colProp: { span: 12 },
      slot: { label: ({ label }) => <Question label={label} tipMsg="设置0不限制" /> },
      render: ({ formModel, row }) => (
        <el-input-number v-model={formModel[row.prop]} min={0} placeholder="默认不限制(选填)" controls-position="right" clearable class="ui-w-100" />
      )
    },
    {
      label: "图标大小",
      prop: "iconSize",
      hide: formData.itemType !== ItemKey.upload,
      colProp: { span: 12 },
      render: ({ formModel, row }) => (
        <el-input-number v-model={formModel[row.prop]} min={60} placeholder="请输入" controls-position="right" clearable class="ui-w-100" />
      )
    },
    {
      label: "拖拽上传",
      prop: "drag",
      hide: formData.itemType !== ItemKey.upload,
      colProp: { span: 12 },
      render: ({ formModel, row }) => (
        <el-radio-group v-model={formModel[row.prop]}>
          {boolOptions.map((item) => (
            <el-radio key={item.optionValue} label={item.optionValue}>
              {item.optionName}
            </el-radio>
          ))}
        </el-radio-group>
      )
    },
    {
      label: "文件列表",
      prop: "showFileList",
      hide: formData.itemType !== ItemKey.upload,
      colProp: { span: 12 },
      render: ({ formModel, row }) => (
        <el-radio-group v-model={formModel[row.prop]}>
          <el-radio label={true}>显示</el-radio>
          <el-radio label={false}>隐藏</el-radio>
        </el-radio-group>
      )
    },
    {
      label: "图标类型",
      prop: "listType",
      hide: formData.itemType !== ItemKey.upload,
      colProp: { span: 24 },
      render: ({ formModel, row }) => (
        <el-radio-group v-model={formModel[row.prop]}>
          <el-radio label="text">按钮</el-radio>
          <el-radio label="picture">图片</el-radio>
          <el-radio label="picture-card">图片卡片</el-radio>
        </el-radio-group>
      )
    },
    // ############### 文本域 ###############
    {
      label: "统计字数",
      prop: "showWordLimit",
      hide: formData.itemType !== ItemKey.textArea,
      colProp: { span: 12 },
      slot: { label: ({ label }) => <Question label={label} tipMsg="配合最小/最大长度使用" /> },
      render: ({ formModel, row }) => {
        return (
          <el-radio-group v-model={formModel[row.prop]}>
            {boolOptions.map((item) => (
              <el-radio key={item.optionValue} label={item.optionValue}>
                {item.optionName}
              </el-radio>
            ))}
          </el-radio-group>
        );
      }
    },
    {
      label: "默认行",
      prop: "rows",
      hide: ![ItemKey.textArea].includes(formData.itemType),
      colProp: { span: 12 },
      render: ({ formModel, row }) => (
        <el-input-number v-model={formModel[row.prop]} placeholder="请输入" min={1} controls-position="right" clearable class="ui-w-100" />
      )
    },
    {
      label: "最小行",
      prop: "minRows",
      hide: ![ItemKey.textArea].includes(formData.itemType),
      colProp: { span: 12 },
      render: ({ formModel, row }) => (
        <el-input-number v-model={formModel[row.prop]} placeholder="请输入" min={0} controls-position="right" clearable class="ui-w-100" />
      )
    },
    {
      label: "最大行",
      prop: "maxRows",
      hide: ![ItemKey.textArea].includes(formData.itemType),
      colProp: { span: 12 },
      render: ({ formModel, row }) => (
        <el-input-number v-model={formModel[row.prop]} placeholder="请输入" min={0} controls-position="right" clearable class="ui-w-100" />
      )
    },
    {
      label: "最小长度",
      prop: "minlength",
      hide: ![ItemKey.textArea].includes(formData.itemType),
      colProp: { span: 12 },
      render: ({ formModel, row }) => (
        <el-input-number v-model={formModel[row.prop]} placeholder="请输入" controls-position="right" clearable class="ui-w-100" />
      )
    },
    {
      label: "最大长度",
      prop: "maxlength",
      hide: ![ItemKey.textArea].includes(formData.itemType),
      colProp: { span: 12 },
      render: ({ formModel, row }) => (
        <el-input-number v-model={formModel[row.prop]} placeholder="请输入" controls-position="right" clearable class="ui-w-100" />
      )
    },
    {
      label: "缩放控制",
      prop: "resize",
      hide: ![ItemKey.textArea].includes(formData.itemType),
      colProp: { span: 12 },
      render: ({ formModel, row }) => (
        <el-select v-model={formModel[row.prop]} filterable placeholder="请选择" clearable class="ui-w-100">
          {resizeList.map((item) => (
            <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
          ))}
        </el-select>
      )
    },
    // ############### 穿梭框 ###############
    {
      label: "左标题",
      prop: "leftTitle",
      hide: formData.itemType !== ItemKey.transfer,
      colProp: { span: 12 },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="选填" clearable />
    },
    {
      label: "右标题",
      prop: "rightTitle",
      hide: formData.itemType !== ItemKey.transfer,
      colProp: { span: 12 },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="选填" clearable />
    },
    // ############### 样式 ###############
    {
      label: "类名",
      prop: "className",
      colProp: { span: 12 },
      hide: false,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="选填" clearable />
    },
    {
      label: "样式",
      prop: "style",
      colProp: { span: 12 },
      hide: false,
      slot: {
        label: ({ label }) => <Question label={label} tipMsg="扩展CSS原生样式(如: font-size: 14px; margin: 0px), 多个样式使用分号(;)隔开" />
      },
      render: ({ formModel, row }) => (
        <el-input
          type="textarea"
          v-model={formModel[row.prop]}
          autosize={{ minRows: 1, maxRows: 3 }}
          resize="none"
          placeholder="选填"
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
  function onChange(value) {
    onPlaceholderChange(value);
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
      labelWidth: "0px",
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
