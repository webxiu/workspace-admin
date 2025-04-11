<template>
  <TableEditList ref="formRef" :showGroupTitle="false" :loading="loading" :params="{ pageUrl: props.pageUrl, groupCode: '1' }" :formConfig="formConfig" />
</template>

<script setup lang="tsx">
import { h, onMounted, reactive, ref, watch } from "vue";
import { FormItemConfigType } from "@/utils/form";
import TableEditList from "@/components/TableEditList/index.vue";
import TitleCate from "@/components/TitleCate.vue";
import { PureTableBar } from "@/components/RePureTableBar";
import { Delete, Edit, Plus } from "@element-plus/icons-vue";
import { educationColumns, foFamilyColumns, SumitStaffInfoItemType, workColumns } from "./utils/config";
import dayjs from "dayjs";
import { showMessageBox, message } from "@/utils/message";
import { v4 as uuidv4 } from "uuid";
import Photo from "@/views/humanResources/inductionAudit/basicInfo/Photo.vue";
import { addDialog } from "@/components/ReDialog";
import { getIdCardInfo } from "@/utils/common";
import { getEnumDictList } from "@/utils/table";
import { boolOptions, numberOptions } from "@/config/constant";
import EditForm, { FormConfigItemType } from "@/components/EditForm/index.vue";

import { StaffInfoEducationVOSType, StaffInfoFamilyVOSType, StaffInfoItemType, StaffInfoWorkVOSType, getLevelByRoleId } from "@/api/oaManage/humanResources";

interface Props {
  id?: string;
  type?: "add" | "edit" | "view";
  formInline?: SumitStaffInfoItemType;
  temporaryFlag?: number;
  pageUrl?: string;
}

/** 信息中心的查看单据id */
const props = withDefaults(defineProps<Props>(), {
  id: "",
  type: "add",
  formInline: () => ({} as SumitStaffInfoItemType)
});

const isView = props.type === "view";
const isEdit = props.type === "edit";
const layout12 = { span: 12 };
const formRef = ref();
const loading = ref(false);
const optionList = ref([]);
const levelOptions = ref([]);
const educationDataList = ref<StaffInfoEducationVOSType[]>(props.formInline?.staffInfoEducationVOS || []); //教育经历
const familyDataList = ref<StaffInfoFamilyVOSType[]>(props.formInline?.staffInfoFamilyVOS || []); // 家庭管理
const workDataList = ref<StaffInfoWorkVOSType[]>(props.formInline?.staffInfoWorkVOS || []); // 工作经历
const formData = reactive<SumitStaffInfoItemType>(props.formInline);
const label = ({ label }) => <TitleCate name={label} />;

onMounted(() => getOption());
watch(props, watchUpdata, { deep: true });

function watchUpdata(values) {
  Object.assign(formData, values.formInline);
}

const formConfig: FormItemConfigType[] = [
  {
    formData: formData,
    customProps: {
      staffId: { disabled: isEdit },
      phone: { disabled: isEdit },
      idCard: { onBlur: handleBlur },
      deptId: {
        formatAPI: (data) => data.deptInfoTree,
        apiFields: ["groupId", "roleId"]
      },
      isSalary: {
        onChange: (val) => (formData.isSeniorityCalc = val)
      },
      groupId: { apiParams: { deptId: formData.deptId } },
      roleId: {
        apiParams: { deptId: formData.deptId },
        onChange: (roleId) => {
          getLevelByRoleId({ roleId }).then(({ data }) => {
            formData.level = data.level;
          });
        }
      }
    },
    customElement: {
      title_education: ({ formModel, row }) => {
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
      },
      title_family: ({ formModel, row }) => {
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
      },
      title_work: ({ formModel, row }) => {
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
      },
      title_photo: ({ formModel, row }) => {
        const dataList: any = props.formInline?.staffInfoPhotoVOS || [];
        return (
          <div class="staff-record-table ui-w-100">
            <Photo src-list={dataList} />
          </div>
        );
      }
    },
    customColumn: {
      title_required: { slot: { label } },
      title_basic: { slot: { label } },
      validDate: { hide: !isEdit },
      laborServiceCompany: { hide: props.temporaryFlag === 0 },
      title_education: {
        slot: {
          label: ({ label }) => (
            <TitleCate name={label}>
              <el-button icon={Plus} title="添加教育经历" size="small" onClick={() => onEditRow("add", "education")} />
            </TitleCate>
          )
        }
      },
      title_family: {
        slot: {
          label: ({ label }) => (
            <TitleCate name={label}>
              <el-button icon={Plus} title="添加家庭关系" size="small" onClick={() => onEditRow("add", "family")} />
            </TitleCate>
          )
        }
      },
      title_work: {
        slot: {
          label: ({ label }) => (
            <TitleCate name={label}>
              <el-button icon={Plus} title="添加工作经历" size="small" onClick={() => onEditRow("add", "work")} />
            </TitleCate>
          )
        }
      },
      title_photo: { slot: { label } }
    },
    dataOption: { exmpetAttendance: boolOptions, isPoorPeople: numberOptions },
    formProps: { labelWidth: "120px", labelPosition: "top" }
  }
];

