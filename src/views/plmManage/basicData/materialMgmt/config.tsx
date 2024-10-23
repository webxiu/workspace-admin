/*
 * @Author: Hailen
 * @Date: 2023-07-06 14:57:33
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-21 17:25:27
 */

import { nextTick, onMounted, reactive, ref } from "vue";
import { TeamMemberItemType } from "@/api/workbench/teamManage";

import { message } from "@/utils/message";
import { type PaginationProps } from "@pureadmin/table";
import { ElMessage, ElMessageBox } from "element-plus";
import { useEleHeight } from "@/hooks";
import {
  backMaterialInfo,
  delMaterialInfo,
  disabledMaterialInfo,
  enableMaterialInfo,
  exportMaterialList,
  fetchMaterialList,
  pushDownMaterialInfo,
  submitMaterialInfo
} from "@/api/plmManage";
import { useRoute, useRouter } from "vue-router";
import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { PAGE_CONFIG } from "@/config/constant";
import { commonSubmit } from "@/api/systemManage";

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
const columnsDragDom = ref([]);
const selectRows: any = ref([]);
const materialMainTable = ref();
let formData = reactive({
  page: 1,
  limit: PAGE_CONFIG.pageSize,
  date: "",
  startDate: "",
  endDate: "",
  materialGroups: "",
  isfrozen: "0"
});

export const getConfig = async (buttonList) => {
  const columnsDrag: TableColumnList[] = [
    { label: "选择" },
    { label: "序号", prop: "index" },
    { label: "物料编号", prop: "number" },
    { label: "物料名称", prop: "name" },
    { label: "规格型号", prop: "specification" },
    { label: "模号", prop: "model" },
    { label: "基本单位", prop: "baseUnitName" },
    { label: "物料属性", prop: "erpClsidName" },
    { label: "物料种类", prop: "materialTypeName" },
    { label: "物料分组", prop: "materialGroupName" },
    { label: "客供物料", prop: "customerProvidedName" },
    { label: "成品类型", prop: "goodsTypeName" }, //
    { label: "仓库", prop: "warehouseName" },
    { label: "采购单位", prop: "purchaseUnitName" },
    { label: "库存单位", prop: "stockUnitName" },
    { label: "销售单位", prop: "saleUnitName" },
    { label: "生产车间", prop: "manufacturingShopName" }, //
    { label: "物料状态", prop: "stateName" },
    { label: "下推状态", prop: "pushState" },
    { label: "是否认证", prop: "cbcertification" },
    { label: "是否禁用", prop: "isfrozen" },
    { label: "创建人", prop: "createUserName" },
    { label: "创建时间", prop: "createDate" },
    { label: "提交人", prop: "submitUserName" },
    { label: "提交时间", prop: "submitDate" },
    { label: "最后修改人", prop: "modifyUserName" },
    { label: "最后修改时间", prop: "modifyDate" },
    { label: "旧物料编码", prop: "oldCode" }
  ];

  let columns: TableColumnList[] = [
    { label: "", align: "center", width: 62, fixed: true, cellRenderer: () => <el-radio label="&nbsp;" size="small" /> },
    { label: "序号", type: "index", width: 65, fixed: true, cellRenderer: ({ $index }) => <span>{(formData.page - 1) * formData.limit + $index + 1}</span> },
    { label: "物料编号", fixed: true, prop: (index) => columnsDragDom.value[index].prop as string, minWidth: 200 },
    { label: "物料名称", prop: (index) => columnsDragDom.value[index].prop as string, minWidth: 240, fixed: true },
    { label: "规格型号", prop: (index) => columnsDragDom.value[index].prop as string, minWidth: 260 },
    { label: "模号", prop: (index) => columnsDragDom.value[index].prop as string, minWidth: 120 },
    { label: "基本单位", prop: (index) => columnsDragDom.value[index].prop as string, minWidth: 120 },
    { label: "物料属性", prop: (index) => columnsDragDom.value[index].prop as string, minWidth: 120 },
    { label: "物料种类", prop: (index) => columnsDragDom.value[index].prop as string, minWidth: 120 },
    { label: "物料分组", prop: (index) => columnsDragDom.value[index].prop as string, minWidth: 120 },
    { label: "客供物料", prop: (index) => columnsDragDom.value[index].prop as string, minWidth: 120 },
    { label: "成品类型", prop: (index) => columnsDragDom.value[index].prop as string, minWidth: 120 },
    { label: "仓库", prop: (index) => columnsDragDom.value[index].prop as string, minWidth: 120 },
    { label: "采购单位", prop: (index) => columnsDragDom.value[index].prop as string, minWidth: 120 },
    { label: "库存单位", prop: (index) => columnsDragDom.value[index].prop as string, minWidth: 120 },
    { label: "销售单位", prop: (index) => columnsDragDom.value[index].prop as string, minWidth: 120 },
    { label: "生产车间", prop: (index) => columnsDragDom.value[index].prop as string, minWidth: 120 },
    { label: "物料状态", prop: (index) => columnsDragDom.value[index].prop as string, minWidth: 120 },
    { label: "下推状态", slot: "pushState", prop: (index) => columnsDragDom.value[index].prop as string, minWidth: 120 },
    { label: "是否认证", slot: "cbcertification", prop: (index) => columnsDragDom.value[index].prop as string, minWidth: 120 },
    { label: "是否禁用", slot: "isfrozen", prop: (index) => columnsDragDom.value[index].prop as string, minWidth: 120 },
    { label: "创建人", prop: (index) => columnsDragDom.value[index].prop as string, minWidth: 120 },
    { label: "创建时间", prop: (index) => columnsDragDom.value[index].prop as string, minWidth: 220 },
    { label: "提交人", prop: (index) => columnsDragDom.value[index].prop as string, minWidth: 120 },
    { label: "提交时间", prop: (index) => columnsDragDom.value[index].prop as string, minWidth: 220 },
    { label: "最后修改人", prop: (index) => columnsDragDom.value[index].prop as string, minWidth: 120 },
    { label: "最后修改时间", prop: (index) => columnsDragDom.value[index].prop as string, minWidth: 220 },
    { label: "旧物料编码", prop: (index) => columnsDragDom.value[index].prop as string, minWidth: 120 }
  ];

  columnsDragDom.value = columnsDrag;

  const { columnArrs, buttonArrs } = await getMenuColumns();
  const [menuCols] = columnArrs;
  if (menuCols?.length) {
    columns = setColumn({
      columnData: menuCols,
      operationColumn: false,
      selectionColumn: { hide: false },
      radioColumn: false,
      indexColumn: { fixed: true }
    });
  }

  updateButtonList(buttonList, buttonArrs[0]);
  return columns;
};

