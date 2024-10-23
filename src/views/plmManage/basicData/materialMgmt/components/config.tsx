import EditForm, { FormConfigItemType } from "@/components/EditForm/index.vue";
import { ElMessage, ElMessageBox, FormRules } from "element-plus";
import { backMaterialInfo, fetchMaterialGroupAttr, getBOMTableRowSelectOptions, pushDownMaterialInfo, submitMaterialInfo } from "@/api/plmManage";
import { h, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import ButtonList from "@/components/ButtonList/index.vue";
import ColorModal from "./ColorModal.vue";
import MaterialPropTable from "./materialPropTable.vue";
import MyUpload from "./MyUpload.vue";
import ProductStoreModal from "./ProductStoreModal.vue";
import { addDialog } from "@/components/ReDialog";
import { useMultiTagsStore } from "@/store/modules/multiTags";

// 编辑员工信息校验
export const formRules = reactive<FormRules>({
  number: [{ required: true, message: "编码为必填项", trigger: "submit" }],
  customerProvided: [{ required: true, message: "是否客供为必填项", trigger: "submit" }],
  specification: [{ required: true, message: "规格型号为必填项", trigger: "submit" }],
  baseUnit: [{ required: true, message: "基本单位为必填项", trigger: "submit" }],
  materialGroup: [{ required: true, message: "物料分组为必填项", trigger: "submit" }],
  goodsType: [{ required: true, message: "存货类别为必填项", trigger: "submit" }],
  purchaseUnit: [{ required: true, message: "采购单位为必填项", trigger: "submit" }],
  stockUnit: [{ required: true, message: "库存单位为必填项", trigger: "submit" }],
  saleUnti: [{ required: true, message: "销售单位为必填项", trigger: "submit" }],
  warehouse: [{ required: true, message: "仓库为必填项", trigger: "submit" }],
  materialType: [{ required: true, message: "物料种类为必填项", trigger: "submit" }],
  nation: [{ required: true, message: "版本号为必填项", trigger: "submit" }],
  erpClsid: [{ required: true, message: "物料属性为必填项", trigger: "submit" }]
});

const formLoading = ref(false);
const _formData = reactive({});
const formRef = ref();
const colorListRef = ref();
const materialPropTableRef = ref();

// 编辑员工信息表单
export const formConfigs = (selectOpts: any, view = false, fn?, formData?, setLoading?, manufacturingShopNameOpts?): any[] => {
  const route = useRoute();
  const router = useRouter();

  const isView = route.query.type !== "edit" && (view || Boolean(route.query.id));

  const clickHandler = (v) => {
    if (v.text === "保存" && fn && typeof fn === "function") {
      fn();
    }
    if (v.text === "返回") {
      // router.push("/plmManage/basicData/materialMgmt/index?menuId=" + route.query.menuId);
      router.back();
    }

    if (v.text === "回退") {
      ElMessageBox.confirm(`确认要回退吗?`, "系统提示", {
        type: "warning",
        draggable: true,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          setLoading(true);
          backMaterialInfo({ id: route.query.id })
            .then((res) => {
              if (res.data) {
                router.push(`/plmManage/basicData/materialMgmt/edit?id=${route.query.id}&type=edit&isNewTag=yes&menuId=${route.query.menuId}`);
              }
            })
            .finally(() => setLoading(false));
        })
        .catch(() => {});
    }
    if (v.text === "提交") {
      ElMessageBox.confirm(`确认要提交吗?`, "系统提示", {
        type: "warning",
        draggable: true,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          setLoading(true);
          submitMaterialInfo({ id: route.query.id })
            .then((res) => {
              if (res.data) {
                router.push(`/plmManage/basicData/materialMgmt/view?id=${route.query.id}&type=view&isNewTag=yes&menuId=${route.query.menuId}`);
              }
            })
            .finally(() => setLoading(false));
        })
        .catch(() => {});
    }

    if (v.text === "下推") {
      ElMessageBox.confirm(`确认要下推吗?`, "系统提示", {
        type: "warning",
        draggable: true,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          setLoading(true);

          pushDownMaterialInfo({ id: route.query.id })
            .then((res) => {
              if (res.data) {
                ElMessage({
                  message: "下推成功",
                  type: "success"
                });
                setTimeout(() => {
                  useMultiTagsStore().handleTags("splice", "/plmManage/basicData/materialMgmt/view");
                  router.push(`/plmManage/basicData/materialMgmt/index?menuId=${route.query.menuId}`);
                }, 1000);
              }
            })
            .finally(() => setLoading(false));
        })
        .catch(() => {});
    }

    if (v.text === "复制") {
      console.log("复制");
      router.push(
        `/plmManage/basicData/materialMgmt/add?number=${route.query.number || 0}&code=${route.query.code || formData.number}&isClone=1&viewId=${
          route.query.id
        }&type=add&isNewTag=yes&menuId=${route.query.menuId}`
      );
    }
  };

  const nodeChange = (data) => {
    fetchMaterialGroupAttr({ materialGroupId: data }).then((res: any) => {
      if (res.data) {
        if (materialPropTableRef.value) {
          materialPropTableRef.value.dataList = res.data;
          const enumStrArr = res.data.filter((item) => item.propertyType === 1).map((item) => item.enumCode);
          if (enumStrArr.length) {
            getBOMTableRowSelectOptions({ optioncode: String(enumStrArr) }).then((res) => {
              if (res.data) {
                materialPropTableRef.value.materialPropEnumList = res.data;
              }
            });
          }
        }
      }
    });
  };

  let buttonList: ButtonItemType[] = [
    { clickHandler, size: "small", type: "default", text: "返回" },
    { clickHandler, size: "small", type: "success", text: "保存" },
    { clickHandler, size: "small", type: "warning", text: "复制" },
    { clickHandler, size: "small", type: "primary", text: "提交" },
    { clickHandler, size: "small", type: "danger", text: "回退" },
    { clickHandler, size: "small", type: "primary", text: "下推" }
  ];

  // 根据进入页面的行为不同，进行按钮过滤
  if (route.query.type === "add") {
    const savaPos = buttonList.findIndex((item) => item.text === "保存");
    buttonList.splice(savaPos + 1);
  }
  if (route.query.type === "view") {
    buttonList = buttonList.filter((item) => /(复制|回退|下推|返回)/.test(item.text));
  }
  if (route.query.type === "edit") {
    buttonList = buttonList.filter((item) => /(复制|保存|提交|返回)/.test(item.text));
  }

  const changeBaseUnit = (val) => {
    formData.purchaseUnit = val;
    formData.stockUnit = val;
    formData.saleUnti = val;
  };

  const handleClickColor = () => {
    const resultDialog = addDialog({
      title: `选择颜色`,
      props: {
        loading: formLoading,
        formInline: _formData,
        formConfigs: [
          {
            label: "",
            prop: "colorList",
            render: ({ formModel, row }) => {
              return <ColorModal size="small" v-model={formModel[row.prop]} ref={colorListRef} formData={formData} resultDialog={resultDialog} />;
            }
          }
        ]
      },
      width: "600px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      okButtonText: "确认",
      cancelButtonText: "关闭",
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        console.log(colorListRef.value.getCurRow(), "sl");
        const selectRow = colorListRef.value.getCurRow();

        if (JSON.stringify(selectRow) === "{}") {
          ElMessage({ message: "尚未选择颜色", type: "warning" });
        } else if (!selectRow.id) {
          ElMessage({ message: "请先进行保存操作", type: "warning" });
        } else {
          formData.goodColor = selectRow.optionName;
          formData.colorId = selectRow.optionValue;
          done();
        }
      }
    });
  };
  const defaultGroup: FormConfigItemType[] = [
    {
      prop: "",
      colProp: { span: 24 },
      render: () => {
        return /(add|view|edit)/.test(route.query.type as string) ? (
          <ButtonList buttonList={buttonList} auto-layout={false} style={{ marginBottom: "5px" }} />
        ) : null;
      }
    },
    {
      label: "物料分组",
      prop: "materialGroup",
      required: true,
      colProp: { span: 5 },
      labelWidth: 85,
      render: ({ formModel, row }) => {
        return (
          <el-tree-select
            style={{ width: "100%" }}
            disabled={isView}
            placeholder="请选择物料分组"
            props={{ children: "children", label: "name", value: "id" }}
            size="small"
            v-model={formModel[row.prop]}
            data={selectOpts.materialGroupOpts}
            check-strictly
            onChange={nodeChange}
            filterable
            node-key="id"
            render-after-expand={false}
          />
        );
      }
    },
    {
      label: "编码",
      prop: "number",
      colProp: { span: 6 },
      labelWidth: 80,
      required: true,
      render: ({ formModel, row }) => {
        return <el-input disabled={isView} readonly={isView} size="small" v-model={formModel[row.prop]} placeholder="请输入物料编码" clearable />;
      }
    },
    {
      label: "名称",
      prop: "name",
      labelWidth: 80,
      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        return <el-input disabled={isView} readonly={isView} size="small" v-model={formModel[row.prop]} placeholder="请输入名称" clearable />;
      }
    },
    {
      label: "",
      prop: "materialPropList",
      colProp: { span: 7 },
      render: ({ formModel, row }) => {
        return (
          <div>
            <MaterialPropTable ref={materialPropTableRef} v-model={formModel[row.prop]} style={{ width: "100%" }} />
          </div>
        );
      }
    },

    {
      label: "旧编码",
      prop: "oldCode",
      labelWidth: 85,
      colProp: { span: 5 },
      render: ({ formModel, row }) => {
        return <el-input disabled={isView} readonly={isView} size="small" v-model={formModel[row.prop]} placeholder="请输入旧物料编码" clearable />;
      }
    },

    {
      label: "规格型号",
      required: true,
      labelWidth: 80,
      prop: "specification",
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input disabled={isView} readonly={isView} size="small" v-model={formModel[row.prop]} placeholder="请输入规格型号" clearable />;
      }
    },
    {
      label: "",
      prop: "",
      colProp: { span: 7 },
      render: () => null
    },
    {
      label: "模号",
      prop: "model",
      labelWidth: 85,

      colProp: { span: 5 },
      render: ({ formModel, row }) => {
        return <el-input disabled={isView} readonly={isView} size="small" v-model={formModel[row.prop]} placeholder="请输入模号" clearable />;
      }
    },
    {
      label: "成品类型",
      labelWidth: 80,
      prop: "productType",
      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        return (
          <el-select disabled={isView} size="small" v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
            {selectOpts.productTypeOpts?.map((item) => (
              <el-option label={item.optionName} value={item.optionValue} key={item.id} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "基本单位",
      required: true,
      labelWidth: 80,
      prop: "baseUnit",
      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        return (
          <el-select onChange={changeBaseUnit} disabled={isView} size="small" v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
            {selectOpts.basicUnitOpts?.map((item) => (
              <el-option label={item.optionName} value={item.optionValue} key={item.id} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "",
      prop: "",
      colProp: { span: 7 },
      render: () => null
    },
    {
      label: "客供料",
      prop: "customerProvided",
      labelWidth: 85,
      colProp: { span: 5 },
      render: ({ formModel, row }) => {
        return (
          <el-select disabled={isView} size="small" v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
            {selectOpts.isCustomerProviderOpts?.map((item) => (
              <el-option label={item.optionName} value={item.optionValue} key={item.id} />
            ))}
          </el-select>
        );
      }
    },

    {
      label: "采购单位",
      prop: "purchaseUnit",
      colProp: { span: 6 },
      labelWidth: 80,
      render: ({ formModel, row }) => {
        return (
          <el-select disabled={isView} size="small" v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
            {selectOpts.basicUnitOpts?.map((item) => (
              <el-option label={item.optionName} value={item.optionValue} key={item.id} />
            ))}
          </el-select>
        );
      }
    },

    {
      label: "库存单位",
      prop: "stockUnit",
      colProp: { span: 6 },
      labelWidth: 80,
      render: ({ formModel, row }) => {
        return (
          <el-select disabled={isView} size="small" v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
            {selectOpts.basicUnitOpts?.map((item) => (
              <el-option label={item.optionName} value={item.optionValue} key={item.id} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "销售单位",
      prop: "saleUnti",
      colProp: { span: 5 },
      labelWidth: 85,
      render: ({ formModel, row }) => {
        return (
          <el-select disabled={isView} size="small" v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
            {selectOpts.basicUnitOpts?.map((item) => (
              <el-option label={item.optionName} value={item.optionValue} key={item.id} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "",
      prop: "emptyText",
      colProp: { span: 7 },
      render: () => null
    },
    {
      prop: "",
      colProp: { span: 24 },
      labelWidth: 0,
      render: () => {
        return (
          <el-divider content-position="left" border-style="dashed">
            基础属性
          </el-divider>
        );
      }
    }
  ];

  const basicProp = [
    {
      label: "品名",
      prop: "goodName",
      labelWidth: 85,
      colProp: { span: 5 },
      render: ({ formModel, row }) => {
        const onSelect = (val) => {
          formModel[row.prop] = val.productType;
          formData.goodModel = val.productCode;
        };
        return (
          <el-input disabled={isView} size="small" v-model={formModel[row.prop]} placeholder="请选择" readonly>
            {{ append: () => <ProductStoreModal disabled={isView} onSelect={onSelect} /> }}
          </el-input>
        );
      }
    },
    {
      label: "型号",
      prop: "goodModel",
      labelWidth: 80,
      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        return <el-input disabled={isView} size="small" v-model={formModel[row.prop]} placeholder="请选择" readonly />;
      }
    },
    {
      label: "颜色",
      prop: "goodColor",
      labelWidth: 80,
      colProp: { span: 6 },
      render: ({ formModel, row }) => {
        return <el-input disabled={isView} size="small" v-model={formModel[row.prop]} placeholder="请选择" onClick={handleClickColor} readonly />;
      }
    },
    {
      label: "",
      prop: "",
      colProp: { span: 7 },
      render: () => null
    },
    {
      label: "仓库",
      prop: "warehouse",
      colProp: { span: 5 },
      labelWidth: 85,
      render: ({ formModel, row }) => {
        return (
          <el-select disabled={isView} size="small" v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
            {selectOpts.warehourseOpts?.map((item) => (
              <el-option label={item.optionName} value={item.optionValue} key={item.id} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "物料种类",
      prop: "materialType",
      colProp: { span: 6 },
      labelWidth: 80,
      render: ({ formModel, row }) => {
        return (
          <el-select disabled={isView} size="small" v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
            {selectOpts.materialTypeOpts?.map((item) => (
              <el-option label={item.optionName} value={item.optionValue} key={item.id} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "存货类别",
      required: true,
      prop: "goodsType",
      colProp: { span: 6 },
      labelWidth: 80,
      render: ({ formModel, row }) => {
        return (
          <el-select disabled={isView} size="small" v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
            {selectOpts.stockTypeOpts?.map((item) => (
              <el-option label={item.optionName} value={item.optionValue} key={item.id} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "",
      prop: "",
      colProp: { span: 5 },
      render: () => null
    },
    {
      label: "版本号",
      prop: "nation",
      labelWidth: 85,

      colProp: { span: 5 },
      render: ({ formModel, row }) => {
        return <el-input disabled={isView} value="V0" size="small" v-model={formModel[row.prop]} readonly />;
      }
    },
    {
      label: "是否认证",
      prop: "cbcertification",
      colProp: { span: 3 },
      labelWidth: 80,
      render: ({ formModel, row }) => {
        return (
          <el-switch
            disabled={isView}
            style="--el-switch-on-color: #13ce66"
            size="small"
            v-model={formModel[row.prop]}
            active-value={"1"}
            inactive-value={"0"}
            inline-prompt
            active-text="承认"
            inactive-text="承认"
          />
        );
      }
    },

    {
      label: "备注",
      prop: "remark",
      colProp: { span: 9 },
      render: ({ formModel, row }) => {
        return <el-input disabled={isView} readonly={isView} size="small" v-model={formModel[row.prop]} placeholder="请输入备注" clearable />;
      }
    },
    {
      label: "",
      prop: "",
      colProp: { span: 5 },
      render: () => null
    }
  ];

  const productProp = [
    {
      colProp: { span: 24 },
      labelWidth: 0,
      render: () => {
        return (
          <el-divider content-position="left" border-style="dashed">
            生产属性
          </el-divider>
        );
      }
    },
    {
      label: "物料属性",
      prop: "erpClsid",
      colProp: { span: 5 },
      labelWidth: 80,
      render: ({ formModel, row }) => {
        return (
          <el-select disabled={isView} size="small" v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
            {selectOpts.materialAttributeOpts?.map((item) => (
              <el-option label={item.optionName} value={item.optionValue} key={item.id} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "生产车间",
      prop: "manufacturingShop",
      colProp: { span: 6 },
      labelWidth: 80,
      render: ({ formModel, row }) => {
        return (
          <el-select disabled={isView} size="small" v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
            {manufacturingShopNameOpts?.map((item) => (
              <el-option label={item.label} value={item.value} key={item.value} />
            ))}
          </el-select>
        );
      }
    }
  ];

  const dateProp = [
    {
      colProp: { span: 24 },
      labelWidth: 0,
      render: () => {
        return (
          <el-divider border-style="dashed" content-position="left">
            日期属性
          </el-divider>
        );
      }
    },
    {
      label: "创建人",
      prop: "createUserName",
      colProp: { span: 5 },
      labelWidth: 80,
      render: ({ formModel, row }) => {
        return <el-input disabled={isView} size="small" v-model={formModel[row.prop]} readonly />;
      }
    },
    {
      label: "创建日期",
      prop: "createDate",
      colProp: { span: 6 },
      labelWidth: 80,

      render: ({ formModel, row }) => {
        return <el-input disabled={isView} size="small" v-model={formModel[row.prop]} readonly />;
      }
    },
    {
      label: "",
      prop: "",
      colProp: { span: 5 },
      render: () => null
    },
    {
      label: "",
      prop: "",
      colProp: { span: 5 },
      render: () => null
    },
    {
      label: "修改人",
      prop: "modifyUserName",
      colProp: { span: 5 },
      labelWidth: 80,

      render: ({ formModel, row }) => {
        return <el-input disabled={isView} size="small" v-model={formModel[row.prop]} readonly />;
      }
    },
    {
      label: "修改日期",
      prop: "modifyDate",
      colProp: { span: 6 },
      labelWidth: 80,
      render: ({ formModel, row }) => {
        return <el-input disabled={isView} size="small" v-model={formModel[row.prop]} readonly />;
      }
    },
    {
      slots: { label: () => <span style={{ fontSize: "14px", color: "#606266", fontWeight: "700" }}>图片</span> },
      prop: "file",
      labelWidth: 80,
      colProp: { span: 24 },
      // class: "upload-box",
      render: ({ formModel, row }) => {
        return <MyUpload size="small" v-model={formModel[row.prop]} formData={formData} uploadDisabled={route.query.type === "view"} />;
      }
    }
  ];

  const purchaseProp = [
    {
      colProp: { span: 24 },
      labelWidth: 0,
      render: () => {
        return (
          <el-divider border-style="dashed" content-position="left">
            采购物料属性
          </el-divider>
        );
      }
    },
    {
      label: "固定提前期",
      prop: "fFixLeadTime",
      colProp: { span: 4 },
      render: ({ formModel, row }) => {
        return <el-input disabled size="small" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "固定提前期单位",
      prop: "fFixLeadTimeType",
      colProp: { span: 4 },
      render: ({ formModel, row }) => {
        return <el-input disabled size="small" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "变动提前期",
      prop: "fVarLeadTime",
      colProp: { span: 4 },
      render: ({ formModel, row }) => {
        return <el-input disabled size="small" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "变动提前期单位",
      prop: "fVarLeadTimeType",
      colProp: { span: 4 },
      render: ({ formModel, row }) => {
        return <el-input disabled size="small" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "",
      prop: "",
      colProp: { span: 8 },
      render: () => {
        return null;
      }
    },
    {
      label: "检验提前期",
      prop: "fCheckLeadTime",
      colProp: { span: 4 },
      render: ({ formModel, row }) => {
        return <el-input disabled size="small" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "检验提前期单位",
      prop: "fCheckLeadTimeType",
      colProp: { span: 4 },
      render: ({ formModel, row }) => {
        return <el-input disabled size="small" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "累计提前期",
      prop: "fAccuLeadTime",
      colProp: { span: 4 },
      render: ({ formModel, row }) => {
        return <el-input disabled size="small" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "最大订货量",
      prop: "fMaxPOQty",
      colProp: { span: 4 },
      labelWidth: 110,
      render: ({ formModel, row }) => {
        return <el-input disabled size="small" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "",
      prop: "",
      colProp: { span: 8 },
      render: () => {
        return null;
      }
    },
    {
      label: "最小订货量",
      prop: "fMinPOQty",
      colProp: { span: 4 },
      render: ({ formModel, row }) => {
        return <el-input disabled size="small" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "最小包装量",
      prop: "fIncreaseQty",
      colProp: { span: 4 },
      labelWidth: 110,
      render: ({ formModel, row }) => {
        return <el-input disabled size="small" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "安全库存",
      prop: "fPlanSafeStockQty",
      colProp: { span: 4 },
      labelWidth: 80,
      render: ({ formModel, row }) => {
        return <el-input disabled size="small" v-model={formModel[row.prop]} />;
      }
    }
  ];

  const qualityProp = [
    {
      colProp: { span: 24 },
      labelWidth: 0,
      render: () => {
        return (
          <el-divider border-style="dashed" content-position="left">
            品质物料属性
          </el-divider>
        );
      }
    },
    {
      label: "抽样方案",
      prop: "fIncSampSchemeId",
      colProp: { span: 4 },
      render: ({ formModel, row }) => {
        return <el-input disabled size="small" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "质检方案",
      prop: "fIncQcSchemeId",
      colProp: { span: 4 },
      render: ({ formModel, row }) => {
        return <el-input disabled size="small" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "库存周期复检",
      prop: "fEnableCyclistQCSTK",
      colProp: { span: 4 },
      render: ({ formModel, row }) => {
        return <el-input disabled size="small" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "周期复检提醒",
      prop: "fEnableCyclistQCSTKEW",
      colProp: { span: 4 },
      render: ({ formModel, row }) => {
        return <el-input disabled size="small" v-model={formModel[row.prop]} />;
      }
    }
  ];

  const prodProp = [
    {
      colProp: { span: 24 },
      labelWidth: 0,
      render: () => {
        return (
          <el-divider border-style="dashed" content-position="left">
            生产物料属性
          </el-divider>
        );
      }
    },
    {
      label: "日产量",
      prop: "fDailyOutQty",
      colProp: { span: 4 },
      labelWidth: 95,
      render: ({ formModel, row }) => {
        return <el-input disabled size="small" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "标准人数",
      prop: "fDegStandardPersonCount",
      colProp: { span: 4 },
      render: ({ formModel, row }) => {
        return <el-input disabled size="small" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "标准产能/H",
      prop: "fDegCapacity",
      colProp: { span: 4 },
      render: ({ formModel, row }) => {
        return <el-input disabled size="small" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "标准工时",
      prop: "fPerUnitStandHour",
      colProp: { span: 4 },
      render: ({ formModel, row }) => {
        return <el-input disabled size="small" v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "",
      prop: "",
      colProp: { span: 8 },
      render: () => {
        return null;
      }
    },
    {
      label: "标准工时单位",
      prop: "fStandHourUnitId",
      colProp: { span: 4 },
      render: ({ formModel, row }) => {
        return <el-input disabled size="small" v-model={formModel[row.prop]} />;
      }
    }
  ];

  const storeProp = [
    {
      colProp: { span: 24 },
      labelWidth: 0,
      render: () => {
        return (
          <el-divider border-style="dashed" content-position="left">
            仓库物料属性
          </el-divider>
        );
      }
    },
    {
      label: "最小批发量",
      prop: "fMinIssueQty",
      colProp: { span: 4 },
      render: ({ formModel, row }) => {
        return <el-input disabled size="small" v-model={formModel[row.prop]} />;
      }
    }
  ];

  const groupInfo = [...defaultGroup, ...basicProp, ...productProp, ...purchaseProp, ...qualityProp, ...prodProp, ...storeProp, ...dateProp];

  return groupInfo;
};
