/*
 * @Author: Hailen
 * @Date: 2024-03-19 16:12:48
 * @Last Modified by: Hailen
 * @Last Modified time: 2025-03-17 17:45:53
 */

import type { ButtonProps, FormItemRule, FormProps, FormRules, TableProps, UploadProps } from "element-plus";
import { ColumnOptionType, OptionKeys, RendererType, getColumnData, getEnumDictList, setColumn } from "@/utils/table";
import { FormColumnItemType, menuFormColumnList, tableGroupList } from "@/api/systemManage";
import { FormConfigItemListType, FormConfigItemType } from "@/components/EditForm/index.vue";
import { LoadingIcon, Question } from "@/config/elements";
import { Ref, computed, reactive, ref } from "vue";
import { getApiData, getMenuIdByURL } from "@/api/routes";
import { getUrlParameters, nullToUdefined, resetData, toParse } from "@/utils/common";

import { ButtonListProps } from "@/components/ButtonList/index.vue";
import { FormType } from "@/views/system/basic/menu/formColumn/utils/config";
import HxUploadButton from "@/components/HxUploadButton/index.vue";
import { RequestMethods } from "@/utils/http/types";
import { cloneDeep } from "@pureadmin/utils";
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
  /** 时间 */
  dateTime = "dateTime",
  /** 数字输入框 */
  inputNumber = "inputNumber",
  /** 上传 */
  upload = "upload",
  /** 开关 */
  switch = "switch",
  /** 单选框 */
  radio = "radio",
  /** 多选框 */
  checkbox = "checkbox",
  /** 文本域 */
  textArea = "textArea",
  /** 穿梭框 */
  transfer = "transfer",
  /** 空元素 */
  empty = "empty"
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
  size?: string;
  disabled?: boolean;
  readonly?: boolean;
  placeholder: string;
  defaultValue: string;
  dateFormat?: string;
  dateTime?: string;
  isRange?: boolean;
  apiURL?: string;
  accept?: string[];
  enumKey?: OptionKeys;
  style?: string;
  optionName: string;
  optionValue: string;
  uploadURL?: string;
  limit?: number;
  fileSize?: number;
  autoUpload?: boolean;
  drag?: boolean;
  showFileList?: boolean;
  listType?: string;
  iconSize?: number;
  rules?: Array<FormItemRule>;
  filterable?: boolean;
  collapseTags?: boolean;
  maxCollapseTags?: number;
  collapseTagsTooltip?: boolean;
  rows?: number;
  autosize?: { minRows: number; maxRows: number } | false;
  minRows?: number;
  maxRows?: number;
  titles?: string[];
  leftTitle?: string;
  rightTitle?: string;
  props?: { label: string; key: string };
  filterPlaceholder?: string;
  labelMsg?: string; // 名称提示
  valueType?: string; // 名称提示
}

export type CustomPropsType = {
  /** 为接口添加默认参数 */
  apiParams?: Record<string, any>;
  /** 接口返回数据格式化 */
  formatAPI?: (data: any) => any;
  /** 需要依赖当前字段值作为请求参数的字段(onChange事件执行时, 重新加载apiField所配置字段的接口) */
  apiFields?: string[];
  /** 指定请求参数字段名 */
  paramField?: string;
  /** 自定义属性元素上属性和事件 */
  [key: string]: any;
};

/** 表单配置 - 表单配置列表类型 */
export interface FormItemConfigType {
  /** 表单数据 */
  formData?: Record<string, any>;
  /** 表单验证 */
  formRules?: FormRules;
  /** 表单属性 */
  formProps?: Partial<FormProps>;
  /** 自定义属性 (key为字段名, 值为表单输入框的属性) */
  customProps?: { [key: string]: CustomPropsType };
  /** 自定义元素(key为字段名, 复杂输入框可从外部配置) */
  customElement?: { [key: string]: ({ formModel, row }) => JSXElement };
  /** 自定义列配置(key为字段名, , 值为EditForm组件的formConfigs配置)*/
  customColumn?: { [key: string]: Partial<FormConfigItemType> };
  /** 自定义下拉数据 (对象key为字段名, 值为下拉数据列表) */
  dataOption?: { [key: string]: Record<string, any>[] };
  /** 表单配置数据获取完毕回调 */
  callback?: (val: { columnList: Ref<FormConfigItemType[]>; formRules: FormRules; groupCode: string }) => void;
  /** 自定义按钮类型 */
  buttonConfig?: ButtonListProps;
  /** 表格头部 */
  header?: () => JSXElement;
  /** 表格尾部 */
  footer?: () => JSXElement;
}

