import { ChatRound, Download, Plus, Printer, Refresh, RefreshRight, Right, Setting } from "@element-plus/icons-vue";

import { ref } from "vue";
import { useConfig } from "../../staffInfo/utils/hook";

export const useConfig2 = () => {
  const {
    columnDefs,
    isAgTable,
    tableRef,
    loading,
    columns,
    dataList,
    maxHeight,
    pagination,
    treeOptions,
    treeLoading,
    queryParams,
    searchOptions,
    onAdd,
    onPrint,
    onDismiss,
    onExport,
    onSyncMachine,
    onUpdateStandard,
    onSetKingdeeAccount,
    onSetQYWXAccount,
    onEdit,
    onDelete,
    onSearch,
    onDbClick,
    onRowClick,
    onTagSearch,
    onNodeClick,
    onSizeChange,
    onCurrentChange,
    onSelect,
    onSelectAll,
    onSwitchTable
  } = useConfig(1);

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "新增", icon: Plus, isDropDown: false },
    { clickHandler: onPrint, type: "default", text: "打印", icon: Printer, isDropDown: true },
    { clickHandler: onDismiss, type: "default", text: "离职", icon: Right, isDropDown: true },
    { clickHandler: onExport, type: "default", text: "导出", icon: Download, isDropDown: true },
    { clickHandler: onSyncMachine, type: "default", text: "同步考勤机", icon: Refresh, isDropDown: true },
    { clickHandler: onUpdateStandard, type: "default", text: "更新核算标准", icon: RefreshRight, isDropDown: true },
    { clickHandler: onSetKingdeeAccount, type: "default", text: "设置金蝶账号", icon: Setting, isDropDown: true },
    { clickHandler: onSetQYWXAccount, type: "default", text: "设置企业微信账号", icon: ChatRound, isDropDown: true }
  ]);

  return {
    columnDefs,
    isAgTable,
    tableRef,
    loading,
    columns,
    dataList,
    maxHeight,
    pagination,
    treeOptions,
    treeLoading,
    buttonList,
    queryParams,
    searchOptions,
    onEdit,
    onDelete,
    onSearch,
    onRowClick,
    onDbClick,
    onTagSearch,
    onSelect,
    onSelectAll,
    onNodeClick,
    onSizeChange,
    onCurrentChange,
    onSwitchTable
  };
};
