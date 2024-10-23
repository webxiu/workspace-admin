import {
  deleteSaleQuotationList,
  fetchSaleQuotationList,
  findByIdSaleQuotationList,
  insertSaleQuotation,
  updateSaleQuotationList
} from "@/api/oaManage/marketing";
import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { h, onMounted, reactive, ref } from "vue";
import { message, showMessageBox } from "@/utils/message";
import { utils, write } from "xlsx";

import DetailPage from "./detail.vue";
import { ElMessage } from "element-plus";
import NodeDetailList from "@/components/NodeDetailList/index.vue";
import { PAGE_CONFIG } from "@/config/constant";
import { PaginationProps } from "@pureadmin/table";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { addDialog } from "@/components/ReDialog";
import { commonBackLogic } from "@/utils/common";
import { commonSubmit } from "@/api/systemManage";
import { formConfigs } from "./config";
import { getBOMTableRowSelectOptions } from "@/api/plmManage";
import { saveAs } from "file-saver";
import { useEleHeight } from "@/hooks";

export const useMachine = () => {
  const dataList: any = ref([]);
  const columns = ref<TableColumnList[]>([]);
  const loading = ref(false);
  const currentRow = ref();
  const tabsRef = ref();
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49);
  const formData: any = reactive({ page: 1, limit: PAGE_CONFIG.pageSize });
  const searchOptions = reactive<SearchOptionType[]>([
    { label: "客户名称", value: "customerName" },
    { label: "单据状态", value: "billState", children: [] },
    { label: "日期范围", value: "date", type: "daterange", format: "YYYY-MM-DD" }
  ]);

  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });

  const fetchBillOptionList = () => {
    getBOMTableRowSelectOptions({ optioncode: "BillStatus" }).then((res) => {
      if (res.data) {
        const result = res.data[0]?.optionList || [];
        searchOptions[1].children = result.map((item) => ({ label: item.optionName, value: item.optionValue }));
      }
    });
  };

  onMounted(() => {
    fetchBillOptionList();
    getColumnConfig();
    onSearch();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "单据编号", prop: "billNo" },
      { label: "单据状态", prop: "billState" },
      { label: "申请人", prop: "createUserName" },
      { label: "客户名称", prop: "customerName" },
      { label: "产品描述", prop: "productDescription" },
      { label: "作成日期", prop: "createDate" },
      { label: "是否翻单", prop: "isRepeatOrder" },
      { label: "参考单号", prop: "referenceNumber" },
      { label: "工艺要求", prop: "processRequirements" },
      { label: "备注", prop: "remark" }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [menuCols] = columnArrs;
    if (menuCols?.length) columnData = menuCols;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false });
    return columnData;
  };

  const onSearch = () => {
    if (formData.date) {
      const [startDate, endDate] = formData.date.split("~").map((item) => item.trim());
      formData.startDate = startDate;
      formData.endDate = endDate;
    }
    fetchSaleQuotationList(formData).then((res: any) => {
      if (res.data) {
        dataList.value = res.data.records || [];
        pagination.total = res.data.total;
      }
    });
  };

  const onFresh = () => {
    getColumnConfig();
    onSearch();
  };

  const handleTagSearch = (val) => {
    formData.customerName = val.customerName;
    formData.billNo = val.billNo;
    formData.billState = val.billState;
    formData.date = val.date;
    onSearch();
  };

  const onExport = () => {
    const timeStep = Date.now();
    const workbook = utils.table_to_book(document.querySelector("#machineTableId"), {
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
      `销售报价${timeStep}.xlsx`
    );
  };

  const openDialog = async (type: "add" | "view" | "edit", row?) => {
    const title = { add: "新增", edit: "修改", view: "查看" }[type];
    const formRef = ref();
    const optionValues = ref([]);
    const _formData: any = reactive({
      id: row?.id ?? "",
      customerName: row?.customerName ?? "",
      processRequirements: row?.processRequirements ?? "",
      productDescription: row?.productDescription ?? "",
      expectedSalesVolume: row?.expectedSalesVolume,
      isRepeatOrder: row?.isRepeatOrder,
      referenceNumber: row?.referenceNumber
    });

    const setFormData = ({ key, val }) => (_formData[key] = val);

    getBOMTableRowSelectOptions({ optioncode: "MaterialUnits,QuotationFixedCost" }).then((res) => {
      if (res.data) {
        optionValues.value = res.data;
        const modelTypeList = res.data.find((item) => item.optionCode === "QuotationFixedCost")?.optionList;
        tabsRef.value.summaryListRef.summaryModelRef.dataList = modelTypeList.map((item) => ({
          id: "",
          projectId: item.optionValue,
          modelType: item.optionName,
          deograFee: "",
          customerFee: "",
          remark: ""
        }));
      }
    });

    setTimeout(() => {
      formRef.value.formConfigs = formConfigs({ setFormData, formData: _formData, tabsRef, optionValues, type: formRef.value?.type }, null, {});
      if (type === "view") {
        findByIdSaleQuotationList({ id: row.id }).then((res: any) => {
          if (res.data) {
            console.log(res.data, "res.data=>>");
            // 回显bom清单
            tabsRef.value.bomRef.dataList =
              res.data.bomDetails?.map((item) => ({
                id: item.id,
                level: item.bomLevel,
                childMaterialNo: item.subItemMaterialCode,
                materialName: item.materialName,
                specifications: item.specificationModel,
                materialAttr: item.materialProperty,
                bomVersion: item.bomVersion,
                dataStatus: item.dataState,
                unit: item.unit,
                numerator: item.dosageNumerator,
                denominator: item.dosageDenominator,
                standardDosage: item.standardDosage,
                noTaxPrice: item.exTaxUnitPrice,
                noTaxMoney: item.exTaxAmount,
                remark: item.remark
              })) || [];

            // 回显模具清单
            tabsRef.value.modelRef.dataList3 =
              res.data.moldCostDetails?.map((item) => ({
                "3DName": item.name3D,
                partName: item.partName,
                noOfModel: item.cavityCount,
                materialAndNo: item.materialAndGrade,
                modelSurfaceTreatment: item.moldSurfaceTreatment,
                prodSurfaceTreatment: item.productSurfaceTreatment,
                modelNo: item.moldNumber,
                weight: item.weight,
                t1: item.dataT1,
                type: item.moldType,
                deograFee: item.delongCost,
                customerFee: item.customerCost,
                modelHasTax: item.moldIncludingTax,
                clampHasTax: item.fixtureMoldIncludingTax,
                supplier: item.supplier,
                remark: item.remark
              })) || [];

            // 回显生产排位表
            tabsRef.value.productSheetRef.dataList2 =
              res.data.assembleDetails?.assemblyChildrenDTOList?.map((item) => ({
                productPCS: item.capacityPCS,
                id: item.id,
                workContent: item.operationContent,
                peopleAmount: item.peopleCount,
                combine: item.personnelEquipmentFixtures,
                posNo: item.scheduleNumber,
                st: item.stSeconds,
                workshop: item.type
              })) || [];

            _formData.expectedSalesAmount = res.data.masterDetails?.expectedSalesAmount;
            _formData.remark = res.data.masterDetails?.remark;
            _formData.marginalContribution = res.data.masterDetails?.unitContributionMarginExTaxAmount || 0;
            tabsRef.value.summaryListRef.formData.companyGrossMargin = res.data.masterDetails?.exTaxSalesCompanyGrossMarginRate;
            tabsRef.value.summaryListRef.formData.productGrossMargin = res.data.masterDetails?.exTaxSalesCustomerProductGrossMarginRate;
            tabsRef.value.summaryListRef.formData.userRate = res.data.masterDetails?.laborCostRate;
            tabsRef.value.summaryListRef.formData.makeFeeRate = res.data.masterDetails?.manufacturingCostRate;
          }
        });
      }
    });

    addDialog({
      title: `${title}`,
      class: "saleMgmtModal",
      props: { formInline: _formData, type },
      width: "1400px",
      draggable: true,
      fullscreenIcon: true,
      okButtonText: "保存",
      closeOnClickModal: false,
      hideFooter: type === "view",
      contentRenderer: () => h(DetailPage, { ref: formRef }),
      beforeSure: (done) => {
        const formIns = formRef.value.formRef.getRef();
        formIns?.validate(async (valid) => {
          if (valid) {
            showMessageBox(`确认要${title}吗?`)
              .then(() => {
                onSubmitChange(type, title, _formData, () => {
                  done();
                  onSearch();
                });
              })
              .catch(console.log);
          }
        });
      }
    });
  };

  const onSubmitChange = (type: string, title: string, data, callback) => {
    const apiType = { add: insertSaleQuotation, edit: updateSaleQuotationList };
    apiType[type](data).then((res) => {
      if (res.data) {
        if (type === "add" && res.data.id) {
          showMessageBox(`新增成功是否进行提交?`)
            .then(() => {
              commonSubmit({ id: res.data.id, billId: "10052" }).then((resp) => {
                if (resp.data) {
                  ElMessage({ message: "提交成功", type: "success" });
                  callback();
                }
              });
            })
            .catch(() => {
              callback();
            });
        } else {
          ElMessage({ message: `${title}成功`, type: "success" });
          callback();
        }
      }
    });
  };

  const onAdd = () => {
    openDialog("add");
  };

  const onEdit = () => {
    if (!currentRow.value) {
      ElMessage({ message: "请选择一条记录", type: "warning" });
      return;
    }

    if (![0, 3].includes(currentRow.value.billState)) return message("当前单据不可修改", { type: "error" });
    openDialog("edit", currentRow.value);
  };

  const onDel = () => {
    if (!currentRow.value) {
      ElMessage({ message: "请选择一条记录", type: "warning" });
      return;
    }
    showMessageBox(`确认要删除单据【${currentRow.value.billNo}】吗?`)
      .then(() => {
        deleteSaleQuotationList({ id: currentRow.value.id }).then((res) => {
          if (res.data) {
            ElMessage({ message: "删除成功", type: "success" });
            currentRow.value = null;
            onSearch();
          }
        });
      })
      .catch(console.log);
  };

  const onPrint = () => {
    console.log("print");
    ElMessage({ message: "功能未实现", type: "warning" });
  };

  const onSubmitAction = () => {
    if (!currentRow.value) {
      ElMessage({ message: "请选择一条记录", type: "warning" });
      return;
    }
    showMessageBox(`确认要提交单据【${currentRow.value.billNo}】吗?`)
      .then(() => {
        commonSubmit({ id: currentRow.value.id, billId: "10052" }).then((resp) => {
          if (resp.data) {
            ElMessage({ message: "提交成功", type: "success" });
            onSearch();
          }
        });
      })
      .catch(console.log);
  };

  const onViewDetail = () => {
    if (!currentRow.value) {
      ElMessage({ message: "请选择一条记录", type: "warning" });
      return;
    }
    addDialog({
      title: "查看审批节点详情",
      width: "900px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: true,
      hideFooter: true,
      contentRenderer: ({ options }) =>
        h(NodeDetailList, { options, billNo: currentRow.value.billNo, billType: "quotation", billState: +currentRow.value.billState })
    });
  };

  const onBackAction = () => {
    if (!currentRow.value) {
      ElMessage({ message: "请选择一条记录", type: "warning" });
      return;
    }
    showMessageBox(`确认要回退单据【${currentRow.value.billNo}】吗?`)
      .then(() => {
        commonBackLogic(currentRow.value.billNo, onSearch);
      })
      .catch(console.log);
  };

  const buttonList = ref([
    { clickHandler: onAdd, type: "primary", text: "新增", isDropDown: false },
    { clickHandler: onEdit, type: "warning", text: "修改", isDropDown: false },
    { clickHandler: onDel, type: "danger", text: "删除", isDropDown: false },
    { clickHandler: onSubmitAction, type: "primary", text: "提交", isDropDown: false },
    { clickHandler: onBackAction, type: "primary", text: "回退", isDropDown: false },
    { clickHandler: onViewDetail, type: "primary", text: "审批详情", isDropDown: false },
    { clickHandler: onExport, type: "primary", text: "导出", isDropDown: true },
    { clickHandler: onPrint, type: "primary", text: "打印", isDropDown: true }
  ]);

  const rowDbclick = (row) => {
    if ([0, 3].includes(currentRow.value.billState)) {
      onEdit();
    } else {
      openDialog("view", row);
    }
  };
  const rowClick = (row) => {
    currentRow.value = row;
  };

  // 分页相关
  function onSizeChange(val: number) {
    formData.limit = val;
    onSearch();
  }

  function onCurrentChange(val: number) {
    formData.page = val;
    onSearch();
  }

  return {
    columns,
    onFresh,
    handleTagSearch,
    pagination,
    onSizeChange,
    onCurrentChange,
    rowClick,
    rowDbclick,
    searchOptions,
    buttonList,
    maxHeight,
    loading,
    dataList
  };
};
