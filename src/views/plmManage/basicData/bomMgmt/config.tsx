/*
 * @Author: Hailen
 * @Date: 2023-07-06 14:57:33
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-21 17:25:00
 */

import { h, onMounted, reactive, ref } from "vue";
import { TeamMemberItemType, addDepGroup, editDepGroup, updateDepGroup } from "@/api/workbench/teamManage";

import { message } from "@/utils/message";
import { type PaginationProps } from "@pureadmin/table";
import { addDialog } from "@/components/ReDialog";
import { ElMessage, ElMessageBox } from "element-plus";
import { getUserInfo } from "@/utils/storage";
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
let formData = reactive({
  page: 1,
  limit: PAGE_CONFIG.pageSize,
  groupIdList: []
});

export const getConfig = async (buttonList) => {
  const columnsDrag: TableColumnList[] = [
    { label: "选择" },
    { label: "序号", prop: "index" },
    { label: "BOM编号", prop: "number" },
    { label: "BOM名称", prop: "name" },
    { label: "BOM分组", prop: "groupName" },
    { label: "父级物料编码", prop: "materialNumber" },
    { label: "父级物料名称", prop: "materialName" },
    { label: "父级物料规格", prop: "specification" },
    { label: "审核状态", prop: "stateName" },
    { label: "下推状态", prop: "pushName" },
    { label: "禁用状态", prop: "disableStatus" },
    { label: "禁用人", prop: "disableUserName" },
    { label: "禁用时间", prop: "disableDate" },
    { label: "创建人", prop: "createUserName" },
    { label: "创建时间", prop: "createDate" },
    { label: "最后修改人", prop: "modifyUserName" },
    { label: "最后修改时间", prop: "modifyDate" }
  ];

  let columns: TableColumnList[] = [
    { label: "", align: "center", width: 62, fixed: true, cellRenderer: () => <el-radio label="&nbsp;" size="small" /> },
    { label: "序号", type: "index", width: 65, fixed: true, cellRenderer: ({ $index }) => <span>{(formData.page - 1) * formData.limit + $index + 1}</span> },
    { label: "BOM编号", fixed: true, prop: (index) => columnsDragDom.value[index].prop as string, minWidth: 200 },
    { label: "BOM名称", prop: (index) => columnsDragDom.value[index].prop as string, minWidth: 240, fixed: true },
    { label: "BOM分组", prop: (index) => columnsDragDom.value[index].prop as string, minWidth: 120 },
    { label: "父级物料编码", prop: (index) => columnsDragDom.value[index].prop as string, minWidth: 120 },
    { label: "父级物料名称", prop: (index) => columnsDragDom.value[index].prop as string, minWidth: 120 },
    { label: "父级物料规格", prop: (index) => columnsDragDom.value[index].prop as string, minWidth: 120 },
    { label: "审核状态", prop: (index) => columnsDragDom.value[index].prop as string, minWidth: 120 },
    { label: "下推状态", slot: "pushState", prop: (index) => columnsDragDom.value[index].prop as string, minWidth: 120 },
    { label: "禁用状态", slot: "disableStatus", prop: (index) => columnsDragDom.value[index].prop as string, minWidth: 120 },
    { label: "禁用人", prop: (index) => columnsDragDom.value[index].prop as string, minWidth: 120 },
    { label: "禁用时间", slot: "disableDate", prop: (index) => columnsDragDom.value[index].prop as string, minWidth: 220 },
    { label: "创建人", prop: (index) => columnsDragDom.value[index].prop as string, minWidth: 120 },
    { label: "创建时间", prop: (index) => columnsDragDom.value[index].prop as string, minWidth: 220 },
    { label: "最后修改人", prop: (index) => columnsDragDom.value[index].prop as string, minWidth: 120 },
    { label: "最后修改时间", prop: (index) => columnsDragDom.value[index].prop as string, minWidth: 220 }
  ];

  columnsDragDom.value = columnsDrag;

  const { columnArrs, buttonArrs } = await getMenuColumns();
  const [menuCols] = columnArrs;

  if (menuCols?.length) {
    columns = setColumn({ columnData: menuCols, indexColumn: { fixed: true }, radioColumn: { fixed: true }, operationColumn: false });
  }

  updateButtonList(buttonList, buttonArrs[0]);

  return columns;
};

