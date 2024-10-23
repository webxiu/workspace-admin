import {
  StaffDeptGroupItemType,
  StaffDeptRoleInfoItemType,
  getInductionAuditDeptGroup,
  getInductionAuditRoleInfo,
  getInductionAuditRoleInfoByDeptId
} from "@/api/oaManage/humanResources";
import { reactive, ref } from "vue";

import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import { Loading } from "@element-plus/icons-vue";

// 审核验证
export const formRules = reactive<FormRules>({
  staffName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  staffId: [{ required: true, message: "请输入工号", trigger: "blur" }],
  deptId: [{ required: true, message: "请输入部门", trigger: "blur" }],
  roleId: [{ required: true, message: "请选择岗位", trigger: "blur" }],
  isStay: [{ required: true, message: "请输入是否住宿", trigger: "blur" }],
  employeKind: [{ required: true, message: "请输入雇员种类", trigger: "blur" }],
  workRuleId: [{ required: true, message: "请输入考勤", trigger: "blur" }],
  // machineId: [{ required: true, message: "请选择考勤机", trigger: "blur" }],
  tryDate: [{ required: true, message: "请输入试用期", trigger: "blur" }],
  moneyStartDate: [{ required: true, message: "请输入工资核算日期", trigger: "blur" }],
  level: [{ required: true, message: "请输入职级", trigger: "blur" }],
  inductionDate: [{ required: true, message: "请输入入职日期", trigger: "blur" }],
  wageAccountingType: [{ required: true, message: "请输入工资核算标准", trigger: "blur" }]
});

const LoadingIcon = () => (
  <el-icon class="is-loading">
    <Loading />
  </el-icon>
);

const layout = { span: 8, xs: 24, sm: 24, md: 8, lg: 8, xl: 8 };

/** 是否为临时工 */
export const TemporaryFlag = { 0: "否", 1: "是" };

