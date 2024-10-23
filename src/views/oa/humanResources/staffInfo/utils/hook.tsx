/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-16 10:38:26
 */

import {
  StaffInfoItemType,
  staffInfoList,
  exportStaff,
  permissionCheck,
  getStaffDetail,
  addStaff,
  updateStaff,
  deleteStaff,
  dimissionStaff,
  updateAccountStandard,
  StaffInfoOptionType,
  /** 临时工 */
  tempStaffInfoList,
  getTempStaffDetail,
  addTempStaff,
  updateTempStaff,
  deleteTempStaff,
  exportTempStaff,
  dimissionTempStaff,
  timeSettingList,
  setKingdeeId,
  setQYWXID,
  manySyncMachineData
} from "@/api/oaManage/humanResources";
import { onMounted, h, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import AddModal from "../addModal.vue";
import { addDialog } from "@/components/ReDialog";
import { getDeptTreeData, DetartMenttemType } from "@/api/systemManage";
import EditForm from "@/components/EditForm/index.vue";
import { getChildIDs, downloadFile, getFileNameOnUrlPath } from "@/utils/common";
import { useEleHeight } from "@/hooks";
import { message, showMessageBox } from "@/utils/message";
import { PAGE_CONFIG } from "@/config/constant";
import { type PaginationProps } from "@pureadmin/table";
import MachineUserModal from "./machineUserModal/index.vue";
import { SearchOptionType, QueryParamsType } from "@/components/BlendedSearch/index.vue";
import { dismissFormConfigs, dismissFformRules, standardFformRules, standardFormConfigs } from "./config";
import { setColumn, getMenuColumns, getEnumDictList, updateButtonList, usePageSelect } from "@/utils/table";
import { ElMessage } from "element-plus";
import { Plus, Printer, Right, Download } from "@element-plus/icons-vue";

/**
 * @param temporaryFlag 是否临时工 0: 正式工  1: 零时工
 */
export const useConfig = (temporaryFlag: 0 | 1) => {
  const tableRef = ref();
  const router = useRouter();
  const loading = ref<boolean>(true);
  const treeLoading = ref<boolean>(true);
  const columns = ref<TableColumnList[]>([]);
  const dataList = ref<StaffInfoItemType[]>([]);
  const rowsData = ref<StaffInfoItemType[]>([]);
  const rowData = ref();
  const treeOptions = ref<DetartMenttemType[]>([]);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 51 + 51);

  const formData = reactive({
    page: 1,
    limit: PAGE_CONFIG.pageSize,
    staffId: "",
    staffName: "",
    state: "",
    leaveofficeDate: "",
    laborServiceCompany: "",
    deptIdList: []
  });

  const staffInfoOptions = ref<StaffInfoOptionType>({
    apiUrl: "",
    temporaryFlag: temporaryFlag,
    optionList: {
      HaveOrNot: [],
      MaritalStatus: [],
      EmployeeStatus: [],
      DegreeType: [],
      IncuranceStatus: [],
      DimissionReason: [],
      DormitoryType: [],
      LaborCompany: [],
      GenderType: [],
      Ethnic: [],
      EmployeeType: []
    },
    deptInfoTree: [],
    workTimeList: []
  });

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "姓名", value: "staffName" },
    { label: "工号", value: "staffId" },
    { label: "状态", value: "state", children: [] },
    { label: "离职日期", value: "leaveofficeDate", type: "date", format: "YYYY-MM-DD" }
  ]);
  const queryParams = reactive<QueryParamsType>({
    state: { value: "在职", valueLabel: "在职" }
  });

  const { setSelectCheckbox, setSelectChange, setSelectAllChange } = usePageSelect({ tableRef, dataList, rowsData, uniId: "id" });

  onMounted(() => {
    getColumnConfig();
    getOptionList();
  });

  const getOptionList = () => {
    // 1.获取部门菜单树
    getDeptTreeData()
      .then((res) => {
        treeLoading.value = false;
        const data = JSON.parse(res.data);
        treeOptions.value = data;
        staffInfoOptions.value.deptInfoTree = data[0]?.children || [];
      })
      .catch(() => (treeLoading.value = false));

    // 2.获取工作时间
    timeSettingList({ page: 1, limit: 10000 }).then((res) => {
      if (res.data) {
        staffInfoOptions.value.workTimeList = res.data.map((item) => ({ optionName: item.worktime, optionValue: item.id + "" }));
      }
    });

    // 3.批量获取下拉框数据
    getEnumDictList([
      "DegreeType",
      "DimissionReason",
      "DormitoryType",
      "EmployeeStatus",
      "EmployeeType",
      "Ethnic",
      "GenderType",
      "HaveOrNot",
      "IncuranceStatus",
      "LaborCompany",
      "MaritalStatus"
    ]).then((res) => {
      staffInfoOptions.value.optionList = {
        DegreeType: res.DegreeType,
        DimissionReason: res.DimissionReason,
        DormitoryType: res.DormitoryType,
        EmployeeStatus: res.EmployeeStatus,
        EmployeeType: res.EmployeeType,
        Ethnic: res.Ethnic,
        GenderType: res.GenderType,
        HaveOrNot: res.HaveOrNot,
        IncuranceStatus: res.IncuranceStatus,
        LaborCompany: res.LaborCompany,
        MaritalStatus: res.MaritalStatus
      };
      staffInfoOptions.value = { ...staffInfoOptions.value, temporaryFlag: temporaryFlag };

      // 在职状态
      searchOptions[2].children = res.EmployeeStatus.map((item) => {
        return { ...item, label: item.optionName, value: item.optionValue };
      });

      // 零时工有劳务公司
      if (temporaryFlag === 1) {
        const laborChildren = res.LaborCompany.map((item) => {
          return { ...item, label: item.optionName, value: item.optionValue };
        });
        searchOptions.push({ label: "劳务公司", value: "laborServiceCompany", children: laborChildren });
      }
    });
  };

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "工号", prop: "staffId", sortable: true, minWidth: 80 },
      { label: "姓名", prop: "staffName", minWidth: 120 },
      { label: "部门", prop: "deptName", minWidth: 160 },
      { label: "组别", prop: "groupName", minWidth: 80 },
      { label: "岗位", prop: "roleName" },
      { label: "性别", prop: "sex", minWidth: 80 },
      { label: "学历", prop: "education", minWidth: 80 },
      { label: "婚姻状况", prop: "marital", sortable: true, minWidth: 100 },
      { label: "民族", prop: "nation", minWidth: 80 },
      { label: "身高", prop: "height", sortable: true, align: "right", minWidth: 80 },
      { label: "体重", prop: "weight", sortable: true, align: "right", minWidth: 80 },
      { label: "生日", prop: "birthDate", sortable: true, format: "yyyy-MM-dd" },
      { label: "年龄", prop: "age", sortable: true, align: "right", minWidth: 80 },
      { label: "身份证号码", prop: "idCard", minWidth: 180, sortable: true },
      { label: "社保电脑号", prop: "socialSecurity" },
      { label: "户口所在地", prop: "registeredResidence", minWidth: 280 },
      { label: "联系电话", prop: "phone", minWidth: 100 },
      { label: "紧急联系人", prop: "emergencyName" },
      { label: "联系人电话", prop: "emergencyPhone" },
      { label: "入厂日期", prop: "startDate", sortable: true, format: "yyyy-MM-dd" },
      { label: "合同到期日", prop: "contractExpiresDate", sortable: true, format: "yyyy-MM-dd" },
      { label: "合同续签到期日", prop: "contractRenewalDate", minWidth: 140, sortable: true, format: "yyyy-MM-dd" },
      { label: "原岗位", prop: "oldPosition" },
      { label: "调动后岗位", prop: "newPosition", minWidth: 200 },
      { label: "调动日期", prop: "transferDate", sortable: true },
      { label: "备注", prop: "remark" },
      { label: "是否住宿", prop: "accommodation", sortable: true, minWidth: 100 },
      { label: "合同签订情况", prop: "contractSigning" },
      { label: "状态", prop: "state", sortable: true, minWidth: 80 },
      { label: "离职日期", prop: "leaveofficeDate", sortable: true },
      { label: "续签次数", prop: "renewalCount", sortable: true, align: "right" },
      { label: "最高学历", prop: "infoEducation" },
      { label: "最高学历学校名称", prop: "infoEduSchoolName", minWidth: 140 },
      { label: "最高学历开始时间", prop: "infoEduStartTime", minWidth: 140, format: "yyyy-MM" },
      { label: "最高学历结束时间", prop: "infoEduEndTime", minWidth: 140, format: "yyyy-MM" },
      { label: "劳务公司", prop: "laborServiceCompany" }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, formData, dragSelector: temporaryFlag ? ".temp-staffInfo" : ".staffInfo", selectionColumn: { hide: false } });
  };

  const getTableList = () => {
    const listApi = { 0: staffInfoList, 1: tempStaffInfoList };
    listApi[temporaryFlag](formData)
      .then(({ data }) => {
        loading.value = false;
        dataList.value = data.records || [];
        pagination.total = data.total;
        setSelectCheckbox();
      })
      .catch((err) => (loading.value = false));
  };
  const onSearch = () => {
    getColumnConfig();
    getTableList();
  };

  // 搜索
  const onTagSearch = (values) => {
    Object.assign(formData, values);
    getTableList();
  };

  // 选择菜单树
  const onNodeClick = (data: DetartMenttemType) => {
    // 获取选中部门和子部门id
    if (data.id !== "0") {
      formData.deptIdList = getChildIDs<DetartMenttemType, string>([data], "id");
    } else {
      formData.deptIdList = [];
    }
    getTableList();
  };

  // 添加
  const onAdd = () => {
    openDialog("add");
  };

  // 修改
  const onEdit = (row: StaffInfoItemType) => {
    // 临时工不验证权限
    if (temporaryFlag === 1) {
      authStaff(row.id);
      return;
    }
    // 正式工验证权限
    loading.value = true;
    permissionCheck({ id: row.id })
      .then((res) => {
        if (res.data) {
          authStaff(row.id);
        } else {
          loading.value = false;
          message("没有修改权限", { type: "error" });
        }
      })
      .catch(() => (loading.value = false));
  };

  // 获取编辑详情
  const authStaff = (id: number) => {
    const detailApi = { 0: getStaffDetail, 1: getTempStaffDetail };
    detailApi[temporaryFlag]({ id })
      .then((res) => res.data && openDialog("edit", res.data))
      .catch(console.log)
      .finally(() => (loading.value = false));
  };

  // 添加修改操作
  function openDialog(type: "add" | "edit", row?: StaffInfoItemType) {
    const titleObj = { add: "新增", edit: "修改" };
    const title = titleObj[type];
    const formRef = ref();
    addDialog({
      title: `${title}人事档案`,
      props: { type: type, row: row, temporaryFlag, optionData: staffInfoOptions.value },
      width: "90%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(AddModal, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const formEditRef = formRef.value.getRef();
        formEditRef.formRef.validate((valid) => {
          if (valid) {
            const addApi = { 0: addStaff, 1: addTempStaff };
            const updateApi = { 0: updateStaff, 1: updateTempStaff };
            const API = { add: addApi[temporaryFlag], edit: updateApi[temporaryFlag] };
            const params = {
              ...formEditRef.formData.value,
              // 修改需要提交的字段
              staffInfoEducationDTOList: formEditRef.formData.value.staffInfoEducationVOS,
              staffInfoFamilyDTOList: formEditRef.formData.value.staffInfoFamilyVOS,
              staffInfoWorkDTOList: formEditRef.formData.value.staffInfoWorkVOS
            };
            onSubmitData({ api: API[type], params: params, title: title }, done);
          }
        });
      }
    });
  }

  // 删除
  const onDelete = (row: StaffInfoItemType) => {
    const deleteApi = { 0: deleteStaff, 1: deleteTempStaff };
    deleteApi[temporaryFlag]({ id: row.id })
      .then((res) => {
        if (res.data) {
          getTableList();
          message("删除成功");
        } else {
          message("删除失败", { type: "error" });
        }
      })
      .catch(console.log);
  };

  // 打印
  const onPrint = () => {
    if (!rowsData.value.length) return message("请选择至少一条数据", { type: "error" });
    const printRef = ref();
    const chckList = [
      { label: "人员信息详情", value: "1" },
      { label: "身份证", value: "2" },
      { label: "银行卡", value: "3" },
      { label: "健康证", value: "4" },
      { label: "离职证明", value: "5" },
      { label: "毕业证书", value: "6" }
    ];
    const printData = reactive({ photos: [chckList[0].value] });
    const ids = rowsData.value.map((item) => item.id);

    const render = ({ formModel, row }) => (
      <el-checkbox-group size="large" v-model={formModel[row.prop]}>
        {chckList.map((item) => (
          <el-checkbox label={item.value}>{item.label}</el-checkbox>
        ))}
      </el-checkbox-group>
    );

    addDialog({
      title: "选择要打印的信息",
      props: {
        formInline: printData,
        formConfigs: [{ prop: "photos", colProp: { span: 24 }, render }]
      },
      width: "670px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(EditForm, { ref: printRef }),
      beforeSure: (done, { options }) => {
        const FormRef = printRef.value.getRef();
        FormRef.validate((valid) => {
          if (valid) {
            const query = { photos: printData.photos.join(","), ids: ids.join(",") };
            router.push({ path: "/oa/humanResources/staffInfo/print", query });
            done();
          }
        });
      }
    });
  };

  // 离职
  const onDismiss = () => {
    if (!rowsData.value.length) return message("请勾选员工", { type: "error" });
    const formRef = ref();
    const staffName = rowsData.value.map((item) => item.staffName);
    const formData = reactive({
      staffNames: staffName.join("、"),
      leaveofficeDate: "",
      resignationReason: "",
      remark: ""
    });
    const dismissOption = staffInfoOptions.value.optionList.DimissionReason;

    addDialog({
      title: "批量离职",
      props: { formInline: formData, formRules: dismissFformRules, formProps: { labelWidth: "100px" }, formConfigs: dismissFormConfigs({ dismissOption }) },
      width: "640px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const staffInfoIdList: number[] = []; //离职员工id集合
        const userInfoIdList: number[] = []; //离职员工用户id集合
        const wxOpenIdList: string[] = []; //离职员工企业微信openId集合
        const userCodeList: string[] = []; //离职员工

        rowsData.value.forEach((item) => {
          staffInfoIdList.push(item.id);
          userInfoIdList.push(item.userInfoId);
          wxOpenIdList.push(item.wxOpenId);
          userCodeList.push(item.staffId);
        });

        const params = {
          staffNames: formData.staffNames.split("、"),
          leaveofficeDate: formData.leaveofficeDate,
          resignationReason: formData.resignationReason,
          remark: formData.remark,
          temporaryFlag: temporaryFlag,
          staffInfoIdList,
          userInfoIdList,
          wxOpenIdList,
          userCodeList
        };

        FormRef.validate((valid) => {
          if (valid) {
            const dimissionApi = { 0: dimissionStaff, 1: dimissionTempStaff };
            onSubmitData({ api: dimissionApi[temporaryFlag], params: params, title: "提交" }, () => {
              done();
              rowsData.value = [];
            });
          }
        });
      }
    });
  };

  // 导出
  const onExport = () => {
    const headConfig = { ...formData };
    const exportApi = { 0: exportStaff, 1: exportTempStaff };
    exportApi[temporaryFlag](headConfig)
      .then((res) => {
        if (!res.data) return message("导出失败", { type: "error" });
        const fileName = getFileNameOnUrlPath(res.data);
        downloadFile(res.data, fileName, true);
      })
      .catch(console.log);
  };

  // 更新核算标准
  const onUpdateStandard = () => {
    if (!rowsData.value.length) return message("请勾选员工", { type: "error" });
    const formRef = ref();
    const staffName = rowsData.value.map((item) => item.staffName);
    const rowsTypes = [...new Set(rowsData.value.map((item) => item.wageAccountingType))];
    let modalTypeName = "";
    if (rowsTypes.length === 1) {
      modalTypeName = rowsTypes[0];
    }
    const formData = reactive({
      staffNames: staffName.join("、"),
      wageAccountingType: modalTypeName
    });
    const dmployeOption = staffInfoOptions.value.optionList.EmployeeType;

    addDialog({
      title: "更新核算标准",
      props: {
        formInline: formData,
        formRules: standardFformRules,
        formProps: { labelWidth: "120px" },
        formConfigs: standardFormConfigs({ dmployeOption })
      },
      width: "480px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const staffInfoIdList: number[] = rowsData.value.map((item) => item.id); //员工id集合
        const params = { staffInfoIdList, wageAccountingType: formData.wageAccountingType };

        FormRef.validate((valid) => {
          if (valid) {
            onSubmitData({ api: updateAccountStandard, params: params, title: "更新" }, done);
          }
        });
      }
    });
  };

  /**
   * 提交数据(公共方法)
   * @param options.api 接口Api
   * @param options.params 参数
   * @param options.title 显示标题, 默认值 `提交`
   * @param callback 成功回调
   */
  const onSubmitData = (options, callback) => {
    const { api, params, title = "提交", msg = "确认要提交吗?" } = options;
    showMessageBox(msg).then(() => {
      api(params)
        .then(({ data }) => {
          if (data) {
            callback();
            getTableList();
            message(`${title}成功`);
          } else {
            message(`${title}失败`, { type: "error" });
          }
        })
        .catch(console.log);
    });
  };

  // 分页相关
  function onSizeChange(val: number) {
    formData.limit = val;
    getTableList();
  }

  function onCurrentChange(val: number) {
    formData.page = val;
    getTableList();
  }

  function onSelect(rows: StaffInfoItemType[], row: StaffInfoItemType) {
    setSelectChange({ rows, row });
  }

  function onSelectAll(rows: StaffInfoItemType[]) {
    setSelectAllChange(rows);
  }

  const onRowClick = (row: StaffInfoItemType) => {
    // tableRef.value?.getTableRef()?.toggleRowSelection(row);
    rowData.value = row;
  };

  const onSetKingdeeAccount = () => {
    if (!rowData.value) return message("请选择一条记录", { type: "error" });
    showMessageBox(`确认为【${rowData.value?.staffName}】设置金蝶账号吗?`)
      .then(() => {
        setKingdeeId(rowData.value?.id).then((res) => {
          if (res.data) {
            ElMessage({ message: "金蝶账号设置成功", type: "success" });
            getTableList();
          }
        });
      })
      .catch(console.log);
  };

  const onSetQYWXAccount = () => {
    if (!rowData.value) return message("请选择一条记录", { type: "error" });
    showMessageBox(`确认为【${rowData.value?.staffName}】设置企业微信账号吗?`)
      .then(() => {
        setQYWXID(rowData.value?.id).then((res) => {
          if (res.data) {
            ElMessage({ message: "企业微信账号设置成功", type: "success" });
            getTableList();
          }
        });
      })
      .catch(console.log);
  };

  const onSyncMachine = () => {
    if (!rowsData.value.length) return message("请勾选人员", { type: "error" });
    const formRef = ref();
    addDialog({
      title: `选择考勤机`,
      width: "900px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(MachineUserModal, { ref: formRef }),
      beforeSure: (done) => {
        const selectedIds: any[] = formRef.value?.selectedRows?.map((item) => item.id);
        if (selectedIds.length) {
          const names = rowsData.value.map((item) => item.staffName);
          const paramsData = rowsData.value.map((item) => ({ ...item, machineIds: selectedIds }));

          const attMachineNames = formRef.value?.selectedRows?.map((item) => item.attMachineName);
          showMessageBox(`确认要同步人员【${names}】的信息到考勤机【${attMachineNames}】吗?`)
            .then(() => {
              manySyncMachineData(paramsData).then((res) => {
                if (res.status === 200) {
                  ElMessage({ message: "同步成功", type: "success" });
                  done();
                  onSearch();
                }
              });
            })
            .catch(console.log);
        } else {
          message("请选择至少一条考勤机记录", { type: "warning" });
        }
      }
    });
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "新增", icon: Plus, isDropDown: false },
    { clickHandler: onPrint, type: "default", text: "打印", icon: Printer, isDropDown: true },
    { clickHandler: onSyncMachine, type: "default", text: "同步考勤机", isDropDown: true },
    { clickHandler: onDismiss, type: "default", text: "离职", icon: Right, isDropDown: true },
    { clickHandler: onExport, type: "default", text: "导出", icon: Download, isDropDown: true }
  ]);

  const onDbClick = (row) => {
    onEdit(row);
  };

  return {
    tableRef,
    loading,
    columns,
    dataList,
    maxHeight,
    pagination,
    treeOptions,
    treeLoading,
    buttonList,
    queryParams,
    searchOptions,
    onEdit,
    onDelete,
    onSearch,
    onRowClick,
    onTagSearch,
    onSelect,
    onSelectAll,
    onNodeClick,
    onSizeChange,
    onCurrentChange,
    onAdd,
    onPrint,
    onDismiss,
    onExport,
    onUpdateStandard,
    onSetKingdeeAccount,
    onSetQYWXAccount,
    onDbClick
  };
};
