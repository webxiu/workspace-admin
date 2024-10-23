/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-18 10:59:37
 */

import { Delete, MessageBox, Plus } from "@element-plus/icons-vue";
import { FormColumnItemType, deleteformColumn, formColumnList, updateformColumn } from "@/api/systemManage";
import { FormatDataType, ItemKey } from "@/utils/form";
import { SplitChar, formConfigs, formRules, formatConfigs, formatRules, hideList, inputList, pasteConfigs, slotsList } from "./config";
import { computed, h, onMounted, reactive, ref } from "vue";
import { copyText, debounce, readClipboard } from "@/utils/common";
import { message, showMessageBox } from "@/utils/message";
import { moveTableRow, setColumn, tableEditRender } from "@/utils/table";

import EditForm from "@/components/EditForm/index.vue";
import { ElMessageBox } from "element-plus";
import Format from "@/views/system/basic/menu/tableColumn/component/Format.vue";
import { LoadingType } from "@/components/ButtonList/index.vue";
import { Question } from "@/config/elements";
import { TableColumnRenderer } from "@pureadmin/table";
import VueJsonPretty from "vue-json-pretty";
import { addDialog } from "@/components/ReDialog";
import { defaultMime } from "@/config/constant";
import regExp from "@/utils/regExp";
import { useEleHeight } from "@/hooks";
import { useRoute } from "vue-router";
import { v4 as uuidv4 } from "uuid";

