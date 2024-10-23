import * as XLSX from "xlsx";

import { deleteMaterialGroupAttr, fetchMaterialGroupAttr, getBOMTableRowSelectOptions, getMaterialGroupTreeData, saveMaterialGroupAttr } from "@/api/plmManage";
import { getMenuColumns, setColumn, tableEditRender, updateButtonList } from "@/utils/table";
import { h, onMounted, reactive, ref } from "vue";
import { message, showMessageBox } from "@/utils/message";

import { ElMessage } from "element-plus";
import ImportMaterialPropModal from "./ImportMaterialPropModal.vue";
import { addDialog } from "@/components/ReDialog";
import { saveAs } from "file-saver";
import { useEleHeight } from "@/hooks";

export function useTable() {
  const currentRow = ref();
  const curNodeName = ref("");
  const curNodeLabel = ref();
  const loading = ref<boolean>(false);
  const dataList = ref([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 40);
  const selectOptionValue = ref([]);
  const selectEnumOptsValue = ref([]);
  const columns = ref<TableColumnList[]>([]);

  const categoryTreeData = ref([]);

  const searchOptions = reactive([
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

  const getConfig = async (buttonList) => {
    const propNoRender = (data) => editCellRender({ data });
    const propNameRender = (data) => editCellRender({ data });
    const enumCodeRender = (data) =>
      editCellRender({
        type: "select",
        data,
        options: selectEnumOptsValue.value,
        isEdit: data.row.propertyType == "1",
        cellStyle: { color: "#606266", textAlign: "left" }
      });
    const propTypeRender = (data) =>
      editCellRender({ type: "select", data, options: selectOptionValue.value, cellStyle: { color: "#606266", textAlign: "left" } });

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
    const [menuCols] = columnArrs;

    if (menuCols?.length) {
      columnData = menuCols;
    }

    updateButtonList(buttonList, buttonArrs[0]);

    columns.value = setColumn({ columnData, operationColumn: false });
    return columns.value;
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
      }
    });
  };

  const onFresh = () => {
    currentRow.value = null;
    getConfig(buttonList);
    onSearch();
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
    console.log("add");
    dataList.value.push({ id: "", materialGroupId: curNodeName.value });
  };

  // 点击表格行
  const rowClick = (row, column) => {
    currentRow.value = row;
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
    console.log(dataList.value, "save list=>>");
    showMessageBox(`确认要保存吗?`)
      .then(() => {
        saveMaterialGroupAttr(dataList.value).then((res) => {
          if (res.data || res.status === 200) {
            ElMessage({ message: "保存成功", type: "success" });
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
          console.log(headers, "headers");
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

    console.log(fieldArr, " fieldArr...");
    openModal(fieldArr);
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "新增", isDropDown: false },
    { clickHandler: onDelete, type: "danger", text: "删除", isDropDown: false },
    { clickHandler: onSave, type: "warning", text: "保存", isDropDown: false },
    { clickHandler: onImport, type: "primary", text: "导入", isDropDown: true },
    { clickHandler: onExport, type: "primary", text: "导出", isDropDown: true }
  ]);

  const rowClassName = ({ row, rowIndex }) => {
    row.index = rowIndex;
    return "";
  };

  return {
    loading,
    dataList,
    columns,
    maxHeight,
    onFresh,
    onChangeFileInput,
    rowClick,
    rowClassName,
    buttonList,
    categoryTreeData,
    searchOptions,
    handleTagSearch,
    handleNodeClick,
    curNodeName
  };
}
