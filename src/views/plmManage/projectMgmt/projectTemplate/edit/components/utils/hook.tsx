import { h, onMounted, reactive, ref } from "vue";
import { type PaginationProps } from "@pureadmin/table";

import { setColumn, tableEditRender, usePageSelect } from "@/utils/table";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { exportInStoreList, fetchInStoreList } from "@/api/supplyChain";
import {
  addTaskStoreList,
  exportTaskStoreList,
  fetchTaskStoreList,
  getDeliveryTemplateList,
  updateTaskStoreList,
  fetchAllTemplateList,
  saveRightTableList,
  delTaskStoreList,
  fetchProjectBeforeTaskOptionList
} from "@/api/plmManage";
import { ElMessage, ElMessageBox } from "element-plus";
import { formConfigs, formRules } from "./config";
import { addDialog } from "@/components/ReDialog";
import EditForm from "@/components/EditForm/index.vue";
import { getInductionAuditRoleInfo } from "@/api/oaManage/humanResources";
import { useRoute } from "vue-router";
import { PAGE_CONFIG } from "@/config/constant";

export const useConfig = ({ selectRowsCallBack, dataListRight }) => {
  const columns = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref([]);
  const dataList2 = ref([]);
  const dataMoalBindList = ref([]);
  const beforeTaskList = ref([]);
  const roleList = ref([]);
  const formLoading = ref(false);
  const rowData = ref();
  const currentRow: any = ref({});
  const allDeliverTemplates: any = ref([]);
  const modalSelectedRows = ref<any[]>([]);
  const tableRef = ref(null);
  // const beforeTaskList: any = ref([]);
  // 编辑表格
  const { editCellRender } = tableEditRender();

  const route = useRoute();

  const columns2 = ref<TableColumnList[]>([
    { label: "交付物名称", prop: "name", cellRenderer: (data) => editCellRender({ data }) },
    {
      label: "交付物模板",
      prop: "deliverableId",
      cellRenderer: (data) => {
        const options = allDeliverTemplates.value?.map(({ optionName, optionValue }) => ({ optionName, optionValue: Number(optionValue) }));
        return editCellRender({ type: "select", data, options: options, cellStyle: { color: "#606266" } });
      }
    },
    { label: "操作", prop: "operation", slot: "operation", width: 70 }
  ]);

  const formData: any = reactive({
    page: 1,
    limit: PAGE_CONFIG.pageSize
  });

  const pagination = reactive<PaginationProps>({
    ...PAGE_CONFIG /** 总条数 */,
    /** 分页尺寸 */
    small: false,
    /** 背景 */
    background: true,
    /** 分页位置 */
    align: "right",
    /** 当前页 */
    currentPage: 1
  });

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
    getInductionAuditRoleInfo({ deptIds: "6,24" })
      .then((res) => {
        if (res.data) {
          roleList.value = res.data;
        }
      })
      .finally(() => (formLoading.value = false));
  };

  const fetchBeforeTaskList = () => {
    fetchProjectBeforeTaskOptionList({ id: route.query.id }).then((res: any) => {
      if (res.data) {
        console.log(res.data, "前置任务");
        beforeTaskList.value = res.data;
      }
    });
  };

  onMounted(() => {
    getColumnConfig();
    fetchBeforeTaskList();
    onSearch();
    fetchRoleList();
    fetchDeliverTemplate();
  });

  const { setSelectCheckbox, setSelectChange, setSelectAllChange } = usePageSelect({ tableRef, dataList, rowsData: modalSelectedRows, uniId: "id" });

  const getColumnConfig = () => {
    const columnData: TableColumnList[] = [
      // { label: "", type: "selection", width: 40, align: "center", headerAlign: "center" },

      { label: "序号", type: "index", width: 60, align: "center", headerAlign: "center" },
      { label: "任务名称", prop: "taskName", minWidth: 100 },
      { label: "工期(天)", prop: "duration", width: 80, align: "right", headerAlign: "center" },
      { label: "负责岗位", prop: "relatedPost", slot: "relatedPost", minWidth: 80 },
      { label: "交付物", prop: "relevantPost1", slot: "relevantPost1", minWidth: 200 },
      { label: "相关岗位", prop: "relevantPost", slot: "relevantPost", minWidth: 120 }
      // {
      //   label: "前置任务",
      //   prop: "projectModelTaskRequirelist",
      //   minWidth: 120,
      //   cellRenderer: (data) => {
      //     // console.log(dataListRight.length, "dataListRight.value");
      //     const options = beforeTaskList.value?.map(({ taskModelName, id }) => ({ label: taskModelName, value: id }));
      //     if (dataListRight.length > 0) {
      //       return (
      //         <el-select collapse-tags filterable multiple v-model={data.row.projectModelTaskRequirelist} placeholder="请选择前置任务">
      //           {options.map((item) => (
      //             <el-option key={item.value} label={item.label} value={item.value} />
      //           ))}
      //         </el-select>
      //       );
      //     } else {
      //       return <div />;
      //     }
      //   }
      // }
    ];
    columns.value = setColumn({ columnData, operationColumn: false, indexColumn: false, selectionColumn: { hide: false }, radioColumn: false });
  };

  const onSearch = () => {
    loading.value = true;
    formData.projectModelId = route.query.id;
    console.log(formData, "req");
    fetchTaskStoreList(formData)
      .then((res: any) => {
        const data = res.data;
        loading.value = false;
        const rigthNames = dataListRight.map((item) => item.taskName);
        const filterResult = data.records.filter((item) => !rigthNames.includes(item.taskName));
        dataList.value = filterResult;
        pagination.total = data.total;
        // getColumnConfig();
        setSelectCheckbox();
      })
      .catch((err) => (loading.value = false));
  };

  const handleTagSearch = (values: any) => {
    formData.taskName = values.taskName;
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

  const rowClick = (row, column) => {
    // tableRef.value?.getTableRef()?.toggleRowSelection(row);
  };

  const addRight = () => {
    console.log("add");
    dataList2.value.push({});
  };

  const saveRight = () => {
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

  const delRight = ({ row, $index }) => {
    dataList2.value.splice($index, 1);
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

    const _formData = reactive({
      taskName: row?.taskName ?? "",
      duration: row?.duration ?? "",
      assignsTemplateVOS: row?.taskModelResponsibleRolesList[0]?.roleId || [],
      taskRelateRoleList: row?.taskRelateRoleList.map((item) => item.roleId) || [],
      deliverablesTemplateVOS: row?.taskModelDeliverablesList ?? []
    });

    addDialog({
      title: `${title}`,
      props: {
        loading: formLoading,
        formInline: _formData,
        formRules: formRules,
        formConfigs: formConfigs({ roleList, _formData, allDeliverTemplates })
      },
      width: "1100px",
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
    console.log(data, "save back");
    // 组装请求参数

    const taskModel: any = {
      duration: data.duration,
      taskName: data.taskName
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

  const handleSelectionChange = (rows) => {
    modalSelectedRows.value = rows;
    selectRowsCallBack(rows);
  };

  function onSelect(rows, row) {
    setSelectChange({ rows, row });
  }

  function onSelectAll(rows) {
    setSelectAllChange(rows);
  }

  return {
    columns,
    dataList,
    loading,
    modalSelectedRows,
    pagination,
    tableRef,
    onSearch,
    handleTagSearch,
    onCurrentChange,
    handleSelectionChange,
    handleSizeChange,
    rowClick,
    handleCurrentChange,
    onSelect,
    onSelectAll
  };
};
