import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import { reactive } from "vue";

export const formRules = reactive<FormRules>({
  building: [{ required: true, message: "宿舍楼栋为必填项", trigger: "submit" }],
  yearAndMonth: [{ required: true, message: "更换日期为必填项", trigger: "submit" }],
  meterType: [{ required: true, message: "更换表类型为必填项", trigger: "submit" }],
  zoom: [{ required: true, message: "宿舍房间为必填项", trigger: "submit" }],
  oldMeterNumber: [{ required: true, message: "旧表读数为必填项", trigger: "submit" }],
  newMeterNumber: [{ required: true, message: "新表计数为必填项", trigger: "submit" }],
  oldElectricity: [{ required: true, message: "旧电表数为必填项", trigger: "submit" }],
  newElectricity: [{ required: true, message: "新电表数为必填项", trigger: "submit" }]
});

export const formConfigs = ({ handleAddOtherUserNames, type, optionListInfo, changeBuilding, buildings = [] }): FormConfigItemType[] => {
  console.log(buildings, "buildings");
  const isView = type === "view";
  let confArr: FormConfigItemType[] = [
    {
      label: "更换日期",
      prop: "yearAndMonth",
      labelWidth: 92,
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-date-picker style={{ width: "100%" }} placeholder="选择更换日期" value-format="YYYY-MM-DD" v-model={formModel[row.prop]} type="date" />;
      }
    },
    {
      label: "宿舍楼栋",
      prop: "building",
      labelWidth: 92,
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} placeholder="选择宿舍楼栋" style={{ width: "100%" }} onChange={changeBuilding}>
            {buildings.value.map((item) => (
              <el-option key={item.id} label={item.name} value={item.id} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "宿舍房间",
      labelWidth: 92,
      colProp: { span: 12 },
      prop: "zoom",
      render: ({ formModel, row }) => {
        return (
          <el-input
            disabled={isView}
            readonly
            onClick={() => handleAddOtherUserNames && handleAddOtherUserNames()}
            v-model={formModel[row.prop]}
            placeholder="请选择宿舍房间"
          />
        );
      }
    },
    {
      label: "更换表类型",
      prop: "meterType",
      labelWidth: 92,
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        const meterTypeOpts = [
          { label: "水表", value: "水表" },
          { label: "电表", value: "电表" }
        ];
        return (
          <el-select v-model={formModel[row.prop]} placeholder="选择更换表类型" style={{ width: "100%" }}>
            {meterTypeOpts.map((item) => (
              <el-option key={item.value} label={item.label} value={item.value} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "旧表读数",
      prop: "oldMeterNumber",
      labelWidth: 92,
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return (
          <el-input-number style={{ width: "100%" }} min={0} controls={false} disabled={isView} v-model={formModel[row.prop]} placeholder="请填写旧表读数" />
        );
      }
    },
    {
      label: "新表计数",
      prop: "newMeterNumber",
      labelWidth: 92,
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return (
          <el-input-number style={{ width: "100%" }} min={0} controls={false} disabled={isView} v-model={formModel[row.prop]} placeholder="请填写新表计数" />
        );
      }
    },
    {
      label: "创建人",
      prop: "createUserName",
      labelWidth: 92,
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input disabled v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "创建时间",
      prop: "createDate",
      labelWidth: 92,
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input disabled v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "修改人",
      prop: "modifyUserName",
      labelWidth: 92,
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input disabled v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "修改时间",
      prop: "modifyDate",
      labelWidth: 92,
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input disabled v-model={formModel[row.prop]} />;
      }
    }
  ];

  if (type === "add") {
    confArr = confArr.filter((item) => !["createUserName", "createDate", "modifyUserName", "modifyDate"].includes(item.prop));
  }

  return confArr;
};
