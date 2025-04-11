/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2025-02-20 18:08:41
 */

import { ArrowDown, Coin, Delete, MessageBox, Plus } from "@element-plus/icons-vue";
import { FormColumnItemType, deleteformColumn, enumDictionaryList, formColumnList, updateformColumn } from "@/api/systemManage";
import { FormatDataType, ItemKey } from "@/utils/form";
import { SplitChar, formConfigs, formRules, formatConfigs, formatRules, layouts, pasteConfigs, slotsList, typeOptions } from "./config";
import { boolOptions, defaultMime } from "@/config/constant";
import { copyText, debounce, readClipboard } from "@/utils/common";
import { h, onMounted, reactive, ref } from "vue";
import { message, showMessageBox } from "@/utils/message";
import { moveTableRow, setColumn, tableEditRender } from "@/utils/table";

import EditForm from "@/components/EditForm/index.vue";
import { ElMessageBox } from "element-plus";
import Format from "@/views/system/basic/menu/tableColumn/component/TableConfigList/Format.vue";
import { LoadingType } from "@/components/ButtonList/index.vue";
import { Question } from "@/config/elements";
import { TableColumnRenderer } from "@pureadmin/table";
import VueJsonPretty from "vue-json-pretty";
import { addDialog } from "@/components/ReDialog";
import { getSlot } from "../../TableConfigList/utils/config";
import regExp from "@/utils/regExp";
import { rowStyle } from "../../TableConfigList/utils/hook";
import { v4 as uuidv4 } from "uuid";

export type SearchType = { menuId: number; columnGroupId: string; id: string; tableName: ""; isForm: boolean };

