import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { h, onMounted, reactive, ref } from "vue";
import { type PaginationProps } from "@pureadmin/table";

import { message } from "@/utils/message";
import { useEleHeight } from "@/hooks";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import ImportQCCCExcelModal from "../components/importQCCCExcelModal.vue";
import * as XLSX from "xlsx";
import { cloneDeep } from "@pureadmin/utils";
import dayjs from "dayjs";
import { addDialog } from "@/components/ReDialog";
import { formConfigs, formRules } from "./config";
import EditForm from "@/components/EditForm/index.vue";
import { useAppStoreHook } from "@/store/modules/app";
import { importCustomerComplaintList, selectCustomerComplaintList } from "@/api/oaManage/productMkCenter";
import { PAGE_CONFIG } from "@/config/constant";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const dataList = ref<any[]>([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 95);
  const currentRow = ref();
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });

  const formData: any = reactive({
    page: 1,
    limit: PAGE_CONFIG.pageSize
    // date: ""
  });

  const searchOptions: SearchOptionType[] = [
    { label: "客户型号", value: "customerModel" }
    // { label: "日期范围", value: "date", type: "daterange", format: "YYYY-MM-DD" }
  ];

  onMounted(() => {
    getColumnConfig();
    getTableList();
  });

  const readXlsx = (file: File, sheetConfig = {}) => {
    return new Promise<Record<string, any[]>>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array", cellDates: true });
        const allSheetsData: Record<string, any[]> = workbook.SheetNames.reduce((current, sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
          const headers = jsonData[0] as string[]; // 表头行
          // 复杂表格数据格式不统一, 数据返回格式有差异
          if (Array.isArray(headers)) {
            const dataRows = jsonData.slice(1); // 数据行
            const formattedData = dataRows.map((row) => {
              return headers.reduce((acc, header, index) => {
                acc[header] = row[index];
                return acc;
              }, {});
            });
            current[sheetName] = formattedData;
          } else {
            current[sheetName] = jsonData;
          }
          return current;
        }, {});
        resolve(allSheetsData);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "日期", prop: "date" },
      { label: "客户名称", prop: "customerName" },
      { label: "德龙产品型号", prop: "deograProductName" },
      { label: "客户型号", prop: "customerModel" },
      { label: "流水码", prop: "waterCode" },
      { label: "生产日期", prop: "productDate" },
      { label: "不良数量", prop: "badCount" },
      { label: "问题类别", prop: "questionClass" },
      { label: "问题描述", prop: "questionDes" },
      { label: "缺陷图片", prop: "badPhoto" },
      { label: "产生原因", prop: "appearReason" },
      { label: "分析图片", prop: "thinkPhoto" },
      { label: "临时改善", prop: "tempFinish" },
      { label: "长期改善措施", prop: "finishWay" },
      { label: "改善效果", prop: "finishRes" },
      { label: "改善后首次流水号", prop: "firstWaterCode", width: 200 },
      { label: "8D报告连接", prop: "nightLink" },
      { label: "状态", prop: "status" },
      { label: "确认人", prop: "confirmUserName" },
      { label: "备注", prop: "remark" }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [menuCols] = columnArrs;

    if (menuCols?.length) {
      columnData = menuCols;
    }

    updateButtonList(buttonList, buttonArrs[0]);

    columns.value = setColumn({
      columnData,
      operationColumn: false
    });

    return columnData;
  };

  const getTableList = () => {
    // dataList.value = [];
    selectCustomerComplaintList(formData).then((res: any) => {
      if (res.data) {
        const { total, records } = res.data;
        pagination.total = total;
        dataList.value = records;
      }
    });
  };

  const onExport = async () => {
    message("功能未开发", { type: "warning" });
  };

  const onImportAction = () => {
    console.log("导入");
    const dom = document.getElementById("importQCCCInput");
    dom.click();
  };

  const onEditAction = () => {
    if (!currentRow.value) return message("请选择一条记录", { type: "warning" });

    const _formData = reactive({});
    const formRef = ref();

    addDialog({
      title: `客诉台账修改`,
      props: { formInline: _formData, formRules: formRules, formConfigs: formConfigs(), formProps: { size: "small", labelWidth: "90px" } },
      width: "1200px",
      class: "qc-cc-modal",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done) => {
        console.log(_formData, "_formData===");
        done();
      }
    });
  };

  const onDelAction = () => {
    // if (!currentRow.value) return message("请选择一条记录", { type: "warning" });
    message("功能未开发", { type: "warning" });
  };

  const buttonList = ref<ButtonItemType[]>([
    {
      clickHandler: onImportAction,
      type: "primary",
      text: "导入",
      isDropDown: false
    },
    // {
    //   clickHandler: onEditAction,
    //   type: "warning",
    //   text: "修改",
    //   isDropDown: false
    // },
    // {
    //   clickHandler: onDelAction,
    //   type: "danger",
    //   text: "删除",
    //   isDropDown: false
    // },
    {
      clickHandler: onExport,
      type: "default",
      text: "导出",
      isDropDown: true
    }
  ]);

  const rowClick = (row) => (currentRow.value = row);

  const handleTagSearch = (val) => {
    console.log(val, "val...");
    formData.customerModel = val.customerModel;
    formData.customerName = val.customerName;
    getTableList();
  };

  const onChangeFileInput = (e) => {
    const file = e.target.files[0];
    console.log(file, "file...");
    const fd = new FormData();
    fd.append("file", file);
    importCustomerComplaintList(fd)
      .then((res) => {
        if (res.status === 200 || res.data) {
          message("导入成功", { type: "success" });
          getTableList();
        }
      })
      .finally(() => {
        const dom = document.getElementById("importQCCCInput");
        (dom as any).value = null;
      });
    // useAppStoreHook().pushPageLoading("loading");
    // readXlsx(file).then((sheetInfo) => {
    //   useAppStoreHook().popPageLoading();
    //   const sheetList = Object.values(sheetInfo)[0];
    //   initData(sheetList);
    // });
  };

  const initData = (data = []) => {
    const propMap = data[0];
    const arr = data.slice(1).map((item) => {
      const keys = Object.keys(item).filter((item) => item.startsWith("__"));
      let resultArr = [];

      keys.forEach((el) => {
        resultArr = resultArr.concat({ [propMap[el]]: item[el] });
      });

      return resultArr;
    });

    const resArr = arr.map((item) =>
      item.reduce((pre, next) => {
        return { ...pre, ...next };
      }, {})
    );

    const cnKeysMap = {
      日期: "date",
      客户名称: "customerName",
      德龙产品型号: "deograProductName",
      客户型号: "customerModel",
      流水码: "waterCode",
      生产日期: "productDate",
      不良数量: "badCount",
      问题类别: "questionClass",
      问题描述: "questionDes",
      缺陷图片: "badPhoto",
      产生原因: "appearReason",
      分析图片: "thinkPhoto",
      临时改善: "tempFinish",
      长期改善措施: "finishWay",
      改善效果: "finishRes",

      改善后的首次流水号: "firstWaterCode",
      "8D报告连接": "nightLink",
      状态: "status",
      确认人: "confirmUserName",
      备注: "remark"
    };
    // 转换字段以便于显示列表的数据
    const copyData = cloneDeep(resArr);
    const calcArr = copyData.map((item) => {
      const obj: any = {};
      Object.keys(item).forEach((el) => {
        if (el.includes("日期") && item[el]) {
          obj[cnKeysMap[el]] = dayjs(item[el]).format("YYYY-MM-DD");
        } else {
          obj[cnKeysMap[el]] = item[el];
        }
      });
      return obj;
    });

    const modalRef = ref();

    addDialog({
      title: `客诉台账导入`,
      props: { dataList: calcArr },
      width: "1200px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(ImportQCCCExcelModal, { ref: modalRef }),
      closeCallBack: () => {
        const dom = document.getElementById("importQCCCInput");
        (dom as any).value = null;
      },
      beforeSure: (done) => {
        const resultDataList = modalRef.value.rowsData;
        if (resultDataList.length) {
          message("接口未接入", { type: "warning" });
          console.log(resultDataList, "resultDataList===");
          dataList.value = resultDataList;
          done();
        } else {
          message("至少选择一条记录", { type: "warning" });
        }
      }
    });
  };

  // 分页相关
  function handleSizeChange(val: number) {
    formData.limit = val;
    getTableList();
  }

  function handleCurrentChange(val: number) {
    formData.page = val;
    getTableList();
  }

  const getMergeImgUlrList = (apiList, resType): any => {
    const resultArrList = apiList.map((item) => "/api" + item.imageUrl);
    return resType ? resultArrList[0] : resultArrList;
  };

  return {
    columns,
    handleTagSearch,
    searchOptions,
    rowClick,
    getMergeImgUlrList,
    onChangeFileInput,
    buttonList,
    dataList,
    pagination,
    handleSizeChange,
    handleCurrentChange,
    maxHeight,
    onExport
  };
};
