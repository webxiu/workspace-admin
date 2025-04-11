/*
 * @Author: Hailen
 * @Date: 2023-07-06 14:57:33
 * @Last Modified by: Hailen
 * @Last Modified time: 2025-03-18 10:50:45
 */

import { h, nextTick, onMounted, reactive, ref } from "vue";
import { TeamMemberItemType } from "@/api/workbench/teamManage";

import { message } from "@/utils/message";
import { type PaginationProps } from "@pureadmin/table";
import { ElMessage, ElMessageBox, FormRules } from "element-plus";
import { useEleHeight } from "@/hooks";
import {
  backMaterialInfo,
  delMaterialInfo,
  disabledMaterialInfo,
  enableMaterialInfo,
  exportMaterialList,
  fetchMaterialList,
  getMaterialGroupTreeData,
  pushDownMaterialInfo,
  submitMaterialInfo
} from "@/api/plmManage";
import { useRoute, useRouter } from "vue-router";
import { getMenuColumns, setColumn, updateButtonList, usePageSelect, RendererType } from "@/utils/table";
import { PAGE_CONFIG } from "@/config/constant";
import { commonSubmit } from "@/api/systemManage";
import { addDialog } from "@/components/ReDialog";
import EditForm from "@/components/EditForm/index.vue";
import { QueryParamsType } from "@/components/BlendedSearch/index.vue";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { LoadingType } from "@/components/ButtonList/index.vue";
import type { ColDef } from "ag-grid-community";
import { getAgGridColumns } from "@/components/AgGridTable/config";

/** 组别类型 */
export interface DepGroupItemTree {
  id: number;
  parentId: number;
  title: string;
  field: string;
  spread: boolean;
  checked: boolean;
  disabled: boolean;
  iconClass: string;
  href: string;
  checkArr: number[];
  type: string;
  groupCode: string;
  deptId: number;
  leaderId: number;
  groupRoot: boolean;
  children: DepGroupItemTree[];
}

export type HandleType = "add" | "edit";

