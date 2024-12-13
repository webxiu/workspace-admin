import { Ref, reactive, ref } from "vue";

import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import { Plus } from "@element-plus/icons-vue";

// 编辑员工信息校验
export const formRules = reactive<FormRules>({
  staffName: [{ required: true, message: "输入姓名", trigger: ["blur"] }],
  staffCode: [{ required: true, message: "输入工号", trigger: ["blur"] }],
  deptName: [{ required: true, message: "请选择部门", trigger: ["blur"] }],
  roleName: [{ required: true, message: "请选择职务", trigger: ["blur"] }],
  startDate: [{ required: true, message: "请选择入职日期", trigger: ["blur"] }],
  applyDate: [{ required: true, message: "请选择申请日期", trigger: ["blur"] }],
  resignationType: [{ required: true, message: "请选择离职类别", trigger: ["blur"] }],
  resignationReason: [{ required: true, message: "请输入离职原因", trigger: ["blur"] }]
});

// 离职类别
export const resignType = [
  { label: "正常离职", value: "正常离职" },
  { label: "急辞", value: "急辞" },
  { label: "试用期不合格", value: "试用期不合格" },
  { label: "解除劳动合同关系", value: "解除劳动合同关系" },
  { label: "其他", value: "其他" }
];

export const formConfigs = ({ type, userList, onUserChange }): Ref<FormConfigItemType[]> => {
  const configArr = ref<FormConfigItemType[]>([
    {
      label: "姓名",
      prop: "staffName",
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return (
          <el-tree-select
            disabled={type !== "add"}
            v-model={formModel[row.prop]}
            data={userList.value}
            filterable
            check-strictly
            default-expanded-keys={[0]}
            node-key="id"
            render-after-expand={false}
            props={{ label: "staffName", value: "staffId" }}
            onChange={onUserChange}
            class="ui-w-100"
          />
        );
      }
    },
    {
      label: "工号",
      prop: "staffCode",
      colProp: { span: 12 },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" disabled clearable />
    },
    {
      label: "部门",
      prop: "deptName",
      colProp: { span: 12 },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" disabled clearable />
    },
    {
      label: "职务",
      prop: "roleName",
      colProp: { span: 12 },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" disabled clearable />
    },
    {
      label: "入职日期",
      prop: "startDate",
      colProp: { span: 12 },
      render: ({ formModel, row }) => (
        <el-date-picker
          type="date"
          v-model={formModel[row.prop]}
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          placeholder="请选择"
          disabled
          clearable
          style="width: 100%;"
        />
      )
    },
    {
      label: "申请日期",
      prop: "applyDate",
      colProp: { span: 12 },
      render: ({ formModel, row }) => (
        <el-date-picker
          type="date"
          v-model={formModel[row.prop]}
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          placeholder="请选择"
          readonly={type === "view"}
          clearable
          style="width: 100%;"
        />
      )
    },
    {
      label: "离职类别",
      prop: "resignationType",
      colProp: { span: 24 },
      render: ({ formModel, row }) => {
        if (formModel[row.prop] === "其他") onChangeType("其他");
        return (
          <el-radio-group v-model={formModel[row.prop]} onChange={onChangeType} class={type === "view" ? "readonly" : ""}>
            {resignType.map((item) => (
              <el-radio key={item.value} label={item.value} disabled={type === "view"}>
                {item.label}
              </el-radio>
            ))}
          </el-radio-group>
        );
      }
    },
    {
      label: "其他",
      prop: "other",
      colProp: { span: 12 },
      hide: true,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable readonly={type === "view"} />
    },
    {
      label: "离职原因",
      prop: "resignationReason",
      colProp: { span: 24 },
      render: ({ formModel, row }) => (
        <el-input
          v-model={formModel[row.prop]}
          rows={1}
          autofocus
          resize="none"
          type="textarea"
          autosize={{ minRows: 1, maxRows: 3 }}
          placeholder="请输入"
          readonly={type === "view"}
          clearable
        />
      )
    }
  ]);
  function onChangeType(value) {
    configArr.value.forEach((item) => {
      if (item.prop === "other") item.hide = value !== "其他";
      if (item.prop === "resignationReason") {
        item.colProp = value === "其他" ? { span: 12 } : { span: 24 };
      }
    });
  }
  return configArr;
};

