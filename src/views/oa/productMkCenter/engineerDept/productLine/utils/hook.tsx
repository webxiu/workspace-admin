/*
 * @Author: Hailen
 * @Date: 2024-06-17 17:26:03
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-07-18 14:45:12
 */

import { ProductLineItemType, productLineList } from "@/api/oaManage/productMkCenter";
import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { h, onMounted, ref } from "vue";

import DistributeModal from "../DistributeModal.vue";
import { Position } from "@element-plus/icons-vue";
import { addDialog } from "@/components/ReDialog";
import { message } from "@/utils/message";
import { useEleHeight } from "@/hooks";

export const useConfig = () => {
  const loading = ref<boolean>(false);
  const rowData = ref<ProductLineItemType>();
  const columns = ref<TableColumnList[]>([]);
  const dataList = ref<ProductLineItemType[]>([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 56);

  onMounted(() => {
    getColumnConfig();
    getTableList();
  });

  const getTableList = () => {
    productLineList({})
      .then(({ data }) => (dataList.value = data || []))
      .catch(console.log);
  };

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "生产线", prop: "productionLineName" },
      { label: "作业指导书", prop: "manualName" },
      { label: "分发人", prop: "distributeUserName", width: 120 },
      { label: "分发时间", prop: "distributeTime", width: 160 }
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: { width: 120 } });
  };

  const onRefresh = () => {
    getColumnConfig();
    getTableList();
  };

  function onOpenDialog() {
    onDistribute(rowData.value);
  }

  function onDistribute(row: ProductLineItemType) {
    if (!row) return message("请选择一条记录", { type: "error" });
    const formRef = ref();
    addDialog({
      title: "指导书分发",
      props: { productionLine: row.productionLine, lineName: row.productionLineName },
      width: "95%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      okButtonText: "分发并关闭",
      resetButtonText: "分发",
      showResetButton: true,
      beforeReset: () => {
        formRef.value.getRef(() => getTableList());
      },
      contentRenderer: () => h(DistributeModal, { ref: formRef }),
      beforeSure: (done) => {
        formRef.value.getRef(() => {
          done();
          getTableList();
        });
      }
    });
  }

  function onRowClick(row: ProductLineItemType) {
    rowData.value = row;
  }
  function onDbClick(row: ProductLineItemType) {
    onDistribute(row);
  }

  const buttonList = ref<ButtonItemType[]>([{ clickHandler: onOpenDialog, type: "primary", icon: Position, text: "分发", isDropDown: false }]);

  return {
    loading,
    columns,
    dataList,
    maxHeight,
    buttonList,
    onRefresh,
    onDbClick,
    onRowClick,
    onDistribute
  };
};
