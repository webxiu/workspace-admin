/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-18 11:00:01
 */

import { Delete, MessageBox, Plus } from "@element-plus/icons-vue";
import { FormatDataType, SortableCallbackType, moveTableRow, setColumn, tableEditRender } from "@/utils/table";
import { MenuColumnItemType, addBatchMenuColumn, deleteMenuColumn, menuColumnList } from "@/api/systemManage";
import { TableColumn, TableColumnRenderer } from "@pureadmin/table";
import { computed, h, onMounted, reactive, ref, watch } from "vue";
import { copyText, debounce, readClipboard } from "@/utils/common";
import { formConfigs, formConfigs2, formRules, formRules2, formatList, getAlign, getSlot, hideList, pasteConfigs, sortList, typeOptions } from "./config";
import { message, showMessageBox } from "@/utils/message";

import EditForm from "@/components/EditForm/index.vue";
import Format from "../Format.vue";
import { LoadingType } from "@/components/ButtonList/index.vue";
import { Question } from "@/config/elements";
import VueJsonPretty from "vue-json-pretty";
import { addDialog } from "@/components/ReDialog";
import regExp from "@/utils/regExp";
import { useEleHeight } from "@/hooks";
import { useRoute } from "vue-router";
import { v4 as uuidv4 } from "uuid";

