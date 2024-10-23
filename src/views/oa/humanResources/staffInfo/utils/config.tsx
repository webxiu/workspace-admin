import { $t, transformI18n } from "@/plugins/i18n";
import { Delete, Edit, Loading, Plus } from "@element-plus/icons-vue";
import EditForm, { FormConfigItemType } from "@/components/EditForm/index.vue";
import { Ref, h, reactive, ref } from "vue";
import {
  AttendanceMachineItemType,
  StaffDeptGroupItemType,
  StaffDeptRoleInfoItemType,
  StaffInfoEducationVOSType,
  StaffInfoFamilyVOSType,
  StaffInfoItemType,
  StaffInfoWorkVOSType,
  fetchMachine,
  getInductionAuditRoleInfo,
  getInductionAuditRoleInfoByDeptId,
  getStaffDeptGroup
} from "@/api/oaManage/humanResources";

import { ElMessage, type FormRules } from "element-plus";
import Photo from "@/views/oa/humanResources/inductionAudit/basicInfo/Photo.vue";
import { PureTableBar } from "@/components/RePureTableBar";
import { addDialog } from "@/components/ReDialog";
import dayjs from "dayjs";
import { getIdCardInfo } from "@/utils/common";
import { setColumn, getEnumDictList } from "@/utils/table";
import { showMessageBox } from "@/utils/message";
import { v4 as uuidv4 } from "uuid";

export interface StaffOptionDataType {
  /** 有无驾驶证 */
  HaveOrNot: any[];
  /** 婚姻状况 */
  MaritalStatus: any[];
  /** 离职状态 */
  EmployeeStatus: any[];
  /** 最高学历 */
  DegreeType: any[];
  /** 参加保险情况 */
  IncuranceStatus: any[];
  /** 离职原因 */
  DimissionReason: any[];
  /** 是否住宿 */
  DormitoryType: any[];
  /** 劳务公司 */
  LaborCompany: any[];
  /** 性别 */
  GenderType: any[];
  /** 民族 */
  Ethnic: any[];
  /** 工资核算标准 | 雇员种类 */
  EmployeeType: any[];
  /** 考勤规则 下拉框 */
  workTimeList: any[];
  /** 部门组别信息 */
  deptInfoTree: any[];
}

export interface SumitStaffInfoItemType extends StaffInfoItemType {
  // 教育经历删除的id列表
  deleteStaffInfoEducationIdList: number[];
  // 家庭关系删除的id列表
  deleteStaffInfoFamilyIdList: number[];
  // 工作经历删除的id列表
  deleteStaffInfoWorkIdList: number[];
  // 教育经历
  staffInfoEducationDTOList?: any[];
  // 家庭关系
  staffInfoFamilyDTOList?: any[];
  // 工作经历
  staffInfoWorkDTOList?: any[];
  // 相关图片
  staffInfoPhotoDTOList?: any[];
}

interface OptionType {
  type: "add" | "edit";
  // 修改正式工档案时，隐藏劳务公司输入项，且删除必填属性
  temporaryFlag: number; // 0正式工, 1临时工
  row: StaffInfoItemType;
  optionDatas: Ref<StaffOptionDataType>;
  formData: SumitStaffInfoItemType;
}

const layout = { span: 6 };
const lineLayout = { span: 24 };
const layout12 = { span: 12 };

/** 添加&修改表单 */
export const formRules = reactive<FormRules>({
  staffId: [{ required: true, message: "请输入工号", trigger: "blur" }],
  staffName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  idCard: [{ required: true, message: "请输入身份证号码", trigger: "blur" }],
  nation: [{ required: true, message: "请选择民族", trigger: "blur" }],
  birthDate: [{ required: true, message: "请选择出生日期", trigger: "blur" }],
  sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
  age: [{ required: true, message: "请输入年龄", trigger: "blur" }],
  education: [{ required: true, message: "请选择最高学历", trigger: "blur" }],
  drivingLicence: [{ required: true, message: "请选择有无驾驶证", trigger: "blur" }],
  marital: [{ required: true, message: "请选择婚姻状况", trigger: "blur" }],
  phone: [{ required: true, message: "请输入联系电话", trigger: "blur" }],
  wageAccountingType: [{ required: true, message: "请选择工资核算标准", trigger: "blur" }],
  registeredResidence: [{ required: true, message: "请输入户口所在地", trigger: "blur" }],
  emergencyName: [{ required: true, message: "请输入紧急联系人", trigger: "blur" }],
  emergencyPhone: [{ required: true, message: "请输入紧急联系人电话", trigger: "blur" }],
  startDate: [{ required: true, message: "请选择工资开始核算日", trigger: "blur" }],
  workRuleId: [{ required: true, message: "请选择考勤", trigger: "blur" }],
  state: [{ required: true, message: "请选择状态", trigger: "blur" }],
  accommodation: [{ required: true, message: "请选择是否住宿", trigger: "blur" }],
  employeKind: [{ required: true, message: "请选择雇员种类", trigger: "blur" }],
  deptId: [{ required: true, message: "请选择部门", trigger: "blur" }],
  laborServiceCompany: [{ required: true, message: "请选择劳务公司", trigger: "blur" }],
  position: [{ required: true, message: "请输入岗位", trigger: "blur" }],
  tryDate: [{ required: true, message: "请输入试用期", trigger: "blur" }]
});

