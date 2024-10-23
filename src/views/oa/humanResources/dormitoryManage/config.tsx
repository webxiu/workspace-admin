import { Check, Close } from "@element-plus/icons-vue";
import { h, reactive, ref } from "vue";

import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import SelectUser from "./selectUser/index.vue";
import { addDialog } from "@/components/ReDialog";
import { getEnumDictList } from "@/utils/table";

const formRules = reactive<FormRules>({
  staffName: [{ required: true, message: "姓名为必填项", trigger: "change" }],
  staffId: [{ required: true, message: "工号为必填项", trigger: "change" }],
  ariseDate: [{ required: true, message: "搬离时间为必填项", trigger: "change" }]
});

const formRules1 = reactive<FormRules>({
  buildingCode: [{ required: true, message: "栋必填", trigger: "change" }],
  floorNo: [{ required: true, message: "楼层必填", trigger: "change" }],
  dormitoryCode: [{ required: true, message: "房间号必填", trigger: "change" }]
});

const formRules2 = reactive<FormRules>({
  floorNo: [{ required: true, message: "楼层必填", trigger: "change" }],
  dormitoryCode: [{ required: true, message: "房间号必填", trigger: "change" }],
  checkInUser: [{ required: true, message: "入住人员必填", trigger: "change" }],
  moveInDate: [{ required: true, message: "入住时间必填", trigger: "change" }]
});

const formRules3 = reactive<FormRules>({
  name: [{ required: true, message: "编号必填", trigger: "change" }],
  type: [{ required: true, message: "是否生成宿舍必填", trigger: "change" }],
  floor: [{ required: true, message: "楼层必填", trigger: "change" }],
  number: [{ required: true, message: "每层房间数必填", trigger: "change" }]
});

const formRules4 = reactive<FormRules>({
  name: [{ required: true, message: "编号必填", trigger: "change" }]
});

const formRules5 = reactive<FormRules>({
  floorNo: [{ required: true, message: "楼层必填", trigger: "change" }],
  dormitoryCode: [{ required: true, message: "房间号必填", trigger: "change" }]
});

const formConfigs = () => [
  {
    label: "姓名",
    prop: "staffName",
    labelWidth: 80,
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入姓名" />;
    }
  },
  {
    label: "工号",
    prop: "staffId",
    labelWidth: 80,
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入工号" />;
    }
  },
  {
    label: "搬离时间",
    prop: "ariseDate",
    labelWidth: 80,
    render: ({ formModel, row }) => {
      const shortcuts = [
        {
          text: "今天",
          value: new Date()
        },
        {
          text: "昨天",
          value: () => {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            return date;
          }
        },
        {
          text: "一周前",
          value: () => {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            return date;
          }
        }
      ];
      return (
        <el-date-picker
          value-format="YYYY-MM-DD HH:mm:ss"
          clearable={false}
          v-model={formModel[row.prop]}
          type="datetime"
          placeholder="请选择时间"
          shortcuts={shortcuts}
        />
      );
    }
  }
];

const formConfigs1 = ({ buildList, changeBuilds, allZoomList, changeFloors, filterZoomList }) => [
  {
    label: "栋",
    labelWidth: 80,
    prop: "buildingCode",
    render: ({ formModel, row }) => {
      return (
        <el-select v-model={formModel[row.prop]} placeholder="请选择楼栋" onChange={changeBuilds}>
          {buildList.value?.map((el) => (
            <el-option label={el.name} key={el.name} value={el.name} />
          ))}
        </el-select>
      );
    }
  },
  {
    label: "楼层",
    labelWidth: 80,
    prop: "floorNo",
    render: ({ formModel, row }) => {
      return (
        <el-select v-model={formModel[row.prop]} placeholder="请选择楼层" onChange={changeFloors}>
          {allZoomList.value?.map((el) => (
            <el-option label={el.floor + "层"} key={el.floor} value={el.floor} />
          ))}
        </el-select>
      );
    }
  },
  {
    label: "房间号",
    labelWidth: 80,
    prop: "dormitoryCode",
    render: ({ formModel, row }) => {
      return (
        <el-select v-model={formModel[row.prop]} placeholder="请选择房间号">
          {filterZoomList.value?.map((el) => (
            <el-option label={el.dormitoryCode} key={el.dormitoryCode} value={el.dormitoryCode} />
          ))}
        </el-select>
      );
    }
  }
];

