import * as XLSX from "xlsx";

import {
  deleteMaterialGroupAttr,
  fetchMaterialGroupAttr,
  getBOMTableRowSelectOptions,
  getMaterialGroupTreeData,
  insertMaterialGroupAttrList,
  saveMaterialGroupAttr
} from "@/api/plmManage";
import { getEnumDictList, getMenuColumns, setColumn, tableEditRender, updateButtonList } from "@/utils/table";
import { h, onMounted, reactive, ref } from "vue";
import { message, showMessageBox } from "@/utils/message";

import { ElMessage } from "element-plus";
import ImportMaterialPropModal from "./ImportMaterialPropModal.vue";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { addDialog } from "@/components/ReDialog";
import { enumDictionaryOptionDelete } from "@/api/systemManage";
import { saveAs } from "file-saver";
import { useEleHeight } from "@/hooks";

export function useTable() {
  const currentRow = ref();
  const currentRow2 = ref();
  const curNodeName = ref("");
  const curNodeLabel = ref();
  const loading = ref<boolean>(false);
  const dataList = ref([]);
  const dataList2 = ref([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 40);
  const selectOptionValue = ref([]);
  const selectEnumOptsValue = ref([]);
  const columns = ref<TableColumnList[]>([]);
  const columns2 = ref<TableColumnList[]>([]);
  const loading2 = ref(false);
  const isEditTable2 = ref(false);
  const isEditTable1 = ref(false);
  const optionId = ref();

  const categoryTreeData = ref([]);
  const searchOptions = reactive<SearchOptionType[]>([
    { label: "属性编号", value: "propertyCode" },
    { label: "属性值类型", value: "propertyType", children: [] },
    { label: "枚举编码", value: "enumCode" },
    { label: "枚举名称", value: "enumName" }
  ]);

  const formData = reactive({
    materialGroupId: "",
    propertyCode: "",
    propertyName: "",
    propertyType: "",
    enumCode: "",
    enumName: ""
  });

  // 编辑表格
  const { editCellRender } = tableEditRender({
    editFinish: ({ prop, index, row }) => {
      const value = row[prop];
      if (prop === "propertyType") {
        if (value != 1) {
          dataList.value[index]["enumCode"] = "";
          dataList.value[index]["enumName"] = "";
        }
      }
      if (prop === "enumCode") {
        const findOptionName = selectEnumOptsValue.value.find((item) => item.optionValue == value)?.copyName;
        dataList.value[index]["enumName"] = findOptionName;
      }
      dataList.value[index][prop] = value;
    }
  });

  // 编辑表格2
  const table2CellRender = tableEditRender();

  const getConfig = async (buttonList) => {
    const propNoRender = (data) => editCellRender({ data, isEdit: isEditTable1.value });
    const propNameRender = (data) => editCellRender({ data, isEdit: isEditTable1.value });
    const enumCodeRender = (data) =>
      editCellRender({
        type: "select",
        data,
        options: selectEnumOptsValue.value,
        isEdit: isEditTable1.value && data.row.propertyType == "1",
        cellStyle: { color: "#606266", textAlign: "left" }
      });
    const propTypeRender = (data) =>
      editCellRender({
        type: "select",
        data,
        isEdit: isEditTable1.value,
        options: selectOptionValue.value,
        cellStyle: { color: "#606266", textAlign: "left" }
      });

    let columnData: TableColumnList[] = [
      { label: "属性id", prop: "id" },
      { label: "属性编号", prop: "propertyCode", cellRenderer: propNoRender },
      { label: "属性值类型", prop: "propertyType", cellRenderer: propTypeRender },
      { label: "枚举编码", prop: "enumCode", cellRenderer: enumCodeRender },
      { label: "枚举名称", prop: "enumName" }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns([
      { propertyCode: propNoRender, propertyName: propNameRender, propertyType: propTypeRender, enumCode: enumCodeRender }
    ]);
    const menuCols = columnArrs[0];

    if (menuCols?.length) {
      columnData = menuCols;
    }

    updateButtonList(
      buttonList,
      buttonArrs[0].filter((el) => ["newEdit", "export", "import"].includes(el.btnKey))
    );

    columns.value = setColumn({ columnData, operationColumn: false });
    return columns.value;
  };

  const getConfig2 = async (buttonList) => {
    const optionNameRender = (data) => table2CellRender.editCellRender({ data, isEdit: isEditTable2.value });
    const optionValueRender = (data) => table2CellRender.editCellRender({ data, isEdit: isEditTable2.value });

    let columnData: TableColumnList[] = [
      { label: "枚举属性", prop: "optionName", cellRenderer: optionNameRender },
      { label: "枚举值", prop: "optionValue", cellRenderer: optionValueRender }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns([{}, { optionName: optionNameRender, optionValue: optionValueRender }]);
    const menuCols = columnArrs[1];

    if (menuCols?.length) {
      columnData = menuCols;
    }

    // updateButtonList(buttonList, buttonArrs[1]);

    columns2.value = setColumn({ columnData, operationColumn: false, dragSelector: ".material-prop-table2", isDragRow: true, dataList: dataList2 });
    return columns2.value;
  };

  const getLeftGroup = () => {
    getMaterialGroupTreeData({}).then((res: any) => {
      if (res.data) {
        categoryTreeData.value = res.data;
        setTimeout(() => {
          curNodeName.value = res.data[0]?.children[0]?.id;
          onSearch();
        });
      }
    });
  };

  const fetchOpts = () => {
    getBOMTableRowSelectOptions({ optioncode: "PropertyType,MaterialGroupEnumInEnum" }).then((res) => {
      if (res.data) {
        const result = res.data.find((item) => item.optionCode === "PropertyType")?.optionList || [];
        selectOptionValue.value = result;

        const resultEnum = res.data.find((item) => item.optionCode === "MaterialGroupEnumInEnum")?.optionList || [];
        selectEnumOptsValue.value = resultEnum.map((item) => ({ optionName: item.optionValue, optionValue: item.optionValue, copyName: item.optionName }));
        searchOptions[1].children = result.map((item) => ({ label: item.optionName, value: item.optionValue }));
      }
    });
  };

  onMounted(async () => {
    fetchOpts();
    getLeftGroup();
    getConfig(buttonList);
    getConfig2(buttonList2);
  });

  const handleNodeClick = (treeItem) => {
    curNodeName.value = treeItem.id;
    curNodeLabel.value = treeItem.groupCode;

    formData.materialGroupId = treeItem.id;

    onSearch();
  };

  const onSearch = () => {
    formData.materialGroupId = curNodeName.value;
    fetchMaterialGroupAttr(formData).then((res: any) => {
      if (res.data) {
        dataList.value = res.data.map((item) => ({ ...item, propertyType: item.propertyType + "" }));
        dataList2.value = [];
      }
    });
  };

  const onSearch2 = () => {
    loading2.value = true;
    getBOMTableRowSelectOptions({ optioncode: currentRow.value.enumCode })
      .then((res) => {
        if (res.data) {
          const result = res.data.find((el) => el.optionCode === currentRow.value.enumCode);
          dataList2.value = result?.optionList;
          optionId.value = result?.id;
        }
      })
      .finally(() => {
        loading2.value = false;
      });
  };

  const onFresh = () => {
    currentRow.value = null;
    getConfig(buttonList);
    onSearch();
  };

  const onFresh2 = () => {
    currentRow2.value = null;
    getConfig2(buttonList2);
    onSearch2();
  };

  const handleTagSearch = (values) => {
    formData.propertyCode = values.propertyCode;
    formData.propertyName = values.propertyName;
    formData.propertyType = values.propertyType;
    formData.enumCode = values.enumCode;
    formData.enumName = values.enumName;

    onSearch();
  };

  const onAdd = () => {
    dataList.value.push({ id: "", materialGroupId: curNodeName.value });
  };

  // 点击表格行
  const rowClick = (row, column) => {
    currentRow.value = row;
    if (row.enumCode) {
      onSearch2();
    }
  };

  // 点击表格行
  const rowClick2 = (row, column) => {
    currentRow2.value = row;
  };

  // 导出
  const onExport = () => {
    const timeStep = Date.now();
    const workbook = XLSX.utils.table_to_book(document.querySelector("#materialPropTableId"), {
      raw: true //有的是日期、小数等格式，直接乱码#。所以这里直接保留原始字符串
    });
    workbook.Sheets.Sheet1["!cols"][0] = { hidden: true };
    const wbout = XLSX.write(workbook, {
      bookType: "xlsx",
      bookSST: true,
      type: "array"
    });
    saveAs(
      new Blob([wbout], {
        type: "application/octet-stream"
      }),
      `物料分组属性${timeStep}.xlsx`
    );
  };
  const onDelete = () => {
    if (!currentRow.value) return message("请选择行记录", { type: "warning" });
    if (currentRow.value?.id) {
      showMessageBox(`确认要删除名称为【${currentRow.value.propertyName}】的属性吗?`)
        .then(() => {
          deleteMaterialGroupAttr([currentRow.value?.id]).then((res) => {
            if (res.data || res.status === 200) {
              ElMessage({ message: "删除成功", type: "success" });
              onSearch();
            }
          });
        })
        .catch(console.log);
    } else {
      dataList.value.splice(currentRow.value.index, 1);
      currentRow.value = null;
    }
  };

  const onSave = () => {
    showMessageBox(`确认要保存吗?`)
      .then(() => {
        saveMaterialGroupAttr(dataList.value).then((res) => {
          if (res.data || res.status === 200) {
            ElMessage({ message: "保存成功", type: "success" });
            onCancelAction();
            onSearch();
          }
        });
      })
      .catch(console.log);
  };

  const onImport = () => {
    const dom = document.getElementById("importMaterialProp");
    dom.click();
  };

  const readXlsx = (file: File, sheetConfig = {}) => {
    return new Promise<Record<string, any[]>>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
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

  const findItemByNum = (list, num) => {
    // 每次进来使用find遍历一次
    let res = list.find((item) => item.title?.split("(")[0] == num);
    if (res) {
      return res;
    } else {
      for (let i = 0; i < list.length; i++) {
        if (list[i].children instanceof Array && list[i].children.length > 0) {
          res = findItemByNum(list[i].children, num);

          if (res) return res;
        }
      }

      return null;
    }
  };

  const findGroupId = (smallGroupName) => {
    const findRes = findItemByNum(categoryTreeData.value, smallGroupName);
    return findRes;
  };

  const openModal = (xlsxData) => {
    const formRef = ref();
    addDialog({
      title: `物料分组属性导入`,
      props: { dataList: xlsxData },
      width: "1000px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(ImportMaterialPropModal, { ref: formRef }),
      closeCallBack: () => {
        const dom = document.getElementById("importMaterialProp");
        (dom as any).value = null;
      },
      beforeSure: (done) => {
        if (formRef.value.rowDatas?.length) {
          dataList.value = formRef.value.rowDatas.map((el) => {
            return {
              ...el,
              propertyType: selectOptionValue.value.find((item) => item.optionName == el.propertyType)?.optionValue
            };
          });
          done();
        } else {
          message("请选择至少一条记录", { type: "warning" });
        }
      }
    });
  };

  const onChangeFileInput = async (e) => {
    const file = e.target.files[0];
    const result = await readXlsx(file);
    const flatArrData = Object.values(result).flat(Infinity);

    const fieldArr = [];

    flatArrData.forEach((el) => {
      fieldArr.push({
        firstLevel: findGroupId(el["大分类"])?.title,
        secondLevel: findGroupId(el["小分类"])?.title,
        materialGroupId: findGroupId(el["小分类"])?.id,
        propertyCode: el["属性编号"],
        propertyName: el["属性名称"],
        propertyType: el["属性值类型"],
        enumCode: el["枚举编码"],
        enumName: el["枚举名称"]
      });
    });

    openModal(fieldArr);
  };

  const onAdd2 = () => {
    dataList2.value.push({ id: "", optionName: "", optionValue: "", optionId: optionId.value });
  };

  const onSave2 = () => {
    showMessageBox(`确认要保存吗?`)
      .then(() => {
        insertMaterialGroupAttrList(dataList2.value).then((res) => {
          if (res.data || res.status === 200) {
            ElMessage({ message: "保存成功", type: "success" });
            isEditTable2.value = false;
            buttonList2.value = initButtons;
            onSearch2();
          }
        });
      })
      .catch(console.log);
  };

  const onDelete2 = () => {
    if (!currentRow2.value) return message("请选择枚举记录", { type: "warning" });
    if (currentRow2.value?.id) {
      showMessageBox(`确认要删除名称为【${currentRow2.value.optionName}】的枚举属性吗?`)
        .then(() => {
          enumDictionaryOptionDelete({ optionListIdList: [currentRow2.value?.id] }).then((res) => {
            if (res.data || res.status === 200) {
              ElMessage({ message: "删除成功", type: "success" });
              onSearch2();
            }
          });
        })
        .catch(console.log);
    } else {
      dataList2.value.splice(currentRow2.value.index, 1);
      currentRow2.value = null;
    }
  };

  const onEidtNew = () => {
    isEditTable2.value = true;
    buttonList2.value = editButtons;
  };

  const onCancel2 = () => {
    isEditTable2.value = false;
    buttonList2.value = initButtons;
  };

  const onEditAction = () => {
    isEditTable1.value = true;
    buttonList.value = editButtons1;
  };

  const onCancelAction = () => {
    isEditTable1.value = false;
    buttonList.value = initButtons1;
  };

  const editButtons1 = [
    { clickHandler: onAdd, type: "primary", text: "增行", isDropDown: false },
    { clickHandler: onDelete, type: "danger", text: "删行", isDropDown: false },
    { clickHandler: onSave, type: "warning", text: "保存", isDropDown: false },
    { clickHandler: onCancelAction, type: "default", text: "取消", isDropDown: false },
    { clickHandler: onImport, type: "info", text: "导入", isDropDown: true },
    { clickHandler: onExport, type: "info", text: "导出", isDropDown: true }
  ];

  const initButtons1 = [
    { clickHandler: onEditAction, type: "warning", text: "编辑", isDropDown: false },
    { clickHandler: onImport, type: "primary", text: "导入", isDropDown: true },
    { clickHandler: onExport, type: "info", text: "导出", isDropDown: true }
  ];

  const buttonList = ref(initButtons1);

  const editButtons = [
    { clickHandler: onSave2, type: "warning", text: "保存", size: "small", isDropDown: false },
    { clickHandler: onCancel2, type: "default", text: "取消", size: "small", isDropDown: false },
    { clickHandler: onAdd2, type: "primary", text: "增行", size: "small", isDropDown: false },
    { clickHandler: onDelete2, type: "danger", text: "删行", size: "small", isDropDown: false }
  ];

  const initButtons = [{ clickHandler: onEidtNew, type: "warning", text: "编辑", size: "small", isDropDown: false }];

  const buttonList2 = ref<ButtonItemType[]>(initButtons);

  const rowClassName = ({ row, rowIndex }) => {
    row.index = rowIndex;
    row.displaySeq = rowIndex + 1;
    return "";
  };

  return {
    loading,
    dataList,
    columns,
    dataList2,
    columns2,
    rowClick2,
    maxHeight,
    loading2,
    onFresh,
    onFresh2,
    onChangeFileInput,
    rowClick,
    rowClassName,
    buttonList,
    buttonList2,
    categoryTreeData,
    searchOptions,
    handleTagSearch,
    handleNodeClick,
    curNodeName
  };
}
