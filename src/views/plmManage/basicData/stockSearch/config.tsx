/*
 * @Author: Hailen
 * @Date: 2023-07-06 14:57:33
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-02-23 18:22:13
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
  backMaterialInfo,
  delMaterialInfo,
  disabledMaterialInfo,
  enableMaterialInfo,
  exportStockList,
  fetchStockList,
  pushDownMaterialInfo,
  submitMaterialInfo
} from "@/api/plmManage";
import { useRouter } from "vue-router";
import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { PAGE_CONFIG } from "@/config/constant";

export interface QueryType {
  page: number;
  limit: number;
  staffId?: string;
  staffName?: string;
  deptId?: number;
  groupId?: number;
}

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
  stockNoLineName: "",
  stock: "",
  stockName: "",
  groupIdList: []
});

export const getConfig = async (buttonList) => {
  const columnsDrag: TableColumnList[] = [
    { label: "序号", prop: "index" },
    { label: "物料编码", prop: "fmaterialnumber" },
    { label: "物料名称", prop: "fmaterialname" },
    { label: "规格型号", prop: "fspecification" },
    { label: "仓库名称", prop: "fstockname" },
    { label: "批号", prop: "flotnumber" },
    { label: "库存主单位", prop: "funitname" },
    { label: "库存量", prop: "fbaseqty" }
  ];

  let columns: TableColumnList[] = [
    { label: "序号", type: "index", width: 65, fixed: true, cellRenderer: ({ $index }) => <span>{(formData.page - 1) * formData.limit + $index + 1}</span> },
    { label: "物料编码", fixed: true, prop: (index) => columnsDragDom.value[index].prop as string, minWidth: 200 },
    { label: "物料名称", prop: (index) => columnsDragDom.value[index].prop as string, minWidth: 240, fixed: true },
    { label: "规格型号", prop: (index) => columnsDragDom.value[index].prop as string, minWidth: 260 },

    { label: "仓库名称", prop: (index) => columnsDragDom.value[index].prop as string, minWidth: 120 },
    { label: "批号", prop: (index) => columnsDragDom.value[index].prop as string, minWidth: 120 },
    { label: "库存主单位", prop: (index) => columnsDragDom.value[index].prop as string, minWidth: 120 },
    { label: "库存量", prop: (index) => columnsDragDom.value[index].prop as string, minWidth: 120 }
  ];

  const { columnArrs, buttonArrs } = await getMenuColumns();
  const [menuCols] = columnArrs;

  if (menuCols?.length) {
    columns = setColumn({ columnData: menuCols, indexColumn: { fixed: true }, radioColumn: { fixed: true }, operationColumn: false });
  }

  updateButtonList(buttonList, buttonArrs[0]);

  columnsDragDom.value = columnsDrag;
  return columns;
};

export function useTable() {
  const formRef = ref();
  const currentRow: any = ref({});
  const curNodeName = ref("0");
  const curNodeLabel = ref();
  const depGroupTree = ref<DepGroupItemTree[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref<TeamMemberItemType[]>([]);
  const columns = ref<TableColumnList[]>([]);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 40 + 54);

  const router = useRouter();

  onMounted(async () => {
    columns.value = await getConfig(buttonList);

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

    formData.groupIdList = treeItem.id !== "0" ? finalArr : [];

    onSearch();
  };

  /**
   * 获取部门人员列表
   * @param type 请求类型 (all:表单搜索请求, single: 点击左侧菜单请求)
   */
  const onSearch = () => {
    // 处理时间范围
    const { stockNoLineName = "" } = formData;
    if (stockNoLineName) {
      const [fnumber, fname] = stockNoLineName.split("-").map((item) => item.trim());
      formData.stock = fnumber;
      formData.stockName = fname;
    }

    loading.value = true;
    fetchStockList(formData)
      .then((res: any) => {
        const { total, records } = res.data;
        loading.value = false;
        pagination.total = total;
        dataList.value = records || [];
      })
      .catch((err) => {
        loading.value = false;
      });
  };

  const onFresh = () => {
    currentRow.value = {};
    getConfig(buttonList);
    onSearch();
  };

  const handleTagSearch = (values) => {
    console.log(values, "values");
    // formData.staffId = values.staffId;
    // Object.keys(values).forEach((el) => {
    //   formData[el] = values[el];
    // });
    formData = { ...values, page: 1, limit: PAGE_CONFIG.pageSize };
    console.log(formData, "准备发送请求");

    // console.log(formData,'')
    // console.log(values, "values");
    // formData.staffName = values.staffName;
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
    router.push(`/plm/bd/materialAdd?number=${curNodeName.value}&code=${curNodeLabel.value}`);
  };

  // 修改分组
  const onEdit = () => {
    if (JSON.stringify(currentRow.value) !== "{}") {
      router.push(`/plm/bd/materialAdd?id=${currentRow.value.id}`);
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
      ElMessageBox.confirm(`确认要删除名称为【${currentRow.value.name}】的物料吗?`, "系统提示", {
        type: "warning",
        draggable: true,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          delMaterialInfo({ id: currentRow.value.id }).then((res) => {
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
      ElMessageBox.confirm(`确认要${text}名称为【${currentRow.value.name}】的物料吗?`, "系统提示", {
        type: "warning",
        draggable: true,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          let res: any;
          if (text === "提交") {
            res = submitMaterialInfo({ id: currentRow.value.id });
          } else if (text === "回退") {
            res = backMaterialInfo({ id: currentRow.value.id });
          } else if (text === "下推") {
            res = pushDownMaterialInfo({ id: currentRow.value.id });
          } else if (text === "冻结") {
            res = disabledMaterialInfo({ id: currentRow.value.id });
          } else if (text === "启用") {
            res = enableMaterialInfo({ id: currentRow.value.id });
          }
          res.then((res) => {
            if (res.data) {
              message(`操作成功`, { type: "success" });
              onSearch();
            }
          });
        })
        .catch(() => {});
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
        excelName: "库存查询",
        excelHeader: JSON.stringify(excelHeader)
      },
      ...formData,
      page: 1,
      limit: 100000
    };

    exportStockList(headConfig)
      .then((res: any) => {
        window.open("/api" + res.data, "_blank");
      })
      .catch((err) => {
        console.log("err", err);
      })
      .finally(() => (loading.value = false));
  };

  const clickHandler = ({ text }) => {
    if (text === "导出") {
      onExport();
    }
  };

  const buttonList = ref<ButtonItemType[]>([{ clickHandler, type: "primary", text: "导出", isDropDown: true }]);

  return {
    depGroupTree,
    dataList,
    columns,
    formData,
    loading,
    pagination,
    maxHeight,
    onAdd,
    onEdit,
    remove,
    businessAction,
    onSearch,
    onFresh,
    resetForm,
    onNodeClick,
    rowClick,
    buttonList,
    onExport,
    handleSizeChange,
    handleTagSearch,
    handleCurrentChange,
    handleNodeClick,
    curNodeName
  };
}
