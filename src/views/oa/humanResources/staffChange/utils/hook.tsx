import { h, onMounted, reactive, ref } from "vue";
import { type PaginationProps } from "@pureadmin/table";

import { getMenuColumns, RendererType, setColumn, updateButtonList } from "@/utils/table";
import { useEleHeight } from "@/hooks";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import {
  staffChangeList,
  addStaffChange,
  updateStaffChange,
  getUserBasicInfo,
  deleteStaffChange,
  staffChangeBillDetail,
  StaffChangeItemType,
  staffInfoList,
  StaffInfoItemType,
  StaffDeptRoleInfoItemType,
  getInductionAuditRoleInfoByDeptId
} from "@/api/oaManage/humanResources";

import EditForm from "@/components/EditForm/index.vue";
import { message, showMessageBox, wrapFn } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { PAGE_CONFIG } from "@/config/constant";
import { formRules, formConfigs } from "./config";
import { getDeptOptions } from "@/utils/requestApi";

export const useTestReportConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref<StaffChangeItemType[]>([]);
  const rowData = ref<StaffChangeItemType>();
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const formData = reactive({ staffName: "", page: 1, limit: PAGE_CONFIG.pageSize });
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49 + 46);
  const searchOptions = reactive<SearchOptionType[]>([{ label: "姓名", value: "staffName" }]);

  onMounted(() => {
    getColumnConfig();
    getTableList();
  });

  const getColumnConfig = async () => {
    const transferTypeRender: RendererType = ({ row, column }) => {
      const value = row[column.columnKey] as string;
      return <span>{value.slice(0, 2)}</span>;
    };
    let columnData: TableColumnList[] = [
      { label: "姓名", prop: "staffName", minWidth: 140 },
      { label: "部门", prop: "deptName", minWidth: 140 },
      { label: "异动前部门", prop: "deptName", minWidth: 140 },
      { label: "异动前职位", prop: "roleName", minWidth: 140 },
      { label: "入职时间", prop: "startDate", minWidth: 160 },
      { label: "异动类型", prop: "transferType", minWidth: 140, cellRenderer: transferTypeRender },
      { label: "异动后部门", prop: "transferAfterDeptName", minWidth: 140 },
      { label: "异动后职位", prop: "transferAfterRoleName", minWidth: 140 },
      { label: "异动时间", prop: "transferDate", minWidth: 160 },
      { label: "调整原因", prop: "transferReason", minWidth: 140 },
      { label: "薪资是否调整", prop: "adjustSalaryFlag", minWidth: 140 },
      { label: "调整后薪资", prop: "adjustAfterSalary", minWidth: 140 },
      { label: "生效日期", prop: "effectiveDate", minWidth: 140 }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns([{ transferType: transferTypeRender }]);
    const [menuCols] = columnArrs;
    if (menuCols?.length) columnData = menuCols;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false });
    return columnData;
  };

  const getTableList = () => {
    loading.value = true;
    staffChangeList(formData)
      .then(({ data }) => {
        loading.value = false;
        dataList.value = data.records || [];
        pagination.total = data.total;
      })
      .catch((err) => (loading.value = false));
  };

  const onReFresh = () => {
    getColumnConfig();
    getTableList();
  };

  const onTagSearch = (values) => {
    Object.assign(formData, values);
    getTableList();
  };

  function onAdd() {
    openDialog("add", {} as StaffChangeItemType);
  }

  const onEdit = wrapFn(rowData, () => {
    openDialog("edit", rowData.value);
  });

  const openDialog = (type: "add" | "edit", row?: StaffChangeItemType) => {
    const title = { add: "新增", edit: "修改" }[type];
    const formRef = ref();
    const sLoading = ref(false);
    const mLoading = ref(false);
    const deptTreeList = ref([]);
    const userList = ref<StaffInfoItemType[]>([]);
    const roleList = ref<StaffDeptRoleInfoItemType[]>([]);
    const mergeType = row?.transferType ?? "";

    // 表单数据
    const _formData = reactive({
      ...row,
      transferType: mergeType.slice(0, 2),
      other: mergeType.slice(2),
      transferAfterDeptId: row.transferAfterDeptId ? `${row.transferAfterDeptId}` : ""
    });

    // 用户列表
    function getUserList() {
      sLoading.value = true;
      staffInfoList({ page: 1, limit: 10000, state: "在职" })
        .then(({ data }) => (userList.value = data.records))
        .finally(() => (sLoading.value = false));
    }

    // 获取人员信息
    function onUserChange(staffCode) {
      sLoading.value = true;
      getUserBasicInfo({ staffCode })
        .then(({ data }) => Object.assign(_formData, data[0]))
        .finally(() => (sLoading.value = false));
    }

    // 获取部门列表
    function getDeptData() {
      sLoading.value = true;
      getDeptOptions()
        .then((data) => (deptTreeList.value = data))
        .finally(() => (sLoading.value = false));
    }

    // 选择部门
    function onDeptChange(deptId, isFirst = false) {
      if (!isFirst) {
        roleList.value = []; // 重置岗位
        _formData.transferAfterRoleId = undefined;
      }
      if (!deptId) return;
      mLoading.value = true;
      getInductionAuditRoleInfoByDeptId({ deptId })
        .then(({ data }) => {
          mLoading.value = false;
          roleList.value = data || [];
        })
        .catch(() => (mLoading.value = false));
    }

    // 获取部门
    getDeptData();
    // 获取岗位
    onDeptChange(row.transferAfterDeptId, true);
    // 获取用户列表
    if (type === "add") getUserList();

    addDialog({
      title: `${title}人事异动`,
      props: {
        loading: sLoading,
        formInline: _formData,
        formRules: formRules,
        formConfigs: formConfigs({ type, mLoading, userList, roleList, deptTreeList, onUserChange, onDeptChange }),
        formProps: { labelWidth: "120px" }
      },
      width: "960px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeReset: () => formRef.value.getRef()?.resetFields(),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const { other, ...reset } = _formData;
        reset.transferType = reset.transferType + (other ?? "");
        FormRef.validate((valid) => {
          if (valid) {
            showMessageBox("确认提交吗").then(() => {
              const reqApi = { add: addStaffChange, edit: updateStaffChange };
              reqApi[type](reset).then((res) => {
                if (res.data) {
                  message(`${title}成功`);
                  getTableList();
                  done();
                } else {
                  message(`${title}失败`, { type: "error" });
                }
              });
            });
          }
        });
      }
    });
  };

  const onDelete = wrapFn(rowData, () => {
    const { id, staffName } = rowData.value;
    showMessageBox(`确认要删除【${staffName}】吗?`).then(() => {
      deleteStaffChange({ id }).then(({ data }) => {
        if (!data) return message("删除失败", { type: "error" });
        message("删除成功");
        getTableList();
      });
    });
  });

  const onCurrentChange = (row: StaffChangeItemType) => {
    rowData.value = row;
  };
  const onDblclick = (row: StaffChangeItemType) => {
    openDialog("edit", row);
  };

  // 分页相关
  function handleSizeChange(val: number) {
    formData.limit = val;
    getTableList();
  }

  function handleCurrentChange(val: number) {
    formData.page = val;
    getTableList();
  }

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "新增", isDropDown: false },
    { clickHandler: onEdit, type: "warning", text: "修改", isDropDown: false },
    { clickHandler: onDelete, type: "danger", text: "删除", isDropDown: false }
  ]);

  return {
    loading,
    columns,
    dataList,
    maxHeight,
    pagination,
    searchOptions,
    buttonList,
    onReFresh,
    onTagSearch,
    onDblclick,
    onCurrentChange,
    handleSizeChange,
    handleCurrentChange
  };
};