/** 表单配置 - 表格配置列表类型 */
export interface FormTableConfigType {
  /** 表格数据 */
  dataList: Recordable<any>;
  /** 自定义渲染 */
  custmRender?: Record<string, RendererType>;
  /** 自定义按钮 */
  buttonConfig?: ButtonListProps;
  /** 表格属性 */
  tableProps?: Omit<TableProps<any>, "data"> & {
    onSelect?: ((...args: any[]) => any) | undefined;
    onExpandChange?: ((...args: any[]) => any) | undefined;
    onCurrentChange?: ((...args: any[]) => any) | undefined;
    onSelectAll?: ((...args: any[]) => any) | undefined;
    onSelectionChange?: ((...args: any[]) => any) | undefined;
    onCellMouseEnter?: ((...args: any[]) => any) | undefined;
    onCellMouseLeave?: ((...args: any[]) => any) | undefined;
    onCellContextmenu?: ((...args: any[]) => any) | undefined;
    onCellClick?: ((...args: any[]) => any) | undefined;
    onCellDblclick?: ((...args: any[]) => any) | undefined;
    onRowClick?: ((...args: any[]) => any) | undefined;
    onRowContextmenu?: ((...args: any[]) => any) | undefined;
    onRowDblclick?: ((...args: any[]) => any) | undefined;
    onHeaderClick?: ((...args: any[]) => any) | undefined;
    onHeaderContextmenu?: ((...args: any[]) => any) | undefined;
    onSortChange?: ((...args: any[]) => any) | undefined;
    onFilterChange?: ((...args: any[]) => any) | undefined;
    onHeaderDragend?: ((...args: any[]) => any) | undefined;
  };
  /** 表格配置option */
  tableColumnOption?: Partial<ColumnOptionType> & { callback?: (v: any) => void };
  /** 表格插槽 */
  tableSlots?: { [key: string]: (...arg) => JSXElement };
  /** 表格头部 */
  header?: () => JSXElement;
  /** 表格尾部 */
  footer?: () => JSXElement;
}

// 定义按钮配置类型
interface CustomButtonType extends Partial<ButtonProps> {
  /** 按钮名称 */
  name: string;
  /** 按钮点击事件 */
  onClick?: (event: MouseEvent) => void;
}

/** 表单配置请求参数类型 */
export interface FormConfigParams {
  /** 菜单id */
  menuId?: number;
  /** 分组编码 */
  groupCode?: string;
  /** 页面url(用于获取菜单id) */
  pageUrl?: string;
}

export interface FormColumnGroupType {
  /** 表单类型 */
  buttonType: ButtonKeyType;
  /** 菜单(menuId): 默认从url中获取, 分组编号(groupCode)不传默认为: 1(表单) */
  params: FormConfigParams;
  /** 按表单顺序依次配置 */
  formConfig: FormItemConfigType[];
  /** 按表格顺序依次配置 */
  tableConfig?: FormTableConfigType[];
}

/**
 * 获取表单配置项
 */