const formConfigs2 = (formData) => {
  const addUser = () => {
    const setA = (v) => {
      formData.checkInUser = v.userName;
      formData.staffInfoId = +v.id;
    };
    addDialog({
      title: "选择用户",
      width: "1000px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(SelectUser, { setA }),
      beforeSure: (done, { options }) => {
        done();
      }
    });
  };
  return [
    {
      label: "楼层",
      labelWidth: 100,
      prop: "floorNo",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入楼层" />;
      }
    },
    {
      label: "房间号",
      labelWidth: 100,
      prop: "dormitoryCode",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入房间号" />;
      }
    },
    {
      label: "入住人员",  
      labelWidth: 100,
      prop: "checkInUser",
      render: ({ formModel, row }) => {
        return <el-input readonly onClick={addUser} v-model={formModel[row.prop]} placeholder="请选择入住人员" />;
      }
    },
    {
      label: "入住时间",
      prop: "moveInDate",
      labelWidth: 100,
      render: ({ formModel, row }) => {
        const shortcuts = [
          {
            text: "今天",
            value: new Date()
          },
          {
            text: "昨天",
            value: () => {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              return date;
            }
          },
          {
            text: "一周前",
            value: () => {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              return date;
            }
          }
        ];
        return (
          <el-date-picker
            value-format="YYYY-MM-DD HH:mm:ss"
            clearable={false}
            v-model={formModel[row.prop]}
            type="datetime"
            placeholder="请选择时间"
            shortcuts={shortcuts}
          />
        );
      }
    }
  ];
};

const formConfigs3 = (formData): FormConfigItemType[] => {
  const formConf: FormConfigItemType[] = [
    {
      label: "编号",
      labelWidth: 120,
      prop: "name",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入编号" />;
      }
    },
    {
      label: "自动生成宿舍",
      labelWidth: 120,
      prop: "type",
      render: ({ formModel, row }) => {
        return <el-switch onChange={changeSwitchVal} v-model={formModel[row.prop]} inline-prompt active-icon={Check} inactive-icon={Close} />;
      }
    },
    {
      label: "楼层",
      labelWidth: 120,
      prop: "floor",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="多个楼层逗号隔开，例如1,2,3" />;
      }
    },
    {
      label: "每层房间数",
      labelWidth: 120,
      prop: "number",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入每层房间数" />;
      }
    }
  ];

  const hideConfig = formConf.filter((item) => !["floor", "number"].includes(item.prop));
  const newList = ref(hideConfig);
  const changeSwitchVal = (val) => {
    newList.value = val ? formConf : hideConfig;
  };

  /** @ts-ignore */
  return newList;
};

const formConfigs4 = () => [
  {
    label: "栋",
    labelWidth: 60,
    prop: "name",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入楼栋编号" />;
    }
  }
];

const formConfigs5 = () => {
  const dormitorySexOpts = ref([]);
  const dormitoryRankOpts = ref([]);
  getEnumDictList(["GenderType", "EmployeeLevel"]).then((res) => {
    dormitorySexOpts.value = res.GenderType;
    dormitoryRankOpts.value = res.EmployeeLevel;
  });
  return [
    {
      label: "楼层",
      labelWidth: 80,
      prop: "floorNo",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入楼层" />;
      }
    },
    {
      label: "房间号",
      labelWidth: 80,
      prop: "dormitoryCode",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入房间号" />;
      }
    },
    {
      label: "宿舍职级",
      labelWidth: 80,
      prop: "dormitoryRank",
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} style={{ width: "100%" }}>
            {dormitoryRankOpts.value.map((el) => (
              <el-option key={el.optionValue} label={el.optionName} value={el.optionValue} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "宿舍性别",
      labelWidth: 80,
      prop: "dormitorySex",
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} style={{ width: "100%" }}>
            {dormitorySexOpts.value.map((el) => (
              <el-option key={el.optionValue} label={el.optionName} value={el.optionValue} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "备注",
      labelWidth: 80,
      prop: "remark",
      render: ({ formModel, row }) => {
        return <el-input type="textarea" v-model={formModel[row.prop]} />;
      }
    }
  ];
};

export {
  formConfigs,
  formRules,
  formRules1,
  formConfigs1,
  formRules2,
  formConfigs2,
  formRules3,
  formConfigs3,
  formRules4,
  formConfigs4,
  formRules5,
  formConfigs5
};
