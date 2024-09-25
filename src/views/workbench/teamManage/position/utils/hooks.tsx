/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-09-12 18:10:49
 */

import {
  TeamDutyItemType,
  TeamPostItemType,
  addTeamDuty,
  addTeamPost,
  addTeamTemplate,
  deleteTeamDuty,
  deleteTeamPost,
  deleteTeamTemplate,
  teamDutyList,
  teamPostList,
  teamTemplateList,
  updateTeamDuty,
  updateTeamPost,
  updateTeamTemplate
} from "@/api/workbench/teamManage";
import { formConfigs, formConfigs3, formRules, formRules3 } from "./config";
import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { h, onMounted, reactive, ref } from "vue";
import { message, showMessageBox } from "@/utils/message";

import { DeptInfoItemType } from "@/api/systemManage";
import EditForm from "@/components/EditForm/index.vue";
import { Plus } from "@element-plus/icons-vue";
import { TableGroupItemType } from "@/api/systemManage";
import { addDialog } from "@/components/ReDialog";
import { useEleHeight } from "@/hooks";

export const useConfig = () => {
  const loading = ref<boolean>(false);
  const loading2 = ref<boolean>(false);
  const loading3 = ref<boolean>(false);
  const columns = ref<TableColumnList[]>([]);
  const columns2 = ref<TableColumnList[]>([]);
  const columns3 = ref<TableColumnList[]>([]);
  const dataList = ref<TeamPostItemType[]>([]);
  const dataList2 = ref<TeamDutyItemType[]>([]);
  const dataList3 = ref<any[]>([]);
  const rowData = ref<TeamPostItemType>();
  const rowData2 = ref<TeamDutyItemType>();
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 51);
  const queryForm = reactive({ limit: 10000, page: 1 });
  const groupArrsList = ref<TableGroupItemType[]>([]);

  onMounted(() => {
    getColumnConfig();
    getTableList();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "岗位编号", prop: "roleCode", minWidth: "100", align: "left" },
      { label: "岗位名称", prop: "roleName", minWidth: "120", align: "left", sortable: true },
      { label: "编制人数", prop: "staffingPeopleCount", minWidth: "100", align: "left" },
      { label: "岗位隶属人数", prop: "rolePeopleCount", minWidth: "120", align: "left" },
      { label: "说明", prop: "remark", minWidth: "140", align: "left" }
    ];
    let columnData2: TableColumnList[] = [
      { label: "岗位职责", prop: "responsibilities", minWidth: "180", align: "center" }
      //
    ];
    let columnData3: TableColumnList[] = [
      { label: "文件模板", prop: "fileName", minWidth: "160", align: "left" },
      { label: "文件输出路径", prop: "fileOutputPath", minWidth: "160", align: "left" }
    ];

    const { columnArrs, groupArrs, buttonArrs } = await getMenuColumns();
    const [data, data2, data3] = columnArrs;
    if (data?.length) columnData = data;
    if (data2?.length) columnData2 = data2;
    if (data3?.length) columnData3 = data3;
    if (groupArrs?.length) groupArrsList.value = groupArrs;
    updateButtonList(buttonList, buttonArrs[0]);
    updateButtonList(buttonList2, buttonArrs[1]);
    updateButtonList(buttonList3, buttonArrs[2]);
    columns.value = setColumn({ columnData: columnData });
    columns2.value = setColumn({
      columnData: columnData2,
      operationColumn: { width: 140 }
    });
    columns3.value = setColumn({ columnData: columnData3 });
  };

  const onRefresh = () => getTableList();
  const onRefresh2 = () => getTableList2(rowData.value?.id);
  const onRefresh3 = () => getTableList3(rowData2.value?.id);

  // 1.岗位列表
  const getTableList = () => {
    loading.value = true;
    teamPostList(queryForm)
      .then(({ data }) => {
        loading.value = false;
        dataList.value = data || [];
      })
      .catch(() => (loading.value = false));
  };

  // 2.职责列表
  const getTableList2 = (roleInfoId: number) => {
    if (!roleInfoId) return message("请选择岗位");
    loading2.value = true;
    teamDutyList({ ...queryForm, roleInfoId })
      .then(({ data }) => {
        loading2.value = false;
        dataList2.value = data || [];
        if (data?.length) {
          getTableList3(data[0].id);
        }
      })
      .catch(() => (loading2.value = false));
  };
  // 3.模板列表
  const getTableList3 = (responsibilitiesId: number) => {
    if (!responsibilitiesId) return message("请选择职责");
    loading3.value = true;
    teamTemplateList({ ...queryForm, responsibilitiesId })
      .then(({ data }) => {
        loading3.value = false;
        dataList3.value = data || [];
      })
      .catch(() => (loading3.value = false));
  };

  const onCurrentChange = (row: TeamPostItemType) => {
    rowData.value = row;
    getTableList2(row?.id);
  };
  const onCurrentChange2 = (row: TeamDutyItemType) => {
    rowData2.value = row;
    getTableList3(row?.id);
  };

  // 新增岗位
  const onPostAdd = () => {
    openDialog("add");
  };
  // 修改岗位
  const onPostUpdate = (row: TeamPostItemType) => {
    openDialog("edit", row);
  };
  // 删除岗位
  const onPostDelete = (row: TeamPostItemType) => {
    deleteTeamPost({ id: row.id })
      .then(({ data }) => {
        if (data) {
          message("删除成功");
          getTableList();
        } else {
          message("删除失败", { type: "error" });
        }
      })
      .catch(console.log);
  };

  function openDialog(type: "add" | "edit", row?: TeamPostItemType) {
    const title = { add: "新增", edit: "修改" }[type];
    const formRef = ref();
    const editParentName = row?.parentId == "-1" ? row?.deptName : row?.parentName;
    const formData = reactive({
      roleName: row?.roleName ?? "",
      staffingPeopleCount: row?.staffingPeopleCount ?? "",
      parentId: row?.parentId ?? -1,
      id: row?.id ?? "",
      deptId: row?.deptId ?? 0,
      parentName: type === "add" ? "" : editParentName,
      remark: row?.remark ?? ""
    });
    // 选择上级岗位
    const onSelectPosition = (rowItem: DeptInfoItemType) => {
      formData.deptId = rowItem.deptId;
      formData.parentName = rowItem.deptName;
    };
    addDialog({
      title: `${title}岗位`,
      props: {
        formInline: formData,
        formRules: formRules,
        formConfigs: formConfigs({ onSelectPosition }),
        formProps: { labelWidth: "120px" }
      },
      width: "640px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.validate((valid) => {
          if (valid) {
            showMessageBox(`确认要提交吗?`)
              .then(() => {
                const { parentName, ...params } = formData;
                const API = { add: addTeamPost, edit: updateTeamPost };
                API[type](params)
                  .then((res) => {
                    if (res.data) {
                      done();
                      message(`${title}成功`);
                      getTableList();
                    } else {
                      message(`${title}失败`, { type: "error" });
                    }
                  })
                  .catch(console.log);
              })
              .catch(() => {});
          }
        });
      }
    });
  }

  // 添加岗位职责
  const onDutyAdd = () => {
    openDialog2("add");
  };
  // 修改岗位职责
  const onDutyUpdate = (row: TeamDutyItemType) => {
    openDialog2("edit", row);
  };
  // 删除岗位职责
  const onDutyDelete = (row: TeamDutyItemType) => {
    deleteTeamDuty({ id: row.id })
      .then(({ data }) => {
        if (data) {
          message("删除成功");
          getTableList2(rowData.value.id);
        } else {
          message("删除失败", { type: "error" });
        }
      })
      .catch(console.log);
  };
  function openDialog2(type: "add" | "edit", row?: TeamDutyItemType) {
    const title = { add: "新增", edit: "修改" }[type];
    const formRef = ref();
    const formData = reactive({
      responsibilities: row?.responsibilities ?? "",
      roleInfoId: rowData.value.id,
      id: type === "add" ? "" : row.id
    });

    addDialog({
      title: `${title}岗位职责`,
      props: {
        formInline: formData,
        formProps: { labelWidth: "120px" },
        formRules: { responsibilities: [{ required: true, message: "请输入岗位职责", trigger: "blur" }] },
        formConfigs: [
          {
            label: "岗位职责",
            prop: "responsibilities",
            colProp: { span: 24 },
            render: ({ formModel, row }) => {
              return <el-input type="textarea" v-model={formModel[row.prop]} rows={2} placeholder="请输入岗位职责" clearable />;
            }
          }
        ]
      },
      width: "520px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.validate((valid) => {
          if (valid) {
            showMessageBox(`确认要提交吗?`)
              .then(() => {
                const API = { add: addTeamDuty, edit: updateTeamDuty };
                API[type](formData)
                  .then((res) => {
                    if (res.data) {
                      done();
                      message(`${title}成功`);
                      getTableList2(rowData.value.id);
                    } else {
                      message(`${title}失败`, { type: "error" });
                    }
                  })
                  .catch(console.log);
              })
              .catch(() => {});
          }
        });
      }
    });
  }

  // 新增岗位模板
  const onTemplateAdd = () => {
    openDialog3("add");
  };
  // 修改岗位模板
  const onTemplateUpdate = (row) => {
    openDialog3("edit", row);
  };
  // 删除岗位模板
  const onTemplateDelete = (row) => {
    console.log("删除岗位模板", row);
    deleteTeamTemplate({ id: row.id })
      .then(({ data }) => {
        if (data) {
          message("删除成功");
          getTableList3(rowData2.value.id);
        } else {
          message("删除失败", { type: "error" });
        }
      })
      .catch(console.log);
  };

  function openDialog3(type: "add" | "edit", row?: TeamDutyItemType) {
    if (!rowData2.value?.id) {
      return message("请选择岗位职责", { type: "error" });
    }
    const title = { add: "新增", edit: "修改" }[type];
    const formRef = ref();
    const formData = reactive({
      responsibilities: row?.responsibilities ?? "",
      roleInfoId: rowData.value.id,
      id: type === "add" ? "" : row.id
    });

    // 选择模板文件
    const onSelectTemplate = (data) => {
      console.log("选择模板文件", 111);
    };
    // 选择路径
    const onSelectPath = (data) => {
      console.log("选择路径", 111);
    };

    addDialog({
      title: `${title}岗位职责`,
      props: {
        formInline: formData,
        formProps: { labelWidth: "120px" },
        formRules: formRules3,
        formConfigs: formConfigs3({ onSelectTemplate, onSelectPath })
      },
      width: "640px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.validate((valid) => {
          if (valid) {
            showMessageBox(`确认要提交吗?`)
              .then(() => {
                const API = { add: addTeamTemplate, edit: updateTeamTemplate };
                API[type](formData)
                  .then((res) => {
                    if (res.data) {
                      done();
                      message(`${title}成功`);
                      getTableList3(rowData2.value.id);
                    } else {
                      message(`${title}失败`, { type: "error" });
                    }
                  })
                  .catch(console.log);
              })
              .catch(() => {});
          }
        });
      }
    });
  }

  // 按钮列表
  const buttonList = ref<ButtonItemType[]>([{ clickHandler: onPostAdd, type: "primary", text: "新增岗位", icon: Plus, isDropDown: false }]);
  const buttonList2 = ref<ButtonItemType[]>([{ clickHandler: onDutyAdd, type: "primary", text: "新增岗位职责", icon: Plus, isDropDown: false }]);
  const buttonList3 = ref<ButtonItemType[]>([{ clickHandler: onTemplateAdd, type: "primary", text: "新增模板", icon: Plus, isDropDown: false }]);

  return {
    loading,
    loading2,
    loading3,
    columns,
    columns2,
    columns3,
    dataList,
    dataList2,
    dataList3,
    maxHeight,
    buttonList,
    buttonList2,
    buttonList3,
    groupArrsList,
    onPostUpdate,
    onPostDelete,
    onRefresh,
    onRefresh2,
    onRefresh3,
    onDutyUpdate,
    onDutyDelete,
    onTemplateUpdate,
    onTemplateDelete,
    onCurrentChange,
    onCurrentChange2
  };
};
