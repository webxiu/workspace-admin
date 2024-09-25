import * as XLSX from "xlsx";

import { ElMessage, ElMessageBox, FormRules, dayjs } from "element-plus";
import { addRightFreeDayList, delRightFreeDayList, editRightFreeDayList, getRightFreeDayList } from "@/api/plmManage";
import { downloadDataToExcel, getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { h, onMounted, reactive, ref } from "vue";

import EditForm from "@/components/EditForm/index.vue";
import ImportHolidaylModal from "./imporHoliday.vue";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { addDialog } from "@/components/ReDialog";
import axios from "axios";
import { cloneDeep } from "@pureadmin/utils";
import { message } from "@/utils/message";
import { onDownload } from "@/utils/common";

const columns2 = ref<TableColumnList[]>([]);
const currLeftRowData = ref();

export const getConfig = async (buttonList) => {
  let columnData: any[] = [
    { label: "假日名称", prop: "holidayName" },
    { label: "开始日期", prop: "beginDate" },

    { label: "结束日期", prop: "endDate" },
    { label: "创建人", prop: "createUserName" },
    { label: "创建时间", prop: "createDate" },
    { label: "最后修改人", prop: "modifyUserName" },
    { label: "最后修改时间", prop: "modifyDate" }
  ];

  const { columnArrs, buttonArrs } = await getMenuColumns();
  const menuCols = columnArrs[1];
  if (menuCols?.length) {
    columnData = menuCols;
  }
  updateButtonList(buttonList, buttonArrs[1]);
  columns2.value = setColumn({ columnData, operationColumn: false });
  return columnData;
};

export function useBankTable() {
  const dataList: any = ref([]);
  const currentBankRow: any = ref({});
  const currentLeftRow: any = ref({});
  const formData = reactive({ holidayName: "", yearMonth: "" });

  const searchOptions: SearchOptionType[] = [{ label: "年月", value: "date", type: "month", format: "YYYY-MM" }];

  const loading = ref(false);
  onMounted(() => {
    getConfig(buttonList2);
    onSearch(formData);
  });

  const onSearch = (v) => {
    loading.value = true;

    getRightFreeDayList({ ...v })
      .then((res: any) => {
        dataList.value = res.data;
      })
      .finally(() => (loading.value = false));
  };

  const onFresh2 = () => {
    getConfig(buttonList2);
    onSearch(formData);
  };

  // 点击行
  const rowClick = (row) => {
    currentBankRow.value = row;
  };

  const onAdd = (leftRow) => {
    console.log("onAdd", leftRow);
    currentLeftRow.value = leftRow;
    openDialog("add");
  };

  const onEdit = () => {
    if (JSON.stringify(currentBankRow.value) !== "{}") {
      openDialog("edit", currentBankRow.value);
    } else {
      ElMessage({ message: `请选择记录`, type: "warning" });
    }
  };

  const onDelete = () => {
    if (JSON.stringify(currentBankRow.value) !== "{}") {
      const row = currentBankRow.value;
      ElMessageBox.confirm(`确认要删除名称为【${row.holidayName}】的记录吗?`, "系统提示", {
        type: "warning",
        draggable: true,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          loading.value = true;
          delRightFreeDayList({ id: row.id }).then((res) => {
            if (res.data) {
              ElMessage({ message: `删除成功`, type: "success" });
              currentBankRow.value = {};
              onSearch({});
            }
          });
        })
        .catch(() => {})
        .finally(() => (loading.value = false));
    } else {
      ElMessage({ message: `请选择记录`, type: "warning" });
    }
  };

  const openDialog = async (type: string, row?) => {
    const titleObj = { add: "新增", edit: "修改" };
    const title = titleObj[type];
    const formRef = ref();

    const _formData = reactive({
      holidayName: row?.holidayName ?? "",
      dateArr: [row?.beginDate, row?.endDate] ?? []
    });
    const formRules = reactive<FormRules>({
      holidayName: [{ required: true, message: "假日名称为必填项", trigger: "change" }],
      dateArr: [{ required: true, message: "假日日期为必填项", trigger: "change" }]
    });

    const formConfigs = () => [
      {
        label: "假日名称",
        prop: "holidayName",
        labelWidth: 80,
        render: ({ formModel, row }) => {
          return <el-input v-model={formModel[row.prop]} placeholder="请输入假日名称" clearable />;
        }
      },
      {
        label: "假日日期",
        prop: "dateArr",
        labelWidth: 80,
        render: ({ formModel, row }) => {
          return (
            <el-date-picker
              value-format="YYYY-MM-DD"
              v-model={formModel[row.prop]}
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          );
        }
      }
    ];

    addDialog({
      title: `${title}`,
      props: {
        formInline: _formData,
        formRules,
        formConfigs: formConfigs()
      },
      width: "450px",
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
              onSubmitChange(
                type,
                title,
                _formData,
                () => {
                  done();
                  onSearch({});
                },
                row
              );
            });
          }
        });
      }
    });
  };

  const onSubmitChange = (type: string, title: string, data, callback, row?) => {
    const [beginDate, endDate] = data.dateArr;
    // data.holidayId = currLeftRowData.value.id;
    data.beginDate = beginDate;
    data.endDate = endDate;
    if (type === "edit") {
      data.id = currentBankRow.value.id;
      // data.holidayId = row.holidayId;
    }
    const API = { add: addRightFreeDayList, edit: editRightFreeDayList };
    API[type](type === "add" ? [data] : data)
      .then((res) => {
        if (res.data) {
          callback();
          message(`${title}成功`);
        }
      })
      .catch(console.log);
  };

  const setList = (v) => (dataList.value = v);

  const setLoading = (v) => (loading.value = v);

  const onExportAction = () => {
    downloadDataToExcel({
      dataList: dataList.value,
      columns: columns2.value,
      sheetName: "项目管理节假日表"
    });
  };

  const onImportAction = () => {
    const dom = document.getElementById("importHolidayId");
    dom.click();
  };

  const onChangeHolidayInput = (value) => {
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
            } else if (key.includes("日期")) {
              newRow[key] = dayjs(newRow[key]?.trim()).format("YYYY-MM-DD");
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
      handleOpenImportHolidayDialog(postData);
    };

    fileReader.readAsBinaryString(file);
  };

  // 打开弹窗
  const handleOpenImportHolidayDialog = (data) => {
    const cnKeysMap = {
      假日名称: "holidayName",
      开始日期: "beginDate",
      结束日期: "endDate"
    };
    let resultDataList = [];

    const selectionCallBack = (v) => {
      resultDataList = v;
    };

    const callBack = () => data;

    addDialog({
      title: `项目管理节假日导入`,
      props: { selectionCallBack, data, callBack },
      width: "800px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(ImportHolidaylModal),
      closeCallBack: () => {
        const dom = document.getElementById("importHolidayId");
        (dom as any).value = null;
      },
      beforeSure: (done) => {
        if (resultDataList.length) {
          // 转换字段以便于显示列表的数据
          const copyData = cloneDeep(resultDataList);
          const calcArr = copyData.map((item) => {
            const obj: any = {};
            Object.keys(item).forEach((el) => {
              if (cnKeysMap[el]) {
                obj[cnKeysMap[el]] = item[el];
              }
            });
            return obj;
          });
          addRightFreeDayList(calcArr).then((res) => {
            if (res.status === 200 || res.data) {
              ElMessage({ message: "导入成功!", type: "success" });
              onSearch({});
            }
          });
          done();
        } else {
          message("至少选择一条记录", { type: "warning" });
        }
      }
    });
  };

  const onDownloadModel = () => {
    return axios({
      method: "get",
      responseType: "blob",
      url: `${import.meta.env.VITE_PUBLIC_PATH}template/项目管理节假日模版.xlsx`
    })
      .then(({ data }) => onDownload(data, "项目管理节假日模版.xlsx"))
      .catch(() => {});
  };

  const buttonList2 = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "新增" },
    { clickHandler: onEdit, type: "warning", text: "修改" },
    { clickHandler: onDelete, type: "danger", text: "删除" },
    { clickHandler: onExportAction, type: "danger", text: "导出", isDropDown: true },
    { clickHandler: onImportAction, type: "danger", text: "导入", isDropDown: true },
    { clickHandler: onDownloadModel, type: "danger", text: "下载模板", isDropDown: true }
  ]);

  const setCurLeftRow = (row) => {
    console.log(row, "row");
    currLeftRowData.value = row;
  };

  const handleTagSearch = (values) => {
    formData.holidayName = values.holidayName ?? "";
    formData.yearMonth = values.date ?? "";
    onSearch(formData);
  };

  return {
    columns2,
    dataList,
    loading,
    onSearch,
    onFresh2,
    rowClick,
    handleTagSearch,
    onChangeHolidayInput,
    searchOptions,
    setCurLeftRow,
    onAdd,
    onEdit,
    buttonList2,
    onDelete,
    setList,
    setLoading
  };
}
