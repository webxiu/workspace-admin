/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-16 10:20:48
 */

import { Delete, Plus } from "@element-plus/icons-vue";
import {
  EnumDictionaryItemType,
  EnumDictionaryOptionItemType,
  TableGroupItemType,
  enumDictionaryAdd,
  enumDictionaryDelete,
  enumDictionaryList,
  enumDictionaryOptionAdd,
  enumDictionaryOptionDelete,
  enumDictionaryOptionSelectMax,
  enumDictionaryOptionUpdate,
  enumDictionaryUpdate
} from "@/api/systemManage";
import { formConfig1, formConfig2, formRules, formRules2 } from "./config";
import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { h, onMounted, reactive, ref } from "vue";
import { message, showMessageBox } from "@/utils/message";
import { type PaginationProps } from "@pureadmin/table";

import EditForm from "@/components/EditForm/index.vue";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { addDialog } from "@/components/ReDialog";
import { getBOMTableRowSelectOptions } from "@/api/plmManage";
import { useEleHeight } from "@/hooks";
import { PAGE_CONFIG } from "@/config/constant";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const columns2 = ref<TableColumnList[]>([]);
  const dataList = ref<EnumDictionaryItemType[]>([]);
  const dataList2 = ref<EnumDictionaryOptionItemType[]>([]);
  const loading = ref<boolean>(false);
  const loading2 = ref<boolean>(false);
  const rowData = ref<EnumDictionaryItemType>();
  const optionRows = ref<EnumDictionaryOptionItemType[]>([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 95);
  const tableRef2 = ref();
  const groupArrsList = ref<TableGroupItemType[]>([]);

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "信息名称", value: "optionName" },
    { label: "信息编码", value: "optionCode" }
  ]);

  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });

  const formData = reactive({
    optionName: "",
    optionCode: "",
    page: 1,
    limit: PAGE_CONFIG.pageSize
  });

  onMounted(() => {
    getColumnConfig();
    getTableList();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "ID", prop: "id", minWidth: 55, align: "right" },
      { label: "信息名称", prop: "optionName", minWidth: 180, sortable: true },
      { label: "信息编码", prop: "optionCode", minWidth: 180, sortable: true },
      { label: "说明", prop: "memo", minWidth: 180 }
    ];

    let columnData2: TableColumnList[] = [
      { label: "序号", prop: "displaySeq", align: "right" },
      { label: "key值", prop: "optionName" },
      { label: "value值", prop: "optionValue" },
      { label: "预留1", prop: "reserve1" },
      { label: "金蝶key值", prop: "kingdeeValue" }
    ];

    const { columnArrs, groupArrs, buttonArrs } = await getMenuColumns();
    const [data, data2] = columnArrs;
    if (data?.length) columnData = data;
    if (data2?.length) columnData2 = data2;
    if (groupArrs?.length) groupArrsList.value = groupArrs;
    updateButtonList(buttonList, buttonArrs[0]);
    updateButtonList(buttonList2, buttonArrs[1]);
    columns.value = setColumn({ columnData: columnData, dragSelector: ".enum-dict" });
    columns2.value = setColumn({
      columnData: columnData2,
      dragSelector: ".enum-dict-option",
      selectionColumn: { hide: false },
      radioColumn: false,
      indexColumn: false
    });
  };

  const onRefresh = () => {
    getColumnConfig();
    getTableList();
  };
  const onRefresh2 = () => {
    if (!rowData.value) return;
    getColumnConfig();
    getOptionList(rowData.value);
  };

  const getTableList = () => {
    loading.value = true;
    enumDictionaryList(formData)
      .then((res: any) => {
        loading.value = false;

        const data = res.data;
        dataList.value = data.records;
        pagination.total = data.total;
      })
      .catch((err) => (loading.value = false));
  };

  // 搜索左表
  const onTagSearch = (values) => {
    Object.assign(formData, values);
    getTableList();
  };

  // 参数编号相关操作
  const onAdd = () => {
    openDialog("add");
  };
  const onEdit = (row: EnumDictionaryItemType) => {
    openDialog("edit", row);
  };
  const onDelete = (row: EnumDictionaryItemType) => {
    enumDictionaryDelete({ id: row.id })
      .then((res) => {
        getTableList();
        message("删除成功");
      })
      .catch(console.log);
  };
  const onCurrentChange = (row: EnumDictionaryItemType) => {};

  const rowClick = (row: EnumDictionaryItemType) => {
    if (!row) return;
    rowData.value = row;
    getOptionList(row);
  };

  function openDialog(type: "add" | "edit", row?: Partial<EnumDictionaryItemType>) {
    const titleObj = { add: "新增", edit: "修改" };
    const title = titleObj[type];
    const formRef = ref();
    const _formData = reactive({
      id: row?.id ?? "",
      optionName: row?.optionName ?? "",
      optionCode: row?.optionCode ?? "",
      memo: row?.memo ?? ""
    });

    addDialog({
      title: title,
      props: {
        formInline: _formData,
        formRules: formRules,
        formConfigs: formConfig1()
      },
      width: "460px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      showResetButton: true,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeReset: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.resetFields();
      },
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.validate((valid) => {
          if (valid) {
            showMessageBox(`确认要提交吗?`)
              .then(() => {
                onSubmitChange(type, title, _formData, () => {
                  done();
                  getTableList();
                });
              })
              .catch(console.log);
          }
        });
      }
    });
  }

  // 新增|修改提交
  const onSubmitChange = (type: string, title: string, data, callback) => {
    const API = { add: enumDictionaryAdd, edit: enumDictionaryUpdate };
    API[type](data)
      .then((res) => {
        if (res.data) {
          callback();
          message(`${title}成功`);
        }
      })
      .catch(console.log);
  };

  // 获取右侧选项列表
  const getOptionList = (row) => {
    loading2.value = true;

    getBOMTableRowSelectOptions({ optioncode: row.optionCode })
      .then((res) => {
        loading2.value = false;
        dataList2.value = res.data[0]?.optionList || [];
      })
      .catch(() => (loading2.value = false));
  };

  const onAdd2 = () => {
    if (!rowData.value) return message("请选择参数编号", { type: "error" });
    openDialog2("add");
  };
  const onEdit2 = (row: EnumDictionaryOptionItemType) => {
    openDialog2("edit", row);
  };

  // 删除单个(right)
  const onDelete2 = (row: EnumDictionaryOptionItemType) => {
    onDeleteAlls([row.id]);
  };

  // 批量删除(right)
  const onDeleteAll2 = () => {
    const ids = optionRows.value.map((item) => item.id);
    showMessageBox(`确定要将这${optionRows.value.length}个信息从【${rowData.value.optionName}】中删除吗?`)
      .then(() => onDeleteAlls(ids))
      .catch(console.log);
  };

  // 提交批量删除
  const onDeleteAlls = (optionListIdList: number[]) => {
    if (!optionListIdList?.length) {
      return message("请选择删除信息", { type: "error" });
    }
    enumDictionaryOptionDelete({ optionListIdList })
      .then((res) => {
        getOptionList(rowData.value);
        message("删除成功");
      })
      .catch(console.log);
  };

  // 多选key值
  const handleSelectionChange2 = (rows: EnumDictionaryOptionItemType[]) => {
    optionRows.value = rows;
  };
  const onRowClick2 = (row: EnumDictionaryOptionItemType) => {
    // tableRef2.value?.getTableRef()?.toggleRowSelection(row);
  };

  function openDialog2(type: "add" | "edit", row?: Partial<EnumDictionaryOptionItemType>) {
    const titleObj = { add: "新增", edit: "修改" };
    const title = titleObj[type];
    const formRef = ref();
    const addLoading = ref<boolean>(true);

    const _formData = reactive({
      id: row?.id ?? "",
      optionId: rowData.value?.id ?? "",
      displaySeq: row?.displaySeq ?? "",
      optionName: row?.optionName ?? "",
      reserve1: row?.reserve1 ?? "",
      optionValue: row?.optionValue ?? "",
      kingdeeValue: row?.kingdeeValue ?? ""
    });

    if (type === "add") {
      enumDictionaryOptionSelectMax(rowData.value.id)
        .then((res) => {
          _formData.displaySeq = res.data;
          addLoading.value = false;
        })
        .catch(() => (addLoading.value = false));
    } else {
      addLoading.value = false;
    }

    addDialog({
      title: title,
      props: {
        formInline: _formData,
        formRules: formRules2,
        loading: addLoading,
        formConfigs: formConfig2(),
        formProps: { labelWidth: "80px" }
      },
      width: "460px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      showResetButton: true,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeReset: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.resetFields();
      },
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.validate((valid) => {
          if (valid) {
            showMessageBox(`确认要提交吗?`)
              .then(() => {
                onSubmitChange2(type, title, _formData, () => {
                  done();
                  getOptionList(rowData.value);
                });
              })
              .catch(console.log);
          }
        });
      }
    });
  }

  // 新增|修改提交
  const onSubmitChange2 = (type: string, title: string, data, callback) => {
    const API = { add: enumDictionaryOptionAdd, edit: enumDictionaryOptionUpdate };
    API[type](data)
      .then((res) => {
        if (res.data) {
          callback();
          message(`${title}成功`);
        }
      })
      .catch(console.log);
  };

  const buttonList = ref<ButtonItemType[]>([{ clickHandler: onAdd, type: "primary", text: "新增", icon: Plus, isDropDown: false }]);
  const buttonList2 = ref<ButtonItemType[]>([
    { clickHandler: onAdd2, type: "primary", text: "新增", icon: Plus, isDropDown: false },
    { clickHandler: onDeleteAll2, type: "danger", text: "批量删除", icon: Delete, isDropDown: false }
  ]);

  // 分页相关
  function handleSizeChange(val: number) {
    formData.limit = val;
    getTableList();
  }

  function handleCurrentChange(val: number) {
    formData.page = val;
    getTableList();
    dataList2.value = [];
  }

  return {
    tableRef2,
    loading,
    loading2,
    columns,
    columns2,
    dataList,
    dataList2,
    maxHeight,
    searchOptions,
    buttonList,
    buttonList2,
    groupArrsList,
    onEdit,
    onEdit2,
    onDelete,
    onDelete2,
    onRefresh,
    onRefresh2,
    onRowClick2,
    onTagSearch,
    rowClick,
    pagination,
    handleSizeChange,
    handleCurrentChange,
    onCurrentChange,
    handleSelectionChange2
  };
};
