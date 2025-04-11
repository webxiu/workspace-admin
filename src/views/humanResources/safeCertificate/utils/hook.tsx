import {
  addSafeCertificate,
  deleteDeitalSafeCertificate,
  delSafeCertificate,
  exportSafeCertificate,
  fetchSafeCertificate,
  insertDeitalSafeCertificate,
  querySafeCertificate,
  updateDeitalSafeCertificate,
  updateSafeCertificate
} from "@/api/oaManage/humanResources";
import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { h, onMounted, reactive, ref } from "vue";
import { message, showMessageBox } from "@/utils/message";
import { PaginationProps } from "@pureadmin/table";

import { FormItemConfigType } from "@/utils/form";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import TableEditList from "@/components/TableEditList/index.vue";
import { addDialog } from "@/components/ReDialog";
import { fixed2AndAddcomma } from "@/utils/common";
import { useEleHeight } from "@/hooks";
import { PAGE_CONFIG } from "@/config/constant";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const columns2 = ref<TableColumnList[]>([]);
  const dataList = ref([]);
  const dataList2 = ref([]);
  const currentRow = ref();
  const currentRightRow = ref();
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 95);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG, pageSize: 100 });
  const pagination2 = reactive<PaginationProps>({ ...PAGE_CONFIG });

  const formData = reactive({ page: 1, limit: 100 });
  const formData2 = reactive({ id: "" });

  onMounted(() => {
    getColumnConfig();
    onSearch();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "项目名称", prop: "projectName" },
      { label: "周期", prop: "cycle" },
      { label: "周期单位", prop: "cycleUnit" },
      { label: "备注", prop: "remark" }
    ];
    let columnData2: TableColumnList[] = [
      { label: "公司名称", prop: "companyName" },
      { label: "金额", prop: "money" },
      { label: "证书日期", prop: "certificateDate" },
      { label: "有效日期", prop: "effectiveDate" }
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data, data2] = columnArrs;
    if (data?.length) columnData = data;
    if (data2?.length) columnData2 = data2;
    updateButtonList(buttonList, [...buttonArrs[0]]);
    updateButtonList(buttonList2, [...buttonArrs[1]]);
    columns.value = setColumn({ columnData, operationColumn: false });
    columns2.value = setColumn({ columnData: columnData2, operationColumn: false });
    return [columnData, columnData2];
  };

  const onSearch = (idx?) => {
    dataList.value = [];
    fetchSafeCertificate(formData).then((res: any) => {
      const data = res.data.records;
      dataList.value = data;
      pagination.total = res.data.total;
      if (typeof idx === "number" && idx >= 0) {
        currentRow.value = dataList.value[idx];
      } else {
        currentRow.value = null;
      }
    });
  };

  const onSearch2 = (idx?) => {
    if (!currentRow.value) return;
    dataList2.value = [];
    querySafeCertificate(formData2).then((res: any) => {
      const data = res.data;
      dataList2.value = data;
      pagination2.total = res.data.total || 0;
      if (typeof idx === "number" && idx >= 0) {
        currentRightRow.value = dataList2.value[idx];
      } else {
        currentRightRow.value = null;
      }
    });
  };

  const onAdd = () => openDialog("add");
  const onAdd2 = () => {
    if (!currentRow.value) return message.warning("请先选择主表信息");
    openDialog2("add", currentRow.value, null);
  };

  const onEdit = (row) => {
    openDialog("edit", row);
  };

  const onEdit2 = (row) => {
    openDialog2("edit", currentRow.value, row);
  };

  const openDialog = async (type: string, row?) => {
    const titleObj = { add: "新增", edit: "修改", renew: "续费" };
    const title = titleObj[type];
    const formRef = ref();

    const _formData = reactive({
      companyName: row?.companyName ?? "",
      certificateDate: row?.certificateDate ?? "",
      effectiveDate: row?.effectiveDate ?? "",
      id: row?.id ?? "",
      money: row?.money ?? "",
      projectName: row?.projectName ?? "",
      cycle: row?.cycle ?? "",
      cycleUnit: row?.cycleUnit ?? "",
      remark: row?.remark ?? ""
    });

    const formConfig: FormItemConfigType[] = [{ formData: _formData, formProps: { labelWidth: "90px" } }];

    addDialog({
      title: `${title}`,
      props: {
        params: { groupCode: "1" },
        formConfig: formConfig
      },
      width: "450px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      beforeReset: () => formRef.value.resetRef(),
      contentRenderer: () => h(TableEditList, { ref: formRef }),
      beforeSure: (done, { options }) => {
        formRef.value.getRef().then(({ valid, data }) => {
          if (valid) {
            showMessageBox(`确认要${title}吗?`).then(() => {
              onSubmitChange(type, title, _formData, () => {
                done();
                onSearch();
              });
            });
          }
        });
      }
    });
  };

  const openDialog2 = async (type: string, leftRow, row?) => {
    const titleObj = { add: "新增", edit: "修改", renew: "续费" };
    const title = titleObj[type];
    const formRef = ref();

    const _formData = reactive({
      projectName: leftRow.projectName,
      cycle: leftRow.cycle,
      cycleUnit: leftRow.cycleUnit,
      remark: leftRow.remark,
      companyName: row?.companyName ?? "",
      certificateDate: row?.certificateDate ?? "",
      effectiveDate: row?.effectiveDate ?? "",
      // id: row?.id ?? "",
      // masterId: row?.id,
      money: row?.money ?? ""
    });

    if (["add", "renew"].includes(type)) {
      _formData["id"] = leftRow.id;
    } else {
      _formData["id"] = row?.id;
    }

    if (type === "renew") {
      _formData.certificateDate = "";
      _formData.effectiveDate = "";
    }

    const formConfig: FormItemConfigType[] = [{ formData: _formData, formProps: { labelWidth: "90px" } }];

    addDialog({
      title: `${title}`,
      props: {
        params: { groupCode: "2" },
        formConfig: formConfig
      },
      width: "950px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      beforeReset: () => formRef.value.resetRef(),
      contentRenderer: () => h(TableEditList, { ref: formRef }),
      beforeSure: (done, { options }) => {
        formRef.value.getRef().then(({ valid, data }) => {
          if (valid) {
            showMessageBox(`确认要${title}吗?`).then(() => {
              onSubmitChange2(type, title, _formData, () => {
                done();
                onSearch();
                onSearch2();
              });
            });
          }
        });
      }
    });
  };

  const onSubmitChange = (type: string, title: string, data, callback) => {
    const API = { add: addSafeCertificate, edit: updateSafeCertificate };
    API[type](data)
      .then((res) => {
        if (res.data) {
          callback();
          message.success(`${title}成功`);
        }
      })
      .catch(console.log);
  };

  const onSubmitChange2 = (type: string, title: string, data, callback) => {
    const API = { add: insertDeitalSafeCertificate, renew: insertDeitalSafeCertificate, edit: updateDeitalSafeCertificate };
    API[type](data)
      .then((res) => {
        if (res.data) {
          callback();
          message.success(`${title}成功`);
        }
      })
      .catch(console.log);
  };

  // 导出
  const onExport = async () => {
    const exportColumnsArr = await getColumnConfig();
    const exportHeadArr = exportColumnsArr[0]
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

    exportSafeCertificate(reqData).then((res) => {
      if (res.data) {
        window.open("/api" + res.data, "_blank");
      }
    });
  };

  const onDelete = () => {
    const row = currentRow.value;
    showMessageBox(`确认要删除项目名称为【${row.projectName}】的证书吗?`)
      .then(() => {
        delSafeCertificate({ id: row.id }).then((res) => {
          if (res.data) {
            message.success("删除成功");
            currentRow.value = null;
            onSearch();
            dataList2.value = [];
          }
        });
      })
      .catch(() => {});
  };

  const onDelete2 = () => {
    const row = currentRightRow.value;
    showMessageBox(`确认要删除公司名称为【${row.companyName}】的证书吗?`)
      .then(() => {
        deleteDeitalSafeCertificate({ id: row.id }).then((res) => {
          if (res.data) {
            message.success("删除成功");
            currentRightRow.value = null;
            onSearch2();
          }
        });
      })
      .catch(() => {});
  };

  const editHandle = () => {
    if (!currentRow.value) {
      message.warning("请选择一条记录");
      return;
    } else {
      onEdit(currentRow.value);
    }
  };

  const editHandle2 = () => {
    if (!currentRightRow.value) {
      message.warning("请选择一条记录");
      return;
    } else {
      onEdit2(currentRightRow.value);
    }
  };

  const delHandle = () => {
    if (!currentRow.value) {
      message.warning("请选择一条记录");
      return;
    } else {
      onDelete();
    }
  };

  const delHandle2 = () => {
    if (!currentRightRow.value) {
      message.warning("请选择一条记录");
      return;
    } else {
      onDelete2();
    }
  };

  const rowDbClick = (row) => {
    currentRow.value = row;
    onEdit(currentRow.value);
  };

  const rowDbClick2 = (row) => {
    currentRightRow.value = row;
    onEdit2(row);
  };

  const rowClick = (row) => {
    currentRow.value = row;
    formData2["id"] = row.id;
    onSearch2();
  };

  const rowClick2 = (row) => {
    currentRightRow.value = row;
  };

  const onRenew = () => {
    if (!currentRightRow.value) {
      message.warning("请选择一条记录");
      return;
    } else {
      openDialog2("renew", currentRow.value, currentRightRow.value);
    }
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "新增" },
    { clickHandler: editHandle, type: "warning", text: "修改" },
    { clickHandler: delHandle, type: "danger", text: "删除" },
    { clickHandler: onExport, type: "info", text: "导出", isDropDown: true }
  ]);

  const buttonList2 = ref<ButtonItemType[]>([
    { clickHandler: onAdd2, type: "primary", text: "新增" },
    { clickHandler: editHandle2, type: "warning", text: "修改" },
    { clickHandler: delHandle2, type: "danger", text: "删除" },
    { clickHandler: onRenew, type: "info", text: "续费", isDropDown: true }
  ]);

  const getSummaries = (param) => {
    const { columns, data } = param;
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
    { label: "公司名称", value: "companyName" },
    { label: "证书日期", value: "caDate", type: "daterange", format: "YYYY-MM-DD", startKey: "startCaDate", endKey: "endCaDate" },
    { label: "有效日期", value: "effectDate", type: "daterange", format: "YYYY-MM-DD", startKey: "startEffectDate", endKey: "endEffectDate" }
  ]);

  const handleTagSearch = (values) => {
    Object.assign(formData, values);
    onSearch();
  };

  // 分页相关
  function onSizeChange(val: number) {
    formData.limit = val;
    onSearch();
  }

  function onCurrentChange(val: number) {
    formData.page = val;
    onSearch();
  }

  // 分页相关
  function onSizeChange2(val: number) {
    formData2["limit"] = val;
    onSearch2();
  }

  function onCurrentChange2(val: number) {
    formData2["page"] = val;
    onSearch2();
  }

  return {
    columns,
    columns2,
    dataList,
    dataList2,
    maxHeight,
    handleTagSearch,
    searchOptions,
    buttonList,
    buttonList2,
    getSummaries,
    rowDbClick,
    rowClick,
    rowClick2,
    rowDbClick2,
    onSearch2,
    onSizeChange,
    onCurrentChange,
    pagination,
    onSizeChange2,
    onCurrentChange2,
    pagination2,
    onSearch
  };
};