export const getFormColumns = async (options: FormColumnGroupType) => {
  return new Promise<Array<FormTableGroupConfigItemType>>(async (resolve, reject) => {
    let { menuId } = getUrlParameters();
    const { buttonType, params = {}, formConfig = [], tableConfig = [] } = options;
    const { menuId: _menuId, groupCode = FormType.form, pageUrl } = params;
    if (_menuId) menuId = _menuId;
    if (pageUrl) {
      const result = await getMenuIdByURL({ webRouter: pageUrl });
      if (result.data) menuId = result.data; // 根据路由获取菜单id
    }
    if (!menuId) throw new Error("菜单id不存在");

    tableGroupList({ menuId }).then(({ data }) => {
      const group = data.find((item) => item.groupCode === groupCode);
      if (!group?.id) {
        message.error("表格分组未配置, 请到菜单管理表格配置中添加");
        return reject(false);
      }
      menuFormColumnList({ menuId, columnGroupId: group.id })
        .then((res) => {
          const data = res.data.filter((item) => (item.buttonType ? item.buttonType?.includes(buttonType) : true));
          if (Array.isArray(data) && !data.length) {
            message.error("配置列表为空");
            return reject(false);
          }
          // 表格和表单分类(方便按顺序获取表格和表单自定义配置)
          const forms = data.filter((item) => item.groupType === FormType.form);
          const tables = data.filter((item) => item.groupType === FormType.table);
          const result = data.map((item) => {
            const { sysMenuFormItemVO = [], ...formReset } = item;
            const isForm = item.groupType === FormType.form;
            if (isForm) {
              // 按序获取表单索引配置
              const formIndex = forms.findIndex((f) => f.formGroupId === item.formGroupId);
              const _formConfig = formConfig[formIndex] || ({} as FormItemConfigType);
              const columnList = sysMenuFormItemVO.map(({ className, ...reset }) => ({ ...reset }));
              const form = getFormConfigs(columnList, _formConfig, { menuId, groupCode });
              return { ...formReset, form, table: [] } as FormTableGroupConfigItemType;
            } else {
              // 按序获取表格索引配置
              const tableIndex = tables.findIndex((f) => f.formGroupId === item.formGroupId);
              const _tableConfig = tableConfig[tableIndex];
              const custmRender = _tableConfig?.custmRender || {};
              const columnList = sysMenuFormItemVO.map((item) => {
                nullToUdefined(item);
                item.cellRenderer = custmRender?.[item.prop];
                return item;
              });
              const { columnData } = getColumnData(columnList);
              const _tableOption = _tableConfig.tableColumnOption || {};
              const _callback = _tableOption?.callback || (() => {});
              Reflect.deleteProperty(_tableOption, "callback");
              return {
                ...formReset,
                form: {} as FormConfigReturnType,
                table: setColumn({ columnData, ..._tableOption }, _callback)
              } as FormTableGroupConfigItemType;
            }
          });
          resolve(result);
        })
        .catch((error) => {
          console.log("error", error);
          reject(false);
        });
    });
  });
};

/** 表单配置类型 */
export interface FormConfigReturnType {
  formData: Record<string, any>;
  formRules: FormRules;
  formColumns: FormConfigItemListType;
}

/** 表单与表格配置类型 */
export interface FormTableGroupConfigItemType {
  formGroupName: string;
  formGroupId: string;
  groupType: string;
  layoutPattern: string;
  buttonType: ButtonKeyType;
  table: TableColumnList[];
  form: FormConfigReturnType;
}

/**
 * 菜单管理: 表单配置
 * @param param.columnList 表单配置项目列表
 * @param param.slot 自定义表单名称插槽
 * @param param.customProps 自定义输入框属性或事件: { username: { class: 'xxx', onClick: ()=>{} }}
 * @param param.customElement 自定义输入框元素: { username: <div>xxx</div> }
 */
