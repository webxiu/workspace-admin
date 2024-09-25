import EditForm, { FormConfigItemType } from "@/components/EditForm/index.vue";
import { ElMessage, ElMessageBox, FormRules } from "element-plus";
import { QueryParamsType, SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { deleteClassifyTableInfo, insertClassifyTableInfo } from "@/api/plmManage";
import { downloadFile, getChildIDs, getFileNameOnUrlPath, getTreeArrItem, onDownload } from "@/utils/common";
import { getExportConfig, getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { getMoneySettingsList, moneySettingsExport, updateMoneySettingsInfo, uploadMoneySettingsInfo } from "@/api/oaManage/financeDept";
import { h, onMounted, reactive, ref } from "vue";

import { PAGE_CONFIG } from "@/config/constant";
import { PaginationProps } from "@pureadmin/table";
import { addDialog } from "@/components/ReDialog";
import axios from "axios";
import { getDeptOptions } from "@/utils/requestApi";
import { message } from "@/utils/message";
import { useEleHeight } from "@/hooks";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref([]);
  const currentId = ref("");
  const currentRow: any = ref({});
  const moneyRef = ref(null);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 95);
  const treeData = ref([]);

  const formRules = reactive<FormRules>({
    categoryName: [{ required: true, message: "产品分类名称为必填项", trigger: "submit" }],
    categoryNo: [{ required: true, message: "产品分类编码为必填项", trigger: "submit" }]
  });

  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });

  const formData: any = reactive({
    deptId: "0",
    staffCode: "",
    staffName: "",
    state: "在职",
    wageAccountingType: "职员",
    entryDeadline: "",
    page: 1,
    limit: PAGE_CONFIG.pageSize
  });

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "姓名", value: "staffName" },
    { label: "工号", value: "staffCode" },
    {
      label: "状态",
      value: "state",
      children: [
        { label: "在职", value: "在职" },
        { label: "离职", value: "离职" }
      ]
    },
    {
      label: "核算标准",
      value: "wageAccountingType",
      children: [
        { label: "职员", value: "职员" },
        { label: "员工", value: "员工" }
      ]
    },
    { label: "部门", value: "deptId", children: [] },
    { label: "入职截止日期", value: "entryDeadline", type: "date", format: "YYYY-MM-DD" }
  ]);

  const queryParams = reactive<QueryParamsType>({
    state: { value: "在职", valueLabel: "在职" },
    wageAccountingType: { value: "职员", valueLabel: "职员" }
  });

  const formConfigs = (): FormConfigItemType[] => [
    {
      label: "姓名",
      prop: "staffName",
      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "工号",
      prop: "staffCode",
      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "正班工资",
      colProp: { span: 8 },
      prop: "regularSalary",
      render: ({ formModel, row }) => <el-input-number v-model={formModel[row.prop]} min={0} controls={false} placeholder="请输入正班工资" class="ui-w-100" />
    },
    {
      label: "级别工资",
      colProp: { span: 8 },
      prop: "levelSalary",
      render: ({ formModel, row }) => <el-input-number v-model={formModel[row.prop]} min={0} controls={false} placeholder="请输入" class="ui-w-100" />
    },
    {
      label: "岗位津贴",
      colProp: { span: 8 },
      prop: "positionSubsidy",
      render: ({ formModel, row }) => <el-input-number v-model={formModel[row.prop]} min={0} controls={false} placeholder="请输入" class="ui-w-100" />
    },
    {
      label: "房屋补贴",
      colProp: { span: 8 },
      prop: "rentAllowance",
      render: ({ formModel, row }) => <el-input-number v-model={formModel[row.prop]} min={0} controls={false} placeholder="请输入" class="ui-w-100" />
    },
    {
      label: "工龄金额/年",
      colProp: { span: 8 },
      prop: "workAgeSubsidy",
      render: ({ formModel, row }) => <el-input-number v-model={formModel[row.prop]} min={0} controls={false} placeholder="请输入" class="ui-w-100" />
    },
    {
      label: "保密费",
      colProp: { span: 8 },
      prop: "confidentialitySubsidy",
      render: ({ formModel, row }) => <el-input-number v-model={formModel[row.prop]} min={0} controls={false} placeholder="请输入" class="ui-w-100" />
    },
    {
      label: "大周加班费",
      colProp: { span: 8 },
      prop: "bigWeekOverTime",
      render: ({ formModel, row }) => <el-input-number v-model={formModel[row.prop]} min={0} controls={false} placeholder="请输入" class="ui-w-100" />
    },
    {
      label: "是否计算",
      colProp: { span: 8 },
      prop: "isSalary",
      render: ({ formModel, row }) => {
        const options = [
          { label: "是", value: "是" },
          { label: "否", value: "否" }
        ];
        return (
          <el-select style={{ width: "100%" }} v-model={formModel[row.prop]} placeholder="请选择">
            {options.map((item) => (
              <el-option key={item.value} label={item.label} value={item.value} />
            ))}
          </el-select>
        );
      }
    }
  ];

  onMounted(() => {
    getColumnConfig();
    getOptions();
    onSearch();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "姓名", prop: "staffName" },
      { label: "工号", prop: "staffCode" },
      { label: "正班工资", prop: "regularSalary" },
      { label: "级别工资", prop: "levelSalary" },
      { label: "岗位津贴", prop: "positionSubsidy" },
      { label: "保密费", prop: "confidentialitySubsidy" },
      { label: "工龄金额/年", prop: "workAgeSubsidy" },
      { label: "房屋补贴", prop: "rentAllowance" },
      { label: "是否计算", prop: "isSalary" }
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ formData, columnData: JSON.parse(JSON.stringify(columnData)), operationColumn: false });
    return columnData;
  };

  const getOptions = () => {
    getDeptOptions().then((data: any) => {
      treeData.value = data;
      searchOptions[4].children = data;
    });
  };

  const onRefresh = () => {
    getColumnConfig();
    onSearch();
  };

  const onSearch = (_rowIndex?) => {
    loading.value = true;
    getMoneySettingsList(formData)
      .then((res: any) => {
        const data = res.data;
        loading.value = false;
        dataList.value = data.records || [];
        pagination.total = data.total;
        if (typeof _rowIndex === "number" && _rowIndex >= 0) {
          currentRow.value = dataList.value[_rowIndex];

          if (moneyRef.value) {
            moneyRef.value.getTableRef().setCurrentRow(dataList.value[_rowIndex]);
          }
        } else {
          currentRow.value = {};
        }
      })
      .catch((err) => (loading.value = false));
  };

  const handleTagSearch = (values) => {
    formData.staffCode = values.staffCode;
    formData.staffName = values.staffName;
    formData.state = values.state;
    formData.wageAccountingType = values.wageAccountingType;
    formData.deptId = values.deptId;
    formData.entryDeadline = values.entryDeadline;
    formData.deptIdList = [];
    if (values.deptId) {
      const result = getTreeArrItem(treeData.value, "value", values.deptId);
      formData.deptIdList = getChildIDs([result], "value");
    }
    onSearch();
  };

  const onEdit = () => {
    console.log(moneyRef.value.getTableRef().setCurrentRow, "table ref");
    const row = currentRow.value;
    currentId.value = row.staffCode;
    openDialog("edit", row);
  };

  const openDialog = async (type: string, row?) => {
    const titleObj = { add: "新增", edit: "修改薪资" };
    const title = titleObj[type];
    const formRef = ref();

    const _formData = reactive({
      regularSalary: row?.regularSalary,
      levelSalary: row?.levelSalary,
      positionSubsidy: row?.positionSubsidy,
      rentAllowance: row?.rentAllowance,
      workAgeSubsidy: row?.workAgeSubsidy,
      confidentialitySubsidy: row?.confidentialitySubsidy,
      bigWeekOverTime: row?.bigWeekOverTime,
      isSalary: row?.isSalary ?? "",
      staffName: row?.staffName ?? "",
      staffCode: row?.staffCode ?? "",
      staffId: row?.staffId
    });

    addDialog({
      title: `${title}`,
      props: {
        formInline: _formData,
        formRules: formRules,
        formProps: { labelWidth: 90 },
        formConfigs: formConfigs()
      },
      width: "900px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.validate(async (valid) => {
          if (valid) {
            ElMessageBox.confirm(`确认要${title}吗?`, "系统提示", {
              type: "warning",
              draggable: true,
              cancelButtonText: "取消",
              confirmButtonText: "确定",
              dangerouslyUseHTMLString: true
            }).then(() => {
              onSubmitChange(type, title, _formData, () => {
                done();
                const _rowIndex = dataList.value.findIndex((item) => item.staffCode === currentRow.value.staffCode);
                onSearch(_rowIndex);
              });
            });
          }
        });
      }
    });
  };

  const onSubmitChange = (type: string, title: string, data, callback) => {
    if (type === "edit") data.staffCode = currentId.value;

    const API = { add: insertClassifyTableInfo, edit: updateMoneySettingsInfo };
    API[type](data)
      .then((res) => {
        if (res.data) {
          callback();
          message(`${title}成功`);
        }
      })
      .catch(console.log);
  };

  // 导出
  const onExport = async () => {
    const fileName = "薪资设置导入模板.xlsx";
    axios({
      method: "get",
      responseType: "blob",
      url: `${import.meta.env.VITE_PUBLIC_PATH}template/${fileName}`
    })
      .then((res) => onDownload(res.data, fileName))
      .catch(() => {});
  };

  const onImport = () => {
    console.log("导入模板");
    const dom = document.getElementById("imporMoneyInputSettings");
    dom.click();
  };

  // 上传导入
  const onChangeFileInput = (e) => {
    const files = e.target.files;
    if (files.length <= 0) {
      return false;
    } else if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
      ElMessage({
        message: "上传格式不正确，请上传xls或者xlsx格式",
        type: "warning"
      });
      return false;
    } else {
      loading.value = true;
      const formData = new FormData();
      formData.append("files", files[0]);
      uploadMoneySettingsInfo(formData)
        .then((res) => {
          if (res.data) {
            ElMessage({ type: "success", message: "导入成功" });
          }
        })
        .finally(() => {
          loading.value = false;
          const dom = document.getElementById("imporMoneyInputSettings");
          (dom as any).value = null;
        });
    }
  };

  const onDelete = (row) => {
    ElMessageBox.confirm(`确认要删除编码为【${row.categoryNo}】的分类吗?`, "系统提示", {
      type: "warning",
      draggable: true,
      cancelButtonText: "取消",
      confirmButtonText: "确定",
      dangerouslyUseHTMLString: true
    })
      .then(() => {
        loading.value = true;
        deleteClassifyTableInfo({ id: row.id }).then((res) => {
          if (res.data) {
            ElMessage({ message: `删除成功`, type: "success" });
            onSearch();
          }
        });
      })
      .catch(() => {})
      .finally(() => (loading.value = false));
  };

  // 分页相关
  function handleSizeChange(val: number) {
    formData.limit = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    formData.page = val;
    onSearch();
  }

  const onExport2 = () => {
    const headConfig = getExportConfig("薪资设置", columns.value, formData);
    moneySettingsExport(headConfig)
      .then((res) => {
        if (res.data) {
          const fileName = getFileNameOnUrlPath(res.data);
          downloadFile(res.data, fileName, true);
        } else {
          message("导出失败", { type: "error" });
        }
      })
      .catch(console.log);
  };

  const onBeforeEdit = () => {
    if (JSON.stringify(currentRow.value) == "{}" || !currentRow.value) {
      ElMessage({ message: "请选择一条记录", type: "warning" });
      return;
    } else {
      onEdit();
    }
  };

  const rowClick = (row) => {
    currentRow.value = row;
  };

  const rowDbClick = (row) => {
    currentRow.value = row;
    onEdit();
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onBeforeEdit, type: "warning", text: "修改", isDropDown: false },
    { clickHandler: onImport, type: "primary", text: "导入", isDropDown: true },
    { clickHandler: onExport, type: "info", text: "下载模板", isDropDown: true },
    { clickHandler: onExport2, type: "info", text: "导出", isDropDown: true }
  ]);

  return {
    moneyRef,
    loading,
    columns,
    dataList,
    maxHeight,
    searchOptions,
    queryParams,
    pagination,
    buttonList,
    onRefresh,
    handleSizeChange,
    handleCurrentChange,
    onChangeFileInput,
    handleTagSearch,
    rowDbClick,
    rowClick
  };
};