// 1.审核表单
export const formConfigs = ({ formData, auditOptionData, row }): FormConfigItemType[] => {
  // const groupList = ref(auditOptionData.value.EmployeeLevel);
  // 首次进入不加载组别和岗位, 选择部门再添加
  const sLoading = ref<boolean>(false);
  const groupList = ref<StaffDeptGroupItemType[]>([]);
  const roleList = ref<StaffDeptRoleInfoItemType[]>([]);

  const onDeptChange = (deptId) => {
    formData.groupId = ""; // 重置组别
    formData.roleId = ""; // 重置岗位
    if (!deptId) {
      groupList.value = [];
      roleList.value = [];
      return;
    }
    sLoading.value = true;
    const p1 = getInductionAuditDeptGroup({ deptId }); // 获取组别列表
    const p2 = getInductionAuditRoleInfoByDeptId({ deptId }); // 获取岗位列表
    Promise.all([p1, p2])
      .then((res) => {
        sLoading.value = false;
        groupList.value = res[0].data || [];
        roleList.value = (res[1] as any).data || [];
      })
      .catch(() => (sLoading.value = false));
  };
  onDeptChange(row.deptId);

  return [
    {
      label: "姓名",
      prop: "staffName",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "工号",
      prop: "staffId",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "雇员种类",
      prop: "employeKind",
      colProp: layout,
      render: ({ formModel, row }) => (
        <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
          {auditOptionData.value.EmployeeType.map((item) => (
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
          data={auditOptionData.value.deptInfoTree}
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
            {groupList.value.map((item) => (
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
            {roleList.value.map((item) => (
              <el-option key={item.id} label={item.roleName} value={item.id} />
            ))}
          </el-select>
        )
    },
    {
      label: "是否住宿",
      prop: "isStay",
      colProp: layout,
      render: ({ formModel, row }) => (
        <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
          {auditOptionData.value.YesOrNo.map((item) => (
            <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
          ))}
        </el-select>
      )
    },
    {
      label: "考勤",
      prop: "workRuleId",
      colProp: layout,
      render: ({ formModel, row }) => (
        <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
          {auditOptionData.value.workTimeList.map((item) => (
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
            {auditOptionData.value.machineList.map((item) => (
              <el-option key={item.id} label={item.attMachineName} value={item.id} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "试用期(月)",
      prop: "tryDate",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "试用期工资",
      prop: "tryDateMoney",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "工资核算日期",
      prop: "moneyStartDate",
      colProp: layout,
      render: ({ formModel, row }) => (
        <el-date-picker v-model={formModel[row.prop]} placeholder="选择日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD" clearable style="width: 100%" />
      )
    },
    {
      label: "职级",
      prop: "level",
      colProp: layout,
      render: ({ formModel, row }) => (
        <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
          {auditOptionData.value.EmployeeLevel.map((item) => (
            <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
          ))}
        </el-select>
      )
    },
    {
      label: "入职日期",
      prop: "inductionDate",
      colProp: layout,
      render: ({ formModel, row }) => (
        <el-date-picker v-model={formModel[row.prop]} placeholder="选择日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD" clearable style="width: 100%" />
      )
    },
    {
      label: "工资核算标准",
      prop: "wageAccountingType",
      colProp: layout,
      render: ({ formModel, row }) => (
        <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
          {auditOptionData.value.EmployeeType.map((item) => (
            <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
          ))}
        </el-select>
      )
    }
  ];
};

// 2.基本信息表单
export const basicFormConfigs = (): FormConfigItemType[] => {
  return [
    {
      label: "应聘岗位",
      prop: "applyPosition",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly />
    },
    {
      label: "姓名",
      prop: "staffName",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly />
    },
    {
      label: "身份证号码",
      prop: "idCard",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly />
    },
    {
      label: "出生日期",
      prop: "birthDate",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly />
    },
    { label: "性别", prop: "sex", colProp: layout, render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly /> },
    {
      label: "身份证有效期",
      prop: "validDate",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly />
    },
    { label: "年龄", prop: "age", colProp: layout, render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly /> },
    {
      label: "联系电话",
      prop: "phone",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly />
    },
    {
      label: "是否住宿",
      prop: "isStay",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly />
    },
    {
      label: "户口所在地",
      prop: "registeredResidence",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly />
    },
    {
      label: "现居住地址",
      prop: "currentStayAddress",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly />
    },
    {
      label: "紧急联系人",
      prop: "emergencyName",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly />
    },
    {
      label: "联系人关系",
      prop: "emergencyRelation",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly />
    },
    {
      label: "联系人电话",
      prop: "emergencyPhone",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly />
    },
    {
      label: "联系人现居地",
      prop: "emergencyResidence",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly />
    },
    {
      label: "劳务公司",
      prop: "laborServiceCompany",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly />
    },
    {
      label: "登记日期",
      prop: "createDate",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly />
    },
    {
      label: "籍贯",
      prop: "nativePlace",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly />
    },
    {
      label: "民族",
      prop: "nation",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly />
    },
    {
      label: "最高学历",
      prop: "education",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly />
    },
    {
      label: "有无驾驶证",
      prop: "drivingLicence",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly />
    },
    {
      label: "婚姻状况",
      prop: "marital",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly />
    },
    {
      label: "子女人数",
      prop: "children",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly />
    },
    {
      label: "参加保险情况",
      prop: "insurance",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly />
    },
    {
      label: "社保电脑号",
      prop: "socialSecurity",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly />
    },
    {
      label: "英语水平",
      prop: "englishLevel",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly />
    },
    {
      label: "计算机水平",
      prop: "computerLevel",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly />
    },
    {
      label: "身高(米)",
      prop: "height",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly />
    },
    {
      label: "体重(公斤)",
      prop: "weight",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly />
    },
    {
      label: "考勤机名称",
      prop: "machineName",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly />
    }
  ];
};
