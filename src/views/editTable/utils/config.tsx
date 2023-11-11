/*
 * @Author: lixiuhai
 * @Date: 2023-07-06 14:57:33
 * @Last Modified by: lixiuhai
 * @Last Modified time: 2023-07-07 15:20:29
 */

import { Ref, nextTick } from "vue";

import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { RowHandleType } from "./hook";
import TitleCate from "@/components/TitleCate.vue";

const layout = { span: 12 };
const lineLayout = { span: 24 };

// 表单配置
export const formConfigs = (type: RowHandleType): FormConfigItemType[] => {
  return [
    /** ===================== 分类标题配置 ========================= */
    { label: "", prop: "", hide: false, colProp: lineLayout, render: ({ formModel, row }) => <TitleCate name="表单配置" class="ui-w-100" /> },
    {
      label: "组织ID",
      prop: "id",
      hide: type === "add",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" disabled clearable />
    },
    { label: "用户名", prop: "username", colProp: layout, render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable /> },
    { label: "年龄", prop: "age", colProp: layout, render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable /> },
    {
      label: "状态",
      prop: "status",
      render: ({ formModel, row }) => {
        const options = [
          { label: "开启", value: 1 },
          { label: "关闭", value: 0 }
        ];
        return (
          <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
            {options.map((item) => (
              <el-option key={item.value} label={item.label} value={item.value} />
            ))}
          </el-select>
        );
      }
    }
  ];
};
