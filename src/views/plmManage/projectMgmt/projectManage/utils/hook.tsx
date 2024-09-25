import { onMounted, reactive, ref, h } from "vue";
import { type PaginationProps } from "@pureadmin/table";

import { ElMessage, ElMessageBox } from "element-plus";
import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import EditForm from "@/components/EditForm/index.vue";

import { useEleHeight } from "@/hooks";
import {
  backProjectList,
  delProjectList,
  exportProjectManageList,
  fetchAllProjectMsgByProjectId,
  fetchAllProjectUserList,
  fetchProjectMgmtList,
  fetchProjectTemplateOpts,
  fetchProjectTemplatePersons,
  finishedProjectInfo,
  getBOMTableRowSelectOptions,
  restoreProjectInfo,
  saveProjectMgmtList,
  startProjectList,
  stopProjectInfo,
  submitProjectList
} from "@/api/plmManage";
import { addDialog } from "@/components/ReDialog";
import { formConfigs, formRules } from "../add/config";
import dayjs from "dayjs";
import { useRouter } from "vue-router";
import { PAGE_CONFIG } from "@/config/constant";

import Gantt from "../Gantt.vue";
import { cloneDeep } from "@pureadmin/utils";
import NodeDetailList from "@/components/NodeDetailList/index.vue";
import { downloadFile, getFileNameOnUrlPath } from "@/utils/common";
import { timeSettingList } from "@/api/oaManage/humanResources";
import { getDeptOptions } from "@/utils/requestApi";
import { useUserStore } from "@/store/modules/user";
import { message } from "@/utils/message";
import { getProductClassifyList } from "@/views/plmManage/productMgmt/classify/utils/hook";

