/*
 * @Author: 661
 * @Date: 2023-07-06 14:57:33
 * @Last Modified by: Hailen
 * @Last Modified time: 2025-03-18 11:37:23
 */

import { onMounted, reactive, ref } from "vue";
import { TeamMemberItemType } from "@/api/workbench/teamManage";

import { message } from "@/utils/message";
import { type PaginationProps } from "@pureadmin/table";
import { ElMessage, ElMessageBox } from "element-plus";
import { useEleHeight } from "@/hooks";
import {
  backBomData,
  delBomTableData,
  disabledBomData,
  exportBomTableData,
  fetchBomLeftTreeData,
  fetchBomTableData,
  pushDownBomData,
  submitBomData,
  unDisabledBomData
} from "@/api/plmManage";
import { useRoute, useRouter } from "vue-router";
import { getMenuColumns, setColumn, updateButtonList, RendererType } from "@/utils/table";
import { PAGE_CONFIG } from "@/config/constant";
import { commonSubmit } from "@/api/systemManage";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { LoadingType } from "@/components/ButtonList/index.vue";
import type { ColDef } from "ag-grid-community";
import { getAgGridColumns } from "@/components/AgGridTable/config";
import ContextMenu from "./components/bomGroup/contextMenu.vue";
import { ContextMenuItem } from "./components/bomGroup/contextMenu.vue";

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

