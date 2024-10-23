/*
 * @Author: Hailen
 * @Date: 2024-08-01 15:18:40
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-18 11:01:21
 */

import { Delete, Download, Edit, MessageBox, Postcard, Upload } from "@element-plus/icons-vue";
import {
  ProductScheduleItemType,
  deleteProroductSchedule,
  getProroductScheduleEditAuth,
  importProroductSchedule,
  productScheduleList,
  saveProroductSchedule
} from "@/api/oaManage/productMkCenter";
import { RendererType, downloadDataToExcel, getMenuColumns, setColumn, tableEditRender, updateButtonList } from "@/utils/table";
import { deepEqual, onDownload } from "@/utils/common";
import { formConfigs, formRules } from "./config";
import { h, onMounted, reactive, ref } from "vue";
import { message, showMessageBox } from "@/utils/message";

import EditForm from "@/components/EditForm/index.vue";
import RegInput from "@/components/RegInput.vue";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { addDialog } from "@/components/ReDialog";
import axios from "axios";
import { cloneDeep } from "@pureadmin/utils";
import { onBeforeRouteLeave } from "vue-router";
import regExp from "@/utils/regExp";
import { useEleHeight } from "@/hooks";

export const useConfig = () => {
  const tableRef = ref();
  const hasEdit = ref(false);
  const loading = ref<boolean>(false);
  const columns = ref<TableColumnList[]>([]);
  const rowData = ref<ProductScheduleItemType>();
  const rowsData = ref<ProductScheduleItemType[]>([]);
  const dataList = ref<ProductScheduleItemType[]>([]);
  const dataListTemp = ref<ProductScheduleItemType[]>([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 51);
  const dynamicColumn = ref<TableColumnList[]>([]);
  const formData = reactive({
    prdLineName: "",
    saleOrderBillNo: "",
    prdOrderBillNo: "",
    materialNumber: "",
    date: ""
  });
  const searchOptions = reactive<SearchOptionType[]>([
    { label: "线别", value: "prdLineName" },
    { label: "销售订单", value: "saleOrderBillNo" },
    { label: "生产订单", value: "prdOrderBillNo" },
    { label: "生产型号", value: "materialNumber" },
    { label: "排产日期", value: "date", type: "daterange", format: "YYYY-MM-DD" }
  ]);

  onMounted(() => getTableList());

  onBeforeRouteLeave((to, from, next) => {
    const isEqual = deepEqual(dataList.value, dataListTemp.value);
    if (isEqual) return next();
    onSubmit(true)
      .then(() => next())
      .catch((err) => {
        if (err === "cancel") return next();
        next(false);
      });
  });

  const editTable = tableEditRender({
    customRender: ({ editMap, index, row, column, callback }) => {
      const isEdit = editMap.value[index]?.editable;
      const colIndex = editMap.value[index]?.colIndex;
      if (isEdit && colIndex === column.rawColumnKey) {
        return (
          <RegInput
            v-model={row[column.columnKey]}
            autoFocus={true}
            autoSelect={true}
            isNumber={true}
            pattern={regExp.number3}
            onBlur={() => callback({ index })}
          />
        );
      }
      return <span>{row[column.columnKey]}</span>;
    }
  });

  const getColumnConfig = async (dynamicList: TableColumnList[]) => {
    const editRender: RendererType = (data) => editTable.editCellRender({ data, isEdit: hasEdit.value });
    let columnData: TableColumnList[] = [
      { label: "线别", prop: "prdLineName", fixed: "left" },
      { label: "销售订单", prop: "saleOrderBillNo", fixed: "left" },
      { label: "生产订单", prop: "prdOrderBillNo", fixed: "left" },
      { label: "生产型号", prop: "materialNumber", fixed: "left" },
      { label: "订单数量", prop: "orderQuantity", cellRenderer: editRender, fixed: "left" },
      { label: "出/验货时间", prop: "shippingDate", width: 160, fixed: "left" },
      { label: "已完成数量", prop: "finishTotal", fixed: "left" }
    ];

    dynamicList.forEach((item) => (item.cellRenderer = editRender)); // 处理可编辑
    const { columnArrs, buttonArrs } = await getMenuColumns([{ orderQuantity: editRender }]);
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData: [...columnData, ...dynamicList], operationColumn: false, selectionColumn: { hide: false } });
  };

  const onRefresh = () => getTableList();

  // 搜索
  const onTagSearch = (values) => {
    formData.prdLineName = values.prdLineName;
    formData.saleOrderBillNo = values.saleOrderBillNo;
    formData.prdOrderBillNo = values.prdOrderBillNo;
    formData.materialNumber = values.materialNumber;
    formData.date = values.date;
    getTableList();
  };

  const getTableList = () => {
    loading.value = true;
    dynamicColumn.value = [];
    const { date, ...reset } = formData;
    const [startDate, endDate] = date.split("~").map((item) => item.trim());
    productScheduleList({ ...reset, startDate, endDate })
      .then(async ({ data }) => {
        loading.value = false;
        dataList.value = data || [];
        dataListTemp.value = cloneDeep(data);
        const dateList = Object.keys(data[0] || {})
          .filter((item) => item.indexOf("-") > -1)
          .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
        dateList.forEach((key) => {
          dynamicColumn.value.push({
            label: key,
            prop: key,
            width: 120,
            sortable: true
          });
        });
        getColumnConfig(dynamicColumn.value);
      })
      .catch(() => (loading.value = false));
  };

  const onImport = () => {
    const formRef = ref();
    const _formData = reactive({
      dataStartRow: 7,
      productionLineCol: "B",
      productionOrderCol: "D",
      materialCol: "E",
      finishCountCol: "J",
      dateTitleRow: 5,
      schedulingStartCol: "K",
      schedulingEndCol: "",
      planYearMonth: "",
      file: []
    });

    addDialog({
      title: "导入排产数据",
      props: {
        formInline: _formData,
        formRules: formRules,
        formConfigs: formConfigs(),
        formProps: { labelWidth: "120px" }
      },
      width: "460px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      showResetButton: true,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeReset: () => formRef.value.getRef()?.resetFields(),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.validate((valid) => {
          if (valid) {
            const { file, ...param } = _formData;
            const fd = new FormData();
            fd.append("file", _formData.file[0].raw);
            fd.append("dto", JSON.stringify(param));
            showMessageBox("确认提交吗").then(() => {
              importProroductSchedule(fd).then(({ data }) => {
                if (!data) return message("导入失败", { type: "error" });
                message("导入成功");
                getTableList();
                done();
              });
            });
          }
        }).catch(console.log);
      }
    });
  };

  const onSave = () => onSubmit(false);

  const onSubmit = (isLeave = false) => {
    return new Promise((resolve, reject) => {
      const errorList: ProductScheduleItemType[] = [];
      dataList.value.forEach((item) => {
        const scheduleList = Object.keys(item).filter((key) => key.indexOf("-") > -1 && item[key] !== null);
        const scheduleCount = scheduleList.reduce((pre, next) => pre + +item[next], 0);
        if (item.finishTotal + scheduleCount > item.orderQuantity) {
          errorList.push(item);
        }
        const updateList = scheduleList.map((key) => ({ [key]: item[key] }));
        item.updateList = updateList;
      });
      const msgTip = isLeave ? "数据已修改，是否保存?" : "确认要保存修改吗?";
      showMessageBox(msgTip)
        .then(() => {
          // TODO 先不做订单与排产数量校验
          // if (errorList.length > 0) {
          //   const lineName = errorList.map((m) => m.prdLineName).join(",");
          //   reject();
          //   return message(`${lineName}排产数量不能大于订单数量`, { type: "error" });
          // }
          saveProroductSchedule(dataList.value)
            .then(({ data }) => {
              if (!data) return message("保存失败", { type: "error" });
              message("保存成功");
              getTableList();
              resolve(true);
            })
            .catch(reject);
        })
        .catch(reject);
    });
  };

  const onDelete = () => {
    if (!rowsData.value.length) return message("请选择要删除的订单", { type: "error" });
    const orderNumber = rowsData.value.map((m) => m.prdOrderBillNo).join(",");
    showMessageBox(`确认要删除生产订单【${orderNumber}】吗?`).then(() => {
      deleteProroductSchedule(rowsData.value).then(({ data }) => {
        if (!data) return message("删除失败", { type: "error" });
        message("删除成功");
        getTableList();
      });
    });
  };

  const onExport = () => {
    downloadDataToExcel([
      {
        dataList: dataList.value,
        columns: columns.value,
        sheetName: "生产排产"
      }
    ]);
  };
  const onDownloadTemplate = () => {
    const basePath = import.meta.env.VITE_PUBLIC_PATH;
    const fileName = "生产排产表导入模版.xlsx";
    return axios({
      method: "get",
      responseType: "blob",
      url: `${basePath}template/${fileName}`
    })
      .then(({ data }) => onDownload(data, fileName))
      .catch(() => message("下载失败", { type: "error" }));
  };
  const onBatchEdit = () => {
    getProroductScheduleEditAuth().then(({ data }) => {
      if (data === "ok") {
        message("编辑已开启");
        hasEdit.value = true;
        getColumnConfig(dynamicColumn.value);
      } else {
        message("您没有编辑权限", { type: "error" });
      }
    });
  };

  const onRowClick = (row: ProductScheduleItemType) => {
    rowData.value = row;
    // tableRef.value?.getTableRef()?.toggleRowSelection(row);
  };

  function handleSelectionChange(rows: ProductScheduleItemType[]) {
    rowsData.value = rows;
  }

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onSave, type: "success", text: "保存", icon: MessageBox, isDropDown: false },
    { clickHandler: onImport, type: "primary", text: "导入", icon: Upload, isDropDown: false },
    { clickHandler: onBatchEdit, type: "primary", text: "批量编辑", icon: Edit, isDropDown: false },
    { clickHandler: onDelete, type: "danger", text: "删除", icon: Delete, isDropDown: false },
    { clickHandler: onExport, type: "default", text: "导出", icon: Download, isDropDown: true },
    { clickHandler: onDownloadTemplate, type: "default", text: "下载模板", icon: Postcard, isDropDown: true }
  ]);

  return {
    tableRef,
    loading,
    columns,
    dataList,
    maxHeight,
    searchOptions,
    buttonList,
    onRefresh,
    onTagSearch,
    onRowClick,
    handleSelectionChange
  };
};