export const useConfig = (emits) => {
  const tableRef = ref();
  const loading = ref<boolean>(false);
  const columns = ref<TableColumnList[]>([]);
  const dataList = ref<FormColumnItemType[]>([]);
  const dataListTemp = ref<FormColumnItemType[]>([]);
  const rowDatas = ref<FormColumnItemType[]>([]);
  const loadingStatus = ref<LoadingType>({ loading: false, text: "" });
  const queryParams2 = ref<Partial<SearchType>>({ menuId: 0, id: "", columnGroupId: "", isForm: false });

  onMounted(() => {
    getColumnConfig();
  });

  // 编辑表格
  const { editCellRender } = tableEditRender({
    editFinish: ({ prop, row, index }) => {
      if (prop === "seq") {
        moveTableRow<FormColumnItemType>(dataList, row, "seq", "", ({ newArr }) => (dataList.value = newArr));
      }
      // 输入类型变化重置属性配置
      if (prop === "itemType") {
        onClickFormat("change", { row, index } as TableColumnRenderer);
      }
    }
  });

  function getColumnConfig() {
    const customHeadRender = (prop: string, label: string, options: any[], element?: JSX.Element) => {
      return (
        <el-dropdown trigger="click" style="color: inherit; line-height: inherit">
          {{
            default: () => (
              <span class="inline-flex align-center">
                {element || label}
                <el-icon class="el-icon--right" color="var(--el-color-primary)">
                  <ArrowDown />
                </el-icon>
              </span>
            ),
            dropdown: () => (
              <el-dropdown-menu>
                <el-dropdown-item>
                  <el-button type="primary" link plain size="small" onClick={() => onHeaderDialog({ prop, label, options })}>
                    设置所有{label}
                  </el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            )
          }}
        </el-dropdown>
      );
    };

    const columnData: TableColumnList[] = [
      { label: "顺序", prop: "seq", width: 60, align: "center", headerAlign: "center", fixed: true, cellRenderer: (data) => editCellRender({ data }) },
      {
        label: "名称",
        prop: "label",
        fixed: true,
        headerAlign: "center",
        width: 140,
        headerRenderer: ({ column }) => (
          <el-tooltip placement="top" content="必填字段">
            <span>
              {column.label}
              <i class="color-f00">*</i>
            </span>
          </el-tooltip>
        ),
        cellRenderer: (data) => editCellRender({ data })
      },
      {
        label: "字段",
        prop: "prop",
        fixed: true,
        headerAlign: "center",
        width: 140,
        headerRenderer: ({ column }) => (
          <el-tooltip placement="top" content="必填字段">
            <span>
              {column.label}
              <i class="color-f00">*</i>
            </span>
          </el-tooltip>
        ),
        cellRenderer: (data) => editCellRender({ data })
      },
      {
        label: "输入类型",
        prop: "itemType",
        headerAlign: "center",
        width: 120,
        cellRenderer: (data) => editCellRender({ type: "select", data, options: typeOptions })
      },
      {
        label: "是否隐藏",
        prop: "hide",
        headerAlign: "center",
        width: 120,
        headerRenderer: ({ column }) => customHeadRender(column["property"], column.label, boolOptions),
        cellRenderer: (data) => editCellRender({ type: "select", data, options: boolOptions })
      },
      {
        label: "属性配置",
        prop: "formatType",
        minWidth: 200,
        headerAlign: "center",
        headerRenderer: ({ column }) => customHeadRender("layout", "布局", layouts, <Question label={column.label} tipMsg="配置布局、输入选项、校验规则等" />),
        cellRenderer: (data) => {
          const prop = data.column["property"];
          const value = JSON.parse(data.row[prop] || "{}");
          const DefaultDom = () => (
            <el-dropdown trigger="contextmenu" style="display: inline; line-height: inherit">
              {{
                default: () => (
                  <span class="ui-d-ib ui-w-100 pointer ellipsis ui-va-m" style="min-height: 22px;" onClick={onClickFormat.bind(null, "click", data)}>
                    {data.row[prop]}
                  </span>
                ),
                dropdown: () => (
                  <el-dropdown-menu>
                    <el-dropdown-item onClick={onCopyFormat.bind(null, data)}>复制</el-dropdown-item>
                    <el-dropdown-item onClick={onPasteFormat.bind(null, data)}>粘贴</el-dropdown-item>
                    <el-dropdown-item onClick={onClearFormat.bind(null, data)}>清除</el-dropdown-item>
                  </el-dropdown-menu>
                )
              }}
            </el-dropdown>
          );
          if (!value.layout) return <DefaultDom />;
          const ContentDom = () => (
            <div style={{ width: "400px", maxHeight: window.innerHeight * 0.8 + "px", overflowY: "auto" }}>
              <VueJsonPretty data={value} showLine={true} showLineNumber={true} showLength={true} showIcon={true} />
            </div>
          );
          return (
            <el-tooltip placement="right" effect="light">
              {{ default: DefaultDom, content: ContentDom }}
            </el-tooltip>
          );
        }
      },
      {
        label: "插槽",
        prop: "slot",
        headerAlign: "center",
        width: 100,
        headerRenderer: ({ column }) => <Question label={column.label} tipMsg="自定义渲染内容" />,
        cellRenderer: (data) => editCellRender({ type: "select", data, options: getSlot(data) })
      },
      { label: "字段说明", prop: "fieldComment", headerAlign: "center", width: 120, cellRenderer: (data) => editCellRender({ data }) },
      { label: "表名", prop: "tableName", headerAlign: "center", width: 140, cellRenderer: (data) => editCellRender({ data }) }
    ];
    columns.value = setColumn(
      {
        columnData,
        dataList,
        radioColumn: { hide: true },
        indexColumn: false,
        isDragRow: true,
        selectionColumn: { fixed: true, hide: false },
        operationColumn: { minWidth: 80 },
        dragSelector: ".fc-form"
      },
      onUpdateIndex
    );
  }

  // 头部设置弹窗
  function onHeaderDialog({ prop, label, options }) {
    const formRef = ref();
    const _formData = reactive({ [prop]: "" });
    const render = ({ formModel, row }) => {
      return (
        <el-select v-model={formModel[row.prop]} value-key="value" placeholder="请选择" class="ui-w-100">
          {options.map(({ optionName, optionValue }) => (
            <el-option key={optionValue} label={optionName} value={optionValue} />
          ))}
        </el-select>
      );
    };
    addDialog({
      title: "更新所有字段",
      props: { formInline: _formData, formProps: { labelWidth: "80px" }, formConfigs: [{ label, prop, render }] },
      width: "360px",
      draggable: true,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done) => {
        dataList.value.forEach((item) => {
          const has1 = Object.hasOwnProperty.call(item, prop);
          if (has1) return (item[prop] = _formData[prop]);
          const formatItem = JSON.parse(item.formatType);
          if (Object.hasOwnProperty.call(formatItem, prop)) {
            formatItem[prop] = _formData[prop];
            item.formatType = JSON.stringify(formatItem);
          }
        });
        done();
      }
    });
  }

  // 更新预览
  function onUpdatePreview() {
    emits("dataList", dataList.value);
  }

  // 外部查询
  function onSearch(row) {
    const { id, menuId, formGroupList, groupType, tableName } = row;
    if (formGroupList) {
      dataList.value = [];
      dataListTemp.value = [];
      queryParams2.value = {};
      return;
    }
    const param = { id, menuId, columnGroupId: id, tableName, isForm: !formGroupList, groupType };
    queryParams2.value = param;
    getTableList();
  }

  // 检查表单
  function checkForm() {
    if (queryParams2.value.isForm) return true;
    message.error("禁止分组操作, 请选择表单");
    return false;
  }

  // 检查表单
  function checkFn(func: Function) {
    return (...arg: any) => {
      const { isForm } = queryParams2.value;
      if (!isForm) return message.error("禁止分组操作, 请选择表单");
      func.call(null, ...arg);
    };
  }

  const getTableList = debounce(() => {
    const { id, menuId } = queryParams2.value;
    if (!id) return message.error("表单ID不能为空");
    loading.value = true;
    formColumnList(id)
      .then(({ data }) => {
        const _data = data || [];
        loading.value = false;
        dataList.value = _data;
        dataListTemp.value = _data;
        onUpdatePreview();
        onUpdateIndex();
      })
      .catch(() => (loading.value = false));
  });

  const onUpdateIndex = () => {
    dataList.value = dataList.value.map((item, i) => ({ ...item, seq: i + 1 }));
  };

  // 刷新列表
  const onRefresh = () => {
    const hasNew = dataList.value.filter((item) => item.isNew);
    if (hasNew.length > 0) {
      showMessageBox("新添加的记录未保存, 刷新会丢失, 确定要刷新吗?").then(getTableList).catch(console.log);
    } else {
      getTableList();
    }
  };

  function onClickFormat(action: "change" | "click", { row, index }: TableColumnRenderer) {
    const formRef = ref();
    const sLoading = ref(true);
    const enumList = ref([]);
    const formatRow: FormatDataType = JSON.parse(row?.formatType || "{}");
    const inputs = [ItemKey.input, ItemKey.textArea, ItemKey.inputNumber];

    // 属性配置:回显及默认值设置
    const _formData = reactive<FormatDataType>({
      ...formatRow,
      itemType: row.itemType ?? ItemKey.input,
      layout: formatRow.layout ?? 12,
      editInput: formatRow.editInput,
      clearable: formatRow.clearable ?? true,
      placeholder: formatRow.placeholder ?? inputs.includes(formatRow.itemType as ItemKey) ? "请输入" : "请选择",
      size: formatRow.size ?? "default",
      filterPlaceholder: formatRow.filterPlaceholder ?? "请输入",
      // dateTime
      dateTime: formatRow.dateTime ?? "HH:mm:ss",
      isRange: formatRow.isRange ?? false,
      // select
      method: formatRow.method ?? ("custom" as any),
      optionName: formatRow.optionName ?? "optionName",
      optionValue: formatRow.optionValue ?? "optionValue",
      multiple: formatRow.multiple ?? false,
      filterable: formatRow.filterable ?? false, // 是否筛选
      collapseTags: formatRow.collapseTags ?? false, // 是否标签显示
      maxCollapseTags: formatRow.maxCollapseTags ?? 1, // 标签最大显示个数
      collapseTagsTooltip: formatRow.collapseTagsTooltip ?? false, // 是否悬停提示
      // upload
      autoUpload: formatRow.autoUpload ?? false,
      accept: formatRow.accept ?? defaultMime,
      limit: formatRow.limit ?? 1,
      fileSize: formatRow.fileSize,
      iconSize: formatRow.iconSize ?? 100,
      drag: formatRow.drag ?? false,
      showFileList: formatRow.showFileList ?? true,
      listType: formatRow.listType ?? "picture",
      // textarea
      rows: formatRow.rows ?? 2,
      minRows: formatRow.minRows,
      maxRows: formatRow.maxRows
      // transfor
    });
    // 获取枚举字典下拉列表
    enumDictionaryList({ page: 1, limit: 10000 }, { headers: { hideLoading: true } })
      .then(({ data }) => (enumList.value = data.records || []))
      .finally(() => (sLoading.value = false));

    // 设置placeholder
    function onPlaceholderChange(value) {
      _formData.placeholder = inputs.includes(value as ItemKey) ? "请输入" : "请选择";
    }

    const formConfigs = formatConfigs({ formData: _formData, rowData: row, enumList, onPlaceholderChange });
    // 更新|提交
    const onChange = () => {
      const { itemType, ...formatData } = _formData;
      const checkedData = reactive({});
      const showConfig = formConfigs.value.filter((item) => item.hide === false);
      showConfig.forEach(({ prop }) => (checkedData[prop] = formatData[prop]));
      let result = JSON.stringify(checkedData);
      if (Object.keys(checkedData).length === 0) result = null;
      dataList.value[index]["itemType"] = itemType;
      dataList.value[index]["formatType"] = result;
      onUpdatePreview();
    };

    // 通过修改输入类型, 配置默认属性
    if (action === "change") return onChange();

    // 通过手动配置属性
    addDialog({
      title: `属性配置【${row.label}:${row.prop}】`,
      props: {
        loading: sLoading,
        formInline: _formData,
        formConfigs: formConfigs,
        formRules: formatRules(_formData),
        formProps: { labelWidth: "120px" }
      },
      width: "1050px",
      draggable: true,
      fullscreenIcon: true,
      showResetButton: true,
      closeOnClickModal: false,
      contentRenderer: () => h(Format, { ref: formRef, onChange: onChange }),
      beforeReset: () => formRef.value.getRef()?.resetFields(),
      beforeSure: (done) => {
        const FormRef = formRef.value.getRef();
        FormRef.validate((valid) => {
          if (!valid) return;
          onChange();
          done();
        });
      }
    });
  }

  // 2.复制格式化配置
  function onCopyFormat(data: TableColumnRenderer) {
    const value = data.row[data.column["property"]];
    copyText(value);
  }

  // 3.粘贴格式化配置
  function onPasteFormat(data: TableColumnRenderer) {
    readClipboard()
      .then((text) => {
        const result = JSON.parse(text || "{}");
        // 简单判断layout
        if (!result.layout) return message.error("数据格式错误");
        data.row[data.column["property"]] = text;
      })
      .catch((err) => message.error("粘贴失败"));
  }

  // 4.清除格式化配置
  function onClearFormat(data: TableColumnRenderer) {
    data.row[data.column["property"]] = null;
  }

  const onAdd = checkFn(() => {
    openDialog("table");
  });

  function openDialog(type: "table" | "name", cb?) {
    if (!checkForm()) return;
    const formRef = ref();
    const tableField = dataList.value.map(({ tableName, label, prop }) => {
      const name = type === "table" ? tableName : label;
      return [name, prop].join(SplitChar);
    });
    const _formData = reactive({ columns: tableField.join("\n") });
    const props = {
      formInline: _formData,
      formRules: formRules(type),
      formConfigs: formConfigs(type),
      formProps: { labelWidth: "120px", labelPosition: "top" }
    };
    addDialog({
      title: "添加表结构",
      props: props,
      width: "640px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeReset: (done, { options }) => formRef.value.getRef()?.resetFields(),
      beforeSure: (done, { options }) => {
        formRef.value.getRef().validate((valid) => {
          if (valid) {
            const propList: string[] = [];
            let repeatField = "";
            const result = _formData.columns.split("\n").map((config, i) => {
              const splitArr: string[] = config.split(SplitChar);
              const [table, prop] = splitArr.length === 2 ? splitArr : [undefined, splitArr[0]];
              const existRow = dataList.value.find((item) => item.prop === prop);
              // 检测是否重复输入
              if (propList.includes(prop)) {
                repeatField = prop;
              } else {
                propList.push(prop);
              }
              const seq = i + 1;
              if (existRow) return { ...existRow, seq: seq };
              const label = type === "table" ? undefined : table;
              const tableName = type === "name" ? undefined : table;
              return {
                id: uuidv4(),
                seq: seq,
                label: label,
                prop: prop,
                hide: false,
                menuId: queryParams2.value.menuId,
                formGroupId: queryParams2.value.id,
                itemType: ItemKey.input,
                slot: undefined,
                formatType: undefined,
                tableName: queryParams2.value.tableName || tableName,
                isNew: true
              } as FormColumnItemType;
            });
            if (repeatField) {
              return message.error(`${repeatField}字段重复, 请重新输入`);
            }
            dataList.value = result;
            done();
            cb?.();
          }
        });
      }
    });
  }

  /** 校验表格数据 */
  function verifyField() {
    for (const item of dataList.value) {
      const keys = Object.keys(item);
      for (const k of keys) {
        const columnName = columns.value.find((f) => f.prop === k)?.label;
        if (["prop"].includes(k)) {
          // 校验字段
          const isOk = regExp.dbField.test(item.prop);
          if (!isOk) return { column: columnName, pass: false };
        }
      }
    }
    return { column: "", pass: true };
  }

  // 保存及更新
  const onSave = debounce(
    checkFn(() => {
      const verify = verifyField();
      const { emptyList } = dataList.value
        .filter((item) => !item.hide)
        .reduce(
          (acc, cur) => {
            if (!cur.label) acc.emptyList.push("名称不能为空");
            if (!cur.prop) acc.emptyList.push("字段不能为空");
            if (!cur.itemType) acc.emptyList.push("类型不能为空");
            if (!cur.formatType) acc.emptyList.push("属性配置不能为空");
            return acc;
          },
          { emptyList: [] }
        );
      const emptyMsg = emptyList.find((item) => item);
      if (emptyMsg) return message.error(emptyMsg);
      if (!queryParams2.value.id) return message.error("请选择类型");
      if (!dataList.value.length) return message.error("配置表不能为空");
      if (!verify.pass) return message.error(`${verify.column}填写不正确`);

      // 如果是新添加的列, 不提交ID
      const params: FormColumnItemType[] = [];
      dataList.value.forEach((item) => {
        const id = item.isNew ? undefined : item.id;
        params.push({ ...item, id });
      });
      loadingStatus.value = { loading: true, text: "保存" };
      updateformColumn(params)
        .then((res) => {
          if (res.data) {
            message.success("保存成功");
            getTableList();
          } else {
            message.error("保存失败");
          }
        })
        .catch(console.log)
        .finally(() => (loadingStatus.value = { loading: false, text: "保存" }));
    })
  );

  // 批量删除
  const onBatchDelete = checkFn(() => {
    if (rowDatas.value.length === 0) return message.error("请选择删除内容");
    ElMessageBox.confirm("确认要删除吗?", "系统提示", {
      type: "warning",
      draggable: true,
      cancelButtonText: "取消",
      confirmButtonText: "确定",
      dangerouslyUseHTMLString: true
    })
      .then(() => onDelete(rowDatas.value))
      .catch(console.log);
  });

  // 单个删除
  const onDelete = checkFn((rows: FormColumnItemType[]) => {
    const ids = rows.map((f) => f.id);
    deleteformColumn(ids)
      .then(({ data }) => {
        if (data) {
          dataList.value = dataList.value.filter((f) => !ids.includes(f.id));
          rowDatas.value = [];
          return message.success("删除成功");
        }
        message.error("删除失败");
      })
      .catch(console.log);
  });

  function onRowClick(row: FormColumnItemType, column) {
    // tableRef.value?.getTableRef()?.toggleRowSelection(row);
  }

  const handleSelectionChange = (rows: FormColumnItemType[]) => {
    rowDatas.value = rows;
  };

  // 复制、粘贴、添加配置信息
  function onCopyColumn(type: "copy" | "paste") {
    const title = { copy: "复制", paste: "粘贴" }[type];
    const formData = reactive({ content: "" });

    const resultDialog = addDialog({
      title: title + "表格配置",
      props: {
        formInline: formData,
        formConfigs: pasteConfigs({ type, formData, onCopy, onCreate, onPreview, onPaste, onClear })
      },
      width: type === "copy" ? "400px" : "800px",
      draggable: true,
      fullscreenIcon: false,
      closeOnClickModal: false,
      okButtonText: "保存",
      hideItem: type === "copy" ? ["ok"] : [],
      contentRenderer: () => h(EditForm, {}),
      beforeSure: (done) => {
        const list: FormColumnItemType[] = JSON.parse(formData.content);
        const some = list.every((item) => item.label && item.prop);
        const { menuId, id: formGroupId } = queryParams2.value;
        if (some && menuId) {
          dataList.value = list.map((item) => ({ ...item, menuId, formGroupId, id: undefined }));
          done();
        } else {
          message.error("保存失败, 请检查名称、字段、类型、属性配置");
        }
      }
    });

    // 复制
    function onCopy() {
      if (!dataListTemp.value.length) return message.error("配置表格数据为空");
      copyText(JSON.stringify(dataListTemp.value, null, 2));
      resultDialog.options.value.visible = false;
    }
    // 添加
    function onCreate() {
      openDialog("name", () => {
        resultDialog.options.value.visible = false;
      });
    }
    // 粘贴
    function onPaste() {
      readClipboard()
        .then((text) => {
          if (formData.content) return;
          formData.content = text;
        })
        .catch((err) => message.error("粘贴失败"));
    }
    // 清空
    function onClear() {
      formData.content = "";
    }
    // 预览
    function onPreview() {
      try {
        const data = JSON.parse(formData.content);
        addDialog({
          title: "配置预览",
          props: {
            data: data,
            showLine: true,
            showLineNumber: true,
            showDoubleQuotes: true,
            showLength: true,
            editable: true,
            showIcon: true,
            editableTrigger: "click",
            deep: 3
          },
          width: "800px",
          draggable: true,
          fullscreenIcon: true,
          closeOnClickModal: false,
          contentRenderer: () => h(VueJsonPretty),
          beforeSure: (done) => done()
        });
      } catch (error) {
        message.error("数据格式错误");
      }
    }
  }

  const buttonList3 = ref<ButtonItemType[]>([
    { text: "新增", type: "primary", clickHandler: onAdd, icon: Plus, isDropDown: false },
    { text: "保存", type: "success", clickHandler: onSave, icon: MessageBox, isDropDown: false },
    { text: "批量删除", type: "danger", clickHandler: onBatchDelete, icon: Delete, isDropDown: false }
  ]);

  return {
    tableRef,
    loading,
    columns,
    dataList,
    buttonList3,
    loadingStatus,
    onSearch,
    onRefresh,
    onDelete,
    rowStyle,
    onRowClick,
    onCopyColumn,
    handleSelectionChange
  };
};