export function useTable() {
  const isAgTable = ref(true);
  const columnDefs = ref<ColDef[]>([]);
  const route = useRoute();
  const router = useRouter();
  const currentRow: any = ref({});
  const curNodeName = ref("0");
  const curNodeLabel = ref();
  const loading = ref<boolean>(false);
  const columns = ref<TableColumnList[]>([]);
  const dataList = ref<TeamMemberItemType[]>([]);
  const categoryTreeData = ref([]);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 95);
  const loadingStatus = ref<LoadingType>({ loading: false, text: "" });
  const formData = reactive({
    materialName: "",
    billState: "",
    page: 1,
    limit: PAGE_CONFIG.pageSize,
    groupIdList: []
  });
  const searchOptions = reactive<SearchOptionType[]>([
    { label: "父级物料名称", value: "materialName" },
    {
      label: "审核状态",
      value: "billState",
      children: [
        { label: "待提交", value: "0" },
        { label: "审核中", value: "1" },
        { label: "已审核", value: "2" },
        { label: "重新审核", value: "3" }
      ]
    }
  ]);

  const contextMenuRef = ref<InstanceType<typeof ContextMenu>>();
  const menuItems = ref<ContextMenuItem[]>([
    { name: "新增", action: (item) => contextMenuRef.value.onAdd(item, fetchLeftData) },
    { name: "修改", action: (item) => contextMenuRef.value.onEdit(item, fetchLeftData) },
    { name: "删除", action: (item) => contextMenuRef.value.onDelete(item, fetchLeftData) }
  ]);

  onMounted(() => {
    getColumnConfig();
    fetchLeftData();
  });

  const getColumnConfig = async () => {
    const disableStatus: RendererType = ({ row }) => (row.disableStatus == 1 ? "禁用11" : "未禁用");
    let columnData: TableColumnList[] = [
      { label: "BOM编号", fixed: true, prop: "number", minWidth: 200 },
      { label: "BOM名称", prop: "name", minWidth: 240, fixed: true },
      { label: "BOM分组", prop: "groupName", minWidth: 120 },
      { label: "父级物料编码", prop: "materialNumber", minWidth: 120 },
      { label: "父级物料名称", prop: "materialName", minWidth: 120 },
      { label: "父级物料规格", prop: "specification", minWidth: 120 },
      { label: "审核状态", prop: "stateName", minWidth: 120 },
      { label: "下推状态", prop: "pushName", minWidth: 120 },
      { label: "禁用状态", slot: "disableStatus", prop: "disableStatus", minWidth: 120 },
      { label: "禁用人", prop: "disableUserName", minWidth: 120 },
      { label: "禁用时间", prop: "disableDate", minWidth: 220 },
      { label: "创建人", prop: "createUserName", minWidth: 120 },
      { label: "创建时间", prop: "createDate", minWidth: 220 },
      { label: "最后修改人", prop: "modifyUserName", minWidth: 120 },
      { label: "最后修改时间", prop: "modifyDate", minWidth: 220 }
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, formData, operationColumn: false });
    columnDefs.value = getAgGridColumns({ columnData, formData, operationColumn: false, columnsRender: { disableStatus } });
  };

  const fetchLeftData = () => {
    fetchBomLeftTreeData({}).then((res: any) => {
      categoryTreeData.value = res.data.bomGroupSelectTree;
      contextMenuRef.value.treeSelectData = res.data.bomGroupSelectTree;
    });
  };

  const handleNodeClick = (treeItem) => {
    curNodeName.value = treeItem.id;
    curNodeLabel.value = treeItem.id;
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
    formData.groupIdList = finalArr;
    onSearch();
  };

  /**
   * 获取部门人员列表
   * @param type 请求类型 (all:表单搜索请求, single: 点击左侧菜单请求)
   */
  const onSearch = (rowIndex?) => {
    currentRow.value = {};
    loading.value = true;
    fetchBomTableData(formData)
      .then((res: any) => {
        const data = res.data;
        loading.value = false;
        pagination.total = data.total;
        dataList.value = data.records || [];

        if (typeof rowIndex === "number" && rowIndex >= 0) {
          currentRow.value = dataList.value[rowIndex];
        } else {
          currentRow.value = {};
        }
      })
      .catch((err) => {
        loading.value = false;
      });
  };

  const onFresh = () => {
    const rowIndex = dataList.value.findIndex((item) => item.id === currentRow.value.id);
    onSearch(rowIndex);
    getColumnConfig();
  };

  const onTagSearch = (values) => {
    Object.assign(formData, values);
    formData.page = 1;
    onSearch();
  };

  // 新增分组
  const onAdd = () => {
    router.push({
      path: "/plmManage/basicData/bomMgmt/add",
      query: { type: "add", isNewTag: "yes", menuId: route.query.menuId }
    });
  };

  // 修改分组
  const onEdit = () => {
    if (JSON.stringify(currentRow.value) !== "{}") {
      if (currentRow.value.billState === 2) {
        message.warning("已审核的BOM不能直接修改");
        return;
      }
      router.push({
        path: `/plmManage/basicData/bomMgmt/edit`,
        query: {
          id: currentRow.value.id,
          type: "edit",
          isNewTag: "yes",
          menuId: route.query.menuId,
          title: currentRow.value.number
        }
      });
      return;
    }
    message.warning("请选择一条记录");
  };

  // 删除分组
  const remove = () => {
    if (JSON.stringify(currentRow.value) !== "{}") {
      if (currentRow.value.billState === 2) {
        ElMessage({
          message: "已审核的BOM不能直接删除",
          type: "warning"
        });
        return;
      }
      ElMessageBox.confirm(`确认要删除名称为【${currentRow.value.name}】的BOM吗?`, "系统提示", {
        type: "warning",
        draggable: true,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          delBomTableData({ id: currentRow.value.id }).then((res) => {
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

  // 提交物料
  const businessAction = ({ text }) => {
    if (JSON.stringify(currentRow.value) !== "{}") {
      if (text === "履历") {
        router.push({
          path: `/plmManage/basicData/bomMgmt/history/index`,
          query: {
            id: currentRow.value.id,
            type: "view",
            isNewTag: "yes",
            menuId: route.query.menuId,
            title: currentRow.value.number
          }
        });
        return;
      }
      ElMessageBox.confirm(`确认要${text}名称为【${currentRow.value.name}】的BOM吗?`, "系统提示", {
        type: "warning",
        draggable: true,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          loading.value = true;
          let res: any;
          if (text === "禁用") {
            console.log("禁用");
            res = disabledBomData({ id: currentRow.value.id });
            // res = submitMaterialInfo({ id: currentRow.value.id });
          } else if (text === "反禁用") {
            res = unDisabledBomData({ id: currentRow.value.id });
          } else if (text === "下推") {
            res = pushDownBomData({ id: currentRow.value.id });
          } else if (text === "回退") {
            res = backBomData({ id: currentRow.value.id });
          } else if (text === "提交") {
            // res = submitBomData({ id: currentRow.value.id });
            res = commonSubmit({ billId: "10008", billNo: currentRow.value.billNo });
          } else if (text === "打印") {
            loading.value = false;
            router.push(`/plmManage/basicData/bomMgmt/print?id=${currentRow.value.id}&menuId=${route.query.menuId}`);
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
        excelName: "BOM管理",
        excelHeader: JSON.stringify(excelHeader)
      },
      ...formData,
      page: 1,
      limit: 100000
    };

    exportBomTableData(headConfig)
      .then((res: any) => {
        window.open("/api" + res.data, "_blank");
      })
      .catch((err) => {
        console.log("err", err);
      })
      .finally(() => (loading.value = false));
  };

  // 双击行
  const rowDbClick = (row) => {
    if (row.billState === 2) {
      router.push({
        path: `/plmManage/basicData/bomMgmt/view`,
        query: { id: row.id, type: "view", isNewTag: "yes", menuId: route.query.menuId, title: row.number }
      });
    } else if (row.billState === 0) {
      router.push({
        path: `/plmManage/basicData/bomMgmt/edit`,
        query: { id: row.id, type: "edit", state: row.billState, isNewTag: "yes", menuId: route.query.menuId, title: row.number }
      });
    }
  };

  // 点击表格行
  const rowClick = (row) => {
    currentRow.value = row;
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

  const rowStyle = ({ row, data }) => {
    if ((row?.disableStatus || data?.disableStatus) === 1) {
      return { color: "red" };
    }
  };

  function onSwitchTable() {
    isAgTable.value = !isAgTable.value;
    currentRow.value = undefined;
  }

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "新增", isDropDown: false },
    { clickHandler: onEdit, type: "warning", text: "修改", isDropDown: false },
    { clickHandler: remove, type: "delete", text: "删除", isDropDown: false },
    { clickHandler: onExport, type: "primary", text: "导出", isDropDown: true },
    { clickHandler: businessAction, type: "primary", text: "提交", isDropDown: true },
    { clickHandler: businessAction, type: "primary", text: "回退", isDropDown: true },
    { clickHandler: businessAction, type: "primary", text: "下推", isDropDown: true },
    { clickHandler: businessAction, type: "primary", text: "打印", isDropDown: true },
    { clickHandler: businessAction, type: "primary", text: "履历", isDropDown: true },
    { clickHandler: businessAction, type: "primary", text: "禁用", isDropDown: true },
    { clickHandler: businessAction, type: "primary", text: "反禁用", isDropDown: true }
  ]);

  return {
    isAgTable,
    columnDefs,
    loading,
    dataList,
    columns,
    pagination,
    curNodeName,
    maxHeight,
    buttonList,
    loadingStatus,
    searchOptions,
    categoryTreeData,
    menuItems,
    contextMenuRef,
    rowStyle,
    onFresh,
    rowClick,
    rowDbClick,
    onTagSearch,
    handleNodeClick,
    handleSizeChange,
    handleCurrentChange,
    onSwitchTable
  };
}
