import * as XLSX from "xlsx";

import { h, onMounted, ref, watch } from "vue";
import { setColumn, tableEditRender } from "@/utils/table";

import { ElMessage } from "element-plus";
import ImportBOMPriceExcelModal from "./importBOMPriceExcelModal.vue";
import ImportModelFeeExcelModal from "./importModelFeeExcelModal.vue";
import { addDialog } from "@/components/ReDialog";
import { cloneDeep } from "@pureadmin/utils";
import { getBOMTableRowSelectOptions } from "@/api/plmManage";
import { message } from "@/utils/message";
import { v4 as uuidv4 } from "uuid";

export const useTabGroup = (tabConfig?) => {
  const dataList = ref([]);
  const dataList2 = ref([]);
  const dataList3 = ref([]);
  const columns = ref([]);
  const columns2 = ref([]);
  const columns3 = ref([]);
  const currentRow = ref();
  const currentRow2 = ref();
  const currentRow3 = ref();
  const maxHeight = ref(340);
  const bomTotalVal = ref(0);
  const upload_file = ref("");
  const allChars = ref([]);

  onMounted(() => {
    getColumnConfig();
    getColumnConfig2();
    getColumnConfig3();
  });

  watch(
    dataList,
    (newVal) => {
      const filterArr = newVal?.filter((item) => item.noTaxMoney && !isNaN(Number(item.noTaxMoney)));

      const bomTotal = filterArr?.reduce((pre, next) => pre + +next.noTaxMoney, 0);

      bomTotalVal.value = bomTotal;

      // tabConfig.props.setFormData({ key: "materialFee", val: bomTotal });
      tabConfig.props.summaryListRef.formData.materialFee = bomTotal;
    },
    { deep: true }
  );

  watch(
    dataList2,
    (newVal) => {
      const filterArr = newVal?.filter((item) => item.peopleAmount && !isNaN(Number(item.peopleAmount)));
      const prodPCSArr = newVal?.filter((item) => item.productPCS && !isNaN(Number(item.productPCS)));
      const stArr = newVal?.filter((item) => item.st && !isNaN(Number(item.st)));

      const humanResources = filterArr?.reduce((pre, next) => pre + +next.peopleAmount, 0);
      const productPCS = prodPCSArr?.reduce((pre, next) => pre + +next.productPCS, 0);
      const st = stArr?.reduce((pre, next) => pre + +next.st, 0);

      const totalHour = (humanResources * st * 1.05).toFixed(2);
      const userRate = tabConfig.props.summaryListRef.formData.userRate;
      const makeRate = tabConfig.props.summaryListRef.formData.makeFeeRate;
      const companyGrossMarginRate = tabConfig.props.summaryListRef.formData.companyGrossMargin;

      const userFee = ((+totalHour / 3600) * userRate).toFixed(2);
      const makeFee = ((+totalHour / 3600) * makeRate).toFixed(2);
      const singleTotal = tabConfig.props.summaryListRef.formData.materialFee + +userFee + +makeFee;
      const notTaxPrice = (singleTotal / (1 - companyGrossMarginRate)).toFixed(2);
      const taxPrice = (+notTaxPrice * 1.13).toFixed(2);

      tabConfig.props.summaryListRef.formData.humanResources = humanResources;
      tabConfig.props.summaryListRef.formData.capacityRate = productPCS;

      tabConfig.props.summaryListRef.formData.capacity = (productPCS / humanResources).toFixed(2);

      tabConfig.props.summaryListRef.formData.standardHours = totalHour;

      tabConfig.props.setFormData({ key: "laborCosts", val: userFee });
      tabConfig.props.setFormData({ key: "manufacturingCosts", val: makeFee });

      tabConfig.props.setFormData({ key: "singleCostTotal", val: singleTotal.toFixed(2) });
      tabConfig.props.setFormData({ key: "notTaxPrice", val: notTaxPrice });
      tabConfig.props.setFormData({ key: "taxPrice", val: taxPrice });
      tabConfig.props.setFormData({ key: "usdPrice", val: (+notTaxPrice / 7).toFixed(2) });
      tabConfig.props.setFormData({ key: "marginalContribution", val: (+notTaxPrice - +singleTotal).toFixed(2) });
    },
    { deep: true }
  );

  const initFormVal = (newVal) => {
    const modelHasTaxTotalArr = newVal?.filter((item) => item.modelHasTax && !isNaN(Number(item.modelHasTax)));
    const clampHasTaxTotalArr = newVal?.filter((item) => item.clampHasTax && !isNaN(Number(item.clampHasTax)));
    const deograFeeArr = newVal?.filter((item) => item.deograFee && !isNaN(Number(item.deograFee)));

    const modelHasTaxTotal = modelHasTaxTotalArr?.reduce((pre, next) => pre + +next.modelHasTax, 0);
    const clampHasTaxTotal = clampHasTaxTotalArr?.reduce((pre, next) => pre + +next.clampHasTax, 0);
    const deograFee = deograFeeArr?.reduce((pre, next) => pre + +next.deograFee, 0);
    const breakVenSalesFee = Math.ceil(deograFee / tabConfig.props?.formData?.marginalContribution);

    // 五金类
    const hardwareDeograFeeArr = newVal?.filter((item) => item.type == "2" && item.deograFee && !isNaN(Number(item.deograFee)));
    const hardwareDeograFeeTotal = hardwareDeograFeeArr?.reduce((pre, next) => pre + +next.deograFee, 0);
    tabConfig.props.summaryListRef.summaryModelRef.dataList[1].deograFee = hardwareDeograFeeTotal;

    const customerFeeArr = newVal?.filter((item) => item.type === "2" && item.customerFee && !isNaN(Number(item.customerFee)));
    const customerFeeTotal = customerFeeArr?.reduce((pre, next) => pre + +next.customerFee, 0);
    tabConfig.props.summaryListRef.summaryModelRef.dataList[1].customerFee = customerFeeTotal;

    // 塑胶类
    const plasticDeograFeeArr = newVal?.filter((item) => item.type == "1" && item.deograFee && !isNaN(Number(item.deograFee)));
    const plasticDeograFeeTotal = plasticDeograFeeArr?.reduce((pre, next) => pre + +next.deograFee, 0);
    tabConfig.props.summaryListRef.summaryModelRef.dataList[0].deograFee = plasticDeograFeeTotal;

    const plasticFeeArr = newVal?.filter((item) => item.type == "1" && item.customerFee && !isNaN(Number(item.customerFee)));
    const plasticFeeTotal = plasticFeeArr?.reduce((pre, next) => pre + +next.customerFee, 0);
    tabConfig.props.summaryListRef.summaryModelRef.dataList[0].customerFee = plasticFeeTotal;

    // 硅胶类
    const silicaGelDeograFeeArr = newVal?.filter((item) => item.type == "3" && item.deograFee && !isNaN(Number(item.deograFee)));
    const silicaGelDeograFeeTotal = silicaGelDeograFeeArr?.reduce((pre, next) => pre + +next.deograFee, 0);
    tabConfig.props.summaryListRef.summaryModelRef.dataList[2].deograFee = silicaGelDeograFeeTotal;

    const silicaGelFeeArr = newVal?.filter((item) => item.type == "3" && item.customerFee && !isNaN(Number(item.customerFee)));
    const silicaGelFeeTotal = silicaGelFeeArr?.reduce((pre, next) => pre + +next.customerFee, 0);
    tabConfig.props.summaryListRef.summaryModelRef.dataList[2].customerFee = silicaGelFeeTotal;

    // 其他
    const otherDeograFeeArr = newVal?.filter((item) => item.type == "4" && item.deograFee && !isNaN(Number(item.deograFee)));
    const otherDeograFeeTotal = otherDeograFeeArr?.reduce((pre, next) => pre + +next.deograFee, 0);
    tabConfig.props.summaryListRef.summaryModelRef.dataList[3].deograFee = otherDeograFeeTotal;

    const otherFeeArr = newVal?.filter((item) => item.type == "4" && item.customerFee && !isNaN(Number(item.customerFee)));
    const otherFeeTotal = otherFeeArr?.reduce((pre, next) => pre + +next.customerFee, 0);
    tabConfig.props.summaryListRef.summaryModelRef.dataList[3].customerFee = otherFeeTotal;

    tabConfig.props.summaryListRef.formData.modelHasTaxTotal = modelHasTaxTotal;
    tabConfig.props.summaryListRef.formData.clampHasTaxTotal = clampHasTaxTotal;
    tabConfig.props.setFormData({ key: "breakVenSales", val: breakVenSalesFee });
  };

  watch(dataList3, (newVal) => {
    if (Array.isArray(newVal) && newVal.length) {
      initFormVal(newVal);
    }
  });

  const clearDataList2 = () => (dataList2.value = []);

  // 编辑表格
  const editCell_1 = tableEditRender();
  const editCell_2 = tableEditRender();
  const editCell_3 = tableEditRender();

  const getColumnConfig = () => {
    const editFlag = tabConfig.props?.valid?.bomDetails;
    const levelRender = (data) => editCell_1.editCellRender({ data, isEdit: editFlag });
    const childMaterialNoRender = (data) => editCell_1.editCellRender({ data, isEdit: editFlag });
    const materialNameRender = (data) => editCell_1.editCellRender({ data, isEdit: editFlag });
    const specificationsNameRender = (data) => editCell_1.editCellRender({ data, isEdit: editFlag });
    const materialAttrRender = (data) => editCell_1.editCellRender({ data, isEdit: editFlag });
    const bomVersionRender = (data) => editCell_1.editCellRender({ data, isEdit: editFlag });
    const dataStateRender = (data) => editCell_1.editCellRender({ data, isEdit: editFlag });
    const numeratorRender = (data) => editCell_1.editCellRender({ data, isEdit: editFlag });
    const denominatorRender = (data) => editCell_1.editCellRender({ data, isEdit: editFlag });
    const standardDosageRender = (data) => editCell_1.editCellRender({ data, isEdit: editFlag });
    const noTaxPriceRender = (data) => editCell_1.editCellRender({ data, isEdit: editFlag });
    const noTaxMoneyRender = (data) => editCell_1.editCellRender({ data, isEdit: editFlag });
    const remarkRender = (data) => editCell_1.editCellRender({ data, isEdit: editFlag });
    const unitRender = (data) => {
      const options =
        tabConfig.props?.optionValues?.value
          ?.find((item) => item.optionCode === "MaterialUnits")
          ?.optionList?.map(({ optionName, optionValue }) => ({ optionName, optionValue })) || [];
      return editCell_1.editCellRender({ type: "select", data, options: options, isEdit: editFlag, cellStyle: { color: "#606266", textAlign: "left" } });
    };

    const columnData: TableColumnList[] = [
      { label: "BOM层级", prop: "level", cellRenderer: levelRender },
      { label: "子项物料编码", prop: "childMaterialNo", cellRenderer: childMaterialNoRender },
      { label: "物料名称", prop: "materialName", cellRenderer: materialNameRender },
      { label: "规格型号", prop: "specifications", cellRenderer: specificationsNameRender },
      { label: "物料属性", prop: "materialAttr", cellRenderer: materialAttrRender },
      { label: "不含税单价", align: "right", prop: "noTaxPrice", cellRenderer: noTaxPriceRender },
      { label: "不含税金额(RMB)", align: "right", prop: "noTaxMoney", minWidth: 160, cellRenderer: noTaxMoneyRender },
      { label: "BOM版本", prop: "bomVersion", cellRenderer: bomVersionRender },
      { label: "数据状态", prop: "dataState", cellRenderer: dataStateRender },
      { label: "单位", prop: "unit", cellRenderer: unitRender },
      { label: "用量:分子", align: "right", prop: "numerator", cellRenderer: numeratorRender },
      { label: "用量:分母", align: "right", prop: "denominator", cellRenderer: denominatorRender },
      { label: "标准用量", align: "right", prop: "standardDosage", cellRenderer: standardDosageRender },
      { label: "备注", prop: "remark", cellRenderer: remarkRender }
    ];

    columns.value = setColumn({ columnData, operationColumn: false });
  };

  const getColumnConfig2 = () => {
    const productFlag = tabConfig.props?.valid?.assembleDetails;
    const posNoRender = (data) => editCell_2.editCellRender({ data, isEdit: !["add", "view", "edit"].includes(tabConfig.props?.type) && productFlag });
    const workContentRender = (data) => editCell_2.editCellRender({ data, isEdit: !["add", "view", "edit"].includes(tabConfig.props?.type) && productFlag });
    const peopleAmountRender = (data) => editCell_2.editCellRender({ data, isEdit: !["add", "view", "edit"].includes(tabConfig.props?.type) && productFlag });
    const stRender = (data) => editCell_2.editCellRender({ data, isEdit: !["add", "view", "edit"].includes(tabConfig.props?.type) && productFlag });
    const productPCSRender = (data) => editCell_2.editCellRender({ data, isEdit: !["add", "view", "edit"].includes(tabConfig.props?.type) && productFlag });
    const combineRender = (data) => editCell_2.editCellRender({ data, isEdit: !["add", "view", "edit"].includes(tabConfig.props?.type) && productFlag });
    const workshopRender = (data) => {
      const options = [
        { optionName: "加工", optionValue: 2 },
        { optionName: "组装", optionValue: 1 }
      ];
      return editCell_2.editCellRender({
        type: "select",
        data,
        options: options,
        isEdit: !["add", "view", "edit"].includes(tabConfig.props?.type) && productFlag,
        cellStyle: {
          color: "#606266",
          textAlign: "left"
        }
      });
    };

    const columnData: TableColumnList[] = [
      { label: "车间", prop: "workshop", cellRenderer: workshopRender },
      { label: "排位序号", prop: "posNo", cellRenderer: posNoRender },
      { label: "作业内容", prop: "workContent", cellRenderer: workContentRender },
      { label: "人数(人)", align: "right", prop: "peopleAmount", cellRenderer: peopleAmountRender },
      { label: "s/t(秒)", align: "right", prop: "st", cellRenderer: stRender },
      { label: "产能(PCS)", align: "right", prop: "productPCS", cellRenderer: productPCSRender },
      { label: "人员、设备、工装、治具", prop: "combine", cellRenderer: combineRender }
    ];

    columns2.value = setColumn({ columnData, operationColumn: false });
  };

  const getColumnConfig3 = () => {
    const modelFlag = tabConfig.props?.valid?.moldCostDetails;

    const threeDNameRender = (data) => editCell_3.editCellRender({ data, isEdit: !["add", "view", "edit"].includes(tabConfig.props?.type) && modelFlag });
    const partNameRender = (data) => editCell_3.editCellRender({ data, isEdit: !["add", "view", "edit"].includes(tabConfig.props?.type) && modelFlag });
    const noOfModelRender = (data) => editCell_3.editCellRender({ data, isEdit: !["add", "view", "edit"].includes(tabConfig.props?.type) && modelFlag });
    const materialAndNoRender = (data) => editCell_3.editCellRender({ data, isEdit: !["add", "view", "edit"].includes(tabConfig.props?.type) && modelFlag });
    const modelSurfaceTreatmentRender = (data) =>
      editCell_3.editCellRender({ data, isEdit: !["add", "view", "edit"].includes(tabConfig.props?.type) && modelFlag });
    const prodSurfaceTreatmentRender = (data) =>
      editCell_3.editCellRender({ data, isEdit: !["add", "view", "edit"].includes(tabConfig.props?.type) && modelFlag });
    const modelNoRender = (data) => editCell_3.editCellRender({ data, isEdit: !["add", "view", "edit"].includes(tabConfig.props?.type) && modelFlag });
    const weightRender = (data) => editCell_3.editCellRender({ data, isEdit: !["add", "view", "edit"].includes(tabConfig.props?.type) && modelFlag });
    const t1Render = (data) => editCell_3.editCellRender({ data, isEdit: !["add", "view", "edit"].includes(tabConfig.props?.type) && modelFlag });
    const remarkRender = (data) => editCell_3.editCellRender({ data, isEdit: !["add", "view", "edit"].includes(tabConfig.props?.type) && modelFlag });
    const modelHasTaxRender = (data) => editCell_3.editCellRender({ data, isEdit: !["add", "view", "edit"].includes(tabConfig.props?.type) && modelFlag });
    const clampHasTaxRender = (data) => editCell_3.editCellRender({ data, isEdit: !["add", "view", "edit"].includes(tabConfig.props?.type) && modelFlag });
    const supplierRender = (data) => editCell_3.editCellRender({ data, isEdit: !["add", "view", "edit"].includes(tabConfig.props?.type) && modelFlag });

    const typeRender = (data) => {
      const options =
        tabConfig.props?.optionValues?.value
          ?.find((item) => item.optionCode === "QuotationFixedCost")
          ?.optionList?.map(({ optionName, optionValue }) => ({ optionName, optionValue })) || [];
      return editCell_3.editCellRender({
        type: "select",
        data,
        options: options,
        isEdit: !["add", "view", "edit"].includes(tabConfig.props?.type) && modelFlag,
        cellStyle: {
          color: "#606266",
          textAlign: "left"
        }
      });
    };
    const deograFeeRender = (data) => editCell_3.editCellRender({ data, isEdit: !["add", "view", "edit"].includes(tabConfig.props?.type) && modelFlag });
    const customerFeeRender = (data) => editCell_3.editCellRender({ data, isEdit: !["add", "view", "edit"].includes(tabConfig.props?.type) && modelFlag });

    const columnData: TableColumnList[] = [
      { label: "3D名称", prop: "3DName", cellRenderer: threeDNameRender },
      { label: "零件名称", prop: "partName", cellRenderer: partNameRender },
      { label: "模穴数量", align: "right", prop: "noOfModel", cellRenderer: noOfModelRender },
      { label: "材料及牌号", prop: "materialAndNo", cellRenderer: materialAndNoRender },
      { label: "模具表面处理", prop: "modelSurfaceTreatment", cellRenderer: modelSurfaceTreatmentRender },
      { label: "产品表面处理", prop: "prodSurfaceTreatment", cellRenderer: prodSurfaceTreatmentRender },
      { label: "类型", prop: "type", cellRenderer: typeRender },
      { label: "德龙承担费用", align: "right", prop: "deograFee", cellRenderer: deograFeeRender },
      { label: "客户承担费用", align: "right", prop: "customerFee", cellRenderer: customerFeeRender },
      { label: "模号", prop: "modelNo", cellRenderer: modelNoRender },
      { label: "重量(g)", align: "right", prop: "weight", cellRenderer: weightRender },
      { label: "T1", prop: "t1", cellRenderer: t1Render },
      { label: "备注", prop: "remark", cellRenderer: remarkRender },
      { label: "模具含税", align: "right", prop: "modelHasTax", cellRenderer: modelHasTaxRender },
      { label: "夹具模含税", align: "right", prop: "clampHasTax", cellRenderer: clampHasTaxRender },
      { label: "供应商", prop: "supplier", cellRenderer: supplierRender }
    ];

    columns3.value = setColumn({ columnData, operationColumn: false });
  };

  const rowClick = (row, column) => {
    currentRow.value = row;
  };

  const rowDbclick = (row) => {
    // console.log(row, " db click.");
  };

  const rowClick2 = (row, column) => {
    currentRow2.value = row;
  };

  const rowDbclick2 = (row) => {
    // console.log(row, " db click2.");
  };

  const rowClick3 = (row, column) => {
    currentRow3.value = row;
  };

  const rowDbclick3 = (row) => {
    // console.log(row, " db click3.");
  };

  const onAdd = () => {
    dataList.value.push({ uuid: uuidv4() });
  };

  const onDelete = () => {
    if (!currentRow.value) return message("请选择一条记录", { type: "error" });
    const findPos = dataList.value.findIndex((item) => item.uuid === currentRow.value.uuid);
    dataList.value.splice(findPos, 1);
    currentRow.value = null;
  };

  const onImport = () => {
    const dom = document.getElementById("importSaleBomPriceInput");
    dom.click();
  };

  const onImport3 = () => {
    const dom = document.getElementById("importSaleModelFeeInput");
    dom.click();
  };

  // 文件改变
  const onChangeFileInput = (value) => {
    const file = value.target.files[0];

    const fileReader = new FileReader();

    fileReader.onload = (ev) => {
      const data = ev.target.result,
        workbook = XLSX.read(data, { type: "binary" }); // 以二进制流方式读取得到整份excel表格对象

      const sheetData = [],
        postData = [];

      // 遍历每张Sheet表读取，并去除垃圾数据，最终得到工资条数据
      for (const sheet in workbook.Sheets) {
        // eslint-disable-next-line no-prototype-builtins
        if (!workbook.Sheets.hasOwnProperty(sheet)) continue;

        const sheet2JSONOpts = {
          /** Default value for null/undefined values */
          defval: "", //给defval赋值为空的字符串,
          raw: false
        };
        const sheetJson = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], sheet2JSONOpts);

        if (sheetJson.length <= 0 || Object.keys(sheetJson[0])[0].trim() == "") {
          ElMessage({ message: "系统检测到Excel中数据有误，禁止导入", type: "error" });
          return;
        }

        const firstKeyName = Object.keys(sheetJson[0])[0];
        const data = [];

        for (let i = 0; i < sheetJson.length; i++) {
          const row = sheetJson[i];
          // eslint-disable-next-line no-prototype-builtins
          if (!row.hasOwnProperty(firstKeyName)) continue;
          data.push(row);
        }
        sheetData.push({ sheetName: sheet, data: data });
      }

      for (const sheet in sheetData) {
        const sheetObj = sheetData[sheet];

        for (let i = 0; i < sheetObj.data.length; i++) {
          let row = sheetObj.data[i];
          const rowWrapper = {};

          const newRow = cloneDeep(row);
          for (const key in newRow) {
            if (/\s/.test(key)) {
              const newKey = key.replaceAll(" ", "");
              newRow[newKey] = newRow[key]?.trim();
            } else {
              newRow[key] = newRow[key]?.trim();
            }
          }
          row = newRow;
          for (const cell in row) {
            rowWrapper[cell] = row[cell];
          }
          postData.push(row);
        }
      }

      handleOpenImportResDialog(postData.filter((item) => item["子项物料编码"]));
    };

    fileReader.readAsBinaryString(file);
  };

  const onChangeModelFileInput = (value) => {
    const file = value.target.files[0];

    const fileReader = new FileReader();

    fileReader.onload = (ev) => {
      const data = ev.target.result,
        workbook = XLSX.read(data, { type: "binary" }); // 以二进制流方式读取得到整份excel表格对象

      const sheetData = [],
        postData = [];
      // 遍历每张Sheet表读取，并去除垃圾数据，最终得到工资条数据
      for (const sheet in workbook.Sheets) {
        // eslint-disable-next-line no-prototype-builtins
        if (!workbook.Sheets.hasOwnProperty(sheet)) continue;

        const sheet2JSONOpts = {
          /** Default value for null/undefined values */
          defval: "", //给defval赋值为空的字符串,
          raw: false
        };
        const sheetJson = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], sheet2JSONOpts);

        if (sheetJson.length <= 0 || Object.keys(sheetJson[0])[0].trim() == "") {
          ElMessage({ message: "系统检测到Excel中数据有误，禁止导入", type: "error" });
          return;
        }

        const firstKeyName = Object.keys(sheetJson[0])[0];
        const data = [];

        for (let i = 0; i < sheetJson.length; i++) {
          const row = sheetJson[i];
          // eslint-disable-next-line no-prototype-builtins
          if (!row.hasOwnProperty(firstKeyName)) continue;
          data.push(row);
        }
        sheetData.push({ sheetName: sheet, data: data });
      }

      for (const sheet in sheetData) {
        const sheetObj = sheetData[sheet];

        for (let i = 0; i < sheetObj.data.length; i++) {
          let row = sheetObj.data[i];
          const rowWrapper = {};

          const newRow = cloneDeep(row);
          for (const key in newRow) {
            if (/\s/.test(key)) {
              const newKey = key.replaceAll(" ", "");
              newRow[newKey] = newRow[key]?.trim();
            } else {
              newRow[key] = newRow[key]?.trim();
            }
          }
          row = newRow;
          for (const cell in row) {
            rowWrapper[cell] = row[cell];
          }
          postData.push(row);
        }
      }
      handleOpenImportModelResDialog(postData);
    };

    fileReader.readAsBinaryString(file);
  };

  // 打开弹窗
  const handleOpenImportResDialog = (data) => {
    const cnKeysMap = {
      BOM层级: "level",
      BOM版本: "bomVersion",
      不含税单价: "noTaxPrice",
      "不含税金额(RMB)": "noTaxMoney",
      单位: "unit",
      备注: "remark",
      子项物料编码: "childMaterialNo",
      数据状态: "dataState",
      标准用量: "standardDosage",
      物料名称: "materialName",
      物料属性: "materialAttr",
      "用量:分子": "numerator",
      "用量:分母": "denominator",
      规格型号: "specifications"
    };
    let resultDataList = [];

    const selectionCallBack = (v) => {
      resultDataList = v;
    };

    const callBack = () => data;

    const options: any[] = tabConfig.props?.optionValues?.value
      ?.find((item) => item.optionCode === "MaterialUnits")
      ?.optionList?.map(({ optionName, optionValue }) => ({ optionName, optionValue }));

    addDialog({
      title: `BOM导入`,
      props: { selectionCallBack, data, callBack },
      width: "1200px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(ImportBOMPriceExcelModal),
      closeCallBack: () => {
        const dom = document.getElementById("importSaleBomPriceInput");
        (dom as any).value = null;
      },
      beforeSure: (done) => {
        if (resultDataList.length) {
          // 转换字段以便于显示列表的数据
          const copyData = cloneDeep(resultDataList);
          const calcArr = copyData.map((item) => {
            const obj: any = {};
            Object.keys(item).forEach((el) => {
              if (el === "单位") {
                obj[cnKeysMap[el]] = options.find((ev) => ev.optionName === item[el])?.optionValue;
              } else {
                obj[cnKeysMap[el]] = item[el];
              }
            });
            return obj;
          });
          dataList.value = calcArr;

          done();
        } else {
          message("至少选择一条记录", { type: "warning" });
        }
      }
    });
  };

  // 打开弹窗
  const handleOpenImportModelResDialog = (data) => {
    const optionsValues = ref([]);
    const cnKeysMap = {
      "3D名称": "3DName",
      零件名称: "partName",
      模穴数量: "noOfModel",
      材料及牌号: "materialAndNo",
      模具表面处理: "modelSurfaceTreatment",
      产品表面处理: "prodSurfaceTreatment",
      类型: "type",
      德龙承担费用: "deograFee",
      客户承担费用: "customerFee",
      模号: "modelNo",
      "重量（g)": "weight",
      T1: "t1",
      备注: "remark",
      模具含税: "modelHasTax",
      夹具模含税: "clampHasTax",
      供应商: "supplier"
    };
    let resultDataList = [];

    const selectionCallBack = (v) => {
      resultDataList = v;
    };

    const callBack = () => data;

    getBOMTableRowSelectOptions({ optioncode: "QuotationFixedCost" }).then((res) => {
      if (res.data) {
        const result = res.data.find((item) => item.optionCode === "QuotationFixedCost")?.optionList || [];
        optionsValues.value = result;
      }
    });

    addDialog({
      title: `模具导入`,
      props: { selectionCallBack, data, callBack },
      width: "1200px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(ImportModelFeeExcelModal),
      closeCallBack: () => {
        const dom = document.getElementById("importSaleModelFeeInput");
        (dom as any).value = null;
      },
      beforeSure: (done) => {
        if (resultDataList.length) {
          // 转换字段以便于显示列表的数据
          const copyData = cloneDeep(resultDataList);
          const calcArr = copyData.map((item) => {
            const obj: any = {};
            Object.keys(item).forEach((el) => {
              if (el === "类型") {
                obj[cnKeysMap[el]] = optionsValues.value.find((ev) => ev.optionName === item[el])?.optionValue ?? "4";
              } else {
                if (cnKeysMap[el]) {
                  obj[cnKeysMap[el]] = item[el];
                }
              }
            });
            return obj;
          });
          dataList3.value = calcArr;
          done();
        } else {
          message("至少选择一条记录", { type: "warning" });
        }
      }
    });
  };

  const onSave = () => {
    // console.log(dataList.value, "save=>>");
  };

  const onAdd2 = () => {
    dataList2.value.push({ uuid: uuidv4() });
  };

  const onDelete2 = () => {
    if (!currentRow2.value) return message("请选择一条记录", { type: "error" });
    const findPos = dataList2.value.findIndex((item) => item.uuid === currentRow2.value.uuid);
    dataList2.value.splice(findPos, 1);
    currentRow2.value = null;
  };

  const onSave2 = () => {
    // console.log(dataList2.value, "save=>>");
  };

  const onAdd3 = () => {
    dataList3.value.push({ uuid: uuidv4() });
  };

  const onDelete3 = () => {
    if (!currentRow3.value) return message("请选择一条记录", { type: "error" });
    const findPos = dataList3.value.findIndex((item) => item.uuid === currentRow3.value.uuid);
    dataList3.value.splice(findPos, 1);
    currentRow3.value = null;
  };

  const onSave3 = () => {
    // console.log(dataList3.value, "save=>>");
  };

  return {
    dataList,
    columns,
    rowClick,
    rowDbclick,
    onAdd,
    onSave,
    onDelete,
    onImport,
    dataList2,
    columns2,
    maxHeight,
    clearDataList2,
    rowClick2,
    rowDbclick2,
    onAdd2,
    onDelete2,
    onSave2,
    onChangeFileInput,
    dataList3,
    columns3,
    rowClick3,
    rowDbclick3,
    onImport3,
    onChangeModelFileInput,
    onAdd3,
    onDelete3,
    onSave3
  };
};
