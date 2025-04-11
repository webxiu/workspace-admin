import { delWorkAgeMoneyList, fetchWorkAgeMoneyList, recalcWorkAgeMoneyList, saveWorkAgeMoneyList } from "@/api/oaManage/humanResources";
import { getEnumDictList, getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { h, onMounted, reactive, ref } from "vue";
import { message, showMessageBox } from "@/utils/message";
import { utils, write } from "xlsx";

import { PAGE_CONFIG } from "@/config/constant";
import { PaginationProps } from "@pureadmin/table";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import SelectStaffUser from "./selectStaffUser.vue";
import TableEditList from "@/components/TableEditList/index.vue";
import { addDialog } from "@/components/ReDialog";
import dayjs from "dayjs";
import { getDeptOptions } from "@/utils/requestApi";
import { saveAs } from "file-saver";
import { useEleHeight } from "@/hooks";

export const useMachine = () => {
  const dataList = ref([]);
  const columns = ref<TableColumnList[]>([]);
  const loading = ref(false);

  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 95);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const currentRow = ref();
  const formData: any = reactive({
    page: 1,
    limit: PAGE_CONFIG.pageSize
  });

  const theFirstDayOfMonth = dayjs().format("YYYY-MM");

  const queryParams = reactive({ calcYearMonth: theFirstDayOfMonth });

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "工号", value: "staffCode" },
    { label: "姓名", value: "staffName" },
    { label: "职级", value: "grade", children: [] },
    { label: "计算年月", value: "calcYearMonth", type: "month", format: "YYYY-MM" },
    { label: "工龄薪资", value: "senioritySalary" },
    { label: "工龄/年", value: "serviceYears" }
  ]);

  const fetchOptions = () => {
    // getDeptOptions().then((data: any) => {
    //   searchOptions[1].children = data;
    // });
    getEnumDictList(["SeniorityRanks"]).then(({ SeniorityRanks }) => {
      searchOptions[2].children = SeniorityRanks;
    });
  };

  onMounted(() => {
    fetchOptions();
    getColumnConfig();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "工号", prop: "staffCode" },
      { label: "姓名", prop: "staffName" },
      { label: "部门", prop: "deptName" },
      { label: "职级", prop: "grade" },
      { label: "计算年月", prop: "calcYearMonth" },
      { label: "工龄薪资", prop: "senioritySalary" },
      { label: "工龄/年", prop: "serviceYears" },
      { label: "创建人", prop: "createUserName" },
      { label: "创建时间", prop: "createDate" },
      { label: "最后修改人", prop: "modifyUserName" },
      { label: "最后修改时间", prop: "modifyDate" }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [menuCols] = columnArrs;
    if (menuCols?.length) columnData = menuCols;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false });
    return columnData;
  };

  const onSearch = () => {
    fetchWorkAgeMoneyList(formData).then((res: any) => {
      if (res.data) {
        const data = res.data;
        dataList.value = data.records || [];
        pagination.total = data.total;
      }
    });
  };

  const onFresh = () => {
    getColumnConfig();
    onSearch();
  };

  const handleTagSearch = (values) => {
    Object.assign(formData, values);
    onSearch();
  };

  const onExport = () => {
    const timeStep = Date.now();
    const workbook = utils.table_to_book(document.querySelector("#workAgeTableId"), {
      raw: true //有的是日期、小数等格式，直接乱码#。所以这里直接保留原始字符串
    });
    workbook.Sheets.Sheet1["!cols"][0] = { hidden: true };
    const wbout = write(workbook, {
      bookType: "xlsx",
      bookSST: true,
      type: "array"
    });
    saveAs(
      new Blob([wbout], {
        type: "application/octet-stream"
      }),
      `工龄薪资${timeStep}.xlsx`
    );
  };

  const onAdd = () => {
    openImportAddDialog("add");
  };

  const onEdit = () => {
    if (!currentRow.value) return message.warning("请选择一条记录");
    openImportAddDialog("edit", currentRow.value);
  };

  const onDelete = () => {
    if (!currentRow.value) return message.warning("请选择一条记录");
    showMessageBox(`确认要删除【${currentRow.value?.staffName}】的记录吗?`)
      .then(() => {
        delWorkAgeMoneyList({ id: currentRow.value?.id }).then((res) => {
          if (res.data) message.success("删除成功");
          currentRow.value = null;
          onSearch();
        });
      })
      .catch(console.log);
  };

  const onReCalc = () => {
    showMessageBox(`确认要重算【${formData.calcYearMonth}】的记录吗?`)
      .then(() => {
        recalcWorkAgeMoneyList({ calcYearMonth: formData.calcYearMonth }).then((res) => {
          if (res.data) message.success("计算成功");
          currentRow.value = null;
          onSearch();
        });
      })
      .catch(console.log);
  };

  const buttonList = ref([
    { clickHandler: onAdd, type: "primary", text: "新增", isDropDown: false },
    { clickHandler: onEdit, type: "warning", text: "修改", isDropDown: false },
    { clickHandler: onDelete, type: "danger", text: "删除", isDropDown: false },
    { clickHandler: onReCalc, type: "primary", text: "手动重算", isDropDown: true },
    { clickHandler: onExport, type: "primary", text: "导出", isDropDown: true }
  ]);

  // 分页相关
  function onSizeChange(val: number) {
    formData.limit = val;
    onSearch();
  }

  function onCurrentChange(val: number) {
    formData.page = val;
    onSearch();
  }

  const openImportAddDialog = (type, row?) => {
    const title = { add: "新增", edit: "修改", view: "查看" };
    const formRef = ref();
    const _formData = reactive({
      calcYearMonth: row?.calcYearMonth ?? formData.calcYearMonth,
      createDate: row?.createDate ?? "",
      grade: row?.grade ?? "",
      id: row?.id,
      modifyDate: row?.modifyDate ?? "",
      senioritySalary: row?.senioritySalary ?? 0,
      serviceYears: row?.serviceYears ?? 0,
      staffId: row?.staffId,
      staffName: row?.staffName ?? ""
    });

    if (type === "add") {
      _formData["isSalary"] = "true";
    } else {
      if (typeof row?.isSalary === "boolean") {
        _formData["isSalary"] = row?.isSalary + "";
      } else {
        _formData["isSalary"] = undefined;
      }
    }

    addDialog({
      title: `${title[type]}工龄薪资`,
      props: {
        params: { groupCode: "1" },
        formConfig: [
          {
            formData: _formData,
            customProps: {
              staffName: {
                onClick: () => {
                  openUserSelectDialog((userRow) => {
                    _formData.staffId = userRow.id;
                    _formData.staffName = userRow.staffName;
                    _formData["deptId"] = userRow.deptId;
                  });
                }
              }
            },
            formProps: { labelWidth: "95px", size: "small" }
          }
        ]
      },
      width: "960px",
      class: "workage-modal",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      hideFooter: type === "view",
      contentRenderer: () => h(TableEditList, { ref: formRef }),
      beforeSure: (done) => {
        formRef.value.getRef().then(({ valid, data }) => {
          if (valid) {
            showMessageBox(`确认要${title[type]}吗?`)
              .then(() => {
                const params = { ..._formData };
                try {
                  const boolValue = JSON.parse(params["isSalary"]);
                  params["isSalary"] = boolValue;
                } catch (error) {
                  console.error("解析失败:", error);
                }
                saveWorkAgeMoneyList(params).then((res) => {
                  if (res.data) message.success(`${title[type]}成功`);
                  done();
                  onSearch();
                });
              })
              .catch(console.log);
          }
        });
      }
    });
  };

  function openUserSelectDialog(cb) {
    const formRef = ref();
    addDialog({
      title: "选择人员",
      props: {},
      width: "900px",
      class: "workage-user-modal",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(SelectStaffUser, { ref: formRef }),
      beforeSure: (done) => {
        const modalRef = formRef.value;
        if (!modalRef.currentRow) {
          message.warning("还未选择人员");
        } else {
          cb(modalRef.currentRow);
        }
        done();
      }
    });
  }

  const rowClick = (row) => (currentRow.value = row);

  const onDbClick = (row) => {
    currentRow.value = row;
    onEdit();
  };

  return {
    columns,
    onFresh,
    onDbClick,
    rowClick,
    queryParams,
    handleTagSearch,
    searchOptions,
    buttonList,
    maxHeight,
    loading,
    dataList,
    pagination,
    onSizeChange,
    onCurrentChange
  };
};
