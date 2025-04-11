/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2025-03-18 10:09:35
 */

import { BillState_Color, boolOptions, tagColors } from "@/config/constant";
import { Delete, MessageBox, Plus } from "@element-plus/icons-vue";
import { FormatDataType, FormatKey, OptionKeys, getEnumDictList, moveTableRow, setColumn, tableEditRender } from "@/utils/table";
import { MenuColumnItemType, addBatchMenuColumn, deleteMenuColumn, menuColumnList } from "@/api/systemManage";
import {
  SplitChar,
  excelHideList,
  formConfigs,
  formConfigs2,
  formRules,
  formRules2,
  formatList,
  getAlign,
  getSlot,
  pasteConfigs,
  sortList,
  typeOptions
} from "./config";
import { TableColumn, TableColumnRenderer } from "@pureadmin/table";
import { copyText, debounce, readClipboard } from "@/utils/common";
import { h, onMounted, reactive, ref } from "vue";
import { message, showMessageBox } from "@/utils/message";

import EditForm from "@/components/EditForm/index.vue";
import Format from "../Format.vue";
import { LoadingType } from "@/components/ButtonList/index.vue";
import { NodeItemProps } from "@/views/system/basic/menu/tableColumn/utils/hook";
import { Question } from "@/config/elements";
import VueJsonPretty from "vue-json-pretty";
import { addDialog } from "@/components/ReDialog";
import regExp from "@/utils/regExp";
import { v4 as uuidv4 } from "uuid";

