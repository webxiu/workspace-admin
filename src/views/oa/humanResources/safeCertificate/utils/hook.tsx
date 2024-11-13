import { dayjs, ElMessage, FormRules } from "element-plus";
import { addSafeCertificate, delSafeCertificate, exportSafeCertificate, fetchSafeCertificate, updateSafeCertificate } from "@/api/oaManage/humanResources";
import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { h, onMounted, reactive, ref } from "vue";
import { message, showMessageBox } from "@/utils/message";

import EditForm from "@/components/EditForm/index.vue";
import { addDialog } from "@/components/ReDialog";
import { useEleHeight } from "@/hooks";
import { fixed2AndAddcomma } from "@/utils/common";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref([]);
  const currentRow: any = ref({});
  const currentId = ref("");
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49);

  const formRules = reactive<FormRules>({
    projectName: [{ required: true, message: "项目名称为必填项", trigger: "submit" }],
    companyName: [{ required: true, message: "第三方公司名称为必填项", trigger: "submit" }],
    dateOfCertificate: [{ required: true, message: "证书日期为必填项", trigger: "submit" }],
    year: [{ required: true, message: "年度为必填项", trigger: "submit" }],
    effectiveDate: [{ required: true, message: "有效日期为必填项", trigger: "submit" }],
    money: [{ required: true, message: "金额为必填项", trigger: "submit" }],
    remark: [{ required: true, message: "备注为必填项", trigger: "submit" }]
  });

  const formData: any = reactive({ page: 1, limit: 10000 });

  const formConfigs = () => [
    {
      label: "项目名称",
      labelWidth: 120,
      prop: "projectName",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入项目名称" />;
      }
    },
    {
      label: "第三方公司名称",
      labelWidth: 120,
      prop: "companyName",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入第三方公司名称" />;
      }
    },
    {
      label: "年度",
      labelWidth: 120,
      prop: "year",
      render: ({ formModel, row }) => {
        return <el-date-picker style={{ width: "100%" }} v-model={formModel[row.prop]} type="year" placeholder="请选择" valueFormat="YYYY" format="YYYY" />;
      }
    },
    {
      label: "证书日期",
      labelWidth: 120,
      prop: "dateOfCertificate",
      render: ({ formModel, row }) => {
        return <el-date-picker style={{ width: "100%" }} v-model={formModel[row.prop]} type="date" placeholder="请选择证书日期" valueFormat="YYYY-MM-DD" />;
      }
    },
    {
      label: "有效日期",
      labelWidth: 120,
      prop: "effectiveDate",
      render: ({ formModel, row }) => {
        return <el-date-picker style={{ width: "100%" }} v-model={formModel[row.prop]} type="date" placeholder="请选择有效日期" valueFormat="YYYY-MM-DD" />;
      }
    },
    {
      label: "金额",
      labelWidth: 120,
      prop: "money",
      render: ({ formModel, row }) => {
        return <el-input-number class="ui-w-100" controls={false} v-model={formModel[row.prop]} placeholder="请输入金额" />;
      }
    },
    {
      label: "备注",
      labelWidth: 120,
      prop: "remark",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入备注" />;
      }
    }
  ];

  onMounted(() => {
    getColumnConfig();
    onSearch();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "项目名称", prop: "projectName" },
      { label: "公司名称", prop: "companyName", minWidth: 140 },
      { label: "年度", prop: "year" },
      { label: "证书日期", prop: "dateOfCertificate" },
      { label: "有效日期", prop: "effectiveDate", sortable: true },
      { label: "金额", prop: "money" },
      { label: "备注", prop: "remark" }
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false, radioColumn: { width: 80 } });
    return columnData;
  };

  const onSearch = (idx?) => {
    loading.value = true;
    fetchSafeCertificate(formData)
      .then((res: any) => {
        const data = res.data;
        loading.value = false;
        dataList.value = data;

        if (typeof idx === "number" && idx >= 0) {
          currentRow.value = dataList.value[idx];
        } else {
          currentRow.value = {};
        }
      })
      .catch((err) => (loading.value = false));
  };

  const onAdd = () => openDialog("add");

  const onEdit = (row) => {
    currentId.value = row.staffId;
    openDialog("edit", row);
  };

  const openDialog = async (type: string, row?) => {
    const titleObj = { add: "新增", edit: "修改", renew: "续费" };
    const title = titleObj[type];
    const formRef = ref();

    const _formData = reactive({
      companyName: row?.companyName ?? "",
      dateOfCertificate: row?.dateOfCertificate ?? "",
      year: row?.year ? row?.year + "" : "",
      effectiveDate: row?.effectiveDate ?? "",
      id: row?.id ?? "",
      money: row?.money ?? "",
      projectName: row?.projectName ?? "",
      remark: row?.remark ?? ""
    });

    if (type === "renew") {
      _formData.year = dayjs(_formData.year).add(1, "year").format("YYYY");
      _formData.dateOfCertificate = dayjs(_formData.dateOfCertificate).add(1, "year").format("YYYY-MM-DD");
      _formData.effectiveDate = dayjs(_formData.effectiveDate).add(1, "year").format("YYYY-MM-DD");
      _formData.id = undefined;
    }

    addDialog({
      title: `${title}`,
      props: {
        formInline: _formData,
        formRules: formRules,
        formProps: { labelWidth: 90 },
        formConfigs: formConfigs()
      },
      width: "450px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.validate(async (valid) => {
          if (valid) {
            showMessageBox(`确认要${title}吗?`).then(() => {
              onSubmitChange(type, title, _formData, () => {
                done();
                const _rowIndex = dataList.value.findIndex((item) => item.id === currentRow.value.id);
                onSearch(_rowIndex);
              });
            });
          }
        });
      }
    });
  };

  const onSubmitChange = (type: string, title: string, data, callback) => {
    const API = { add: addSafeCertificate, renew: addSafeCertificate, edit: updateSafeCertificate };
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
    const exportColumnsArr = await getColumnConfig();
    const exportHeadArr = exportColumnsArr
      .filter((item) => item.label && !/(序号|操作)/.test(item.label))
      .map((item) => ({
        title: item.label,
        field: item.prop,
        type: "normal",
        colGroup: false,
        rowspan: 1,
        unresize: true,
        colspan: 1,
        hide: false,
        width: 200
      }));
    const reqData = {
      ...formData,
      excel: {
        excelHeader: JSON.stringify(exportHeadArr),
        excelName: "安全证书管理"
      }
    };
    loading.value = true;

    exportSafeCertificate(reqData)
      .then((res) => {
        if (res.data) {
          window.open("/api" + res.data, "_blank");
        }
      })
      .finally(() => (loading.value = false));
  };

  const onDelete = () => {
    const row = currentRow.value;
    showMessageBox(`确认要删除项目名称为【${row.projectName}】的证书吗?`)
      .then(() => {
        loading.value = true;
        delSafeCertificate({ id: row.id }).then((res) => {
          if (res.data) {
            ElMessage({ message: `删除成功`, type: "success" });
            currentRow.value = {};
            onSearch();
          }
        });
      })
      .catch(() => {})
      .finally(() => (loading.value = false));
  };

  const editHandle = () => {
    if (JSON.stringify(currentRow.value) == "{}" || !currentRow.value) {
      ElMessage({ message: "请选择一条记录", type: "warning" });
      return;
    } else {
      onEdit(currentRow.value);
    }
  };

  const delHandle = () => {
    if (JSON.stringify(currentRow.value) == "{}" || !currentRow.value) {
      ElMessage({ message: "请选择一条记录", type: "warning" });
      return;
    } else {
      onDelete();
    }
  };

  const rowDbClick = (row) => {
    currentRow.value = row;
    onEdit(currentRow.value);
  };

  const rowClick = (row) => {
    currentRow.value = row;
  };

  const onRenew = () => {
    if (JSON.stringify(currentRow.value) == "{}" || !currentRow.value) {
      ElMessage({ message: "请选择一条记录", type: "warning" });
      return;
    } else {
      openDialog("renew", currentRow.value);
    }
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "新增" },
    { clickHandler: editHandle, type: "warning", text: "修改" },
    { clickHandler: delHandle, type: "danger", text: "删除" },
    { clickHandler: onRenew, type: "info", text: "续费", isDropDown: true },
    { clickHandler: onExport, type: "info", text: "导出", isDropDown: true }
  ]);

  // { label: "项目名称", prop: "projectName" },
  // { label: "公司名称", prop: "companyName", minWidth: 140 },
  // { label: "年度", prop: "year" },
  // { label: "证书日期", prop: "dateOfCertificate" },
  // { label: "有效日期", prop: "effectiveDate", sortable: true },
  // { label: "金额", prop: "money" },
  // { label: "备注", prop: "remark" }

  const getSummaries = (param) => {
    const { columns, data } = param;
    console.log(data, "data==");
    const sums: string[] = [];
    columns.forEach((column, index) => {
      if (index === 0) {
        sums[index] = "合计";
        return;
      }

      if (column.property === "money") {
        const values = data.map((item) => Number(item[column.property])).filter((el) => !isNaN(el));
        if (!values.every((value) => Number.isNaN(value))) {
          const curTotal = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!Number.isNaN(value)) {
              return prev + curr;
            } else {
              return 0;
            }
          }, 0);
          sums[index] = fixed2AndAddcomma(curTotal);
        }
      } else {
        sums[index] = "";
      }
    });

    return sums;
  };

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "年份", value: "year", type: "year", format: "YYYY" },
    { label: "公司名称", value: "companyName" },
    { label: "证书日期", value: "caDate", type: "daterange", format: "YYYY-MM-DD" },
    { label: "有效日期", value: "effectDate", type: "daterange", format: "YYYY-MM-DD" }
  ]);

  const handleTagSearch = (val) => {
    formData["projectName"] = val.projectName;
    formData["year"] = val.year;
    formData["companyName"] = val.companyName;

    // 证书日期
    if (val.caDate) {
      const [startCaDate, endCaDate] = val.caDate.split("~").map((el) => el.trim());
      formData.startCaDate = startCaDate;
      formData.endCaDate = endCaDate;
    } else {
      formData.startCaDate = undefined;
      formData.endCaDate = undefined;
    }

    // 有效日期
    if (val.effectDate) {
      const [startEffectDate, endEffectDate] = val.effectDate.split("~").map((el) => el.trim());
      formData.startEffectDate = startEffectDate;
      formData.endEffectDate = endEffectDate;
    } else {
      formData.startEffectDate = undefined;
      formData.endEffectDate = undefined;
    }
    onSearch();
  };

  return {
    loading,
    columns,
    dataList,
    maxHeight,
    handleTagSearch,
    searchOptions,
    buttonList,
    getSummaries,
    rowDbClick,
    rowClick,
    onSearch
  };
};
