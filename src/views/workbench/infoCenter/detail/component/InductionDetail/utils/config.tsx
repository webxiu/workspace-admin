import { StaffDeptGroupItemType, getStaffDeptGroup } from "@/api/oaManage/humanResources";
import { reactive, ref, toRaw } from "vue";

import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import { Loading } from "@element-plus/icons-vue";
import { TemporaryFlag } from "@/views/oa/humanResources/inductionAudit/utils/config";

interface OptionType {
  formData?: any;
  detailData: any;
  detailOptions?: any;
}

const LoadingIcon = () => (
  <el-icon class="is-loading">
    <Loading />
  </el-icon>
);

const layout = { span: 8 };

// 审核验证
export const formRules = reactive<FormRules>({
  staffName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  staffId: [{ required: true, message: "请输入工号", trigger: "blur" }],
  deptId: [{ required: true, message: "请输入部门", trigger: "blur" }],
  roleId: [{ required: true, message: "请选择岗位", trigger: "blur" }],
  isStay: [{ required: true, message: "请输入是否住宿", trigger: "blur" }],
  employeKind: [{ required: true, message: "请输入雇员种类", trigger: "blur" }],
  workRuleId: [{ required: true, message: "请输入考勤", trigger: "blur" }],
  tryDate: [{ required: true, message: "请输入试用期", trigger: "blur" }],
  moneyStartDate: [{ required: true, message: "请输入工资核算日期", trigger: "blur" }],
  level: [{ required: true, message: "请输入职级", trigger: "blur" }],
  inductionDate: [{ required: true, message: "请输入入职日期", trigger: "blur" }],
  wageAccountingType: [{ required: true, message: "请输入工资核算标准", trigger: "blur" }]
});

// 添加&修改表单配置
export const formConfigs = (options: OptionType): FormConfigItemType[] => {
  const { formData, detailData, detailOptions } = options;
  const groupOption = ref<StaffDeptGroupItemType[]>([]);
  const sLoading = ref(false);
  const formConfigList: FormConfigItemType[] = [];
  console.log("数据", toRaw(detailData.value));
  console.log("下拉框", toRaw(detailOptions.value));

  const onDeptChange = (deptId: string) => {
    formData.groupId = ""; // 重置组别
    formData.roleId = ""; // 重置岗位
    sLoading.value = true;
    const p1 = getStaffDeptGroup({ deptId });

    Promise.all([p1])
      .then((res) => {
        const [data1] = res.map((item) => item.data);
        sLoading.value = false;
        groupOption.value = data1 || [];
      })
      .catch(() => (sLoading.value = false));
  };

  detailData.value?.forEach((item) => {
    if (item.itemList) {
      item.itemList?.forEach((cell) => {
        formConfigList.push({ label: "", prop: "", labelWidth: "0px", colProp: { span: 24 }, render: () => <title-cate name={cell.itemName} /> });
        cell.detailList?.forEach((kk) => {
          const { inputItemName, inputItemFieldName, required, inputItemValue, writable, inputItemModel } = kk;
          formData[inputItemFieldName] = inputItemValue; // 显示默认值
          const placeholder = { date: "请选择", spinner: "请选择" }[inputItemFieldName] || "请输入";
          const rules = [{ required: required, message: placeholder + inputItemName, trigger: "blur" }];
          formConfigList.push({
            label: inputItemName,
            prop: inputItemFieldName,
            colProp: layout,
            rules: rules,
            render: ({ formModel, row }) => {
              const ItemType = {
                // 是否为临时工
                temporaryFlag: (
                  <el-input placeholder={placeholder} value={TemporaryFlag[formModel[row.prop]]} v-model={formModel[row.prop]} readonly={writable} clearable />
                ),
                // 部门
                deptId: (
                  <el-tree-select
                    v-model={formModel[row.prop]}
                    clearable
                    filterable
                    data={detailOptions.value[inputItemFieldName]}
                    check-strictly={true}
                    check-on-click-node
                    render-after-expand={false}
                    placeholder="请选择"
                    class="ui-w-100"
                    props={{ label: "name", value: "id" }}
                    onChange={onDeptChange}
                  />
                ),
                // 组别
                groupId: sLoading.value ? (
                  <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
                    {{ prefix: () => <LoadingIcon /> }}
                  </el-select>
                ) : (
                  <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择" readonly={writable}>
                    {groupOption.value?.map((item) => (
                      <el-option key={item.id} label={item.groupName} value={item.id} />
                    ))}
                  </el-select>
                ),
                // 所有的日期
                date: (
                  <el-date-picker
                    v-model={formModel[row.prop]}
                    placeholder="选择日期"
                    value-format="YYYY-MM-DD"
                    format="YYYY-MM-DD"
                    disabled={writable}
                    style="width: 100%"
                    clearable
                  />
                ),
                // 所有的下拉框
                spinner: (
                  <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请输入" readonly={writable}>
                    {detailOptions.value[inputItemFieldName]?.map((item) => (
                      <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
                    ))}
                  </el-select>
                )
              };

              if (ItemType[inputItemFieldName]) return ItemType[inputItemFieldName]; // 部门和组别
              if (ItemType[inputItemModel]) return ItemType[inputItemModel]; // 所有下拉框和日期选择
              return <el-input placeholder={placeholder} v-model={formModel[row.prop]} readonly={writable} clearable />;
            }
          });
        });
      });
    }
  });
  return formConfigList;
};
