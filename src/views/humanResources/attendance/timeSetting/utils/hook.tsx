/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2025-03-12 15:28:52
 */

import { TimeSettingItemType, addTimeSetting, deleteTimeSetting, timeSettingList, updateTimeSetting } from "@/api/oaManage/humanResources";
import { downloadDataToExcel, getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { h, onMounted, reactive, ref } from "vue";
import { message, showMessageBox } from "@/utils/message";

import type { ColDef } from "ag-grid-community";
import { CustomPropsType } from "@/utils/form";
import TableEditList from "@/components/TableEditList/index.vue";
import { addDialog } from "@/components/ReDialog";
import { getAgGridColumns } from "@/components/AgGridTable/config";
import { useEleHeight } from "@/hooks";

export const useConfig = () => {
  const isAgTable = ref(true);
  const columnDefs = ref<ColDef[]>([]);
  const columns = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref<TimeSettingItemType[]>([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 50);
  const formData = reactive({ limit: 10000, page: 1 });

  onMounted(() => {
    getColumnConfig();
    getTableList();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "规则编号", prop: "ruleNo" },
      { label: "上午上班时间", prop: "forenoonStart" },
      { label: "上午上班最早打卡时间", prop: "minForenoonStart", minWidth: 180 },
      { label: "上午上班最晚打卡时间", prop: "maxForenoonStart", minWidth: 180 },
      { label: "上午下班时间", prop: "forenoonEnd" },
      { label: "上午下班最早打卡时间", prop: "minForenoonEnd", minWidth: 180 },
      { label: "上午下班最晚打卡时间", prop: "maxForenoonEnd", minWidth: 180 },
      { label: "下午上班时间", prop: "afternoonStart" },
      { label: "下午上班最早打卡时间", prop: "minAfternoonStart", minWidth: 180 },
      { label: "下午上班最晚打卡时间", prop: "maxAfternoonStart", minWidth: 180 },
      { label: "下午下班时间", prop: "afternoonEnd" },
      { label: "下午下班最早打卡时间", prop: "minAfternoonEnd", minWidth: 180 },
      { label: "下午下班最晚打卡时间", prop: "maxAfternoonEnd", minWidth: 180 },
      { label: "备注", prop: "remark" }
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: { minWidth: 180 } });
    columnDefs.value = getAgGridColumns<TimeSettingItemType>({
      columnData,
      operationColumn: { minWidth: 180 },
      renderButtons: () => {
        return [
          { name: "修改", type: "default", onClick: (row) => onEdit(row) },
          { name: "删除", type: "danger", onClick: (row) => onDelete(row), confirm: (row) => `确定删除\n【${row.remark}】的工作时间吗？` }
        ];
      }
    });
  };

  const onRefresh = () => getTableList();

  const getTableList = () => {
    loading.value = true;
    timeSettingList(formData)
      .then((res) => {
        loading.value = false;
        dataList.value = res.data;
      })
      .catch((err) => (loading.value = false));
  };

  const onAdd = () => {
    openDialog("add");
  };

  const onEdit = (row: TimeSettingItemType) => {
    openDialog("edit", row);
  };

  async function openDialog(type: "add" | "edit", row?: Partial<TimeSettingItemType>) {
    const title = { add: "新增", edit: "修改" }[type];
    const formRef = ref();
    const titleName = row?.remark ? `${title}【${row.remark}】工作时间` : `${title}工作时间`;
    const formData = reactive({
      ruleNo: row?.ruleNo ?? "",
      remark: row?.remark ?? "",
      forenoonStart: row?.forenoonStart ?? "",
      minForenoonStart: row?.minForenoonStart ?? "",
      maxForenoonStart: row?.maxForenoonStart ?? "",
      forenoonEnd: row?.forenoonEnd ?? "",
      minForenoonEnd: row?.minForenoonEnd ?? "",
      maxForenoonEnd: row?.maxForenoonEnd ?? "",
      afternoonStart: row?.afternoonStart ?? "",
      minAfternoonStart: row?.minAfternoonStart ?? "",
      maxAfternoonStart: row?.maxAfternoonStart ?? "",
      afternoonEnd: row?.afternoonEnd ?? "",
      minAfternoonEnd: row?.minAfternoonEnd ?? "",
      maxAfternoonEnd: row?.maxAfternoonEnd ?? "",
      minLeaveDuration: row?.minLeaveDuration ?? 0,
      workingHours: row?.workingHours ?? 0,
      leaveDurationMultiple: row?.leaveDurationMultiple ?? 0,
      id: row?.id ?? ""
    });
    const customProps = reactive<{ [key: string]: CustomPropsType }>({
      minLeaveDuration: { controls: false },
      leaveDurationMultiple: { controls: false }
    });

    addDialog({
      title: titleName,
      props: {
        params: { groupCode: "1" },
        formConfig: [{ formData: formData, customProps, formProps: { labelWidth: "170px" } }]
      },
      width: "960px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      showResetButton: true,
      beforeReset: () => formRef.value.resetRef(),
      contentRenderer: () => h(TableEditList, { ref: formRef }),
      beforeSure: (done, { options }) => {
        formRef.value.getRef().then(({ valid, data }) => {
          // const _formData = data.forms[0];
          if (valid) {
            showMessageBox(`确认${title}吗?`).then(() => {
              const API = { add: addTimeSetting, edit: updateTimeSetting };
              API[type](formData)
                .then((res) => {
                  if (res.data) {
                    done();
                    getTableList();
                    message.success(`${title}成功`);
                  } else {
                    message.error(`${title}失败`);
                  }
                })
                .catch(console.log);
            });
          }
        });
      }
    });
  }

  const rowDbClick = (row) => {
    onEdit(row);
  };

  const onDelete = (row: TimeSettingItemType) => {
    deleteTimeSetting({ id: row.id })
      .then((res) => {
        if (res.data) {
          message.success("删除成功");
          getTableList();
        } else {
          message.error("删除失败");
        }
      })
      .catch(console.log);
  };

  const onExport = () => {
    downloadDataToExcel({
      dataList: dataList.value,
      columns: columns.value,
      sheetName: "工作时间设定"
    });
  };
  function onSwitchTable() {
    isAgTable.value = !isAgTable.value;
  }
  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "新增", isDropDown: false },
    { clickHandler: onExport, type: "default", text: "导出", isDropDown: true }
  ]);

  return {
    columnDefs,
    isAgTable,
    columns,
    dataList,
    loading,
    maxHeight,
    buttonList,
    onRefresh,
    onEdit,
    onDelete,
    rowDbClick,
    onSwitchTable
  };
};