export const useConfig = (props) => {
  const menuId = computed(() => {
    const mID = Number(route.query?.itemId as string);
    const result = Number.isNaN(mID) ? 0 : mID;
    return result; // 获取菜单ID
  });
  const tableRef = ref();
  const route = useRoute();
  const loading = ref<boolean>(false);
  const columns = ref<TableColumnList[]>([]);
  const rowDatas = ref<MenuColumnItemType[]>([]);
  const dataList = ref<MenuColumnItemType[]>([]);
  const dataListTemp = ref<MenuColumnItemType[]>([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 94);
  const queryParams = reactive({ menuId: "", columnGroupId: "", columnname: "" });
  const loadingStatus = ref<LoadingType>({ loading: false, text: "" });

  onMounted(() => {
    getColumnConfig();
  });

  watch(
    props,
    (value) => {
      queryParams.menuId = value.menuId;
      queryParams.columnGroupId = value.groupId;
      getTableList();
    },
    { immediate: true }
  );

  // 编辑表格
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
        align: "数量、金额、单价、代表数字的数据靠右显示，其它类型的数据都靠左",
        formatType: "自定义单元格数据显示类型(数字、日期、标签)",
        fixed: "固定列在表格左右两侧, 不跟随表格滚动",
        slot: "在表格组件中自定义数据, 与 格式化处理 作用相似",
        format: "layui导出时间格式"
      };
      return (
        <>
          <span>{column.label}</span>
          <el-tooltip placement="top" content={contents[prop]}>
            <Question />
          </el-tooltip>
        </>
      );
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
        headerRenderer: ({ column }) => headToolTip(column),
        cellRenderer: (data) => editCellRender({ data, cellStyle: { textAlign: "center" } })
      },
      {
        label: "固定宽度",
        prop: "width",
        headerAlign: "center",
        headerRenderer: ({ column }) => headToolTip(column),
        cellRenderer: (data) => editCellRender({ data })
      },
      {
        label: "对齐方式",
        prop: "align",
        headerAlign: "center",
        headerRenderer: ({ column }) => headToolTip(column),
        cellRenderer: (data) => editCellRender({ type: "select", data, options: getAlign() })
      },
      {
        label: "表头对齐方式",
        prop: "headerAlign",
        headerAlign: "center",
        cellRenderer: (data) => editCellRender({ type: "select", data, options: getAlign() })
      },
      { label: "排序", prop: "sortable", headerAlign: "center", cellRenderer: (data) => editCellRender({ type: "select", data, options: sortList }) },
      {
        label: "格式化处理",
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
            <div style={{ width: "400px", maxHeight: "220px", overflowY: "auto" }}>
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
        label: "固定列位置",
        prop: "fixed",
        headerAlign: "center",
        headerRenderer: ({ column }) => headToolTip(column),
        cellRenderer: (data) => editCellRender({ type: "select", data, options: getAlign(["center"]) })
      },
      {
        label: "插槽",
        prop: "slot",
        headerAlign: "center",
        headerRenderer: ({ column }) => headToolTip(column),
        cellRenderer: (data) => editCellRender({ type: "select", data, options: getSlot(data) })
      },
      { label: "是否隐藏", prop: "hide", headerAlign: "center", cellRenderer: (data) => editCellRender({ type: "select", data, options: hideList }) },
      {
        label: "导出Format",
        prop: "format",
        align: "left",
        headerAlign: "center",
        headerRenderer: ({ column }) => headToolTip(column),
        cellRenderer: (data) => editCellRender({ type: "select", data, options: formatList })
      },
      { label: "单元格类名", prop: "className", cellRenderer: (data) => editCellRender({ data }) },
      { label: "表名", prop: "tablename", headerAlign: "center", cellRenderer: (data) => editCellRender({ data }) }
      // { label: "类型", prop: "type" }
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

  function getTableList() {
    if (!queryParams.menuId) return message("菜单id错误", { type: "error" });
    loading.value = true;
    menuColumnList(queryParams)
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
  }

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
    const formatRow: FormatDataType = JSON.parse(data.row?.formatType ?? "{}");
    const formRef = ref();
    formatRow.specs = formatRow.specs || [{ uuid: Date.now(), value: "", label: "", color: "", background: "" }];
    const formData = reactive<FormatDataType>({
      paddingV: "3",
      paddingH: "6",
      borderRadius: "4",
      ...formatRow
    });

    const addSpecs = () => {
      formData.specs.push({ uuid: Date.now(), value: "", label: "", color: "", background: "" });
    };
    const deleteSpecs = (item) => {
      const index = formData.specs.indexOf(item);
      if (index !== -1) {
        formData.specs.splice(index, 1);
      }
    };

    const formConfigs = formConfigs2({ formData, addSpecs });

    // 更新
    const onChange = () => {
      const { index, column } = data;
      // 只收集选中的表单数据
      const checkedData = reactive({ type: formData.type });
      const showConfig = formConfigs.value.filter((item) => item.hide === false);
      showConfig.forEach(({ prop }) => (checkedData[prop] = formData[prop]));

      // 获取格式化JSON数据
      let result = JSON.stringify(checkedData);
      if (Object.keys(checkedData).length < 2) result = null;
      dataList.value[index][column["property"]] = result;
    };

    addDialog({
      title: `格式化处理【${data.row.label}】`,
      props: {
        formInline: formData,
        formRules: formRules2,
        formConfigs: formConfigs,
        formProps: { labelWidth: "100px" }
      },
      width: "860px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(Format, { ref: formRef, /* 实时更新 onChange, */ onDelete: deleteSpecs }),
      beforeSure: (done) => {
        const FormRef = formRef.value.getRef();
        FormRef.validate((valid) => {
          if (valid) {
            onChange();
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
      .catch((err) => message("粘贴失败", { type: "error" }));
  }

  // 4.清除格式化配置
  function onClearFormat(data: TableColumnRenderer) {
    data.row[data.column["property"]] = null;
  }

  function onAdd() {
    openDialog("table");
  }

  function openDialog(type: "table" | "name", cb?) {
    const formRef = ref();
    const tableField = dataList.value.map(({ tablename, label, prop }) => {
      const name = type === "table" ? tablename : label;
      return [name, prop].filter(Boolean).join(".");
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
            showMessageBox(`确定要提交吗?`).then(() => {
              const propList: string[] = [];
              let repeatField = "";
              const result = _formData.columns.split("\n").map((config, i) => {
                const splitArr: string[] = config.split(".");
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
                const tablename = type === "name" ? undefined : table;
                return {
                  id: uuidv4(),
                  seq: seq,
                  menuId: menuId.value,
                  label: label,
                  prop: prop,
                  minWidth: undefined,
                  align: "left",
                  headerAlign: "center",
                  tablename: tablename,
                  hide: false,
                  isNew: true,
                  width: 140,
                  type: undefined,
                  sortable: false,
                  slot: undefined,
                  formatType: undefined,
                  format: undefined,
                  fixed: undefined,
                  className: undefined,
                  columnname: undefined
                } as MenuColumnItemType;
              });
              if (repeatField) {
                return message(`${repeatField}字段重复, 请重新输入`, { type: "error" });
              }
              dataList.value = result;
              done();
              cb?.();
            });
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
    const emptyLabel = dataList.value.filter((f) => !f.label);
    const emptyProp = dataList.value.filter((f) => !f.prop);
    if (!queryParams.columnGroupId) return message("请先选择分组", { type: "error" });
    if (!dataList.value.length) return message("配置表不能为空", { type: "error" });
    if (emptyLabel.length > 0) return message("名称不能为空", { type: "error" });
    if (emptyProp.length > 0) return message("字段不能为空", { type: "error" });
    if (!verify.pass) return message(`${verify.column}填写不正确`, { type: "error" });

    // 如果是新添加的列, 不提交ID
    const params: MenuColumnItemType[] = [];
    dataList.value.forEach((item) => {
      const id = item.isNew ? undefined : item.id;
      params.push({ ...item, headerAlign: "center", id, columnGroupId: queryParams.columnGroupId });
    });
    loadingStatus.value = { loading: true, text: "保存" };
    addBatchMenuColumn(params)
      .then((res) => {
        if (res.data) {
          message("保存成功");
          getTableList();
        } else {
          message("保存失败", { type: "error" });
        }
      })
      .catch(console.log)
      .finally(() => (loadingStatus.value = { loading: false, text: "保存" }));
  });

  // 批量删除
  function onBatchDelete() {
    if (rowDatas.value.length === 0) return message("请选择删除内容", { type: "error" });
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
          return message("删除成功");
        }
        message("删除失败", { type: "error" });
      })
      .catch(console.log);
  }

  // 调整列宽
  function onHeaderDragend(newWidth, oldWidth, column) {
    dataList.value.forEach((item) => {
      if (item.prop === column.property) {
        item.minWidth = newWidth;
      }
    });
  }
  // 调整排序
  function onHeaderSort(data: SortableCallbackType) {
    const { fromName, toName } = data;
    const fromIndex = dataList.value.findIndex((item) => item.label === fromName);
    const toIndex = dataList.value.findIndex((item) => item.label === toName);
    const offset = fromIndex < toIndex ? 1 : 0; // 往右拖拽排序插入索引+1
    const newItem = dataList.value.find((item) => item.label === fromName);
    const newArr = dataList.value.filter((item) => item.label !== fromName);
    const newIndex = newArr.findIndex((item) => item.label === toName) + offset;
    newArr.splice(newIndex, 0, newItem);
    dataList.value = newArr;
    onUpdateIndex();
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
          if (some && menuId.value) {
            dataList.value = list.map((item) => ({ ...item, menuId: menuId.value, id: undefined }));
            done();
          } else {
            message("保存失败", { type: "error" });
          }
        } catch (error) {
          message("数据格式错误", { type: "error" });
        }
      }
    });

    // 复制
    function onCopy() {
      if (!dataListTemp.value.length) return message("配置表格数据为空", { type: "error" });
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
        .catch((err) => message("粘贴失败", { type: "error" }));
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
        message("数据格式错误", { type: "error" });
      }
    }
  }

  function onRowClick(row: MenuColumnItemType, column) {
    // tableRef.value?.getTableRef()?.toggleRowSelection(row);
  }

  const handleSelectionChange = (rows: MenuColumnItemType[]) => {
    rowDatas.value = rows;
  };

  const buttonList3 = ref<ButtonItemType[]>([
    { text: "新增", type: "primary", clickHandler: onAdd, icon: Plus, isDropDown: false },
    { text: "保存", type: "success", clickHandler: onSave, icon: MessageBox, isDropDown: false },
    { text: "批量删除", type: "danger", clickHandler: onBatchDelete, icon: Delete, isDropDown: false }
  ]);

  return {
    tableRef,
    columns,
    dataList,
    loading,
    maxHeight,
    buttonList3,
    loadingStatus,
    onRefresh,
    onDelete,
    onRowClick,
    onCopyColumn,
    onHeaderSort,
    onHeaderDragend,
    handleSelectionChange
  };
};