export function useTable(contextMenuRef) {
  const formRef = ref();
  const currentRow: any = ref({});
  const curNodeName = ref("0");
  const curNodeLabel = ref();
  const depGroupTree = ref<DepGroupItemTree[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref<TeamMemberItemType[]>([]);
  const columns = ref<TableColumnList[]>([]);
  const categoryTreeData = ref([]);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 40 + 54);

  const router = useRouter();
  const route = useRoute();

  const fetchLeftData = () => {
    console.log("left fetch");
    fetchBomLeftTreeData({}).then((res: any) => {
      categoryTreeData.value = res.data.bomGroupSelectTree;
      contextMenuRef.value.treeSelectData = res.data.bomGroupSelectTree;
    });
  };

  onMounted(async () => {
    columns.value = await getConfig(buttonList);
    fetchLeftData();
    onSearch();
  });

  const handleNodeClick = (treeItem) => {
    curNodeName.value = treeItem.id;
    curNodeLabel.value = treeItem.id;
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

    formData.groupIdList = finalArr;
    onSearch();

    console.log(finalArr, "ids");
  };

  /**
   * 获取部门人员列表
   * @param type 请求类型 (all:表单搜索请求, single: 点击左侧菜单请求)
   */
  const onSearch = (rowIndex?) => {
    // 处理时间范围
    // const { date = "" } = formData;
    // if (date) {
    //   const [startTime, endTime] = date.split("~").map((item) => item.trim());
    //   formData.startDate = startTime;
    //   formData.endDate = endTime;
    // }
    currentRow.value = {};
    console.log("右侧");
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
    getConfig(buttonList);
    const rowIndex = dataList.value.findIndex((item) => item.id === currentRow.value.id);
    onSearch(rowIndex);
  };

  const handleTagSearch = (values) => {
    console.log(values, "values");

    formData = { ...values, page: 1, limit: PAGE_CONFIG.pageSize };
    console.log(formData, "准备发送请求");

    onSearch();
  };

  const resetForm = (formEl) => {
    if (!formEl) return;
    formEl.resetFields();
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

  // 点击当前组节点
  const onNodeClick = (data: DepGroupItemTree) => {
    // if (!data.parentId) {
    //   formData.deptId = data.id;
    //   delete formData.groupId;
    // } else {
    //   formData.groupId = data.id;
    //   delete formData.deptId;
    // }
    // onSearch("single");
  };

  // 新增分组
  const onAdd = () => {
    router.push(`/plmManage/basicData/bomMgmt/add?type=add&isNewTag=yes&menuId=${route.query.menuId}`);
  };

  // 双击行
  const dblclick = (row) => {
    if (row.billState === 2) {
      router.push(`/plmManage/basicData/bomMgmt/view?id=${row.id}&type=view&isNewTag=yes&menuId=${route.query.menuId}`);
      return;
    }

    if (row.billState === 0) {
      router.push(`/plmManage/basicData/bomMgmt/edit?id=${row.id}&type=edit&state=${row.billState}&isNewTag=yes&menuId=${route.query.menuId}`);
      return;
    }
  };

  // 修改分组
  const onEdit = () => {
    if (JSON.stringify(currentRow.value) !== "{}") {
      if (currentRow.value.billState === 2) {
        ElMessage({
          message: "已审核的BOM不能直接修改",
          type: "warning"
        });
        return;
      }
      router.push(`/plmManage/basicData/bomMgmt/edit?id=${currentRow.value.id}&type=edit&isNewTag=yes&menuId=${route.query.menuId}`);
      return;
    }
    ElMessage({
      message: "请选择一条记录",
      type: "warning"
    });
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
    if (JSON.stringify(currentRow.value) !== "{}") {
      if (text === "履历") {
        router.push(`/plmManage/basicData/bomMgmt/history/index?id=${currentRow.value.id}&type=view&isNewTag=yes&menuId=${route.query.menuId}`);
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
    currentRow.value = row;
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

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "新增", isDropDown: false },
    { clickHandler: onEdit, type: "primary", text: "修改", isDropDown: false },
    { clickHandler: remove, type: "primary", text: "删除", isDropDown: false },
    { clickHandler: onExport, type: "primary", text: "导出", isDropDown: true },
    { clickHandler: businessAction, type: "primary", text: "提交", isDropDown: true },
    { clickHandler: businessAction, type: "primary", text: "回退", isDropDown: true },
    { clickHandler: businessAction, type: "primary", text: "下推", isDropDown: true },
    { clickHandler: businessAction, type: "primary", text: "打印", isDropDown: true },
    { clickHandler: businessAction, type: "primary", text: "履历", isDropDown: true },
    { clickHandler: businessAction, type: "primary", text: "禁用", isDropDown: true },
    { clickHandler: businessAction, type: "primary", text: "反禁用", isDropDown: true }
  ]);

  const rowStyle = ({ row }) => {
    if (row.disableStatus === 1) {
      return {
        color: "red"
      };
    }
  };

  return {
    depGroupTree,
    dataList,
    columns,
    formData,
    loading,
    pagination,
    maxHeight,
    rowStyle,
    onAdd,
    dblclick,
    onEdit,
    remove,
    businessAction,
    onSearch,
    onFresh,
    resetForm,
    fetchLeftData,
    buttonList,
    categoryTreeData,
    onNodeClick,
    rowClick,
    onExport,
    handleSizeChange,
    handleTagSearch,
    handleCurrentChange,
    handleNodeClick,
    curNodeName
  };
}
