import { ElMessage, ElMessageBox, FormRules } from "element-plus";
import { deleteProductStoreList, fetchProductStoreList, getBOMTableRowSelectOptions, insertProductStoreList, updateProductStoreList } from "@/api/plmManage";
import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { h, onMounted, reactive, ref, watch } from "vue";

import EditForm from "@/components/EditForm/index.vue";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { addDialog } from "@/components/ReDialog";
import { message } from "@/utils/message";
import { useEleHeight } from "@/hooks";
import { type PaginationProps } from "@pureadmin/table";
import { PAGE_CONFIG } from "@/config/constant";
import { utils, write } from "xlsx";
import { saveAs } from "file-saver";
import { cloneDeep } from "@pureadmin/utils";
import { getProductClassifyList } from "@/views/plmManage/productMgmt/classify/utils/hook";
import { Plus } from "@element-plus/icons-vue";

export const useConfig = (emits, isModal) => {
  const columns = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref([]);
  const currentId = ref("");
  const currentRow: any = ref({});
  const brandList = ref([]);
  const classList = ref([]);
  const originBrandList = ref([]);
  const originClassList = ref([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49 + 52);

  const formRules = reactive<FormRules>({
    corporateBrand: [{ required: true, message: "公司品牌", trigger: "submit" }],
    productType: [{ required: true, message: "产品分类为必填项", trigger: "submit" }],
    productLevel: [{ required: true, message: "产品级别为必填项", trigger: "submit" }],
    projectCode: [
      { required: true, message: "项目码为必填项", trigger: "submit" },
      { pattern: /^\d{3}$/, message: "请输入3位数数字" }
    ],
    appearanceStructureCode: [{ required: true, message: "外观结构码为必填项", trigger: "submit" }],
    functionalPerformanceCode: [{ required: true, message: "功能性能码为必填项", trigger: "submit" }]
  });

  const formData: any = reactive({
    page: 1,
    limit: PAGE_CONFIG.pageSize
  });

  const deleteFileIds = ref<Array<number | string>>([]);

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "公司品牌", value: "corporateBrand", children: [] },
    { label: "产品类别", value: "productType", children: [] },
    { label: "产品级别", value: "productLevel", children: [] },
    { label: "项目码", value: "projectCode" },
    { label: "外观结构码", value: "appearanceStructureCode", children: [] },
    { label: "功能性能码", value: "functionalPerformanceCode", children: [] }
  ]);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });

  const formConfigs = ({ classList, brandList }) => [
    {
      label: "产品型号",
      labelWidth: 100,
      colProp: { span: 12 },
      prop: "productCode",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="自动生成" disabled />;
      }
    },
    // {
    //   label: "客户型号",
    //   colProp: { span: 12 },
    //   labelWidth: 100,
    //   prop: "customerModel",
    //   render: ({ formModel, row }) => {
    //     return <el-input v-model={formModel[row.prop]} placeholder="请输入" />;
    //   }
    // },
    {
      label: "公司品牌",
      labelWidth: 100,
      colProp: { span: 12 },
      prop: "corporateBrand",
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} placeholder="请选择" style={{ width: "100%" }}>
            {brandList.value.map((item) => (
              <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "产品分类",
      colProp: { span: 12 },
      labelWidth: 100,
      prop: "productType",
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} placeholder="请选择" style={{ width: "100%" }}>
            {classList.value.map((item) => (
              <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "产品级别",
      colProp: { span: 12 },
      labelWidth: 100,
      prop: "productLevel",
      render: ({ formModel, row }) => {
        const productLevelArr = [];
        for (let i = 0; i <= 9; i++) {
          productLevelArr.push({ optionName: `${i}`, optionValue: `${i}` });
        }
        const sortArr = productLevelArr.sort((a, b) => b.optionValue - a.optionValue);
        return (
          <el-select v-model={formModel[row.prop]} placeholder="请选择" style={{ width: "100%" }} filterable>
            {sortArr.map((item) => (
              <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "项目码",
      colProp: { span: 12 },
      labelWidth: 100,
      prop: "projectCode",
      render: ({ formModel, row }) => {
        return <el-input maxlength={3} v-model={formModel[row.prop]} placeholder="例如：001" />;
      }
    },
    {
      label: "外观结构码",
      colProp: { span: 12 },
      labelWidth: 100,
      prop: "appearanceStructureCode",
      render: ({ formModel, row }) => {
        const appearanceStructureCodeArr = [];
        for (let i = 65; i <= 90; i++) {
          appearanceStructureCodeArr.push({ optionName: String.fromCharCode(i), optionValue: String.fromCharCode(i) });
        }
        appearanceStructureCodeArr.push({ optionName: "-", optionValue: "-" });
        return (
          <el-select v-model={formModel[row.prop]} placeholder="请选择" style={{ width: "100%" }} filterable>
            {appearanceStructureCodeArr.map((item) => (
              <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "功能性能码",
      colProp: { span: 12 },
      labelWidth: 100,
      prop: "functionalPerformanceCode",
      render: ({ formModel, row }) => {
        const functionOpts = [];
        for (let i = 0; i < 9; i++) {
          functionOpts.push({ optionName: `0${i + 1}`, optionValue: `0${i + 1}` });
        }
        return (
          <el-select v-model={formModel[row.prop]} placeholder="请选择" style={{ width: "100%" }} filterable>
            {functionOpts.map((item) => (
              <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "图片",
      labelWidth: 100,
      prop: "productImgs",
      colProp: { span: 24 },
      slots: { label: ({ label }) => <span class="fw-700">{label}</span> },
      render: ({ formModel, row }) => {
        return (
          <el-upload
            multiple
            onRemove={onRemoveFiles}
            auto-upload={false}
            v-model:file-list={formModel[row.prop]}
            accept=".jpg,.png,.jpeg,.bmp,.gif"
            list-type="picture-card"
            style={{ width: "100%" }}
          >
            <el-icon>
              <Plus />
            </el-icon>
          </el-upload>
        );
      }
    }
  ];

  const onRemoveFiles = (file) => {
    // TODO: 删除时提供已存在文件的标识如id等，新上传的文件直接回进行删除
    if (file.virtualPath) {
      deleteFileIds.value.push(file.id);
    }
  };

  onMounted(() => {
    getColumnConfig(buttonList);
    fetchOpts();
    onSearch();
  });

  const getColumnConfig = async (buttonList) => {
    let columnData: TableColumnList[] = [
      { label: "产品型号", prop: "productCode" },
      { label: "公司品牌", prop: "corporateBrand" },
      { label: "产品类别", prop: "productType" },
      { label: "产品级别", prop: "productLevel" },
      { label: "项目码", prop: "projectCode" },
      { label: "外观结构码", prop: "appearanceStructureCode" },
      { label: "功能性能码", prop: "functionalPerformanceCode" }
    ];

    const modalColumnsData: TableColumnList[] = [{ label: "产品型号", prop: "productCode" }];

    if (isModal) {
      columns.value = setColumn({ columnData: JSON.parse(JSON.stringify(modalColumnsData)), operationColumn: false });
      return modalColumnsData;
    }
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
    loading.value = true;
    fetchProductStoreList(formData)
      .then((res: any) => {
        if (res.data) {
          const data = res.data;
          loading.value = false;
          console.log(data, "data...");
          dataList.value = data.records;
          pagination.total = data.total;
        }
      })
      .catch((err) => (loading.value = false));
  };

  const fetchOpts = () => {
    getBOMTableRowSelectOptions({ optioncode: "ProjectCustom" }).then((res: any) => {
      if (res.data) {
        const findRes =
          res.data.find((item) => item.optionCode === "ProjectCustom")?.optionList?.sort((a, b) => a["optionName"].localeCompare(b["optionName"])) || [];
        originBrandList.value = findRes;
        const resultArr = findRes.map((item) => ({ optionName: item.optionName + " - " + item.optionValue, optionValue: item.optionName }));
        searchOptions[0].children = resultArr.map((item) => ({ label: item.optionName, value: item.optionName }));
        brandList.value = resultArr;
      }
    });

    getProductClassifyList({}).then((data) => {
      if (data && Array.isArray(data)) {
        originClassList.value = data;

        const resultArr = data
          .sort((a, b) => a["categoryNo"].localeCompare(b["categoryNo"]))
          .map((item) => ({ optionName: item.categoryNo + " - " + item.categoryName, optionValue: item.categoryNo }));
        classList.value = resultArr;

        searchOptions[1].children = resultArr.map((item) => ({ label: item.optionName, value: item.optionName }));
      }
    });

    const productLevelArr = [];
    for (let i = 0; i < 9; i++) {
      productLevelArr.push({ optionName: `${i + 1}`, optionValue: `${i + 1}` });
    }
    const sortArr = productLevelArr.sort((a, b) => b.optionValue - a.optionValue);
    searchOptions[2].children = sortArr.map((item) => ({ label: item.optionName, value: item.optionValue }));

    const appearanceStructureCodeArr = [];
    for (let i = 65; i <= 90; i++) {
      appearanceStructureCodeArr.push({ optionName: String.fromCharCode(i), optionValue: String.fromCharCode(i) });
    }
    searchOptions[4].children = appearanceStructureCodeArr.map((item) => ({ label: item.optionName, value: item.optionValue }));

    const functionOpts = [];
    for (let i = 0; i < 9; i++) {
      functionOpts.push({ optionName: `0${i + 1}`, optionValue: `0${i + 1}` });
    }
    searchOptions[5].children = functionOpts.map((item) => ({ label: item.optionName, value: item.optionValue }));
  };

  const onFresh = () => {
    getColumnConfig(buttonList);
    onSearch();
  };

  const handleTagSearch = (values) => {
    formData.corporateBrand = values.corporateBrand;
    formData.productType = values.productType;
    formData.productLevel = values.productLevel;
    formData.projectCode = values.projectCode;
    formData.appearanceStructureCode = values.appearanceStructureCode;
    formData.functionalPerformanceCode = values.functionalPerformanceCode;
    formData.productCode = values.productCode;
    onSearch();
  };

  const onAdd = () => {
    openDialog("add");
  };

  const onEdit = () => {
    currentId.value = currentRow.value.id;
    openDialog("edit", currentRow.value);
  };

  const openDialog = async (type: string, row?) => {
    const titleObj = { add: "新增", edit: "修改" };
    const title = titleObj[type];
    const formRef = ref();

    const _formData = reactive({
      productCode: row?.productCode,
      id: row?.id,
      productLevel: row?.productLevel,
      corporateBrand: row?.corporateBrand?.split("-")[0]?.trim(),
      productType: row?.productType?.split("-")[0]?.trim(),
      projectCode: row?.projectCode,
      productImgs: row?.pmProductImageVOS?.map((el) => ({ ...el, url: "/api" + el.virtualPath })) || [],
      // customerModel: row?.customerModel,
      appearanceStructureCode: row?.appearanceStructureCode,
      functionalPerformanceCode: row?.functionalPerformanceCode
    });

    watch(_formData, (newVal: any) => {
      const calcProdNo =
        (newVal.corporateBrand ?? "") +
        (newVal.productType ?? "") +
        (+newVal.productLevel > 0 ? newVal.productLevel : "") +
        (newVal.projectCode ?? "") +
        (newVal.appearanceStructureCode && newVal.appearanceStructureCode !== "-" ? newVal.appearanceStructureCode : "") +
        (newVal.functionalPerformanceCode ?? "");
      _formData.productCode = calcProdNo;
    });

    addDialog({
      title: `${title}`,
      props: {
        formInline: _formData,
        formRules: formRules,
        formConfigs: formConfigs({ classList, brandList })
      },
      width: "800px",
      draggable: true,
      destroyOnClose: true,
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
    const dataCopy = cloneDeep(data);
    const brandName = dataCopy.corporateBrand + " - " + originBrandList.value.find((item) => item.optionName === dataCopy.corporateBrand)?.optionValue;
    dataCopy.corporateBrand = brandName;
    const classifyName = dataCopy.productType + " - " + originClassList.value.find((item) => item.categoryNo === dataCopy.productType)?.categoryName;
    dataCopy.productType = classifyName;

    delete dataCopy.productImgs;
    if (type === "add") delete dataCopy.id;
    if (deleteFileIds.value.length) dataCopy.deleteImagesIds = deleteFileIds.value;
    const reqParams = new FormData();
    Object.keys(dataCopy).forEach((el) => {
      reqParams.append(el, dataCopy[el]);
    });
    if (data.productImgs.length) {
      data.productImgs.filter((el) => el.raw).forEach((el) => reqParams.append("files", el.raw));
    }
    const API = { add: insertProductStoreList, edit: updateProductStoreList };
    API[type](reqParams)
      .then((res) => {
        if (res.status === 200 || res.data) {
          deleteFileIds.value = [];
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
      raw: true
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
      `产品库表${timeStep}.xlsx`
    );
  };

  const onDelete = () => {
    const row = currentRow.value;
    ElMessageBox.confirm(`确认要删除型号为【${row.productCode}】的产品吗?`, "系统提示", {
      type: "warning",
      draggable: true,
      cancelButtonText: "取消",
      confirmButtonText: "确定",
      dangerouslyUseHTMLString: true
    })
      .then(() => {
        deleteProductStoreList({ deleteIds: [row.id] }).then((res) => {
          if (res.status === 200 || res.data) {
            ElMessage({ message: `删除成功`, type: "success" });
            currentRow.value = {};
            onSearch();
          }
        });
      })
      .catch(() => {});
  };

  const beforeOnEdit = () => {
    if (JSON.stringify(currentRow.value) == "{}" || !currentRow.value) {
      ElMessage({ message: "请选择一条记录", type: "warning" });
      return;
    } else {
      onEdit();
    }
  };

  const beforeOnDelete = () => {
    if (JSON.stringify(currentRow.value) == "{}" || !currentRow.value) {
      ElMessage({ message: "请选择一条记录", type: "warning" });
      return;
    } else {
      onDelete();
    }
  };

  const rowClick = (row) => {
    currentRow.value = row;
    emits("selectRow", row);
  };

  const rowDbClick = (row) => {
    if (isModal) return;
    console.log("row db click", row);
    currentRow.value = row;
    onEdit();
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
      case "删除":
        beforeOnDelete();
        break;

      default:
        break;
    }
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler, type: "primary", text: "新增" },
    { clickHandler, type: "warning", text: "修改" },
    { clickHandler, type: "danger", text: "删除" },
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

  const getMergeImgUlrList = (apiList, resType): any => {
    const resultArrList = apiList.map((item) => "/api" + item.virtualPath);
    return resType ? resultArrList[0] : resultArrList;
  };

  return {
    loading,
    columns,
    dataList,
    maxHeight,
    searchOptions,
    buttonList,
    pagination,
    getMergeImgUlrList,
    onSearch,
    onFresh,
    onAdd,
    onEdit,
    handleTagSearch,
    onDelete,
    rowDbClick,
    rowClick,
    onExport,
    beforeOnEdit,
    handleSizeChange,
    handleCurrentChange,
    onCurrentChange,
    beforeOnDelete
  };
};
