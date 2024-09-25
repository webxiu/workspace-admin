/*
 * @Author: Hailen
 * @Date: 2024-03-15 16:49:20
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-08-12 18:32:25
 */

import { FormatKey, OptionsType } from "@/utils/table";
import { Ref, reactive, ref } from "vue";

import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import { Question } from "@/config/elements";
import regExp from "@/utils/regExp";

//======================= 表格配置 =======================

// 对齐
export const alignList: OptionsType[] = [
  { optionName: "默认", optionValue: undefined },
  { optionName: "居左", optionValue: "left" },
  { optionName: "居中", optionValue: "center" },
  { optionName: "居右", optionValue: "right" }
];
// 排序
export const sortList: OptionsType[] = [
  { optionName: "显示", optionValue: true },
  { optionName: "不显示", optionValue: false }
];
// 隐藏
export const hideList: OptionsType[] = [
  { optionName: "是", optionValue: true },
  { optionName: "否", optionValue: false }
];
// Excel隐藏
export const excelHideList: OptionsType[] = [
  { optionName: "是", optionValue: 1 },
  { optionName: "否", optionValue: 0 }
];
// layui导出时间格式
export const formatList: OptionsType[] = [
  { optionName: "默认", optionValue: undefined },
  { optionName: "yyyy-MM", optionValue: "yyyy-MM" },
  { optionName: "yyyy-MM-dd", optionValue: "yyyy-MM-dd" },
  { optionName: "yyyy-MM-dd HH:mm:ss", optionValue: "yyyy-MM-dd HH:mm:ss" }
];
// 获取对齐方式
export const getAlign = (exclude = []) => {
  return alignList.filter((item) => !exclude.includes(item.optionValue));
};

// 获取排序选项
export const getSlot = (data) => {
  return [
    { optionName: "默认", optionValue: undefined },
    { optionName: "启用", optionValue: data.row.prop },
    { optionName: "关闭", optionValue: false }
  ];
};

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

//======================= 添加分组弹窗 =======================

export const formGroupRules = reactive<FormRules>({
  groupName: [{ required: true, message: "请输入分组名称", trigger: "blur" }],
  groupCode: [
    { required: true, message: "请输入分组编号", trigger: "blur" },
    { message: "输入格式错误", trigger: "blur", pattern: regExp.quantity }
  ]
});
export const formGroupConfigs = (): FormConfigItemType[] => {
  return [
    {
      label: "创建人",
      prop: "createUserName",
      colProp: { span: 12 },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="创建人" disabled />
    },
    {
      label: "创建时间",
      prop: "createDate",
      colProp: { span: 12 },
      render: ({ formModel, row }) => <el-date-picker v-model={formModel[row.prop]} type="date" valueFormat="YYYY-MM-DD" disabled />
    },
    {
      label: "最后修改人",
      prop: "modifyUserName",
      colProp: { span: 12 },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} disabled />
    },
    {
      label: "修改时间",
      prop: "modifyDate",
      colProp: { span: 12 },
      render: ({ formModel, row }) => <el-date-picker v-model={formModel[row.prop]} type="date" valueFormat="YYYY-MM-DD" disabled />
    },
    {
      label: "分组名称",
      prop: "groupName",
      colProp: { span: 12 },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "分组编号",
      prop: "groupCode",
      colProp: { span: 12 },
      slots: {
        label: () => (
          <span>
            分组编号
            <el-tooltip placement="top" content="分组编号最小的为主表格(默认表格), 其余表格按顺序对应">
              <Question />
            </el-tooltip>
          </span>
        )
      },
      render: ({ formModel, row }) => (
        <el-input-number v-model={formModel[row.prop]} min={1} max={100} controls-position="right" placeholder="请输入分组编号" style="width: 100%" />
      )
    },
    {
      label: "备注",
      prop: "remark",
      colProp: { span: 12 },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    }
  ];
};