export const useConfig = () => {
  const rowData = ref();
  const dataList = ref([]);
  const router = useRouter();
  const staffTime = ref("");
  const loading = ref<boolean>(false);
  const currentLeftRow: any = ref({});
  const columns = ref<TableColumnList[]>([]);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const responseRef = ref();
  const relationRef = ref();
  const manyRolesUserList = ref([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49 + 52);
  let formData: any = reactive({
    projectName: "",
    billNo: "",
    page: 1,
    limit: PAGE_CONFIG.pageSize
  });
  const searchOptions: any[] = reactive([
    { label: "项目编号", value: "billNo" },
    { label: "项目负责人", value: "projectUserId", children: [] },
    { label: "项目阶段", value: "modelProjectStateName", children: [] }
  ]);

  onMounted(() => {
    getOptionList();
    onSearch();
    fetchStaffTime();
  });

  const fetchStaffTime = () => {
    timeSettingList({}).then((res) => {
      if (res.data) {
        const timeInfo = res.data.find((item) => item.remark === "职员" && item.ruleNo === "001") || {};
        staffTime.value = (timeInfo as any).forenoonStart;
      }
    });
  };

  const getOptionList = () => {
    getBOMTableRowSelectOptions({ optioncode: "ProjectMgmtHeadUserRoleEnum,ProjectStage" }).then((res) => {
      if (res.data) {
        const result = res.data.find((item) => item.optionCode === "ProjectMgmtHeadUserRoleEnum")?.optionList.map((el) => el) || [];
        fetchAllProjectUserList({ roleIds: result.map((item) => item.optionValue) }).then((res: any) => {
          if (res.data) {
            manyRolesUserList.value = res.data;
            searchOptions[1].children = (res.data || []).map((item) => {
              return { value: item.id, label: item.userName };
            });
          }
        });
        const stageOpts = res.data.find((item) => item.optionCode === "ProjectStage")?.optionList || [];
        searchOptions[2].children = stageOpts.map((item) => ({ label: item.optionName, value: item.optionName }));
      }
    });
  };

  const getColumnConfig = async (buttonList) => {
    let columnData: TableColumnList[] = [
      { label: "", prop: "", align: "center", width: 40, slot: "choice" },
      { label: "序号", type: "index", prop: "index", width: 60, align: "center", headerAlign: "center" },
      { label: "项目编号", prop: "billNo", minWidth: 130 },
      { label: "项目名称", prop: "projectName", minWidth: 180 },
      { label: "项目负责人", prop: "projectUserName", minWidth: 90 },
      { label: "负责部门", prop: "deptName", minWidth: 90 },
      { label: "状态", prop: "stateName", minWidth: 70 },
      { label: "项目阶段", prop: "stageName", minWidth: 90 },
      { label: "项目模板", prop: "projectModelName", minWidth: 160 },
      { label: "立项日期", prop: "startDate", minWidth: 100 },
      { label: "计划结案日期", prop: "planEndDate", minWidth: 120 },
      { label: "项目工期(天)", prop: "duration", minWidth: 100, align: "right" },
      { label: "实际开始日期", prop: "realStartDate", minWidth: 120 },
      { label: "实际结束日期", prop: "realEndDate", minWidth: 120 },
      { label: "创建人", prop: "createUserName" },
      { label: "创建时间", prop: "createDate", width: 150, cellRenderer: (data) => <span>{dayjs(data.row.createDate).format("YYYY-MM-DD HH:mm:ss")}</span> },
      { label: "最后修改人", prop: "modifyUserName", width: 90 },
      { label: "最后修改时间", prop: "modifyDate", width: 150, cellRenderer: (data) => <span>{dayjs(data.row.modifyDate).format("YYYY-MM-DD HH:mm:ss")}</span> }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [menuCols] = columnArrs;
    if (menuCols?.length) columnData = menuCols;
    updateButtonList(buttonList, buttonArrs[0]);
    const fetchCols: any = dataList.value.map((item) => Object.keys(item.dynamicFieldMaps)).flat(Infinity);
    const resFilterArr: any[] = [...new Set(fetchCols)];
    const findCreateUserIdx = columnData.findIndex((el) => el.prop === "createUserName");

    if (findCreateUserIdx >= 0) {
      resFilterArr.forEach((el) =>
        columnData.splice(findCreateUserIdx, 0, {
          label: el,
          prop: el,
          minWidth: 100,
          cellRenderer(data) {
            const dataTask = data.row.dynamicFieldMaps[el];
            return <div>{dataTask}</div>;
          }
        })
      );
    }

    columns.value = setColumn({ columnData, operationColumn: { hide: false, minWidth: 80 } });
    return columnData;
  };

  const onSearch = () => {
    fetchProjectMgmtList(formData)
      .then((res: any) => {
        const data = res.data;
        loading.value = false;
        dataList.value = data.records || [];
        getColumnConfig(buttonList);
        pagination.total = data.total;

        const _rowIndex = dataList.value.findIndex((item) => item.id === currentLeftRow.value?.id);
        if (_rowIndex >= 0) {
          currentLeftRow.value = data.records[_rowIndex] || {};
        }
      })
      .catch((err) => (loading.value = false));
  };

  const onFresh = () => {
    onSearch();
    getColumnConfig(buttonList);
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

  // 添加单据
  const onAdd = () => {
    openDialog("add");
  };

  const openDialog = async (type: string, row?) => {
    const titleObj = { add: "项目新增", edit: "项目修改", view: "项目查看" };
    const title = titleObj[type];
    const formRef = ref();
    const projectUsers = ref([]);
    const productClassifyList = ref([]);
    const projectTemplateOptsList = ref([]);
    const formLoading = ref(true);
    const treeSelectData = ref([]);

    const _formData: any = reactive({});

    const getInitUser = (item, detailInfo, type) => {
      if (item && detailInfo && type) {
        const initGroupInfo = detailInfo[type].find((el) => el.id === item.id) || {};
        if (initGroupInfo.userInfoVOList) {
          return initGroupInfo.userInfoVOList[0]?.id;
        }
        return undefined;
      }
    };

    const changeModel = (val, detailInfo?) => {
      // TODO: 在此处获取模版的负责人和相关人
      setTimeout(() => {
        console.log(formRef.value?.getRef(), "formRef");
        responseRef.value.loading = true;
        relationRef.value.loading = true;
        responseRef.value.dataList = [];
        relationRef.value.dataList = [];
        fetchProjectTemplatePersons({ id: val })
          .then((res: any) => {
            if (res.data) {
              const { projectModelRelatePersonnel = [], projectModelResponsiblePersonnel = [] } = res.data;
              responseRef.value.dataList = projectModelResponsiblePersonnel.map((item) => {
                item.userOptions = item.userInfoVOList;
                item.userInfoVOList = type === "edit" ? getInitUser(item, detailInfo, "projectModelResponsiblePersonnel") : undefined;
                return item;
              });
              _formData.responseInfo = responseRef.value.dataList;
              const responseUserRoleIds = responseRef.value.dataList.map((item) => item.id);

              relationRef.value.dataList = projectModelRelatePersonnel.map((item) => {
                item.userOptions = item.userInfoVOList;
                item.userInfoVOList = type === "edit" ? getInitUser(item, detailInfo, "projectModelRelatePersonnel") : undefined;
                return item;
              });
              // .filter((item) => !responseUserRoleIds.includes(item.id));

              _formData.relationInfo = relationRef.value.dataList;
            }
          })
          .finally(() => {
            responseRef.value.loading = false;
            relationRef.value.loading = false;
          });
      });
    };

    if (type === "add") {
      _formData.deptId = useUserStore().userInfo.deptId + "";
    }
    if (["edit", "view"].includes(type)) {
      fetchProjectMgmtList({ page: 1, limit: 10, id: row.id })
        .then((res: any) => {
          if (res.data?.records.length) {
            const detailInfo = res.data.records[0] || {};
            console.log(detailInfo, "项目详情数据");
            Object.keys(detailInfo).forEach((el) => (_formData[el] = detailInfo[el]));
            _formData.deptId = detailInfo.deptId + "";
            changeModel(detailInfo.projectModelId, detailInfo);
          }
        })
        .finally(() => (formLoading.value = false));
    }

    projectUsers.value = manyRolesUserList.value.map((item) => ({ userId: item.id, userName: item.userName }));

    getProductClassifyList({})
      .then((data) => (productClassifyList.value = data.sort((a, b) => Date.parse(a.createDate) - Date.parse(b.createDate))))
      .finally(() => (formLoading.value = false));

    fetchProjectTemplateOpts({ page: 1, limit: 10000, projectModelCode: "", projectModelName: "" })
      .then((res: any) => {
        if (res.data && Array.isArray(res.data.records) && res.data.records.length) {
          projectTemplateOptsList.value = res.data.records.map((item) => ({ label: item.projectModelName, value: item.id }));
        }
      })
      .finally(() => (formLoading.value = false));

    getDeptOptions().then((data: any) => {
      treeSelectData.value = data;
    });

    addDialog({
      title: `${title}`,
      props: {
        loading: formLoading,
        formInline: _formData,
        formRules: formRules,
        formConfigs: formConfigs(
          {
            projectUsers: projectUsers,
            _formData,
            treeSelectData,
            productClassifyList: productClassifyList,
            projectTemplateOptsList: projectTemplateOptsList,
            changeModel,
            responseRef,
            relationRef,
            isDetail: false,
            isList: true
          },
          type
        )
      },
      width: "1200px",
      draggable: true,
      fullscreenIcon: true,
      okButtonText: "保存",
      cancelButtonText: "关闭",
      closeOnClickModal: false,
      hideFooter: type === "view",
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.validate(async (valid) => {
          if (valid) {
            const resLeftList = responseRef.value.dataList;
            const relationList = relationRef.value.dataList;

            if (resLeftList.length && resLeftList.every((item) => item.userInfoVOList)) {
              ElMessageBox.confirm(`确认要${title}吗?`, "系统提示", {
                type: "warning",
                draggable: true,
                cancelButtonText: "取消",
                confirmButtonText: "确定",
                dangerouslyUseHTMLString: true
              }).then(() => {
                onSubmitChange(
                  type,
                  title,
                  _formData,
                  () => {
                    done();
                    onSearch();
                  },
                  {
                    projectUsers: projectUsers,
                    productClassifyList: productClassifyList,
                    projectTemplateOptsList: projectTemplateOptsList,
                    changeModel,
                    isList: true
                  }
                );
              });
            } else if (resLeftList.every((item) => item.userInfoVOList) && !relationList.length) {
              ElMessageBox.confirm(`确认要${title}吗?`, "系统提示", {
                type: "warning",
                draggable: true,
                cancelButtonText: "取消",
                confirmButtonText: "确定",
                dangerouslyUseHTMLString: true
              }).then(() => {
                onSubmitChange(
                  type,
                  title,
                  _formData,
                  () => {
                    done();
                    onSearch();
                  },
                  {
                    projectUsers: projectUsers,
                    productClassifyList: productClassifyList,
                    projectTemplateOptsList: projectTemplateOptsList,
                    changeModel,
                    isList: true
                  }
                );
              });
            }
          }
        });
      }
    });
  };

  const onSubmitChange = (type: string, title: string, data, callback?, opts?) => {
    console.log(data, "data");
    console.log(opts.projectUsers.value, "opts.projectUsers.value");
    const copyData = cloneDeep(data);
    const projectModelResponsiblePersonne = copyData.responseInfo
      ?.map((item) => ({
        ...item,
        userInfoVOList: [item.userOptions.find((el) => el.id === item.userInfoVOList)]
      }))
      .map((item) => {
        delete item.userOptions;
        return item;
      });

    copyData.projectModelResponsiblePersonnel = projectModelResponsiblePersonne;

    if (data.relationInfo) {
      const projectModelRelatePersonnel = copyData.relationInfo
        ?.map((item) => ({
          ...item,
          userInfoVOList: item.userOptions.find((el) => el.id === item.userInfoVOList) ? [item.userOptions.find((el) => el.id === item.userInfoVOList)] : []
        }))
        .map((item) => {
          delete item.userOptions;
          return item;
        });
      copyData.projectModelRelatePersonnel = projectModelRelatePersonnel;
    }
    copyData.startDate = dayjs(data.startDate).format("YYYY-MM-DD");
    copyData.productCategoryId = opts.productClassifyList.value?.find((item) => item.id == data.productCategoryId)["id"];
    copyData.projectUserId = data.projectUserId;

    delete copyData.projectUserName;
    delete copyData.responseInfo;
    delete copyData.relationInfo;

    const {
      productCategoryId,
      customerName,
      id,
      deptId,
      projectModelId,
      projectModelRelatePersonnel,
      projectModelResponsiblePersonnel,
      projectName,
      projectUserId,
      startDate
    } = copyData;

    const copyEditData = {
      productCategoryId,
      projectModelId,
      projectModelRelatePersonnel,
      projectModelResponsiblePersonnel,
      projectName,
      deptId,
      customerName,
      projectUserId,
      startDate,
      id
    };

    if (copyData.projectModelRelatePersonnel.length) {
      const validRelate = copyData.projectModelRelatePersonnel.some((item) => !item.userInfoVOList.length);
      if (validRelate) return message("请填写相关人员", { type: "error" });
    }

    saveProjectMgmtList(type === "add" ? copyData : copyEditData)
      .then((res: any) => {
        if (res.data && res.data.projectModelId) {
          callback();
          ElMessage({ message: "保存成功", type: "success" });
        }
      })
      .catch(console.log);
  };

  const onEdit = () => {
    if (JSON.stringify(currentLeftRow.value) === "{}") {
      ElMessage({ message: "请选择记录", type: "warning" });
      return;
    }

    if ([0, 3].includes(currentLeftRow.value.billState)) {
      router.push(
        "/plmManage/projectMgmt/projectManage/edit/index?modelId=" +
          currentLeftRow.value.projectModelId +
          "&id=" +
          currentLeftRow.value.id +
          "&time=" +
          staffTime.value
      );
    } else {
      router.push(`/plmManage/projectMgmt/projectManage/add/index?id=${currentLeftRow.value.id}`);
    }
  };

  const onDelete = () => {
    if (JSON.stringify(currentLeftRow.value) !== "{}") {
      const row = currentLeftRow.value;
      if (![0, 3].includes(row.billState)) return message("只有待提交和重新审核才能进行删除", { type: "error" });
      ElMessageBox.confirm(`确认要删除名称为【${row.projectName}】的项目吗?`, "系统提示", {
        type: "warning",
        draggable: true,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          loading.value = true;
          delProjectList([row.id]).then((res) => {
            if (res.data) {
              ElMessage({ message: `删除成功`, type: "success" });
              currentLeftRow.value = {};
              onSearch();
            }
          });
        })
        .catch(() => {})
        .finally(() => (loading.value = false));
    } else {
      ElMessage({ message: `请选择记录`, type: "warning" });
    }
  };

  const onSubmitAction = () => {
    if (JSON.stringify(currentLeftRow.value) !== "{}") {
      const row = currentLeftRow.value;
      ElMessageBox.confirm(`确认要提交名称为【${row.projectName}】的项目吗?`, "系统提示", {
        type: "warning",
        draggable: true,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          loading.value = true;
          submitProjectList({ id: row.id }).then((res) => {
            if (res.data) {
              ElMessage({ message: `提交成功`, type: "success" });
              onSearch();
            }
          });
        })
        .catch(() => {})
        .finally(() => (loading.value = false));
    } else {
      ElMessage({ message: `请选择记录`, type: "warning" });
    }
  };

  const onStart = () => {
    if (JSON.stringify(currentLeftRow.value) !== "{}") {
      console.log(currentLeftRow.value.projectState, "ps");
      if ([5, 11].includes(currentLeftRow.value?.projectState)) return message("启动失败，项目已终止", { type: "error" });
      const row = currentLeftRow.value;
      ElMessageBox.confirm(`确认要启动名称为【${row.projectName}】的项目吗?`, "系统提示", {
        type: "warning",
        draggable: true,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          loading.value = true;
          startProjectList({ id: row.id }).then((res) => {
            if (res.data) {
              ElMessage({ message: `启动成功`, type: "success" });
              onSearch();
            }
          });
        })
        .catch(() => {})
        .finally(() => (loading.value = false));
    } else {
      ElMessage({ message: `请选择记录`, type: "warning" });
    }
  };

  const onBackAction = () => {
    if (JSON.stringify(currentLeftRow.value) !== "{}") {
      const curRowBillState = currentLeftRow.value?.billState;
      if (![1, 2].includes(curRowBillState)) return message("当前单据不能回退", { type: "error" });
      const row = currentLeftRow.value;
      ElMessageBox.confirm(`确认要回退名称为【${row.projectName}】的项目吗?`, "系统提示", {
        type: "warning",
        draggable: true,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          loading.value = true;
          backProjectList({ id: row.id }).then((res) => {
            if (res.data) {
              ElMessage({ message: `回退成功`, type: "success" });
              onSearch();
            }
          });
        })
        .catch(() => {})
        .finally(() => (loading.value = false));
    } else {
      ElMessage({ message: `请选择记录`, type: "warning" });
    }
  };

  const onExport = async () => {
    loading.value = true;
    const calcHeader = columns.value
      .map((item, index) => {
        return { field: item.prop, title: item.label, width: 160, key: `0-${index}`, hide: false, colspan: 1, rowspan: 1, type: "normal", colGroup: false };
      })
      .filter((el) => el.field && el.field !== "index");

    const headConfig = { excelName: "项目管理", excelHeader: JSON.stringify(calcHeader) };

    exportProjectManageList(headConfig)
      .then((res: any) => {
        if (res.data) {
          const fileName = getFileNameOnUrlPath(res.data);
          downloadFile(res.data, fileName, true);
        }
      })
      .catch((err) => {
        console.log("err", err);
      })
      .finally(() => (loading.value = false));
  };

  const leftRowDbClick = (row) => {
    if ([0, 3].includes(currentLeftRow.value.billState)) {
      router.push("/plmManage/projectMgmt/projectManage/edit/index?modelId=" + row.projectModelId + "&id=" + row.id + "&time=" + staffTime.value);
    } else {
      router.push("/plmManage/projectMgmt/projectManage/add/index?modelId=" + row.projectModelId + "&id=" + row.id + "&time=" + staffTime.value);
    }
  };

  const leftRowClick = (row) => {
    currentLeftRow.value = row;
  };
  const onViewGantt = (row) => {
    const formRef = ref();
    setTimeout(() => {
      formRef.value.loading = true;
      fetchAllProjectMsgByProjectId({ id: row.id })
        .then((res: any) => {
          if (res.data) {
            console.log(res.data, "list data");
            formRef.value?.setGanttRefData(res.data);
          }
        })
        .finally(() => {
          formRef.value.loading = false;
        });
    });
    addDialog({
      title: "甘特图",
      width: "100%",
      draggable: true,
      fullscreen: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      class: "full-dialog",
      destroyOnClose: true,
      hideItem: ["cancel"],
      contentRenderer: () => h(Gantt, { ref: formRef }),
      beforeSure: (done, { options }) => done()
    });
  };

  const onAuditDetail = () => {
    if (JSON.stringify(currentLeftRow.value) == "{}") {
      ElMessage({ message: "请选择一条记录", type: "warning" });
      return;
    }
    addDialog({
      title: "查看审批节点详情",
      width: "900px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: true,
      hideFooter: true,
      class: "view-bill_audit",
      contentRenderer: ({ options }) =>
        h(NodeDetailList, { options, billNo: currentLeftRow.value.billNo, billType: "projectInfo", billState: +currentLeftRow.value.billState })
    });
  };

  const onPrintAction = () => {
    if (JSON.stringify(currentLeftRow.value) == "{}" || !currentLeftRow.value) {
      ElMessage({ message: "请选择一条记录", type: "warning" });
      return;
    }
    router.push(`/plmManage/projectMgmt/projectManage/print/index?id=${currentLeftRow.value.id}`);
  };

  const onStopAction = () => {
    if (JSON.stringify(currentLeftRow.value) == "{}" || !currentLeftRow.value) {
      ElMessage({ message: "请选择一条记录", type: "warning" });
      return;
    }
    if (currentLeftRow.value?.billState === 2 && currentLeftRow.value?.projectState === 1) {
      ElMessageBox.confirm(`确认要暂停名称为【${currentLeftRow.value.projectName}】的项目吗?`, "系统提示", {
        type: "warning",
        draggable: true,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          stopProjectInfo({ billNo: currentLeftRow.value?.billNo }).then((res) => {
            if (res.status === 200 || res.data) {
              message("暂停成功", { type: "success" });
              onSearch();
            }
          });
        })
        .catch(console.log);
    } else {
      ElMessage({ message: "当前状态不能暂停", type: "error" });
    }
  };

  const onCancelAction = () => {
    if (JSON.stringify(currentLeftRow.value) == "{}" || !currentLeftRow.value) {
      ElMessage({ message: "请选择一条记录", type: "warning" });
      return;
    }
    if (currentLeftRow.value?.billState === 2 && [0, 1].includes(currentLeftRow.value?.projectState)) {
      ElMessageBox.confirm(`确认要终止名称为【${currentLeftRow.value.projectName}】的项目吗?`, "系统提示", {
        type: "warning",
        draggable: true,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          finishedProjectInfo({ billNo: currentLeftRow.value?.billNo }).then((res) => {
            if (res.status === 200 || res.data) {
              message("终止成功", { type: "success" });
              onSearch();
            }
          });
        })
        .catch(console.log);
    } else {
      ElMessage({ message: "当前状态不能终止", type: "error" });
    }
  };

  const onRestoreAction = () => {
    if (JSON.stringify(currentLeftRow.value) == "{}" || !currentLeftRow.value) {
      ElMessage({ message: "请选择一条记录", type: "warning" });
      return;
    }

    ElMessageBox.confirm(`确认要恢复名称为【${currentLeftRow.value.projectName}】的项目吗?`, "系统提示", {
      type: "warning",
      draggable: true,
      cancelButtonText: "取消",
      confirmButtonText: "确定",
      dangerouslyUseHTMLString: true
    })
      .then(() => {
        restoreProjectInfo({ billNo: currentLeftRow.value?.billNo }).then((res) => {
          if (res.status === 200 || res.data) {
            message("恢复成功", { type: "success" });
            onSearch();
          }
        });
      })
      .catch(console.log);
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "新增" },
    { clickHandler: onEdit, type: "warning", text: "修改" },
    { clickHandler: onDelete, type: "danger", text: "删除" },
    { clickHandler: onSubmitAction, type: "primary", text: "提交" },
    { clickHandler: onStart, type: "success", text: "启动" },
    { clickHandler: onAuditDetail, type: "info", text: "审批详情", isDropDown: true },
    { clickHandler: onBackAction, type: "info", text: "回退", isDropDown: true },
    { clickHandler: onStopAction, type: "info", text: "暂停", isDropDown: true },
    { clickHandler: onRestoreAction, type: "info", text: "恢复", isDropDown: true },
    { clickHandler: onCancelAction, type: "info", text: "终止", isDropDown: true },
    { clickHandler: onPrintAction, type: "info", text: "打印", isDropDown: true },
    { clickHandler: onExport, type: "info", text: "导出", isDropDown: true }
  ]);

  const cellStyle = ({ row, column, rowIndex, columnIndex }) => {
    if (row.taskIsExpired && column.property === "stageName") {
      return { color: "red" };
    }
  };

  return {
    columns,
    dataList,
    loading,
    maxHeight,
    pagination,
    searchOptions,
    buttonList,
    onSearch,
    onFresh,
    handleTagSearch,
    onCurrentChange,
    handleSizeChange,
    leftRowDbClick,
    leftRowClick,
    onViewGantt,
    cellStyle,
    handleCurrentChange
  };
};