export function useTable(emits, { isModal, productCode }) {
  const isAgTable = ref(true);
  const columnDefs = ref<ColDef[]>([]);
  const rowsData = ref([]);
  const tableRef = ref();
  const currentRow: any = ref({});
  const curNodeName = ref("0");
  const curNodeLabel = ref("0");
  const loading = ref<boolean>(false);
  const dataList = ref<TeamMemberItemType[]>([]);
  const columns = ref<TableColumnList[]>([]);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 95);
  const router = useRouter();
  const route = useRoute();
  const categoryTreeData = ref([]);
  const loadingStatus = ref<LoadingType>({ loading: false, text: "" });
  const formData = reactive({
    page: 1,
    limit: PAGE_CONFIG.pageSize,
    startDate: "",
    endDate: "",
    materialGroups: "",
    isfrozen: "0"
  });

  const queryParams = reactive<QueryParamsType>({ isfrozen: { value: "0", valueLabel: "否" } });
  const searchOptions = reactive<SearchOptionType[]>([
    { label: "物料名称", value: "name" },
    { label: "规格型号", value: "specification" },
    { label: "模号", value: "model" },
    { label: "日期范围", value: "date", type: "daterange", format: "YYYY-MM-DD", startKey: "startDate", endKey: "endDate" },
    {
      label: "物料状态",
      value: "state",
      children: [
        { label: "待提交", value: "0" },
        { label: "审核中", value: "1" },
        { label: "已审核", value: "2" },
        { label: "重新审核", value: "3" }
      ]
    },
    {
      label: "是否禁用",
      value: "isfrozen",
      children: [
        { label: "是", value: "1" },
        { label: "否", value: "0" }
      ]
    }
  ]);

  onMounted(async () => {
    getColumnConfig();
    getOptions();
  });
  const { setSelectCheckbox, setSelectChange, setSelectAllChange } = usePageSelect({ tableRef, dataList, rowsData, uniId: "id" });

  const getColumnConfig = async () => {
    const pushState: RendererType = ({ row }) => (row.pushState == 1 ? "已下推" : "待下推");
    const cbcertification: RendererType = ({ row }) => (row.cbcertification == 1 ? "是" : "否");
    const isfrozen: RendererType = ({ row }) => (row.isfrozen == 1 ? "是" : "否");

    let columnData: TableColumnList[] = [
      { label: "物料编号", fixed: true, prop: "number", minWidth: 200 },
      { label: "物料名称", prop: "name", minWidth: 240, fixed: true },
      { label: "规格型号", prop: "specification", minWidth: 260 },
      { label: "模号", prop: "model", minWidth: 120 },
      { label: "基本单位", prop: "baseUnitName", minWidth: 120 },
      { label: "物料属性", prop: "erpClsidName", minWidth: 120 },
      { label: "物料种类", prop: "materialTypeName", minWidth: 120 },
      { label: "物料分组", prop: "materialGroupName", minWidth: 120 },
      { label: "客供物料", prop: "customerProvidedName", minWidth: 120 },
      { label: "成品类型", prop: "goodsTypeName", minWidth: 120 },
      { label: "仓库", prop: "warehouseName", minWidth: 120 },
      { label: "采购单位", prop: "purchaseUnitName", minWidth: 120 },
      { label: "库存单位", prop: "stockUnitName", minWidth: 120 },
      { label: "销售单位", prop: "saleUnitName", minWidth: 120 },
      { label: "生产车间", prop: "manufacturingShopName", minWidth: 120 },
      { label: "物料状态", prop: "stateName", minWidth: 120 },
      { label: "下推状态", slot: "pushState", prop: "pushState", minWidth: 120 },
      { label: "是否认证", slot: "cbcertification", prop: "cbcertification", minWidth: 120 },
      { label: "是否禁用", slot: "isfrozen", prop: "isfrozen", minWidth: 120 },
      { label: "创建人", prop: "createUserName", minWidth: 120 },
      { label: "创建时间", prop: "createDate", minWidth: 220 },
      { label: "提交人", prop: "submitUserName", minWidth: 120 },
      { label: "提交时间", prop: "submitDate", minWidth: 220 },
      { label: "最后修改人", prop: "modifyUserName", minWidth: 120 },
      { label: "最后修改时间", prop: "modifyDate", minWidth: 220 },
      { label: "旧物料编码", prop: "oldCode", minWidth: 120 }
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false, selectionColumn: { hide: false }, radioColumn: false, clearFixed: isModal });
    columnDefs.value = getAgGridColumns({
      columnData,
      operationColumn: false,
      selectionColumn: { hide: false },
      radioColumn: false,
      clearFixed: isModal,
      columnsRender: { pushState, cbcertification, isfrozen }
    });
  };

  const getOptions = () => {
    getMaterialGroupTreeData({}).then((res: any) => {
      if (res.data) {
        categoryTreeData.value = res.data;
      }
    });
  };

  const handleNodeClick = (treeItem) => {
    curNodeName.value = treeItem.id;
    curNodeLabel.value = treeItem.groupCode;
    const finalArr = [];
    const loopFindId = (item) => {
      finalArr.push(item.id);
      if (item.children && Array.isArray(item.children) && item.children.length) {
        item.children.forEach((el) => {
          loopFindId(el);
        });
      }
    };
    loopFindId(treeItem);

    formData.materialGroups = String(finalArr);
    onSearch();

    console.log(finalArr, "ids");
  };

  /**
   * 获取部门人员列表
   * @param type 请求类型 (all:表单搜索请求, single: 点击左侧菜单请求)
   */
  const onSearch = (rowIndex?) => {
    currentRow.value = {};
    loading.value = true;
    fetchMaterialList({ ...formData, goodModel: productCode ?? undefined })
      .then((res: any) => {
        const { total, records } = res.data;
        loading.value = false;
        pagination.total = total;
        dataList.value = records;
        setSelectCheckbox();
        if (typeof rowIndex === "number" && rowIndex >= 0) {
          currentRow.value = dataList.value[rowIndex];
          nextTick(() => {
            setRowSelected(dataList.value[rowIndex], false);
            currentRow.value = dataList.value[rowIndex];
          });
        } else {
          currentRow.value = {};
        }
      })
      .catch((err) => {
        loading.value = false;
      });
  };

  const onFresh = () => {
    getColumnConfig();
    const rowIndex = dataList.value.findIndex((item) => item.id === currentRow.value.id);
    onSearch(rowIndex);
  };

  const onTagSearch = (values) => {
    Object.assign(formData, values);
    formData.page = 1;
    onSearch();
  };

  // 新增分组
  const onAdd = () => {
    router.push({
      path: "/plmManage/basicData/materialMgmt/add",
      query: {
        number: curNodeName.value,
        code: curNodeLabel.value,
        type: "add",
        isNewTag: "yes",
        menuId: route.query.menuId
      }
    });
  };

  // 查看物料
  const dbClick = (row) => {
    if (isModal) return;
    if (row.state === 2) {
      router.push({
        path: `/plmManage/basicData/materialMgmt/view`,
        query: {
          id: row.id,
          type: "view",
          isNewTag: "yes",
          menuId: route.query.menuId,
          title: currentRow.value.number
        }
      });
    }

    if (row.state === 3) {
      router.push({
        path: `/plmManage/basicData/materialMgmt/edit`,
        query: {
          id: row.id,
          type: "edit",
          isNewTag: "yes",
          menuId: route.query.menuId,
          title: currentRow.value.number
        }
      });
    }
  };

  // 修改分组
  const onEdit = () => {
    if (JSON.stringify(currentRow.value) !== "{}") {
      if (currentRow.value.state === 2) {
        message.warning("已审核的物料不能修改");
        return;
      }
      router.push({
        path: `/plmManage/basicData/materialMgmt/edit`,
        query: {
          type: "edit",
          isNewTag: "yes",
          id: currentRow.value.id,
          menuId: route.query.menuId,
          title: currentRow.value.number
        }
      });
      return;
    }
    ElMessage({
      message: "请选择一条记录",
      type: "warning"
    });
  };

  // 删除分组
  const remove = () => {
    if (rowsData.value.length) {
      if (currentRow.value.state === 2) {
        message.warning("已审核的物料不能删除");
        return;
      }
      ElMessageBox.confirm(`确认要删除名称为【${String(rowsData.value.map((item) => item.name))}】的物料吗?`, "系统提示", {
        type: "warning",
        draggable: true,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          // delMaterialInfo({ id: currentRow.value.id }).then((res) => {
          delMaterialInfo(rowsData.value.map((item) => item.id)).then((res) => {
            if (res.data) {
              message.success(`删除成功`);
              onSearch();
            }
          });
        })
        .catch(() => {});

      return;
    }
    ElMessage({
      message: "请选择一条记录",
      type: "warning"
    });
  };

  const openDisableDialog = (rowsData) => {
    const mFormData = reactive({ forbiddenReason: "" });
    const mFormRef = ref();
    const mFormRules = reactive<FormRules>({
      forbiddenReason: [{ required: true, message: "禁用原因为必填项", trigger: "submit" }]
    });
    addDialog({
      title: `禁用物料`,
      props: {
        formInline: mFormData,
        formRules: mFormRules,
        formProps: { size: "small" },
        formConfigs: [
          {
            label: "禁用原因",
            colProp: { span: 24 },
            prop: "forbiddenReason",
            render: ({ formModel, row }) => {
              return <el-input type="textarea" v-model={formModel[row.prop]} autosize={{ minRows: 4 }} />;
            }
          }
        ]
      },
      width: "500px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(EditForm, { ref: mFormRef }),
      beforeSure: (done) => {
        const FormRef = mFormRef.value.getRef();
        const ids = rowsData.value.map((item) => item.id);
        const names = rowsData.value.map((item) => item.name);
        FormRef.validate(async (valid) => {
          if (valid) {
            ElMessageBox.confirm(`确认要禁用名称为【${names}】的物料吗?`, "系统提示", {
              type: "warning",
              draggable: true,
              cancelButtonText: "取消",
              confirmButtonText: "确定",
              dangerouslyUseHTMLString: true
            }).then(() => {
              disabledMaterialInfo({ ids, forbiddenReason: mFormData.forbiddenReason }).then((res) => {
                if (res.data) {
                  done();
                  ElMessage({ message: "操作成功", type: "success" });
                  onSearch();
                }
              });
            });
          }
        });
      }
    });
  };

  // 提交物料
  const businessAction = ({ text }) => {
    if (!rowsData.value.length) {
      return ElMessage({ message: "请选择记录", type: "warning" });
    }
    currentRow.value = rowsData.value[0];
    if (text === "禁用") {
      openDisableDialog(rowsData);
      return;
    }
    if (["反禁用"].includes(text)) {
      const typeApi = { 反禁用: enableMaterialInfo };
      const id = rowsData.value.map((item) => item.id);
      const names = rowsData.value.map((item) => item.name);
      ElMessageBox.confirm(`确认要${text}名称为【${names}】的物料吗?`, "系统提示", {
        type: "warning",
        draggable: true,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          typeApi[text](id).then((res) => {
            if (res.data) {
              ElMessage({ message: "操作成功", type: "success" });
              onSearch();
            }
          });
        })
        .catch(console.log);
      return;
    }
    if (JSON.stringify(currentRow.value) !== "{}") {
      if (text === "正查") {
        router.push(`/plmManage/basicData/bomFront/index?menuId=41&number=${currentRow.value.number}`);
        return;
      }

      if (text === "反查") {
        router.push(`/plmManage/basicData/bomOver/index?menuId=52&number=${currentRow.value.number}`);
        return;
      }

      if (text === "履历") {
        router.push(`/plmManage/basicData/materialMgmt/history/index?materialId=${currentRow.value.id}`);
        return;
      }

      ElMessageBox.confirm(`确认要${text}名称为【${currentRow.value.name}】的物料吗?`, "系统提示", {
        type: "warning",
        draggable: true,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          loading.value = true;
          let res: any;
          if (text === "提交") {
            // res = submitMaterialInfo({ id: currentRow.value.id });
            res = commonSubmit({ billId: "10007", billNo: currentRow.value.billNo });
          } else if (text === "回退") {
            res = backMaterialInfo({ id: currentRow.value.id });
          } else if (text === "下推") {
            res = pushDownMaterialInfo({ id: currentRow.value.id });
          }
          res
            .then((res) => {
              if (res.data) {
                message.success(`操作成功`);
                const rowIndex = dataList.value.findIndex((item) => item.id === currentRow.value.id);
                onSearch(rowIndex);
              }
            })
            .finally(() => (loading.value = false));
        })
        .catch(() => {});
    } else {
      ElMessage({ message: "请选择一条记录", type: "warning" });
      return;
    }
  };

  // 导出
  const onExport = () => {
    loading.value = true;
    const excelHeader = columns.value
      .map((item, index) => {
        return { field: item.prop, title: item.label, width: 160, key: `0-${index}`, hide: false, colspan: 1, rowspan: 1, type: "normal", colGroup: false };
      })
      .filter((item) => item.field && item.field !== "index");

    const headConfig = {
      excel: {
        excelName: "物料管理",
        excelHeader: JSON.stringify(excelHeader)
      },
      ...formData,
      page: 1,
      limit: 100000
    };

    exportMaterialList(headConfig)
      .then((res: any) => {
        window.open("/api" + res.data, "_blank");
      })
      .catch((err) => {
        console.log("err", err);
      })
      .finally(() => (loading.value = false));
  };

  // 分页相关
  function handleSizeChange(val: number) {
    formData.limit = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    formData.page = val;
    onSearch();
  }

  // 点击表格行
  const rowClick = (row) => {
    setRowSelected(row, true);
    currentRow.value = row;
    emits("select", row);
  };

  function onSelect(rows: any[], row: any) {
    setSelectChange({ rows, row });
  }

  function onSelectAll(rows: any[]) {
    setSelectAllChange(rows);
  }

  const onSelectionChange = (rows) => {
    if (!rowsData.value.length) {
      currentRow.value = {};
    }
  };

  const rowStyle = ({ row, data }) => {
    if ((row?.isfrozen || data?.isfrozen) === "1") {
      return { color: "red" };
    }
  };

  function setRowSelected(row, isClear = false) {
    if (tableRef.value?.getTableRef) {
      if (isClear) tableRef.value?.getTableRef()?.clearSelection();
      tableRef.value?.getTableRef()?.toggleRowSelection(row, true);
    }
  }

  function onSwitchTable() {
    isAgTable.value = !isAgTable.value;
    currentRow.value = undefined;
    rowsData.value = [];
  }

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "新增", isDropDown: false },
    { clickHandler: onEdit, type: "warning", text: "修改", isDropDown: false },
    { clickHandler: remove, type: "danger", text: "删除", isDropDown: false },
    { clickHandler: onExport, type: "default", text: "导出", isDropDown: true },
    { clickHandler: businessAction, type: "primary", text: "提交", isDropDown: true },
    { clickHandler: businessAction, type: "primary", text: "回退", isDropDown: true },
    { clickHandler: businessAction, type: "primary", text: "下推", isDropDown: true },
    { clickHandler: businessAction, type: "primary", text: "禁用", isDropDown: true },
    { clickHandler: businessAction, type: "primary", text: "反禁用", isDropDown: true },
    { clickHandler: businessAction, type: "primary", text: "正查", isDropDown: true },
    { clickHandler: businessAction, type: "primary", text: "反查", isDropDown: true },
    { clickHandler: businessAction, type: "primary", text: "履历", isDropDown: true }
  ]);

  return {
    isAgTable,
    columnDefs,
    tableRef,
    loading,
    columns,
    dataList,
    maxHeight,
    pagination,
    queryParams,
    searchOptions,
    buttonList,
    curNodeName,
    loadingStatus,
    categoryTreeData,
    rowStyle,
    onFresh,
    dbClick,
    rowClick,
    onSelect,
    onSelectAll,
    onTagSearch,
    onSwitchTable,
    handleNodeClick,
    handleSizeChange,
    onSelectionChange,
    handleCurrentChange
  };
}
