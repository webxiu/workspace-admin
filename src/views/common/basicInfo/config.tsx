import { StaffInfoItemType, getStaffDeptGroup } from "@/api/oaManage/humanResources";

import { FormConfigItemType } from "@/components/EditForm/index.vue";
import Photo from "@/views/oa/humanResources/inductionAudit/basicInfo/Photo.vue";
import { PureTableBar } from "@/components/RePureTableBar";
import { StaffOptionDataType } from "@/views/oa/humanResources/staffInfo/utils/config";
import { ref } from "vue";

interface OptionType {
  row: Partial<StaffInfoItemType>;
  optionDatas?: Partial<StaffOptionDataType>;
}

const layout = { span: 6 };
const lineLayout = { span: 24 };
const layout12 = { span: 12 };

/** 教育经历 */
export const educationColumns = [
  { label: "开始时间", prop: "startTime" },
  { label: "截止时间", prop: "endTime" },
  { label: "学校名称", prop: "schoolName" },
  { label: "学历", prop: "education" },
  { label: "专业", prop: "major" },
  { label: "备注", prop: "remark" }
];

/** 家庭关系 */
export const foFamilyColumns = [
  { label: "关系", prop: "relation" },
  { label: "姓名", prop: "name" },
  { label: "工作单位", prop: "workUnit" },
  { label: "职业", prop: "profession" },
  { label: "联系电话", prop: "contactNumber" }
];

/** 工作经历 */
export const workColumns = [
  { label: "开始时间", prop: "startTime" },
  { label: "截止时间", prop: "endTime" },
  { label: "公司名称", prop: "companyName" },
  { label: "职务名称", prop: "jobName" },
  { label: "薪金", prop: "money" },
  { label: "离职原因", prop: "leaveReason" },
  { label: "证明人及电话", prop: "certifierPhone" }
];

const findName = (arr: Array<{ optionValue: any; optionName: string }>, field) => {
  return arr?.find((item) => item.optionValue === field)?.optionName;
};

