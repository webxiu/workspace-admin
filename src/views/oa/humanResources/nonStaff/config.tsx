import { Ref, reactive, ref } from "vue";

import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import { getEnumDictList } from "@/utils/table";
import { getInductionAuditRoleInfoByDeptId } from "@/api/oaManage/humanResources";

export const formRules = (flag: Ref<boolean>) => {
  return {
    staffName: [{ required: true, message: "姓名为必填项", trigger: "submit" }],
    sex: [{ required: true, message: "性别为必填项", trigger: "submit" }],
    phone: [{ required: flag, message: "联系电话为必填项", trigger: "change" }],
    staffId: [{ required: true, message: "编号为必填项", trigger: "submit" }],
    isCreateQYWechat: [{ required: true, message: "是否加入企业微信为必填项", trigger: "submit" }],
    deptId: [{ required: true, message: "部门为必填项", trigger: "change" }],
    roleId: [{ required: flag, message: "岗位为必填项", trigger: "change" }]
  };
};

export const formConfigs = ({ changeQYWX, treeSelectData, _formData }) => {
  const postSelectValues = ref([]);
  const exmpetAttendanceOptions = ref([]);

  const changeDept = (deptId) => {
    getInductionAuditRoleInfoByDeptId({ deptId }).then((res: any) => {
      if (res.data) {
        postSelectValues.value = res.data.map(({ id, roleName }) => ({ label: roleName, value: id }));
      }
    });
  };

  getEnumDictList(["ExmpetAttendance"])
    .then((res) => (exmpetAttendanceOptions.value = res.ExmpetAttendance))
    .catch(console.log);

  if (_formData.value.deptId) {
    changeDept(_formData.value.deptId);
  }

  return [
    {
      label: "编号",
      prop: "staffId",
      labelWidth: 110,
      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入" />;
      }
    },
    {
      label: "姓名",
      prop: "staffName",
      labelWidth: 110,
      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入" />;
      }
    },
    {
      label: "性别",
      prop: "sex",
      labelWidth: 110,
      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} placeholder="请选择" style="width: 100%">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        );
      }
    },
    {
      label: "身份证号码",
      prop: "idCard",
      labelWidth: 110,
      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入" />;
      }
    },
    {
      label: "家庭住址",
      prop: "currentStayAddress",
      labelWidth: 110,
      colProp: { span: 16 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入" />;
      }
    },
    {
      label: "入厂日期",
      prop: "startDate",
      labelWidth: 110,
      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        return (
          <el-date-picker v-model={formModel[row.prop]} style="width: 100%" type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD" placeholder="请选择" />
        );
      }
    },
    {
      label: "加入企业微信",
      prop: "isCreateQYWechat",
      labelWidth: 110,
      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} placeholder="请选择" style="width: 100%" onChange={changeQYWX}>
            <el-option label="是" value={true} />
            <el-option label="否" value={false} />
          </el-select>
        );
      }
    },
    {
      label: "部门",
      prop: "deptId",
      labelWidth: 110,
      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        return (
          <el-tree-select
            v-model={formModel[row.prop]}
            data={treeSelectData.value}
            filterable
            check-strictly
            default-expanded-keys={[0]}
            node-key="value"
            render-after-expand={false}
            class="ui-w-100"
            onChange={changeDept}
          />
        );
      }
    },
    {
      label: "岗位",
      prop: "roleId",
      labelWidth: 110,
      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} placeholder="请选择" style="width: 100%">
            {postSelectValues.value.map((item) => (
              <el-option label={item.label} value={item.value} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "联系电话",
      prop: "phone",
      labelWidth: 110,
      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入" />;
      }
    },
    {
      label: "公司",
      prop: "laborServiceCompany",
      labelWidth: 110,
      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入" />;
      }
    },
    {
      label: "免考勤",
      prop: "exmpetAttendance",
      labelWidth: 110,
      colProp: { span: 8 },
      render: ({ formModel, row }) => (
        <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
          {exmpetAttendanceOptions.value.map((item) => (
            <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
          ))}
        </el-select>
      )
    },
    {
      label: "备注",
      prop: "remark",
      labelWidth: 110,
      colProp: { span: 16 },
      render: ({ formModel, row }) => {
        return <el-input type="textarea" autosize v-model={formModel[row.prop]} placeholder="请输入" />;
      }
    }
  ];
};
