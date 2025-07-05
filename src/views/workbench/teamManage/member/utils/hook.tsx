/*
 * @Author: Hailen
 * @Date: 2023-07-06 14:57:33
 * @Last Modified by: Hailen
 * @Last Modified time: 2025-03-14 18:29:54
 */

import { h, onMounted, reactive, ref } from "vue";
import {
  teamMemberList,
  teamMemberListByDepId,
  TeamMemberItemType,
  addDepGroup,
  editDepGroup,
  deleteDepGroup,
  updateDepGroup,
  teamMemberOptionList,
  TeamMemberOptionType,
  DeptGroupTreeItemType,
  roleAndGroupList,
  teamDepGroupList,
  teamDepGroupCode,
  GroupLeaderItemType,
  DepGroupItemType,
  RoleAndGroupType,
  teamGroupLeader
} from "@/api/workbench/teamManage";

import { message, showMessageBox } from "@/utils/message";
import { type PaginationProps } from "@pureadmin/table";
import { addDialog } from "@/components/ReDialog";
import { getUserInfo } from "@/utils/storage";
import { useEleHeight } from "@/hooks";
import EditForm from "@/components/EditForm/index.vue";
import { setColumn, getMenuColumns } from "@/utils/table";
import { formConfigs, formRules, formRules2, formConfigs2 } from "./config";
import { PAGE_CONFIG } from "@/config/constant";
import TableEditList from "@/components/TableEditList/index.vue";
import { CustomPropsType, FormItemConfigType } from "@/utils/form";
import type { ColDef } from "ag-grid-community";
import { getAgGridColumns } from "@/components/AgGridTable/config";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { getDeptOptions } from "@/utils/requestApi";
import { DetartMenttemType } from "@/api/systemManage";

export interface QueryType {
  page: number;
  limit: number;
  staffId?: string;
  staffName?: string;
  deptId?: number;
  groupId?: number;
}

export type HandleType = "add" | "edit";