// 添加&修改表单配置
export const formConfigs = (options: OptionType): FormConfigItemType[] => {
  const { optionDatas, row } = options;
  const staffGroup = ref<any[]>([]);

  const onDeptChange = (deptId) => {
    getStaffDeptGroup({ deptId })
      .then((res) => {
        if (res.data) {
          staffGroup.value = res.data.map((item) => ({ optionValue: item.id, optionName: item.groupName }));
        }
      })
      .catch(console.log);
  };

  if (row?.deptId) {
    onDeptChange(row.deptId);
  }
  return [
    {
      label: "",
      prop: "",
      labelWidth: "0px",
      colProp: lineLayout,
      render: () => <title-cate name="必填信息" />
    },
    {
      label: "工号",
      prop: "staffId",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} clearable readonly />
    },
    {
      label: "姓名",
      prop: "staffName",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} clearable readonly />
    },
    {
      label: "身份证号码",
      prop: "idCard",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} clearable readonly />
    },
    {
      label: "民族",
      prop: "nation",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} clearable readonly />
    },
    {
      label: "出生日期",
      prop: "birthDate",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} clearable readonly />
    },
    {
      label: "性别",
      prop: "sex",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} clearable readonly />
    },
    {
      label: "年龄",
      prop: "age",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} clearable readonly />
    },
    {
      label: "最高学历",
      prop: "education",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} clearable readonly />
    },
    {
      label: "有无驾驶证",
      prop: "drivingLicence",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} clearable readonly />
    },
    {
      label: "婚姻状况",
      prop: "marital",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} clearable readonly />
    },
    {
      label: "联系电话",
      prop: "phone",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} clearable readonly />
    },
    {
      label: "工资核算标准",
      prop: "wageAccountingType",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} clearable readonly />
    },
    {
      label: "户口所在地",
      prop: "registeredResidence",
      colProp: layout12,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} clearable readonly />
    },
    {
      label: "紧急联系人",
      prop: "emergencyName",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} clearable readonly />
    },
    {
      label: "紧急联系人电话",
      prop: "emergencyPhone",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} clearable readonly />
    },
    {
      label: "入厂日期",
      prop: "startDate",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} clearable readonly />
    },
    {
      label: "考勤",
      prop: "workRuleId",
      colProp: layout,
      render: ({ formModel, row }) => {
        const valueName = findName(optionDatas?.workTimeList, `${formModel[row.prop]}`);
        return <el-input v-model={valueName} clearable readonly />;
      }
    },
    {
      label: "状态",
      prop: "state",
      colProp: layout,
      render: ({ formModel, row }) => {
        const valueName = findName(optionDatas?.EmployeeStatus, `${formModel[row.prop]}`);
        return <el-input v-model={valueName} clearable readonly />;
      }
    },
    {
      label: "是否住宿",
      prop: "accommodation",
      colProp: layout,
      render: ({ formModel, row }) => {
        const valueName = findName(optionDatas?.DormitoryType, `${formModel[row.prop]}`);
        return <el-input v-model={valueName} clearable readonly />;
      }
    },
    {
      label: "雇员种类",
      prop: "employeKind",
      colProp: layout,
      render: ({ formModel, row }) => {
        const valueName = findName(optionDatas?.EmployeeType, `${formModel[row.prop]}`);
        return <el-input v-model={valueName} clearable readonly />;
      }
    },
    {
      label: "部门",
      prop: "deptId",
      colProp: layout,
      render: ({ formModel, row }) => (
        <el-tree-select
          v-model={formModel[row.prop]}
          disabled
          filterable
          data={optionDatas?.deptInfoTree}
          check-strictly={true}
          check-on-click-node
          render-after-expand={false}
          class="ui-w-100"
          props={{ label: "name", value: "id" }}
        />
      )
    },
    {
      label: "组别",
      prop: "groupId",
      colProp: layout,
      render: ({ formModel, row }) => {
        const valueName = findName(staffGroup.value, formModel[row.prop]);
        return <el-input v-model={valueName} clearable readonly />;
      }
    },
    {
      label: "岗位",
      prop: "roleName",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} clearable readonly />
    },
    {
      label: "",
      prop: "",
      colProp: lineLayout,
      labelWidth: "0px",
      render: () => <title-cate name="基本信息" />
    },
    {
      label: "劳务公司",
      prop: "laborServiceCompany",
      hide: !row?.laborServiceCompany,
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} clearable readonly />
    },
    {
      label: "现居住地址",
      prop: "currentStayAddress",
      colProp: layout12,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} clearable readonly />
    },
    {
      label: "联系人关系",
      prop: "emergencyRelation",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} clearable readonly />
    },
    {
      label: "联系人现居地址",
      prop: "emergencyResidence",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} clearable readonly />
    },
    {
      label: "身高(米)",
      prop: "height",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} clearable readonly />
    },
    {
      label: "体重(公斤)",
      prop: "weight",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} clearable readonly />
    },
    {
      label: "籍贯",
      prop: "nativePlace",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} clearable readonly />
    },
    {
      label: "子女人数",
      prop: "children",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} clearable readonly />
    },
    {
      label: "参保情况",
      prop: "insurance",
      colProp: layout,
      render: ({ formModel, row }) => {
        const valueName = findName(optionDatas?.IncuranceStatus, `${formModel[row.prop]}`);
        return <el-input v-model={valueName} clearable readonly />;
      }
    },
    {
      label: "电脑社保号",
      prop: "socialSecurity",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} clearable readonly />
    },
    {
      label: "计算机水平",
      prop: "computerLevel",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} clearable readonly />
    },
    {
      label: "英语水平",
      prop: "englishLevel",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} clearable readonly />
    },
    {
      label: "离职日期",
      prop: "leaveofficeDate",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} clearable readonly />
    },
    {
      label: "离职原因",
      prop: "resignationReason",
      colProp: layout,
      render: ({ formModel, row }) => {
        const valueName = findName(optionDatas?.DimissionReason, `${formModel[row.prop]}`);
        return <el-input v-model={valueName} clearable readonly />;
      }
    },
    {
      label: "备注",
      prop: "remark",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} clearable readonly />
    },
    {
      label: "试用期(月)",
      prop: "tryDate",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} clearable readonly />
    },
    {
      label: "试用期工资",
      prop: "tryDateMoney",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} clearable readonly />
    },
    {
      label: "工资开始核算日",
      prop: "moneyStartDate",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} clearable readonly />
    },
    {
      label: "合同签订情况",
      prop: "contractSigning",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} clearable readonly />
    },
    {
      label: "合同到期日",
      prop: "contractExpiresDate",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} clearable readonly />
    },
    {
      label: "续签次数",
      prop: "renewalCount",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} clearable readonly />
    },
    {
      label: "合同续签到期日",
      prop: "contractRenewalDate",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} clearable readonly />
    },
    {
      label: "原岗位",
      prop: "oldPosition",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} clearable readonly />
    },
    {
      label: "调动日期",
      prop: "transferDate",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} clearable readonly />
    },
    {
      label: "调动后岗位",
      prop: "newPosition",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} clearable readonly />
    },
    {
      label: "考勤机工号",
      prop: "clockingInUserCode",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} clearable readonly />
    },
    // ======================= 以下为表格 ========================
    {
      label: "",
      prop: "",
      colProp: lineLayout,
      labelWidth: "0px",
      render: () => <title-cate name="教育经历" />
    },
    {
      label: "",
      prop: "",
      colProp: lineLayout,
      labelWidth: "0px",
      render: ({ formModel, row }) => {
        const dataList = options.row.staffInfoEducationVOS || [];
        return (
          <div class="staff-record-table ui-w-100">
            <PureTableBar columns={educationColumns} show-icon={false}>
              {(props) => (
                <pure-table
                  border
                  row-key="id"
                  adaptive={true}
                  align-whole="center"
                  size={props.size}
                  data={dataList}
                  columns={props.dynamicColumns}
                  paginationSmall={props.size === "small"}
                  show-overflow-tooltip={true}
                />
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
      labelWidth: "0px",
      render: () => <title-cate name="家庭关系（父母，姊妹）" />
    },
    {
      label: "",
      prop: "",
      colProp: lineLayout,
      labelWidth: "0px",
      render: ({ formModel, row }) => {
        const dataList = options.row.staffInfoFamilyVOS || [];
        return (
          <div class="staff-record-table ui-w-100">
            <PureTableBar columns={foFamilyColumns} show-icon={false}>
              {(props) => (
                <pure-table
                  border
                  row-key="id"
                  adaptive={true}
                  align-whole="center"
                  size={props.size}
                  data={dataList}
                  columns={props.dynamicColumns}
                  paginationSmall={props.size === "small"}
                  show-overflow-tooltip={true}
                />
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
      labelWidth: "0px",
      render: () => <title-cate name="工作经历" />
    },
    {
      label: "",
      prop: "",
      colProp: lineLayout,
      labelWidth: "0px",
      render: ({ formModel, row }) => {
        const dataList = options.row.staffInfoWorkVOS || [];
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
                  data={dataList}
                  columns={props.dynamicColumns}
                  paginationSmall={props.size === "small"}
                  show-overflow-tooltip={true}
                />
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
      labelWidth: "0px",
      render: () => <title-cate name="相关照片" class="border-color" />
    },
    {
      label: "",
      prop: "",
      colProp: lineLayout,
      labelWidth: "0px",
      render: ({ formModel, row }) => {
        const dataList: any = options.row.staffInfoPhotoVOS || [];
        return (
          <div class="staff-record-table ui-w-100">
            <Photo src-list={dataList} />
          </div>
        );
      }
    }
  ];
};