export const formConfigs = (type = "table"): FormConfigItemType[] => {
  const name = type === "table" ? `表名${SplitChar}字段` : `名称${SplitChar}字段`;
  const label = type === "table" ? `(表名${SplitChar}字段)` : `(名称${SplitChar}字段)`;
  const placeholder = `输入格式使用${SplitChar}号隔开:
${name}
${name}
${name}.子字段
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

export const formRules2 = reactive<FormRules>({
  type: [{ required: true, message: "请选择格式化方式", trigger: "blur" }],
  date: [{ required: true, message: "请选择日期类型", trigger: "blur" }],
  decimal: [{ required: true, message: "请选择小数位", trigger: "blur" }]
});

/** 格式化类型 */
export const typeOptions = [
  { optionName: "默认", optionValue: FormatKey.default },
  { optionName: "数字", optionValue: FormatKey.number },
  { optionName: "日期", optionValue: FormatKey.date },
  { optionName: "标签", optionValue: FormatKey.tag }
];
/** 日期类型 */
export const dateOptions = [
  { optionName: "年月日+时分秒", optionValue: "YYYY-MM-DD HH:mm:ss" },
  { optionName: "年月日", optionValue: "YYYY-MM-DD" },
  { optionName: "年月", optionValue: "YYYY-MM" }
];

/** 颜色选择器默认颜色 */
export const predefineColors = [
  "#ffffff",
  "#303133",
  "#2200aa",
  "#0000FF",
  "#1e90ff",
  "#409eff",
  "#73A3F5",
  "#f590e4",
  "#c71585",
  "#dc143c",
  "#F53145",
  "#FF0000",
  "#ff6600",
  "#ff8c00",
  "#e6a23c",
  "#ffc107",
  "#F5F31B",
  "#bbff00",
  "#00FF00",
  "#90ee90",
  "#00dd00",
  "#67c23a",
  "#008800",
  "#227700",
  "#009688",
  "#909399",
  "#00ced1",
  "#ccddff",
  "#ffcccc",
  "#F59DC3",
  "#f56c6c",
  "#d2691e",
  "#F59773",
  "#F5D273",
  "#770077",
  "#8c0044",
  "hsv(51, 100, 98)",
  "rgba(255, 69, 0, 0.68)",
  "hsva(120, 40, 94, 0.5)",
  "hsla(209, 100%, 56%, 0.73)"
];

// 表单配置
export const formConfigs2 = ({ formData, addSpecs }): Ref<FormConfigItemType[]> => {
  const configFn = (): FormConfigItemType[] => [
    {
      label: "格式化类型",
      prop: "type",
      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择" onChange={onChange}>
            {typeOptions.map((item) => (
              <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
            ))}
          </el-select>
        );
      }
    },
    // 换行
    { label: "", prop: "", colProp: { span: 24 }, labelWidth: "0px", style: { margin: "0" }, render: () => null },

    // ############### 日期 ###############
    {
      label: "日期类型",
      prop: "date",
      hide: formData.type !== FormatKey.date,
      colProp: { span: 18 },
      slots: {
        label: () => (
          <span>
            日期类型
            <el-tooltip placement="top" content="数据必须是时间格式(时间戳、日期字符串)">
              <Question />
            </el-tooltip>
          </span>
        )
      },
      render: ({ formModel, row }) => (
        <el-radio-group v-model={formModel[row.prop]}>
          {dateOptions.map((item) => (
            <el-radio key={item.optionValue} label={item.optionValue} border>
              {item.optionName}
            </el-radio>
          ))}
        </el-radio-group>
      )
    },

    // ############### 金额 ###############

    {
      label: "小数位",
      prop: "decimal",
      hide: formData.type !== FormatKey.number,
      colProp: { span: 8 },
      render: ({ formModel, row }) => (
        <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
          {[0, 1, 2, 3].map((item) => (
            <el-option key={item} label={item} value={item} />
          ))}
        </el-select>
      )
    },
    {
      label: "千分位",
      prop: "thousand",
      hide: formData.type !== FormatKey.number,
      colProp: { span: 6 },
      render: ({ formModel, row }) => <el-checkbox v-model={formModel[row.prop]} value="thousand" border />
    },
    {
      label: "金额符号",
      prop: "symbol",
      hide: formData.type !== FormatKey.number,
      colProp: { span: 7 },
      render: ({ formModel, row }) => (
        <el-select v-model={formModel[row.prop]} class="ui-w-100" clearable placeholder="请选择">
          {["￥", "$"].map((item) => (
            <el-option key={item} label={item} value={item} />
          ))}
        </el-select>
      )
    },

    // ############### 标签 ###############
    {
      label: "上下边距",
      prop: "paddingV",
      hide: formData.type !== FormatKey.tag,
      colProp: { span: 6 },
      labelWidth: "100px",
      render: ({ formModel, row }) => (
        <el-input-number v-model={formModel[row.prop]} min={0} max={20} placeholder="请输入" style="width: 100px" controls-position="right" />
      )
    },
    {
      label: "左右边距",
      prop: "paddingH",
      hide: formData.type !== FormatKey.tag,
      colProp: { span: 6 },
      labelWidth: "80px",
      render: ({ formModel, row }) => (
        <el-input-number v-model={formModel[row.prop]} min={0} max={20} placeholder="请输入" style="width: 100px" controls-position="right" />
      )
    },
    {
      label: "圆角",
      prop: "borderRadius",
      hide: formData.type !== FormatKey.tag,
      colProp: { span: 6 },
      labelWidth: "60px",
      render: ({ formModel, row }) => (
        <el-input-number v-model={formModel[row.prop]} min={0} max={50} placeholder="请输入" style="width: 100px" controls-position="right" />
      )
    },
    {
      label: "样式",
      prop: "style",
      hide: formData.type !== FormatKey.tag,
      colProp: { span: 6 },
      labelWidth: "60px",
      slots: {
        label: () => (
          <el-tooltip placement="top" content="扩展CSS原生样式(如: font-size: 14px; margin: 0px), 多个样式使用分号(;)隔开">
            <span>
              <span>样式</span>
              <Question />
            </span>
          </el-tooltip>
        )
      },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入(选填)" style="width: 120px" controls-position="right" />
    },
    // 换行
    { label: "", prop: "", colProp: { span: 24 }, labelWidth: "0px", style: { margin: "0" }, render: () => null },
    { label: "标签状态", prop: "specs", hide: formData.type !== FormatKey.tag, colProp: { span: 24 }, render: () => null },
    {
      label: "",
      prop: "",
      colProp: { span: 24 },
      hide: formData.type !== FormatKey.tag,
      render: () => (
        <el-button onClick={addSpecs} type="primary" icon={Plus}>
          新增一条
        </el-button>
      )
    }
  ];

  const newConf = ref(configFn());
  function onChange() {
    newConf.value = configFn();
  }
  return newConf;
};

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
