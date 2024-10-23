/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-16 10:02:57
 */

import { BudgetManageItemType, budgetManageList, exportBudgetManage, importBudgetManage, saveBudgetManage } from "@/api/businessCenter";
import { Download, MessageBox, Upload } from "@element-plus/icons-vue";
import { QueryParamsType, SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { RendererType, getExportConfig, getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { downloadFile, getFileNameOnUrlPath } from "@/utils/common";
import { formConfigs, formRules } from "./config";
import { h, onMounted, reactive, ref } from "vue";
import { message, showMessageBox } from "@/utils/message";

import EditForm from "@/components/EditForm/index.vue";
import RegInput from "@/components/RegInput.vue";
import { addDialog } from "@/components/ReDialog";
import { cloneDeep } from "@pureadmin/utils";
import dayjs from "dayjs";
import { findTreeNodes } from "@/utils/tree";
import { getDeptOptions } from "@/utils/requestApi";
import { getUserInfo } from "@/utils/storage";
import regExp from "@/utils/regExp";
import { useEleHeight } from "@/hooks";

export const useConfig = () => {
  const editMap = ref({});
  const columns = ref<TableColumnList[]>([]);
  const dataList = ref<BudgetManageItemType[]>([]);
  const loading = ref<boolean>(false);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 50);
  const budgetYear = dayjs().format("YYYY");
  const formData = reactive({ budgetYear: budgetYear, deptId: "" });
  const searchOptions = reactive<SearchOptionType[]>([
    { label: "日期", value: "budgetYear", type: "year", format: "YYYY" },
    { label: "部门", value: "deptId", children: [] }
  ]);

  const queryParams = reactive<QueryParamsType>({
    budgetYear: budgetYear,
    deptId: { value: "", valueLabel: "" }
  });

  onMounted(() => {
    getOptions();
    getColumnConfig();
  });

  const getOptions = () => {
    getDeptOptions().then((data) => {
      const userInfo = getUserInfo();
      const res = findTreeNodes(data, (t) => +t.value === userInfo.deptId)[0];
      formData.deptId = res?.value;
      queryParams.deptId = { value: res?.value, valueLabel: res.label };
      searchOptions[1].children = data;
      getTableList();
    });
  };

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [];
    const monthsRender: RendererType = ({ row, index, column }) => {
      const isEdit = editMap.value[index]?.editable;
      if (isEdit) return <RegInput v-model={row[column.columnKey]} pattern={regExp.money} isNumber={true} error="请输入数字" />;
      return <span>{row[column.columnKey]}</span>;
    };
    const customRenders = [...new Array(12)].reduce((cur, _, i) => {
      cur["m" + (i + 1)] = cloneDeep(monthsRender);
      return cur;
    }, {});
    const { columnArrs, buttonArrs } = await getMenuColumns([customRenders]);
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: { width: 100 } });
  };

  const onRefresh = () => {
    getColumnConfig();
    getTableList();
  };

  // 搜索
  const onTagSearch = (values) => {
    Object.assign(formData, values);
    getTableList();
  };

  const getTableList = () => {
    loading.value = true;
    budgetManageList(formData)
      .then(({ data }) => {
        loading.value = false;
        dataList.value = data || [];
      })
      .catch((err) => (loading.value = false));
  };

  function onSubmit() {
    saveBudgetManage(dataList.value)
      .then(({ data }) => {
        if (data) return message("保存成功");
        message("保存失败", { type: "error" });
      })
      .catch(console.log);
  }

  // 导入
  const onImport = () => {
    const formRef = ref();
    const _formData = reactive({
      budgetDate: dayjs().format("YYYY-MM"),
      deptId: formData.deptId,
      file: null
    });

    function onUploadChange(file) {
      _formData.file = file;
    }

    addDialog({
      title: "导入预算表",
      props: {
        loading: loading,
        formInline: _formData,
        formRules: formRules,
        formConfigs: formConfigs({ onUploadChange }),
        formProps: { labelWidth: "80px" }
      },
      width: "420px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        if (!_formData.deptId) return message("请选择部门", { type: "error" });
        FormRef.validate((valid) => {
          if (valid) {
            showMessageBox(`确认要提交吗?`).then(() => {
              const fd = new FormData();
              fd.append("file", _formData.file);
              fd.append("budgetDate", _formData.budgetDate);
              fd.append("deptId", _formData.deptId);
              importBudgetManage(fd)
                .then(({ data }) => {
                  if (!data) return message("导出失败", { type: "error" });
                  message("导入成功");
                  done();
                  getTableList();
                })
                .catch(console.log);
            });
          }
        });
      }
    });
  };

  // 导出
  const onExport = () => {
    const headConfig = getExportConfig("预算管理", columns.value, formData);
    exportBudgetManage(headConfig)
      .then((res) => {
        if (!res.data) return message("导出失败", { type: "error" });
        const fileName = getFileNameOnUrlPath(res.data);
        downloadFile(res.data, fileName, true);
      })
      .catch(console.log);
  };

  function onEdit(row, index) {
    editMap.value[index] = { ...row, editable: true };
  }

  function onSave(index) {
    editMap.value[index].editable = false;
  }

  function onCancel(index) {
    editMap.value[index].editable = false;
    dataList.value[index] = { ...editMap.value[index], editable: undefined };
  }

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onSubmit, type: "primary", text: "保存", icon: MessageBox },
    { clickHandler: onExport, type: "default", text: "导出", icon: Download, isDropDown: true },
    { clickHandler: onImport, type: "default", text: "导入", icon: Upload, isDropDown: true }
  ]);

  return {
    editMap,
    loading,
    columns,
    dataList,
    maxHeight,
    searchOptions,
    buttonList,
    queryParams,
    onEdit,
    onSave,
    onCancel,
    onRefresh,
    onTagSearch
  };
};
