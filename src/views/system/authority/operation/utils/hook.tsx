/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-08-21 14:55:07
 */

import { Delete, Plus } from "@element-plus/icons-vue";
import {
  OptAuthDeptTreeItemType,
  OptAuthItemType,
  OptAuthRoleItemType,
  optAuthDeptTree,
  optAuthList,
  optAuthRoleAdd,
  optAuthRoleDelete,
  optAuthRoleList
} from "@/api/systemManage";
import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { h, onMounted, ref } from "vue";
import { message, showMessageBox } from "@/utils/message";

import { addDialog } from "@/components/ReDialog";
import addModal from "../addModal.vue";
import { getChildIDs } from "@/utils/common";
import { handleTree } from "@/utils/tree";
import { useEleHeight } from "@/hooks";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const columns2 = ref<TableColumnList[]>([]);
  const dataList = ref<OptAuthItemType[]>([]);
  const dataList2 = ref<OptAuthRoleItemType[]>([]);
  const originData = ref<OptAuthItemType[]>([]);
  const loading = ref<boolean>(false);
  const loading2 = ref<boolean>(false);
  const rowData = ref<OptAuthItemType>();
  const rowsData2 = ref<OptAuthRoleItemType[]>([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49);
  const tableRef2 = ref();

  onMounted(() => {
    getColumnConfig();
    getTableList();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "项目名称", prop: "menuName", minWidth: 200 },
      { label: "项目编号", prop: "menuCode", align: "right", minWidth: 80 },
      { label: "项目ID", prop: "itemId", align: "right", minWidth: 80 },
      { label: "菜单类型", prop: "menuType", minWidth: 80 }
    ];
    let columnData2: TableColumnList[] = [
      { label: "角色名称", prop: "roleName" },
      { label: "部门", prop: "deptName" },
      { label: "角色编号", prop: "roleCode", align: "right" }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data, data2] = columnArrs;
    if (data?.length) columnData = data;
    if (data2?.length) columnData2 = data2;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, isCustomExpend: true, dragSelector: ".opt-auth", operationColumn: false });
    columns2.value = setColumn({
      columnData: columnData2,
      selectionColumn: { hide: false },
      radioColumn: false,
      operationColumn: false,
      dragSelector: ".opt-auth-role"
    });
  };

  const onRefresh = () => {
    getColumnConfig();
    getTableList();
  };

  const onRefresh2 = () => {
    getColumnConfig();
    getRoleList(rowData.value);
  };

  const getTableList = () => {
    loading.value = true;
    optAuthList()
      .then((res) => {
        loading.value = false;
        originData.value = res.data;
        dataList.value = handleTree(res.data, "menuCode", "parentCode");
      })
      .catch((err) => (loading.value = false));
  };

  // 获取右侧列表
  const onCurrentChange = (row: OptAuthItemType) => {
    if (!row) return;
    rowData.value = row;
    getRoleList(row);
  };

  // 获取右侧分组列表
  const getRoleList = (row: OptAuthItemType) => {
    if (!row) return;
    loading2.value = true;
    optAuthRoleList({ menuId: row.itemId, menuType: row.menuType, page: 1, limit: 10000 })
      .then(({ data }) => {
        loading2.value = false;
        dataList2.value = data || [];
      })
      .catch(() => (loading2.value = false));
  };

  const onRowClick2 = (row: OptAuthRoleItemType) => {
    // tableRef2.value?.getTableRef()?.toggleRowSelection(row);
  };

  // 新增角色
  const onAdd2 = () => {
    const row = rowData.value;
    if (!row) {
      return message("请先选择要操作的菜单", { type: "error" });
    } else if (row.menuType === "目录") {
      return message("目录不能更新角色权限，请选择菜单或者按钮", { type: "error" });
    }
    openDialog2();
  };

  // 删除单个
  const onDelete2 = (row: OptAuthRoleItemType) => {
    onDeleteAlls([row]);
  };

  // 批量删除
  const onDeleteAll2 = () => {
    const rows = rowsData2.value;
    const row = rowData.value;
    if (!row) {
      return message("请先选择要操作的菜单", { type: "error" });
    } else if (row.menuType === "目录") {
      return message("目录不能更新角色权限，请选择菜单或者按钮", { type: "error" });
    } else if (!rows.length) {
      return message("请选择角色", { type: "error" });
    }

    showMessageBox(`确认要删除吗?`).then(() => onDeleteAlls(rows));
  };

  // 提交批量删除
  const onDeleteAlls = (rows) => {
    const row = rowData.value;
    const menuIdList = [];
    const btnIdList: number[] = [];
    const roleIds = rows.map((item) => item.id);

    if (row.menuType === "菜单") {
      const childIds = getChildIDs<OptAuthItemType, number>(row.children, "itemId");
      btnIdList.push(...childIds);
      menuIdList.push(row.itemId);
    } else if (row.menuType === "按钮") {
      btnIdList.push(row.itemId);
    }
    const params = {
      roleIdList: roleIds,
      menuType: row.menuType,
      menuIdList: menuIdList,
      btnIdList: btnIdList
    };
    optAuthRoleDelete(params)
      .then((res) => {
        res.data && message("删除成功");
        getRoleList(rowData.value);
      })
      .catch(console.log);
  };

  // 多选角色
  const handleSelectionChange2 = (rows: OptAuthRoleItemType[]) => {
    rowsData2.value = rows;
  };

  //获取当前节点以及父节点id
  function getAllParentIDs(tableData: OptAuthItemType[], ids: number[]) {
    for (let i = 0; i < tableData.length; i++) {
      const item = tableData[i];
      if (item.itemId === ids[ids.length - 1]) {
        const currentId = item.parentId;
        if (currentId !== 0 && item.menuType !== "按钮") {
          ids.push(currentId);
          return getAllParentIDs(tableData, ids);
        } else {
          return ids;
        }
      }
    }
  }

  // 添加角色弹窗
  function openDialog2() {
    const modalRef = ref();
    const loading = ref<boolean>(true);
    const deptList = ref<OptAuthDeptTreeItemType[]>([]);

    // 获取部门列表
    optAuthDeptTree({ roleIdList: [] })
      .then(({ data }) => {
        loading.value = false;
        if (data?.length) {
          const selectedRoles = dataList2.value.map((item) => item.id);
          // 过滤出未添加过的角色
          const validRoleList = data.filter((item) => item.id && !selectedRoles.includes(item.id));
          deptList.value = validRoleList;
          // deptList.value = handleTree( data, "itemId", "parentId");
        }
      })
      .catch(() => (loading.value = false));

    addDialog({
      title: "添加角色",
      props: { loading: loading, dataList: deptList },
      width: "960px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(addModal, { ref: modalRef }),
      beforeSure: (done, { options }) => {
        const roleIds = modalRef.value.getRef();
        if (!roleIds.length) {
          return message("未选择角色或角色ID不存在", { type: "error" });
        }
        let btnIdList: number[] = [];
        let menuIdList = getAllParentIDs(originData.value, [rowData.value.itemId]);

        if (rowData.value.menuType === "菜单") {
          btnIdList = rowData.value.children?.map((item) => item.itemId) || [];
        } else if (rowData.value.menuType === "按钮") {
          const leftIds = menuIdList;
          btnIdList.push(leftIds[0]);
          leftIds.splice(0, 1);
          menuIdList = leftIds;
        }
        const params = {
          roleIdList: roleIds,
          menuId: rowData.value.itemId,
          menuType: rowData.value.menuType,
          menuIdList: menuIdList,
          btnIdList: btnIdList
        };
        showMessageBox(`确认要提交吗?`).then(() => {
          optAuthRoleAdd(params)
            .then((res) => {
              if (res.data) {
                done();
                getRoleList(rowData.value);
                message("添加成功");
              }
            })
            .catch(console.log);
        });
      }
    });
  }
  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd2, type: "primary", text: "新增", icon: Plus, isDropDown: false },
    { clickHandler: onDeleteAll2, type: "danger", text: "批量删除", icon: Delete, isDropDown: false }
  ]);

  return {
    loading,
    loading2,
    columns,
    columns2,
    dataList,
    dataList2,
    maxHeight,
    tableRef2,
    buttonList,
    onRefresh,
    onRefresh2,
    onRowClick2,
    onCurrentChange,
    handleSelectionChange2
  };
};
