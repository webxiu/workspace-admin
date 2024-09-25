/*
 * @Author: Hailen
 * @Date: 2024-03-15 16:49:20
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-05-21 11:31:48
 */

import { IconConf, Question } from "@/config/elements";
import { computed, reactive, ref } from "vue";

import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import { PAGE_CONFIG } from "@/config/constant";
import { getButtonUrlList } from "@/api/systemManage";

//======================= 表格配置 =======================

export const typeList = reactive([
  { label: "Default", value: "default" },
  { label: "Primary", value: "primary" },
  { label: "Success", value: "success" },
  { label: "Info", value: "info" },
  { label: "Warning", value: "warning" },
  { label: "Danger", value: "danger" }
]);
export const sizeList = reactive([
  { label: "大", value: "large" },
  { label: "默认", value: "default" },
  { label: "小", value: "small" }
]);

export const dropDownList = reactive([
  { label: "是", value: true },
  { label: "否", value: false }
]);

export const formRules: FormRules = {
  btnKey: [{ required: true, message: "请选择按钮名称", trigger: "blur" }],
  btnType: [{ required: true, message: "请选择颜色", trigger: "blur" }],
  btnSize: [{ required: true, message: "请选择大小", trigger: "blur" }],
  btnIcon: [{ required: false, message: "请选择图标", trigger: "blur" }],
  url: [{ required: false, message: "请输入地址", trigger: "blur" }]
};

export const iconList = computed(() => {
  return Object.keys(IconConf).reduce((prev, key) => {
    prev.push({ name: key, component: IconConf[key] });
    return prev;
  }, []);
});

export const formConfigs = ({ _formData, buttonsList, groupsList, onChangeBtn, onChangeGroup }): FormConfigItemType[] => {
  const options = ref([]);
  const loading = ref(false);
  const remoteMethod = (query: string) => {
    if (query) {
      loading.value = true;
      getButtonUrlList({ page: 1, limit: PAGE_CONFIG.pageSize, url: query })
        .then(({ data }) => {
          loading.value = false;
          const urlList = data?.records || [];
          options.value = urlList.filter((item) => {
            return item.toLowerCase().includes(query.toLowerCase());
          });
        })
        .catch(() => (loading.value = false));
    } else {
      options.value = [];
    }
  };

  return [
    {
      label: "按钮名称",
      prop: "btnKey",
      colProp: { span: 12 },
      render: ({ formModel, row }) => (
        <el-select v-model={formModel[row.prop]} class="ui-w-100" filterable placeholder="请选择" onChange={onChangeBtn}>
          {buttonsList.value.map((item) => (
            <el-option key={item.optionValue} label={item.optionName} value={item.optionValue}>
              <div class="flex just-between">
                <span class="ellipsis" style="width: 120px; margin-right: 15px">
                  {item.optionName}
                </span>
                <span class="ellipsis flex-1" style="text-align: left">
                  {item.optionValue}
                </span>
              </div>
            </el-option>
          ))}
        </el-select>
      )
    },
    {
      label: "颜色",
      prop: "btnType",
      colProp: { span: 12 },
      render: ({ formModel, row }) => (
        <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
          {typeList.map((item) => (
            <el-option key={item.value} label={item.label} value={item.value} />
          ))}
        </el-select>
      )
    },
    {
      label: "大小",
      prop: "btnSize",
      colProp: { span: 12 },
      render: ({ formModel, row }) => (
        <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
          {sizeList.map((item) => (
            <el-option key={item.value} label={item.label} value={item.value} />
          ))}
        </el-select>
      )
    },
    {
      label: "图标",
      prop: "btnIcon",
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return (
          <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable>
            {{
              append: () => (
                <el-popover placement="bottom" width={284} trigger="click">
                  {{
                    reference: () => <el-button>选择</el-button>,
                    default: () => (
                      <el-row style="max-height: 200px;overflow-y: auto;" class="border-line">
                        {iconList.value.map((item) => (
                          <el-col
                            span={3}
                            style="display: flex; height: 32px; max-width: 32px; font-size: 22px;"
                            class="border-line just-center align-center pointer"
                            onClick={() => (_formData.btnIcon = item.name)}
                          >
                            <el-icon>{item.component}</el-icon>
                          </el-col>
                        ))}
                      </el-row>
                    )
                  }}
                </el-popover>
              )
            }}
          </el-input>
        );
      }
    },
    {
      label: "是否收起",
      prop: "isDropDown",
      colProp: { span: 12 },
      slots: {
        label: () => (
          <span>
            是否收起
            <el-tooltip placement="top" content="是否收起至下拉选项中, 默认展开">
              <Question />
            </el-tooltip>
          </span>
        )
      },
      render: ({ formModel, row }) => (
        <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
          {dropDownList.map((item) => (
            <el-option key={item.value} label={item.label} value={item.value} />
          ))}
        </el-select>
      )
    },
    {
      label: "按钮预览",
      prop: "",
      colProp: { span: 12 },
      render: () => (
        <el-button type={_formData.btnType} size={_formData.btnSize} icon={IconConf[_formData.btnIcon]}>
          {_formData.btnName}
        </el-button>
      )
    },
    {
      label: "表格分组",
      prop: "columnGroupId",
      colProp: { span: 12 },
      render: ({ formModel, row }) => (
        <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择" onChange={onChangeGroup}>
          {groupsList.value.map((item) => (
            <el-option key={item.id} label={item.groupName} value={item.id} />
          ))}
        </el-select>
      )
    },
    {
      label: "分组编号",
      prop: "groupCode",
      colProp: { span: 12 },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} class="ui-w-100" disabled />
    },
    {
      label: "接口地址",
      prop: "url",
      colProp: { span: 24 },
      render: ({ formModel, row }) => (
        <el-select
          v-model={formModel[row.prop]}
          class="ui-w-100"
          placeholder="请输入接口地址"
          filterable
          remote
          clearable
          reserve-keyword={false}
          remote-method={remoteMethod}
          loading={loading.value}
        >
          {options.value.map((item) => (
            <el-option key={item} label={item} value={item} />
          ))}
        </el-select>
      )
    }
  ];
};
