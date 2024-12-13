/*
 * @Author: Hailen
 * @Date: 2024-03-19 16:12:48
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-12-02 10:07:09
 */

import { DictResultType, OptionKeys, getEnumDictList } from "@/utils/table";
import { FormColumnItemType, formColumnList, menuFormColumnList, tableGroupList } from "@/api/systemManage";
import type { FormItemRule, FormRules, UploadProps } from "element-plus";
import { Ref, reactive, ref } from "vue";
import { getUrlParameters, toParse } from "@/utils/common";

import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { RequestMethods } from "@/utils/http/types";
import { cloneDeep } from "@pureadmin/utils";
import { getApiData } from "@/api/routes";
import { message } from "@/utils/message";

/** 接口主机地址 */
const baseApi = import.meta.env.VITE_BASE_API;

/** 表单项类型 */
export enum ItemKey {
  /** 默认 */
  input = "input",
  /** 下拉框 */
  select = "select",
  /** 下拉框 */
  treeSelect = "treeSelect",
  /** 日期 */
  date = "date",
  /** 数字输入框 */
  inputNumber = "inputNumber",
  /** 上传 */
  upload = "upload",
  /** 开关 */
  switch = "switch",
  /** 单选框 */
  radio = "radio",
  /** 多选框 */
  checkbox = "checkbox"
}

// 格式化数据类型
export interface FormatDataType {
  // [key: string]: any;
  itemType?: string;
  editInput?: string;
  method?: RequestMethods;
  multiple?: boolean;
  layout?: number;
  clearable?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  placeholder: string;
  format?: string;
  apiURL?: string;
  accept?: string[];
  optionCode?: OptionKeys;
  style?: string;
  optionName: string;
  optionValue: string;
  uploadURL?: string;
  limit?: number;
  drag?: boolean;
  showFileList?: boolean;
  listType?: string;
  rules?: Array<FormItemRule>;
}

export type CustomPropsType = {
  /** 配置接口添加请求参数 */
  apiParams?: Record<string, any>;
  /** 处理包装接口返回数据 */
  formatAPI?: (data: any) => any;
  /** 自定义属性元素上属性和事件 */
  [key: string]: any;
};

/** 自定义合并类型 */
interface CustomMergeType {
  /** 自定义属性 */
  customProps?: {
    [key: string]: CustomPropsType;
  };
  /** 自定义元素(复杂输入框, 可从外部配置覆盖) */
  customElement?: { [key: string]: ({ formModel, row }) => JSXElement };
}

// 获取渲染表单组件类型
interface RenderComponentType extends CustomMergeType {
  column: FormColumnItemType;
  formatData: FormatDataType;
}

/**
 * 获取渲染表单组件
 * @param column 表单配置项
 * @param options 自定义属性、事件绑定
 * @param formatData 格式化配置
 */
