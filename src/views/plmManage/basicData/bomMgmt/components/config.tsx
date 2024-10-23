import { FormRules } from "element-plus";
import { reactive } from "vue";
import { useMaterialTable } from "./selectMaterialConfig";
import { useRoute } from "vue-router";

const { handleSelectAction } = useMaterialTable();

// 编辑员工信息校验
export const formRules = reactive<FormRules>({
  materialNumber: [{ required: true, message: "父级物料编码为必填项", trigger: "change" }],
  materialName: [{ required: true, message: "父级物料名称为必填项", trigger: "change" }],
  specification: [{ required: true, message: "父级物料规格为必填项", trigger: "change" }],
  number: [{ required: true, message: "BOM编号为必填项", trigger: "change" }],
  name: [{ required: true, message: "BOM名称为必填项", trigger: "change" }],
  groupId: [{ required: true, message: "BOM分组为必填项", trigger: "change" }]
});

// 编辑员工信息表单
export const formConfigs = (selectOpts: any, formData, treeSelectData, fn?): any[] => {
  const route = useRoute();
  const isView = route.query.type === "view";
  const handleSelect = () => {
    handleSelectAction("single", (row) => {
      console.log(row, "row==calback");
      formData.materialNumber = row.number;
      formData.materialName = row.name;
      formData.materialId = row.id + "";
      formData.specification = row.specification;
      formData.number = row.number + "_V0";
      formData.name = row.name + "_BOM";
    });
  };

  const defaultGroup = [
    {
      label: "父级物料编码",
      prop: "materialNumber",
      colProp: { span: 8 },
      labelWidth: 110,
      required: true,
      render: ({ formModel, row }) => {
        return (
          <el-input
            disabled={isView}
            size="small"
            v-model={formModel[row.prop]}
            placeholder="请输入物料编码"
            clearable
            v-slots={{
              append: () =>
                !isView ? (
                  <span class="no-select pointer" onClick={handleSelect}>
                    选择
                  </span>
                ) : null
            }}
          />
        );
      }
    },
    {
      label: "父级物料名称",
      prop: "materialName",
      required: true,

      labelWidth: 110,
      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        return <el-input disabled={isView} size="small" v-model={formModel[row.prop]} placeholder="选择父级物料编码后自动填充" readonly />;
      }
    },
    {
      label: "父级物料规格",
      prop: "specification",
      labelWidth: 110,
      required: true,

      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        return <el-input disabled={isView} size="small" v-model={formModel[row.prop]} placeholder="选择父级物料编码后自动填充" readonly />;
      }
    },
    {
      label: "BOM编号",
      required: true,
      labelWidth: 110,
      prop: "number",
      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        return <el-input disabled={isView} size="small" v-model={formModel[row.prop]} placeholder="请输入BOM编号" clearable />;
      }
    },
    {
      label: "BOM名称",
      prop: "name",
      labelWidth: 110,
      required: true,

      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        return <el-input disabled={isView} size="small" v-model={formModel[row.prop]} placeholder="请输入BOM名称" clearable />;
      }
    },
    {
      label: "BOM分组",
      labelWidth: 110,
      required: true,
      prop: "groupId",
      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        return (
          <el-tree-select
            disabled={isView}
            props={{ children: "children", label: "title", value: "id" }}
            size="small"
            v-model={formModel[row.prop]}
            data={treeSelectData}
            filterable
            check-strictly
            node-key="id"
            render-after-expand={false}
            class="ui-w-100"
          />
        );
      }
    },
    {
      label: "备注",

      labelWidth: 110,

      prop: "remark",
      colProp: { span: 24 },
      render: ({ formModel, row }) => {
        return <el-input disabled={isView} size="small" v-model={formModel[row.prop]} placeholder="请输入备注" />;
      }
    },
    {
      label: "创建人",
      prop: "createUserName",
      labelWidth: 110,
      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        return <el-input disabled={isView} size="small" v-model={formModel[row.prop]} readonly />;
      }
    },
    {
      label: "创建时间",
      prop: "createDate",
      colProp: { span: 6 },
      labelWidth: 110,
      render: ({ formModel, row }) => {
        return <el-input disabled={isView} size="small" v-model={formModel[row.prop]} readonly />;
      }
    },
    {
      label: "修改人",
      prop: "modifyUserName",
      labelWidth: 110,
      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        return <el-input disabled={isView} size="small" v-model={formModel[row.prop]} readonly />;
      }
    },
    {
      label: "最后修改时间",
      prop: "modifyDate",
      labelWidth: 110,
      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        return <el-input disabled={isView} size="small" v-model={formModel[row.prop]} readonly />;
      }
    }
  ];

  const groupInfo = [...defaultGroup];

  return groupInfo;
};