function getOption() {
  getEnumDictList(["DegreeType", "EmployeeLevel"])
    .then(({ DegreeType, EmployeeLevel }) => {
      optionList.value = DegreeType;
      levelOptions.value = EmployeeLevel;
    })
    .catch(console.log);
}

function handleBlur(v) {
  const val = v.target.value;
  if (val && typeof val === "string" && val.length === 18) {
    const borthDayMonth = getIdCardInfo(val, 1);
    const gender = getIdCardInfo(val, 2);
    const age = getIdCardInfo(val, 3);
    formData.age = age as number;
    formData.sex = gender as string;
    formData.birthDate = borthDayMonth as string;
  }
}

function onEditRow(type: "add" | "edit", cate: "education" | "family" | "work", row?) {
  const formRef = ref();
  const name = { add: "新增", edit: "修改" }[type];
  const title = { education: "教育经历", family: "家庭关系", work: "工作经历" }[cate];
  const _formData = {
    education: reactive({ ...row }),
    family: reactive({ ...row }),
    work: reactive({ ...row })
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
      message.error("开始时间不能晚于结束时间");
      _formData[cate].startTime = undefined;
      return;
    }
  };

  const changeEnd = (val) => {
    endTimeVal.value = val;
    if (startTimeVal.value && dayjs(val).isBefore(startTimeVal.value)) {
      message.error("结束时间不能早于开始时间");
      _formData[cate].endTime = undefined;
      return;
    }
  };

  const _render = ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />;

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
      { label: "学校名称", prop: "schoolName", colProp: layout12, render: _render },
      {
        label: "学历",
        prop: "education",
        colProp: layout12,
        render: ({ formModel, row }) => (
          <el-select onChange={changeEdu} v-model={formModel[row.prop]} placeholder="请选择" style={{ width: "100%" }}>
            {optionList.value.map((item) => (
              <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
            ))}
          </el-select>
        )
      },
      { label: "专业", hide: true, prop: "major", colProp: layout12, render: _render },
      { label: "备注", prop: "remark", colProp: layout12, render: _render }
    ],
    family: [
      { label: "关系", prop: "relation", colProp: layout12, render: _render },
      { label: "姓名", prop: "name", colProp: layout12, render: _render },
      { label: "工作单位", prop: "workUnit", colProp: layout12, render: _render },
      { label: "职业", prop: "profession", colProp: layout12, render: _render },
      { label: "联系电话", prop: "contactNumber", colProp: layout12, render: _render }
    ],
    work: [
      {
        label: "开始时间",
        prop: "startTime",
        colProp: layout12,
        render: ({ formModel, row }) => (
          <el-date-picker v-model={formModel[row.prop]} type="month" placeholder="请选择" format="YYYY-MM" value-format="YYYY-MM" style="width: 100%" />
        )
      },
      {
        label: "截止时间",
        prop: "endTime",
        colProp: layout12,
        render: ({ formModel, row }) => (
          <el-date-picker v-model={formModel[row.prop]} type="month" placeholder="请选择" format="YYYY-MM" value-format="YYYY-MM" style="width: 100%" />
        )
      },
      { label: "公司名称", prop: "companyName", colProp: layout12, render: _render },
      { label: "职务名称", prop: "jobName", colProp: layout12, render: _render },
      { label: "薪金", prop: "money", colProp: layout12, render: _render },
      { label: "离职原因", prop: "leaveReason", colProp: layout12, render: _render },
      { label: "证明人及电话", prop: "certifierPhone", colProp: layout12, render: _render }
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
}

function onDeleteRow(cate, row) {
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
}

// 详情数据
function getDetail() {
  // if (!props.id) return;
  // loading.value = true;
  // getStaffInfoDetail({ page: 1, limit: 100000 })
  //   .then(({ data }) => {
  //     Object.assign(formData, data);
  //   })
  //   .finally(() => (loading.value = false));
}

function getRef() {
  return formRef.value.getRef();
}
defineExpose({ getRef });
</script>