export const getFormConfigs = (columnList: FormColumnItemType[], options?: FormItemConfigType, params?: FormConfigParams): FormConfigReturnType => {
  const { groupCode } = params || {};
  const { formData, formRules: _formRules, customProps = {}, customElement = {}, customColumn = {}, dataOption = {}, callback = (val) => {} } = options || {};
  if (!columnList.length) return { formData: formData, formColumns: [], formRules: {} };
  const formRules = reactive<FormRules>({});
  const loading = ref(false); // loading未对外暴露
  const apiCount: number[] = []; // 记录请求数量
  const CacheCustomAPI = reactive<Recordable<CustomPropsType>>({}); // 缓存自定义接口数据
  columnList = reactive<FormColumnItemType[]>(cloneDeep(columnList));
  const formColumns = ref<FormConfigItemType[]>([]);
  const _formData = {};

  function resultFn() {
    apiCount.pop();
    if (apiCount.length === 0) {
      loading.value = false;
    }
  }
  // 处理接口数据请求
  function getDictData(columnList: FormColumnItemType[]) {
    columnList.forEach((column) => {
      const _formatType = toParse(column.formatType || "{}");
      column.formatType = _formatType;
      const { rules, method, apiURL, multiple } = column.formatType as FormatDataType;
      // 1.添加表单验证
      if (rules) {
        rules.forEach((item) => {
          if (item.pattern) {
            const pattern = item.pattern.toString().slice(1, -1);
            item.pattern = new RegExp(pattern);
          }
        });
        formRules[column.prop] = rules;
      }
      // 2.获取自定义接口列表
      column.dataOption = dataOption[column.prop]; // 外部传入数据, 如果有接口请求会覆盖
      if (apiURL && !customElement[column.prop]) {
        loading.value = true;
        apiCount.push(1);
        const itemProp = (customProps[column.prop] || {}) as CustomPropsType;
        getApiData(method, apiURL, itemProp.apiParams)
          .then(({ data }) => {
            const resultData = itemProp.formatAPI ? itemProp.formatAPI(data) : data;
            column.dataOption = resultData;
          })
          .finally(resultFn);
        // 3.按字段缓存接口数据(用于二次请求)
        CacheCustomAPI[column.prop] = { method, apiURL, ...itemProp };
      }
      if (!column.hide) _formData[column.prop] = "";
      // 4.多选项返回数组
      if (ItemKey.checkbox === column.itemType || multiple) {
        if (formData && !formData?.[column.prop]) formData[column.prop] = [];
        _formData[column.prop] = [];
      }
    });

    // 5.获取所有枚举字典列表
    const enumKeys = columnList.map((column) => column.formatType.enumKey).filter(Boolean);
    if (enumKeys?.length) {
      loading.value = true;
      apiCount.push(1);
      getEnumDictList([...new Set(enumKeys)])
        .then((data) => {
          columnList.forEach((col) => {
            const { enumKey } = col.formatType as FormatDataType;
            if (data[enumKey]) col.dataOption = data[enumKey];
          });
        })
        .finally(resultFn);
    }
  }
  getDictData(columnList);
  formColumns.value = columnList.map((column) => {
    const { label, prop, formatType, ...reset } = column;
    const { layout, labelMsg, ...formatData } = formatType as FormatDataType;
    const itemProp: CustomPropsType = customProps[column.prop] || {};
    const itemColumn = customColumn[column.prop] || {};
    // 6.拦截onChange事件(对配置apiField字段的下拉框数据更新请求)
    const _onChange = (value, isFirstReload = false) => {
      if (value === undefined) return;
      // 首次加载不回调到外部, 但可以更新其他字段接口请求
      if (!isFirstReload && itemProp?.onChange) itemProp.onChange(value, formColumns);
      const apiFields = itemProp?.apiFields;
      if (apiFields?.length) {
        columnList.forEach((col) => {
          if (apiFields.includes(col.prop) && CacheCustomAPI[col.prop]) {
            const { method, apiURL, apiParams, paramField } = CacheCustomAPI[col.prop];
            if (!isFirstReload) resetData(formData, col.prop);
            apiCount.push(1);
            col.loading = true;
            loading.value = true;
            getApiData(method, apiURL, { ...apiParams, [paramField || prop]: value })
              .then(({ data }) => {
                const itemProp = customProps[col.prop] as CustomPropsType;
                const resultData = itemProp?.formatAPI ? itemProp.formatAPI(data) : data;
                col.dataOption = resultData;
                col.loading = false;
              })
              .catch(() => (col.loading = false))
              .finally(resultFn);
          }
        });
      }
    };
    if (itemProp.apiFields?.length) {
      const { paramField } = CacheCustomAPI[column.prop] || {};
      _onChange(formData[paramField || column.prop], true);
    }
    // 7.自定义label
    const confLabel = ({ label }) => <Question label={label} tipMsg={labelMsg} />;
    const defaultLabel = ({ label }) => <span class="fw-700">{label}</span>;

    // 插槽优先级: 配置字段说明(labelMsg) => 配置column.slot => 默认
    const slotValue = column.slot === "false" ? false : column.slot;
    const _slot = labelMsg ? { label: confLabel } : slotValue ? itemColumn.slot : { label: defaultLabel };
    const _customProps = { ...customProps, [prop]: { ...itemProp, onChange: _onChange } };
    const _render = renderComponent({ column, customProps: _customProps, formatData, customElement });
    return { ...reset, label, prop, render: _render, colProp: { span: layout || 12 }, ...itemColumn, slot: _slot };
  });

  Object.assign(formRules, _formRules);
  Promise.resolve().then(() => callback({ columnList: formColumns, formRules, groupCode }));
  return { formData: formData || _formData, formColumns, formRules };
};

