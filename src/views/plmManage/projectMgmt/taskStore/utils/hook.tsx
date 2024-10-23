import { h, onMounted, reactive, ref } from "vue";
import { type PaginationProps } from "@pureadmin/table";

import { getMenuColumns, setColumn, updateButtonList, tableEditRender } from "@/utils/table";
import { useEleHeight } from "@/hooks";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import {
  addTaskStoreList,
  exportTaskStoreList,
  fetchTaskStoreList,
  updateTaskStoreList,
  fetchAllTemplateList,
  saveRightTableList,
  delTaskStoreList
} from "@/api/plmManage";
import { ElMessage, ElMessageBox } from "element-plus";
import { formConfigs, formRules } from "./config";
import { addDialog } from "@/components/ReDialog";
import EditForm from "@/components/EditForm/index.vue";
import { getInductionAuditRoleInfo } from "@/api/oaManage/humanResources";

import { PAGE_CONFIG } from "@/config/constant";
import { message } from "@/utils/message";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const loading2 = ref<boolean>(false);
  const dataList = ref([]);
  const currentRightRow: any = ref({});
  const dataList2 = ref([]);
  const roleList = ref([]);
  const formLoading = ref(false);
  const rowData = ref();
  const currentRow: any = ref({});
  const allDeliverTemplates: any = ref([]);

  const columns2 = ref<TableColumnList[]>([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49 + 45);

  let formData: any = reactive({
    startTime: "",
    endTime: "",
    date: "",
    page: 1,
    limit: PAGE_CONFIG.pageSize,
    mnemonicCode: ""
  });

  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const searchOptions: SearchOptionType[] = [{ label: "日期范围", value: "date", type: "daterange", format: "YYYY-MM-DD" }];

  const fetchDeliverTemplate = () => {
    fetchAllTemplateList({}).then((res: any) => {
      if (res.data) {
        const resultData = res.data || [];
        allDeliverTemplates.value = resultData.map((item) => ({ optionName: item.name, optionValue: item.id }));
      }
    });
  };

  const fetchRoleList = () => {
    formLoading.value = true;
    getInductionAuditRoleInfo({})
      .then((res) => {
        if (res.data) {
          roleList.value = res.data;
        }
      })
      .finally(() => (formLoading.value = false));
  };

  onMounted(() => {
    getColumnConfig({ buttonList, buttonList2 });
    onSearch();
    fetchRoleList();
    fetchDeliverTemplate();
  });

  // 编辑表格
  const { editCellRender } = tableEditRender();

  const getColumnConfig = async (btns) => {
    const nameRender = (data) => editCellRender({ data });
    const modelRender = (data) => {
      const options = allDeliverTemplates.value?.map(({ optionName, optionValue }) => ({ optionName, optionValue: Number(optionValue) }));
      return editCellRender({ type: "select", data, options: options, cellStyle: { color: "#606266", textAlign: "left" } });
    };

    let columnData: TableColumnList[] = [
      { label: "序号", type: "index", width: 60, align: "center", headerAlign: "center" },
      { label: "任务名称", prop: "taskName", minWidth: 200 },
      { label: "工期(天)", prop: "duration", width: 80, align: "center", headerAlign: "center" },
      { label: "负责岗位", prop: "relatedPost", slot: "relatedPost", minWidth: 160 },
      { label: "交付物", prop: "relevantPost1", slot: "relevantPost1", minWidth: 200 },
      { label: "相关岗位", prop: "relevantPost", slot: "relevantPost", minWidth: 120 },
      { label: "创建人", prop: "createUser", width: 90 },
      { label: "创建时间", prop: "createDate", minWidth: 160 },
      { label: "修改人", prop: "updateUser", width: 90 },
      { label: "修改时间", prop: "modifyDate", minWidth: 160 }
    ];

    let columnData2: TableColumnList[] = [
      { label: "交付物名称", prop: "name", cellRenderer: nameRender },
      {
        label: "交付物模板",
        prop: "deliverableId",
        align: "left",
        cellRenderer: modelRender
      }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns([{}, { name: nameRender, deliverableId: modelRender }]);
    const [data, data2] = columnArrs;
    if (data?.length) {
      columnData = data;
      updateButtonList(btns.buttonList, buttonArrs[0]);
    }
    if (data2?.length) {
      columnData2 = data2;
      updateButtonList(btns.buttonList2, buttonArrs[1]);
    }
    columns.value = setColumn({ columnData, operationColumn: false });
    columns2.value = setColumn({ columnData: columnData2, operationColumn: false });
  };

  const onSearch = () => {
    loading.value = true;
    const { date = "" } = formData;
    console.log(formData, "df");
    const [startTime, endTime] = date ? date.split("~").map((item) => item.trim()) : [undefined, undefined];
    formData.startTime = startTime;
    formData.endTime = endTime;
    if (!date) formData.date = undefined;
    console.log(formData, "req");
    fetchTaskStoreList(formData)
      .then((res: any) => {
        const data = res.data;
        loading.value = false;
        dataList.value = data.records || [];
        pagination.total = data.total;
      })
      .catch((err) => (loading.value = false));
  };

  const onFresh = () => {
    getColumnConfig(buttonList);
    onSearch();
  };

  const handleTagSearch = (values = {}) => {
    const { page, limit } = formData;
    Object.keys(values)?.forEach((key) => {
      formData[key] = values[key];
    });
    formData = { ...values };

    formData.page = page;
    formData.limit = limit;
    onSearch();
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

  const onCurrentChange = (row) => {
    if (!row) return;
    rowData.value = row;
  };

  // 导出单据
  const onExport = () => {
    loading.value = true;
    const excelHeader = columns.value.map((item, index) => {
      return { field: item.prop, title: item.label, width: 160, key: `0-${index}}`, hide: false, colspan: 1, rowspan: 1, type: "normal", colGroup: false };
    });

    const headConfig = {
      ...formData,
      page: 1,
      limit: 100000,
      excel: {
        excelName: "任务库表",
        excelHeader: JSON.stringify(excelHeader)
      }
    };

    exportTaskStoreList(headConfig)
      .then((res: any) => {
        window.open("/api" + res.data, "_blank");
      })
      .catch((err) => {
        console.log("err", err);
      })
      .finally(() => (loading.value = false));
  };

  const rowClick = (row) => {
    currentRow.value = row;
    dataList2.value = JSON.parse(JSON.stringify(row.taskModelDeliverablesList));
  };

  const addRight = () => {
    console.log("add");
    dataList2.value.push({});
  };

  const saveRight = () => {
    const flag = dataList2.value.some((item) => item.deliverableId == "0" || !item.deliverableId);
    const flag2 = dataList2.value.some((item) => !item.name);
    if (flag) return message("还未选择交付物模版", { type: "error" });
    if (flag2) return message("请填写交付物名称", { type: "error" });

    const reqParams = {
      id: currentRow.value.id,
      taskModelDeliverablesList: dataList2.value.map((item) => ({
        deliverableId: item.deliverableId,
        name: item.name,
        taskModelId: currentRow.value.id
      }))
    };
    saveRightTableList({ ...reqParams }).then((res) => {
      if (res.data) {
        ElMessage({ message: "保存成功", type: "success" });
        onSearch();
      }
    });
  };

  const delRight = () => {
    if (JSON.stringify(currentRightRow.value) == "{}" || !currentRightRow.value) {
      ElMessage({ message: "请选择交付物", type: "warning" });
      return;
    }

    const delIdx = dataList2.value.findIndex((item) => item.id === currentRightRow.value.id);
    if (delIdx >= 0) {
      dataList2.value.splice(delIdx, 1);
    }
    console.log(currentRightRow.value, "$currentRightRow.value.id");
  };

  const onAdd = () => {
    openDialog("add");
  };

  const onEdit = () => {
    if (JSON.stringify(currentRow.value) === "{}") {
      ElMessage({ message: "请选择一条记录", type: "warning" });
    } else {
      openDialog("edit", currentRow.value);
    }
  };

  const onDelete = () => {
    if (JSON.stringify(currentRow.value) === "{}") {
      ElMessage({ message: "请选择一条记录", type: "warning" });
    } else {
      ElMessageBox.confirm(`确认要删除名称为【${currentRow.value.taskName}】的任务吗?`, "系统提示", {
        type: "warning",
        draggable: true,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          loading.value = true;
          delTaskStoreList({ id: currentRow.value.id }).then((res) => {
            if (res.data) {
              ElMessage({ message: `删除成功`, type: "success" });
              currentRow.value = {};
              onSearch();
            }
          });
        })
        .catch(() => {})
        .finally(() => (loading.value = false));
    }
  };

  const openDialog = async (type: string, row?) => {
    const titleObj = { add: "新增", edit: "修改", view: "查看" };
    const title = titleObj[type];
    const formRef = ref();
    const allTaskNames = ref<Array<string>>([]);

    const _formData = reactive({
      taskName: row?.taskName ?? "",
      duration: row?.duration ?? "",
      assignsTemplateVOS: row?.taskModelResponsibleRolesList[0]?.roleId || [],
      taskRelateRoleList: row?.taskRelateRoleList.map((item) => item.roleId) || [],
      keyTask: row?.keyTask ?? false,
      deliverablesTemplateVOS: row?.taskModelDeliverablesList ?? []
    });

    if (type === "add") {
      // 获取所有任务名称做同名限制
      fetchTaskStoreList({ page: 1, limit: 1000000 }).then((res: any) => {
        if (res.data) {
          const result = res.data.records || [];
          const resultName = result.map((item) => item.taskName);
          allTaskNames.value = resultName;
        }
      });
    }

    addDialog({
      title: `${title}`,
      props: {
        loading: formLoading,
        formInline: _formData,
        formRules: formRules,
        formConfigs: formConfigs({ roleList, _formData, allDeliverTemplates })
      },
      width: "1200px",
      draggable: true,
      fullscreenIcon: true,
      hideFooter: type === "view",
      closeOnClickModal: false,
      okButtonText: "保存",
      cancelButtonText: "关闭",
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();

        FormRef.validate(async (valid) => {
          if (valid) {
            const isUniqueName = allTaskNames.value.includes(_formData.taskName);
            if (type === "add" && isUniqueName) return message("不能添加已存在的任务名称", { type: "error" });
            ElMessageBox.confirm(`确认要${title}吗?`, "系统提示", {
              type: "warning",
              draggable: true,
              cancelButtonText: "取消",
              confirmButtonText: "确定",
              dangerouslyUseHTMLString: true
            }).then(() => {
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

  const onSubmitChange = (type: string, title: string, data, callback) => {
    if (!data.deliverablesTemplateVOS?.length) return message("还未添加交付物", { type: "error" });

    const nameMsg = data.deliverablesTemplateVOS.some((item) => !item.name);
    if (nameMsg) return message("请填写交付物名称", { type: "error" });

    const deliverableMsg = data.deliverablesTemplateVOS.some((item) => !item.deliverableId);
    if (deliverableMsg) return message("请选择交付物模版", { type: "error" });
    console.log(data, "save back");
    // 组装请求参数

    const taskModel: any = {
      duration: data.duration,
      taskName: data.taskName,
      keyTask: data.keyTask
    };

    if (type === "edit") taskModel.id = currentRow.value.id;
    const reqParams = {
      taskModel,
      taskModelDeliverablesList: data.deliverablesTemplateVOS.map((item) => ({ name: item.name, deliverableId: item.deliverableId })),
      taskModelResponsibleRolesList: [{ roleId: data.assignsTemplateVOS }],
      taskRelateRoleList: data.taskRelateRoleList?.map((item) => ({ roleId: item }))
    };

    console.log(reqParams, "请求参数");
    const APIs = { add: addTaskStoreList, edit: updateTaskStoreList };

    APIs[type](reqParams).then((res) => {
      if (res.data) {
        ElMessage({ message: "保存成功", type: "success" });
        callback();
      }
    });
  };

  const rowDbClick = (row) => {
    currentRow.value = row;
    onEdit();
  };

  const rowClickRight = (row, column) => {
    currentRightRow.value = row;
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "新增", isDropDown: false },
    { clickHandler: onEdit, type: "warning", text: "修改", isDropDown: false },
    { clickHandler: onDelete, type: "danger", text: "删除", isDropDown: false },
    { clickHandler: onExport, type: "primary", text: "导出", isDropDown: true }
  ]);

  const buttonList2 = ref<ButtonItemType[]>([
    { clickHandler: addRight, type: "primary", text: "新增交付物", size: "small", isDropDown: false },
    { clickHandler: delRight, type: "danger", text: "删除交付物", size: "small", isDropDown: false },
    { clickHandler: saveRight, type: "warning", text: "保存交付物", size: "small", isDropDown: false }
  ]);

  return {
    loading,
    loading2,
    currentRow,
    columns,
    columns2,
    dataList,
    dataList2,
    maxHeight,
    pagination,
    searchOptions,
    buttonList,
    buttonList2,
    onSearch,
    onFresh,
    addRight,
    delRight,
    saveRight,
    handleTagSearch,
    onCurrentChange,
    handleSizeChange,
    rowClick,
    rowDbClick,
    rowClickRight,
    handleCurrentChange
  };
};