export const useConfig = () => {
  const tableRef = ref();
  const loading = ref<boolean>(false);
  const columns = ref<TableColumnList[]>([]);
  const rowDatas = ref<MenuColumnItemType[]>([]);
  const dataList = ref<MenuColumnItemType[]>([]);
  const dataListTemp = ref<MenuColumnItemType[]>([]);
  const loadingStatus = ref<LoadingType>({ loading: false, text: "" });
  const queryParams2 = ref<NodeItemProps>({ menuId: 0, columnGroupId: "" });

  onMounted(() => {
    getColumnConfig();
  });

  const { editCellRender } = tableEditRender({
    editFinish: ({ prop, row }) => {
      if (prop === "seq") {
        moveTableRow<MenuColumnItemType>(dataList, row, "seq", "", ({ newArr }) => (dataList.value = newArr));
      }
    }
  });

  function getColumnConfig() {
    // 表头提示信息
    const headToolTip = (column: TableColumn) => {
      const prop = column["property"];
      const contents = {
        minWidth: "自适应表格列宽,默认值为140 (日期推荐设置:160)",
        width: "权重高于最小宽度, 设置固定宽度将忽略最小宽度",
        align: "数量、金额 代表数字的数据居右对齐，其它类型的数据都居左",
        formatType: "自定义单元格数据显示(数字、日期、标签)",
        fixed: "固定列在表格左右两侧, 不跟随表格滚动",
        slot: "自定义内容插槽, 与自定义渲染作用相似",
        excelHide: "用于控制导出Excel时是否导出该列",
        excelFormat: "layui导出时间格式"
      };
      return <Question label={column.label} tipMsg={contents[prop]} />;
    };
    const columnData: TableColumnList[] = [
      { label: "顺序", prop: "seq", width: 60, align: "center", headerAlign: "center", fixed: true, cellRenderer: (data) => editCellRender({ data }) },
      {
        label: "名称",
        prop: "label",
        fixed: true,
        headerAlign: "center",
        minWidth: 140,
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
        minWidth: 140,
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
        label: "最小宽度",
        prop: "minWidth",
        headerAlign: "center",
        width: 100,
        headerRenderer: ({ column }) => headToolTip(column),
        cellRenderer: (data) => editCellRender({ data, cellStyle: { textAlign: "center" } })
      },
      {
        label: "固定宽度",
        prop: "width",
        headerAlign: "center",
        width: 100,
        headerRenderer: ({ column }) => headToolTip(column),
        cellRenderer: (data) => editCellRender({ data })
      },
      {
        label: "对齐方式",
        prop: "align",
        headerAlign: "center",
        width: 100,
        headerRenderer: ({ column }) => headToolTip(column),
        cellRenderer: (data) => editCellRender({ type: "select", data, options: getAlign() })
      },
      {
        label: "表头对齐方式",
        prop: "headerAlign",
        headerAlign: "center",
        width: 110,
        cellRenderer: (data) => editCellRender({ type: "select", data, options: getAlign() })
      },
      {
        label: "排序",
        prop: "sortable",
        headerAlign: "center",
        width: 80,
        cellRenderer: (data) => editCellRender({ type: "select", data, options: sortList })
      },
      {
        label: "自定义渲染",
        prop: "formatType",
        minWidth: 200,
        headerAlign: "center",
        headerRenderer: ({ column }) => headToolTip(column),
        cellRenderer: (data) => {
          const prop = data.column["property"];
          const value = JSON.parse(data.row[prop] || "{}");
          const DefaultDom = () => (
            <el-dropdown trigger="contextmenu" style="display: inline; line-height: inherit">
              {{
                default: () => (
                  <span class="ui-d-ib ui-w-100 pointer ellipsis ui-va-m" style="min-height: 22px;" onClick={onClickFormat.bind(null, data)}>
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
          if (!value.type) return <DefaultDom />;
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
        label: "是否隐藏",
        prop: "hide",
        headerAlign: "center",
        width: 80,
        cellRenderer: (data) => editCellRender({ type: "select", data, options: boolOptions })
      },
      {
        label: "固定列位置",
        prop: "fixed",
        headerAlign: "center",
        width: 110,
        headerRenderer: ({ column }) => headToolTip(column),
        cellRenderer: (data) => editCellRender({ type: "select", data, options: getAlign(["center"]) })
      },
      {
        label: "插槽",
        prop: "slot",
        headerAlign: "center",
        width: 100,
        headerRenderer: ({ column }) => headToolTip(column),
        cellRenderer: (data) => editCellRender({ type: "select", data, options: getSlot(data) })
      },
      {
        label: "Excel隐藏",
        prop: "excelHide",
        headerAlign: "center",
        width: 100,
        headerRenderer: ({ column }) => headToolTip(column),
        cellRenderer: (data) => editCellRender({ type: "select", data, options: excelHideList })
      },
      {
        label: "导出Format",
        prop: "excelFormat",
        align: "left",
        headerAlign: "center",
        width: 110,
        headerRenderer: ({ column }) => headToolTip(column),
        cellRenderer: (data) => editCellRender({ type: "select", data, options: formatList })
      },
      { label: "单元格类名", prop: "className", cellRenderer: (data) => editCellRender({ data }) },
      { label: "表名", prop: "tablename", headerAlign: "center", cellRenderer: (data) => editCellRender({ data }) }
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
        dragSelector: ".table-config"
      },
      onUpdateIndex
    );
  }

  // 外部查询
  function onSearch(params) {
    queryParams2.value = params;
    getTableList();
  }

  const getTableList = debounce(() => {
    const { columnGroupId, menuId } = queryParams2.value;
    if (!menuId) return message.error("菜单id不存在");
    if (!columnGroupId) return message.error("分组id不存在");
    loading.value = true;
    menuColumnList(queryParams2.value)
      .then(({ data }) => {
        loading.value = false;
        if (data?.length) {
          dataList.value = data;
          dataListTemp.value = data;
          onUpdateIndex();
        } else {
          dataList.value = [];
        }
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
      showMessageBox(`新添加的记录未保存, 刷新会丢失, 确定要刷新吗?`).then(getTableList).catch(console.log);
    } else {
      getTableList();
    }
  };

  // 1.选择格式化配置
  function onClickFormat(data: TableColumnRenderer) {
    const formRef = ref();
    const sLoading = ref(false);
    const formatCache = reactive({});
    const formatRow: FormatDataType = JSON.parse(data.row?.formatType ?? "{}");
    const specs = formatRow.specs || [{ uuid: Date.now(), value: "", label: "", color: "", background: "" }];
    const formData = reactive<FormatDataType>({ paddingV: "3", paddingH: "6", borderRadius: "4", ...formatRow, specs: specs });
    const formConfigs = formConfigs2({ formData, onChangeType, addSpecs });

    // 新增一行
    function addSpecs() {
      formData.specs.push({ uuid: Date.now(), value: "", label: "", color: "", background: "" });
    }

    // 删除一行
    function deleteSpecs(item) {
      const index = formData.specs.indexOf(item);
      if (index !== -1) {
        formData.specs.splice(index, 1);
      }
    }

    // 获取单据状态列表
    async function onChangeType(enumKey: OptionKeys) {
      if (enumKey && formData.type === FormatKey.enum) {
        if (formatCache[enumKey]?.length) {
          formData.specs = formatCache[enumKey];
          return;
        }
        sLoading.value = true;
        const res = await getEnumDictList([enumKey]);
        const billResult = res[enumKey].map(({ id, optionName, optionValue }, index) => {
          return { uuid: id, value: optionValue, label: optionName, ...tagColors[index] };
        });
        sLoading.value = false;
        formData.specs = billResult as any;
        formatCache[enumKey] = billResult;
      } else {
        formData.specs = specs;
      }
    }

    // 确认选择
    function onSelectType() {
      const { index, column } = data;
      // 只收集选中的表单数据
      const checkedData = reactive({ type: formData.type });
      const showConfig = formConfigs.value.filter((item) => item.hide === false);
      showConfig.forEach(({ prop }) => (checkedData[prop] = formData[prop]));

      // 获取格式化JSON数据
      let result = JSON.stringify(checkedData);
      if (Object.keys(checkedData).length < 2) result = null;
      dataList.value[index][column["property"]] = result;
    }

    addDialog({
      title: `自定义渲染【${data.row.label}】`,
      props: {
        loading: sLoading,
        formInline: formData,
        formRules: formRules2,
        formConfigs: formConfigs,
        formProps: { labelWidth: "110px" }
      },
      width: "860px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(Format, { ref: formRef, /* 实时更新 onSelectType, */ onDelete: deleteSpecs }),
      beforeSure: (done) => {
        const FormRef = formRef.value.getRef();
        FormRef.validate((valid) => {
          if (valid) {
            onSelectType();
            done();
          }
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
        const typeKeys = typeOptions.map((item) => item.optionValue);
        const type = JSON.parse(text || "{}").type;
        if (!typeKeys.includes(type)) return;
        data.row[data.column["property"]] = text;
      })
      .catch((err) => message.error("粘贴失败"));
  }

  // 4.清除格式化配置
  function onClearFormat(data: TableColumnRenderer) {
    data.row[data.column["property"]] = null;
  }

  function onAdd() {
    openDialog("table");
  }

  function openDialog(type: "table" | "name", cb?) {
    if (!queryParams2.value.columnGroupId) return message.error("请选择分组");
    const formRef = ref();
    const tableField = dataList.value.map(({ tablename, label, prop }) => {
      const name = type === "table" ? tablename : label;
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
        const FormRef = formRef.value.getRef();
        FormRef.validate((valid) => {
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
              if (existRow) {
                const _label = existRow.label;
                const width = { 2: 120, 3: 120, 4: 140, 5: 150, 6: 170, 7: 180, 8: 200 }[_label.length];
                if (width && existRow.width < width) existRow.width = width;
                if (_label.length > 8) existRow.width = 200;
                return { ...existRow, seq: seq };
              }

              const label = type === "table" ? undefined : table;
              const tablename = type === "name" ? undefined : table;
              return {
                id: uuidv4(),
                seq: seq,
                menuId: queryParams2.value.menuId,
                label: label,
                prop: prop,
                minWidth: 120,
                align: "left",
                headerAlign: "center",
                tablename: tablename,
                hide: false,
                excelHide: 0,
                isNew: true,
                width: 140,
                sortable: false,
                slot: undefined,
                formatType: undefined,
                excelFormat: undefined,
                fixed: undefined,
                className: undefined
              } as MenuColumnItemType;
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
        if (["width"].includes(k) && item.width) {
          // 校验宽度
          const isNan = Number.isNaN(Number(`${item.width}`.replace(/px/g, "")));
          if (isNan) return { column: columnName, pass: false };
        } else if (["minWidth"].includes(k) && item.minWidth) {
          // 校验最小宽度
          const isNan = Number.isNaN(Number(`${item.minWidth}`.replace(/px/g, "")));
          if (isNan) return { column: columnName, pass: false };
        } else if (["prop"].includes(k)) {
          // 校验字段
          const isOk = regExp.dbField.test(item.prop);
          if (!isOk) return { column: columnName, pass: false };
        }
      }
    }
    return { column: "", pass: true };
  }

  // 保存及更新
  const onSave = debounce(() => {
    const verify = verifyField();
    const { emptyList } = dataList.value
      .filter((item) => !item.hide)
      .reduce(
        (acc, cur) => {
          if (!cur.label) acc.emptyList.push("名称不能为空");
          if (!cur.prop) acc.emptyList.push("字段不能为空");
          return acc;
        },
        { emptyList: [] }
      );
    const emptyMsg = emptyList.find((item) => item);
    if (emptyMsg) return message.error(emptyMsg);
    if (!queryParams2.value.columnGroupId) return message.error("请选择分组");
    if (!dataList.value.length) return message.error("配置表不能为空");
    if (!verify.pass) return message.error(`${verify.column}填写不正确`);

    // 如果是新添加的列, 不提交ID
    const params: MenuColumnItemType[] = [];
    dataList.value.forEach(({ id, isNew, ...item }) => {
      params.push({
        ...item,
        headerAlign: "center",
        id: isNew ? undefined : id,
        columnGroupId: queryParams2.value.columnGroupId
      });
    });
    loadingStatus.value = { loading: true, text: "保存" };
    addBatchMenuColumn(params)
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
  });

  // 批量删除
  function onBatchDelete() {
    if (rowDatas.value.length === 0) return message.error("请选择删除内容");
    showMessageBox("确认要删除吗?")
      .then(() => onDelete(rowDatas.value))
      .catch(console.log);
  }

  // 单个删除
  function onDelete(rows: MenuColumnItemType[]) {
    const ids = rows.map((f) => f.id);
    deleteMenuColumn({ ids })
      .then(({ data }) => {
        if (data) {
          dataList.value = dataList.value.filter((f) => !ids.includes(f.id));
          onUpdateIndex();
          rowDatas.value = [];
          return message.success("删除成功");
        }
        message.error("删除失败");
      })
      .catch(console.log);
  }

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
        try {
          const list: MenuColumnItemType[] = JSON.parse(formData.content);
          const some = list.every((item) => item.label && item.prop);
          if (some && queryParams2.value.menuId) {
            dataList.value = list.map((item) => ({ ...item, menuId: queryParams2.value.menuId, id: undefined }));
            done();
          } else {
            message.error("保存失败, 请检查名称、字段是否填写");
          }
        } catch (error) {
          message.error("数据格式错误");
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

  function onRowClick(row: MenuColumnItemType, column) {
    // tableRef.value?.getTableRef()?.toggleRowSelection(row);
  }

  const handleSelectionChange = (rows: MenuColumnItemType[]) => {
    rowDatas.value = rows;
  };
  const buttonList2 = ref<ButtonItemType[]>([
    { text: "新增", type: "primary", clickHandler: onAdd, icon: Plus, isDropDown: false },
    { text: "保存", type: "success", clickHandler: onSave, icon: MessageBox, isDropDown: false },
    { text: "批量删除", type: "danger", clickHandler: onBatchDelete, icon: Delete, isDropDown: false }
  ]);

  return {
    tableRef,
    queryParams2,
    columns,
    dataList,
    loading,
    buttonList2,
    loadingStatus,
    onSearch,
    onRefresh,
    onDelete,
    onRowClick,
    onCopyColumn,
    getTableList,
    handleSelectionChange
  };
};