// 获取渲染表单组件类型
interface RenderComponentType extends Pick<FormItemConfigType, "customProps" | "customElement"> {
  column: FormColumnItemType;
  formatData: FormatDataType;
}

/**
 * 获取渲染表单组件
 * @param column 表单配置项
 * @param options 自定义属性、事件绑定
 * @param formatData 格式化配置
 */
export const renderComponent = ({ column, formatData, customProps = {}, customElement = {} }: RenderComponentType): ((...arg) => JSXElement) => {
  return ({ formModel, row }) => {
    const { formatAPI, apiParams, ...customObj } = customProps[row.prop] ?? {};
    const statusObj = formatData["editInput"] ? { [formatData["editInput"]]: true } : {}; // 输入框输入状态
    const { accept, valueType, ...property } = { ...formatData, ...customObj, ...statusObj };

    // 上传获取文件名
    const onSuccess: UploadProps["onSuccess"] = (response) => {
      if (column.itemType === ItemKey.upload) {
        formModel[row.prop] = response.data;
      }
    };
    // 自动上传文件类型校验
    const onBeforeUpload: UploadProps["beforeUpload"] = (rawFile) => {
      if (column.itemType === ItemKey.upload) {
        formModel[row.prop] = rawFile.name;
        const ext = rawFile.name.split(".")[1];
        if (!formatData.accept.includes(`.${ext}`)) {
          message.error("文件格式不正确!");
          return false;
        }
        return true;
      }
    };

    // 数据字段
    const sLabel = formatData.optionName || "optionName";
    const sValue = formatData.optionValue || "optionValue";

    // 无数据时使用配置默认值
    const defValue = computed({
      get: () => {
        const value = formModel[row.prop] ?? formatData.defaultValue;
        if ([null, undefined].includes(value)) return value;
        if (valueType) {
          if (valueType === "string") return value.toString();
          if (["number", "boolean"].includes(valueType)) {
            try {
              return JSON.parse(value);
            } catch (error) {}
          }
        }
        return value;
      },
      set: (value) => (formModel[row.prop] = value)
    });

    // 文本域属性组合
    if (column.itemType === ItemKey.textArea) {
      if (property.minRows || property.maxRows) {
        property.autosize = { minRows: property.minRows, maxRows: property.maxRows };
      }
      delete property.minRows;
      delete property.maxRows;
    }
    // 穿梭框属性组合
    if (column.itemType === ItemKey.transfer) {
      property.titles = [property.leftTitle, property.rightTitle];
      property.props = { label: property.optionName, key: property.optionValue };
      delete property.leftTitle;
      delete property.rightTitle;
    }

    const NoInput = <el-input placeholder="未配置输入类型" disabled />;

    const NoData = (prop) => {
      const isSelect = [ItemKey.select, ItemKey.treeSelect].includes(prop);
      if (isSelect) return <el-select placeholder="请选择" style="width: 100%" {...property} />;
      return <el-input placeholder="暂无数据" readonly />;
    };

    const dynamicRender = (Comp: JSXElement) => {
      return column.dataOption?.length ? Comp : NoData(column.itemType);
    };

    const CompObj = {
      // 输入框
      [ItemKey.input]: <el-input v-model={defValue.value} placeholder="请输入" {...property} />,
      // 输入框(数字)
      [ItemKey.inputNumber]: <el-input-number v-model={defValue.value} placeholder="请输入" controls-position="right" {...property} style="width: 100%" />,
      // 下拉框
      [ItemKey.select]: dynamicRender(
        column.loading ? (
          <el-select v-model={formModel[row.prop]} style="width: 100%" placeholder="请选择">
            {{ prefix: () => <LoadingIcon /> }}
          </el-select>
        ) : (
          <el-select
            v-model={defValue.value}
            style="width: 100%"
            placeholder="请选择"
            filterable
            collapse-tags
            collapse-tags-tooltip
            value-key={sValue || "id"}
            {...property}
          >
            {column.dataOption?.map((item) => {
              return <el-option key={item[sValue]} label={item[sLabel]} value={item[sValue]} />;
            })}
          </el-select>
        )
      ),
      // 树形下拉框
      [ItemKey.treeSelect]: dynamicRender(
        <el-tree-select
          v-model={defValue.value}
          check-strictly={true}
          check-on-click-node
          data={column.dataOption}
          render-after-expand={false}
          default-expanded-keys={["0"]}
          style="width: 100%"
          value-key={sValue || "id"}
          props={{ label: sLabel, value: sValue }}
          {...property}
        />
      ),
      // 开关
      [ItemKey.switch]: <el-switch v-model={defValue.value} {...property} inline-prompt={true} />,
      // 日期
      [ItemKey.date]: (
        <el-date-picker
          v-model={defValue.value}
          placeholder="请选择"
          clearable
          style="width: 100%"
          {...property}
          format={property.dateFormat ?? "YYYY-MM-DD"}
          value-format={property.dateFormat ?? "YYYY-MM-DD"}
        />
      ),
      // 时间
      [ItemKey.dateTime]: (
        <el-time-picker
          v-model={defValue.value}
          placeholder="请选择"
          clearable
          style="width: 100%"
          arrow-control
          range-separator="~"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          {...property}
          format={property.dateTime ?? "HH:mm:ss"}
          value-format={property.dateTime ?? "HH:mm:ss"}
        />
      ),
      // 上传
      [ItemKey.upload]: (
        <HxUploadButton
          v-model={defValue.value}
          v-model:fileList={defValue.value}
          show-file-list={false}
          list-type="picture-card"
          auto-upload={false}
          {...property}
          fileNameField="fileName"
          accept={Array.isArray(accept) ? accept.join(",") : accept}
        />
      ),
      // 文本域
      [ItemKey.textArea]: <el-input v-model={defValue.value} type="textarea" placeholder="请输入" {...property} />,
      // 穿梭框
      [ItemKey.transfer]: (
        <el-transfer
          v-model={formModel[row.prop]}
          filterable
          data={column.dataOption}
          filterMethod={(query, item) => item.initial.toLowerCase().includes(query.toLowerCase())}
          {...property}
        />
      ),
      // 单选
      [ItemKey.radio]: dynamicRender(
        <el-radio-group v-model={formModel[row.prop]} {...property}>
          {column.dataOption?.map((item) => (
            <el-radio key={item[sValue]} label={item[sValue]}>
              {item[sLabel]}
            </el-radio>
          ))}
        </el-radio-group>
      ),
      // 多选
      [ItemKey.checkbox]: dynamicRender(
        <el-checkbox-group v-model={formModel[row.prop]} {...property}>
          {column.dataOption?.map((item) => (
            <el-checkbox key={item[sValue]} label={item[sValue]}>
              {item[sLabel]}
            </el-checkbox>
          ))}
        </el-checkbox-group>
      ),
      // 空元素
      [ItemKey.empty]: null
    };
    // 使用外部自定义元素
    if (customElement[column.prop]) return customElement[column.prop]({ formModel, row });
    // 占位项不显示任何内容
    if (column.prop === "empty") return null;

    const component = CompObj[column.itemType];
    return component !== undefined ? component : NoInput;
  };
};

