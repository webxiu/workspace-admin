import * as XLSX from "xlsx";

import { ElMessage, ElMessageBox, FormRules, dayjs } from "element-plus";
import {
  PayslipDataItemType,
  cancelImportPayslipDataInfo,
  dispatchPayslipDataInfo,
  docMoneyDataInfo,
  exportPayslipDataList,
  fetchMoneyTemplateList,
  fetchPayslipDataList,
  getMoneySaltDataInfo,
  getStateOptionList,
  importPayslipDataInfo
} from "@/api/oaManage/financeDept";
import { QueryParamsType, SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { RendererType, exportImgToExcel, getExportConfig, getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { downloadFile, getFileNameOnUrlPath } from "@/utils/common";
import { h, onMounted, reactive, ref } from "vue";
import { message, showMessageBox, wrapFn } from "@/utils/message";

import { LoadingType } from "@/components/ButtonList/index.vue";
import Print from "../print.vue";
import { addDialog } from "@/components/ReDialog";
import { cloneDeep } from "@pureadmin/utils";
import { getBOMTableRowSelectOptions } from "@/api/plmManage";
import { getUserInfo } from "@/utils/storage";
import { useEleHeight } from "@/hooks";
import { useRouter } from "vue-router";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const columnsTemp = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref([]);
  const templateData: any = ref([]);
  const selectStateOptions = ref([]);
  const classOptions = ref([]);
  const loadingStatus = ref<LoadingType>({ loading: false, text: "" });
  const templateConfigData: any = ref([]);
  const selectionList = ref([]);
  const router = useRouter();
  const saltInfo: any = ref({});
  const rowsData = ref<PayslipDataItemType[]>([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49);
  const tableRef = ref();
  const lastMonth = dayjs().add(-1, "month").startOf("month").format("YYYY-MM");
  const rowData = ref();
  const columnArr = ref<TableColumnList[][]>([]);

  const formRules = reactive<FormRules>({
    categoryName: [{ required: true, message: "产品分类名称为必填项", trigger: "submit" }],
    categoryNo: [{ required: true, message: "产品分类编码为必填项", trigger: "submit" }]
  });

  const formData: any = reactive({
    gzmbNo: "",
    gzmbb: "",
    gzDate: lastMonth,
    gzStatus: "-1",
    userName: "",
    userCode: "",
    needGetId: false
  });

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "姓名", value: "userName" },
    { label: "工号", value: "userCode" },
    { label: "状态", value: "gzStatus", children: [] },
    { label: "选择模板", value: "gzmbNo", children: [] },
    { label: "日期", value: "gzDate", type: "month", format: "YYYY-MM" }
  ]);

  const queryParams = reactive<QueryParamsType>({
    gzmbNo: { value: "", valueLabel: "" },
    gzDate: lastMonth
  });
  const showSign = ref(false);

  const getColumnConfig = async () => {
    const statusRenderer: RendererType = ({ row }) => (
      <el-tag effect="dark" color={row.Color} style="border-color: transparent">
        {row.Status}
      </el-tag>
    );
    const signRenderer: RendererType = ({ row }) => {
      const url = [row.Image1, row.Image2].join(",");
      return showSign.value ? (
        <el-image
          src={url}
          preview-src-list={[url]}
          preview-teleported={true}
          hide-on-click-modal={true}
          z-index={2222}
          fit="cover"
          style="height: 80px; border: 1px solid #ccc"
        >
          {{ error: () => <div class="lh-80 ui-w-100 ui-ta-c fz-12 pl-2 pr-2"> 暂无签名 </div> }}
        </el-image>
      ) : null;
    };

    let columnData: TableColumnList[] = [
      { label: "状态", prop: "Status", width: 140, align: "center", cellRenderer: statusRenderer },
      { label: "工号", prop: "GH", width: 140 },
      { label: "姓名", prop: "Name", width: 140 },
      { label: "应付工资", prop: "YFGZ", width: 140 },
      { label: "实发工资", prop: "SFGZ", width: 140 },
      { label: "身份证号", prop: "SFZ", width: 160 },
      { label: "签名", prop: "Image2", width: 160, align: "center", cellRenderer: signRenderer }
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns([{ Status: statusRenderer, Image2: signRenderer }]);
    columnArr.value = columnArrs;
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ formData, columnData, operationColumn: false, selectionColumn: { hide: false }, radioColumn: false });
  };

  const getPayslipSelectOptions = () => {
    getBOMTableRowSelectOptions({ optioncode: "PayStubsStatus" }).then((res) => {
      if (res.data) {
        const arr = res.data[0]?.optionList?.map((item) => ({ label: item.optionName, value: item.optionValue }));
        const resolveList = [{ label: "全部", value: "-1" }, ...arr];
        selectStateOptions.value = resolveList;
        searchOptions[2].children = resolveList;
      }
    });
  };

  // 获取工资条表格配置模板
  const getPayslipTemplate = async () => {
    const { data = [] } = await fetchMoneyTemplateList({ templateNo: formData.gzmbNo, templateType: "import" });
    templateData.value = data;

    // 表格配置列已改为通用接口获取, 不在使用模板列
    // const columnsResList = (data as any)
    //   .map((item) => ({ label: item.fieldTitle, prop: item.fieldName, slot: item.fieldName === "Status" ? "status" : undefined }))
    //   .filter((item) => item.prop !== "OrderNo");

    // const cols = JSON.parse(JSON.stringify(columnsResList)) || [];
    // const filterCols = cols?.filter((item) => {
    //   return ["Status", "Name", "GH", "YFGZ", "SFGZ", "SFZ"].includes(item.prop);
    // });
    // columns.value = setColumn({ columnData: filterCols, operationColumn: false, selectionColumn: { hide: false }, radioColumn: false });
  };

  const getTemplateClassify = async () => {
    const result = await getBOMTableRowSelectOptions({ optioncode: "PayStubsTemplate" });
    const data = result.data[0]?.optionList;
    templateConfigData.value = data;
    classOptions.value = (data as any).map((item) => ({ label: item.optionName, value: item.optionValue, reserve1: item.reserve1 }));
    searchOptions[3].children = classOptions.value;
    formData.gzmbNo = data[0].optionValue;
    formData.gzmbb = data[0].reserve1;
    // 显示默认查询
    queryParams.gzmbNo.value = data[0].optionValue;
    queryParams.gzmbNo.valueLabel = data[0].optionName;
  };

  onMounted(async () => {
    // 获取模板分类
    await getTemplateClassify();
    // 获取工资条下拉状态
    await getPayslipSelectOptions();
    onSearch();
  });

  const onRefresh = () => {
    onSearch();
  };

  const onSearch = () => {
    getColumnConfig();
    getPayslipTemplate(); // 已改为表格配置接口获取
    loading.value = true;
    fetchPayslipDataList(formData)
      .then((res: any) => {
        const data = res.data;
        loading.value = false;
        if (data) {
          const filterArr = data.map((item) => {
            const keys = Object.keys(item) || [];
            if (item.JBGZ?.includes(",")) item.JBGZ = item.JBGZ?.replace(",", "");
            keys.forEach((el) => {
              if (item[el] === "-") item[el] = "0";
              if ((item[el] + "").includes(",")) item[el] = (item[el] + "")?.replace(",", "");
            });

            return item;
          });
          dataList.value = filterArr;
        }
      })
      .catch((err) => (loading.value = false));
  };

  const handleTagSearch = (values: any) => {
    formData.gzStatus = values.gzStatus || "-1";
    formData.userCode = values.userCode || "";
    formData.userName = values.userName || "";
    formData.gzDate = values.gzDate;
    if (values.gzmbNo) {
      formData.gzmbNo = values.gzmbNo;
      formData.gzmbb = templateConfigData.value.find((item) => item.optionValue === formData.gzmbNo)?.reserve1;
    }
    // 切换职员和员工修改表格列配置
    const columnData = values.gzmbNo === "GZMB02" ? columnArr.value[0] : columnArr.value[1];
    columns.value = setColumn({ formData, columnData, operationColumn: false, selectionColumn: { hide: false }, radioColumn: false });
    onSearch();
  };

  // 导出
  const onExport = () => {
    const typeName = classOptions.value.find((item) => item.value === formData.gzmbNo).label;
    if (showSign.value) {
      exportImgToExcel(
        { dataList: dataList.value, columns: columns.value, sheetName: "工资条" },
        { imgProp: "Image2", imgSize: [60, 90], fileName: `【${typeName}】${formData.gzDate}月工资条` }
      );
      return;
    }

    const stateName = selectStateOptions.value.find((item) => item.value === formData.gzStatus).label;
    const headConfig = getExportConfig(`工资条管理【${formData.gzDate}月 - ${typeName} - ${stateName}】`, columns.value, { ...formData, limit: 200000 });
    exportPayslipDataList(headConfig)
      .then((res) => {
        if (!res.data) return message("导出失败", { type: "error" });
        const fileName = getFileNameOnUrlPath(res.data);
        downloadFile(res.data, fileName, true);
      })
      .catch(console.log);
  };

  const onShowSign = () => {
    getColumnConfig();
  };

  const onView = (row) => {
    const rowData = row ?? selectionList.value[0];
    if (!rowData) return message("请选择记录", { type: "error" });
    router.push(
      `/oa/financeDept/payrollMgmt/payslip/detail?payslipId=${rowData.Id}&gzmbNo=${formData.gzmbNo}&gzmbb=${formData.gzmbb}&gzDate=${formData.gzDate}`
    );
  };

  const onDocumentation = wrapFn(selectionList, () => {
    if (selectionList.value[0].statusValue !== "5") {
      ElMessage({ message: "只有已签名的工资条才能归档", type: "warning" });
      return;
    }
    const ids = String(rowsData.value.map((item) => item.Id));

    ElMessageBox.confirm(`确认要归档当前所选择的工资条吗?`, "系统提示", {
      type: "warning",
      draggable: true,
      cancelButtonText: "取消",
      confirmButtonText: "确定",
      dangerouslyUseHTMLString: true
    })
      .then(() => {
        loading.value = true;
        docMoneyDataInfo({ payslipIds: ids, gzStatus: "6", gzmbb: formData.gzmbb }).then((res) => {
          if (res.data) {
            ElMessage({ message: `归档成功`, type: "success" });
            onSearch();
          }
        });
      })
      .catch(() => {})
      .finally(() => (loading.value = false));
  });

  const onDispatch = wrapFn(selectionList, async () => {
    if (!/(1|2|4)/.test(selectionList.value[0].statusValue)) {
      ElMessage({ message: "只能分发【待分发、分发失败或异常反馈】的工资条", type: "warning" });
      return;
    }
    const ids = rowsData.value.map((item) => item.Id);
    const codes = rowsData.value.map((item) => item.GH);
    const { orgId, userCode } = getUserInfo();

    getMoneySaltDataInfo({
      gzDate: formData.gzDate,
      gzStatus: formData.gzStatus,
      gzmbb: formData.gzmbb,
      payslipIds: String(ids),
      userCodes: String(codes)
    }).then((res: any) => {
      if (res.data) {
        saltInfo.value = res.data;
      }
    });

    ElMessageBox.confirm(`确认要分发当前勾选的【${rowsData.value.length}】笔工资条吗?`, "系统提示", {
      type: "warning",
      draggable: true,
      cancelButtonText: "取消",
      confirmButtonText: "确定",
      dangerouslyUseHTMLString: true
    })
      .then(() => {
        loading.value = true;
        const reqParams = {
          mbNo: formData.gzmbNo,
          mbb: formData.gzmbb,
          gzDate: formData.gzDate,
          salt: saltInfo.value.salt,
          keyIn: userCode,
          userCode: String(codes),
          payslipIds: String(ids),
          orgId
        };
        dispatchPayslipDataInfo({ ...reqParams }).then((res: any) => {
          if (res.data) {
            ElMessage({ message: `成功分发：${res.data?.success}个，分发失败：${res.data?.fail}个`, type: "success" });
            onSearch();
          }
        });
      })
      .catch(() => {})
      .finally(() => (loading.value = false));
  });

  const onRevokeImport = wrapFn(rowsData, () => {
    const pasFlag = rowsData.value.every((item) => item.statusValue == "1");
    const posName = templateConfigData.value.find((item) => item.reserve1 === formData.gzmbb)["optionName"];

    if (pasFlag) {
      ElMessageBox.confirm(`您确定要撤销【${formData.gzDate}】月的【${posName}】工资【${rowsData.value.length}】条数据吗?`, "系统提示", {
        type: "warning",
        draggable: true,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          const ids = rowsData.value.map((item) => item.Id);
          const codes = rowsData.value.map((item) => item.GH);
          const reqParams = {
            gzmbb: formData.gzmbb,
            gzDate: formData.gzDate,
            gzStatus: "1",
            payslipIds: String(ids),
            userCodes: String(codes)
          };
          cancelImportPayslipDataInfo({ ...reqParams }).then((res) => {
            if (res.data) {
              ElMessage({ message: "撤销成功", type: "success" });
              onSearch();
            }
          });
        })
        .catch(() => {});

      return;
    }
    ElMessage({ message: "当前勾选的工资条必须全部为【待分发】的数据", type: "warning" });
  });

  const onImport = () => {
    const posName = templateConfigData.value.find((item) => item.reserve1 === formData.gzmbb)["optionName"];
    ElMessageBox.confirm(`您确定要导入【${formData.gzDate}】月的【${posName}】工资数据吗?`, "系统提示", {
      type: "warning",
      draggable: true,
      cancelButtonText: "取消",
      confirmButtonText: "确定",
      dangerouslyUseHTMLString: true
    })
      .then(() => {
        //
        const dom = document.getElementById("imporMoneyImportInput");
        dom.click();
      })
      .catch(() => {});
  };

  const onTemplateConfig = () => {
    router.push(`/oa/financeDept/payrollMgmt/payslip/templateConfig?gzmbNo=${formData.gzmbNo}&gzmbb=${formData.gzmbb}`);
  };

  const handleSelectionChange = (val) => {
    rowsData.value = val;
    if (val.length > 1) {
      selectionList.value = [val[val.length - 1]];
    } else {
      selectionList.value = val;
    }
  };

  const onRowClick = (row) => {
    rowData.value = row;
    tableRef.value?.getTableRef()?.toggleRowSelection(row);
  };

  const checkExcelRepeatColumnFunc = (row) => {
    const cellValueArray = [];
    for (const cell in row) {
      cellValueArray.push(cell.trim());
    }

    let isRepeat = false,
      columnName = "";
    for (let i = 0; i < cellValueArray.length; i++) {
      if (cellValueArray.indexOf(cellValueArray[i]) != i) {
        isRepeat = true;
        columnName = cellValueArray[i];
        break;
      }
    }

    return { isRepeat: isRepeat, columnName: columnName };
  };

  // 检查Excel中的列是否与工资条模板匹配
  const checkExcelColumnIsMatchTemplateFunc = (row) => {
    const noExistArray = [],
      existColArray = [];
    for (const cell in row) {
      let isExits = false;
      for (let i = 0; i < templateData.value.length; i++) {
        if (cell.trim() == templateData.value[i].fieldTitle.trim()) {
          isExits = true;
          existColArray.push({
            fieldName: templateData.value[i].fieldName,
            fieldTitle: templateData.value[i].fieldTitle,
            excelFieldName: cell.replace(/\s/g, "")
          });
          break;
        }
      }

      if (!isExits) {
        noExistArray.push(cell);
      }
    }

    return { noExistColArray: noExistArray, existColArray: existColArray };
  };

  // 验证Excel是否存在特定的某些列
  const checkExcelColumnExistSpecialColumnFunc = (row) => {
    const excelColumn = [],
      specialColumn = [],
      result = [];
    for (const cell in row) {
      excelColumn.push(cell.trim());
    }

    for (let i = 0; i < templateData.value.length; i++) {
      if (templateData.value[i].importCheck == "是") {
        specialColumn.push(templateData.value[i].fieldTitle.trim());
      }
    }

    for (let i = 0; i < specialColumn.length; i++) {
      if (excelColumn.indexOf(specialColumn[i]) == -1) {
        result.push(specialColumn[i]);
      }
    }

    return result;
  };

  const onChangeFileInput = (value) => {
    const file = value.target.files[0];

    const dom = document.getElementById("imporMoneyImportInput");
    const fileReader = new FileReader();

    fileReader.onload = (ev) => {
      const data = ev.target.result,
        workbook = XLSX.read(data, { type: "binary" }); // 以二进制流方式读取得到整份excel表格对象

      if (JSON.stringify(workbook.Sheets) === "{}") {
        ElMessage({ message: "系统检测到Excel中没有Sheet页，禁止导入", type: "error" });
        (dom as any).value = null;
        return;
      }

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
          (dom as any).value = null;
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

        if (data.length <= 0) {
          ElMessage({ message: `系统检测到Excel中Sheet页【" + ${sheet} + "】，没有工资条数据，禁止导入`, type: "error" });
          (dom as any).value = null;
          return;
        }

        sheetData.push({ sheetName: sheet, data: data });
      }
      const { userCode } = getUserInfo();
      const posName = templateConfigData.value.find((item) => item.reserve1 === formData.gzmbb)["optionName"];

      //提取可以上传服务器的工资数据
      for (const sheet in sheetData) {
        const sheetObj = sheetData[sheet];
        let existColArray = [];

        for (let i = 0; i < sheetObj.data.length; i++) {
          let row = sheetObj.data[i];
          const rowWrapper = {};
          const rowObj = {
            SheetName: sheetObj.sheetName,
            KeyIn: userCode,
            YearMonth: formData.gzDate
          };

          if (i == 0) {
            const checkRes = checkExcelRepeatColumnFunc(row);
            const checkRes1 = checkExcelColumnIsMatchTemplateFunc(row);
            const checkRes2 = checkExcelColumnExistSpecialColumnFunc(row);

            existColArray = checkRes1.existColArray;

            if (checkRes2.length > 0) {
              const msg = "系统检测到Excel中Sheet页【" + sheetObj.sheetName + "】,没有特定【" + checkRes2.join(" | ") + "】列，禁止导入！";
              ElMessage({ message: msg, type: "error" });
              (dom as any).value = null;

              return;
            }

            if (checkRes.isRepeat) {
              const msg = "系统检测到Excel中Sheet页【" + sheetObj.sheetName + "】,有重复列【" + checkRes.columnName + "】，禁止导入！";
              ElMessage({ message: msg, type: "error" });
              (dom as any).value = null;

              return;
            }

            if (checkRes1.noExistColArray.length > 0) {
              const msg =
                "系统检测到Excel中Sheet页【" +
                sheetObj.sheetName +
                "】,与【" +
                posName +
                "工资条模板】不匹配【" +
                checkRes1.noExistColArray.join(" | ") +
                "】，禁止导入！";
              ElMessage({ message: msg, type: "error" });
              (dom as any).value = null;
              return;
            }
            // continue;
          }

          //提取工资条数据
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

          for (const cell in existColArray) {
            rowObj[existColArray[cell].fieldName] = rowWrapper[existColArray[cell].excelFieldName] ?? "";
          }

          postData.push(rowObj);
        }
      }

      const importData = {
        yearMonth: formData.gzDate,
        gzmbb: formData.gzmbb,
        gzmbNo: formData.gzmbNo,
        data: JSON.stringify(postData.filter((item) => item.GH))
      };
      loading.value = true;

      importPayslipDataInfo(importData)
        .then((res: any) => {
          let msg = `导入成功！本次导入共：${postData.filter((item) => item.GH).length}条数据，成功导入：${
            postData.filter((item) => item.GH).length - res.data.length
          }条数据；`;
          if (postData.filter((item) => item.GH).length < res.data.length) {
            msg = msg + "失败：" + res.data.length + " 条数据；人员" + res.data.join("|") + " 在系统中不存在，无法导入，请核对数据！";
          }
          if (res.data) {
            ElMessage({ message: msg, type: "success" });
            onSearch();
          }
        })
        .finally(() => {
          loading.value = false;
          (dom as any).value = null;
        });
    };

    fileReader.readAsBinaryString(file);
  };

  function onPrint() {
    if (!rowsData.value.length) return message("请勾选打印项目", { type: "error" });
    const formRef = ref();
    const payslipIdList = rowsData.value.map((item) => item.Id);

    addDialog({
      title: "打印工资条",
      props: {
        payslipIdList: payslipIdList,
        gzmbNo: formData.gzmbNo,
        gzmbb: formData.gzmbb,
        gzDate: formData.gzDate
      },
      width: "900px",
      class: "sop-print",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      okButtonText: "打印",
      contentRenderer: () => h(Print, { ref: formRef }),
      beforeSure: () => formRef.value.onPrint()
    });
  }

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onTemplateConfig, type: "warning", text: "模板配置", isDropDown: true },
    { clickHandler: onImport, type: "primary", text: "导入", isDropDown: true },
    { clickHandler: onRevokeImport, type: "info", text: "撤销导入", isDropDown: true },
    { clickHandler: onDispatch, type: "primary", text: "工资分发", isDropDown: true },
    { clickHandler: onDocumentation, type: "default", text: "归档", isDropDown: true },
    { clickHandler: onView, type: "info", text: "查看工资条", isDropDown: true },
    { clickHandler: onExport, type: "default", text: "导出", isDropDown: true },
    { clickHandler: onPrint, type: "primary", text: "打印工资条", isDropDown: true }
  ]);

  return {
    tableRef,
    columns,
    dataList,
    loading,
    showSign,
    maxHeight,
    searchOptions,
    queryParams,
    loadingStatus,
    buttonList,
    onView,
    onShowSign,
    onRefresh,
    onRowClick,
    handleTagSearch,
    onChangeFileInput,
    handleSelectionChange
  };
};
