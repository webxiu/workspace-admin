/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-10 09:04:01
 */

import {
  DeptInfoItemType,
  MenuTreeItemType,
  copyAuthority,
  getBtnListByMenuId,
  getDeptTreeList,
  menuTree,
  saveAuthority,
  userInfoAdd,
  userInfoUpdate
} from "@/api/systemManage";
import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { h, nextTick, onMounted, reactive, ref } from "vue";
import { message, showMessageBox, wrapFn } from "@/utils/message";

import EditForm from "@/components/EditForm/index.vue";
import { ElTree } from "element-plus";
import type { TreeKey } from "element-plus/es/components/tree/src/tree.type";
import { addDialog } from "@/components/ReDialog";
import addModal from "../addModal.vue";
import { formConfigs } from "./config";
import { handleTree } from "@/utils/tree";
import { useEleHeight } from "@/hooks";

export const useConfig = () => {
  const loading = ref<boolean>(false);
  const loading2 = ref<boolean>(false);
  const columns = ref<TableColumnList[]>([]);
  const dataList = ref<DeptInfoItemType[]>([]);
  const rowData = ref<DeptInfoItemType>();
  const treeRef = ref<InstanceType<typeof ElTree>>();
  const expandAll = ref<boolean>(false);
  const selectKeys = ref<TreeKey[]>([]);
  const allKeys = ref<TreeKey[]>([]);
  const random = ref<number>(0);
  const rightTableRef = ref();
  const currentMenuId = ref("");
  const dataSource = ref<MenuTreeItemType[]>([]);
  const dataSourceStatic = ref<MenuTreeItemType[]>([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 40);

  onMounted(() => {
    getColumnConfig();
    getTableList();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "部门名称", prop: "deptName", minWidth: 200 },
      { label: "角色编号", prop: "roleCode", align: "right" },
      { label: "角色名称", prop: "roleName" },
      { label: "说明", prop: "remark" }
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, isCustomExpend: true, dragSelector: ".role-authority", operationColumn: { width: 100 } });
  };

  const onRefresh = () => {
    getColumnConfig();
    getTableList();
  };

  // 1.获取部门列表
  const getTableList = () => {
    loading.value = true;
    getDeptTreeList()
      .then((res) => {
        loading.value = false;
        const result = handleTree(res.data, "itemId", "parentId", "children");
        dataList.value = result;
      })
      .catch((err) => (loading.value = false));
  };

  /** 复制权限 */
  const onCopy = (row: DeptInfoItemType) => {
    openDialog(row);
  };

  /** 选中表格行 */
  const onRowClick = (row: DeptInfoItemType) => {
    rowData.value = row;
    if (!row?.roleCode) return message("角色编号不存在", { type: "warning" });
    getAuthorityTree(row.id);
    // 清空右侧按钮表格的数据
    if (rightTableRef.value) rightTableRef.value.dataList = [];
  };

  /** 复制权限弹窗 */
  function openDialog(row: Partial<DeptInfoItemType>) {
    const title = `复制【${row.deptName}】的角色权限给目标角色`;
    const formRef = ref();
    addDialog({
      title: `${title}用户`,
      props: { dataList: dataList },
      width: "60%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(addModal, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        showMessageBox(`确认要提交吗?`).then(() => {
          copyAuthority({ roleid: row.id, copyToRoleid: FormRef.id })
            .then((res) => {
              if (res.data) {
                done();
                getTableList();
                message(`${title}成功`);
              }
            })
            .catch(console.log);
        });
      }
    });
  }

  // 2.获取权限树列表
  const getAuthorityTree = (id: number) => {
    loading2.value = true;
    menuTree({ id })
      .then((res) => {
        loading2.value = false;
        dataSource.value = res.data;
        dataSourceStatic.value = res.data;
        const keyObj = getKeys(res.data, "default");
        allKeys.value = keyObj.allKeys;
        selectKeys.value = keyObj.keys;
        treeRef.value!.setCheckedKeys(keyObj.keys, false);
      })
      .catch(() => (loading2.value = false));
  };

  /**
   * 获取菜单key
   * @param arr 菜单数组
   * @param type 0:未选中  1:选中: 2: 半选
   */
  const getKeys = (menuList: MenuTreeItemType[], type: "all" | "default") => {
    const keys: string[] = [];
    const allKeys: string[] = [];
    const fn = (arr: MenuTreeItemType[], type) => {
      arr.forEach((item) => {
        allKeys.push(item.id);
        if (type === "default") {
          if (item.checkArr === "1") keys.push(item.id);
        } else if (type === "all") {
          keys.push(item.id);
        }
        if (item.children?.length) fn(item.children, type);
      });
    };
    fn(menuList, type);
    return { keys, allKeys };
  };

  /** 设置选中key */
  const setCheckKeys = (type) => {
    const keyObj = getKeys(dataSource.value, type);
    selectKeys.value = keyObj.keys;
    treeRef.value!.setCheckedKeys(keyObj.keys, false);
  };

  /** 获取选中权限的菜单ID和按钮ID */
  function getRoleMenusAndBtns(data: MenuTreeItemType[]) {
    const treeObj = { menuIdList: [], btnIdList: [] };
    for (let i = 0; i < data.length; i++) {
      const idStr = data[i].id;
      if (idStr.substring(0, 1) == "m") {
        treeObj.menuIdList.push(idStr.substring(1));
      }
    }
    treeObj.btnIdList = rightTableRef.value.selectedRows?.map((item) => item.id);
    return treeObj;
  }

  /** 获取选中节点 */
  const onCheck = (data, node) => {
    const checkedKeys = node.checkedKeys;
    selectKeys.value = checkedKeys;
  };

  /** 手动点击checkbox */
  const selectHandle = (data, isSelected) => {
    setTimeout(() => {
      if (isSelected) {
        rightTableRef.value.menuBtnRef?.getTableRef()?.toggleAllSelection();
      } else {
        rightTableRef.value.menuBtnRef?.getTableRef()?.clearSelection();
      }
    });
  };

  /** 点击节点 */
  const nodeClick = (data, node) => {
    currentMenuId.value = data.id.split("m")[1];
    if (!data.children) {
      rightTableRef.value.loading = true;
      const elTableRef = rightTableRef.value.menuBtnRef?.getTableRef();
      getBtnListByMenuId({ menuId: data.id.split("m")[1], roleId: rowData.value.id })
        .then((res) => {
          if (res.data) {
            rightTableRef.value.dataList = res.data;
            rightTableRef.value.dataList.forEach((item) => {
              if (item.hasRight) {
                setTimeout(() => {
                  elTableRef.toggleRowSelection(item, true);
                });
              }
            });
          }
        })
        .finally(() => (rightTableRef.value.loading = false));
    }
  };

  /** 保存 */
  const onSave = wrapFn(rowData, () => {
    const selectRows = treeRef.value.getCheckedNodes(false, true) as MenuTreeItemType[];
    const result = getRoleMenusAndBtns(selectRows);
    const params = { roleid: rowData.value.id, ...result, menuId: currentMenuId.value };
    saveAuthority(params).then((res) => {
      if (res.data) {
        message("保存成功");
      } else {
        message("保存失败", { type: "error" });
      }
    });
  });

  /** 展开 */
  const onOpen = wrapFn(rowData, () => {
    expandAll.value = true;
    random.value = Date.now();
    nextTick(() => {
      treeRef.value!.setCheckedKeys(selectKeys.value, false);
    });
  });

  /** 收起 */
  const onClose = wrapFn(rowData, () => {
    expandAll.value = false;
    random.value = Date.now();
    nextTick(() => {
      treeRef.value!.setCheckedKeys(selectKeys.value, false);
    });
  });

  /** 全选 */
  const onSelectAll = wrapFn(rowData, () => {
    setCheckKeys("all");
  });

  /** 全不选 */
  const onRemoveAll = wrapFn(rowData, () => {
    treeRef.value!.setCheckedKeys([], false);
  });

  /** 刷新 */
  const onReflesh = wrapFn(rowData, () => {
    dataSource.value = dataSourceStatic.value;
    setCheckKeys("default");
  });

  /** 查询 */
  const onSearch = wrapFn(rowData, () => {
    openDialog2();
  });

  const searchNodes = (menuList: MenuTreeItemType[], title: string) => {
    const tempMenus: MenuTreeItemType[] = [];
    const fn = (arr: MenuTreeItemType[], title: string) => {
      arr.forEach((item) => {
        if (item.title.indexOf(title.trim()) > -1) {
          tempMenus.push(item);
        }
        if (item.children?.length) fn(item.children, title);
      });
    };
    fn(menuList, title);
    return tempMenus;
  };

  /** 复制权限弹窗 */
  function openDialog2() {
    const formRef = ref();
    const _formData = reactive({ title: "" });
    addDialog({
      title: "查询节点",
      props: {
        formInline: _formData,
        formConfigs: formConfigs()
      },
      width: "460px",
      draggable: true,
      fullscreenIcon: false,
      closeOnClickModal: false,
      showResetButton: true,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeReset: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.resetFields();
      },
      beforeSure: (done, { options }) => {
        if (_formData.title) {
          const filterTree = searchNodes(dataSourceStatic.value, _formData.title);
          dataSource.value = filterTree;
        } else {
          dataSource.value = dataSourceStatic.value;
        }
      }
    });
  }

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onSave, type: "primary", text: "保存", isDropDown: false },
    { clickHandler: onOpen, type: "default", text: "展开", isDropDown: true },
    { clickHandler: onClose, type: "default", text: "收起", isDropDown: true },
    { clickHandler: onSelectAll, type: "default", text: "全选", isDropDown: true },
    { clickHandler: onRemoveAll, type: "default", text: "全不选", isDropDown: true },
    { clickHandler: onReflesh, type: "default", text: "刷新", isDropDown: true },
    { clickHandler: onSearch, type: "default", text: "查询", isDropDown: true }
  ]);

  return {
    loading,
    loading2,
    columns,
    dataList,
    rightTableRef,
    random,
    expandAll,
    maxHeight,
    dataSource,
    treeRef,
    buttonList,
    onCheck,
    onRefresh,
    nodeClick,
    selectHandle,
    onCopy,
    onRowClick
  };
};