const LoadingIcon = () => (
  <el-icon class="is-loading">
    <Loading />
  </el-icon>
);

/** 教育经历 */
export const educationColumns = (type: "view" | "edit") => {
  return setColumn({
    columnData: [
      { label: "开始时间", prop: "startTime" },
      { label: "截止时间", prop: "endTime" },
      { label: "学校名称", prop: "schoolName" },
      { label: "学历", prop: "education" },
      { label: "专业", prop: "major" },
      { label: "备注", prop: "remark" }
    ],
    operationColumn: { width: 120, hide: type === "view" }
  });
};

/** 家庭关系 */
export const foFamilyColumns = (type: "view" | "edit") => {
  return setColumn({
    columnData: [
      { label: "关系", prop: "relation" },
      { label: "姓名", prop: "name" },
      { label: "工作单位", prop: "workUnit" },
      { label: "职业", prop: "profession" },
      { label: "联系电话", prop: "contactNumber" }
    ],
    operationColumn: { width: 120, hide: type === "view" }
  });
};

/** 工作经历 */
export const workColumns = setColumn({
  columnData: [
    { label: "开始时间", prop: "startTime" },
    { label: "截止时间", prop: "endTime" },
    { label: "公司名称", prop: "companyName" },
    { label: "职务名称", prop: "jobName" },
    { label: "薪金", prop: "money" },
    { label: "离职原因", prop: "leaveReason" },
    { label: "证明人及电话", prop: "certifierPhone" }
  ],
  operationColumn: { width: 120 }
});