export const printFormConfigs = (): FormConfigItemType[] => {
  const styleEl = { height: "40px", display: "inline-flex", alignItems: "center" };
  const styleItem = { alignItems: "center" };
  return [
    {
      label: "姓 名",
      prop: "staffName",
      class: "center-label",
      colProp: { span: 12 },
      style: styleItem,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly style={styleEl} />
    },
    {
      label: "工 号",
      prop: "staffCode",
      class: "center-label",
      colProp: { span: 12 },
      style: styleItem,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly style={styleEl} />
    },
    {
      label: "部 门",
      prop: "deptName",
      class: "center-label",
      colProp: { span: 12 },
      style: styleItem,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly style={styleEl} />
    },
    {
      label: "职 务",
      prop: "roleName",
      class: "center-label",
      colProp: { span: 12 },
      style: styleItem,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly style={styleEl} />
    },
    {
      label: "入职日期",
      prop: "startDate",
      class: "center-label",
      colProp: { span: 12 },
      style: styleItem,
      render: ({ formModel, row }) => (
        <el-date-picker type="date" v-model={formModel[row.prop]} format="YYYY-MM-DD" value-format="YYYY-MM-DD" readonly style={styleEl} />
      )
    },
    {
      label: "申请日期",
      prop: "applyDate",
      class: "center-label",
      colProp: { span: 12 },
      style: styleItem,
      render: ({ formModel, row }) => (
        <el-date-picker type="date" v-model={formModel[row.prop]} format="YYYY-MM-DD" value-format="YYYY-MM-DD" readonly style={styleEl} />
      )
    },
    {
      label: "离职类别",
      prop: "resignationType",
      class: "center-label",
      colProp: { span: 24 },
      style: styleItem,
      render: ({ formModel, row }) => (
        <el-checkbox-group v-model={formModel[row.prop]} class="pl-10" style={{ ...styleEl, flexWrap: "wrap", height: "80px" }}>
          {resignType.map((item) => (
            <el-checkbox label={item.value} key={item.value} style={{ width: "160px" }} disabled>
              {item.value === "其他" ? (
                <span>
                  {item.label}：
                  <span class="bottom-line ellipsis" style="width: 120px; max-width:280px">
                    {formModel.other}
                  </span>
                </span>
              ) : (
                item.label
              )}
            </el-checkbox>
          ))}
        </el-checkbox-group>
      )
    },
    {
      label: "离职原因",
      prop: "resignationReason",
      class: "center-label",
      colProp: { span: 14 },
      slots: {
        label: ({ label }) => (
          <>
            <p>{label}</p>
            <p>(员工本人填写)</p>
          </>
        )
      },
      style: { ...styleItem, height: "auto" },
      render: ({ formModel, row }) => (
        <el-input v-model={formModel[row.prop]} rows={3} autofocus resize="none" type="textarea" autosize={{ minRows: 3, maxRows: 3 }} readonly />
      )
    },
    {
      label: "员工本人签名：",
      prop: "xxx81",
      class: "hide-left hide-content-left",
      colProp: { span: 10 },
      labelWidth: "160px",
      style: { height: "100%", alignItems: "flex-end" },
      slots: { label: ({ label }) => <span style={{ marginRight: "-18px" }}>{label}</span> },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly />
    },
    {
      label: "部门组长/主管",
      prop: "group",
      class: "center-label",
      colProp: { span: 14 },
      slots: {
        label: ({ label }) => (
          <>
            <p>{label}</p>
            <p>面谈记录</p>
          </>
        )
      },
      style: { ...styleItem, height: "auto" },
      render: ({ formModel, row }) => (
        <el-input v-model={formModel[row.prop]} rows={3} autofocus resize="none" type="textarea" autosize={{ minRows: 3, maxRows: 3 }} readonly />
      )
    },
    {
      label: "部门组长/主管签名：",
      prop: "groupName",
      class: "hide-left hide-content-left",
      colProp: { span: 10 },
      labelWidth: "160px",
      style: { height: "100%", alignItems: "flex-end" },
      slots: { label: ({ label }) => <span style={{ marginRight: "-18px" }}>{label}</span> },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly />
    },
    {
      label: "部门负责人",
      prop: "department",
      class: "center-label",
      colProp: { span: 24 },
      slots: {
        label: ({ label }) => (
          <>
            <p>{label}</p>
            <p>（经理/总监）</p>
            <p>意见</p>
          </>
        )
      },
      style: { ...styleItem, height: "auto" },
      render: ({ formModel, row }) => {
        const [year, month, day] = (formModel.applyDate || "").split("-");
        return (
          <>
            <el-input
              v-model={formModel[row.prop]}
              rows={3}
              autofocus
              resize="none"
              type="textarea"
              autosize={{ minRows: 3, maxRows: 3 }}
              readonly
              placeholder="面谈记录/意见："
              class="border-line"
            />
            <div class="leave-date">
              <div class="flex" style={{ lineHeight: 1 }}>
                <span>准予服务至</span>
                <span class="bottom-line ui-ta-c w-60">{year}</span>
                <span>年</span>
                <span class="bottom-line ui-ta-c w-40">{month}</span>
                <span>月</span>
                <span class="bottom-line ui-ta-c w-40">{day}</span>
                <span>日，次日起离职。</span>
              </div>
              <div style={{ lineHeight: 1, marginLeft: "68%", marginTop: "10px" }}>
                <span>签名：</span>
                <span class="ui-ta-c w-32">{formModel.departmentName}</span>
              </div>
            </div>
          </>
        );
      }
    },
    {
      label: "人力资源部",
      prop: "humanResources",
      class: "center-label",
      colProp: { span: 24 },
      slots: {
        label: ({ label }) => (
          <>
            <p>{label}</p>
            <p>意见</p>
          </>
        )
      },
      style: { ...styleItem, height: "auto" },
      render: ({ formModel, row }) => (
        <el-input v-model={formModel[row.prop]} rows={3} autofocus resize="none" type="textarea" autosize={{ minRows: 3, maxRows: 3 }} readonly />
      )
    },
    {
      label: "高层领导",
      prop: "mananger",
      class: "center-label",
      colProp: { span: 24 },
      slots: {
        label: ({ label }) => (
          <>
            <p>{label}</p>
            <p>（副总/总经理）</p>
            <p>意见</p>
          </>
        )
      },
      style: { ...styleItem, height: "auto" },
      render: ({ formModel, row }) => (
        <el-input v-model={formModel[row.prop]} rows={3} autofocus resize="none" type="textarea" autosize={{ minRows: 3, maxRows: 3 }} readonly />
      )
    }
  ];
};