export const useConfig = () => {
  const tableRef = ref();
  const route = useRoute();
  const loading = ref<boolean>(false);
  const columns = ref<TableColumnList[]>([]);
  const dataList = ref<FormColumnItemType[]>([]);
  const dataListTemp = ref<FormColumnItemType[]>([]);
  const rowDatas = ref<FormColumnItemType[]>([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49);
  const loadingStatus = ref<LoadingType>({ loading: false, text: "" });

  onMounted(() => {
    getColumnConfig();
    getTableList();
  });

  const menuId = computed(() => {
    const mID = Number(route.query?.itemId as string);
    const result = Number.isNaN(mID) ? 0 : mID;
    return result; // 获取菜单ID
  });

  // 编辑表格
  const { editCellRender } = tableEditRender({
    editFinish: ({ prop, row }) => {
      if (prop === "seq") {
        moveTableRow<FormColumnItemType>(dataList, row, "seq", "", ({ newArr }) => (dataList.value = newArr));
      }
    }
  });

  function getColumnConfig() {
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
        label: "输入类型",
        prop: "itemType",
        headerAlign: "center",
        headerRenderer: ({ column }) => (
          <>
            <span>{column.label}</span>
            <el-tooltip placement="top" content="输入框, 多选框, 单选框...等">
              <Question />
            </el-tooltip>
          </>
        ),
        cellRenderer: (data) => editCellRender({ type: "select", data, options: inputList })
      },

      { label: "是否隐藏", prop: "hide", headerAlign: "center", cellRenderer: (data) => editCellRender({ type: "select", data, options: hideList }) },
      {
        label: "属性配置",
        prop: "valueFormat",
        minWidth: 200,
        headerAlign: "center",
        headerRenderer: ({ column }) => (
          <>
            <span>{column.label}</span>
            <el-tooltip placement="top" content="自定义单元格数据显示类型">
              <Question />
            </el-tooltip>
          </>
        ),
        cellRenderer: (data) => {
          const prop = data.column["property"];
          const value = JSON.parse(data.row[prop] || "{}");
          const DefaultDom = () => (
            <span class="ui-d-ib ui-w-100 pointer ellipsis ui-va-m" style="min-height: 22px;" onClick={onClickFormat.bind(null, data)}>
              {data.row[prop]}
            </span>
          );
          if (!value.layout) return <DefaultDom />;
          const ContentDom = () => (
            <div style={{ width: "400px", height: "220px", overflowY: "auto" }}>
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
        prop: "slots",
        headerAlign: "center",
        headerRenderer: ({ column }) => (
          <>
            <span>{column.label}</span>
            <el-tooltip placement="top" content="与 属性配置 操作相似, 自定义单元格数据">
              <Question />
            </el-tooltip>
          </>
        ),
        cellRenderer: (data) => editCellRender({ type: "select", data, options: slotsList })
      },
      { label: "表名", prop: "tableName", headerAlign: "center", cellRenderer: (data) => editCellRender({ data }) }
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
        dragSelector: ".form-config"
      },
      onUpdateIndex
    );
  }

  function getTableList() {
    if (!menuId.value) return message("菜单id错误", { type: "error" });
    loading.value = true;
    formColumnList(menuId.value)
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
      showMessageBox("新添加的记录未保存, 刷新会丢失, 确定要刷新吗?").then(getTableList).catch(console.log);
    } else {
      getTableList();
    }
  };

  function onClickFormat({ row, column, index }: TableColumnRenderer) {
    const formRef = ref();
    const formatRow: FormatDataType = JSON.parse(row?.valueFormat || "{}");
    const isInput = [ItemKey.input, ItemKey.inputNumber].includes(row.itemType);
    // 回显及默认值设置
    const _formData = reactive<FormatDataType>({
      ...formatRow,
      itemType: row.itemType ?? ItemKey.input,
      editInput: formatRow.editInput ?? "clearable",
      placeholder: formatRow.placeholder ?? (isInput ? "请输入" : "请选择"),
      optionName: formatRow.optionName ?? "optionName",
      optionValue: formatRow.optionValue ?? "optionValue",
      layout: formatRow.layout ?? 12,
      multiple: formatRow.multiple ?? false,
      limit: formatRow.limit ?? 1,
      accept: formatRow.accept ?? defaultMime,
      drag: formatRow.drag ?? false,
      showFileList: formatRow.showFileList ?? true,
      listType: formatRow.listType ?? "picture"
    });
    const formConfigs = formatConfigs({ formData: _formData, rowData: row });
    // 更新|提交
    const onChange = () => {
      const { itemType, ...formatData } = _formData;
      const checkedData = reactive({});
      const showConfig = formConfigs.value.filter((item) => item.hide === false);
      showConfig.forEach(({ prop }) => (checkedData[prop] = formatData[prop]));
      let result = JSON.stringify(checkedData);
      if (Object.keys(checkedData).length === 0) result = null;
      dataList.value[index]["itemType"] = itemType;
      dataList.value[index][column["property"]] = result;
    };

    addDialog({
      title: `属性配置【${row.label}】`,
      props: {
        formInline: _formData,
        formConfigs: formConfigs,
        formRules: formatRules(_formData),
        formProps: { labelWidth: "120px" }
      },
      width: "860px",
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

  function onAdd() {
    openDialog("table");
  }

  function openDialog(type: "table" | "name", cb?) {
    const formRef = ref();
    const tableField = dataList.value.map(({ tableName, label, prop }) => {
      const name = type === "table" ? tableName : label;
      return [name, prop].filter(Boolean).join(SplitChar);
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
            ElMessageBox.confirm(`确定要提交吗?`, "系统提示", {
              type: "warning",
              draggable: true,
              cancelButtonText: "取消",
              confirmButtonText: "确定",
              dangerouslyUseHTMLString: true
            }).then(() => {
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
                  itemType: ItemKey.input,
                  menuId: menuId.value,
                  slots: false,
                  tableName: tableName,
                  valueFormat: undefined,
                  isNew: true
                } as FormColumnItemType;
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
  const onSave = debounce(() => {
    const verify = verifyField();
    const emptyLabel = dataList.value.filter((f) => !f.label);
    const emptyProp = dataList.value.filter((f) => !f.prop);
    if (!dataList.value.length) return message("配置表不能为空", { type: "error" });
    if (emptyLabel.length > 0) return message("名称不能为空", { type: "error" });
    if (emptyProp.length > 0) return message("字段不能为空", { type: "error" });
    if (!verify.pass) return message(`${verify.column}填写不正确`, { type: "error" });

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
    ElMessageBox.confirm("确认要删除吗?", "系统提示", {
      type: "warning",
      draggable: true,
      cancelButtonText: "取消",
      confirmButtonText: "确定",
      dangerouslyUseHTMLString: true
    })
      .then(() => onDelete(rowDatas.value))
      .catch(console.log);
  }

  // 单个删除
  function onDelete(rows: FormColumnItemType[]) {
    const ids = rows.map((f) => f.id);
    deleteformColumn(ids)
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
        if (some && menuId.value) {
          dataList.value = list.map((item) => ({ ...item, menuId: menuId.value, id: undefined }));
          done();
        } else {
          message("保存失败", { type: "error" });
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
    route,
    loadingStatus,
    onRefresh,
    onDelete,
    onRowClick,
    handleSelectionChange,
    onCopyColumn
  };
};