export function useConfig() {
  const isAgTable = ref(true);
  const columnDefs = ref<ColDef[]>([]);
  const formRef = ref();
  const loading = ref<boolean>(false);
  const dataList = ref<TeamMemberItemType[]>([]);
  const columns = ref<TableColumnList[]>([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 95);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const memberOption = ref<TeamMemberOptionType>({
    stateList: [],
    deptGroupTree: [],
    deptInfoTree: []
  });
  const formData = reactive<QueryType>({
    page: 1,
    limit: PAGE_CONFIG.pageSize,
    staffId: "",
    staffName: "",
    deptId: 0,
    groupId: 0
  });

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "工号", value: "staffId" },
    { label: "姓名", value: "staffName" }
  ]);

  onMounted(() => {
    getColumnConfig();
    onSearch();
    getGroupList();
  });

  const getGroupList = () => {
    teamMemberOptionList()
      .then(({ data }) => {
        if (data) {
          memberOption.value = data;
        }
      })
      .catch(console.log);
  };

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "工号", prop: "staffId", sortable: true },
      { label: "姓名", prop: "staffName", sortable: true },
      { label: "部门", prop: "deptName", minWidth: 150, sortable: true },
      { label: "组别", prop: "groupName" },
      { label: "岗位", prop: "roleName", sortable: true },
      { label: "联系电话", prop: "phone" },
      { label: "紧急联系人", prop: "emergencyName" },
      { label: "联系人电话", prop: "emergencyPhone" },
      { label: "入厂日期", prop: "startDate", sortable: true },
      { label: "原岗位", prop: "oldPosition" },
      { label: "调动后岗位", prop: "newPosition" },
      { label: "调动日期", prop: "transferDate" },
      { label: "备注", prop: "remark" },
      { label: "状态", prop: "state", sortable: true }
    ];

    const { columnArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    columns.value = setColumn({ columnData, formData });
    columnDefs.value = getAgGridColumns<TeamMemberItemType>({
      columnData,
      formData,
      renderButtons: () => [{ name: "修改", type: "default", onClick: (row) => handleEdit(row) }]
    });
  };

  /**
   * 获取部门人员列表
   * @param type 请求类型 (all:表单搜索请求, single: 点击左侧菜单请求)
   */
  const onSearch = (type = "all") => {
    const GroupApi = { all: teamMemberList, single: teamMemberListByDepId };
    const { groupId, deptId, staffId, staffName, ...reset } = formData;
    let params: QueryType = { staffId, staffName, ...reset };
    // 默认请求teamMemberList接口, 如果是点击部门组节点, 请求接口teamMemberListByDepId
    if (type === "single") {
      params = { groupId, deptId, ...reset };
    }
    loading.value = true;
    GroupApi[type](params)
      .then((res) => {
        const { total, records } = res.data;
        loading.value = false;
        pagination.total = total;
        dataList.value = records;
      })
      .catch((err) => {
        loading.value = false;
      });
  };

  const onTagSearch = (values) => {
    Object.assign(formData, values);
    onSearch();
  };

  function GetDeptName(data: DeptGroupTreeItemType[], id: number) {
    if (data.length) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].id == id) return data[i].title;
        return GetDeptName(data[i].children, id);
      }
    }
    return null;
  }

  // 点击当前组节点
  const onNodeClick = (data: DeptGroupTreeItemType) => {
    if (!data.parentId) {
      formData.deptId = data.id;
      delete formData.groupId;
    } else {
      formData.groupId = data.id;
      delete formData.deptId;
    }
    onSearch("single");
  };

  // 新增分组
  const onAdd = (data: DeptGroupTreeItemType) => {
    openDialog("add", data);
  };

  // 修改分组
  const onEdit = (data: DeptGroupTreeItemType) => {
    openDialog("edit", data);
  };

  // 删除分组
  const remove = (data: DeptGroupTreeItemType, node: Node) => {
    showMessageBox(`确认要删除【${data.title}】分组吗?`).then(() => {
      deleteDepGroup({ id: data.id })
        .then((res) => {
          message.success(`删除成功`);
          getGroupList();
        })
        .catch(console.log);
    });
  };

  function getGroupParentId(data, pid: number) {
    if (data?.length) {
      for (let i = 0; i < data.length; i++) {
        if (data[i]?.parentId == pid) return true;
        return getGroupParentId(data[i].children, pid);
      }
    }
    return false;
  }

  // 添加、编辑弹窗
  function openDialog(type: HandleType, row?: DeptGroupTreeItemType) {
    const titleObj = { add: "新增", edit: "修改" };
    const title = titleObj[type];
    const userInfo = getUserInfo();
    const sLoading = ref<boolean>(true);
    const leaderList = ref([]);
    const depGroupList = ref([]);
    const deptOptions = ref<DetartMenttemType[]>([]);
    const formData = {
      parentId: row.parentId ? `${row.parentId}` : "",
      groupName: row.title ?? "",
      leaderId: row.leaderId ?? "",
      groupCode: row.groupCode ?? "",
      deptId: `${row.deptId || row.id || userInfo.deptId || ""}`,
      id: row.id ?? 0
    };
    const p1 = teamGroupLeader({ deptId: userInfo.deptId });
    const p2 = teamDepGroupList();
    const p3 = getDeptOptions();

    Promise.all([p1, p2, p3])
      .then((res: any) => {
        const [res1, res2, res3] = res;
        loading.value = false;
        sLoading.value = false;
        if (res1.status === 200) {
          leaderList.value = res1.data;
        }
        if (res2.status === 200) {
          depGroupList.value = res2.data;
          const hasPid = getGroupParentId(res2.data, row.parentId);
          if (!hasPid) formData.parentId = ""; // 找不到父级下拉框显示空
        }
        deptOptions.value = res3 ?? [];
      })
      .finally(() => (sLoading.value = false));

    addDialog({
      title: `${title}分组`,
      width: "640px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      props: {
        type: type,
        loading: sLoading,
        formInline: formData,
        formRules: formRules2,
        formConfigs: formConfigs2({ leaderList, depGroupList, deptOptions }),
        formProps: { labelWidth: "100px" }
      },
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.validate((valid) => {
          if (valid) {
            showMessageBox(`确认要【${title}分组】吗?`).then(() => {
              onSubmitGroup(type, title, formData, () => {
                done();
                getGroupList();
              });
            });
          }
        });
      }
    });
  }

  // 添加、编辑提交
  const onSubmitGroup = (type: HandleType, title: string, data, callback: Function) => {
    const API = { add: addDepGroup, edit: editDepGroup };
    API[type]({ ...data, parentId: data.parentId || 0 })
      .then((res) => {
        if (!res.data) throw res.message;
        callback();
        message.success(`${title}成功`);
      })
      .catch(console.log);
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

  // 修改员工岗位
  async function handleEdit(row: TeamMemberItemType) {
    const formData = reactive({
      staffName: row.staffName,
      roleId: row.roleId,
      deptId: row.deptId ? row.deptId + "" : "",
      groupId: row.groupId ?? "",
      id: row.id
    });
    const customProps = {
      roleId: { apiParams: { deptId: row.deptId }, formatAPI: (data) => data.roleInfoList },
      deptId: { formatAPI: (data) => data.deptInfoTree }
    };

    addDialog({
      title: "修改岗位",
      props: {
        params: { groupCode: "1" },
        formConfig: [
          {
            formData: formData,
            customProps: customProps,
            formProps: { labelWidth: "120px" }
          }
        ]
      },
      width: "520px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      showResetButton: true,
      beforeReset: () => formRef.value.resetRef(),
      contentRenderer: () => h(TableEditList, { ref: formRef }),
      beforeSure: (done, { options }) => {
        formRef.value.getRef().then(({ valid, data }) => {
          if (valid) {
            showMessageBox(`确认要提交修改吗?`).then(() => {
              updateDepGroup(formData)
                .then((res) => {
                  done();
                  onSearch();
                  message.success("修改成功");
                })
                .catch(console.log);
            });
          }
        });
      }
    });
  }

  function onSwitchTable() {
    isAgTable.value = !isAgTable.value;
  }

  return {
    columnDefs,
    isAgTable,
    memberOption,
    loading,
    dataList,
    columns,
    pagination,
    maxHeight,
    searchOptions,
    onAdd,
    onEdit,
    remove,
    onSearch,
    onTagSearch,
    onNodeClick,
    handleEdit,
    handleSizeChange,
    handleCurrentChange,
    onSwitchTable
  };
}
