import { colProps, ElMessageBox, FormRules } from "element-plus";
import { getBOMTableRowSelectOptions, insertProductStoreList, updateProductStoreList } from "@/api/plmManage";
import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { h, onMounted, reactive, ref } from "vue";

import EditForm from "@/components/EditForm/index.vue";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { addDialog } from "@/components/ReDialog";
import { message, showMessageBox } from "@/utils/message";
import { useEleHeight } from "@/hooks";
import { type PaginationProps } from "@pureadmin/table";
import { PAGE_CONFIG } from "@/config/constant";
import { utils, write } from "xlsx";
import { saveAs } from "file-saver";
import { getDeptOptions } from "@/utils/requestApi";
import { commonBack, commonSubmit, userInfoList } from "@/api/systemManage";
import { useRouter } from "vue-router";
import { deleteDR0PageList, fetchDR0PageList } from "@/api/oaManage/marketing";
import NodeDetailList from "@/components/NodeDetailList/index.vue";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref([]);
  const currentId = ref("");
  const currentRow: any = ref({});
  const devTypeOpts = ref([]);
  const productLevel = ref([]);
  const treeSelectData = ref([]);
  const authRequireOpts = ref([]);
  const accessoryOpts = ref([]);
  const surfaceOpts = ref([]);
  const voltageOpts = ref([]);
  const productColorOpts = ref([]);
  const statusList = ref([]);
  const router = useRouter();
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49 + 45);

  const formRules = reactive<FormRules>({
    productName: [{ required: true, message: "产品名称为必填项", trigger: "submit" }],
    productLevel: [{ required: true, message: "产品等级为必填项", trigger: "submit" }]
  });

  const formData: any = reactive({
    page: 1,
    limit: PAGE_CONFIG.pageSize
  });

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "开发类型", value: "devType", children: [] },
    { label: "参考机型", value: "simpleModel" },
    { label: "产品等级", value: "productLevel", children: [] },
    { label: "客户", value: "customer" },
    { label: "申请部门", value: "applyDeptName", children: [] },
    { label: "产品名称", value: "productName" },
    { label: "申请人", value: "applyUserName" },
    { label: "日期范围", value: "date", type: "daterange", format: "YYYY-MM-DD" }
  ]);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });

  const formConfigs = ({ devTypeOpts, productLevel, treeSelectData, productColorOpts, surfaceOpts, voltageOpts, authRequireOpts, accessoryOpts }) => {
    const applyUserOpts = ref([]);

    const changeDept = (val) => {
      userInfoList({
        deptId: val,
        limit: 100000,
        page: 1,
        userCode: "",
        userName: "",
        deptIdList: [val],
        userState: "A"
      }).then((res) => {
        if (res.data) {
          applyUserOpts.value = res.data.records.map((item) => ({ optionValue: item.id, optionName: item.userName }));
        }
      });
    };
    return [
      {
        label: "产品名称",
        labelWidth: 100,
        colProp: { span: 6 },
        prop: "productName",
        render: ({ formModel, row }) => {
          return <el-input v-model={formModel[row.prop]} />;
        }
      },
      {
        label: "开发类型",
        colProp: { span: 6 },
        labelWidth: 100,
        prop: "devType",
        render: ({ formModel, row }) => {
          return (
            <el-select v-model={formModel[row.prop]} placeholder="请选择" style={{ width: "100%" }}>
              {devTypeOpts.value.map((item) => (
                <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
              ))}
            </el-select>
          );
        }
      },
      {
        label: "参考机型",
        colProp: { span: 6 },
        labelWidth: 100,
        prop: "simpleModel",
        render: ({ formModel, row }) => {
          return <el-input v-model={formModel[row.prop]} />;
        }
      },
      {
        label: "产品等级",
        colProp: { span: 6 },
        labelWidth: 100,
        prop: "productLevel",
        render: ({ formModel, row }) => {
          return (
            <el-select v-model={formModel[row.prop]} placeholder="请选择" style={{ width: "100%" }} filterable>
              {productLevel.value.map((item) => (
                <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
              ))}
            </el-select>
          );
        }
      },
      {
        label: "客户",
        colProp: { span: 6 },
        labelWidth: 100,
        prop: "customer",
        render: ({ formModel, row }) => {
          return <el-input v-model={formModel[row.prop]} />;
        }
      },
      {
        label: "申请部门",
        prop: "deptId",
        colProp: { span: 6 },
        labelWidth: 100,
        render: ({ formModel, row }) => {
          return (
            <el-tree-select
              v-model={formModel[row.prop]}
              data={treeSelectData.value}
              onChange={changeDept}
              filterable
              check-strictly
              default-expanded-keys={["0"]}
              node-key="value"
              render-after-expand={false}
              class="ui-w-100"
            />
          );
        }
      },
      {
        label: "申请人",
        colProp: { span: 6 },
        labelWidth: 100,
        prop: "applyUserId",
        render: ({ formModel, row }) => {
          return (
            <el-select v-model={formModel[row.prop]} placeholder="请选择" style={{ width: "100%" }}>
              {applyUserOpts.value.map((item) => (
                <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
              ))}
            </el-select>
          );
        }
      },
      {
        label: "产品颜色",
        colProp: { span: 6 },
        labelWidth: 100,
        prop: "productColor",
        render: ({ formModel, row }) => {
          return (
            <el-select v-model={formModel[row.prop]} placeholder="请选择" style={{ width: "100%" }}>
              {productColorOpts.value.map((item) => (
                <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
              ))}
            </el-select>
          );
        }
      },
      {
        label: "设计/功能描述",
        colProp: { span: 24 },
        labelWidth: 100,
        prop: "customer",
        render: ({ formModel, row }) => {
          return <el-input type="textarea" v-model={formModel[row.prop]} autosize />;
        }
      },
      {
        label: "表面处理",
        colProp: { span: 6 },
        labelWidth: 100,
        prop: "productSurface",
        render: ({ formModel, row }) => {
          return (
            <el-select v-model={formModel[row.prop]} placeholder="请选择" style={{ width: "100%" }}>
              {surfaceOpts.value.map((item) => (
                <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
              ))}
            </el-select>
          );
        }
      },
      {
        label: "工作电压",
        colProp: { span: 6 },
        labelWidth: 100,
        prop: "voltage",
        render: ({ formModel, row }) => {
          return (
            <el-select v-model={formModel[row.prop]} placeholder="请选择" style={{ width: "100%" }}>
              {voltageOpts.value.map((item) => (
                <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
              ))}
            </el-select>
          );
        }
      },
      {
        label: "功率",
        colProp: { span: 6 },
        labelWidth: 100,
        prop: "power",
        render: ({ formModel, row }) => {
          return <el-input v-model={formModel[row.prop]} />;
        }
      },
      {
        label: "销售对象",
        colProp: { span: 6 },
        labelWidth: 100,
        prop: "saleObject",
        render: ({ formModel, row }) => {
          return <el-input v-model={formModel[row.prop]} />;
        }
      },
      {
        label: "认证要求",
        colProp: { span: 12 },
        labelWidth: 100,
        prop: "authRequire",
        render: ({ formModel, row }) => {
          return (
            <el-select
              collapse-tags
              collapse-tags-tooltip
              max-collapse-tags={5}
              v-model={formModel[row.prop]}
              placeholder="请选择"
              style={{ width: "100%" }}
              filterable
              multiple
            >
              {authRequireOpts.value.map((item) => (
                <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
              ))}
            </el-select>
          );
        }
      },
      {
        label: "配件",
        colProp: { span: 6 },
        labelWidth: 100,
        prop: "accessory",
        render: ({ formModel, row }) => {
          return (
            <el-select v-model={formModel[row.prop]} placeholder="请选择" style={{ width: "100%" }}>
              {accessoryOpts.value.map((item) => (
                <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
              ))}
            </el-select>
          );
        }
      },
      {
        label: "包材要求",
        colProp: { span: 6 },
        labelWidth: 100,
        prop: "materialRequire",
        render: ({ formModel, row }) => {
          return <el-input v-model={formModel[row.prop]} />;
        }
      },
      {
        label: "马达类型",
        colProp: { span: 6 },
        labelWidth: 100,
        prop: "motorType",
        render: ({ formModel, row }) => {
          return <el-input v-model={formModel[row.prop]} />;
        }
      },
      {
        label: "发热体",
        colProp: { span: 6 },
        labelWidth: 100,
        prop: "heatingElement",
        render: ({ formModel, row }) => {
          return <el-input v-model={formModel[row.prop]} />;
        }
      },
      {
        label: "蓝牙",
        colProp: { span: 6 },
        labelWidth: 100,
        prop: "bluetooth",
        render: ({ formModel, row }) => {
          return <el-input v-model={formModel[row.prop]} />;
        }
      },
      {
        label: "整理寿命",
        colProp: { span: 6 },
        labelWidth: 100,
        prop: "lifetime",
        render: ({ formModel, row }) => {
          return <el-input v-model={formModel[row.prop]} />;
        }
      },
      {
        label: "负离子",
        colProp: { span: 6 },
        labelWidth: 100,
        prop: "negativeIon",
        render: ({ formModel, row }) => {
          return <el-input v-model={formModel[row.prop]} />;
        }
      },
      {
        label: "其它",
        colProp: { span: 6 },
        labelWidth: 100,
        prop: "otherPerformance",
        render: ({ formModel, row }) => {
          return <el-input v-model={formModel[row.prop]} />;
        }
      },
      {
        label: "产品卖点",
        colProp: { span: 12 },
        labelWidth: 100,
        prop: "sellingPoint",
        render: ({ formModel, row }) => {
          return <el-input type="textarea" v-model={formModel[row.prop]} autosize />;
        }
      },
      {
        label: "产品缺点",
        colProp: { span: 12 },
        labelWidth: 100,
        prop: "disadvantage",
        render: ({ formModel, row }) => {
          return <el-input type="textarea" v-model={formModel[row.prop]} autosize />;
        }
      },
      {
        label: "第一销售地",
        colProp: { span: 6 },
        labelWidth: 100,
        prop: "firstSalePlace",
        render: ({ formModel, row }) => {
          return <el-input v-model={formModel[row.prop]} />;
        }
      },
      {
        label: "第二销售地",
        colProp: { span: 6 },
        labelWidth: 100,
        prop: "secondSalePlace",
        render: ({ formModel, row }) => {
          return <el-input v-model={formModel[row.prop]} />;
        }
      },
      {
        label: "策划台数/年",
        colProp: { span: 6 },
        labelWidth: 100,
        prop: "planningQuantity",
        render: ({ formModel, row }) => {
          return <el-input-number class="ui-w-100" controls={false} min={0} v-model={formModel[row.prop]} />;
        }
      },
      {
        label: "销售价格",
        colProp: { span: 6 },
        labelWidth: 100,
        prop: "salePrice",
        render: ({ formModel, row }) => {
          return <el-input-number class="ui-w-100" controls={false} min={0} v-model={formModel[row.prop]} />;
        }
      },
      {
        label: "单机成本",
        colProp: { span: 6 },
        labelWidth: 100,
        prop: "singlePrice",
        render: ({ formModel, row }) => {
          return <el-input-number class="ui-w-100" controls={false} min={0} v-model={formModel[row.prop]} />;
        }
      },
      {
        label: "包材",
        colProp: { span: 6 },
        labelWidth: 100,
        prop: "materialPrice",
        render: ({ formModel, row }) => {
          return <el-input-number class="ui-w-100" controls={false} min={0} v-model={formModel[row.prop]} />;
        }
      },
      {
        label: "制造费用",
        colProp: { span: 6 },
        labelWidth: 100,
        prop: "makePrice",
        render: ({ formModel, row }) => {
          return <el-input-number class="ui-w-100" controls={false} min={0} v-model={formModel[row.prop]} />;
        }
      },
      {
        label: "产品成本合计",
        colProp: { span: 6 },
        labelWidth: 100,
        prop: "costTotal",
        render: ({ formModel, row }) => {
          return <el-input-number class="ui-w-100" controls={false} min={0} v-model={formModel[row.prop]} />;
        }
      },
      {
        label: "预计毛利率",
        colProp: { span: 6 },
        labelWidth: 100,
        prop: "grossMargin",
        render: ({ formModel, row }) => {
          return <el-input-number class="ui-w-100" controls={false} min={0} v-model={formModel[row.prop]} />;
        }
      },
      {
        label: "预计总利润",
        colProp: { span: 6 },
        labelWidth: 100,
        prop: "profit",
        render: ({ formModel, row }) => {
          return <el-input-number class="ui-w-100" controls={false} min={0} v-model={formModel[row.prop]} />;
        }
      }
    ];
  };

  onMounted(() => {
    getColumnConfig(buttonList);
    fetchOpts();
    onSearch();
  });

  const getColumnConfig = async (buttonList) => {
    let columnData: TableColumnList[] = [
      { label: "单据编号", prop: "billNo", width: 140 },
      { label: "产品名称", prop: "productName", width: 140 },
      { label: "开发类型", prop: "developmentType", width: 140 },
      { label: "参考机型", prop: "referenceModel", width: 140 },
      { label: "产品等级", prop: "productGrade", width: 140 },
      { label: "客户", prop: "customer", width: 140 },
      { label: "申请部门", prop: "deptName", width: 140 },
      { label: "申请人", prop: "userName", width: 140 },
      { label: "申请日期", prop: "applyDate", width: 140 }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [menuCols] = columnArrs;
    if (menuCols?.length) {
      columnData = menuCols;
    }
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData: JSON.parse(JSON.stringify(columnData)), operationColumn: false });
    return columnData;
  };

  const onSearch = () => {
    fetchDR0PageList(formData).then((res: any) => {
      if (res.data) {
        const data = res.data;
        dataList.value = data.records;
        pagination.total = data.total;
      }
    });
  };

  const fetchOpts = () => {
    getBOMTableRowSelectOptions({ optioncode: "DR0DevType,DR0ProductLevel,ProductColors,DR0Surface,DR0Voltage,DR0AuthRequire,DR0Part,BillStatus" }).then(
      (res) => {
        if (res.data) {
          const findRes = res.data.find((item) => item.optionCode === "DR0DevType")?.optionList || [];
          devTypeOpts.value = findRes;
          searchOptions[0].children = findRes.map((item) => ({ label: item.optionName, value: item.optionValue }));

          const findRes1 = res.data.find((item) => item.optionCode === "DR0ProductLevel")?.optionList || [];
          productLevel.value = findRes1;
          searchOptions[2].children = findRes1.map((item) => ({ label: item.optionName, value: item.optionValue }));

          const findRes2 = res.data.find((item) => item.optionCode === "ProductColors")?.optionList || [];
          productColorOpts.value = findRes2;

          const findRes3 = res.data.find((item) => item.optionCode === "DR0Surface")?.optionList || [];
          surfaceOpts.value = findRes3;

          const findRes4 = res.data.find((item) => item.optionCode === "DR0Voltage")?.optionList || [];
          voltageOpts.value = findRes4;

          const findRes5 = res.data.find((item) => item.optionCode === "DR0AuthRequire")?.optionList || [];
          authRequireOpts.value = findRes5;

          const findRes6 = res.data.find((item) => item.optionCode === "DR0Part")?.optionList || [];
          accessoryOpts.value = findRes6;

          const findRes7 = res.data.find((item) => item.optionCode === "BillStatus")?.optionList || [];
          statusList.value = findRes7;
        }
      }
    );

    getDeptOptions().then((data: any) => {
      searchOptions[4].children = data;
      treeSelectData.value = data;
    });
  };

  const onFresh = () => {
    getColumnConfig(buttonList);
    onSearch();
  };

  const handleTagSearch = (values) => {
    formData.productName = values.productName;
    formData.billNo = values.billNo;
    formData.developmentType = values.devType;
    formData.productGrade = values.productLevel;
    formData.referenceModel = values.simpleModel;
    formData.customer = values.customer;
    formData.applyDepartment = values.applyDeptName;
    formData.userName = values.applyUserName;

    if (values.date) {
      const [startDate, endDate] = values.date.split("~").map((item) => item.trim());
      formData.startDate = startDate;
      formData.endDate = endDate;
    } else {
      formData.startDate = undefined;
      formData.endDate = undefined;
    }
    onSearch();
  };

  const onAdd = () => {
    // openDialog("add");
    router.push("/plmManage/productMgmt/DR0Apply/add/index");
  };

  const onEdit = () => {
    currentId.value = currentRow.value.id;
    // openDialog("edit", currentRow.value);
    router.push("/plmManage/productMgmt/DR0Apply/add/index?id=" + currentId.value + "&innerId=" + currentRow.value.functionalities[0]?.id);
  };

  const openDialog = async (type: string, row?) => {
    const titleObj = { add: "新增", edit: "修改" };
    const title = titleObj[type];
    const formRef = ref();

    const _formData = reactive({});

    addDialog({
      title: `${title}`,
      class: "product-apply-modal",
      props: {
        formInline: _formData,
        formRules: formRules,
        formProps: { size: "small" },
        formConfigs: formConfigs({ devTypeOpts, productLevel, treeSelectData, productColorOpts, surfaceOpts, voltageOpts, authRequireOpts, accessoryOpts })
      },
      width: "1200px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.validate(async (valid) => {
          if (valid) {
            ElMessageBox.confirm(`确认要${title}吗?`, "系统提示", {
              type: "warning",
              draggable: true,
              cancelButtonText: "取消",
              confirmButtonText: "确定",
              dangerouslyUseHTMLString: true
            }).then(() => {
              onSubmitChange(type, title, _formData, () => {
                done();
                onSearch();
              });
            });
          }
        });
      }
    });
  };

  const onSubmitChange = (type: string, title: string, data, callback) => {
    console.log(data, "提交的数据");
    return;
    const API = { add: insertProductStoreList, edit: updateProductStoreList };
    API[type](data)
      .then((res) => {
        if (res.status === 200 || res.data) {
          callback();
          message(`${title}成功`);
        }
      })
      .catch(console.log);
  };

  // 导出
  const onExport = async () => {
    const timeStep = Date.now();
    const workbook = utils.table_to_book(document.querySelector("#productStoreTableId"), {
      raw: true //有的是日期、小数等格式，直接乱码#。所以这里直接保留原始字符串
    });
    workbook.Sheets.Sheet1["!cols"][0] = { hidden: true };
    const wbout = write(workbook, {
      bookType: "xlsx",
      bookSST: true,
      type: "array"
    });
    saveAs(
      new Blob([wbout], {
        type: "application/octet-stream"
      }),
      `DR0开发申请表${timeStep}.xlsx`
    );
  };

  const onDelete = () => {
    const row = currentRow.value;
    ElMessageBox.confirm(`确认要删除名称为【${row.productName}】的申请吗?`, "系统提示", {
      type: "warning",
      draggable: true,
      cancelButtonText: "取消",
      confirmButtonText: "确定",
      dangerouslyUseHTMLString: true
    })
      .then(() => {
        console.log(row, "del row..");
        deleteDR0PageList(row.id).then((res) => {
          if (res.data) {
            message("删除成功", { type: "success" });
            currentRow.value = null;
            onSearch();
          }
        });
      })
      .catch(() => {});
  };

  const beforeOnEdit = () => {
    if (JSON.stringify(currentRow.value) == "{}" || !currentRow.value) {
      message("请选择一条记录", { type: "warning" });
      return;
    } else {
      onEdit();
    }
  };

  const beforeOnPrint = () => {
    if (JSON.stringify(currentRow.value) == "{}" || !currentRow.value) {
      message("请选择一条记录", { type: "warning" });
      return;
    } else {
      router.push("/plmManage/productMgmt/DR0Apply/print/index?id=" + currentRow.value.id);
    }
  };

  const beforeOnDelete = () => {
    if (JSON.stringify(currentRow.value) == "{}" || !currentRow.value) {
      message("请选择一条记录", { type: "warning" });
      return;
    } else {
      onDelete();
    }
  };

  const rowClick = (row) => {
    currentRow.value = row;
  };

  const rowDbClick = (row) => {
    console.log("row db click", row);
    currentRow.value = row;
    onEdit();
  };

  const beforeOnSubmit = () => {
    if (JSON.stringify(currentRow.value) == "{}" || !currentRow.value) {
      return message("请选择一条记录", { type: "warning" });
    } else {
      const { billNo, id } = currentRow.value;
      showMessageBox(`确认要提交【${billNo}】吗?`).then(() => {
        commonSubmit({ id, billId: "10012" }).then(({ data }) => {
          if (data) {
            message("提交成功");
            onSearch();
          }
        });
      });
    }
  };

  const beforeOnRevoke = () => {
    if (JSON.stringify(currentRow.value) == "{}" || !currentRow.value) {
      return message("请选择一条记录", { type: "warning" });
    } else {
      const { billNo } = currentRow.value;
      showMessageBox(`确认要撤销【${billNo}】吗?`).then(() => {
        commonBack({ comment: "", backToActivityId: "startEvent1", billNo }).then(({ data }) => {
          if (data) {
            message("撤销成功");
            onSearch();
          }
        });
      });
    }
  };

  const beforeOnViewDetail = () => {
    if (JSON.stringify(currentRow.value) == "{}" || !currentRow.value) {
      return message("请选择一条记录", { type: "warning" });
    } else {
      addDialog({
        title: "查看审批详情",
        width: "900px",
        draggable: true,
        fullscreenIcon: true,
        closeOnClickModal: true,
        hideFooter: true,
        contentRenderer: ({ options }) =>
          h(NodeDetailList, { options, billNo: currentRow.value.billNo, billType: "dr0DevApply", billState: currentRow.value.status })
      });
    }
  };

  const clickHandler = ({ text }) => {
    switch (text) {
      case "导出":
        onExport();
        break;
      case "新增":
        onAdd();
        break;
      case "修改":
        beforeOnEdit();
        break;
      case "打印":
        beforeOnPrint();
        break;
      case "删除":
        beforeOnDelete();
        break;
      case "提交":
        beforeOnSubmit();
        break;
      case "撤销":
        beforeOnRevoke();
        break;
      case "审批详情":
        beforeOnViewDetail();
        break;

      default:
        break;
    }
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler, type: "primary", text: "新增" },
    { clickHandler, type: "warning", text: "修改" },
    { clickHandler, type: "danger", text: "删除" },
    { clickHandler, type: "primary", text: "提交", isDropDown: true },
    { clickHandler, type: "primary", text: "撤销", isDropDown: true },
    { clickHandler, type: "primary", text: "审批详情", isDropDown: true },
    { clickHandler, type: "primary", text: "打印", isDropDown: true },
    { clickHandler, type: "primary", text: "导出", isDropDown: true }
  ]);

  // 分页相关
  function handleSizeChange(val: number) {
    formData.limit = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    formData.page = val;
    onSearch();
  }

  const onCurrentChange = (row) => {
    if (!row) return;
    currentRow.value = row;
  };

  return {
    loading,
    handleSizeChange,
    handleCurrentChange,
    onCurrentChange,
    columns,
    dataList,
    rowDbClick,
    rowClick,
    maxHeight,
    searchOptions,
    statusList,
    onSearch,
    onFresh,
    pagination,
    onAdd,
    onEdit,
    handleTagSearch,
    onDelete,
    onExport,
    beforeOnEdit,
    buttonList,
    beforeOnDelete
  };
};