export const renderComponent = ({ column, customProps = {}, formatData, customElement = {} }: RenderComponentType): ((...arg) => JSXElement) => {
  return ({ formModel, row }) => {
    const { formatAPI, apiParams, ...customObj } = customProps[row.prop] ?? {};
    const statusObj = formatData["editInput"] ? { [formatData["editInput"]]: true } : {}; // 输入框输入状态
    const property = { ...formatData, ...customObj, ...statusObj };
    const NoData = <el-input placeholder="暂无数据" disabled />;

    // 上传获取文件名
    let handleAvatarSuccess: UploadProps["onSuccess"] = undefined;
    let beforeAvatarUpload: UploadProps["beforeUpload"] = undefined;
    if (column.itemType === ItemKey.upload) {
      handleAvatarSuccess = (response) => {
        formModel[row.prop] = response.data;
      };
      beforeAvatarUpload = (rawFile) => {
        formModel[row.prop] = rawFile.name;
        const ext = rawFile.type.split("/")[1];
        if (!formatData.accept.includes(`.${ext}`)) {
          message.error("文件格式不正确!");
          return false;
        }
        return true;
      };
    }
    const dynamicRender = (Comp: JSXElement) => {
      return column.dataOption?.length ? Comp : NoData;
    };

    // 数据字段
    const sLabel = formatData.optionName || "optionName";
    const sValue = formatData.optionValue || "optionValue";

    const CompObj = {
      // 输入框
      [ItemKey.input]: <el-input v-model={formModel[row.prop]} placeholder="请输入" {...property} />,
      // 输入框(数字)
      [ItemKey.inputNumber]: <el-input-number v-model={formModel[row.prop]} placeholder="请输入" controls-position="right" {...property} style="width: 100%" />,
      // 下拉框
      [ItemKey.select]: dynamicRender(
        <el-select
          v-model={formModel[row.prop]}
          style="width: 100%"
          placeholder="请选择"
          filterable
          value-key="id"
          collapse-tags
          collapse-tags-tooltip
          {...property}
        >
          {column.dataOption?.map((item) => {
            return <el-option key={item[sValue]} label={item[sLabel]} value={item[sValue]} />;
          })}
        </el-select>
      ),
      // 树形下拉框
      [ItemKey.treeSelect]: dynamicRender(
        <el-tree-select
          v-model={formModel[row.prop]}
          check-strictly={true}
          check-on-click-node
          data={column.dataOption}
          render-after-expand={false}
          style="width: 100%"
          props={{ label: sLabel, value: sValue }}
          {...property}
        />
      ),
      // 开关
      [ItemKey.switch]: <el-switch v-model={formModel[row.prop]} {...property} />,
      // 日期
      [ItemKey.date]: (
        <el-date-picker
          v-model={formModel[row.prop]}
          placeholder="请选择"
          clearable
          style="width: 100%"
          {...property}
          format={property.format ?? "YYYY-MM-DD"}
          value-format={property.format ?? "YYYY-MM-DD"}
        />
      ),
      // 上传
      [ItemKey.upload]: (
        <el-upload
          class="ml-4"
          show-file-list={false}
          action={baseApi + property.uploadURL}
          on-success={handleAvatarSuccess}
          before-upload={beforeAvatarUpload}
          {...property}
        >
          <el-button type="primary">选择文件</el-button>
        </el-upload>
      ),
      // 单选
      [ItemKey.radio]: dynamicRender(
        <el-radio-group v-model={formModel[row.prop]} {...property}>
          {column.dataOption?.map((item) => (
            <el-radio key={item[sValue]} label={item[sLabel]}>
              {item[sValue]}
            </el-radio>
          ))}
        </el-radio-group>
      ),
      // 多选
      [ItemKey.checkbox]: dynamicRender(
        <el-checkbox-group v-model={formModel[row.prop]} {...property}>
          {column.dataOption?.map((item) => (
            <el-checkbox key={item[sValue]} label={item[sLabel]} value={item[sValue]} />
          ))}
        </el-checkbox-group>
      )
    };
    // 使用外部自定义元素
    if (customElement[column.prop]) {
      return customElement[column.prop]({ formModel, row });
    }
    return CompObj[column.itemType] || NoData;
  };
};

/** 表单配置参数类型 */
export interface FormConfigParamType extends CustomMergeType {
  /** 加载状态 */
  loading?: Ref<boolean>;
  /** 表单配置列表 */
  columnList: FormColumnItemType[];
  /** 菜单id */
  menuId?: number;
  /** 分组编码 */
  groupCode?: string;
  /** 自定义表单名称插槽(key为字段名) */
  slots?: { [key: string]: (...arg) => JSXElement };
}

/** 配置返回类型 */
export interface FormConfigReturnType {
  formData: Record<string, any>;
  formRules: FormRules;
  formColumns: FormConfigItemType[];
}

/**
 * 获取配表单配置
 * @param param.loading 下拉框所有请求loading
 * @param param.columnList 表单配置项目列表
 * @param param.slots 自定义表单名称插槽
 * @param param.customProps 自定义输入框属性或事件: { username: { class: 'xxx', onClick: ()=>{} }}
 * @param param.customElement 自定义输入框元素: { username: <div>xxx</div> }
 */
