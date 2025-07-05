/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2025-03-14 18:08:22
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
  manySyncMachineData,
  batchUpdateStaffDept
} from "@/api/oaManage/humanResources";
import { onMounted, h, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import AddModal from "../addModal.vue";
import Detail from "../Detail.vue";
import { addDialog } from "@/components/ReDialog";
import { getDeptTreeData, DetartMenttemType, DeptTreeItemType } from "@/api/systemManage";
import EditForm from "@/components/EditForm/index.vue";
import { getChildIDs, downloadFile, getFileNameOnUrlPath } from "@/utils/common";
import { useEleHeight } from "@/hooks";
import { message, showMessageBox, wrapFn } from "@/utils/message";
import { PAGE_CONFIG } from "@/config/constant";
import { type PaginationProps } from "@pureadmin/table";
import MachineUserModal from "./machineUserModal/index.vue";
import { SearchOptionType, QueryParamsType } from "@/components/BlendedSearch/index.vue";
import {
  dismissFormConfigs,
  dismissFformRules,
  standardFformRules,
  standardFormConfigs,
  SumitStaffInfoItemType,
  batchDeptFormConfigs,
  batchDeptformRules
} from "./config";
import { setColumn, getMenuColumns, getEnumDictList, updateButtonList, usePageSelect } from "@/utils/table";
import { ElMessage } from "element-plus";
import { Plus, Edit, Printer, Right, Download } from "@element-plus/icons-vue";
import { formatDate } from "@/utils/common";
import type { ColDef } from "ag-grid-community";
import { getAgGridColumns } from "@/components/AgGridTable/config";
import { getDeptOptions } from "@/utils/requestApi";

/**
 * @param temporaryFlag 是否临时工 0: 正式工  1: 零时工
 */
export const useConfig = (temporaryFlag: 0 | 1) => {
  const isAgTable = ref(true);
  const columnDefs = ref<ColDef[]>([]);
  const tableRef = ref();
  const router = useRouter();
  const loading = ref<boolean>(true);
  const treeLoading = ref<boolean>(true);
  const columns = ref<TableColumnList[]>([]);
  const dataList = ref<StaffInfoItemType[]>([]);
  const rowsData = ref<StaffInfoItemType[]>([]);
  const rowData = ref();
  const treeOptions = ref<DeptTreeItemType[]>([]);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 95);

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
    { label: "离职日期", value: "leaveofficeDate", type: "date", format: "YYYY-MM-DD" },

    { label: "性别", value: "sex", children: [] },
    { label: "学历", value: "education", children: [] },
    { label: "婚姻状况", value: "marital", children: [] },
    { label: "民族", value: "nation" },
    { label: "生日", value: "birthDate", type: "date", format: "YYYY-MM-DD" },
    { label: "年龄", value: "age" },
    { label: "身份证号码", value: "idCard" },
    { label: "社保电脑号", value: "socialSecurity" },
    { label: "户口所在地", value: "registeredResidence" },
    { label: "联系电话", value: "phone" },
    { label: "入职时间", value: "startDate", type: "date", format: "YYYY-MM-DD" },
    { label: "是否住宿", value: "accommodation", children: [] },
    { label: "离职日期", value: "leaveofficeDate", type: "date", format: "YYYY-MM-DD" },

    { label: "学校", value: "infoEduSchoolName" },
    { label: "专业", value: "infoEduMajor" }
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
        const data = res.data;
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

      // 性别
      searchOptions[4].children = res.GenderType.map((item) => {
        return { ...item, label: item.optionName, value: item.optionValue };
      });

      // 学历
      searchOptions[5].children = res.DegreeType.map((item) => {
        return { ...item, label: item.optionName, value: item.optionValue };
      });

      // 婚姻状况
      searchOptions[6].children = res.MaritalStatus.map((item) => {
        return { ...item, label: item.optionName, value: item.optionValue };
      });

      // 是否住宿
      searchOptions[15].children = res.DormitoryType.map((item) => {
        return { ...item, label: item.optionName, value: item.optionValue };
      });

      // 零时工有劳务公司
      if (temporaryFlag === 1) {
        const laborChildren = res.LaborCompany.map((item) => {
          return { ...item, label: item.optionName, value: item.optionValue };
        });
        const delIdx = searchOptions.findIndex((el) => el.value === "infoEduMajor");
        if (delIdx >= 0) searchOptions.splice(delIdx, 1);
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
      { label: "生日", prop: "birthDate", sortable: true, excelFormat: "yyyy-MM-dd" },
      { label: "年龄", prop: "age", sortable: true, align: "right", minWidth: 80 },
      { label: "身份证号码", prop: "idCard", minWidth: 180, sortable: true },
      { label: "社保电脑号", prop: "socialSecurity" },
      { label: "户口所在地", prop: "registeredResidence", minWidth: 280 },
      { label: "联系电话", prop: "phone", minWidth: 100 },
      { label: "紧急联系人", prop: "emergencyName" },
      { label: "联系人电话", prop: "emergencyPhone" },
      { label: "入厂日期", prop: "startDate", sortable: true, excelFormat: "yyyy-MM-dd" },
      { label: "合同到期日", prop: "contractExpiresDate", sortable: true, excelFormat: "yyyy-MM-dd" },
      { label: "合同续签到期日", prop: "contractRenewalDate", minWidth: 140, sortable: true, excelFormat: "yyyy-MM-dd" },
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
      { label: "最高学历开始时间", prop: "infoEduStartTime", minWidth: 140, excelFormat: "yyyy-MM" },
      { label: "最高学历结束时间", prop: "infoEduEndTime", minWidth: 140, excelFormat: "yyyy-MM" },
      { label: "劳务公司", prop: "laborServiceCompany" }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, formData, selectionColumn: { hide: false } });
    columnDefs.value = getAgGridColumns<StaffInfoItemType>({
      formData,
      columnData,
      selectionColumn: { hide: false },
      renderButtons: () => [
        { name: "修改", type: "default", onClick: (row) => onEdit(row) },
        { name: "删除", type: "danger", onClick: (row) => onDelete(row), confirm: (row) => `确认删除\n【${row.staffName}】吗?` }
      ]
    });
  };

  const getTableList = () => {
    const listApi = { 0: staffInfoList, 1: tempStaffInfoList };
    loading.value = true;
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
  const onAdd = () => openDialog("add", {} as StaffInfoItemType);
  // 修改
  const onHeadEdit = wrapFn(rowData, () => onEdit(rowData.value));

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
          message.error("没有修改权限");
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
    const title = { add: "新增", edit: "修改" }[type];
    const name = temporaryFlag ? "零时工档案" : "人事档案";
    const formRef = ref();

    const formData = reactive<SumitStaffInfoItemType>({
      temporaryFlag: temporaryFlag,
      ...row,
      exmpetAttendance: row.exmpetAttendance ? row.exmpetAttendance : false,
      startDate: formatDate(row?.startDate, "YYYY-MM-DD"),
      birthDate: formatDate(row.birthDate, "YYYY-MM-DD"),
      leaveofficeDate: formatDate(row.leaveofficeDate, "YYYY-MM-DD"),
      moneyStartDate: formatDate(row.moneyStartDate, "YYYY-MM-DD"),
      contractExpiresDate: formatDate(row.contractExpiresDate, "YYYY-MM-DD"),
      contractRenewalDate: formatDate(row.contractRenewalDate, "YYYY-MM-DD"),
      transferDate: formatDate(row.transferDate, "YYYY-MM-DD"),
      deptId: row.deptId ? `${row.deptId}` : "",
      isPoorPeople: row.isPoorPeople ?? 0,
      // 教育经历删除的id列表
      deleteStaffInfoEducationIdList: [],
      // 家庭关系删除的id列表
      deleteStaffInfoFamilyIdList: [],
      // 工作经历删除的id列表
      deleteStaffInfoWorkIdList: []
    });

    if (typeof row.isSalary === "boolean") {
      formData.isSalary = row.isSalary + "";
    } else {
      formData.isSalary = "true";
    }

    if (typeof row.isSeniorityCalc === "boolean") {
      formData.isSeniorityCalc = row.isSeniorityCalc + "";
    } else {
      formData.isSeniorityCalc = "true";
    }

    const mapSalary = { true: true, false: false };

    addDialog({
      title: title + name,
      props: { type, temporaryFlag, formInline: formData },
      width: "90%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(Detail, { ref: formRef }),
      beforeSure: (done, { options }) => {
        formRef.value.getRef().then(({ valid, data }) => {
          if (valid) {
            // 编辑状态下进行职级变更后提示并阻止保存
            if (type === "edit") {
              const fdLevel = data.forms[0]?.formData?.level;
              const rowLevel = row?.level;

              if (fdLevel && rowLevel && fdLevel !== rowLevel) {
                return message.warning("检测到职级发生变化，需前往【人事异动】进行变更");
              }
            }
            const addApi = { 0: addStaff, 1: addTempStaff };
            const updateApi = { 0: updateStaff, 1: updateTempStaff };
            const API = { add: addApi[temporaryFlag], edit: updateApi[temporaryFlag] };
            const params = {
              ...formData,
              // 修改需要提交的字段
              staffInfoEducationDTOList: formData.staffInfoEducationVOS,
              staffInfoFamilyDTOList: formData.staffInfoFamilyVOS,
              staffInfoWorkDTOList: formData.staffInfoWorkVOS
            };
            params["isSalary"] = mapSalary[params["isSalary"] as string];
            params["isSeniorityCalc"] = mapSalary[params["isSeniorityCalc"] as string];

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
          message.success("删除成功");
        } else {
          message.error("删除失败");
        }
      })
      .catch(console.log);
  };

  // 打印
  const onPrint = () => {
    if (!rowsData.value.length) return message.error("请选择至少一条数据");
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
            router.push({ path: "/humanResources/staffInfo/print", query });
            done();
          }
        });
      }
    });
  };

  // 离职
  const onDismiss = () => {
    if (!rowsData.value.length) return message.error("请勾选员工");
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
        if (!res.data) return message.error("导出失败");
        const fileName = getFileNameOnUrlPath(res.data);
        downloadFile(res.data, fileName, true);
      })
      .catch(console.log);
  };

  // 更新核算标准
  const onUpdateStandard = () => {
    if (!rowsData.value.length) return message.error("请勾选员工");
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
            message.success(`${title}成功`);
          } else {
            message.error(`${title}失败`);
          }
        })
        .catch(console.log);
    });
  };

  // 分页相关
  function onSizeChange(val: number) {
    formData.limit = val;
    pagination.pageSize = val;
    getTableList();
  }

  function onCurrentChange(val: number) {
    formData.page = val;
    pagination.currentPage = val;
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
    if (!rowData.value) return message.error("请选择一条记录");
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
    if (!rowData.value) return message.error("请选择一条记录");
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

  const onBatchDept = wrapFn(rowsData, () => { 
    const staffName = rowsData.value.map((item) => item.staffName).join("、");
    const ids = rowsData.value.map((item) => item.id);
    const formRef = ref();
    const deptOptions = ref([]);
    const formData = reactive({
      updateRecordIdList: ids,
      updateField: "deptId", // 固定值
      updateValue: ""
    });
    getDeptOptions().then((data) => {
      deptOptions.value = data;
    });
    addDialog({
      title: '批量修改部门',
      width: "460px",
      props: {
        formInline: formData,
        formRules: batchDeptformRules,
        formProps: { labelWidth: "120px" },
        formConfigs: batchDeptFormConfigs({ deptOptions, staffName })
      },
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done) => {
        const FormRef = formRef.value.getRef(); 
        FormRef.validate((valid) => {
          if (!valid) return
          showMessageBox('确认修改选中用户的部门吗?')
            .then(() => {
              batchUpdateStaffDept(formData).then((res) => {
                if (!res.data) return message.error("修改失败");
                message.success("修改成功");
                done();
                getTableList();
              });
            })
            .catch(console.log);
        });
      }
    });
  });

  const onSyncMachine = () => {
    if (!rowsData.value.length) return message.error("请勾选人员");
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
          message.warning("请选择至少一条考勤机记录");
        }
      }
    });
  };

  const onDbClick = (row) => {
    onEdit(row);
  };

  function onSwitchTable() {
    isAgTable.value = !isAgTable.value;
    rowData.value = undefined;
    rowsData.value = [];
  }

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "新增", icon: Plus, isDropDown: false },
    { clickHandler: onHeadEdit, type: "warning", text: "修改", icon: Edit, isDropDown: false },
    { clickHandler: onPrint, type: "default", text: "打印", icon: Printer, isDropDown: true },
    { clickHandler: onSyncMachine, type: "default", text: "同步考勤机", isDropDown: true },
    { clickHandler: onBatchDept, type: "warning", text: "批量修改部门", icon: Edit, isDropDown: true },
    { clickHandler: onDismiss, type: "default", text: "离职", icon: Right, isDropDown: true },
    { clickHandler: onExport, type: "default", text: "导出", icon: Download, isDropDown: true }
  ]);
  return {
    columnDefs,
    isAgTable,
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
    onDbClick,
    onTagSearch,
    onSelect,
    onSelectAll,
    onNodeClick,
    onSizeChange,
    onCurrentChange,
    onSyncMachine,
    onAdd,
    onPrint,
    onDismiss,
    onExport,
    onUpdateStandard,
    onSetQYWXAccount,
    onSetKingdeeAccount,
    onSwitchTable
  };
};
