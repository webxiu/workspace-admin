import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import ImportUpload from "./importUpload.vue";
import { reactive } from "vue";

const formRules = reactive<FormRules>({
  electric: [{ required: true, message: "电表数为必填项", trigger: "change" }],
  water: [{ required: true, message: "水表数为必填项", trigger: "change" }]
});

const formRulesTop = reactive<FormRules>({
  electric: [
    { required: true, message: "电表数为必填项", trigger: "change" },
    { pattern: /\d/, message: "只能输入数字", trigger: "change" }
  ],
  water: [
    { required: true, message: "水表数为必填项", trigger: "change" },
    { pattern: /\d/, message: "只能输入数字", trigger: "change" }
  ],
  yearAndMonth: [{ required: true, message: "年月必填", trigger: "change" }],
  name: [{ required: true, message: "宿舍楼必填", trigger: "change" }],
  dormitoryCode: [{ required: true, message: "房间号必填", trigger: "change" }]
});

const formRules1 = reactive<FormRules>({
  files: [{ required: true, message: "未选择任何文件", trigger: "change" }],
  yearAndMonth: [{ required: true, message: "年月必填", trigger: "change" }]
});

const formConfigs = () => [
  {
    label: "年月",
    prop: "yearAndMonth",
    labelWidth: 70,
    render: ({ formModel, row }) => {
      return <el-date-picker style={{ width: "100%" }} value-format="YYYY-MM" v-model={formModel[row.prop]} type="month" />;
    }
  },
  {
    label: "电表数",
    prop: "electric",
    labelWidth: 70,
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="本月电表数" />;
    }
  },
  {
    label: "水表数",
    labelWidth: 70,
    prop: "water",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="本月水表数" />;
    }
  }
];

const formConfigsTop = ({ type, buildings, changeBuilding, handleAddOtherUserNames }): FormConfigItemType[] => {
  let calcArr = [
    {
      label: "年月",
      prop: "yearAndMonth",
      labelWidth: 100,
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-date-picker style={{ width: "100%" }} disabled={type === "edit"} value-format="YYYY-MM" v-model={formModel[row.prop]} type="month" />;
      }
    },
    {
      label: "",
      prop: "",
      labelWidth: 100,
      colProp: { span: 12 },
      render: () => null
    },
    {
      label: "宿舍楼",
      labelWidth: 100,
      colProp: { span: 12 },

      prop: "name",
      render: ({ formModel, row }) => {
        return (
          <el-select disabled={type === "edit"} v-model={formModel[row.prop]} placeholder="选择宿舍楼栋" style={{ width: "100%" }} onChange={changeBuilding}>
            {buildings.value.map((item) => (
              <el-option key={item.id} label={item.name} value={item.id} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "房间号",
      labelWidth: 100,
      colProp: { span: 12 },

      prop: "dormitoryCode",
      render: ({ formModel, row }) => {
        return (
          <el-input readonly v-model={formModel[row.prop]} disabled={type === "edit"} onClick={() => handleAddOtherUserNames && handleAddOtherUserNames()} />
        );
      }
    },
    {
      label: "上月电表数",
      prop: "lastElectric",
      labelWidth: 100,
      colProp: { span: 12 },

      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled={type === "edit"} />;
      }
    },
    {
      label: "上月水表数",
      prop: "lastWater",
      labelWidth: 100,
      colProp: { span: 12 },

      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled={type === "edit"} />;
      }
    },
    {
      label: "本月电表数",
      prop: "electric",
      labelWidth: 100,
      colProp: { span: 12 },

      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="本月电表数" />;
      }
    },
    {
      label: "本月水表数",
      labelWidth: 100,
      colProp: { span: 12 },

      prop: "water",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="本月水表数" />;
      }
    }
  ];

  if (type === "add") {
    calcArr = calcArr.filter((item) => !["lastElectric", "lastWater"].includes(item.prop));
  }
  return calcArr;
};

const formConfigs1 = () => [
  {
    label: "年月",
    labelWidth: 60,
    prop: "yearAndMonth",
    render: ({ formModel, row }) => {
      return <el-date-picker style={{ width: "100%" }} value-format="YYYY-MM" v-model={formModel[row.prop]} type="month" />;
    }
  },
  {
    label: "文件",
    labelWidth: 60,
    slots: { label: ({ label }) => <span class="fw-700">{label}</span> },
    prop: "files",
    render: ({ formModel, row }) => {
      return <ImportUpload style={{ width: "100%" }} v-model={formModel[row.prop]} />;
    }
  }
];

export { formConfigs, formConfigsTop, formRules, formRulesTop, formRules1, formConfigs1 };
