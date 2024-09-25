import { FormRules } from "element-plus";
import RelationTable from "./relationTable.vue";
import ResponseTable from "./responseTable.vue";
import { reactive } from "vue";

const checkResponseInfo = (rule, value, callback) => {
  const isPass = Array.isArray(value) && value.length && value.every((item) => item.userInfoVOList);
  if (!isPass) {
    callback(new Error("请选择对应角色的成员"));
  } else {
    callback();
  }
};

export const formRules = reactive<FormRules>({
  projectName: [{ required: true, message: "项目名称为必填项", trigger: "submit" }],
  projectUserName: [{ required: true, message: "项目负责人为必填项", trigger: "submit" }],
  categoryName: [{ required: true, message: "产品分类为必填项", trigger: "submit" }],
  startDate: [{ required: true, message: "立项日期为必填项", trigger: "submit" }],
  projectModelId: [{ required: true, message: "项目模板为必填项", trigger: "submit" }],
  deptId: [{ required: true, message: "负责部门为必填项", trigger: "submit" }],
  responseInfo: [{ validator: checkResponseInfo, trigger: "submit" }],
  productCategoryId: [{ required: true, message: "产品分类为必填项", trigger: "submit" }],
  projectUserId: [{ required: true, message: "项目负责人为必填项", trigger: "submit" }]
});