// 添加&修改表单配置
export const formConfigs = (options: OptionType): FormConfigItemType[] => {
  const { type, temporaryFlag, formData, optionDatas, row } = options;

  const educationDataList = ref<StaffInfoEducationVOSType[]>(options.row?.staffInfoEducationVOS || []); //教育经历
  const familyDataList = ref<StaffInfoFamilyVOSType[]>(options.row?.staffInfoFamilyVOS || []); // 家庭管理
  const workDataList = ref<StaffInfoWorkVOSType[]>(options.row?.staffInfoWorkVOS || []); // 工作经历

  // 首次进入不加载组别和岗位, 选择部门再添加
  const sLoading = ref<boolean>(false);
  const groupList = ref<StaffDeptGroupItemType[]>([]);
  const roleList = ref<StaffDeptRoleInfoItemType[]>([]);
  const machineList = ref<AttendanceMachineItemType[]>([]);
  const optionList = ref([]);
  const levelOptions = ref([]);
  const exmpetAttendanceOptions = ref([
    { optionName: "是", optionValue: true },
    { optionName: "否", optionValue: false }
  ]);

  getEnumDictList(["DegreeType", "EmployeeLevel"])
    .then((res) => {
      optionList.value = res.DegreeType;
      levelOptions.value = res.EmployeeLevel;
    })
    .catch(console.log);

  // 获取考勤机数据
  fetchMachine({}).then(({ data }) => {
    machineList.value = data || [];
  });

  const onDeptChange = (deptId, isFirst) => {
    if (!isFirst) {
      formData.groupId = ""; // 重置组别
      formData.roleId = ""; // 重置岗位
    }
    if (!deptId) {
      groupList.value = [];
      roleList.value = [];
      return;
    }
    sLoading.value = true;
    const p1 = getStaffDeptGroup({ deptId }); // 获取组别列表
    const p2 = getInductionAuditRoleInfoByDeptId({ deptId }); // 获取岗位列表
    Promise.all([p1, p2])
      .then((res) => {
        sLoading.value = false;
        groupList.value = res[0].data || [];
        roleList.value = (res[1] as any).data || [];
      })
      .catch(() => (sLoading.value = false));
  };
  onDeptChange(row.deptId, true);

  const handleBlur = (v) => {
    const val = v.target.value;
    if (val && typeof val === "string" && val.length === 18) {
      const borthDayMonth = getIdCardInfo(val, 1);
      const gender = getIdCardInfo(val, 2);
      const age = getIdCardInfo(val, 3);
      formData.age = age as number;
      formData.sex = gender as string;
      formData.birthDate = borthDayMonth as string;
    }
  };

  const onEditRow = (type: "add" | "edit", cate: "education" | "family" | "work", row?) => {
    const formRef = ref();
    const name = { add: "新增", edit: "修改" }[type];
    const title = { education: "教育经历", family: "家庭关系", work: "工作经历" }[cate];
    const _formData = {
      education: reactive({
        ...row,
        startTime: row?.startTime ?? "",
        endTime: row?.endTime ?? "",
        schoolName: row?.schoolName ?? "",
        education: row?.education ?? "",
        major: row?.major ?? "",
        remark: row?.remark ?? ""
      }),
      family: reactive({
        ...row,
        relation: row?.relation ?? "",
        name: row?.name ?? "",
        workUnit: row?.workUnit ?? "",
        profession: row?.profession ?? "",
        contactNumber: row?.contactNumber ?? ""
      }),
      work: reactive({
        ...row,
        startTime: row?.startTime ?? "",
        endTime: row?.endTime ?? "",
        companyName: row?.companyName ?? "",
        jobName: row?.jobName ?? "",
        money: row?.money ?? "",
        leaveReason: row?.leaveReason ?? "",
        certifierPhone: row?.certifierPhone ?? ""
      })
    };

    const startTimeVal = ref("");
    const endTimeVal = ref("");

    const changeEdu = (val) => {
      const lowArr = ["小学", "初中", "中专", "高中"];
      const highArr = ["大专", "本科", "硕士", "博士"];
      if (lowArr.includes(val)) {
        editForm["education"][4].hide = true;
      }
      if (highArr.includes(val)) {
        editForm["education"][4].hide = false;
      }
    };

    const changeStart = (val) => {
      startTimeVal.value = val;
      if (endTimeVal.value && dayjs(val).isAfter(endTimeVal.value)) {
        ElMessage({ message: "开始时间不能晚于结束时间", type: "error" });
        _formData[cate].startTime = undefined;
        return;
      }
    };

    const changeEnd = (val) => {
      endTimeVal.value = val;
      if (startTimeVal.value && dayjs(val).isBefore(startTimeVal.value)) {
        ElMessage({ message: "结束时间不能早于开始时间", type: "error" });
        _formData[cate].endTime = undefined;
        return;
      }
    };

    const editForm: { [index: string]: FormConfigItemType[] } = {
      education: [
        {
          label: "开始时间",
          prop: "startTime",
          colProp: layout12,
          render: ({ formModel, row }) => (
            <el-date-picker
              v-model={formModel[row.prop]}
              onChange={changeStart}
              type="month"
              placeholder="请选择"
              format="YYYY-MM"
              value-format="YYYY-MM"
              style="width: 100%"
            />
          )
        },
        {
          label: "截止时间",
          prop: "endTime",
          colProp: layout12,
          render: ({ formModel, row }) => (
            <el-date-picker
              v-model={formModel[row.prop]}
              onChange={changeEnd}
              type="month"
              placeholder="请选择"
              format="YYYY-MM"
              value-format="YYYY-MM"
              style="width: 100%"
            />
          )
        },
        {
          label: "学校名称",
          prop: "schoolName",
          colProp: layout12,
          render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
        },

        {
          label: "学历",
          prop: "education",
          colProp: layout12,
          render: ({ formModel, row }) => {
            return (
              <el-select onChange={changeEdu} v-model={formModel[row.prop]} placeholder="请选择" style={{ width: "100%" }}>
                {optionList.value.map((item) => (
                  <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
                ))}
              </el-select>
            );
          }
        },
        {
          label: "专业",
          hide: true,
          prop: "major",
          colProp: layout12,
          render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
        },
        {
          label: "备注",
          prop: "remark",
          colProp: layout12,
          render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
        }
      ],
      family: [
        {
          label: "关系",
          prop: "relation",
          colProp: layout12,
          render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
        },

        {
          label: "姓名",
          prop: "name",
          colProp: layout12,
          render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
        },
        {
          label: "工作单位",
          prop: "workUnit",
          colProp: layout12,
          render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
        },
        {
          label: "职业",
          prop: "profession",
          colProp: layout12,
          render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
        },
        {
          label: "联系电话",
          prop: "contactNumber",
          colProp: layout12,
          render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
        }
      ],
      work: [
        {
          label: "开始时间",
          prop: "startTime",
          colProp: layout12,
          render: ({ formModel, row }) => {
            return (
              <el-date-picker v-model={formModel[row.prop]} type="month" placeholder="请选择" format="YYYY-MM" value-format="YYYY-MM" style="width: 100%" />
            );
          }
        },
        {
          label: "截止时间",
          prop: "endTime",
          colProp: layout12,
          render: ({ formModel, row }) => {
            return (
              <el-date-picker v-model={formModel[row.prop]} type="month" placeholder="请选择" format="YYYY-MM" value-format="YYYY-MM" style="width: 100%" />
            );
          }
        },
        {
          label: "公司名称",
          prop: "companyName",
          colProp: layout12,
          render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
        },
        {
          label: "职务名称",
          prop: "jobName",
          colProp: layout12,
          render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
        },
        {
          label: "薪金",
          prop: "money",
          colProp: layout12,
          render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
        },
        {
          label: "离职原因",
          prop: "leaveReason",
          colProp: layout12,
          render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
        },
        {
          label: "证明人及电话",
          prop: "certifierPhone",
          colProp: layout12,
          render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
        }
      ]
    };

    const props = {
      formInline: _formData[cate],
      formConfigs: editForm[cate],
      formProps: { labelWidth: "100px" }
    };

    if (cate === "education") {
      (props as any).formRules = {
        startTime: [{ required: true, message: "开始时间必填", trigger: "blur" }],
        endTime: [{ required: true, message: "截止时间必填", trigger: "blur" }],
        schoolName: [{ required: true, message: "学校名称必填", trigger: "blur" }],
        education: [{ required: true, message: "学历必填", trigger: "blur" }],
        major: [{ required: true, message: "专业必填", trigger: "blur" }]
      };
    }

    addDialog({
      title: name + title,
      props: props,
      width: "760px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const formResult = formRef.value.getRef();
        formResult.validate((valid) => {
          if (!valid) return;
          const editRow = _formData[cate];
          if (type === "add") {
            const addData = { uuid: uuidv4(), ...editRow, staffInfoId: formData.id } as any;
            if (cate === "education") educationDataList.value.push(addData);
            if (cate === "family") familyDataList.value.push(addData);
            if (cate === "work") workDataList.value.push(addData);
            formData.staffInfoFamilyDTOList = familyDataList.value;
            formData.staffInfoEducationDTOList = educationDataList.value;
            formData.staffInfoWorkDTOList = workDataList.value;
          } else {
            // 找到编辑行
            const getRowData = (arr, row) => {
              return arr.findIndex((item) => {
                if (item.id) {
                  return item.id === row.id;
                } else if (item.uuid) {
                  return item.uuid === row.uuid;
                }
                return false;
              });
            };

            if (cate === "education") {
              const eduIndex = getRowData(educationDataList.value, editRow);
              educationDataList.value[eduIndex] = { ...educationDataList.value[eduIndex], ...editRow };
            }
            if (cate === "family") {
              const famIndex = getRowData(familyDataList.value, editRow);
              familyDataList.value[famIndex] = { ...familyDataList.value[famIndex], ...editRow };
              familyDataList.value[famIndex] = editRow;
            }
            if (cate === "work") {
              const workIndex = getRowData(workDataList.value, editRow);
              workDataList.value[workIndex] = { ...workDataList.value[workIndex], ...editRow };
            }
          }
          done();
        });
      }
    });
  };
  const onDeleteRow = (cate, row) => {
    const title = { education: "教育经历", family: "家庭关系", work: "工作经历" }[cate];
    showMessageBox(`确认删除${formData.staffName}的【${title}】吗?`)
      .then(() => {
        if (cate === "education") {
          const educationIdx = educationDataList.value.indexOf(row);
          row.id && formData.deleteStaffInfoEducationIdList.push(row.id);
          educationDataList.value.splice(educationIdx, 1);
        } else if (cate === "family") {
          const familyIdx = familyDataList.value.indexOf(row);
          row.id && formData.deleteStaffInfoFamilyIdList.push(row.id);
          familyDataList.value.splice(familyIdx, 1);
        } else if (cate === "work") {
          const workIdx = workDataList.value.indexOf(row);
          workDataList.value.splice(workIdx, 1);
          row.id && formData.deleteStaffInfoWorkIdList.push(row.id);
        }
      })
      .catch(console.log);
  };

  return [
    {
      label: "",
      prop: "",
      colProp: lineLayout,
      render: () => <title-cate name="必填信息" />
    },
    {
      label: "工号",
      prop: "staffId",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} disabled={type === "edit"} placeholder="请输入工号" clearable />
    },
    {
      label: "姓名",
      prop: "staffName",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入姓名" clearable />
    },
    {
      label: "身份证号码",
      prop: "idCard",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入身份证号码" clearable onBlur={handleBlur} />
    },
    {
      label: "民族",
      prop: "nation",
      colProp: layout,
      render: ({ formModel, row }) => (
        <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
          {optionDatas.value?.Ethnic?.map((item) => (
            <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
          ))}
        </el-select>
      )
    },
    {
      label: "出生日期",
      prop: "birthDate",
      colProp: layout,
      render: ({ formModel, row }) => (
        <el-date-picker v-model={formModel[row.prop]} placeholder="选择日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD" clearable style="width: 100%" />
      )
    },
    {
      label: "性别",
      prop: "sex",
      colProp: layout,
      render: ({ formModel, row }) => (
        <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
          {optionDatas.value?.GenderType?.map((item) => (
            <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
          ))}
        </el-select>
      )
    },
    {
      label: "身份证有效期",
      prop: "validDate",
      colProp: layout,
      hide: type === "add",
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} disabled />
    },
    {
      label: "年龄",
      prop: "age",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入年龄" clearable />
    },
    {
      label: "最高学历",
      prop: "education",
      colProp: layout,
      render: ({ formModel, row }) => (
        <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
          {optionDatas.value?.DegreeType?.map((item) => (
            <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
          ))}
        </el-select>
      )
    },
    {
      label: "有无驾驶证",
      prop: "drivingLicence",
      colProp: layout,
      render: ({ formModel, row }) => (
        <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
          {optionDatas.value?.HaveOrNot?.map((item) => (
            <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
          ))}
        </el-select>
      )
    },
    {
      label: "婚姻状况",
      prop: "marital",
      colProp: layout,
      render: ({ formModel, row }) => (
        <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
          {optionDatas.value?.MaritalStatus?.map((item) => (
            <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
          ))}
        </el-select>
      )
    },
    {
      label: "联系电话",
      prop: "phone",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} disabled={type === "edit"} placeholder="请输入联系电话" clearable />
    },
    {
      label: "工资核算标准",
      prop: "wageAccountingType",
      colProp: layout,
      render: ({ formModel, row }) => (
        <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
          {optionDatas.value?.EmployeeType?.map((item) => (
            <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
          ))}
        </el-select>
      )
    },
    {
      label: "户口所在地",
      prop: "registeredResidence",
      colProp: layout12,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入户口所在地" clearable />
    },
    {
      label: "紧急联系人",
      prop: "emergencyName",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入紧急联系人" clearable />
    },
    {
      label: "紧急联系人电话",
      prop: "emergencyPhone",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入紧急联系人电话" clearable />
    },
    {
      label: "入厂日期",
      prop: "startDate",
      colProp: layout,
      render: ({ formModel, row }) => (
        <el-date-picker v-model={formModel[row.prop]} placeholder="选择日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD" clearable style="width: 100%" />
      )
    },
    {
      label: "考勤",
      prop: "workRuleId",
      colProp: layout,
      render: ({ formModel, row }) => (
        <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
          {optionDatas.value?.workTimeList?.map((item) => (
            <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
          ))}
        </el-select>
      )
    },
    {
      label: "状态",
      prop: "state",
      colProp: layout,
      render: ({ formModel, row }) => (
        <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
          {optionDatas.value?.EmployeeStatus?.map((item) => (
            <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
          ))}
        </el-select>
      )
    },
    {
      label: "是否住宿",
      prop: "accommodation",
      colProp: layout,
      render: ({ formModel, row }) => (
        <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
          {optionDatas.value?.DormitoryType?.map((item) => (
            <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
          ))}
        </el-select>
      )
    },
    {
      label: "雇员种类",
      prop: "employeKind",
      colProp: layout,
      render: ({ formModel, row }) => (
        <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
          {optionDatas.value?.EmployeeType?.map((item) => (
            <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
          ))}
        </el-select>
      )
    },
    {
      label: "部门",
      prop: "deptId",
      colProp: layout,
      render: ({ formModel, row }) => (
        <el-tree-select
          v-model={formModel[row.prop]}
          clearable
          filterable
          data={optionDatas.value?.deptInfoTree}
          check-strictly={true}
          check-on-click-node
          render-after-expand={false}
          placeholder="请选择"
          class="ui-w-100"
          props={{ label: "name", value: "id" }}
          onChange={onDeptChange}
        />
      )
    },
    {
      label: "组别",
      prop: "groupId",
      colProp: layout,
      render: ({ formModel, row }) =>
        sLoading.value ? (
          <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
            {{ prefix: () => <LoadingIcon /> }}
          </el-select>
        ) : (
          <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
            {groupList.value?.map((item) => (
              <el-option key={item.id} label={item.groupName} value={item.id} />
            ))}
          </el-select>
        )
    },
    {
      label: "岗位",
      prop: "roleId",
      colProp: layout,
      render: ({ formModel, row }) =>
        sLoading.value ? (
          <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
            {{ prefix: () => <LoadingIcon /> }}
          </el-select>
        ) : (
          <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
            {roleList.value?.map((item) => (
              <el-option key={item.id} label={item.roleName} value={item.id} />
            ))}
          </el-select>
        )
    },
    {
      label: "职级",
      prop: "level",
      colProp: layout,
      render: ({ formModel, row }) => (
        <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
          {levelOptions.value.map((item) => (
            <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
          ))}
        </el-select>
      )
    },
    {
      label: "免考勤",
      prop: "exmpetAttendance",
      colProp: layout,
      render: ({ formModel, row }) => (
        <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
          {exmpetAttendanceOptions.value.map((item) => (
            <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
          ))}
        </el-select>
      )
    },
    {
      label: "考勤机",
      prop: "machineId",
      colProp: layout,
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
            {machineList.value.map((item) => (
              <el-option key={item.id} label={item.attMachineName} value={item.id} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "",
      prop: "",
      colProp: lineLayout,
      render: () => <title-cate name="基本信息" />
    },
    {
      label: "劳务公司",
      prop: "laborServiceCompany",
      colProp: layout,
      hide: temporaryFlag === 0,
      render: ({ formModel, row }) => (
        <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请先选择劳务公司">
          {optionDatas.value?.LaborCompany?.map((item) => (
            <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
          ))}
        </el-select>
      )
    },
    {
      label: "现居住地址",
      prop: "currentStayAddress",
      colProp: layout12,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入现居住地址" clearable />
    },
    {
      label: "联系人关系",
      prop: "emergencyRelation",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入联系人关系" clearable />
    },
    {
      label: "联系人现居地址",
      prop: "emergencyResidence",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入联系人现居地址" clearable />
    },
    {
      label: "身高(米)",
      prop: "height",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入身高(米)" clearable />
    },
    {
      label: "体重(公斤)",
      prop: "weight",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入体重(公斤)" clearable />
    },
    {
      label: "籍贯",
      prop: "nativePlace",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入籍贯" clearable />
    },
    {
      label: "子女人数",
      prop: "children",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入子女人数" clearable />
    },
    {
      label: "参保情况",
      prop: "insurance",
      colProp: layout,
      render: ({ formModel, row }) => (
        <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
          {optionDatas.value?.IncuranceStatus?.map((item) => (
            <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
          ))}
        </el-select>
      )
    },
    {
      label: "电脑社保号",
      prop: "socialSecurity",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入电脑社保号" clearable />
    },
    {
      label: "计算机水平",
      prop: "computerLevel",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入计算机水平" clearable />
    },
    {
      label: "英语水平",
      prop: "englishLevel",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入英语水平" clearable />
    },
    {
      label: "离职日期",
      prop: "leaveofficeDate",
      colProp: layout,
      render: ({ formModel, row }) => (
        <el-date-picker v-model={formModel[row.prop]} placeholder="选择日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD" clearable style="width: 100%" />
      )
    },
    {
      label: "离职原因",
      prop: "resignationReason",
      colProp: layout,
      render: ({ formModel, row }) => (
        <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
          {optionDatas.value?.DimissionReason?.map((item) => (
            <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
          ))}
        </el-select>
      )
    },
    {
      label: "备注",
      prop: "remark",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入备注" clearable />
    },
    {
      label: "试用期(月)",
      prop: "tryDate",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入试用期(月)" clearable />
    },
    {
      label: "试用期工资",
      prop: "tryDateMoney",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入试用期工资" clearable />
    },
    {
      label: "工资开始核算日",
      prop: "moneyStartDate",
      colProp: layout,
      render: ({ formModel, row }) => (
        <el-date-picker v-model={formModel[row.prop]} placeholder="选择日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD" clearable style="width: 100%" />
      )
    },
    {
      label: "合同签订情况",
      prop: "contractSigning",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入合同签订情况" clearable />
    },
    {
      label: "合同到期日",
      prop: "contractExpiresDate",
      colProp: layout,
      render: ({ formModel, row }) => (
        <el-date-picker v-model={formModel[row.prop]} placeholder="选择日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD" clearable style="width: 100%" />
      )
    },
    {
      label: "续签次数",
      prop: "renewalCount",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入续签次数" clearable />
    },
    {
      label: "合同续签到期日",
      prop: "contractRenewalDate",
      colProp: layout,
      render: ({ formModel, row }) => (
        <el-date-picker v-model={formModel[row.prop]} placeholder="选择日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD" clearable style="width: 100%" />
      )
    },
    {
      label: "原岗位",
      prop: "oldPosition",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入原岗位" clearable />
    },
    {
      label: "调动日期",
      prop: "transferDate",
      colProp: layout,
      render: ({ formModel, row }) => (
        <el-date-picker v-model={formModel[row.prop]} placeholder="选择日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD" clearable style="width: 100%" />
      )
    },
    {
      label: "调动后岗位",
      prop: "newPosition",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入调动后岗位" clearable />
    },
    {
      label: "考勤机工号",
      prop: "clockingInUserCode",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入考勤" clearable />
    },
    // ======================= 以下为表格 ========================
    {
      label: "",
      prop: "",
      // hide: !options.row.staffInfoEducationVOS?.length,
      colProp: lineLayout,
      render: () => (
        <title-cate name="教育经历">
          <el-button size="small" icon={Plus} title="添加教育经历" onClick={() => onEditRow("add", "education")} />
        </title-cate>
      )
    },
    {
      label: "",
      prop: "",
      // hide: !options.row.staffInfoEducationVOS?.length,
      colProp: lineLayout,
      render: ({ formModel, row }) => {
        return (
          <div class="staff-record-table ui-w-100">
            <PureTableBar columns={educationColumns("edit")} show-icon={false}>
              {(props) => (
                <pure-table
                  border
                  row-key="id"
                  adaptive={true}
                  align-whole="center"
                  size={props.size}
                  data={educationDataList.value}
                  columns={props.dynamicColumns}
                  paginationSmall={props.size === "small"}
                  show-overflow-tooltip={true}
                >
                  {{
                    operation: ({ row }) => (
                      <>
                        <el-button size="small" icon={Edit} title="编辑教育经历" onClick={() => onEditRow("edit", "education", row)} />
                        <el-button size="small" icon={Delete} title="删除教育经历" onClick={() => onDeleteRow("education", row)} />
                      </>
                    )
                  }}
                </pure-table>
              )}
            </PureTableBar>
          </div>
        );
      }
    },
    {
      label: "",
      prop: "",
      // hide: !options.row.staffInfoFamilyVOS?.length,
      colProp: lineLayout,
      render: () => (
        <title-cate name="家庭关系（父母，姊妹）">
          <el-button icon={Plus} title="添加家庭关系" size="small" onClick={() => onEditRow("add", "family")} />
        </title-cate>
      )
    },
    {
      label: "",
      prop: "",
      // hide: !options.row.staffInfoFamilyVOS?.length,
      colProp: lineLayout,
      render: ({ formModel, row }) => {
        return (
          <div class="staff-record-table ui-w-100">
            <PureTableBar columns={foFamilyColumns("edit")} show-icon={false}>
              {(props) => (
                <pure-table
                  border
                  row-key="id"
                  adaptive={true}
                  align-whole="center"
                  size={props.size}
                  data={familyDataList.value}
                  columns={props.dynamicColumns}
                  paginationSmall={props.size === "small"}
                  show-overflow-tooltip={true}
                >
                  {{
                    operation: ({ row }) => (
                      <>
                        <el-button icon={Edit} title="编辑家庭关系" size="small" onClick={() => onEditRow("edit", "family", row)} />
                        <el-button icon={Delete} title="删除家庭关系" size="small" onClick={() => onDeleteRow("family", row)} />
                      </>
                    )
                  }}
                </pure-table>
              )}
            </PureTableBar>
          </div>
        );
      }
    },
    {
      label: "",
      prop: "",
      // hide: !options.row.staffInfoWorkVOS?.length,
      colProp: lineLayout,
      render: () => (
        <title-cate name="工作经历">
          <el-button icon={Plus} title="添加工作经历" size="small" onClick={() => onEditRow("add", "work")} />
        </title-cate>
      )
    },
    {
      label: "",
      prop: "",
      // hide: !options.row.staffInfoWorkVOS?.length,
      colProp: lineLayout,
      render: ({ formModel, row }) => {
        return (
          <div class="staff-record-table ui-w-100">
            <PureTableBar columns={workColumns} show-icon={false}>
              {(props) => (
                <pure-table
                  border
                  row-key="id"
                  adaptive={true}
                  align-whole="center"
                  size={props.size}
                  data={workDataList.value}
                  columns={props.dynamicColumns}
                  paginationSmall={props.size === "small"}
                  show-overflow-tooltip={true}
                >
                  {{
                    operation: ({ row }) => (
                      <>
                        <el-button icon={Edit} title="编辑工作经历" size="small" onClick={() => onEditRow("edit", "work", row)} />
                        <el-button icon={Delete} title="删除工作经历" size="small" onClick={() => onDeleteRow("work", row)} />
                      </>
                    )
                  }}
                </pure-table>
              )}
            </PureTableBar>
          </div>
        );
      }
    },
    {
      label: "",
      prop: "",
      colProp: lineLayout,
      render: () => <title-cate name="相关照片" />
    },
    {
      label: "",
      prop: "",
      colProp: lineLayout,
      render: ({ formModel, row }) => {
        const dataList: any = options.row?.staffInfoPhotoVOS || [];
        return (
          <div class="staff-record-table ui-w-100">
            <Photo src-list={dataList} />
          </div>
        );
      }
    }
  ];
};

/** 离职表单校验 */
export const dismissFformRules = reactive<FormRules>({
  leaveofficeDate: [{ required: true, message: "请选择离职日期", trigger: "blur" }],
  resignationReason: [{ required: true, message: "请选择离职原因", trigger: "blur" }]
});

// 离职表单配置
export const dismissFormConfigs = ({ dismissOption }): FormConfigItemType[] => {
  return [
    {
      label: "离职人员",
      prop: "staffNames",
      colProp: { span: 24 },
      render: ({ formModel, row }) => (
        <el-input v-model={formModel[row.prop]} rows={4} resize="none" type="textarea" autosize={{ minRows: 4, maxRows: 4 }} placeholder="离职人员" readonly />
      )
    },
    {
      label: "离职日期",
      prop: "leaveofficeDate",
      colProp: { span: 12 },
      render: ({ formModel, row }) => (
        <el-date-picker v-model={formModel[row.prop]} placeholder="选择日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD" clearable style="width: 100%" />
      )
    },
    {
      label: "离职原因",
      prop: "resignationReason",
      colProp: { span: 12 },
      render: ({ formModel, row }) => (
        <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
          {dismissOption?.map((item) => (
            <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
          ))}
        </el-select>
      )
    },
    {
      label: "备注",
      prop: "remark",
      colProp: { span: 12 },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入备注" clearable />
    }
  ];
};

/** 更新核算标准表单校验 */
export const standardFformRules = reactive<FormRules>({
  wageAccountingType: [{ required: true, message: "请选择工资核算标准", trigger: "blur" }]
});

// 更新核算标准表单配置
export const standardFormConfigs = ({ dmployeOption }): FormConfigItemType[] => {
  return [
    {
      label: "更新人员",
      prop: "staffNames",
      colProp: { span: 24 },
      render: ({ formModel, row }) => (
        <el-input v-model={formModel[row.prop]} rows={4} resize="none" type="textarea" autosize={{ minRows: 4, maxRows: 4 }} placeholder="离职人员" readonly />
      )
    },
    {
      label: "工资核算标准",
      prop: "wageAccountingType",
      colProp: { span: 24 },
      render: ({ formModel, row }) => (
        <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
          {dmployeOption?.map((item) => (
            <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
          ))}
        </el-select>
      )
    }
  ];
};
