import {
  PayslipDataItemType,
  cancelImportPayslipDataInfo,
  dispatchPayslipDataInfo,
  docMoneyDataInfo,
  exportPayslipDataList,
  fetchMoneyTemplateList,
  fetchPayslipDataList,
  importPayslip,
  revokeDispatchPayslipDataInfo
} from "@/api/oaManage/financeDept";
import { QueryParamsType, SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { RendererType, exportImgToExcel, getExportConfig, getMenuColumns, setColumn, updateButtonList, usePageSelect } from "@/utils/table";
import { UploadProps, dayjs } from "element-plus";
import { downloadFile, getFileNameOnUrlPath } from "@/utils/common";
import { formConfigs, formRules } from "./config";
import { h, onMounted, reactive, ref } from "vue";
import { message, showMessageBox, wrapFn } from "@/utils/message";
import { useRoute, useRouter } from "vue-router";

import type { ColDef } from "ag-grid-community";
import EditForm from "@/components/EditForm/index.vue";
import { HxUploadProgress } from "@/config/elements";
import { LoadingType } from "@/components/ButtonList/index.vue";
import { PAGE_CONFIG } from "@/config/constant";
import { PaginationProps } from "@pureadmin/table";
import Print from "../print.vue";
import { addDialog } from "@/components/ReDialog";
import { getAgGridColumns } from "@/components/AgGridTable/config";
import { getBOMTableRowSelectOptions } from "@/api/plmManage";
import { getkkViewUrl } from "@/utils/storage";
import { previewDocFile } from "@/api/systemManage";
import { useEleHeight } from "@/hooks";

export const useConfig = () => {
  const isAgTable = ref(true);
  const columnDefs = ref<ColDef[]>([]);
  const columns = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref([]);
  const templateData: any = ref([]);
  const selectStateOptions = ref([]);
  const classOptions = ref([]);
  const loadingStatus = ref<LoadingType>({ loading: false, text: "" });
  const templateConfigData: any = ref([]);
  const selectionList = ref([]);
  const router = useRouter();
  const route = useRoute();
  const rowsData = ref<PayslipDataItemType[]>([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 95);
  const tableRef = ref();
  const rowData = ref<PayslipDataItemType>();
  const columnArr = ref<TableColumnList[][]>([]);
  const baseApi = import.meta.env.VITE_BASE_API;
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const initYearMonth = dayjs().add(-1, "month").format("YYYY-M");
  const sumInfo = reactive({ sumShiFaGongzi: 0, sumYingFaGongzi: 0 });
  const monthArr = new Array(12).fill(0).map((_, i) => ({ label: `${i + 1}月`, value: `${i + 1}` }));

  const formData: any = reactive({
    gzmbNo: "",
    gzmbb: "",
    status: "-1",
    userName: "",
    userCode: "",
    year: dayjs().add(-1, "month").format("YYYY"),
    month: dayjs().add(-1, "month").format("YYYY-MM")?.split("-")[1],
    needGetId: false,
    page: 1,
    limit: PAGE_CONFIG.pageSize
  });

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "姓名", value: "userName" },
    { label: "工号", value: "userCode" },
    { label: "状态", value: "status", children: [] },
    { label: "选择模板", value: "gzmbNo", children: [] },
    { label: "年份", value: "year", type: "year", format: "YYYY" },
    { label: "月份", value: "month", children: monthArr }
  ]);

  const queryParams = reactive<QueryParamsType>({
    gzmbNo: { value: "", valueLabel: "" },
    year: dayjs().add(-1, "month").format("YYYY"),
    month: dayjs().add(-1, "month").format("YYYY-MM")?.split("-")[1]
  });

  const { setSelectCheckbox, setSelectChange, setSelectAllChange } = usePageSelect({ tableRef, dataList, rowsData, uniId: "id" });

  const getColumnConfig = async () => {
    const signRenderer: RendererType = ({ row }) => {
      return (
        <div class="flex-center">
          {row.signatureFilePath ? (
            <el-image
              src={baseApi + row.signatureFilePath}
              preview-src-list={[baseApi + row.signatureFilePath]}
              preview-teleported={true}
              hide-on-click-modal={true}
              z-index={2222}
              fit="cover"
              style="height: 20px; width: 60px; border: 1px solid #eee"
            >
              {{ error: () => <div class="lh-20 ui-ta-c fz-12 pl-2 pr-2"> 暂无签名 </div> }}
            </el-image>
          ) : (
            <div class="lh-20 ui-ta-c fz-12 pl-2 pr-2"> 暂无签名 </div>
          )}
        </div>
      );
    };

    let columnData: TableColumnList[] = [
      { label: "状态", prop: "status", width: 140, align: "center" },
      { label: "工号", prop: "staffId", width: 140 },
      { label: "姓名", prop: "Name", width: 140 },
      { label: "应付工资", prop: "YFGZ", width: 140 },
      { label: "实发工资", prop: "SFGZ", width: 140 },
      { label: "身份证号", prop: "SFZ", width: 160 },
      { label: "签名", prop: "Image2", width: 160, align: "center", cellRenderer: signRenderer }
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns([{ signatureFilePath: signRenderer }]);
    columnArr.value = columnArrs;
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ formData, columnData, operationColumn: false, selectionColumn: { hide: false }, radioColumn: false });
    columnDefs.value = getAgGridColumns({
      columnData,
      formData,
      operationColumn: false,
      selectionColumn: { hide: false },
      radioColumn: false,
      columnsRender: { signatureFilePath: signRenderer }
    });
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
  };

  const getTemplateClassify = async () => {
    const result = await getBOMTableRowSelectOptions({ optioncode: "PayStubsTemplate" });
    const data = result.data[0]?.optionList;
    templateConfigData.value = data;
    classOptions.value = (data as any).map((item) => ({ label: item.optionName, value: item.optionValue, reserve1: item.reserve1 }));
    searchOptions[3].children = classOptions.value;
    // 显示默认查询
    queryParams.gzmbNo.value = data[0].optionValue;
    queryParams.gzmbNo.valueLabel = data[0].optionName;
    formData.gzmbNo = data[0].optionValue;
    formData.gzmbb = data[0].reserve1;
    onSearch();
  };

  onMounted(async () => {
    // 获取模板分类
    getTemplateClassify();
    // 获取工资条下拉状态
    getPayslipSelectOptions();
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
        const data = res.data?.records || [];
        sumInfo.sumShiFaGongzi = res.data?.sumShiFaGongZi;
        sumInfo.sumYingFaGongzi = res.data?.sumYingFaGongZi;
        pagination.total = res.data?.total;
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
          setSelectCheckbox();
        }
      })
      .catch((err) => (loading.value = false));
  };

  const onTagSearch = (values: any) => {
    if (!values.year) return message.warning("年份不能为空");
    Object.assign(formData, values);
    formData.status = values.status || "-1";
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
    const stateName = selectStateOptions.value.find((item) => item.value === formData.status).label;
    const headConfig = getExportConfig(`工资条管理【${formData.month}月 - ${typeName} - ${stateName}】`, columns.value, { ...formData, limit: 200000 });
    exportPayslipDataList(headConfig)
      .then((res) => {
        if (!res.data) return message.error("导出失败");
        const fileName = getFileNameOnUrlPath(res.data);
        downloadFile(res.data, fileName, true);
      })
      .catch(console.log);
  };
  // 导出(签名)
  const onExport2 = () => {
    const typeName = classOptions.value.find((item) => item.value === formData.gzmbNo).label;
    exportImgToExcel(
      { dataList: dataList.value, columns: columns.value, sheetName: "工资条" },
      { imgProp: "signatureFilePath", imgSize: [60, 90], fileName: `【${typeName}】${formData.month}月工资条` }
    );
  };

  const onView = wrapFn(rowData, () => {
    const row = rowData.value;
    router.push({
      path: "/financeDept/payrollMgmt/payslip/detail",
      query: {
        payslipId: row.id,
        gzmbNo: formData.gzmbNo,
        gzmbb: formData.gzmbb,
        gzDate: row.yearMonth || "",
        staffId: row.staffId || ""
      }
    });
  });

  const onDocumentation = wrapFn(selectionList, () => {
    const flag = rowsData.value.every((el) => el.statusValue == "5");
    if (!flag) return message.warning("只有已签名的工资条才能归档");
    const ids = String(rowsData.value.map((item) => item.id));
    showMessageBox(`确认要归档当前所选择的工资条吗?`)
      .then(() => {
        docMoneyDataInfo({ payslipIds: ids, status: "6", gzmbb: formData.gzmbb }).then((res) => {
          if (res.data) {
            message.success("归档成功");
            onSearch();
          }
        });
      })
      .catch(console.log);
  });

  const onRevokeNew = (reqParams: any, cb?) => {
    if (reqParams.dispatchMode === "按年月撤销分发") {
      showMessageBox(`确认按照${reqParams.year}年${reqParams.month}月进行撤销分发?`)
        .then(() => {
          const reqData = {
            gzmbNo: formData.gzmbNo,
            payslipIds: "",
            year: reqParams.year,
            month: reqParams.month
          };
          revokeDispatchPayslipDataInfo({ ...reqData }).then((res: any) => {
            if (res.data) {
              message.success("撤销分发成功");
              if (cb) cb();
              onSearch();
            }
          });
        })
        .catch(console.log);
    } else {
      // 人员
      if (cb) cb();
      onRevokeDispatch();
    }
  };

  const onDispatchNew = (reqParams: any, cb?) => {
    if (reqParams.dispatchMode === "按年月分发") {
      showMessageBox(`确认按照${reqParams.year}年${reqParams.month}月进行发放?`)
        .then(() => {
          const reqData = {
            gzmbNo: formData.gzmbNo,
            payslipIds: "",
            year: reqParams.year,
            month: reqParams.month
          };
          dispatchPayslipDataInfo({ ...reqData }).then((res: any) => {
            if (res.data) {
              message.success("分发成功");
              if (cb) cb();
              onSearch();
            }
          });
        })
        .catch(console.log);
    } else {
      // 人员
      if (cb) cb();
      onDispatch();
    }
  };

  const onDispatch = wrapFn(rowsData, async () => {
    const resultList = rowsData.value.filter((f) => ![1, 2, 4].includes(+f.statusValue));
    if (resultList.length > 0) return message.warning(`只能分发【待分发、分发失败或异常反馈】的工资条`);
    const ids = rowsData.value.map((item) => item.id);

    showMessageBox(`确认要分发当前勾选的【${rowsData.value.length}】笔工资条吗?`)
      .then(() => {
        loading.value = true;
        const reqParams = {
          gzmbNo: formData.gzmbNo,
          payslipIds: String(ids)
        };
        dispatchPayslipDataInfo({ ...reqParams })
          .then((res: any) => {
            if (res.data) {
              message.success("分发成功");
              onSearch();
            }
          })
          .finally(() => (loading.value = false));
      })
      .catch(console.log);
  });

  const onRevokeDispatch = wrapFn(rowsData, async () => {
    const flag = rowsData.value.every((el) => el.statusValue == "3");
    if (!flag) return message.warning(`只能撤销已经分发的工资条`);
    const ids = rowsData.value.map((item) => item.id);

    showMessageBox(`确认要撤销分发当前勾选的【${rowsData.value.length}】笔工资条吗?`)
      .then(() => {
        loading.value = true;
        const reqParams = {
          gzmbNo: formData.gzmbNo,
          payslipIds: String(ids)
        };
        revokeDispatchPayslipDataInfo({ ...reqParams })
          .then((res: any) => {
            if (res.data) {
              message.success("撤销成功");
              onSearch();
            }
          })
          .finally(() => (loading.value = false));
      })
      .catch(console.log);
  });

  const onRevokeImport = wrapFn(rowsData, () => {
    const pasFlag = rowsData.value.every((item) => item.statusValue == "1");
    const posName = templateConfigData.value.find((item) => item.reserve1 === formData.gzmbb)["optionName"];

    if (pasFlag) {
      showMessageBox(`您确定要撤销【${formData.month}】月的【${posName}】工资【${rowsData.value.length}】条数据吗?`)
        .then(() => {
          const ids = rowsData.value.map((item) => item.id);
          const reqParams = {
            gzmbNo: formData.gzmbNo,
            payslipIds: String(ids)
          };

          cancelImportPayslipDataInfo({ ...reqParams }).then((res) => {
            if (res.data) {
              message.success("撤销成功");
              onSearch();
            }
          });
        })
        .catch(console.log);

      return;
    }
    message.warning("当前勾选的工资条必须全部为【待分发】的数据");
  });

  const onTemplateConfig = () => {
    router.push({
      path: "/financeDept/payrollMgmt/payslip/templateConfig",
      query: { gzmbNo: formData.gzmbNo, gzmbb: formData.gzmbb }
    });
  };

  /** 导入工资表 */
  const onUploadPayslip: UploadProps["onChange"] = (uploadFile) => {
    const rawFile = uploadFile.raw;
    const { gzmbb, gzmbNo } = formData;
    const param = { gzDate: formData.year + "-" + formData.month, gzmbb, gzmbNo };
    const fd = new FormData();
    fd.append("file", rawFile);
    fd.append("data", JSON.stringify(param));
    HxUploadProgress({ fd, uploadApi: importPayslip }).then(({ data }) => {
      if (data) {
        if (data.length) {
          message.success(`导入成功,工号【${String(data)}】在人事档案中不存在`);
        } else {
          message.success("导入成功");
        }
        onSearch();
      }
    });
  };

  const onPrint = wrapFn(
    rowsData,
    () => {
      const formRef = ref();
      const payslipIdList = rowsData.value.map((item) => item.id);
      addDialog({
        title: "打印工资条",
        props: {
          payslipIdList: payslipIdList,
          gzmbNo: formData.gzmbNo,
          gzmbb: formData.gzmbb,
          year: formData.year,
          month: formData.month,
          gzDate: rowsData.value[0]?.yearMonth
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
    },
    "请勾选打印项目"
  );

  const onDispatch2 = () => {
    const formRef = ref();
    const _formData: any = reactive({ dispatchMode: [], dispatchYearMonth: initYearMonth });

    const modeOpts = [
      { label: "按勾选人员分发", value: 1 },
      { label: "按年月分发", value: 2 }
    ];

    addDialog({
      title: `工资分发`,
      props: {
        formInline: _formData,
        formRules,
        formProps: { labelWidth: 80 },
        formConfigs: formConfigs({ _formData, modeOpts })
      },
      width: "400px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.validate(async (valid) => {
          if (valid) {
            const reqParams = {
              dispatchMode: _formData.dispatchMode.at(-1),
              year: _formData.dispatchYearMonth?.split("-")[0],
              month: _formData.dispatchYearMonth?.split("-")[1]
            };

            onDispatchNew(reqParams, done);
          }
        });
      }
    });
  };

  const onRevokeImport2 = () => {
    const formRef = ref();
    const _formData: any = reactive({ dispatchMode: [], dispatchYearMonth: initYearMonth });

    const modeOpts = [
      { label: "按勾选人员撤销导入", value: 1 },
      { label: "按年月撤销导入", value: 2 }
    ];

    addDialog({
      title: `撤销导入`,
      props: {
        formInline: _formData,
        formRules,
        formProps: { labelWidth: 80 },
        formConfigs: formConfigs({ _formData, modeOpts })
      },
      width: "400px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.validate(async (valid) => {
          if (valid) {
            const reqParams = {
              dispatchMode: _formData.dispatchMode.at(-1),
              year: _formData.dispatchYearMonth?.split("-")[0],
              month: _formData.dispatchYearMonth?.split("-")[1]
            };

            onRevokeImportNew(reqParams, done);
          }
        });
      }
    });
  };

  const onRevokeImportNew = (reqParams: any, cb?) => {
    if (reqParams.dispatchMode === "按年月撤销导入") {
      showMessageBox(`确认按照${reqParams.year}年${reqParams.month}月进行撤销导入?`)
        .then(() => {
          const reqData = {
            gzmbNo: formData.gzmbNo,
            payslipIds: "",
            year: reqParams.year,
            month: reqParams.month
          };
          cancelImportPayslipDataInfo({ ...reqData }).then((res: any) => {
            if (res.data) {
              message.success("撤销导入成功");
              if (cb) cb();
              onSearch();
            }
          });
        })
        .catch(console.log);
    } else {
      // 人员
      if (cb) cb();
      onRevokeImport();
    }
  };

  const onRevokeDispatch2 = () => {
    const formRef = ref();
    const _formData: any = reactive({ dispatchMode: [], dispatchYearMonth: initYearMonth });

    const modeOpts = [
      { label: "按勾选人员撤销分发", value: 1 },
      { label: "按年月撤销分发", value: 2 }
    ];

    addDialog({
      title: `撤销分发`,
      props: {
        formInline: _formData,
        formRules,
        formProps: { labelWidth: 80 },
        formConfigs: formConfigs({ _formData, modeOpts })
      },
      width: "400px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.validate(async (valid) => {
          if (valid) {
            const reqParams = {
              dispatchMode: _formData.dispatchMode.at(-1),
              year: _formData.dispatchYearMonth?.split("-")[0],
              month: _formData.dispatchYearMonth?.split("-")[1]
            };

            onRevokeNew(reqParams, done);
          }
        });
      }
    });
  };

  const onDocumentation2 = () => {
    const formRef = ref();
    const _formData: any = reactive({ dispatchMode: [], dispatchYearMonth: initYearMonth });

    const modeOpts = [
      { label: "按勾选人员归档", value: 1 },
      { label: "按年月归档", value: 2 }
    ];

    addDialog({
      title: `归档`,
      props: {
        formInline: _formData,
        formRules,
        formProps: { labelWidth: 80 },
        formConfigs: formConfigs({ _formData, modeOpts })
      },
      width: "400px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.validate(async (valid) => {
          if (valid) {
            const reqParams = {
              dispatchMode: _formData.dispatchMode.at(-1),
              year: _formData.dispatchYearMonth?.split("-")[0],
              month: _formData.dispatchYearMonth?.split("-")[1]
            };

            onDocumentationNew(reqParams, done);
          }
        });
      }
    });
  };

  const onDocumentationNew = (reqParams: any, cb?) => {
    if (reqParams.dispatchMode === "按年月归档") {
      showMessageBox(`确认按照${reqParams.year}年${reqParams.month}月进行归档?`)
        .then(() => {
          const reqData = {
            gzmbNo: formData.gzmbNo,
            payslipIds: "",
            year: reqParams.year,
            month: reqParams.month
          };

          docMoneyDataInfo({ ...reqData, status: "6" }).then((res) => {
            if (res.data) {
              message.success("归档成功");
              if (cb) cb();
              onSearch();
            }
          });
        })
        .catch(console.log);
    } else {
      // 人员
      if (cb) cb();
      onDocumentation();
    }
  };

  const onPrint2 = () => {
    const formRef = ref();
    const _formData: any = reactive({ dispatchMode: [], dispatchYearMonth: initYearMonth });

    const modeOpts = [
      { label: "按勾选人员打印", value: 1 },
      { label: "按年月打印", value: 2 }
    ];

    addDialog({
      title: `打印`,
      props: {
        formInline: _formData,
        formRules,
        formProps: { labelWidth: 80 },
        formConfigs: formConfigs({ _formData, modeOpts })
      },
      width: "400px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done) => {
        const FormRef = formRef.value.getRef();
        FormRef.validate(async (valid) => {
          if (valid) {
            const reqParams = {
              dispatchMode: _formData.dispatchMode.at(-1),
              year: _formData.dispatchYearMonth?.split("-")[0],
              month: _formData.dispatchYearMonth?.split("-")[1]
            };

            onPrintNew(reqParams, done);
          }
        });
      }
    });
  };

  const onPrintNew = (reqParams: any, cb?) => {
    if (reqParams.dispatchMode === "按年月打印") {
      showMessageBox(`确认按照${reqParams.year}年${reqParams.month}月进行打印?`)
        .then(() => {
          const formRef = ref();
          addDialog({
            title: "打印工资条",
            props: {
              gzmbNo: formData.gzmbNo,
              year: reqParams.year,
              month: reqParams.month
            },
            width: "900px",
            class: "sop-print",
            draggable: true,
            fullscreenIcon: true,
            closeOnClickModal: false,
            okButtonText: "打印",
            contentRenderer: () => h(Print, { ref: formRef }),
            beforeSure: () => {
              if (cb) cb();
              formRef.value.onPrint();
            }
          });
        })
        .catch(console.log);
    } else {
      // 人员
      if (cb) cb();
      onPrint();
    }
  };

  const onViewDoc = () => {
    previewDocFile({ menuId: route.query.menuId }).then((res: any) => {
      if (res.data) {
        window.open(getkkViewUrl(res.data.filePath));
      }
    });
  };

  const onRowClick = (row: PayslipDataItemType) => {
    rowData.value = row;
  };

  function onSelect(rows, row) {
    setSelectChange({ rows, row });
  }

  function onSelectAll(rows: any[]) {
    setSelectAllChange(rows);
  }

  // 分页相关
  function onSizeChange(val: number) {
    formData.limit = val;
    onSearch();
  }

  function onCurrentChange(val: number) {
    formData.page = val;
    onSearch();
  }
  function onSwitchTable() {
    isAgTable.value = !isAgTable.value;
    rowData.value = undefined;
    rowsData.value = [];
  }

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onTemplateConfig, type: "warning", text: "模板配置", isDropDown: true },
    { clickHandler: onRevokeImport2, type: "info", text: "撤销导入", isDropDown: true },
    { clickHandler: onDispatch2, type: "primary", text: "工资分发", isDropDown: true },
    { clickHandler: onRevokeDispatch2, type: "primary", text: "撤销分发", isDropDown: true },
    { clickHandler: onDocumentation2, type: "default", text: "归档", isDropDown: true },
    { clickHandler: onView, type: "info", text: "查看工资条", isDropDown: true },
    { clickHandler: onExport, type: "default", text: "导出", isDropDown: true },
    { clickHandler: onExport2, type: "default", text: "导出签名", isDropDown: true },
    { clickHandler: onPrint2, type: "primary", text: "打印工资条", isDropDown: true },
    { clickHandler: onViewDoc, type: "primary", text: "帮助文档", isDropDown: true },
    {
      type: "primary",
      text: "导入",
      disabled: false,
      isDropDown: true,
      uploadProp: { action: "#", accept: ".xlsx, .xls", autoUpload: false, onChange: onUploadPayslip }
    }
  ]);

  return {
    columnDefs,
    isAgTable,
    tableRef,
    columns,
    dataList,
    loading,
    maxHeight,
    sumInfo,
    queryParams,
    searchOptions,
    loadingStatus,
    buttonList,
    pagination,
    onView,
    onSelect,
    onRefresh,
    onRowClick,
    onSelectAll,
    onTagSearch,
    onSizeChange,
    onCurrentChange,
    onSwitchTable
  };
};