export const getFormConfigs = (options: FormConfigParamType): FormConfigReturnType => {
  let { columnList } = options;
  const { customProps = {}, customElement = {}, slots = {}, loading = ref(false) } = options;
  const formRules = reactive<FormRules>({});

  if (!columnList.length) return { formData: {}, formColumns: [], formRules: {} };
  columnList = reactive<FormColumnItemType[]>(cloneDeep(columnList));
  const apiCount: number[] = []; // 记录请求数量
  const formData = {};

  function resultFn() {
    apiCount.pop();
    if (apiCount.length === 0) {
      loading.value = false;
    }
  }

  // 获取所有枚举下拉数据
  function getDictData(columnList: FormColumnItemType[]) {
    columnList.forEach((column) => {
      const valueFomat: FormatDataType = toParse(column.valueFormat);
      if (valueFomat.rules) {
        valueFomat.rules.forEach((item) => {
          if (item.pattern) {
            const pattern = item.pattern.toString().slice(1, -1);
            item.pattern = new RegExp(pattern);
          }
        });
        // 如果配置表单校验就添加
        formRules[column.prop] = valueFomat.rules;
      }
      if (valueFomat.optionCode) {
        // 枚举字典获取选择列表
        loading.value = true;
        apiCount.push(1);
        getEnumDictList([valueFomat.optionCode])
          .then((data: any) => (column.dataOption = data[valueFomat.optionCode]))
          .finally(resultFn);
      } else if (valueFomat.apiURL) {
        // 自定义接口获取选择列表
        loading.value = true;
        apiCount.push(1);
        const itemProp = customProps[column.prop] as CustomPropsType;
        getApiData(valueFomat.method, valueFomat.apiURL, itemProp?.apiParams)
          .then(({ data }) => {
            const resultData = itemProp?.formatAPI ? itemProp.formatAPI(data) : data;
            column.dataOption = resultData;
          })
          .finally(resultFn);
      }
      // === 多选项返回数组 ===
      const field = column.prop;
      formData[field] = "";
      if (ItemKey.checkbox === column.itemType || valueFomat.multiple) {
        formData[field] = [];
      }
    });
  }
  getDictData(columnList);

  const formColumns = columnList.map((column) => {
    const { label, prop, valueFormat, ...reset } = column;
    const { layout, ...formatData } = toParse(valueFormat) as FormatDataType;
    const _render = renderComponent({ column, customProps, formatData, customElement });
    const _slots = column.slots && slots[prop] ? { label: slots[prop] } : undefined;
    return { ...reset, label, prop, render: _render, slots: _slots, colProp: { span: layout || 12 } };
  });
  return { formData, formColumns, formRules };
};

/**
 * 获取表单配置项
 */
export const getFormColumns = async (options: Omit<FormConfigParamType, "columnList"> = {}): Promise<FormConfigReturnType> => {
  return new Promise<any>((resolve) => {
    let { menuId } = getUrlParameters();
    const { menuId: _menuId, ...option } = options;
    if (_menuId) menuId = _menuId;
    if (!menuId) throw new Error("菜单id不存在");

    tableGroupList({ menuId }).then(({ data }) => {
      const group = data.find((item) => item.groupCode === option.groupCode);
      if (!group?.id) {
        message.error("表格分组未配置, 请到菜单管理中添加分组");
        return resolve([]);
      }
      menuFormColumnList({ menuId, columnGroupId: group.id }, { headers: { hideLoading: true } })
        .then(({ data }) => {
          const { sysMenuFormItemVO } = data?.[0] || { sysMenuFormItemVO: [] };
          if (!sysMenuFormItemVO.length) {
            message.error("配置列表为空");
            return resolve([]);
          }
          const res = getFormConfigs({ columnList: sysMenuFormItemVO, ...option });
          resolve(res);
        })
        .catch(() => resolve([]));
    });
  });
};