export const formConfigs = (
  { projectUsers, _formData, isDetail, treeSelectData, productClassifyList, projectTemplateOptsList, changeModel, responseRef, relationRef, isList = false },
  type?
) => {
  return [
    {
      label: "单据编号",
      colProp: { span: 6 },
      labelWidth: 90,
      prop: "billNo",
      render: ({ formModel, row }) => {
        return <el-input size={isDetail ? "small" : "default"} disabled v-model={formModel[row.prop]} placeholder="保存后自动生成" />;
      }
    },
    {
      label: "产品名",
      colProp: { span: 6 },
      labelWidth: 90,
      prop: "projectName",
      render: ({ formModel, row }) => {
        return (
          <el-input size={isDetail ? "small" : "default"} disabled={!isList || type === "view"} v-model={formModel[row.prop]} placeholder="请输入项目名称" />
        );
      }
    },
    {
      label: "负责人",
      colProp: { span: 6 },
      labelWidth: 90,
      prop: isList ? "projectUserId" : "projectUserName",
      render: ({ formModel, row }) => {
        return isList ? (
          <el-select
            size={isDetail ? "small" : "default"}
            disabled={!isList || type === "view"}
            filterable
            style={{ width: "90%" }}
            v-model={formModel[row.prop]}
            placeholder="请选择项目负责人"
          >
            {projectUsers.value?.map((item) => (
              <el-option key={item.userId} label={item.userName} value={item.userId} />
            ))}
          </el-select>
        ) : (
          <el-input v-model={formModel[row.prop]} disabled size={isDetail ? "small" : "default"} style={{ width: "100%" }} />
        );
      }
    },
    {
      label: "负责部门",
      colProp: { span: 6 },
      labelWidth: 90,
      prop: "deptId",
      render: ({ formModel, row }) => {
        const changeTreeData = (val) => {
          _formData.deptId = val;
        };
        return (
          <el-tree-select
            disabled={!isList || type === "view"}
            size={isDetail ? "small" : "default"}
            v-model={formModel[row.prop]}
            data={treeSelectData}
            filterable
            check-strictly
            default-expanded-keys={["0"]}
            node-key="value"
            render-after-expand={false}
            onChange={changeTreeData}
            style={{ width: !isList ? "88%" : "100%" }}
          />
        );
      }
    },
    {
      label: "产品分类",
      colProp: { span: 6 },
      labelWidth: 90,
      prop: isList ? "productCategoryId" : "categoryName",
      render: ({ formModel, row }) => {
        return isList ? (
          <el-select
            size={isDetail ? "small" : "default"}
            disabled={!isList || type === "view"}
            filterable
            style={{ width: isList ? "100%" : "90%" }}
            v-model={formModel[row.prop]}
            placeholder="请选择产品分类"
          >
            {productClassifyList.value?.map((item) => (
              <el-option key={item.id} label={item.categoryName} value={item.id} />
            ))}
          </el-select>
        ) : (
          <el-input v-model={formModel[row.prop]} disabled size={isDetail ? "small" : "default"} style={{ width: "100%" }} />
        );
      }
    },
    {
      label: "立项日期",
      colProp: { span: 6 },
      labelWidth: 90,
      prop: "startDate",
      render: ({ formModel, row }) => {
        return (
          <el-date-picker
            size={isDetail ? "small" : "default"}
            disabled={!isList || type === "view"}
            style={{ width: isList ? "100%" : "90%" }}
            v-model={formModel[row.prop]}
            value-format="YYYY-MM-DD"
            type="date"
            placeholder="选择立项日期"
          />
        );
      }
    },
    {
      label: "项目模板",
      colProp: { span: 6 },
      labelWidth: 90,
      prop: isList ? "projectModelId" : "projectModelName",
      render: ({ formModel, row }) => {
        return isList ? (
          <el-select
            size={isDetail ? "small" : "default"}
            disabled={!isList || type === "view"}
            onChange={changeModel}
            filterable
            style={{ width: "90%" }}
            v-model={formModel[row.prop]}
            placeholder="请选择项目模板"
          >
            {projectTemplateOptsList.value?.map((item) => (
              <el-option key={item.value} label={item.label} value={item.value} />
            ))}
          </el-select>
        ) : (
          <el-input v-model={formModel[row.prop]} disabled size={isDetail ? "small" : "default"} style={{ width: "100%" }} />
        );
      }
    },
    {
      label: "关联客户",
      colProp: { span: 6 },
      labelWidth: 90,
      prop: "customerName",
      render: ({ formModel, row }) => {
        return (
          <el-input size={isDetail ? "small" : "default"} disabled={!isList || type === "view"} v-model={formModel[row.prop]} placeholder="请输入关联客户" />
        );
      }
    },

    {
      label: "工期(天)",
      colProp: { span: 6 },
      labelWidth: 90,
      prop: "duration",
      render: ({ formModel, row }) => {
        return isDetail ? (
          <el-input v-model={formModel[row.prop]} size="small" disabled />
        ) : (
          <el-input-number disabled style={{ width: isList ? "100%" : "76%" }} v-model={formModel[row.prop]} min={1} />
        );
      }
    },
    {
      label: "结案日期",
      colProp: { span: 6 },
      labelWidth: 90,
      prop: "planEndDate",
      render: ({ formModel, row }) => {
        return (
          <el-date-picker
            size={isDetail ? "small" : "default"}
            disabled
            style={{ width: isList ? "100%" : "90%" }}
            v-model={formModel[row.prop]}
            value-format="YYYY-MM-DD"
            type="date"
            placeholder="选择结案日期"
          />
        );
      }
    },
    // {
    //   label: "",
    //   hide: !isList,
    //   colProp: { span: 6 },
    //   prop: "empty1",
    //   render: () => {
    //     return null;
    //   }
    // },
    {
      label: "备注",
      colProp: { span: 12 },
      labelWidth: 90,
      prop: "remarks",
      render: ({ formModel, row }) => {
        return (
          <div style={{ width: isDetail ? "33vw" : "100%" }}>
            <el-input
              type="textarea"
              autosize
              size={isDetail ? "small" : "default"}
              disabled={!isList || type === "view"}
              v-model={formModel[row.prop]}
              placeholder="请填写备注"
            />
          </div>
        );
      }
    },
    // {
    //   label: "",
    //   hide: !isList,
    //   colProp: { span: 6 },
    //   prop: "empty2",
    //   render: () => {
    //     return null;
    //   }
    // },
    {
      label: "",
      colProp: { span: isList ? 12 : 6 },
      labelWidth: 40,
      hide: !isList,
      prop: "responseInfo",
      render: ({ formModel, row }) => {
        return isDetail ? null : <ResponseTable v-model={formModel[row.prop]} ref={responseRef} type={type} />;
      }
    },
    {
      label: "",
      colProp: { span: isList ? 12 : 6 },
      labelWidth: 40,
      hide: !isList,
      prop: "relationInfo",
      render: ({ formModel, row }) => {
        return isDetail ? null : <RelationTable v-model={formModel[row.prop]} ref={relationRef} type={type} />;
      }
    }
  ];
};
