/*
 * @Author: Hailen
 * @Date: 2024-08-20 15:26:18
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-08-20 18:48:51
 */

import {
  PersonFlowStatisticsDetailItemType,
  StaffInfoItemType,
  StaffInfoOptionType,
  getStaffDetail,
  personFlowStatisticsDetail,
  timeSettingList,
  updateStaff,
  updateTempStaff
} from "@/api/oaManage/humanResources";
import { RendererType, getEnumDictList, setColumn } from "@/utils/table";
import { message, showMessageBox } from "@/utils/message";
import { onMounted, ref } from "vue";

import { getDeptTreeData } from "@/api/systemManage";

interface RowInfoType {
  type: "add" | "edit";
  /** 0: 正式工  1: 零时工 */
  temporaryFlag: number;
  row: StaffInfoItemType;
  optionData: StaffInfoOptionType;
}

export const useConfig = (props) => {
  const loading = ref(false);
  const sLoading = ref(false);
  const detailRef = ref();
  const columns = ref<TableColumnList[]>([]);
  const dataList = ref<PersonFlowStatisticsDetailItemType[]>([]);
  const temporaryFlag = props.row.changeType.indexOf("临时工") > -1 ? 1 : 0;
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
  // 用户详情信息
  const rowInfo = ref<RowInfoType>({
    type: "edit",
    row: {} as StaffInfoItemType,
    temporaryFlag: temporaryFlag,
    optionData: staffInfoOptions.value
  });

  onMounted(() => {
    getOptionList();
    getColumnConfig();
    getTableData();
  });

  const getOptionList = () => {
    // 1.获取部门菜单树
    getDeptTreeData()
      .then(({ data }) => {
        const deptList = JSON.parse(data)[0]?.children || [];
        staffInfoOptions.value.deptInfoTree = deptList;
      })
      .catch(console.log);

    // 2.获取工作时间
    timeSettingList({ page: 1, limit: 10000 }).then(({ data }) => {
      if (!data) return;
      staffInfoOptions.value.workTimeList = data.map((item) => ({
        optionName: item.worktime,
        optionValue: item.id + ""
      }));
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
    });
  };

  const getColumnConfig = async () => {
    const cellRenderer: RendererType = ({ row, column }) => <span v-html={row[column["property"]]} />;
    const columnData: TableColumnList[] = [
      { label: "工号", prop: "staffCode", sortable: true, minWidth: 80, cellRenderer },
      { label: "姓名", prop: "staffName", sortable: true, minWidth: 80, cellRenderer },
      { label: "部门", prop: "deptName", sortable: true, minWidth: 100, cellRenderer },
      { label: "岗位", prop: "roleName", sortable: true, minWidth: 120, cellRenderer },
      { label: "入职日期", prop: "startDate", sortable: true, minWidth: 100, cellRenderer },
      { label: "离职日期", prop: "leaveofficeDate", sortable: true, minWidth: 100, cellRenderer }
    ];
    columns.value = setColumn({ columnData, operationColumn: false });
  };

  const getTableData = () => {
    loading.value = true;
    personFlowStatisticsDetail({
      yearAndMonth: props.yearAndMonth,
      changeType: props.row.changeType
    })
      .then(({ data }) => (dataList.value = data || []))
      .finally(() => (loading.value = false));
  };

  const onCurrentChange = (row: PersonFlowStatisticsDetailItemType) => {
    if (sLoading.value) return message("数据加载中...", { type: "warning" });
    getDetail(row.id);
  };

  // 获取用户详情数据
  const getDetail = (id: number) => {
    if (!id) return message("用户ID不存在", { type: "error" });
    sLoading.value = true;
    getStaffDetail({ id })
      .then(({ data }) => data && (rowInfo.value.row = data))
      .finally(() => (sLoading.value = false));
  };

  // 修改信息
  const onUpdateInfo = () => {
    const formEditRef = detailRef.value.getRef();
    formEditRef.formRef.validate((valid) => {
      if (valid) {
        const updateApi = { 0: updateStaff, 1: updateTempStaff };
        const API = updateApi[temporaryFlag];
        const params = {
          ...formEditRef.formData.value,
          // 修改需要提交的字段
          staffInfoEducationDTOList: formEditRef.formData.value.staffInfoEducationVOS,
          staffInfoFamilyDTOList: formEditRef.formData.value.staffInfoFamilyVOS,
          staffInfoWorkDTOList: formEditRef.formData.value.staffInfoWorkVOS
        };
        showMessageBox(
          `请务必仔细核对所有细节，并谨慎进行修改。
          任何细微的改动都可能影响最终结果，
          请确认您已充分理解修改内容，
          并且对所做的修改充满信心。
          如果您有任何疑问或不确定的地方，
          请务必先咨询后再做决定。
          一旦确认无误，请点击"确定"提交！`
        ).then(() => {
          API(params).then(({ data }) => {
            if (!data) return message("修改失败", { type: "error" });
            message("修改成功");
            getDetail(rowInfo.value.row.id);
          });
        });
      }
    });
  };

  return {
    detailRef,
    loading,
    sLoading,
    columns,
    dataList,
    rowInfo,
    onCurrentChange,
    onUpdateInfo
  };
};