export function useTable(emits, { isModal, productCode }) {
  const formRef = ref();
  const currentRow: any = ref({});
  const curNodeName = ref("0");
  const curNodeLabel = ref("0");
  const depGroupTree = ref<DepGroupItemTree[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref<TeamMemberItemType[]>([]);
  const columns = ref<TableColumnList[]>([]);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 40 + 54);
  const router = useRouter();
  const route = useRoute();

  onMounted(async () => {
    const _columns = await getConfig(buttonList);
    // 如果是在弹框中加载不浮动列
    _columns.forEach((item) => isModal && (item.fixed = undefined));
    columns.value = _columns;
    onSearch();
  });

  const handleNodeClick = (treeItem) => {
    curNodeName.value = treeItem.id;
    curNodeLabel.value = treeItem.groupCode;
    console.log(treeItem, "当前的tree");

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
    // 处理时间范围
    const { date = "" } = formData;
    if (date) {
      const [startTime, endTime] = date.split("~").map((item) => item.trim());
      formData.startDate = startTime;
      formData.endDate = endTime;
    }

    loading.value = true;
    fetchMaterialList({ ...formData, goodModel: productCode ?? undefined })
      .then((res: any) => {
        const { total, records } = res.data;
        loading.value = false;
        pagination.total = total;
        dataList.value = records;

        if (typeof rowIndex === "number" && rowIndex >= 0) {
          currentRow.value = dataList.value[rowIndex];
          nextTick(() => {
            materialMainTable.value?.getTableRef()?.toggleRowSelection(dataList.value[rowIndex], true);
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
    getConfig(buttonList);
    const rowIndex = dataList.value.findIndex((item) => item.id === currentRow.value.id);
    onSearch(rowIndex);
  };

  const handleTagSearch = (values) => {
    formData = { ...values, page: 1, limit: PAGE_CONFIG.pageSize };
    onSearch();
  };

  function GetDeptName(data: DepGroupItemTree[], id: number) {
    if (data.length) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].id == id) return data[i].title;
        return GetDeptName(data[i].children, id);
      }
    }
    return null;
  }

  // 新增分组
  const onAdd = () => {
    router.push({
      path: "/plmManage/basicData/materialMgmt/add",
      query: { number: curNodeName.value, code: curNodeLabel.value, type: "add", isNewTag: "yes", menuId: route.query.menuId }
    });
  };

  // 查看物料
  const dbClick = (row) => {
    if (isModal) return;
    if (row.state === 2) {
      router.push({
        path: `/plmManage/basicData/materialMgmt/view`,
        query: { id: row.id, type: "view", isNewTag: "yes", menuId: route.query.menuId }
      });
    }

    if (row.state === 3) {
      router.push({
        path: `/plmManage/basicData/materialMgmt/edit`,
        query: { id: row.id, type: "edit", isNewTag: "yes", menuId: route.query.menuId }
      });
    }
  };

  // 修改分组
  const onEdit = () => {
    if (JSON.stringify(currentRow.value) !== "{}") {
      if (currentRow.value.state === 2) {
        ElMessage({
          message: "已审核的物料不能修改",
          type: "warning"
        });
        return;
      }
      router.push({
        path: `/plmManage/basicData/materialMgmt/edit`,
        query: { id: currentRow.value.id, type: "edit", isNewTag: "yes", menuId: route.query.menuId }
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
    if (selectRows.value.length) {
      if (currentRow.value.state === 2) {
        ElMessage({
          message: "已审核的物料不能删除",
          type: "warning"
        });
        return;
      }
      ElMessageBox.confirm(`确认要删除名称为【${String(selectRows.value.map((item) => item.name))}】的物料吗?`, "系统提示", {
        type: "warning",
        draggable: true,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          // delMaterialInfo({ id: currentRow.value.id }).then((res) => {
          delMaterialInfo(selectRows.value.map((item) => item.id)).then((res) => {
            if (res.data) {
              message(`删除成功`, { type: "success" });
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

  // 提交物料
  const businessAction = ({ text }) => {
    if (!selectRows.value.length) {
      return ElMessage({ message: "请选择记录", type: "warning" });
    }
    currentRow.value = selectRows.value[0];
    if (["禁用", "反禁用"].includes(text)) {
      const typeApi = { 禁用: disabledMaterialInfo, 反禁用: enableMaterialInfo };
      const id = selectRows.value.map((item) => item.id);
      const names = selectRows.value.map((item) => item.name);
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
                message(`操作成功`, { type: "success" });
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
    materialMainTable.value?.getTableRef()?.clearSelection();
    materialMainTable.value?.getTableRef()?.toggleRowSelection(row);
    currentRow.value = row;
    emits("selectRow", row);
  };

  // 导出
  const onExport = () => {
    loading.value = true;
    const excelHeader = columnsDragDom.value
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

  const onSelectionChange = (rows) => {
    selectRows.value = rows;
    if (!selectRows.value.length) {
      currentRow.value = {};
    }
  };

  const rowStyle = ({ row }) => {
    if (row.isfrozen === "1") {
      return {
        color: "red"
      };
    }
  };

  return {
    loading,
    dataList,
    columns,
    pagination,
    maxHeight,
    buttonList,
    curNodeName,
    materialMainTable,
    rowStyle,
    onFresh,
    dbClick,
    rowClick,
    handleSizeChange,
    handleCurrentChange,
    onSelectionChange,
    handleNodeClick,
    handleTagSearch
  };
}