interface ButtonType {
  /** 修改 */
  edit: "edit";
  /** 查询 */
  search: "search";
  /** 新增 */
  add: "add";
  /** 删除 */
  delete: "delete";
  /** 导出 */
  export: "export";
  /** 打印 */
  print: "print";
  /** 提交 */
  submit: "submit";
  /** 下推 */
  pushDown: "pushDown";
  /** 回退 */
  back: "back";
  /** 下载 */
  download: "download";
  /** 导入 */
  import: "import";
  /** 启用 */
  enable: "enable";
  /** 正查 */
  forwardsearch: "forwardsearch";
  /** 反查 */
  countersearch: "countersearch";
  /** 履历 */
  lvli: "lvli";
  /** 审批详情 */
  approveDetail: "approveDetail";
  /** 查看 */
  lookOver: "lookOver";
  /** 接收 */
  accept: "accept";
  /** 回复 */
  reply: "reply";
  /** 撤回单据 */
  withdraw: "withdraw";
  /** 作废 */
  invalidate: "invalidate";
  /** 离职 */
  dimission: "dimission";
  /** 下载模板 */
  downloadMB: "downloadMB";
  /** 保存 */
  save: "save";
  /** 批量删除 */
  delBatch: "delBatch";
  /** 表单配置 */
  formConfig: "formConfig";
  /** 表格配置 */
  mainConfig: "mainConfig";
  /** 暂停 */
  suspend: "suspend";
  /** 激活 */
  activate: "activate";
  /** 设计图 */
  designimage: "designimage";
  /** 上传 */
  upload: "upload";
  /** 向上 */
  up: "up";
  /** 创建账号 */
  createAccount: "createAccount";
  /** 禁用 */
  disabled: "disabled";
  /** 反禁用 */
  undisabled: "undisabled";
  /** 分摊水电 */
  fentan: "fentan";
  /** 个人水电详情 */
  personage: "personage";
  /** 核算工资 */
  hesuan: "hesuan";
  /** 新增角色 */
  addRole: "addRole";
  /** 设置金蝶角色 */
  createKDRole: "createKDRole";
  /** 流程图 */
  flowdiagram: "flowdiagram";
  /** 查看单据 */
  bill: "bill";
  /** 终止 */
  zhongzhi: "zhongzhi";
  /** 批量修改订单状态 */
  updateOrderStatusBatch: "updateOrderStatusBatch";
  /** 打印快递单 */
  printExpress: "printExpress";
  /** 回签上传 */
  countersignUpload: "countersignUpload";
  /** 变更 */
  change: "change";
  /** 模板配置 */
  config: "config";
  /** 撤销导入 */
  cancelimport: "cancelimport";
  /** 工资分发 */
  weixin: "weixin";
  /** 归档 */
  guidang: "guidang";
  /** 查看工资条 */
  look: "look";
  /** 展开 */
  Expansion: "Expansion";
  /** 收起 */
  shrink: "shrink";
  /** 全选 */
  AllChecked: "AllChecked";
  /** 全不选 */
  allUnChecked: "allUnChecked";
  /** 刷新 */
  refreash: "refreash";
  /** 启动 */
  start: "start";
  /** 新增部门 */
  createDept: "createDept";
  /** 重置密码 */
  chongzhi: "chongzhi";
  /** 在线人员明细 */
  mingxi: "mingxi";
  /** 用户迁移 */
  userCopy: "userCopy";
  /** 创建数据库帐号 */
  createDbUser: "createDbUser";
  /** 创建金蝶帐号 */
  createKDUser: "createKDUser";
  /** 删除数据库帐号 */
  delDbUser: "delDbUser";
  /** 强制更新 */
  forcesUpdate: "forcesUpdate";
  /** 导入Excel */
  importExcel: "importExcel";
  /** 导出考勤 */
  exportAttendance: "exportAttendance";
  /** 考勤分发 */
  attendanceSend: "attendanceSend";
  /** 查看异常状态 */
  lookException: "lookException";
  /** 下载职员模板 */
  downloadZYMB: "downloadZYMB";
  /** 下载员工模板 */
  downloadYGMB: "downloadYGMB";
  /** 执行 */
  execute: "execute";
  /** 新增值 */
  addValue: "addValue";
  /** 添加角色 */
  createRole: "createRole";
  /** 导出销售数量 */
  exportXSSL: "exportXSSL";
  /** 导出销售业绩 */
  exportXSYJ: "exportXSYJ";
  /** 预览md */
  preview: "preview";
  /** 导出md */
  exportMD: "exportMD";
  /** 新增子任务 */
  addSubTask: "addSubTask";
  /** 新增主任务 */
  addTask: "addTask";
  /** 审核 */
  approval: "approval";
  /** 分发 */
  fenfa: "fenfa";
  /** 取消发放 */
  cancel: "cancel";
  /** 退卡 */
  money: "money";
  /** 导出明细 */
  exportDetail: "exportDetail";
  /** 导出汇总 */
  exportAll: "exportAll";
  /** 导入退卡 */
  importTK: "importTK";
  /** 新增用户 */
  addUser: "addUser";
  /** 新增交付物 */
  addDeliverables: "addDeliverables";
  /** 保存交付物 */
  saveDeliverables: "saveDeliverables";
  /** 删除交付物 */
  delDeliverables: "delDeliverables";
  /** 新增类型 */
  addType: "addType";
  /** 修改类型 */
  editType: "editType";
  /** 删除值 */
  delValue: "delValue";
  /** 新增岗位 */
  addPosition: "addPosition";
  /** 更新核算标准 */
  updateAccountStandard: "updateAccountStandard";
  /** 设置金蝶账号 */
  setKingdeeAccount: "setKingdeeAccount";
  /** 上传对账单 */
  uploadStatement: "uploadStatement";
  /** 设置企业微信账号 */
  setEnterpriseWeChatAccount: "setEnterpriseWeChatAccount";
  /** 上传发票 */
  uploadInvoice: "uploadInvoice";
  /** 下载对账单 */
  downloadStatement: "downloadStatement";
  /** 预览对账单 */
  previewStatement: "previewStatement";
  /** 预览详情 */
  previewDetail: "previewDetail";
  /** 入住 */
  checkIn: "checkIn";
  /** 新增宿舍 */
  addRoom: "addRoom";
  /** 修改宿舍 */
  editRoom: "editRoom";
  /** 删除宿舍 */
  delRoom: "delRoom";
  /** 异常工时 */
  abnormalWorkHour: "abnormalWorkHour";
  /** 开始 */
  startTask: "startTask";
  /** 完成 */
  finish: "finish";
  /** 获取接口 */
  getInterface: "getInterface";
  /** 发票审批详情 */
  invoiceDetail: "invoiceDetail";
  /** 对账单审批详情 */
  statementDetail: "statementDetail";
  /** 上传数据 */
  uploadAttrData: "uploadAttrData";
  /** 同步考勤机 */
  syncMachine: "syncMachine";
  /** 打印工资条 */
  printPayslip: "printPayslip";
  /** 创建企业微信标签 */
  createQYWXTag: "createQYWXTag";
  /** 撤销 */
  revoke: "revoke";
  /** 恢复 */
  restore: "restore";
  /** 批量编辑 */
  bulkEdit: "bulkEdit";
  /** 复制 */
  copy: "copy";
  /** 下载面部 */
  downloadFace: "downloadFace";
  /** 下载考勤数据 */
  downloadAttendanceData: "downloadAttendanceData";
  /** 上传用户信息 */
  uploadUserInfo: "uploadUserInfo";
  /** 回退对账单 */
  rollbackStatement: "rollbackStatement";
  /** 回退发票 */
  rollbackInvoice: "rollbackInvoice";
  /** 审核详情 */
  auditDetail: "auditDetail";
  /** 取消 */
  cancelAction: "cancelAction";
  /** 编辑 */
  newEdit: "newEdit";
  /** 增行 */
  addRows: "addRows";
  /** 删行 */
  delRows: "delRows";
  /** 续费 */
  renew: "renew";
  /** 询价 */
  priceInquiry: "priceInquiry";
  /** 补卡提醒 */
  missCardNotice: "missCardNotice";
  /** 重算考勤 */
  recalculateAttendance: "recalculateAttendance";
  /** 成本解析 */
  costAnalysis: "costAnalysis";
  /** 导出签名 */
  exportSign: "exportSign";
  /** 生成考勤汇总 */
  generateAttSummary: "generateAttSummary";
  /** 撤销分发 */
  revokeDispatch: "revokeDispatch";
  /** 帮助文档 */
  helpDoc: "helpDoc";
  /** 回滚 */
  rollBack: "rollBack";
  /** 手动重算 */
  handlerCalc: "handlerCalc";
}

export type ButtonKeyType = ValueOf<ButtonType>;
